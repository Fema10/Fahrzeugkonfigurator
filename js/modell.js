/* =========================================================================
   Studio → Produktmodell
   Einstieg für die Pflege: links der Baum aus Familien, Unterfamilien und
   konfigurierbaren Artikeln (Artikelnummer aus ARTIKEL), rechts das gewählte
   Objekt mit Merkmalen, Regeln, Matrix, Kombinationstabellen, Graph,
   Stammdaten, Preisen/Stückliste und Test.
   Merkmale und Regeln werden an der Familie gepflegt und vererbt; am Artikel
   wird nur eingeschränkt, vorbelegt, ausgeblendet oder ergänzt.
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S, ent = () => S().entwurf;
  const St = () => K.studio;
  K.st.knoten ||= ""; K.st.modellTab ||= "merkmale"; K.st.baumOffen ||= {}; K.st.baumSuche ||= "";

  const obj = (mo, k) => St().knotenObjekt(mo, k);
  const istFam = k => k && k.startsWith("g:");
  const famName = (mo, gid) => mo.gruppen.find(g => g.id === gid)?.name || gid;
  const quelleName = (mo, q) => !q ? "" : q.startsWith("g:") ? famName(mo, q.slice(2)) : (E.produkt(mo, q.slice(2))?.name || q);
  const ro = () => St().ro(), dis = () => St().dis();
  const geaendert = (t, z) => St().geaendert(t, z);

  /* ---------- Baum ---------- */
  /** Familien ohne Artikel (auch nicht in Unterfamilien) */
  const leereFamilien = mo => mo.gruppen.filter(g => !E.familienArtikel(mo, g.id).length);
  K.act.mLeerWeg = () => {
    const mo = ent(), leer = leereFamilien(mo); if (!leer.length) return;
    const ids = new Set(leer.map(g => g.id)), n = E.ausGeltungEntfernen(mo, [...ids], []);
    mo.gruppen = mo.gruppen.filter(g => !ids.has(g.id));
    if (K.st.knoten && ids.has(K.st.knoten.slice(2))) K.st.knoten = "";
    geaendert(`${leer.length} leere Familien entfernt${n ? `, ${n} Regeln gelöscht` : ""}`);
  };
  function baum(mo) {
    const q = K.st.baumSuche.toLowerCase();
    const passt = p => !q || (p.name + " " + (p.code || "")).toLowerCase().includes(q);
    const artZeile = (p, tiefe) => `<li><button type="button" class="mb-zeile artikel${K.st.knoten === "p:" + p.id ? " aktiv" : ""}" style="--tiefe:${tiefe}" data-act="mKnoten" data-k="p:${p.id}">
      <span class="mb-ikon">▢</span><span class="mb-name"><code class="${St().artKlasse(p.code).trim()}">${esc(p.code || p.id)}</code> ${esc(p.name)}</span>${p.aktiv === false ? `<span class="chip">inaktiv</span>` : ""}</button></li>`;
    const famZeile = (g, tiefe) => {
      const kinder = mo.gruppen.filter(x => x.eltern === g.id), arts = mo.produkte.filter(p => p.gruppe === g.id && passt(p));
      const alleArt = E.familienArtikel(mo, g.id).filter(passt);
      if (q && !alleArt.length && !g.name.toLowerCase().includes(q)) return "";
      const offen = q ? true : (K.st.baumOffen[g.id] ?? true), aktiv = K.st.knoten === "g:" + g.id;
      const nm = (g.merkmale || []).length;
      return `<li><div class="mb-famzeile" style="--tiefe:${tiefe}">
          <button type="button" class="mb-auf" data-act="mAuf" data-g="${g.id}" aria-expanded="${offen}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${kinder.length || arts.length ? (offen ? "▾" : "▸") : ""}</button>
          <button type="button" class="mb-zeile familie${aktiv ? " aktiv" : ""}" data-act="mKnoten" data-k="g:${g.id}"><span class="mb-ikon">▤</span><span class="mb-name">${esc(g.name)}</span><span class="gedimmt klein">${alleArt.length}${nm ? ` · ${nm} M` : ""}</span></button></div>
        ${offen ? `<ul>${kinder.map(k => famZeile(k, tiefe + 1)).join("")}${arts.map(p => artZeile(p, tiefe + 1)).join("")}</ul>` : ""}</li>`;
    };
    const ohne = mo.produkte.filter(p => !mo.gruppen.some(g => g.id === p.gruppe) && passt(p));
    return `<nav class="modellbaum panel" aria-label="Produktmodell">
      <input type="search" id="mb-suche" data-in="mbSuche" placeholder="Artikelnummer oder Name" value="${esc(K.st.baumSuche)}">
      ${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="mFamNeu">+ Familie</button><button class="btn klein primary" type="button" data-act="mArtNeu">+ Konfigurierbarer Artikel</button></div>`}
      ${ro() || !leereFamilien(mo).length ? "" : `<button type="button" class="btn klein mb-leer" data-act="mLeerWeg">${leereFamilien(mo).length} leere Familien entfernen</button>`}
      <ul class="mb-liste">${mo.gruppen.filter(g => !g.eltern || !mo.gruppen.some(x => x.id === g.eltern)).map(g => famZeile(g, 0)).join("")}
        ${ohne.length ? `<li><div class="mb-famzeile" style="--tiefe:0"><span class="mb-auf"></span><span class="mb-zeile familie gedimmt">Ohne Familie</span></div><ul>${ohne.map(p => artZeile(p, 1)).join("")}</ul></li>` : ""}</ul></nav>`;
  }
  K.act.mKnoten = el => { K.st.knoten = el.dataset.k; K.st.regelOffen = null; K.st.tabOffen = null; K.st.graphFokus = null; K.render(); };
  K.act.mAuf = el => { K.st.baumOffen[el.dataset.g] = !(K.st.baumOffen[el.dataset.g] ?? true); K.render(); };
  K.inp.mbSuche = el => { K.st.baumSuche = el.value; K.render(); };

  /* ---------- Seite ---------- */
  K.route("studio-modell", () => {
    const mo = ent(); if (!mo) return St().keinEntwurf();
    if (!obj(mo, K.st.knoten)) K.st.knoten = mo.gruppen[0] ? "g:" + mo.gruppen[0].id : mo.produkte[0] ? "p:" + mo.produkte[0].id : "";
    const k = K.st.knoten, o = obj(mo, k), fam = istFam(k);
    K.st.kontext = k; if (!fam && o) K.st.produkt = o.id;
    const kopf = St().kopf("Produktmodell", "Familie oder konfigurierbaren Artikel wählen. Merkmale und Regeln einer Familie gelten für alle Artikel darunter; am Artikel werden nur Abweichungen gepflegt.");
    if (!o) return kopf + `<div class="modell-layout">${baum(mo)}<div class="leer">Noch keine Familien oder Artikel. Legen Sie links eine Familie an.</div></div>`;
    const tabs = [["merkmale", "Merkmale"], ["regeln", "Regeln"], ["matrix", "Matrix"], ["kombinationen", "Kombinationstabellen"], ["graph", "Regelgraph"], ["stamm", "Stammdaten"], ["preise", fam ? "Preise" : "Preise & Stückliste"], ["test", "Test"]];
    if (!tabs.some(t => t[0] === K.st.modellTab)) K.st.modellTab = "merkmale";
    const t = K.st.modellTab;
    let inhalt = "";
    const kx = St().kontext(mo);
    if (t === "merkmale") inhalt = merkmaleTab(mo, k, o, fam);
    else if (t === "regeln") inhalt = (ro() ? "" : `<div class="row" style="margin-bottom:10px"><button class="btn primary klein" type="button" data-act="rNeu">Neue Regel für ${esc(o.name)}</button></div>`) + St().regelListe(mo, kx);
    else if (t === "matrix") inhalt = St().matrixAnsicht(mo, kx);
    else if (t === "kombinationen") inhalt = (ro() ? "" : `<div class="row" style="margin-bottom:10px"><button class="btn primary klein" type="button" data-act="tNeu">Neue Kombinationstabelle für ${esc(o.name)}</button></div>`) + St().tabellenAnsicht(mo, kx);
    else if (t === "graph") inhalt = St().graph(mo, kx);
    else if (t === "stamm") inhalt = fam ? famStamm(mo, o) : artStamm(mo, o);
    else if (t === "preise") inhalt = fam ? famPreise(mo, o) : artPreise(mo, o);
    else inhalt = testTab(mo, k, o, fam);
    return kopf + `<div class="modell-layout">${baum(mo)}<section class="modell-inhalt">${objektKopf(mo, k, o, fam)}
      <div class="tabs-innen" role="tablist">${tabs.map(([id, n]) => `<button type="button" role="tab" data-act="mTab" data-t="${id}" aria-selected="${t === id}">${n}</button>`).join("")}</div>
      ${inhalt}</section></div>`;
  });
  K.act.mTab = el => { K.st.modellTab = el.dataset.t; K.render(); };

  function objektKopf(mo, k, o, fam) {
    const pfad = fam ? E.gruppenPfad(mo, o.id).slice(0, -1) : E.gruppenPfad(mo, o.gruppe);
    const eff = fam ? E.zuordnung(mo, o) : E.zuordnung(mo, o), eigen = eff.filter(e => e.herkunft === k || (o.merkmale || []).some(z => z.id === e.id)).length + E.zuordnung(mo, o, true).filter(e => e.aus).length;
    const regeln = mo.regeln.filter(r => fam ? E.familienArtikel(mo, o.id).some(p => E.imGeltungsbereich(mo, r, p)) : E.imGeltungsbereich(mo, r, o));
    const hier = regeln.filter(r => St().gleicherScope(r, St().kontext(mo).scope)).length;
    const a = !fam && K.Store.artikelZu(o.code);
    return `<div class="objektkopf">
      <div class="ok-pfad">${pfad.map(g => `<button type="button" class="link-krume" data-act="mKnoten" data-k="g:${g.id}">${esc(g.name)}</button>`).join(" › ")}${pfad.length ? " ›" : ""}</div>
      ${ro() || !fam ? "" : `<button type="button" class="btn klein ok-excel" data-act="piFuerGruppe" data-g="${o.id}">Preise aus Excel</button>`}${ro() ? "" : `<button type="button" class="btn klein gefahr-text ok-loeschen" data-act="${fam ? "fWeg" : "pLoeschen"}">${fam ? "Familie löschen" : "Artikel löschen"}</button>`}
      <div class="ok-titel"><span class="chip ${fam ? "fam" : "art"}">${fam ? "Familie" : "Konfigurierbarer Artikel"}</span><h3>${esc(o.name)}</h3>${fam ? "" : `<code class="${St().artKlasse(o.code).trim()}" title="${esc(St().artTitel(o.code))}">${esc(o.code || "ohne Artikelnummer")}</code>${a ? `<span class="gedimmt klein">ARTIKEL: ${esc(a.name)}</span>` : K.Store.artikelQuelle && o.code ? `<span class="warntext klein">nicht in ARTIKEL</span>` : ""}`}</div>
      <div class="ok-werte">
        <div><b>${eff.length}</b><span>Merkmale wirksam</span></div><div><b>${eigen}</b><span>${fam ? "hier zugeordnet oder angepasst" : "am Artikel angepasst"}</span></div>
        <div><b>${regeln.length}</b><span>Regeln wirksam</span></div><div><b>${hier}</b><span>hier angelegt</span></div>
        ${fam ? `<div><b>${E.familienArtikel(mo, o.id).length}</b><span>Artikel darunter</span></div>` : `<div><b>${K.eur(o.basispreis)}</b><span>Grundpreis</span></div>`}
      </div></div>`;
  }

  /* ---------- Merkmale mit Vererbung ---------- */
  function elternZuordnung(mo, k, o, fam) {
    // was ohne die Einträge dieses Objekts wirksam wäre
    if (fam) { const p = mo.gruppen.find(g => g.id === o.eltern); return p ? E.zuordnung(mo, p) : []; }
    const g = mo.gruppen.find(x => x.id === o.gruppe); return g ? E.zuordnung(mo, g) : [];
  }
  function merkmaleTab(mo, k, o, fam) {
    const alle = E.zuordnung(mo, o, true), eltern = new Map(elternZuordnung(mo, k, o, fam).map(e => [e.id, e])), eigen = new Map((o.merkmale || []).map(z => [z.id, z]));
    const wirksam = alle.filter(e => !e.aus), aus = alle.filter(e => e.aus);
    const karte = (e, i) => {
      const m = E.merkmal(mo, e.id); if (!m) return "";
      const geerbt = e.herkunft !== k, angepasst = geerbt && eigen.has(e.id), el = eltern.get(e.id);
      const erlaubt = e.werte || m.werte.map(w => w.id), oben = el ? (el.werte || m.werte.map(w => w.id)) : m.werte.map(w => w.id);
      const chips = m.werte.map(w => {
        const an = erlaubt.includes(w.id), gesperrtOben = geerbt && !oben.includes(w.id);
        return `<button type="button" class="wchip${an ? " an" : ""}${gesperrtOben ? " oben" : ""}" data-act="mWert" data-m="${m.id}" data-w="${w.id}" aria-pressed="${an}" ${gesperrtOben || ro() ? "disabled" : ""} title="${esc(gesperrtOben ? "In der übergeordneten Familie nicht erlaubt" : w.code ? "Code " + w.code : "")}">${esc(w.name)}${w.code ? ` <code>${esc(w.code)}</code>` : ""}</button>`;
      }).join("");
      const std = m.typ !== "mehrfach" && !m.pflicht ? `<label class="inline klein">Vorbelegung <select id="mstd-${m.id}" data-act="mStd" data-m="${m.id}" ${dis()}>
          <option value="">${geerbt && el?.standard ? "wie geerbt: " + esc(E.wert(mo, m.id, el.standard)?.name || el.standard) : "erster erlaubter Wert"}</option>
          ${m.werte.filter(w => erlaubt.includes(w.id)).map(w => `<option value="${w.id}" ${eigen.get(m.id)?.standard === w.id || (!geerbt && e.standard === w.id) ? "selected" : ""}>${esc(w.name)}</option>`).join("")}</select></label>` : m.pflicht ? `<span class="klein gedimmt">Pflichtangabe, keine Vorbelegung</span>` : "";
      return `<article class="mkarte${geerbt ? " geerbt" : " eigen"}${angepasst ? " angepasst" : ""}">
        <div class="mk-kopf"><span class="mk-griff">
          <button type="button" class="ikon" data-act="mHoch" data-m="${m.id}" ${i && !ro() ? "" : "disabled"} title="Nach oben">↑</button><button type="button" class="ikon" data-act="mRunter" data-m="${m.id}" ${i < wirksam.length - 1 && !ro() ? "" : "disabled"} title="Nach unten">↓</button></span>
          <b>${esc(m.name)}</b><span class="gedimmt klein">${esc(E.bereich(m))}${m.abschnitt ? " · " + esc(m.abschnitt) : ""} · ${m.typ === "mehrfach" ? "mehrfach" : "einfach"}</span>
          ${geerbt ? `<button type="button" class="chip herkunft" data-act="mKnoten" data-k="${e.herkunft}" title="Dort bearbeiten">geerbt von ${esc(quelleName(mo, e.herkunft))}</button>` : `<span class="chip eigen">${fam ? "an dieser Familie" : "nur dieser Artikel"}</span>`}
          ${angepasst ? `<span class="chip angepasst">hier angepasst</span>` : ""}
          <span class="mk-aktionen">${ro() ? "" : geerbt
            ? `${angepasst ? `<button class="btn klein" type="button" data-act="mReset" data-m="${m.id}">Anpassung zurücksetzen</button>` : ""}<button class="btn klein" type="button" data-act="mAus" data-m="${m.id}">Hier ausblenden</button>`
            : `${!fam || o.eltern ? `<button class="btn klein" type="button" data-act="mHoch1" data-m="${m.id}" title="An die übergeordnete Familie übergeben">↑ an ${esc(famName(mo, fam ? o.eltern : o.gruppe))}</button>` : ""}<button class="btn klein gefahr-text" type="button" data-act="mWeg" data-m="${m.id}" title="Nur hier entfernen; das Merkmal bleibt im Modell">Entfernen</button><button class="btn klein gefahr-text" type="button" data-act="mGanz" data-m="${m.id}" title="Merkmal mit allen Werten aus dem ganzen Modell löschen">Überall löschen</button>`}</span></div>
        <div class="mk-werte">${chips}</div>
        <div class="row klein gedimmt"><span>${erlaubt.length} von ${m.werte.length} Werten</span>${std}</div></article>`;
    };
    const frei = mo.merkmale.filter(m => !alle.some(e => e.id === m.id));
    const arts = fam ? E.familienArtikel(mo, o.id) : [];
    let gemeinsam = 0;
    if (fam && arts.length) { const eff = arts.map(p => E.zuordnung(mo, p).map(e => e.id)); gemeinsam = eff[0].filter(id => eff.every(l => l.includes(id)) && !(o.merkmale || []).some(z => z.id === id) && !E.zuordnung(mo, o).some(e => e.id === id && e.herkunft !== "g:" + o.id)).length; }
    return `<div class="mk-leiste">
      <span class="klein gedimmt">${fam ? `Merkmale dieser Familie gelten für alle ${arts.length} Artikel darunter. Werte abwählen schränkt für die ganze Familie ein.` : "Geerbte Merkmale: Werte abwählen schränkt nur diesen Artikel ein. Eigene Merkmale gelten nur hier."}</span>
      ${ro() ? "" : `<span class="row">${frei.length ? `<select id="m-neu-zu" data-act="mZu" aria-label="Merkmal zuordnen"><option value="">+ Merkmal zuordnen</option>${frei.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select>` : ""}
        <button class="btn klein" type="button" data-act="mNeuHier">+ Neues Merkmal</button>
        ${gemeinsam ? `<button class="btn klein gelb" type="button" data-act="mZusammen" title="Merkmale, die alle Artikel dieser Familie haben, an die Familie übergeben">${gemeinsam} gemeinsame Merkmale der Artikel übernehmen</button>` : ""}</span>`}</div>
      <div class="mkarten">${wirksam.map(karte).join("") || `<div class="leer">Noch keine Merkmale. Ordnen Sie oben ein Merkmal zu${fam ? "" : " oder pflegen Sie es an der Familie"}.</div>`}</div>
      ${aus.length ? `<h3 class="abschnitt" style="margin-top:18px">Hier ausgeblendet</h3><div class="mkarten">${aus.map(e => `<article class="mkarte aus"><div class="mk-kopf"><b>${esc(E.merkmal(mo, e.id)?.name || e.id)}</b><span class="chip herkunft">geerbt von ${esc(quelleName(mo, e.herkunft))}</span>${ro() ? "" : `<span class="mk-aktionen"><button class="btn klein" type="button" data-act="mEin" data-m="${e.id}">Wieder aufnehmen</button></span>`}</div></article>`).join("")}</div>` : ""}`;
  }
  const knoten = () => obj(ent(), K.st.knoten);
  const eintrag = (o, mid, anlegen) => { o.merkmale ||= []; let z = o.merkmale.find(x => x.id === mid); if (!z && anlegen) { z = { id: mid, werte: null }; o.merkmale.push(z); } return z; };
  function aufraeumen(o, mid) {
    // Eintrag entfernen, wenn er nichts mehr überschreibt und das Merkmal nicht hier definiert ist
    const mo = ent(), z = eintrag(o, mid); if (!z) return;
    const eltern = new Map(elternZuordnung(mo, K.st.knoten, o, istFam(K.st.knoten)).map(e => [e.id, e]));
    const el = eltern.get(mid); if (!el) return;
    const m = E.merkmal(mo, mid), alle = m.werte.map(w => w.id), ew = (el.werte || alle).join(","), zw = (z.werte || alle).join(",");
    if (!z.aus && ew === zw && !z.standard) o.merkmale = o.merkmale.filter(x => x !== z);
    else if (z.werte && zw === ew) z.werte = null;
  }
  K.act.mWert = el => {
    const mo = ent(), o = knoten(), m = E.merkmal(mo, el.dataset.m), w = el.dataset.w;
    const e = E.zuordnung(mo, o).find(x => x.id === m.id), aktuell = e.werte || m.werte.map(x => x.id);
    let neu = aktuell.includes(w) ? aktuell.filter(x => x !== w) : m.werte.map(x => x.id).filter(x => aktuell.includes(x) || x === w);
    if (!neu.length) return K.toast("Mindestens ein Wert muss erlaubt bleiben.");
    const z = eintrag(o, m.id, true); z.werte = neu.length === m.werte.length ? null : neu;
    if (z.standard && !neu.includes(z.standard)) delete z.standard;
    aufraeumen(o, m.id); geaendert(`${o.name}: erlaubte Werte für ${m.name} geändert`);
  };
  K.act.mStd = el => { const o = knoten(), z = eintrag(o, el.dataset.m, true); if (el.value) z.standard = el.value; else delete z.standard; aufraeumen(o, el.dataset.m); geaendert(`${o.name}: Vorbelegung für ${E.merkmal(ent(), el.dataset.m).name} geändert`); };
  K.act.mReset = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); geaendert(`${o.name}: Anpassung an ${E.merkmal(ent(), el.dataset.m).name} zurückgesetzt`); };
  K.act.mAus = el => { const o = knoten(), z = eintrag(o, el.dataset.m, true); z.aus = true; delete z.werte; delete z.standard; geaendert(`${o.name}: ${E.merkmal(ent(), el.dataset.m).name} ausgeblendet`); };
  K.act.mEin = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); geaendert(`${o.name}: ${E.merkmal(ent(), el.dataset.m).name} wieder aufgenommen`); };
  K.act.mWeg = el => {
    const mo = ent(), o = knoten(), n = istFam(K.st.knoten) ? E.familienArtikel(mo, o.id).length : 0;
    if (n && !el.dataset.ok) return K.sheet(`<h3>${esc(E.merkmal(mo, el.dataset.m).name)} aus ${esc(o.name)} entfernen?</h3><p>Das Merkmal verschwindet bei ${n} Artikeln dieser Familie aus dem Konfigurator. Anpassungen an den Artikeln bleiben gespeichert, wirken aber nicht mehr.</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="mWeg" data-m="${el.dataset.m}" data-ok="1">Entfernen</button></div>`);
    K.sheetZu(); mWegAusfuehren(el); };
  const mWegAusfuehren = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(x => x !== el.dataset.m); geaendert(`${E.merkmal(ent(), el.dataset.m).name} aus ${o.name} entfernt`); };
  K.act.mZu = el => { if (!el.value) return; const o = knoten(); (o.merkmale ||= []).push({ id: el.value, werte: null }); geaendert(`${E.merkmal(ent(), el.value).name} zu ${o.name} zugeordnet`); };
  K.act.mGanz = el => { K.st.merkmal = el.dataset.m; K.act.mLoeschen(); };
  K.act.mNeuHier = () => { K.st.mNeuZiel = K.st.knoten; K.act.mNeu(); };
  K.act.mHoch1 = el => {
    const mo = ent(), o = knoten(), mid = el.dataset.m, fam = istFam(K.st.knoten), ziel = mo.gruppen.find(g => g.id === (fam ? o.eltern : o.gruppe)); if (!ziel) return;
    const z = eintrag(o, mid); o.merkmale = o.merkmale.filter(x => x !== z);
    (ziel.merkmale ||= []).push({ id: mid, werte: z.werte || null, ...(z.standard ? { standard: z.standard } : {}) });
    geaendert(`${E.merkmal(mo, mid).name} an ${ziel.name} übergeben`);
  };
  function verschieben(mid, d) {
    const mo = ent(), o = knoten(), liste = E.zuordnung(mo, o).map(e => e.id), i = liste.indexOf(mid), j = i + d;
    if (i < 0 || j < 0 || j >= liste.length) return;
    [liste[i], liste[j]] = [liste[j], liste[i]]; o.reihenfolge = liste; geaendert(`${o.name}: Reihenfolge der Merkmale geändert`);
  }
  K.act.mHoch = el => verschieben(el.dataset.m, -1);
  K.act.mRunter = el => verschieben(el.dataset.m, 1);
  K.act.mZusammen = () => { const o = knoten(), n = E.hochziehen(ent(), o.id); geaendert(`${n} gemeinsame Merkmale an ${o.name} übergeben`); K.toast(`${n} Merkmale an ${o.name} übergeben; Abweichungen bleiben an den Artikeln.`); };

  /* ---------- Stammdaten ---------- */
  function famStamm(mo, g) {
    const ag = g.artikelgruppe ? [...K.Store.artikel.values()].filter(a => a.gruppe && a.gruppe.toUpperCase() === g.artikelgruppe.toUpperCase()) : [];
    const neu = ag.filter(a => !mo.produkte.some(p => (p.code || "").toUpperCase() === a.code.toUpperCase()));
    return `<section class="panel"><div class="formgitter">
      <div class="feld breit"><label for="f-name">Bezeichnung</label><input id="f-name" data-in="fFeld" data-k="name" value="${esc(g.name)}" ${dis()}></div>
      <div class="feld"><label>Familien-Code</label><div class="wert mono">${esc(g.id)}</div></div>
      <div class="feld"><label for="f-eltern">Übergeordnete Familie</label><select id="f-eltern" data-act="fEltern" ${dis()}><option value="">– oberste Ebene –</option>${mo.gruppen.filter(x => x.id !== g.id && !E.gruppenPfad(mo, x.id).some(y => y.id === g.id)).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
      <div class="feld"><label for="f-ag">Artikelgruppe in APplus</label><input id="f-ag" class="mono" data-in="fFeld" data-k="artikelgruppe" value="${esc(g.artikelgruppe || "")}" placeholder="z. B. FZ-TB" ${dis()}></div>
      <div class="feld breit"><label for="f-beschr">Beschreibung</label><textarea id="f-beschr" rows="2" data-in="fFeld" data-k="beschreibung" ${dis()}>${esc(g.beschreibung || "")}</textarea></div>
      <div class="feld"><label>Bild im Katalog</label>${St().bildFeld(g.bild, "fBild", "")}</div></div>
      <p class="klein gedimmt">Mit hinterlegter Artikelgruppe werden neue konfigurierbare Artikel dieser Gruppe automatisch dieser Familie zugeordnet.</p>
      ${g.artikelgruppe ? `<div class="hinweis">${ag.length} Artikel in der Artikelgruppe <code>${esc(g.artikelgruppe)}</code>, davon ${neu.length} noch nicht konfigurierbar.${neu.length && !ro() ? ` <button class="btn klein" type="button" data-act="fAgAlle">Alle ${neu.length} als konfigurierbare Artikel anlegen</button>` : ""}</div>` : ""}
      ${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="mFamNeu" data-eltern="${g.id}">+ Unterfamilie</button><button class="btn klein" type="button" data-act="mArtNeu">+ Artikel in dieser Familie</button><button class="btn klein gefahr-text" type="button" data-act="fWeg">Familie löschen</button></div>`}</section>`;
  }
  const fam = () => knoten();
  K.inp.fFeld = el => { fam()[el.dataset.k] = el.value; geaendert(`Familie ${fam().name} geändert`, false); };
  K.act.fEltern = el => { fam().eltern = el.value || null; geaendert(`Familie ${fam().name} verschoben`); };
  K.act.fBild = async el => { const id = await St().bildHochladen(el); if (id === undefined) return; fam().bild = id; geaendert(`Bild der Familie ${fam().name} geändert`); };
  K.act.fWeg = () => {
    const mo = ent(), g = fam(), unter = mo.gruppen.filter(x => x.id !== g.id && E.gruppenPfad(mo, x.id).some(y => y.id === g.id)), arts = E.familienArtikel(mo, g.id);
    const regelnNur = mo.regeln.filter(r => (r.gruppen || []).includes(g.id)).length, eltern = mo.gruppen.find(x => x.id === g.eltern);
    const leer = !unter.length && !arts.length;
    K.sheet(`<h3>Familie „${esc(g.name)}“ löschen?</h3>
      ${leer ? `<p>Die Familie ist leer. ${(g.merkmale || []).length} Merkmalzuordnungen und ${regelnNur} Regeln für diese Familie werden mit gelöscht.</p>`
        : `<p>Sie enthält ${unter.length} Unterfamilien und ${arts.length} Artikel. Wie soll damit verfahren werden?</p>
        <div class="loesch-wahl">
          <button type="button" class="loesch-opt" data-act="fWegOk" data-art="hoch"><b>Inhalt nach ${esc(eltern ? eltern.name : "oben")} verschieben</b><span>Unterfamilien und Artikel bleiben erhalten. Merkmale und Regeln dieser Familie werden an sie weitergegeben, im Konfigurator ändert sich nichts.</span></button>
          <button type="button" class="loesch-opt gefahr" data-act="fWegOk" data-art="alles"><b>Familie mit allem darunter löschen</b><span>${unter.length} Unterfamilien und ${arts.length} konfigurierbare Artikel werden aus dem Modell entfernt (nicht aus APplus), dazu Regeln, die nur für sie gelten.</span></button>
        </div>`}
      <p class="klein gedimmt">Alles passiert im Entwurf. Bis zur Freigabe lässt es sich unter Freigabe → „Entwurf verwerfen“ rückgängig machen.</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button>${leer ? `<button class="btn gefahr" type="button" data-act="fWegOk" data-art="leer">Löschen</button>` : ""}</div>`);
  };
  K.act.fWegOk = el => {
    const mo = ent(), g = fam(), art = el.dataset.art;
    if (art === "hoch") {
      // Merkmale und Regeln an die direkten Kinder weitergeben, damit sich nichts ändert
      const kinderF = mo.gruppen.filter(x => x.eltern === g.id), kinderP = mo.produkte.filter(p => p.gruppe === g.id);
      for (const k of [...kinderF, ...kinderP]) {
        const eigen = k.merkmale || [], vorne = (g.merkmale || []).filter(z => !eigen.some(e => e.id === z.id)).map(z => ({ ...z }));
        k.merkmale = [...vorne, ...eigen];
        if (g.reihenfolge && !k.reihenfolge) k.reihenfolge = g.reihenfolge.slice();
      }
      for (const r of mo.regeln) if ((r.gruppen || []).includes(g.id)) { r.gruppen = [...r.gruppen.filter(x => x !== g.id), ...kinderF.map(x => x.id)]; r.produkte = [...new Set([...(r.produkte || []), ...kinderP.map(p => p.id)])]; }
      kinderF.forEach(x => x.eltern = g.eltern || null); kinderP.forEach(p => p.gruppe = g.eltern || null);
      mo.gruppen = mo.gruppen.filter(x => x !== g); E.ausGeltungEntfernen(mo, [g.id], []);
      K.sheetZu(); K.st.knoten = g.eltern ? "g:" + g.eltern : ""; geaendert(`Familie ${g.name} gelöscht, Inhalt nach ${g.eltern ? famName(mo, g.eltern) : "oben"} verschoben`);
    } else {
      const fams = mo.gruppen.filter(x => x.id === g.id || E.gruppenPfad(mo, x.id).some(y => y.id === g.id)).map(x => x.id), arts = E.familienArtikel(mo, g.id).map(p => p.id);
      mo.gruppen = mo.gruppen.filter(x => !fams.includes(x.id)); mo.produkte = mo.produkte.filter(p => !arts.includes(p.id));
      const n = E.ausGeltungEntfernen(mo, fams, arts);
      K.sheetZu(); K.st.knoten = g.eltern ? "g:" + g.eltern : ""; geaendert(`Familie ${g.name} gelöscht (${fams.length - 1} Unterfamilien, ${arts.length} Artikel, ${n} Regeln)`);
    }
  };
  K.act.fAgAlle = () => {
    const mo = ent(), g = fam(), ag = g.artikelgruppe.toUpperCase();
    const neu = [...K.Store.artikel.values()].filter(a => a.gruppe && a.gruppe.toUpperCase() === ag && !mo.produkte.some(p => (p.code || "").toUpperCase() === a.code.toUpperCase()));
    for (const a of neu) mo.produkte.push(neuerArtikel(mo, a.code, a.name, g.id, a));
    geaendert(`${neu.length} Artikel aus Artikelgruppe ${g.artikelgruppe} in ${g.name} angelegt`); K.toast(`${neu.length} Artikel angelegt; sie erben alle Merkmale und Regeln von ${g.name}.`);
  };

  function artStamm(mo, p) {
    return `<section class="panel"><div class="formgitter">
      <div class="feld"><label for="p-code">Artikelnummer (ARTIKEL)</label><input id="p-code" class="mono${St().artKlasse(p.code)}" data-in="pFeld" data-k="code" data-art="produkt" data-chg="artPruef" autocomplete="off" title="${esc(St().artTitel(p.code))}" value="${esc(p.code || "")}" ${dis()}></div>
      <div class="feld breit"><label for="p-name">Bezeichnung</label><input id="p-name" data-in="pFeld" data-k="name" value="${esc(p.name)}" ${dis()}></div>
      <div class="feld"><label for="p-gruppe">Familie</label><select id="p-gruppe" data-act="pGruppe" ${dis()}>${St().gruppenOptionen(mo, p.gruppe)}<option value="__neu">+ Neue Familie …</option></select></div>
      <div class="feld breit"><label for="p-beschr">Beschreibung für Katalog und Verkaufsraum</label><textarea id="p-beschr" rows="2" data-in="pFeld" data-k="beschreibung" ${dis()}>${esc(p.beschreibung || "")}</textarea></div>
      <div class="feld"><label>Katalogbild</label>${St().bildFeld(p.bild, "pBild", "")}</div>
      <div class="feld"><label class="haken"><input id="p-aktiv" type="checkbox" data-act="pAktiv" ${p.aktiv !== false ? "checked" : ""} ${dis()}> Im Katalog sichtbar</label></div></div>
      <div class="row"><button class="btn klein" type="button" data-act="mDetails" data-p="${p.id}">3D-Modell und weitere Details</button>${ro() ? "" : `<button class="btn klein" type="button" data-act="pKopie">Duplizieren</button><button class="btn klein gefahr-text" type="button" data-act="pLoeschen">Artikel aus dem Modell löschen</button>`}</div></section>`;
  }
  K.act.mDetails = el => { K.st.produkt = el.dataset.p; K.gehe("studio-produkte"); };

  /** Preise einer Produktgruppe: Codes aller Fahrzeuge darunter mit Gruppenpreis */
  function famPreise(mo, g) {
    const ig = K.preisImport.inGruppe(mo, g.id), zeilen = [...ig.werte.values()].sort((a, b) => mo.merkmale.indexOf(a.m) - mo.merkmale.indexOf(b.m) || a.m.werte.indexOf(a.w) - b.m.werte.indexOf(b.w));
    const eigen = g.preise || {}, eltern = w => E.gruppenPreis(E.gruppenPfad(mo, g.id).slice(0, -1), w);
    let letztes = null;
    return `<section class="panel"><div class="panelkopf"><h3>Preise in ${esc(g.name)}</h3>${ro() ? "" : `<button class="btn klein primary" type="button" data-act="piFuerGruppe" data-g="${g.id}">Preise aus Excel übernehmen</button>`}</div>
      <p class="klein gedimmt">Ein Preis, der hier eingetragen ist, gilt für alle Fahrzeuge dieser Gruppe. Leer = Preis am Code (${ig.werte.size} Codes).</p>
      ${zeilen.length ? `<div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Merkmal</th><th>Code</th><th>Bezeichnung</th><th class="r">Preis am Code</th><th class="r">Preis in ${esc(g.name)}</th><th></th></tr></thead><tbody>
      ${zeilen.map(({ m, w }) => { const C = String(w.code).toUpperCase(), el = eltern(w), kopfM = letztes !== m; letztes = m;
        return `<tr><td class="gedimmt">${kopfM ? esc(m.name) : ""}</td><td class="mono">${esc(w.code)}</td><td>${esc(w.name)}</td><td class="r num gedimmt">${K.eur(el ? el.preis : w.preis)}${el ? ` <span class="klein" title="aus ${esc(el.von.name)}">↑</span>` : ""}</td>
          <td class="r"><input id="gp-${esc(C)}" class="flach zahl${eigen[C] != null ? " gesetzt" : ""}" type="number" step="10" data-chg="gpPreis" data-c="${esc(C)}" value="${eigen[C] ?? ""}" placeholder="${el ? el.preis : w.preis || 0}" aria-label="Preis in ${esc(g.name)}" ${dis()}></td>
          <td>${eigen[C] != null && !ro() ? `<button type="button" class="ikon" data-act="gpWeg" data-c="${esc(C)}" title="Gruppenpreis entfernen">✕</button>` : ""}</td></tr>`; }).join("")}</tbody></table></div>` : `<div class="leer">Den Fahrzeugen dieser Gruppe sind noch keine Codes zugeordnet.</div>`}</section>`;
  }
  K.inp.gpPreis = el => { const g = knoten(), C = el.dataset.c; g.preise ||= {}; if (el.value === "") delete g.preise[C]; else g.preise[C] = +el.value; geaendert(`Preis ${C} in ${g.name}`); };
  K.act.gpWeg = el => { const g = knoten(); delete g.preise[el.dataset.c]; geaendert(`Gruppenpreis ${el.dataset.c} in ${g.name} entfernt`); };
  function artPreise(mo, p) {
    const a = K.Store.artikelZu(p.code), pm = E.produktMerkmale(mo, p);
    return `<section class="panel"><div class="formgitter">
      <div class="feld"><label for="p-preis">Grundpreis netto</label><input id="p-preis" type="number" step="100" data-in="pZahl" data-k="basispreis" value="${p.basispreis}" ${dis()}></div>
      <div class="feld"><label for="p-kosten">Herstellkosten</label><input id="p-kosten" type="number" step="100" data-in="pZahl" data-k="basiskosten" value="${p.basiskosten}" ${dis()}></div>
      ${a ? `<div class="feld"><label>Im Artikelstamm</label><div class="wert">${a.preis != null ? K.eur(a.preis) : "kein Preis in der Abfrage"}${a.kosten ? ` · Kosten ${K.eur(a.kosten)}` : ""}${(a.preis && a.preis !== p.basispreis) && !ro() ? ` <button class="btn klein" type="button" data-act="mPreisAusArtikel">übernehmen</button>` : ""}</div></div>` : ""}</div></section>
      ${(p.grundausstattung || []).length ? `<section class="panel"><div class="panelkopf"><h3>Grundausstattung (inklusive)</h3><span class="klein gedimmt">${p.grundausstattung.length} Positionen · aus dem Excel-Import, im Grundpreis enthalten</span></div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Gruppe</th><th>Code</th><th>Bezeichnung</th><th class="r">Wert</th>${ro() ? "" : "<th></th>"}</tr></thead><tbody>
        ${p.grundausstattung.map((x, i) => `<tr><td class="gedimmt">${esc(x.gruppe || "")}</td><td class="mono">${esc(x.code)}</td><td>${esc(x.name)}</td><td class="r num">${x.preis ? K.eur(x.preis) : "inkl."}</td>${ro() ? "" : `<td><button type="button" class="ikon gefahr" data-act="mGaWeg" data-i="${i}" title="Entfernen">✕</button></td>`}</tr>`).join("")}
        <tr class="summe"><td colspan="3">Summe der Grundausstattung</td><td class="r num">${K.eur(p.grundausstattung.reduce((n, x) => n + (x.preis || 0), 0))}</td>${ro() ? "" : "<td></td>"}</tr></tbody></table></div></section>` : ""}
      <section class="panel"><div class="panelkopf"><h3>Aufpreise der wirksamen Merkmalswerte</h3><span class="klein gedimmt">Preise werden je Wert am Merkmal gepflegt</span></div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Merkmal</th><th>Code</th><th>Wert</th><th class="r">Preis</th><th class="r">Kosten</th></tr></thead><tbody>
        ${pm.flatMap(x => x.werte.map((w, i) => `<tr><td class="gedimmt">${i ? "" : esc(x.m.name)}</td><td class="mono">${esc(w.code || "")}</td><td>${esc(w.name)}</td><td class="r num">${K.eur(E.wertPreis(mo, p, w))}${E.wertPreis(mo, p, w) !== (w.preis || 0) ? ` <span class="gedimmt klein" title="Preis der Produktgruppe, am Wert ${K.eur(w.preis)}">Gruppe</span>` : ""}${x.m.multiplikator ? " ×" : ""}</td><td class="r num gedimmt">${K.eur(w.kosten)}</td></tr>`)).join("")}</tbody></table></div></section>
      <section class="panel"><div class="panelkopf"><h3>Grundstückliste</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="pStlNeu">+ Zeile</button>`}</div>${St().stlTabelle(p.stl, "pStl")}
        <p class="klein gedimmt">Die Stückliste der Merkmalswerte kommt bei der Konfiguration automatisch dazu.</p></section>`;
  }
  K.act.mGaWeg = el => { const p = knoten(), x = p.grundausstattung.splice(+el.dataset.i, 1)[0]; geaendert(`${x.code} aus der Grundausstattung von ${p.name} entfernt`); };
  K.act.mPreisAusArtikel = () => { const p = knoten(), a = K.Store.artikelZu(p.code); p.basispreis = a.preis; if (a.kosten) p.basiskosten = a.kosten; geaendert(`Grundpreis von ${p.name} aus ARTIKEL übernommen`); };

  /* ---------- Test ---------- */
  function testTab(mo, k, o, fam) {
    const arts = fam ? E.familienArtikel(mo, o.id) : [o];
    const zeilen = arts.slice(0, 40).map(p => ({ p, t: E.modelltest(mo, p, 60000) }));
    return `<section class="panel"><div class="tabwrap ohne-rand"><table><thead><tr><th>Artikel</th><th class="r">Kombinationen</th><th class="r">gültig</th><th>Befund</th><th></th></tr></thead><tbody>
      ${zeilen.map(({ p, t }) => `<tr><td><code>${esc(p.code || p.id)}</code> ${esc(p.name)}</td><td class="r num">${K.zahl(t.total)}${t.abgebrochen ? "+" : ""}</td><td class="r num">${K.zahl(t.gueltig)}</td>
        <td>${t.widersprueche ? `<span class="chip warn">${K.zahl(t.widersprueche)} Widersprüche</span> ` : ""}${t.tote.length ? `<span class="chip warn" title="${esc(t.tote.map(x => x.merkmal + ": " + x.wert).join(", "))}">${t.tote.length} nie wählbar</span> ` : ""}${t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).length ? `<span class="chip" title="${esc(t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).map(r => r.id).join(", "))}">${t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).length} Regeln greifen nie</span>` : ""}${!t.widersprueche && !t.tote.length ? `<span class="chip st-angenommen">ok</span>` : ""}</td>
        <td class="r"><button class="btn klein" type="button" data-act="stTesten" data-p="${p.id}">Im Konfigurator testen</button></td></tr>`).join("") || `<tr><td colspan="5" class="gedimmt">Keine Artikel.</td></tr>`}</tbody></table></div>
      ${zeilen.flatMap(z => z.t.tote.map(x => ({ p: z.p, ...x }))).slice(0, 12).map(x => `<div class="hinweis warn klein">${esc(x.p.name)}: <b>${esc(x.merkmal)} „${esc(x.wert)}“</b> ist durch Regeln nie wählbar.</div>`).join("")}</section>`;
  }

  /* ---------- Anlegen: Familie, Artikel ---------- */
  K.act.mFamNeu = el => {
    const mo = ent(), aktuell = istFam(K.st.knoten) ? K.st.knoten.slice(2) : (knoten()?.gruppe || "");
    const eltern = el.dataset.eltern ?? aktuell;
    K.sheet(`<h3>Neue Familie</h3>
      <div class="feld"><label for="nf-name">Bezeichnung</label><input id="nf-name" placeholder="z. B. Tiefbett-Sattelauflieger"></div>
      <div class="feld"><label for="nf-eltern">Übergeordnete Familie</label><select id="nf-eltern"><option value="">– oberste Ebene –</option>${mo.gruppen.map(g => `<option value="${g.id}" ${g.id === eltern ? "selected" : ""}>${"  ".repeat(E.gruppenPfad(mo, g.id).length - 1)}${esc(g.name)}</option>`).join("")}</select></div>
      <div class="feld"><label for="nf-ag">Artikelgruppe in APplus (optional)</label><input id="nf-ag" class="mono"></div>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mFamNeuOk">Anlegen</button></div>`);
  };
  K.act.mFamNeuOk = () => {
    const mo = ent(), n = K.el("nf-name").value.trim(); if (!n) return K.el("nf-name").focus();
    let id = E.slug(n); while (mo.gruppen.some(g => g.id === id)) id += "-2";
    mo.gruppen.push({ id, name: n, eltern: K.el("nf-eltern").value || null, artikelgruppe: K.el("nf-ag").value.trim() || undefined, merkmale: [] });
    K.sheetZu(); K.st.knoten = "g:" + id; K.st.modellTab = "merkmale"; geaendert(`Familie ${n} angelegt`);
  };
  function neuerArtikel(mo, code, name, gruppe, a) {
    let id = String(code).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "P"; while (mo.produkte.some(p => p.id === id)) id += "_";
    const t = (name + " " + famName(mo, gruppe)).toLowerCase();
    return { id, code, name: name || code, gruppe, artnr: code, basispreis: a?.preis || 0, basiskosten: a?.kosten || 0, aktiv: true, beschreibung: "",
      visual: { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst/.test(t) ? "nachlaeufer" : "semi", asset: null }, stl: [], merkmale: [] };
  }
  const familieFuerArtikel = (mo, a) => a?.gruppe ? mo.gruppen.find(g => (g.artikelgruppe || "").toUpperCase() === a.gruppe.toUpperCase() || g.id.toUpperCase() === a.gruppe.toUpperCase() || g.name.toUpperCase() === a.gruppe.toUpperCase())?.id : null;
  K.mNeu = { code: "", name: "", gruppe: "" };
  K.act.mArtNeu = () => {
    const mo = ent(), aktuell = istFam(K.st.knoten) ? K.st.knoten.slice(2) : (knoten()?.gruppe || mo.gruppen[0]?.id || "");
    K.mNeu = { code: "", name: "", gruppe: aktuell };
    K.sheet(`<h3>Konfigurierbaren Artikel hinzufügen</h3>
      <p class="klein gedimmt">Artikel aus dem Artikelstamm wählen. Er erbt alle Merkmale und Regeln seiner Familie und ist sofort konfigurierbar.</p>
      ${K.Store.artikelQuelle ? `<input id="na-q" type="search" data-in="mArtSuche" placeholder="Artikelnummer oder Bezeichnung suchen" autocomplete="off"><div id="na-liste" class="artliste kurz"></div>` : ""}
      <div class="formgitter">
        <div class="feld"><label for="na-code">Artikelnummer</label><input id="na-code" class="mono" data-in="mArtFeld" data-k="code"></div>
        <div class="feld breit"><label for="na-name">Bezeichnung</label><input id="na-name" data-in="mArtFeld" data-k="name"></div>
        <div class="feld"><label for="na-fam">Familie</label><select id="na-fam" data-chg="mArtFam">${St().gruppenOptionen(mo, aktuell)}</select></div></div>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mArtNeuOk">Hinzufügen</button></div>`, true);
    if (K.Store.artikelQuelle) K.inp.mArtSuche(K.el("na-q"));
  };
  K.inp.mArtSuche = el => {
    const mo = ent(), vorhanden = new Set(mo.produkte.map(p => (p.code || "").toUpperCase()));
    const l = el.value.trim() ? K.Store.artikelSuche(el.value, 30) : [...K.Store.artikel.values()].filter(a => /FAHRZ|FZ|KMAT/i.test(a.gruppe || "")).slice(0, 30);
    K.el("na-liste").innerHTML = l.map(a => { const da = vorhanden.has(a.code.toUpperCase()); return `<button type="button" class="artliste-z" data-act="mArtWahl" data-c="${esc(a.code)}" ${da ? "disabled" : ""}><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num">${a.preis ? K.eur(a.preis) : ""}</span>${da ? `<span class="chip">schon im Modell</span>` : a.gruppe ? `<span class="chip">${esc(a.gruppe)}</span>` : ""}</button>`; }).join("") || `<p class="leer-klein">Keine Treffer.</p>`;
  };
  K.act.mArtWahl = el => {
    const mo = ent(), a = K.Store.artikelZu(el.dataset.c); if (!a) return;
    K.el("na-code").value = a.code; K.el("na-name").value = a.name; K.mNeu.code = a.code; K.mNeu.name = a.name;
    const f = familieFuerArtikel(mo, a); if (f) K.el("na-fam").value = f;
    K.el("na-liste").querySelectorAll(".artliste-z").forEach(b => b.classList.toggle("gewaehlt", b === el));
  };
  K.inp.mArtFeld = el => { K.mNeu[el.dataset.k] = el.value; };
  K.inp.mArtFam = () => {};
  K.act.mArtNeuOk = () => {
    const mo = ent(), code = K.el("na-code").value.trim(), name = K.el("na-name").value.trim(), gruppe = K.el("na-fam").value;
    if (!code) { K.toast("Bitte eine Artikelnummer angeben."); return K.el("na-code").focus(); }
    if (mo.produkte.some(p => (p.code || "").toUpperCase() === code.toUpperCase())) return K.toast(`${code} ist bereits im Modell.`);
    const a = K.Store.artikelZu(code);
    if (K.Store.artikelQuelle && !a && !K.mNeu.bestaetigt) { K.mNeu.bestaetigt = true; return K.toast(`${code} ist nicht im Artikelstamm. Zum Anlegen trotzdem erneut auf „Hinzufügen“ klicken.`); }
    const p = neuerArtikel(mo, code, name || a?.name || code, gruppe, a); mo.produkte.push(p);
    K.sheetZu(); K.st.knoten = "p:" + p.id; K.st.modellTab = "merkmale"; geaendert(`Konfigurierbarer Artikel ${code} in ${famName(mo, gruppe)} angelegt`);
  };
})();
