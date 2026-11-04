/* Angebotsdokument als PDF, aufgebaut aus der Vorlage (Einstellungen → Vorlagen) */
(function () {
  const K = window.KONF;

  K.platzhalter = (text, a, einst) => {
    const b = (einst.vertrieb || []).find(v => v.id === a.bearbeiter) || {};
    const werte = {
      "kunde.firma": a.kunde?.firma, "kunde.person": a.kunde?.person, "angebot.nr": a.nr, "angebot.datum": K.datum(a.erstellt),
      "angebot.gueltig": K.datum(a.gueltig), "bearbeiter.name": b.name, "bearbeiter.tel": b.tel, "bearbeiter.mail": b.mail, "firma.name": einst.firma?.name
    };
    return String(text || "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => werte[k] ?? m);
  };

  const n2 = v => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0) + " EUR";

  K.pdfErzeugen = async (a, mo) => {
    await K.lib("jspdf");
    if (mo && K.cfg && (K.Store.S.einst?.vorlage || {}).zeigeBild) await K.viewerBereit();
    const { jsPDF } = window.jspdf; const d = new jsPDF({ unit: "mm", format: "a4" });
    const S = K.Store.S, e = S.einst, f = e.firma, t = a.texte || e.vorlage, opt = e.vorlage;
    const sum = K.E.summen(a, e.mwst); const bearb = (e.vertrieb || []).find(v => v.id === a.bearbeiter) || {};
    const LI = 20, RE = 190; let y = 0, seite = 1;
    const kopf = () => {
      for (let i = 0; i < 21; i++) { d.setFillColor(i % 2 ? 27 : 242, i % 2 ? 35 : 183, i % 2 ? 43 : 5); d.rect(i * 10, 0, 10, 2.5, "F"); }
      d.setFont("helvetica", "normal"); d.setFontSize(7.5); d.setTextColor(110);
      d.text(`${f.name} · ${f.strasse} · ${f.ort} · ${f.tel}`, LI, 289);
      d.text(`Angebot ${a.nr} · Seite ${seite}`, RE, 289, { align: "right" }); d.setTextColor(20);
    };
    const platz = mm => { if (y + mm > 278) { d.addPage(); seite++; kopf(); y = 18; } };
    const absatz = (txt, size = 10, abstand = 4.6) => {
      if (!txt) return; d.setFont("helvetica", "normal"); d.setFontSize(size);
      for (const zeile of d.splitTextToSize(K.platzhalter(txt, a, e), RE - LI)) { platz(abstand); d.text(zeile, LI, y); y += abstand; }
    };
    kopf();
    d.setFontSize(7.5); d.setTextColor(110); d.text(`${f.name} · ${f.strasse} · ${f.ort}`, LI, 20); d.setTextColor(20);
    d.setFontSize(10.5); d.text([a.kunde.firma, a.kunde.person, a.kunde.strasse, a.kunde.ort].filter(Boolean), LI, 28);
    d.setFont("helvetica", "bold"); d.setFontSize(13); d.text(f.name, RE, 20, { align: "right" });
    d.setFont("helvetica", "normal"); d.setFontSize(9);
    const kd = S.kunden.find(k => k.id === a.kundeId);
    const rechts = [["Angebot", a.nr], ["Datum", K.datum(a.erstellt)], ["Gültig bis", K.datum(a.gueltig)], ["Kunden-Nr.", kd?.nr || "–"], ["Ihr Kontakt", bearb.name || "–"], ["Telefon", bearb.tel || "–"]];
    rechts.forEach(([l, v], i) => { d.setTextColor(110); d.text(l, 140, 30 + i * 5); d.setTextColor(20); d.text(String(v), RE, 30 + i * 5, { align: "right" }); });
    d.setFont("helvetica", "bold"); d.setFontSize(17); d.text(`Angebot ${a.nr}`, LI, 70); y = 80;
    absatz(t.einleitung);
    y += 4;

    let posNr = 0;
    for (const p of a.positionen) {
      posNr++;
      const gesamt = p.einzel * p.menge * (1 - (p.rabatt || 0) / 100);
      if (p.typ === "konfig") {
        platz(30); d.setFillColor(242, 244, 246); d.rect(LI, y - 5, RE - LI, 8, "F");
        d.setFont("helvetica", "bold"); d.setFontSize(10.5); d.text(`Pos. ${posNr * 10}   ${p.produktName}`, LI + 2, y); d.text(`${p.menge} Stk`, RE - 2, y, { align: "right" }); y += 8;
        if (opt.zeigeBild) {
          const prod = K.E.produkt(mo, p.produkt);
          const url = prod ? await K.viewer().bild(mo, prod, p.sel).catch(() => null) : null;
          if (url) { platz(90); d.addImage(url, "PNG", LI + 10, y - 2, 150, 81.4); y += 84; }
        }
        d.setFontSize(9);
        let ueber = null;
        for (const z of p.zeilen) {
          if (z.ueberschrift && z.ueberschrift !== ueber) { // ZZ-Überschrift als Gliederung im Angebot
            ueber = z.ueberschrift; platz(10); y += 1.5; d.setFont("helvetica", "bold"); d.setFontSize(9.5); d.setTextColor(20); d.text(ueber, LI + 2, y); y += 5; d.setFontSize(9);
          }
          platz(5.5); d.setFont("helvetica", "normal"); d.setTextColor(100); d.text(z.ueberschrift ? (z.code || "") : z.merkmal, LI + (z.ueberschrift ? 6 : 2), y); d.setTextColor(20);
          const tx = d.splitTextToSize(z.text, 95); d.text(tx, 62, y);
          if (opt.zeigeMerkmalpreise) d.text(z.preis ? n2(z.preis) : "inkl.", RE - 2, y, { align: "right" });
          y += 4.6 * tx.length; d.setDrawColor(225); d.line(LI, y - 3, RE, y - 3);
        }
        if (p.grundausstattung && p.grundausstattung.length && opt.zeigeGrundausstattung !== false) {
          platz(10); d.setFont("helvetica", "bold"); d.setTextColor(100); d.text("Grundausstattung", LI + 2, y); d.setFont("helvetica", "normal"); d.setTextColor(20);
          const tx = d.splitTextToSize(p.grundausstattung.map(x => x.name).join(" · "), 120); for (const zeile of tx) { platz(5); d.text(zeile, 62, y); y += 4.3; }
          y += 1; d.setDrawColor(225); d.line(LI, y - 3, RE, y - 3);
        }
      } else {
        platz(10); d.setFillColor(242, 244, 246); d.rect(LI, y - 5, RE - LI, 8, "F");
        d.setFont("helvetica", "bold"); d.setFontSize(10.5); d.text(`Pos. ${posNr * 10}   ${p.text}`, LI + 2, y); d.text(`${p.menge} Stk`, RE - 2, y, { align: "right" }); y += 7;
      }
      platz(12); d.setFont("helvetica", "normal"); d.setFontSize(9.5);
      d.text(`Einzelpreis ${n2(p.einzel)}${p.rabatt ? `   abzgl. ${K.zahl(p.rabatt, 1)} % Rabatt` : ""}`, LI + 2, y + 1);
      d.setFont("helvetica", "bold"); d.text(n2(gesamt), RE - 2, y + 1, { align: "right" }); y += 10;
    }

    platz(44); y += 2; const z = (l, v, fett) => { d.setFont("helvetica", fett ? "bold" : "normal"); d.text(l, 118, y); d.text(v, RE - 2, y, { align: "right" }); y += 6; };
    d.setFontSize(10);
    z("Summe Positionen", n2(sum.liste - sum.posRabatt));
    if (a.rabatt) z(`Gesamtrabatt ${K.zahl(a.rabatt, 1)} %`, "- " + n2(sum.gesamtRabatt));
    z("Summe netto", n2(sum.netto)); z(`USt. ${e.mwst} %`, n2(sum.ust));
    d.setDrawColor(27); d.setLineWidth(.5); d.line(118, y - 4, RE, y - 4); d.setLineWidth(.2); z("Gesamtbetrag", n2(sum.brutto), true);
    y += 4;
    for (const [titel, key] of [["Lieferung", "lieferung"], ["Zahlungsbedingungen", "zahlung"], ["Gewährleistung", "gewaehrleistung"]]) {
      if (!t[key]) continue; platz(12); d.setFont("helvetica", "bold"); d.setFontSize(10); d.text(titel, LI, y); y += 5; absatz(t[key], 9.5, 4.4); y += 2;
    }
    y += 2; absatz(t.schluss);

    if (opt.zeigeStueckliste) {
      for (const p of a.positionen.filter(p => p.typ === "konfig")) {
        const prod = K.E.produkt(mo, p.produkt); if (!prod) continue;
        d.addPage(); seite++; kopf(); y = 20;
        d.setFont("helvetica", "bold"); d.setFontSize(13); d.text(`Anlage: Stückliste ${p.produktName}`, LI, y); y += 9; d.setFontSize(8.5);
        for (const r of K.E.stueckliste(mo, prod, p.sel)) { platz(5); d.setFont("courier", "normal"); d.text(r.nr, LI, y); d.setFont("helvetica", "normal"); d.text(r.bez, 52, y); d.text(`${K.zahl(r.menge, 2)} ${r.me}`, RE, y, { align: "right" }); y += 4.6; }
      }
    }
    return d.output("blob");
  };
})();
