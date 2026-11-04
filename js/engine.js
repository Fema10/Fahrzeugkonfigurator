/* =========================================================================
   Konfigurations-Engine
   Reine Logik ohne Oberfläche: Regeln auswerten, ungültige Auswahl bereinigen,
   Preis/Kosten/Stückliste berechnen, Modelltest. Läuft im Browser (K.E) und
   in Node (module.exports), damit Tests und Datenimporte dieselbe Logik nutzen.

   Datenmodell (kommt später aus APplus-Queries):
   modell = {
     version, gruppen:[{id,name}],
     produkte:[{id,name,gruppe,artnr,basispreis,basiskosten,beschreibung,aktiv,
                visual:{typ,asset}, stl:[[artnr,bez,menge,me]],
                merkmale:[{id, werte:[ids]|null}] }],
     merkmale:[{id,name,abschnitt,typ:"einfach"|"mehrfach",multiplikator?,
                werte:[{id,name,preis,kosten,menge?,hex?,teil?,stl:[[...]]}]}],
     regeln:[{id,name,aktiv,produkte:[ids],
              wenn:[{merkmal,op:"ist"|"istNicht",werte:[ids]}],
              dann:{typ:"sperren"|"nurErlauben",merkmal,werte:[ids]},
              hinweis}]
   }
   sel = { merkmalId: wertId | [wertIds] }
   ========================================================================= */
(function (root) {
  const E = {};

  E.merkmal = (mo, mid) => mo.merkmale.find(m => m.id === mid);
  E.wert = (mo, mid, wid) => E.merkmal(mo, mid)?.werte.find(w => w.id === wid);
  E.produkt = (mo, pid) => mo.produkte.find(p => p.id === pid);

  /** Merkmale eines Produkts mit den dort zugelassenen Werten, in Produktreihenfolge. */
  /* ---------- Vererbung: Familie → Unterfamilie → Artikel ----------
     Familien (mo.gruppen) und Artikel (mo.produkte) tragen eine Liste von Zuordnungen
     { id: merkmalId, werte: [wertIds] | null, standard?, aus? }.
     Weiter unten stehende Zuordnungen überschreiben: werte (Einschränkung), standard,
     aus: true entfernt ein geerbtes Merkmal. Neue Merkmale werden hinten angehängt. */
  E.gruppenPfad = (mo, gid) => { const out = []; let g = (mo.gruppen || []).find(x => x.id === gid), n = 0; while (g && n++ < 30) { out.unshift(g); g = mo.gruppen.find(x => x.id === g.eltern); } return out; };
  function zuordnungAnwenden(liste, idx, z, quelle) {
    if (idx.has(z.id)) {
      const e = liste[idx.get(z.id)];
      if (z.aus) { e.aus = true; e.ausVon = quelle; return; }
      e.aus = false;
      if (z.werte && z.werte.length) { e.werte = z.werte.slice(); e.werteVon = quelle; }
      if (z.standard) { e.standard = z.standard; e.standardVon = quelle; }
      e.angepasst = true;
    } else if (!z.aus) { idx.set(z.id, liste.length); liste.push({ id: z.id, werte: z.werte && z.werte.length ? z.werte.slice() : null, standard: z.standard || null, herkunft: quelle, werteVon: quelle, standardVon: z.standard ? quelle : null }); }
  }
  /** Wirksame Zuordnungen eines Artikels oder einer Familie (ohne ausgeschlossene, mit "alle"=true auch diese) */
  E.zuordnung = (mo, obj, alle) => {
    const istFamilie = !("basispreis" in obj) && !("gruppe" in obj);
    const pfad = istFamilie ? E.gruppenPfad(mo, obj.id) : E.gruppenPfad(mo, obj.gruppe);
    const liste = [], idx = new Map();
    for (const g of pfad) for (const z of g.merkmale || []) zuordnungAnwenden(liste, idx, z, "g:" + g.id);
    if (!istFamilie) for (const z of obj.merkmale || []) zuordnungAnwenden(liste, idx, z, "p:" + obj.id);
    // Reihenfolge: die tiefste Ebene mit eigener Reihenfolge gewinnt
    const r = (!istFamilie && obj.reihenfolge) || [...pfad].reverse().find(g => g.reihenfolge)?.reihenfolge;
    if (r && r.length) { const pos = id => { const i = r.indexOf(id); return i < 0 ? 1e6 + liste.findIndex(e => e.id === id) : i; }; liste.sort((a, b) => pos(a.id) - pos(b.id)); }
    return alle ? liste : liste.filter(e => !e.aus);
  };
  /** Familien/Artikel aus den Regel-Geltungsbereichen entfernen. Regeln, die danach für niemanden mehr
      gelten würden, werden gelöscht (sonst würden sie plötzlich für alle Produkte gelten). Liefert die Zahl gelöschter Regeln. */
  E.ausGeltungEntfernen = (mo, gids = [], pids = []) => {
    const g = new Set(gids), p = new Set(pids), vorher = mo.regeln.length;
    mo.regeln = mo.regeln.filter(r => {
      const hatte = (r.gruppen || []).length + (r.produkte || []).length;
      if (r.gruppen) r.gruppen = r.gruppen.filter(x => !g.has(x));
      if (r.produkte) r.produkte = r.produkte.filter(x => !p.has(x));
      return !hatte || (r.gruppen || []).length + (r.produkte || []).length > 0;
    });
    return vorher - mo.regeln.length;
  };
  E.hatMerkmal = (mo, prod, mid) => E.zuordnung(mo, prod).some(e => e.id === mid);
  E.produktMerkmale = (mo, prod) => !prod ? [] : E.zuordnung(mo, prod).map(z => {
    const m = E.merkmal(mo, z.id);
    if (!m) return null;
    const werte = z.werte && z.werte.length ? m.werte.filter(w => z.werte.includes(w.id)) : m.werte.slice();
    return { m, werte, standard: z.standard || null, herkunft: z.herkunft };
  }).filter(Boolean);
  /** Alle Artikel unterhalb einer Familie (inkl. Unterfamilien) */
  E.familienArtikel = (mo, gid) => mo.produkte.filter(p => E.gruppenKette(mo, p).includes(gid));
  /** Merkmale, die alle Artikel einer Familie haben, an die Familie übergeben.
      Abweichungen (andere Werte, eigener Standard) bleiben am Artikel. Liefert die Anzahl übergebener Merkmale. */
  E.hochziehen = (mo, gid) => {
    const g = mo.gruppen.find(x => x.id === gid), arts = E.familienArtikel(mo, gid); if (!g || !arts.length) return 0;
    const eff = new Map(arts.map(p => [p.id, E.zuordnung(mo, p)]));
    const vorher = new Map(arts.map(p => [p.id, eff.get(p.id).map(e => e.id).join(",")]));
    const erste = eff.get(arts[0].id).map(e => e.id), gemeinsam = erste.filter(mid => arts.every(p => eff.get(p.id).some(e => e.id === mid)));
    const vorhanden = new Set((g.merkmale || []).map(z => z.id)); let n = 0;
    const elternG = mo.gruppen.find(x => x.id === g.eltern), elternEff = elternG ? E.zuordnung(mo, elternG) : [];
    const unter = mo.gruppen.filter(x => x.id !== gid && E.gruppenPfad(mo, x.id).some(y => y.id === gid));
    for (const mid of gemeinsam) {
      const m = E.merkmal(mo, mid); if (!m) continue;
      const union = new Set(); for (const p of arts) { const e = eff.get(p.id).find(x => x.id === mid); (e.werte || m.werte.map(w => w.id)).forEach(w => union.add(w)); }
      const famWerte = union.size === m.werte.length ? null : m.werte.map(w => w.id).filter(w => union.has(w));
      const stds = new Set(arts.map(p => eff.get(p.id).find(x => x.id === mid).standard || ""));
      const famStd = stds.size === 1 ? [...stds][0] || null : null;
      // aus Unterfamilien und Artikeln entfernen, an Familie setzen
      for (const u of unter) u.merkmale = (u.merkmale || []).filter(z => z.id !== mid);
      g.merkmale = (g.merkmale || []).filter(z => z.id !== mid);
      // nur eintragen, wenn es sich vom Geerbten unterscheidet
      const vonOben = elternEff.find(x => x.id === mid), alleIds = m.werte.map(w => w.id);
      const gleichOben = vonOben && (vonOben.werte || alleIds).join(",") === (famWerte || alleIds).join(",") && (vonOben.standard || null) === famStd;
      if (!gleichOben) g.merkmale.push({ id: mid, werte: famWerte, ...(famStd && famStd !== vonOben?.standard ? { standard: famStd } : {}) });
      for (const p of arts) {
        const e = eff.get(p.id).find(x => x.id === mid);
        p.merkmale = (p.merkmale || []).filter(z => z.id !== mid);
        const pw = e.werte || null, gleich = (pw ? pw.length : m.werte.length) === union.size;
        if (!gleich || (e.standard && e.standard !== famStd)) p.merkmale.push({ id: mid, werte: gleich ? null : pw, ...(e.standard && e.standard !== famStd ? { standard: e.standard } : {}) });
      }
      if (!vorhanden.has(mid)) n++;
    }
    // Reihenfolge der Familie wie beim ersten Artikel; weicht ein Artikel danach ab, behält er seine eigene
    g.merkmale.sort((a, b) => erste.indexOf(a.id) - erste.indexOf(b.id));
    for (const p of arts) { delete p.reihenfolge; const neu = E.zuordnung(mo, p).map(e => e.id).join(","); if (neu !== vorher.get(p.id)) p.reihenfolge = vorher.get(p.id).split(","); }
    // gleiche Reihenfolge aller Artikel einer Familie an die Familie übergeben
    for (const fam of new Set(arts.map(p => p.gruppe))) {
      const ps = mo.produkte.filter(p => p.gruppe === fam), r = ps[0]?.reihenfolge?.join(",");
      if (r && ps.every(p => p.reihenfolge?.join(",") === r)) { mo.gruppen.find(x => x.id === fam).reihenfolge = ps[0].reihenfolge; ps.forEach(p => delete p.reihenfolge); }
    }
    return n;
  };

  const alsListe = v => Array.isArray(v) ? v : (v == null ? [] : [v]);

  const aktivWert = v => v === true || (typeof v === "number" && v > 0) || (typeof v === "string" && v.trim() !== "");
  function bedingungErfuellt(c, sel) {
    if (!(c.merkmal in sel) && !Object.keys(sel).some(k => k.startsWith(c.merkmal + "."))) return false;
    const hit = alsListe(sel[c.merkmal]).some(x => (c.werte || []).includes(x)) || (c.werte || []).some(w => aktivWert(sel[c.merkmal + "." + w]));
    return c.op === "istNicht" ? !hit : hit;
  }

  /** Greift die Regel für dieses Produkt und diese Auswahl? */
  /** Gruppenkette eines Produkts (eigene Gruppe und alle übergeordneten) */
  E.gruppenKette = (mo, prod) => {
    const out = []; let g = (mo.gruppen || []).find(x => x.id === prod.gruppe), n = 0;
    while (g && n++ < 30) { out.push(g.id); g = mo.gruppen.find(x => x.id === g.eltern); }
    return out;
  };
  /** Gilt die Regel für dieses Produkt? Ohne Angabe für alle; sonst Produkt direkt oder über eine (Ober-)Gruppe */
  E.imGeltungsbereich = (mo, r, prod) => {
    const p = r.produkte || [], g = r.gruppen || [];
    if (!p.length && !g.length) return true;
    if (p.includes(prod.id)) return true;
    return g.length > 0 && E.gruppenKette(mo, prod).some(x => g.includes(x));
  };
  E.regelGreift = (r, prod, sel, mo) => {
    if (!r.aktiv) return false;
    if (mo ? !E.imGeltungsbereich(mo, r, prod) : (r.produkte && r.produkte.length && !r.produkte.includes(prod.id) && !(r.gruppen || []).length)) return false;
    if (r.typ === "tabelle") return true;
    if (!r.wenn || !r.wenn.length) return false;
    return r.wenn.every(c => bedingungErfuellt(c, sel));
  };

  /** Gesperrte Werte: { merkmalId: { wertId: regel } }
      "setzen" sperrt bei Einfachauswahl alle anderen Werte (wie "nurErlauben"). */
  E.sperren = (mo, prod, sel, pm) => {
    pm = pm || E.produktMerkmale(mo, prod);
    const erlaubt = Object.fromEntries(pm.map(x => [x.m.id, x.werte.map(w => w.id)]));
    const mehr = Object.fromEntries(pm.map(x => [x.m.id, x.m.typ === "mehrfach"]));
    const g = {};
    for (const r of mo.regeln) {
      if (r.typ === "tabelle") { tabelleSperren(mo, r, prod, sel, erlaubt, g); continue; }
      if (!r.dann || !(r.dann.merkmal in erlaubt) || !E.regelGreift(r, prod, sel, mo)) continue;
      let ids;
      if (r.dann.typ === "nurErlauben" || (r.dann.typ === "setzen" && !mehr[r.dann.merkmal])) ids = erlaubt[r.dann.merkmal].filter(x => !(r.dann.werte || []).includes(x));
      else if (r.dann.typ === "setzen") ids = [];
      else ids = r.dann.werte || [];
      for (const w of ids) { (g[r.dann.merkmal] ||= {}); g[r.dann.merkmal][w] ||= r; }
    }
    return g;
  };

  /** Kombinationstabelle: nur die aufgeführten Wertekombinationen sind erlaubt.
      Für jedes Merkmal der Tabelle bleiben die Werte wählbar, die in einer Zeile stehen,
      die zu den bereits gewählten Werten der anderen Tabellenmerkmale passt. */
  function tabelleSperren(mo, r, prod, sel, erlaubt, g) {
    const t = r.tabelle; if (!r.aktiv || !t || !t.merkmale?.length || !E.imGeltungsbereich(mo, r, prod)) return;
    const ms = t.merkmale.filter(m => m in erlaubt); if (ms.length < 2) return;
    const idx = ms.map(m => t.merkmale.indexOf(m));
    for (let i = 0; i < ms.length; i++) {
      const passend = (t.zeilen || []).filter(z => ms.every((o, j) => j === i || sel[o] == null || Array.isArray(sel[o]) || z[idx[j]] === sel[o]));
      const ok = new Set(passend.map(z => z[idx[i]]));
      for (const w of erlaubt[ms[i]]) if (!ok.has(w)) { (g[ms[i]] ||= {}); g[ms[i]][w] ||= r; }
    }
  }

  /** Von Regeln automatisch gesetzte Werte: { merkmalId: { wertId: regel } } */
  E.gesetzt = (mo, prod, sel, pm) => {
    pm = pm || E.produktMerkmale(mo, prod);
    const erlaubt = Object.fromEntries(pm.map(x => [x.m.id, x.werte.map(w => w.id)]));
    const g = {};
    for (const r of mo.regeln) {
      if (r.dann?.typ !== "setzen" || !(r.dann.merkmal in erlaubt) || !E.regelGreift(r, prod, sel, mo)) continue;
      for (const w of r.dann.werte || []) if (erlaubt[r.dann.merkmal].includes(w)) { (g[r.dann.merkmal] ||= {}); g[r.dann.merkmal][w] ||= r; }
    }
    return g;
  };

  /** Feldtypen eines Merkmals (wie in CPQ-Standards: Auswahl, Mehrfachauswahl, Ja/Nein, Zahl, Text, fester Inhalt) */
  E.FELDTYPEN = [
    ["kacheln", "Auswahl als Kacheln", "genau ein Code, große Kacheln mit Bild"],
    ["liste", "Auswahl als Liste", "genau ein Code, Optionsfelder untereinander"],
    ["dropdown", "Auswahl als Dropdown", "genau ein Code, platzsparend bei vielen Codes"],
    ["janein", "Ja/Nein", "ein Code zum Ankreuzen, z. B. Arbeitsscheinwerfer"],
    ["mehrfach", "Mehrfachauswahl", "beliebig viele Codes ankreuzen, z. B. Zubehör"],
    ["zahl", "Zahl", "Eingabe einer Menge oder eines Maßes, Preis je Einheit"],
    ["text", "Freitext", "z. B. Beschriftung, Kundenwunsch; optional mit Code und Preis"],
    ["fest", "Fest enthalten", "alle Codes immer enthalten, nur Anzeige"]];
  const SPEZIAL = new Set(["zahl", "text", "fest"]);
  /** Feldtyp je Wert (Vertriebscode). „auswahl“ = gehört zur Auswahl der Gruppe, die anderen stehen für sich. */
  E.WERTTYPEN = [
    ["auswahl", "Auswahl", "Teil der Auswahl dieser Gruppe (eine oder mehrere, je nach Gruppe)"],
    ["janein", "Ja/Nein", "eigenes Häkchen, unabhängig von der Auswahl"],
    ["zahl", "Zahl", "Menge oder Maß eingeben, Preis gilt je Einheit"],
    ["text", "Freitext", "Text eingeben, z. B. Beschriftung; Preis fällt an, sobald Text da ist"],
    ["fest", "Fest enthalten", "immer dabei (Grundausstattung), nur Anzeige"]];
  /** Wie die Auswahl-Werte einer Gruppe angeboten werden */
  E.GRUPPENTYPEN = [["kacheln", "eine Auswahl · Kacheln"], ["liste", "eine Auswahl · Liste"], ["dropdown", "eine Auswahl · Dropdown"], ["mehrfach", "mehrere wählbar"]];
  E.wertTyp = (m, w) => (w && w.feld) || (SPEZIAL.has(m.typ) ? m.typ : "auswahl");
  E.schluessel = (m, w) => m.id + "." + w.id;
  E.wahlWerte = (m, werte) => (werte || m.werte).filter(w => E.wertTyp(m, w) === "auswahl");
  E.aktiv = (sel, m, w) => E.wertTyp(m, w) === "auswahl" ? alsListe(sel[m.id]).includes(w.id) : aktivWert(sel[E.schluessel(m, w)]);
  E.wertTypSetzen = (w, t) => { if (t === "auswahl") delete w.feld; else w.feld = t; if (t === "zahl") w.zahl = Object.assign({ min: 0, max: null, schritt: 1, einheit: "Stk", standard: 0 }, w.zahl || {}); if (t === "text") w.text = Object.assign({ maxLaenge: 60, hinweis: "" }, w.text || {}); };
  E.gruppentyp = m => { const f = E.feldtyp(m); return f === "janein" ? "mehrfach" : SPEZIAL.has(f) ? "liste" : f; };
  E.feldtyp = m => {
    if (SPEZIAL.has(m.typ)) return m.typ;
    if (m.typ === "mehrfach") return m.feld === "mehrfach" ? "mehrfach" : m.feld === "janein" || m.werte.length === 1 ? "janein" : "mehrfach";
    const d = m.darstellung || (m.werte.length > 6 ? "auswahl" : "liste");
    return d === "kacheln" ? "kacheln" : d === "auswahl" ? "dropdown" : "liste";
  };
  E.feldtypSetzen = (m, t) => {
    if (SPEZIAL.has(t) || t === "janein") { for (const w of m.werte) E.wertTypSetzen(w, t); if (t === "janein") { m.typ = "mehrfach"; m.feld = "mehrfach"; m.darstellung = "option"; } else { m.typ = "mehrfach"; m.feld = "mehrfach"; delete m.darstellung; } return; }
    const art = { kacheln: ["einfach", "kacheln"], liste: ["einfach", "liste"], dropdown: ["einfach", "auswahl"], janein: ["mehrfach", "option"], mehrfach: ["mehrfach", "option"] }[t];
    if (art) { m.typ = art[0]; m.darstellung = art[1]; } else { m.typ = t; delete m.darstellung; }
    m.feld = t;
    if (t === "zahl") m.zahl = Object.assign({ min: 0, max: null, schritt: 1, einheit: "Stk", standard: 0 }, m.zahl || {});
    if (t === "text") m.text = Object.assign({ maxLaenge: 60, hinweis: "" }, m.text || {});
  };
  E.istSpezial = m => SPEZIAL.has(m.typ);
  /** Darstellung im Konfigurator, mit sinnvollem Standard */
  E.darstellung = m => m.darstellung || (m.typ === "mehrfach" ? "option" : m.werte.length > 6 ? "auswahl" : "liste");
  E.bereich = m => m.bereich || (m.typ === "mehrfach" ? "Optionen" : "Grundmaschine");

  /** Pflichtmerkmale ohne Auswahl */
  E.offenePflicht = (mo, prod, sel) => E.produktMerkmale(mo, prod).filter(x => x.m.pflicht && x.m.typ !== "mehrfach" && E.wahlWerte(x.m, x.werte).length && (sel[x.m.id] == null || sel[x.m.id] === "")).map(x => x.m);

  /** Vertriebscode → { m, w } */
  E.codeIndex = mo => {
    const map = new Map();
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) map.set(String(w.code).toUpperCase(), { m, w });
    return map;
  };

  E.aktiveRegeln = (mo, prod, sel) => mo.regeln.filter(r => r.typ === "tabelle" ? (r.aktiv && E.imGeltungsbereich(mo, r, prod) && (r.tabelle?.merkmale || []).filter(m => m in sel).length >= 2) : E.regelGreift(r, prod, sel, mo));

  /** Ungültig gewordene Werte durch den ersten gültigen ersetzen. `fest` bleibt unangetastet. */
  E.bereinige = (mo, prod, sel, fest) => {
    const pm = E.produktMerkmale(mo, prod), notes = [];
    // fehlende Merkmale ergänzen, fremde Werte entfernen. Pflichtmerkmale bleiben offen (null).
    for (const { m, werte: alleW, standard } of pm) {
      for (const w of alleW) {
        const t = E.wertTyp(m, w), k = E.schluessel(m, w); if (t === "auswahl") { delete sel[k]; continue; }
        if (t === "janein") sel[k] = sel[k] === undefined ? !!(w.vorgabe || (standard && String(standard).split(",").includes(w.id))) : !!sel[k];
        else if (t === "fest") sel[k] = true;
        else if (t === "text") sel[k] = typeof sel[k] === "string" ? sel[k].slice(0, (w.text && w.text.maxLaenge) || 200) : (w.text?.standard || "");
        else if (t === "zahl") { const z = w.zahl || {}; let v = sel[k] === "" || sel[k] == null ? (z.standard ?? 0) : Number(sel[k]); if (!isFinite(v)) v = z.standard ?? 0; if (z.min != null && v < z.min) v = z.min; if (z.max != null && v > z.max) v = z.max; sel[k] = v; }
      }
      const werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
      if (!werte.length) { delete sel[m.id]; continue; }
      const ids = werte.map(w => w.id);
      if (m.typ === "zahl") { const z = m.zahl || {}; let v = sel[m.id] === "" || sel[m.id] == null ? (m.pflicht ? null : (z.standard ?? 0)) : Number(sel[m.id]); if (v != null) { if (!isFinite(v)) v = z.standard ?? 0; if (z.min != null && v < z.min) v = z.min; if (z.max != null && v > z.max) v = z.max; } sel[m.id] = v; continue; }
      if (m.typ === "text") { sel[m.id] = typeof sel[m.id] === "string" ? sel[m.id].slice(0, (m.text && m.text.maxLaenge) || 200) : ""; continue; }
      if (m.typ === "fest") { sel[m.id] = ids.slice(); continue; }
      if (m.typ === "mehrfach") sel[m.id] = sel[m.id] === undefined && standard ? standard.split(",").filter(x => ids.includes(x)) : alsListe(sel[m.id]).filter(x => ids.includes(x));
      else if (!ids.includes(sel[m.id])) sel[m.id] = m.pflicht ? null : (standard && ids.includes(standard) ? standard : ids[0]);
    }
    for (const k of Object.keys(sel)) { const [mid, wid] = k.split("."); const x = pm.find(y => y.m.id === mid); if (!x || (wid && !x.werte.some(w => w.id === wid && E.wertTyp(x.m, w) !== "auswahl"))) delete sel[k]; }
    for (let i = 0; i < 40; i++) {
      let geaendert = false;
      // 1) "setzt"-Regeln anwenden
      const gs = E.gesetzt(mo, prod, sel, pm);
      for (const { m } of pm) {
        if (!gs[m.id]) continue;
        // Ja/Nein-Werte, die eine Regel setzt
        for (const [wid, r] of Object.entries(gs[m.id])) { const w = E.wert(mo, m.id, wid); if (w && E.wertTyp(m, w) === "janein" && sel[E.schluessel(m, w)] !== true) { sel[E.schluessel(m, w)] = true; notes.push({ merkmal: m.name, von: "–", nach: w.name, regel: r.id }); geaendert = true; } }
        if (SPEZIAL.has(m.typ) || !sel.hasOwnProperty(m.id)) continue;
        for (const [wid, r] of Object.entries(gs[m.id])) {
          if (E.wertTyp(m, E.wert(mo, m.id, wid)) !== "auswahl") continue;
          if (m.typ === "mehrfach") { if (!sel[m.id].includes(wid)) { sel[m.id] = [...sel[m.id], wid]; notes.push({ merkmal: m.name, von: "–", nach: E.wert(mo, m.id, wid).name, regel: r.id }); geaendert = true; } }
          else if (sel[m.id] !== wid && m.id !== fest) { notes.push({ merkmal: m.name, von: sel[m.id] ? E.wert(mo, m.id, sel[m.id]).name : "offen", nach: E.wert(mo, m.id, wid).name, regel: r.id }); sel[m.id] = wid; geaendert = true; }
          break;
        }
      }
      // 2) gesperrte Werte ersetzen: von hinten nach vorn und nach jeder Änderung neu rechnen,
      //    damit bei Kombinationstabellen das später stehende Merkmal angepasst wird
      if (geaendert) continue;
      const g = E.sperren(mo, prod, sel, pm);
      for (const { m, werte: alleW } of [...pm].reverse()) {
        if (geaendert) break;
        if (!g[m.id]) continue;
        // gesperrte Ja/Nein-, Zahl- und Textwerte zurücksetzen
        for (const w of alleW) { const t = E.wertTyp(m, w), k = E.schluessel(m, w); if (t === "auswahl" || t === "fest" || !g[m.id][w.id] || !aktivWert(sel[k])) continue; notes.push({ merkmal: m.name, von: w.name, nach: "entfernt", regel: g[m.id][w.id].id }); sel[k] = t === "janein" ? false : t === "zahl" ? 0 : ""; geaendert = true; }
        const werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
        if (geaendert || m.id === fest || SPEZIAL.has(m.typ) || !werte.length) continue;
        if (m.typ === "mehrfach") {
          const raus = sel[m.id].filter(x => g[m.id][x]);
          if (raus.length) {
            for (const x of raus) notes.push({ merkmal: m.name, von: E.wert(mo, m.id, x).name, nach: "entfernt", regel: g[m.id][x].id });
            sel[m.id] = sel[m.id].filter(x => !g[m.id][x]); geaendert = true;
          }
          continue;
        }
        const r = sel[m.id] != null && g[m.id][sel[m.id]];
        if (r) {
          const alt = m.pflicht ? null : werte.find(w => !g[m.id][w.id]);
          const einzig = werte.filter(w => !g[m.id][w.id]);
          if (m.pflicht && einzig.length !== 1) { notes.push({ merkmal: m.name, von: E.wert(mo, m.id, sel[m.id]).name, nach: "bitte neu wählen", regel: r.id }); sel[m.id] = null; geaendert = true; }
          else if (alt || einzig.length === 1) { const n = alt || einzig[0]; notes.push({ merkmal: m.name, von: E.wert(mo, m.id, sel[m.id]).name, nach: n.name, regel: r.id }); sel[m.id] = n.id; geaendert = true; }
        }
      }
      if (!geaendert) break;
    }
    return notes;
  };

  E.standardSel = (mo, prod) => { const s = {}; E.bereinige(mo, prod, s); return s; };

  /** Ist die Auswahl gültig? Liefert Konflikte. */
  E.pruefe = (mo, prod, sel) => {
    const g = E.sperren(mo, prod, sel), k = [];
    for (const [mid, v] of Object.entries(sel)) for (const x of alsListe(v)) if (g[mid]?.[x]) k.push({ merkmal: mid, wert: x, regel: g[mid][x].id });
    return k;
  };

  function faktor(mo, m, sel) {
    if (!m.multiplikator) return 1;
    if (E.merkmal(mo, m.multiplikator)?.typ === "zahl") return Math.max(0, Number(sel[m.multiplikator]) || 0);
    const w = E.wert(mo, m.multiplikator, sel[m.multiplikator]);
    return w && w.menge ? w.menge : 1;
  }

  /** Preis- und Kostenzeilen einer Konfiguration. */
  /** Preis eines Codes je Produktgruppe: Artikel > Unterfamilie > Familie > Preis am Wert */
  E.gruppenPreis = (objs, w) => {
    if (!w || !w.code) return null; const c = String(w.code).toUpperCase();
    for (let i = objs.length - 1; i >= 0; i--) { const pr = objs[i] && objs[i].preise; if (pr && pr[c] != null) return { preis: pr[c], von: objs[i] }; }
    return null;
  };
  E.wertPreis = (mo, prod, w) => { if (!w) return 0; const o = prod ? E.gruppenPreis([...E.gruppenPfad(mo, prod.gruppe), prod], w) : null; return o ? o.preis : (w.preis || 0); };
  E.wertPreisGruppe = (mo, gid, w) => { if (!w) return 0; const o = E.gruppenPreis(E.gruppenPfad(mo, gid), w); return o ? o.preis : (w.preis || 0); };
  E.preis = (mo, prod, sel) => {
    const zeilen = [{ mid: "_basis", merkmal: "Grundfahrzeug", text: prod.name, preis: prod.basispreis || 0, kosten: prod.basiskosten || 0 }];
    for (const { m, werte } of E.produktMerkmale(mo, prod)) {
      const f = faktor(mo, m, sel), ue = m.ueberschrift || m.abschnitt || "";
      const gewaehlt = new Set(alsListe(sel[m.id]));
      for (const w of werte) {
        const t = E.wertTyp(m, w), v = sel[E.schluessel(m, w)], basis = { mid: m.id, wid: w.id, code: w.code || "", merkmal: m.name, ueberschrift: ue };
        if (t === "auswahl" ? !gewaehlt.has(w.id) : !aktivWert(v)) continue;
        if (t === "zahl") { const e = (w.zahl && w.zahl.einheit) || ""; zeilen.push({ ...basis, text: `${w.name}: ${String(v).replace(".", ",")} ${e}`.trim(), preis: Math.round(E.wertPreis(mo, prod, w) * v * f), kosten: Math.round((w.kosten || 0) * v * f), menge: v }); continue; }
        if (t === "text") { zeilen.push({ ...basis, text: `${w.name}: „${String(v).trim()}“`, preis: Math.round(E.wertPreis(mo, prod, w) * f), kosten: Math.round((w.kosten || 0) * f) }); continue; }
        zeilen.push({ mid: m.id, wid: w.id, code: w.code || "", merkmal: m.name, ueberschrift: m.ueberschrift || m.abschnitt || "", text: w.name + (f > 1 && (w.preis || w.kosten) ? ` (× ${f})` : ""),
          preis: Math.round(E.wertPreis(mo, prod, w) * f), kosten: Math.round((w.kosten || 0) * f) });
      }
    }
    const einzel = zeilen.reduce((a, z) => a + z.preis, 0), kosten = zeilen.reduce((a, z) => a + z.kosten, 0);
    return { zeilen, einzel, kosten };
  };

  E.stueckliste = (mo, prod, sel) => {
    const map = new Map();
    const add = (z, herkunft, f) => {
      const [nr, bez, menge, me] = z, q = Math.round(menge * f * 100) / 100;
      if (map.has(nr)) map.get(nr).menge += q; else map.set(nr, { nr, bez, menge: q, me, herkunft });
    };
    for (const z of prod.stl || []) add(z, "Grundfahrzeug", 1);
    for (const { m } of E.produktMerkmale(mo, prod)) {
      const f = faktor(mo, m, sel);
      for (const w of m.werte) {
        if (!E.aktiv(sel, m, w)) continue; const t = E.wertTyp(m, w), n = t === "zahl" ? Number(sel[E.schluessel(m, w)]) || 0 : 1;
        for (const z of w.stl || []) add(z, m.name + ": " + w.name, f * n);
      }
    }
    return [...map.values()];
  };

  /** Summen eines Angebots inkl. Kalkulation. */
  E.summen = (a, mwst = 19) => {
    let liste = 0, nachPos = 0, kosten = 0;
    const pos = (a.positionen || []).map(p => {
      const brutto = (p.einzel || 0) * (p.menge || 0), rab = Math.round(brutto * (p.rabatt || 0)) / 100, ges = brutto - rab;
      liste += brutto; nachPos += ges; kosten += (p.kosten || 0) * (p.menge || 0);
      return { ...p, gesamt: ges };
    });
    const gRab = Math.round(nachPos * (a.rabatt || 0)) / 100, netto = nachPos - gRab, ust = Math.round(netto * mwst) / 100;
    const db = netto - kosten;
    return { pos, liste, posRabatt: liste - nachPos, gesamtRabatt: gRab, netto, kosten, db, marge: netto ? db / netto * 100 : 0, ust, brutto: netto + ust };
  };

  /** Regel als deutscher Satz. */
  E.satz = (mo, r) => {
    if (r.typ === "tabelle") {
      const t = r.tabelle || { merkmale: [], zeilen: [] }, namen = t.merkmale.map(m => E.merkmal(mo, m)?.name || m);
      let alle = 1; for (const m of t.merkmale) alle *= (E.merkmal(mo, m)?.werte.length || 1);
      return `Nur ${t.zeilen.length} von ${alle} Kombinationen aus ${namen.join(", ")} sind erlaubt.`;
    }
    const nm = (mid, ids) => { const m = E.merkmal(mo, mid); return { m: m ? m.name : mid, w: (ids || []).map(id => E.wert(mo, mid, id)?.name || id) }; };
    const oder = l => l.length <= 1 ? (l[0] || "…") : l.slice(0, -1).join(", ") + " oder " + l[l.length - 1];
    const wenn = (r.wenn || []).map(c => { const x = nm(c.merkmal, c.werte); return `${x.m} ${c.op === "istNicht" ? "nicht" : "ist"} ${oder(x.w)}`; }).join(" und ");
    const d = r.dann ? nm(r.dann.merkmal, r.dann.werte) : { m: "…", w: [] };
    const und = l => l.length <= 1 ? (l[0] || "…") : l.slice(0, -1).join(", ") + " und " + l[l.length - 1];
    const dann = r.dann?.typ === "nurErlauben" ? `ist bei ${d.m} nur ${oder(d.w)} erlaubt` : r.dann?.typ === "setzen" ? `wird bei ${d.m} ${und(d.w)} automatisch gewählt` : `ist bei ${d.m} ${oder(d.w)} gesperrt`;
    return `Wenn ${wenn || "…"}, dann ${dann}.`;
  };

  /** Modelltest: alle Kombinationen der Einfach-Merkmale durchrechnen. */
  E.modelltest = (mo, prod, limit = 400000) => {
    const pm = E.produktMerkmale(mo, prod), einfach = pm.filter(x => x.m.typ !== "mehrfach"), mehr = pm.filter(x => x.m.typ === "mehrfach");
    let total = 1; for (const x of einfach) total *= x.werte.length;
    const res = { total, geprueft: 0, gueltig: 0, widersprueche: 0, beispielWiderspruch: null, abgebrochen: total > limit };
    const erreichbar = {}, gefeuert = {};
    for (const { m } of pm) erreichbar[m.id] = new Set();
    const idx = einfach.map(() => 0);
    const sel = {}; for (const x of mehr) sel[x.m.id] = [];
    const n = Math.min(total, limit);
    for (let c = 0; c < n; c++) {
      einfach.forEach((x, i) => sel[x.m.id] = x.werte[idx[i]].id);
      const g = E.sperren(mo, prod, sel, pm);
      for (const r of mo.regeln) if (r.typ !== "tabelle" && E.regelGreift(r, prod, sel, mo)) gefeuert[r.id] = (gefeuert[r.id] || 0) + 1;
      for (const [mid, ws] of Object.entries(g)) for (const r of Object.values(ws)) if (r.typ === "tabelle") gefeuert[r.id] = (gefeuert[r.id] || 0) + 1;
      const ok = einfach.every(x => !g[x.m.id]?.[sel[x.m.id]]);
      const leer = pm.find(x => x.werte.length && x.m.typ !== "mehrfach" && x.werte.every(w => g[x.m.id]?.[w.id]));
      if (leer) { res.widersprueche++; if (!res.beispielWiderspruch) res.beispielWiderspruch = { sel: { ...sel }, merkmal: leer.m.name }; }
      if (ok) {
        res.gueltig++;
        einfach.forEach(x => erreichbar[x.m.id].add(sel[x.m.id]));
        for (const x of mehr) for (const w of x.werte) if (!g[x.m.id]?.[w.id]) erreichbar[x.m.id].add(w.id);
      }
      res.geprueft++;
      for (let i = einfach.length - 1; i >= 0; i--) { idx[i]++; if (idx[i] < einfach[i].werte.length) break; idx[i] = 0; }
    }
    res.tote = [];
    for (const { m, werte } of pm) for (const w of werte) if (!erreichbar[m.id].has(w.id)) res.tote.push({ merkmal: m.name, mid: m.id, wert: w.name, wid: w.id });
    const relevant = mo.regeln.filter(r => r.aktiv && E.imGeltungsbereich(mo, r, prod));
    res.regeln = relevant.map(r => {
      const mehrBed = (r.wenn || []).some(c => mehr.some(x => x.m.id === c.merkmal));
      return { id: r.id, name: r.name, treffer: gefeuert[r.id] || 0, nurMitZubehoer: mehrBed };
    });
    return res;
  };

  E.neueId = (prefix, vorhandene) => {
    let i = 1; const set = new Set(vorhandene);
    while (set.has(prefix + String(i).padStart(2, "0"))) i++;
    return prefix + String(i).padStart(2, "0");
  };

  E.slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "x";

  if (typeof module !== "undefined" && module.exports) module.exports = E;
  else { root.KONF = root.KONF || {}; root.KONF.E = E; }
})(typeof window !== "undefined" ? window : globalThis);
