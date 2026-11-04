/* =====================================================================
   Angebotsdokument: Vorlagen aus Bausteinen, Seitenumbruch, Vorschau,
   Druck und PDF. Ein einziger Aufbau für Designer-Vorschau, Druck,
   PDF-Datei und Verkaufsraum, damit überall dasselbe Dokument entsteht.
   PDF: Die fertig gesetzten Seiten werden mit pdf-lib als Vektor-PDF
   nachgezeichnet (Text bleibt markier- und durchsuchbar).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const D = K.dok = {};
  const uid = () => "b" + Math.random().toString(36).slice(2, 9);

  /* ---------- Vorlagen ---------- */
  D.TEXTQUELLEN = [["frei", "eigener Text"], ["einleitung", "Angebotstext: Einleitung"], ["lieferung", "Angebotstext: Lieferung"], ["zahlung", "Angebotstext: Zahlungsbedingungen"], ["gewaehrleistung", "Angebotstext: Gewährleistung"], ["schluss", "Angebotstext: Schluss"]];
  D.BAUSTEINE = [
    ["briefkopf", "Briefkopf", "Logo und Firmenname"], ["adresse", "Anschrift & Infoblock", "Empfänger links, Angebotsdaten rechts"],
    ["titel", "Titel", "z. B. Angebot {{angebot.nr}}"], ["text", "Text", "freier Text oder Angebotstext"],
    ["positionen", "Positionen", "Fahrzeuge mit Konfiguration"], ["uebersicht", "Positionsübersicht", "eine Zeile je Position"],
    ["summen", "Summen", "netto, USt., Gesamtbetrag"], ["bild", "Bild", "Foto, Grafik, Zertifikat"], ["tabelle", "Tabelle", "freie Tabelle"],
    ["unterschrift", "Gruß & Unterschrift", "mit Feld für Auftragserteilung"], ["agb", "AGB / Kleingedrucktes", "mehrspaltig, kleine Schrift"],
    ["stueckliste", "Stückliste", "als Anlage"], ["abstand", "Abstand", ""], ["linie", "Linie", ""], ["seitenumbruch", "Seitenumbruch", ""]];
  const NAME = Object.fromEntries(D.BAUSTEINE.map(b => [b[0], b[1]]));
  D.neuerBlock = typ => ({ id: uid(), typ, aktiv: true, ...({
    briefkopf: { logo: null, logoBreite: 45, ausrichtung: "rechts", zeigeName: true, zusatz: "" },
    adresse: { absenderzeile: true, info: "Angebot: {{angebot.nr}}\nDatum: {{angebot.datum}}\nGültig bis: {{angebot.gueltig}}\nKunden-Nr.: {{kunde.nr}}\nIhr Kontakt: {{bearbeiter.name}}\nTelefon: {{bearbeiter.tel}}\nE-Mail: {{bearbeiter.mail}}" },
    titel: { text: "Angebot {{angebot.nr}}", untertitel: "", groesse: 18 },
    text: { quelle: "frei", titel: "", text: "Text eingeben …" },
    positionen: { bild: "3d", ueberschriften: true, codes: true, preise: "aufpreise", fest: "liste", grundpreis: true, rabatt: true },
    uebersicht: { titel: "Übersicht" },
    summen: { liste: true, rabatte: true, ust: true, hervorheben: true },
    bild: { bild: null, breite: 60, ausrichtung: "mitte", unterschrift: "" },
    tabelle: { titel: "", inhalt: "Merkmal | Wert\nNutzlast | 32 t", kopf: true },
    unterschrift: { gruss: "Mit freundlichen Grüßen", firma: true, bild: null, funktion: "Vertrieb", kunde: true, kundeText: "Auftrag erteilt" },
    agb: { titel: "Allgemeine Geschäftsbedingungen", text: "1. Geltungsbereich …", spalten: 2, neueSeite: true },
    stueckliste: { neueSeite: true },
    abstand: { hoehe: 8 }, linie: { farbe: "#D0D6DC", staerke: 0.3 }, seitenumbruch: {}
  }[typ] || {}) });
  D.standardVorlage = () => ({
    id: "standard", name: "Standardangebot", standard: true, gruppen: [],
    seite: { o: 16, r: 18, u: 26, l: 22, schrift: "helvetica", groesse: 9.5, akzent: "#F2B705", dunkel: "#1A2129", streifen: true, briefpapier: null, briefpapierFolge: null },
    folgekopf: "Angebot {{angebot.nr}} · {{kunde.firma}}",
    fuss: { zeigen: true, seitenzahl: true, spalten: ["{{firma.name}}\n{{firma.strasse}}\n{{firma.ort}}", "Telefon {{firma.tel}}\n{{firma.web}}", "USt-IdNr. {{firma.ustid}}"] },
    bloecke: [D.neuerBlock("briefkopf"), D.neuerBlock("adresse"), D.neuerBlock("titel"),
      { ...D.neuerBlock("text"), quelle: "einleitung", text: "" }, D.neuerBlock("positionen"), D.neuerBlock("summen"),
      { ...D.neuerBlock("text"), quelle: "lieferung", titel: "Lieferung", text: "" }, { ...D.neuerBlock("text"), quelle: "zahlung", titel: "Zahlungsbedingungen", text: "" },
      { ...D.neuerBlock("text"), quelle: "gewaehrleistung", titel: "Gewährleistung", text: "" }, { ...D.neuerBlock("text"), quelle: "schluss", text: "" },
      D.neuerBlock("unterschrift"), { ...D.neuerBlock("stueckliste"), aktiv: false }]
  });
  /** Vorlagen sicherstellen; alte Einstellungen (zeigeBild usw.) werden übernommen */
  D.vorlagen = () => {
    const e = S().einst; if (!e) return [];
    if (!Array.isArray(e.dokumente) || !e.dokumente.length) {
      const v = D.standardVorlage(), alt = e.vorlage || {}, pos = v.bloecke.find(b => b.typ === "positionen");
      pos.bild = alt.zeigeBild === false ? "kein" : "3d"; pos.preise = alt.zeigeMerkmalpreise === false ? "keine" : "aufpreise";
      v.bloecke.find(b => b.typ === "stueckliste").aktiv = !!alt.zeigeStueckliste;
      e.dokumente = [v];
    }
    return e.dokumente;
  };
  D.vorlage = id => { const l = D.vorlagen(); return l.find(v => v.id === id) || l.find(v => v.standard) || l[0]; };
  /** Vorlage für ein Angebot: eigene Wahl, sonst passend zur Produktfamilie, sonst Standard */
  D.vorlageFuer = (a, mo) => {
    const l = D.vorlagen(); if (a.vorlageId && l.some(v => v.id === a.vorlageId)) return D.vorlage(a.vorlageId);
    const p = mo && a.positionen.find(x => x.typ === "konfig"), prod = p && E.produkt(mo, p.produkt);
    if (prod) { const kette = E.gruppenKette(mo, prod); const v = l.find(x => (x.gruppen || []).some(g => kette.includes(g))); if (v) return v; }
    return D.vorlage();
  };

  /* ---------- Platzhalter und einfache Auszeichnung ---------- */
  D.PLATZHALTER = ["kunde.firma", "kunde.person", "kunde.strasse", "kunde.ort", "kunde.nr", "angebot.nr", "angebot.datum", "angebot.gueltig", "angebot.netto", "angebot.brutto", "bearbeiter.name", "bearbeiter.tel", "bearbeiter.mail", "firma.name", "firma.strasse", "firma.ort", "firma.tel", "firma.web", "firma.ustid", "heute"];
  K.platzhalter = (text, a, einst) => {
    einst = einst || S().einst || {}; const b = (einst.vertrieb || []).find(v => v.id === a.bearbeiter) || a.bearbeiterInfo || {}, f = einst.firma || {};
    const kd = (S().kunden || []).find(k => k.id === a.kundeId) || {}, sum = E.summen(a, einst.mwst);
    const werte = { "kunde.firma": a.kunde?.firma, "kunde.person": a.kunde?.person, "kunde.strasse": a.kunde?.strasse || kd.strasse, "kunde.ort": a.kunde?.ort || kd.ort, "kunde.nr": kd.nr || a.kunde?.nr,
      "angebot.nr": a.nr, "angebot.datum": K.datum(a.erstellt), "angebot.gueltig": K.datum(a.gueltig), "angebot.netto": K.eur2(sum.netto), "angebot.brutto": K.eur2(sum.brutto),
      "bearbeiter.name": b.name, "bearbeiter.tel": b.tel, "bearbeiter.mail": b.mail, "firma.name": f.name, "firma.strasse": f.strasse, "firma.ort": f.ort, "firma.tel": f.tel, "firma.web": f.web, "firma.ustid": f.ustid, heute: K.datum(Date.now()) };
    return String(text || "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => werte[k] ?? (k in werte ? "" : m));
  };
  /** **fett**, *kursiv*, Zeilen mit „- “ als Liste, Leerzeile = neuer Absatz. Liefert Absätze (für den Seitenumbruch). */
  D.absaetze = (txt, a) => {
    const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<i>$2</i>");
    return String(K.platzhalter(txt, a) || "").split(/\n\s*\n/).map(abs => {
      const z = abs.split("\n");
      if (z.every(l => /^\s*[-•]\s+/.test(l))) return `<ul>${z.map(l => `<li>${inl(l.replace(/^\s*[-•]\s+/, ""))}</li>`).join("")}</ul>`;
      return `<p>${z.map(inl).join("<br>")}</p>`;
    }).filter(x => x !== "<p></p>");
  };

  /* ---------- Bausteine → Fließelemente ---------- */
  const eur = v => K.eur2(v || 0);
  const bildUrl = id => id ? K.bildUrl(id) : null;
  const zeile = (b, html, extra = {}) => ({ blk: b.id, html, ...extra });
  D.elemente = (a, v, mo, ctx = {}) => {
    const e = S().einst || {}, f = e.firma || {}, out = [], sum = E.summen(a, e.mwst);
    for (const b of v.bloecke) {
      if (b.aktiv === false) continue;
      const P = t => K.platzhalter(t, a, e);
      switch (b.typ) {
        case "briefkopf": out.push(zeile(b, `<div class="d-kopf ${b.ausrichtung === "links" ? "links" : ""}">${b.logo ? `<img src="${bildUrl(b.logo)}" style="width:${b.logoBreite || 45}mm" alt="">` : ""}<div class="d-kopf-text">${b.zeigeName !== false ? `<b>${esc(f.name || "")}</b>` : ""}${b.zusatz ? `<span>${esc(P(b.zusatz))}</span>` : ""}</div></div>`)); break;
        case "adresse": {
          const info = String(b.info || "").split("\n").filter(Boolean).map(l => { const i = l.indexOf(":"); return i < 0 ? [l, ""] : [l.slice(0, i), l.slice(i + 1)]; });
          out.push(zeile(b, `<div class="d-adresse"><div class="d-empf">${b.absenderzeile !== false ? `<div class="d-absender">${esc([f.name, f.strasse, f.ort].filter(Boolean).join(" · "))}</div>` : ""}
            ${[a.kunde?.firma, a.kunde?.person, a.kunde?.strasse, a.kunde?.ort].filter(Boolean).map(esc).join("<br>")}</div>
            <table class="d-info">${info.map(([l, w]) => `<tr><td>${esc(P(l).trim())}</td><td>${esc(P(w).trim())}</td></tr>`).join("")}</table></div>`)); break;
        }
        case "titel": out.push(zeile(b, `<div class="d-titel" style="font-size:${b.groesse || 18}pt">${esc(P(b.text))}</div>${b.untertitel ? `<div class="d-untertitel">${esc(P(b.untertitel))}</div>` : ""}`, { mitNaechstem: true })); break;
        case "text": {
          const q = b.quelle && b.quelle !== "frei" ? b.quelle : null, t = q ? (a.texte && a.texte[q] != null ? a.texte[q] : e.vorlage?.[q]) : b.text; if (!String(t || "").trim()) break;
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          for (const abs of D.absaetze(t, a)) out.push(zeile(b, `<div class="d-text">${abs}</div>`));
          break;
        }
        case "positionen": {
          let nr = 0;
          for (const [i, p] of a.positionen.entries()) {
            nr += 10; const ges = p.einzel * p.menge * (1 - (p.rabatt || 0) / 100);
            out.push(zeile(b, `<div class="d-poskopf"><span>Pos. ${nr}</span><b>${esc(p.typ === "konfig" ? p.produktName : p.text)}</b><span>${p.menge} Stk</span></div>`, { mitNaechstem: true }));
            if (p.typ === "konfig") {
              const prod = mo && E.produkt(mo, p.produkt);
              if (b.bild !== "kein") { const img = ctx.bilder?.[i] || (prod?.bild ? bildUrl(prod.bild) : null); out.push(zeile(b, `<div class="d-posbild">${img ? `<img src="${img}" alt="">` : prod ? K.silhouette(prod.visual?.typ, "#1A2129") : ""}</div>`)); }
              let ue = null; const fest = [];
              const zeilen = (p.zeilen || []).filter((z, k) => k > 0 || b.grundpreis !== false);
              for (const z of zeilen) {
                const istFest = mo && z.mid && z.wid && (() => { const m = E.merkmal(mo, z.mid), w = m && m.werte.find(x => x.id === z.wid); return w && E.wertTyp(m, w) === "fest"; })();
                if (istFest && b.fest === "aus") continue;
                if (istFest && b.fest === "zusammen") { fest.push(z); continue; }
                if (b.ueberschriften !== false && z.ueberschrift && z.ueberschrift !== ue) { ue = z.ueberschrift; out.push(zeile(b, `<div class="d-ue">${esc(ue)}</div>`, { mitNaechstem: true })); }
                const preis = b.preise === "keine" ? "" : z.preis ? eur(z.preis) : b.preise === "alle" ? "inklusive" : "";
                out.push(zeile(b, `<div class="d-zeile${b.codes === false ? " ohne-code" : ""}">${b.codes !== false ? `<span class="d-code">${esc(z.mid === "_basis" ? (prod?.code || "") : z.code || "")}</span>` : ""}<span class="d-zt">${esc(z.mid === "_basis" ? z.text : (z.ueberschrift || b.ueberschriften === false ? "" : z.merkmal + ": ") + z.text)}</span><span class="d-zp">${preis}</span></div>`));
              }
              if (fest.length) out.push(zeile(b, `<div class="d-zeile ohne-code"><span class="d-zt"><b>Grundausstattung:</b> ${fest.map(z => esc(z.text)).join(" · ")}</span><span class="d-zp">${b.preise === "keine" ? "" : eur(fest.reduce((n, z) => n + z.preis, 0))}</span></div>`));
              for (const g of p.grundausstattung || []) out.push(zeile(b, `<div class="d-zeile"><span class="d-code">${esc(g.code)}</span><span class="d-zt">${esc(g.name)}</span><span class="d-zp">${b.preise === "alle" ? "inklusive" : ""}</span></div>`));
            }
            out.push(zeile(b, `<div class="d-posfuss"><span>Einzelpreis ${eur(p.einzel)}${p.menge > 1 ? ` × ${p.menge}` : ""}${p.rabatt && b.rabatt !== false ? ` · abzgl. ${K.zahl(p.rabatt, 1)} % Rabatt` : ""}</span><b>${eur(ges)}</b></div>`));
          }
          break;
        }
        case "uebersicht":
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          out.push(zeile(b, `<div class="d-tab d-kopfzeile"><span>Pos.</span><span>Bezeichnung</span><span>Menge</span><span>Gesamt</span></div>`, { mitNaechstem: true }));
          for (const [i, p] of a.positionen.entries()) out.push(zeile(b, `<div class="d-tab"><span>${(i + 1) * 10}</span><span>${esc(p.typ === "konfig" ? p.produktName : p.text)}</span><span>${p.menge}</span><span>${eur(p.einzel * p.menge * (1 - (p.rabatt || 0) / 100))}</span></div>`));
          break;
        case "summen": out.push(zeile(b, `<table class="d-summen">
            ${b.liste !== false ? `<tr><td>Summe Positionen</td><td>${eur(sum.liste - sum.posRabatt)}</td></tr>` : ""}
            ${b.rabatte !== false && a.rabatt ? `<tr><td>Gesamtrabatt ${K.zahl(a.rabatt, 1)} %</td><td>− ${eur(sum.gesamtRabatt)}</td></tr>` : ""}
            <tr><td>Summe netto</td><td>${eur(sum.netto)}</td></tr>
            ${b.ust !== false ? `<tr><td>USt. ${e.mwst} %</td><td>${eur(sum.ust)}</td></tr><tr class="${b.hervorheben !== false ? "gesamt" : ""}"><td>Gesamtbetrag</td><td>${eur(sum.brutto)}</td></tr>` : ""}</table>`)); break;
        case "bild": if (b.bild) out.push(zeile(b, `<figure class="d-bild ${b.ausrichtung || "mitte"}"><img src="${bildUrl(b.bild)}" style="width:${b.breite || 60}%" alt="">${b.unterschrift ? `<figcaption>${esc(P(b.unterschrift))}</figcaption>` : ""}</figure>`)); break;
        case "tabelle": {
          const rows = String(b.inhalt || "").split("\n").filter(l => l.trim()).map(l => l.split("|").map(c => c.trim()));
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          const n = Math.max(1, ...rows.map(r => r.length));
          rows.forEach((r, i) => out.push(zeile(b, `<div class="d-tab frei${i === 0 && b.kopf !== false ? " d-kopfzeile" : ""}" style="grid-template-columns:repeat(${n},1fr)">${Array.from({ length: n }, (_, j) => `<span>${esc(P(r[j] || ""))}</span>`).join("")}</div>`, i === 0 && b.kopf !== false ? { mitNaechstem: true } : {})));
          break;
        }
        case "unterschrift": {
          const bear = (e.vertrieb || []).find(x => x.id === a.bearbeiter) || a.bearbeiterInfo || {};
          out.push(zeile(b, `<div class="d-unterschrift"><div><p>${esc(P(b.gruss || ""))}</p>${b.firma !== false ? `<p><b>${esc(f.name || "")}</b></p>` : ""}${b.bild ? `<img src="${bildUrl(b.bild)}" alt="">` : `<div class="d-ulinie"></div>`}<p>${esc(bear.name || "")}${b.funktion ? `<br><span class="d-klein">${esc(P(b.funktion))}</span>` : ""}</p></div>
            ${b.kunde !== false ? `<div><p><b>${esc(P(b.kundeText || "Auftrag erteilt"))}</b></p><div class="d-ulinie hoch"></div><p class="d-klein">Datum, Unterschrift, Firmenstempel</p></div>` : ""}</div>`)); break;
        }
        case "agb":
          if (b.neueSeite) out.push({ blk: b.id, umbruch: true });
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          out.push(zeile(b, `<div class="d-agb" style="column-count:${b.spalten || 2}">${D.absaetze(b.text, a).join("")}</div>`)); break;
        case "stueckliste":
          for (const p of a.positionen.filter(x => x.typ === "konfig")) {
            const prod = mo && E.produkt(mo, p.produkt); if (!prod) continue;
            if (b.neueSeite !== false) out.push({ blk: b.id, umbruch: true });
            out.push(zeile(b, `<h3 class="d-h">Anlage: Stückliste ${esc(p.produktName)}</h3>`, { mitNaechstem: true }));
            for (const r of E.stueckliste(mo, prod, p.sel)) out.push(zeile(b, `<div class="d-tab stl"><span class="d-code">${esc(r.nr)}</span><span>${esc(r.bez)}</span><span>${K.zahl(r.menge, 2)} ${esc(r.me)}</span></div>`));
          }
          break;
        case "abstand": out.push(zeile(b, `<div style="height:${b.hoehe || 8}mm"></div>`)); break;
        case "linie": out.push(zeile(b, `<div class="d-linie" style="border-top:${b.staerke || 0.3}mm solid ${esc(b.farbe || "#D0D6DC")}"></div>`)); break;
        case "seitenumbruch": out.push({ blk: b.id, umbruch: true, html: ctx.designer ? `<div class="d-umbruch">Seitenumbruch</div>` : "" }); break;
      }
    }
    return out;
  };

  /* ---------- Seiten setzen ---------- */
  const seiteCss = v => { const s = v.seite || {}; return `--d-akzent:${s.akzent || "#F2B705"};--d-dunkel:${s.dunkel || "#1A2129"};--d-groesse:${s.groesse || 9.5}pt;font-family:${s.schrift === "times" ? '"Times New Roman",Times,serif' : 'Helvetica,Arial,sans-serif'}`; };
  function seitenRahmen(a, v, nr, gesamt, inhalt) {
    const s = v.seite || {}, e = S().einst || {}, bg = nr === 1 ? s.briefpapier : (s.briefpapierFolge || s.briefpapier);
    return `<div class="d-seite" data-seite="${nr}" style="${seiteCss(v)}">
      ${bg ? `<img class="d-briefpapier" src="${bildUrl(bg)}" alt="">` : ""}
      ${s.streifen !== false ? `<div class="d-streifen"></div>` : ""}
      ${nr > 1 && v.folgekopf ? `<div class="d-folgekopf" style="left:${s.l}mm;right:${s.r}mm;top:${Math.max(6, (s.oFolge ?? s.o) - 8)}mm">${esc(K.platzhalter(v.folgekopf, a, e))}</div>` : ""}
      <div class="d-inhalt" style="top:${nr > 1 ? (s.oFolge ?? s.o) : s.o}mm;left:${s.l}mm;right:${s.r}mm;bottom:${s.u}mm">${inhalt}</div>
      ${!bg && s.briefpapierPdf ? `<div class="d-bp-hinweis">PDF-Briefpapier</div>` : ""}
      ${v.fuss?.zeigen !== false ? `<div class="d-fuss" style="left:${s.l}mm;right:${s.r}mm;bottom:${Math.max(5, s.u - 18)}mm">${(v.fuss?.spalten || []).map(t => `<div>${esc(K.platzhalter(t, a, e)).replace(/\n/g, "<br>")}</div>`).join("")}${v.fuss?.seitenzahl !== false ? `<div class="d-seitenzahl">Seite ${nr} von ${gesamt}</div>` : ""}</div>` : ""}
    </div>`;
  }
  /** Elemente auf Seiten verteilen. Misst im Dokument selbst, damit Vorschau, Druck und PDF gleich umbrechen. */
  D.setzen = (a, v, mo, ctx = {}) => {
    const els = D.elemente(a, v, mo, ctx), s = v.seite || {};
    const mess = document.createElement("div"); mess.className = "dok d-messen"; mess.setAttribute("aria-hidden", "true");
    mess.innerHTML = `<div class="d-seite" style="${seiteCss(v)}"><div class="d-inhalt" style="position:static;width:${210 - s.l - s.r}mm"></div></div><div class="d-mm" style="height:100mm"></div>`;
    (K.root || document.body).appendChild(mess);
    const box = mess.querySelector(".d-inhalt"), pxMm = mess.querySelector(".d-mm").getBoundingClientRect().height / 100;
    const hoehe1 = (297 - s.o - s.u) * pxMm, hoeheF = (297 - (s.oFolge ?? s.o) - s.u) * pxMm, hoehe = () => seiten.length === 1 ? hoehe1 : hoeheF;
    const h = els.map(el => { if (el.umbruch && !el.html) return 0; const d = document.createElement("div"); d.className = "d-el"; d.innerHTML = el.html || ""; box.appendChild(d); const r = d.getBoundingClientRect().height; box.removeChild(d); return r; });
    mess.remove();
    var seiten = [[]]; let y = 0;
    els.forEach((el, i) => {
      if (el.umbruch) { if (seiten[seiten.length - 1].length) { seiten.push([]); y = 0; } if (el.html) { seiten[seiten.length - 1].push(el); y += h[i]; } return; }
      let bedarf = h[i]; if (el.mitNaechstem) { let j = i + 1; while (j < els.length && els[j].mitNaechstem) bedarf += h[j++]; if (j < els.length && !els[j].umbruch) bedarf += h[j]; }
      if (y + Math.min(bedarf, hoehe()) > hoehe() + 0.5 && seiten[seiten.length - 1].length) { seiten.push([]); y = 0; }
      seiten[seiten.length - 1].push(el); y += h[i];
    });
    return seiten;
  };
  D.html = (a, v, mo, ctx = {}) => {
    const seiten = D.setzen(a, v, mo, ctx);
    if (ctx.designer) setTimeout(() => K.root && K.root.querySelectorAll("#ad-seiten .d-inhalt").forEach(x => x.classList.toggle("satzspiegel", !!(v.seite.briefpapier || v.seite.briefpapierPdf))), 0);
    return seiten.map((els, i) => seitenRahmen(a, v, i + 1, seiten.length, els.map(el => `<div class="d-el${ctx.auswahl === el.blk ? " gewaehlt" : ""}" data-blk="${el.blk}">${el.html || ""}</div>`).join(""))).join("");
  };
  /** 3D-Bilder der Positionen vorbereiten (falls die Vorlage sie zeigt) */
  D.bilder = async (a, v, mo) => {
    const pb = v.bloecke.find(b => b.typ === "positionen" && b.aktiv !== false); const out = {};
    if (!pb || pb.bild !== "3d" || !mo) return out;
    try { await K.viewerBereit(); } catch (e) { return out; }
    for (const [i, p] of a.positionen.entries()) { if (p.typ !== "konfig") continue; const prod = E.produkt(mo, p.produkt); if (!prod) continue; try { const u = await K.viewer().bild(mo, prod, p.sel, 1400, 760); if (u) out[i] = u; } catch (e) {} }
    return out;
  };

  /* ---------- Briefpapier aus PDF: Original fürs PDF behalten, Vorschaubilder mit pdf.js ---------- */
  D.briefpapierLesen = async f => {
    const buf = await f.arrayBuffer();
    let pdf = null;
    if (K.assets) { try { pdf = (await K.assets.upload(f)).id; } catch (e) { pdf = null; } }
    if (!pdf) pdf = "data:application/pdf;base64," + btoa(Array.from(new Uint8Array(buf), b => String.fromCharCode(b)).join(""));
    let seiten = 1; const vorschau = [];
    try {
      const lib = await import(/* webpackIgnore: true */ K.cfg.libs.pdfjs); lib.GlobalWorkerOptions.workerSrc = K.cfg.libs.pdfjsWorker;
      const d = await lib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise; seiten = d.numPages;
      for (let i = 1; i <= Math.min(2, seiten); i++) {
        const pg = await d.getPage(i), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 1240 / vp0.width }), c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: g, canvas: c, viewport: vp }).promise; vorschau.push(c.toDataURL("image/jpeg", .85));
      }
    } catch (e) { console.warn("[Konfigurator] Vorschau des Briefpapiers nicht möglich (pdf.js)", e); try { const PL = (await K.lib("pdflib"), window.PDFLib); seiten = (await PL.PDFDocument.load(buf)).getPageCount(); } catch (x) {} }
    return { pdf, seiten, vorschau };
  };

  /* ---------- Druck ---------- */
  D.drucken = async (a, mo) => {
    const v = D.vorlageFuer(a, mo), html = D.html(a, v, mo, { bilder: await D.bilder(a, v, mo) });
    const css = [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).filter(t => /\.d-|\.dok/.test(t)).join("\n"); } catch (e) { return ""; } }).join("\n");
    const f = document.createElement("iframe"); f.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0"; document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(`<!doctype html><html><head><meta charset="utf-8"><title>Angebot ${esc(a.nr)}</title><style>@page{size:A4;margin:0}body{margin:0}${css.replace(/#konfigurator\s*/g, "")}</style></head><body><div class="dok drucken">${html}</div></body></html>`); f.contentDocument.close();
    await new Promise(ok => setTimeout(ok, 400)); f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 3000);
  };

  /* ---------- PDF (Vektor, aus den gesetzten Seiten) ---------- */
  const WIN = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
  const pdfText = s => s.replace(/[✓✔]/g, "x").replace(/[★☆]/g, "*").replace(/→/g, "->").replace(/[−]/g, "-").replace(/­/g, "").replace(/[^\x20-\x7E\xA0-\xFF]/g, c => WIN.includes(c) ? c : "");
  const farbe = (c, PL) => { const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m) return null; if (m[4] !== undefined && +m[4] === 0) return null; return { c: PL.rgb(m[1] / 255, m[2] / 255, m[3] / 255), a: m[4] !== undefined ? +m[4] : 1 }; };
  async function bildBytes(img) {
    const c = document.createElement("canvas"), w = img.naturalWidth || 800, h = img.naturalHeight || 400; c.width = w; c.height = h;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
    const u = c.toDataURL("image/png"); return Uint8Array.from(atob(u.split(",")[1]), ch => ch.charCodeAt(0));
  }
  async function svgBytes(svg, rect) {
    const s = new XMLSerializer().serializeToString(svg), img = new Image(), sc = 3; img.width = rect.width * sc; img.height = rect.height * sc;
    await new Promise((ok, nein) => { img.onload = ok; img.onerror = nein; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s); });
    const c = document.createElement("canvas"); c.width = Math.max(1, rect.width * sc); c.height = Math.max(1, rect.height * sc); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]), ch => ch.charCodeAt(0));
  }
  D.pdf = async (a, mo) => {
    await K.lib("pdflib"); const PL = window.PDFLib;
    const v = D.vorlageFuer(a, mo), html = D.html(a, v, mo, { bilder: await D.bilder(a, v, mo) });
    const host = document.createElement("div"); host.className = "dok d-export"; host.innerHTML = html; (K.root || document.body).appendChild(host);
    await Promise.all([...host.querySelectorAll("img")].map(i => i.complete ? 0 : new Promise(ok => { i.onload = i.onerror = ok; })));
    const doc = await PL.PDFDocument.create(); doc.setTitle(`Angebot ${a.nr}`); doc.setAuthor(S().einst?.firma?.name || ""); doc.setCreator("Fahrzeugkonfigurator");
    const serif = v.seite?.schrift === "times", F = PL.StandardFonts, fonts = {};
    const font = async (fett, kursiv, mono) => { const k = (mono ? "C" : serif ? "T" : "H") + (fett ? "b" : "") + (kursiv ? "i" : ""); if (!fonts[k]) { const n = mono ? (fett ? F.CourierBold : F.Courier) : serif ? (fett && kursiv ? F.TimesRomanBoldItalic : fett ? F.TimesRomanBold : kursiv ? F.TimesRomanItalic : F.TimesRoman) : (fett && kursiv ? F.HelveticaBoldOblique : fett ? F.HelveticaBold : kursiv ? F.HelveticaOblique : F.Helvetica); fonts[k] = await doc.embedFont(n); } return fonts[k]; };
    try {
      let bp = null;
      if (v.seite?.briefpapierPdf) { try { const bytes = new Uint8Array(await (await fetch(bildUrl(v.seite.briefpapierPdf))).arrayBuffer()); const quelle = await PL.PDFDocument.load(bytes); const n = quelle.getPageCount(); bp = await doc.embedPdf(bytes, n > 1 ? [0, 1] : [0]); } catch (e) { console.warn("Briefpapier-PDF nicht eingebettet", e); } }
      let seitenNr = 0;
      for (const seite of host.querySelectorAll(".d-seite")) {
        const P = seite.getBoundingClientRect(), k = 595.28 / P.width, H = 841.89, pg = doc.addPage([595.28, H]); seitenNr++;
        if (bp) { const e = bp[seitenNr > 1 && bp[1] ? 1 : 0]; pg.drawPage(e, { x: 0, y: 0, width: 595.28, height: H }); }
        const X = x => (x - P.left) * k, Y = y => H - (y - P.top) * k;
        for (const el of seite.querySelectorAll("*")) {
          const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
          const bg = farbe(cs.backgroundColor, PL); if (bg && el.tagName !== "IMG") pg.drawRectangle({ x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k, color: bg.c, opacity: bg.a });
          if (cs.backgroundImage && cs.backgroundImage.includes("linear-gradient") && el.classList.contains("d-streifen")) { // Warnstreifen
            for (let i = 0; i * 10 < 210; i++) pg.drawRectangle({ x: i * 10 / 210 * 595.28, y: Y(r.bottom), width: 10 / 210 * 595.28, height: r.height * k, color: i % 2 ? PL.rgb(.106, .137, .169) : PL.rgb(.949, .718, .02) });
          }
          for (const [s, x1, y1, x2, y2] of [["Top", r.left, r.top, r.right, r.top], ["Bottom", r.left, r.bottom, r.right, r.bottom], ["Left", r.left, r.top, r.left, r.bottom], ["Right", r.right, r.top, r.right, r.bottom]]) {
            const w = parseFloat(cs["border" + s + "Width"]); if (!w || cs["border" + s + "Style"] === "none") continue; const c = farbe(cs["border" + s + "Color"], PL); if (!c) continue;
            const o = (s === "Top" || s === "Left" ? 1 : -1) * w / 2;
            pg.drawLine({ start: { x: X(x1 + (s === "Left" || s === "Right" ? o : 0)), y: Y(y1 + (s === "Top" || s === "Bottom" ? o : 0)) }, end: { x: X(x2 + (s === "Left" || s === "Right" ? o : 0)), y: Y(y2 + (s === "Top" || s === "Bottom" ? o : 0)) }, thickness: w * k, color: c.c, opacity: c.a });
          }
          if (el.tagName === "IMG" && bp && el.classList.contains("d-briefpapier")) continue;
          if (el.tagName === "IMG") { try { const b = await bildBytes(el), im = await doc.embedPng(b); pg.drawImage(im, { x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k }); } catch (e) { console.warn("Bild nicht ins PDF übernommen", e); } }
          if (el.tagName === "svg" && !el.closest("svg svg")) { try { const im = await doc.embedPng(await svgBytes(el, r)); pg.drawImage(im, { x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k }); } catch (e) {} }
        }
        // Text zeilenweise an der gesetzten Stelle
        const tw = document.createTreeWalker(seite, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          const el = n.parentElement; if (!el || el.closest("svg")) continue; const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          const t = n.textContent; if (!t.trim()) continue;
          const fs = parseFloat(cs.fontSize), fett = (+cs.fontWeight || (cs.fontWeight === "bold" ? 700 : 400)) >= 600, kursiv = cs.fontStyle === "italic", mono = /mono|courier/i.test(cs.fontFamily);
          const fnt = await font(fett, kursiv, mono), c = farbe(cs.color, PL) || { c: PL.rgb(0, 0, 0), a: 1 }, gross = cs.textTransform === "uppercase";
          const re = /\S+/g, woerter = []; let m; const rg = document.createRange();
          while ((m = re.exec(t))) { rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rs = rg.getClientRects(); if (rs.length) woerter.push({ i: m.index, j: m.index + m[0].length, r: rs[0] }); }
          const zeilen = []; for (const w of woerter) { const z = zeilen[zeilen.length - 1]; if (z && Math.abs(z.r.top - w.r.top) < fs * .5) { z.j = w.j; z.right = w.r.right; } else zeilen.push({ i: w.i, j: w.j, r: w.r, right: w.r.right }); }
          for (const z of zeilen) {
            let s = pdfText(t.slice(z.i, z.j).replace(/\s+/g, " ")); if (gross) s = s.toUpperCase(); if (!s) continue;
            const size = fs * k, breite = fnt.widthOfTextAtSize(s, size), soll = (z.right - z.r.left) * k;
            const ls = parseFloat(cs.letterSpacing) || 0; const zusatz = ls && s.length > 1 ? (soll - breite) / (s.length - 1) : 0;
            const base = z.r.bottom - (z.r.height - fs) / 2 - fs * 0.21;
            pg.drawText(s, { x: X(z.r.left), y: Y(base), size, font: fnt, color: c.c, opacity: c.a, ...(zusatz > 0 ? { characterSpacing: zusatz } : {}) });
          }
        }
      }
    } finally { host.remove(); }
    return new Blob([await doc.save()], { type: "application/pdf" });
  };
  /** Einheitlicher Einstieg: PDF aus der Vorlage, bei Problemen das einfache PDF */
  const altesPdf = K.pdfErzeugen;
  K.pdfErzeugen = async (a, mo) => { try { return await D.pdf(a, mo); } catch (e) { console.warn("[Konfigurator] Vorlagen-PDF nicht möglich, einfaches PDF", e); if (altesPdf) return altesPdf(a, mo); throw e; } };

  /* =====================================================================
     Angebotsdesigner (Studio › Angebotsdesigner)
     ===================================================================== */
  K.ad = { vorlage: null, blk: null, beispiel: null, zoom: 0.62, tab: "baustein" };
  const ro = () => !K.Store.schreiben, St = () => K.studio;
  const vor = () => D.vorlage(K.ad.vorlage), blk = () => vor().bloecke.find(b => b.id === K.ad.blk);
  const speichern = (text, neu = true) => { K.Store.einstSpeichern(S().einst); if (text) K.Store.log("Angebotsdesigner", text); if (neu) vorschauNeu(); };
  function beispiel() {
    const l = S().angebote || []; let a = l.find(x => x.nr === K.ad.beispiel) || l.find(x => x.positionen.length) || l[0];
    if (!a) { const e = S().einst || {}; a = { nr: "AN-MUSTER", erstellt: Date.now(), gueltig: Date.now() + 30 * 864e5, kunde: { firma: "Musterkunde GmbH", person: "Frau Muster", strasse: "Musterweg 1", ort: "12345 Musterstadt" }, bearbeiter: e.vertrieb?.[0]?.id, positionen: [{ typ: "frei", text: "Beispielposition", einzel: 1000, menge: 1, rabatt: 0, kosten: 0 }], texte: e.vorlage, rabatt: 0 }; }
    return a;
  }
  function vorschauNeu() {
    const box = K.root && K.root.querySelector("#ad-seiten"); if (!box) return;
    const a = beispiel(), mo = S().live || S().entwurf;
    box.innerHTML = D.html(a, vor(), mo, { designer: true, auswahl: K.ad.blk });
    box.style.setProperty("--zoom", K.ad.zoom);
    const n = box.querySelectorAll(".d-seite").length, z = K.root.querySelector("#ad-seitenzahl"); if (z) z.textContent = `${n} ${n === 1 ? "Seite" : "Seiten"}`;
  }
  const feld = (id, label, inner, hint) => `<div class="feld"><label for="${id}">${label}</label>${inner}${hint ? `<span class="klein gedimmt">${hint}</span>` : ""}</div>`;
  const dis = () => ro() ? "disabled" : "";
  function eigenschaften(b) {
    const v = vor(), i = (k, typ = "text", extra = "") => `<input id="ad-${k}" type="${typ}" data-chg="adFeld" data-k="${k}" value="${esc(b[k] ?? "")}" ${extra} ${dis()}>`;
    const h = (k, t) => `<label class="haken"><input type="checkbox" data-act="adHaken" data-k="${k}" ${b[k] !== false ? "checked" : ""} ${dis()}> ${t}</label>`;
    const w = (k, opts) => `<select id="ad-${k}" data-act="adWahlFeld" data-k="${k}" ${dis()}>${opts.map(([x, n]) => `<option value="${x}" ${String(b[k]) === String(x) ? "selected" : ""}>${n}</option>`).join("")}</select>`;
    const lang = (k, z = 6) => `<textarea id="ad-${k}" rows="${z}" data-in="adText" data-k="${k}" ${dis()}>${esc(b[k] ?? "")}</textarea>`;
    const bild = k => `<div class="bildfeld">${b[k] ? `<img src="${bildUrl(b[k])}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}${ro() ? "" : `<label class="btn klein">${b[k] ? "Ersetzen" : "Bild wählen"}<input type="file" accept="image/png,image/jpeg,image/webp" data-act="adBild" data-k="${k}" hidden></label>${b[k] ? `<button type="button" class="btn klein" data-act="adBild" data-k="${k}" data-weg="1">Entfernen</button>` : ""}`}</div>`;
    const ph = `<div class="ad-ph">${D.PLATZHALTER.map(p => `<button type="button" class="chipbtn" data-act="adPh" data-p="${p}" title="Platzhalter einfügen">{{${p}}}</button>`).join("")}</div>`;
    const tools = `<div class="ad-tools"><button type="button" class="btn klein" data-act="adFmt" data-f="b" title="Fett"><b>F</b></button><button type="button" class="btn klein" data-act="adFmt" data-f="i" title="Kursiv"><i>K</i></button><button type="button" class="btn klein" data-act="adFmt" data-f="l" title="Aufzählung">• Liste</button></div>`;
    let x = "";
    switch (b.typ) {
      case "briefkopf": x = feld("ad-logo", "Logo", bild("logo")) + feld("ad-logoBreite", "Logobreite (mm)", i("logoBreite", "number", 'min="10" max="120"')) + feld("ad-ausrichtung", "Logo", w("ausrichtung", [["rechts", "rechts"], ["links", "links"]])) + h("zeigeName", "Firmenname anzeigen") + feld("ad-zusatz", "Zusatzzeile", i("zusatz")); break;
      case "adresse": x = h("absenderzeile", "Absenderzeile über der Anschrift") + feld("ad-info", "Infoblock rechts", lang("info", 8), "Eine Zeile je Angabe: Bezeichnung: Wert") + ph; break;
      case "titel": x = feld("ad-text", "Titel", i("text")) + feld("ad-untertitel", "Untertitel", i("untertitel")) + feld("ad-groesse", "Schriftgröße (pt)", i("groesse", "number", 'min="8" max="40"')) + ph; break;
      case "text": {
        const q = b.quelle || "frei", e = S().einst;
        x = feld("ad-quelle", "Inhalt", w("quelle", D.TEXTQUELLEN), q === "frei" ? "Steht in jedem Angebot mit dieser Vorlage gleich." : "Standardtext. In jedem Angebot unter „Angebotstexte“ einzeln änderbar.") + feld("ad-titel", "Überschrift", i("titel"));
        x += q === "frei" ? feld("ad-text", "Text", tools + lang("text", 8)) : feld("ad-std", "Standardtext", tools + `<textarea id="ad-std" rows="7" data-in="adStdText" data-q="${q}" ${dis()}>${esc(e.vorlage?.[q] || "")}</textarea>`);
        x += ph + `<p class="klein gedimmt">**fett**, *kursiv*, Zeilen mit „- “ als Liste, Leerzeile = neuer Absatz.</p>`; break;
      }
      case "positionen": x = feld("ad-bild", "Fahrzeugbild", w("bild", [["3d", "3D-Ansicht der Konfiguration"], ["produkt", "Produktbild"], ["kein", "kein Bild"]])) + h("ueberschriften", "Überschriften (ZZ) als Gliederung") + h("codes", "Vertriebscodes anzeigen") + feld("ad-preise", "Preise je Code", w("preise", [["aufpreise", "nur Aufpreise"], ["alle", "alle, sonst „inklusive“"], ["keine", "keine (nur Positionspreis)"]])) + feld("ad-fest", "Feste Codes (Grundausstattung)", w("fest", [["liste", "einzeln aufführen"], ["zusammen", "in einer Zeile"], ["aus", "nicht aufführen"]])) + h("grundpreis", "Grundfahrzeug-Zeile") + h("rabatt", "Positionsrabatt zeigen"); break;
      case "uebersicht": x = feld("ad-titel", "Überschrift", i("titel")); break;
      case "summen": x = h("liste", "Summe Positionen") + h("rabatte", "Gesamtrabatt") + h("ust", "USt. und Gesamtbetrag") + h("hervorheben", "Gesamtbetrag hervorheben"); break;
      case "bild": x = feld("ad-bild", "Bild", bild("bild")) + feld("ad-breite", "Breite (%)", i("breite", "number", 'min="10" max="100"')) + feld("ad-ausrichtung", "Ausrichtung", w("ausrichtung", [["links", "links"], ["mitte", "mittig"], ["rechts", "rechts"]])) + feld("ad-unterschrift", "Bildunterschrift", i("unterschrift")); break;
      case "tabelle": x = feld("ad-titel", "Überschrift", i("titel")) + feld("ad-inhalt", "Zeilen", lang("inhalt", 8), "Spalten mit | trennen") + h("kopf", "Erste Zeile als Kopfzeile") + ph; break;
      case "unterschrift": x = feld("ad-gruss", "Gruß", i("gruss")) + h("firma", "Firmenname") + feld("ad-bild", "Unterschrift als Bild", bild("bild")) + feld("ad-funktion", "Funktion", i("funktion")) + h("kunde", "Feld für Auftragserteilung") + feld("ad-kundeText", "Text dazu", i("kundeText")); break;
      case "agb": x = feld("ad-titel", "Überschrift", i("titel")) + feld("ad-text", "Text", tools + lang("text", 12)) + feld("ad-spalten", "Spalten", w("spalten", [[1, "1"], [2, "2"], [3, "3"]])) + h("neueSeite", "auf neuer Seite beginnen"); break;
      case "stueckliste": x = h("neueSeite", "je Fahrzeug auf neuer Seite"); break;
      case "abstand": x = feld("ad-hoehe", "Höhe (mm)", i("hoehe", "number", 'min="1" max="200"')); break;
      case "linie": x = feld("ad-farbe", "Farbe", i("farbe", "color")) + feld("ad-staerke", "Stärke (mm)", i("staerke", "number", 'step="0.1" min="0.1" max="3"')); break;
      default: x = `<p class="klein gedimmt">Keine Einstellungen.</p>`;
    }
    return `<div class="ad-eigen-kopf"><b>${esc(NAME[b.typ] || b.typ)}</b>${ro() ? "" : `<button type="button" class="ikon" data-act="adBlkKopie" title="Duplizieren">⧉</button><button type="button" class="ikon gefahr" data-act="adBlkWeg" title="Baustein entfernen">✕</button>`}</div>
      <label class="haken"><input type="checkbox" data-act="adAktiv" ${b.aktiv !== false ? "checked" : ""} ${dis()}> im Dokument anzeigen</label>${x}`;
  }
  function seiteEigenschaften(v) {
    const s = v.seite, n = (k, t, min, max) => feld("ad-s-" + k, t, `<input id="ad-s-${k}" type="number" min="${min}" max="${max}" step="0.5" data-chg="adSeite" data-k="${k}" value="${s[k]}" ${dis()}>`);
    const bp = s.briefpapierPdf ? `<div class="ad-bp"><b>PDF-Briefpapier</b> · ${s.briefpapierSeiten || 1} ${s.briefpapierSeiten > 1 ? "Seiten (Seite 1 für die erste, Seite 2 für alle weiteren Seiten)" : "Seite (für alle Seiten)"}${s.briefpapier ? "" : `<br><span class="warntext klein">Vorschau nicht verfügbar, im PDF ist es enthalten.</span>`}</div>` : "";
    const bild = (k, t) => feld("", t, `<div class="bildfeld">${s[k] ? `<img src="${bildUrl(s[k])}" alt="">` : `<span class="gedimmt klein">keins</span>`}${ro() ? "" : `<label class="btn klein">${s[k] ? "Ersetzen" : "Datei wählen"}<input type="file" accept="application/pdf,image/png,image/jpeg" data-act="adSeiteBild" data-k="${k}" hidden></label>${s[k] || (k === "briefpapier" && s.briefpapierPdf) ? `<button type="button" class="btn klein" data-act="adSeiteBild" data-k="${k}" data-weg="1">Entfernen</button>` : ""}`}</div>`, k === "briefpapier" ? "PDF (empfohlen, bleibt im Angebot gestochen scharf) oder Bild in A4. Ein zweiseitiges PDF liefert Seite 1 und Folgeseiten." : "nur nötig, wenn die Folgeseiten anders aussehen");
    return `<div class="ad-eigen-kopf"><b>Seite und Gestaltung</b></div>
      ${feld("ad-vname", "Name der Vorlage", `<input id="ad-vname" data-chg="adVName" value="${esc(v.name)}" ${dis()}>`)}
      <div class="ad-4">${n("o", "Rand oben", 5, 120)}${n("r", "rechts", 5, 50)}${n("u", "unten", 10, 80)}${n("l", "links", 5, 50)}</div>
      ${feld("ad-s-oFolge", "Rand oben ab Seite 2 (mm)", `<input id="ad-s-oFolge" type="number" min="5" max="120" step="0.5" data-chg="adSeite" data-k="oFolge" value="${s.oFolge ?? s.o}" ${dis()}>`)}
      ${feld("ad-s-schrift", "Schrift", `<select id="ad-s-schrift" data-act="adSeiteWahl" data-k="schrift" ${dis()}><option value="helvetica" ${s.schrift !== "times" ? "selected" : ""}>Helvetica / Arial</option><option value="times" ${s.schrift === "times" ? "selected" : ""}>Times</option></select>`, "PDF-Standardschriften, damit das PDF überall gleich aussieht")}
      ${n("groesse", "Grundschrift (pt)", 7, 14)}
      <div class="ad-2">${feld("ad-s-akzent", "Akzentfarbe", `<input id="ad-s-akzent" type="color" data-chg="adSeite" data-k="akzent" value="${esc(s.akzent)}" ${dis()}>`)}${feld("ad-s-dunkel", "Textfarbe", `<input id="ad-s-dunkel" type="color" data-chg="adSeite" data-k="dunkel" value="${esc(s.dunkel)}" ${dis()}>`)}</div>
      <label class="haken"><input type="checkbox" data-act="adSeiteHaken" data-k="streifen" ${s.streifen !== false ? "checked" : ""} ${dis()}> Warnstreifen oben</label>
      <div class="ad-block"><div class="eyebrow">Briefpapier</div>${bp}
      ${bild("briefpapier", "Briefpapier Seite 1")}${s.briefpapierPdf && s.briefpapierSeiten > 1 ? "" : bild("briefpapierFolge", "Briefpapier Folgeseiten")}
      ${s.briefpapier || s.briefpapierPdf ? `<p class="klein gedimmt">Die Ränder oben bestimmen, wo der Text beginnt. Die gestrichelte Linie in der Vorschau zeigt den Textbereich.</p>${ro() ? "" : `<button class="btn klein" type="button" data-act="adBpEigenesAus">Eigenen Briefkopf, Streifen und Fußzeile ausblenden</button>`}` : ""}</div>
      ${feld("ad-fk", "Kopfzeile ab Seite 2", `<input id="ad-fk" data-chg="adFolgekopf" value="${esc(v.folgekopf || "")}" ${dis()}>`)}
      <label class="haken"><input type="checkbox" data-act="adFussHaken" data-k="zeigen" ${v.fuss?.zeigen !== false ? "checked" : ""} ${dis()}> Fußzeile</label>
      <label class="haken"><input type="checkbox" data-act="adFussHaken" data-k="seitenzahl" ${v.fuss?.seitenzahl !== false ? "checked" : ""} ${dis()}> Seitenzahl</label>
      ${(v.fuss?.spalten || []).map((t, j) => feld("ad-f" + j, `Fußzeile Spalte ${j + 1}`, `<textarea id="ad-f${j}" rows="3" data-in="adFuss" data-j="${j}" ${dis()}>${esc(t)}</textarea>`)).join("")}
      ${feld("ad-gruppen", "Automatisch für Produktfamilien", `<div class="ad-gruppen">${((S().live || S().entwurf)?.gruppen || []).map(g => `<label class="haken klein"><input type="checkbox" data-act="adGruppe" data-g="${g.id}" ${(v.gruppen || []).includes(g.id) ? "checked" : ""} ${dis()}> ${esc(g.name)}</label>`).join("") || `<span class="gedimmt klein">keine Familien</span>`}</div>`, "Angebote mit Fahrzeugen dieser Familien nutzen diese Vorlage, wenn nichts anderes gewählt ist.")}`;
  }

  K.route("studio-vorlagen", () => {
    const e = S().einst; if (!e) return St().keinEntwurf();
    const l = D.vorlagen(), v = vor(); if (!v) return "";
    K.ad.vorlage = v.id; if (K.ad.blk && !v.bloecke.some(b => b.id === K.ad.blk)) K.ad.blk = null;
    const b = blk(), ang = (S().angebote || []).filter(a => a.positionen.length), bsp = beispiel();
    K.nach(vorschauNeu);
    return St().kopf("Angebotsdesigner", "Aufbau und Gestaltung der Angebotsdokumente. Bausteine links in die Seite ziehen, anklicken zum Bearbeiten, Reihenfolge per Ziehen ändern. Vorschau, Druck und PDF zeigen genau dasselbe Dokument.") + `
      <div class="ad-leiste panel">
        <label class="inline">Vorlage <select id="ad-vorlage" data-act="adVorlage">${l.map(x => `<option value="${x.id}" ${x.id === v.id ? "selected" : ""}>${esc(x.name)}${x.standard ? " (Standard)" : ""}</option>`).join("")}</select></label>
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="adNeu">+ Neue Vorlage</button><button class="btn klein" type="button" data-act="adKopie">Duplizieren</button>${v.standard ? "" : `<button class="btn klein" type="button" data-act="adStandard">Als Standard</button><button class="btn klein gefahr-text" type="button" data-act="adWeg">Löschen</button>`}`}
        <span class="ad-trenner"></span>
        <label class="inline">Vorschau mit <select id="ad-bsp" data-act="adBeispiel">${ang.map(a => `<option value="${a.nr}" ${a.nr === bsp.nr ? "selected" : ""}>${esc(a.nr)} · ${esc(a.kunde.firma)}</option>`).join("") || `<option>Musterangebot</option>`}</select></label>
        <label class="inline">Zoom <input id="ad-zoom" type="range" min="0.35" max="1.2" step="0.05" value="${K.ad.zoom}" data-in="adZoom"></label>
        <span id="ad-seitenzahl" class="gedimmt klein"></span>
        <span class="ad-trenner"></span>
        <button class="btn klein" type="button" data-act="adDrucken">Drucken</button><button class="btn klein primary" type="button" data-act="adPdf">PDF erzeugen</button>
      </div>
      <div class="ad-layout">
        <aside class="panel ad-links">
          <div class="tabs-innen klein" role="tablist"><button type="button" role="tab" data-act="adTab" data-t="baustein" aria-selected="${K.ad.tab === "baustein"}">Bausteine</button><button type="button" role="tab" data-act="adTab" data-t="aufbau" aria-selected="${K.ad.tab === "aufbau"}">Aufbau</button></div>
          ${K.ad.tab === "baustein" ? `<p class="klein gedimmt">In die Seite ziehen oder anklicken (fügt nach dem gewählten Baustein ein).</p><ul class="ad-palette">${D.BAUSTEINE.map(([t, n, h]) => `<li draggable="${!ro()}" data-adneu="${t}"><button type="button" data-act="adEinfuegen" data-t="${t}" ${dis()}><b>${n}</b>${h ? `<span>${esc(h)}</span>` : ""}</button></li>`).join("")}</ul>`
            : `<ol class="ad-aufbau">${v.bloecke.map(x => `<li class="${x.id === K.ad.blk ? "aktiv" : ""}${x.aktiv === false ? " aus" : ""}" draggable="${!ro()}" data-adblk="${x.id}"><span class="kb-griff">⋮⋮</span><button type="button" data-act="adWahl" data-b="${x.id}">${esc(NAME[x.typ] || x.typ)}${x.typ === "text" ? `<small>${esc(x.titel || (D.TEXTQUELLEN.find(q => q[0] === x.quelle) || [, ""])[1])}</small>` : ""}</button><button type="button" class="ikon" data-act="adAktivL" data-b="${x.id}" title="${x.aktiv === false ? "einblenden" : "ausblenden"}">${x.aktiv === false ? "◌" : "●"}</button></li>`).join("")}</ol>`}
        </aside>
        <section class="ad-mitte"><div id="ad-seiten" class="dok ad-seiten" data-addrop="1"></div></section>
        <aside class="panel ad-rechts">${b ? eigenschaften(b) : seiteEigenschaften(v)}${b ? `<button type="button" class="btn klein" data-act="adWahl" data-b="" style="margin-top:12px">← Seite und Gestaltung</button>` : ""}</aside>
      </div>`;
  });
  // Aktionen
  const A = K.act, I = K.inp;
  A.adVorlage = el => { K.ad.vorlage = el.value; K.ad.blk = null; K.render(); };
  A.adBeispiel = el => { K.ad.beispiel = el.value; vorschauNeu(); };
  I.adZoom = el => { K.ad.zoom = +el.value; const box = K.root.querySelector("#ad-seiten"); if (box) box.style.setProperty("--zoom", K.ad.zoom); };
  A.adTab = el => { K.ad.tab = el.dataset.t; K.render(); };
  A.adWahl = el => { K.ad.blk = el.dataset.b || null; K.render(); };
  A.adNeu = () => { const v = D.standardVorlage(); v.id = uid(); v.name = "Neue Vorlage"; v.standard = false; S().einst.dokumente.push(v); K.ad.vorlage = v.id; K.ad.blk = null; speichern("Vorlage angelegt", false); K.render(); };
  A.adKopie = () => { const v = K.clone(vor()); v.id = uid(); v.name += " (Kopie)"; v.standard = false; v.gruppen = []; for (const b of v.bloecke) b.id = uid(); S().einst.dokumente.push(v); K.ad.vorlage = v.id; K.ad.blk = null; speichern(`Vorlage ${v.name} angelegt`, false); K.render(); };
  A.adStandard = () => { for (const x of S().einst.dokumente) x.standard = x.id === K.ad.vorlage; speichern(`${vor().name} ist Standard`, false); K.render(); };
  A.adWeg = () => { const e = S().einst, v = vor(); if (K.ad.loeschen !== v.id) { K.ad.loeschen = v.id; return K.toast("Zum Löschen noch einmal auf „Löschen“ klicken."); } e.dokumente = e.dokumente.filter(x => x !== v); K.ad.vorlage = null; K.ad.loeschen = null; speichern(`Vorlage ${v.name} gelöscht`, false); K.render(); };
  I.adVName = el => { vor().name = el.value.trim() || vor().name; speichern("Vorlage umbenannt", false); K.render(); };
  const einfuegen = (typ, vorId, nach) => {
    const v = vor(), b = D.neuerBlock(typ); let i = vorId ? v.bloecke.findIndex(x => x.id === vorId) : -1;
    if (i < 0) i = K.ad.blk ? v.bloecke.findIndex(x => x.id === K.ad.blk) + 1 : v.bloecke.length; else if (nach) i++;
    v.bloecke.splice(i, 0, b); K.ad.blk = b.id; speichern(`Baustein ${NAME[typ]} eingefügt`, false); K.render();
  };
  A.adEinfuegen = el => einfuegen(el.dataset.t);
  A.adBlkWeg = () => { const v = vor(); v.bloecke = v.bloecke.filter(x => x.id !== K.ad.blk); K.ad.blk = null; speichern("Baustein entfernt", false); K.render(); };
  A.adBlkKopie = () => { const v = vor(), i = v.bloecke.findIndex(x => x.id === K.ad.blk), b = { ...K.clone(v.bloecke[i]), id: uid() }; v.bloecke.splice(i + 1, 0, b); K.ad.blk = b.id; speichern("Baustein dupliziert", false); K.render(); };
  A.adAktiv = el => { blk().aktiv = el.checked; speichern(); K.render(); };
  A.adAktivL = el => { const b = vor().bloecke.find(x => x.id === el.dataset.b); b.aktiv = b.aktiv === false; speichern(); K.render(); };
  I.adFeld = el => { const b = blk(), k = el.dataset.k; b[k] = el.type === "number" ? Number(el.value) : el.value; speichern(); };
  A.adHaken = el => { blk()[el.dataset.k] = el.checked; speichern(); };
  A.adWahlFeld = el => { const b = blk(), k = el.dataset.k; b[k] = /^\d+$/.test(el.value) ? +el.value : el.value; speichern(); K.render(); };
  I.adText = el => { blk()[el.dataset.k] = el.value; speichern(); };
  I.adStdText = el => { const e = S().einst; e.vorlage[el.dataset.q] = el.value; speichern(); };
  A.adBild = async el => { const id = await (K.bildLesen ? K.bildLesen(el) : St().bildHochladen(el)); if (id === undefined) return; blk()[el.dataset.k] = id; speichern("Bild geändert", false); K.render(); };
  I.adSeite = el => { const s = vor().seite, k = el.dataset.k; s[k] = el.type === "number" ? Number(el.value) : el.value; speichern(); };
  A.adSeiteWahl = el => { vor().seite[el.dataset.k] = el.value; speichern(); };
  A.adSeiteHaken = el => { vor().seite[el.dataset.k] = el.checked; speichern(); };
  A.adSeiteBild = async el => {
    const s = vor().seite, k = el.dataset.k, f = el.files && el.files[0];
    if (el.dataset.weg) { s[k] = null; if (k === "briefpapier") { s.briefpapierPdf = null; s.briefpapierSeiten = 0; if (s.briefpapierAusPdf) s.briefpapierFolge = null; s.briefpapierAusPdf = false; } speichern("Briefpapier entfernt", false); return K.render(); }
    if (f && (f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      if (f.size > 3e6) return K.toast("Bitte ein Briefpapier-PDF unter 3 MB verwenden.");
      K.toast("Briefpapier wird gelesen …");
      try { const r = await D.briefpapierLesen(f); Object.assign(s, { briefpapierPdf: r.pdf, briefpapierSeiten: r.seiten, briefpapier: r.vorschau[0] || null, briefpapierFolge: r.vorschau[1] || null, briefpapierAusPdf: true }); speichern("PDF-Briefpapier hinterlegt", false); K.toast(r.vorschau.length ? "Briefpapier übernommen" : "Briefpapier übernommen, Vorschau nicht verfügbar"); }
      catch (e) { console.error(e); K.toast("Das PDF konnte nicht gelesen werden: " + (e.message || e)); }
      return K.render();
    }
    const id = await (K.bildLesen ? K.bildLesen(el) : St().bildHochladen(el)); if (id === undefined) return; s[k] = id; if (k === "briefpapier") { s.briefpapierPdf = null; s.briefpapierAusPdf = false; } speichern("Briefpapier geändert", false); K.render();
  };
  A.adBpEigenesAus = () => { const v = vor(); v.seite.streifen = false; v.fuss = Object.assign(v.fuss || {}, { zeigen: false }); for (const b of v.bloecke) if (b.typ === "briefkopf") b.aktiv = false; speichern("Eigener Kopf und Fuß bei Briefpapier ausgeblendet", false); K.render(); };
  I.adFolgekopf = el => { vor().folgekopf = el.value; speichern(); };
  A.adFussHaken = el => { const v = vor(); v.fuss ||= { spalten: [] }; v.fuss[el.dataset.k] = el.checked; speichern(); };
  I.adFuss = el => { vor().fuss.spalten[+el.dataset.j] = el.value; speichern(); };
  A.adGruppe = el => { const v = vor(), g = el.dataset.g; v.gruppen ||= []; if (el.checked) { for (const x of S().einst.dokumente) x.gruppen = (x.gruppen || []).filter(y => y !== g); v.gruppen.push(g); } else v.gruppen = v.gruppen.filter(y => y !== g); speichern("Zuordnung zu Produktfamilien geändert", false); };
  let letztesFeld = null;
  document.addEventListener("focusin", e => { if (K.root && K.root.contains(e.target) && e.target.matches && e.target.matches(".ad-rechts textarea, .ad-rechts input[type=text], .ad-rechts input:not([type])")) letztesFeld = e.target; });
  A.adPh = el => { const f = letztesFeld && K.root.contains(letztesFeld) ? letztesFeld : K.root.querySelector(".ad-rechts textarea, .ad-rechts input:not([type=number]):not([type=checkbox]):not([type=color]):not([type=file])"); if (!f) return; const t = `{{${el.dataset.p}}}`, s = f.selectionStart ?? f.value.length; f.value = f.value.slice(0, s) + t + f.value.slice(f.selectionEnd ?? s); f.focus(); f.setSelectionRange(s + t.length, s + t.length); f.dispatchEvent(new Event(f.tagName === "TEXTAREA" ? "input" : "change", { bubbles: true })); if (f.tagName !== "TEXTAREA") f.dispatchEvent(new Event("input", { bubbles: true })); };
  A.adFmt = el => { const f = el.closest(".feld")?.querySelector("textarea"); if (!f) return; const s = f.selectionStart, e2 = f.selectionEnd, sel = f.value.slice(s, e2) || "Text", art = el.dataset.f;
    const neu = art === "b" ? `**${sel}**` : art === "i" ? `*${sel}*` : sel.split("\n").map(l => "- " + l.replace(/^\s*[-•]\s+/, "")).join("\n");
    f.value = f.value.slice(0, s) + neu + f.value.slice(e2); f.focus(); f.setSelectionRange(s, s + neu.length); f.dispatchEvent(new Event("input", { bubbles: true })); };
  A.adDrucken = () => D.drucken(beispiel(), S().live || S().entwurf).catch(e => { console.error(e); K.toast("Drucken nicht möglich."); });
  A.adPdf = async el => { el.disabled = true; try { const a = beispiel(); await K.speichereDatei(`Angebot_${a.nr}.pdf`, await D.pdf(a, S().live || S().entwurf)); } catch (e) { console.error(e); K.toast("PDF konnte nicht erzeugt werden: " + (e.message || e)); } el.disabled = false; };
  // Auswahl per Klick in die Vorschau
  document.addEventListener("click", e => {
    if (!K.root || K.aktuell() !== "studio-vorlagen") return; const el = e.target.closest && e.target.closest("#ad-seiten .d-el[data-blk]"); if (!el) return;
    K.ad.blk = el.dataset.blk; K.render();
  });

  /* Drag & Drop: Bausteine aus der Palette und Umsortieren */
  let zug = null;
  const imDesigner = e => K.root && K.root.contains(e.target) && K.aktuell() === "studio-vorlagen" && !ro();
  const ziel = (e) => { const el = e.target.closest("#ad-seiten .d-el[data-blk], .ad-aufbau li[data-adblk]"); if (!el) return null; const r = el.getBoundingClientRect(); return { el, id: el.dataset.blk || el.dataset.adblk, nach: e.clientY > r.top + r.height / 2 }; };
  document.addEventListener("dragstart", e => { if (!imDesigner(e)) return; const p = e.target.closest && e.target.closest("[data-adneu],[data-adblk]"); if (!p) return; zug = p.dataset.adneu ? { neu: p.dataset.adneu } : { id: p.dataset.adblk }; e.dataTransfer.effectAllowed = "copyMove"; try { e.dataTransfer.setData("text/plain", zug.neu || zug.id); } catch (x) {} });
  document.addEventListener("dragend", () => { zug = null; K.root && K.root.querySelectorAll(".ad-vor,.ad-nach").forEach(x => x.classList.remove("ad-vor", "ad-nach")); });
  document.addEventListener("dragover", e => { if (!zug || !imDesigner(e)) return; const z = ziel(e); const leer = e.target.closest && e.target.closest("#ad-seiten"); if (!z && !leer) return; e.preventDefault(); K.root.querySelectorAll(".ad-vor,.ad-nach").forEach(x => x.classList.remove("ad-vor", "ad-nach")); if (z) z.el.classList.add(z.nach ? "ad-nach" : "ad-vor"); });
  document.addEventListener("drop", e => {
    if (!zug || !imDesigner(e)) return; const z = ziel(e), leer = e.target.closest && e.target.closest("#ad-seiten"); if (!z && !leer) return; e.preventDefault();
    const q = zug; zug = null; const v = vor();
    if (q.neu) return einfuegen(q.neu, z ? z.id : v.bloecke[v.bloecke.length - 1]?.id, z ? z.nach : true);
    if (!z || z.id === q.id) return; const b = v.bloecke.find(x => x.id === q.id); v.bloecke = v.bloecke.filter(x => x !== b);
    let i = v.bloecke.findIndex(x => x.id === z.id); if (z.nach) i++; v.bloecke.splice(i, 0, b); K.ad.blk = b.id; speichern("Reihenfolge geändert", false); K.render();
  });

  /* ---------- Angebot: Vorlage wählen, Vorschau, Druck ---------- */
  K.act.angVorlage = el => { const a = (S().angebote || []).find(x => x.nr === el.dataset.nr); a.vorlageId = el.value || null; K.Store.angebotSpeichern(a); K.render(); };
  K.act.angVorschau = async el => {
    const a = (S().angebote || []).find(x => x.nr === el.dataset.nr), mo = S().live, v = D.vorlageFuer(a, mo);
    K.sheet(`<div class="ad-sheetkopf"><h3>Angebot ${esc(a.nr)} · ${esc(v.name)}</h3><div class="row"><button class="btn klein" type="button" data-act="angDrucken" data-nr="${esc(a.nr)}">Drucken</button><button class="btn klein primary" type="button" data-act="angPdf" data-nr="${esc(a.nr)}">PDF speichern</button><button class="btn klein" type="button" data-act="sheetZu">Schließen</button></div></div><div class="dok ad-seiten im-sheet" style="--zoom:.7"><p class="gedimmt">Dokument wird gesetzt …</p></div>`);
    const box = document.querySelector("#konf-sheet .ad-seiten"); const bilder = await D.bilder(a, v, mo); if (box) box.innerHTML = D.html(a, v, mo, { bilder });
  };
  K.act.angDrucken = el => { const a = (S().angebote || []).find(x => x.nr === el.dataset.nr); D.drucken(a, S().live).catch(e => { console.error(e); K.toast("Drucken nicht möglich."); }); };
})(window);
