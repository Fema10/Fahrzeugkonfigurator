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

  const R = K.Rechte = { aktiv: false, benutzer: null, rolle: "admin", familien: null, fahrzeuge: null, zeilen: [], meldung: "", simuliert: null };
  /** Rechte aus den Abfragen bestimmen. Ohne Rechte-Abfrage: keine Einschränkung. */
  R.bestimmen = () => {
    const bz = K.Store.benutzerZeilen, rz = K.Store.rechteZeilen;
    R.zeilen = (rz || []).map(z => { const f = spalten(z); return { benutzer: f("benutzer", "login", "username", "user", "personal", "personalnr"), rolle: rolleAus(f("rolle", "role", "gruppe")), familie: f("familie", "produktfamilie", "produktgruppe", "katalog"), fahrzeug: f("fahrzeug", "artikel", "produkt") }; }).filter(z => z.benutzer);
    if (bz && bz.length) { const f = spalten(bz[0]); R.benutzer = { login: f("benutzer", "login", "username", "user", "anmeldename"), personal: f("personal", "personalnr", "mitarbeiter", "kuerzel"), name: f("name") || [f("vorname"), f("nachname")].filter(Boolean).join(" "), mail: f("email", "mail"), mehrdeutig: bz.length > 1 }; }
    else R.benutzer = null;
    R.aktiv = !!rz;
    if (R.simuliert) { const s0 = R.simuliert; R.simuliert = null; R.bestimmen(); R.echteRolle = R.rolle; R.simuliert = s0; } else R.echteRolle = null;
    const wer = R.simuliert || R.benutzer;
    if (!R.aktiv) { Object.assign(R, { rolle: "admin", familien: null, fahrzeuge: null, meldung: "" }); return R; }
    if (!wer) { Object.assign(R, { rolle: "keine", familien: new Set(), fahrzeuge: new Set(), meldung: bz ? "Die Benutzer-Abfrage hat keine Zeile geliefert." : "Der angemeldete Benutzer wird nicht erkannt: Die Benutzer-Abfrage fehlt oder ist nicht geladen." }); return R; }
    const ids = [wer.login, wer.personal, wer.mail].map(norm).filter(Boolean);
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
  const keinZugriff = route => `<div class="leer recht-sperre"><h2>${R.rolle === "keine" ? "Kein Zugriff" : "Diese Seite ist für Ihre Rolle nicht freigegeben"}</h2>
    <p>${esc(R.meldung || `Angemeldet als ${R.benutzer?.name || R.benutzer?.login || "?"} (${R.rollenName()}).`)}</p><p class="klein gedimmt">Rechte werden in APplus über die Abfrage <code>${esc(K.Store.abfragen().rechte || "apx_Rechte")}</code> vergeben. Bitte an einen Administrator wenden.</p>
    ${R.rolle !== "keine" ? `<p><button class="btn" type="button" data-act="oeffne" data-ziel="katalog">Zum Katalog</button></p>` : ""}</div>`;
  R.sperre = keinZugriff;
  // Während der Vorschau oben eine Leiste mit „Vorschau beenden“
  const altRender = K.render;
  K.render = () => { altRender(); const v = K.el("konf-view"); if (v && R.simuliert && !v.querySelector(".recht-vorschau")) v.insertAdjacentHTML("afterbegin", `<div class="hinweis warn recht-vorschau"><b>Vorschau als ${esc(R.simuliert.login)}</b> (${esc(R.rollenName())}). So sieht dieser Benutzer die App. <button class="btn klein" type="button" data-act="rechtSimEnde">Vorschau beenden</button></div>`); };
  K.act.rechtSimEnde = () => { R.simuliert = null; R.bestimmen(); K.navBauen && K.navBauen(); K.gehe("studio-rechte"); };

  /* ---------- Studio › Rechte ---------- */
  K.route("studio-rechte", () => {
    const St = K.studio, bz = K.Store.benutzerZeilen, wer = R.benutzer, qs = K.Store.abfragen(), st = K.Store.abfrageStatus || {};
    const zeile = (t, w) => `<tr><th>${t}</th><td>${w}</td></tr>`;
    const famName = n => { const g = (S().live || S().entwurf)?.gruppen.find(x => norm(x.name) === n || norm(x.id) === n); return g ? esc(g.name) : `<span class="warntext" title="Keine Familie mit diesem Namen">${esc(n)}</span>`; };
    const nutzer = [...new Set(R.zeilen.map(z => z.benutzer))];
    return St.kopf("Rechte", "Wer was sieht, kommt aus APplus: eine Abfrage erkennt den angemeldeten Benutzer, eine zweite ordnet Rollen und Familien zu. Ohne Rechte-Abfrage gibt es keine Einschränkung.") + `
      <div class="recht-raster">
      <section class="panel"><h3>Angemeldet</h3><table class="kompakt recht-info"><tbody>
        ${zeile("Benutzer", wer ? `<b>${esc(wer.name || "–")}</b> · ${esc(wer.login || "–")}${wer.personal ? ` · Pers.-Nr. ${esc(wer.personal)}` : ""}${wer.mehrdeutig ? ` <span class="warntext">Abfrage liefert ${bz.length} Zeilen, verwendet wird die erste</span>` : ""}` : `<span class="warntext">nicht erkannt</span> (${esc(st.benutzer?.fehler || (qs.benutzer ? "Abfrage " + qs.benutzer + " nicht geladen" : "keine Abfrage"))})`)}
        ${zeile("Rechte-Abfrage", R.aktiv ? `<code>${esc(qs.rechte)}</code> · ${R.zeilen.length} Zuordnungen` : `<span class="gedimmt">nicht geladen${st.rechte?.fehler ? ": " + esc(st.rechte.fehler) : ""}, daher keine Einschränkung</span>`)}
        ${zeile("Rolle", `<b>${esc(R.rollenName())}</b>${R.simuliert ? ` <span class="chip">Vorschau als ${esc(R.simuliert.login)}</span>` : ""}`)}
        ${zeile("Sieht", R.familien || R.fahrzeuge ? [...[...(R.familien || [])].map(famName), ...[...(R.fahrzeuge || [])].map(x => `<code>${esc(x)}</code>`)].join(", ") || "keine Fahrzeuge" : "alle Fahrzeuge")}
        ${zeile("Angebote", R.darf("alleAngebote") || !R.aktiv ? "alle" : "nur eigene" + (R.meinVertrieb() ? ` (als ${esc(R.meinVertrieb().name)})` : ` <span class="warntext">kein passender Eintrag im Vertrieb gefunden</span>`))}
        ${R.meldung ? zeile("Hinweis", `<span class="warntext">${esc(R.meldung)}</span>`) : ""}
      </tbody></table>
      ${nutzer.length ? `<div class="feld" style="margin-top:12px"><label for="recht-sim">Ansicht testen als</label><select id="recht-sim" data-act="rechtSim"><option value="">– ich selbst –</option>${nutzer.map(n => `<option ${R.simuliert?.login === n ? "selected" : ""}>${esc(n)}</option>`).join("")}</select><span class="klein gedimmt">Zeigt die App so, wie dieser Benutzer sie sieht, bis zum Neuladen.</span></div>` : ""}</section>
      <section class="panel"><h3>Rollen</h3><div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Rolle</th><th>Studio</th><th>Fahrzeuge</th><th>Angebote</th><th>Einstellungen</th></tr></thead><tbody>
        ${["admin", "produkt", "leitung", "vertrieb"].map(k => { const r = ROLLEN[k]; return `<tr><td><b>${r.name}</b></td><td>${r.studio ? "ja" : "–"}</td><td>${r.alleFahrzeuge ? "alle" : "zugeordnete"}</td><td>${r.alleAngebote ? "alle" : "eigene"}</td><td>${r.einstellungen ? "ja" : "–"}</td></tr>`; }).join("")}</tbody></table></div>
        <p class="klein gedimmt">Hat ein Benutzer mehrere Zeilen, gilt die höchste Rolle; Familien und Fahrzeuge werden zusammengezählt. Familien gelten mit allen Unterfamilien.</p></section>
      </div>
      <section class="panel"><h3>Zuordnungen aus APplus</h3>${R.zeilen.length ? `<div class="tabwrap"><table class="kompakt"><thead><tr><th>Benutzer</th><th>Rolle</th><th>Familie</th><th>Fahrzeug</th></tr></thead><tbody>
        ${R.zeilen.map(z => `<tr><td class="mono">${esc(z.benutzer)}</td><td>${z.rolle ? esc(R.rollenName(z.rolle)) : `<span class="warntext">unbekannt, gilt als Vertrieb</span>`}</td><td>${z.familie ? (z.familie === "*" ? "alle" : famName(norm(z.familie))) : ""}</td><td class="mono">${esc(z.fahrzeug)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="gedimmt">Keine Zuordnungen geladen.</p>`}</section>
      <section class="panel"><h3>Einrichtung in APplus</h3>
        <p class="klein">1. Abfrage <code>apx_Benutzer</code>: liefert <b>genau eine Zeile</b> zum angemeldeten Benutzer. Wie APplus den angemeldeten Benutzer in eine Abfrage gibt (Platzhalter oder Funktion), weiß Ihre APplus-Betreuung. Beispiel mit Platzhalter:</p>
        <pre class="code">SELECT BENUTZER, PERSONAL, NAME, EMAIL
FROM   PERSONAL            -- bzw. Ihre Benutzer-/Personaltabelle
WHERE  BENUTZER = &lt;angemeldeter Benutzer&gt;</pre>
        <p class="klein">2. Abfrage <code>apx_Rechte</code>: eine Zeile je Zuordnung. Pflege z. B. in einer kleinen Tabelle oder über vorhandene Rollen/Gruppen:</p>
        <pre class="code">SELECT BENUTZER, ROLLE, FAMILIE, FAHRZEUG FROM KONF_RECHTE
-- BENUTZER  Login oder Personalnummer
-- ROLLE     Administrator | Produktmanagement | Vertriebsleitung | Vertrieb
-- FAMILIE   Name der Familie aus „Katalog aufbauen“, * = alle
-- FAHRZEUG  Artikelnummer (optional, einzelnes Fahrzeug)</pre>
        <p class="klein">3. Beide Abfragen dem Dashboard zuordnen. Heißen sie anders, unter Einstellungen › APplus-Abfragen eintragen.</p>
        <p class="hinweis klein">Die Prüfung läuft im Browser und steuert die Anzeige. Wer technisch versiert ist, kann sie umgehen. Echte Sperren gehören zusätzlich in die APplus-Abfragen selbst (z. B. Angebote nur des angemeldeten Benutzers ausliefern).</p></section>`;
  });
  K.act.rechtSim = el => { const n = el.value; R.simuliert = n ? { login: n, personal: n, name: n } : null; R.bestimmen(); K.navBauen && K.navBauen(); K.render(); K.toast(n ? `Vorschau als ${n}: ${R.rollenName()}` : "Eigene Ansicht"); };
})();
