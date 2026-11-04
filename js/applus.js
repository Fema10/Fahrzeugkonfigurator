/* =====================================================================
   Übergabe an APplus über dynamische Attribute (APplus-Datenimport)
   Aus dem Katalogaufbau entsteht je Fahrzeug ein Attribute-Konfigurator:
     Fahrzeug           → Attributklasse (SACHGRUPPENKLASSE), an Artikel, Angebots-/Auftragsposition …
     ZZ-Überschrift     → Attributgruppe (SACHGRUPPE) + Registerkarte (SACHWERTREGISTER)
     YY-Gruppe          → Attribut CHAR mit zulässigen Werten (SACHGRUPPEPOS, SACHVORGABE)
     Ja/Nein, Mehrfach  → Attribut BOOLEAN je Code
     Zahl / Freitext    → Attribut INT bzw. CHAR
     Regeln             → Attributdialog-Regeln (SACHWERTDLGREGEL, SDRPOS)
     Preise             → Vertriebsstückliste mit Variantenbedingung (VSTUELI, VSTUELIPOS)
     Stückliste         → Stücklistenpositionen mit Variantenbedingung (STUELIPOS), optional
   Ausgabe: Excel-Mappe im Format des APplus-Datenimports (Kopf, Datentyp, Von, Bis, Daten).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const AP = K.AP = {};
  const TABELLEN = ["SACHWERTINSTANZ", "ARTIKEL", "ANGEBOTPOS", "AUFTRAGPOS", "AUFSTUELIPOS", "STUELIPOS", "VSTUELI", "RECHNUNGPOS", "WARENAUSGANGPOS", "WAUFTRAGPOS", "APLANPOS"];
  AP.TABELLEN = TABELLEN;
  const schl = (s, n) => String(s || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "SS").replace(/[^A-Z0-9_-]/g, "").slice(0, n);
  const attrName = s => schl(String(s || "").replace(/-/g, "_"), 63) || "ATTR";
  AP.standardOpts = () => Object.assign({ mandant: "", sdrStart: 100, status: 2, spalten: 2, tabellen: TABELLEN.slice(), preise: true, stueckliste: false, preisArtikel: "", klassen: {} }, S().einst?.applusExport || {});
  AP.klasseVon = (p, opts) => schl((opts.klassen || {})[p.id] || p.code || p.id, 12) || "KONF";

  /** Aufbau eines Fahrzeugs als Attribute */
  function aufbau(mo, p, opts) {
    const k = AP.klasseVon(p, opts), hinweise = [], gruppen = [], ref = new Map(); // ref: "mid|wid" → {attr, wert, typ}
    const pm = E.produktMerkmale(mo, p), namen = new Set();
    const eindeutig = n => { let x = n, i = 2; while (namen.has(x)) x = n.slice(0, 60) + "_" + i++; namen.add(x); return x; };
    const gr = new Map();
    for (const x of pm) {
      const ab = x.m.abschnitt || x.m.ueberschrift || "Allgemein", code = x.m.abschnittCode || ab;
      const zz = schl(code, 6) || "ALLG", key = k.slice(0, 15 - 1 - zz.length) + "-" + zz; // Attributgruppe max. 15 Zeichen
      if (!gr.has(key)) gr.set(key, { key, name: ab, attribute: [] }); const g = gr.get(key);
      const wahl = x.werte.filter(w => E.wertTyp(x.m, w) === "auswahl"), eigene = x.werte.filter(w => E.wertTyp(x.m, w) !== "auswahl");
      if (wahl.length && x.m.typ !== "mehrfach") {
        const a = { name: eindeutig(attrName(x.m.code || x.m.name)), beschriftung: x.m.name, typ: "CHAR", pfl: 1, vorgaben: wahl.map(w => `${w.code || w.id}:${w.name}`), vorbelegung: (wahl.find(w => w.id === (x.standard || x.m.standard)) || (x.m.pflicht ? null : wahl[0]))?.code || "", merkmal: x.m };
        g.attribute.push(a); for (const w of wahl) ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: w.code || w.id, typ: "CHAR" });
        for (const w of wahl) if (/[^A-Za-z0-9_]/.test(w.code || "")) hinweise.push(`Code „${w.code}“ enthält Sonderzeichen. Bitte prüfen, ob APplus ihn in Bedingungen akzeptiert (${x.m.name}).`);
      } else for (const w of wahl) { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "BOOLEAN", pfl: 1, vorbelegung: (w.vorgabe || String(x.standard || "").split(",").includes(w.id)) ? "1" : "0", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: "1", typ: "BOOLEAN" }); }
      for (const w of eigene) {
        const t = E.wertTyp(x.m, w);
        if (t === "fest") { ref.set(x.m.id + "|" + w.id, { fest: true }); continue; }
        if (t === "janein") { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "BOOLEAN", pfl: 1, vorbelegung: w.vorgabe ? "1" : "0", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: "1", typ: "BOOLEAN" }); continue; }
        if (t === "zahl") { const z = w.zahl || {}, ganz = !z.schritt || Number.isInteger(z.schritt); const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: ganz ? "INT" : "DECIMAL", pfl: 1, einheit: z.einheit || "", min: z.min ?? "", max: z.max ?? "", vorbelegung: z.standard ?? 0, merkmal: x.m }; if (!ganz) hinweise.push(`${w.name}: Dezimalzahl – Datentyp in APplus prüfen (Referenz kennt INT).`); g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: ">0", typ: "ZAHL" }); continue; }
        if (t === "text") { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "CHAR", pfl: 0, vorbelegung: "", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: null, typ: "TEXT" }); }
      }
    }
    for (const g of gr.values()) if (g.attribute.length) gruppen.push(g);
    for (const g of gruppen) if (g.attribute.length > 8) hinweise.push(`Registerkarte „${g.name}“ hat ${g.attribute.length} Attribute. APplus zeigt standardmäßig 8 je Registerkarte (Systemkonfiguration › Attributwerte › Maximale Anzahl von Attributklassenpositionen).`);
    return { k, gruppen, ref, hinweise, pm };
  }

  /** Bedingung als Varianten-Ausdruck: + = UND, , = ODER. Mehrere Werte (ODER) ergeben getrennte Regeln. */
  function term(ref, mid, wid, neg) {
    const r = ref.get(mid + "|" + wid); if (!r || r.fest) return null;
    if (r.typ === "ZAHL") return neg ? `${r.attr}=0` : `${r.attr}>0`;
    if (r.typ === "TEXT") return null;
    return `${r.attr}${neg ? "!=" : "="}${r.wert}`;
  }
  function regeln(mo, p, a, opts, sdr) {
    const kopf = [], pos = [], hinweise = [], pm = a.pm, verfuegbar = mid => (pm.find(x => x.m.id === mid)?.werte || []).map(w => w.id);
    const aktion = (id, typ, attr, wert, msg) => pos.push({ SDR: id, ACTIONTYPE: typ, VALUE: wert ?? "", SACHBEGRIFF: attr || "", MESSAGE: msg || "", AKTIV: 1, MANDANT: opts.mandant || "" });
    /* APplus kann einzelne Werte einer Auswahlliste nicht ausblenden (Aktionen wirken auf das ganze Attribut).
       Darum: bleibt genau ein Code übrig → setValue + disabled; sonst je gesperrtem Code eine Zusatzregel
       „Bedingung + Attribut=Code“ → removeValue + warning. Ja/Nein und Zahl: setValue 0 + disabled. */
    const sperrMenge = (id, bed, mid, wids, name, text) => {
      const charW = [], rest = [];
      for (const wid of wids) { const r = a.ref.get(mid + "|" + wid); if (!r || r.fest) continue; (r.typ === "CHAR" ? charW : rest).push(r); }
      for (const r of rest) { if (r.typ === "TEXT") { aktion(id, "disabled", r.attr); continue; } aktion(id, "setValue", r.attr, "0"); aktion(id, "disabled", r.attr); }
      if (!charW.length) return;
      const attr = charW[0].attr, gesperrt = new Set(charW.map(r => r.wert));
      const uebrig = verfuegbar(mid).map(w => a.ref.get(mid + "|" + w)).filter(r => r && r.attr === attr && !gesperrt.has(r.wert));
      if (uebrig.length === 1) { aktion(id, "setValue", attr, uebrig[0].wert); aktion(id, "disabled", attr); if (text) aktion(id, "info", attr, "", text); return; }
      if (!uebrig.length) { aktion(id, "error", attr, "", text || `Keine zulässige Auswahl für ${attr}.`); return; }
      for (const r of charW) { const z = neu(`${bed}+${attr}=${r.wert}`, `${name}: ${r.wert} nicht zulässig`); aktion(z, "removeValue", attr); aktion(z, "warning", attr, "", text || `${r.wert} ist in dieser Kombination nicht zulässig.`); }
    };
    const setze = (id, mid, wid) => { const r = a.ref.get(mid + "|" + wid); if (!r || r.fest) return; if (r.typ === "CHAR") aktion(id, "setValue", r.attr, r.wert); else if (r.typ === "BOOLEAN") aktion(id, "setValue", r.attr, "1"); };
    let rf = 0; const neu = (bed, name) => { const id = String(sdr.n++).padStart(8, "0"); kopf.push({ SDR: id, SACHGRUPPENKLASSE: a.k, TABELLE: "", REIHENFOLGE: rf += 10, VARIANTE: bed, VARIANTE_EDIT: bed, _name: name, AKTIV: 1, MANDANT: opts.mandant || "" }); return id; };
    for (const r of mo.regeln) {
      if (!r.aktiv || !E.imGeltungsbereich(mo, r, p)) continue;
      if (r.typ === "tabelle") {
        const t = r.tabelle || {}; if ((t.merkmale || []).length !== 2) { hinweise.push(`Kombinationstabelle „${r.name || r.id}“ mit ${(t.merkmale || []).length} Spalten bitte von Hand anlegen.`); continue; }
        const [A, B] = t.merkmale;
        for (const x of verfuegbar(A)) { const b = term(a.ref, A, x); if (!b) continue; const ok = new Set((t.zeilen || []).filter(z => z[0] === x).map(z => z[1])), weg = verfuegbar(B).filter(y => !ok.has(y)); if (!weg.length) continue; const id = neu(b, `${r.name || r.id}`); sperrMenge(id, b, B, weg, r.name || r.id, r.hinweis); }
        continue;
      }
      if (!r.dann || !r.wenn?.length) continue;
      // Bedingungen: je Bedingung Alternativen (ODER), zusammen UND
      let alternativen = [[]], ok = true;
      for (const c of r.wenn) {
        const ws = (c.werte || []).filter(w => verfuegbar(c.merkmal).includes(w) || true);
        if (c.op === "istNicht") { const t = ws.map(w => term(a.ref, c.merkmal, w, true)).filter(Boolean); if (!t.length) { ok = false; break; } alternativen = alternativen.map(x => [...x, ...t]); }
        else { const t = ws.map(w => term(a.ref, c.merkmal, w)).filter(Boolean); if (!t.length) { ok = false; break; } alternativen = alternativen.flatMap(x => t.map(y => [...x, y])); }
      }
      if (!ok) { hinweise.push(`Regel ${r.id} („${r.name || ""}“) bezieht sich auf Codes, die es bei ${p.name} nicht gibt oder die Freitext sind, nicht übernommen.`); continue; }
      if (alternativen.length > 40) { hinweise.push(`Regel ${r.id} hätte ${alternativen.length} Varianten-Kombinationen, bitte von Hand vereinfachen.`); continue; }
      for (const alt of alternativen) {
        const id = neu(alt.join("+"), `${r.id} ${r.name || ""}`.trim()), d = r.dann;
        const bed = alt.join("+"), nm = `${r.id} ${r.name || ""}`.trim();
        if (d.typ === "sperren") sperrMenge(id, bed, d.merkmal, d.werte || [], nm, r.hinweis);
        else if (d.typ === "nurErlauben") sperrMenge(id, bed, d.merkmal, verfuegbar(d.merkmal).filter(w => !(d.werte || []).includes(w)), nm, r.hinweis);
        else if (d.typ === "setzen") for (const w of d.werte || []) setze(id, d.merkmal, w);
        if (r.hinweis && d.typ === "setzen") { const r0 = a.ref.get(d.merkmal + "|" + (d.werte || [])[0]) || [...a.ref.values()].find(x => x.attr); aktion(id, "info", r0?.attr, "", r.hinweis); }
      }
    }
    // Regeln ohne Aktion entfallen, Nummern lückenlos
    const start = kopf.length ? +kopf[0].SDR : sdr.n, neuNr = new Map(); let n = start;
    const bleibt = kopf.filter(k => pos.some(x => x.SDR === k.SDR)); bleibt.forEach((k, i) => { neuNr.set(k.SDR, String(n++).padStart(8, "0")); k.SDR = neuNr.get(k.SDR); k.REIHENFOLGE = (i + 1) * 10; });
    for (const x of pos) x.SDR = neuNr.get(x.SDR); sdr.n = n;
    return { kopf: bleibt, pos, hinweise };
  }

  /** Alle Blätter für die gewählten Fahrzeuge */
  AP.erzeugen = (mo, produkte, opts) => {
    opts = Object.assign(AP.standardOpts(), opts || {}); const sdr = { n: +opts.sdrStart || 100 };
    const D = { SACHGRUPPENKLASSENNAME: [], SACHGRUPPENKLASSE: [], SACHGRUPPE: [], SACHWERTREGISTER: [], SACHGRUPPENKLASSEPOS: [], SACHGRUPPEPOS: [], SACHVORGABE: [], SACHWERTDLGREGEL: [], SDRPOS: [], VSTUELI: [], VSTUELIPOS: [], STUELIPOS: [] };
    const hinweise = [], pruef = [], M = opts.mandant || "";
    const klassen = new Set(), gruppenKeys = new Map();
    for (const p of produkte) {
      const a = aufbau(mo, p, opts);
      if (klassen.has(a.k)) { hinweise.push(`Attributklasse ${a.k} doppelt (${p.name}). Bitte bei den Fahrzeugen eindeutige Klassen eintragen.`); continue; }
      klassen.add(a.k); hinweise.push(...a.hinweise.map(h => `${p.name}: ${h}`));
      D.SACHGRUPPENKLASSENNAME.push({ SACHGRUPPENKLASSENNAME: a.k, MANDANT: M });
      for (const t of opts.tabellen) D.SACHGRUPPENKLASSE.push({ SACHGRUPPENKLASSE: a.k, TABELLE: t, GUI_MODE: t === "SACHWERTINSTANZ" ? 1 : "", TECHDLG_MODE: t === "SACHWERTINSTANZ" ? 0 : "", MANDANT: M });
      for (const g of a.gruppen) { if (gruppenKeys.has(g.key)) hinweise.push(`${p.name}: Attributgruppe ${g.key} gibt es schon bei ${gruppenKeys.get(g.key)}. Bitte eine kürzere, eindeutige Attributklasse wählen (Gruppen nutzen die ersten ${15 - 1 - g.key.split("-").pop().length} Zeichen).`); else gruppenKeys.set(g.key, p.name); }
      a.gruppen.forEach((g, gi) => {
        D.SACHGRUPPE.push({ SACHGRUPPE: g.key, NAME: g.name.slice(0, 63), STATUS: +opts.status || 1, SACHWERTINSTANZ: 1, MANDANT: M });
        D.SACHWERTREGISTER.push({ SACHWERTREGISTER: g.key, SACHGRUPPENKLASSE: a.k, NAME: g.name.slice(0, 63), GUI_COLUMNS: +opts.spalten || 2, MANDANT: M });
        D.SACHGRUPPENKLASSEPOS.push({ SACHGRUPPENKLASSE: a.k, TABELLE: "SACHWERTINSTANZ", SACHGRUPPE: g.key, REIHENFOLGE: (gi + 1) * 10, MANDANT: M });
        g.attribute.forEach((at, i) => {
          D.SACHGRUPPEPOS.push({ SACHGRUPPE: g.key, POSITION: i + 1, NAME: at.name, PFL: at.pfl ? 1 : "", TYPE: at.typ, EINHEITTYPE: at.einheit ? "ME" : "NO", EINHEIT: at.einheit || "", REIHENFOLGE: (i + 1) * 10, MAXWERT: at.max ?? "", MINWERT: at.min ?? "", VORBELEGUNG: at.vorbelegung ?? "", SACHWERTREGISTER: g.key, ISAKTIVEVARIANTE: 1, GUI_TRIGGERRULE: 1, AKTIV: 1, BESCHRIFTUNG: String(at.beschriftung || at.name).slice(0, 63), MANDANT: M });
          if (at.vorgaben) { const v = at.vorgaben.join("\n") + "\n"; D.SACHVORGABE.push({ SACHGRUPPE: g.key, POSITION: i + 1, VORGABE: v, VORGABEKOPIE: v, MANDANT: M }); }
        });
      });
      const rg = regeln(mo, p, a, opts, sdr); D.SACHWERTDLGREGEL.push(...rg.kopf); D.SDRPOS.push(...rg.pos); hinweise.push(...rg.hinweise.map(h => `${p.name}: ${h}`));
      if (opts.preise) {
        D.VSTUELI.push({ VSTUELI: p.code, NAME: p.name, SACHGRUPPENKLASSE: a.k, MANDANT: M }); let n = 0;
        for (const x of a.pm) for (const w of x.werte) {
          const pr = E.wertPreis(mo, p, w), r = a.ref.get(x.m.id + "|" + w.id); if (!pr || !r) continue;
          const bed = r.fest ? "" : term(a.ref, x.m.id, w.id); if (bed === null) { hinweise.push(`${p.name}: Preis für ${w.code} (Freitext) bitte von Hand hinterlegen.`); continue; }
          D.VSTUELIPOS.push({ VSTUELI: p.code, POSITION: ++n, ARTIKEL: opts.preisArtikel || w.code, VARIANTE: bed, MENGE: 1, NAME: String(w.name).slice(0, 63), VKME: "Stück", NETTO: pr, NODISPO: 1, NOAUFSTUELI: 1, DONTPRINTPRICE: 1, NICHTBUCHEN: 1, MANDANT: M });
          if (r.typ === "ZAHL") hinweise.push(`${p.name}: ${w.name} kostet ${K.eur(pr)} je ${w.zahl?.einheit || "Einheit"}. In der Vertriebsstücklistenposition die Menge mit dem Attributwert ${r.attr} verknüpfen (Script).`);
        }
      }
      if (opts.stueckliste) {
        let n = 0; for (const z of p.stl || []) D.STUELIPOS.push({ STUELI: p.code, POSITION: (++n) * 10, ARTIKEL: z[0], VARIANTE: "", MENGE: z[2] || 1, NAME: String(z[1] || "").slice(0, 63), VBME: z[3] || "", MANDANT: M });
        for (const x of a.pm) for (const w of x.werte) for (const z of w.stl || []) { const bed = a.ref.get(x.m.id + "|" + w.id)?.fest ? "" : term(a.ref, x.m.id, w.id); if (bed === null) continue; D.STUELIPOS.push({ STUELI: p.code, POSITION: (++n) * 10, ARTIKEL: z[0], VARIANTE: bed, MENGE: z[2] || 1, NAME: String(z[1] || "").slice(0, 63), VBME: z[3] || "", MANDANT: M }); }
      }
      pruef.push([p.name, p.code, a.k, a.gruppen.length, a.gruppen.reduce((s, g) => s + g.attribute.length, 0), rg.kopf.length, `Artikel ${p.code}: Feld Attributklasse = ${a.k}${opts.preise ? ", Vertriebsstückliste aktiv" : ""}`]);
    }
    return { D, hinweise, pruef, sdrBis: sdr.n - 1, opts };
  };

  /** Blatt im Format des Datenimports: Kopf, Datentyp, Von, Bis, Daten */
  function blatt(name, zeilen) {
    const v = K.DA_VORLAGE[name]; if (!v) return null;
    const kopf = v[0], typ = v[1], wo = typ.map((t, i) => t === "where" ? i : -1).filter(i => i >= 0);
    const von = v[2].slice(), bis = v[3].slice();
    for (const i of wo) { const werte = zeilen.map(z => String(z[kopf[i]] ?? "")).filter(Boolean).sort(); if (werte.length) { von[i] = werte[0]; bis[i] = werte[werte.length - 1] + (/^\d+$/.test(werte[werte.length - 1]) ? "" : "ZZZ"); } else { von[i] = ""; bis[i] = ""; } }
    const daten = zeilen.map(z => kopf.map(h => z[h] ?? ""));
    return [kopf, typ, von, bis, ...daten];
  }
  AP.mappe = async erg => {
    await K.lib("xlsx"); const X = window.XLSX, wb = X.utils.book_new(), D = erg.D;
    const kl = D.SACHGRUPPENKLASSENNAME.map(z => z.SACHGRUPPENKLASSENNAME).sort();
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([[], ["", "Klasse", kl[0] || ""], ["", "bis", (kl[kl.length - 1] || "") + "ZZZ"], [], [], ["", "SDRPOS", String(erg.opts.sdrStart).padStart(8, "0")], ["", "bis", String(Math.max(erg.sdrBis, erg.opts.sdrStart)).padStart(8, "0")]]), "setup");
    const reihe = ["SACHGRUPPE", "SACHWERTREGISTER", "SACHGRUPPEPOS", "SACHVORGABE", "SACHGRUPPENKLASSENNAME", "SACHGRUPPENKLASSE", "SACHGRUPPENKLASSEPOS", "SACHWERTDLGREGEL", "SDRPOS"];
    if (erg.opts.preise) reihe.push("VSTUELI", "VSTUELIPOS"); if (erg.opts.stueckliste) reihe.push("STUELIPOS");
    for (const n of reihe) { const a = blatt(n, D[n]); if (a) { const ws = X.utils.aoa_to_sheet(a); ws["!cols"] = a[0].map(h => ({ wch: Math.max(10, Math.min(40, String(h).length + 2)) })); X.utils.book_append_sheet(wb, ws, n); } }
    if (D.SACHWERTDLGREGEL.length) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Regel (SDR)", "Attributklasse", "Bedingung", "Herkunft im Konfigurator", "Aktionen (zum Erfassen von Hand)"], ...D.SACHWERTDLGREGEL.map(r => [r.SDR, r.SACHGRUPPENKLASSE, r.VARIANTE, r._name || "", D.SDRPOS.filter(x => x.SDR === r.SDR).map(x => `${x.ACTIONTYPE} ${x.SACHBEGRIFF}${x.VALUE !== "" ? " = " + x.VALUE : ""}${x.MESSAGE ? " „" + x.MESSAGE + "“" : ""}`).join("; ")])]), "Regelübersicht");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Fahrzeug", "Artikel", "Attributklasse", "Attributgruppen", "Attribute", "Regeln", "Am Artikel eintragen"], ...erg.pruef]), "Prüfliste");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Hinweise"], ...erg.hinweise.map(h => [h]), [], ["Ablauf"], ["1. Mappe mit dem APplus-Datenimport einlesen (Blätter in dieser Reihenfolge)."], ["2. Attributgruppen freigeben, falls Status 1 (angelegt) gewählt."], ["3. Am Fahrzeugartikel die Attributklasse eintragen (siehe Prüfliste)."], ["4. Systemkonfiguration: Variantenkonfiguration › VariantenParserAdapter2; an der Attributklasse „Attributdialog Regeln aktiv“."], ["5. SDRPOS (Regelaktionen): laut Referenz-Mappe ggf. von Hand erfassen, falls der Import sie nicht übernimmt. Die Regelübersicht listet je Regel die Aktionen."], ["6. Gesperrte Einzelcodes: APplus blendet keine einzelnen Werte aus. Darum je Code eine Regel „Bedingung + Attribut=Code“ mit removeValue und Warnung."]]), "Hinweise");
    return new Blob([X.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  };

  /* ---------- Oberfläche: Studio › Nach APplus ---------- */
  K.apx = { auswahl: null, tab: "SACHGRUPPEPOS" };
  const ro = () => !K.Store.schreiben, St = () => K.studio;
  K.route("studio-applus", () => {
    const mo = S().entwurf; if (!mo) return St().keinEntwurf();
    const opts = AP.standardOpts(), fz = mo.produkte.filter(p => E.produktMerkmale(mo, p).length);
    if (!K.apx.auswahl) K.apx.auswahl = new Set(fz.slice(0, 1).map(p => p.id));
    const gew = fz.filter(p => K.apx.auswahl.has(p.id)), erg = gew.length ? AP.erzeugen(mo, gew, opts) : null;
    const dis = ro() ? "disabled" : "";
    const tabs = erg ? Object.entries(erg.D).filter(([n, z]) => z.length || ["SACHGRUPPEPOS", "SACHVORGABE", "SACHWERTDLGREGEL", "SDRPOS"].includes(n)) : [];
    const t = K.apx.tab, zeilen = erg?.D[t] || [], kopf = K.DA_VORLAGE[t]?.[0] || [], belegt = [...kopf.filter(h => zeilen.some(z => z[h] !== undefined && z[h] !== "")), ...(t === "SACHWERTDLGREGEL" ? ["_name"] : [])];
    return St().kopf("Nach APplus übertragen", "Die Konfiguration aus dem Katalogaufbau als dynamische Attribute für APplus: je Fahrzeug eine Attributklasse, ZZ-Überschriften als Attributgruppen, YY-Gruppen als Attribute mit zulässigen Codes, Regeln als Attributdialog-Regeln, Preise als Vertriebsstückliste. Ausgabe als Mappe für den APplus-Datenimport.") + `
      <div class="apx-layout">
        <section class="panel"><h3>Fahrzeuge</h3>
          <table class="kompakt apx-fz"><thead><tr><th></th><th>Fahrzeug</th><th>Artikel</th><th>Attributklasse</th><th class="r">Codes</th><th></th></tr></thead><tbody>
          ${fz.map(p => { const eigen = (opts.klassen || {})[p.id], frage = K.apx.loeschen === p.id; return `<tr><td><input type="checkbox" data-act="apxWahl" data-p="${p.id}" ${K.apx.auswahl.has(p.id) ? "checked" : ""} aria-label="${esc(p.name)} übertragen"></td>
            <td><input id="apx-n-${p.id}" data-chg="apxName" data-p="${p.id}" value="${esc(p.name)}" aria-label="Fahrzeugname" ${dis}></td>
            <td><input id="apx-c-${p.id}" class="mono" data-chg="apxCode" data-p="${p.id}" value="${esc(p.code || "")}" aria-label="Artikelnummer" ${dis}></td>
            <td><span class="apx-kl"><input id="apx-k-${p.id}" class="mono kurz" data-chg="apxKlasse" data-p="${p.id}" value="${esc(AP.klasseVon(p, opts))}" maxlength="12" aria-label="Attributklasse" ${dis}>${eigen && !ro() ? `<button type="button" class="btn klein ghost" data-act="apxKlasseZurueck" data-p="${p.id}" title="Wieder aus der Artikelnummer bilden" aria-label="Attributklasse zurücksetzen">↺</button>` : ""}</span></td>
            <td class="r num">${E.produktMerkmale(mo, p).reduce((n, x) => n + x.werte.length, 0)}</td>
            <td class="r">${ro() ? "" : frage ? `<span class="apx-frage"><button type="button" class="btn klein gefahr" data-act="apxLoeschenOk" data-p="${p.id}">Löschen</button><button type="button" class="btn klein ghost" data-act="apxLoeschen" data-p="">Abbrechen</button></span>` : `<button type="button" class="btn klein gefahr-text" data-act="apxLoeschen" data-p="${p.id}" aria-label="${esc(p.name)} löschen">Löschen</button>`}</td></tr>`; }).join("") || `<tr><td colspan="6" class="gedimmt">Noch keine Fahrzeuge mit Codes. Erst im Katalogaufbau anlegen.</td></tr>`}</tbody></table>
          ${K.apx.loeschen ? `<p class="klein gefahr-text">Das Fahrzeug wird aus Katalog aufbauen und aus dem Katalog gelöscht. Zurückholen über Studio › Protokoll.</p>` : ""}
          <p class="klein gedimmt">Attributklasse höchstens 12 Zeichen. Attributgruppen heißen Klasse-ZZ-Code (max. 15 Zeichen).</p></section>
        <section class="panel"><h3>Einstellungen</h3><div class="formgitter">
          <div class="feld"><label for="apx-m">Mandant</label><input id="apx-m" class="mono kurz" data-chg="apxOpt" data-k="mandant" value="${esc(opts.mandant)}" placeholder="leer" ${dis}></div>
          <div class="feld"><label for="apx-sdr">Erste Regelnummer (SDR)</label><input id="apx-sdr" type="number" min="1" data-chg="apxOpt" data-k="sdrStart" value="${opts.sdrStart}" ${dis}><span class="klein gedimmt">frei bis ${erg ? String(Math.max(erg.sdrBis, opts.sdrStart)).padStart(8, "0") : "–"}</span></div>
          <div class="feld"><label for="apx-st">Status der Attributgruppen</label><select id="apx-st" data-act="apxOptW" data-k="status" ${dis}><option value="1" ${+opts.status === 1 ? "selected" : ""}>1 – angelegt (danach in APplus freigeben)</option><option value="2" ${+opts.status === 2 ? "selected" : ""}>2 – freigegeben</option></select></div>
          <div class="feld"><label for="apx-sp">Spalten je Registerkarte</label><select id="apx-sp" data-act="apxOptW" data-k="spalten" ${dis}>${[1, 2, 3].map(n => `<option ${+opts.spalten === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
          <div class="feld"><label for="apx-pa">Artikel für Preisanteile</label><input id="apx-pa" class="mono" data-chg="apxOpt" data-k="preisArtikel" value="${esc(opts.preisArtikel)}" placeholder="leer = Vertriebscode selbst" ${dis}></div>
        </div>
          <label class="haken"><input type="checkbox" data-act="apxOptH" data-k="preise" ${opts.preise ? "checked" : ""} ${dis}> Preise als Vertriebsstückliste (VSTUELI/VSTUELIPOS)</label>
          <label class="haken"><input type="checkbox" data-act="apxOptH" data-k="stueckliste" ${opts.stueckliste ? "checked" : ""} ${dis}> Stücklistenpositionen mit Variantenbedingung (STUELIPOS)</label>
          <details><summary class="klein">Tabellen der Attributklasse (${opts.tabellen.length})</summary><div class="apx-tab">${TABELLEN.map(x => `<label class="haken klein"><input type="checkbox" data-act="apxTabelle" data-t="${x}" ${opts.tabellen.includes(x) ? "checked" : ""} ${dis}> ${x}</label>`).join("")}</div></details>
          <div class="row"><button class="btn primary" type="button" data-act="apxLaden" ${erg ? "" : "disabled"}>Mappe für den APplus-Datenimport herunterladen</button></div></section>
      </div>
      ${erg ? `<section class="panel"><div class="panelkopf"><h3>Vorschau</h3><span class="klein gedimmt">${erg.D.SACHGRUPPE.length} Attributgruppen · ${erg.D.SACHGRUPPEPOS.length} Attribute · ${erg.D.SACHWERTDLGREGEL.length} Regeln · ${erg.D.VSTUELIPOS.length} Preisanteile</span></div>
        <div class="tabs-innen apx-tabs klein" role="tablist">${tabs.map(([n, z]) => `<button type="button" role="tab" data-act="apxTab" data-t="${n}" aria-selected="${t === n}">${n} <span class="tabzahl">${z.length}</span></button>`).join("")}</div>
        <div class="tabwrap apx-vorschau"><table class="kompakt"><thead><tr>${belegt.map(h => `<th>${h === "_name" ? "Herkunft" : esc(h)}</th>`).join("")}</tr></thead><tbody>${zeilen.slice(0, 200).map(z => `<tr>${belegt.map(h => `<td class="${/VORGABE|VARIANTE|MESSAGE/.test(h) ? "mono klein umbruch" : ""}">${esc(String(z[h] ?? "")).replace(/\n/g, "<br>")}</td>`).join("")}</tr>`).join("") || `<tr><td class="gedimmt">keine Zeilen</td></tr>`}</tbody></table></div>
        ${erg.hinweise.length ? `<details class="apx-hinweise" open><summary><b>${erg.hinweise.length} Hinweise</b></summary><ul>${erg.hinweise.map(h => `<li>${esc(h)}</li>`).join("")}</ul></details>` : ""}
        <div class="hinweis klein"><b>Danach in APplus:</b> Mappe mit dem Datenimport einlesen, am Fahrzeugartikel die Attributklasse eintragen (${erg.pruef.map(x => `${esc(x[1])} → ${esc(x[2])}`).join(", ")}), in der Systemkonfiguration den VariantenParserAdapter2 wählen und an der Attributklasse „Attributdialog Regeln aktiv“ setzen. Laut Ihrer Referenzmappe werden Regelaktionen (SDRPOS) ggf. nicht importiert und müssen dann von Hand erfasst werden.</div></section>` : ""}`;
  });
  const optSetzen = async (k, v) => { const e = S().einst; e.applusExport = Object.assign(AP.standardOpts(), e.applusExport || {}, { [k]: v }); await K.Store.einstSpeichern(e, true); K.render(); };
  K.act.apxWahl = el => { const s = K.apx.auswahl; el.checked ? s.add(el.dataset.p) : s.delete(el.dataset.p); K.render(); };
  K.inp.apxKlasse = el => { const o = AP.standardOpts(); o.klassen = Object.assign({}, o.klassen, { [el.dataset.p]: schl(el.value, 12) }); optSetzen("klassen", o.klassen); };
  K.inp.apxOpt = el => optSetzen(el.dataset.k, el.type === "number" ? +el.value : el.value.trim());
  K.act.apxOptW = el => optSetzen(el.dataset.k, +el.value || el.value);
  K.act.apxOptH = el => optSetzen(el.dataset.k, el.checked);
  K.act.apxTabelle = el => { const o = AP.standardOpts(); optSetzen("tabellen", el.checked ? [...new Set([...o.tabellen, el.dataset.t])] : o.tabellen.filter(x => x !== el.dataset.t)); };
  const fzg = id => S().entwurf.produkte.find(p => p.id === id), aenderung = t => K.Store.entwurfGeaendert(t);
  K.inp.apxName = el => { const p = fzg(el.dataset.p), v = el.value.trim(); if (!p || !v || v === p.name) return K.render(); const alt = p.name; p.name = v; aenderung(`Fahrzeug ${alt} umbenannt in ${v}`); K.render(); };
  K.inp.apxCode = el => { const p = fzg(el.dataset.p), v = el.value.trim(); if (!p || v === (p.code || "")) return; if (v && S().entwurf.produkte.some(x => x !== p && (x.code || "") === v)) { K.toast(`Artikelnummer ${v} ist schon vergeben`); return K.render(); } const alt = p.code; p.code = v; aenderung(`Artikelnummer ${alt || "–"} → ${v || "–"} (${p.name})`); K.render(); };
  K.act.apxKlasseZurueck = el => { const o = AP.standardOpts(), k = Object.assign({}, o.klassen); delete k[el.dataset.p]; optSetzen("klassen", k); };
  K.act.apxLoeschen = el => { K.apx.loeschen = el.dataset.p || null; K.render(); };
  K.act.apxLoeschenOk = el => {
    const mo = S().entwurf, p = fzg(el.dataset.p); if (!p) return; K.apx.loeschen = null;
    K.apx.auswahl.delete(p.id); K.Store.endgueltigLoeschen({ produkte: [p.id] }, `Fahrzeug ${p.name} (${p.code || p.id}) gelöscht`).then(() => K.render());
    const o = AP.standardOpts(); if ((o.klassen || {})[p.id]) { const k = Object.assign({}, o.klassen); delete k[p.id]; optSetzen("klassen", k); }
    K.toast(`${p.name} gelöscht. Zurückholen über Studio › Protokoll.`);
  };
  K.act.apxTab = el => { K.apx.tab = el.dataset.t; K.render(); };
  K.act.apxLaden = async el => {
    const mo = S().entwurf, gew = mo.produkte.filter(p => K.apx.auswahl.has(p.id)); el.disabled = true;
    try { const erg = AP.erzeugen(mo, gew, AP.standardOpts()); const blob = await AP.mappe(erg); await K.speichereDatei(`APplus_Attribute_${gew.map(p => AP.klasseVon(p, erg.opts)).join("_").slice(0, 60)}.xlsx`, blob); K.Store.log("APplus", `Datenimport-Mappe für ${gew.map(p => p.name).join(", ")} erzeugt`); }
    catch (e) { console.error(e); K.toast("Mappe konnte nicht erzeugt werden: " + (e.message || e)); }
    el.disabled = false;
  };
})(typeof window !== "undefined" ? window : globalThis);
