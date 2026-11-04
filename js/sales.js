/* =========================================================================
   Vertrieb: Übersicht, Katalog, Konfigurator, Angebote, Kunden, Verkaufsraum
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const live = () => S().live;

  /* ---------- gemeinsame Bausteine ---------- */
  const STATUS = { entwurf: "Entwurf", versendet: "Versendet", angenommen: "Angenommen", abgelehnt: "Abgelehnt" };
  K.statusChip = a => `<span class="chip st-${a.status}">${STATUS[a.status] || a.status}</span>`;
  K.aufrufe = a => (a.events || []).filter(e => e.typ === "aufruf");
  K.offeneFragen = a => (a.events || []).filter(e => e.typ === "rueckfrage" && !e.erledigt);
  K.heiss = a => a.status !== "angenommen" && a.status !== "abgelehnt" && (K.aufrufe(a).filter(e => Date.now() - e.ts < 48 * 36e5).length >= 2 || K.offeneFragen(a).length > 0);
  const vertriebName = id => (S().einst?.vertrieb || []).find(v => v.id === id)?.name || "–";
  const lesezeit = a => K.aufrufe(a).reduce((n, e) => n + (e.dauer || 0), 0);
  const kopf = (eyebrow, titel, text, aktionen = "") => `<div class="kopfzeile"><div><div class="eyebrow">${eyebrow}</div><h2>${titel}</h2>${text ? `<p>${text}</p>` : ""}</div>${aktionen ? `<div class="row">${aktionen}</div>` : ""}</div>`;

  /* Silhouetten für den Katalog (Seitenansicht, schematisch) */
  K.silhouette = (typ, farbe = "currentColor") => {
    const rad = (x, r = 9) => `<circle cx="${x}" cy="${62 - r}" r="${r}" fill="${farbe}"/><circle cx="${x}" cy="${62 - r}" r="${r * .45}" fill="var(--surface)"/>`;
    const k = {
      semi: `<path d="M8 22h46l8 10h112v8H60l-6-8H8z" fill="${farbe}"/>${[140, 160, 180].map(x => rad(x)).join("")}<path d="M184 32l14-22 4 2-12 22z" fill="${farbe}" opacity=".7"/>`,
      tiefbett: `<path d="M6 18h44l10 22h86l8-14h44v10h-40l-8 14H56L46 28H6z" fill="${farbe}"/>${[160, 176, 192].map(x => rad(x, 8)).join("")}`,
      plattform: `<path d="M8 22h190v10H8z" fill="${farbe}"/><rect x="20" y="32" width="8" height="10" fill="${farbe}"/>${[160, 182].map(x => rad(x)).join("")}`,
      nachlaeufer: `<path d="M6 36h120v5H6z" fill="${farbe}"/><path d="M118 30h70v12h-70z" fill="${farbe}"/><path d="M130 6h5v24h-5zM172 6h5v24h-5z" fill="${farbe}"/>${[144, 164].map(x => rad(x)).join("")}`
    }[typ] || "";
    return `<svg viewBox="0 0 210 64" aria-hidden="true">${k}<line x1="0" y1="62.5" x2="210" y2="62.5" stroke="var(--line)" stroke-width="1"/></svg>`;
  };

  /* =====================================================================
     Übersicht
     ===================================================================== */
  K.route("start", () => {
    const A = S().angebote, offen = A.filter(a => a.status === "entwurf" || a.status === "versendet");
    const sum = a => E.summen(a, S().einst.mwst).netto;
    const woche = A.reduce((n, a) => n + K.aufrufe(a).filter(e => Date.now() - e.ts < 7 * 864e5).length, 0);
    const entsch = A.filter(a => a.status === "angenommen" || a.status === "abgelehnt");
    const quote = entsch.length ? Math.round(A.filter(a => a.status === "angenommen").length / entsch.length * 100) : null;
    const heiss = A.filter(K.heiss);
    const feed = A.flatMap(a => (a.events || []).map(e => ({ ...e, a }))).sort((x, y) => y.ts - x.ts).slice(0, 8);
    const fav = (S().prefs.favoriten || []).map(id => E.produkt(live(), id)).filter(Boolean);
    const neueste = [...A].sort((x, y) => y.erstellt - x.erstellt).slice(0, 6);
    return kopf("Vertrieb", "Übersicht", "", `<a class="btn" href="#katalog">Fahrzeug konfigurieren</a><button class="btn primary" type="button" data-act="angebotNeu">Neues Angebot</button>`) + `
    <div class="kpis">
      <div class="kpi"><b class="num">${offen.length}</b><span>offene Angebote</span></div>
      <div class="kpi"><b class="num">${K.eur(offen.reduce((n, a) => n + sum(a), 0))}</b><span>Volumen offen, netto</span></div>
      <div class="kpi"><b class="num">${woche}</b><span>Aufrufe im Verkaufsraum, 7 Tage</span></div>
      <div class="kpi"><b class="num">${quote == null ? "–" : quote + " %"}</b><span>Annahmequote</span></div>
    </div>
    <div class="zwei-spalten">
      <section class="panel">
        <div class="panelkopf"><h3>Aktuelles Interesse</h3><span class="hinweistext">Mehrere Aufrufe in 48 h oder offene Rückfrage</span></div>
        ${heiss.length ? `<ul class="liste">${heiss.map(a => `<li><a href="#angebot-${a.nr}" class="zeile-link">
          <span><b>${esc(a.kunde.firma)}</b><br><span class="mono klein">${a.nr}</span> · ${K.eur(sum(a))}</span>
          <span class="rechts">${K.offeneFragen(a).length ? `<span class="chip st-rueckfrage">Rückfrage</span>` : ""}<span class="chip heiss">${K.aufrufe(a).length} Aufrufe</span></span></a></li>`).join("")}</ul>`
          : `<p class="leer-klein">Gerade keine Angebote mit frischem Interesse.</p>`}
      </section>
      <section class="panel">
        <div class="panelkopf"><h3>Letzte Kundenaktivität</h3></div>
        ${feed.length ? `<ul class="zeitachse">${feed.map(e => `<li class="${e.typ}"><time>${K.zeit(e.ts)} · ${K.rel(e.ts)}</time>
          <a href="#angebot-${e.a.nr}">${esc(e.a.kunde.firma)}</a> ${e.typ === "aufruf" ? `hat das Angebot geöffnet (${K.dauer(e.dauer)}, ${esc(e.geraet || "")})` : e.typ === "pdf" ? "hat das PDF gespeichert" : e.typ === "rueckfrage" ? "hat eine Rückfrage gestellt" : "hat das Angebot angenommen"}</li>`).join("")}</ul>`
          : `<p class="leer-klein">Noch keine Aufrufe. Sobald ein Kunde seinen Verkaufsraum-Link öffnet, erscheint das hier.</p>`}
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <div class="panelkopf"><h3>Neueste Angebote</h3><a href="#angebote" class="klein">Alle Angebote</a></div>
      ${angebotsTabelle(neueste)}
    </section>
    ${fav.length ? `<section style="margin-top:20px"><h3 class="abschnitt">Ihre Favoriten</h3><div class="kacheln">${fav.map(produktKarte).join("")}</div></section>` : ""}`;
  });

  function angebotsTabelle(liste) {
    if (!liste.length) return `<p class="leer-klein">Keine Angebote.</p>`;
    return `<div class="tabwrap"><table class="klickbar"><thead><tr><th>Angebot</th><th>Kunde</th><th>Fahrzeuge</th><th class="r">Netto</th><th>Status</th><th class="r">Aufrufe</th><th>Zuletzt geöffnet</th><th>Bearbeiter</th></tr></thead><tbody>
      ${liste.map(a => {
        const av = K.aufrufe(a), letzte = av.length ? Math.max(...av.map(e => e.ts)) : null;
        const fz = a.positionen.filter(p => p.typ === "konfig").map(p => `${p.menge}× ${esc(p.produktName)}`).join(", ") || "–";
        return `<tr data-act="oeffne" data-ziel="angebot-${a.nr}" tabindex="0"><td class="mono">${a.nr}${a.beispiel ? ` <span class="chip bsp">Beispiel</span>` : ""}</td><td><b>${esc(a.kunde.firma)}</b></td><td class="gedimmt">${fz}</td>
          <td class="r num">${K.eur(E.summen(a, S().einst.mwst).netto)}</td><td>${K.statusChip(a)}${K.heiss(a) ? ` <span class="chip heiss">Heiß</span>` : ""}</td>
          <td class="r num">${av.length}</td><td class="gedimmt">${letzte ? K.rel(letzte) : "–"}</td><td class="gedimmt">${esc(vertriebName(a.bearbeiter))}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }
  K.act.oeffne = el => K.gehe(el.dataset.ziel);

  /* =====================================================================
     Katalog (Baum, Filter, Kacheln)
     ===================================================================== */
  K.kat = { gruppe: "", suche: "", filter: {}, offen: {} };
  const kinder = (mo, gid) => mo.gruppen.filter(g => (g.eltern || "") === (gid || ""));
  const nachfahren = (mo, gid) => { const out = [gid]; for (const k of kinder(mo, gid)) out.push(...nachfahren(mo, k.id)); return out; };
  const pfad = (mo, gid) => { const out = []; let g = mo.gruppen.find(x => x.id === gid); while (g) { out.unshift(g); g = mo.gruppen.find(x => x.id === g.eltern); } return out; };
  K.bildUrl = id => id ? "/_blob/" + id : null;
  /** Bild aus dem Artikelstamm (Spalte BILD/DOCUMENTS der Artikel-Abfrage) */
  K.artikelBild = code => (code && K.Store.artikelZu(code)?.bild) || "";
  /** Bild mit Ersatz: lädt das Bild nicht, erscheint die Grafik */
  K.bildMitErsatz = (url, ersatz) => `<img src="${esc(url)}" alt="" loading="lazy" data-ersatz="${esc(ersatz)}">`;
  K.produktBildHtml = (p, farbe) => { const ers = K.silhouette(p.visual?.typ, farbe || "var(--ink)"); if (p.bild) return `<img src="${K.bildUrl(p.bild)}" alt="" loading="lazy">`; const a = K.artikelBild(p.code); return a ? K.bildMitErsatz(a, ers) : ers; };
  const produktBild = (p, farbe) => K.produktBildHtml(p, farbe);
  document.addEventListener("error", e => { const t = e.target; if (t && t.tagName === "IMG" && t.dataset && t.dataset.ersatz != null && t.parentNode) { const d = document.createElement("span"); d.className = "bild-ersatz"; d.title = "Bild nicht geladen: " + t.src; d.innerHTML = t.dataset.ersatz; console.info("[Konfigurator] Bild nicht geladen:", t.src); t.replaceWith(d); } }, true);
  function gruppenBild(mo, g) {
    if (g.bild) return `<img src="${K.bildUrl(g.bild)}" alt="">`;
    const p = mo.produkte.find(x => nachfahren(mo, g.id).includes(x.gruppe));
    return p ? produktBild(p, "var(--muted)") : "";
  }
  /** „ab“-Preis = Preis der Standardkonfiguration (Grundpreis + vorausgewählte und feste Codes) */
  const abPreis = (mo, p) => { try { return E.preis(mo, p, E.standardSel(mo, p)).einzel; } catch (e) { return p.basispreis || 0; } };
  function produktKarte(p, mo) {
    const fav = (S().prefs.favoriten || []).includes(p.id);
    return `<article class="kachel">
      <button type="button" class="kachel-bild" data-act="konfigStart" data-p="${p.id}" aria-label="${esc(p.name)} konfigurieren">${produktBild(p)}</button>
      <div class="kachel-text">
        <div class="kachel-titel"><b>${esc(p.name)}</b><span class="info" title="${esc(p.beschreibung)}" tabindex="0" aria-label="${esc(p.beschreibung)}">i</span>
          <button type="button" class="stern" data-act="favorit" data-p="${p.id}" aria-pressed="${fav}" title="${fav ? "Aus Favoriten entfernen" : "Zu Favoriten"}">${fav ? "★" : "☆"}</button></div>
        <span class="mono klein gedimmt">${esc(p.code || p.artnr || "")}</span>
        <div class="kachel-fuss"><span class="num">ab ${K.eur(mo ? abPreis(mo, p) : p.basispreis)}</span><span class="row kachel-knoepfe">${K.Store.schreiben ? `<button type="button" class="zahnrad" data-act="kbBearbeiten" data-p="${p.id}" title="Im Katalog aufbauen bearbeiten oder löschen" aria-label="${esc(p.name)} bearbeiten">✎</button>` : ""}<button type="button" class="zahnrad" data-act="konfigStart" data-p="${p.id}" title="Konfigurieren" aria-label="Konfigurieren">⚙</button></span></div>
      </div></article>`;
  }
  function baum(mo, gid, tiefe) {
    const zahl = id => mo.produkte.filter(p => p.aktiv !== false && nachfahren(mo, id).includes(p.gruppe)).length;
    return kinder(mo, gid).filter(g => zahl(g.id) > 0).map(g => {
      const hatKinder = kinder(mo, g.id).some(k => zahl(k.id) > 0), offen = K.kat.offen[g.id] ?? true, aktiv = K.kat.gruppe === g.id;
      const anzahl = zahl(g.id);
      return `<li><div class="baum-zeile${aktiv ? " aktiv" : ""}" style="--tiefe:${tiefe}">
        ${hatKinder ? `<button type="button" class="baum-auf" data-act="katAuf" data-g="${g.id}" aria-expanded="${offen}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${offen ? "▾" : "▸"}</button>` : `<span class="baum-auf"></span>`}
        <button type="button" class="baum-name" data-act="katGruppe" data-g="${g.id}"><span class="baum-bild">${gruppenBild(mo, g)}</span>${esc(g.name)}<span class="gedimmt klein">${anzahl}</span></button></div>
        ${hatKinder && offen ? `<ul>${baum(mo, g.id, tiefe + 1)}</ul>` : ""}</li>`;
    }).join("");
  }
  K.route("katalog", () => {
    const mo = K.kat.entwurf ? S().entwurf : live(); if (!mo) return keinModell();
    const k = K.kat, q = k.suche.toLowerCase(), fav = S().prefs.favoriten || [];
    const imBaum = k.gruppe === "fav" ? null : k.gruppe ? nachfahren(mo, k.gruppe) : null;
    let prods = mo.produkte.filter(p => p.aktiv !== false)
      .filter(p => k.gruppe === "fav" ? fav.includes(p.id) : !imBaum || imBaum.includes(p.gruppe))
      .filter(p => !q || (p.name + " " + p.beschreibung + " " + (p.artnr || "") + " " + (p.code || "")).toLowerCase().includes(q));
    // Katalogfilter aus Merkmalen mit "katalogfilter" (z. B. Anzahl Achsen)
    const filterM = mo.merkmale.filter(m => m.katalogfilter);
    const filterHtml = filterM.map(m => {
      const moeglich = m.werte.filter(w => prods.some(p => E.produktMerkmale(mo, p).some(x => x.m.id === m.id && x.werte.some(v => v.id === w.id))));
      return `<div class="katfilter"><span class="gedimmt klein">${esc(m.name)}</span>${moeglich.length ? moeglich.map(w => `<button type="button" class="chipbtn" data-act="katFilter" data-m="${m.id}" data-w="${w.id}" aria-pressed="${k.filter[m.id] === w.id}">${esc(w.name)}</button>`).join("") : `<b class="klein">Keine Auswahl möglich</b>`}</div>`;
    }).join("");
    for (const [mid, wid] of Object.entries(k.filter)) if (wid) prods = prods.filter(p => E.produktMerkmale(mo, p).some(x => x.m.id === mid && x.werte.some(v => v.id === wid)));
    const ziel = K.konf.ziel;
    const krumen = k.gruppe === "fav" ? ["Favoriten"] : ["Katalog", ...(k.gruppe ? pfad(mo, k.gruppe).map(g => g.name) : [])];
    const offen = !K.kat.entwurf && K.freigabeOffen ? K.freigabeOffen() : 0;
    const offenHinweis = offen ? `<div class="hinweis" style="margin-bottom:12px"><b>Der Katalog zeigt die freigegebene Version${live()?.version ? " " + live().version : ""}.</b> Im Studio gibt es ${offen === 1 ? "1 Änderung" : offen + " Änderungen"}, die noch nicht freigegeben ${offen === 1 ? "ist" : "sind"}. Erst nach der Freigabe sieht der Vertrieb den Stand aus „Katalog aufbauen“.${K.Store.schreiben ? ` <button class="btn klein" type="button" data-act="katEntwurfZeigen">Entwurf ansehen</button> <a class="btn klein primary" href="#studio-freigabe" data-act="katZurFreigabe">Zur Freigabe</a>` : ""}</div>` : "";
    return `${offenHinweis}${K.kat.entwurf ? `<div class="hinweis warn" style="margin-bottom:12px"><b>Vorschau des Entwurfs.</b> So sieht der Katalog nach der Freigabe aus. <button class="btn klein" type="button" data-act="katZumBau">Zurück zum Aufbau</button> <a class="btn klein primary" href="#studio-freigabe">Freigeben</a></div>` : ""}${ziel ? `<div class="hinweis" style="margin-bottom:12px">Das konfigurierte Fahrzeug wird als neue Position in <b>${esc(ziel.nr)}</b> übernommen. <button class="btn klein" type="button" data-act="zielAbbrechen">Abbrechen</button></div>` : ""}
    <div class="katalog">
      <nav class="baum panel" aria-label="Produktgruppen">
        <input type="search" id="kat-suche" data-in="katSuche" placeholder="Suche im Katalog" value="${esc(k.suche)}">
        <ul><li><div class="baum-zeile${!k.gruppe ? " aktiv" : ""}" style="--tiefe:0"><span class="baum-auf"></span><button type="button" class="baum-name" data-act="katGruppe" data-g="">Gesamter Katalog<span class="gedimmt klein">${mo.produkte.filter(p => p.aktiv !== false).length}</span></button></div>
          <ul>${baum(mo, "", 1)}</ul></li>
          <li><div class="baum-zeile${k.gruppe === "fav" ? " aktiv" : ""}" style="--tiefe:0"><span class="baum-auf"></span><button type="button" class="baum-name" data-act="katGruppe" data-g="fav">★ Favoriten<span class="gedimmt klein">${fav.length}</span></button></div></li></ul>
      </nav>
      <section class="katalog-inhalt">
        <div class="krumen eyebrow">${krumen.map(esc).join(" › ")}</div>
        ${filterHtml ? `<div class="katfilterleiste">${filterHtml}${Object.values(k.filter).some(Boolean) ? `<button type="button" class="btn klein" data-act="katFilterWeg">Filter zurücksetzen</button>` : ""}</div>` : ""}
        ${prods.length ? `<div class="kacheln">${prods.map(p => produktKarte(p, mo)).join("")}</div>` : `<div class="leer">In dieser Auswahl gibt es keine Fahrzeuge.</div>`}
      </section></div>`;
  });
  /** Fahrzeug im Studio › Katalog aufbauen öffnen (ändern, Codes, löschen) */
  K.act.kbBearbeiten = el => { const pid = el.dataset.p, mo = S().entwurf; if (!mo || !mo.produkte.some(x => x.id === pid)) return K.toast("Dieses Fahrzeug ist im Entwurf nicht mehr vorhanden (bereits gelöscht, wartet auf Freigabe)."); K.kat.entwurf = false; K.konf.entwurf = false; K.kb.sel = "p:" + pid; K.kb.loeschen = null; K.gehe("studio-katalog"); };
  K.act.konfAnsicht = () => { K.konf.zeige3d = !K.konf.zeige3d; K.render(); };
  K.act.katEntwurfZeigen = () => { K.kat.entwurf = true; K.render(); };
  K.act.katZurFreigabe = () => K.gehe("studio-freigabe");
  K.act.katZumBau = () => { K.kat.entwurf = false; K.gehe("studio-katalog"); };
  K.act.katGruppe = el => { K.kat.gruppe = el.dataset.g; K.render(); };
  K.act.katAuf = el => { K.kat.offen[el.dataset.g] = !(K.kat.offen[el.dataset.g] ?? true); K.render(); };
  K.act.katFilter = el => { const f = K.kat.filter; f[el.dataset.m] = f[el.dataset.m] === el.dataset.w ? null : el.dataset.w; K.render(); };
  K.act.katFilterWeg = () => { K.kat.filter = {}; K.render(); };
  K.act.zielAbbrechen = () => { const nr = K.konf.ziel?.nr; K.konf.ziel = null; nr ? K.gehe("angebot-" + nr) : K.render(); };
  K.inp.katSuche = el => { K.kat.suche = el.value; K.render(); };
  K.act.favorit = el => K.Store.favorit(el.dataset.p);
  function keinModell() { return `<div class="leer"><b>Es ist noch kein Konfigurationsmodell freigegeben.</b><br>Im Studio Produkte und Merkmale anlegen oder per Excel importieren und unter Freigabe veröffentlichen.<br><br><a class="btn" href="#studio-freigabe">Zur Freigabe</a></div>`; }

  /* Vorschaubild eines Werts: hochgeladenes Bild, Farbfeld oder schematische Grafik */
  K.wertGrafik = (m, w, i, p) => {
    if (w.bild) return `<img src="${K.bildUrl(w.bild)}" alt="" loading="lazy">`;
    const ab = !w.hex && K.artikelBild(w.code); if (ab) return K.bildMitErsatz(ab, K.wertGrafik(m, Object.assign({}, w, { code: "" }), i, p));
    if (w.hex) return `<span class="farbkachel" style="background:${esc(w.hex)}"></span>`;
    const farben = ["#2E9E5B", "#1F3F9A", "#B23AC4", "#C8312B", "#2BB3A5", "#8A5A2B", "#D98C00", "#56606B"];
    const f = farben[i % farben.length], typ = p?.visual?.typ || "semi";
    if (m.id === "achsen" || /achs/i.test(m.name)) {
      const n = w.menge || i + 2;
      return `<svg viewBox="0 0 120 50" aria-hidden="true"><rect x="6" y="18" width="108" height="7" fill="var(--ink)"/>${Array.from({ length: n }, (_, j) => `<circle cx="${110 - j * 13 - 4}" cy="33" r="6" fill="${f}"/>`).join("")}</svg>`;
    }
    return `<div class="silh" style="color:${f}">${K.silhouette(typ, "currentColor")}</div>`;
  };

  /* =====================================================================
     Konfigurator
     ===================================================================== */
  K.konf = { produkt: null, sel: null, notes: [], ziel: null, tab: "Grundmaschine", entwurf: false, kalk: false };
  K.konfModell = () => K.konf.entwurf ? S().entwurf : live();
  K.act.konfigStart = el => {
    const ent = !!K.kat.entwurf && K.aktuell() === "katalog", mo = ent ? S().entwurf : live(), p = E.produkt(mo, el.dataset.p);
    Object.assign(K.konf, { produkt: p.id, sel: E.standardSel(mo, p), notes: [], tab: "Grundmaschine", entwurf: ent });
    K.gehe("konfig");
  };
  K.konfigOeffnen = (pid, sel, ziel, entwurf) => {
    const mo = entwurf ? S().entwurf : live(), p = E.produkt(mo, pid); if (!p) { K.toast("Dieses Fahrzeug gibt es im Modell nicht mehr."); return; }
    const s = K.clone(sel || {}); const notes = E.bereinige(mo, p, s);
    Object.assign(K.konf, { produkt: pid, sel: s, notes, ziel, tab: "Grundmaschine", entwurf: !!entwurf });
    K.gehe("konfig");
  };

  function merkmalHtml(mo, p, m, werte, g, gs, sel) {
    const multi = m.typ === "mehrfach", d = E.darstellung(m), gm = g[m.id] || {}, gsm = gs[m.id] || {};
    const f = m.multiplikator ? (E.wert(mo, m.multiplikator, sel[m.multiplikator])?.menge || 1) : 1;
    const offen = m.pflicht && !multi && E.wahlWerte(m, werte).length > 0 && sel[m.id] == null;
    const gruende = new Map();
    const preisText = w => { const pr = Math.round(E.wertPreis(mo, p, w) * f); return pr ? K.eur(pr) : "inklusive"; };
    const info = w => w.info ? `<span class="info" title="${esc(w.info)}" tabindex="0" aria-label="${esc(w.info)}">i</span>` : "";
    for (const w of werte) { if (gm[w.id]) gruende.set(gm[w.id].id, gm[w.id].hinweis || E.satz(mo, gm[w.id])); }
    const kopf = `<div class="mm-kopf">${offen ? `<span class="warnzeichen" title="Pflichtangabe">⚠</span>` : ""}<b>${esc(m.name)}</b>${m.multiplikator ? `<span class="gedimmt klein">Preis × ${esc(E.merkmal(mo, m.multiplikator)?.name || "")}</span>` : ""}${m.info ? `<span class="info" title="${esc(m.info)}" tabindex="0">i</span>` : ""}</div>`;
    let inhalt = "";
    // Werte mit eigenem Feldtyp (Ja/Nein, Zahl, Text, fest) stehen für sich, die übrigen bilden die Auswahl der Gruppe
    const alleW = werte; werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
    const eigene = alleW.filter(w => E.wertTyp(m, w) !== "auswahl").map(w => {
      const t = E.wertTyp(m, w), k = E.schluessel(m, w), v = sel[k], r = gm[w.id], gesetzt = gsm[w.id], pr = E.wertPreis(mo, p, w);
      const lock = r ? ` <span class="lock">gesperrt · ${r.id}</span>` : gesetzt ? ` <span class="chip">gesetzt · ${gesetzt.id}</span>` : "";
      if (t === "janein") return `<label class="woption${r ? " gesperrt" : ""}"><input type="checkbox" data-act="wahlJN" data-m="${m.id}" data-w="${w.id}" ${v ? "checked" : ""} ${r || gesetzt ? "disabled" : ""}><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><span class="num gedimmt">${preisText(w)}</span></label>`;
      if (t === "fest") return `<div class="wfest-z"><span class="haken-ok">✓</span><span class="wo-name">${esc(w.name)}${info(w)}</span><span class="num gedimmt">${pr ? K.eur(pr) : "inklusive"}</span></div>`;
      if (t === "zahl") { const z = w.zahl || {}; return `<div class="wzahl"><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><input id="zahl-${k}" type="number" inputmode="decimal" data-chg="wahlZahl" data-k="${k}" value="${esc(v ?? "")}" ${z.min != null ? `min="${z.min}"` : ""} ${z.max != null ? `max="${z.max}"` : ""} step="${z.schritt || 1}" aria-label="${esc(w.name)}" ${r ? "disabled" : ""}><span class="einheit">${esc(z.einheit || "")}</span><span class="num gedimmt">${pr ? `${K.eur2(pr)} je ${esc(z.einheit || "Einheit")}${+v ? ` · ${K.eur(Math.round(pr * v * f))}` : ""}` : ""}</span>${z.min != null || z.max != null ? `<span class="gedimmt klein">${z.min != null ? `ab ${z.min}` : ""}${z.max != null ? ` bis ${z.max}` : ""}</span>` : ""}</div>`; }
      const x = w.text || {}; return `<div class="wtext"><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><input id="text-${k}" type="text" data-chg="wahlText" data-k="${k}" value="${esc(v || "")}" maxlength="${x.maxLaenge || 200}" placeholder="${esc(x.hinweis || "")}" aria-label="${esc(w.name)}" ${r ? "disabled" : ""}>${pr ? `<span class="num gedimmt">${K.eur(pr)}</span>` : ""}</div>`;
    }).join("");
    if (!werte.length) inhalt = "";
    else if (d === "kacheln") {
      inhalt = `<div class="wkacheln">${werte.map((w, i) => {
        const an = multi ? (sel[m.id] || []).includes(w.id) : sel[m.id] === w.id, r = gm[w.id];
        return `<button type="button" class="wkachel${offen ? " offen" : ""}" data-act="wahl" data-m="${m.id}" data-w="${w.id}" aria-pressed="${an}" ${r ? "disabled" : ""} title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : (w.code ? "Code " + w.code : ""))}">
          <span class="wk-bild">${K.wertGrafik(m, w, i, p)}</span><span class="wk-name">${esc(w.name)}${info(w)}</span>
          <span class="wk-preis num">${r ? `<span class="lock">gesperrt · ${r.id}</span>` : preisText(w)}</span></button>`;
      }).join("")}</div>`;
    } else if (d === "auswahl" && !multi) {
      inhalt = `<select id="sel-${m.id}" class="wauswahl${offen ? " offen" : ""}" data-act="wahlSelect" data-m="${m.id}" aria-label="${esc(m.name)}">
        ${sel[m.id] == null ? `<option value="" selected>Bitte auswählen …</option>` : ""}
        ${werte.map(w => { const r = gm[w.id]; return `<option value="${w.id}" ${sel[m.id] === w.id ? "selected" : ""} ${r ? "disabled" : ""}>${esc(w.name)}${r ? ` (gesperrt ${r.id})` : ` · ${preisText(w)}`}</option>`; }).join("")}</select>`;
    } else if (d === "option" || multi) {
      inhalt = `<div class="woptionen">${werte.map(w => {
        const an = multi ? (sel[m.id] || []).includes(w.id) : sel[m.id] === w.id, r = gm[w.id], gesetzt = gsm[w.id];
        return `<label class="woption${r ? " gesperrt" : ""}" title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : gesetzt ? "Automatisch gewählt durch " + gesetzt.id : "")}">
          <input type="checkbox" data-act="wahl" data-m="${m.id}" data-w="${w.id}" ${an ? "checked" : ""} ${r || gesetzt ? "disabled" : ""}>
          <span class="wo-name">${esc(w.name)}${info(w)}${gesetzt ? ` <span class="chip">gesetzt · ${gesetzt.id}</span>` : ""}${r ? ` <span class="lock">gesperrt · ${r.id}</span>` : ""}</span><span class="num gedimmt">${preisText(w)}</span></label>`;
      }).join("")}</div>`;
    } else {
      inhalt = `<div class="wliste${offen ? " offen" : ""}" role="radiogroup" aria-label="${esc(m.name)}">${werte.map(w => {
        const an = sel[m.id] === w.id, r = gm[w.id];
        return `<button type="button" role="radio" class="wradio" data-act="wahl" data-m="${m.id}" data-w="${w.id}" aria-checked="${an}" aria-pressed="${an}" ${r ? "disabled" : ""} title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : "")}">
          <span class="wr-name">${esc(w.name)}${info(w)}</span><span class="num gedimmt">${r ? `<span class="lock">gesperrt · ${r.id}</span>` : preisText(w)}</span></button>`;
      }).join("")}</div>`;
    }
    return `<div class="mm${offen ? " ist-offen" : ""}" id="mm-${m.id}">${kopf}${inhalt}${eigene ? `<div class="weigene">${eigene}</div>` : ""}${gruende.size ? `<p class="sperr">${[...gruende].map(([id, t]) => `<span><b>${id}</b>${esc(t)}</span>`).join("")}</p>` : ""}</div>`;
  }

  K.route("konfig", () => {
    const mo = K.konfModell(); if (!mo) return keinModell();
    const k = K.konf; const p = E.produkt(mo, k.produkt);
    if (!p) return `<div class="leer">Bitte zuerst im Katalog ein Fahrzeug wählen.<br><br><a class="btn primary" href="#katalog">Zum Katalog</a></div>`;
    const pm = E.produktMerkmale(mo, p), g = E.sperren(mo, p, k.sel, pm), gs = E.gesetzt(mo, p, k.sel, pm), preis = E.preis(mo, p, k.sel);
    const regeln = E.aktiveRegeln(mo, p, k.sel), offenAlle = E.offenePflicht(mo, p, k.sel);
    const bereiche = [...new Set(pm.map(x => E.bereich(x.m)))];
    if (![...bereiche, "kalkulation", "stueckliste"].includes(k.tab)) k.tab = bereiche[0];
    let links = "";
    const ga = p.grundausstattung || [];
    const gaHtml = !ga.length ? "" : `<details class="ga-block" ${k.gaOffen ? "open" : ""}><summary data-act="konfGa"><b>Grundausstattung</b><span class="gedimmt klein">${ga.length} Positionen inklusive</span></summary>
      ${[...new Set(ga.map(x => x.gruppe || ""))].map(gr => `${gr ? `<div class="eyebrow">${esc(gr)}</div>` : ""}<ul>${ga.filter(x => (x.gruppe || "") === gr).map(x => `<li><code>${esc(x.code)}</code> ${esc(x.name)}</li>`).join("")}</ul>`).join("")}</details>`;
    if (!bereiche.length && !["kalkulation", "stueckliste"].includes(k.tab)) links = gaHtml || `<div class="leer konf-leer"><b>Für dieses Fahrzeug sind noch keine Codes hinterlegt.</b><br>Es wird mit dem Grundpreis${p.basispreis ? ` von ${K.eur(p.basispreis)}` : ""} angeboten.${K.Store.schreiben ? `<br><br><button class="btn primary" type="button" data-act="kbBearbeiten" data-p="${p.id}">Codes im Katalog aufbauen hinzufügen</button>` : ""}</div>`;
    else if (bereiche.includes(k.tab)) {
      const imBereich = pm.filter(x => E.bereich(x.m) === k.tab), abschnitte = [...new Set(imBereich.map(x => x.m.abschnitt || ""))];
      links = (k.tab === bereiche[0] ? gaHtml : "") + abschnitte.map(ab => `<section class="abschnittblock">${ab && ab !== k.tab ? `<h2>${esc(ab)}</h2>` : ""}${imBereich.filter(x => (x.m.abschnitt || "") === ab).map(x => merkmalHtml(mo, p, x.m, x.werte, g, gs, k.sel)).join("")}</section>`).join("");
    } else if (k.tab === "stueckliste") {
      const st = E.stueckliste(mo, p, k.sel);
      links = `<div class="tabwrap"><table><thead><tr><th class="r">Pos</th><th>Artikel</th><th>Bezeichnung</th><th class="r">Menge</th><th>ME</th><th>Herkunft</th></tr></thead><tbody>
        ${st.map((z, i) => `<tr><td class="r num">${(i + 1) * 10}</td><td class="mono">${esc(z.nr)}</td><td>${esc(z.bez)}</td><td class="r num">${K.zahl(z.menge, 2)}</td><td>${esc(z.me)}</td><td class="gedimmt">${esc(z.herkunft)}</td></tr>`).join("")}</tbody></table></div>
        <div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="stlCsv">Als CSV speichern</button><span class="gedimmt klein">${st.length} Positionen aus der aktuellen Auswahl</span></div>`;
    } else {
      const db = preis.einzel - preis.kosten, marge = preis.einzel ? db / preis.einzel * 100 : 0;
      links = `<div class="tabwrap"><table><thead><tr><th>Code</th><th>Merkmal</th><th>Ausführung</th><th class="r">Preis</th><th class="r">Kosten</th><th class="r">DB</th></tr></thead><tbody>
        ${preis.zeilen.map(z => `<tr><td class="mono gedimmt">${esc(z.code || (z.mid === "_basis" ? p.code || "" : ""))}</td><td class="gedimmt">${esc(z.merkmal)}</td><td>${esc(z.text)}</td><td class="r num">${K.eur(z.preis)}</td><td class="r num gedimmt">${K.eur(z.kosten)}</td><td class="r num">${K.eur(z.preis - z.kosten)}</td></tr>`).join("")}
        <tr class="summe"><td colspan="3">Summe je Fahrzeug</td><td class="r num">${K.eur(preis.einzel)}</td><td class="r num">${K.eur(preis.kosten)}</td><td class="r num">${K.eur(db)}</td></tr></tbody></table></div>
        <p class="klein gedimmt" style="margin-top:8px">Marge ${K.zahl(marge, 1)} %. Kalkulationswerte sind intern und erscheinen nicht im Angebot.</p>`;
    }
    const ziel = k.ziel, foto = p.bild ? K.bildUrl(p.bild) : K.artikelBild(p.code);
    K.nach(v => { const pl = v.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, p, k.sel); });
    const zahl = b => offenAlle.filter(m => E.bereich(m) === b).length;
    const uebernehmenText = k.entwurf ? "" : ziel && ziel.idx != null ? `Position ${(ziel.idx + 1) * 10} aktualisieren` : ziel ? `In ${esc(ziel.nr)} übernehmen` : "Übernehmen";
    return `${k.entwurf ? `<div class="hinweis warn" style="margin-bottom:10px">Sie testen den <b>Entwurf</b> des Modells. Das Ergebnis kann nicht in Angebote übernommen werden. <button type="button" class="link" data-act="kbBearbeiten" data-p="${p.id}">Zurück zum Katalog aufbauen</button></div>` : ""}
    <header class="konf-bar">
      <span class="kb-bild">${produktBild(p, "currentColor")}</span>
      <div class="kb-name"><b>${esc(p.name)}</b><span class="mono">${esc(p.code || p.artnr || "")}</span></div>
      <span class="kb-version">${k.entwurf ? "Entwurf" : "Modell v" + mo.version}</span>
      <div class="kb-preis num">${preis.einzel || preis.zeilen.some(z => z.preis) ? K.eur2(preis.einzel) : `<span class="kb-preis-fehlt" title="Weder Grundpreis noch Preise an den Codes hinterlegt">kein Preis hinterlegt</span>`}</div>
      ${uebernehmenText ? `<button class="btn gelb" type="button" data-act="konfUebernehmen">✓ ${uebernehmenText}</button>` : ""}
      ${ziel && ziel.idx != null ? `<button class="btn kb-btn" type="button" data-act="konfZielLoesen">Als neue Position</button>` : ""}
      <button class="btn kb-btn" type="button" data-act="konfSchliessen">✕ Schließen</button>
    </header>
    <div class="konf2">
      <div class="konf-links">
        <div class="tabs-innen" role="tablist">${bereiche.map(b => `<button type="button" role="tab" data-act="konfTab" data-t="${esc(b)}" aria-selected="${k.tab === b}">${esc(b)}${zahl(b) ? ` <span class="tabzahl">${zahl(b)}</span>` : ""}</button>`).join("")}
          <button type="button" role="tab" data-act="konfTab" data-t="kalkulation" aria-selected="${k.tab === "kalkulation"}">Kalkulation</button>
          <button type="button" role="tab" data-act="konfTab" data-t="stueckliste" aria-selected="${k.tab === "stueckliste"}">Stückliste</button></div>
        ${k.notes.length ? `<div class="hinweise" style="margin-bottom:14px">${k.notes.map(n => `<div class="hinweis warn"><b>${esc(n.merkmal)}</b> angepasst: ${esc(n.von)} → ${esc(n.nach)} <span class="mono">(${n.regel})</span></div>`).join("")}</div>` : ""}
        <div class="abschnitte">${links}</div>
      </div>
      <aside class="side">
        <div class="panel ansicht${foto && !k.zeige3d ? " mit-foto" : ""}">${foto && !k.zeige3d ? `<div class="viewerplatz fotoplatz">${K.bildMitErsatz(foto, `<div class="v3d-leer">${K.silhouette(p.visual?.typ, "var(--muted)")}</div>`)}</div>` : `<div data-viewer class="viewerplatz"></div>`}
          <div class="row zwischen" style="padding:0 4px"><span class="gedimmt klein">${offenAlle.length ? `⚠ ${offenAlle.length} Pflichtangaben offen` : bereiche.length ? "Konfiguration vollständig" : ""}</span>
            <span class="row">${foto ? `<button class="btn klein" type="button" data-act="konfAnsicht">${k.zeige3d ? "Foto" : "3D-Ansicht"}</button>` : ""}<span class="nur3d row"><button class="btn klein" type="button" data-act="export3d" data-f="png">Bild speichern</button><button class="btn klein" type="button" data-act="export3d" data-f="glb">3D-Szene exportieren</button></span></span></div></div>
        <details class="panel regeln"><summary>Aktive Regeln (${regeln.length})</summary>
          <ul class="regelliste">${regeln.map(r => `<li><span class="mono">${r.id}</span><span>${esc(r.hinweis || E.satz(mo, r))}</span></li>`).join("") || "<li><span></span><span>Keine Einschränkungen aktiv.</span></li>"}</ul></details>
        <div class="row"><button class="btn klein" type="button" data-act="konfReset">Auswahl zurücksetzen</button><select id="konf-produkt" data-act="konfProdukt" aria-label="Grundfahrzeug wechseln">${mo.produkte.filter(x => x.aktiv !== false).map(x => `<option value="${x.id}" ${x.id === p.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
      </aside></div>`;
  });
  K.act.konfTab = el => { K.konf.tab = el.dataset.t; K.render(); };
  K.act.konfProdukt = el => { const mo = K.konfModell(), p = E.produkt(mo, el.value); const alt = K.konf.sel; const s = {}; for (const { m } of E.produktMerkmale(mo, p)) if (alt[m.id] != null) s[m.id] = alt[m.id]; K.konf.produkt = p.id; K.konf.sel = s; K.konf.notes = E.bereinige(mo, p, s); K.render(); };
  K.act.konfReset = () => { const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt); K.konf.sel = E.standardSel(mo, p); K.konf.notes = []; K.render(); };
  K.act.konfZielLoesen = () => { K.konf.ziel = { nr: K.konf.ziel.nr }; K.render(); };
  K.act.konfSchliessen = () => { const z = K.konf.ziel; if (K.konf.entwurf) return K.gehe("studio-regeln"); K.konf.ziel = null; K.gehe(z ? "angebot-" + z.nr : "katalog"); };
  function waehle(mid, w) {
    const mo = K.konfModell(), k = K.konf, p = E.produkt(mo, k.produkt), m = E.merkmal(mo, mid);
    if (m.typ === "mehrfach") { const l = k.sel[m.id] || []; k.sel[m.id] = l.includes(w) ? l.filter(x => x !== w) : [...l, w]; }
    else k.sel[m.id] = w;
    k.notes = E.bereinige(mo, p, k.sel, m.id); K.render();
  }
  K.act.wahl = el => waehle(el.dataset.m, el.dataset.w);
  const eigenSetzen = (key, v) => { const mo = K.konfModell(), k = K.konf, p = E.produkt(mo, k.produkt); k.sel[key] = v; k.notes = E.bereinige(mo, p, k.sel, key.split(".")[0]); K.render(); };
  K.inp.wahlZahl = el => eigenSetzen(el.dataset.k, el.value === "" ? null : Number(el.value));
  K.inp.wahlText = el => eigenSetzen(el.dataset.k, el.value);
  K.act.wahlJN = el => eigenSetzen(el.dataset.m + "." + el.dataset.w, !K.konf.sel[el.dataset.m + "." + el.dataset.w]);
  K.act.wahlSelect = el => { if (el.value) waehle(el.dataset.m, el.value); };
  K.act.export3d = async el => {
    const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt), name = (p.code || p.id) + "_" + new Date().toISOString().slice(0, 10);
    if (el.dataset.f === "png") { const url = await K.viewer().bild(mo, p, K.konf.sel, 1920, 1080); if (!url) return K.toast("3D-Ansicht nicht verfügbar."); const b = await (await fetch(url)).blob(); K.speichereDatei(name + ".png", b); }
    else { const z = await K.export3d(name).catch(e => { console.error(e); return null; }); if (z) K.speichereDatei(name + ".zip", z); else K.toast("3D-Export ist in dieser Ansicht nicht verfügbar."); }
  };
  K.act.stlCsv = () => {
    const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt), st = E.stueckliste(mo, p, K.konf.sel);
    const csv = "Pos;Artikel;Bezeichnung;Menge;ME;Herkunft\n" + st.map((r, i) => [(i + 1) * 10, r.nr, r.bez, String(r.menge).replace(".", ","), r.me, r.herkunft].join(";")).join("\n");
    K.speichereDatei(`Stueckliste_${p.code || p.id}.csv`, "﻿" + csv);
  };

  function positionAusKonfig() {
    const mo = live(), k = K.konf, p = E.produkt(mo, k.produkt), pr = E.preis(mo, p, k.sel);
    return { typ: "konfig", produkt: p.id, produktName: p.name, sel: K.clone(k.sel), zeilen: pr.zeilen, grundausstattung: (p.grundausstattung || []).map(x => ({ code: x.code, name: x.name })), einzel: pr.einzel, kosten: pr.kosten, menge: 1, rabatt: 0, version: mo.version };
  }
  K.act.konfUebernehmen = () => {
    const k = K.konf;
    if (!K.Store.schreiben) { K.toast("Sie haben nur Leserechte."); return; }
    { const mo = live(), p = E.produkt(mo, k.produkt), offen = E.offenePflicht(mo, p, k.sel);
      if (offen.length) { k.tab = E.bereich(offen[0]); K.render(); document.getElementById("mm-" + offen[0].id)?.scrollIntoView({ block: "center", behavior: "smooth" }); K.toast(`Noch ${offen.length} Pflichtangabe${offen.length > 1 ? "n" : ""} offen: ${offen.map(m => m.name).join(", ")}`); return; } }
    if (k.ziel) {
      const a = S().angebote.find(x => x.nr === k.ziel.nr); if (!a) { k.ziel = null; return K.act.konfUebernehmen(); }
      const neu = positionAusKonfig();
      if (k.ziel.idx != null && a.positionen[k.ziel.idx]) { const alt = a.positionen[k.ziel.idx]; neu.menge = alt.menge; neu.rabatt = alt.rabatt; a.positionen[k.ziel.idx] = neu; }
      else a.positionen.push(neu);
      K.Store.angebotSpeichern(a); const nr = a.nr; k.ziel = null; K.toast("Position übernommen"); K.gehe("angebot-" + nr); return;
    }
    const offen = S().angebote.filter(a => a.status === "entwurf").sort((x, y) => y.erstellt - x.erstellt);
    K.sheet(`<h3>In Angebot übernehmen</h3>
      <div class="feld"><label for="ua-kunde">Neues Angebot für</label><select id="ua-kunde">${kundenOptionen()}</select></div>
      <div class="row"><button class="btn primary" type="button" data-act="uebernehmenNeu">Neues Angebot anlegen</button></div>
      ${offen.length ? `<div class="trenner">oder zu einem Entwurf hinzufügen</div><ul class="liste">${offen.map(a => `<li><button type="button" class="zeile-link" data-act="uebernehmenIn" data-nr="${a.nr}"><span><b>${esc(a.kunde.firma)}</b><br><span class="mono klein">${a.nr}</span></span><span class="gedimmt klein">${a.positionen.length} Pos.</span></button></li>`).join("")}</ul>` : ""}
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button></div>`);
  };
  function kundenOptionen(aktiv) { return [...S().kunden].sort((a, b) => a.firma.localeCompare(b.firma)).map(k => `<option value="${k.id}" ${k.id === aktiv ? "selected" : ""}>${esc(k.firma)} · ${esc(k.ort)}</option>`).join(""); }
  K.act.konfGa = () => { K.konf.gaOffen = !K.konf.gaOffen; K.render(); };
  K.act.uebernehmenNeu = async () => { const kid = document.getElementById("ua-kunde").value; K.sheetZu(); const a = await neuesAngebot(kid); if (!a) return; a.positionen.push(positionAusKonfig()); await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };
  K.act.uebernehmenIn = el => { K.sheetZu(); K.konf.ziel = { nr: el.dataset.nr }; K.act.konfUebernehmen(); };

  /* =====================================================================
     Angebote
     ===================================================================== */
  async function neuesAngebot(kid) {
    const e = S().einst, k = S().kunden.find(x => x.id === kid);
    let num; try { num = await K.Store.naechsteNr(); } catch (err) { K.toast(err.message + " – Einstellungen › Nummern prüfen."); return null; }
    const nr = num.nr; if (num.quelle === "ersatz") K.toast("APplus hat keine Nummer geliefert, vorläufige Nummer " + nr + " vergeben.");
    const ich = K.Store.meinVertrieb || e.vertrieb[0]?.id;
    const a = { nr, kundeId: kid, kunde: k ? { firma: k.firma, person: k.person, strasse: k.strasse, ort: k.ort, mail: k.mail } : { firma: "", person: "", strasse: "", ort: "" },
      bearbeiter: ich, erstellt: Date.now(), gueltig: Date.now() + e.gueltigTage * 864e5, status: "entwurf", positionen: [], rabatt: 0,
      texte: { einleitung: e.vorlage.einleitung, lieferung: e.vorlage.lieferung, zahlung: e.vorlage.zahlung, gewaehrleistung: e.vorlage.gewaehrleistung, schluss: e.vorlage.schluss },
      token: null, freigegeben: false, events: [], nrQuelle: num.quelle, kundeNr: k?.nr || "" };
    { const b = (e.vertrieb || []).find(v => v.id === ich); if (b) a.bearbeiterInfo = { name: b.name, tel: b.tel, mail: b.mail, nr: b.nr || "" }; }
    await K.Store.nrVerbrauchen(nr); await K.Store.log("Angebote", `Angebot ${nr} angelegt`);
    return a;
  }
  K.act.angebotNeu = () => {
    if (!S().kunden.length) { K.toast("Bitte zuerst einen Kunden anlegen."); K.gehe("kunde-neu"); return; }
    K.sheet(`<h3>Neues Angebot</h3><div class="feld"><label for="na-kunde">Kunde</label><select id="na-kunde">${kundenOptionen()}</select></div>
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="angebotNeuOk">Anlegen</button></div>`);
  };
  K.act.angebotNeuOk = async () => { const kid = document.getElementById("na-kunde").value; K.sheetZu(); const a = await neuesAngebot(kid); if (!a) return; await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };

  K.ang = { status: "alle", suche: "" };
  K.route("angebote", () => {
    const f = K.ang, q = f.suche.toLowerCase();
    const liste = [...S().angebote].sort((a, b) => b.erstellt - a.erstellt)
      .filter(a => f.status === "alle" || (f.status === "heiss" ? K.heiss(a) : a.status === f.status))
      .filter(a => !q || (a.nr + " " + a.kunde.firma + " " + a.positionen.map(p => p.produktName || p.text).join(" ")).toLowerCase().includes(q));
    const zahl = s => S().angebote.filter(a => s === "heiss" ? K.heiss(a) : a.status === s).length;
    return kopf("Vertrieb", "Angebote", "", `<button class="btn primary" type="button" data-act="angebotNeu">Neues Angebot</button>`) + `
      <div class="filterleiste"><div class="segment" role="group" aria-label="Status">
        ${[["alle", "Alle", S().angebote.length], ["heiss", "Heiß", zahl("heiss")], ...Object.entries(STATUS).map(([k, v]) => [k, v, zahl(k)])].map(([id, n, c]) => `<button type="button" data-act="angStatus" data-s="${id}" aria-pressed="${f.status === id}">${n} <span class="zaehler">${c}</span></button>`).join("")}
      </div><input type="search" id="ang-suche" data-in="angSuche" placeholder="Nummer, Kunde oder Fahrzeug" value="${esc(f.suche)}"></div>
      ${angebotsTabelle(liste)}`;
  });
  K.act.angStatus = el => { K.ang.status = el.dataset.s; K.render(); };
  K.inp.angSuche = el => { K.ang.suche = el.value; K.render(); };

  /* ----- Angebot bearbeiten ----- */
  const ang = nr => S().angebote.find(a => a.nr === nr);
  let speicherTimer = {};
  function aendern(nr, fn, sofortZeichnen = true) {
    const a = ang(nr); if (!a) return; fn(a);
    clearTimeout(speicherTimer[nr]); speicherTimer[nr] = setTimeout(() => K.Store.angebotSpeichern(ang(nr) || a), 600);
    if (sofortZeichnen) K.render();
  }
  K.route("angebot-", nr => {
    const a = ang(nr); if (!a) return `<div class="leer">Angebot ${esc(nr)} nicht gefunden.<br><br><a class="btn" href="#angebote">Zu den Angeboten</a></div>`;
    const e = S().einst, sum = E.summen(a, e.mwst), lesbar = K.Store.schreiben;
    const av = K.aufrufe(a), mo = live();
    const tage = [...Array(14)].map((_, i) => { const t = new Date(); t.setHours(0, 0, 0, 0); const t0 = t.getTime() - (13 - i) * 864e5; return av.filter(x => x.ts >= t0 && x.ts < t0 + 864e5).length; });
    const mx = Math.max(1, ...tage), link = a.token ? location.href.split("#")[0] + "#" + a.token : "";
    const posZeilen = a.positionen.map((p, i) => {
      const veraltet = p.typ === "konfig" && mo && p.version !== mo.version;
      const brutto = p.einzel * p.menge, ges = brutto * (1 - (p.rabatt || 0) / 100);
      return `<tr>
        <td class="r num gedimmt">${(i + 1) * 10}</td>
        <td>${p.typ === "konfig" ? `<b>${esc(p.produktName)}</b>${veraltet ? ` <span class="chip warn" title="Mit Modell v${p.version} konfiguriert">Modell v${p.version}</span>` : ""}
            <details class="posdetail"><summary>${p.zeilen.length - 1} Merkmale</summary><ul>${p.zeilen.slice(1).map(z => `<li><span class="gedimmt">${esc(z.ueberschrift || z.merkmal)}:</span> ${esc(z.text)}</li>`).join("")}</ul></details>`
          : `<input id="pt-${i}" class="flach" data-in="posText" data-nr="${a.nr}" data-i="${i}" value="${esc(p.text)}" aria-label="Positionstext" ${lesbar ? "" : "disabled"}>`}</td>
        <td class="r">${p.typ === "frei" ? `<input id="pe-${i}" class="flach zahl" type="number" step="10" data-in="posEinzel" data-nr="${a.nr}" data-i="${i}" value="${p.einzel}" aria-label="Einzelpreis" ${lesbar ? "" : "disabled"}>` : `<span class="num">${K.eur2(p.einzel)}</span>`}</td>
        <td class="r"><input id="pm-${i}" class="flach zahl kurz" type="number" min="1" data-in="posMenge" data-nr="${a.nr}" data-i="${i}" value="${p.menge}" aria-label="Menge" ${lesbar ? "" : "disabled"}></td>
        <td class="r"><input id="pr-${i}" class="flach zahl kurz" type="number" min="0" max="100" step="0.5" data-in="posRabatt" data-nr="${a.nr}" data-i="${i}" value="${p.rabatt || 0}" aria-label="Rabatt in Prozent" ${lesbar ? "" : "disabled"}></td>
        <td class="r num"><b>${K.eur2(ges)}</b></td>
        <td class="r nowrap">${lesbar ? `${p.typ === "konfig" ? `<button type="button" class="ikon" data-act="posBearbeiten" data-nr="${a.nr}" data-i="${i}" title="Konfiguration bearbeiten">✎</button>${veraltet ? `<button type="button" class="ikon" data-act="posNeuBewerten" data-nr="${a.nr}" data-i="${i}" title="Mit aktuellem Modell neu bewerten">↻</button>` : ""}` : ""}
          <button type="button" class="ikon" data-act="posKopie" data-nr="${a.nr}" data-i="${i}" title="Position kopieren">⧉</button>
          <button type="button" class="ikon" data-act="posHoch" data-nr="${a.nr}" data-i="${i}" title="Nach oben" ${i ? "" : "disabled"}>↑</button>
          <button type="button" class="ikon gefahr" data-act="posWeg" data-nr="${a.nr}" data-i="${i}" title="Position entfernen">✕</button>` : ""}</td></tr>`;
    }).join("");
    const textFeld = (key, titel, zeilen = 3) => `<div class="feld"><label for="tx-${key}">${titel}</label><textarea id="tx-${key}" rows="${zeilen}" data-in="angText" data-nr="${a.nr}" data-k="${key}" ${lesbar ? "" : "disabled"}>${esc(a.texte?.[key] || "")}</textarea></div>`;
    return `${kopf("Angebot", `${esc(a.nr)} <span class="titel-zusatz">${esc(a.kunde.firma)}</span>`, "",
      `${K.statusChip(a)}${a.nrQuelle === "applus" ? `<span class="chip" title="Nummer aus dem Nummernkreis von APplus">Nr. aus APplus</span>` : a.nrQuelle === "ersatz" ? `<span class="chip warn" title="APplus hat beim Anlegen keine Nummer geliefert">vorläufige Nr.</span>` : ""}<select id="a-vorlage" class="ang-vorlage" data-act="angVorlage" data-nr="${a.nr}" aria-label="Vorlage für das Dokument" title="Vorlage für das Angebotsdokument" ${lesbar ? "" : "disabled"}><option value="">Vorlage: automatisch (${esc(K.dok.vorlageFuer({ ...a, vorlageId: null }, mo).name)})</option>${K.dok.vorlagen().map(v => `<option value="${v.id}" ${a.vorlageId === v.id ? "selected" : ""}>Vorlage: ${esc(v.name)}</option>`).join("")}</select>
       <button class="btn" type="button" data-act="angVorschau" data-nr="${a.nr}">Dokument ansehen</button><button class="btn" type="button" data-act="angDrucken" data-nr="${a.nr}">Drucken</button><button class="btn primary" type="button" data-act="angPdf" data-nr="${a.nr}">PDF speichern</button>
       <button class="btn" type="button" data-act="angKopie" data-nr="${a.nr}">Duplizieren</button>
       <button class="btn gefahr-text" type="button" data-act="angLoeschen" data-nr="${a.nr}">Löschen</button>`)}
    ${a.beispiel ? `<div class="hinweis" style="margin-bottom:12px">Beispielangebot mit erfundenen Kundenaktivitäten.</div>` : ""}
    ${K.offeneFragen(a).map(q => `<div class="hinweis warn frage"><div><b>Rückfrage vom ${K.zeit(q.ts)}</b><q>${esc(q.text)}</q></div><button class="btn klein" type="button" data-act="frageErledigt" data-nr="${a.nr}" data-ts="${q.ts}">Als beantwortet markieren</button></div>`).join("")}
    <div class="angebot-layout"><div class="haupt">
      <section class="panel"><div class="formgitter">
        <div class="feld"><label for="a-kunde">Kunde</label><select id="a-kunde" data-act="angKunde" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${kundenOptionen(a.kundeId)}</select></div>
        <div class="feld"><label for="a-person">Ansprechpartner</label><input id="a-person" data-in="angKundeFeld" data-k="person" data-nr="${a.nr}" value="${esc(a.kunde.person)}" ${lesbar ? "" : "disabled"}></div>
        <div class="feld"><label for="a-bearb">Bearbeiter</label><select id="a-bearb" data-act="angFeld" data-k="bearbeiter" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${(e.vertrieb || []).map(v => `<option value="${v.id}" ${v.id === a.bearbeiter ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div>
        <div class="feld"><label for="a-status">Status</label><select id="a-status" data-act="angFeld" data-k="status" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === a.status ? "selected" : ""}>${v}</option>`).join("")}</select></div>
        <div class="feld"><label>Erstellt</label><div class="wert">${K.datum(a.erstellt)}</div></div>
        <div class="feld"><label for="a-gueltig">Gültig bis</label><input id="a-gueltig" type="date" data-chg="angGueltig" data-nr="${a.nr}" value="${new Date(a.gueltig).toISOString().slice(0, 10)}" ${lesbar ? "" : "disabled"}></div>
      </div></section>
      <section class="panel"><div class="panelkopf"><h3>Positionen</h3>${lesbar ? `<div class="row"><button class="btn klein" type="button" data-act="posKonfig" data-nr="${a.nr}">+ Fahrzeug konfigurieren</button><button class="btn klein" type="button" data-act="posFrei" data-nr="${a.nr}">+ Freie Position</button></div>` : ""}</div>
        ${a.positionen.length ? `<div class="tabwrap ohne-rand"><table class="positionen"><thead><tr><th class="r">Pos</th><th>Bezeichnung</th><th class="r">Einzelpreis</th><th class="r">Menge</th><th class="r">Rabatt %</th><th class="r">Gesamt</th><th></th></tr></thead><tbody>${posZeilen}</tbody></table></div>`
          : `<p class="leer-klein">Noch keine Positionen. Fahrzeug konfigurieren oder eine freie Position (z. B. Überführung, Einweisung) hinzufügen.</p>`}
        <div class="summenblock">
          <div class="kalkbox"><div class="eyebrow">Kalkulation (intern)</div>
            <dl class="kalk"><dt>Herstellkosten</dt><dd class="num">${K.eur(sum.kosten)}</dd><dt>Deckungsbeitrag</dt><dd class="num">${K.eur(sum.db)}</dd><dt>Marge</dt><dd class="num ${sum.marge < 20 ? "warn" : "ok"}">${K.zahl(sum.marge, 1)} %</dd></dl></div>
          <dl class="summen num">
            <dt>Listenpreis</dt><dd>${K.eur2(sum.liste)}</dd>
            ${sum.posRabatt ? `<dt>Positionsrabatte</dt><dd>− ${K.eur2(sum.posRabatt)}</dd>` : ""}
            <dt><label for="a-rabatt">Gesamtrabatt %</label></dt><dd><input id="a-rabatt" class="flach zahl kurz" type="number" min="0" max="100" step="0.5" data-in="angRabatt" data-nr="${a.nr}" value="${a.rabatt || 0}" ${lesbar ? "" : "disabled"}>${sum.gesamtRabatt ? ` <span class="gedimmt">− ${K.eur2(sum.gesamtRabatt)}</span>` : ""}</dd>
            <dt>Summe netto</dt><dd>${K.eur2(sum.netto)}</dd><dt>USt. ${e.mwst} %</dt><dd>${K.eur2(sum.ust)}</dd>
            <dt class="gesamt">Gesamtbetrag</dt><dd class="gesamt">${K.eur2(sum.brutto)}</dd></dl>
        </div></section>
      <details class="panel texte" ${a.positionen.length ? "" : "open"}><summary><h3>Angebotstexte</h3><span class="gedimmt klein">Platzhalter wie {{kunde.firma}} werden im PDF ersetzt</span></summary>
        ${textFeld("einleitung", "Einleitung", 4)}${textFeld("lieferung", "Lieferung", 2)}${textFeld("zahlung", "Zahlungsbedingungen", 2)}${textFeld("gewaehrleistung", "Gewährleistung", 2)}${textFeld("schluss", "Schlusstext", 3)}
        ${lesbar ? `<button class="btn klein" type="button" data-act="angTexteVorlage" data-nr="${a.nr}">Texte aus Vorlage übernehmen</button>` : ""}</details>
    </div>
    <aside class="neben">
      <section class="panel"><div class="panelkopf"><h3>Verkaufsraum</h3>${a.freigegeben ? `<span class="chip st-angenommen">Freigegeben</span>` : `<span class="chip">Nicht freigegeben</span>`}</div>
        ${a.freigegeben ? `<p class="klein gedimmt">Der Kunde sieht Konfiguration, 3D-Ansicht und Preis und kann annehmen oder nachfragen. Jeder Aufruf wird hier gezählt.</p>
          <div class="linkfeld"><input id="a-link" readonly value="${esc(link)}" aria-label="Link für den Kunden"><button class="btn klein" type="button" data-act="linkKopieren">Kopieren</button></div>
          <div class="row" style="margin-top:8px"><button class="btn klein" type="button" data-act="vorschau" data-t="${a.token}">Als Kunde ansehen</button>${lesbar ? `<button class="btn klein" type="button" data-act="freigabe" data-nr="${a.nr}" data-an="0">Freigabe zurückziehen</button>` : ""}</div>
          <p class="klein gedimmt" style="margin-top:8px">Hinweis Prototyp: Kunden außerhalb Ihrer Organisation können den Link erst öffnen, wenn die Seite geteilt ist. In APplus läuft der Link über Ihren Webserver.</p>`
          : `<p class="klein gedimmt">Erzeugt einen persönlichen Link für ${esc(a.kunde.person || a.kunde.firma)}.</p>${lesbar ? `<button class="btn gelb" type="button" data-act="freigabe" data-nr="${a.nr}" data-an="1" ${a.positionen.length ? "" : "disabled"}>Im Verkaufsraum freigeben</button>` : ""}`}
      </section>
      <section class="panel"><div class="panelkopf"><h3>Aktivität</h3></div>
        <div class="miniwerte"><div><b class="num">${av.length}</b><span>Aufrufe</span></div><div><b class="num">${av.length ? K.dauer(lesezeit(a)) : "–"}</b><span>Lesezeit</span></div><div><b class="num">${av.length ? K.rel(Math.max(...av.map(x => x.ts))) : "–"}</b><span>zuletzt</span></div></div>
        <div class="balken" aria-label="Aufrufe der letzten 14 Tage">${tage.map(n => `<div class="${n ? "" : "leer"}" style="height:${n ? Math.max(12, n / mx * 100) : 4}%" title="${n} Aufrufe"></div>`).join("")}</div>
        <div class="balkenlabel"><span>vor 14 Tagen</span><span>heute</span></div>
        <ul class="zeitachse" style="margin-top:14px">
          <li><time>${K.zeit(a.erstellt)}</time>Angebot erstellt von ${esc(vertriebName(a.bearbeiter))}</li>
          ${[...(a.events || [])].sort((x, y) => x.ts - y.ts).map(ev => `<li class="${ev.typ}"><time>${K.zeit(ev.ts)}</time>${ev.typ === "aufruf" ? `Geöffnet · ${K.dauer(ev.dauer)} · ${esc(ev.geraet || "")}` : ev.typ === "pdf" ? "PDF gespeichert" : ev.typ === "rueckfrage" ? `Rückfrage${ev.erledigt ? " (beantwortet)" : ""}<q>${esc(ev.text)}</q>` : `Angenommen von ${esc(ev.name)}`}</li>`).join("")}
        </ul></section>
    </aside></div>`;
  });
  K.inp.posMenge = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].menge = Math.max(1, +el.value || 1));
  K.inp.posRabatt = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].rabatt = Math.min(100, Math.max(0, +el.value || 0)));
  K.inp.posEinzel = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].einzel = +el.value || 0);
  K.inp.posText = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].text = el.value, false);
  K.inp.angRabatt = el => aendern(el.dataset.nr, a => a.rabatt = Math.min(100, Math.max(0, +el.value || 0)));
  K.inp.angText = el => aendern(el.dataset.nr, a => { a.texte = a.texte || {}; a.texte[el.dataset.k] = el.value; }, false);
  K.inp.angKundeFeld = el => aendern(el.dataset.nr, a => a.kunde[el.dataset.k] = el.value, false);
  K.inp.angGueltig = el => { const t = new Date(el.value).getTime(); if (t) aendern(el.dataset.nr, a => a.gueltig = t); };
  K.act.angFeld = el => aendern(el.dataset.nr, a => { a[el.dataset.k] = el.value; if (el.dataset.k === "status") K.Store.log("Angebote", `${a.nr} auf ${STATUS[el.value]} gesetzt`); });
  K.act.angKunde = el => aendern(el.dataset.nr, a => { const k = S().kunden.find(x => x.id === el.value); a.kundeId = k.id; a.kunde = { firma: k.firma, person: k.person, strasse: k.strasse, ort: k.ort, mail: k.mail }; });
  K.act.posHoch = el => aendern(el.dataset.nr, a => { const i = +el.dataset.i; [a.positionen[i - 1], a.positionen[i]] = [a.positionen[i], a.positionen[i - 1]]; });
  K.act.posKopie = el => aendern(el.dataset.nr, a => a.positionen.splice(+el.dataset.i + 1, 0, K.clone(a.positionen[el.dataset.i])));
  K.act.posWeg = el => aendern(el.dataset.nr, a => a.positionen.splice(+el.dataset.i, 1));
  K.act.posFrei = el => aendern(el.dataset.nr, a => a.positionen.push({ typ: "frei", text: "Überführung zum Kunden", einzel: 850, kosten: 600, menge: 1, rabatt: 0 }));
  K.act.posKonfig = el => { K.konf.ziel = { nr: el.dataset.nr }; K.gehe("katalog"); };
  K.act.posBearbeiten = el => { const a = ang(el.dataset.nr), p = a.positionen[el.dataset.i]; K.konfigOeffnen(p.produkt, p.sel, { nr: a.nr, idx: +el.dataset.i }); };
  K.act.posNeuBewerten = el => aendern(el.dataset.nr, a => {
    const p = a.positionen[el.dataset.i], mo = live(), prod = E.produkt(mo, p.produkt); if (!prod) return K.toast("Fahrzeug existiert im aktuellen Modell nicht mehr.");
    const s = K.clone(p.sel), notes = E.bereinige(mo, prod, s), pr = E.preis(mo, prod, s);
    Object.assign(p, { sel: s, zeilen: pr.zeilen, einzel: pr.einzel, kosten: pr.kosten, version: mo.version, produktName: prod.name });
    K.toast(notes.length ? `Neu bewertet, ${notes.length} Merkmale angepasst` : "Mit aktuellem Modell neu bewertet");
  });
  K.act.angTexteVorlage = el => aendern(el.dataset.nr, a => { const v = S().einst.vorlage; a.texte = { einleitung: v.einleitung, lieferung: v.lieferung, zahlung: v.zahlung, gewaehrleistung: v.gewaehrleistung, schluss: v.schluss }; });
  K.act.frageErledigt = el => aendern(el.dataset.nr, a => { const q = a.events.find(x => x.typ === "rueckfrage" && String(x.ts) === el.dataset.ts); if (q) q.erledigt = true; });
  K.act.freigabe = el => aendern(el.dataset.nr, a => {
    const an = el.dataset.an === "1"; a.freigegeben = an; if (an && !a.token) a.token = K.token();
    if (an && a.status === "entwurf") a.status = "versendet";
    K.Store.log("Angebote", `${a.nr} im Verkaufsraum ${an ? "freigegeben" : "zurückgezogen"}`);
  });
  K.act.linkKopieren = () => { const i = document.getElementById("a-link"); (navigator.clipboard ? navigator.clipboard.writeText(i.value) : Promise.reject()).then(() => K.toast("Link kopiert"), () => { i.select(); K.toast("Link markiert, bitte mit Strg+C kopieren"); }); };
  K.act.angKopie = async el => {
    let num; try { num = await K.Store.naechsteNr(); } catch (err) { return K.toast(err.message); }
    const a = K.clone(ang(el.dataset.nr)), nr = num.nr; a.nrQuelle = num.quelle;
    Object.assign(a, { nr, erstellt: Date.now(), gueltig: Date.now() + S().einst.gueltigTage * 864e5, status: "entwurf", token: null, freigegeben: false, events: [], beispiel: false });
    await K.Store.nrVerbrauchen(nr); await K.Store.angebotSpeichern(a); await K.Store.log("Angebote", `${nr} als Kopie von ${el.dataset.nr} angelegt`); K.gehe("angebot-" + nr);
  };
  K.act.angLoeschen = el => K.sheet(`<h3>Angebot ${esc(el.dataset.nr)} löschen?</h3><p>Das Angebot und alle Aufrufe im Verkaufsraum werden entfernt. Der Kundenlink funktioniert danach nicht mehr.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="angLoeschenOk" data-nr="${esc(el.dataset.nr)}">Endgültig löschen</button></div>`);
  K.act.angLoeschenOk = async el => { K.sheetZu(); await K.Store.angebotLoeschen(el.dataset.nr); K.gehe("angebote"); K.toast("Angebot gelöscht"); };
  K.act.angPdf = async el => {
    const a = ang(el.dataset.nr); if (!a.positionen.length) return K.toast("Das Angebot hat noch keine Positionen.");
    el.disabled = true; el.textContent = "PDF wird erstellt …";
    try { const blob = await K.pdfErzeugen(a, live()); await K.speichereDatei(`Angebot_${a.nr}.pdf`, blob); }
    catch (e) { console.error(e); K.toast("PDF konnte nicht erstellt werden."); }
    K.render();
  };

  /* =====================================================================
     Kunden
     ===================================================================== */
  K.kd = { suche: "" };
  K.route("kunden", () => {
    const q = K.kd.suche.toLowerCase();
    const liste = [...S().kunden].sort((a, b) => a.firma.localeCompare(b.firma)).filter(k => !q || Object.values(k).join(" ").toLowerCase().includes(q));
    return kopf("Vertrieb", "Kunden", "", `<a class="btn primary" href="#kunde-neu">Neuer Kunde</a>`) + `
      <div class="filterleiste"><input type="search" id="kd-suche" data-in="kdSuche" placeholder="Firma, Ort, Ansprechpartner oder Kundennummer" value="${esc(K.kd.suche)}"></div>
      ${liste.length ? `<div class="tabwrap"><table class="klickbar"><thead><tr><th>Nr.</th><th>Firma</th><th>Ansprechpartner</th><th>Ort</th><th class="r">Angebote</th><th class="r">Volumen netto</th></tr></thead><tbody>
      ${liste.map(k => { const as = S().angebote.filter(a => a.kundeId === k.id); return `<tr data-act="oeffne" data-ziel="kunde-${k.id}" tabindex="0"><td class="mono">${esc(k.nr)}</td><td><b>${esc(k.firma)}</b></td><td>${esc(k.person)}</td><td class="gedimmt">${esc(k.ort)}</td><td class="r num">${as.length}</td><td class="r num">${K.eur(as.reduce((n, a) => n + E.summen(a, S().einst.mwst).netto, 0))}</td></tr>`; }).join("")}
      </tbody></table></div>` : `<div class="leer">Keine Kunden gefunden.</div>`}`;
  });
  K.inp.kdSuche = el => { K.kd.suche = el.value; K.render(); };
  K.kdEntwurf = null;
  K.route("kunde-", id => {
    const neu = id === "neu";
    let k = neu ? (K.kdEntwurf ||= { id: K.id("k"), nr: String(10000 + Math.floor(Math.random() * 9000)), firma: "", person: "", strasse: "", ort: "", land: "DE", mail: "", tel: "", notiz: "" }) : S().kunden.find(x => x.id === id);
    if (!k) return `<div class="leer">Kunde nicht gefunden.</div>`;
    const as = S().angebote.filter(a => a.kundeId === k.id).sort((a, b) => b.erstellt - a.erstellt);
    const f = (key, l, typ = "text", breit) => `<div class="feld${breit ? " breit" : ""}"><label for="kd-${key}">${l}</label><input id="kd-${key}" type="${typ}" data-in="kdFeld" data-k="${key}" data-id="${neu ? "neu" : k.id}" value="${esc(k[key])}" ${K.Store.schreiben ? "" : "disabled"}></div>`;
    return kopf("Kunde", neu ? "Neuer Kunde" : esc(k.firma), "", neu ? `<button class="btn primary" type="button" data-act="kdAnlegen">Kunde anlegen</button>` : `<button class="btn" type="button" data-act="kdAngebot" data-id="${k.id}">Neues Angebot</button><button class="btn gefahr-text" type="button" data-act="kdLoeschen" data-id="${k.id}">Löschen</button>`) + `
      <section class="panel"><div class="formgitter">${f("firma", "Firma", "text", true)}${f("nr", "Kundennummer")}${f("person", "Ansprechpartner")}${f("strasse", "Straße")}${f("ort", "PLZ und Ort")}${f("mail", "E-Mail", "email")}${f("tel", "Telefon", "tel")}
        <div class="feld breit"><label for="kd-notiz">Notiz</label><textarea id="kd-notiz" rows="2" data-in="kdFeld" data-k="notiz" data-id="${neu ? "neu" : k.id}">${esc(k.notiz)}</textarea></div></div></section>
      ${neu ? "" : `<section style="margin-top:16px"><h3 class="abschnitt">Angebote</h3>${angebotsTabelle(as)}</section>`}`;
  });
  let kdTimer;
  K.inp.kdFeld = el => {
    if (el.dataset.id === "neu") { K.kdEntwurf[el.dataset.k] = el.value; return; }
    const k = S().kunden.find(x => x.id === el.dataset.id); k[el.dataset.k] = el.value;
    clearTimeout(kdTimer); kdTimer = setTimeout(() => K.Store.kundeSpeichern(k), 600);
  };
  K.act.kdAnlegen = async () => {
    const k = K.kdEntwurf; if (!k.firma.trim()) { K.toast("Bitte die Firma eintragen."); document.getElementById("kd-firma").focus(); return; }
    K.kdEntwurf = null; await K.Store.kundeSpeichern(k, true); K.gehe("kunde-" + k.id);
  };
  K.act.kdAngebot = async el => { const a = await neuesAngebot(el.dataset.id); if (!a) return; await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };
  K.act.kdLoeschen = el => {
    const n = S().angebote.filter(a => a.kundeId === el.dataset.id).length;
    K.sheet(`<h3>Kunde löschen?</h3><p>${n ? `Zu diesem Kunden gibt es ${n} Angebote. Sie bleiben erhalten, verweisen aber auf keinen Kunden mehr.` : "Der Kunde wird entfernt."}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="kdLoeschenOk" data-id="${el.dataset.id}">Löschen</button></div>`);
  };
  K.act.kdLoeschenOk = async el => { K.sheetZu(); await K.Store.kundeLoeschen(el.dataset.id); K.gehe("kunden"); };

  /* =====================================================================
     Verkaufsraum (Kundensicht)
     ===================================================================== */
  K.raum = { token: null, ev: null, start: 0, pos: 0, modus: null };
  K.vorschau = false;
  K.act.vorschau = el => { K.vorschau = true; K.gehe(el.dataset.t); };
  function raumBesuchBeenden() {
    const r = K.raum; if (!r.ev) return;
    const a = S().angebote.find(x => x.token === r.token);
    const ev = { ...r.ev, dauer: Math.round((r.ev.dauer || 0) + (Date.now() - r.start) / 1000) };
    r.ev = null; if (a) K.Store.ereignis(a.nr, ev);
  }
  K.raumVerlassen = () => { raumBesuchBeenden(); K.raum.token = null; };
  document.addEventListener("visibilitychange", () => {
    const r = K.raum; if (!r.token || K.vorschau) return;
    if (document.visibilityState === "hidden" && r.ev) { const ev = r.ev; raumBesuchBeenden(); r.pausiert = ev; }
    else if (document.visibilityState === "visible" && r.pausiert) { r.ev = r.pausiert; r.pausiert = null; r.start = Date.now(); }
  });
  window.addEventListener("pagehide", raumBesuchBeenden);

  K.route("raum-", token => {
    const a = S().angebote.find(x => x.token === "raum-" + token);
    const firma = S().einst?.firma || { name: "" };
    const bar = K.vorschau ? `<div class="demobar"><b>Vorschau aus Kundensicht</b><span>Wird nicht als Aufruf gezählt.</span><button class="btn klein" type="button" data-act="vorschauEnde" data-nr="${a ? a.nr : ""}">Zurück zum Angebot</button></div>` : "";
    if (!a || !a.freigegeben) return bar + `<div class="raum"><div class="leer"><b>Dieses Angebot ist nicht mehr verfügbar.</b><br>Bitte wenden Sie sich an Ihren Ansprechpartner bei ${esc(firma.name)}.</div></div>`;
    const r = K.raum;
    if (r.token !== a.token) {
      raumBesuchBeenden(); r.token = a.token; r.pos = 0; r.modus = null;
      if (!K.vorschau) { r.ev = { id: K.id("e"), typ: "aufruf", ts: Date.now(), dauer: 0, geraet: matchMedia("(max-width:700px)").matches ? "Mobil" : "Desktop" }; r.start = Date.now(); K.Store.ereignis(a.nr, r.ev); }
    }
    const e = S().einst, sum = E.summen(a, e.mwst), v = (e.vertrieb || []).find(x => x.id === a.bearbeiter) || {}, mo = live();
    const konf = a.positionen.filter(p => p.typ === "konfig"), p = konf[Math.min(r.pos, konf.length - 1)];
    const prod = p && mo ? E.produkt(mo, p.produkt) : null;
    if (prod) K.nach(view => { const pl = view.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, prod, p.sel); });
    const angenommen = a.status === "angenommen", abgelaufen = Date.now() > a.gueltig;
    const vorname = (a.kunde.person || "").replace(/^(Herr|Frau)\s+/, "");
    return bar + `<div class="raum">
      <header class="raum-kopf"><div class="raum-marke">${esc(firma.name)}<i></i></div><span class="gedimmt">Angebot <span class="mono">${esc(a.nr)}</span> · gültig bis ${K.datum(a.gueltig)}</span></header>
      <section class="raum-hero"><div>
        <div class="eyebrow">Für ${esc(a.kunde.firma)}</div>
        <h1>${konf.length === 1 ? `Ihr ${esc(konf[0].produktName)}` : `Ihre ${konf.length} Fahrzeuge`}</h1>
        <p>${a.kunde.person ? `Guten Tag ${esc(a.kunde.person)}, ` : ""}hier sehen Sie Ihre Konfiguration in 3D, alle Ausstattungsdetails und Ihren Preis. Drehen Sie das Fahrzeug mit der Maus oder dem Finger.</p>
      </div></section>
      ${konf.length > 1 ? `<div class="segment raum-tabs" role="tablist">${konf.map((x, i) => `<button type="button" role="tab" data-act="raumPos" data-i="${i}" aria-selected="${i === r.pos}">${x.menge}× ${esc(x.produktName)}</button>`).join("")}</div>` : ""}
      <div class="raum-grid">
        <div class="panel ansicht gross"><div data-viewer class="viewerplatz"></div></div>
        <div class="panel"><div class="eyebrow">Ausstattung</div>
          ${p ? `<dl class="spec">${p.zeilen.slice(1).map(z => `<dt>${esc(z.ueberschrift || z.merkmal)}</dt><dd>${esc(z.text)}</dd>`).join("")}</dl>
          <div class="row zwischen" style="margin-top:12px"><span class="gedimmt">Einzelpreis netto</span><b class="num">${K.eur2(p.einzel)}</b></div>` : ""}
        </div>
      </div>
      <div class="raum-grid unten">
        <section class="panel"><div class="eyebrow">Ihr Angebot im Überblick</div>
          <div class="tabwrap ohne-rand"><table><tbody>${a.positionen.map(x => `<tr><td>${x.menge}×</td><td>${esc(x.produktName || x.text)}${x.rabatt ? ` <span class="gedimmt klein">abzgl. ${K.zahl(x.rabatt, 1)} %</span>` : ""}</td><td class="r num">${K.eur2(x.einzel * x.menge * (1 - (x.rabatt || 0) / 100))}</td></tr>`).join("")}
          ${a.rabatt ? `<tr><td></td><td>Gesamtrabatt ${K.zahl(a.rabatt, 1)} %</td><td class="r num">− ${K.eur2(sum.gesamtRabatt)}</td></tr>` : ""}</tbody></table></div>
          <div class="raum-preis"><span>Gesamt netto</span><b class="num">${K.eur2(sum.netto)}</b><small>zzgl. ${e.mwst} % USt. ${K.eur2(sum.ust)} · brutto ${K.eur2(sum.brutto)}</small></div>
          ${a.texte?.lieferung ? `<p class="klein gedimmt">${esc(K.platzhalter(a.texte.lieferung, a, e))}</p>` : ""}
        </section>
        <section class="panel" id="raum-aktion">
          ${angenommen ? `<div class="hinweis ok"><b>Sie haben dieses Angebot angenommen.</b> Vielen Dank. Wir melden uns in Kürze mit der Auftragsbestätigung.</div>`
            : abgelaufen ? `<div class="hinweis warn">Dieses Angebot ist am ${K.datum(a.gueltig)} abgelaufen. Für eine Verlängerung wenden Sie sich bitte an uns.</div>`
            : r.modus === "annehmen" ? `<div class="form"><div class="feld"><label for="r-name">Name der unterzeichnenden Person</label><input id="r-name" value="${esc(vorname)}"></div>
                <p class="klein gedimmt">Mit der Bestätigung nehmen Sie das Angebot ${esc(a.nr)} über ${K.eur2(sum.brutto)} brutto verbindlich an.</p>
                <div class="row"><button class="btn gelb" type="button" data-act="raumAnnehmen" data-nr="${a.nr}">Verbindlich annehmen</button><button class="btn" type="button" data-act="raumModus" data-m="">Abbrechen</button></div></div>`
            : r.modus === "frage" ? `<div class="form"><div class="feld"><label for="r-frage">Ihre Frage an ${esc(v.name || "uns")}</label><textarea id="r-frage" rows="4" placeholder="z. B. Lieferzeit, andere Bereifung, Finanzierung"></textarea></div>
                <div class="row"><button class="btn primary" type="button" data-act="raumFrage" data-nr="${a.nr}">Frage senden</button><button class="btn" type="button" data-act="raumModus" data-m="">Abbrechen</button></div></div>`
            : `<div class="eyebrow">Wie möchten Sie weitermachen?</div><div class="raum-knoepfe">
                <button class="btn gelb gross" type="button" data-act="raumModus" data-m="annehmen">Angebot annehmen</button>
                <button class="btn gross" type="button" data-act="raumModus" data-m="frage">Rückfrage stellen</button>
                <button class="btn gross" type="button" data-act="raumPdf" data-nr="${a.nr}">Angebot als PDF</button></div>`}
          <div class="ansprech"><div class="avatar">${esc((v.name || "?").split(" ").map(x => x[0]).join(""))}</div><div><b>${esc(v.name || "")}</b><br><span class="gedimmt klein">Ihr Ansprechpartner</span><br><span class="mono klein">${esc(v.tel || "")}</span><br><span class="mono klein">${esc(v.mail || "")}</span></div></div>
        </section>
      </div></div>`;
  }, { kunde: true });
  K.act.raumPos = el => { K.raum.pos = +el.dataset.i; K.render(); };
  K.act.raumModus = el => { K.raum.modus = el.dataset.m || null; K.render(); };
  K.act.vorschauEnde = el => { K.vorschau = false; K.raum.token = null; K.gehe(el.dataset.nr ? "angebot-" + el.dataset.nr : "angebote"); };
  K.act.raumAnnehmen = async el => {
    const n = document.getElementById("r-name").value.trim(); if (!n) { document.getElementById("r-name").focus(); return; }
    if (K.vorschau) { K.toast("Vorschau: Annahme wird nicht gespeichert."); K.raum.modus = null; K.render(); return; }
    await K.Store.ereignis(el.dataset.nr, { id: K.id("e"), typ: "angenommen", ts: Date.now(), name: n }); K.raum.modus = null; K.toast("Angebot angenommen"); K.render();
  };
  K.act.raumFrage = async el => {
    const t = document.getElementById("r-frage").value.trim(); if (!t) { document.getElementById("r-frage").focus(); return; }
    if (K.vorschau) { K.toast("Vorschau: Rückfrage wird nicht gespeichert."); K.raum.modus = null; K.render(); return; }
    await K.Store.ereignis(el.dataset.nr, { id: K.id("e"), typ: "rueckfrage", ts: Date.now(), text: t }); K.raum.modus = null; K.toast("Ihre Frage wurde übermittelt"); K.render();
  };
  K.act.raumPdf = async el => {
    const a = S().angebote.find(x => x.nr === el.dataset.nr); el.disabled = true; el.textContent = "PDF wird erstellt …";
    try { const ok = await K.speichereDatei(`Angebot_${a.nr}.pdf`, await K.pdfErzeugen(a, live())); if (ok && !K.vorschau) K.Store.ereignis(a.nr, { id: K.id("e"), typ: "pdf", ts: Date.now() }); }
    catch (e) { K.toast("PDF konnte nicht erstellt werden."); }
    K.render();
  };
})();
