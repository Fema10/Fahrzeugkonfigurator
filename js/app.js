/* Start der Anwendung: Navigation, Datenschicht, erstes Zeichnen */
(function () {
  const K = window.KONF, S = () => K.Store.S;

  const NAV = [
    ["Vertrieb", [["start", "Übersicht", "M3 12h7V3H3zm11 9h7v-9h-7zM3 21h7v-6H3zm11-12h7V3h-7z"], ["katalog", "Katalog", "M4 6h16M4 12h16M4 18h10"], ["konfig", "Konfigurator", "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6"], ["angebote", "Angebote", "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"], ["kunden", "Kunden", "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2-2.8M4 19v-1a3 3 0 0 1 2-2.8"]]],
    ["Studio", [["studio-katalog", "Katalog aufbauen", "M3 5h7v6H3zM14 5h7v6h-7zM3 15h7v4H3zM14 15h7v4h-7z"], ["studio-regeln", "Regeln", "M5 5h6v6H5zM13 13h6v6h-6zM11 8h4a2 2 0 0 1 2 2v3"], ["studio-import", "Excel-Import", "M4 4h16v16H4zM4 9h16M9 4v16M12 13l2 3m0-3-2 3"], ["studio-test", "Modelltest", "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"], ["studio-freigabe", "Freigabe", "M5 12l4 4L19 6"], ["studio-applus", "Nach APplus", "M4 12h12M12 6l6 6-6 6M20 4v16"], ["studio-vorlagen", "Angebotsdesigner", "M5 3h14v18H5zM9 7h6M9 11h6M9 15h3"], ["studio-einstellungen", "Einstellungen", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"], ["studio-protokoll", "Protokoll", "M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"]]],
    ["Experte", [["studio-modell", "Produktmodell", "M4 4h6v5H4zM14 15h6v5h-6zM4 15h6v5H4zM7 9v6M7 12h10v3"], ["studio-produkte", "Produkte", "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7"], ["studio-merkmale", "Merkmale", "M4 6h10M4 12h16M4 18h7M17 4v4M14 16v4"]]]
  ];
  const ikon = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  function navBauen() {
    K.el("konf-nav").innerHTML = `<div class="marke"><b>Fahrzeug&shy;konfigurator</b><span>CPQ für Auflieger</span></div>` +
      NAV.map(([titel, l]) => `<div class="navgruppe"><div class="navtitel">${titel}</div>${l.map(([h, n, d]) => `<a href="#${h}" data-r="${h}">${ikon(d)}<span>${n}</span><span class="badge" data-b="${h}" hidden></span></a>`).join("")}</div>`).join("") +
      `<div class="navfuss" id="konf-navfuss"></div>`;
  }
  const gruppeVon = h => h === "studio-import-vorlage" || h === "studio-import-struktur" ? "studio-import" : h.startsWith("angebot-") ? "angebote" : h.startsWith("kunde-") ? "kunden" : h;
  K.navAktualisieren = h => {
    const g = gruppeVon(h);
    K.root.querySelectorAll("#konf-nav a[data-r]").forEach(a => a.dataset.r === g ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const setze = (r, n) => { const b = K.root.querySelector(`[data-b="${r}"]`); if (b) { b.hidden = !n; b.textContent = n; } };
    setze("angebote", S().angebote.filter(a => K.offeneFragen(a).length).length);
    setze("studio-freigabe", K.freigabeOffen());
    const f = K.el("konf-navfuss"), m = K.Store.modus;
    f.innerHTML = m === "db" ? `<span class="punkt ${K.Store.schreiben ? "ok" : "warn"}"></span>${K.Store.schreiben ? "Gemeinsame Daten, live" : "Nur lesen"}` : m === "lokal" ? `<span class="punkt ${K.Store.applusQuellen ? "ok" : "warn"}"></span>${K.Store.applusQuellen ? "APplus-Daten, Änderungen lokal" : "Beispieldaten, im Browser gespeichert"}` : m === "demo" ? `<span class="punkt warn"></span>Demo-Modus, nichts wird gespeichert` : "Wird verbunden …";
  };

  K.waechter = r => {
    if (!S().geladen) return `<div class="leer laden"><span class="spinner"></span>Daten werden geladen …</div>`;
    if (!S().einst || (!S().live && !S().entwurf)) {
      return `<div class="leer"><h2>Willkommen</h2><p>Der Datenspeicher ist noch leer.</p>${K.Store.schreiben ? `<p>Laden Sie das Startmodell mit Aufliegertypen, Regeln und Beispielkunden oder importieren Sie Ihre Excel-Datei.</p><div class="row"><button class="btn primary" type="button" data-act="startmodell">Startmodell laden</button><a class="btn" href="#studio-import">Excel importieren</a></div>` : "<p>Bitte wenden Sie sich an die Person, die diese Anwendung eingerichtet hat.</p>"}</div>`;
    }
    return null;
  };

  /* Wie die übrigen APplus-Dashboards: oben in #content einhängen und den Rest ausblenden */
  function einhaengen() {
    let r = document.querySelector(K.cfg.mount);
    const content = document.getElementById("content");
    if (!r) {
      r = document.createElement("div"); r.id = "konfigurator";
      if (content) content.insertBefore(r, content.firstChild); else document.body.insertBefore(r, document.body.firstChild);
    }
    if (K.cfg.maximize && content && content.contains(r)) {
      Array.from(content.children).forEach(c => { if (c !== r) { c.setAttribute("data-konf-ausgeblendet", "1"); c.style.display = "none"; } });
      Object.assign(content.style, { width: "100%", maxWidth: "none", paddingLeft: "0", paddingRight: "0" });
    }
    r.innerHTML = `<div class="app"><nav id="konf-nav" aria-label="Konfigurator-Navigation"></nav><main id="konf-view" class="inhalt"></main></div><div id="konf-sheet" hidden></div><div class="toast" id="konf-toast" hidden role="status"></div>`;
    return r;
  }

  /** Fehler beim Start sichtbar machen statt einer leeren Seite */
  function startFehler(e) {
    console.error("[Konfigurator] Start fehlgeschlagen:", e);
    const r = K.root || document.getElementById("konfigurator") || document.body;
    const box = document.createElement("div");
    box.setAttribute("style", "margin:16px;padding:14px 16px;border:2px solid #C0392B;border-radius:8px;background:#FFF5F4;color:#222;font:14px/1.45 system-ui,sans-serif");
    box.innerHTML = "<b>Der Konfigurator konnte nicht starten.</b><br>Bitte diese Meldung weitergeben:<pre style='white-space:pre-wrap;margin:8px 0 0;font-size:12px'></pre>";
    box.querySelector("pre").textContent = String(e && (e.stack || e.message) || e);
    r.insertBefore(box, r.firstChild);
  }
  async function start() {
    try { await starten(); } catch (e) { startFehler(e); }
  }
  async function starten() {
    if (K.gestartet) return; K.gestartet = true;
    K.root = einhaengen();
    navBauen(); K.render();
    try { if (window.claude && window.claude.use) { const [d, a] = await Promise.all([window.claude.use("downloads"), window.claude.use("assets")]); K.downloads = d; K.assets = a; } } catch (e) {}
    K.Store.onChange(was => {
      if (was === "prefs") K.Store.meinVertrieb = S().prefs.vertrieb || null;
      K.datenGeaendert();
    });
    await K.Store.init();
    K.Store.meinVertrieb = S().prefs.vertrieb || null;
    K.render();
    if (K.Store.ladefehler && K.Store.ladefehler.length) K.toast(`${K.Store.ladefehler.length} APplus-Abfrage(n) nicht geladen, dort gelten Beispieldaten. Details in der Konsole.`);
  }
  window.KONF.neuLaden = async () => { await K.Store.init(); K.render(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
