/* =========================================================================
   Studio: Pflege des Konfigurationsmodells
   Alle Änderungen gehen in den ENTWURF. Der Vertrieb arbeitet mit der zuletzt
   veröffentlichten Version, bis unter "Freigabe" eine neue Version erzeugt wird.
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const ent = () => S().entwurf;
  K.st = { produkt: null, merkmal: null, regelTab: "liste", regelOffen: null, regelFilter: { produkt: "", merkmal: "", suche: "" }, matrix: { a: "achsen", b: "lenkung", produkt: "" }, test: { produkt: null, res: null }, offenWert: null };
  const ro = () => !K.Store.schreiben;
  const dis = () => ro() ? "disabled" : "";
  const geaendert = (text, zeichnen = true) => { K.Store.entwurfGeaendert(text); if (zeichnen) K.render(); };
  const kopf = (titel, text, aktionen = "") => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Entwurf${ent()?.version ? ` auf Basis v${ent().version}` : ""}</div><h2>${titel}</h2>${text ? `<p>${text}</p>` : ""}</div>${aktionen ? `<div class="row">${aktionen}</div>` : ""}</div>`;
  const chipWahl = (werte, aktiv, act, daten) => `<div class="chipwahl">${werte.map(w => `<button type="button" class="chipbtn" data-act="${act}" ${daten} data-w="${esc(w.id)}" aria-pressed="${aktiv.includes(w.id)}" ${dis()}>${esc(w.name)}</button>`).join("")}</div>`;
  const merkmalOptionen = (aktiv, leerText) => `${leerText ? `<option value="">${leerText}</option>` : ""}${ent().merkmale.map(m => `<option value="${m.id}" ${m.id === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("")}`;
  const verwendung = mid => ({ produkte: ent().produkte.filter(p => E.hatMerkmal(ent(), p, mid)), regeln: ent().regeln.filter(r => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).includes(mid) : ((r.wenn || []).some(c => c.merkmal === mid) || r.dann?.merkmal === mid)) });
  const keinEntwurf = () => `<div class="leer"><b>Es gibt noch kein Konfigurationsmodell.</b><br>${K.Store.modus === "db" && K.Store.schreiben ? `Laden Sie das Startmodell mit Beispielfahrzeugen und passen Sie es an.<br><br><button class="btn primary" type="button" data-act="startmodell">Startmodell laden</button>` : ""}</div>`;
  K.act.startmodell = async el => { el.disabled = true; el.textContent = "Wird geladen …"; await K.Store.startmodellLaden(); K.toast("Startmodell geladen"); };

  /* =====================================================================
     Produkte
     ===================================================================== */
  K.route("studio-produkte", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const st = K.st; if (!E.produkt(mo, st.produkt)) st.produkt = mo.produkte[0]?.id || null;
    const p = E.produkt(mo, st.produkt);
    const liste = mo.gruppen.map(g => `<div class="listgruppe">${esc(g.name)}</div>${mo.produkte.filter(x => x.gruppe === g.id).map(x => `<button type="button" class="listeintrag" data-act="stProdukt" data-p="${x.id}" aria-current="${x.id === st.produkt}"><span>${esc(x.name)}</span><span class="gedimmt klein">${E.zuordnung(mo, x).length} Merkmale${x.aktiv === false ? " · inaktiv" : ""}</span></button>`).join("")}`).join("");
    let ed = `<div class="leer">Noch keine Produkte.</div>`;
    if (p) {
      const pm = E.produktMerkmale(mo, p);
      const zugeordnet = p.merkmale.map((z, i) => {
        const m = E.merkmal(mo, z.id); if (!m) return "";
        const erlaubt = z.werte && z.werte.length ? z.werte : m.werte.map(w => w.id);
        return `<li class="zuordnung"><div class="row zwischen"><b>${esc(m.name)}</b><span class="row">
          <button type="button" class="ikon" data-act="pmHoch" data-i="${i}" ${i ? "" : "disabled"} ${dis()} title="Nach oben">↑</button>
          <button type="button" class="ikon gefahr" data-act="pmWeg" data-i="${i}" ${dis()} title="Merkmal entfernen">✕</button></span></div>
          ${chipWahl(m.werte, erlaubt, "pmWert", `data-i="${i}"`)}
          <div class="row klein gedimmt">${erlaubt.length === m.werte.length ? "Alle Werte erlaubt" : `${erlaubt.length} von ${m.werte.length} Werten erlaubt`}.
            ${m.typ !== "mehrfach" ? (m.pflicht ? "Pflichtangabe ohne Vorbelegung." : `<label class="inline">Standard <select id="pm-std-${i}" data-act="pmStandard" data-i="${i}" ${dis()}><option value="">erster erlaubter Wert</option>${m.werte.filter(w => erlaubt.includes(w.id)).map(w => `<option value="${w.id}" ${z.standard === w.id ? "selected" : ""}>${esc(w.name)}</option>`).join("")}</select></label>`) : ""}</div></li>`;
      }).join("");
      const frei = mo.merkmale.filter(m => !p.merkmale.some(z => z.id === m.id));
      ed = `<div class="panel"><div class="formgitter">
        <div class="feld breit"><label for="p-name">Bezeichnung</label><input id="p-name" data-in="pFeld" data-k="name" value="${esc(p.name)}" ${dis()}></div>
        <div class="feld"><label for="p-code">Produkt-Code (Vertrieb)</label><input id="p-code" class="mono${artKlasse(p.code)}" data-in="pFeld" data-k="code" data-art="produkt" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(p.code))}" value="${esc(p.code || "")}" ${dis()}></div>
        <div class="feld"><label for="p-artnr">Artikelnummer</label><input id="p-artnr" class="mono" data-in="pFeld" data-k="artnr" value="${esc(p.artnr)}" ${dis()}></div>
        <div class="feld"><label for="p-gruppe">Produktgruppe</label><select id="p-gruppe" data-act="pGruppe" ${dis()}>${gruppenOptionen(mo, p.gruppe)}<option value="__neu">+ Neue Gruppe …</option></select></div>
        <div class="feld"><label for="p-preis">Grundpreis netto</label><input id="p-preis" type="number" step="100" data-in="pZahl" data-k="basispreis" value="${p.basispreis}" ${dis()}></div>
        <div class="feld"><label for="p-kosten">Herstellkosten</label><input id="p-kosten" type="number" step="100" data-in="pZahl" data-k="basiskosten" value="${p.basiskosten}" ${dis()}></div>
        <div class="feld breit"><label for="p-beschr">Beschreibung für Katalog und Verkaufsraum</label><textarea id="p-beschr" rows="2" data-in="pFeld" data-k="beschreibung" ${dis()}>${esc(p.beschreibung)}</textarea></div>
        <div class="feld"><label>Katalogbild</label>${bildFeld(p.bild, "pBild", "")}</div>
        <div class="feld"><label for="p-aktiv"><input id="p-aktiv" type="checkbox" data-act="pAktiv" ${p.aktiv !== false ? "checked" : ""} ${dis()}> Im Katalog sichtbar</label></div>
      </div></div>
      <section class="panel"><div class="panelkopf"><h3>Merkmale</h3><button class="btn klein primary" type="button" data-act="zuModell" data-k="p:${p.id}">Im Produktmodell bearbeiten</button></div>
        <p class="klein gedimmt">Merkmale werden von der Familie geerbt und im Produktmodell gepflegt. Wirksam für ${esc(p.name)}:</p>
        <div class="chipwahl">${pm.map(x => `<span class="chip">${esc(x.m.name)} · ${x.werte.length}</span>`).join("") || `<span class="gedimmt">keine</span>`}</div></section>
      <section class="panel"><div class="panelkopf"><h3>3D-Darstellung</h3></div>
        <div class="formgitter">
          <div class="feld"><label for="p-vis">Ersatzmodell (ohne CAD)</label><select id="p-vis" data-act="pVisual" ${dis()}>${[["semi", "Semitieflader"], ["tiefbett", "Tiefbett"], ["plattform", "Plattform"], ["nachlaeufer", "Nachläufer"]].map(([k, v]) => `<option value="${k}" ${p.visual?.typ === k ? "selected" : ""}>${v}</option>`).join("")}</select></div>
          <div class="feld breit"><label>CAD-Modell (GLB)</label>
            ${p.visual?.asset ? `<div class="row"><span class="chip st-angenommen">GLB hinterlegt</span><button class="btn klein" type="button" data-act="glbKnoten" data-a="${p.visual.asset}">Bauteilnamen anzeigen</button>${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="glbEntfernen">Entfernen</button>`}</div>`
              : K.assets ? `<input id="p-glb" type="file" accept=".glb,model/gltf-binary" data-act="glbHochladen" ${dis()}>` : `<span class="klein gedimmt">Hochladen ist nur für Bearbeiter der Seite möglich.</span>`}
            <p class="klein gedimmt">STEP-Dateien vorher in GLB umwandeln (z. B. mit FreeCAD oder CAD Exchanger). Jedes Bauteil, das ein Merkmalswert ein- oder ausblendet, braucht einen eindeutigen Namen. Diesen Namen tragen Sie beim Merkmalswert im Feld „3D-Teil“ ein. Materialien mit „lack“ im Namen erhalten die gewählte Farbe.</p>
            <div id="glb-knoten"></div></div>
        </div>
        <div data-viewer class="viewerplatz klein-hoch"></div></section>
      <section class="panel"><div class="panelkopf"><h3>Grundstückliste</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="pStlNeu">+ Zeile</button>`}</div>
        ${stlTabelle(p.stl, "pStl")}</section>
      <div class="row"><button class="btn" type="button" data-act="stTesten" data-p="${p.id}">Im Konfigurator testen</button><button class="btn" type="button" data-act="regelnFuer" data-k="p:${p.id}">Regeln für ${esc(p.name)} (${mo.regeln.filter(r => E.imGeltungsbereich(mo, r, p)).length})</button>${ro() ? "" : `<button class="btn" type="button" data-act="pKopie">Duplizieren</button><button class="btn gefahr-text" type="button" data-act="pLoeschen">Produkt löschen</button>`}</div>`;
      K.nach(v => { const pl = v.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, p, E.standardSel(mo, p)); });
    }
    return kopf("Produkte", "Grundfahrzeuge mit Grundpreis, Merkmalen und erlaubten Werten.", ro() ? "" : `<button class="btn" type="button" data-act="katalogPflege">Katalogstruktur</button><button class="btn primary" type="button" data-act="pNeu">Neues Produkt</button>`) +
      `<div class="studio-layout"><nav class="liste-links">${liste}</nav><div class="editor">${ed}</div></div>`;
  });
  function stlTabelle(stl, act, extra = "") {
    const ex = extra.replace(/\W/g, "");
    if (!stl || !stl.length) return `<p class="leer-klein">Keine Stücklistenpositionen.</p>`;
    return `<div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Artikel</th><th>Bezeichnung</th><th class="r">Menge</th><th>ME</th><th></th></tr></thead><tbody>
      ${stl.map((z, i) => `<tr><td><input id="${act}-${ex}${i}-0" class="flach mono${artKlasse(z[0])}" data-in="${act}" data-i="${i}" data-c="0" ${extra} data-art="stl" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(z[0]))}" value="${esc(z[0])}" aria-label="Artikelnummer" ${dis()}></td>
        <td><input id="${act}-${ex}${i}-1" class="flach" data-in="${act}" data-i="${i}" data-c="1" ${extra} value="${esc(z[1])}" aria-label="Bezeichnung" ${dis()}></td>
        <td class="r"><input id="${act}-${ex}${i}-2" class="flach zahl kurz" type="number" step="0.1" data-in="${act}" data-i="${i}" data-c="2" ${extra} value="${z[2]}" aria-label="Menge" ${dis()}></td>
        <td><input id="${act}-${ex}${i}-3" class="flach kurz" data-in="${act}" data-i="${i}" data-c="3" ${extra} value="${esc(z[3])}" aria-label="Mengeneinheit" ${dis()}></td>
        <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="${act}Weg" data-i="${i}" ${extra} title="Zeile entfernen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>`;
  }
  const prod = () => E.produkt(ent(), K.st.produkt);
  K.act.stProdukt = el => { K.st.produkt = el.dataset.p; K.render(); };
  K.inp.pFeld = el => { prod()[el.dataset.k] = el.value; geaendert(`Produkt ${prod().name} geändert`, false); };
  K.inp.pZahl = el => { const p = (K.aktuell() === "studio-modell" && K.st.knoten?.startsWith("p:") ? E.produkt(ent(), K.st.knoten.slice(2)) : null) || prod(); p[el.dataset.k] = +el.value || 0; if (K.Store.artikelZu(p.code)) p.apStamm = false; geaendert(`Preis von ${prod().name} geändert`, false); };
  K.act.pAktiv = el => { prod().aktiv = el.checked; geaendert(`${prod().name} ${el.checked ? "aktiviert" : "deaktiviert"}`); };
  K.act.pVisual = el => { prod().visual = { ...(prod().visual || {}), typ: el.value }; geaendert(`3D-Ersatzmodell von ${prod().name} geändert`); };
  K.act.pGruppe = el => {
    if (el.value === "__neu") {
      K.sheet(`<h3>Neue Produktgruppe</h3><div class="feld"><label for="ng-name">Name</label><input id="ng-name"></div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="gruppeOk">Anlegen</button></div>`);
      return;
    }
    prod().gruppe = el.value; geaendert(`${prod().name} in andere Gruppe verschoben`);
  };
  K.act.gruppeOk = () => { const n = document.getElementById("ng-name").value.trim(); if (!n) return; const id = E.slug(n); if (!ent().gruppen.some(g => g.id === id)) ent().gruppen.push({ id, name: n }); prod().gruppe = id; K.sheetZu(); geaendert(`Gruppe ${n} angelegt`); };
  K.act.pmNeu = el => { if (!el.value) return; prod().merkmale.push({ id: el.value, werte: null }); geaendert(`Merkmal ${E.merkmal(ent(), el.value).name} zu ${prod().name} hinzugefügt`); };
  K.act.pmWeg = el => { const z = prod().merkmale.splice(+el.dataset.i, 1)[0]; geaendert(`Merkmal ${E.merkmal(ent(), z.id)?.name} aus ${prod().name} entfernt`); };
  K.act.pmHoch = el => { const l = prod().merkmale, i = +el.dataset.i; [l[i - 1], l[i]] = [l[i], l[i - 1]]; geaendert(`Merkmalsreihenfolge von ${prod().name} geändert`); };
  K.act.pmWert = el => {
    const z = prod().merkmale[+el.dataset.i], m = E.merkmal(ent(), z.id), alle = m.werte.map(w => w.id);
    let l = z.werte && z.werte.length ? [...z.werte] : [...alle];
    l = l.includes(el.dataset.w) ? l.filter(x => x !== el.dataset.w) : alle.filter(x => l.includes(x) || x === el.dataset.w);
    if (!l.length) return K.toast("Mindestens ein Wert muss erlaubt bleiben.");
    z.werte = l.length === alle.length ? null : l; geaendert(`Erlaubte Werte für ${m.name} bei ${prod().name} geändert`);
  };
  K.inp.pStl = el => { const z = prod().stl[+el.dataset.i]; z[+el.dataset.c] = el.dataset.c === "2" ? +el.value || 0 : el.value; geaendert(`Grundstückliste ${prod().name} geändert`, false); };
  K.act.pStlNeu = () => { (prod().stl ||= []).push(["", "", 1, "Stk"]); geaendert(null); };
  K.act.pStlWeg = el => { prod().stl.splice(+el.dataset.i, 1); geaendert(`Grundstückliste ${prod().name} geändert`); };
  K.act.pNeu = () => {
    const mo = ent(), id = E.neueId("P", mo.produkte.map(p => p.id));
    mo.produkte.push({ id, name: "Neues Fahrzeug", gruppe: mo.gruppen[0]?.id, artnr: "FZ-" + id, basispreis: 0, basiskosten: 0, aktiv: false, beschreibung: "", visual: { typ: "plattform", asset: null }, stl: [], merkmale: [] });
    K.st.produkt = id; geaendert(`Produkt ${id} angelegt`);
  };
  K.act.pKopie = () => { const mo = ent(), p = K.clone(prod()); p.id = E.neueId("P", mo.produkte.map(x => x.id)); p.name += " (Kopie)"; p.aktiv = false; mo.produkte.push(p); K.st.produkt = p.id; geaendert(`Produkt ${p.name} angelegt`); };
  K.act.pLoeschen = () => K.sheet(`<h3>${esc(prod().name)} löschen?</h3><p>Der Artikel wird aus dem Konfigurationsmodell entfernt (nicht aus APplus). Er verschwindet nach der nächsten Freigabe aus dem Katalog; bestehende Angebote behalten ihre Positionen. Regeln, die nur für diesen Artikel galten, werden mit gelöscht.</p><div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="pLoeschenOk">Löschen</button></div>`);
  K.act.pLoeschenOk = () => { const p = prod(), mo = ent(); mo.produkte = mo.produkte.filter(x => x.id !== p.id); const n = E.ausGeltungEntfernen(mo, [], [p.id]); K.sheetZu(); K.st.produkt = null; if (K.st.knoten === "p:" + p.id) K.st.knoten = p.gruppe ? "g:" + p.gruppe : ""; geaendert(`Artikel ${p.code || p.name} gelöscht${n ? `, ${n} Regeln nur für diesen Artikel entfernt` : ""}`); };
  K.act.stTesten = el => K.konfigOeffnen(el.dataset.p, null, null, true);
  K.act.glbHochladen = async el => {
    const f = el.files[0]; if (!f) return;
    if (!/\.glb$/i.test(f.name)) return K.toast("Bitte eine .glb-Datei wählen.");
    K.toast("Wird hochgeladen …");
    try {
      // GLB ist kein erlaubter Medientyp; als Binärdatei unter einem zugelassenen Typ ablegen geht nicht.
      // Daher: GLB in eine JSON-Hülle (Base64) verpacken.
      const buf = new Uint8Array(await f.arrayBuffer()); let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      const blob = new Blob([JSON.stringify({ name: f.name, glb: btoa(bin) })], { type: "application/json" });
      const r = await K.assets.upload(blob, { type: "application/json" });
      prod().visual = { ...(prod().visual || {}), asset: r.id }; geaendert(`CAD-Modell für ${prod().name} hinterlegt`);
    } catch (e) { K.toast(e && e.code === "too_large" ? "Die Datei ist zu groß (max. ca. 14 MB)." : "Hochladen fehlgeschlagen."); }
  };
  K.act.glbEntfernen = () => { prod().visual.asset = null; geaendert(`CAD-Modell von ${prod().name} entfernt`); };
  K.act.glbKnoten = async el => {
    const ziel = document.getElementById("glb-knoten"); ziel.textContent = "Wird gelesen …";
    try { const l = await K.glbKnoten(el.dataset.a); ziel.innerHTML = `<div class="knotenliste">${l.map(n => `<code>${esc(n)}</code>`).join("")}</div>`; }
    catch (e) { ziel.textContent = "Das Modell konnte nicht gelesen werden."; }
  };

  function gruppenOptionen(mo, aktiv) {
    const zeile = (eltern, tiefe) => mo.gruppen.filter(g => (g.eltern || "") === (eltern || "")).map(g => `<option value="${g.id}" ${g.id === aktiv ? "selected" : ""}>${"\u00a0\u00a0".repeat(tiefe)}${esc(g.name)}</option>` + zeile(g.id, tiefe + 1)).join("");
    return zeile("", 0);
  }
  function bildFeld(id, act, daten) {
    return `<div class="bildfeld">${id ? `<img src="${K.bildUrl(id)}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}
      ${K.assets && !ro() ? `<label class="btn klein">${id ? "Ersetzen" : "Hochladen"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-act="${act}" ${daten} hidden></label>${id ? `<button type="button" class="btn klein" data-act="${act}" data-weg="1" ${daten}>Entfernen</button>` : ""}` : ""}</div>`;
  }
  async function bildHochladen(el) {
    if (el.dataset.weg) return null;
    const f = el.files && el.files[0]; if (!f) return undefined;
    if (f.size > 4e6) { K.toast("Bitte Bilder unter 4 MB verwenden."); return undefined; }
    try { const r = await K.assets.upload(f); return r.id; } catch (e) { K.toast("Bild konnte nicht hochgeladen werden."); return undefined; }
  }
  K.act.pBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; prod().bild = id; geaendert(`Bild von ${prod().name} ${id ? "hinterlegt" : "entfernt"}`); };
  K.act.wBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; const w = mm().werte[+el.dataset.i]; w.bild = id; geaendert(`Bild für ${w.name} ${id ? "hinterlegt" : "entfernt"}`); };
  K.act.pmStandard = el => { const z = prod().merkmale[+el.dataset.i]; if (el.value) z.standard = el.value; else delete z.standard; geaendert(`Standardwert bei ${prod().name} geändert`); };
  K.act.mDarst = el => { mm().darstellung = el.value; geaendert(`Darstellung von ${mm().name} geändert`); };
  K.act.mFlag = el => { mm()[el.dataset.k] = el.checked; geaendert(`${mm().name}: ${el.dataset.k === "pflicht" ? "Pflicht" : "Katalogfilter"} ${el.checked ? "an" : "aus"}`); };

  /* ---------- Artikelstamm: Suche, Markierung, Abgleich ---------- */
  const artBekannt = code => !K.Store.artikelQuelle || !code || !!K.Store.artikelZu(code);
  const artKlasse = code => artBekannt(code) ? "" : " unbekannt";
  const artTitel = code => !code ? "" : artBekannt(code) ? (K.Store.artikelZu(code)?.name || "") : "Nicht im Artikelstamm (ARTIKEL) gefunden";
  function artikelFehlend(mo) {
    if (!K.Store.artikelQuelle) return [];
    const out = [], seen = new Set(), add = (code, wo) => { if (code && !K.Store.artikelZu(code) && !seen.has(code + wo)) { seen.add(code + wo); out.push({ code, wo }); } };
    for (const p of mo.produkte) { add(p.code, "Fahrzeug " + p.name); for (const z of p.stl || []) add(z[0], "Stückliste " + p.name); }
    for (const m of mo.merkmale) for (const w of m.werte) { add(w.code, m.name); for (const z of w.stl || []) add(z[0], "Stückliste " + w.name); }
    return out;
  }
  K.artikelFehlend = artikelFehlend;
  K.inp.artPruef = () => K.render();
  // Vorschlagsliste unter dem Eingabefeld
  let drop = null, dropEl = null, dropIdx = 0, dropTreffer = [];
  function dropZu() { if (drop) drop.remove(); drop = null; dropEl = null; }
  function dropZeigen(el) {
    dropTreffer = K.Store.artikelSuche(el.value, 12); dropIdx = 0;
    if (!dropTreffer.length || !K.Store.artikelQuelle) return dropZu();
    if (!drop) { drop = document.createElement("div"); drop.className = "artdrop"; drop.setAttribute("role", "listbox"); K.root.appendChild(drop); }
    dropEl = el;
    const r = el.getBoundingClientRect(), rr = K.root.getBoundingClientRect();
    Object.assign(drop.style, { left: (r.left - rr.left) + "px", top: (r.bottom - rr.top + 2) + "px", minWidth: Math.max(r.width, 340) + "px" });
    drop.innerHTML = dropTreffer.map((a, i) => `<div class="artdrop-z${i === dropIdx ? " aktiv" : ""}" role="option" data-i="${i}"><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num gedimmt">${a.preis ? K.eur(a.preis) : ""}</span></div>`).join("");
  }
  function artUebernehmen(el, a) {
    const typ = el.dataset.art, i = +el.dataset.i;
    if (typ === "wert") {
      const m = mm(), w = m.werte[i], alt = w.code;
      w.code = a.code; if (!w.name || w.name === "Neuer Wert" || w.name === alt) w.name = a.name || w.name;
      if (!w.preis && a.preis) w.preis = a.preis; if (!w.kosten && a.kosten) w.kosten = a.kosten;
      geaendert(`Wert ${w.name} mit Artikel ${a.code} verknüpft`);
    } else if (typ === "produkt") {
      const p = prod(); p.code = a.code; if (!p.name || p.name === "Neues Fahrzeug") p.name = a.name || p.name;
      if (!p.basispreis && a.preis) p.basispreis = a.preis; if (!p.basiskosten && a.kosten) p.basiskosten = a.kosten;
      geaendert(`${p.name} mit Artikel ${a.code} verknüpft`);
    } else if (typ === "stl") {
      const z = el.dataset.in === "pStl" ? prod().stl[i] : mm().werte[+el.dataset.w].stl[i];
      z[0] = a.code; if (!z[1]) z[1] = a.name; if (a.me) z[3] = a.me;
      geaendert(`Stückliste: Artikel ${a.code} eingetragen`);
    }
    dropZu();
  }
  document.addEventListener("input", e => { const el = e.target; if (el.dataset && el.dataset.art && K.root && K.root.contains(el)) dropZeigen(el); });
  document.addEventListener("keydown", e => {
    if (!drop || e.target !== dropEl) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); dropIdx = (dropIdx + (e.key === "ArrowDown" ? 1 : -1) + dropTreffer.length) % dropTreffer.length; drop.querySelectorAll(".artdrop-z").forEach((z, i) => z.classList.toggle("aktiv", i === dropIdx)); }
    else if (e.key === "Enter") { e.preventDefault(); artUebernehmen(dropEl, dropTreffer[dropIdx]); }
    else if (e.key === "Escape") dropZu();
  });
  document.addEventListener("mousedown", e => { if (!drop) return; const z = e.target.closest(".artdrop-z"); if (z) { e.preventDefault(); artUebernehmen(dropEl, dropTreffer[+z.dataset.i]); } else if (!e.target.closest(".artdrop")) dropZu(); });
  document.addEventListener("focusout", e => { if (drop && e.target === dropEl) setTimeout(() => { if (document.activeElement !== dropEl) dropZu(); }, 150); });

  // Werte aus dem Artikelstamm hinzufügen
  K.act.wAusArtikel = () => {
    if (!K.Store.artikelQuelle) return K.toast("Kein Artikelstamm geladen. Bitte die Abfrage für ARTIKEL einrichten.");
    K.sheet(`<h3>Werte aus dem Artikelstamm</h3><p class="klein gedimmt">Artikel suchen und anklicken. Er wird als neuer Wert in „${esc(mm().name)}“ angelegt.</p>
      <input id="as-q" type="search" data-in="artSheetSuche" placeholder="Artikelnummer oder Bezeichnung" autocomplete="off"><div id="as-liste" class="artliste"></div>
      <div class="row" style="justify-content:flex-end"><button class="btn primary" type="button" data-act="sheetZuUndZeichnen">Fertig</button></div>`, true);
    K.inp.artSheetSuche(K.el("as-q"));
  };
  K.inp.artSheetSuche = el => {
    const mo = ent(), benutzt = new Map(); for (const m of mo.merkmale) for (const w of m.werte) if (w.code) benutzt.set(w.code.toUpperCase(), m.name);
    const l = el.value.trim() ? K.Store.artikelSuche(el.value, 40) : [...K.Store.artikel.values()].filter(a => !benutzt.has(a.code.toUpperCase())).slice(0, 40);
    K.el("as-liste").innerHTML = l.map(a => { const b = benutzt.get(a.code.toUpperCase()); return `<button type="button" class="artliste-z" data-act="artHinzu" data-c="${esc(a.code)}" ${b ? "disabled" : ""}><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num">${a.preis ? K.eur(a.preis) : ""}</span>${b ? `<span class="chip">in ${esc(b)}</span>` : ""}</button>`; }).join("") || `<p class="leer-klein">Keine Treffer.</p>`;
  };
  K.act.artHinzu = el => {
    const a = K.Store.artikelZu(el.dataset.c), m = mm(); if (!a) return;
    let id = a.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40); while (m.werte.some(w => w.id === id)) id += "_";
    m.werte.push({ id, code: a.code, name: a.name || a.code, preis: a.preis || 0, kosten: a.kosten || 0, stl: [] });
    K.Store.entwurfGeaendert(`Artikel ${a.code} als Wert in ${m.name} angelegt`);
    el.disabled = true; el.insertAdjacentHTML("beforeend", `<span class="chip st-angenommen">hinzugefügt</span>`);
  };
  K.act.sheetZuUndZeichnen = () => { K.sheetZu(); K.render(); };

  // Abgleich mit dem Artikelstamm
  function abweichungen(mo) {
    const out = [];
    for (const p of mo.produkte) { const a = K.Store.artikelZu(p.code); if (!a) continue;
      if (a.name && a.name !== p.name) out.push({ art: "name", wo: "Fahrzeug", code: p.code, alt: p.name, neu: a.name, setze: () => p.name = a.name });
      if (a.preis && a.preis !== p.basispreis) out.push({ art: "preis", wo: "Fahrzeug", code: p.code, alt: p.basispreis, neu: a.preis, setze: () => p.basispreis = a.preis });
      if (a.kosten && a.kosten !== p.basiskosten) out.push({ art: "kosten", wo: "Fahrzeug", code: p.code, alt: p.basiskosten, neu: a.kosten, setze: () => p.basiskosten = a.kosten }); }
    for (const m of mo.merkmale) for (const w of m.werte) { const a = K.Store.artikelZu(w.code); if (!a) continue;
      if (a.name && a.name !== w.name) out.push({ art: "name", wo: m.name, code: w.code, alt: w.name, neu: a.name, setze: () => w.name = a.name });
      if (a.preis && a.preis !== w.preis) out.push({ art: "preis", wo: m.name, code: w.code, alt: w.preis, neu: a.preis, setze: () => w.preis = a.preis });
      if (a.kosten && a.kosten !== w.kosten) out.push({ art: "kosten", wo: m.name, code: w.code, alt: w.kosten, neu: a.kosten, setze: () => w.kosten = a.kosten }); }
    return out;
  }
  K.act.artAbgleich = () => {
    const mo = ent(), ab = abweichungen(mo), fehl = artikelFehlend(mo), n = t => ab.filter(x => x.art === t).length;
    const wert = (x, v) => x.art === "name" ? esc(v) : K.eur(v);
    K.sheet(`<h3>Abgleich mit dem Artikelstamm</h3>
      <p class="klein gedimmt">Vergleicht Bezeichnung, Verkaufspreis und Kosten der Codes und Fahrzeuge mit ARTIKEL. Hinweis: Preise mit Multiplikator (z. B. je Achse) gelten im Modell je Einheit.</p>
      ${ab.length ? `<div class="tabwrap ohne-rand abgleich"><table class="kompakt"><thead><tr><th>Code</th><th>Wo</th><th>Feld</th><th>Im Modell</th><th>In ARTIKEL</th></tr></thead><tbody>
        ${ab.map(x => `<tr><td class="mono">${esc(x.code)}</td><td class="gedimmt">${esc(x.wo)}</td><td>${x.art === "name" ? "Bezeichnung" : x.art === "preis" ? "Preis" : "Kosten"}</td><td>${wert(x, x.alt)}</td><td><b>${wert(x, x.neu)}</b></td></tr>`).join("")}</tbody></table></div>
        <div class="row">${n("name") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="name">${n("name")} Bezeichnungen übernehmen</button>` : ""}${n("preis") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="preis">${n("preis")} Preise übernehmen</button>` : ""}${n("kosten") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="kosten">${n("kosten")} Kosten übernehmen</button>` : ""}</div>`
        : `<div class="hinweis ok">Bezeichnungen, Preise und Kosten stimmen mit dem Artikelstamm überein.</div>`}
      ${fehl.length ? `<div class="hinweis warn"><b>${fehl.length} Nummern fehlen im Artikelstamm:</b> ${fehl.slice(0, 40).map(x => `<code>${esc(x.code)}</code>`).join(", ")}${fehl.length > 40 ? " …" : ""}</div>` : ""}
      <div class="row" style="justify-content:flex-end"><button class="btn primary" type="button" data-act="sheetZuUndZeichnen">Schließen</button></div>`, true);
  };
  K.act.artUebernahme = el => { const mo = ent(), l = abweichungen(mo).filter(x => x.art === el.dataset.t); l.forEach(x => x.setze()); K.Store.entwurfGeaendert(`${l.length} ${el.dataset.t === "name" ? "Bezeichnungen" : el.dataset.t === "preis" ? "Preise" : "Kosten"} aus dem Artikelstamm übernommen`); K.toast(`${l.length} Werte übernommen`); K.act.artAbgleich(); };

  /* Katalogstruktur (Gruppen mit Übergeordneter Gruppe und Bild) */
  K.act.katalogPflege = () => katalogSheet();
  function katalogSheet() {
    const mo = ent();
    K.sheet(`<h3>Katalogstruktur</h3><p class="klein gedimmt">Gruppen bilden den Baum im Katalog. Eine Gruppe ohne übergeordnete Gruppe steht oben.</p>
      <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Gruppe</th><th>Übergeordnet</th><th>Bild</th><th class="r">Produkte</th><th></th></tr></thead><tbody>
      ${mo.gruppen.map((g, i) => `<tr><td><input id="kg-n-${i}" class="flach" data-in="kgName" data-i="${i}" value="${esc(g.name)}" ${dis()}></td>
        <td><select id="kg-e-${i}" data-act="kgEltern" data-i="${i}" ${dis()}><option value="">– oben –</option>${mo.gruppen.filter(x => x.id !== g.id).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></td>
        <td>${bildFeld(g.bild, "kgBild", `data-i="${i}"`)}</td><td class="r num">${mo.produkte.filter(p => p.gruppe === g.id).length}</td>
        <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="kgWeg" data-i="${i}" title="Gruppe löschen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>
      <div class="row zwischen">${ro() ? "<span></span>" : `<button class="btn klein" type="button" data-act="kgNeu">+ Gruppe</button>`}<button class="btn primary" type="button" data-act="sheetZu">Fertig</button></div>`, true);
  }
  K.inp.kgName = el => { ent().gruppen[+el.dataset.i].name = el.value; geaendert("Katalogstruktur geändert", false); };
  K.act.kgEltern = el => { const g = ent().gruppen[+el.dataset.i]; let x = el.value; while (x) { if (x === g.id) { K.toast("Eine Gruppe kann nicht unter sich selbst stehen."); return katalogSheet(); } x = ent().gruppen.find(y => y.id === x)?.eltern; } g.eltern = el.value || null; geaendert("Katalogstruktur geändert", false); };
  K.act.kgBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; ent().gruppen[+el.dataset.i].bild = id; geaendert("Gruppenbild geändert", false); katalogSheet(); };
  K.act.kgNeu = () => { const mo = ent(); let id = "gruppe"; let n = 1; while (mo.gruppen.some(g => g.id === id + n)) n++; mo.gruppen.push({ id: id + n, name: "Neue Gruppe", eltern: null }); geaendert("Gruppe angelegt", false); katalogSheet(); };
  K.act.kgWeg = el => {
    const mo = ent(), g = mo.gruppen[+el.dataset.i];
    if (mo.produkte.some(p => p.gruppe === g.id) || mo.gruppen.some(x => x.eltern === g.id)) { K.toast("Die Gruppe enthält noch Produkte oder Untergruppen."); return; }
    mo.gruppen.splice(+el.dataset.i, 1); E.ausGeltungEntfernen(mo, [g.id], []); geaendert(`Gruppe ${g.name} gelöscht`, false); katalogSheet();
  };

  /* =====================================================================
     Merkmale
     ===================================================================== */
  K.route("studio-merkmale", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const st = K.st; if (!E.merkmal(mo, st.merkmal)) st.merkmal = mo.merkmale[0]?.id || null;
    const m = E.merkmal(mo, st.merkmal), abschnitte = [...new Set(mo.merkmale.map(x => x.abschnitt).filter(Boolean))];
    const liste = abschnitte.concat(mo.merkmale.some(x => !x.abschnitt) ? [""] : []).map(ab => `<div class="listgruppe">${esc(ab || "Ohne Abschnitt")}</div>${mo.merkmale.filter(x => (x.abschnitt || "") === ab).map(x => `<button type="button" class="listeintrag" data-act="stMerkmal" data-m="${x.id}" aria-current="${x.id === st.merkmal}"><span>${esc(x.name)}</span><span class="gedimmt klein">${x.werte.length} Werte${x.typ === "mehrfach" ? " · mehrfach" : ""}</span></button>`).join("")}`).join("");
    let ed = `<div class="leer">Noch keine Merkmale.</div>`;
    if (m) {
      const vw = verwendung(m.id), mitMenge = mo.merkmale.filter(x => x.id !== m.id && x.werte.some(w => w.menge));
      const istFarbe = m.werte.some(w => w.hex) || /farb|lack/i.test(m.name);
      ed = `<div class="panel"><div class="formgitter">
        <div class="feld"><label for="m-name">Bezeichnung</label><input id="m-name" data-in="mFeld" data-k="name" value="${esc(m.name)}" ${dis()}></div>
        <div class="feld"><label for="m-ab">Abschnitt im Konfigurator</label><input id="m-ab" list="abschnitte" data-in="mFeld" data-k="abschnitt" value="${esc(m.abschnitt || "")}" ${dis()}><datalist id="abschnitte">${abschnitte.map(a => `<option value="${esc(a)}">`).join("")}</datalist></div>
        <div class="feld"><label for="m-typ">Auswahl in dieser Gruppe</label><select id="m-typ" data-act="mFeldtyp" ${dis()}>${E.GRUPPENTYPEN.map(([k, n]) => `<option value="${k}" ${E.gruppentyp(m) === k ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <div class="feld"><label for="m-mult">Preis und Menge multiplizieren mit</label><select id="m-mult" data-act="mMult" ${dis()}><option value="">nicht multiplizieren</option>${mitMenge.map(x => `<option value="${x.id}" ${x.id === m.multiplikator ? "selected" : ""}>${esc(x.name)} (Menge des Werts)</option>`).join("")}</select></div>
        <div class="feld"><label for="m-bereich">Reiter im Konfigurator</label><input id="m-bereich" list="bereiche" data-in="mFeld" data-k="bereich" value="${esc(E.bereich(m))}" ${dis()}><datalist id="bereiche">${[...new Set(["Grundmaschine", "Optionen", ...mo.merkmale.map(x => E.bereich(x))])].map(a => `<option value="${esc(a)}">`).join("")}</datalist></div>

        <div class="feld"><label for="m-code">Merkmal-Code</label><input id="m-code" class="mono" data-in="mFeld" data-k="code" value="${esc(m.code || "")}" placeholder="${esc(m.id)}" ${dis()}></div>
        <div class="feld"><label>Optionen</label><div class="haken-liste"><label class="haken"><input type="checkbox" data-act="mFlag" data-k="pflicht" ${m.pflicht ? "checked" : ""} ${m.typ === "mehrfach" ? "disabled" : dis()}> Pflichtangabe ohne Vorbelegung</label>
          <label class="haken"><input type="checkbox" data-act="mFlag" data-k="katalogfilter" ${m.katalogfilter ? "checked" : ""} ${dis()}> Als Filter im Katalog</label></div></div>
        <div class="feld breit"><label for="m-info">Info-Text (Symbol i im Konfigurator)</label><input id="m-info" data-in="mFeld" data-k="info" value="${esc(m.info || "")}" ${dis()}></div>
        <div class="feld"><label>Verwendet in</label><div class="wert">${vw.produkte.length} Produkten, ${vw.regeln.length} Regeln</div></div>
      </div></div>
      <section class="panel"><div class="panelkopf"><h3>Werte</h3>${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="wAusArtikel">+ Aus Artikelstamm</button><button class="btn klein" type="button" data-act="wNeu">+ Wert</button></div>`}</div>
        <p class="klein gedimmt">Der Code ist die Artikelnummer aus APplus (ARTIKEL.ARTIKEL). Beim Tippen werden passende Artikel vorgeschlagen; Bezeichnung und Preis werden übernommen.</p>
        <div class="tabwrap ohne-rand"><table class="kompakt werte"><thead><tr><th></th><th>Code</th><th>Bezeichnung</th><th title="Bezeichnung und Preis automatisch aus APplus (ARTIKEL)">aus APplus</th><th>Feldtyp</th><th class="r">Preis</th><th class="r">Kosten</th><th class="r" title="Wird von anderen Merkmalen als Multiplikator verwendet, z. B. Achsanzahl">Menge</th>${istFarbe ? "<th>Farbe</th>" : ""}<th>3D-Teil</th><th>Details</th><th></th></tr></thead><tbody>
        ${m.werte.map((w, i) => `<tr>
          <td><button type="button" class="ikon" data-act="wHoch" data-i="${i}" ${i && !ro() ? "" : "disabled"} title="Nach oben">↑</button></td>
          <td><input id="w-c-${i}" class="flach mono code${artKlasse(w.code)}" data-in="wFeld" data-k="code" data-i="${i}" data-art="wert" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(w.code))}" value="${esc(w.code || "")}" aria-label="Vertriebscode (Artikel)" ${dis()}></td>
          <td><input id="w-n-${i}" class="flach" data-in="wFeld" data-k="name" data-i="${i}" value="${esc(w.name)}" aria-label="Bezeichnung" ${dis()}></td>
          <td class="mitte">${K.Store.artikelZu(w.code) ? `<input type="checkbox" data-act="wAp" data-i="${i}" ${w.apStamm !== false ? "checked" : ""} aria-label="aus APplus" ${dis()}>` : `<span class="gedimmt klein" title="nicht im Artikelstamm">–</span>`}</td>
          <td><select id="w-ty-${i}" data-act="wTyp" data-i="${i}" aria-label="Feldtyp" ${dis()}>${E.WERTTYPEN.map(([k, n, h]) => `<option value="${k}" ${E.wertTyp(m, w) === k ? "selected" : ""} title="${esc(h)}">${n}</option>`).join("")}</select></td>
          <td class="r"><input id="w-p-${i}" class="flach zahl" type="number" step="10" data-in="wZahl" data-k="preis" data-i="${i}" value="${w.preis || 0}" aria-label="Preis" ${dis()}></td>
          <td class="r"><input id="w-k-${i}" class="flach zahl" type="number" step="10" data-in="wZahl" data-k="kosten" data-i="${i}" value="${w.kosten || 0}" aria-label="Kosten" ${dis()}></td>
          <td class="r"><input id="w-m-${i}" class="flach zahl kurz" type="number" step="1" data-in="wZahl" data-k="menge" data-i="${i}" value="${w.menge ?? ""}" aria-label="Menge" ${dis()}></td>
          ${istFarbe ? `<td><input id="w-h-${i}" type="color" data-in="wFeld" data-k="hex" data-i="${i}" value="${esc(w.hex || "#888888")}" aria-label="Farbe" ${dis()}></td>` : ""}
          <td><input id="w-t-${i}" class="flach mono" data-in="wFeld" data-k="teil" data-i="${i}" value="${esc(w.teil || "")}" placeholder="–" aria-label="3D-Teil" ${dis()}></td>
          <td><button type="button" class="btn klein" data-act="wStl" data-i="${i}" aria-expanded="${K.st.offenWert === m.id + i}">${w.bild ? "Bild · " : ""}${(w.stl || []).length} Stl.</button></td>
          <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="wWeg" data-i="${i}" title="Wert löschen">✕</button>`}</td></tr>
          ${K.st.offenWert === m.id + i ? `<tr class="unterzeile"><td></td><td colspan="${istFarbe ? 11 : 10}">${K.wertExtras ? K.wertExtras(m, w, "st") : ""}<div class="formgitter"><div class="feld breit"><label for="w-info-${i}">Info-Text</label><input id="w-info-${i}" data-in="wFeld" data-k="info" data-i="${i}" value="${esc(w.info || "")}" ${dis()}></div>
            <div class="feld"><label>Bild für Kacheln</label>${bildFeld(w.bild, "wBild", `data-i="${i}"`)}</div></div>
            <div class="eyebrow" style="margin:8px 0 4px">Stückliste</div>${stlTabelle(w.stl, "wStlZ", `data-w="${i}"`)}${ro() ? "" : `<button class="btn klein" type="button" data-act="wStlNeu" data-i="${i}">+ Stücklistenzeile</button>`}</td></tr>` : ""}`).join("")}
        </tbody></table></div>
        <p class="klein gedimmt">Preise und Kosten sind netto. ${m.multiplikator ? `Beide werden mit der Menge aus „${esc(E.merkmal(mo, m.multiplikator)?.name)}“ multipliziert.` : ""}</p></section>
      ${ro() ? "" : `<div class="row"><button class="btn gefahr-text" type="button" data-act="mLoeschen">Merkmal löschen</button></div>`}`;
    }
    return kopf("Merkmale", "Merkmale und Werte mit Preis, Kosten, Stückliste und 3D-Bauteil. Ein Merkmal kann in mehreren Produkten verwendet werden.", ro() ? "" : `${K.Store.artikelQuelle ? `<button class="btn" type="button" data-act="artAbgleich">Mit Artikelstamm abgleichen</button>` : ""}<button class="btn primary" type="button" data-act="mNeu">Neues Merkmal</button>`) +
      `<div class="studio-layout"><nav class="liste-links">${liste}</nav><div class="editor">${ed}</div></div>`;
  });
  const mm = () => E.merkmal(ent(), K.st.merkmal);
  K.act.stMerkmal = el => { K.st.merkmal = el.dataset.m; K.st.offenWert = null; K.render(); };
  K.inp.mFeld = el => { mm()[el.dataset.k] = el.value; geaendert(`Merkmal ${mm().name} geändert`, false); };
  K.inp.ckFeld = async el => { const e = S().einst; e.codeKennung = Object.assign({ ueber: "ZZ", option: "YY", grund: "GA" }, e.codeKennung || {}, { [el.dataset.k]: el.value.trim().toUpperCase() }); await K.Store.einstSpeichern(e, true); K.toast("Code-Kennzeichen gespeichert"); };
  K.act.mTyp = el => { mm().typ = el.value; geaendert(`Auswahlart von ${mm().name} geändert`); };
  K.act.wTyp = el => { const w = mm().werte[+el.dataset.i]; E.wertTypSetzen(w, el.value); geaendert(`${w.code || w.name}: ${E.WERTTYPEN.find(x => x[0] === el.value)[1]}`); };
  K.act.mFeldtyp = el => { E.feldtypSetzen(mm(), el.value); geaendert(`Feldtyp von ${mm().name}: ${E.FELDTYPEN.find(x => x[0] === el.value)[1]}`); };
  K.act.mMult = el => { mm().multiplikator = el.value || undefined; geaendert(`Multiplikator von ${mm().name} geändert`); };
  K.inp.wFeld = el => { const w = mm().werte[+el.dataset.i]; w[el.dataset.k] = el.value; if (el.dataset.k === "name" && K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Wert in ${mm().name} geändert`, false); };
  K.inp.wZahl = el => { const w = mm().werte[+el.dataset.i]; if (el.value === "" && el.dataset.k === "menge") delete w.menge; else w[el.dataset.k] = +el.value || 0; if ((el.dataset.k === "preis" || el.dataset.k === "kosten") && K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Preise in ${mm().name} geändert`, false); };
  K.act.wAp = el => { const w = mm().werte[+el.dataset.i]; w.apStamm = el.checked; if (el.checked) K.Store.stammAnwenden(); geaendert(`${w.code}: ${el.checked ? "Bezeichnung und Preis aus APplus" : "eigene Bezeichnung und Preis"}`); };
  K.act.wHoch = el => { const l = mm().werte, i = +el.dataset.i; [l[i - 1], l[i]] = [l[i], l[i - 1]]; geaendert(`Wertereihenfolge ${mm().name} geändert`); };
  K.act.wNeu = () => { const m = mm(), id = E.neueId("w", m.werte.map(w => w.id)); m.werte.push({ id, name: "Neuer Wert", preis: 0, kosten: 0, stl: [] }); geaendert(`Wert in ${m.name} angelegt`); };
  K.act.wStl = el => { const k = mm().id + el.dataset.i; K.st.offenWert = K.st.offenWert === k ? null : k; K.render(); };
  K.act.wStlNeu = el => { (mm().werte[+el.dataset.i].stl ||= []).push(["", "", 1, "Stk"]); geaendert(null); };
  K.inp.wStlZ = el => { const z = mm().werte[+el.dataset.w].stl[+el.dataset.i]; z[+el.dataset.c] = el.dataset.c === "2" ? +el.value || 0 : el.value; geaendert(`Stückliste in ${mm().name} geändert`, false); };
  K.act.wStlZWeg = el => { mm().werte[+el.dataset.w].stl.splice(+el.dataset.i, 1); geaendert(`Stückliste in ${mm().name} geändert`); };
  K.act.wWeg = el => {
    const m = mm(), w = m.werte[+el.dataset.i];
    const inRegeln = ent().regeln.filter(r => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).includes(m.id) : ((r.wenn || []).some(c => c.merkmal === m.id && c.werte.includes(w.id)) || (r.dann?.merkmal === m.id && r.dann.werte.includes(w.id))));
    K.sheet(`<h3>Wert „${esc(w.name)}“ löschen?</h3><p>${inRegeln.length ? `Er wird aus ${inRegeln.length} Regeln entfernt (${inRegeln.map(r => r.id).join(", ")}).` : "Er wird in keiner Regel verwendet."}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="wWegOk" data-i="${el.dataset.i}">Löschen</button></div>`);
  };
  K.act.wWegOk = el => {
    const m = mm(), w = m.werte.splice(+el.dataset.i, 1)[0];
    for (const r of ent().regeln) { if (r.typ === "tabelle") { const i = r.tabelle.merkmale.indexOf(m.id); if (i >= 0) r.tabelle.zeilen = r.tabelle.zeilen.filter(z => z[i] !== w.id); continue; } for (const c of r.wenn) if (c.merkmal === m.id) c.werte = c.werte.filter(x => x !== w.id); if (r.dann?.merkmal === m.id) r.dann.werte = r.dann.werte.filter(x => x !== w.id); }
    for (const o of [...ent().produkte, ...ent().gruppen]) for (const z of o.merkmale || []) if (z.id === m.id && z.werte) { z.werte = z.werte.filter(x => x !== w.id); if (z.standard === w.id) delete z.standard; }
    K.sheetZu(); geaendert(`Wert ${w.name} aus ${m.name} gelöscht`);
  };
  K.act.mNeu = () => K.sheet(`<h3>Neues Merkmal</h3><div class="feld"><label for="nm-name">Bezeichnung</label><input id="nm-name" placeholder="z. B. Bremsanlage"></div>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mNeuOk">Anlegen</button></div>`);
  K.act.mNeuOk = () => {
    const n = document.getElementById("nm-name").value.trim(); if (!n) return;
    let id = E.slug(n).replace(/-/g, ""); const ids = ent().merkmale.map(m => m.id); while (ids.includes(id)) id += "2";
    ent().merkmale.push({ id, name: n, abschnitt: "Ausstattung", typ: "einfach", werte: [{ id: "w01", name: "Standard", preis: 0, kosten: 0, stl: [] }] });
    K.st.merkmal = id; K.sheetZu();
    if (K.st.mNeuZiel) { const z = K.studio.knotenObjekt(ent(), K.st.mNeuZiel); if (z) (z.merkmale ||= []).push({ id, werte: null }); K.st.mNeuZiel = null; }
    geaendert(`Merkmal ${n} angelegt`);
  };
  K.act.mLoeschen = () => {
    const m = mm(), vw = verwendung(m.id);
    K.sheet(`<h3>Merkmal „${esc(m.name)}“ löschen?</h3><p>${vw.produkte.length ? `Es wird aus ${vw.produkte.length} Produkten entfernt. ` : ""}${vw.regeln.length ? `${vw.regeln.length} Regeln, die es verwenden, werden ebenfalls gelöscht (${vw.regeln.map(r => r.id).join(", ")}).` : ""}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="mLoeschenOk">Löschen</button></div>`);
  };
  K.act.mLoeschenOk = () => {
    const m = mm(), mo = ent();
    mo.merkmale = mo.merkmale.filter(x => x.id !== m.id);
    for (const o of [...mo.produkte, ...mo.gruppen]) { if (o.merkmale) o.merkmale = o.merkmale.filter(z => z.id !== m.id); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(x => x !== m.id); }
    mo.regeln = mo.regeln.filter(r => r.typ === "tabelle" || !(r.wenn.some(c => c.merkmal === m.id) || r.dann?.merkmal === m.id));
    for (const r of mo.regeln) if (r.typ === "tabelle") { const i = r.tabelle.merkmale.indexOf(m.id); if (i >= 0) { r.tabelle.merkmale.splice(i, 1); const neu = new Map(); for (const z of r.tabelle.zeilen) { const k = z.filter((_, j) => j !== i); neu.set(k.join("|"), k); } r.tabelle.zeilen = [...neu.values()]; } }
    for (const x of mo.merkmale) if (x.multiplikator === m.id) delete x.multiplikator;
    K.st.merkmal = null; K.sheetZu(); geaendert(`Merkmal ${m.name} gelöscht`);
  };

  /* =====================================================================
     Regeln: Kontext (Produkt/Gruppe), Regelliste, Matrix, Kombinationstabellen, Regelgraph
     ===================================================================== */
  Object.assign(K.st, { kontext: "", regelTab: "liste", regelFilter: { merkmal: "", suche: "" }, matrix: { modus: "gesamt", a: "achsen", b: "lenkung" }, tabOffen: null, graphFokus: null });

  /* ---------- Kontext ---------- */
  function kontext(mo) {
    const k = K.st.kontext || "";
    if (k.startsWith("p:")) { const p = E.produkt(mo, k.slice(2)); if (p) return { typ: "p", id: p.id, name: p.name, produkte: [p], scope: { produkte: [p.id], gruppen: [] } }; }
    if (k.startsWith("g:")) { const g = mo.gruppen.find(x => x.id === k.slice(2)); if (g) return { typ: "g", id: g.id, name: g.name, produkte: mo.produkte.filter(p => E.gruppenKette(mo, p).includes(g.id)), scope: { produkte: [], gruppen: [g.id] } }; }
    return { typ: "", id: "", name: "Alle Produkte", produkte: mo.produkte.slice(), scope: { produkte: [], gruppen: [] } };
  }
  // Regel ist im Kontext sichtbar, wenn sie für mindestens ein Produkt gilt, das die betroffenen Merkmale auch hat
  const hatM = (p, mid) => E.hatMerkmal(ent(), p, mid);
  const relevant = (r, p) => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).filter(m => hatM(p, m)).length >= 2 || !(r.tabelle?.merkmale || []).length : (!r.dann?.merkmal || hatM(p, r.dann.merkmal));
  const regelImKontext = (mo, r, kx) => kx.produkte.some(p => E.imGeltungsbereich(mo, r, p) && relevant(r, p));
  // Merkmale des Kontexts, jeweils nur mit den Werten, die dort mindestens ein Produkt zulässt
  const kontextMerkmale = (mo, kx) => mo.merkmale.map(m => {
    const ids = new Set(); for (const p of kx.produkte) { const z = E.zuordnung(mo, p).find(x => x.id === m.id); if (z) (z.werte && z.werte.length ? z.werte : m.werte.map(w => w.id)).forEach(id => ids.add(id)); }
    return ids.size ? { ...m, werte: m.werte.filter(w => ids.has(w.id)) } : null;
  }).filter(Boolean);
  const scopeText = (mo, r) => {
    const t = [...(r.gruppen || []).map(id => "Gruppe " + (mo.gruppen.find(g => g.id === id)?.name || id)), ...(r.produkte || []).map(id => E.produkt(mo, id)?.name || id)];
    return t.length ? t.join(", ") : "Alle Produkte";
  };
  const gleicherScope = (r, sc) => JSON.stringify([...(r.produkte || [])].sort()) === JSON.stringify([...sc.produkte].sort()) && JSON.stringify([...(r.gruppen || [])].sort()) === JSON.stringify([...sc.gruppen].sort());
  function kontextAuswahl(mo) {
    const zeile = (eltern, tiefe) => mo.gruppen.filter(g => (g.eltern || "") === (eltern || "")).map(g => `<option value="g:${g.id}" ${K.st.kontext === "g:" + g.id ? "selected" : ""}>${"  ".repeat(tiefe)}▸ ${esc(g.name)}</option>` + zeile(g.id, tiefe + 1)).join("");
    return `<select id="r-kontext" data-act="rKontext" aria-label="Regeln für">
      <option value="" ${!K.st.kontext ? "selected" : ""}>Alle Produkte</option>
      <optgroup label="Produktgruppen">${zeile("", 0)}</optgroup>
      <optgroup label="Produkte">${mo.produkte.map(p => `<option value="p:${p.id}" ${K.st.kontext === "p:" + p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</optgroup></select>`;
  }
  K.act.rKontext = el => { K.st.kontext = el.value; K.st.regelOffen = null; K.st.tabOffen = null; K.st.graphFokus = null; K.render(); };
  K.act.regelnFuer = el => { K.st.kontext = el.dataset.k; K.st.regelTab = "liste"; K.gehe("studio-regeln"); };

  K.route("studio-regeln", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const kx = kontext(mo), t = K.st.regelTab;
    const imK = mo.regeln.filter(r => regelImKontext(mo, r, kx));
    const zahl = { liste: imK.filter(r => r.typ !== "tabelle").length, tabellen: imK.filter(r => r.typ === "tabelle").length };
    const tabs = `<div class="tabs-innen" role="tablist">${[["liste", "Regeln", zahl.liste], ["matrix", "Matrix"], ["tabellen", "Kombinationstabellen", zahl.tabellen], ["graph", "Regelgraph"]].map(([id, n, z]) => `<button type="button" role="tab" data-act="regelTab" data-t="${id}" aria-selected="${t === id}">${n}${z != null ? ` <span class="zaehler">${z}</span>` : ""}</button>`).join("")}</div>`;
    const leiste = `<div class="kontextleiste"><div class="kl-wahl"><span class="eyebrow">Regeln für</span>${kontextAuswahl(mo)}</div>
      <div class="kl-info">${kx.typ ? `<span>${kx.produkte.length} Produkt${kx.produkte.length === 1 ? "" : "e"}: ${kx.produkte.map(p => esc(p.name)).join(", ")}</span>` : `<span>${mo.produkte.length} Produkte</span>`}
      <span class="gedimmt">Neue Regeln gelten für ${esc(kx.typ === "g" ? "die Gruppe " + kx.name : kx.typ === "p" ? kx.name : "alle Produkte")}.</span></div>
      <div class="row">${kx.produkte[0] ? `<button class="btn klein" type="button" data-act="stTesten" data-p="${kx.produkte[0].id}">Im Konfigurator testen</button>` : ""}<a class="btn klein" href="#studio-test">Modelltest</a></div></div>`;
    const body = t === "matrix" ? matrixAnsicht(mo, kx) : t === "tabellen" ? tabellenAnsicht(mo, kx) : t === "graph" ? graph(mo, kx) : regelListe(mo, kx);
    const neu = t === "tabellen" ? `<button class="btn primary" type="button" data-act="tNeu">Neue Kombinationstabelle</button>` : `<button class="btn primary" type="button" data-act="rNeu">Neue Regel</button>`;
    return kopf("Regeln", "Regeln sperren Werte, erlauben nur bestimmte Werte oder wählen Werte automatisch. Wählen Sie oben Produkt oder Produktgruppe; alle Ansichten und neuen Regeln beziehen sich darauf.", ro() ? "" : neu) + leiste + tabs + body;
  });
  K.act.regelTab = el => { K.st.regelTab = el.dataset.t; K.render(); };

  /* ---------- Liste mit grafischen Regelkarten ---------- */
  const TYP = { sperren: ["sperrt", "sperren"], nurErlauben: ["erlaubt nur", "nur"], setzen: ["wählt automatisch", "setzen"] };
  const wertChips = (mo, mid, ids, klasse = "") => { const m = E.merkmal(mo, mid); return `<span class="rf-merkmal">${esc(m?.name || "…")}</span>${(ids || []).map(id => `<span class="rf-chip ${klasse}">${esc(E.wert(mo, mid, id)?.name || id)}${E.wert(mo, mid, id)?.code ? ` <code>${esc(E.wert(mo, mid, id).code)}</code>` : ""}</span>`).join("") || `<span class="rf-chip leer">…</span>`}`; };
  function regelBild(mo, r) {
    if (r.typ === "tabelle") {
      const t = r.tabelle || { merkmale: [], zeilen: [] };
      return `<div class="rflow"><span class="rf-wort tab">TABELLE</span>${t.merkmale.map(m => `<span class="rf-merkmal">${esc(E.merkmal(mo, m)?.name || m)}</span>`).join('<span class="rf-x">×</span>')}<span class="rf-pfeil">→</span><span class="rf-typ nur">${t.zeilen.length} Kombinationen erlaubt</span></div>`;
    }
    const wenn = (r.wenn || []).map((c, i) => `${i ? '<span class="rf-und">und</span>' : ""}<span class="rf-bed${c.op === "istNicht" ? " nicht" : ""}">${c.op === "istNicht" ? '<span class="rf-nicht">nicht</span>' : ""}${wertChips(mo, c.merkmal, c.werte)}</span>`).join("");
    const [t, k] = TYP[r.dann?.typ] || TYP.sperren;
    return `<div class="rflow"><span class="rf-wort">WENN</span>${wenn}<span class="rf-pfeil">→</span><span class="rf-typ ${k}">${t}</span><span class="rf-bed">${wertChips(mo, r.dann?.merkmal, r.dann?.werte, k)}</span></div>`;
  }
  function regelListe(mo, kx) {
    const f = K.st.regelFilter, q = f.suche.toLowerCase();
    const liste = mo.regeln.filter(r => r.typ !== "tabelle" && regelImKontext(mo, r, kx) && (!K.st.nurEigene || gleicherScope(r, kx.scope)) && (!f.merkmal || r.wenn.some(c => c.merkmal === f.merkmal) || r.dann?.merkmal === f.merkmal) && (!q || (r.id + r.name + E.satz(mo, r) + (r.hinweis || "")).toLowerCase().includes(q)));
    return `<div class="filterleiste">
      <select id="rf-m" data-act="rFilter" data-k="merkmal" aria-label="Nach Merkmal filtern">${merkmalOptionen(f.merkmal, "Alle Merkmale")}</select>
      <input type="search" id="rf-q" data-in="rSuche" placeholder="Regel, Code oder Text suchen" value="${esc(f.suche)}">
      ${kx.typ ? `<label class="haken klein"><input type="checkbox" data-act="nurEigene" ${K.st.nurEigene ? "checked" : ""}> nur hier angelegte (ohne geerbte)</label>` : ""}
      <span class="gedimmt klein">${liste.length} Regeln · ${liste.filter(r => r.aktiv).length} aktiv</span></div>
      <div class="regelkarten">${liste.map(r => regelKarte(mo, r)).join("") || `<div class="leer">Keine Regeln für diese Auswahl.${ro() ? "" : `<br><br><button class="btn primary" type="button" data-act="rNeu">Erste Regel anlegen</button>`}</div>`}</div>`;
  }
  K.act.nurEigene = el => { K.st.nurEigene = el.checked; K.render(); };
  K.act.rFilter = el => { K.st.regelFilter[el.dataset.k] = el.value; K.render(); };
  K.inp.rSuche = el => { K.st.regelFilter.suche = el.value; K.render(); };
  function regelKarte(mo, r) {
    const offen = K.st.regelOffen === r.id, fehler = regelFehler(mo, r);
    let html = `<article class="regelkarte${r.aktiv ? "" : " inaktiv"}${offen ? " offen" : ""}">
      <div class="regelkopf">
        <label class="schalter" title="${r.aktiv ? "Regel ist aktiv" : "Regel ist inaktiv"}"><input type="checkbox" data-act="rAktiv" data-r="${r.id}" ${r.aktiv ? "checked" : ""} ${dis()}><span></span><span class="sr">aktiv</span></label>
        <button type="button" class="regeltitel" data-act="rOeffnen" data-r="${r.id}" aria-expanded="${offen}">
          <span class="rt-zeile"><span class="mono">${r.id}</span> <b>${esc(r.name || "Ohne Namen")}</b>${r.matrix ? ` <span class="chip">Matrix</span>` : ""}${r.quelle === "excel" ? ` <span class="chip">Excel</span>` : ""}<span class="chip scope${K.st.kontext && !gleicherScope(r, kontext(mo).scope) ? " geerbt" : ""}">${K.st.kontext && !gleicherScope(r, kontext(mo).scope) ? "geerbt · " : ""}${esc(scopeText(mo, r))}</span></span>
          ${regelBild(mo, r)}
          ${fehler.length ? `<span class="klein warntext">${esc(fehler[0])}</span>` : ""}</button>
      </div>`;
    if (offen) html += regelEditor(mo, r);
    return html + `</article>`;
  }
  function regelFehler(mo, r) {
    const f = [];
    if (!r.wenn.length || r.wenn.some(c => !c.merkmal || !c.werte.length)) f.push("Bedingung unvollständig");
    if (!r.dann?.merkmal || !r.dann.werte.length) f.push("Folge unvollständig");
    if (r.dann && r.wenn.some(c => c.merkmal === r.dann.merkmal)) f.push("Bedingung und Folge betreffen dasselbe Merkmal");
    return f;
  }
  function geltungChips(mo, r, act) {
    const g = r.gruppen || [], p = r.produkte || [];
    return `<div class="chipwahl"><button type="button" class="chipbtn" data-act="${act}" data-w="" aria-pressed="${!g.length && !p.length}" ${dis()}>Alle Produkte</button>
      ${mo.gruppen.map(x => `<button type="button" class="chipbtn gruppe" data-act="${act}" data-w="g:${x.id}" aria-pressed="${g.includes(x.id)}" ${dis()}>▸ ${esc(x.name)}</button>`).join("")}
      ${mo.produkte.map(x => `<button type="button" class="chipbtn" data-act="${act}" data-w="p:${x.id}" aria-pressed="${p.includes(x.id)}" ${dis()}>${esc(x.name)}</button>`).join("")}</div>`;
  }
  function geltungUmschalten(r, w) {
    if (!w) { r.produkte = []; r.gruppen = []; return; }
    const [t, id] = [w[0], w.slice(2)], key = t === "g" ? "gruppen" : "produkte";
    r[key] = r[key] || []; r[key] = r[key].includes(id) ? r[key].filter(x => x !== id) : [...r[key], id];
  }
  function regelEditor(mo, r) {
    const bed = r.wenn.map((c, i) => {
      const m = E.merkmal(mo, c.merkmal);
      return `<div class="bedingung"><span class="wort">${i ? "und" : "Wenn"}</span>
        <select id="rc-m-${i}" data-act="rcMerkmal" data-i="${i}" aria-label="Merkmal" ${dis()}>${merkmalOptionen(c.merkmal, "Merkmal wählen")}</select>
        <select id="rc-op-${i}" data-act="rcOp" data-i="${i}" aria-label="Vergleich" ${dis()}><option value="ist" ${c.op !== "istNicht" ? "selected" : ""}>ist</option><option value="istNicht" ${c.op === "istNicht" ? "selected" : ""}>ist nicht</option></select>
        ${r.wenn.length > 1 && !ro() ? `<button type="button" class="ikon gefahr" data-act="rcWeg" data-i="${i}" title="Bedingung entfernen">✕</button>` : ""}
        ${m ? chipWahl(m.werte, c.werte, "rcWert", `data-i="${i}"`) : ""}<span class="klein gedimmt">${c.werte.length > 1 ? "Eine der markierten Ausprägungen genügt." : ""}</span></div>`;
    }).join("");
    const dm = r.dann?.merkmal ? E.merkmal(mo, r.dann.merkmal) : null;
    return `<div class="regeleditor">
      <div class="formgitter"><div class="feld breit"><label for="r-name">Name</label><input id="r-name" data-in="rName" value="${esc(r.name || "")}" ${dis()}></div></div>
      <div class="baustein"><div class="eyebrow">Bedingung</div>${bed}${ro() ? "" : `<button class="btn klein" type="button" data-act="rcNeu">+ weitere Bedingung (und)</button>`}</div>
      <div class="baustein"><div class="eyebrow">Dann</div><div class="bedingung"><span class="wort">dann</span>
        <select id="rd-typ" data-act="rdTyp" aria-label="Art der Folge" ${dis()}><option value="sperren" ${r.dann?.typ === "sperren" ? "selected" : ""}>sperre bei</option><option value="nurErlauben" ${r.dann?.typ === "nurErlauben" ? "selected" : ""}>erlaube nur bei</option><option value="setzen" ${r.dann?.typ === "setzen" ? "selected" : ""}>wähle automatisch bei</option></select>
        <select id="rd-m" data-act="rdMerkmal" aria-label="Merkmal" ${dis()}>${merkmalOptionen(r.dann?.merkmal, "Merkmal wählen")}</select>
        ${dm ? chipWahl(dm.werte, r.dann.werte, "rdWert", "") : ""}</div></div>
      <div class="baustein"><div class="eyebrow">Gilt für</div>${geltungChips(mo, r, "rGeltung")}<span class="klein gedimmt">Eine Gruppe schließt alle Untergruppen und deren Produkte ein.</span></div>
      <div class="formgitter"><div class="feld breit"><label for="r-hinweis">Hinweis im Konfigurator (optional, sonst wird der Regelsatz gezeigt)</label><input id="r-hinweis" data-in="rHinweis" value="${esc(r.hinweis || "")}" ${dis()}></div></div>
      <p class="klein gedimmt">${esc(E.satz(mo, r))}</p>
      <div class="row">${ro() ? "" : `<button class="btn klein" type="button" data-act="rKopie">Duplizieren</button><button class="btn klein gefahr-text" type="button" data-act="rLoeschen">Löschen</button>`}
        <button class="btn klein" type="button" data-act="rTest">Im Konfigurator testen</button><button class="btn klein" type="button" data-act="rOeffnen" data-r="${r.id}">Schließen</button></div></div>`;
  }
  const regel = () => ent().regeln.find(r => r.id === K.st.regelOffen);
  const rText = r => `Regel ${r.id} geändert`;
  K.act.rOeffnen = el => { K.st.regelOffen = K.st.regelOffen === el.dataset.r ? null : el.dataset.r; K.render(); };
  K.act.rAktiv = el => { const r = ent().regeln.find(x => x.id === el.dataset.r); r.aktiv = el.checked; geaendert(`Regel ${r.id} ${r.aktiv ? "aktiviert" : "deaktiviert"}`); };
  K.inp.rName = el => { regel().name = el.value; geaendert(rText(regel()), false); };
  K.inp.rHinweis = el => { regel().hinweis = el.value; geaendert(rText(regel()), false); };
  K.act.rcMerkmal = el => { const c = regel().wenn[+el.dataset.i]; c.merkmal = el.value; c.werte = []; geaendert(rText(regel())); };
  K.act.rcOp = el => { regel().wenn[+el.dataset.i].op = el.value; geaendert(rText(regel())); };
  K.act.rcWert = el => { const c = regel().wenn[+el.dataset.i]; c.werte = c.werte.includes(el.dataset.w) ? c.werte.filter(x => x !== el.dataset.w) : [...c.werte, el.dataset.w]; geaendert(rText(regel())); };
  K.act.rcNeu = () => { regel().wenn.push({ merkmal: "", op: "ist", werte: [] }); geaendert(null); };
  K.act.rcWeg = el => { regel().wenn.splice(+el.dataset.i, 1); geaendert(rText(regel())); };
  K.act.rdTyp = el => { regel().dann.typ = el.value; geaendert(rText(regel())); };
  K.act.rdMerkmal = el => { regel().dann.merkmal = el.value; regel().dann.werte = []; geaendert(rText(regel())); };
  K.act.rdWert = el => { const d = regel().dann; d.werte = d.werte.includes(el.dataset.w) ? d.werte.filter(x => x !== el.dataset.w) : [...d.werte, el.dataset.w]; geaendert(rText(regel())); };
  K.act.rGeltung = el => { const r = regel(); geltungUmschalten(r, el.dataset.w); geaendert(rText(r)); };
  K.act.rNeu = () => {
    const mo = ent(), id = E.neueId("R", mo.regeln.map(r => r.id)), sc = kontext(mo).scope;
    const f = K.st.regelFilter.merkmal;
    mo.regeln.push({ id, name: "", aktiv: true, produkte: [...sc.produkte], gruppen: [...sc.gruppen], wenn: [{ merkmal: f || "", op: "ist", werte: [] }], dann: { typ: "sperren", merkmal: "", werte: [] }, hinweis: "" });
    K.st.regelTab = "liste"; K.st.regelOffen = id; K.st.regelFilter.suche = ""; geaendert(`Regel ${id} angelegt`);
    K.nach(v => v.querySelector(".regelkarte.offen")?.scrollIntoView({ block: "center" }));
  };
  K.act.rKopie = () => { const mo = ent(), r = K.clone(regel()); r.id = E.neueId("R", mo.regeln.map(x => x.id)); r.name = (r.name || "") + " (Kopie)"; r.aktiv = false; delete r.matrix; delete r.quelle; mo.regeln.push(r); K.st.regelOffen = r.id; geaendert(`Regel ${r.id} als Kopie angelegt`); };
  K.act.rLoeschen = () => { const r = regel(); ent().regeln = ent().regeln.filter(x => x.id !== r.id); K.st.regelOffen = null; geaendert(`Regel ${r.id} gelöscht`); };
  K.act.rTest = () => {
    const mo = ent(), r = regel(), kx = kontext(mo);
    const p = kx.produkte.find(x => E.imGeltungsbereich(mo, r, x) && r.wenn.every(c => E.hatMerkmal(mo, x, c.merkmal)));
    if (!p) return K.toast("Kein Produkt in dieser Auswahl erfüllt die Bedingungen der Regel.");
    const sel = E.standardSel(mo, p); for (const c of r.wenn) if (c.op === "ist" && c.werte[0]) { const m = E.merkmal(mo, c.merkmal); sel[c.merkmal] = m.typ === "mehrfach" ? [c.werte[0]] : c.werte[0]; }
    K.konfigOeffnen(p.id, sel, null, true);
  };

  /* ---------- Matrix (Code gegen Code) ---------- */
  // Zellzustand für "Wenn a gewählt, was gilt für b?" aus Sicht der Produkte im Kontext
  function matrixLage(mo, kx, aM, bM) {
    const prods = kx.produkte.filter(p => E.hatMerkmal(mo, p, aM.id) && E.hatMerkmal(mo, p, bM.id));
    const fremd = {}; // a -> b -> [regeln]
    for (const a of aM.werte) {
      fremd[a.id] = {};
      for (const p of prods) {
        const sel = E.standardSel(mo, p); sel[aM.id] = aM.typ === "mehrfach" ? [a.id] : a.id; if (bM.typ === "mehrfach") sel[bM.id] = [];
        const g = E.sperren(mo, p, sel), gs = E.gesetzt(mo, p, sel);
        for (const b of bM.werte) {
          const r = g[bM.id]?.[b.id] || gs[bM.id]?.[b.id];
          if (r) (fremd[a.id][b.id] ||= new Map()).set(r.id, { r, art: g[bM.id]?.[b.id] ? "sperrt" : "setzt" });
        }
      }
    }
    return { prods, fremd };
  }
  const eigeneRegel = (mo, sc, aM, a, bM, typ) => mo.regeln.find(r => r.matrix && r.typ !== "tabelle" && r.wenn.length === 1 && r.wenn[0].merkmal === aM && r.wenn[0].op === "ist" && r.wenn[0].werte.length === 1 && r.wenn[0].werte[0] === a && r.dann?.typ === typ && r.dann.merkmal === bM && gleicherScope(r, sc));
  function zelle(mo, kx, aM, a, bM, b, lage) {
    const sc = kx.scope;
    const sp = eigeneRegel(mo, sc, aM.id, a.id, bM.id, "sperren"), st = eigeneRegel(mo, sc, aM.id, a.id, bM.id, "setzen");
    const eigen = sp && sp.aktiv && sp.dann.werte.includes(b.id) ? "gesperrt" : st && st.aktiv && st.dann.werte.includes(b.id) ? "gesetzt" : null;
    const andere = [...(lage.fremd[a.id]?.[b.id] || new Map()).values()].filter(x => !x.r.matrix || !gleicherScope(x.r, sc) || !(x.r.wenn.length === 1 && x.r.wenn[0].merkmal === aM.id && x.r.wenn[0].werte.length === 1));
    let klasse = eigen || (andere.length ? (andere.some(x => x.art === "sperrt") ? "fremd" : "fremd gesetzt") : "frei");
    const titel = `${aM.name} „${a.name}“ → ${bM.name} „${b.name}“: ` + (eigen === "gesperrt" ? `ausgeschlossen (${sp.id}). Klick: wird automatisch gewählt.` : eigen === "gesetzt" ? `wird automatisch gewählt (${st.id}). Klick: wieder frei.` : andere.length ? `${andere.map(x => x.art + " durch " + x.r.id + (x.r.name ? " " + x.r.name : "")).join(", ")}. Nur in der Regel änderbar.` : "erlaubt. Klick: ausschließen.");
    const inhalt = eigen === "gesperrt" ? "✕" : eigen === "gesetzt" ? "●" : andere.length ? andere.map(x => x.r.id).join(" ") : "";
    return `<button type="button" class="mx ${klasse}" data-act="mxKlick" data-am="${aM.id}" data-a="${a.id}" data-bm="${bM.id}" data-b="${b.id}" title="${esc(titel)}" ${andere.length && !eigen || ro() ? "disabled" : ""}>${esc(inhalt)}</button>`;
  }
  function matrixAnsicht(mo, kx) {
    const mx = K.st.matrix, ms = kontextMerkmale(mo, kx);
    if (ms.length < 2) return `<div class="leer">In dieser Auswahl gibt es zu wenige Merkmale.</div>`;
    const modus = `<div class="segment" role="group" aria-label="Darstellung"><button type="button" data-act="mxModus" data-m="gesamt" aria-pressed="${mx.modus === "gesamt"}">Alle Codes</button><button type="button" data-act="mxModus" data-m="paar" aria-pressed="${mx.modus === "paar"}">Zwei Merkmale</button></div>`;
    const legende = `<div class="legende"><span><i class="mx frei"></i> erlaubt</span><span><i class="mx gesperrt">✕</i> ausgeschlossen</span><span><i class="mx gesetzt">●</i> wird automatisch gewählt</span><span><i class="mx fremd">R</i> durch andere Regel oder Tabelle</span><span><i class="mx diag"></i> gleiches Merkmal</span></div>`;
    const lesart = `<p class="klein gedimmt">Lesart: Ist der Code in der <b>Zeile</b> gewählt, gilt für den Code in der <b>Spalte</b> … Ein Klick schaltet um: erlaubt → ausgeschlossen → automatisch gewählt → erlaubt. Die Regeln gelten für <b>${esc(kx.name)}</b>.</p>`;
    if (mx.modus === "paar") {
      const A = ms.find(m => m.id === mx.a) || ms[0], B = ms.find(m => m.id === mx.b && m.id !== A.id) || ms.find(m => m.id !== A.id);
      const lage = matrixLage(mo, kx, A, B);
      const opt = (aktiv, k) => ms.map(m => `<option value="${m.id}" ${m.id === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("");
      return `<div class="filterleiste">${modus}<label class="inline">Zeilen <select id="mx-a" data-act="mxWahl" data-k="a">${opt(A.id)}</select></label><label class="inline">Spalten <select id="mx-b" data-act="mxWahl" data-k="b">${opt(B.id)}</select></label></div>${lesart}
        <div class="tabwrap matrixwrap"><table class="matrix"><thead><tr><th class="mx-ecke">${esc(A.name)} ↓ · ${esc(B.name)} →</th>${B.werte.map(b => `<th class="mx-kopf"><span>${esc(b.name)}</span></th>`).join("")}</tr></thead>
        <tbody>${A.werte.map(a => `<tr><th class="mx-zeile">${esc(a.name)}${a.code ? ` <code>${esc(a.code)}</code>` : ""}</th>${B.werte.map(b => `<td>${zelle(mo, kx, A, a, B, b, lage)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${legende}`;
    }
    // Gesamtmatrix: alle Codes aller Merkmale, nach Merkmal gruppiert
    const lagen = {}; for (const A of ms) for (const B of ms) if (A !== B) lagen[A.id + ">" + B.id] = matrixLage(mo, kx, A, B);
    const kopf1 = ms.map(m => `<th class="mx-gruppe" colspan="${m.werte.length}">${esc(m.name)}</th>`).join("");
    const kopf2 = ms.map(m => m.werte.map((w, j) => `<th class="mx-kopf${j === 0 ? " start" : ""}" title="${esc(m.name + ": " + w.name)}"><span>${esc(w.code || w.name)}</span></th>`).join("")).join("");
    const zeilen = ms.map(A => A.werte.map((a, i) => `<tr class="${i === 0 ? "start" : ""}">${i === 0 ? `<th class="mx-gruppe-z" rowspan="${A.werte.length}"><span>${esc(A.name)}</span></th>` : ""}<th class="mx-zeile" title="${esc(a.name)}">${esc(a.code || a.name)}<small>${esc(a.name)}</small></th>
      ${ms.map(B => B.werte.map((b, j) => `<td class="${j === 0 ? "start" : ""}">${A === B ? `<span class="mx diag"></span>` : zelle(mo, kx, A, a, B, b, lagen[A.id + ">" + B.id])}</td>`).join("")).join("")}</tr>`).join("")).join("");
    return `<div class="filterleiste">${modus}<span class="gedimmt klein">${ms.length} Merkmale, ${ms.reduce((n, m) => n + m.werte.length, 0)} Codes</span></div>${lesart}
      <div class="tabwrap matrixwrap gross"><table class="matrix gesamt"><thead><tr><th colspan="2" rowspan="2" class="mx-ecke">Wenn ↓ · dann →</th>${kopf1}</tr><tr>${kopf2}</tr></thead><tbody>${zeilen}</tbody></table></div>${legende}`;
  }
  K.act.mxModus = el => { K.st.matrix.modus = el.dataset.m; K.render(); };
  K.act.mxWahl = el => { K.st.matrix[el.dataset.k] = el.value; K.render(); };
  K.act.mxKlick = el => {
    const mo = ent(), kx = kontext(mo), sc = kx.scope, { am, a, bm, b } = el.dataset;
    const A = E.merkmal(mo, am), B = E.merkmal(mo, bm), an = E.wert(mo, am, a).name, bn = E.wert(mo, bm, b).name;
    const holen = typ => {
      let r = eigeneRegel(mo, sc, am, a, bm, typ);
      if (!r) { r = { id: E.neueId("M", mo.regeln.map(x => x.id)), name: `${A.name} „${an}“ ${typ === "setzen" ? "wählt" : "sperrt"} ${B.name}`, aktiv: true, matrix: true, produkte: [...sc.produkte], gruppen: [...sc.gruppen], wenn: [{ merkmal: am, op: "ist", werte: [a] }], dann: { typ, merkmal: bm, werte: [] }, hinweis: "" }; mo.regeln.push(r); }
      r.aktiv = true; return r;
    };
    const weg = (r, w) => { if (!r) return; r.dann.werte = r.dann.werte.filter(x => x !== w); if (!r.dann.werte.length) mo.regeln = mo.regeln.filter(x => x !== r); };
    const sp = eigeneRegel(mo, sc, am, a, bm, "sperren"), st = eigeneRegel(mo, sc, am, a, bm, "setzen");
    if (sp && sp.dann.werte.includes(b)) {
      weg(sp, b); const r = holen("setzen");
      if (B.typ !== "mehrfach") r.dann.werte = [b]; else if (!r.dann.werte.includes(b)) r.dann.werte.push(b);
      geaendert(`Matrix ${kx.name}: ${an} wählt ${bn} automatisch`);
    } else if (st && st.dann.werte.includes(b)) { weg(st, b); geaendert(`Matrix ${kx.name}: ${an} und ${bn} wieder frei`); }
    else { const r = holen("sperren"); r.dann.werte.push(b); geaendert(`Matrix ${kx.name}: ${an} schließt ${bn} aus`); }
  };

  /* ---------- Kombinationstabellen ---------- */
  const kombis = (mo, ms) => ms.reduce((acc, mid) => acc.flatMap(z => E.merkmal(mo, mid).werte.map(w => [...z, w.id])), [[]]);
  const zKey = z => z.join("|");
  function tabellenAnsicht(mo, kx) {
    const liste = mo.regeln.filter(r => r.typ === "tabelle" && regelImKontext(mo, r, kx));
    const offen = liste.find(r => r.id === K.st.tabOffen);
    const karten = liste.map(r => `<button type="button" class="tabkarte${r === offen ? " aktiv" : ""}${r.aktiv ? "" : " inaktiv"}" data-act="tOeffnen" data-r="${r.id}">
      <span class="rt-zeile"><span class="mono">${r.id}</span> <b>${esc(r.name || "Kombinationstabelle")}</b><span class="chip scope">${esc(scopeText(mo, r))}</span></span>${regelBild(mo, r)}</button>`).join("");
    const erkl = `<p class="klein gedimmt">Eine Kombinationstabelle legt fest, welche Wertekombinationen mehrerer Merkmale zusammen erlaubt sind (wie eine Variantentabelle). Alles, was nicht angehakt ist, kann der Vertrieb nicht kombinieren. Ideal für Abhängigkeiten wie Achsanzahl × Bereifung × Achslast.</p>`;
    return `${erkl}<div class="tab-layout"><div class="tabliste">${karten || `<div class="leer klein">Noch keine Kombinationstabelle für ${esc(kx.name)}.</div>`}</div>
      <div class="tabeditor">${offen ? tabellenEditor(mo, kx, offen) : `<div class="leer">Tabelle links wählen oder neu anlegen.</div>`}</div></div>`;
  }
  function tabellenEditor(mo, kx, r) {
    const km = Object.fromEntries(kontextMerkmale(mo, kx).map(m => [m.id, m]));
    const t = r.tabelle, ms = t.merkmale.map(id => km[id] || E.merkmal(mo, id)).filter(Boolean), erlaubt = new Set(t.zeilen.map(zKey));
    const waehlbar = kontextMerkmale(mo, kx).filter(m => m.typ !== "mehrfach");
    let gitter = "";
    if (ms.length === 2) {
      const [A, B] = ms;
      gitter = `<div class="tabwrap matrixwrap"><table class="matrix kombi"><thead><tr><th class="mx-ecke">${esc(A.name)} ↓ · ${esc(B.name)} →</th>${B.werte.map(b => `<th class="mx-kopf"><button type="button" class="kopfknopf" data-act="tSpalte" data-b="${b.id}" title="Ganze Spalte umschalten" ${dis()}><span>${esc(b.name)}</span></button></th>`).join("")}</tr></thead>
        <tbody>${A.werte.map(a => `<tr><th class="mx-zeile"><button type="button" class="kopfknopf" data-act="tZeile" data-a="${a.id}" title="Ganze Zeile umschalten" ${dis()}>${esc(a.name)}</button></th>${B.werte.map(b => { const k = zKey([a.id, b.id]), an = erlaubt.has(k); return `<td><button type="button" class="mx ${an ? "erlaubt" : "aus"}" data-act="tZelle" data-k="${esc(k)}" aria-pressed="${an}" title="${esc(a.name + " + " + b.name + (an ? ": erlaubt" : ": nicht erlaubt"))}" ${dis()}>${an ? "✓" : ""}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
    } else if (ms.length > 2) {
      const alle = ms.reduce((acc, m) => acc.flatMap(z => m.werte.map(w => [...z, w.id])), [[]]), zuviel = alle.length > 400;
      gitter = zuviel ? `<div class="hinweis warn">${alle.length} mögliche Kombinationen sind zu viele für die Ansicht. Bitte höchstens ${ms.length - 1} Merkmale verwenden oder Werte über das Produkt einschränken.</div>`
        : `<div class="tabwrap kombiliste"><table class="kompakt"><thead><tr>${ms.map(m => `<th>${esc(m.name)}</th>`).join("")}<th class="r">Erlaubt</th></tr></thead><tbody>
        ${alle.map(z => { const k = zKey(z), an = erlaubt.has(k); return `<tr class="${an ? "" : "aus"}">${z.map((w, i) => `<td>${esc(E.wert(mo, t.merkmale[i], w)?.name || w)}</td>`).join("")}<td class="r"><button type="button" class="mx ${an ? "erlaubt" : "aus"}" data-act="tZelle" data-k="${esc(k)}" aria-pressed="${an}" ${dis()}>${an ? "✓" : ""}</button></td></tr>`; }).join("")}</tbody></table></div>`;
    }
    const tote = ms.flatMap((m, i) => m.werte.filter(w => !t.zeilen.some(z => z[i] === w.id)).map(w => w.name));
    return `<div class="panel">
      <div class="row zwischen"><label class="schalter" title="aktiv"><input type="checkbox" data-act="tAktiv" ${r.aktiv ? "checked" : ""} ${dis()}><span></span><span class="sr">aktiv</span></label>
        <input id="t-name" class="flach titelfeld" data-in="tName" value="${esc(r.name || "")}" placeholder="Name der Tabelle" ${dis()}>
        ${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="tLoeschen">Löschen</button>`}</div>
      <div class="baustein"><div class="eyebrow">Merkmale der Tabelle (2 bis 4)</div><div class="chipwahl">${waehlbar.map(m => `<button type="button" class="chipbtn" data-act="tMerkmal" data-m="${m.id}" aria-pressed="${t.merkmale.includes(m.id)}" ${dis()}>${esc(m.name)}</button>`).join("")}</div></div>
      <div class="baustein"><div class="eyebrow">Gilt für</div>${geltungChips(mo, r, "tGeltung")}</div>
      ${ms.length >= 2 ? `<div class="row zwischen"><span><b>${t.zeilen.length}</b> von ${kombis(mo, t.merkmale).length} Kombinationen erlaubt</span>${ro() ? "" : `<span class="row"><button class="btn klein" type="button" data-act="tAlle" data-an="1">Alle erlauben</button><button class="btn klein" type="button" data-act="tAlle" data-an="0">Alle sperren</button></span>`}</div>${gitter}
        ${tote.length ? `<div class="hinweis warn">Nie wählbar: ${tote.map(esc).join(", ")}</div>` : ""}` : `<div class="leer klein">Bitte mindestens zwei Merkmale wählen.</div>`}
    </div>`;
  }
  const tab = () => ent().regeln.find(r => r.id === K.st.tabOffen);
  const tText = () => `Kombinationstabelle ${tab().id} geändert`;
  K.act.tOeffnen = el => { K.st.tabOffen = el.dataset.r; K.render(); };
  K.act.tNeu = () => {
    const mo = ent(), kx = kontext(mo), ms = kontextMerkmale(mo, kx).filter(m => m.typ !== "mehrfach").slice(0, 2).map(m => m.id);
    const id = E.neueId("T", mo.regeln.map(r => r.id));
    mo.regeln.push({ id, name: "Neue Kombinationstabelle", aktiv: true, typ: "tabelle", produkte: [...kx.scope.produkte], gruppen: [...kx.scope.gruppen], tabelle: { merkmale: ms, zeilen: kombis(mo, ms) } });
    K.st.regelTab = "tabellen"; K.st.tabOffen = id; geaendert(`Kombinationstabelle ${id} angelegt`);
  };
  K.inp.tName = el => { tab().name = el.value; geaendert(tText(), false); };
  K.act.tAktiv = el => { tab().aktiv = el.checked; geaendert(tText()); };
  K.act.tLoeschen = () => { const r = tab(); ent().regeln = ent().regeln.filter(x => x !== r); K.st.tabOffen = null; geaendert(`Kombinationstabelle ${r.id} gelöscht`); };
  K.act.tGeltung = el => { geltungUmschalten(tab(), el.dataset.w); geaendert(tText()); };
  K.act.tMerkmal = el => {
    const mo = ent(), t = tab().tabelle, m = el.dataset.m;
    if (t.merkmale.includes(m)) { // Spalte entfernen, Zeilen zusammenfassen
      const i = t.merkmale.indexOf(m); t.merkmale.splice(i, 1);
      const neu = new Map(); for (const z of t.zeilen) { const k = z.filter((_, j) => j !== i); neu.set(zKey(k), k); } t.zeilen = [...neu.values()];
    } else {
      if (t.merkmale.length >= 4) return K.toast("Höchstens vier Merkmale je Tabelle.");
      const werte = E.merkmal(mo, m).werte.map(w => w.id); t.merkmale.push(m);
      t.zeilen = t.merkmale.length === 1 ? werte.map(w => [w]) : t.zeilen.flatMap(z => werte.map(w => [...z, w]));
      if (t.merkmale.length === 2 && !t.zeilen.length) t.zeilen = kombis(mo, t.merkmale);
    }
    geaendert(tText());
  };
  K.act.tZelle = el => { const t = tab().tabelle, k = el.dataset.k; const i = t.zeilen.findIndex(z => zKey(z) === k); if (i >= 0) t.zeilen.splice(i, 1); else t.zeilen.push(k.split("|")); geaendert(tText()); };
  K.act.tZeile = el => { const mo = ent(), t = tab().tabelle, a = el.dataset.a, bs = E.merkmal(mo, t.merkmale[1]).werte.map(w => w.id); const alle = bs.every(b => t.zeilen.some(z => z[0] === a && z[1] === b)); t.zeilen = t.zeilen.filter(z => z[0] !== a); if (!alle) for (const b of bs) t.zeilen.push([a, b]); geaendert(tText()); };
  K.act.tSpalte = el => { const mo = ent(), t = tab().tabelle, b = el.dataset.b, as = E.merkmal(mo, t.merkmale[0]).werte.map(w => w.id); const alle = as.every(a => t.zeilen.some(z => z[0] === a && z[1] === b)); t.zeilen = t.zeilen.filter(z => z[1] !== b); if (!alle) for (const a of as) t.zeilen.push([a, b]); geaendert(tText()); };
  K.act.tAlle = el => { const mo = ent(), t = tab().tabelle; t.zeilen = el.dataset.an === "1" ? kombis(mo, t.merkmale) : []; geaendert(tText()); };

  /* ---------- Regelgraph (geschichtet: Ursache links, Wirkung rechts) ---------- */
  function graph(mo, kx) {
    const regeln = mo.regeln.filter(r => regelImKontext(mo, r, kx));
    const kanten = []; // {von, nach, r, art}
    for (const r of regeln) {
      if (r.typ === "tabelle") { const ms = r.tabelle?.merkmale || []; for (let i = 0; i < ms.length - 1; i++) kanten.push({ von: ms[i], nach: ms[i + 1], r, art: "tabelle" }); continue; }
      for (const c of r.wenn || []) if (c.merkmal && r.dann?.merkmal && c.merkmal !== r.dann.merkmal) kanten.push({ von: c.merkmal, nach: r.dann.merkmal, r, art: r.dann.typ });
    }
    const ids = [...new Set(kanten.flatMap(k => [k.von, k.nach]))].filter(id => E.merkmal(mo, id));
    if (!ids.length) return `<div class="leer">Für ${esc(kx.name)} gibt es noch keine Regeln.</div>`;
    // Ebenen: längster Weg von den Ursachen aus (Kreise werden abgebrochen)
    const rang = Object.fromEntries(ids.map(id => [id, 0]));
    for (let i = 0; i < ids.length; i++) { let geaendert2 = false; for (const k of kanten) if (k.art !== "tabelle" && rang[k.nach] < rang[k.von] + 1 && rang[k.von] + 1 < ids.length) { rang[k.nach] = rang[k.von] + 1; geaendert2 = true; } if (!geaendert2) break; }
    const spalten = []; for (const id of ids) (spalten[rang[id]] ||= []).push(id);
    const reihenfolge = mo.merkmale.map(m => m.id); spalten.forEach(s => s && s.sort((a, b) => reihenfolge.indexOf(a) - reihenfolge.indexOf(b)));
    const BW = 180, BH = 42, DX = 400, DY = 76, X0 = 30, Y0 = 50;
    const hoehe = Math.max(...spalten.map(s => (s || []).length)) * DY + Y0 + 30, breite = X0 * 2 + (spalten.length - 1) * DX + BW;
    const pos = {}; spalten.forEach((s, i) => (s || []).forEach((id, j) => { const off = (hoehe - Y0 - 30 - s.length * DY) / 2; pos[id] = { x: X0 + i * DX, y: Y0 + off + j * DY }; }));
    const fokus = K.st.graphFokus && ids.includes(K.st.graphFokus) ? K.st.graphFokus : null;
    const verbunden = k => !fokus || k.von === fokus || k.nach === fokus;
    const farbe = { sperren: "var(--bad)", nurErlauben: "var(--info)", setzen: "var(--ok)", tabelle: "#7a4fb5" };
    // gleiche Kanten bündeln
    const buendel = new Map(); for (const k of kanten) { const key = k.von + ">" + k.nach + ">" + k.art; if (!buendel.has(key)) buendel.set(key, { ...k, rs: [] }); buendel.get(key).rs.push(k.r); }
    let svg = `<defs>${Object.entries(farbe).map(([a, f]) => `<marker id="pf-${a}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${f}"/></marker>`).join("")}</defs>`;
    spalten.forEach((s, i) => { svg += `<text x="${X0 + i * DX + BW / 2}" y="22" text-anchor="middle" class="g-spalte">${i === 0 ? "Auslöser" : i === spalten.length - 1 ? "Wirkung" : "Stufe " + (i + 1)}</text>`; });
    let n = 0; const zielZahl = {};
    for (const k of buendel.values()) {
      const a = pos[k.von], b = pos[k.nach]; if (!a || !b) continue;
      const vorwaerts = b.x > a.x;
      const x1 = vorwaerts ? a.x + BW : a.x + BW / 2, y1 = vorwaerts ? a.y + BH / 2 : a.y, x2 = vorwaerts ? b.x : b.x + BW / 2, y2 = vorwaerts ? b.y + BH / 2 : b.y + (b.y >= a.y ? 0 : BH);
      const d = vorwaerts ? `M${x1} ${y1} C${x1 + 140} ${y1} ${x2 - 140} ${y2} ${x2} ${y2}` : `M${x1} ${y1} C${x1 + 30} ${y1 - 60 - (n % 3) * 14} ${x2 + 30} ${y2 - 60 - (n % 3) * 14} ${x2} ${y2}`;
      const aktiv = k.rs.some(r => r.aktiv), dim = !verbunden(k);
      svg += `<path d="${d}" fill="none" stroke="${farbe[k.art] || "var(--muted)"}" stroke-width="${1.4 + Math.min(k.rs.length, 4) * .5}" ${aktiv ? "" : 'stroke-dasharray="4 4"'} ${k.art === "tabelle" ? 'stroke-dasharray="7 3"' : ""} marker-end="${k.art === "tabelle" ? "" : `url(#pf-${k.art})`}" class="g-kante${dim ? " dim" : ""}"/>`;
      // Beschriftung nahe am Ziel, damit sich Kanten aus demselben Merkmal nicht überlagern
      const bz = (t, p0, p1, p2, p3) => (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3;
      zielZahl[k.nach] = (zielZahl[k.nach] || 0) + 1; const tl = Math.max(.25, .82 - (zielZahl[k.nach] - 1) * .17);
      const lx = vorwaerts ? bz(tl, x1, x1 + 140, x2 - 140, x2) : (x1 + x2) / 2 + 15, ly = vorwaerts ? bz(tl, y1, y1, y2, y2) : Math.min(y1, y2) - 48 - (n % 3) * 10;
      const txt = k.rs.slice(0, 3).map(r => r.id).join(" ") + (k.rs.length > 3 ? ` +${k.rs.length - 3}` : "");
      svg += `<g class="g-label${dim ? " dim" : ""}" data-act="graphRegel" data-r="${k.rs[0].id}" role="button" tabindex="0"><rect x="${lx - txt.length * 3.4 - 6}" y="${ly - 9}" width="${txt.length * 6.8 + 12}" height="18" rx="9" fill="var(--surface)" stroke="${farbe[k.art]}"/><text x="${lx}" y="${ly + 4}" text-anchor="middle">${esc(txt)}</text></g>`;
      n++;
    }
    for (const id of ids) {
      const m = E.merkmal(mo, id), p = pos[id], anz = kanten.filter(k => k.von === id || k.nach === id).length, dim = fokus && fokus !== id && !kanten.some(k => (k.von === fokus && k.nach === id) || (k.nach === fokus && k.von === id));
      svg += `<g class="g-knoten${fokus === id ? " fokus" : ""}${dim ? " dim" : ""}" data-act="graphMerkmal" data-m="${id}" role="button" tabindex="0"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="6"/>
        <text x="${p.x + 12}" y="${p.y + 17}" class="g-name">${esc(m.name.length > 22 ? m.name.slice(0, 21) + "…" : m.name)}</text><text x="${p.x + 12}" y="${p.y + 31}" class="g-zahl">${m.werte.length} Werte · ${anz} Beziehungen</text></g>`;
    }
    const fokusRegeln = fokus ? regeln.filter(r => r.typ === "tabelle" ? r.tabelle?.merkmale.includes(fokus) : (r.wenn.some(c => c.merkmal === fokus) || r.dann?.merkmal === fokus)) : [];
    return `<div class="legende" style="margin-bottom:8px"><span><i class="g-leg" style="background:var(--bad)"></i> sperrt</span><span><i class="g-leg" style="background:var(--info)"></i> erlaubt nur</span><span><i class="g-leg" style="background:var(--ok)"></i> wählt automatisch</span><span><i class="g-leg" style="background:#7a4fb5"></i> Kombinationstabelle</span><span class="gedimmt">Gestrichelt: inaktiv. Merkmal anklicken zeigt seine Beziehungen.</span></div>
      <div class="graph-layout"><div class="panel graphwrap"><svg viewBox="0 0 ${breite} ${hoehe}" width="${breite}" height="${hoehe}" style="width:${breite}px;max-width:none;min-width:0" role="img" aria-label="Regelgraph">${svg}</svg></div>
      ${fokus ? `<aside class="panel graph-seite"><div class="panelkopf"><h3>${esc(E.merkmal(mo, fokus).name)}</h3><button class="ikon" type="button" data-act="graphMerkmal" data-m="" title="Auswahl aufheben">✕</button></div>
        <ul class="regelliste">${fokusRegeln.map(r => `<li><button type="button" class="link" data-act="graphRegel" data-r="${r.id}">${r.id}</button><span>${esc(E.satz(mo, r))}</span></li>`).join("")}</ul>
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="graphNeu" data-m="${fokus}">Neue Regel mit ${esc(E.merkmal(mo, fokus).name)}</button>`}</aside>` : ""}</div>`;
  }
  K.act.graphRegel = el => { const r = ent().regeln.find(x => x.id === el.dataset.r); if (r?.typ === "tabelle") { K.st.regelTab = "tabellen"; K.st.modellTab = "kombinationen"; K.st.tabOffen = r.id; } else { K.st.regelTab = "liste"; K.st.modellTab = "regeln"; K.st.regelOffen = el.dataset.r; K.st.regelFilter = { merkmal: "", suche: "" }; } K.render(); };
  K.act.graphMerkmal = el => { K.st.graphFokus = el.dataset.m && K.st.graphFokus !== el.dataset.m ? el.dataset.m : null; K.render(); };
  K.act.graphNeu = el => { K.st.regelFilter.merkmal = el.dataset.m; K.st.modellTab = "regeln"; K.act.rNeu(); };
  /* =====================================================================
     Modelltest
     ===================================================================== */
  K.route("studio-test", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const t = K.st.test; if (!E.produkt(mo, t.produkt)) t.produkt = mo.produkte[0]?.id;
    const r = t.res && t.res.produkt === t.produkt ? t.res : null;
    return kopf("Modelltest", "Rechnet alle Kombinationen eines Produkts durch und findet Widersprüche, unerreichbare Werte und Regeln, die nie greifen.") + `
      <div class="filterleiste"><select id="t-p" data-act="tProdukt" aria-label="Produkt">${mo.produkte.map(p => `<option value="${p.id}" ${p.id === t.produkt ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
        <button class="btn primary" type="button" data-act="tStart">Test starten</button><button class="btn" type="button" data-act="stTesten" data-p="${t.produkt}">Entwurf im Konfigurator öffnen</button></div>
      ${r ? `<div class="kpis">
        <div class="kpi"><b class="num">${K.zahl(r.total)}</b><span>Kombinationen${r.abgebrochen ? " (Teilprüfung)" : ""}</span></div>
        <div class="kpi"><b class="num">${K.zahl(r.gueltig)}</b><span>gültig (${K.zahl(r.gueltig / r.geprueft * 100, 1)} %)</span></div>
        <div class="kpi ${r.widersprueche ? "schlecht" : "gut"}"><b class="num">${K.zahl(r.widersprueche)}</b><span>Widersprüche</span></div>
        <div class="kpi ${r.tote.length ? "schlecht" : "gut"}"><b class="num">${r.tote.length}</b><span>unerreichbare Werte</span></div></div>
        ${r.widersprueche ? `<div class="hinweis warn">In ${K.zahl(r.widersprueche)} Kombinationen bleibt bei <b>${esc(r.beispielWiderspruch.merkmal)}</b> kein Wert übrig. Beispiel: ${esc(Object.entries(r.beispielWiderspruch.sel).filter(([, v]) => !Array.isArray(v)).map(([m, v]) => `${E.merkmal(mo, m)?.name} = ${E.wert(mo, m, v)?.name}`).join(", "))}</div>` : `<div class="hinweis ok">Keine Widersprüche: In jeder Kombination bleibt für jedes Merkmal mindestens ein Wert wählbar.</div>`}
        ${r.tote.length ? `<div class="hinweis warn"><b>Diese Werte kann man nie wählen:</b> ${r.tote.map(x => `${esc(x.merkmal)}: ${esc(x.wert)}`).join(" · ")}</div>` : ""}
        <section class="panel" style="margin-top:12px"><h3>Regelabdeckung</h3><div class="tabwrap ohne-rand"><table><thead><tr><th>Regel</th><th>Name</th><th class="r">Greift in Kombinationen</th><th>Bewertung</th></tr></thead><tbody>
          ${r.regeln.map(x => `<tr><td class="mono">${x.id}</td><td>${esc(x.name)}</td><td class="r num">${K.zahl(x.treffer)}</td><td>${x.treffer ? `<span class="chip st-angenommen">greift</span>` : x.nurMitZubehoer ? `<span class="chip">hängt von Ausstattung ab</span>` : `<span class="chip warn">greift nie</span>`}</td></tr>`).join("") || `<tr><td colspan="4" class="gedimmt">Keine Regeln für dieses Produkt.</td></tr>`}
        </tbody></table></div></section>` : `<div class="leer">Produkt wählen und Test starten.</div>`}`;
  });
  K.act.tProdukt = el => { K.st.test.produkt = el.value; K.render(); };
  K.act.tStart = el => {
    el.disabled = true; el.textContent = "Wird gerechnet …";
    setTimeout(() => { const mo = ent(), p = E.produkt(mo, K.st.test.produkt); const res = E.modelltest(mo, p); res.produkt = p.id; K.st.test.res = res; K.render(); }, 30);
  };

  /* =====================================================================
     Freigabe
     ===================================================================== */
  function unterschiede(alt, neu) {
    const out = [];
    const vergleich = (bereich, la, ln, name) => {
      const ma = new Map((la || []).map(x => [x.id, x])), mn = new Map((ln || []).map(x => [x.id, x]));
      for (const [id, x] of mn) { if (!ma.has(id)) out.push({ bereich, art: "neu", text: name(x) }); else if (JSON.stringify(ma.get(id)) !== JSON.stringify(x)) out.push({ bereich, art: "geändert", text: name(x) }); }
      for (const [id, x] of ma) if (!mn.has(id)) out.push({ bereich, art: "gelöscht", text: name(x) });
    };
    vergleich("Produkte", alt?.produkte, neu.produkte, x => x.name);
    vergleich("Merkmale", alt?.merkmale, neu.merkmale, x => x.name);
    vergleich("Regeln", alt?.regeln, neu.regeln, x => `${x.id} ${x.name || ""}`);
    vergleich("Gruppen", alt?.gruppen, neu.gruppen, x => x.name);
    return out;
  }
  K.unterschiede = unterschiede;
  K.freigabeOffen = () => S().entwurf && S().live ? unterschiede(S().live, S().entwurf).length : 0;
  K.route("studio-freigabe", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const lv = S().live, diff = unterschiede(lv, mo);
    const pruef = mo.produkte.map(p => ({ p, t: E.modelltest(mo, p, 60000) }));
    const probleme = pruef.filter(x => x.t.widersprueche || x.t.tote.length);
    const fehlArt = artikelFehlend(mo);
    const namen = K.namenCache || {};
    return kopf("Freigabe", "Der Vertrieb arbeitet immer mit der veröffentlichten Version. Änderungen im Studio werden erst mit einer neuen Version sichtbar.") + `
      <div class="zwei-spalten">
        <section class="panel"><div class="panelkopf"><h3>Änderungen im Entwurf</h3><span class="chip">${diff.length}</span></div>
          ${diff.length ? `<ul class="diffliste">${diff.map(d => `<li><span class="chip diff-${d.art === "neu" ? "neu" : d.art === "gelöscht" ? "weg" : "mod"}">${d.art}</span><span class="gedimmt">${d.bereich}</span> ${esc(d.text)}</li>`).join("")}</ul>` : `<p class="leer-klein">Der Entwurf entspricht der veröffentlichten Version ${lv?.version || ""}.</p>`}
          <h3 style="margin-top:16px">Automatische Prüfung</h3>
          ${fehlArt.length ? `<div class="hinweis warn"><b>${fehlArt.length} Artikelnummern fehlen im Artikelstamm:</b> ${fehlArt.slice(0, 30).map(x => `<code>${esc(x.code)}</code> <span class="gedimmt">(${esc(x.wo)})</span>`).join(", ")}${fehlArt.length > 30 ? " …" : ""}</div>` : K.Store.artikelQuelle ? `<div class="hinweis ok">Alle Codes, Fahrzeugnummern und Stücklisten-Artikel sind im Artikelstamm vorhanden.</div>` : ""}
          ${probleme.length ? probleme.map(x => `<div class="hinweis warn"><b>${esc(x.p.name)}:</b> ${x.t.widersprueche ? `${K.zahl(x.t.widersprueche)} Widersprüche. ` : ""}${x.t.tote.length ? `Unerreichbar: ${x.t.tote.map(t => esc(t.wert)).join(", ")}` : ""}</div>`).join("") : `<div class="hinweis ok">Alle ${pruef.length} Produkte ohne Widersprüche und ohne unerreichbare Werte.</div>`}
          ${ro() ? "" : `<div class="feld" style="margin-top:12px"><label for="fr-notiz">Was ändert sich? (für das Protokoll)</label><input id="fr-notiz" placeholder="z. B. Neue Rampen, Preise 2027"></div>
          <div class="row" style="margin-top:10px"><button class="btn gelb" type="button" data-act="veroeffentlichen" ${diff.length ? "" : "disabled"}>Version ${(lv?.version || 0) + 1} veröffentlichen</button><button class="btn" type="button" data-act="verwerfen" ${diff.length ? "" : "disabled"}>Entwurf verwerfen</button></div>`}
        </section>
        <section class="panel"><div class="panelkopf"><h3>Versionen</h3></div>
          <ul class="zeitachse">${S().releases.map(r => `<li class="${r.version === lv?.version ? "angenommen" : ""}"><time>${K.zeit(r.ts)}${r.von && namen[r.von] ? " · " + esc(namen[r.von]) : ""}</time><b>Version ${r.version}</b>${r.version === lv?.version ? " · aktuell im Vertrieb" : ""}<br><span class="klein gedimmt">${r.produkte} Produkte, ${r.merkmale} Merkmale, ${r.regeln} Regeln</span>${r.notiz ? `<q>${esc(r.notiz)}</q>` : ""}</li>`).join("") || "<li>Noch keine Version veröffentlicht.</li>"}</ul>
        </section></div>`;
  });
  K.act.veroeffentlichen = async el => { const n = document.getElementById("fr-notiz").value.trim(); el.disabled = true; await K.Store.veroeffentlichen(n); K.toast(`Version ${S().live.version} ist jetzt im Vertrieb aktiv`); K.render(); };
  K.act.verwerfen = () => K.sheet(`<h3>Entwurf verwerfen?</h3><p>Alle Änderungen seit Version ${S().live.version} gehen verloren.</p><div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="verwerfenOk">Verwerfen</button></div>`);
  K.act.verwerfenOk = async () => { K.sheetZu(); await K.Store.entwurfVerwerfen(); K.toast("Entwurf verworfen"); };

  /* =====================================================================
     Vorlagen (Angebotsdokument)
     ===================================================================== */
  K.route("studio-vorlagen-texte", () => {
    const e = S().einst; if (!e) return keinEntwurf();
    const v = e.vorlage, bsp = S().angebote[0];
    const feld = (k, t, z = 3) => `<div class="feld"><label for="v-${k}">${t}</label><textarea id="v-${k}" rows="${z}" data-in="vText" data-k="${k}" ${dis()}>${esc(v[k] || "")}</textarea>${bsp ? `<span class="klein gedimmt vorschau">Vorschau: ${esc(K.platzhalter(v[k], bsp, e)).slice(0, 220)}</span>` : ""}</div>`;
    const opt = (k, t) => `<label class="haken"><input type="checkbox" data-act="vOpt" data-k="${k}" ${v[k] ? "checked" : ""} ${dis()}> ${t}</label>`;
    return kopf("Vorlagen", "Standardtexte und Aufbau des Angebotsdokuments. Neue Angebote übernehmen diese Texte; im Angebot lassen sie sich einzeln anpassen.") + `
      <div class="angebot-layout"><div class="haupt"><section class="panel">
        ${feld("einleitung", "Einleitung", 4)}${feld("lieferung", "Lieferung", 2)}${feld("zahlung", "Zahlungsbedingungen", 2)}${feld("gewaehrleistung", "Gewährleistung", 2)}${feld("schluss", "Schlusstext", 3)}
      </section></div>
      <aside class="neben"><section class="panel"><h3>Inhalt des PDF</h3><div class="haken-liste">
        ${opt("zeigeBild", "3D-Ansicht jedes Fahrzeugs")}${opt("zeigeMerkmalpreise", "Preis je Merkmal")}${opt("zeigeStueckliste", "Stückliste als Anlage")}</div></section>
        <section class="panel"><h3>Platzhalter</h3><ul class="platzhalter">${["kunde.firma", "kunde.person", "angebot.nr", "angebot.datum", "angebot.gueltig", "bearbeiter.name", "bearbeiter.tel", "bearbeiter.mail", "firma.name"].map(p => `<li><code>{{${p}}}</code></li>`).join("")}</ul>
          <p class="klein gedimmt">Für Word-Vorlagen wie beim Document Designer bräuchte es eine serverseitige Dokumentenerzeugung. Der Prototyp erzeugt das PDF direkt im Browser.</p></section></aside></div>`;
  });
  K.inp.vText = el => { const e = S().einst; e.vorlage[el.dataset.k] = el.value; K.Store.einstSpeichern(e); };
  K.act.vOpt = el => { const e = S().einst; e.vorlage[el.dataset.k] = el.checked; K.Store.einstSpeichern(e); K.Store.log("Vorlagen", "PDF-Inhalt geändert"); };

  /* =====================================================================
     Einstellungen
     ===================================================================== */
  K.route("studio-einstellungen", () => {
    const e = S().einst; if (!e) return keinEntwurf();
    const f = (obj, k, t, typ = "text") => `<div class="feld"><label for="e-${obj}-${k}">${t}</label><input id="e-${obj}-${k}" type="${typ}" data-in="eFeld" data-o="${obj}" data-k="${k}" value="${esc(obj === "root" ? e[k] : e[obj][k])}" ${dis()}></div>`;
    const ich = S().prefs.vertrieb || "";
    return kopf("Einstellungen", "") + `
      <section class="panel"><h3>Firma</h3><div class="formgitter">${f("firma", "name", "Firmenname")}${f("firma", "strasse", "Straße")}${f("firma", "ort", "PLZ und Ort")}${f("firma", "tel", "Telefon")}${f("firma", "web", "Website")}${f("firma", "ustid", "USt-IdNr.")}</div></section>
      <section class="panel"><h3>Angebote</h3><div class="formgitter">${f("root", "gueltigTage", "Gültigkeit in Tagen", "number")}${f("root", "mwst", "Umsatzsteuer %", "number")}</div></section>
      ${nummernPanel(e, f)}
      <section class="panel"><div class="panelkopf"><h3>Vertrieb</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="vtNeu">+ Person</button>`}</div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Name</th><th>Telefon</th><th>E-Mail</th><th></th></tr></thead><tbody>
        ${e.vertrieb.map((v, i) => `<tr>${["name", "tel", "mail"].map(k => `<td><input id="vt-${i}-${k}" class="flach" data-in="vtFeld" data-i="${i}" data-k="${k}" value="${esc(v[k])}" aria-label="${k}" ${dis()}></td>`).join("")}<td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="vtWeg" data-i="${i}" title="Entfernen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>
        <div class="feld" style="max-width:320px;margin-top:12px"><label for="e-ich">Ich bin (für neue Angebote)</label><select id="e-ich" data-act="ichBin"><option value="">–</option>${e.vertrieb.map(v => `<option value="${v.id}" ${v.id === ich ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div></section>
      <section class="panel"><h3>Code-Kennzeichen</h3><p class="klein gedimmt">Gilt überall: Katalogaufbau, Liste einfügen und Excel-Import.</p>
        <div class="formgitter">${[["ueber", "Überschrift (im Angebot)", "ZZ"], ["option", "Untergruppe", "YY"], ["grund", "Grundausstattung (fest enthalten)", "GA"]].map(([k, n, d]) => `<div class="feld"><label for="ck-${k}">${n}</label><input id="ck-${k}" class="mono kurz" data-chg="ckFeld" data-k="${k}" value="${esc((e.codeKennung || {})[k] ?? d)}" ${dis()}></div>`).join("")}</div></section>
      <section class="panel"><h3>Daten</h3><p class="klein">Artikelstamm: ${K.Store.artikelQuelle === "applus" ? `${K.zahl(K.Store.artikel.size)} Artikel aus APplus (ARTIKEL)` : K.Store.artikelQuelle === "excel" ? `${K.zahl(K.Store.artikel.size)} Artikel aus dem Excel-Import (Blatt „Import“), gespeichert in diesem Browser. Mit einer Abfrage <code>queries.artikel</code> kommt der Stamm direkt aus APplus.` : K.Store.artikelQuelle === "beispiel" ? `${K.Store.artikel.size} Beispielartikel. Für echte Daten die Abfrage <code>queries.artikel</code> einrichten.` : "nicht geladen"}.</p><p class="klein">${K.Store.modus === "db" ? `Daten liegen im gemeinsamen Speicher dieser Seite und sind für alle sichtbar, die die Seite öffnen dürfen.${K.Store.schreiben ? "" : " Sie haben nur Leserechte."}` : K.Store.modus === "lokal" ? `${K.Store.applusQuellen ? `Stammdaten kommen aus ${K.Store.applusQuellen} APplus-Abfrage(n). ` : "Es sind keine APplus-Abfragen eingerichtet, es gelten die Beispieldaten. "}Angebote, Kunden und Änderungen im Studio werden in diesem Browser gespeichert (nur auf diesem Rechner).` : "Demo-Modus: Änderungen gehen beim Neuladen verloren."}</p>
        ${K.Store.modus === "lokal" ? `<div class="row"><button class="btn klein" type="button" data-act="lokalReset">Gespeicherte Daten in diesem Browser löschen</button><button class="btn klein" type="button" data-act="lokalNeu">APplus-Daten neu laden</button></div>` : ""}
        <p class="klein gedimmt">Für den Betrieb in APplus wird die Datenschicht (store.js) gegen Ihre Queries und Tabellen getauscht. Die Struktur steht in daten/demo.json.</p></section>`;
  });
  /* Angebotsnummern: eigener Nummernkreis oder aus APplus */
  function nummernPanel(e, f) {
    const z = Object.assign({ quelle: "app", abfrage: (K.cfg.queries || {}).angebotsnummer || "", feld: "", art: "naechste", ersatz: false }, e.nummern || {}), ap = z.quelle === "applus";
    const inp = (k, t, ph, hint) => `<div class="feld"><label for="nr-${k}">${t}</label><input id="nr-${k}" class="mono" data-chg="nrFeld" data-k="${k}" value="${esc(z[k] || "")}" placeholder="${esc(ph || "")}" ${dis()}>${hint ? `<span class="klein gedimmt">${hint}</span>` : ""}</div>`;
    return `<section class="panel"><h3>Nummern aus dem ERP</h3>
      <div class="formgitter">
        <div class="feld"><label for="nr-quelle">Angebotsnummer kommt aus</label><select id="nr-quelle" data-act="nrQuelle" ${dis()}><option value="app" ${!ap ? "selected" : ""}>eigenem Nummernkreis dieser App</option><option value="applus" ${ap ? "selected" : ""}>APplus (Nummernkreis des ERP)</option></select></div>
        ${ap ? `${inp("abfrage", "Abfrage (Dashboard-Query)", "z. B. KONF_ANGEBOTSNR", "liefert eine Zeile mit der Nummer")}${inp("feld", "Feld mit der Nummer", "automatisch", "leer = Feld NR, NUMMER, ANGEBOT … oder das erste")}
          <div class="feld"><label for="nr-art">Die Abfrage liefert</label><select id="nr-art" data-act="nrArt" ${dis()}><option value="naechste" ${z.art !== "hoechste" ? "selected" : ""}>die nächste freie Nummer</option><option value="hoechste" ${z.art === "hoechste" ? "selected" : ""}>die zuletzt vergebene Nummer (+1)</option></select></div>
          <div class="feld"><label>&nbsp;</label><label class="haken"><input type="checkbox" data-act="nrErsatz" ${z.ersatz ? "checked" : ""} ${dis()}> Wenn APplus nicht antwortet: vorläufige Nummer aus der App</label></div>`
        : `${f("root", "praefix", "Präfix")}${f("root", "naechsteNr", "Nächste Nummer", "number")}`}
      </div>
      <div class="row"><button class="btn klein" type="button" data-act="nrTest">Nächste Nummer abrufen (Test)</button><span id="nr-test" class="klein gedimmt"></span></div>
      <p class="klein gedimmt">Kundennummern kommen aus der Kunden-Abfrage (<code>queries.kunden</code>, ${S().kunden?.length || 0} Kunden${(K.cfg.queries || {}).kunden ? ", aus APplus" : ", Beispieldaten"}), Bearbeiter aus <code>queries.vertrieb</code>${e.vertriebQuelle === "applus" ? " (aus APplus geladen)" : " (nicht eingerichtet, Liste unten)"}, Artikel- und Vertriebscodes aus ARTIKEL. ${ap && !z.abfrage && typeof K.cfg.angebotsnummer !== "function" ? `<b class="warntext">Bitte eine Abfrage eintragen.</b>` : ""} Mit <code>KONF_CONFIG.angebotsnummer</code> kann statt der Abfrage auch eine Funktion die Nummer im ERP reservieren (z. B. über einen Webdienst).</p></section>`;
  }
  const nrSetzen = async (k, v) => { const e = S().einst; e.nummern = Object.assign({}, e.nummern || {}, { [k]: v }); await K.Store.einstSpeichern(e, true); K.Store.log("Einstellungen", "Nummernvergabe geändert"); K.render(); };
  K.act.nrQuelle = el => nrSetzen("quelle", el.value);
  K.act.nrArt = el => nrSetzen("art", el.value);
  K.act.nrErsatz = el => nrSetzen("ersatz", el.checked);
  K.inp.nrFeld = el => nrSetzen(el.dataset.k, el.value.trim());
  K.act.nrTest = async () => { const t = K.el("nr-test"); t.textContent = "frage ab …"; try { const r = await K.Store.naechsteNr(); t.innerHTML = `Nächste Nummer: <b class="mono">${esc(r.nr)}</b> (${r.quelle === "applus" ? "aus APplus" : r.quelle === "ersatz" ? "Ersatz, APplus: " + esc(r.fehler) : "eigener Nummernkreis"}). Sie wird erst beim Anlegen vergeben.`; } catch (err) { t.innerHTML = `<span class="warntext">${esc(err.message)}</span>`; } };
  K.act.lokalReset = () => K.sheet(`<h3>Daten in diesem Browser löschen?</h3><p>Angebote, Kunden und Studio-Änderungen, die nur hier gespeichert sind, gehen verloren. Danach gelten wieder die APplus- bzw. Beispieldaten.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="lokalResetOk">Löschen</button></div>`);
  K.act.lokalResetOk = async () => { K.sheetZu(); K.Store.lokalZuruecksetzen(); await K.Store.ladeLokal(); K.toast("Lokale Daten gelöscht"); K.render(); };
  K.act.lokalNeu = async () => { await K.Store.ladeLokal(); K.render(); K.toast(K.Store.ladefehler.length ? `${K.Store.ladefehler.length} Abfrage(n) fehlgeschlagen, Details in der Konsole` : "Daten neu geladen"); };
  K.inp.eFeld = el => { const e = S().einst, ziel = el.dataset.o === "root" ? e : e[el.dataset.o]; ziel[el.dataset.k] = el.type === "number" ? +el.value : el.value; K.Store.einstSpeichern(e); };
  K.inp.vtFeld = el => { const e = S().einst; e.vertrieb[+el.dataset.i][el.dataset.k] = el.value; K.Store.einstSpeichern(e); };
  K.act.vtNeu = () => { const e = S().einst; e.vertrieb.push({ id: K.id("v"), name: "", tel: "", mail: "" }); K.Store.einstSpeichern(e, true); K.render(); };
  K.act.vtWeg = el => { const e = S().einst; e.vertrieb.splice(+el.dataset.i, 1); K.Store.einstSpeichern(e, true); K.render(); };
  K.act.ichBin = async el => { const p = S().prefs; p.vertrieb = el.value; K.Store.meinVertrieb = el.value; if (K.Store.modus === "db" && K.Store.uid) await K.Store.db.doc("data/users/" + K.Store.uid + "/prefs").set(K.clone(p)).catch(() => {}); K.toast("Gespeichert"); };

  /* =====================================================================
     Protokoll
     ===================================================================== */
  K.prot = { bereich: "" };
  K.route("studio-protokoll", () => {
    const alle = S().protokoll.flatMap(p => p.eintraege).sort((a, b) => b.ts - a.ts);
    const bereiche = [...new Set(alle.map(x => x.bereich))];
    const liste = alle.filter(x => !K.prot.bereich || x.bereich === K.prot.bereich).slice(0, 300);
    const namen = K.namenCache || {};
    const fehlend = [...new Set(alle.map(x => x.von).filter(id => id && !(id in namen)))];
    if (fehlend.length) K.Store.namen(fehlend).then(n => { K.namenCache = { ...(K.namenCache || {}), ...n }; for (const id of fehlend) if (!(id in K.namenCache)) K.namenCache[id] = ""; K.render(); });
    return kopf("Protokoll", "Wer hat wann was geändert. Die letzten drei Monate.") + `
      <div class="filterleiste"><div class="segment">${[["", "Alle"], ...bereiche.map(b => [b, b])].map(([id, n]) => `<button type="button" data-act="protBereich" data-b="${esc(id)}" aria-pressed="${K.prot.bereich === id}">${esc(n)}</button>`).join("")}</div></div>
      ${liste.length ? `<div class="tabwrap"><table><thead><tr><th>Zeit</th><th>Bereich</th><th>Änderung</th><th>Von</th></tr></thead><tbody>
      ${liste.map(x => `<tr><td class="nowrap gedimmt">${K.zeit(x.ts)}</td><td><span class="chip">${esc(x.bereich)}</span></td><td>${esc(x.text)}</td><td class="gedimmt">${x.von ? esc(namen[x.von] || "Jemand") : "System"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="leer">Noch keine Einträge.</div>`}`;
  });
  K.act.protBereich = el => { K.prot.bereich = el.dataset.b; K.render(); };
  K.act.zuModell = el => { K.st.knoten = el.dataset.k; K.st.modellTab = "merkmale"; K.gehe("studio-modell"); };
  K.studio = { kontext, regelListe, matrixAnsicht, tabellenAnsicht, graph, stlTabelle, chipWahl, geaendert, bildFeld, bildHochladen, artKlasse, artTitel, gruppenOptionen, keinEntwurf, kopf, ro, dis, merkmalOptionen, gleicherScope,
    knotenObjekt: (mo, k) => !k ? null : k.startsWith("g:") ? mo.gruppen.find(g => g.id === k.slice(2)) : k.startsWith("p:") ? E.produkt(mo, k.slice(2)) : null };
})();
