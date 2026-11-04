/* =========================================================================
   Grundgerüst: Konfiguration, Hilfsfunktionen, Router, Ereignisverteilung
   Alles hängt am Namensraum window.KONF und arbeitet nur innerhalb des
   eigenen Wurzelelements (#konfigurator), damit APplus nicht gestört wird.
   ========================================================================= */
(function () {
  const K = window.KONF = window.KONF || {};

  /* ---------- Konfiguration (überschreibbar über window.KONF_CONFIG) ---------- */
  K.cfg = Object.assign({
    mount: "#konfigurator",
    /** Andere Inhalte im APplus-#content ausblenden und volle Breite nutzen */
    maximize: true,
    /** Ansicht in der Adresszeile (#katalog) führen. In APplus aus, im Prototyp an. */
    hash: !!(window.claude && window.claude.use),
    storageKey: "konf-v1",
    /** APplus-Abfragen. Leer lassen = Beispieldaten. Format siehe LIESMICH. */
    queries: { codes: "", produkte: "", merkmale: "", regeln: "", katalog: "", stueckliste: "", kunden: "", artikel: "", vertrieb: "", angebotsnummer: "" },
    /** Optional: eigene Funktion, die eine Angebotsnummer im ERP reserviert, z. B. über einen Webdienst.
        async (einst) => "AN-2026-01234"  – hat Vorrang vor der Abfrage. */
    angebotsnummer: null,
    /** Spalten der Artikel-Abfrage (Tabelle ARTIKEL). Erste vorhandene Spalte gewinnt, Groß/Klein egal. */
    artikelSpalten: { code: ["ARTIKEL"], bild: ["BILD", "BILDURL", "DOCUMENTS", "IMAGE", "FOTO"], name: ["NAME", "BEZEICHNUNG", "ARTIKELBEZEICHNUNG", "BEZ", "TEXT", "KURZTEXT"], preis: ["VKPREIS", "VK_PREIS", "LISTENPREIS", "PREIS", "NETTO", "NETTOPREIS"], kosten: ["HERSTELLKOSTEN", "KOSTEN", "EKPREIS", "EK_PREIS", "SELBSTKOSTEN"], me: ["ME", "MENGENEINHEIT", "EINHEIT"], gruppe: ["ARTIKELGRUPPE", "WARENGRUPPE", "GRUPPE"] },
    loadQuery: async function (name) {
      if (!name || location.protocol === "file:") return null;
      const app = location.pathname.split("/").slice(0, 2).join("/");
      const res = await fetch(app + "/kidb/dashboard/ViewQuery.aspx?name=" + encodeURIComponent(name) + "&xhr=json&t=" + Date.now(), { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const t = await res.text(); if (!t) return [];
      const d = JSON.parse(t); if (!Array.isArray(d)) throw new Error("kein Array geliefert");
      return d;
    },
    /** Bibliotheken, die bei Bedarf nachgeladen werden */
    libs: {
      three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      gltfloader: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
      gltfexporter: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js",
      jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
      xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
      pdfjs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs",
      pdfjsWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs",
      pdflib: "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
    }
  }, window.KONF_CONFIG || {});
  K.hashModus = !!K.cfg.hash;

  /* ---------- Bibliotheken nachladen ---------- */
  const PRUEF = { three: () => window.THREE, gltfloader: () => window.THREE && window.THREE.GLTFLoader, gltfexporter: () => window.THREE && window.THREE.GLTFExporter, jspdf: () => window.jspdf, jszip: () => window.JSZip, xlsx: () => window.XLSX, pdflib: () => window.PDFLib };
  const ladend = {};
  K.lib = async (...namen) => {
    for (const n of namen) {
      if (PRUEF[n] && PRUEF[n]()) continue;
      if ((n === "gltfloader" || n === "gltfexporter")) await K.lib("three");
      ladend[n] ||= new Promise((ok, nein) => {
        const s = document.createElement("script"); s.src = K.cfg.libs[n]; s.async = true;
        s.onload = () => PRUEF[n] && !PRUEF[n]() ? nein(new Error(n + " nicht geladen")) : ok(); s.onerror = () => { delete ladend[n]; nein(new Error(n + " nicht erreichbar")); };
        document.head.appendChild(s);
      });
      await ladend[n];
    }
    return true;
  };

  K.esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  K.eur = n => nf0.format(n || 0);
  K.eur2 = n => nf2.format(n || 0);
  K.zahl = (n, d = 0) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: d }).format(n || 0);
  K.datum = ts => ts ? new Date(ts).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–";
  K.zeit = ts => new Date(ts).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  K.dauer = s => { s = Math.round(s || 0); return s < 60 ? `${s} s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`; };
  K.rel = ts => {
    const m = Math.round((Date.now() - ts) / 6e4); if (m < 1) return "gerade eben"; if (m < 60) return `vor ${m} min`;
    const h = Math.round(m / 60); if (h < 24) return `vor ${h} h`; const d = Math.round(h / 24); return d === 1 ? "gestern" : `vor ${d} Tagen`;
  };
  K.id = (p = "") => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  K.token = () => "raum-" + Array.from({ length: 10 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");
  K.clone = o => JSON.parse(JSON.stringify(o));
  K.el = id => document.getElementById(id);

  let tT; K.toast = t => { const el = K.el("konf-toast"); if (!el) return; el.textContent = t; el.hidden = false; clearTimeout(tT); tT = setTimeout(() => el.hidden = true, 3500); };

  /* ---------- Dialog ---------- */
  K.sheet = (html, breit) => {
    const s = K.el("konf-sheet");
    s.innerHTML = `<div class="sheet-bg" data-act="sheetZu"></div><div class="sheet-box${breit ? " breit" : ""}" role="dialog" aria-modal="true">${html}</div>`;
    s.hidden = false; const f = s.querySelector("input,select,textarea,button:not([data-act=sheetZu])"); if (f) f.focus();
  };
  K.sheetZu = () => { const s = K.el("konf-sheet"); if (!s) return; s.hidden = true; s.innerHTML = ""; };

  /* ---------- Router (intern, optional mit Adresszeile) ---------- */
  K.routes = []; K.act = {}; K.inp = {};
  K.route = (muster, fn, opt = {}) => K.routes.push({ muster, fn, ...opt });
  K.ort = (K.hashModus || /^#raum-/.test(location.hash)) && location.hash.length > 1 ? location.hash.slice(1) : "start";
  K.aktuell = () => K.hashModus ? (location.hash.slice(1) || "start") : K.ort;
  function finde(h) {
    for (const r of K.routes) {
      if (r.muster === h) return { r, arg: null };
      if (r.muster.endsWith("-") && h.startsWith(r.muster)) return { r, arg: h.slice(r.muster.length) };
    }
    return { r: K.routes.find(x => x.muster === "start"), arg: null };
  }
  K.nachRender = [];
  K.render = () => {
    const view = K.el("konf-view"); if (!view) return;
    const h = K.aktuell(), { r, arg } = finde(h);
    const ae = document.activeElement, fokus = ae && view.contains(ae) && ae.id ? { id: ae.id, s: ae.selectionStart, e: ae.selectionEnd } : null;
    K.ctx = { route: h, arg, def: r };
    if (K.root) K.root.dataset.modus = r.kunde ? "kunde" : "app";
    K.nachRender = [];
    let html = "";
    try { html = (K.waechter && K.waechter(r)) || r.fn(arg) || ""; } catch (e) { console.error(e); html = `<div class="leer"><b>Diese Ansicht konnte nicht geladen werden.</b><br>${K.esc(e.message)}</div>`; }
    view.innerHTML = html;
    for (const f of K.nachRender) try { f(view); } catch (e) { console.error(e); }
    if (fokus) { const el = K.el(fokus.id); if (el) { el.focus({ preventScroll: true }); try { if (fokus.s != null) el.setSelectionRange(fokus.s, fokus.e); } catch (e) {} } }
    K.navAktualisieren && K.navAktualisieren(h, r);
  };
  K.nach = f => K.nachRender.push(f);
  let letzte = null;
  K.routeGewechselt = () => {
    const h = K.aktuell();
    if (letzte && letzte.startsWith("raum-") && !h.startsWith("raum-") && K.raumVerlassen) K.raumVerlassen();
    letzte = h;
    if (K.kat && K.kat.entwurf && h !== "katalog" && h !== "konfig") K.kat.entwurf = false; // Entwurfs-Vorschau des Katalogs endet beim Verlassen
    K.render();
    if (K.root) { const top = K.root.getBoundingClientRect().top; if (top < 0) K.root.scrollIntoView({ block: "start" }); }
  };
  K.gehe = h => {
    if (K.hashModus) { if (location.hash.slice(1) === h) K.render(); else location.hash = h; return; }
    K.ort = h; K.routeGewechselt();
  };
  if (K.hashModus) window.addEventListener("hashchange", () => K.routeGewechselt());

  /* Neu zeichnen nach Datenänderung, aber nicht mitten in einer Eingabe */
  K._wartend = false;
  K.datenGeaendert = () => {
    const ae = document.activeElement, view = K.el("konf-view");
    if (ae && view && view.contains(ae) && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) { K._wartend = true; return; }
    K.render();
  };
  const imRoot = e => K.root && K.root.contains(e.target);
  document.addEventListener("focusout", e => { if (!imRoot(e) || !K._wartend) return; setTimeout(() => { const ae = document.activeElement; if (!(ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) { K._wartend = false; K.render(); } }, 60); });

  /* Ereignisse nur im eigenen Bereich: data-act (Klick/Änderung), data-in (Eingabe) */
  document.addEventListener("click", e => {
    if (!imRoot(e)) return;
    const a = e.target.closest('a[href^="#"]');
    if (a && !K.hashModus && K.root.contains(a)) { e.preventDefault(); K.gehe(a.getAttribute("href").slice(1)); return; }
    const el = e.target.closest("[data-act]"); if (!el || el.disabled || !K.root.contains(el)) return;
    if (el.tagName === "SELECT" || el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && el.type !== "button")) return;
    const f = K.act[el.dataset.act]; if (f) { e.preventDefault(); f(el, e); }
  });
  document.addEventListener("change", e => {
    if (!imRoot(e)) return;
    const el = e.target; if (!el.dataset) return;
    if (el.dataset.act && (el.tagName === "SELECT" || el.type === "checkbox" || el.type === "radio" || el.type === "file")) { const f = K.act[el.dataset.act]; if (f) f(el, e); }
    if (el.dataset.chg) { const f = K.inp[el.dataset.chg]; if (f) f(el, e); }
  });
  document.addEventListener("input", e => { if (!imRoot(e)) return; const el = e.target; const f = el.dataset && K.inp[el.dataset.in]; if (f) f(el, e); });
  document.addEventListener("keydown", e => {
    const s = K.el("konf-sheet");
    if (e.key === "Escape" && s && !s.hidden) K.sheetZu();
    if (e.key === "Enter" && imRoot(e) && e.target.matches("tr[data-act=oeffne]")) K.gehe(e.target.dataset.ziel);
  });
  K.act.sheetZu = () => K.sheetZu();

  /* Datei speichern: im Claude-Prototyp über dessen Download-Freigabe, sonst direkt im Browser */
  K.downloads = null;
  K.speichereDatei = async (name, data) => {
    if (K.downloads) {
      try { await K.downloads.save({ filename: name, data }); K.toast(name + " gespeichert"); return true; }
      catch (e) { if (e && e.code !== "declined") K.toast("Datei konnte nicht gespeichert werden."); return false; }
    }
    try {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = name; a.style.display = "none"; (K.root || document.body).appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000); K.toast(name + " gespeichert"); return true;
    } catch (e) { K.toast("Datei konnte nicht gespeichert werden."); return false; }
  };
})();
