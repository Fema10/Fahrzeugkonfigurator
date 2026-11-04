/* =========================================================================
   Einfacher Import einer Produktliste
   Aufbau der Liste (eine Tabelle, beliebige Reihenfolge der Spalten):
     Geschäftsart | Produktfamilie | Variante | (Merkmal) | Vertriebscode | (Bezeichnung) | (Preis) …
   - Leere Zellen in Geschäftsart, Familie, Variante, Merkmal gelten wie die Zeile darüber.
   - Zeilen ohne Code, aber mit Text, sind Zwischenüberschriften (= Merkmal).
   - Alternativ eine Spalte je Variante mit X (verfügbar) bzw. S (Standard).
   - Fehlende Bezeichnung oder Preis werden aus dem Artikelstamm (ARTIKEL) ergänzt.
   Ergebnis im Modell:
     Geschäftsart → Familie (oberste Ebene), Produktfamilie → Unterfamilie,
     Variante → konfigurierbarer Artikel, Vertriebscodes → Werte ihrer Merkmale.
   Teil 1 ist reine Logik (auch in Node testbar), Teil 2 die Oberfläche.
   ========================================================================= */
(function (root) {
  const L = {};
  const node = typeof module !== "undefined" && module.exports;
  const E = node ? require("./engine.js") : root.KONF.E;
  const norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  const txt = v => String(v ?? "").trim();
  const zahl = v => { if (typeof v === "number") return v; let s = txt(v).replace(/[€\s]|EUR/gi, ""); if (!s || s === "-") return null; if (/,\d{1,2}$/.test(s) || (s.includes(",") && s.includes("."))) s = s.replace(/\./g, "").replace(",", "."); else s = s.replace(/,/g, "."); const n = parseFloat(s); return isFinite(n) ? n : null; };
  const ja = v => /^(x|ja|j|yes|y|1|true|wahr|s|std|standard|o|opt|optional|●|✓|✔)$/i.test(txt(v));
  const istStd = v => /^(s|std|standard|serie)$/i.test(txt(v));
  const ALLE = /^(alle|\*|alle varianten|allgemein|familie)$/i;

  /* ---------- Spaltenrollen ---------- */
  L.ROLLEN = [
    ["ga", "Geschäftsart", ["geschaeftsart", "geschaeftsbereich", "geschaeftsfeld", "sparte", "segment", "anwendung", "branche", "bereich"]],
    ["familie", "Produktfamilie", ["produktfamilie", "familie", "baureihe", "produktlinie", "modellreihe", "typreihe", "serie", "produktgruppe"]],
    ["variante", "Variante", ["variante", "varianten", "variantenbezeichnung", "ausfuehrung", "modell", "typ", "fahrzeug", "fahrzeugtyp"]],
    ["variantNr", "Artikelnummer der Variante", ["artikelnummerdervariante", "artikelnrdervariante", "nummerdervariante", "variantenartikelnr", "variantenr", "variantennummer", "variantenartikel", "variantenartikelnummer", "fahrzeugnummer", "fahrzeugartikel", "grundartikel", "kmat", "grundmaschine", "variantennr"]],
    ["variantPreis", "Grundpreis der Variante", ["grundpreis", "basispreis", "fahrzeugpreis", "variantenpreis", "grundpreisvariante"]],
    ["merkmal", "Merkmal (Gruppe der Codes)", ["merkmal", "merkmale", "merkmalgruppe", "optionsgruppe", "optionsart", "kategorie", "baugruppe", "kapitel", "gruppe"]],
    ["code", "Vertriebscode (Artikelnummer)", ["vertriebscode", "vertriebscodes", "vkcode", "verkaufscode", "salescode", "optionscode", "code", "artikelnummer", "artikelnr", "artikel", "option"]],
    ["name", "Bezeichnung des Codes", ["bezeichnung", "text", "beschreibung", "kurztext", "name", "optionstext", "artikelbezeichnung"]],
    ["preis", "Preis des Codes", ["preis", "vkpreis", "listenpreis", "aufpreis", "verkaufspreis", "vk", "preiseur"]],
    ["kosten", "Kosten des Codes", ["kosten", "ek", "ekpreis", "herstellkosten", "selbstkosten"]],
    ["standard", "Standard (ja/nein)", ["standard", "serienmaessig", "default", "vorbelegung", "std"]],
    ["xvariante", "Spalte einer Variante (X = verfügbar)", []],
    ["", "nicht verwenden", []]
  ];
  L.rollenName = Object.fromEntries(L.ROLLEN.map(r => [r[0], r[1]]));

  L.kopfzeile = aoa => {
    const syn = L.ROLLEN.flatMap(r => r[2]); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(15, aoa.length); i++) {
      const z = aoa[i] || [], s = z.filter(c => syn.includes(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0);
      if (s > bs) { bs = s; best = i; }
    }
    return best;
  };
  /** Rolle je Spalte raten. istVariante(h) prüft, ob ein Spaltenkopf eine bekannte Variante ist. */
  L.raten = (aoa, kz, istVariante) => {
    const kopf = aoa[kz] || [], daten = aoa.slice(kz + 1, kz + 60), rollen = kopf.map(() => ""), belegt = new Set();
    const n = kopf.map(norm);
    for (const [rolle, , syn] of L.ROLLEN) {
      if (!syn.length) continue;
      let i = -1;
      for (const s of syn) { i = n.findIndex((h, j) => h === s && !rollen[j]); if (i >= 0) break; }
      if (i < 0) for (const s of syn) { if (s.length < 4) continue; i = n.findIndex((h, j) => h && h.includes(s) && !rollen[j]); if (i >= 0) break; }
      if (i >= 0 && !belegt.has(rolle)) { rollen[i] = rolle; belegt.add(rolle); }
    }
    // "… der Variante" / "Varianten…" mit Nummer oder Artikel im Namen
    if (!belegt.has("variantNr")) n.forEach((h, j) => { if (!belegt.has("variantNr") && /variante/.test(h) && /(artikel|nummer|nr)/.test(h) && rollen[j] !== "variante") { if (rollen[j] === "code") belegt.delete("code"); rollen[j] = "variantNr"; belegt.add("variantNr"); } });
    // Spalten mit fast nur X/S/leer → Variante als Spalte
    kopf.forEach((h, j) => {
      if (rollen[j] || !txt(h)) return;
      const werte = daten.map(r => txt(r?.[j])).filter(Boolean);
      if ((werte.length && werte.every(v => /^(x|s|o|ja|nein|-|●|✓)$/i.test(v))) || (istVariante && istVariante(txt(h)))) rollen[j] = "xvariante";
    });
    return gruppenRollenPruefen(aoa, kz, rollen);
  };
  /** Eine Spalte taugt nur als Familie/Geschäftsart/Gruppe, wenn sich ihre Werte wiederholen (sonst ist es Text je Code) */
  L.gruppenSpalteOk = (aoa, kz, j) => {
    const w = aoa.slice(kz + 1, kz + 400).map(r => txt(r?.[j])).filter(Boolean); if (w.length < 6) return true;
    return new Set(w.map(norm)).size <= Math.max(6, w.length * 0.3);
  };
  const gruppenRollenPruefen = (aoa, kz, rollen) => rollen.map((r, j) => ["ga", "familie", "merkmal"].includes(r) && !L.gruppenSpalteOk(aoa, kz, j) ? "" : r);
  L.praefix = c => { const s = txt(c).toUpperCase(); const m = s.match(/^([A-ZÄÖÜ]+)[-_ .]?(?=\d|[-_ .])/) || s.match(/^([A-ZÄÖÜ]+)-/); return m ? m[1] : (/[\d\W_]/.test(s) ? s.replace(/[\d\W_].*$/, "") : s.slice(0, 1)) || s.slice(0, 1); };

  /**
   * Liste → Zusammenstellung (neutral, im Assistenten änderbar)
   * opts: { fuellen: true, artikel: code => {name, preis, kosten} | null }
   */
  L.zusammenstellen = (aoa, kz, rollen, opts = {}) => {
    const fuellen = opts.fuellen !== false, art = opts.artikel || (() => null);
    const idx = r => rollen.indexOf(r), hat = r => idx(r) >= 0, wert = (row, r) => hat(r) ? row[idx(r)] : "";
    const xs = rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
    const kopf = aoa[kz] || [];
    const zs = { ga: new Map(), fam: new Map(), var: new Map(), merkmale: new Map(), codes: new Map(), warn: [], zeilen: 0 };
    const w = (zeile, text) => zs.warn.push({ zeile, text });
    let cGa = "", cFam = "", cVar = "", cVarNr = "", cM = "";
    const merkmalKey = name => { const k = norm(name) || "ohne"; if (!zs.merkmale.has(k)) zs.merkmale.set(k, { key: k, name: txt(name) || "Ohne Merkmal", mehrfach: /zubehoer|option|ausstattung|extras|sonder/.test(k), auto: false }); return k; };
    const famKey = (ga, fam) => (ga ? norm(ga) + "/" : "") + (norm(fam) || "import");
    const varAnlegen = (fk, nr, name, zeile) => {
      const key = fk + "|" + (norm(nr) || norm(name));
      if (!zs.var.has(key)) {
        const a = art(nr) || art(name);
        zs.var.set(key, { key, fam: fk, code: txt(nr) || (a ? a.code : txt(name)), name: txt(name) && txt(name) !== txt(nr) ? txt(name) : (a?.name || txt(name) || txt(nr)), preis: null, kosten: null, zeile });
        if (a && !txt(nr)) zs.var.get(key).code = a.code;
      }
      return key;
    };
    const famAnlegen = (ga, fam) => {
      if (ga && !zs.ga.has(norm(ga))) zs.ga.set(norm(ga), { key: norm(ga), name: txt(ga) });
      const fk = famKey(ga, fam); if (!zs.fam.has(fk)) zs.fam.set(fk, { key: fk, name: txt(fam) || txt(ga) || "Import", ga: ga ? norm(ga) : null });
      return fk;
    };
    aoa.slice(kz + 1).forEach((row, i) => {
      const zeile = kz + 2 + i; if (!row || !row.some(c => txt(c))) return;
      zs.zeilen++;
      const ga = txt(wert(row, "ga")), fam = txt(wert(row, "familie")), va = txt(wert(row, "variante")), vnr = txt(wert(row, "variantNr")), mk = txt(wert(row, "merkmal")), code = txt(wert(row, "code"));
      // Ebenenwechsel setzt die darunterliegenden Ebenen zurück
      if (ga && ga !== cGa) { cGa = ga; cFam = ""; cVar = ""; cVarNr = ""; cM = ""; }
      if (fam && fam !== cFam) { cFam = fam; cVar = ""; cVarNr = ""; cM = ""; }
      if ((va && va !== cVar) || (vnr && vnr !== cVarNr)) { cVar = va || (vnr && !va ? "" : cVar); cVarNr = vnr || (va ? "" : cVarNr); cM = ""; }
      if (mk) cM = mk;
      const eGa = ga || (fuellen ? cGa : ""), eFam = fam || (fuellen ? cFam : ""), eVa = va || (fuellen ? cVar : ""), eVnr = vnr || (fuellen ? cVarNr : ""), eM = mk || (fuellen ? cM : "");
      if (!hat("familie") && !hat("ga") && !eFam) cFam = "Import";
      const fk = famAnlegen(eGa, eFam || (hat("familie") ? "" : (hat("ga") ? eGa : "Import")));
      // Variante dieser Zeile ("alle" oder leer bei fehlender Variantenspalte = ganze Familie)
      let vk = null;
      if ((eVa || eVnr) && !ALLE.test(eVa)) vk = varAnlegen(fk, eVnr, eVa, zeile);
      if (vk && hat("variantPreis")) { const p = zahl(wert(row, "variantPreis")); const v = zs.var.get(vk); if (p != null && v.preis == null) v.preis = p; }
      if (!code) {
        // Zwischenüberschrift ohne Merkmal-Spalte
        const t = txt(wert(row, "name")); if (t && !hat("merkmal") && !va && !vnr) cM = t;
        return;
      }
      const ck = code.toUpperCase();
      let c = zs.codes.get(ck);
      const a = art(code);
      if (!c) { c = { code, name: "", preis: null, kosten: null, merkmal: eM ? merkmalKey(eM) : null, varianten: new Set(), famAlle: new Set(), std: new Set(), zeile }; zs.codes.set(ck, c); }
      else if (eM && c.merkmal && c.merkmal !== norm(eM)) w(zeile, `Code ${code} steht bei „${eM}“ und bei „${zs.merkmale.get(c.merkmal)?.name}“. Er wird beim ersten Merkmal geführt.`);
      if (!c.merkmal && eM) c.merkmal = merkmalKey(eM);
      if (!c.name) c.name = txt(wert(row, "name")) || a?.name || "";
      if (c.preis == null) c.preis = hat("preis") ? zahl(wert(row, "preis")) : null;
      if (c.preis == null && a?.preis) c.preis = a.preis;
      if (c.kosten == null) c.kosten = hat("kosten") ? zahl(wert(row, "kosten")) : (a?.kosten ?? null);
      const std = hat("standard") && ja(wert(row, "standard"));
      if (xs.length) {
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const xk = varAnlegen(fk, "", txt(kopf[j]), zeile); c.varianten.add(xk); if (istStd(v)) c.std.add(xk); }
      }
      if (vk) { c.varianten.add(vk); if (std) c.std.add(vk); }
      else if (!xs.length) c.famAlle.add(fk);
    });
    // Familien ohne Variante: Familie selbst wird zur Variante
    for (const f of zs.fam.values()) if (![...zs.var.values()].some(v => v.fam === f.key)) {
      const vk = varAnlegen(f.key, "", f.name, null);
      for (const c of zs.codes.values()) if (c.famAlle.has(f.key)) { c.varianten.add(vk); c.famAlle.delete(f.key); }
    }
    // Codes ohne Merkmal: zuerst aus dem bestehenden Modell, sonst nach Code-Anfang gruppieren
    if (opts.merkmalVon) { let n = 0; for (const c of zs.codes.values()) if (!c.merkmal) { const t = opts.merkmalVon(c.code); if (t) { c.merkmal = merkmalKey(t.name); zs.merkmale.get(c.merkmal).mehrfach = t.mehrfach; n++; } } if (n) w(null, `${n} Codes ohne Merkmal wurden dem Merkmal zugeordnet, in dem sie im Modell schon stehen.`); }
    const ohne = [...zs.codes.values()].filter(c => !c.merkmal);
    if (ohne.length) {
      for (const c of ohne) { const p = L.praefix(c.code), k = merkmalKey("Codes " + p); zs.merkmale.get(k).auto = true; c.merkmal = k; }
      w(null, `${ohne.length} Codes hatten kein Merkmal und wurden nach ihrem Anfang gruppiert. Bitte die Gruppen in der Zusammenstellung benennen oder zusammenführen.`);
    }
    for (const v of zs.var.values()) if (![...zs.codes.values()].some(c => c.varianten.has(v.key) || c.famAlle.has(v.fam))) w(v.zeile, `Variante „${v.name}“ hat keine Codes.`);
    if (opts.artikel && opts.artikelGeladen) {
      const fehlt = [...zs.codes.values()].filter(c => !art(c.code)).map(c => c.code);
      if (fehlt.length) w(null, `${fehlt.length} Codes sind nicht im Artikelstamm: ${fehlt.slice(0, 15).join(", ")}${fehlt.length > 15 ? " …" : ""}`);
    }
    return zs;
  };

  /** Kennzahlen einer Zusammenstellung */
  L.zahlen = zs => ({ ga: zs.ga.size, fam: zs.fam.size, var: zs.var.size, merkmale: [...zs.merkmale.values()].filter(m => [...zs.codes.values()].some(c => c.merkmal === m.key)).length, codes: zs.codes.size });

  /** Codes einer Variante (inkl. Codes, die für die ganze Familie gelten) */
  L.codesVon = (zs, v) => [...zs.codes.values()].filter(c => c.varianten.has(v.key) || c.famAlle.has(v.fam));

  /**
   * Zusammenstellung → Modell.  opts: { ersetzen: false, zusammenfassen: true }
   */
  L.inModell = (zs, basis, opts = {}) => {
    const mo = opts.ersetzen || !basis ? { version: basis?.version || 0, gruppen: [], produkte: [], merkmale: [], regeln: opts.ersetzen ? [] : (basis?.regeln || []) } : JSON.parse(JSON.stringify(basis));
    if (opts.ersetzen && basis) mo.regeln = [];
    const stat = { gaNeu: 0, famNeu: 0, artNeu: 0, artGeaendert: 0, merkmalNeu: 0, codesNeu: 0, codesGeaendert: 0, zusammengefasst: 0 };
    const eindeutig = (basisId, liste) => { let id = basisId || "x", n = 2; while (liste.some(x => x.id === id)) id = basisId + "-" + n++; return id; };
    // Geschäftsarten und Familien
    const gaId = new Map(), famId = new Map();
    for (const ga of zs.ga.values()) {
      let g = mo.gruppen.find(x => !x.eltern && norm(x.name) === ga.key);
      if (!g) { g = { id: eindeutig(E.slug(ga.name), mo.gruppen), name: ga.name, eltern: null, merkmale: [] }; mo.gruppen.push(g); stat.gaNeu++; }
      gaId.set(ga.key, g.id);
    }
    const mitVar = new Set([...zs.var.values()].map(v => v.fam));
    for (const f of zs.fam.values()) {
      if (!mitVar.has(f.key)) continue; // Familien ohne Fahrzeuge nicht anlegen
      const eltern = f.ga ? gaId.get(f.ga) : null;
      let g = mo.gruppen.find(x => norm(x.name) === norm(f.name) && (x.eltern || null) === eltern) || (!eltern ? null : mo.gruppen.find(x => norm(x.name) === norm(f.name)));
      if (!g) { g = { id: eindeutig(E.slug(f.name), mo.gruppen), name: f.name, eltern, merkmale: [] }; mo.gruppen.push(g); stat.famNeu++; }
      else if (eltern && g.id !== eltern) g.eltern = eltern;
      famId.set(f.key, g.id);
    }
    // Merkmale und Werte
    const mId = new Map(), wertVon = new Map(); // code -> {m, w}
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) wertVon.set(w.code.toUpperCase(), { m, w });
    // Grundausstattung wird ein Merkmal, dessen Codes den Feldtyp „fest enthalten“ haben (wie im Katalogaufbau)
    const genutzt = [...zs.merkmale.values()].filter(m => [...zs.codes.values()].some(c => c.merkmal === m.key));
    const festeKeys = new Set();
    for (const zm of genutzt) {
      const codes = [...zs.codes.values()].filter(c => c.merkmal === zm.key);
      let m = mo.merkmale.find(x => norm(x.name) === norm(zm.name));
      if (!m) { // gleiches Merkmal an den Codes erkennen
        const z = new Map(); for (const c of codes) { const t = wertVon.get(c.code.toUpperCase()); if (t) z.set(t.m, (z.get(t.m) || 0) + 1); }
        const best = [...z.entries()].sort((a, b) => b[1] - a[1])[0]; if (best && best[1] >= Math.ceil(codes.length / 2)) m = best[0];
      }
      if (!m) { m = { id: eindeutig(E.slug(zm.name).replace(/-/g, "") || "m", mo.merkmale), name: zm.name, abschnitt: "", typ: zm.mehrfach || zm.fest ? "mehrfach" : "einfach", bereich: zm.mehrfach || zm.fest ? "Optionen" : "Grundmaschine", werte: [] }; mo.merkmale.push(m); stat.merkmalNeu++; }
      else { m.name = zm.name; if (zm.mehrfach !== undefined) { m.typ = zm.mehrfach ? "mehrfach" : "einfach"; if (!m.bereich) m.bereich = zm.mehrfach ? "Optionen" : "Grundmaschine"; } }
      mId.set(zm.key, m.id);
      for (const c of codes) {
        const t = wertVon.get(c.code.toUpperCase());
        let w = t?.w;
        if (t && t.m !== m) { t.m.werte = t.m.werte.filter(x => x !== w); m.werte.push(w); for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (z.id === t.m.id && z.werte) z.werte = z.werte.filter(x => x !== w.id); }
        if (!w) { w = { id: eindeutig(c.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), m.werte), code: c.code, name: c.name || c.code, preis: c.preis || 0, kosten: c.kosten || 0, stl: [] }; m.werte.push(w); stat.codesNeu++; }
        else { const vorher = JSON.stringify([w.name, w.preis, w.kosten]); if (c.name) w.name = c.name; if (c.preis != null) w.preis = c.preis; if (c.kosten != null) w.kosten = c.kosten; if (vorher !== JSON.stringify([w.name, w.preis, w.kosten])) stat.codesGeaendert++; }
        if (c.stl && c.stl.length) w.stl = c.stl.map(z => z.slice());
        if (zm.fest) w.feld = "fest"; else if (w.feld === "fest") delete w.feld;
        wertVon.set(c.code.toUpperCase(), { m, w });
      }
    }
    // Varianten → konfigurierbare Artikel
    const reihen = genutzt.map(zm => mId.get(zm.key));
    for (const v of zs.var.values()) {
      const gruppe = famId.get(v.fam);
      let p = mo.produkte.find(x => v.code && norm(x.code) === norm(v.code)) || mo.produkte.find(x => norm(x.name) === norm(v.name) && x.gruppe === gruppe);
      if (!p) {
        const t = (v.name + " " + (mo.gruppen.find(g => g.id === gruppe)?.name || "")).toLowerCase();
        p = { id: eindeutig(String(v.code || v.name).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), mo.produkte), code: v.code, name: v.name, gruppe, artnr: v.code, basispreis: v.preis || 0, basiskosten: v.kosten || 0, aktiv: true, beschreibung: "",
          visual: { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst|logo/.test(t) ? "nachlaeufer" : "semi", asset: null }, stl: [], merkmale: [] };
        mo.produkte.push(p); stat.artNeu++;
      } else { p.gruppe = gruppe; if (v.preis != null) p.basispreis = v.preis; if (v.name) p.name = v.name; stat.artGeaendert++; }
      const codes = L.codesVon(zs, v), nachM = new Map();
      // Reihenfolge der Preisliste merken: daraus gliedert der Katalogaufbau nach ZZ (Überschrift) und YY (Untergruppe)
      if (zs.folge && zs.folge.length) { const pz = zs.praefix || {}, hat = new Set(codes.map(c => c.code.toUpperCase())), mark = c => [pz.ueber, pz.option].some(x => x && c.toUpperCase().startsWith(x.toUpperCase())); p.codeFolge = zs.folge.filter(c => mark(c) || hat.has(c.toUpperCase())); p._gliedern = true; }
      // feste Grundausstattung (Überschriften nur mit GA-Codes)
      const fest = codes.filter(c => festeKeys.has(c.merkmal));
      if (fest.length || zs.mappe) {
        delete p.grundausstattung; // feste Codes stehen als Werte mit Feldtyp „fest“ im Modell und kosten im Angebot ihren Preis
        if (v.stl && v.stl.length) p.stl = v.stl.map(z => z.slice());
      } else if (v.stl && v.stl.length) p.stl = v.stl.map(z => z.slice());
      for (const c of codes) { const t = wertVon.get(c.code.toUpperCase()); if (!t) continue; if (!nachM.has(t.m.id)) nachM.set(t.m.id, { ids: [], std: [] }); nachM.get(t.m.id).ids.push(t.w.id); if (c.std.has(v.key)) nachM.get(t.m.id).std.push(t.w.id); }
      // eigene Zuordnungen für importierte Merkmale ersetzen, übrige behalten
      p.merkmale = (p.merkmale || []).filter(z => !nachM.has(z.id)); delete p.reihenfolge;
      for (const mid of reihen) {
        const e = nachM.get(mid); if (!e) continue; const m = E.merkmal(mo, mid);
        const ids = m.werte.map(w => w.id).filter(id => e.ids.includes(id));
        p.merkmale.push({ id: mid, werte: ids.length === m.werte.length ? null : ids, ...(e.std.length && m.typ !== "mehrfach" ? { standard: e.std[0] } : {}) });
      }
    }
    if (zs.texte) mo.codeTexte = Object.assign(mo.codeTexte || {}, zs.texte);
    // Gemeinsame Merkmale an Familie und Geschäftsart übergeben (von unten nach oben, dann Feinschliff)
    if (opts.zusammenfassen !== false) {
      // Geschäftsart nur, wenn sie mehrere Familien hat; sonst bleiben die Merkmale an der Produktfamilie
      const fams = [...new Set([...famId.values()])], gas = [...new Set([...gaId.values()])].filter(id => mo.gruppen.filter(g => g.eltern === id).length >= 2);
      for (const id of [...fams, ...gas.filter(x => !fams.includes(x)), ...fams]) stat.zusammengefasst += E.hochziehen(mo, id) || 0;
    }
    return { modell: mo, stat };
  };

  /** Beispielliste im erwarteten Aufbau (für "Beispiel herunterladen") */
  L.beispiel = () => [
    ["Geschäftsart", "Produktfamilie", "Variante", "Artikelnummer der Variante", "Grundpreis", "Merkmal", "Vertriebscode", "Bezeichnung", "Preis"],
    ["Holztransport", "Logo12", "Logo12 2-achsig", "LOGO12-2A", 29800, "Achsanzahl", "A2", "2 Achsen", 0],
    ["", "", "", "", "", "Lenkung", "L0", "Starrachsen", 0],
    ["", "", "", "", "", "", "LZM", "Zwangslenkung mechanisch", 8900],
    ["", "", "", "", "", "Rungenpaare", "RP2", "2 Rungenpaare", 0],
    ["", "", "", "", "", "", "RP3", "3 Rungenpaare", 1450],
    ["", "", "", "", "", "Farbe", "RAL9005", "RAL 9005 Tiefschwarz", 0],
    ["", "", "", "", "", "", "RAL5010", "RAL 5010 Enzianblau", 0],
    ["", "", "Logo12 3-achsig", "LOGO12-3A", 36500, "Achsanzahl", "A3", "3 Achsen", 6800],
    ["", "", "", "", "", "Lenkung", "LZM", "Zwangslenkung mechanisch", 8900],
    ["", "", "", "", "", "", "LZH", "Hydraulische Zwangslenkung", 18500],
    ["", "", "", "", "", "Rungenpaare", "RP3", "3 Rungenpaare", 1450],
    ["", "", "", "", "", "", "RP4", "4 Rungenpaare", 2900],
    ["", "", "", "", "", "Farbe", "RAL9005", "RAL 9005 Tiefschwarz", 0],
    ["", "", "", "", "", "", "RAL5010", "RAL 5010 Enzianblau", 0],
    ["", "", "alle", "", "", "Ausstattung", "Z-LED", "LED-Beleuchtung komplett", 980],
    ["", "", "", "", "", "", "Z-WK", "Werkzeugkasten", 420],
    ["Schwertransport", "Tiefbett T4", "Tiefbett T4 Standard", "TB_T4P_S3F", 79500, "Achsanzahl", "A4", "4 Achsen", 14500],
    ["", "", "", "", "", "", "A5", "5 Achsen", 23800],
    ["", "", "", "", "", "Schwanenhals", "SH-F", "Fest", 0],
    ["", "", "", "", "", "", "SH-AH", "Hydraulisch abnehmbar", 16800]
  ];

  /* =====================================================================
     Arbeitsmappe mit mehreren Blättern (z. B. Preisliste, Import, Modell-Code-Kombinatorik,
     Prio MCK, Produkte Typen, Teileverwendungsnachweis, Geänderte Preise)
     ===================================================================== */
  L.INHALTE = [
    ["codes", "Preisliste / Konfigurationscodes", ["ga", "familie", "variante", "variantNr", "merkmal", "rang", "status", "code", "name", "preis", "kosten", "standard", "xvariante"]],
    ["artikel", "Artikelstamm", ["code", "name", "preis", "kosten", "me"]],
    ["kombi", "Zulässige Codes je Modell (Kombinatorik)", ["familie", "variante", "variantNr", "code", "standard", "xvariante"]],
    ["prio", "Reihenfolge und Überschriften", ["merkmal", "rang", "status", "code", "name"]],
    ["modelle", "Modelle / Produkttypen", ["ga", "familie", "variante", "variantNr", "variantPreis"]],
    ["stl", "Stückliste (Teileverwendung)", ["variante", "variantNr", "code", "teil", "name", "menge", "me"]],
    ["preise", "Geänderte Preise", ["variante", "code", "preis", "kosten"]],
    ["liste", "Produktliste (alles in einer Tabelle)", ["ga", "familie", "variante", "variantNr", "variantPreis", "merkmal", "code", "name", "preis", "kosten", "standard", "xvariante"]],
    ["", "nicht verwenden", []]
  ];
  L.inhaltName = Object.fromEntries(L.INHALTE.map(x => [x[0], x[1]]));
  L.ROLLEN_EXTRA = [["rang", "Reihenfolge / Rang", ["rangfolge", "rang", "prio", "prioritaet", "reihenfolge", "sortierung", "pos", "position"]],
    ["status", "Art des Codes (Grundausstattung/Option)", ["konfigurationsstatus", "status", "codeart", "art", "kennzeichen", "typ"]],
    ["teil", "Artikelnummer des Bauteils", ["teil", "teilenummer", "komponente", "material", "artikel", "artikelnummer", "artikelnr"]],
    ["menge", "Menge", ["menge", "anzahl", "stueck", "stk"]], ["me", "Mengeneinheit", ["me", "mengeneinheit", "einheit"]]];
  for (const r of L.ROLLEN_EXTRA) L.rollenName[r[0]] = r[1];
  // Spaltennamen je Blattinhalt (zuerst geprüft)
  const SYN_INHALT = {
    codes: { familie: ["produktgruppe", "produktfamilie", "familie", "baureihe"], variante: ["modell", "modelle", "variante", "typ"], merkmal: ["ueberschrift", "gruppe", "merkmal"], code: ["code", "konfigurationscode", "vertriebscode", "vkcode", "codes"], name: ["ausstattungsposition", "ausstattung", "bezeichnung", "benennung", "codebezeichnung", "text", "position"], preis: ["preisaufschlag", "aufschlag", "aufpreis", "preis", "vkpreis", "listenpreis", "preiseur"], status: ["konfigurationsstatus", "status", "codeart", "art"] },
    artikel: { code: ["artikel", "artikelnummer", "artikelnr", "teilenummer"], name: ["benennung", "bezeichnung", "artikelbezeichnung", "text"], preis: ["vkpreis", "listenpreis", "preis", "verkaufspreis"], kosten: ["herstellkosten", "sek", "mek", "kosten", "selbstkosten"], me: ["me", "mengeneinheit", "einheit"] },
    kombi: { code: ["code", "konfigurationscode", "vertriebscode", "codes"], variante: ["modell", "variante", "typ"], familie: ["produktgruppe", "familie"] },
    prio: { merkmal: ["ueberschrift", "gruppe"], rang: ["rangfolge", "rang", "prio", "prioritaet", "reihenfolge"], code: ["code"], name: ["codebezeichnung", "bezeichnung", "text"], status: ["status"] },
    modelle: { familie: ["produktgruppe", "produktfamilie", "familie", "baureihe"], variante: ["modell", "typ", "produkttyp", "bezeichnung", "modellbezeichnung"], variantNr: ["artikel", "artikelnummer", "modellcode", "typcode", "code", "modellnummer"], variantPreis: ["grundpreis", "preis", "vkpreis", "listenpreis"], ga: ["geschaeftsart", "sparte", "bereich"] },
    stl: { code: ["code", "konfigurationscode", "vertriebscode", "option", "optionscode"], teil: ["artikel", "teil", "teilenummer", "komponente", "material", "artikelnummer"], name: ["benennung", "bezeichnung", "text"], menge: ["menge", "anzahl"], me: ["me", "einheit"], variante: ["modell", "typ"] },
    preise: { code: ["code", "artikel", "konfigurationscode"], preis: ["neuerpreis", "preisneu", "geaenderterpreis", "neu", "preis", "vkpreis"], variante: ["modell"] }
  };
  L.inhaltRaten = (name, aoa) => {
    const n = norm(name);
    if (/teileverwendung|stueckliste|stkl|bom/.test(n)) return "stl";
    if (/geaendert.*preis|preisaenderung|neuepreise/.test(n)) return "preise";
    if (/kombinatorik|zulaessig|codekombination/.test(n)) return "kombi";
    if (/prio|rangfolge|reihenfolge/.test(n)) return "prio";
    if (/produktetypen|produkttypen|typen|modelle/.test(n)) return "modelle";
    if (/^import$|artikelstamm|artikel$/.test(n)) return "artikel";
    if (/preisliste|konfiguration|codes/.test(n)) return "codes";
    if (/export|sonderwunsch|anleitung|hinweis|deckblatt|info/.test(n)) return "";
    return "";
  };
  /** Spaltenrollen für ein Blatt bestimmten Inhalts */
  L.ratenInhalt = (aoa, kz, inhalt, istVariante) => {
    const erlaubt = (L.INHALTE.find(x => x[0] === inhalt) || [, , []])[2]; if (!erlaubt.length) return (aoa[kz] || []).map(() => "");
    if (inhalt === "liste") return L.raten(aoa, kz, istVariante);
    const kopf = aoa[kz] || [], n = kopf.map(norm), rollen = kopf.map(() => ""), syn = SYN_INHALT[inhalt] || {};
    const allg = Object.fromEntries([...L.ROLLEN, ...L.ROLLEN_EXTRA].map(r => [r[0], r[2]]));
    const liste = rolle => syn[rolle] || allg[rolle] || [];
    for (const rolle of erlaubt) { // 1. exakte Treffer
      if (rolle === "xvariante") continue; let i = -1;
      for (const s of liste(rolle)) { i = n.findIndex((h, j) => h === s && !rollen[j]); if (i >= 0) break; }
      if (i >= 0) rollen[i] = rolle;
    }
    for (const rolle of erlaubt) { // 2. Teiltreffer für noch fehlende Rollen
      if (rolle === "xvariante" || rollen.includes(rolle)) continue; let i = -1;
      for (const s of liste(rolle)) { if (s.length < 4) continue; i = n.findIndex((h, j) => h && h.includes(s) && !rollen[j]); if (i >= 0) break; }
      if (i >= 0) rollen[i] = rolle;
    }
    if (erlaubt.includes("xvariante")) {
      const daten = aoa.slice(kz + 1, kz + 80);
      kopf.forEach((h, j) => { if (rollen[j] || !txt(h)) return; const w = daten.map(r => txt(r?.[j])).filter(Boolean); if ((w.length && w.every(v => /^(x|s|o|ja|nein|-|●|✓|0|1)$/i.test(v))) || (istVariante && istVariante(txt(h)))) rollen[j] = "xvariante"; });
    }
    return inhalt === "codes" ? gruppenRollenPruefen(aoa, kz, rollen) : rollen;
  };
  L.kopfzeileInhalt = (aoa, inhalt) => {
    const syn = new Set([...Object.values(SYN_INHALT[inhalt] || {}).flat(), ...L.ROLLEN.flatMap(r => r[2])]); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(20, aoa.length); i++) { const z = aoa[i] || [], s = z.filter(c => syn.has(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0); if (s > bs) { bs = s; best = i; } }
    return best;
  };

  /** Art eines Codes: "ZZ" Überschrift, "GA" Grundausstattung, "YY" Option */
  L.codeArt = (code, status, pz) => {
    const s = norm(status), c = txt(code).toUpperCase();
    if (/ueberschrift|gruppe|kapitel|^zz/.test(s)) return "ZZ";
    if (/grund|serie|standard|^ga$|inklusive/.test(s)) return "GA";
    if (/option|sonder|extra|^yy$|zusatz/.test(s)) return "YY";
    const p = pz || {};
    if (p.ueber && c.startsWith(p.ueber.toUpperCase())) return "ZZ";
    if (p.grund && c.startsWith(p.grund.toUpperCase())) return "GA";
    if (p.option && c.startsWith(p.option.toUpperCase())) return "YY";
    return "YY";
  };

  /**
   * Arbeitsmappe → Zusammenstellung
   * cfg: { ga: "Holztransport", praefix: {ueber, grund, option}, blaetter: { name: {inhalt, kz, rollen} }, fuellen }
   */
  L.zusammenstellenMappe = (bl, cfg, opts = {}) => {
    const pz = cfg.praefix || { ueber: "ZZ", grund: "GA", option: "YY" }, fuellen = cfg.fuellen !== false;
    const zs = { ga: new Map(), fam: new Map(), var: new Map(), merkmale: new Map(), codes: new Map(), warn: [], zeilen: 0, artikelstamm: [], mappe: true, folge: [], texte: {}, praefix: pz };
    const w = (blatt, zeile, text) => zs.warn.push({ zeile: zeile ? `${blatt} ${zeile}` : blatt, text });
    const blaetter = Object.entries(cfg.blaetter || {}).filter(([n, b]) => b.inhalt && bl[n]);
    const von = inh => blaetter.filter(([, b]) => b.inhalt === inh);
    const zeilenVon = (name, b) => { const aoa = bl[name], ix = r => b.rollen.indexOf(r); return aoa.slice(b.kz + 1).map((row, i) => ({ row, z: b.kz + 2 + i, g: r => ix(r) >= 0 ? row?.[ix(r)] : "", hat: r => ix(r) >= 0 })).filter(x => x.row && x.row.some(c => txt(c))); };
    // 1) Artikelstamm
    const amap = new Map();
    for (const [name, b] of von("artikel")) for (const { g } of zeilenVon(name, b)) {
      const code = txt(g("code")); if (!code) continue;
      const a = { code, name: txt(g("name")), preis: zahl(g("preis")), kosten: zahl(g("kosten")), me: txt(g("me")) };
      amap.set(code.toUpperCase(), a); zs.artikelstamm.push({ ARTIKEL: a.code, NAME: a.name, VKPREIS: a.preis ?? "", HERSTELLKOSTEN: a.kosten ?? "", ME: a.me });
    }
    const art = c => !c ? null : amap.get(txt(c).toUpperCase()) || (opts.artikel ? opts.artikel(c) : null);
    // Hilfen für Familien und Varianten
    const gaStd = txt(cfg.ga);
    const famAnlegen = (ga, fam) => {
      ga = txt(ga) || gaStd; fam = txt(fam);
      if (ga && !zs.ga.has(norm(ga))) zs.ga.set(norm(ga), { key: norm(ga), name: ga });
      const name = fam || ga || "Import", fk = (ga ? norm(ga) + "/" : "") + norm(name);
      if (!zs.fam.has(fk)) zs.fam.set(fk, { key: fk, name, ga: ga ? norm(ga) : null });
      return fk;
    };
    const varFinden = (nrOderName) => { const n = norm(nrOderName); return [...zs.var.values()].find(v => norm(v.code) === n || norm(v.name) === n); };
    const varAnlegen = (fk, nr, name, zeile) => {
      const vorhanden = varFinden(nr) || varFinden(name); if (vorhanden) return vorhanden.key;
      const a = art(nr) || art(name), key = fk + "|" + (norm(nr) || norm(name));
      zs.var.set(key, { key, fam: fk, code: txt(nr) || (a ? a.code : txt(name)), name: txt(name) && txt(name) !== txt(nr) ? txt(name) : (a?.name || txt(name) || txt(nr)), preis: null, kosten: null, zeile, stl: [] });
      return key;
    };
    // 2) Modelle / Produkttypen
    for (const [name, b] of von("modelle")) { let cGa = "", cFam = ""; for (const { g, z } of zeilenVon(name, b)) {
      const ga = txt(g("ga")) || (fuellen ? cGa : ""), fam = txt(g("familie")) || (fuellen ? cFam : ""); if (txt(g("ga"))) cGa = ga; if (txt(g("familie"))) cFam = fam;
      const va = txt(g("variante")), nr = txt(g("variantNr")); if (!va && !nr) continue;
      const vk = varAnlegen(famAnlegen(ga, fam), nr, va, z), p = zahl(g("variantPreis")); if (p != null) zs.var.get(vk).preis = p;
    } }
    // 3) Reihenfolge und Überschriften
    const prio = new Map(); let rangLauf = 0;
    for (const [name, b] of von("prio")) { let cUe = ""; for (const { g, hat } of zeilenVon(name, b)) {
      const code = txt(g("code")), ue = txt(g("merkmal")), artC = L.codeArt(code, g("status"), pz), rang = zahl(g("rang"));
      if (ue) cUe = ue;
      if (!code) continue;
      if (artC === "ZZ") { cUe = txt(g("name")) || ue || code; continue; }
      prio.set(code.toUpperCase(), { ue: ue || cUe, rang: rang ?? ++rangLauf, name: txt(g("name")) });
    } }
    // 4) Preisliste / Codes
    const merkmalKey = (name, rang) => { const k = norm(name) || "ohne"; if (!zs.merkmale.has(k)) zs.merkmale.set(k, { key: k, name: txt(name) || "Ohne Überschrift", mehrfach: true, fest: false, auto: false, rang: rang ?? 1e9 }); const m = zs.merkmale.get(k); if (rang != null && rang < m.rang) m.rang = rang; return k; };
    let lauf = 0;
    for (const [name, b] of von("codes").concat(von("liste"))) {
      const kopf = bl[name][b.kz] || [], xs = b.rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
      let cGa = "", cFam = "", cVar = "", cNr = "", cUe = "";
      for (const { g, z, row } of zeilenVon(name, b)) {
        zs.zeilen++;
        const ga = txt(g("ga")), fam = txt(g("familie")), va = txt(g("variante")), nr = txt(g("variantNr")), ue = txt(g("merkmal")), code = txt(g("code"));
        if (ga && ga !== cGa) { cGa = ga; cFam = ""; cVar = ""; cNr = ""; }
        if (fam && fam !== cFam) { cFam = fam; cVar = ""; cNr = ""; cUe = ""; }
        if (va || nr) { cVar = va; cNr = nr; }
        if (ue) cUe = ue;
        const eGa = ga || (fuellen ? cGa : ""), eFam = fam || (fuellen ? cFam : ""), eVa = va || (fuellen ? cVar : ""), eNr = nr || (fuellen ? cNr : "");
        const artC = L.codeArt(code, g("status"), pz);
        if (!code) { const t = txt(g("name")); if (t && !b.rollen.includes("merkmal")) cUe = t; continue; }
        if (artC === "ZZ") { cUe = txt(g("name")) || prio.get(code.toUpperCase())?.ue || code; if (!zs.folge.includes(code)) zs.folge.push(code); zs.texte[code.toUpperCase()] = cUe; continue; }
        if (!zs.folge.includes(code)) zs.folge.push(code);
        if (txt(g("name"))) zs.texte[code.toUpperCase()] ||= txt(g("name"));
        const fk = (eFam || eGa || !zs.fam.size) ? famAnlegen(eGa, eFam) : null;
        const p = prio.get(code.toUpperCase()), a = art(code), ck = code.toUpperCase();
        let c = zs.codes.get(ck);
        if (!c) { c = { code, name: "", preis: null, kosten: null, merkmal: null, varianten: new Set(), famAlle: new Set(), std: new Set(), zeile: z, art: artC, rang: p?.rang ?? (1e6 + ++lauf), stl: [] }; zs.codes.set(ck, c); }
        if (!c.merkmal) { const ueName = ue || p?.ue || cUe; if (ueName) c.merkmal = merkmalKey(ueName, p?.rang ?? c.rang); }
        if (!c.name) c.name = txt(g("name")) || p?.name || a?.name || "";
        if (c.preis == null) c.preis = zahl(g("preis")) ?? a?.preis ?? null;
        if (c.kosten == null) c.kosten = zahl(g("kosten")) ?? a?.kosten ?? null;
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const xk = varAnlegen(fk || famAnlegen(eGa, eFam), "", txt(kopf[j]), z); c.varianten.add(xk); if (istStd(v)) c.std.add(xk); }
        if ((eVa || eNr) && !ALLE.test(eVa)) { const vk = varAnlegen(fk || famAnlegen(eGa, eFam), eNr, eVa, z); c.varianten.add(vk); if (b.rollen.includes("standard") && ja(g("standard"))) c.std.add(vk); }
        else if (!xs.length && fk) c.famAlle.add(fk);
      }
    }
    // 5) Kombinatorik: welche Codes bei welchem Modell zulässig sind (ersetzt die Angaben aus der Preisliste)
    const kombiGesehen = new Set();
    for (const [name, b] of von("kombi")) {
      const kopf = bl[name][b.kz] || [], xs = b.rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
      const standardFam = zs.fam.size === 1 ? [...zs.fam.keys()][0] : null; let cFam = "", cVar = "";
      for (const { g, z, row } of zeilenVon(name, b)) {
        const code = txt(g("code")); const fam = txt(g("familie")) || cFam; if (txt(g("familie"))) cFam = fam;
        const va = txt(g("variante")) || txt(g("variantNr")) || cVar; if (txt(g("variante")) || txt(g("variantNr"))) cVar = va;
        if (!code) continue; const c = zs.codes.get(code.toUpperCase());
        if (!c) { if (L.codeArt(code, "", pz) !== "ZZ") w(name, z, `Code ${code} steht nicht in der Preisliste.`); continue; }
        if (!kombiGesehen.has(c)) { kombiGesehen.add(c); c.varianten = new Set(); c.famAlle = new Set(); c.std = new Set(); }
        const fk = fam ? famAnlegen("", fam) : standardFam || famAnlegen("", "Ohne Familie");
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const vk = varFinden(txt(kopf[j]))?.key || varAnlegen(fk, "", txt(kopf[j]), z); c.varianten.add(vk); if (istStd(v)) c.std.add(vk); }
        if (va && !xs.length) { const vk = varFinden(va)?.key || varAnlegen(fk, va, "", z); c.varianten.add(vk); if (b.rollen.includes("standard") && ja(g("standard"))) c.std.add(vk); }
      }
    }
    // Codes ohne Angabe gelten für alle Varianten
    for (const c of zs.codes.values()) if (!c.varianten.size && !c.famAlle.size) for (const f of zs.fam.keys()) c.famAlle.add(f);
    // 6) Geänderte Preise
    for (const [name, b] of von("preise")) for (const { g, z } of zeilenVon(name, b)) {
      const code = txt(g("code")), p = zahl(g("preis")); if (!code || p == null) continue;
      const c = zs.codes.get(code.toUpperCase());
      if (c) { c.preis = p; const k = zahl(g("kosten")); if (k != null) c.kosten = k; if (txt(g("variante"))) w(name, z, `Preis für ${code} gilt im Modell für alle Varianten.`); }
      else { const v = varFinden(code); if (v) v.preis = p; else w(name, z, `Code ${code} für Preisänderung unbekannt.`); }
    }
    // 7) Stückliste
    for (const [name, b] of von("stl")) { let cCode = ""; for (const { g, z } of zeilenVon(name, b)) {
      const code = txt(g("code")) || (fuellen ? cCode : ""), teil = txt(g("teil")); if (txt(g("code"))) cCode = code;
      if (!teil) continue;
      const a = art(teil), zeile = [teil, txt(g("name")) || a?.name || "", zahl(g("menge")) || 1, txt(g("me")) || a?.me || "Stk"];
      const c = code && zs.codes.get(code.toUpperCase()), v = varFinden(txt(g("variantNr")) || txt(g("variante")) || (!c ? code : ""));
      if (c) c.stl.push(zeile); else if (v) v.stl.push(zeile); else w(name, z, `Teil ${teil}: Code ${code || "?"} unbekannt.`);
    } }
    // Familien ohne Varianten: Familie selbst ist die Variante
    for (const f of zs.fam.values()) if (![...zs.var.values()].some(v => v.fam === f.key)) { const vk = varAnlegen(f.key, "", f.name, null); for (const c of zs.codes.values()) if (c.famAlle.has(f.key)) { c.varianten.add(vk); c.famAlle.delete(f.key); } }
    // Codes ohne Überschrift
    const ohne = [...zs.codes.values()].filter(c => !c.merkmal);
    for (const c of ohne) c.merkmal = merkmalKey(c.art === "GA" ? "Grundausstattung" : "Weitere Optionen");
    if (ohne.length) w("Preisliste", null, `${ohne.length} Codes ohne Überschrift wurden unter „Grundausstattung“ bzw. „Weitere Optionen“ gesammelt.`);
    // Art je Überschrift: nur GA = feste Grundausstattung; GA + YY = Auswahl mit GA als Standard; nur YY = Optionen
    for (const m of zs.merkmale.values()) {
      const cs = [...zs.codes.values()].filter(c => c.merkmal === m.key), ga = cs.filter(c => c.art === "GA"), yy = cs.filter(c => c.art !== "GA");
      if (ga.length && !yy.length) { m.fest = true; m.mehrfach = false; }
      else if (ga.length && yy.length) { m.fest = false; m.mehrfach = false; for (const c of ga) { for (const v of c.varianten) c.std.add(v); for (const f of c.famAlle) for (const v of zs.var.values()) if (v.fam === f) c.std.add(v.key); } }
      else { m.fest = false; m.mehrfach = true; }
    }
    // Sortierung nach Rang
    zs.merkmale = new Map([...zs.merkmale.entries()].sort((a, b) => a[1].rang - b[1].rang));
    zs.codes = new Map([...zs.codes.entries()].sort((a, b) => a[1].rang - b[1].rang));
    for (const v of zs.var.values()) if (!L.codesVon(zs, v).length) w("Modelle", v.zeile, `Variante „${v.name}“ hat keine Codes.`);
    if (amap.size || opts.artikelGeladen) { const fehlt = [...zs.codes.values()].filter(c => !art(c.code)).map(c => c.code); if (fehlt.length) w("Artikelstamm", null, `${fehlt.length} Codes sind nicht im Artikelstamm: ${fehlt.slice(0, 12).join(", ")}${fehlt.length > 12 ? " …" : ""}`); }
    return zs;
  };

  if (node) { module.exports = L; return; }

  /* =====================================================================
     Oberfläche: Studio → Excel-Import (einfach)
     ===================================================================== */
  const K = root.KONF, esc = K.esc, S = () => K.Store.S; K.L = L;
  K.li = { schritt: "datei", datei: null, blaetter: null, blatt: null, kz: 0, rollen: [], zs: null, auswahl: new Set(), ersetzen: false, zusammenfassen: true, fuellen: true, fehler: null, ergebnis: null };
  const ro = () => !K.Store.schreiben;
  const VORLAGE = ["codes", "regeln", "produkte", "merkmale", "kombinationen", "stueckliste", "katalog"];
  const artikelFn = () => code => code ? K.Store.artikelZu(code) : null;
  const istVariante = h => { const mo = S().entwurf; return !!(mo && mo.produkte.some(p => norm(p.code) === norm(h) || norm(p.name) === norm(h))); };

  function neuRechnen() {
    const i = K.li;
    if (i.mappe) { i.zs = L.zusammenstellenMappe(i.blaetter, i.mappe, { artikel: artikelFn(), artikelGeladen: K.Store.artikelQuelle === "applus" }); i.auswahl = new Set(); return; }
    const aoa = i.blaetter[i.blatt];
    const bekannt = new Map(); for (const m of (S().entwurf?.merkmale || [])) for (const w of m.werte) if (w.code) bekannt.set(w.code.toUpperCase(), { name: m.name, mehrfach: m.typ === "mehrfach" });
    i.zs = L.zusammenstellen(aoa, i.kz, i.rollen, { fuellen: i.fuellen, artikel: artikelFn(), artikelGeladen: !!K.Store.artikelQuelle, merkmalVon: c => bekannt.get(String(c).toUpperCase()) });
    i.auswahl = new Set();
  }
  const kopf = () => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Familien und Varianten importieren</h2><p>Eine Liste mit Geschäftsart, Produktfamilie, Variante und Vertriebscodes genügt. Bezeichnungen und Preise, die fehlen, holt der Import aus dem Artikelstamm. Vor der Übernahme sehen Sie die Zusammenstellung und können sie anpassen.</p></div>
    <div class="row"><a class="btn" href="#studio-import">← Nur Codes und Preise</a><button class="btn" type="button" data-act="liBeispiel">Beispiel-Liste herunterladen</button><a class="btn" href="#studio-import-vorlage">Expertenimport (mehrere Blätter, Regeln)</a></div></div>`;
  const leiste = () => { const st = [["datei", "Datei"], ["spalten", "Spalten"], ["zs", "Zusammenstellung"], ["fertig", "Fertig"]], j = st.findIndex(s => s[0] === K.li.schritt); return `<ol class="schritte">${st.map(([id, n], k) => `<li class="${k === j ? "aktiv" : k < j ? "erledigt" : ""}">${k + 1}. ${n}</li>`).join("")}</ol>`; };

  K.route("studio-import-struktur", () => {
    const i = K.li;
    if (ro()) return kopf() + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (i.schritt === "datei") return kopf() + leiste() + `<section class="panel upload">
      <label class="ablage" for="li-datei"><b>Excel-Datei hierher ziehen oder auswählen</b><span class="gedimmt">.xlsx, .xls oder .csv</span><input id="li-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="liDatei"></label>
      ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}
      <div class="aufbau"><div class="eyebrow">So kann die Liste aussehen</div>
        <div class="tabwrap ohne-rand"><table class="kompakt beispieltab"><thead><tr>${L.beispiel()[0].map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${L.beispiel().slice(1, 7).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <ul class="punkte klein"><li>Leere Zellen bei Geschäftsart, Familie, Variante und Merkmal gelten wie die Zeile darüber.</li><li>„alle“ als Variante heißt: Code gilt für alle Varianten der Familie.</li><li>Statt einer Variantenspalte geht auch je Variante eine Spalte mit X (verfügbar) oder S (Standard).</li><li>Ohne Merkmal-Spalte werden Zwischenüberschriften oder der Anfang der Codes zum Gruppieren genutzt.</li></ul></div></section>`;
    if (i.schritt === "spalten" && i.mappe) return kopf() + leiste() + mappeAnsicht();
    if (i.schritt === "spalten") {
      const aoa = i.blaetter[i.blatt], kopfz = aoa[i.kz] || [], breite = Math.max(...aoa.slice(i.kz, i.kz + 12).map(r => (r || []).length), kopfz.length);
      const vorlage = Object.keys(i.blaetter).filter(n => VORLAGE.includes(norm(n))).length >= 2;
      const fehlt = !i.rollen.includes("code") ? "Bitte die Spalte mit den Vertriebscodes wählen." : (!i.rollen.includes("variante") && !i.rollen.includes("variantNr") && !i.rollen.includes("xvariante") && !i.rollen.includes("familie")) ? "Bitte die Spalte mit der Variante oder Produktfamilie wählen." : "";
      const mehrere = Object.keys(i.blaetter).filter(n => L.inhaltRaten(n, i.blaetter[n])).length >= 2;
      return kopf() + leiste() + `${mehrere ? `<div class="hinweis">Die Datei hat mehrere Blätter (Preisliste, Artikel, Kombinatorik …). <button class="btn klein" type="button" data-act="lmStart">Alle Blätter zusammen einlesen</button></div>` : ""}${vorlage ? `<div class="hinweis">Diese Datei sieht aus wie die vollständige Vorlage mit mehreren Blättern. <button class="btn klein" type="button" data-act="liZurVorlage">Mit dem Expertenimport öffnen</button></div>` : ""}
      <section class="panel"><div class="row zwischen"><span><b>${esc(i.datei)}</b></span>
        <span class="row">${Object.keys(i.blaetter).length > 1 ? `<label class="inline">Blatt <select id="li-blatt" data-act="liBlatt">${Object.keys(i.blaetter).map(n => `<option ${n === i.blatt ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></label>` : ""}
        <label class="inline">Überschriften in Zeile <input id="li-kz" type="number" min="1" class="kurz" data-chg="liKz" value="${i.kz + 1}"></label>
        <label class="haken klein"><input type="checkbox" data-act="liFuellen" ${i.fuellen ? "checked" : ""}> leere Zellen von oben übernehmen</label></span></div>
        <p class="klein gedimmt">Wählen Sie über jeder Spalte, was darin steht. Vorschläge sind schon eingetragen.</p>
        <div class="tabwrap spaltenwahl"><table class="kompakt"><thead><tr>${Array.from({ length: breite }, (_, j) => `<th><select id="li-r-${j}" data-act="liRolle" data-j="${j}" class="${i.rollen[j] ? "gesetzt" : ""}">${L.ROLLEN.map(([k, n]) => `<option value="${k}" ${(i.rollen[j] || "") === k ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></th>`).join("")}</tr>
          <tr class="kopfreihe">${Array.from({ length: breite }, (_, j) => `<td>${esc(kopfz[j] ?? "")}</td>`).join("")}</tr></thead>
          <tbody>${aoa.slice(i.kz + 1, i.kz + 11).map(r => `<tr>${Array.from({ length: breite }, (_, j) => `<td class="${i.rollen[j] ? "" : "aus"}">${esc(String(r?.[j] ?? "").slice(0, 40))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        ${fehlt ? `<div class="hinweis warn">${fehlt}</div>` : ""}
        <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="liWeiter" ${fehlt ? "disabled" : ""}>Weiter zur Zusammenstellung</button></div></section>`;
    }
    if (i.schritt === "zs") return kopf() + leiste() + zusammenstellung();
    const st = i.ergebnis?.stat || {};
    return kopf() + leiste() + `<section class="panel"><div class="hinweis ok"><b>Übernommen in den Entwurf.</b> ${st.gaNeu} neue Geschäftsarten, ${st.famNeu} neue Familien, ${st.artNeu} neue und ${st.artGeaendert} aktualisierte Varianten, ${st.codesNeu} neue und ${st.codesGeaendert} geänderte Codes.${st.zusammengefasst ? ` ${st.zusammengefasst} Merkmale wurden an Familien bzw. Geschäftsarten zusammengefasst.` : ""}${st.gegliedert ? ` ${st.gegliedert} Fahrzeuge wurden nach Überschriften (ZZ) und Untergruppen (YY) gegliedert.` : ""}</div>
      <p class="klein gedimmt">Der Vertrieb sieht die Änderungen nach der Freigabe. Regeln legen Sie im Produktmodell je Familie oder Variante an.</p>
      <div class="row"><button class="btn primary" type="button" data-act="liZumModell">Im Produktmodell ansehen</button><a class="btn" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="liZurueck" data-s="datei">Weitere Liste importieren</button></div></section>`;
  });

  function zusammenstellung() {
    const i = K.li, zs = i.zs, z = L.zahlen(zs), codes = [...zs.codes.values()];
    const merkmale = [...zs.merkmale.values()].filter(m => codes.some(c => c.merkmal === m.key));
    const baumGa = (gaKey) => [...zs.fam.values()].filter(f => f.ga === gaKey).map(f => `<li><span class="zs-fam">▤ ${esc(f.name)}</span><ul>${[...zs.var.values()].filter(v => v.fam === f.key).map(v => `<li><span class="zs-var">▢ <code>${esc(v.code)}</code> ${esc(v.name !== v.code ? v.name : "")}</span><span class="gedimmt klein">${L.codesVon(zs, v).length} Codes${v.preis != null ? " · " + K.eur(v.preis) : ""}</span></li>`).join("")}</ul></li>`).join("");
    const baum = `${[...zs.ga.values()].map(g => `<li><span class="zs-ga">${esc(g.name)}</span><ul>${baumGa(g.key)}</ul></li>`).join("")}${baumGa(null)}`;
    const mOpt = aktiv => merkmale.map(m => `<option value="${m.key}" ${m.key === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("");
    const karten = merkmale.map(m => {
      const cs = codes.filter(c => c.merkmal === m.key), vs = new Set(cs.flatMap(c => [...c.varianten]));
      return `<article class="zs-merkmal${m.auto ? " auto" : ""}${m.fest ? " fest" : ""}">
        <div class="zs-mkopf"><input id="li-mn-${m.key}" class="flach titelfeld" data-in="liMName" data-k="${m.key}" value="${esc(m.name)}" aria-label="Name des Merkmals">
          <select id="li-mt-${m.key}" data-act="liMTyp" data-k="${m.key}" aria-label="Art"><option value="0" ${!m.mehrfach && !m.fest ? "selected" : ""}>eine Auswahl</option><option value="1" ${m.mehrfach && !m.fest ? "selected" : ""}>mehrere (Optionen)</option><option value="f" ${m.fest ? "selected" : ""}>Grundausstattung (fest, inklusive)</option></select>
          <select id="li-mm-${m.key}" data-act="liMerge" data-k="${m.key}" aria-label="Zusammenführen"><option value="">zusammenführen mit …</option>${merkmale.filter(x => x !== m).map(x => `<option value="${x.key}">${esc(x.name)}</option>`).join("")}</select></div>
        ${m.auto ? `<p class="klein warntext">Automatisch nach Code-Anfang gebildet. Bitte sinnvoll benennen.</p>` : ""}
        ${m.fest ? `<p class="klein gedimmt">Ist immer im Fahrzeug enthalten und erscheint im Konfigurator und im Angebot als Grundausstattung, ohne Auswahl.</p>` : ""}
        <div class="zs-codes">${cs.map(c => `<button type="button" class="zs-code${i.auswahl.has(c.code.toUpperCase()) ? " gewaehlt" : ""}${K.Store.artikelQuelle && !K.Store.artikelZu(c.code) ? " unbekannt" : ""}" data-act="liCode" data-c="${esc(c.code.toUpperCase())}" title="${esc((c.name || "") + (c.preis ? " · " + K.eur(c.preis) : "") + " · " + c.varianten.size + " Varianten" + (c.stl?.length ? " · " + c.stl.length + " Stücklistenpositionen" : ""))}">${c.art ? `<span class="art-${c.art}">${c.art}</span>` : ""}<code>${esc(c.code)}</code> ${esc(c.name)}${c.preis ? ` <span class="num">${K.eur(c.preis)}</span>` : ""}</button>`).join("")}</div>
        <div class="klein gedimmt">${cs.length} Codes · in ${vs.size} von ${zs.var.size} Varianten</div></article>`;
    }).join("");
    return `<div class="kpis">
      <div class="kpi"><b class="num">${z.ga}</b><span>Geschäftsarten</span></div><div class="kpi"><b class="num">${z.fam}</b><span>Produktfamilien</span></div>
      <div class="kpi"><b class="num">${z.var}</b><span>Varianten</span></div><div class="kpi"><b class="num">${z.codes}</b><span>Vertriebscodes in ${z.merkmale} Merkmalen</span></div></div>
      ${zs.warn.length ? `<details class="panel" ${zs.warn.length < 6 ? "open" : ""}><summary><b>${zs.warn.length} ${zs.warn.length === 1 ? "Hinweis" : "Hinweise"}</b></summary><ul class="warnliste">${zs.warn.slice(0, 80).map(w => `<li>${w.zeile ? `<span class="mono">${zs.mappe ? "" : "Zeile "}${esc(w.zeile)}</span> ` : ""}${esc(w.text)}</li>`).join("")}</ul></details>` : ""}
      <div class="zs-layout">
        <aside class="panel zs-baum"><h3>Aufbau</h3><ul>${baum}</ul></aside>
        <section class="zs-rechts">
          <div class="zs-werkzeug panel"><span><b>${i.auswahl.size}</b> Codes ausgewählt</span>
            <select id="li-ziel" aria-label="Ziel-Merkmal"><option value="">verschieben nach …</option>${mOpt("")}<option value="__neu">neues Merkmal</option></select>
            <button class="btn klein" type="button" data-act="liVerschieben" ${i.auswahl.size ? "" : "disabled"}>Verschieben</button>
            <button class="btn klein" type="button" data-act="liAuswahlWeg" ${i.auswahl.size ? "" : "disabled"}>Auswahl aufheben</button>
            <span class="gedimmt klein">Codes anklicken, um sie auszuwählen.</span></div>
          <div class="zs-merkmale">${karten}</div>
        </section></div>
      <section class="panel" style="margin-top:14px"><h3>Übernehmen</h3>
        <label class="haken"><input type="checkbox" data-act="liOpt" data-k="zusammenfassen" ${i.zusammenfassen ? "checked" : ""}> Gemeinsame Merkmale automatisch an Produktfamilie und Geschäftsart übergeben (empfohlen)</label>
        <label class="haken"><input type="checkbox" data-act="liOpt" data-k="ersetzen" ${i.ersetzen ? "checked" : ""}> Bestehendes Modell ersetzen statt ergänzen (Regeln werden dabei gelöscht)</label>
        <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="spalten">Zurück zu den Spalten</button><button class="btn gelb" type="button" data-act="liUebernehmen">In das Produktmodell übernehmen</button></div></section>`;
  }

  async function lesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" }), bl = {};
    for (const n of wb.SheetNames) bl[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return bl;
  }
  function blattWaehlen(n) {
    const i = K.li, aoa = i.blaetter[n]; i.blatt = n;
    i.kz = L.kopfzeile(aoa);
    const gesp = S().einst?.listenImport;
    const kopfz = (aoa[i.kz] || []).map(txt);
    i.rollen = L.raten(aoa, i.kz, istVariante);
    if (gesp) kopfz.forEach((h, j) => { if (h && gesp[norm(h)] !== undefined) i.rollen[j] = gesp[norm(h)]; });
  }

  /* ---------- Arbeitsmappe mit mehreren Blättern ---------- */
  function mappeBlatt(n, inhalt) {
    const i = K.li, aoa = i.blaetter[n], gesp = S().einst?.mappenImport?.blaetter?.[norm(n)];
    inhalt = inhalt ?? (gesp ? gesp.inhalt : L.inhaltRaten(n, aoa));
    const kz = inhalt ? L.kopfzeileInhalt(aoa, inhalt) : 0, rollen = L.ratenInhalt(aoa, kz, inhalt, istVariante);
    if (gesp && gesp.inhalt === inhalt) (aoa[kz] || []).forEach((h, j) => { const r = gesp.rollen?.[norm(h)]; if (r !== undefined) rollen[j] = r; });
    return { inhalt, kz, rollen };
  }
  function mappeStarten() {
    const i = K.li, gesp = S().einst?.mappenImport || {};
    const gaRaten = (i.datei || "").replace(/\.[a-z]+$/i, "").replace(/doll|konfigurator|preisliste|_|-/gi, " ").replace(/\s+/g, " ").trim();
    i.mappe = { ga: gesp.ga || gaRaten, praefix: Object.assign({ ueber: "ZZ", grund: "GA", option: "YY" }, gesp.praefix || {}, S().einst?.codeKennung || {}), fuellen: true, blaetter: {}, tab: null };
    for (const n of Object.keys(i.blaetter)) i.mappe.blaetter[n] = mappeBlatt(n);
    i.mappe.tab = Object.keys(i.mappe.blaetter).find(n => i.mappe.blaetter[n].inhalt) || null;
  }
  const PFLICHT = { codes: ["code"], artikel: ["code"], kombi: ["code"], prio: ["code"], modelle: [], stl: ["teil"], preise: ["code", "preis"], liste: ["code"] };
  function mappeAnsicht() {
    const i = K.li, mp = i.mappe, namen = Object.keys(i.blaetter), genutzt = namen.filter(n => mp.blaetter[n].inhalt);
    const fehlt = genutzt.flatMap(n => (PFLICHT[mp.blaetter[n].inhalt] || []).filter(r => !mp.blaetter[n].rollen.includes(r)).map(r => `${n}: Spalte „${L.rollenName[r]}“ fehlt`));
    if (mp.blaetter[mp.tab]?.inhalt === "modelle" && !mp.blaetter[mp.tab].rollen.some(r => r === "variante" || r === "variantNr")) fehlt.push(`${mp.tab}: Spalte „Modell“ fehlt`);
    if (!genutzt.some(n => ["codes", "liste"].includes(mp.blaetter[n].inhalt))) fehlt.unshift("Bitte das Blatt mit der Preisliste bzw. den Codes festlegen.");
    const t = mp.tab && mp.blaetter[mp.tab], aoa = t ? i.blaetter[mp.tab] : null;
    let tabelle = "";
    if (t && t.inhalt) {
      const erlaubt = ["", ...L.INHALTE.find(x => x[0] === t.inhalt)[2]], kopfz = aoa[t.kz] || [], breite = Math.min(40, Math.max(...aoa.slice(t.kz, t.kz + 12).map(r => (r || []).length), kopfz.length));
      tabelle = `<div class="row zwischen" style="margin-top:12px"><b>${esc(mp.tab)}</b><span class="row"><label class="inline">Überschriften in Zeile <input id="lm-kz" type="number" min="1" class="kurz" data-chg="lmKz" value="${t.kz + 1}"></label></span></div>
        <div class="tabwrap spaltenwahl"><table class="kompakt"><thead><tr>${Array.from({ length: breite }, (_, j) => `<th><select id="lm-r-${j}" data-act="lmRolle" data-j="${j}" class="${t.rollen[j] ? "gesetzt" : ""}">${erlaubt.map(k => `<option value="${k}" ${(t.rollen[j] || "") === k ? "selected" : ""}>${esc(k ? L.rollenName[k] : "– nicht verwenden –")}</option>`).join("")}</select></th>`).join("")}</tr>
          <tr class="kopfreihe">${Array.from({ length: breite }, (_, j) => `<td>${esc(kopfz[j] ?? "")}</td>`).join("")}</tr></thead>
          <tbody>${aoa.slice(t.kz + 1, t.kz + 9).map(r => `<tr>${Array.from({ length: breite }, (_, j) => `<td class="${t.rollen[j] ? "" : "aus"}">${esc(String(r?.[j] ?? "").slice(0, 40))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    return `<section class="panel"><div class="row zwischen"><span><b>${esc(i.datei)}</b> <span class="gedimmt klein">${namen.length} Blätter</span></span>
        <button class="btn klein" type="button" data-act="lmEnde">Nur ein Blatt verwenden</button></div>
      <p class="klein gedimmt">Die Blätter werden zusammengeführt: Codes aus der Preisliste, Bezeichnungen und Preise aus dem Artikelstamm, Reihenfolge und Überschriften aus der Prio-Liste, zulässige Codes je Modell aus der Kombinatorik, Stücklisten aus dem Teileverwendungsnachweis. Formeln werden nicht ausgewertet, es zählt der zuletzt berechnete Wert.</p>
      <div class="lm-grid">
        <table class="kompakt lm-blaetter"><thead><tr><th>Blatt</th><th>Zeilen</th><th>Inhalt</th></tr></thead><tbody>${namen.map(n => `<tr class="${n === mp.tab ? "aktiv" : ""}${mp.blaetter[n].inhalt ? "" : " aus"}"><td><button type="button" class="link" data-act="lmTab" data-n="${esc(n)}">${esc(n)}</button></td><td class="num">${Math.max(0, i.blaetter[n].length - 1)}</td><td><select id="lm-i-${namen.indexOf(n)}" data-act="lmInhalt" data-n="${esc(n)}">${L.INHALTE.map(([k, nm]) => `<option value="${k}" ${mp.blaetter[n].inhalt === k ? "selected" : ""}>${esc(nm)}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>
        <div class="lm-einst">
          <div class="feld"><label for="lm-ga">Geschäftsart</label><input id="lm-ga" data-in="lmGa" value="${esc(mp.ga)}" placeholder="z. B. Holztransport"></div>
          <div class="feld"><label>Code-Kennzeichen</label><div class="lm-praefix">
            <label><input id="lm-p-ueber" class="kurz mono" data-in="lmPz" data-k="ueber" value="${esc(mp.praefix.ueber)}"> Überschrift</label>
            <label><input id="lm-p-grund" class="kurz mono" data-in="lmPz" data-k="grund" value="${esc(mp.praefix.grund)}"> Grundausstattung</label>
            <label><input id="lm-p-option" class="kurz mono" data-in="lmPz" data-k="option" value="${esc(mp.praefix.option)}"> Option</label></div></div>
          <label class="haken klein"><input type="checkbox" data-act="lmFuellen" ${mp.fuellen !== false ? "checked" : ""}> leere Zellen von oben übernehmen</label></div>
      </div>
      ${t && !t.inhalt ? `<p class="klein gedimmt" style="margin-top:12px">Blatt „${esc(mp.tab)}“ wird nicht verwendet.</p>` : tabelle}
      ${fehlt.length ? `<div class="hinweis warn">${fehlt.map(esc).join("<br>")}</div>` : ""}
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="liWeiter" ${fehlt.length ? "disabled" : ""}>Weiter zur Zusammenstellung</button></div></section>`;
  }
  K.act.lmStart = () => { mappeStarten(); K.render(); };
  K.act.lmEnde = () => { K.li.mappe = null; K.render(); };
  K.act.lmTab = el => { K.li.mappe.tab = el.dataset.n; K.render(); };
  K.act.lmInhalt = el => { const mp = K.li.mappe, n = el.dataset.n; mp.blaetter[n] = mappeBlatt(n, el.value); mp.tab = n; K.render(); };
  K.act.lmRolle = el => {
    const t = K.li.mappe.blaetter[K.li.mappe.tab], j = +el.dataset.j, r = el.value;
    if (r && r !== "xvariante") t.rollen = t.rollen.map((x, k) => x === r && k !== j ? "" : x);
    t.rollen[j] = r; K.render();
  };
  K.inp.lmKz = el => { const mp = K.li.mappe, t = mp.blaetter[mp.tab], aoa = K.li.blaetter[mp.tab]; t.kz = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); t.rollen = L.ratenInhalt(aoa, t.kz, t.inhalt, istVariante); K.render(); };
  K.inp.lmGa = el => { K.li.mappe.ga = el.value; };
  K.inp.lmPz = el => { K.li.mappe.praefix[el.dataset.k] = el.value.trim(); };
  K.act.lmFuellen = el => { K.li.mappe.fuellen = el.checked; };
  K.act.liDatei = async el => {
    const f = el.files[0]; if (!f) return;
    try {
      const bl = await lesen(f), i = K.li; i.datei = f.name; i.blaetter = bl; i.fehler = null; i.mappe = null;
      if (Object.keys(bl).filter(n => L.inhaltRaten(n, bl[n]) && bl[n].length > 1).length >= 3) { mappeStarten(); i.schritt = "spalten"; return K.render(); }
      const namen = Object.keys(bl).filter(n => bl[n].length > 1);
      const best = namen.sort((a, b) => bl[b].length - bl[a].length).find(n => !/^(anleitung|hinweis|info|liesmich)/i.test(n)) || Object.keys(bl)[0];
      blattWaehlen(best); i.schritt = "spalten";
    } catch (e) { console.error(e); K.li.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import-struktur" && K.li.schritt === "datei") e.preventDefault(); });
  document.addEventListener("drop", e => { if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import-struktur" || K.li.schritt !== "datei") return; e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) K.act.liDatei({ files: [f] }); });
  K.act.liBlatt = el => { blattWaehlen(el.value); K.render(); };
  K.inp.liKz = el => { const i = K.li, aoa = i.blaetter[i.blatt]; i.kz = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); i.rollen = L.raten(aoa, i.kz, istVariante); K.render(); };
  K.act.liFuellen = el => { K.li.fuellen = el.checked; };
  K.act.liRolle = el => {
    const i = K.li, j = +el.dataset.j, r = el.value;
    if (r && r !== "xvariante") i.rollen = i.rollen.map((x, k) => x === r && k !== j ? "" : x);
    i.rollen[j] = r; K.render();
  };
  K.act.liZurVorlage = () => {
    const i = K.li;
    Object.assign(K.imp, { datei: i.datei, blaetter: i.blaetter, zuo: K.X.zuordnungVorschlagen(i.blaetter, S().einst?.importZuordnung), schritt: "zuordnung", fehler: null });
    K.gehe("studio-import-vorlage");
  };
  K.act.liZurueck = el => { K.li.schritt = el.dataset.s; K.render(); };
  K.act.liWeiter = () => { neuRechnen(); K.li.schritt = "zs"; K.render(); };
  K.inp.liMName = el => { const m = K.li.zs.merkmale.get(el.dataset.k); m.name = el.value; m.auto = false; };
  K.act.liMTyp = el => { const m = K.li.zs.merkmale.get(el.dataset.k); m.fest = el.value === "f"; m.mehrfach = el.value === "1"; K.render(); };
  K.act.liMerge = el => {
    if (!el.value) return; const zs = K.li.zs, von = el.dataset.k, nach = el.value;
    for (const c of zs.codes.values()) if (c.merkmal === von) c.merkmal = nach;
    zs.merkmale.delete(von); K.render(); K.toast("Merkmale zusammengeführt");
  };
  K.act.liCode = el => { const a = K.li.auswahl, c = el.dataset.c; a.has(c) ? a.delete(c) : a.add(c); K.render(); };
  K.act.liAuswahlWeg = () => { K.li.auswahl.clear(); K.render(); };
  K.act.liVerschieben = () => {
    const i = K.li, zs = i.zs, sel = K.el("li-ziel").value; if (!sel) return K.toast("Bitte ein Ziel-Merkmal wählen.");
    let ziel = sel;
    if (sel === "__neu") { let n = 1; while (zs.merkmale.has("neu" + n)) n++; ziel = "neu" + n; zs.merkmale.set(ziel, { key: ziel, name: "Neues Merkmal " + n, mehrfach: false, auto: false }); }
    for (const c of i.auswahl) { const x = zs.codes.get(c); if (x) x.merkmal = ziel; }
    const n = i.auswahl.size; i.auswahl = new Set(); K.render(); K.toast(`${n} Codes verschoben`);
    if (sel === "__neu") K.nach(v => { const f = v.querySelector(`#li-mn-${ziel}`); if (f) { f.focus(); f.select(); } });
  };
  K.act.liOpt = el => { K.li[el.dataset.k] = el.checked; };
  K.act.liUebernehmen = async () => {
    const i = K.li;
    const r = L.inModell(i.zs, S().entwurf, { ersetzen: i.ersetzen, zusammenfassen: i.zusammenfassen });
    r.modell.version = S().entwurf?.version || S().live?.version || 0;
    K.Store.S.entwurf = r.modell;
    // Arbeitsmappe: wie im Katalogaufbau nach ZZ/YY gliedern
    let gegliedert = 0; for (const p of r.modell.produkte) if (p._gliedern) { delete p._gliedern; if (K.kbStrukturieren && K.kbStrukturieren(p)) gegliedert++; }
    if (gegliedert) r.stat.gegliedert = gegliedert;
    K.Store.entwurfGeaendert();
    if (i.zs.artikelstamm?.length && K.Store.artikelQuelle !== "applus") K.Store.artikelImport(i.zs.artikelstamm);
    const e = S().einst;
    if (e && i.mappe) { e.mappenImport = { ga: i.mappe.ga, praefix: i.mappe.praefix, blaetter: Object.fromEntries(Object.entries(i.mappe.blaetter).map(([n, b]) => [norm(n), { inhalt: b.inhalt, rollen: Object.fromEntries((i.blaetter[n][b.kz] || []).map((h, j) => [norm(h), b.rollen[j] || ""]).filter(([h]) => h)) }])) }; await K.Store.einstSpeichern(e, true); }
    else if (e) { const aoa = i.blaetter[i.blatt]; e.listenImport = Object.fromEntries((aoa[i.kz] || []).map((h, j) => [norm(h), i.rollen[j] || ""]).filter(([h]) => h)); await K.Store.einstSpeichern(e, true); }
    const st = r.stat; await K.Store.log("Import", `Liste „${i.datei}“ importiert: ${st.famNeu} Familien, ${st.artNeu} Varianten neu, ${st.codesNeu} Codes neu, ${st.codesGeaendert} geändert`);
    i.ergebnis = r; i.schritt = "fertig"; i.blaetter = null; i.zs = null; i.mappe = null; K.render();
  };
  K.act.liZumModell = () => { const mo = S().entwurf, f = mo.gruppen.find(g => !g.eltern); K.st.knoten = f ? "g:" + f.id : ""; K.st.modellTab = "merkmale"; K.gehe("studio-modell"); };
  K.act.liBeispiel = async () => {
    try { await K.lib("xlsx"); } catch (e) { return K.toast("Die Excel-Bibliothek ist nicht erreichbar."); }
    const ws = window.XLSX.utils.aoa_to_sheet(L.beispiel()); ws["!cols"] = L.beispiel()[0].map(h => ({ wch: Math.max(12, h.length + 4) }));
    const wb = window.XLSX.utils.book_new(); window.XLSX.utils.book_append_sheet(wb, ws, "Produktliste");
    K.speichereDatei("Beispiel_Produktliste.xlsx", new Blob([window.XLSX.write(wb, { bookType: "xlsx", type: "array" })]));
  };
})(typeof window !== "undefined" ? window : globalThis);
