/* =====================================================================
   Excel-Import „Codes & Preise“ für eine Produktgruppe
   1. Produktgruppe wählen  2. Excel ablegen  3. prüfen und übernehmen
   Aus der Datei werden nur Code und Preis gelesen. Die Preise gelten für die
   gewählte Produktgruppe (inkl. Unterfamilien und Fahrzeuge darunter).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  const txt = v => String(v ?? "").trim();
  const zahl = v => K.X && K.X.zahl ? K.X.zahl(v) : (typeof v === "number" ? v : null);
  const ro = () => !K.Store.schreiben;
  const SYN = {
    code: ["code", "vertriebscode", "konfigurationscode", "vkcode", "artikel", "artikelnummer", "artikelnr", "codes", "option", "nr", "nummer"],
    preis: ["preis", "vkpreis", "listenpreis", "preisaufschlag", "aufpreis", "aufschlag", "verkaufspreis", "preiseur", "preisnetto", "nettopreis", "neuerpreis", "betrag"],
    name: ["bezeichnung", "benennung", "ausstattungsposition", "codebezeichnung", "text", "beschreibung", "artikelbezeichnung"],
    gruppe: ["produktgruppe", "produktfamilie", "familie", "baureihe", "gruppe"]
  };
  K.pi = { schritt: "start", gruppe: "", datei: null, blaetter: null, blatt: null, kz: 0, sp: {}, filter: "", neuAn: false, neuZiel: "", fehler: null, ergebnis: null };

  /* ---------- Spalten und Blatt erkennen ---------- */
  function bekannteCodes() {
    const mo = S().entwurf, set = new Set(); if (!mo) return set;
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) set.add(String(w.code).toUpperCase());
    for (const p of mo.produkte) if (p.code) set.add(String(p.code).toUpperCase());
    return set;
  }
  function kopfzeile(aoa) {
    const alle = new Set(Object.values(SYN).flat()); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(25, aoa.length); i++) { const z = aoa[i] || [], s = z.filter(c => alle.has(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0); if (s > bs) { bs = s; best = i; } }
    return best;
  }
  function spaltenRaten(aoa, kz) {
    const kopf = (aoa[kz] || []).map(norm), daten = aoa.slice(kz + 1, kz + 300), bek = bekannteCodes(), breite = Math.max(kopf.length, ...daten.slice(0, 30).map(r => (r || []).length));
    const sp = {}, besetzt = new Set();
    const nachName = rolle => { for (const s of SYN[rolle]) { const j = kopf.findIndex((h, k) => h === s && !besetzt.has(k)); if (j >= 0) return j; } for (const s of SYN[rolle]) { if (s.length < 4) continue; const j = kopf.findIndex((h, k) => h && h.includes(s) && !besetzt.has(k)); if (j >= 0) return j; } return -1; };
    // Code: Spalte mit den meisten bekannten Codes, sonst nach Überschrift
    let jc = -1, bestT = 0;
    for (let j = 0; j < breite; j++) { const t = daten.filter(r => bek.has(txt(r?.[j]).toUpperCase())).length; if (t > bestT) { bestT = t; jc = j; } }
    if (jc < 0 || bestT < 2) { const j = nachName("code"); if (j >= 0) jc = j; }
    if (jc >= 0) { sp.code = jc; besetzt.add(jc); }
    // Preis: nach Überschrift, sonst Spalte mit den meisten Zahlen
    let jp = nachName("preis");
    if (jp < 0) { let bz = 0; for (let j = 0; j < breite; j++) { if (besetzt.has(j)) continue; const z = daten.filter(r => typeof r?.[j] === "number" || (txt(r?.[j]) && zahl(r[j]) != null)).length; if (z > bz) { bz = z; jp = j; } } }
    if (jp >= 0) { sp.preis = jp; besetzt.add(jp); }
    const jn = nachName("name"); if (jn >= 0) { sp.name = jn; besetzt.add(jn); }
    const jg = nachName("gruppe"); if (jg >= 0) { sp.gruppe = jg; besetzt.add(jg); }
    return sp;
  }
  function blattRaten(bl) {
    const bek = bekannteCodes(); let best = null, bs = -1;
    for (const [n, aoa] of Object.entries(bl)) {
      if (aoa.length < 2) continue;
      const treffer = aoa.reduce((a, r) => a + ((r || []).some(c => bek.has(txt(c).toUpperCase())) ? 1 : 0), 0);
      const s = treffer * 10 + (/preis/i.test(n) ? 50 : 0) + Math.min(aoa.length, 40) - (/export|anleitung|hinweis/i.test(n) ? 500 : 0);
      if (s > bs) { bs = s; best = n; }
    }
    return best || Object.keys(bl)[0];
  }
  function blattSetzen(n) {
    const i = K.pi, aoa = i.blaetter[n]; i.blatt = n; i.kz = kopfzeile(aoa); i.sp = spaltenRaten(aoa, i.kz); i.filter = filterRaten();
  }
  /** Werte der Produktgruppen-Spalte und Vorschlag passend zur gewählten Gruppe */
  function gruppenWerte() {
    const i = K.pi; if (i.sp.gruppe == null) return [];
    const aoa = i.blaetter[i.blatt], set = new Map(); let akt = "";
    for (const r of aoa.slice(i.kz + 1)) { const v = txt(r?.[i.sp.gruppe]) || akt; if (txt(r?.[i.sp.gruppe])) akt = v; if (v && !set.has(norm(v))) set.set(norm(v), v); }
    return [...set.values()];
  }
  function filterRaten() {
    const g = gruppeObj(); if (!g) return ""; const werte = gruppenWerte(), n = norm(g.name), a = norm(g.artikelgruppe || "");
    return werte.find(v => norm(v) === n || (a && norm(v) === a)) || werte.find(v => norm(v).includes(n) || n.includes(norm(v))) || "";
  }
  const gruppeObj = () => (S().entwurf?.gruppen || []).find(g => g.id === K.pi.gruppe);

  /* ---------- Abgleich ---------- */
  /** Codes, die in der Gruppe vorkommen: Wert → Merkmal; Fahrzeuge der Gruppe */
  function inGruppe(mo, gid) {
    const g = mo.gruppen.find(x => x.id === gid), werte = new Map(), fahrzeuge = new Map();
    const objekte = [g, ...mo.gruppen.filter(x => x.id !== gid && E.gruppenPfad(mo, x.id).some(y => y.id === gid)), ...E.familienArtikel(mo, gid)];
    for (const o of objekte) for (const { m, werte: ws } of E.zuordnung(mo, o).map(z => ({ m: E.merkmal(mo, z.id), werte: z.werte })).filter(x => x.m)) for (const w of ws && ws.length ? x(m, ws) : m.werte) if (w.code) werte.set(String(w.code).toUpperCase(), { m, w });
    function x(m, ws) { return m.werte.filter(w => ws.includes(w.id)); }
    for (const p of E.familienArtikel(mo, gid)) if (p.code) fahrzeuge.set(String(p.code).toUpperCase(), p);
    return { werte, fahrzeuge };
  }
  function zeilenLesen() {
    const i = K.pi, aoa = i.blaetter[i.blatt], out = new Map(), warn = []; let akt = "";
    if (i.sp.code == null || i.sp.preis == null) return { zeilen: [], warn };
    aoa.slice(i.kz + 1).forEach((r, k) => {
      if (i.sp.gruppe != null) { const v = txt(r?.[i.sp.gruppe]); if (v) akt = v; if (i.filter && norm(akt) !== norm(i.filter)) return; }
      const code = txt(r?.[i.sp.code]); if (!code) return;
      const roh = r?.[i.sp.preis]; if (txt(roh) === "") return; const preis = zahl(roh); if (preis == null) return;
      const C = code.toUpperCase();
      if (out.has(C)) { if (out.get(C).preis !== preis) out.get(C).doppelt = true; return; }
      out.set(C, { code, preis, name: i.sp.name != null ? txt(r?.[i.sp.name]) : "", zeile: i.kz + 2 + k });
    });
    for (const z of out.values()) if (z.doppelt) warn.push(`${z.code}: mehrere Preise in der Datei, der erste (${K.eur(z.preis)}) wird verwendet.`);
    return { zeilen: [...out.values()], warn };
  }
  function abgleich() {
    const mo = S().entwurf, i = K.pi, { zeilen, warn } = zeilenLesen(), ig = inGruppe(mo, i.gruppe);
    const alleWerte = new Map(); for (const m of mo.merkmale) for (const w of m.werte) if (w.code && !alleWerte.has(String(w.code).toUpperCase())) alleWerte.set(String(w.code).toUpperCase(), { m, w });
    const liste = zeilen.map(z => {
      const C = z.code.toUpperCase(), fz = ig.fahrzeuge.get(C), t = ig.werte.get(C);
      if (fz) return { ...z, art: fz.basispreis === z.preis ? "gleich" : "aendern", typ: "fahrzeug", bisher: fz.basispreis, text: fz.name, ziel: fz };
      if (t) { const bisher = E.wertPreisGruppe(mo, i.gruppe, t.w); return { ...z, art: bisher === z.preis ? "gleich" : "aendern", typ: "wert", bisher, text: t.w.name, merkmal: t.m.name, ziel: t }; }
      const a = alleWerte.get(C); if (a) return { ...z, art: "fremd", typ: "wert", bisher: null, text: a.w.name, merkmal: a.m.name, ziel: a };
      const art = K.Store.artikelZu(z.code); return { ...z, art: "neu", typ: "neu", bisher: null, text: z.name || art?.name || "" };
    });
    const ord = { aendern: 0, neu: 1, fremd: 2, gleich: 3 }; liste.sort((a, b) => ord[a.art] - ord[b.art]);
    const imExcel = new Set(liste.map(z => z.code.toUpperCase())), fehlen = [...ig.werte.keys()].filter(c => !imExcel.has(c));
    return { liste, warn, fehlen };
  }

  /* ---------- Übernehmen ---------- */
  function zuordnen(mo, g, m, w) {
    const eff = E.zuordnung(mo, g).find(e => e.id === m.id);
    let eigen = (g.merkmale ||= []).find(z => z.id === m.id);
    if (!eff) { if (eigen) { eigen.aus = false; eigen.werte = [w.id]; } else g.merkmale.push({ id: m.id, werte: [w.id] }); return; }
    if (!eff.werte) return; // alle Werte schon frei
    if (eff.werte.includes(w.id)) return;
    if (!eigen) { eigen = { id: m.id }; g.merkmale.push(eigen); }
    eigen.werte = [...eff.werte, w.id];
  }
  function uebernehmen() {
    const mo = S().entwurf, i = K.pi, g = mo.gruppen.find(x => x.id === i.gruppe), ab = abgleich();
    const st = { preise: 0, fahrzeuge: 0, neu: 0, zugeordnet: 0, gleich: 0 };
    const unter = [...mo.gruppen.filter(x => x.id !== g.id && E.gruppenPfad(mo, x.id).some(y => y.id === g.id)), ...E.familienArtikel(mo, g.id)];
    const preisSetzen = (w, preis) => {
      const C = String(w.code).toUpperCase(), eltern = E.gruppenPreis(E.gruppenPfad(mo, g.id).slice(0, -1), w), basis = eltern ? eltern.preis : (w.preis || 0);
      g.preise ||= {}; if (basis === preis) delete g.preise[C]; else g.preise[C] = preis;
      for (const o of unter) if (o.preise && o.preise[C] != null) delete o.preise[C]; // Gruppenpreis gilt für alles darunter
    };
    let ziel = null;
    const zielMerkmal = () => {
      if (ziel) return ziel;
      if (i.neuZiel && i.neuZiel !== "__neu") ziel = E.merkmal(mo, i.neuZiel);
      if (!ziel) { let id = "weitere", n = 2; while (E.merkmal(mo, id)) id = "weitere" + n++; ziel = { id, name: "Weitere Optionen", abschnitt: "", typ: "mehrfach", bereich: "Optionen", werte: [] }; mo.merkmale.push(ziel); }
      return ziel;
    };
    for (const z of ab.liste) {
      if (z.art === "gleich") { st.gleich++; continue; }
      if (z.typ === "fahrzeug") { z.ziel.basispreis = z.preis; st.fahrzeuge++; continue; }
      if (z.art === "aendern") { preisSetzen(z.ziel.w, z.preis); st.preise++; continue; }
      if (!i.neuAn) continue;
      if (z.art === "fremd") { zuordnen(mo, g, z.ziel.m, z.ziel.w); preisSetzen(z.ziel.w, z.preis); st.zugeordnet++; continue; }
      const m = zielMerkmal(); let id = z.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "w", n = 2; while (m.werte.some(w => w.id === id)) id = id + "-" + n++;
      const a = K.Store.artikelZu(z.code), w = { id, code: z.code, name: z.text || z.code, preis: z.preis, kosten: a?.kosten || 0, stl: [] };
      m.werte.push(w); zuordnen(mo, g, m, w); st.neu++;
    }
    if (g.preise && !Object.keys(g.preise).length) delete g.preise;
    return st;
  }

  /* ---------- Oberfläche ---------- */
  function gruppenOptionen(mo, aktiv) {
    const kinder = id => mo.gruppen.filter(g => (g.eltern || null) === id);
    const zeile = (g, tiefe) => `<option value="${g.id}" ${g.id === aktiv ? "selected" : ""}>${"   ".repeat(tiefe)}${esc(g.name)} (${E.familienArtikel(mo, g.id).length})</option>` + kinder(g.id).map(k => zeile(k, tiefe + 1)).join("");
    return kinder(null).map(g => zeile(g, 0)).join("");
  }
  const kopf = () => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Codes und Preise importieren</h2><p>Produktgruppe wählen, Excel-Datei ablegen, prüfen, übernehmen. Aus der Datei werden nur die Codes und ihre Preise gelesen. Die Preise gelten für die gewählte Produktgruppe und alle Fahrzeuge darunter.</p></div>
    <div class="row"><a class="btn" href="#studio-import-struktur">Familien und Varianten importieren</a></div></div>`;

  K.route("studio-import", () => {
    const i = K.pi, mo = S().entwurf;
    if (ro()) return kopf() + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (!mo || !mo.gruppen.length) return kopf() + `<div class="leer">Es gibt noch keine Produktgruppen. Legen Sie diese im <a href="#studio-modell">Produktmodell</a> an oder importieren Sie zuerst <a href="#studio-import-struktur">Familien und Varianten</a>.</div>`;
    if (!mo.gruppen.some(g => g.id === i.gruppe)) i.gruppe = "";
    if (i.schritt === "fertig") {
      const st = i.ergebnis || {}, g = gruppeObj();
      return kopf() + `<section class="panel"><div class="hinweis ok"><b>Übernommen in den Entwurf für „${esc(g?.name || "")}“.</b> ${st.preise} Preise geändert${st.fahrzeuge ? `, ${st.fahrzeuge} Fahrzeugpreise` : ""}${st.neu ? `, ${st.neu} neue Codes` : ""}${st.zugeordnet ? `, ${st.zugeordnet} Codes der Gruppe zugeordnet` : ""}. ${st.gleich} Preise waren schon aktuell.</div>
        <p class="klein gedimmt">Der Vertrieb sieht die neuen Preise nach der Freigabe.</p>
        <div class="row"><button class="btn primary" type="button" data-act="piZurGruppe">Preise der Gruppe ansehen</button><a class="btn" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="piNeu">Weitere Datei</button></div></section>`;
    }
    const schritt1 = `<section class="panel pi-start">
        <div class="pi-schritt"><span class="pi-nr">1</span><div class="feld"><label for="pi-gruppe">Produktgruppe</label><select id="pi-gruppe" data-act="piGruppe"><option value="">Bitte wählen …</option>${gruppenOptionen(mo, i.gruppe)}</select></div></div>
        <div class="pi-schritt${i.gruppe ? "" : " gesperrt"}"><span class="pi-nr">2</span>
          <label class="ablage" for="pi-datei"><b>Excel-Datei hierher ziehen oder auswählen</b><span class="gedimmt">.xlsx, .xls oder .csv · eine Spalte mit Codes und eine mit Preisen genügt</span><input id="pi-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="piDatei" ${i.gruppe ? "" : "disabled"}></label></div>
        ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}</section>`;
    if (i.schritt !== "pruefen" || !i.blaetter) return kopf() + schritt1;
    return kopf() + pruefen(mo);
  });

  function pruefen(mo) {
    const i = K.pi, g = gruppeObj(), aoa = i.blaetter[i.blatt], kopfz = aoa[i.kz] || [], breite = Math.max(kopfz.length, ...aoa.slice(i.kz, i.kz + 20).map(r => (r || []).length));
    const spOpt = (k, leer) => `<option value="">${leer}</option>` + Array.from({ length: breite }, (_, j) => `<option value="${j}" ${i.sp[k] === j ? "selected" : ""}>${esc(txt(kopfz[j]) || "Spalte " + String.fromCharCode(65 + (j % 26)))}</option>`).join("");
    const gw = gruppenWerte(), ab = abgleich(), n = a => ab.liste.filter(z => z.art === a).length;
    const merkmaleGruppe = [...new Set(E.familienArtikel(mo, g.id).flatMap(p => E.zuordnung(mo, p).map(z => z.id)))].map(id => E.merkmal(mo, id)).filter(Boolean);
    const status = { aendern: ["Preis ändert sich", "aendern"], gleich: ["unverändert", "gleich"], neu: ["neuer Code", "neu"], fremd: ["nicht in dieser Gruppe", "fremd"] };
    const fehlt = i.sp.code == null ? "Bitte die Spalte mit den Codes wählen." : i.sp.preis == null ? "Bitte die Spalte mit den Preisen wählen." : !ab.liste.length ? "In dieser Auswahl wurden keine Codes mit Preis gefunden." : "";
    const zuTun = n("aendern") + (i.neuAn ? n("neu") + n("fremd") : 0);
    return `<section class="panel">
      <div class="pi-einst">
        <div class="feld"><label for="pi-gruppe">Produktgruppe</label><select id="pi-gruppe" data-act="piGruppe">${gruppenOptionen(mo, i.gruppe)}</select></div>
        ${Object.keys(i.blaetter).length > 1 ? `<div class="feld"><label for="pi-blatt">Blatt</label><select id="pi-blatt" data-act="piBlatt">${Object.keys(i.blaetter).map(b => `<option ${b === i.blatt ? "selected" : ""}>${esc(b)}</option>`).join("")}</select></div>` : ""}
        <div class="feld"><label for="pi-sc">Spalte Code</label><select id="pi-sc" data-act="piSp" data-k="code" class="${i.sp.code != null ? "gesetzt" : ""}">${spOpt("code", "– wählen –")}</select></div>
        <div class="feld"><label for="pi-sp">Spalte Preis</label><select id="pi-sp" data-act="piSp" data-k="preis" class="${i.sp.preis != null ? "gesetzt" : ""}">${spOpt("preis", "– wählen –")}</select></div>
        ${gw.length > 1 ? `<div class="feld"><label for="pi-f">Nur Zeilen der Produktgruppe</label><select id="pi-f" data-act="piFilter"><option value="">alle Zeilen</option>${gw.map(v => `<option ${v === i.filter ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></div>` : ""}
      </div>
      <p class="klein gedimmt"><b>${esc(i.datei)}</b> · Überschriften in Zeile ${i.kz + 1} · <button type="button" class="link" data-act="piNeu">andere Datei</button></p>
      ${fehlt ? `<div class="hinweis warn">${fehlt}</div>` : `
      <div class="kpis pi-kpis">
        <div class="kpi aendern"><b class="num">${n("aendern")}</b><span>Preise ändern sich</span></div>
        <div class="kpi"><b class="num">${n("gleich")}</b><span>unverändert</span></div>
        <div class="kpi neu"><b class="num">${n("neu") + n("fremd")}</b><span>Codes noch nicht in ${esc(g.name)}</span></div>
        <div class="kpi"><b class="num">${ab.fehlen.length}</b><span>Codes der Gruppe fehlen in der Datei</span></div></div>
      ${ab.warn.length ? `<div class="hinweis warn klein">${ab.warn.slice(0, 8).map(esc).join("<br>")}${ab.warn.length > 8 ? ` <br>… und ${ab.warn.length - 8} weitere` : ""}</div>` : ""}
      ${n("neu") + n("fremd") ? `<div class="pi-neu"><label class="haken"><input type="checkbox" data-act="piNeuAn" ${i.neuAn ? "checked" : ""}> ${n("neu") + n("fremd")} Codes, die noch nicht in ${esc(g.name)} sind, mit übernehmen</label>
        ${i.neuAn && n("neu") ? `<label class="inline klein">neue Codes ins Merkmal <select id="pi-ziel" data-act="piZiel"><option value="__neu">Weitere Optionen (neu)</option>${merkmaleGruppe.map(m => `<option value="${m.id}" ${m.id === i.neuZiel ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></label>` : ""}</div>` : ""}
      <div class="tabwrap pi-tab"><table class="kompakt"><thead><tr><th>Code</th><th>Bezeichnung</th><th class="r">bisher</th><th class="r">neu</th><th>Status</th></tr></thead><tbody>
        ${ab.liste.slice(0, 400).map(z => `<tr class="pi-${z.art}${(z.art === "neu" || z.art === "fremd") && !i.neuAn ? " pi-aus" : ""}"><td class="mono">${esc(z.code)}</td><td>${esc(z.text)}${z.typ === "fahrzeug" ? ` <span class="chip art">Fahrzeug</span>` : z.merkmal ? ` <span class="gedimmt klein">${esc(z.merkmal)}</span>` : ""}</td><td class="r num gedimmt">${z.bisher == null ? "–" : K.eur(z.bisher)}</td><td class="r num"><b>${K.eur(z.preis)}</b></td><td><span class="pi-status ${status[z.art][1]}">${status[z.art][0]}</span></td></tr>`).join("")}
      </tbody></table>${ab.liste.length > 400 ? `<p class="klein gedimmt">… ${ab.liste.length - 400} weitere Zeilen</p>` : ""}</div>`}
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="piNeu">Abbrechen</button><button class="btn gelb" type="button" data-act="piUebernehmen" ${fehlt || !zuTun ? "disabled" : ""}>${zuTun ? `${zuTun} ${zuTun === 1 ? "Änderung" : "Änderungen"} übernehmen` : "Nichts zu ändern"}</button></div></section>`;
  }

  async function lesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" }), bl = {};
    for (const n of wb.SheetNames) bl[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return bl;
  }
  K.act.piGruppe = el => { const i = K.pi; i.gruppe = el.value; if (i.blaetter) i.filter = filterRaten(); K.render(); };
  K.act.piDatei = async el => {
    const f = el.files[0]; if (!f) return; const i = K.pi;
    try { i.blaetter = await lesen(f); i.datei = f.name; i.fehler = null; blattSetzen(blattRaten(i.blaetter)); i.schritt = "pruefen"; }
    catch (e) { console.error(e); i.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import" && K.pi.schritt === "start" && K.pi.gruppe) e.preventDefault(); });
  document.addEventListener("drop", e => { if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import" || K.pi.schritt !== "start" || !K.pi.gruppe) return; e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) K.act.piDatei({ files: [f] }); });
  K.act.piBlatt = el => { blattSetzen(el.value); K.render(); };
  K.act.piSp = el => { const i = K.pi, k = el.dataset.k; i.sp[k] = el.value === "" ? null : +el.value; for (const x of Object.keys(i.sp)) if (x !== k && i.sp[x] === i.sp[k]) i.sp[x] = null; K.render(); };
  K.act.piFilter = el => { K.pi.filter = el.value; K.render(); };
  K.act.piNeuAn = el => { K.pi.neuAn = el.checked; K.render(); };
  K.act.piZiel = el => { K.pi.neuZiel = el.value; };
  K.act.piNeu = () => { Object.assign(K.pi, { schritt: "start", blaetter: null, datei: null, fehler: null }); K.render(); };
  K.act.piUebernehmen = async () => {
    const i = K.pi, g = gruppeObj(); if (!g) return;
    const st = uebernehmen(); K.Store.entwurfGeaendert();
    await K.Store.log("Import", `Preise für „${g.name}“ aus „${i.datei}“: ${st.preise} geändert, ${st.fahrzeuge} Fahrzeuge, ${st.neu} neue Codes, ${st.zugeordnet} zugeordnet`);
    i.ergebnis = st; i.schritt = "fertig"; i.blaetter = null; K.render();
  };
  K.act.piZurGruppe = () => { K.st.knoten = "g:" + K.pi.gruppe; K.st.modellTab = "preise"; K.gehe("studio-modell"); };
  /** Aus dem Produktmodell mit vorgewählter Gruppe öffnen */
  K.act.piFuerGruppe = el => { Object.assign(K.pi, { gruppe: el.dataset.g, schritt: "start", blaetter: null, fehler: null }); K.gehe("studio-import"); };
  K.preisImport = { abgleich, uebernehmen, spaltenRaten, inGruppe };
})(window);
