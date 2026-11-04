/* =====================================================================
   Studio › Katalog aufbauen
   Links der Katalogbaum (Familien und Fahrzeuge, per Drag & Drop sortieren),
   Mitte das gewählte Element mit seinen Vertriebscodes, rechts der Artikelstamm
   als Baukasten: Artikel auf eine Familie ziehen = neues Fahrzeug,
   auf ein Fahrzeug oder eine Gruppe ziehen = Vertriebscode.
   Was hier steht, zeigt der Katalog nach der Freigabe genau so.
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S, ent = () => S().entwurf, St = () => K.studio;
  const ro = () => !K.Store.schreiben;
  const norm = s => String(s ?? "").toUpperCase().trim();
  const geaendert = t => St().geaendert(t);
  K.kb = { sel: "", poolTab: "artikel", poolSuche: "", poolWahl: new Set(), codeSuche: "", einfuegen: false, einfuegenText: "", ziel: "", loeschen: null, offen: {} };

  /* ---------- Modell-Hilfen ---------- */
  const gruppe = id => ent().gruppen.find(g => g.id === id);
  const kinder = id => ent().gruppen.filter(g => (g.eltern || "") === (id || ""));
  const fahrzeuge = gid => ent().produkte.filter(p => (p.gruppe || "") === (gid || ""));
  const eindeutig = (basis, liste) => { let id = String(basis || "x").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "x", n = 2; const b = id; while (liste.some(x => x.id === id)) id = b + "-" + n++; return id; };
  const wertVon = code => { const C = norm(code); for (const m of ent().merkmale) for (const w of m.werte) if (w.code && norm(w.code) === C) return { m, w }; return null; };
  const codesVon = p => E.produktMerkmale(ent(), p).reduce((n, x) => n + x.werte.length, 0);
  const istUnter = (gid, ziel) => { let g = gruppe(ziel), n = 0; while (g && n++ < 40) { if (g.id === gid) return true; g = gruppe(g.eltern); } return false; };
  const typRaten = t => { t = String(t || "").toLowerCase(); return /tiefbett|tieflader/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst|logo|langholz/.test(t) ? "nachlaeufer" : "semi"; };

  /** Ein Merkmal bekommt einen neuen Wert: wer das Merkmal bisher „mit allen Werten“ hatte, behält genau die bisherigen */
  function einfrieren(m) {
    const alle = m.werte.map(w => w.id), mo = ent();
    for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (z.id === m.id && !z.aus && !(z.werte && z.werte.length)) z.werte = alle.slice();
  }
  /** Wert am Fahrzeug verfügbar machen */
  function amFahrzeug(p, m, w) {
    const mo = ent(), eff = E.zuordnung(mo, p).find(e => e.id === m.id); p.merkmale ||= [];
    let eigen = p.merkmale.find(z => z.id === m.id);
    if (!eff) { if (eigen) { eigen.aus = false; eigen.werte = [w.id]; } else p.merkmale.push({ id: m.id, werte: [w.id] }); return; }
    if (!eff.werte || eff.werte.includes(w.id)) return;
    if (!eigen) { eigen = { id: m.id }; p.merkmale.push(eigen); }
    eigen.werte = [...eff.werte, w.id]; eigen.aus = false;
  }
  function vomFahrzeug(p, mid, wid) {
    const mo = ent(), m = E.merkmal(mo, mid), eff = E.zuordnung(mo, p).find(e => e.id === mid); if (!eff) return;
    const rest = (eff.werte || m.werte.map(w => w.id)).filter(id => id !== wid);
    p.merkmale ||= []; let eigen = p.merkmale.find(z => z.id === mid); if (!eigen) { eigen = { id: mid }; p.merkmale.push(eigen); }
    if (rest.length) { eigen.werte = rest; eigen.aus = false; } else { eigen.aus = true; delete eigen.werte; }
    if (eigen.standard === wid) delete eigen.standard;
  }
  function merkmalNeu(name, mehrfach) {
    const mo = ent(), m = { id: eindeutig(E.slug(name).replace(/-/g, "") || "gruppe", mo.merkmale), name, abschnitt: "", typ: mehrfach ? "mehrfach" : "einfach", bereich: mehrfach ? "Optionen" : "Grundmaschine", werte: [] };
    mo.merkmale.push(m); return m;
  }
  function weitereOptionen() { return ent().merkmale.find(m => m.name === "Weitere Optionen") || merkmalNeu("Weitere Optionen", true); }
  /** Codes einem Fahrzeug geben. ziel: Merkmal-ID, "__neu" oder leer. preise: Map CODE → Preis */
  /* ---------- Codes sinnvoll ordnen ----------
     ZZ-Code = Überschrift. Gliedert das Angebot und erscheint dort.
     YY-Code = Untergruppe. Fasst die folgenden Vertriebscodes zu einer Auswahl zusammen,
               erscheint nicht extra im Angebot.
     alle anderen Codes = Vertriebscodes (Auswahlmöglichkeiten) der aktuellen Untergruppe.
       mehrere Codes mit gleichem Anfang (SC590, SC592 …) = eine Auswahl
       mehrere Codes mit verschiedenem Anfang = mehrere wählbar
       ein einzelner Code = Option ja/nein, ein einzelner GA-Code = fest in der Grundausstattung
     Die Reihenfolge der Liste bestimmt die Gliederung. Gleiche ZZ/YY bei mehreren Fahrzeugen
     nutzen dieselben Gruppen. Selbst geänderte Einstellungen einer Gruppe bleiben beim erneuten Ordnen. */
  const praefixe = () => Object.assign({ ueber: "ZZ", grund: "GA", option: "YY" }, S().einst?.codeKennung || {});
  K.codeKennung = praefixe;
  const buchstaben = c => (String(c).toUpperCase().match(/^[A-ZÄÖÜ]+/) || [""])[0];
  const hatName = w => w && w.name && norm(w.name) !== norm(w.code);
  function strukturieren(p) {
    const mo = ent(), pz = praefixe(), U = norm(pz.ueber), G = norm(pz.grund), O = norm(pz.option);
    const istU = c => U && norm(c).startsWith(U), istO = c => O && norm(c).startsWith(O), istG = c => G && norm(c).startsWith(G);
    const pm = E.produktMerkmale(mo, p), jetzt = pm.flatMap(x => x.werte.map(w => ({ w, m: x.m, std: x.standard === w.id })));
    const info = new Map(); // CODE → { code, name, preis, kosten, w, std }
    for (const e of jetzt) info.set(norm(e.w.code), { code: e.w.code, name: hatName(e.w) ? e.w.name : "", w: e.w, std: e.std });
    for (const g of p.grundausstattung || []) if (!info.has(norm(g.code))) info.set(norm(g.code), { code: g.code, name: g.name, preis: g.preis, std: true });
    // Reihenfolge: gemerkte Folge (mit ZZ/YY), neue Codes hinten an
    let folge = (p.codeFolge || []).filter(c => istU(c) || istO(c) || info.has(norm(c)));
    for (const e of [...info.values()]) if (!folge.some(c => norm(c) === norm(e.code))) folge.push(e.code);
    if (!folge.some(c => !istU(c) && !istO(c))) return null;
    mo.codeTexte ||= {};
    const nameVon = (code, sonst) => { const n = info.get(norm(code))?.name || mo.codeTexte[norm(code)] || K.Store.artikelZu(code)?.name || sonst || code; if (n && norm(n) !== norm(code) && (istU(code) || istO(code))) mo.codeTexte[norm(code)] = n; return n; };
    // Gliederung bilden
    const abschnitte = []; let ab = null, grp = null;
    for (const c of folge) {
      if (istU(c)) { const alt = mo.merkmale.find(m => m.abschnittCode && norm(m.abschnittCode) === norm(c)); ab = { code: c, name: nameVon(c, alt?.abschnitt), gruppen: [] }; abschnitte.push(ab); grp = null; continue; }
      if (!ab) { ab = { code: "", name: "Ausstattung", gruppen: [] }; abschnitte.push(ab); }
      if (istO(c)) { const alt = mo.merkmale.find(m => m.code && norm(m.code) === norm(c)); grp = { code: c, name: nameVon(c, alt?.name), codes: [] }; ab.gruppen.push(grp); continue; }
      if (!grp) { grp = { code: "", name: ab.name, codes: [] }; ab.gruppen.push(grp); }
      grp.codes.push(c);
    }
    // alte Zuordnungen des Fahrzeugs ausblenden, neu aufbauen
    const alt = new Set(pm.map(x => x.m.id)); p.merkmale = (p.merkmale || []).filter(z => !alt.has(z.id)); for (const id of alt) p.merkmale.push({ id, aus: true });
    p.grundausstattung = [];
    const neueReihe = [], stat = { abschnitte: 0, auswahl: 0, optionen: 0, fest: 0 };
    const neuAngelegt = new Set();
    const merkmalFuer = (schluessel, name, mehrfach) => {
      let m = mo.merkmale.find(x => x.struktur === schluessel);
      if (!m) { m = merkmalNeu(name, mehrfach); m.struktur = schluessel; neuAngelegt.add(m); }
      return m;
    };
    const wertIn = (m, code) => {
      let x = m.werte.find(v => norm(v.code) === norm(code)); if (x) return x;
      const i = info.get(norm(code)) || {}, a = K.Store.artikelZu(code);
      einfrieren(m); x = i.w ? { ...JSON.parse(JSON.stringify(i.w)), id: eindeutig(i.w.id, m.werte) } : { id: eindeutig(code, m.werte), code, name: i.name || a?.name || code, preis: i.preis ?? a?.preis ?? 0, kosten: a?.kosten || 0, stl: [] };
      m.werte.push(x); return x;
    };
    for (const a of abschnitte) {
      if (!a.gruppen.some(g => g.codes.length)) continue; stat.abschnitte++;
      for (const g of a.gruppen) {
        if (!g.codes.length) continue;
        // Alternativen = größte Gruppe von Codes mit gleichem Anfang (z. B. FW301/FW302). Codes mit anderem Anfang
        // daneben werden eigene Ja/Nein-Codes (z. B. LA325 Arbeitsscheinwerfer). Ohne Alternativen: mehrere wählbar.
        const nurGA = g.codes.every(istG), anf = new Map(); for (const c of g.codes) { const b = buchstaben(c); anf.set(b, (anf.get(b) || 0) + 1); }
        const [hauptAnfang, hauptZahl] = [...anf.entries()].sort((x, y) => y[1] - x[1])[0] || ["", 0];
        const mitAlternativen = !nurGA && hauptZahl >= 2, mehrfach = !mitAlternativen;
        const m = merkmalFuer(`${a.code || a.name}|${g.code || "*"}`, g.name, mehrfach);
        Object.assign(m, { abschnitt: a.name, abschnittCode: a.code, ueberschrift: a.name, bereich: a.name, code: g.code || "" });
        const ws = g.codes.map(c => wertIn(m, c)), ids = ws.map(w => w.id);
        if (nurGA) for (const w of ws) if (!w.feld) { w.feld = "fest"; stat.fest++; } // Grundausstattung: fest enthalten
        if (mitAlternativen && neuAngelegt.has(m)) for (const w of ws) if (!w.feld && buchstaben(w.code) !== hauptAnfang && !istG(w.code)) w.feld = "janein";
        const z = { id: m.id, werte: ids };
        if (m.typ !== "mehrfach" && E.wahlWerte(m, ws).length) { const std = g.codes.find(c => info.get(norm(c))?.std) || g.codes.find(istG) || g.codes[0]; z.standard = ws[g.codes.indexOf(std)].id; stat.auswahl++; } else stat.optionen++;
        p.merkmale.push(z); neueReihe.push(m.id);
      }
    }
    // Grundpreis aus der Grundausstattung, wenn noch keiner gepflegt ist
    p.codeFolge = folge; p.reihenfolge = neueReihe;
    aufraeumen();
    return stat;
  }
  /** Merkmale, die niemand mehr nutzt und keine Regel kennt, entfernen */
  function aufraeumen() {
    const mo = ent(), benutzt = new Set();
    for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (!z.aus) benutzt.add(z.id);
    const inRegeln = JSON.stringify(mo.regeln || []);
    const weg = mo.merkmale.filter(m => !benutzt.has(m.id) && !inRegeln.includes(`"${m.id}"`)); if (!weg.length) return;
    const ids = new Set(weg.map(m => m.id)); mo.merkmale = mo.merkmale.filter(m => !ids.has(m.id));
    for (const o of [...mo.gruppen, ...mo.produkte]) { if (o.merkmale) o.merkmale = o.merkmale.filter(z => !ids.has(z.id)); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(id => !ids.has(id)); }
  }
  K.kbStrukturieren = strukturieren;
  function codesZuFahrzeug(p, codes, ziel, preise, namen) {
    const mo = ent(); let zm = ziel && ziel !== "__neu" ? E.merkmal(mo, ziel) : null, neuGruppe = null, schon = 0, anders = 0, neu = 0;
    for (const code of codes) {
      const t = wertVon(code), pr = preise && preise.get(norm(code)), nm = namen && namen.get(norm(code));
      if (t && nm && !hatName(t.w)) t.w.name = nm;
      if (t) {
        if (E.produktMerkmale(mo, p).some(x => x.werte.includes(t.w))) schon++; else amFahrzeug(p, t.m, t.w);
        if (zm && t.m !== zm) anders++;
        if (pr != null && pr !== E.wertPreis(mo, p, t.w)) { p.preise ||= {}; p.preise[norm(code)] = pr; }
        continue;
      }
      if (!zm) zm = ziel === "__neu" ? (neuGruppe = merkmalNeu("Neue Gruppe", true)) : weitereOptionen();
      einfrieren(zm);
      const a = K.Store.artikelZu(code), w = { id: eindeutig(code, zm.werte), code: a?.code || String(code).trim(), name: nm || a?.name || String(code).trim(), preis: pr ?? a?.preis ?? 0, kosten: a?.kosten || 0, stl: [] };
      zm.werte.push(w); amFahrzeug(p, zm, w); neu++;
    }
    return { neu, schon, anders, neuGruppe };
  }
  function fahrzeugeAnlegen(gid, codes) {
    const mo = ent(); let neu = 0, verschoben = 0;
    for (const code of codes) {
      const vorh = mo.produkte.find(p => norm(p.code) === norm(code));
      if (vorh) { if (vorh.gruppe !== gid) { vorh.gruppe = gid; verschoben++; } continue; }
      const a = K.Store.artikelZu(code), name = a?.name || String(code).trim();
      mo.produkte.push({ id: eindeutig(code, mo.produkte), code: a?.code || String(code).trim(), name, gruppe: gid, artnr: a?.code || String(code).trim(), basispreis: a?.preis || 0, basiskosten: a?.kosten || 0, aktiv: true, beschreibung: "",
        visual: { typ: typRaten(name + " " + (gruppe(gid)?.name || "")), asset: null }, stl: [], merkmale: [] });
      neu++;
    }
    return { neu, verschoben };
  }
  /** Element in einem Array vor/nach ein anderes setzen */
  function umsetzen(liste, el, ziel, nach) { const i = liste.indexOf(el); if (i >= 0) liste.splice(i, 1); let j = ziel ? liste.indexOf(ziel) : liste.length; if (j < 0) j = liste.length; liste.splice(nach ? j + 1 : j, 0, el); }

  /* ---------- Bilder (in APplus ohne Dateiablage: verkleinert im Modell) ---------- */
  const alteBildUrl = K.bildUrl;
  K.bildUrl = id => !id ? null : /^(data:|blob:|https?:|\/\/|\.{0,2}\/)/i.test(String(id)) || /[\/.]/.test(String(id)) ? String(id) : alteBildUrl(id);
  async function bildLesen(el) {
    if (el.dataset.weg) return null;
    if (K.assets) return St().bildHochladen(el);
    const f = el.files && el.files[0]; if (!f) return undefined;
    const url = await new Promise((ok, nein) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = nein; r.readAsDataURL(f); });
    if (/svg/.test(f.type)) return f.size < 150e3 ? url : (K.toast("SVG bitte unter 150 KB."), undefined);
    const img = await new Promise((ok, nein) => { const i = new Image(); i.onload = () => ok(i); i.onerror = nein; i.src = url; });
    const s = Math.min(1, 640 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", .82);
  }
  K.bildLesen = bildLesen;
  const bildFeld = (id, act, daten) => `<div class="bildfeld">${id ? `<img src="${K.bildUrl(id)}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}
    ${ro() ? "" : `<label class="btn klein">${id ? "Ersetzen" : "Bild wählen"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-act="${act}" ${daten} hidden></label>${id ? `<button type="button" class="btn klein" data-act="${act}" data-weg="1" ${daten}>Entfernen</button>` : ""}`}</div>`;

  /* ---------- Ansicht ---------- */
  K.route("studio-katalog", () => {
    const mo = ent(); if (!mo) return St().keinEntwurf();
    const kb = K.kb; if (kb.sel && !objekt(kb.sel)) kb.sel = "";
    const leer = !mo.gruppen.length && !mo.produkte.length;
    return `<div class="kopfzeile"><div><div class="eyebrow">Studio · Entwurf</div><h2>Katalog aufbauen</h2><p>Familien anlegen und per Drag &amp; Drop ordnen. Artikel aus dem Artikelstamm rechts auf eine Familie ziehen ergibt ein Fahrzeug, auf ein Fahrzeug ziehen ergibt Vertriebscodes. Rechts Artikel suchen und mit „Übernehmen“ oder per Ziehen einfügen.</p></div>
      <div class="row"><button class="btn" type="button" data-act="kbVorschau">Vorschau im Katalog</button><a class="btn primary" href="#studio-freigabe">Freigeben</a>${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="kbLeeren">${kb.leeren ? "Wirklich alles leeren?" : "Neu beginnen"}</button>`}</div></div>
      ${leer ? `<div class="hinweis">Der Entwurf ist leer. Legen Sie links mit „+ Familie“ die erste Familie an, z. B. „Holztransport“.</div>` : mo.produkte.some(p => /^(ST|TB|TB3|PA|LN)$/.test(p.id)) ? `<div class="hinweis">Hier stehen noch die <b>Beispieldaten</b> (Schwertransport, Holztransport …). Mit „Neu beginnen“ starten Sie mit einem leeren Katalog. Der Vertrieb sieht weiter den alten Stand, bis Sie freigeben.</div>` : ""}
      ${nurImKatalogHinweis(mo)}
      <div class="kb-layout">${baumAnsicht(mo)}<section class="kb-mitte">${mitte(mo)}</section>${pool(mo)}</div>`;
  });
  function objekt(sel) { if (!sel) return null; const id = sel.slice(2); return sel[0] === "g" ? gruppe(id) : E.produkt(ent(), id); }

  /** Regeln, die bei diesem Fahrzeug gelten und die Position (Gruppe) betreffen */
  const regelnZu = (mo, p, mid) => mo.regeln.filter(r => E.imGeltungsbereich(mo, r, p) && (r.typ === "tabelle" ? (r.tabelle?.merkmale || []).includes(mid) : (r.wenn || []).some(c => c.merkmal === mid) || r.dann?.merkmal === mid));
  const typName = m => (E.GRUPPENTYPEN.find(([k]) => k === E.gruppentyp(m)) || [, "Auswahl"])[1];
  const typKurz = m => ({ kacheln: "Kacheln", liste: "Liste", dropdown: "Dropdown", mehrfach: "mehrere" })[E.gruppentyp(m)] || "Auswahl";
  const typIkon = m => ({ kacheln: "▦", liste: "☰", dropdown: "▾", mehrfach: "☑" })[E.gruppentyp(m)] || "•";
  /** Fahrzeuge, die der Vertrieb noch sieht (freigegebene Version), die im Entwurf aber fehlen */
  const nurLive = mo => { const lv = S().live; if (!lv || lv === mo) return []; const da = new Set(mo.produkte.map(p => p.id)); return (lv.produkte || []).filter(p => !da.has(p.id)); };
  /* ---------- Fahrzeuge, die nur noch im freigegebenen Katalog stehen ---------- */
  K.nurImKatalog = () => ent() ? nurLive(ent()) : [];
  function nurImKatalogHinweis(mo) {
    const fehlt = K.nurImKatalog(); if (!fehlt.length || ro()) return "";
    return `<div class="hinweis warn kb-nurkat"><b>${fehlt.length === 1 ? "1 Fahrzeug steht" : fehlt.length + " Fahrzeuge stehen"} noch im Katalog des Vertriebs, aber nicht mehr hier</b> (${fehlt.slice(0, 4).map(p => esc(p.name)).join(", ")}${fehlt.length > 4 ? " …" : ""}). Das stammt aus einem früheren Löschen, das nur hier wirkte.
      <div class="row" style="margin-top:8px"><button class="btn klein gefahr" type="button" data-act="kbRestLoeschen">Auch aus dem Katalog löschen</button><span class="klein gedimmt">Zurückholen danach über Studio › Protokoll.</span></div></div>`;
  }

  function baumAnsicht(mo) {
    const kb = K.kb;
    const famZeile = (g, t) => {
      const ks = kinder(g.id), fs = fahrzeuge(g.id), offen = kb.offen[g.id] ?? true, n = E.familienArtikel(mo, g.id).length;
      return `<li><div class="kb-zeile fam${kb.sel === "g:" + g.id ? " aktiv" : ""}" style="--t:${t}" draggable="${!ro()}" data-drag="g:${g.id}" data-drop="g:${g.id}">
          <button type="button" class="kb-auf" data-act="kbAuf" data-g="${g.id}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${ks.length || fs.length ? (offen ? "▾" : "▸") : ""}</button>
          <button type="button" class="kb-nm" data-act="kbWahl" data-s="g:${g.id}"><span class="kb-ik">▤</span>${esc(g.name)}</button><span class="kb-zahl">${n}</span>
          ${ro() ? "" : `<button type="button" class="kb-plus" data-act="kbFamNeu" data-g="${g.id}" title="Unterfamilie anlegen" aria-label="Unterfamilie anlegen">+</button>`}</div>
        ${offen ? `<ul>${ks.map(k => famZeile(k, t + 1)).join("")}${fs.map(p => artZeile(p, t + 1)).join("")}</ul>` : ""}</li>`;
    };
    const artZeile = (p, t) => {
      const pm = E.produktMerkmale(mo, p), offen = kb.offen["p:" + p.id] ?? (kb.sel === "p:" + p.id), abs = [...new Set(pm.map(x => x.m.abschnitt || ""))];
      const posZeile = (x, tt) => { const n = regelnZu(mo, p, x.m.id).length;
        return `<li><div class="kb-zeile pos${kb.sel === "p:" + p.id && kb.pos === x.m.id ? " aktiv" : ""}" style="--t:${tt}" data-drop="m:${x.m.id}"><span class="kb-auf"></span><button type="button" class="kb-nm" data-act="kbWahl" data-s="p:${p.id}" data-pos="${x.m.id}" title="${esc(x.m.name)}: ${esc(typName(x.m))}"><span class="kb-ik kb-typ" aria-hidden="true">${typIkon(x.m)}</span><span class="kb-artname">${esc(x.m.name)}<code>${esc(x.m.code || "")}${x.m.code ? " · " : ""}${esc(typKurz(x.m))}</code></span></button><span class="kb-zahl" title="Codes${n ? ", " + n + " Regeln" : ""}">${x.werte.length}${n ? `<i class="kb-rz" title="${n} Regeln">§${n}</i>` : ""}</span></div></li>`; };
      return `<li><div class="kb-zeile art${kb.sel === "p:" + p.id && !kb.pos ? " aktiv" : ""}${p.aktiv === false ? " inaktiv" : ""}" style="--t:${t}" draggable="${!ro()}" data-drag="p:${p.id}" data-drop="p:${p.id}">
        <button type="button" class="kb-auf" data-act="kbAufP" data-p="${p.id}" aria-label="${offen ? "Positionen zuklappen" : "Positionen aufklappen"}">${pm.length ? (offen ? "▾" : "▸") : ""}</button><button type="button" class="kb-nm" data-act="kbWahl" data-s="p:${p.id}"><span class="kb-ik">▢</span><span class="kb-artname">${esc(p.name)}<code>${esc(p.code || "")}</code></span></button><span class="kb-zahl" title="Vertriebscodes">${codesVon(p)}</span></div>
        ${offen && pm.length ? `<ul class="kb-posliste">${abs.map(ab => `${ab || abs.length > 1 ? `<li><div class="kb-zeile ueber" style="--t:${t + 1}"><span class="kb-auf"></span><span class="kb-ueber">${esc(ab || "Ohne Überschrift")}</span></div></li>` : ""}${pm.filter(x => (x.m.abschnitt || "") === ab).map(x => posZeile(x, t + (ab || abs.length > 1 ? 2 : 1))).join("")}`).join("")}</ul>` : ""}</li>`;
    };
    const ohne = mo.produkte.filter(p => !p.gruppe || !gruppe(p.gruppe));
    return `<nav class="panel kb-baum" aria-label="Katalog">
      <div class="kb-baumkopf"><b>Katalog</b>${ro() ? "" : `<button class="btn klein" type="button" data-act="kbFamNeu" data-g="">+ Familie</button>`}</div>
      <ul class="kb-liste" data-drop="g:">${kinder("").map(g => famZeile(g, 0)).join("")}
        ${ohne.length ? `<li><div class="kb-zeile fam gedimmt" style="--t:0"><span class="kb-auf"></span><span class="kb-nm">Ohne Familie (nicht im Katalog)</span></div><ul>${ohne.map(p => artZeile(p, 1)).join("")}</ul></li>` : ""}
      ${ro() ? "" : `<div class="kb-wurzel" data-drop="g:">Hierher ziehen = oberste Ebene</div>`}</nav>`;
  }

  function mitte(mo) {
    const kb = K.kb, o = objekt(kb.sel);
    if (!o) return `<div class="leer kb-tipp"><b>So geht es</b><ol><li>Links „+ Familie“ anlegen, z. B. Holztransport, darunter Logo 12.</li><li>Rechts im Artikelstamm die Fahrzeugnummern suchen und auf die Familie ziehen.</li><li>Das Fahrzeug anklicken und die Vertriebscodes hineinziehen oder als Liste einfügen.</li><li>„Vorschau im Katalog“ zeigt das Ergebnis, „Freigeben“ macht es für den Vertrieb sichtbar.</li></ol></div>`;
    return kb.sel[0] === "g" ? familie(mo, o) : fahrzeug(mo, o);
  }
  function familie(mo, g) {
    const fs = fahrzeuge(g.id), ks = kinder(g.id), pfad = E.gruppenPfad(mo, g.id).slice(0, -1);
    return `<div class="panel kb-objekt" data-drop="g:${g.id}">
      <div class="eyebrow">${pfad.length ? pfad.map(x => esc(x.name)).join(" › ") + " ›" : "Familie"}</div>
      <div class="kb-kopf"><input id="kb-gname" class="flach titelfeld" data-chg="kbGName" value="${esc(g.name)}" aria-label="Name der Familie" ${St().dis()}>
        ${ro() ? "" : `<button type="button" class="btn klein gefahr-text" data-act="kbLoeschen">${K.kb.loeschen === "g:" + g.id ? `Familie mit ${fs.length + ks.reduce((n, k) => n + E.familienArtikel(mo, k.id).length, 0)} Fahrzeugen löschen?` : "Löschen"}</button>`}</div>
      <div class="formgitter">
        <div class="feld"><label for="kb-geltern">liegt unter</label><select id="kb-geltern" data-act="kbGEltern" ${St().dis()}><option value="">– oberste Ebene –</option>${mo.gruppen.filter(x => x.id !== g.id && !istUnter(g.id, x.id)).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(E.gruppenPfad(mo, x.id).map(y => y.name).join(" › "))}</option>`).join("")}</select></div>
        <div class="feld"><label>Bild im Katalog</label>${bildFeld(g.bild, "kbBild", `data-s="g:${g.id}"`)}</div></div>
      <div class="feld"><label for="kb-gbes">Beschreibung</label><textarea id="kb-gbes" rows="2" data-chg="kbGBes" ${St().dis()}>${esc(g.beschreibung || "")}</textarea></div>
      <h3>Inhalt</h3>
      ${ks.length || fs.length ? `<div class="kb-kacheln">${ks.map(k => `<button type="button" class="kb-kachel fam" data-act="kbWahl" data-s="g:${k.id}"><span>▤</span><b>${esc(k.name)}</b><small>${E.familienArtikel(mo, k.id).length} Fahrzeuge</small></button>`).join("")}
        ${fs.map(p => `<div class="kb-kachel-w${K.kb.kachelLoeschen === p.id ? " frage" : ""}"><button type="button" class="kb-kachel" data-act="kbWahl" data-s="p:${p.id}"><span class="kb-silh">${K.produktBildHtml(p, "var(--ink)")}</span><b>${esc(p.name)}</b><small><code>${esc(p.code || "")}</code> · ${codesVon(p)} Codes</small></button>
          ${ro() ? "" : K.kb.kachelLoeschen === p.id ? `<div class="kb-kachel-frage"><span>${esc(p.name)} löschen?</span><button type="button" class="btn klein gefahr" data-act="kbKachelLoeschenOk" data-p="${p.id}">Löschen</button><button type="button" class="btn klein ghost" data-act="kbKachelLoeschen" data-p="">Abbrechen</button></div>`
            : `<span class="kb-kachel-akt"><button type="button" class="ikon" data-act="kbWahl" data-s="p:${p.id}" title="Bearbeiten" aria-label="${esc(p.name)} bearbeiten">✎</button><button type="button" class="ikon gefahr" data-act="kbKachelLoeschen" data-p="${p.id}" title="Löschen" aria-label="${esc(p.name)} löschen">🗑</button></span>`}</div>`).join("")}</div>` : ""}
      <div class="kb-ablage">Fahrzeuge aus dem Artikelstamm hierher ziehen<br><span class="gedimmt klein">oder rechts suchen und „als Fahrzeug“ wählen</span></div>
      ${famStruktur(mo, g)}</div>`;
  }
  /** Struktur, die alle Fahrzeuge der Familie erben */
  function famStruktur(mo, g) {
    const eff = E.zuordnung(mo, g).map(z => ({ z, m: E.merkmal(mo, z.id) })).filter(x => x.m), n = E.familienArtikel(mo, g.id).length;
    const abs = [...new Set(eff.map(x => x.m.abschnitt || ""))];
    return `<h3>Struktur für alle Fahrzeuge dieser Familie</h3>
      <p class="klein gedimmt">Überschriften und Gruppen, die hier stehen, erbt jedes Fahrzeug darunter. Am Fahrzeug werden nur Abweichungen gepflegt (Codes weglassen, andere Vorauswahl). So legen Sie die Struktur einmal fest statt für jede Variante.</p>
      ${eff.length ? abs.map(ab => `<div class="kb-famab"><span class="kb-abmarke">Überschrift</span> <b>${esc(ab || "ohne Überschrift")}</b></div><table class="kompakt kb-famtab"><tbody>${eff.filter(x => (x.m.abschnitt || "") === ab).map(({ z, m }) => `<tr><td>${esc(m.name)}${m.code ? ` <code class="gedimmt">${esc(m.code)}</code>` : ""}</td><td><select id="kb-fmt-${m.id}" data-act="kbMTyp" data-m="${m.id}" aria-label="Auswahl in dieser Gruppe" ${St().dis()}>${E.GRUPPENTYPEN.map(([k, nm]) => `<option value="${k}" ${E.gruppentyp(m) === k ? "selected" : ""}>${nm}</option>`).join("")}</select></td><td class="r gedimmt klein">${(z.werte || m.werte.map(w => w.id)).length} Codes${z.herkunft !== "g:" + g.id ? " · geerbt" : ""}</td></tr>`).join("")}</tbody></table>`).join("") : `<p class="klein">Noch keine gemeinsame Struktur.</p>`}
      ${ro() || n < 2 ? "" : `<button class="btn klein" type="button" data-act="kbHoch">Gemeinsame Gruppen der ${n} Fahrzeuge an die Familie übergeben</button>`}`;
  }
  function abschnittsweise(pm, karte, p) {
    const ga = p.grundausstattung || [], namen = [...new Set([...pm.map(x => x.m.abschnitt || ""), ...ga.map(g => g.gruppe || "")])];
    if (namen.length === 1 && !namen[0] && !ga.length) return pm.map(karte).join("");
    return namen.map(ab => { const ms = pm.filter(x => (x.m.abschnitt || "") === ab), gs = ga.map((g, i) => ({ g, i })).filter(x => (x.g.gruppe || "") === ab);
      return `<section class="kb-abschnitt"><div class="kb-abkopf"><span class="kb-abmarke">Überschrift</span><input id="kb-ab-${esc(E.slug(ab) || "x")}" class="flach" data-chg="kbAbName" data-ab="${esc(ab)}" value="${esc(ab || "Ohne Überschrift")}" aria-label="Überschrift" ${St().dis()}></div>
        ${gs.length ? `<div class="kb-gruppe fest"><div class="kb-gkopf"><b>Grundausstattung</b><span class="gedimmt klein">fest enthalten, keine Auswahl</span></div><div class="kb-chips">${gs.map(({ g, i }) => `<span class="kb-chip std"><code>${esc(g.code)}</code><span class="kb-cn">${esc(g.name)}</span>${ro() ? "" : `<button type="button" data-act="kbGaWeg" data-i="${i}" title="Entfernen" aria-label="Entfernen">✕</button>`}</span>`).join("")}</div></div>` : ""}
        ${ms.map(karte).join("")}</section>`; }).join("");
  }
  /** Eine Position (Gruppe) eines Fahrzeugs: Art der Auswahl, Codes mit Feldtyp, Regeln */
  function position(mo, p, x, karte) {
    const rs = regelnZu(mo, p, x.m.id), m = x.m; K.st.kontext = "p:" + p.id;
    const andere = mo.produkte.filter(q => q !== p && E.produktMerkmale(mo, q).some(y => y.m.id === m.id));
    return `<div class="panel kb-objekt kb-position" data-drop="m:${m.id}">
      <div class="eyebrow">${E.gruppenPfad(mo, p.gruppe).map(g => esc(g.name)).join(" › ")} › <button type="button" class="link" data-act="kbPosZurueck">${esc(p.name)}</button>${m.abschnitt ? ` › ${esc(m.abschnitt)}` : ""}</div>
      <div class="kb-kopf"><h2 class="kb-postitel">${esc(m.name)}${m.code ? ` <code>${esc(m.code)}</code>` : ""}</h2><button type="button" class="btn klein" data-act="kbPosZurueck">← Alle Positionen</button></div>
      <div class="formgitter kb-posfelder">
        <div class="feld"><label for="kb-pos-typ">Wie wird ausgewählt?</label><select id="kb-pos-typ" data-act="kbMTyp" data-m="${m.id}" ${St().dis()}>${E.GRUPPENTYPEN.map(([k, n]) => `<option value="${k}" ${E.gruppentyp(m) === k ? "selected" : ""}>${n}</option>`).join("")}</select><span class="klein gedimmt">${({ kacheln: "genau einen Code wählen, als Kacheln mit Bild", liste: "genau einen Code wählen, als Liste", dropdown: "genau einen Code wählen, als Auswahlfeld", mehrfach: "beliebig viele Codes ankreuzen" })[E.gruppentyp(m)] || ""}. Einzelne Codes können darunter einen eigenen Feldtyp haben (Ja/Nein, Zahl, Freitext, fest).</span></div>
        ${m.typ !== "mehrfach" && E.wahlWerte(m, x.werte).length ? `<div class="feld"><label class="haken"><input type="checkbox" data-act="kbMPflicht" data-m="${m.id}" ${m.pflicht ? "checked" : ""} ${St().dis()}> Pflicht, ohne Vorauswahl</label><span class="klein gedimmt">Der Vertrieb muss selbst wählen.</span></div>` : ""}
      </div>
      ${andere.length ? `<p class="hinweis klein">Diese Position gibt es auch bei ${andere.length} weiteren Fahrzeug${andere.length === 1 ? "" : "en"} (${andere.slice(0, 3).map(q => esc(q.name)).join(", ")}${andere.length > 3 ? " …" : ""}). Name, Auswahlart und Feldtypen gelten dort ebenfalls.</p>` : ""}
      <h3>Codes</h3>${karte(x)}
      <section class="kb-posregeln"><div class="panelkopf"><h3>Regeln <span class="gedimmt">${rs.length}</span></h3>${ro() ? "" : `<span class="row"><button class="btn klein primary" type="button" data-act="kbRegelNeu" data-m="${m.id}" data-rolle="dann" title="Wenn etwas anderes gewählt ist, wird diese Position eingeschränkt">+ Regel: schränkt „${esc(m.name)}“ ein</button><button class="btn klein" type="button" data-act="kbRegelNeu" data-m="${m.id}" data-rolle="wenn" title="Die Auswahl hier schränkt andere Positionen ein">+ Regel: „${esc(m.name)}“ schränkt ein</button></span>`}</div>
        ${rs.length ? `<div class="regelkarten">${rs.map(r => r.typ === "tabelle" ? `<div class="regelkarte"><div class="regelkopf"><b>${esc(r.id)}</b> Kombinationstabelle ${esc(r.name || "")} <a class="link" href="#studio-regeln" data-act="kbZuRegeln" data-p="${p.id}">in Regeln bearbeiten</a></div></div>` : K.studio.regelKarte(mo, r)).join("")}</div>` : `<p class="klein gedimmt">Noch keine Regeln für diese Position bei ${esc(p.name)}. Regeln sperren Codes, erlauben nur bestimmte oder wählen automatisch, abhängig von der Auswahl in anderen Positionen.</p>`}
        <p class="klein gedimmt">Neue Regeln gelten für ${esc(p.name)}. Im Regel-Editor unter „Gilt für“ auf die ganze Familie erweiterbar.</p></section>
    </div>`;
  }
  function fahrzeug(mo, p) {
    const kb = K.kb, pm = E.produktMerkmale(mo, p), q = kb.codeSuche.toLowerCase(), a = K.Store.artikelZu(p.code);
    const passt = w => !q || (w.code + " " + w.name).toLowerCase().includes(q);
    const gruppenOpt = `<option value="">Weitere Optionen</option>${pm.map(x => `<option value="${x.m.id}" ${kb.ziel === x.m.id ? "selected" : ""}>${esc(x.m.name)}</option>`).join("")}<option value="__neu" ${kb.ziel === "__neu" ? "selected" : ""}>neue Gruppe</option>`;
    const karte = x => {
      const ws = x.werte.filter(passt); if (q && !ws.length) return "";
      const geerbt = x.herkunft && x.herkunft.startsWith("g:") ? gruppe(x.herkunft.slice(2)) : null;
      return `<article class="kb-gruppe" data-drop="m:${x.m.id}" draggable="${!ro()}" data-drag="m:${x.m.id}">
        <div class="kb-gkopf"><span class="kb-griff" title="Ziehen zum Sortieren">⋮⋮</span><input id="kb-mn-${x.m.id}" class="flach" data-chg="kbMName" data-m="${x.m.id}" value="${esc(x.m.name)}" aria-label="Name der Gruppe" ${St().dis()}>
          <select id="kb-mt-${x.m.id}" class="kb-feldtyp" data-act="kbMTyp" data-m="${x.m.id}" aria-label="Auswahl in dieser Gruppe" title="Gilt für die Codes mit Feldtyp „Auswahl“" ${St().dis()}>${E.GRUPPENTYPEN.map(([k, n]) => `<option value="${k}" ${E.gruppentyp(x.m) === k ? "selected" : ""}>${n}</option>`).join("")}</select>
          ${x.m.typ !== "mehrfach" && E.wahlWerte(x.m, x.werte).length ? `<label class="haken klein" title="Ohne Vorbelegung, der Vertrieb muss wählen"><input type="checkbox" data-act="kbMPflicht" data-m="${x.m.id}" ${x.m.pflicht ? "checked" : ""} ${St().dis()}> Pflicht</label>` : ""}
          <span class="gedimmt klein">${x.werte.length}${geerbt ? ` · von ${esc(geerbt.name)}` : ""}</span>${ro() ? "" : `<button type="button" class="ikon" data-act="kbMWeg" data-m="${x.m.id}" title="Gruppe bei diesem Fahrzeug ausblenden" aria-label="Gruppe ausblenden">✕</button>`}</div>
        <div class="kb-werte">${ws.map(w => { const pr = E.wertPreis(mo, p, w), std = x.standard === w.id, t = E.wertTyp(x.m, w), wahl = t === "auswahl";
          return `<div class="kb-wert${std && wahl ? " std" : ""} t-${t}" draggable="${!ro()}" data-drag="w:${x.m.id}:${w.id}">
            <span class="kb-griff">⋮⋮</span><code class="${K.Store.artikelQuelle && w.code && !K.Store.artikelZu(w.code) ? "unbekannt" : ""}">${esc(w.code || "–")}</code>
            <input id="kb-wn-${x.m.id}-${w.id}" class="flach kb-wname" data-chg="kbWName" data-m="${x.m.id}" data-w="${w.id}" value="${esc(w.name)}" aria-label="Bezeichnung" ${St().dis()}>
            <select id="kb-wt-${x.m.id}-${w.id}" class="kb-werttyp" data-act="kbWTyp" data-m="${x.m.id}" data-w="${w.id}" aria-label="Feldtyp des Codes" ${St().dis()}>${E.WERTTYPEN.map(([k, n, h]) => `<option value="${k}" ${t === k ? "selected" : ""} title="${esc(h)}">${n}</option>`).join("")}</select>
            <span class="num">${K.Store.artikelQuelle === "applus" && w.apStamm !== false && K.Store.artikelZu(w.code) ? `<small class="kb-ap" title="Bezeichnung und Preis kommen aus APplus (ARTIKEL)">AP</small> ` : ""}${pr ? K.eur(pr) : "inkl."}${t === "zahl" ? ` <small>je ${esc(w.zahl?.einheit || "Einheit")}</small>` : ""}</span>
            ${ro() ? "" : wahl && x.m.typ !== "mehrfach" ? `<button type="button" class="kb-stern${std ? " an" : ""}" data-act="kbStd" data-m="${x.m.id}" data-w="${w.id}" title="${std ? "Ist vorausgewählt" : "Als Vorauswahl festlegen"}" aria-label="Als Vorauswahl">${std ? "★" : "☆"}</button>` : t === "janein" ? `<button type="button" class="kb-stern${w.vorgabe ? " an" : ""}" data-act="kbJNVorgabe" data-m="${x.m.id}" data-w="${w.id}" title="${w.vorgabe ? "Ist vorab angekreuzt" : "Vorab ankreuzen"}" aria-label="Vorab ankreuzen">${w.vorgabe ? "★" : "☆"}</button>` : `<span></span>`}
            ${ro() ? "" : `<button type="button" class="kb-x" data-act="kbWWeg" data-m="${x.m.id}" data-w="${w.id}" title="Vom Fahrzeug entfernen" aria-label="Entfernen">✕</button>`}
            ${K.wertExtras(x.m, w, "kb")}</div>`; }).join("")}</div></article>`;
    };
    const posX = kb.pos && pm.find(x => x.m.id === kb.pos);
    if (kb.pos && !posX) kb.pos = null;
    if (posX) return position(mo, p, posX, karte);
    return `<div class="panel kb-objekt" data-drop="p:${p.id}">
      <div class="eyebrow">${E.gruppenPfad(mo, p.gruppe).map(x => esc(x.name)).join(" › ") || "Ohne Familie"} ›</div>
      <div class="kb-kopf"><input id="kb-pname" class="flach titelfeld" data-chg="kbPFeld" data-k="name" value="${esc(p.name)}" aria-label="Name" ${St().dis()}>
        ${ro() ? "" : `<button type="button" class="btn klein gefahr-text" data-act="kbLoeschen">${K.kb.loeschen === "p:" + p.id ? "Wirklich löschen?" : "Löschen"}</button>`}</div>
      <div class="formgitter kb-pfelder">
        <div class="feld"><label>Artikelnummer</label><div class="wert"><code>${esc(p.code || "–")}</code>${K.Store.artikelQuelle ? (a ? ` <span class="gedimmt klein">${esc(a.name)}</span>` : ` <span class="warntext klein">nicht im Artikelstamm</span>`) : ""}</div></div>
        <div class="feld"><label for="kb-ppreis">Grundpreis</label><input id="kb-ppreis" type="number" step="100" data-chg="kbPFeld" data-k="basispreis" value="${p.basispreis || 0}" ${St().dis()}></div>
        <div class="feld"><label for="kb-pfam">Familie</label><select id="kb-pfam" data-act="kbPFam" ${St().dis()}>${mo.gruppen.map(x => `<option value="${x.id}" ${x.id === p.gruppe ? "selected" : ""}>${esc(E.gruppenPfad(mo, x.id).map(y => y.name).join(" › "))}</option>`).join("")}</select></div>
        <div class="feld"><label class="haken"><input type="checkbox" data-act="kbPAktiv" ${p.aktiv !== false ? "checked" : ""} ${St().dis()}> im Katalog sichtbar</label></div></div>
      <details class="kb-mehr"><summary>Beschreibung und Bild</summary><div class="formgitter"><div class="feld"><label for="kb-pbes">Beschreibung (Info im Katalog)</label><textarea id="kb-pbes" rows="3" data-chg="kbPFeld" data-k="beschreibung" ${St().dis()}>${esc(p.beschreibung || "")}</textarea></div>
        <div class="feld"><label>Bild im Katalog</label>${bildFeld(p.bild, "kbBild", `data-s="p:${p.id}"`)}</div></div></details>
      <div class="kb-codekopf"><h3>Vertriebscodes <span class="gedimmt">${codesVon(p)}</span></h3>
        <input id="kb-csuche" type="search" data-in="kbCSuche" placeholder="Codes filtern" value="${esc(kb.codeSuche)}">
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="kbEinfuegen">${kb.einfuegen ? "Liste schließen" : "Liste einfügen"}</button><button class="btn klein" type="button" data-act="kbOrdnen" title="${esc(praefixe().ueber)}-Codes werden Überschriften, ${esc(praefixe().option)}-Codes Untergruppen, die übrigen Codes deren Auswahlmöglichkeiten">Nach Überschriften ordnen</button><button class="btn klein" type="button" data-act="kbMNeu">+ Gruppe</button>`}</div>
      ${kb.einfuegen ? `<div class="kb-einfuegen"><label for="kb-liste" class="klein">Codes aus Excel kopieren und hier einfügen, eine Zeile pro Code. Steht ein Preis daneben, wird er übernommen.</label>
        <textarea id="kb-liste" rows="6" data-in="kbListeText" placeholder="YY301&#9;3900&#10;YY302&#9;640&#10;7307464">${esc(kb.einfuegenText)}</textarea>
        <div class="row"><label class="haken klein"><input type="checkbox" data-act="kbAuto" ${kb.auto !== false ? "checked" : ""}> nach ${esc(praefixe().ueber)}-Überschriften ordnen</label><label class="inline klein">sonst in <select id="kb-ziel1" data-act="kbZiel">${gruppenOpt}</select></label><button class="btn primary klein" type="button" data-act="kbListeUebernehmen">Codes übernehmen</button></div>
        <p class="klein gedimmt">Spalten: Code, Bezeichnung, Preis (Reihenfolge egal). Die Reihenfolge der Zeilen bestimmt die Gliederung: ${esc(praefixe().ueber)}-Code = Überschrift (erscheint im Angebot), ${esc(praefixe().option)}-Code = Untergruppe, alle Codes darunter = Auswahlmöglichkeiten dieser Untergruppe.</p></div>` : ""}
      <div class="kb-gruppen">${abschnittsweise(pm, karte, p) || `<div class="leer klein">Noch keine Codes. Ziehen Sie Artikel aus dem Artikelstamm hierher oder fügen Sie eine Liste ein.</div>`}
        ${ro() ? "" : `<div class="kb-ablage klein" data-drop="m:__neu">Hierher ziehen = neue Gruppe</div>`}</div></div>`;
  }

  /* Artikelsuche rechts: nur ein Suchfeld mit Vorschlägen (Autocomplete). Treffer per „Übernehmen“,
     Enter oder Ziehen in den Katalog. Gesucht wird im APplus-Artikelstamm und in den Codes des Modells. */
  function treffer(mo, q) {
    q = q.trim(); if (!q) return [];
    const out = [], gesehen = new Set(), ql = q.toLowerCase();
    if (K.Store.artikelQuelle) for (const a of K.Store.artikelSuche(q, 40)) { const C = norm(a.code); if (gesehen.has(C)) continue; gesehen.add(C); out.push({ code: a.code, name: a.name, preis: a.preis, bild: a.bild }); }
    // Codes aus dem Modell nur, wenn kein echter Artikelstamm (APplus oder Excel) geladen ist
    if (!K.Store.artikelQuelle || K.Store.artikelQuelle === "beispiel") for (const m of mo.merkmale) for (const w of m.werte) { if (!w.code || out.length >= 40) continue; const C = norm(w.code); if (gesehen.has(C) || !(w.code + " " + w.name).toLowerCase().includes(ql)) continue; gesehen.add(C); out.push({ code: w.code, name: w.name, preis: w.preis, gruppe: m.name }); }
    const vorn = out.filter(x => x.code.toLowerCase().startsWith(ql)); return [...vorn, ...out.filter(x => !vorn.includes(x))].slice(0, 40);
  }
  function quellZeile() {
    const st = K.Store.abfrageStatus?.artikel, q = K.Store.artikelQuelle, n = K.Store.artikel.size, name = K.Store.abfragen().artikel;
    if (q === "applus") return `<p class="kb-quelle ok klein">Quelle: APplus-Abfrage <code>${esc(st?.name || name)}</code> · ${K.zahl(n)} Artikel</p>`;
    if (q === "excel") return `<p class="kb-quelle klein">Quelle: Artikel aus Excel-Import · ${K.zahl(n)} Artikel</p>`;
    const grund = name ? (st?.fehler ? `Abfrage <code>${esc(name)}</code> nicht geladen: ${esc(st.fehler)}` : `Abfrage <code>${esc(name)}</code> nicht geladen`) : "Keine Artikel-Abfrage eingetragen";
    return `<div class="hinweis klein kb-quelle"><b>${grund}.</b> Die Vorschläge kommen aus Beispieldaten bzw. den Codes im Modell. ${ro() ? "" : `<a href="#studio-einstellungen" data-act="geheAbfragen">Abfrage eintragen und testen</a>`}</div>`;
  }
  function pool(mo) {
    const kb = K.kb, o = objekt(kb.sel), istFz = kb.sel[0] === "p", istFam = kb.sel[0] === "g", q = kb.poolSuche;
    const vorhanden = new Set(); if (o && (istFz || istFam)) for (const x of istFz ? E.produktMerkmale(mo, o) : (o.merkmale || []).map(z => ({ werte: (E.merkmal(mo, z.id)?.werte || []).filter(w => !z.werte || z.werte.includes(w.id)) }))) for (const w of x.werte) if (w.code) vorhanden.add(norm(w.code));
    const nutzung = new Map(); for (const p of mo.produkte) { if (p.code) nutzung.set(norm(p.code), "Fahrzeug"); for (const x of E.produktMerkmale(mo, p)) for (const w of x.werte) if (w.code) { const C = norm(w.code), alt = nutzung.get(C); if (alt !== "Fahrzeug") nutzung.set(C, (alt || 0) + 1); } }
    const liste = treffer(mo, q), ziel = !ro() && o && (istFz || istFam), neu = liste.filter(a => !vorhanden.has(norm(a.code)));
    if (kb.acIdx >= liste.length) kb.acIdx = Math.max(0, liste.length - 1);
    const zielText = istFz ? `Ziel: <b>${esc(o.name)}</b>${kb.ziel && E.merkmal(mo, kb.ziel) ? ` › ${esc(E.merkmal(mo, kb.ziel).name)}` : ""}` : istFam ? `Ziel: Familie <b>${esc(o.name)}</b> (gilt für alle Fahrzeuge darin)` : "Links ein Fahrzeug oder eine Familie wählen.";
    return `<aside class="panel kb-pool">
      <h3 class="kb-pooltitel">Codes hinzufügen</h3>
      <div class="kb-ac">
        <input id="kb-psuche" type="search" data-in="kbPSuche" role="combobox" aria-autocomplete="list" aria-expanded="${!!liste.length}" aria-controls="kb-ac-liste" ${liste.length ? `aria-activedescendant="kb-ac-${kb.acIdx || 0}"` : ""} aria-label="Artikel suchen" placeholder="Artikelnummer oder Bezeichnung" value="${esc(q)}" autocomplete="off">
        ${q.trim() ? (liste.length ? `<ul id="kb-ac-liste" class="kb-ac-liste" role="listbox">${liste.map((a, i) => { const da = vorhanden.has(norm(a.code)), nz = nutzung.get(norm(a.code));
          return `<li id="kb-ac-${i}" role="option" aria-selected="${i === (kb.acIdx || 0)}" class="${da ? "da" : ""}" draggable="${!ro()}" data-drag="a:${esc(a.code)}" data-act="kbAcZeile" data-i="${i}">
            <span class="kb-ac-text">${a.bild ? `<span class="kb-ac-bild">${K.bildMitErsatz(a.bild, "")}</span>` : ""}<code>${esc(a.code)}</code> <span>${esc(a.name || "")}</span>${a.gruppe ? ` <i class="gedimmt">${esc(a.gruppe)}</i>` : ""}</span>
            <span class="kb-ac-info">${da ? `<span class="kb-nutz">schon drin</span>` : nz ? `<span class="kb-nutz" title="${nz === "Fahrzeug" ? "ist ein Fahrzeug im Katalog" : "als Code in " + nz + " Fahrzeugen"}">${nz === "Fahrzeug" ? "Fzg." : "×" + nz}</span>` : ""}<span class="num klein">${a.preis ? K.eur(a.preis) : ""}</span></span>
            ${ziel && !da ? `<span class="kb-ac-knopf">${istFam ? `<button type="button" class="btn klein ghost" data-act="kbAlsFz" data-c="${esc(a.code)}" title="Als Fahrzeug in dieser Familie anlegen">als Fahrzeug</button>` : ""}<button type="button" class="btn klein primary" data-act="kbUebernehmen" data-c="${esc(a.code)}">Übernehmen</button></span>` : ""}</li>`; }).join("")}</ul>`
          : `<p class="kb-ac-leer klein">Kein Artikel gefunden.</p>`) : ""}
      </div>
      <p class="klein ${ziel ? "" : "gefahr-text"}">${zielText}</p>
      ${q.trim() && ziel && neu.length > 1 ? `<button type="button" class="btn klein" data-act="kbAlleUebernehmen">Alle ${neu.length} neuen Treffer übernehmen</button>` : ""}
      ${!q.trim() ? `<p class="klein gedimmt">Tippen, dann mit <b>Übernehmen</b>, <kbd>Enter</kbd> oder per Ziehen in den Katalog. <kbd>↑</kbd> <kbd>↓</kbd> wählen den Vorschlag.${istFz ? " Ziehen auf eine Gruppe legt den Code dort ab." : ""}</p>` : ""}
      ${quellZeile()}</aside>`;
  }


  /* ---------- Aktionen ---------- */
  const A = K.act, I = K.inp;
  A.kbWahl = el => { const kb = K.kb; kb.sel = el.dataset.s; kb.pos = el.dataset.pos || null; kb.ziel = kb.pos || ""; kb.loeschen = null; kb.codeSuche = ""; if (kb.pos) kb.offen[kb.sel] = true; K.render(); K.nach(v => v.querySelector(".kb-mitte")?.scrollIntoView({ block: "nearest" })); };
  A.kbZuRegeln = el => { K.st.kontext = "p:" + el.dataset.p; K.st.regelTab = "tabellen"; K.gehe("studio-regeln"); };
  A.kbRestLoeschen = async el => { const ids = el.dataset.p ? [el.dataset.p] : K.nurImKatalog().map(p => p.id); K.sheetZu(); const lv = S().live || { produkte: [] }, namen = ids.map(id => (lv.produkte.find(x => x.id === id) || E.produkt(ent(), id) || { name: id }).name); await K.Store.endgueltigLoeschen({ produkte: ids }, ids.length === 1 ? `Fahrzeug ${namen[0]} gelöscht` : `${ids.length} Fahrzeuge gelöscht: ${namen.join(", ")}`); K.toast(`${ids.length === 1 ? "Fahrzeug" : ids.length + " Fahrzeuge"} gelöscht. Zurückholen über Studio › Protokoll.`); K.render(); };
  A.kbAufP = el => { const k = "p:" + el.dataset.p, kb = K.kb; kb.offen[k] = !(kb.offen[k] ?? (kb.sel === k)); K.render(); };
  A.kbPosZurueck = () => { K.kb.pos = null; K.kb.ziel = ""; K.render(); };
  A.kbRegelNeu = el => {
    const mo = ent(), pid = K.kb.sel.slice(2), mid = el.dataset.m, id = E.neueId("R", mo.regeln.map(r => r.id)), alsDann = el.dataset.rolle !== "wenn";
    mo.regeln.push({ id, name: "", aktiv: true, produkte: [pid], gruppen: [], wenn: [{ merkmal: alsDann ? "" : mid, op: "ist", werte: [] }], dann: { typ: "sperren", merkmal: alsDann ? mid : "", werte: [] }, hinweis: "" });
    K.st.kontext = "p:" + pid; K.st.regelOffen = id; geaendert(`Regel ${id} für ${E.merkmal(mo, mid)?.name} angelegt`);
    K.nach(v => v.querySelector(".kb-posregeln .regelkarte.offen")?.scrollIntoView({ block: "center" }));
  };
  A.kbAuf = el => { K.kb.offen[el.dataset.g] = !(K.kb.offen[el.dataset.g] ?? true); K.render(); };
  A.kbFamNeu = el => {
    const mo = ent(), eltern = el.dataset.g || null, g = { id: eindeutig("familie", mo.gruppen), name: "Neue Familie", eltern, merkmale: [] };
    mo.gruppen.push(g); if (eltern) K.kb.offen[eltern] = true; K.kb.sel = "g:" + g.id; geaendert("Familie angelegt");
    K.nach(v => { const f = v.querySelector("#kb-gname"); if (f) { f.focus(); f.select(); } });
  };
  I.kbGName = el => { const g = objekt(K.kb.sel); g.name = el.value.trim() || g.name; geaendert(`Familie „${g.name}“ umbenannt`); };
  I.kbGBes = el => { const g = objekt(K.kb.sel); g.beschreibung = el.value; geaendert(`Beschreibung von ${g.name}`); };
  A.kbGEltern = el => { const g = objekt(K.kb.sel); g.eltern = el.value || null; geaendert(`${g.name} verschoben`); };
  A.kbBild = async el => { const o = objekt(el.dataset.s), id = await bildLesen(el); if (id === undefined) return; if (id) o.bild = id; else delete o.bild; geaendert(`Bild von ${o.name} ${id ? "hinterlegt" : "entfernt"}`); };
  I.kbPFeld = el => { const p = objekt(K.kb.sel), k = el.dataset.k; p[k] = k === "basispreis" ? (+el.value || 0) : el.value; if (k === "basispreis" && K.Store.artikelZu(p.code)) p.apStamm = false; geaendert(`${p.name}: ${k === "basispreis" ? "Grundpreis" : k === "name" ? "Name" : "Beschreibung"} geändert`); };
  A.kbPFam = el => { const p = objekt(K.kb.sel); p.gruppe = el.value; geaendert(`${p.name} nach ${gruppe(el.value)?.name} verschoben`); };
  A.kbPAktiv = el => { const p = objekt(K.kb.sel); p.aktiv = el.checked; geaendert(`${p.name} ${el.checked ? "im Katalog sichtbar" : "ausgeblendet"}`); };
  A.kbKachelLoeschen = el => { K.kb.kachelLoeschen = el.dataset.p || null; K.render(); };
  A.kbKachelLoeschenOk = async el => { const p = E.produkt(ent(), el.dataset.p); K.kb.kachelLoeschen = null; if (!p) return K.render(); if (K.kb.sel === "p:" + p.id) K.kb.sel = ""; await K.Store.endgueltigLoeschen({ produkte: [p.id] }, `Fahrzeug ${p.name} (${p.code || p.id}) gelöscht`); K.toast(`${p.name} gelöscht. Zurückholen über Studio › Protokoll.`); K.render(); };
  A.kbLoeschen = async () => {
    const kb = K.kb; if (kb.loeschen !== kb.sel) { kb.loeschen = kb.sel; return K.render(); }
    const o = objekt(kb.sel), fam = kb.sel[0] === "g"; kb.loeschen = null; kb.sel = ""; kb.pos = null; if (!o) return K.render();
    if (fam) { const n = E.familienArtikel(ent(), o.id).length; await K.Store.endgueltigLoeschen({ gruppen: [o.id] }, `Familie ${o.name} mit ${n} Fahrzeug${n === 1 ? "" : "en"} gelöscht`); K.toast(`${o.name} gelöscht. Zurückholen über Studio › Protokoll.`); }
    else { await K.Store.endgueltigLoeschen({ produkte: [o.id] }, `Fahrzeug ${o.name} (${o.code || o.id}) gelöscht`); K.toast(`${o.name} gelöscht. Zurückholen über Studio › Protokoll.`); }
    K.render();
  };
  A.kbLeeren = () => {
    const kb = K.kb; if (!kb.leeren) { kb.leeren = true; K.render(); setTimeout(() => { kb.leeren = false; }, 6000); return; }
    kb.leeren = false; kb.sel = ""; kb.pos = null;
    K.Store.endgueltigLoeschen({ alles: true }, "Katalog komplett geleert (Neu beginnen)").then(() => { K.toast("Katalog geleert. Zurückholen über Studio › Protokoll."); K.render(); });
  };
  A.kbVorschau = () => { K.kat.entwurf = true; K.kat.gruppe = K.kb.sel[0] === "g" ? K.kb.sel.slice(2) : ""; K.gehe("katalog"); };
  // Codes und Gruppen am Fahrzeug
  I.kbCSuche = el => { K.kb.codeSuche = el.value; K.render(); K.nach(v => { const f = v.querySelector("#kb-csuche"); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } }); };
  I.kbMName = el => { const m = E.merkmal(ent(), el.dataset.m); m.name = el.value.trim() || m.name; geaendert(`Gruppe „${m.name}“ umbenannt`); };
  A.kbWTyp = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); E.wertTypSetzen(w, el.value); geaendert(`${w.code}: ${E.WERTTYPEN.find(x => x[0] === el.value)[1]}`); };
  A.kbJNVorgabe = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); w.vorgabe = !w.vorgabe; geaendert(`${w.code} ${w.vorgabe ? "vorab angekreuzt" : "nicht vorab angekreuzt"}`); };
  I.kbWName = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); w.name = el.value.trim() || w.name; if (K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Bezeichnung von ${w.code} geändert`); };
  /** Einstellungen eines Codes mit Feldtyp Zahl oder Text */
  K.wertExtras = (m, w, px) => {
    const t = E.wertTyp(m, w), d = St().dis(), attr = k => `data-chg="wertExtra" data-m="${m.id}" data-w="${w.id}" data-k="${k}"`;
    if (t === "zahl") { const z = w.zahl || {}; return `<div class="kb-extras">${[["einheit", "Einheit", "text", z.einheit], ["min", "von", "number", z.min], ["max", "bis", "number", z.max], ["schritt", "Schritt", "number", z.schritt], ["standard", "Vorgabe", "number", z.standard]].map(([k, n, ty, v]) => `<label>${n} <input id="${px}-z-${m.id}-${w.id}-${k}" type="${ty}" class="kurz" data-g="zahl" ${attr(k)} value="${esc(v ?? "")}" ${d}></label>`).join("")}</div>`; }
    if (t === "text") { const x = w.text || {}; return `<div class="kb-extras"><label>max. Zeichen <input id="${px}-t-${m.id}-${w.id}-l" type="number" class="kurz" data-g="text" ${attr("maxLaenge")} value="${esc(x.maxLaenge ?? 60)}" ${d}></label><label>Hinweis im Feld <input id="${px}-t-${m.id}-${w.id}-h" data-g="text" ${attr("hinweis")} value="${esc(x.hinweis || "")}" placeholder="z. B. Firmenname" ${d}></label></div>`; }
    return "";
  };
  I.wertExtra = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w), g = el.dataset.g, k = el.dataset.k; w[g] ||= {}; w[g][k] = el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value; geaendert(`${w.code}: ${k} geändert`); };
  A.kbMTyp = el => { const m = E.merkmal(ent(), el.dataset.m); E.feldtypSetzen(m, el.value); geaendert(`${m.name}: ${E.FELDTYPEN.find(x => x[0] === el.value)[1]}`); };
  A.kbHoch = () => { const g = objekt(K.kb.sel), n = E.hochziehen(ent(), g.id); geaendert(`Gemeinsame Struktur an ${g.name} übergeben`); K.toast(n ? `${n} Gruppen gelten jetzt für die ganze Familie` : "Die Fahrzeuge haben keine gemeinsamen Gruppen"); };
  A.kbMPflicht = el => { const m = E.merkmal(ent(), el.dataset.m); m.pflicht = el.checked; geaendert(`${m.name}: ${el.checked ? "Pflichtangabe" : "mit Vorauswahl"}`); };
  A.kbStd = el => { const p = objekt(K.kb.sel), mid = el.dataset.m; p.merkmale ||= []; let z = p.merkmale.find(x => x.id === mid && !x.aus); if (!z) { z = { id: mid }; p.merkmale.push(z); } z.standard = el.dataset.w; const m = E.merkmal(ent(), mid); if (m.pflicht) m.pflicht = false; geaendert(`Vorauswahl bei ${m.name} geändert`); };
  /** Zusatzeinstellungen je Feldtyp (Zahl: Einheit, Grenzen; Text: Länge, Hinweis) */
  K.feldtypExtras = (m, px) => {
    const t = E.feldtyp(m), d = St().dis();
    if (t === "zahl") { const z = m.zahl || {}; return `<div class="kb-extras">${[["einheit", "Einheit", "text", z.einheit], ["min", "von", "number", z.min], ["max", "bis", "number", z.max], ["schritt", "Schritt", "number", z.schritt], ["standard", "Vorgabe", "number", z.standard]].map(([k, n, ty, v]) => `<label class="inline klein">${n} <input id="${px}-z-${m.id}-${k}" type="${ty}" class="kurz" data-chg="feldExtra" data-m="${m.id}" data-g="zahl" data-k="${k}" value="${esc(v ?? "")}" ${d}></label>`).join("")}<span class="gedimmt klein">Preis des Codes gilt je Einheit</span></div>`; }
    if (t === "text") { const x = m.text || {}; return `<div class="kb-extras"><label class="inline klein">max. Zeichen <input id="${px}-t-${m.id}-l" type="number" class="kurz" data-chg="feldExtra" data-m="${m.id}" data-g="text" data-k="maxLaenge" value="${esc(x.maxLaenge ?? 60)}" ${d}></label><label class="inline klein">Hinweis im Feld <input id="${px}-t-${m.id}-h" data-chg="feldExtra" data-m="${m.id}" data-g="text" data-k="hinweis" value="${esc(x.hinweis || "")}" placeholder="z. B. Firmenname" ${d}></label><span class="gedimmt klein">Erster Code liefert Preis und Code fürs Angebot</span></div>`; }
    if (t === "fest") return `<div class="kb-extras"><span class="gedimmt klein">Alle Codes sind immer enthalten und stehen im Angebot unter der Überschrift.</span></div>`;
    return "";
  };
  I.feldExtra = el => { const m = E.merkmal(ent(), el.dataset.m), g = el.dataset.g, k = el.dataset.k; m[g] ||= {}; m[g][k] = el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value; geaendert(`${m.name}: ${k} geändert`); };
  A.kbMNeu = () => { const p = objekt(K.kb.sel), m = merkmalNeu("Neue Gruppe", false); (p.merkmale ||= []).push({ id: m.id, werte: [] }); geaendert("Gruppe angelegt"); K.nach(v => { const f = v.querySelector("#kb-mn-" + m.id); if (f) { f.focus(); f.select(); } }); };
  A.kbMWeg = el => { const p = objekt(K.kb.sel), mid = el.dataset.m; p.merkmale ||= []; const z = p.merkmale.find(x => x.id === mid); if (z) { z.aus = true; delete z.werte; } else p.merkmale.push({ id: mid, aus: true }); geaendert(`Gruppe bei ${p.name} ausgeblendet`); };
  A.kbWWeg = el => { const p = objekt(K.kb.sel); vomFahrzeug(p, el.dataset.m, el.dataset.w); geaendert(`Code bei ${p.name} entfernt`); };
  A.kbEinfuegen = () => { K.kb.einfuegen = !K.kb.einfuegen; K.render(); if (K.kb.einfuegen) K.nach(v => v.querySelector("#kb-liste")?.focus()); };
  I.kbListeText = el => { K.kb.einfuegenText = el.value; };
  A.kbZiel = el => { K.kb.ziel = el.value; };
  A.kbListeUebernehmen = () => {
    const p = objekt(K.kb.sel), preise = new Map(), namen = new Map(), codes = [];
    const istZahl = t => /^-?[\d.,]+\s*(€|EUR)?$/i.test(t);
    for (const zeile of K.kb.einfuegenText.split(/\r?\n/)) {
      const teile = zeile.split(/\t|;|\s{2,}/).map(s => s.trim()).filter(Boolean); if (!teile.length) continue;
      const code = teile[0]; if (!code || /^(code|vertriebscode|artikel)$/i.test(code)) continue;
      codes.push(code);
      const z = teile.slice(1).find(istZahl); if (z != null) preise.set(norm(code), K.X.zahl(z));
      const t = teile.slice(1).find(x => !istZahl(x) && /[a-zäöü]{2}/i.test(x)); if (t) namen.set(norm(code), t);
    }
    if (!codes.length) return K.toast("Keine Codes gefunden.");
    const r = codesZuFahrzeug(p, codes, K.kb.ziel, preise, namen); K.kb.einfuegenText = ""; K.kb.einfuegen = false;
    mitOrdnen(p, codes, r);
  };
  const ordnenText = st => st ? `Geordnet: ${st.abschnitte} Überschriften, ${st.auswahl} Auswahlen, ${st.optionen} Gruppen mit Optionen${st.fest ? `, ${st.fest} Codes fest in der Grundausstattung` : ""}` : "Keine Codes zum Ordnen";
  A.kbOrdnen = () => { const p = objekt(K.kb.sel), st = strukturieren(p); geaendert(`Codes von ${p.name} nach Überschriften geordnet`); K.toast(ordnenText(st)); };
  A.kbAuto = el => { K.kb.auto = el.checked; };
  I.kbAbName = el => { const p = objekt(K.kb.sel), alt = el.dataset.ab, neu = el.value.trim(); if (!neu || neu === alt) return;
    for (const x of E.produktMerkmale(ent(), p)) if ((x.m.abschnitt || "") === alt) { x.m.abschnitt = neu; if (x.m.name === alt) x.m.name = neu; else if (x.m.name.startsWith(alt + " – ")) x.m.name = neu + x.m.name.slice(alt.length); }
    for (const g of p.grundausstattung || []) if (g.gruppe === alt) g.gruppe = neu;
    geaendert(`Überschrift „${neu}“`); };
  A.kbGaWeg = el => { const p = objekt(K.kb.sel); p.grundausstattung.splice(+el.dataset.i, 1); geaendert(`Grundausstattung von ${p.name} geändert`); };
  function meldung(p, r) {
    geaendert(`${r.neu === 1 ? "1 neuer Code" : r.neu + " neue Codes"} bei ${p.name}`);
    const t = [r.neu ? (r.neu === 1 ? "1 neuer Code" : `${r.neu} neue Codes`) : "", r.schon ? `${r.schon} waren schon da` : "", r.anders ? `${r.anders} stehen bereits in einer anderen Gruppe und bleiben dort` : ""].filter(Boolean).join(", ");
    K.toast(t || "Codes hinzugefügt");
    if (r.neuGruppe) K.nach(v => { const f = v.querySelector("#kb-mn-" + r.neuGruppe.id); if (f) { f.focus(); f.select(); } });
  }
  // Baukasten
  A.kbPoolTab = el => { K.kb.poolTab = el.dataset.t; K.kb.poolWahl.clear(); K.render(); };
  const sucheFokus = () => K.nach(v => { const f = v.querySelector("#kb-psuche"); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); v.querySelector('.kb-ac-liste [aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); } });
  I.kbPSuche = el => { K.kb.poolSuche = el.value; K.kb.acIdx = 0; K.render(); sucheFokus(); };
  /** Codes an das gewählte Fahrzeug bzw. die Familie hängen, danach Suchfeld leeren für den nächsten Code */
  const uebernehmen = codes => {
    const o = objekt(K.kb.sel), t = K.kb.sel[0]; if (!o || ro() || !codes.length) return;
    K.kb.poolSuche = ""; K.kb.acIdx = 0;
    if (t === "p") mitOrdnen(o, codes, codesZuFahrzeug(o, codes, K.kb.ziel));
    else if (t === "g") { o.merkmale ||= []; const r = codesZuFahrzeug(o, codes, K.kb.ziel); geaendert(`${codes.length} Codes an Familie ${o.name}`); K.toast(`${codes.length === 1 ? codes[0] + " gilt" : codes.length + " Codes gelten"} jetzt für alle Fahrzeuge in ${o.name}${r.schon ? ` (${r.schon} waren schon da)` : ""}`); }
    else return;
    K.render(); sucheFokus();
  };
  A.geheAbfragen = () => K.gehe("studio-einstellungen");
  A.kbUebernehmen = (el, e) => { e?.stopPropagation?.(); uebernehmen([el.dataset.c]); };
  A.kbAlleUebernehmen = () => { const mo = ent(), o = objekt(K.kb.sel), da = new Set(); if (K.kb.sel[0] === "p") for (const x of E.produktMerkmale(mo, o)) for (const w of x.werte) if (w.code) da.add(norm(w.code)); uebernehmen(treffer(mo, K.kb.poolSuche).map(a => a.code).filter(c => !da.has(norm(c)))); };
  A.kbAlsFz = (el, e) => { e?.stopPropagation?.(); const g = objekt(K.kb.sel); if (!g) return; const r = fahrzeugeAnlegen(g.id, [el.dataset.c]); K.kb.poolSuche = ""; geaendert(`${el.dataset.c} als Fahrzeug in ${g.name}`); K.toast(r.neu ? `${el.dataset.c} als Fahrzeug angelegt` : r.verschoben ? `${el.dataset.c} hierher verschoben` : `${el.dataset.c} ist schon ein Fahrzeug`); sucheFokus(); };
  A.kbAcZeile = (el, e) => { if (e?.target?.closest?.("button")) return; K.kb.acIdx = +el.dataset.i; K.render(); sucheFokus(); };
  document.addEventListener("keydown", e => {
    const f = e.target; if (!f || f.id !== "kb-psuche" || !K.root || !K.root.contains(f)) return;
    const n = K.root.querySelectorAll(".kb-ac-liste [role=option]").length, kb = K.kb;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { if (!n) return; e.preventDefault(); kb.acIdx = ((kb.acIdx || 0) + (e.key === "ArrowDown" ? 1 : -1) + n) % n; K.render(); sucheFokus(); }
    else if (e.key === "Enter") { e.preventDefault(); const li = K.root.querySelector(`#kb-ac-${kb.acIdx || 0}`), b = li?.querySelector("[data-act=kbUebernehmen]"); if (b) uebernehmen([b.dataset.c]); else if (li) K.toast(objekt(kb.sel) ? "Dieser Code ist schon drin." : "Links ein Fahrzeug oder eine Familie wählen."); }
    else if (e.key === "Escape" && kb.poolSuche) { e.preventDefault(); kb.poolSuche = ""; kb.acIdx = 0; K.render(); sucheFokus(); }
  });
  A.kbPoolWahl = el => { const s = K.kb.poolWahl; el.checked ? s.add(el.dataset.c) : s.delete(el.dataset.c); K.render(); };
  A.kbPoolLeer = () => { K.kb.poolWahl.clear(); K.render(); };
  A.kbPoolAlle = () => { K.root.querySelectorAll(".kb-poolliste input[data-c]").forEach(i => K.kb.poolWahl.add(i.dataset.c)); K.render(); };
  const mitOrdnen = (p, codes, r) => { if (K.kb.auto !== false && (codes.some(c => norm(c).startsWith(norm(praefixe().ueber))) || p.codeFolge)) { if (!p.codeFolge || codes.some(c => norm(c).startsWith(norm(praefixe().ueber)))) p.codeFolge = [...(p.codeFolge || []), ...codes]; const st = strukturieren(p); geaendert(`${codes.length} Codes bei ${p.name} eingefügt und geordnet`); return K.toast(ordnenText(st)); } meldung(p, r); };
  A.kbPoolZuFz = () => { const p = objekt(K.kb.sel), codes = [...K.kb.poolWahl], r = codesZuFahrzeug(p, codes, K.kb.ziel); K.kb.poolWahl.clear(); mitOrdnen(p, codes, r); };
  A.kbPoolFilter = el => { K.kb.poolFilter = el.dataset.f; K.render(); };
  A.kbPoolCodesFam = () => { const g = objekt(K.kb.sel), codes = [...K.kb.poolWahl]; g.merkmale ||= []; const r = codesZuFahrzeug(g, codes, K.kb.ziel); K.kb.poolWahl.clear(); geaendert(`${r.neu + codes.length - r.neu} Codes an Familie ${g.name}`); K.toast(`${codes.length} Codes gelten jetzt für alle Fahrzeuge in ${g.name}${r.schon ? ` (${r.schon} waren schon da)` : ""}`); };
  A.kbPoolZuFam = () => { const g = objekt(K.kb.sel), r = fahrzeugeAnlegen(g.id, [...K.kb.poolWahl]); K.kb.poolWahl.clear(); geaendert(`${r.neu} Fahrzeuge in ${g.name} angelegt`); K.toast(`${r.neu} Fahrzeuge angelegt${r.verschoben ? `, ${r.verschoben} hierher verschoben` : ""}`); };

  /* ---------- Drag & Drop ---------- */
  let zug = null; // { art: "g"|"p"|"a"|"w"|"m", ids: [...] }
  const imBau = e => K.root && K.root.contains(e.target) && K.aktuell() === "studio-katalog" && !ro();
  const lage = (e, el) => { const r = el.getBoundingClientRect(), y = (e.clientY - r.top) / r.height; return y < .28 ? "vor" : y > .72 ? "nach" : "in"; };
  function erlaubt(z, ziel, pos) {
    if (!z || !ziel) return null; const [t, id] = [ziel.slice(0, 1), ziel.slice(2)];
    if (z.art === "g") { if (t !== "g") return null; if (id && (id === z.ids[0] || istUnter(z.ids[0], id))) return null; return id ? pos : "in"; }
    if (z.art === "p") { if (t === "g") return id ? "in" : null; if (t === "p") return pos === "in" ? "nach" : pos; return null; }
    if (z.art === "a") { if (t === "g") return id ? "in" : null; if (t === "p" || t === "m") return "in"; return null; }
    if (z.art === "w") { if (t === "p" || t === "m") return "in"; return null; }
    if (z.art === "m") { if (t === "m" && id !== z.ids[0] && id !== "__neu") return pos === "in" ? "vor" : pos; return null; }
    return null;
  }
  document.addEventListener("dragstart", e => {
    if (!imBau(e)) return; const el = e.target.closest && e.target.closest("[data-drag]"); if (!el) return;
    const d = el.dataset.drag, art = d[0]; let ids = [d.slice(2)];
    if (art === "a" && K.kb.poolWahl.has(ids[0])) ids = [...K.kb.poolWahl];
    if (art === "a" && !K.kb.poolWahl.has(ids[0]) && K.kb.poolWahl.size) ids = [ids[0]];
    zug = { art, ids }; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", ids.join("\n")); } catch (x) {}
    if (ids.length > 1) { const b = document.createElement("div"); b.className = "kb-ziehbild"; b.textContent = `${ids.length} Artikel`; document.body.appendChild(b); e.dataTransfer.setDragImage(b, 10, 10); setTimeout(() => b.remove(), 0); }
    el.classList.add("kb-zieht"); e.stopPropagation();
  });
  document.addEventListener("dragend", () => { zug = null; K.root && K.root.querySelectorAll(".kb-zieht,.kb-in,.kb-vor,.kb-nach").forEach(x => x.classList.remove("kb-zieht", "kb-in", "kb-vor", "kb-nach")); });
  let markiert = null;
  document.addEventListener("dragover", e => {
    if (!zug || !imBau(e)) return; const el = e.target.closest("[data-drop]"); if (!el) return;
    const pos = erlaubt(zug, el.dataset.drop, lage(e, el)); if (!pos) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    if (markiert && markiert !== el) markiert.classList.remove("kb-in", "kb-vor", "kb-nach");
    el.classList.remove("kb-in", "kb-vor", "kb-nach"); el.classList.add("kb-" + pos); markiert = el;
  });
  document.addEventListener("dragleave", e => { const el = e.target.closest && e.target.closest("[data-drop]"); if (el && !el.contains(e.relatedTarget)) el.classList.remove("kb-in", "kb-vor", "kb-nach"); });
  document.addEventListener("drop", e => {
    if (!zug || !imBau(e)) return; const el = e.target.closest("[data-drop]"); if (!el) return;
    const ziel = el.dataset.drop, pos = erlaubt(zug, ziel, lage(e, el)); if (!pos) return;
    e.preventDefault(); const z = zug; zug = null; ablegen(z, ziel, pos);
  });
  function ablegen(z, ziel, pos) {
    const mo = ent(), t = ziel[0], id = ziel.slice(2);
    if (z.art === "g") {
      const g = gruppe(z.ids[0]), zg = gruppe(id);
      if (!zg || pos === "in") { g.eltern = zg ? zg.id : null; umsetzen(mo.gruppen, g, null); if (zg) K.kb.offen[zg.id] = true; }
      else { g.eltern = zg.eltern || null; umsetzen(mo.gruppen, g, zg, pos === "nach"); }
      return geaendert(`${g.name} verschoben`);
    }
    if (z.art === "p") {
      const p = E.produkt(mo, z.ids[0]);
      if (t === "g") { p.gruppe = id; umsetzen(mo.produkte, p, null); K.kb.offen[id] = true; return geaendert(`${p.name} nach ${gruppe(id).name} verschoben`); }
      const zp = E.produkt(mo, id); if (!zp || zp === p) return; p.gruppe = zp.gruppe; umsetzen(mo.produkte, p, zp, pos === "nach"); return geaendert(`${p.name} einsortiert`);
    }
    if (z.art === "a") {
      K.kb.poolWahl.clear();
      if (t === "g") { const r = fahrzeugeAnlegen(id, z.ids); K.kb.offen[id] = true; geaendert(`${r.neu} Fahrzeuge in ${gruppe(id).name} angelegt`); return K.toast(`${r.neu} Fahrzeuge angelegt${r.verschoben ? `, ${r.verschoben} hierher verschoben` : ""}${z.ids.length - r.neu - r.verschoben ? `, ${z.ids.length - r.neu - r.verschoben} waren schon da` : ""}`); }
      const p = t === "p" ? E.produkt(mo, id) : objekt(K.kb.sel); if (!p || K.kb.sel[0] !== "p" && t === "m") return;
      return mitOrdnen(p, z.ids, codesZuFahrzeug(p, z.ids, t === "m" ? id : ""));
    }
    if (z.art === "w") {
      const [mid, wid] = z.ids[0].split(":"), m = E.merkmal(mo, mid), w = m && m.werte.find(x => x.id === wid); if (!w) return;
      const p = t === "p" ? E.produkt(mo, id) : objekt(K.kb.sel); if (!p) return;
      if (t === "p" || (t === "m" && id === mid)) { if (p.id === K.kb.sel.slice(2) && t === "p") return; amFahrzeug(p, m, w); return geaendert(`${w.code} zu ${p.name}`); }
      // in eine andere Gruppe verschieben
      const nutzer = mo.produkte.filter(x => x !== p && E.produktMerkmale(mo, x).some(y => y.werte.includes(w)));
      if (nutzer.length) return K.toast(`${w.code} wird auch bei ${nutzer.length} anderen Fahrzeugen verwendet (z. B. ${nutzer[0].name}) und bleibt in „${m.name}“.`);
      const zm = id === "__neu" ? merkmalNeu("Neue Gruppe", m.typ === "mehrfach") : E.merkmal(mo, id); if (!zm) return;
      vomFahrzeug(p, mid, wid); m.werte = m.werte.filter(x => x !== w);
      for (const o of [...mo.gruppen, ...mo.produkte]) for (const zz of o.merkmale || []) if (zz.id === mid && zz.werte) zz.werte = zz.werte.filter(x => x !== wid);
      einfrieren(zm); if (zm.werte.some(x => x.id === w.id)) w.id = eindeutig(w.id, zm.werte); zm.werte.push(w); amFahrzeug(p, zm, w);
      geaendert(`${w.code} nach „${zm.name}“ verschoben`);
      if (id === "__neu") K.nach(v => { const f = v.querySelector("#kb-mn-" + zm.id); if (f) { f.focus(); f.select(); } });
      return;
    }
    if (z.art === "m") {
      const p = objekt(K.kb.sel); if (!p || K.kb.sel[0] !== "p") return;
      const ordnung = E.zuordnung(mo, p).map(x => x.id), von = z.ids[0];
      const ohne = ordnung.filter(x => x !== von); let j = ohne.indexOf(id); if (j < 0) return; if (pos === "nach") j++; ohne.splice(j, 0, von);
      p.reihenfolge = ohne; geaendert(`Reihenfolge der Gruppen bei ${p.name} geändert`);
    }
  }
})(window);
