/* =========================================================================
   Datenschicht
   Eine Schnittstelle, zwei Umsetzungen:
   - "db":   gemeinsamer Datenspeicher dieses Prototyps (live, mehrere Nutzer)
   - "demo": nur im Speicher, geladen aus daten/demo.json (nichts wird gesichert)
   Für APplus wird eine dritte Umsetzung geschrieben, die dieselben Methoden
   über Queries und Tabellen bedient. Der Rest der Anwendung ruft nur K.Store.

   Dokumente:
     modell/entwurf, modell/live      Konfigurationsmodell (Pflege / freigegeben)
     releases/v<N>                    Freigabe-Historie
     kunden/<id>, angebote/<nr>       Adressen, Angebote (Aufrufe im Angebot)
     einstellungen/allgemein          Firma, Vertrieb, Nummernkreis, Vorlage
     protokoll/<JJJJ-MM>              Änderungsprotokoll je Monat
     data/users/<id>/prefs            Favoriten je Nutzer
   ========================================================================= */
(function () {
  const K = window.KONF;
  const clone = o => JSON.parse(JSON.stringify(o));
  /** Vertriebsmitarbeiter aus APplus (z. B. PERSONAL bzw. Vertreter) */
  const vertriebAusZeile = z => {
    const n = {}; for (const [k, v] of Object.entries(z)) n[String(k).toLowerCase().replace(/[^a-z0-9]/g, "")] = v;
    const f = (...ks) => { for (const k of ks) if (n[k] != null && String(n[k]).trim()) return String(n[k]).trim(); return ""; };
    const nr = f("personal", "personalnr", "vertreter", "kuerzel", "mitarbeiter", "nr", "id");
    const name = f("name") || [f("vorname"), f("nachname")].filter(Boolean).join(" ") || f("suchname");
    return { id: "p" + String(nr || name).replace(/[^A-Za-z0-9_-]/g, ""), nr, name, tel: f("telefon", "tel", "durchwahl"), mail: f("email", "mail"), funktion: f("funktion", "abteilung", "position") };
  };
  const kundeAusZeile = z => {
    const n = {}; for (const [k, v] of Object.entries(z)) n[String(k).toLowerCase().replace(/[^a-z0-9]/g, "")] = v;
    const f = (...ks) => { for (const k of ks) if (n[k] != null && String(n[k]).trim()) return String(n[k]).trim(); return ""; };
    const nr = f("kundennr", "kundennummer", "kunde", "adresse", "nr", "id");
    return { id: "k" + (nr || Math.random().toString(36).slice(2, 8)).replace(/[^A-Za-z0-9_-]/g, ""), nr, firma: f("firma", "name", "kundenname", "name1", "suchname"), person: f("ansprechpartner", "kontakt", "person"),
      strasse: f("strasse", "str", "anschrift"), ort: f("ort") && f("plz") ? f("plz") + " " + f("ort") : f("ort", "plzort"), land: f("land") || "DE", mail: f("email", "mail"), tel: f("telefon", "tel"), notiz: "" };
  };
  const leer = () => ({ entwurf: null, live: null, kunden: [], angebote: [], einst: null, releases: [], protokoll: [], prefs: { favoriten: [] }, geladen: false });

  const Store = K.Store = {
    modus: "laden", db: null, user: null, uid: null, schreiben: true, S: leer(), hoerer: [],
    onChange(fn) { this.hoerer.push(fn); },
    _melde(was) { if (this.S.geladen && was !== "alles") this._lokalSichern(); for (const f of this.hoerer) try { f(was); } catch (e) { console.error(e); } },

    async init() {
      let db = null, user = null;
      try {
        if (window.claude && window.claude.use) [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      } catch (e) { db = null; }
      this.user = user;
      if (db) {
        this.db = db; this.modus = "db";
        try { this.uid = user ? await user.id() : null; } catch (e) { this.uid = null; }
        try { const c = user ? await user.can("data.write") : null; this.schreiben = c !== false; } catch (e) {}
        this._abonnieren();
        const ex = this._artikelAusExcel();
        if (ex && ex.length) { this.artikelSetzen(ex, "excel"); this._melde("artikel"); }
        else this.demoDaten().then(d => { this.artikelSetzen(d.artikel || [], "beispiel"); this._melde("artikel"); }).catch(() => {});
      } else {
        this.modus = "lokal";
        await this.ladeLokal();
      }
    },

    /* ---------- Betrieb ohne Claude (z. B. APplus): Browser-Speicher + APplus-Abfragen ---------- */
    _schluessel() { return (K.cfg && K.cfg.storageKey) || "konf-v1"; },
    /** Abfragenamen: aus KONF_CONFIG, überschrieben durch Studio › Einstellungen › APplus-Abfragen */
    abfragen() {
      const aus = Object.assign({}, (K.cfg && K.cfg.queries) || {});
      let e = this.S && this.S.einst; if (!e) try { e = (JSON.parse(localStorage.getItem(this._schluessel()) || "null") || {}).einst; } catch (x) { e = null; }
      for (const [k, v] of Object.entries((e && e.abfragen) || {})) if (v != null && String(v).trim() !== "") aus[k] = String(v).trim();
      return aus;
    },
    abfrageStatus: {},
    async ladeLokal() {
      const S = this.S; let gespeichert = null;
      if (this._lokalTimer && S.geladen) this._lokalSchreiben(); // noch offene Änderungen zuerst sichern
      try { gespeichert = JSON.parse(localStorage.getItem(this._schluessel()) || "null"); } catch (e) { gespeichert = null; }
      const d = await this.demoDaten();
      const q = await this._applusLaden();
      const quelle = gespeichert || { entwurf: d.modell, live: d.modell, kunden: d.kunden, angebote: d.angebote, einst: d.einstellungen, releases: d.releases, protokoll: d.protokoll, prefs: { favoriten: [] } };
      Object.assign(S, clone(quelle));
      if (q.modell) {
        // Stammdaten aus APplus sind führend: Live-Stand immer aus den Abfragen, Entwurf bleibt bis zur Freigabe
        q.modell.version = Math.max(S.live?.version || 0, 1); S.live = q.modell;
        if (!gespeichert || !gespeichert.entwurf || gespeichert.quelle !== "applus") S.entwurf = clone(q.modell);
      }
      if (q.kunden) S.kunden = q.kunden;
      if (q.vertrieb && q.vertrieb.length) { S.einst ||= d.einstellungen; S.einst.vertrieb = q.vertrieb; S.einst.vertriebQuelle = "applus"; }
      const ex = q.artikel ? null : this._artikelAusExcel();
      this.artikelSetzen(q.artikel || ex || d.artikel || [], q.artikel ? "applus" : ex && ex.length ? "excel" : "beispiel");
      if (q.artikel) try { this.stammAnwenden(); } catch (e) { console.warn("[Konfigurator] Stammabgleich mit ARTIKEL übersprungen:", e); }
      if (!S.einst) S.einst = d.einstellungen;
      S.prefs ||= { favoriten: [] }; S.quelle = q.modell ? "applus" : "lokal"; S.geladen = true;
      this._melde("alles");
    },
    async _applusLaden() {
      const out = {}, cfg = K.cfg || {}, qs = this.abfragen(); this.ladefehler = []; this.applusQuellen = 0; this.abfrageStatus = {};
      if (!cfg.loadQuery) return out;
      const blaetter = {};
      await Promise.all(["katalog", "produkte", "merkmale", "codes", "regeln", "stueckliste", "kunden", "artikel", "vertrieb"].map(async typ => {
        if (!qs[typ]) return;
        try {
          const rows = await cfg.loadQuery(qs[typ], typ);
          if (!Array.isArray(rows)) { this.abfrageStatus[typ] = { name: qs[typ], fehler: location.protocol === "file:" ? "nur innerhalb von APplus abrufbar" : "keine Daten geliefert" }; return; }
          this.abfrageStatus[typ] = { name: qs[typ], zeilen: rows.length };
          this.applusQuellen++;
          if (typ === "kunden") { out.kunden = rows.map(kundeAusZeile).filter(k => k.firma); return; }
          if (typ === "vertrieb") { out.vertrieb = rows.map(vertriebAusZeile).filter(v => v.name); return; }
          if (typ === "artikel") { out.artikel = rows; return; }
          const kopf = [...new Set(rows.flatMap(r => Object.keys(r)))];
          blaetter[typ] = [kopf, ...rows.map(r => kopf.map(h => r[h] ?? ""))];
        } catch (e) { console.warn("[Konfigurator] Abfrage fehlgeschlagen:", qs[typ], e); this.ladefehler.push(qs[typ] + ": " + (e.message || e)); this.abfrageStatus[typ] = { name: qs[typ], fehler: e.message || String(e) }; }
      }));
      if (Object.keys(blaetter).length && K.X) {
        const zuo = K.X.zuordnungVorschlagen(blaetter, (this.S.einst || {}).importZuordnung);
        const r = K.X.umwandeln(blaetter, zuo, null, "ersetzen");
        if (r.warn.length) console.info("[Konfigurator] Hinweise beim Lesen der APplus-Abfragen:", r.warn);
        if (r.modell.produkte.length) out.modell = r.modell;
      }
      return out;
    },
    /* ---------- Artikelstamm (APplus-Tabelle ARTIKEL, Feld ARTIKEL) ---------- */
    artikel: new Map(), artikelQuelle: null,
    /** Bildadressen neu bilden, z. B. nach Änderung der Adresse vor dem Bildpfad */
    /** APplus legt Dokumente unter <App>/DocLib/ ab, z. B. https://erp/APplusProd/DocLib/WK3/WK367.png */
    bildBasisStandard() { if (location.protocol === "file:") return ""; const app = location.pathname.split("/").slice(0, 2).join("/"); return app ? app + "/DocLib/" : ""; },
    bilderNeu() { if (!this.bildAus) return; for (const a of this.artikel.values()) a.bild = this.bildAus(a.bildRoh); },
    artikelSetzen(rows, quelle) {
      // Bildspalte: Adresse oder HTML wie <img src="…">; Backslashes im Pfad werden zu /
      const bildAus = this.bildAus = v => { let t = String(v || "").trim(); if (!t) return ""; const m = t.match(/src\s*=\s*["']([^"']+)["']/i); if (m) t = m[1]; t = t.replace(/\\/g, "/"); const basis = String((this.S && this.S.einst && this.S.einst.bildBasis) || (K.cfg && K.cfg.bildBasis) || this.bildBasisStandard()).trim(); if (basis && !/^([a-z]+:|\/\/|\/)/i.test(t)) t = (basis.endsWith("/") ? basis : basis + "/") + t.replace(/^\.?\//, ""); return t; };
      const sp = (K.cfg && K.cfg.artikelSpalten) || {}, map = new Map();
      const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g, "");
      for (const r of Array.isArray(rows) ? rows : []) {
        if (!r || typeof r !== "object") continue; const n = {}; for (const [k, v] of Object.entries(r)) n[norm(k)] = v;
        const f = (key, fallback) => { for (const c of (sp[key] || []).concat(fallback || [])) { const v = n[norm(c)]; if (v != null && String(v).trim() !== "") return v; } return ""; };
        const code = String(f("code", ["code", "artikel"])).trim(); if (!code) continue;
        // Leere oder fehlende Spalte = kein Wert (null), damit z. B. eine Abfrage nur mit ARTIKEL und NAME keine Preise auf 0 setzt
        const zahl = v => v === "" || v == null ? null : typeof v === "number" ? v : (K.X ? K.X.zahl(v) : parseFloat(String(v).replace(",", ".")) || 0);
        map.set(code.toUpperCase(), { code, name: String(f("name", ["name"])).trim(), preis: zahl(f("preis", ["preis"])), kosten: zahl(f("kosten", ["kosten"])), me: String(f("me", ["me"])).trim(), gruppe: String(f("gruppe", ["gruppe"])).trim(), bildRoh: String(f("bild", ["bild"]) || ""), bild: bildAus(f("bild", ["bild"])) });
      }
      this.artikel = map; this.artikelQuelle = map.size ? quelle : null;
    },
    /** Artikelstamm aus einer Excel-Mappe (Blatt „Import“), wenn APplus keinen liefert */
    artikelImport(rows) {
      const alt = [...this.artikel.values()].filter(() => this.artikelQuelle === "excel").map(a => ({ ARTIKEL: a.code, NAME: a.name, VKPREIS: a.preis, HERSTELLKOSTEN: a.kosten, ME: a.me }));
      const neu = new Map(alt.map(r => [String(r.ARTIKEL).toUpperCase(), r])); for (const r of rows) neu.set(String(r.ARTIKEL).toUpperCase(), r);
      const liste = [...neu.values()]; this.artikelSetzen(liste, "excel");
      try { localStorage.setItem(this._schluessel() + "-artikel", JSON.stringify(liste)); } catch (e) {}
      this._melde && this._melde("artikel");
    },
    _artikelAusExcel() { try { return JSON.parse(localStorage.getItem(this._schluessel() + "-artikel") || "null"); } catch (e) { return null; } },
    /**
     * APplus ist führend für Stammdaten: Bezeichnung und Preis jedes Codes und jedes Fahrzeugs, das als Artikel
     * in ARTIKEL steht, werden beim Laden übernommen. Ausnahme: im Studio bewusst überschrieben (apStamm = false).
     * Preise je Produktgruppe (Excel-Import „Codes und Preise“) gelten weiterhin vorrangig.
     */
    stammAnwenden() {
      if (this.artikelQuelle !== "applus") return 0; let n = 0;
      for (const mo of [this.S.live, this.S.entwurf]) {
        if (!mo) continue;
        for (const m of Array.isArray(mo.merkmale) ? mo.merkmale : []) for (const w of Array.isArray(m && m.werte) ? m.werte : []) {
          if (!w || w.apStamm === false || !w.code) continue; const a = this.artikelZu(w.code); if (!a) continue;
          if (a.name && w.name !== a.name) { w.name = a.name; n++; } if (a.preis != null && w.preis !== a.preis) { w.preis = a.preis; n++; } if (a.kosten && w.kosten !== a.kosten) w.kosten = a.kosten;
        }
        for (const p of Array.isArray(mo.produkte) ? mo.produkte : []) {
          if (!p || p.apStamm === false || !p.code) continue; const a = this.artikelZu(p.code); if (!a) continue;
          if (a.preis && p.basispreis !== a.preis) { p.basispreis = a.preis; n++; } if (a.kosten) p.basiskosten = a.kosten;
        }
      }
      return n;
    },
    artikelZu(code) { return code ? this.artikel.get(String(code).trim().toUpperCase()) || null : null; },
    artikelSuche(q, n = 12) {
      q = String(q || "").trim().toLowerCase(); if (!q) return [];
      const out = [], spaeter = [];
      for (const a of this.artikel.values()) {
        const c = a.code.toLowerCase(), nm = a.name.toLowerCase();
        if (c.startsWith(q)) out.push(a); else if (c.includes(q) || nm.includes(q)) spaeter.push(a);
        if (out.length >= n) break;
      }
      return out.concat(spaeter).slice(0, n);
    },
    _lokalTimer: null,
    _lokalSichern() {
      if (this.modus !== "lokal") return;
      clearTimeout(this._lokalTimer);
      this._lokalTimer = setTimeout(() => this._lokalSchreiben(), 400);
      if (!this._beimVerlassen) { this._beimVerlassen = true; window.addEventListener("pagehide", () => { if (this._lokalTimer) this._lokalSchreiben(); }); }
    },
    _lokalSchreiben() {
      clearTimeout(this._lokalTimer); this._lokalTimer = null; const S = this.S;
      try { localStorage.setItem(this._schluessel(), JSON.stringify({ entwurf: S.entwurf, live: S.live, kunden: S.kunden, angebote: S.angebote, einst: S.einst, releases: S.releases, protokoll: S.protokoll, prefs: S.prefs, quelle: S.quelle })); }
      catch (e) { console.warn("[Konfigurator] Browser-Speicher voll oder gesperrt", e); }
    },
    lokalZuruecksetzen() { try { localStorage.removeItem(this._schluessel()); } catch (e) {} },

    async demoDaten() {
      if (window.KONF_DEMO_DATEN) return JSON.parse(JSON.stringify(window.KONF_DEMO_DATEN));
      const inline = document.getElementById("demo-daten");
      if (inline) return JSON.parse(inline.textContent);
      const r = await fetch("daten/demo.json"); return r.json();
    },

    async ladeDemo() {
      const d = await this.demoDaten(); const S = this.S;
      S.entwurf = clone(d.modell); S.live = clone(d.modell); S.kunden = d.kunden; S.angebote = d.angebote;
      S.einst = d.einstellungen; S.releases = d.releases; S.protokoll = d.protokoll; S.geladen = true;
      this._melde("alles");
    },

    /** Leeren Datenspeicher mit dem Startmodell füllen (nur auf Knopfdruck). */
    async startmodellLaden() {
      const d = await this.demoDaten(), db = this.db;
      if (!db) { this.lokalZuruecksetzen(); return this.ladeLokal(); }
      await db.doc("modell/entwurf").set(d.modell);
      await db.doc("modell/live").set(d.modell);
      await db.doc("einstellungen/allgemein").set(d.einstellungen);
      for (const k of d.kunden) await db.doc("kunden/" + k.id).set(k);
      for (const a of d.angebote) await db.doc("angebote/" + a.nr).set(a);
      for (const r of d.releases) await db.doc("releases/v" + r.version).set(r);
      for (const p of d.protokoll) await db.doc("protokoll/" + p.monat).set(p);
    },

    _abonnieren() {
      const db = this.db, S = this.S, self = this;
      const fehler = e => { console.warn("Datenspeicher", e); if (e && e.code === "revoked") { self.schreiben = false; self._melde("fehler"); } };
      let offen = 5; const fertig = () => { if (--offen === 0) { S.geladen = true; self._melde("alles"); } };
      const einmal = fn => { let f = false; return (...a) => { fn(...a); if (!f) { f = true; fertig(); } }; };
      db.doc("modell/entwurf").onSnapshot(einmal(s => { if (!self._entwurfOffen) S.entwurf = s.exists ? clone(s.data()) : null; self._melde("entwurf"); }), fehler);
      db.doc("modell/live").onSnapshot(einmal(s => { S.live = s.exists ? clone(s.data()) : null; self._melde("live"); }), fehler);
      db.collection("kunden").onSnapshot(einmal(q => { S.kunden = q.docs.map(d => d.data()); self._melde("kunden"); }), fehler);
      db.collection("angebote").onSnapshot(einmal(q => { S.angebote = q.docs.map(d => d.data()); self._melde("angebote"); }), fehler);
      db.doc("einstellungen/allgemein").onSnapshot(einmal(s => { S.einst = s.exists ? s.data() : null; self._melde("einst"); }), fehler);
      db.collection("releases").orderBy("version", "desc").limit(50).onSnapshot(q => { S.releases = q.docs.map(d => d.data()); self._melde("releases"); }, fehler);
      db.collection("protokoll").orderBy("monat", "desc").limit(3).onSnapshot(q => { S.protokoll = q.docs.map(d => d.data()); self._melde("protokoll"); }, fehler);
      if (this.uid) db.doc("data/users/" + this.uid + "/prefs").onSnapshot(s => { S.prefs = s.exists ? clone(s.data()) : { favoriten: [] }; self._melde("prefs"); }, () => {});
    },

    async _set(pfad, daten) {
      if (this.modus !== "db") return;
      try { await this.db.doc(pfad).set(daten); }
      catch (e) {
        if (e && e.code === "invalid_argument") { this.schreiben = false; this._melde("fehler"); }
        if (e && e.code === "quota_exceeded") K.toast("Der Datenspeicher ist voll. Bitte alte Angebote löschen.");
        throw e;
      }
    },
    async _del(pfad) { if (this.modus === "db") await this.db.doc(pfad).delete(); },

    /* ---------- Modell ---------- */
    _entwurfTimer: null, _entwurfOffen: false,
    entwurfGeaendert(protokollText) {
      // Entwurf wurde lokal geändert (K.Store.S.entwurf mutiert). Gebündelt speichern.
      this._entwurfOffen = true; this._melde("entwurf");
      clearTimeout(this._entwurfTimer);
      this._entwurfTimer = setTimeout(() => this._entwurfSichern(), 700);
      if (protokollText) this._protokollMerken("Pflege", protokollText);
    },
    async _entwurfSichern() {
      const daten = clone(this.S.entwurf); daten.geaendert = Date.now(); daten.geaendertVon = this.uid;
      try { await this._set("modell/entwurf", daten); } catch (e) {}
      this._entwurfOffen = false;
    },
    async veroeffentlichen(notiz) {
      clearTimeout(this._entwurfTimer); if (this._entwurfOffen) await this._entwurfSichern();
      const S = this.S, v = (S.live?.version || 0) + 1;
      const live = clone(S.entwurf); live.version = v; live.freigegeben = Date.now(); live.freigegebenVon = this.uid;
      S.live = live; S.entwurf.version = v;
      const rel = { version: v, ts: Date.now(), von: this.uid, notiz: notiz || "", regeln: live.regeln.length, merkmale: live.merkmale.length, produkte: live.produkte.length };
      if (this.modus === "db") { await this._set("modell/live", live); await this._set("modell/entwurf", clone(S.entwurf)); await this._set("releases/v" + v, rel); }
      else { S.releases.unshift(rel); }
      await this.log("Freigabe", `Version ${v} veröffentlicht${notiz ? ": " + notiz : ""}`);
      this._melde("live");
    },
    async entwurfVerwerfen() {
      clearTimeout(this._entwurfTimer);
      this.S.entwurf = clone(this.S.live);
      await this._set("modell/entwurf", clone(this.S.entwurf)).catch(() => {});
      this._entwurfOffen = false;
      await this.log("Freigabe", "Entwurf verworfen, Stand der Version " + this.S.live.version + " wiederhergestellt");
      this._melde("entwurf");
    },
    async alteVersionLaden(v) {
      // Nur der aktuelle Live-Stand ist komplett gespeichert; ältere Releases sind Protokolleinträge.
    },

    /* ---------- Kunden ---------- */
    async kundeSpeichern(k, neu) {
      const S = this.S; const i = S.kunden.findIndex(x => x.id === k.id);
      if (i >= 0) S.kunden[i] = k; else S.kunden.push(k);
      this._melde("kunden");
      await this._set("kunden/" + k.id, k);
      if (neu) await this.log("Kunden", `Kunde ${k.firma} angelegt`);
    },
    async kundeLoeschen(id) {
      const k = this.S.kunden.find(x => x.id === id);
      this.S.kunden = this.S.kunden.filter(x => x.id !== id); this._melde("kunden");
      await this._del("kunden/" + id); await this.log("Kunden", `Kunde ${k ? k.firma : id} gelöscht`);
    },

    /* ---------- Angebote ---------- */
    async angebotSpeichern(a) {
      const S = this.S; const i = S.angebote.findIndex(x => x.nr === a.nr);
      a.geaendert = Date.now();
      if (i >= 0) S.angebote[i] = a; else S.angebote.push(a);
      this._melde("angebote");
      await this._set("angebote/" + a.nr, clone(a));
    },
    async angebotLoeschen(nr) {
      this.S.angebote = this.S.angebote.filter(x => x.nr !== nr); this._melde("angebote");
      await this._del("angebote/" + nr); await this.log("Angebote", `Angebot ${nr} gelöscht`);
    },
    /** Kundenaktion im Verkaufsraum anhängen (Aufruf, Rückfrage, Annahme). */
    async ereignis(nr, ev) {
      const a = this.S.angebote.find(x => x.nr === nr); if (!a) return;
      a.events = a.events || [];
      const i = ev.id ? a.events.findIndex(x => x.id === ev.id) : -1;
      if (i >= 0) a.events[i] = ev; else a.events.push(ev);
      if (a.events.length > 300) a.events = a.events.slice(-300);
      if (ev.typ === "angenommen") a.status = "angenommen";
      this._melde("angebote");
      if (this.modus === "db") { try { await this.db.doc("angebote/" + nr).update({ events: clone(a.events), status: a.status }); } catch (e) {} }
    },
    /** Eigener Nummernkreis der App */
    naechsteNrLokal() {
      const e = this.S.einst; let n = e.naechsteNr;
      const vorhanden = new Set(this.S.angebote.map(a => a.nr));
      while (vorhanden.has(e.praefix + n)) n++;
      return e.praefix + n;
    },
    /**
     * Nächste Angebotsnummer. Quelle laut Einstellungen › Nummern:
     *  app    – eigener Nummernkreis (Präfix + laufende Nummer)
     *  applus – aus dem ERP: eigene Funktion KONF_CONFIG.angebotsnummer (z. B. Webdienst, der reserviert)
     *           oder Abfrage, die die nächste freie bzw. die zuletzt vergebene Nummer liefert.
     * Liefert { nr, quelle }. Wirft einen Fehler, wenn das ERP keine Nummer liefert und keine Ersatznummer erlaubt ist.
     */
    async naechsteNr() {
      const e = this.S.einst, z = Object.assign({ quelle: "app", abfrage: (K.cfg.queries || {}).angebotsnummer || "", feld: "", art: "naechste", ersatz: false }, e.nummern || {});
      if (z.quelle !== "applus") return { nr: this.naechsteNrLokal(), quelle: "app" };
      try {
        let nr = null;
        if (typeof K.cfg.angebotsnummer === "function") nr = await K.cfg.angebotsnummer(e);
        else {
          if (!z.abfrage) throw new Error("Keine Abfrage für die Angebotsnummer eingetragen");
          const rows = await K.cfg.loadQuery(z.abfrage, "angebotsnummer");
          if (!rows || !rows.length) throw new Error("Die Abfrage " + z.abfrage + " liefert keine Zeile");
          const r = rows[0], keys = Object.keys(r), k = z.feld ? keys.find(x => x.toLowerCase() === z.feld.toLowerCase()) : keys.find(x => /^(nr|nummer|angebot|angebotsnr|angebotsnummer|naechste|next|belegnr|max)$/i.test(x)) || keys[0];
          nr = r[k]; if (nr == null || String(nr).trim() === "") throw new Error("Feld " + (k || "?") + " ist leer");
          nr = String(nr).trim();
          if (z.art === "hoechste") { const m = nr.match(/^(.*?)(\d+)$/); if (!m) throw new Error("Nummer " + nr + " endet nicht mit einer Zahl"); nr = m[1] + String(+m[2] + 1).padStart(m[2].length, "0"); }
        }
        // im selben Browser schon vergebene Nummern überspringen (bei „zuletzt vergeben“ ohne Reservierung)
        const vorhanden = new Set(this.S.angebote.map(a => a.nr));
        while (vorhanden.has(nr)) { const m = String(nr).match(/^(.*?)(\d+)$/); if (!m) break; nr = m[1] + String(+m[2] + 1).padStart(m[2].length, "0"); }
        return { nr: String(nr), quelle: "applus" };
      } catch (err) {
        console.warn("[Konfigurator] Angebotsnummer aus APplus nicht verfügbar:", err);
        if (z.ersatz) return { nr: this.naechsteNrLokal(), quelle: "ersatz", fehler: err.message };
        throw new Error("Angebotsnummer aus APplus nicht verfügbar: " + err.message);
      }
    },
    async nrVerbrauchen(nr) {
      const e = this.S.einst; if (!String(nr).startsWith(e.praefix)) return;
      const n = parseInt(String(nr).replace(e.praefix, ""), 10);
      if (n >= e.naechsteNr) { e.naechsteNr = n + 1; await this.einstSpeichern(e, true); }
    },

    /* ---------- Einstellungen ---------- */
    _einstTimer: null,
    async einstSpeichern(e, sofort) {
      this.S.einst = e; this._melde("einst");
      clearTimeout(this._einstTimer);
      const f = () => this._set("einstellungen/allgemein", clone(e)).catch(() => {});
      if (sofort) await f(); else this._einstTimer = setTimeout(f, 700);
    },

    /* ---------- Favoriten ---------- */
    async favorit(pid) {
      const p = this.S.prefs; p.favoriten = p.favoriten || [];
      p.favoriten = p.favoriten.includes(pid) ? p.favoriten.filter(x => x !== pid) : [...p.favoriten, pid];
      this._melde("prefs");
      if (this.modus === "db" && this.uid) try { await this.db.doc("data/users/" + this.uid + "/prefs").set(clone(p)); } catch (e) {}
    },

    /* ---------- Protokoll ---------- */
    _merk: {}, _merkTimer: null,
    _protokollMerken(bereich, text) {
      // Tippen in einem Feld erzeugt nur einen Eintrag je Objekt und Pause
      this._merk[bereich + "|" + text] = { bereich, text };
      clearTimeout(this._merkTimer);
      this._merkTimer = setTimeout(() => { const l = Object.values(this._merk); this._merk = {}; this.log(l.map(x => x.bereich), l.map(x => x.text)); }, 4000);
    },
    async log(bereich, text) {
      const bs = [].concat(bereich), ts = [].concat(text);
      const monat = new Date().toISOString().slice(0, 7), S = this.S;
      let doc = S.protokoll.find(p => p.monat === monat);
      if (!doc) { doc = { monat, eintraege: [] }; S.protokoll.unshift(doc); }
      ts.forEach((t, i) => doc.eintraege.push({ ts: Date.now(), von: this.uid, bereich: bs[i] || bs[0], text: t }));
      if (doc.eintraege.length > 800) doc.eintraege = doc.eintraege.slice(-800);
      this._melde("protokoll");
      await this._set("protokoll/" + monat, clone(doc)).catch(() => {});
    },

    /* ---------- Personen ---------- */
    async namen(ids) {
      ids = [...new Set(ids.filter(Boolean))];
      if (!this.user || !ids.length) return {};
      try { const p = await this.user.profiles(ids); return Object.fromEntries(ids.map(id => [id, p[id]?.name || ""])); } catch (e) { return {}; }
    }
  };
})();
