/* =====================================================================
   Erklärungen als (i)-Symbol statt als Fließtext.
   K.tip(text) liefert ein Symbol; nach jedem Zeichnen werden lange, graue
   Erklärtexte (Seitenkopf, Feld- und Panelhinweise) automatisch zu Symbolen.
   Anzeige bei Maus, Tastaturfokus oder Antippen in einer schwebenden Box.
   ===================================================================== */
(function () {
  const K = window.KONF, esc = K.esc;
  K.tip = (text, label = "Erklärung") => text ? `<button type="button" class="tip-i" data-tip="${esc(String(text).replace(/<[^>]+>/g, ""))}" aria-label="${esc(label)}: ${esc(String(text).replace(/<[^>]+>/g, ""))}">i</button>` : "";
  const MIN = 38;
  const zuTip = (el, ziel) => {
    if (!el || !ziel || el.dataset.tipFertig || ziel.querySelector(":scope > .tip-i")) return;
    const html = el.innerHTML.trim(), text = el.textContent.trim(); if (text.length < MIN) return;
    if (el.querySelector("input,select,button,textarea,a[href]:not([href^='#'])")) return; // bedienbare Inhalte bleiben sichtbar
    const b = document.createElement("span"); b.innerHTML = K.tip(text); const knopf = b.firstChild; knopf.dataset.tipHtml = html;
    ziel.appendChild(knopf); el.dataset.tipFertig = "1"; el.classList.add("tip-quelle");
  };
  K.tippsAnwenden = root => {
    if (!root) return;
    root.querySelectorAll(".kopfzeile > div > p").forEach(p => zuTip(p, p.parentElement.querySelector("h2")));
    root.querySelectorAll(".feld > span.klein.gedimmt, .feld > .klein.gedimmt").forEach(s => zuTip(s, s.parentElement.querySelector("label") || s.parentElement.firstElementChild));
    root.querySelectorAll(".panel > h3 + p.klein.gedimmt, .panel > .panelkopf + p.klein.gedimmt, .panel > h3 + p.klein:not(.warntext):not(.gefahr-text)").forEach(p => { const h = p.previousElementSibling.matches("h3") ? p.previousElementSibling : p.previousElementSibling.querySelector("h3"); zuTip(p, h); });
    root.querySelectorAll(".panel > p.klein.gedimmt, .kb-pool > p.klein.gedimmt").forEach(p => zuTip(p, p.parentElement.querySelector(":scope > h3, :scope > .panelkopf h3")));
    root.querySelectorAll(".feld > p.klein.gedimmt").forEach(p => zuTip(p, p.parentElement.querySelector("label")));
    root.querySelectorAll("td > div.klein.gedimmt").forEach(d => zuTip(d, d.parentElement));
  };

  /* ---------- schwebende Box ---------- */
  let box = null, an = null, perKlick = false;
  const zeige = b => {
    if (!box) { box = document.createElement("div"); box.className = "tip-box"; box.setAttribute("role", "tooltip"); (K.root || document.body).appendChild(box); }
    an = b; box.innerHTML = b.dataset.tipHtml || esc(b.dataset.tip); box.hidden = false;
    const r = b.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 24); box.style.maxWidth = w + "px";
    const bw = box.offsetWidth, bh = box.offsetHeight;
    let x = Math.min(Math.max(12, r.left + r.width / 2 - bw / 2), window.innerWidth - bw - 12), y = r.bottom + 8;
    if (y + bh > window.innerHeight - 8) y = Math.max(8, r.top - bh - 8);
    box.style.left = x + "px"; box.style.top = y + "px"; b.setAttribute("aria-expanded", "true");
  };
  const weg = () => { if (box) box.hidden = true; if (an) an.removeAttribute("aria-expanded"); an = null; perKlick = false; };
  const istTip = t => t && t.closest && t.closest(".tip-i");
  document.addEventListener("mouseover", e => { const b = istTip(e.target); if (b) zeige(b); });
  document.addEventListener("mouseout", e => { const b = istTip(e.target); if (b && !perKlick && !b.contains(e.relatedTarget) && document.activeElement !== b) weg(); });
  document.addEventListener("focusin", e => { const b = istTip(e.target); if (b) zeige(b); });
  document.addEventListener("focusout", e => { if (istTip(e.target) && !perKlick) weg(); });
  document.addEventListener("click", e => { const b = istTip(e.target); if (b) { e.preventDefault(); e.stopPropagation(); if (an === b && perKlick) weg(); else { zeige(b); perKlick = true; } } else if (an) weg(); }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") weg(); });
  window.addEventListener("scroll", weg, true);
  const alt = K.render;
  K.render = () => { if (typeof weg === "function") weg(); alt(); try { K.tippsAnwenden(K.el("konf-view")); } catch (e) { console.warn(e); } };

})();
