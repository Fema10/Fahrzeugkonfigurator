/* =====================================================================
   Rechte: angemeldeten APplus-Benutzer erkennen, Rolle und sichtbare
   Familien/Fahrzeuge aus einer APplus-Abfrage, Ansicht Studio › Rechte.

   Abfrage „benutzer“ (Vorgabe apx_Benutzer): genau eine Zeile zum angemeldeten
     Benutzer, Spalten BENUTZER/LOGIN, PERSONAL, NAME (oder VORNAME+NACHNAME), EMAIL.
   Abfrage „rechte“ (Vorgabe apx_Rechte): je Zuordnung eine Zeile,
     BENUTZER (Login oder Personalnummer), ROLLE, FAMILIE, FAHRZEUG.
     ROLLE: Administrator | Produktmanagement | Vertriebsleitung | Vertrieb
     FAMILIE: Name oder Kennung einer Familie aus „Katalog aufbauen“ (mit Unterfamilien), * = alle
     FAHRZEUG: Artikelnummer eines einzelnen Fahrzeugs
   Ohne geladene Rechte-Abfrage gilt alles wie bisher (keine Einschränkung).

   Hinweis: Die Prüfung läuft im Browser. Sie steuert, was angezeigt wird,
   ersetzt aber keine Berechtigung in APplus selbst.
   ===================================================================== */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const ROLLEN = {
    admin: { name: "Administrator", stufe: 4, studio: true, einstellungen: true, rechte: true, alleFahrzeuge: true, alleAngebote: true },
    produkt: { name: "Produktmanagement", stufe: 3, studio: true, einstellungen: false, rechte: false, alleFahrzeuge: true, alleAngebote: false },
    leitung: { name: "Vertriebsleitung", stufe: 2, studio: false, einstellungen: false, rechte: false, alleFahrzeuge: true, alleAngebote: true },
    vertrieb: { name: "Vertrieb", stufe: 1, studio: false, einstellungen: false, rechte: false, alleFahrzeuge: false, alleAngebote: false },
    keine: { name: "kein Zugriff", stufe: 0, studio: false, einstellungen: false, rechte: false, alleFahrzeuge: false, alleAngebote: false }
  };
  const rolleAus = t => { const x = String(t || "").toLowerCase().replace(/[^a-zäöü]/g, ""); if (!x) return null;
    if (/^(admin|administrator|adm)/.test(x)) return "admin"; if (/^(produkt|pm|produktmanagement|produktmanager)/.test(x)) return "produkt";
    if (/(leitung|leiter|vl|vertriebsleitung)/.test(x)) return "leitung"; if (/^(vertrieb|vt|verkauf|au(ss|ß)endienst|innendienst)/.test(x)) return "vertrieb"; return null; };
  const norm = s => String(s ?? "").trim().toLowerCase();
  const spalten = z => { const n = {}; for (const [k, v] of Object.entries(z || {})) n[String(k).toLowerCase().replace(/[^a-z0-9]/g, "")] = v; const f = (...ks) => { for (const k of ks) if (n[k] != null && String(n[k]).trim() !== "") return String(n[k]).trim(); return ""; }; return f; };

  const schl = z => [z.benutzer, z.rolle || "", z.familie || "", z.fahrzeug || ""].map(norm).join("|");
  const lokal = () => (S().einst && S().einst.rechteLokal) || { plus: [], minus: [] };
  const R = K.Rechte = { aktiv: false, benutzer: null, rolle: "admin", familien: null, fahrzeuge: null, zeilen: [], meldung: "", simuliert: null };
  /** Rechte aus den Abfragen bestimmen. Ohne Rechte-Abfrage: keine Einschränkung. */
  R.bestimmen = () => {
    const bz = K.Store.benutzerZeilen, rz = K.Store.rechteZeilen;
    R.zeilenAPplus = (rz || []).map(z => { const f = spalten(z); return { benutzer: f("benutzer", "login", "username", "user", "personal", "personalnr"), rolle: rolleAus(f("rolle", "role", "gruppe")), familie: f("familie", "produktfamilie", "produktgruppe", "katalog"), fahrzeug: f("fahrzeug", "artikel", "produkt"), quelle: "applus" }; }).filter(z => z.benutzer);
    const lok = lokal(), weg = new Set((lok.minus || []).map(schl));
    R.zeilen = [...R.zeilenAPplus.filter(z => !weg.has(schl(z))), ...(lok.plus || []).map(z => ({ ...z, quelle: "lokal" }))];
    R.inhaber = [].concat((K.cfg && K.cfg.admins) || [], (S().einst && S().einst.rechteInhaber) || []).map(norm).filter(Boolean);
    if (bz && bz.length) { const f = spalten(bz[0]); R.benutzer = { login: f("benutzer", "login", "username", "user", "anmeldename"), personal: f("personal", "personalnr", "mitarbeiter", "kuerzel"), name: f("name") || [f("vorname"), f("nachname")].filter(Boolean).join(" "), mail: f("email", "mail"), mehrdeutig: bz.length > 1 }; }
    else R.benutzer = null;
    R.aktiv = !!rz || !!(lok.plus || []).length;
    if (R.simuliert) { const s0 = R.simuliert; R.simuliert = null; R.bestimmen(); R.echteRolle = R.rolle; R.simuliert = s0; } else R.echteRolle = null;
    const wer = R.simuliert || R.benutzer;
    if (!R.aktiv) { Object.assign(R, { rolle: "admin", familien: null, fahrzeuge: null, meldung: "" }); return R; }
    if (!wer) { Object.assign(R, { rolle: "keine", familien: new Set(), fahrzeuge: new Set(), meldung: bz ? "Die Benutzer-Abfrage hat keine Zeile geliefert." : "Der angemeldete Benutzer wird nicht erkannt: Die Benutzer-Abfrage fehlt oder ist nicht geladen." }); return R; }
    const ids = [wer.login, wer.personal, wer.mail].map(norm).filter(Boolean);
    R.istInhaber = !R.simuliert && ids.some(x => R.inhaber.includes(x));
    R.einstieg = !R.simuliert && !R.zeilen.some(z => z.rolle === "admin");
    if (R.istInhaber || R.einstieg) { Object.assign(R, { rolle: "admin", familien: null, fahrzeuge: null, meldung: R.istInhaber ? "" : "Es ist noch kein Administrator hinterlegt. Sie haben vorläufig Administratorrechte, bis einer vergeben ist.", meineZeilen: [] }); return R; }
    const meine = R.zeilen.filter(z => ids.includes(norm(z.benutzer)));
    if (!meine.length) { Object.assign(R, { rolle: "keine", familien: new Set(), fahrzeuge: new Set(), meldung: `Für ${wer.name || wer.login || wer.personal} ist in der Rechte-Abfrage nichts hinterlegt.` }); return R; }
    const rolle = meine.map(z => z.rolle || "vertrieb").sort((a, b) => ROLLEN[b].stufe - ROLLEN[a].stufe)[0];
    const fam = new Set(), fz = new Set(); let alle = false;
    for (const z of meine) { if (z.familie === "*" || norm(z.familie) === "alle") alle = true; else if (z.familie) fam.add(norm(z.familie)); if (z.fahrzeug) fz.add(norm(z.fahrzeug)); }
    Object.assign(R, { rolle, familien: alle || ROLLEN[rolle].alleFahrzeuge ? null : fam, fahrzeuge: alle || ROLLEN[rolle].alleFahrzeuge ? null : fz, meldung: "", meineZeilen: meine });
    return R;
  };
  R.darf = recht => !!(ROLLEN[R.rolle] || ROLLEN.keine)[recht];
  R.rollenName = r => (ROLLEN[r || R.rolle] || ROLLEN.keine).name;
  /** Darf der Benutzer dieses Fahrzeug sehen? Familien zählen mit allen Unterfamilien. */
  R.siehtProdukt = (mo, p) => {
    if (!R.familien && !R.fahrzeuge) return true; if (!p) return false;
    if (p.code && R.fahrzeuge.has(norm(p.code))) return true; if (R.fahrzeuge.has(norm(p.id))) return true;
    return E.gruppenPfad(mo, p.gruppe).some(g => R.familien.has(norm(g.name)) || R.familien.has(norm(g.id)));
  };
  /** Eigener Vertriebseintrag (für Bearbeiter und „eigene Angebote“) */
  R.meinVertrieb = () => {
    const wer = R.simuliert || R.benutzer, v = S().einst?.vertrieb || []; if (!wer) return null;
    const ids = [wer.personal, wer.login, wer.mail, wer.name].map(norm).filter(Boolean);
    return v.find(x => [x.nr, x.id, x.mail, x.name, x.id?.replace(/^p/, "")].map(norm).some(y => y && ids.includes(y))) || null;
  };
  R.istMeinAngebot = a => {
    const wer = R.simuliert || R.benutzer; if (!wer) return false; const mv = R.meinVertrieb();
    if (mv && a.bearbeiter === mv.id) return true;
    const ids = [wer.personal, wer.login, wer.mail].map(norm).filter(Boolean), b = a.bearbeiterInfo || {};
    return [a.erstelltVon, b.nr, b.mail].map(norm).some(y => y && ids.includes(y));
  };
  K.angeboteSichtbar = () => R.darf("alleAngebote") || !R.aktiv ? S().angebote : S().angebote.filter(R.istMeinAngebot);
  K.produktSichtbar = (mo, p) => !R.aktiv || R.siehtProdukt(mo, p);

  /* ---------- Zugriff je Seite ---------- */
  const STUDIO = /^studio-/, NUR_ADMIN = new Set(["studio-einstellungen", "studio-rechte"]);
  R.seiteErlaubt = route => {
    if (!R.aktiv || /^raum-/.test(route)) return true;
    if (route === "studio-rechte" && R.simuliert && R.echteRolle === "admin") return true;
    if (R.rolle === "keine") return false;
    if (route === "studio-rechte" && R.simuliert && R.echteRolle === "admin") return true;
    if (NUR_ADMIN.has(route)) return R.darf("einstellungen");
    if (STUDIO.test(route)) return R.darf("studio");
    if (/^angebot-/.test(route) && !R.darf("alleAngebote")) { const a = S().angebote.find(x => "angebot-" + x.nr === route); return !a || R.istMeinAngebot(a); }
    return true;
  };
  const keinZugriff = route => {
    const qs = K.Store.abfragen(), st = K.Store.abfrageStatus || {}, einrichten = R.rolle === "keine" && !R.benutzer;
    const zst = k => st[k] ? (st[k].fehler ? `<span class="warntext">${esc(st[k].fehler)}</span>` : `<span class="ok-text">${K.zahl(st[k].zeilen)} Zeilen</span>`) : `<span class="gedimmt">nicht abgefragt</span>`;
    return `<div class="leer recht-sperre"><h2>${R.rolle === "keine" ? "Kein Zugriff" : "Diese Seite ist für Ihre Rolle nicht freigegeben"}</h2>
    <p>${esc(R.meldung || `Angemeldet als ${R.benutzer?.name || R.benutzer?.login || "?"} (${R.rollenName()}).`)}</p>
    ${R.rolle === "keine" ? `<table class="kompakt recht-diag"><tbody>
      <tr><th>Benutzer-Abfrage</th><td>${einrichten ? `<input id="rz-benutzer" class="mono" data-chg="rechtAbfrage" data-k="benutzer" value="${esc(qs.benutzer || "")}" placeholder="z. B. CPQ_Benutzer">` : `<code>${esc(qs.benutzer || "–")}</code>`}</td><td>${zst("benutzer")}</td></tr>
      <tr><th>Rechte-Abfrage</th><td>${einrichten ? `<input id="rz-rechte" class="mono" data-chg="rechtAbfrage" data-k="rechte" value="${esc(qs.rechte || "")}" placeholder="z. B. CPQ_Berechtigungsdaten">` : `<code>${esc(qs.rechte || "–")}</code>`}</td><td>${zst("rechte")}</td></tr>
      <tr><th>Erkannt als</th><td colspan="2">${R.benutzer ? `${esc(R.benutzer.name || "")} <code>${esc(R.benutzer.personal || R.benutzer.login || "")}</code>` : "–"}</td></tr></tbody></table>
      ${einrichten ? `<p><button class="btn primary" type="button" data-act="lokalNeu">Neu laden</button> ${K.tip("Die Benutzer-Abfrage liefert eine Zeile zum angemeldeten Benutzer, z. B. PERSONAL, VORNAME, NAME. Die Rechte-Abfrage liefert BENUTZER (Personalnummer oder Login), ROLLE, FAMILIE, FAHRZEUG. Ist dort noch kein Administrator eingetragen, erhält der erste erkannte Benutzer vorläufig Administratorrechte.")}</p>` : ""}` : `<p><button class="btn" type="button" data-act="oeffne" data-ziel="katalog">Zum Katalog</button></p>`}</div>`;
  };
  K.inp.rechtAbfrage = async el => { const e = S().einst; e.abfragen = Object.assign({}, e.abfragen || {}, { [el.dataset.k]: el.value.trim() }); await K.Store.einstSpeichern(e, true); };
  R.sperre = keinZugriff;
  // Während der Vorschau oben eine Leiste mit „Vorschau beenden“
  const altRender = K.render;
  K.render = () => { altRender(); const v = K.el("konf-view"); if (v && R.simuliert && !v.querySelector(".recht-vorschau")) v.insertAdjacentHTML("afterbegin", `<div class="hinweis warn recht-vorschau"><b>Vorschau als ${esc(R.simuliert.login)}</b> (${esc(R.rollenName())}). So sieht dieser Benutzer die App. <button class="btn klein" type="button" data-act="rechtSimEnde">Vorschau beenden</button></div>`); };
  K.act.rechtSimEnde = () => { R.simuliert = null; R.bestimmen(); K.navBauen && K.navBauen(); K.gehe("studio-rechte"); };

  /* ---------- Rechte eines beliebigen Benutzers (für die Übersicht) ---------- */
  R.fuer = id => {
    const meine = R.zeilen.filter(z => norm(z.benutzer) === norm(id)); if (!meine.length) return { rolle: "keine", familien: new Set(), fahrzeuge: new Set(), alle: false };
    const rolle = meine.map(z => z.rolle || "vertrieb").sort((a, b) => ROLLEN[b].stufe - ROLLEN[a].stufe)[0], fam = new Set(), fz = new Set(); let alle = ROLLEN[rolle].alleFahrzeuge;
    for (const z of meine) { if (z.familie === "*" || norm(z.familie) === "alle") alle = true; else if (z.familie) fam.add(norm(z.familie)); if (z.fahrzeug) fz.add(norm(z.fahrzeug)); }
    return { rolle, familien: fam, fahrzeuge: fz, alle };
  };
  /** Wie sieht ein Benutzer eine Familie/ein Fahrzeug? "alle" (Rolle oder *), "direkt", "geerbt" (über Oberfamilie), "teil" (nur einzelne Fahrzeuge darin), "" */
  const sicht = (mo, r, art, o) => {
    if (r.rolle === "keine") return ""; if (r.alle) return "alle";
    if (art === "p") { if (r.fahrzeuge.has(norm(o.code)) || r.fahrzeuge.has(norm(o.id))) return "direkt"; return E.gruppenPfad(mo, o.gruppe).some(g => r.familien.has(norm(g.name)) || r.familien.has(norm(g.id))) ? "geerbt" : ""; }
    if (r.familien.has(norm(o.name)) || r.familien.has(norm(o.id))) return "direkt";
    if (E.gruppenPfad(mo, o.id).slice(0, -1).some(g => r.familien.has(norm(g.name)) || r.familien.has(norm(g.id)))) return "geerbt";
    return E.familienArtikel(mo, o.id).some(p => sicht(mo, r, "p", p)) ? "teil" : "";
  };
  const SYM = { alle: ['<span class="rd alle"></span>', "sieht alles (Rolle oder *)"], direkt: ['<span class="rd direkt"></span>', "zugeordnet"], geerbt: ['<span class="rd geerbt"></span>', "über übergeordnete Familie"], teil: ['<span class="rd teil"></span>', "nur einzelne Fahrzeuge darin"], "": ["", "sieht es nicht"] };
  const anzeigeName = id => { const b = R.benutzer; return b && [b.personal, b.login, b.mail].map(norm).includes(norm(id)) && b.name ? b.name.split(",").reverse().join(" ").trim() : id; };
  K.rmap = { fokusU: null, fokusZ: null, rolle: "", fahrzeuge: false };
  function karte() {
    const mo = S().live || S().entwurf; if (!mo) return "";
    const m = K.rmap, nutzer = [...new Set(R.zeilen.map(z => z.benutzer))].map(id => ({ id, r: R.fuer(id) })).filter(u => !m.rolle || u.r.rolle === m.rolle);
    const zeilen = [], tiefe = (gid, t) => { for (const g of mo.gruppen.filter(x => (x.eltern || "") === (gid || ""))) { zeilen.push({ art: "g", o: g, t }); tiefe(g.id, t + 1); if (m.fahrzeuge) for (const p of mo.produkte.filter(p => p.gruppe === g.id)) zeilen.push({ art: "p", o: p, t: t + 1 }); } };
    tiefe("", 0);
    if (!zeilen.length) return `<p class="gedimmt">Noch keine Familien im Katalog.</p>`;
    const fu = m.fokusU, fz = m.fokusZ, zKey = z => z.art + ":" + z.o.id, darfAendern = R.darf("rechte") && !R.simuliert;
    const info = fu ? (() => { const u = nutzer.find(x => x.id === fu) || { id: fu, r: R.fuer(fu) }, n = zeilen.filter(z => z.art === "g" && sicht(mo, u.r, "g", z.o)).length, pz = mo.produkte.filter(p => sicht(mo, u.r, "p", p)).length;
        return `<b>${esc(fu)}</b> · ${esc(R.rollenName(u.r.rolle))} · sieht ${u.r.alle ? "alle Fahrzeuge" : `${pz} Fahrzeug${pz === 1 ? "" : "e"} in ${n} Familie${n === 1 ? "" : "n"}`} · Angebote ${ROLLEN[u.r.rolle].alleAngebote ? "alle" : "eigene"}${ROLLEN[u.r.rolle].studio ? " · Studio" : ""} <button class="btn klein" type="button" data-act="rechtSim" data-u="${esc(fu)}">Ansicht testen</button>
        ${darfAendern ? `<select id="rmap-rolle-u" data-act="rmapRolleSetzen" data-u="${esc(fu)}" aria-label="Rolle von ${esc(fu)}">${["admin", "produkt", "leitung", "vertrieb"].map(k => `<option value="${k}" ${u.r.rolle === k ? "selected" : ""}>${ROLLEN[k].name}</option>`).join("")}</select><button class="btn klein gefahr-text" type="button" data-act="rmapUWeg" data-u="${esc(fu)}">Entfernen</button>` : ""}`; })()
      : fz ? (() => { const z = zeilen.find(x => zKey(x) === fz); if (!z) return ""; const wer = nutzer.filter(u => sicht(mo, u.r, z.art, z.o)); return `<b>${esc(z.o.name)}</b> sehen ${wer.length} von ${nutzer.length}: ${wer.map(u => esc(u.id)).join(", ") || "niemand"}`; })()
      : `<span class="gedimmt">Benutzer oder Familie anklicken</span>`;
    return `<div class="rmap-leiste"><div class="segment">${[["", "Alle"], ["admin", "Admin"], ["produkt", "Produkt"], ["leitung", "Leitung"], ["vertrieb", "Vertrieb"]].map(([k, n]) => `<button type="button" data-act="rmapRolle" data-r="${k}" aria-pressed="${m.rolle === k}">${n}</button>`).join("")}</div>
        <label class="haken klein"><input type="checkbox" data-act="rmapFz" ${m.fahrzeuge ? "checked" : ""}> Fahrzeuge</label>
        ${darfAendern ? `<span class="rmap-neu"><input id="rmap-neu-u" class="mono" placeholder="Personalnr. oder Login" aria-label="Neuer Benutzer"><select id="rmap-neu-r" aria-label="Rolle">${["vertrieb", "leitung", "produkt", "admin"].map(k => `<option value="${k}">${ROLLEN[k].name}</option>`).join("")}</select><button class="btn klein" type="button" data-act="rmapNeu">+ Benutzer</button></span>` : ""}
        <span class="rmap-legende klein">${["direkt", "geerbt", "teil", "alle"].map(k => `<span class="rleg">${SYM[k][0]} ${k === "alle" ? "alles über Rolle" : SYM[k][1]}</span>`).join("")}</span></div>
      ${aenderungenLeiste()}
      <div class="rmap-info" aria-live="polite">${info}</div>
      <div class="tabwrap rmap-wrap"><table class="rmap${fu ? " fokus-u" : ""}${fz ? " fokus-z" : ""}"><thead><tr><th class="rmap-ecke"></th>${nutzer.map(u => `<th class="rmap-u${u.id === fu ? " an" : ""}"><button type="button" data-act="rmapU" data-u="${esc(u.id)}" title="${esc(u.id)} · ${esc(R.rollenName(u.r.rolle))}"><span>${esc(anzeigeName(u.id))}</span><i class="rolle-${u.r.rolle}">${esc(R.rollenName(u.r.rolle).slice(0, 1))}</i></button></th>`).join("")}</tr></thead>
        <tbody>${zeilen.map(z => `<tr class="${zKey(z) === fz ? "an" : ""} ${z.art === "p" ? "fz" : ""}"><th style="--t:${z.t}"><button type="button" data-act="rmapZ" data-z="${zKey(z)}">${z.art === "g" ? "▤" : "▢"} ${esc(z.o.name)}</button></th>
          ${nutzer.map(u => { const v = sicht(mo, u.r, z.art, z.o), klick = darfAendern && !u.r.alle && v !== "geerbt"; return `<td class="${u.id === fu ? "an " : ""}rz ${v}${klick ? " klick" : ""}" title="${esc(u.id)} · ${esc(z.o.name)}: ${SYM[v][1]}${klick ? (v === "direkt" ? " · Klick entfernt" : " · Klick ordnet zu") : ""}"${klick ? ` data-act="rmapZelle" data-u="${esc(u.id)}" data-z="${zKey(z)}" tabindex="0" role="button"` : ""}>${SYM[v][0]}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function aenderungenLeiste() {
    const l = lokal(), n = (l.plus || []).length + (l.minus || []).length; if (!n) return "";
    return `<div class="hinweis warn rmap-aend"><b>${n} Änderung${n === 1 ? "" : "en"} nur in diesem Browser</b> ${K.tip("Die App kann noch nicht in APplus schreiben. Die Änderungen gelten sofort in diesem Browser. Damit sie für alle gelten, das SQL in APplus ausführen; mit der ASMX geht das später direkt.")}
      <button class="btn klein primary" type="button" data-act="rmapSql">SQL für APplus</button><button class="btn klein" type="button" data-act="rmapVerwerfen">Verwerfen</button></div>`;
  }
  const aendern = (fn, text) => { const e = S().einst, l = e.rechteLokal = K.clone(e.rechteLokal || { plus: [], minus: [] }); fn(l); K.Store.einstSpeichern(e, true).then(() => { R.bestimmen(); K.navBauen && K.navBauen(); K.render(); }); if (text) K.Store.log("Rechte", text); };
  const ohne = (l, z) => { if (z.quelle === "lokal") l.plus = l.plus.filter(x => schl(x) !== schl(z)); else if (!l.minus.some(x => schl(x) === schl(z))) l.minus.push({ benutzer: z.benutzer, rolle: z.rolle, familie: z.familie || "", fahrzeug: z.fahrzeug || "" }); };
  const mit = (l, z) => { const k = schl(z); if (l.minus.some(x => schl(x) === k)) l.minus = l.minus.filter(x => schl(x) !== k); else if (!R.zeilenAPplus.some(x => schl(x) === k) && !l.plus.some(x => schl(x) === k)) l.plus.push({ benutzer: z.benutzer, rolle: z.rolle, familie: z.familie || "", fahrzeug: z.fahrzeug || "" }); };
  const zeilenVon = u => R.zeilen.filter(z => norm(z.benutzer) === norm(u));
  K.act.rmapZelle = el => {
    const mo = S().live || S().entwurf, u = el.dataset.u, [art, id] = [el.dataset.z[0], el.dataset.z.slice(2)], o = art === "g" ? mo.gruppen.find(g => g.id === id) : E.produkt(mo, id); if (!o) return;
    const passt = z => art === "g" ? z.familie && (norm(z.familie) === norm(o.name) || norm(z.familie) === norm(o.id)) : z.fahrzeug && (norm(z.fahrzeug) === norm(o.code) || norm(z.fahrzeug) === norm(o.id));
    const treffer = zeilenVon(u).filter(passt), rolle = R.fuer(u).rolle === "keine" ? "vertrieb" : R.fuer(u).rolle;
    aendern(l => { if (treffer.length) treffer.forEach(z => ohne(l, z)); else mit(l, art === "g" ? { benutzer: u, rolle, familie: o.name } : { benutzer: u, rolle, fahrzeug: o.code || o.id }); }, `${u}: ${o.name} ${treffer.length ? "entzogen" : "zugeordnet"}`);
  };
  K.act.rmapRolleSetzen = el => { const u = el.dataset.u, r = el.value, alt = zeilenVon(u); aendern(l => { alt.forEach(z => ohne(l, z)); (alt.length ? alt : [{ benutzer: u }]).forEach(z => mit(l, { ...z, rolle: r })); }, `${u}: Rolle ${ROLLEN[r].name}`); };
  K.act.rmapUWeg = el => { const u = el.dataset.u; K.rmap.fokusU = null; aendern(l => zeilenVon(u).forEach(z => ohne(l, z)), `${u}: alle Rechte entfernt`); };
  K.act.rmapNeu = () => { const u = K.el("rmap-neu-u").value.trim(), r = K.el("rmap-neu-r").value; if (!u) return K.toast("Personalnummer oder Login eingeben"); K.rmap.fokusU = u; aendern(l => mit(l, { benutzer: u, rolle: r }), `${u} als ${ROLLEN[r].name} angelegt`); };
  K.act.rmapVerwerfen = () => aendern(l => { l.plus = []; l.minus = []; }, "Lokale Rechteänderungen verworfen");
  K.act.rmapSql = () => {
    const e = S().einst, t = e.rechteTabelle || "CPQ_BERECHTIGUNG", l = lokal(), q = v => v ? `'${String(v).replace(/'/g, "''")}'` : "NULL", w = (sp, v) => v ? `${sp} = ${q(v)}` : `ISNULL(${sp}, '') = ''`;
    const sql = [`-- Rechte aus dem Fahrzeugkonfigurator, ${new Date().toLocaleString("de-DE")}`, `-- Tabelle und Spalten ggf. an Ihre Rechte-Abfrage anpassen`,
      ...(l.minus || []).map(z => `DELETE FROM ${t} WHERE ${w("BENUTZER", z.benutzer)} AND ${w("ROLLE", z.rolle ? ROLLEN[z.rolle].name : "")} AND ${w("FAMILIE", z.familie)} AND ${w("FAHRZEUG", z.fahrzeug)};`),
      ...(l.plus || []).map(z => `INSERT INTO ${t} (BENUTZER, ROLLE, FAMILIE, FAHRZEUG) VALUES (${q(z.benutzer)}, ${q(z.rolle ? ROLLEN[z.rolle].name : "")}, ${q(z.familie)}, ${q(z.fahrzeug)});`)].join("\n");
    K.sheet(`<h3>SQL für APplus</h3><div class="feld"><label for="rmap-tab">Tabelle</label><input id="rmap-tab" class="mono" data-chg="rmapTabelle" value="${esc(t)}"></div><textarea id="rmap-sql" class="mono" rows="12" readonly>${esc(sql)}</textarea>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Schließen</button><button class="btn" type="button" data-act="rmapSqlLaden">Als Datei</button><button class="btn primary" type="button" data-act="rmapSqlKopieren">Kopieren</button></div>`, true);
  };
  K.inp.rmapTabelle = async el => { const e = S().einst; e.rechteTabelle = el.value.trim() || "CPQ_BERECHTIGUNG"; await K.Store.einstSpeichern(e, true); K.act.rmapSql(); };
  K.act.rmapSqlKopieren = async () => { const t = K.el("rmap-sql"); try { await navigator.clipboard.writeText(t.value); } catch (e) { t.select(); document.execCommand && document.execCommand("copy"); } K.toast("SQL kopiert"); };
  K.act.rmapSqlLaden = () => K.speichereDatei("Rechte_Konfigurator.sql", new Blob([K.el("rmap-sql").value], { type: "text/plain" }));
  K.inp.rechtInhaber = async el => { const e = S().einst; e.rechteInhaber = el.value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean); await K.Store.einstSpeichern(e, true); R.bestimmen(); K.navBauen && K.navBauen(); K.render(); };
  K.act.rmapU = el => { K.rmap.fokusU = K.rmap.fokusU === el.dataset.u ? null : el.dataset.u; K.rmap.fokusZ = null; K.render(); };
  K.act.rmapZ = el => { K.rmap.fokusZ = K.rmap.fokusZ === el.dataset.z ? null : el.dataset.z; K.rmap.fokusU = null; K.render(); };
  K.act.rmapRolle = el => { K.rmap.rolle = el.dataset.r; K.render(); };
  K.act.rmapFz = el => { K.rmap.fahrzeuge = el.checked; K.render(); };

  /* ---------- Studio › Rechte ---------- */
  K.route("studio-rechte", () => {
    const St = K.studio, bz = K.Store.benutzerZeilen, wer = R.benutzer, qs = K.Store.abfragen(), st = K.Store.abfrageStatus || {};
    const rollenTip = ["admin", "produkt", "leitung", "vertrieb"].map(k => { const r = ROLLEN[k]; return `${r.name}: ${r.studio ? "Studio, " : ""}${r.alleFahrzeuge ? "alle" : "zugeordnete"} Fahrzeuge, ${r.alleAngebote ? "alle" : "eigene"} Angebote${r.einstellungen ? ", Einstellungen und Rechte" : ""}`; }).join(" · ");
    const einrichtung = `apx_Benutzer: genau eine Zeile zum angemeldeten Benutzer (BENUTZER, PERSONAL, NAME, EMAIL). · apx_Rechte: eine Zeile je Zuordnung (BENUTZER = Login oder Personalnummer, ROLLE, FAMILIE = Name aus Katalog aufbauen oder *, FAHRZEUG = Artikelnummer). · Andere Namen unter Einstellungen › APplus-Abfragen. · Die Prüfung steuert die Anzeige im Browser, echte Sperren gehören zusätzlich in die Abfragen.`;
    return St.kopf("Rechte", "") + `
      <section class="panel rmap-panel"><div class="panelkopf"><h3>Wer sieht was ${K.tip("Spalten = Benutzer, Zeilen = Familien aus dem Katalog. Anklicken zeigt Details. Mehrere Zeilen je Benutzer werden zusammengezählt, die höchste Rolle gilt, Familien gelten mit Unterfamilien.")}</h3>
        <span class="row klein">${K.tip(rollenTip, "Rollen")} Rollen ${K.tip(einrichtung, "Einrichtung")} Einrichtung</span></div>${karte()}</section>
      <section class="panel"><h3>Angemeldet</h3><div class="recht-ich">
        <span>${wer ? `<b>${esc(wer.name || wer.login || "–")}</b> <code>${esc(wer.login || wer.personal || "")}</code>` : `<span class="warntext">Benutzer nicht erkannt</span> ${K.tip(st.benutzer?.fehler || (qs.benutzer ? "Abfrage " + qs.benutzer + " nicht geladen" : "Keine Benutzer-Abfrage"))}`}${wer?.mehrdeutig ? ` <span class="warntext">${bz.length} Zeilen</span>${K.tip("Die Benutzer-Abfrage soll genau eine Zeile liefern, verwendet wird die erste.")}` : ""}</span>
        <span class="chip">${esc(R.rollenName())}</span>
        <span class="klein">${R.aktiv ? `<code>${esc(qs.rechte)}</code> · ${R.zeilen.length} Zuordnungen` : `<span class="gedimmt">keine Rechte-Abfrage, keine Einschränkung</span>`}</span>
        ${R.meldung ? `<span class="warntext klein">${esc(R.meldung)}</span>` : ""}${R.istInhaber ? `<span class="chip">Inhaber</span>` : ""}</div>
        ${R.darf("rechte") && !R.simuliert ? `<div class="feld recht-inhaber"><label for="recht-inh">Immer Administrator ${K.tip("Personalnummern oder Logins, die unabhängig von der Rechte-Abfrage Administrator sind, z. B. wer die Anwendung baut. Gilt für diesen Browser; dauerhaft für alle: im Dashboard KONF_CONFIG.admins = [\"01632\"].")}</label><input id="recht-inh" class="mono" data-chg="rechtInhaber" value="${esc(((S().einst && S().einst.rechteInhaber) || []).join(", "))}" placeholder="${esc(wer?.personal || wer?.login || "z. B. 01632")}"></div>` : ""}</section>`;
  });
  K.act.rechtSim = el => { const n = el.dataset.u || el.value; R.simuliert = n ? { login: n, personal: n, name: n } : null; R.bestimmen(); K.navBauen && K.navBauen(); K.render(); K.toast(n ? `Vorschau als ${n}: ${R.rollenName()}` : "Eigene Ansicht"); };
})();
