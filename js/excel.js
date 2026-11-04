/* =========================================================================
   Excel-Import und -Export der Produktfamilie
   Teil 1 (ohne Oberfläche, auch in Node lauffähig):
     - Blätter und Spalten erkennen (Synonyme für typische Spaltennamen)
     - Tabellenzeilen in das Konfigurationsmodell umwandeln
     - Modell als Tabellen (Vorlage) ausgeben
   Teil 2: Oberfläche im Studio (Datei wählen → Zuordnen → Prüfen → Übernehmen)

   Unterstützte Blätter (Namen frei, werden erkannt oder zugeordnet):
     Katalog      Gruppen-Code | Gruppe | Übergeordnet
     Produkte     Produkt-Code | Bezeichnung | Gruppe | Grundpreis | Kosten | Artikelnr. | Beschreibung
     Merkmale     Merkmal-Code | Merkmal | Bereich | Abschnitt | Auswahl | Darstellung | Pflicht | Multiplikator
     Codes        Vertriebscode | Merkmal | Bezeichnung | Preis | Kosten | Menge | … | <je Produkt eine Spalte: X / S>
     Regeln       Regel | Name | Wenn | Typ | Dann | Gilt für | Hinweis | Aktiv
     Matrix       Codes in Zeilen (Wenn) gegen Codes in Spalten (Dann), markierte Zellen
     Stückliste   Code | Artikelnr. | Bezeichnung | Menge | ME
   ========================================================================= */
(function (root) {
  const X = {};
  const E = typeof module !== "undefined" && module.exports ? require("./engine.js") : root.KONF.E;

  /* ---------- Erkennung ---------- */
  X.norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  X.FELDER = {
    katalog: { name: "Katalog", felder: {
      code: ["gruppencode", "gruppeid", "gruppenid", "code", "id", "kuerzel"], name: ["gruppe", "gruppenname", "bezeichnung", "name", "katalog"], eltern: ["uebergeordnet", "eltern", "parent", "obergruppe", "uebergeordnetegruppe"] }, pflicht: ["name"] },
    produkte: { name: "Produkte", felder: {
      code: ["produktcode", "produkt", "typcode", "typ", "modellcode", "modell", "code", "grundmaschine"], name: ["bezeichnung", "produktname", "name", "produktbezeichnung"], gruppe: ["gruppe", "produktgruppe", "familie", "kategorie", "katalog"],
      basispreis: ["grundpreis", "basispreis", "listenpreis", "preis", "vkpreis", "vk"], basiskosten: ["kosten", "herstellkosten", "selbstkosten", "ek", "ekpreis"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material", "materialnummer"], beschreibung: ["beschreibung", "langtext", "text", "info"] }, pflicht: ["code"] },
    merkmale: { name: "Merkmale", felder: {
      code: ["merkmalcode", "merkmalid", "merkmalkuerzel", "code", "id", "kuerzel"], name: ["merkmal", "merkmalname", "bezeichnung", "name"], bereich: ["bereich", "reiter", "tab", "register"], abschnitt: ["abschnitt", "kapitel", "baugruppe", "gruppe"],
      typ: ["auswahl", "auswahlart", "typ", "mehrfach"], darstellung: ["darstellung", "anzeige", "anzeigeart"], pflicht: ["pflicht", "muss", "pflichtfeld", "required"], multiplikator: ["multiplikator", "je", "mengevon"], info: ["info", "hinweis", "beschreibung"] }, pflicht: ["name"] },
    codes: { name: "Codes", felder: {
      code: ["vertriebscode", "vkcode", "verkaufscode", "salescode", "optionscode", "code", "merkmalswert", "wertcode"], merkmal: ["merkmal", "merkmalcode", "merkmalgruppe", "optionsgruppe", "gruppe"], name: ["bezeichnung", "text", "beschreibung", "name", "kurztext"],
      preis: ["preis", "vkpreis", "listenpreis", "verkaufspreis", "vk", "aufpreis"], kosten: ["kosten", "ek", "ekpreis", "herstellkosten"], menge: ["menge", "anzahl", "stueckzahl"], hex: ["farbe", "hex", "farbcode"],
      teil: ["3dteil", "3d", "cad", "bauteil", "cadteil"], info: ["info", "hinweis", "langtext"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material"], feld: ["feldtyp", "eingabe", "eingabeart", "art"] }, pflicht: ["code"] },
    regeln: { name: "Regeln", felder: {
      id: ["regel", "regelnr", "nr", "id", "regelid"], name: ["name", "bezeichnung", "beschreibung", "regelname"], wenn: ["wenn", "bedingung", "wenncode", "wenncodes", "ausloeser", "voraussetzung"], typ: ["typ", "art", "regeltyp", "aktion", "beziehung"],
      dann: ["dann", "folge", "ziel", "danncode", "danncodes", "betroffen", "betroffenecodes"], produkte: ["giltfuer", "produkte", "produkt", "nurfuer"], hinweis: ["hinweis", "meldung", "text", "begruendung"], aktiv: ["aktiv", "status", "gueltig"] }, pflicht: ["wenn", "dann"] },
    matrix: { name: "Matrix", felder: {}, pflicht: [] },
    kombinationen: { name: "Kombinationen", felder: {
      tabelle: ["tabelle", "tabellennr", "kombinationstabelle", "variantentabelle", "tabellenid"], name: ["name", "bezeichnung", "tabellenname"], produkte: ["giltfuer", "produkte", "produkt", "nurfuer"] }, pflicht: ["tabelle"] },
    stueckliste: { name: "Stückliste", felder: {
      code: ["vertriebscode", "code", "produktcode", "produkt", "wertcode"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material", "komponente"], bez: ["bezeichnung", "text", "beschreibung", "kurztext"], menge: ["menge", "anzahl"], me: ["me", "einheit", "mengeneinheit"] }, pflicht: ["code", "artnr"] }
  };
  const BLATTNAMEN = { katalog: ["katalog", "gruppen", "produktgruppen", "struktur"], produkte: ["produkte", "produkt", "typen", "modelle", "grundmaschinen"], merkmale: ["merkmale", "merkmal", "merkmalsliste"],
    codes: ["codes", "vertriebscodes", "vkcodes", "optionen", "werte", "merkmalswerte", "preisliste"], regeln: ["regeln", "regelwerk", "abhaengigkeiten", "regelliste"], matrix: ["matrix", "kompatibilitaet", "ausschluss", "ausschlussmatrix"], kombinationen: ["kombinationen", "kombinationstabelle", "kombinationstabellen", "variantentabelle", "variantentabellen"], stueckliste: ["stueckliste", "stl", "bom"] };

  /** Kopfzeile finden: die Zeile mit den meisten bekannten Spaltennamen unter den ersten 12 */
  X.kopfzeile = (aoa, typ) => {
    const syn = Object.values(X.FELDER[typ]?.felder || {}).flat();
    let best = 0, bestScore = -1;
    for (let i = 0; i < Math.min(12, aoa.length); i++) {
      const z = aoa[i] || [], gefuellt = z.filter(c => String(c).trim()).length;
      const score = z.filter(c => syn.includes(X.norm(c))).length * 3 + (gefuellt >= 2 ? 1 : 0);
      if (score > bestScore) { bestScore = score; best = i; }
    }
    return best;
  };
  /** Spalten den Feldern zuordnen (exakt vor "enthält") */
  X.spaltenRaten = (kopf, typ) => {
    const out = {}, belegt = new Set(), n = kopf.map(X.norm);
    for (const [feld, syn] of Object.entries(X.FELDER[typ].felder)) {
      let idx = -1;
      for (const s of syn) { idx = n.findIndex((h, i) => h === s && !belegt.has(i)); if (idx >= 0) break; }
      const nicht = typ === "codes" && feld === "merkmal" ? /produkt|familie|baureihe/ : null; // „Produktgruppe“ ist kein Merkmal
      if (idx < 0) for (const s of syn) { if (s.length < 3) continue; idx = n.findIndex((h, i) => h && h.includes(s) && !belegt.has(i) && !(nicht && nicht.test(h))); if (idx >= 0) break; }
      if (idx >= 0) { out[feld] = idx; belegt.add(idx); }
    }
    return out;
  };
  /** Blatttyp aus Name und Inhalt raten */
  X.blattTypRaten = (name, aoa) => {
    const nn = X.norm(name);
    for (const [typ, l] of Object.entries(BLATTNAMEN)) if (l.some(s => nn === s || nn.includes(s))) return typ;
    let best = null, bs = 0;
    for (const typ of Object.keys(X.FELDER)) { if (typ === "matrix" || typ === "katalog") continue; /* Produktgruppen nur aus einem Blatt namens Katalog/Gruppen */ const k = aoa[X.kopfzeile(aoa, typ)] || []; const s = Object.keys(X.spaltenRaten(k, typ)).length; if (s > bs) { bs = s; best = typ; } }
    return bs >= 2 ? best : null;
  };
  /** Komplette Zuordnung für eine Arbeitsmappe vorschlagen (oder gespeicherte anwenden) */
  X.zuordnungVorschlagen = (blaetter, gespeichert) => {
    const zuo = {};
    const ignorieren = n => /^(anleitung|hinweise?|info|readme|liesmich|deckblatt|inhalt)$/.test(X.norm(n));
    // Blätter mit passendem Namen zuerst, dann nach Inhalt erkannte
    const namen = Object.keys(blaetter).filter(n => !ignorieren(n));
    const nachName = n => Object.values(BLATTNAMEN).some(l => l.some(s => X.norm(n) === s || X.norm(n).includes(s)));
    namen.sort((a, b) => (nachName(b) ? 1 : 0) - (nachName(a) ? 1 : 0));
    for (const name of namen) {
      const aoa = blaetter[name];
      const g = gespeichert && Object.entries(gespeichert).find(([, v]) => v.blatt === name);
      const typ = g ? g[0] : X.blattTypRaten(name, aoa);
      if (!typ || zuo[typ]) continue;
      const kz = X.kopfzeile(aoa, typ), kopf = aoa[kz] || [];
      const felder = X.spaltenRaten(kopf, typ);
      if (g && g[1].spaltenNamen) for (const [f, h] of Object.entries(g[1].spaltenNamen)) { const i = kopf.findIndex(c => X.norm(c) === X.norm(h)); if (i >= 0) felder[f] = i; }
      zuo[typ] = { blatt: name, kopfzeile: kz, felder, matrixBedeutung: g?.[1].matrixBedeutung || "sperrt" };
    }
    return zuo;
  };

  /* ---------- Umwandlung ---------- */
  const txt = v => String(v ?? "").trim();
  X.zahl = v => {
    if (typeof v === "number") return v;
    let s = txt(v).replace(/[€\s]|EUR/gi, ""); if (!s || s === "-") return 0;
    if (/,\d{1,2}$/.test(s) || (s.includes(",") && s.includes("."))) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, ".");
    const n = parseFloat(s); return isFinite(n) ? n : 0;
  };
  const ja = v => /^(x|ja|j|yes|y|1|true|wahr|s|std|standard|o|opt|optional|●|✓|✔)$/i.test(txt(v));
  const istStandard = v => /^(s|std|standard)$/i.test(txt(v));
  const listeCodes = s => txt(s).split(/\s*(?:[,;/|\n]|\s+oder\s+|\s+or\s+)\s*/i).map(x => x.trim()).filter(Boolean);
  const typAus = s => {
    const n = X.norm(s);
    if (/nurerlaubt|erlaubtnur|nurmit|nur$|^nur|nurzulaessig/.test(n)) return "nurErlauben";
    if (/setzt|automatisch|inklusive|beinhaltet|erfordert|benoetigt|requires|braucht|zwingend/.test(n)) return "setzen";
    return "sperren"; // sperrt, schließt aus, ausschluss, nicht mit, inkompatibel, exclude
  };

  function zeilen(blaetter, z) {
    if (!z || !z.blatt || !blaetter[z.blatt]) return [];
    const aoa = blaetter[z.blatt];
    return aoa.slice(z.kopfzeile + 1).filter(r => r && r.some(c => txt(c))).map((r, i) => {
      const o = { _zeile: z.kopfzeile + 2 + i };
      for (const [f, idx] of Object.entries(z.felder || {})) if (idx != null && idx >= 0) o[f] = r[idx];
      o._roh = r; return o;
    });
  }

  /**
   * Tabellen → Modell. basis = aktueller Entwurf, modus "zusammen" (Codes aktualisieren, Rest behalten) oder "ersetzen".
   * Liefert { modell, warn:[{blatt,zeile,text}], stat }
   */
  X.umwandeln = (blaetter, zuo, basis, modus = "zusammen") => {
    const warn = [], w = (blatt, zeile, text) => warn.push({ blatt, zeile, text });
    const mo = modus === "ersetzen" || !basis ? { version: basis?.version || 0, gruppen: [], produkte: [], merkmale: [], regeln: [] } : JSON.parse(JSON.stringify(basis));
    const stat = { gruppen: 0, produkte: 0, merkmale: 0, codes: 0, regeln: 0, stueckliste: 0 };
    const bl = t => zuo[t]?.blatt || X.FELDER[t].name;

    // Katalog
    for (const r of zeilen(blaetter, zuo.katalog)) {
      const name = txt(r.name); if (!name) continue;
      const id = E.slug(txt(r.code) || name), eltern = txt(r.eltern) ? E.slug(txt(r.eltern)) : null;
      const g = mo.gruppen.find(x => x.id === id);
      if (g) Object.assign(g, { name, eltern }); else mo.gruppen.push({ id, name, eltern });
      stat.gruppen++;
    }
    for (const g of mo.gruppen) if (g.eltern && !mo.gruppen.some(x => x.id === g.eltern)) { const n = mo.gruppen.find(x => X.norm(x.name) === X.norm(g.eltern)); if (n) g.eltern = n.id; else { w(bl("katalog"), null, `Übergeordnete Gruppe „${g.eltern}“ von „${g.name}“ fehlt, Gruppe steht oben im Katalog.`); g.eltern = null; } }

    // Produkte
    const gruppeFinden = s => { const n = X.norm(s); if (!n) return null; let g = mo.gruppen.find(x => X.norm(x.id) === n || X.norm(x.name) === n); if (!g) { g = { id: E.slug(s), name: txt(s), eltern: null }; mo.gruppen.push(g); stat.gruppen++; } return g.id; };
    const neueProdukte = new Set();
    for (const r of zeilen(blaetter, zuo.produkte)) {
      const code = txt(r.code); if (!code) { w(bl("produkte"), r._zeile, "Zeile ohne Produkt-Code übersprungen."); continue; }
      let p = mo.produkte.find(x => X.norm(x.code || x.id) === X.norm(code));
      if (!p) { p = { id: code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code, name: code, gruppe: null, artnr: "", basispreis: 0, basiskosten: 0, aktiv: true, beschreibung: "", visual: { typ: "semi", asset: null }, stl: [], merkmale: [] }; mo.produkte.push(p); }
      if (txt(r.name)) p.name = txt(r.name);
      if (r.gruppe !== undefined && txt(r.gruppe)) p.gruppe = gruppeFinden(r.gruppe);
      if (r.basispreis !== undefined) p.basispreis = X.zahl(r.basispreis);
      if (r.basiskosten !== undefined) p.basiskosten = X.zahl(r.basiskosten);
      if (r.artnr !== undefined) p.artnr = txt(r.artnr);
      if (r.beschreibung !== undefined) p.beschreibung = txt(r.beschreibung);
      const t = X.norm(p.name + " " + (p.gruppe || ""));
      if (!p.visual?.asset) p.visual = { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform|platform/.test(t) ? "plattform" : /nachlaeufer|holz|forst/.test(t) ? "nachlaeufer" : "semi", asset: null };
      neueProdukte.add(p.id); stat.produkte++;
    }
    if (!mo.gruppen.length) { mo.gruppen.push({ id: "alle", name: "Fahrzeuge", eltern: null }); }
    for (const p of mo.produkte) if (!p.gruppe) p.gruppe = mo.gruppen[0].id;

    // Merkmale
    const merkmalFinden = (s, anlegen, zeile) => {
      const n = X.norm(s); if (!n) return null;
      let m = mo.merkmale.find(x => X.norm(x.id) === n || X.norm(x.name) === n || X.norm(x.code) === n);
      if (!m && anlegen) { m = { id: E.slug(s).replace(/-/g, "") || "m" + mo.merkmale.length, name: txt(s), abschnitt: "", typ: "einfach", werte: [] }; mo.merkmale.push(m); stat.merkmale++; }
      return m;
    };
    for (const r of zeilen(blaetter, zuo.merkmale)) {
      const name = txt(r.name) || txt(r.code); if (!name) continue;
      let m = merkmalFinden(txt(r.code) || name, false) || merkmalFinden(name, false);
      if (!m) { m = { id: (E.slug(txt(r.code) || name).replace(/-/g, "")) || "m" + mo.merkmale.length, name, abschnitt: "", typ: "einfach", werte: [] }; mo.merkmale.push(m); }
      m.name = name; if (txt(r.code)) m.code = txt(r.code);
      if (r.bereich !== undefined && txt(r.bereich)) m.bereich = txt(r.bereich);
      if (r.abschnitt !== undefined) m.abschnitt = txt(r.abschnitt);
      if (r.typ !== undefined && txt(r.typ)) m.typ = /mehr|multi|viele|zubehoer|option|checkbox|x/i.test(txt(r.typ)) && !/einfach|eine?n?$/i.test(txt(r.typ)) ? "mehrfach" : "einfach";
      if (r.darstellung !== undefined && txt(r.darstellung)) { const d = X.norm(r.darstellung); m.darstellung = /kachel|bild|tile/.test(d) ? "kacheln" : /dropdown|auswahl|liste?nfeld|combo/.test(d) ? "auswahl" : /check|haken|option/.test(d) ? "option" : "liste"; }
      if (r.pflicht !== undefined) m.pflicht = ja(r.pflicht);
      if (r.info !== undefined && txt(r.info)) m.info = txt(r.info);
      if (r.multiplikator !== undefined && txt(r.multiplikator)) m._mult = txt(r.multiplikator);
      stat.merkmale++;
    }

    // Codes (Merkmalswerte) inkl. Verfügbarkeit je Produkt
    const zc = zuo.codes;
    const verfuegbar = {}; // pid -> mid -> Set(wid), standard
    const prodSpalten = [];
    if (zc && blaetter[zc.blatt]) {
      const kopf = blaetter[zc.blatt][zc.kopfzeile] || [], belegt = new Set(Object.values(zc.felder || {}));
      kopf.forEach((h, i) => {
        if (belegt.has(i) || !txt(h)) return;
        const n = X.norm(h), p = mo.produkte.find(x => X.norm(x.code || x.id) === n || X.norm(x.name) === n);
        if (p || (zc.produktSpalten || []).includes(txt(h))) prodSpalten.push({ i, p, h: txt(h) });
      });
      for (const s of prodSpalten) if (!s.p) {
        const p = { id: s.h.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code: s.h, name: s.h, gruppe: mo.gruppen[0].id, artnr: "", basispreis: 0, basiskosten: 0, aktiv: true, beschreibung: "", visual: { typ: "semi", asset: null }, stl: [], merkmale: [] };
        mo.produkte.push(p); s.p = p; neueProdukte.add(p.id); stat.produkte++; w(bl("codes"), null, `Produkt „${s.h}“ nur aus Spaltenkopf angelegt (Grundpreis 0).`);
      }
    }
    const gesehen = new Map();
    let letztesMerkmal = null;
    for (const r of zeilen(blaetter, zc)) {
      const code = txt(r.code);
      // Zwischenüberschriften ("Merkmal: Achsen") ohne Code als Merkmal für die folgenden Zeilen
      if (!code) { const t = txt(r.name) || txt(r.merkmal); if (t) letztesMerkmal = t; continue; }
      const mname = txt(r.merkmal) || letztesMerkmal;
      if (!mname) { w(bl("codes"), r._zeile, `Code ${code} hat kein Merkmal und wurde übersprungen.`); continue; }
      const m = merkmalFinden(mname, true);
      const key = code.toUpperCase();
      if (gesehen.has(key)) { w(bl("codes"), r._zeile, `Code ${code} kommt doppelt vor (zuerst Zeile ${gesehen.get(key)}). Die spätere Zeile gilt.`); }
      gesehen.set(key, r._zeile);
      // Code auch in anderem Merkmal vorhanden? → dort entfernen
      for (const m2 of mo.merkmale) if (m2 !== m) { const j = m2.werte.findIndex(x => (x.code || "").toUpperCase() === key); if (j >= 0) m2.werte.splice(j, 1); }
      let wv = m.werte.find(x => (x.code || "").toUpperCase() === key) || m.werte.find(x => x.id.toUpperCase() === key);
      if (!wv) { wv = { id: code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code, name: code, preis: 0, kosten: 0, stl: [] }; m.werte.push(wv); }
      wv.code = code;
      if (txt(r.name)) wv.name = txt(r.name);
      if (r.preis !== undefined) wv.preis = X.zahl(r.preis);
      if (r.kosten !== undefined) wv.kosten = X.zahl(r.kosten);
      if (r.menge !== undefined && txt(r.menge)) wv.menge = X.zahl(r.menge);
      if (r.hex !== undefined && /^#?[0-9a-f]{6}$/i.test(txt(r.hex))) wv.hex = "#" + txt(r.hex).replace("#", "");
      if (r.teil !== undefined) wv.teil = txt(r.teil);
      if (r.feld !== undefined && txt(r.feld)) { const f = X.norm(r.feld), t = E.WERTTYPEN ? (E.WERTTYPEN.find(([k, n]) => X.norm(k) === f || X.norm(n) === f) || [/zahl|menge|anzahl/.test(f) ? "zahl" : /text/.test(f) ? "text" : /fest|inkl|grund/.test(f) ? "fest" : /ja|nein|bool|haken/.test(f) ? "janein" : "auswahl"])[0] : null; if (t && E.wertTypSetzen) E.wertTypSetzen(wv, t); }
      if (r.info !== undefined && txt(r.info)) wv.info = txt(r.info);
      if (r.artnr !== undefined && txt(r.artnr)) wv.stl = [[txt(r.artnr), wv.name, 1, "Stk"]];
      for (const s of prodSpalten) {
        const v = r._roh[s.i]; if (!ja(v)) continue;
        const pv = (verfuegbar[s.p.id] ||= {}), e = (pv[m.id] ||= { ids: new Set(), std: [] });
        e.ids.add(wv.id); if (istStandard(v)) e.std.push(wv.id);
      }
      stat.codes++;
    }
    for (const m of mo.merkmale) if (m._mult) { const z = merkmalFinden(m._mult, false); if (z) m.multiplikator = z.id; else w(bl("merkmale"), null, `Multiplikator „${m._mult}“ von ${m.name} nicht gefunden.`); delete m._mult; }

    // Produktzuordnung aus Verfügbarkeitsspalten
    if (prodSpalten.length) {
      for (const s of prodSpalten) {
        const p = s.p, pv = verfuegbar[p.id] || {};
        const alt = new Map((p.merkmale || []).map(z => [z.id, z]));
        p.merkmale = []; delete p.reihenfolge;
        for (const m of mo.merkmale) {
          const e = pv[m.id];
          if (!e) { if (alt.has(m.id) && !m.werte.some(x => x.code)) p.merkmale.push(alt.get(m.id)); continue; }
          const ids = m.werte.filter(x => e.ids.has(x.id)).map(x => x.id);
          const z = { id: m.id, werte: ids.length === m.werte.length ? null : ids };
          if (e.std.length) z.standard = m.typ === "mehrfach" ? e.std.join(",") : e.std[0];
          p.merkmale.push(z);
        }
        if (!p.merkmale.length) w(bl("codes"), null, `Für ${p.name} ist kein Code markiert.`);
      }
    } else if (zc) {
      // keine Produktspalten: neue Produkte erhalten alle Merkmale
      for (const p of mo.produkte) if (neueProdukte.has(p.id) && !p.merkmale.length) p.merkmale = mo.merkmale.map(m => ({ id: m.id, werte: null }));
    }

    // Regeln
    const idx = E.codeIndex(mo);
    const codeAuf = (c, blatt, zeile) => { const t = idx.get(c.toUpperCase()); if (!t) w(blatt, zeile, `Unbekannter Code „${c}“.`); return t; };
    const bedingungen = (s, blatt, zeile) => {
      const teile = txt(s).split(/\s*(?:&|\+|\bund\b|\band\b|\bUND\b|\bAND\b)\s*/).filter(Boolean), out = [];
      for (let t of teile) {
        let op = "ist"; const neg = t.match(/^(?:!|nicht\s+|not\s+|kein(?:e|en)?\s+)(.*)$/i); if (neg) { op = "istNicht"; t = neg[1]; }
        const tr = listeCodes(t).map(c => codeAuf(c, blatt, zeile)).filter(Boolean);
        const nachM = new Map(); for (const x of tr) { if (!nachM.has(x.m.id)) nachM.set(x.m.id, []); nachM.get(x.m.id).push(x.w.id); }
        if (nachM.size > 1) w(blatt, zeile, `„${t}“ mischt Codes verschiedener Merkmale in einer Oder-Bedingung. Sie wurde je Merkmal aufgeteilt (Und-Verknüpfung).`);
        for (const [mid, ws] of nachM) out.push({ merkmal: mid, op, werte: ws });
      }
      return out;
    };
    const geltung = (s, blatt, zeile) => {
      const out = { produkte: [], gruppen: [] };
      for (const c of listeCodes(s)) {
        const n = X.norm(c.replace(/^gruppe\s*:?\s*/i, ""));
        const p = mo.produkte.find(x => X.norm(x.code || x.id) === n || X.norm(x.name) === n), g = mo.gruppen.find(x => X.norm(x.id) === n || X.norm(x.name) === n);
        if (p && !/^gruppe/i.test(c)) out.produkte.push(p.id); else if (g) out.gruppen.push(g.id); else w(blatt, zeile, `„${c}“ ist weder Produkt noch Gruppe.`);
      }
      return out;
    };
    const importiert = [];
    for (const r of zeilen(blaetter, zuo.regeln)) {
      const blatt = bl("regeln"), wenn = bedingungen(r.wenn, blatt, r._zeile);
      const typ = typAus(r.typ), dannCodes = listeCodes(r.dann).map(c => codeAuf(c, blatt, r._zeile)).filter(Boolean);
      if (!wenn.length || !dannCodes.length) { w(blatt, r._zeile, "Regel ohne gültige Wenn- oder Dann-Codes übersprungen."); continue; }
      const nachM = new Map(); for (const x of dannCodes) { if (!nachM.has(x.m.id)) nachM.set(x.m.id, []); nachM.get(x.m.id).push(x.w.id); }
      let teil = 0;
      for (const [mid, ws] of nachM) {
        const basisId = txt(r.id) ? txt(r.id).replace(/[^A-Za-z0-9_-]/g, "") : null;
        const rid = basisId ? basisId + (nachM.size > 1 ? "-" + (++teil) : "") : E.neueId("X", [...mo.regeln.map(x => x.id), ...importiert.map(x => x.id)]);
        importiert.push({ id: rid, name: txt(r.name) || "", aktiv: r.aktiv === undefined || !txt(r.aktiv) ? true : !/^(nein|n|0|false|inaktiv|aus)$/i.test(txt(r.aktiv)),
          ...(r.produkte !== undefined ? geltung(r.produkte, blatt, r._zeile) : { produkte: [], gruppen: [] }), wenn: JSON.parse(JSON.stringify(wenn)), dann: { typ, merkmal: mid, werte: ws }, hinweis: txt(r.hinweis), quelle: "excel" });
        if (wenn.some(c => c.merkmal === mid)) w(blatt, r._zeile, `Regel ${rid}: Bedingung und Folge betreffen dasselbe Merkmal.`);
      }
    }
    // Matrix
    const zm = zuo.matrix;
    if (zm && blaetter[zm.blatt]) {
      const aoa = blaetter[zm.blatt], kopf = aoa[zm.kopfzeile] || [], blatt = zm.blatt;
      const spalten = kopf.map((h, i) => i === 0 || !txt(h) ? null : idx.get(txt(h).toUpperCase())).map((t, i) => t ? { i, ...t } : null).filter(Boolean);
      kopf.forEach((h, i) => { if (i > 0 && txt(h) && !idx.get(txt(h).toUpperCase())) w(blatt, zm.kopfzeile + 1, `Spaltencode „${txt(h)}“ unbekannt.`); });
      aoa.slice(zm.kopfzeile + 1).forEach((r, j) => {
        const c = txt(r?.[0]); if (!c) return; const a = idx.get(c.toUpperCase()); if (!a) { w(blatt, zm.kopfzeile + 2 + j, `Zeilencode „${c}“ unbekannt.`); return; }
        const nachM = new Map();
        for (const s of spalten) { if (s.m.id === a.m.id) continue; if (!nachM.has(s.m.id)) nachM.set(s.m.id, { alle: [], markiert: [] }); const e = nachM.get(s.m.id); e.alle.push(s.w.id); if (ja(r[s.i])) e.markiert.push(s.w.id); }
        for (const [mid, e] of nachM) {
          let typ, ws;
          if (zm.matrixBedeutung === "erlaubt") { if (e.markiert.length === e.alle.length) continue; typ = "nurErlauben"; ws = e.markiert; if (!ws.length) { typ = "sperren"; ws = e.alle; } }
          else { if (!e.markiert.length) continue; typ = "sperren"; ws = e.markiert; }
          importiert.push({ id: `M-${a.w.id}-${mid}`.slice(0, 60), name: `Matrix: ${a.w.name} × ${E.merkmal(mo, mid).name}`, aktiv: true, matrix: true, produkte: [], wenn: [{ merkmal: a.m.id, op: "ist", werte: [a.w.id] }], dann: { typ, merkmal: mid, werte: ws }, hinweis: "", quelle: "excel" });
        }
      });
    }
    // Kombinationstabellen: je Zeile eine erlaubte Kombination aus Codes
    const zk = zuo.kombinationen;
    if (zk && blaetter[zk.blatt]) {
      const blatt = zk.blatt, belegt = new Set(Object.values(zk.felder || {})), tabs = new Map();
      for (const r of zeilen(blaetter, zk)) {
        const tid = txt(r.tabelle).replace(/[^A-Za-z0-9_-]/g, ""); if (!tid) continue;
        const codes = r._roh.map((v, i) => belegt.has(i) ? "" : txt(v)).filter(Boolean);
        const tr = codes.map(c => codeAuf(c, blatt, r._zeile)); if (tr.some(x => !x) || tr.length < 2) continue;
        if (!tabs.has(tid)) tabs.set(tid, { id: tid, name: txt(r.name) || "Kombinationstabelle " + tid, aktiv: true, typ: "tabelle", quelle: "excel", ...(r.produkte !== undefined ? geltung(r.produkte, blatt, r._zeile) : { produkte: [], gruppen: [] }), tabelle: { merkmale: tr.map(x => x.m.id), zeilen: [] } });
        const t = tabs.get(tid).tabelle;
        if (tr.length !== t.merkmale.length || tr.some((x, i) => x.m.id !== t.merkmale[i])) { w(blatt, r._zeile, `Tabelle ${tid}: Codes passen nicht zu den Merkmalen der ersten Zeile (${t.merkmale.map(m => E.merkmal(mo, m).name).join(", ")}).`); continue; }
        t.zeilen.push(tr.map(x => x.w.id));
      }
      importiert.push(...tabs.values());
    }
    if (zuo.regeln || zuo.matrix || zuo.kombinationen) {
      // Regeln aus Excel ersetzen frühere Excel-Regeln; von Hand angelegte bleiben (im Modus "zusammen")
      const ids = new Set(importiert.map(r => r.id));
      mo.regeln = mo.regeln.filter(r => r.quelle !== "excel" && !ids.has(r.id)).concat(importiert);
      stat.regeln = importiert.length;
    }

    // Stückliste
    const stlNeu = new Map();
    for (const r of zeilen(blaetter, zuo.stueckliste)) {
      const c = txt(r.code), nr = txt(r.artnr); if (!c || !nr) continue;
      const t = idx.get(c.toUpperCase()), p = mo.produkte.find(x => X.norm(x.code || x.id) === X.norm(c));
      const ziel = t ? t.w : p; if (!ziel) { w(bl("stueckliste"), r._zeile, `Code „${c}“ unbekannt.`); continue; }
      if (!stlNeu.has(ziel)) stlNeu.set(ziel, []);
      stlNeu.get(ziel).push([nr, txt(r.bez), X.zahl(r.menge) || 1, txt(r.me) || "Stk"]); stat.stueckliste++;
    }
    for (const [ziel, l] of stlNeu) ziel.stl = l;

    // Leere Gruppen aus diesem Import nicht anlegen (keine Artikel, keine Untergruppen)
    const vorher = new Set((basis && modus !== "ersetzen" ? basis.gruppen : []).map(g => g.id));
    for (let runde = 0; runde < 5; runde++) {
      const leer = mo.gruppen.filter(g => !vorher.has(g.id) && !mo.produkte.some(p => p.gruppe === g.id) && !mo.gruppen.some(x => x.eltern === g.id));
      if (!leer.length) break; mo.gruppen = mo.gruppen.filter(g => !leer.includes(g)); stat.gruppen -= leer.length;
      w(bl("katalog"), null, `${leer.length} Gruppen ohne Fahrzeuge wurden nicht angelegt: ${leer.slice(0, 6).map(g => g.name).join(", ")}${leer.length > 6 ? " …" : ""}`);
    }
    // Plausibilität
    for (const m of mo.merkmale) if (!m.werte.length) w("Modell", null, `Merkmal ${m.name} hat keine Codes.`);
    for (const p of mo.produkte) if (!E.zuordnung(mo, p).length) w("Modell", null, `Produkt ${p.name} hat keine Merkmale.`);
    return { modell: mo, warn, stat };
  };

  /* ---------- Export als Tabellen (Vorlage) ---------- */
  X.alsTabellen = mo => {
    const ja1 = b => b ? "ja" : "nein";
    const codeVon = (m, w) => w.code || (m.id + "-" + w.id).toUpperCase();
    const codeZu = (mid, wid) => { const m = E.merkmal(mo, mid), w = m && E.wert(mo, mid, wid); return w ? codeVon(m, w) : wid; };
    const t = {};
    t.Anleitung = [["Importvorlage Fahrzeugkonfigurator"], [""],
      ["Blatt", "Inhalt"],
      ["Katalog", "Produktgruppen. „Übergeordnet“ verweist auf den Gruppen-Code der Obergruppe."],
      ["Produkte", "Grundfahrzeuge mit Code, Gruppe, Grundpreis, Kosten."],
      ["Merkmale", "Bereich = Reiter im Konfigurator (z. B. Grundmaschine, Optionen). Auswahl: einfach/mehrfach. Darstellung: kacheln, liste, auswahl, option. Pflicht: ja/nein."],
      ["Codes", "Ein Vertriebscode je Zeile. „Feldtyp“: Auswahl, Ja/Nein, Zahl, Freitext oder Fest enthalten. Danach steht je Produkt eine Spalte: X = verfügbar, S = Standard, leer = nicht verfügbar."],
      ["Regeln", "Wenn: Codes; mit Komma = oder, mit & = und, „nicht“ davor = ausgeschlossen. Typ: sperrt, erlaubt nur, setzt (erfordert). Dann: Codes eines Merkmals. Gilt für: Produkt-Codes oder „Gruppe <Gruppen-Code>“, leer = alle."],
      ["Matrix", "Optional: Codes in Zeilen gegen Codes in Spalten, X = schließt aus (oder beim Import „X = erlaubt“ wählen)."],
      ["Kombinationen", "Kombinationstabellen: je Zeile eine erlaubte Kombination aus Codes (eine Spalte je Merkmal). Alle Zeilen mit gleicher Tabellen-Nr. bilden eine Tabelle; nicht aufgeführte Kombinationen sind gesperrt."],
      ["Stückliste", "Je Zeile eine Komponente zu einem Vertriebs- oder Produkt-Code."]];
    t.Katalog = [["Gruppen-Code", "Gruppe", "Übergeordnet"], ...mo.gruppen.map(g => [g.id, g.name, g.eltern || ""])];
    t.Produkte = [["Produkt-Code", "Bezeichnung", "Gruppe", "Grundpreis", "Kosten", "Artikelnr.", "Beschreibung", "Aktiv"], ...mo.produkte.map(p => [p.code || p.id, p.name, p.gruppe, p.basispreis, p.basiskosten, p.artnr || "", p.beschreibung || "", ja1(p.aktiv !== false)])];
    t.Merkmale = [["Merkmal-Code", "Merkmal", "Bereich", "Abschnitt", "Auswahl", "Darstellung", "Pflicht", "Multiplikator", "Info"], ...mo.merkmale.map(m => [m.code || m.id, m.name, E.bereich(m), m.abschnitt || "", m.typ === "mehrfach" ? "mehrfach" : "einfach", E.darstellung(m), ja1(m.pflicht), m.multiplikator ? (E.merkmal(mo, m.multiplikator)?.code || m.multiplikator) : "", m.info || ""])];
    const prods = mo.produkte;
    t.Codes = [["Vertriebscode", "Merkmal", "Bezeichnung", "Preis", "Kosten", "Menge", "Farbe", "3D-Teil", "Info", "Feldtyp", ...prods.map(p => p.code || p.id)]];
    for (const m of mo.merkmale) for (const w of m.werte) t.Codes.push([codeVon(m, w), m.code || m.id, w.name, w.preis || 0, w.kosten || 0, w.menge ?? "", w.hex || "", w.teil || "", w.info || "", (E.WERTTYPEN.find(x => x[0] === E.wertTyp(m, w)) || ["", ""])[1],
      ...prods.map(p => { const z = E.zuordnung(mo, p).find(x => x.id === m.id); if (!z) return ""; const ok = !z.werte || !z.werte.length || z.werte.includes(w.id); if (!ok) return ""; const std = z.standard && z.standard.split(",").includes(w.id); return std ? "S" : "X"; })]);
    const typT = { sperren: "sperrt", nurErlauben: "erlaubt nur", setzen: "setzt" };
    const geltungText = r => [...(r.produkte || []).map(id => E.produkt(mo, id)?.code || id), ...(r.gruppen || []).map(id => "Gruppe " + id)].join(", ");
    t.Regeln = [["Regel", "Name", "Wenn", "Typ", "Dann", "Gilt für", "Hinweis", "Aktiv"], ...mo.regeln.filter(r => r.dann && r.wenn?.length).map(r => [r.id, r.name || "",
      r.wenn.map(c => (c.op === "istNicht" ? "nicht " : "") + c.werte.map(x => codeZu(c.merkmal, x)).join(", ")).join(" & "), typT[r.dann.typ] || "sperrt",
      r.dann.werte.map(x => codeZu(r.dann.merkmal, x)).join(", "), geltungText(r), r.hinweis || "", ja1(r.aktiv)])];
    const tabellen = mo.regeln.filter(r => r.typ === "tabelle" && r.tabelle?.merkmale?.length);
    const maxM = Math.max(2, ...tabellen.map(r => r.tabelle.merkmale.length));
    t.Kombinationen = [["Tabelle", "Name", "Gilt für", ...Array.from({ length: maxM }, (_, i) => "Code " + (i + 1))]];
    for (const r of tabellen) for (const z of r.tabelle.zeilen) t.Kombinationen.push([r.id, r.name || "", geltungText(r), ...z.map((w, i) => codeZu(r.tabelle.merkmale[i], w))]);
    t["Stückliste"] = [["Code", "Artikelnr.", "Bezeichnung", "Menge", "ME"]];
    for (const p of prods) for (const z of p.stl || []) t["Stückliste"].push([p.code || p.id, ...z]);
    for (const m of mo.merkmale) for (const w of m.werte) for (const z of w.stl || []) t["Stückliste"].push([codeVon(m, w), ...z]);
    return t;
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = X; return; }
  const K = root.KONF; K.X = X;

  /* =====================================================================
     Oberfläche: Studio → Excel-Import
     ===================================================================== */
  const esc = K.esc, S = () => K.Store.S;
  K.imp = { schritt: "datei", datei: null, blaetter: null, zuo: null, modus: "zusammen", ergebnis: null, fehler: null };
  const TYPEN = Object.keys(X.FELDER);
  const FELDNAMEN = { tabelle: "Tabellen-Nr.", code: "Code", name: "Bezeichnung", eltern: "Übergeordnet", gruppe: "Gruppe", basispreis: "Grundpreis", basiskosten: "Kosten", artnr: "Artikelnr.", beschreibung: "Beschreibung",
    bereich: "Bereich (Reiter)", abschnitt: "Abschnitt", typ: "Auswahl einfach/mehrfach", darstellung: "Darstellung", pflicht: "Pflicht", multiplikator: "Multiplikator", info: "Info",
    merkmal: "Merkmal", preis: "Preis", kosten: "Kosten", menge: "Menge", hex: "Farbe (Hex)", teil: "3D-Teil", id: "Regel-Nr.", wenn: "Wenn (Codes)", dann: "Dann (Codes)", produkte: "Gilt für", hinweis: "Hinweis", aktiv: "Aktiv", bez: "Bezeichnung", me: "ME" };

  async function dateiLesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek (SheetJS) ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" });
    const blaetter = {};
    for (const n of wb.SheetNames) blaetter[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return blaetter;
  }

  K.route("studio-import-vorlage", () => {
    const i = K.imp, ro = !K.Store.schreiben, mo = S().entwurf;
    const kopf = `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Expertenimport</h2><p>Produktfamilie mit Vertriebscodes, Preisen, Verfügbarkeit je Produkt, Regeln und Stückliste aus Excel übernehmen. Der Import landet im Entwurf; der Vertrieb sieht ihn erst nach der Freigabe.</p></div>
      <div class="row"><a class="btn" href="#studio-import-struktur">Zum einfachen Listen-Import</a><button class="btn" type="button" data-act="excelVorlage">Aktuelles Modell als Excel exportieren</button></div></div>`;
    const schritte = [["datei", "Datei"], ["zuordnung", "Zuordnung"], ["vorschau", "Prüfen"], ["fertig", "Übernommen"]];
    const leiste = `<ol class="schritte">${schritte.map(([id, n], j) => `<li class="${i.schritt === id ? "aktiv" : schritte.findIndex(s => s[0] === i.schritt) > j ? "erledigt" : ""}">${j + 1}. ${n}</li>`).join("")}</ol>`;
    if (ro) return kopf + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (i.schritt === "datei") {
      return kopf + leiste + `<section class="panel upload">
        <label class="ablage" for="xl-datei"><b>Excel-Datei wählen</b><span class="gedimmt">.xlsx, .xlsm, .xls oder .csv · oder hierher ziehen</span><input id="xl-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="excelDatei"></label>
        ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}
        <div class="zwei-spalten klein"><div><h3>Was erkannt wird</h3><ul class="punkte">
          <li><b>Codes</b>: ein Vertriebscode je Zeile mit Merkmal, Bezeichnung, Preis. Spalten mit Produkt-Codes im Kopf werden als Verfügbarkeit gelesen (X = verfügbar, S = Standard).</li>
          <li><b>Regeln</b>: Wenn-Codes, Typ (sperrt, erlaubt nur, setzt/erfordert), Dann-Codes. Komma = oder, &amp; = und, „nicht“ = Ausschluss.</li>
          <li><b>Matrix</b>: Codes gegen Codes mit Kreuzen.</li>
          <li><b>Produkte, Merkmale, Katalog, Stückliste</b>: optional.</li></ul></div>
          <div><h3>Tipp</h3><p class="gedimmt">Exportieren Sie das aktuelle Modell als Excel. Die Datei zeigt genau das erwartete Format und lässt sich bearbeitet wieder importieren. Weichen Ihre Tabellen ab, ordnen Sie im nächsten Schritt Blätter und Spalten selbst zu. Die Zuordnung wird für den nächsten Import gespeichert.</p></div></div>
      </section>`;
    }
    if (i.schritt === "zuordnung") {
      const blattOpt = aktiv => `<option value="">nicht vorhanden</option>${Object.keys(i.blaetter).map(n => `<option value="${esc(n)}" ${n === aktiv ? "selected" : ""}>${esc(n)}</option>`).join("")}`;
      const karten = TYPEN.map(typ => {
        const z = i.zuo[typ] || { blatt: "", kopfzeile: 0, felder: {} }, aoa = z.blatt ? i.blaetter[z.blatt] : null, kopfz = aoa ? aoa[z.kopfzeile] || [] : [];
        const spOpt = aktiv => `<option value="">–</option>${kopfz.map((h, j) => `<option value="${j}" ${aktiv === j ? "selected" : ""}>${esc(String.fromCharCode(65 + (j % 26)))}: ${esc(String(h).slice(0, 40) || "(leer)")}</option>`).join("")}`;
        const felder = Object.keys(X.FELDER[typ].felder);
        const prodSp = typ === "codes" && aoa ? kopfz.map((h, j) => ({ h: String(h).trim(), j })).filter(x => x.h && !Object.values(z.felder).includes(x.j)) : [];
        return `<section class="panel zuo-karte${z.blatt ? "" : " leer-karte"}"><div class="panelkopf"><h3>${X.FELDER[typ].name}</h3>
          <select id="zb-${typ}" data-act="zuoBlatt" data-t="${typ}" aria-label="Blatt für ${X.FELDER[typ].name}">${blattOpt(z.blatt)}</select></div>
          ${z.blatt ? `<div class="formgitter eng">
            <div class="feld"><label for="zk-${typ}">Kopfzeile</label><input id="zk-${typ}" type="number" min="1" data-chg="zuoKopf" data-t="${typ}" value="${z.kopfzeile + 1}"></div>
            ${felder.map(f => `<div class="feld"><label for="zf-${typ}-${f}">${FELDNAMEN[f] || f}${X.FELDER[typ].pflicht.includes(f) ? " *" : ""}</label><select id="zf-${typ}-${f}" data-act="zuoFeld" data-t="${typ}" data-f="${f}">${spOpt(z.felder[f])}</select></div>`).join("")}
            ${typ === "matrix" ? `<div class="feld breit"><label for="zm-bed">Markierte Zellen bedeuten</label><select id="zm-bed" data-act="zuoMatrix"><option value="sperrt" ${z.matrixBedeutung !== "erlaubt" ? "selected" : ""}>Kombination ausgeschlossen</option><option value="erlaubt" ${z.matrixBedeutung === "erlaubt" ? "selected" : ""}>Kombination erlaubt (alles andere gesperrt)</option></select></div>` : ""}
          </div>
          ${prodSp.length ? `<div class="feld"><label>Weitere Spalten (als Produkt-Verfügbarkeit gelesen, wenn der Kopf ein Produkt-Code ist)</label><div class="chipwahl">${prodSp.map(x => `<button type="button" class="chipbtn" data-act="zuoProd" data-h="${esc(x.h)}" aria-pressed="${(z.produktSpalten || []).includes(x.h) || (S().entwurf?.produkte || []).some(p => X.norm(p.code || p.id) === X.norm(x.h))}">${esc(x.h)}</button>`).join("")}</div></div>` : ""}
          <div class="tabwrap ohne-rand vorschau-tab"><table class="kompakt"><tbody>${(aoa || []).slice(z.kopfzeile, z.kopfzeile + 4).map((r, j) => `<tr class="${j ? "" : "kopfreihe"}">${(r || []).slice(0, 12).map(c => `<td>${esc(String(c).slice(0, 30))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
          : `<p class="klein gedimmt">Nicht zugeordnet.</p>`}</section>`;
      }).join("");
      return kopf + leiste + `<div class="row zwischen" style="margin-bottom:12px"><span><b>${esc(i.datei)}</b> · ${Object.keys(i.blaetter).length} Blätter</span>
        <span class="row"><button class="btn" type="button" data-act="impZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="impPruefen">Prüfen</button></span></div>
        <div class="zuo-gitter">${karten}</div>`;
    }
    if (i.schritt === "vorschau") {
      const e = i.ergebnis, st = e.stat, diff = K.unterschiede ? K.unterschiede(mo, e.modell) : [];
      const tests = e.modell.produkte.slice(0, 40).map(p => ({ p, t: E.modelltest(e.modell, p, 40000) }));
      const gruppiert = {}; for (const x of e.warn) (gruppiert[x.blatt] ||= []).push(x);
      return kopf + leiste + `<div class="kpis">
        <div class="kpi"><b class="num">${st.produkte}</b><span>Produkte gelesen</span></div><div class="kpi"><b class="num">${st.codes}</b><span>Vertriebscodes</span></div>
        <div class="kpi"><b class="num">${st.regeln}</b><span>Regeln</span></div><div class="kpi ${e.warn.length ? "schlecht" : "gut"}"><b class="num">${e.warn.length}</b><span>Hinweise</span></div></div>
        <div class="zwei-spalten">
          <section class="panel"><div class="panelkopf"><h3>Änderungen am Entwurf</h3><span class="chip">${diff.length}</span></div>
            <div class="feld"><label for="imp-modus">Vorgehen</label><select id="imp-modus" data-act="impModus"><option value="zusammen" ${i.modus === "zusammen" ? "selected" : ""}>Zusammenführen: Codes aktualisieren, Bestehendes behalten</option><option value="ersetzen" ${i.modus === "ersetzen" ? "selected" : ""}>Ersetzen: Entwurf komplett aus der Datei neu aufbauen</option></select></div>
            ${diff.length ? `<ul class="diffliste lang">${diff.slice(0, 200).map(d => `<li><span class="chip diff-${d.art === "neu" ? "neu" : d.art === "gelöscht" ? "weg" : "mod"}">${d.art}</span><span class="gedimmt">${d.bereich}</span> ${esc(d.text)}</li>`).join("")}${diff.length > 200 ? `<li class="gedimmt">… und ${diff.length - 200} weitere</li>` : ""}</ul>` : `<p class="leer-klein">Keine Änderungen gegenüber dem Entwurf.</p>`}
          </section>
          <section class="panel"><div class="panelkopf"><h3>Hinweise</h3></div>
            ${e.warn.length ? Object.entries(gruppiert).map(([b, l]) => `<details ${l.length < 12 ? "open" : ""}><summary><b>${esc(b)}</b> · ${l.length}</summary><ul class="warnliste">${l.slice(0, 150).map(x => `<li>${x.zeile ? `<span class="mono">Z. ${x.zeile}</span> ` : ""}${esc(x.text)}</li>`).join("")}</ul></details>`).join("") : `<div class="hinweis ok">Keine Auffälligkeiten.</div>`}
            <h3 style="margin-top:8px">Modelltest nach dem Import</h3>
            <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Produkt</th><th class="r">Kombinationen</th><th class="r">gültig</th><th>Probleme</th></tr></thead><tbody>
            ${tests.map(({ p, t }) => `<tr><td>${esc(p.name)}</td><td class="r num">${K.zahl(t.total)}</td><td class="r num">${K.zahl(t.gueltig)}</td><td>${t.widersprueche ? `<span class="chip warn">${K.zahl(t.widersprueche)} Widersprüche</span> ` : ""}${t.tote.length ? `<span class="chip warn" title="${esc(t.tote.map(x => x.wert).join(", "))}">${t.tote.length} unerreichbar</span>` : ""}${!t.widersprueche && !t.tote.length ? `<span class="chip st-angenommen">ok</span>` : ""}</td></tr>`).join("")}</tbody></table></div>
          </section></div>
        <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn" type="button" data-act="impZurueck" data-s="zuordnung">Zurück zur Zuordnung</button><button class="btn gelb" type="button" data-act="impUebernehmen">In den Entwurf übernehmen</button></div>`;
    }
    const st = i.ergebnis?.stat || {};
    return kopf + leiste + `<section class="panel"><div class="hinweis ok"><b>Import übernommen.</b> ${st.produkte || 0} Produkte, ${st.codes || 0} Codes und ${st.regeln || 0} Regeln stehen jetzt im Entwurf.</div>
      <div class="row"><a class="btn" href="#studio-produkte">Produkte ansehen</a><a class="btn" href="#studio-regeln">Regeln ansehen</a><a class="btn primary" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="impZurueck" data-s="datei">Weitere Datei importieren</button></div></section>`;
  });

  K.act.excelDatei = async el => {
    const f = el.files[0]; if (!f) return;
    try {
      const bl = await dateiLesen(f);
      Object.assign(K.imp, { datei: f.name, blaetter: bl, zuo: X.zuordnungVorschlagen(bl, S().einst?.importZuordnung), schritt: "zuordnung", fehler: null });
    } catch (e) { console.error(e); K.imp.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import-vorlage" && K.imp.schritt === "datei") { e.preventDefault(); } });
  document.addEventListener("drop", e => {
    if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import-vorlage" || K.imp.schritt !== "datei") return; e.preventDefault();
    const f = e.dataTransfer?.files?.[0]; if (f) K.act.excelDatei({ files: [f] });
  });
  K.act.zuoBlatt = el => {
    const t = el.dataset.t, n = el.value;
    if (!n) delete K.imp.zuo[t];
    else { const aoa = K.imp.blaetter[n], kz = X.kopfzeile(aoa, t); K.imp.zuo[t] = { blatt: n, kopfzeile: kz, felder: X.FELDER[t] ? X.spaltenRaten(aoa[kz] || [], t) : {}, matrixBedeutung: "sperrt" }; }
    K.render();
  };
  K.inp.zuoKopf = el => { const z = K.imp.zuo[el.dataset.t]; const aoa = K.imp.blaetter[z.blatt]; z.kopfzeile = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); z.felder = X.spaltenRaten(aoa[z.kopfzeile] || [], el.dataset.t); K.render(); };
  K.act.zuoFeld = el => { const z = K.imp.zuo[el.dataset.t]; if (el.value === "") delete z.felder[el.dataset.f]; else z.felder[el.dataset.f] = +el.value; K.render(); };
  K.act.zuoMatrix = el => { K.imp.zuo.matrix.matrixBedeutung = el.value; };
  K.act.zuoProd = el => { const z = K.imp.zuo.codes; z.produktSpalten = z.produktSpalten || []; const h = el.dataset.h; z.produktSpalten = z.produktSpalten.includes(h) ? z.produktSpalten.filter(x => x !== h) : [...z.produktSpalten, h]; K.render(); };
  K.act.impZurueck = el => { K.imp.schritt = el.dataset.s; K.render(); };
  K.act.impModus = el => { K.imp.modus = el.value; K.act.impPruefen(); };
  K.act.impPruefen = () => {
    const i = K.imp;
    for (const [t, z] of Object.entries(i.zuo)) { const fehlt = X.FELDER[t].pflicht.filter(f => z.felder[f] == null); if (fehlt.length) { K.toast(`${X.FELDER[t].name}: bitte Spalte für ${fehlt.map(f => FELDNAMEN[f] || f).join(", ")} wählen.`); return; } }
    if (!i.zuo.codes && !i.zuo.regeln && !i.zuo.matrix && !i.zuo.produkte) { K.toast("Bitte mindestens ein Blatt für Codes, Produkte oder Regeln zuordnen."); return; }
    try {
      i.ergebnis = X.umwandeln(i.blaetter, i.zuo, S().entwurf, i.modus); i.schritt = "vorschau";
      for (const x of (K.artikelFehlend ? K.artikelFehlend(i.ergebnis.modell) : [])) i.ergebnis.warn.push({ blatt: "Artikelstamm", zeile: null, text: `${x.code} (${x.wo}) ist nicht in ARTIKEL.` });
    }
    catch (e) { console.error(e); K.toast("Fehler beim Umwandeln: " + e.message); }
    K.render();
  };
  K.act.impUebernehmen = async () => {
    const i = K.imp, st = i.ergebnis.stat, mo = i.ergebnis.modell;
    mo.version = S().entwurf?.version || S().live?.version || 0;
    K.Store.S.entwurf = mo;
    K.Store.entwurfGeaendert();
    // Zuordnung mit Spaltennamen speichern, damit der nächste Import sie wiederfindet
    const e = S().einst; e.importZuordnung = {};
    for (const [t, z] of Object.entries(i.zuo)) { const kopf = i.blaetter[z.blatt][z.kopfzeile] || []; e.importZuordnung[t] = { blatt: z.blatt, matrixBedeutung: z.matrixBedeutung, spaltenNamen: Object.fromEntries(Object.entries(z.felder).map(([f, j]) => [f, String(kopf[j] ?? "")])) }; }
    await K.Store.einstSpeichern(e, true);
    await K.Store.log("Import", `Excel „${i.datei}“ importiert (${i.modus === "ersetzen" ? "ersetzt" : "zusammengeführt"}): ${st.produkte} Produkte, ${st.codes} Codes, ${st.regeln} Regeln`);
    i.schritt = "fertig"; i.blaetter = null; K.render(); K.toast("Import im Entwurf gespeichert");
  };
  K.act.excelVorlage = async () => {
    const mo = S().entwurf; if (!mo) return;
    try { await K.lib("xlsx"); } catch (e) { return K.toast("Die Excel-Bibliothek (SheetJS) ist nicht erreichbar."); }
    const t = X.alsTabellen(mo), wb = window.XLSX.utils.book_new();
    for (const [n, aoa] of Object.entries(t)) {
      const ws = window.XLSX.utils.aoa_to_sheet(aoa);
      ws["!cols"] = (aoa[0] || []).map((_, j) => ({ wch: Math.min(48, Math.max(8, ...aoa.slice(0, 200).map(r => String(r[j] ?? "").length + 2))) }));
      if (n !== "Anleitung") ws["!autofilter"] = { ref: window.XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(1, aoa.length - 1), c: (aoa[0] || []).length - 1 } }) };
      window.XLSX.utils.book_append_sheet(wb, ws, n);
    }
    const buf = window.XLSX.write(wb, { bookType: "xlsx", type: "array" });
    K.speichereDatei(`Produktmodell_${new Date().toISOString().slice(0, 10)}.xlsx`, new Blob([buf]));
  };
})(typeof window !== "undefined" ? window : globalThis);
