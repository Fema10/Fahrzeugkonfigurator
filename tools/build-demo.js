/* Erzeugt daten/demo.json (Beispielmodell, Kunden, Angebote) mit der echten Engine.
   Aufruf: node tools/build-demo.js
   In APplus entfällt diese Datei: dort kommen die Stammdaten aus den Queries. */
const fs = require("fs"), path = require("path");
const E = require("../js/engine.js");

const S = (nr, bez, menge, me = "Stk") => [nr, bez, menge, me];
const modell = {
  version: 1,
  gruppen: [{ id: "tieflader", name: "Tieflader" }, { id: "plattform", name: "Plattform" }, { id: "holz", name: "Holztransport" }],
  merkmale: [
    { id: "achsen", name: "Achsanzahl", abschnitt: "Fahrwerk", typ: "einfach", werte: [
      { id: "a2", name: "2 Achsen", preis: 0, kosten: 0, menge: 2, teil: "achsen_2", stl: [S("AC-10T-100", "Achsaggregat 10 t, Scheibenbremse", 2)] },
      { id: "a3", name: "3 Achsen", preis: 6800, kosten: 4900, menge: 3, teil: "achsen_3", stl: [S("AC-10T-100", "Achsaggregat 10 t, Scheibenbremse", 3)] },
      { id: "a4", name: "4 Achsen", preis: 14500, kosten: 10400, menge: 4, teil: "achsen_4", stl: [S("AC-10T-100", "Achsaggregat 10 t, Scheibenbremse", 4)] },
      { id: "a5", name: "5 Achsen", preis: 23800, kosten: 17100, menge: 5, teil: "achsen_5", stl: [S("AC-10T-100", "Achsaggregat 10 t, Scheibenbremse", 5)] },
      { id: "a6", name: "6 Achsen", preis: 33500, kosten: 24100, menge: 6, teil: "achsen_6", stl: [S("AC-10T-100", "Achsaggregat 10 t, Scheibenbremse", 6)] }] },
    { id: "lenkung", name: "Lenkung", abschnitt: "Fahrwerk", typ: "einfach", werte: [
      { id: "starr", name: "Starrachsen", preis: 0, kosten: 0, teil: "lenkung_starr", stl: [] },
      { id: "zwang", name: "Zwangslenkung mechanisch", preis: 8900, kosten: 6200, teil: "lenkung_zwang", stl: [S("LK-ZW-100", "Zwangslenkung mit Drehschemelabnahme", 1, "Satz")] },
      { id: "hydr", name: "Hydraulische Zwangslenkung", preis: 18500, kosten: 12900, teil: "lenkung_hydr", stl: [S("LK-HY-200", "Lenkhydraulik komplett", 1, "Satz"), S("LK-HY-210", "Lenkzylinder", 2)] }] },
    { id: "federung", name: "Federung", abschnitt: "Fahrwerk", typ: "einfach", multiplikator: "achsen", werte: [
      { id: "luft", name: "Luftfederung", preis: 0, kosten: 0, stl: [S("FE-LU-010", "Luftfederbalg", 2)] },
      { id: "hydro", name: "Hydraulische Pendelachsen, Hub 300 mm", preis: 4200, kosten: 3000, teil: "pendel", stl: [S("FE-HP-020", "Pendelachse hydraulisch", 2)] }] },
    { id: "reifen", name: "Bereifung", abschnitt: "Fahrwerk", typ: "einfach", multiplikator: "achsen", werte: [
      { id: "r175", name: "235/75 R17,5 zwillingsbereift", preis: 0, kosten: 0, stl: [S("RF-175-235", "Kompletrad 235/75 R17,5", 4)] },
      { id: "r195", name: "245/70 R19,5 zwillingsbereift", preis: 380, kosten: 260, stl: [S("RF-195-245", "Kompletrad 245/70 R19,5", 4)] },
      { id: "r225", name: "385/65 R22,5 Super Single", preis: 720, kosten: 500, stl: [S("RF-225-385", "Kompletrad 385/65 R22,5", 2)] }] },
    { id: "ladeflaeche", name: "Ladefläche", abschnitt: "Aufbau", typ: "einfach", werte: [
      { id: "l9000", name: "9.000 mm", preis: 0, kosten: 0, stl: [S("BO-HZ-090", "Hartholzboden 50 mm, 9 m", 1, "Satz")] },
      { id: "l11500", name: "11.500 mm", preis: 3200, kosten: 2300, stl: [S("BO-HZ-115", "Hartholzboden 50 mm, 11,5 m", 1, "Satz")] },
      { id: "tele", name: "9.000 mm, teleskopierbar auf 15.000 mm", preis: 12900, kosten: 9100, teil: "teleskop", stl: [S("BO-HZ-090", "Hartholzboden 50 mm, 9 m", 1, "Satz"), S("RA-TE-600", "Teleskopauszug 6 m", 1)] }] },
    { id: "breite", name: "Breite", abschnitt: "Aufbau", typ: "einfach", werte: [
      { id: "b2550", name: "2.550 mm", preis: 0, kosten: 0, stl: [] },
      { id: "b2750", name: "2.750 mm", preis: 900, kosten: 600, stl: [S("RA-BR-275", "Außenrahmen 2.750 mm", 1, "Satz")] },
      { id: "b3300", name: "Verbreiterbar auf 3.300 mm", preis: 4600, kosten: 3100, teil: "verbreiterung", stl: [S("RA-VB-330", "Ausziehbare Verbreiterung", 8)] }] },
    { id: "hals", name: "Schwanenhals", abschnitt: "Aufbau", typ: "einfach", werte: [
      { id: "fest", name: "Fest", preis: 0, kosten: 0, stl: [] },
      { id: "abnehmbar", name: "Hydraulisch abnehmbar", preis: 16800, kosten: 11900, teil: "hals_abnehmbar", stl: [S("HA-HY-300", "Abnehmbarer Schwanenhals, hydraulisch", 1), S("HY-AG-050", "Hydraulikaggregat 5,5 kW", 1)] }] },
    { id: "rampen", name: "Auffahrrampen", abschnitt: "Aufbau", typ: "einfach", werte: [
      { id: "keine", name: "Keine", preis: 0, kosten: 0, stl: [] },
      { id: "mech", name: "Mechanisch klappbar", preis: 2900, kosten: 1900, teil: "rampen", stl: [S("RP-ME-220", "Auffahrrampe 2,2 m, federunterstützt", 2)] },
      { id: "hydr", name: "Hydraulisch klappbar", preis: 6400, kosten: 4300, teil: "rampen_hydr", stl: [S("RP-HY-220", "Auffahrrampe 2,2 m, hydraulisch", 2), S("HY-ZY-080", "Hydraulikzylinder Rampe", 2)] },
      { id: "hydrv", name: "Hydraulisch, seitlich verschiebbar", preis: 8900, kosten: 6100, teil: "rampen_verschiebbar", stl: [S("RP-HY-220", "Auffahrrampe 2,2 m, hydraulisch", 2), S("HY-ZY-080", "Hydraulikzylinder Rampe", 2), S("RP-VS-010", "Verschiebeeinrichtung", 1)] }] },
    { id: "rungen", name: "Rungenpaare", abschnitt: "Aufbau", typ: "einfach", werte: [
      { id: "rp2", name: "2 Rungenpaare", preis: 0, kosten: 0, stl: [S("RU-HO-180", "Rungenpaar 1.800 mm", 2)] },
      { id: "rp3", name: "3 Rungenpaare", preis: 1450, kosten: 980, stl: [S("RU-HO-180", "Rungenpaar 1.800 mm", 3)] },
      { id: "rp4", name: "4 Rungenpaare", preis: 2900, kosten: 1960, stl: [S("RU-HO-180", "Rungenpaar 1.800 mm", 4)] }] },
    { id: "farbe", name: "Farbe", abschnitt: "Lackierung", typ: "einfach", werte: [
      { id: "r9005", name: "RAL 9005 Tiefschwarz", preis: 0, kosten: 0, hex: "#141416", stl: [S("LA-9005", "Lackierung RAL 9005", 1, "Satz")] },
      { id: "r3000", name: "RAL 3000 Feuerrot", preis: 0, kosten: 0, hex: "#AF2B1E", stl: [S("LA-3000", "Lackierung RAL 3000", 1, "Satz")] },
      { id: "r5010", name: "RAL 5010 Enzianblau", preis: 0, kosten: 0, hex: "#0E4C92", stl: [S("LA-5010", "Lackierung RAL 5010", 1, "Satz")] },
      { id: "r7016", name: "RAL 7016 Anthrazitgrau", preis: 0, kosten: 0, hex: "#383E42", stl: [S("LA-7016", "Lackierung RAL 7016", 1, "Satz")] },
      { id: "r1028", name: "RAL 1028 Melonengelb", preis: 650, kosten: 420, hex: "#F4A900", stl: [S("LA-1028", "Lackierung RAL 1028", 1, "Satz")] }] },
    { id: "zubehoer", name: "Ausstattung", abschnitt: "Ausstattung", typ: "mehrfach", werte: [
      { id: "zurr", name: "Zurrpunkte 10 t, 20 Stück", preis: 1150, kosten: 690, stl: [S("ZU-ZP-100", "Zurrpunkt 10 t", 20)] },
      { id: "rungtaschen", name: "Rungentaschen mit 10 Stahlrungen", preis: 1900, kosten: 1200, teil: "rungen_seite", stl: [S("ZU-RT-010", "Rungentasche", 10), S("ZU-RS-080", "Stahlrunge 800 mm", 10)] },
      { id: "winde", name: "Seilwinde 12 t", preis: 6900, kosten: 4800, teil: "winde", stl: [S("ZU-SW-120", "Seilwinde hydraulisch 12 t", 1)] },
      { id: "achslift", name: "Achslift 1. Achse", preis: 1600, kosten: 1050, teil: "achslift", stl: [S("ZU-AL-001", "Achslifteinrichtung", 1)] },
      { id: "led", name: "LED-Beleuchtung komplett", preis: 980, kosten: 610, teil: "led", stl: [S("EL-LED-100", "LED-Leuchtenpaket", 1, "Satz")] },
      { id: "stuetz", name: "Hydraulische Stützfüße", preis: 3400, kosten: 2350, teil: "stuetzfuesse", stl: [S("ZU-SF-200", "Stützfuß hydraulisch", 2)] },
      { id: "kiste", name: "Werkzeugkasten", preis: 420, kosten: 240, teil: "werkzeugkasten", stl: [S("ZU-WK-060", "Werkzeugkasten 600 mm", 1)] }] }
  ],
  produkte: [
    { id: "ST", name: "Semitieflader ST", gruppe: "tieflader", artnr: "FZ-ST-000", basispreis: 48900, basiskosten: 35600, aktiv: true,
      beschreibung: "Für Baumaschinen und Stapler bis 40 t. Niedrige Ladehöhe, Auffahrt über das Heck.", visual: { typ: "semi", asset: null },
      stl: [S("RA-ST-100", "Rahmen Semitieflader, geschweißt", 1), S("KP-200", "Königszapfen 2\"", 1), S("EL-24-100", "Elektrik 24 V Grundausstattung", 1, "Satz"), S("MO-ST-001", "Montage und Endabnahme", 38, "h")],
      merkmale: [{ id: "achsen", werte: ["a2", "a3", "a4"] }, { id: "lenkung", werte: null }, { id: "federung", werte: null }, { id: "reifen", werte: null }, { id: "ladeflaeche", werte: null }, { id: "breite", werte: null }, { id: "rampen", werte: null }, { id: "farbe", werte: null }, { id: "zubehoer", werte: null }] },
    { id: "TB", name: "Tiefbett-Auflieger TB", gruppe: "tieflader", artnr: "FZ-TB-000", basispreis: 79500, basiskosten: 58200, aktiv: true,
      beschreibung: "Für hohe Maschinen und Transformatoren. Tiefbett mit 450 mm Ladehöhe.", visual: { typ: "tiefbett", asset: null },
      stl: [S("RA-TB-100", "Rahmen Tiefbett, geschweißt", 1), S("KP-350", "Königszapfen 3,5\"", 1), S("EL-24-100", "Elektrik 24 V Grundausstattung", 1, "Satz"), S("MO-TB-001", "Montage und Endabnahme", 64, "h")],
      merkmale: [{ id: "achsen", werte: ["a3", "a4", "a5", "a6"] }, { id: "lenkung", werte: null }, { id: "federung", werte: null }, { id: "reifen", werte: null }, { id: "ladeflaeche", werte: ["l9000", "tele"] }, { id: "breite", werte: null }, { id: "hals", werte: null }, { id: "rampen", werte: ["keine", "hydr"] }, { id: "farbe", werte: null }, { id: "zubehoer", werte: null }] },
    { id: "PA", name: "Plattform-Auflieger PA", gruppe: "plattform", artnr: "FZ-PA-000", basispreis: 36500, basiskosten: 26900, aktiv: true,
      beschreibung: "Ebene Ladefläche für Stahl, Betonfertigteile und Langgut.", visual: { typ: "plattform", asset: null },
      stl: [S("RA-PA-100", "Rahmen Plattform, geschweißt", 1), S("KP-200", "Königszapfen 2\"", 1), S("EL-24-100", "Elektrik 24 V Grundausstattung", 1, "Satz"), S("MO-PA-001", "Montage und Endabnahme", 30, "h")],
      merkmale: [{ id: "achsen", werte: ["a2", "a3"] }, { id: "lenkung", werte: ["starr", "zwang"] }, { id: "federung", werte: ["luft"] }, { id: "reifen", werte: null }, { id: "ladeflaeche", werte: null }, { id: "breite", werte: ["b2550", "b2750"] }, { id: "rampen", werte: ["keine", "mech"] }, { id: "farbe", werte: null }, { id: "zubehoer", werte: ["zurr", "rungtaschen", "achslift", "led", "kiste"] }] },
    { id: "LN", name: "Langholz-Nachläufer LN", gruppe: "holz", artnr: "FZ-LN-000", basispreis: 29800, basiskosten: 21400, aktiv: true,
      beschreibung: "Teleskopierbarer Nachläufer für Langholz bis 32 m Gesamtlänge.", visual: { typ: "nachlaeufer", asset: null },
      stl: [S("RA-LN-100", "Teleskoprohr mit Drehschemel", 1), S("EL-24-100", "Elektrik 24 V Grundausstattung", 1, "Satz"), S("MO-LN-001", "Montage und Endabnahme", 22, "h")],
      merkmale: [{ id: "achsen", werte: ["a2", "a3"] }, { id: "lenkung", werte: ["starr", "zwang"] }, { id: "reifen", werte: null }, { id: "rungen", werte: null }, { id: "farbe", werte: null }, { id: "zubehoer", werte: ["led", "kiste", "achslift"] }] }
  ],
  regeln: [
    { id: "R01", name: "Pendelachsen brauchen Hydrauliklenkung", aktiv: true, produkte: [], wenn: [{ merkmal: "federung", op: "ist", werte: ["hydro"] }], dann: { typ: "nurErlauben", merkmal: "lenkung", werte: ["hydr"] }, hinweis: "Pendelachsen werden immer mit hydraulischer Zwangslenkung ausgeliefert." },
    { id: "R02", name: "Ab 5 Achsen keine Starrachsen", aktiv: true, produkte: [], wenn: [{ merkmal: "achsen", op: "ist", werte: ["a5", "a6"] }], dann: { typ: "sperren", merkmal: "lenkung", werte: ["starr"] }, hinweis: "Mit 5 oder 6 Achsen ist der Reifenverschleiß ohne Lenkung zu hoch." },
    { id: "R03", name: "Pendelachsen nur mit 17,5 Zoll", aktiv: true, produkte: [], wenn: [{ merkmal: "federung", op: "ist", werte: ["hydro"] }], dann: { typ: "nurErlauben", merkmal: "reifen", werte: ["r175"] }, hinweis: "Pendelachsen sind für 17,5\"-Bereifung ausgelegt." },
    { id: "R04", name: "Teleskop ohne verschiebbare Rampen", aktiv: true, produkte: [], wenn: [{ merkmal: "ladeflaeche", op: "ist", werte: ["tele"] }], dann: { typ: "sperren", merkmal: "rampen", werte: ["hydrv"] }, hinweis: "" },
    { id: "R05", name: "Abnehmbarer Hals: Beladung von vorn", aktiv: true, produkte: ["TB"], wenn: [{ merkmal: "hals", op: "ist", werte: ["abnehmbar"] }], dann: { typ: "nurErlauben", merkmal: "rampen", werte: ["keine"] }, hinweis: "Mit abnehmbarem Schwanenhals wird von vorn beladen, Heckrampen entfallen." },
    { id: "R06", name: "Seilwinde nur mit festem Hals", aktiv: true, produkte: [], wenn: [{ merkmal: "hals", op: "ist", werte: ["abnehmbar"] }], dann: { typ: "sperren", merkmal: "zubehoer", werte: ["winde"] }, hinweis: "" },
    { id: "R07", name: "Verbreiterung erst ab 3 Achsen", aktiv: true, produkte: [], wenn: [{ merkmal: "achsen", op: "ist", werte: ["a2"] }], dann: { typ: "sperren", merkmal: "breite", werte: ["b3300"] }, hinweis: "" },
    { id: "R08", name: "Achslift nur mit Luftfederung", aktiv: true, produkte: [], wenn: [{ merkmal: "federung", op: "ist", werte: ["hydro"] }], dann: { typ: "sperren", merkmal: "zubehoer", werte: ["achslift"] }, hinweis: "" },
    { id: "R09", name: "4 Rungenpaare brauchen 3 Achsen", aktiv: true, produkte: ["LN"], wenn: [{ merkmal: "achsen", op: "ist", werte: ["a2"] }], dann: { typ: "sperren", merkmal: "rungen", werte: ["rp4"] }, hinweis: "" },
    { id: "R10", name: "Achslift ab 3 Achsen", aktiv: true, produkte: [], wenn: [{ merkmal: "achsen", op: "ist", werte: ["a2"] }], dann: { typ: "sperren", merkmal: "zubehoer", werte: ["achslift"] }, hinweis: "" },
    { id: "R11", name: "Melonengelb nur für Schwerlast (Entwurf)", aktiv: false, produkte: [], wenn: [{ merkmal: "achsen", op: "ist", werte: ["a2", "a3"] }], dann: { typ: "sperren", merkmal: "farbe", werte: ["r1028"] }, hinweis: "Noch nicht abgestimmt." }
  ]
};

/* Vertriebscodes, Darstellung, Reiter, Katalogstruktur (wie im CPQ) */
const CODES = { achsen: { a2: "A2", a3: "A3", a4: "A4", a5: "A5", a6: "A6" }, lenkung: { starr: "L0", zwang: "LZM", hydr: "LZH" }, federung: { luft: "FL", hydro: "FPH" },
  reifen: { r175: "R175", r195: "R195", r225: "R225" }, ladeflaeche: { l9000: "LF090", l11500: "LF115", tele: "LFT150" }, breite: { b2550: "B255", b2750: "B275", b3300: "B330V" },
  hals: { fest: "SH-F", abnehmbar: "SH-AH" }, rampen: { keine: "RA0", mech: "RAM", hydr: "RAH", hydrv: "RAHV" }, rungen: { rp2: "RP2", rp3: "RP3", rp4: "RP4" },
  farbe: { r9005: "RAL9005", r3000: "RAL3000", r5010: "RAL5010", r7016: "RAL7016", r1028: "RAL1028" },
  zubehoer: { zurr: "Z-ZP20", rungtaschen: "Z-RT10", winde: "Z-SW12", achslift: "Z-AL1", led: "Z-LED", stuetz: "Z-SFH", kiste: "Z-WK" } };
const EXTRA = { achsen: { darstellung: "kacheln", katalogfilter: true, abschnitt: "Fahrwerk", code: "ACH", info: "Anzahl der Achsen im Achsaggregat" }, lenkung: { darstellung: "liste", code: "LNK" }, federung: { darstellung: "liste", code: "FED" },
  reifen: { darstellung: "auswahl", code: "BER" }, ladeflaeche: { darstellung: "auswahl", pflicht: true, abschnitt: "Tiefbett-Plattform", code: "LAD" }, breite: { darstellung: "liste", abschnitt: "Tiefbett-Plattform", code: "BRT" },
  hals: { darstellung: "kacheln", pflicht: true, abschnitt: "Schwanenhals-Typ", code: "SHT", info: "Fest oder hydraulisch abnehmbar für Beladung von vorn" }, rampen: { darstellung: "kacheln", abschnitt: "Heck", code: "RMP" }, rungen: { darstellung: "liste", abschnitt: "Holzaufbau", code: "RNG" },
  farbe: { darstellung: "kacheln", bereich: "Optionen", code: "LCK" }, zubehoer: { darstellung: "option", bereich: "Optionen", code: "ZUB" } };
for (const m of modell.merkmale) { Object.assign(m, EXTRA[m.id] || {}); if (!m.bereich) m.bereich = "Grundmaschine"; for (const w of m.werte) w.code = CODES[m.id][w.id]; }
modell.merkmale.find(m => m.id === "rampen").werte.find(w => w.id === "hydrv").info = "Rampen lassen sich seitlich verschieben, für Maschinen mit schmaler Spur";
modell.gruppen = [
  { id: "schwer", name: "Schwertransport", eltern: null }, { id: "tieflader", name: "Tiefbett-Sattelauflieger", eltern: "schwer" }, { id: "semi", name: "Semi-Sattelauflieger", eltern: "schwer" },
  { id: "plattform", name: "Plattform-Sattelauflieger", eltern: "schwer" }, { id: "holz", name: "Holztransport", eltern: null }, { id: "nachlaeufer", name: "Nachläufer-Kombination", eltern: "holz" }];
const PC = { ST: ["semi", "SEMI_ST3_S3F"], TB: ["tieflader", "TB_T4P_S3F"], PA: ["plattform", "PLAT_PA2_FL"], LN: ["nachlaeufer", "NL_LN2_T"] };
for (const p of modell.produkte) { p.gruppe = PC[p.id][0]; p.code = PC[p.id][1]; }
const tb3 = JSON.parse(JSON.stringify(modell.produkte.find(p => p.id === "TB")));
Object.assign(tb3, { id: "TB3", code: "TB_T3P_S3F", name: "Tiefbett-Auflieger TB 3", basispreis: 71900, basiskosten: 52800, beschreibung: "Dreiachsige Tiefbett-Ausführung für Baumaschinen bis 45 t." });
tb3.merkmale.find(z => z.id === "achsen").werte = ["a3"]; modell.produkte.splice(2, 0, tb3);
// Merkmale an die Familien übergeben (von unten nach oben), wie im Produktmodell üblich
for (const g of ["tieflader", "semi", "plattform", "nachlaeufer", "schwer", "holz", "tieflader", "semi", "plattform", "nachlaeufer"]) E.hochziehen(modell, g);
modell.gruppen.find(g => g.id === "tieflader").artikelgruppe = "FZ-TB";
modell.regeln.find(r => r.id === "R05").produkte = []; modell.regeln.find(r => r.id === "R05").gruppen = ["tieflader"];
modell.regeln.push({ id: "T01", name: "Bereifung nach Achsanzahl", aktiv: true, typ: "tabelle", produkte: [], gruppen: ["tieflader"],
  tabelle: { merkmale: ["achsen", "reifen"], zeilen: [["a3", "r175"], ["a3", "r195"], ["a3", "r225"], ["a4", "r175"], ["a4", "r195"], ["a4", "r225"], ["a5", "r175"], ["a6", "r175"]] } });
modell.regeln.push({ id: "R12", name: "Abnehmbarer Hals braucht Stützfüße", aktiv: true, produkte: [], wenn: [{ merkmal: "hals", op: "ist", werte: ["abnehmbar"] }], dann: { typ: "setzen", merkmal: "zubehoer", werte: ["stuetz"] }, hinweis: "Zum Abkuppeln des Schwanenhalses werden hydraulische Stützfüße benötigt." });

const jetzt = Date.now(), h = 36e5, d = 864e5;
const einst = {
  firma: { name: "Muster Fahrzeugbau GmbH", strasse: "Industriestraße 12", ort: "77656 Musterstadt", tel: "+49 781 000 00-0", web: "www.muster-fahrzeugbau.example", ustid: "DE000000000" },
  vertrieb: [
    { id: "v1", name: "Jana Weber", tel: "+49 781 000 00-21", mail: "j.weber@muster-fahrzeugbau.example" },
    { id: "v2", name: "Markus Hahn", tel: "+49 781 000 00-24", mail: "m.hahn@muster-fahrzeugbau.example" }],
  mwst: 19, praefix: "AN-2026-", naechsteNr: 1047, gueltigTage: 30,
  vorlage: {
    einleitung: "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
    lieferung: "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
    zahlung: "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
    gewaehrleistung: "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
    schluss: "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
    zeigeMerkmalpreise: true, zeigeBild: true, zeigeStueckliste: false
  }
};

const kunden = [
  { id: "k10231", nr: "10231", firma: "Brenner Logistik GmbH", person: "Herr Tobias Brenner", strasse: "Hafenstraße 8", ort: "77694 Kehl", land: "DE", mail: "t.brenner@brenner-logistik.example", tel: "+49 7851 000 11", notiz: "Rahmenvertrag Wartung bis 2027." },
  { id: "k10457", nr: "10457", firma: "Kaiser Kran & Schwertransporte GmbH", person: "Frau Melanie Kaiser", strasse: "Werkstraße 3", ort: "77933 Lahr", land: "DE", mail: "m.kaiser@kaiser-schwertransporte.example", tel: "+49 7821 000 22", notiz: "Flotte: 14 Tieflader, Ersatz 2027 geplant." },
  { id: "k10512", nr: "10512", firma: "Forstbetrieb Hofmann KG", person: "Herr Stefan Hofmann", strasse: "Waldweg 21", ort: "77709 Wolfach", land: "DE", mail: "s.hofmann@forst-hofmann.example", tel: "+49 7834 000 33", notiz: "" },
  { id: "k10603", nr: "10603", firma: "Bauunternehmung Ruf GmbH & Co. KG", person: "Herr Daniel Ruf", strasse: "Gewerbepark 5", ort: "79098 Freiburg", land: "DE", mail: "d.ruf@ruf-bau.example", tel: "+49 761 000 44", notiz: "" },
  { id: "k10688", nr: "10688", firma: "Nordsee Anlagenbau AG", person: "Frau Ines Petersen", strasse: "Am Kai 14", ort: "26382 Wilhelmshaven", land: "DE", mail: "i.petersen@nordsee-anlagenbau.example", tel: "+49 4421 000 55", notiz: "Projekt Umspannwerk, Transformatoren bis 120 t." }
];

function pos(pid, aend, menge, rabatt) {
  const p = E.produkt(modell, pid), sel = E.standardSel(modell, p);
  Object.assign(sel, aend); E.bereinige(modell, p, sel);
  const k = E.preis(modell, p, sel);
  return { typ: "konfig", produkt: pid, produktName: p.name, sel, zeilen: k.zeilen, einzel: k.einzel, kosten: k.kosten, menge, rabatt, version: 1 };
}
const frei = (text, einzel, kosten, menge = 1) => ({ typ: "frei", text, einzel, kosten, menge, rabatt: 0 });
const ksnap = id => { const k = kunden.find(x => x.id === id); return { firma: k.firma, person: k.person, strasse: k.strasse, ort: k.ort, mail: k.mail }; };
const angebot = (nr, kid, bearb, alter, status, positionen, rabatt, events, token) => ({
  nr, kundeId: kid, kunde: ksnap(kid), bearbeiter: bearb, erstellt: jetzt - alter, gueltig: jetzt - alter + 30 * d, status,
  positionen, rabatt, texte: { ...einst.vorlage }, token, freigegeben: !!token, events, beispiel: true });

const angebote = [
  angebot("AN-2026-1043", "k10457", "v1", 9 * d, "versendet",
    [pos("ST", { achsen: "a3", lenkung: "zwang", reifen: "r195", ladeflaeche: "l11500", breite: "b3300", rampen: "hydrv", farbe: "r3000", zubehoer: ["zurr", "led", "stuetz"] }, 3, 4),
     frei("Überführung zum Kunden je Fahrzeug", 850, 620, 3)], 2,
    [{ typ: "aufruf", ts: jetzt - 8.6 * d, dauer: 212, geraet: "Desktop" }, { typ: "aufruf", ts: jetzt - 5 * d, dauer: 95, geraet: "Mobil" },
     { typ: "aufruf", ts: jetzt - 30 * h, dauer: 430, geraet: "Desktop" }, { typ: "pdf", ts: jetzt - 30 * h + 300e3 },
     { typ: "aufruf", ts: jetzt - 4 * h, dauer: 188, geraet: "Desktop" },
     { typ: "rueckfrage", ts: jetzt - 4 * h + 170e3, text: "Können die Rampen auch 2,5 m lang ausgeführt werden? Wir verladen Raupenbagger." }], "raum-k7q2m9xa4t"),
  angebot("AN-2026-1044", "k10688", "v2", 6 * d, "versendet",
    [pos("TB", { achsen: "a6", federung: "hydro", ladeflaeche: "tele", breite: "b3300", hals: "abnehmbar", farbe: "r7016", zubehoer: ["zurr", "led", "kiste"] }, 1, 0),
     frei("Einweisung Fahrpersonal vor Ort (1 Tag)", 1200, 700, 1)], 0,
    [{ typ: "aufruf", ts: jetzt - 5.5 * d, dauer: 66, geraet: "Desktop" }], "raum-p3w8n1zc6e"),
  angebot("AN-2026-1045", "k10512", "v1", 3 * d, "angenommen",
    [pos("LN", { achsen: "a3", lenkung: "zwang", rungen: "rp4", farbe: "r5010", zubehoer: ["led"] }, 2, 3)], 0,
    [{ typ: "aufruf", ts: jetzt - 2.8 * d, dauer: 140, geraet: "Mobil" }, { typ: "aufruf", ts: jetzt - 1.2 * d, dauer: 260, geraet: "Desktop" },
     { typ: "angenommen", ts: jetzt - 1.2 * d + 250e3, name: "Stefan Hofmann" }], "raum-h5d9r2kq8v"),
  angebot("AN-2026-1046", "k10603", "v2", 1 * d, "entwurf",
    [pos("PA", { achsen: "a3", lenkung: "zwang", ladeflaeche: "l11500", breite: "b2750", farbe: "r9005", zubehoer: ["zurr", "rungtaschen"] }, 2, 0)], 0, [], null)
];

const releases = [{ version: 1, ts: jetzt - 12 * d, von: null, notiz: "Erstes Konfigurationsmodell Auflieger", regeln: modell.regeln.length, merkmale: modell.merkmale.length, produkte: modell.produkte.length }];
const monat = new Date().toISOString().slice(0, 7);
const protokoll = [{ monat, eintraege: [
  { ts: jetzt - 12 * d, von: null, bereich: "Freigabe", text: "Version 1 veröffentlicht" },
  { ts: jetzt - 2 * d, von: null, bereich: "Regeln", text: "R11 angelegt (inaktiv)" }] }];

/* Artikelstamm wie aus APplus (Tabelle ARTIKEL): Vertriebscodes, Fahrzeuge, Stücklistenteile und weitere Artikel.
   Zwei Abweichungen zum Modell sind absichtlich drin, um den Abgleich zu zeigen (A4 Preis, R195 Bezeichnung). */
const artikel = new Map();
const art = (ARTIKEL, NAME, VKPREIS = 0, HERSTELLKOSTEN = 0, ME = "Stk", ARTIKELGRUPPE = "") => { if (!artikel.has(ARTIKEL)) artikel.set(ARTIKEL, { ARTIKEL, NAME, VKPREIS, HERSTELLKOSTEN, ME, ARTIKELGRUPPE }); };
for (const p of modell.produkte) art(p.code, p.name, p.basispreis, p.basiskosten, "Stk", p.gruppe === "tieflader" ? "FZ-TB" : "FAHRZEUG");
// weitere Fahrzeugartikel, die noch nicht konfigurierbar sind (zum Ausprobieren von "Artikel hinzufügen")
art("TB_T5P_S3F", "Tiefbett-Auflieger TB 5 Schwerlast", 98500, 72400, "Stk", "FZ-TB");
art("TB_T4P_S3F_LB", "Tiefbett-Auflieger TB, Leichtbau", 76900, 56100, "Stk", "FZ-TB");
art("SEMI_ST2_S3F", "Semitieflader ST 2-achsig", 44900, 32800, "Stk", "FAHRZEUG");
for (const m of modell.merkmale) for (const w of m.werte) art(w.code, w.code === "R195" ? "Bereifung 245/70 R19,5 zwilling" : w.name, w.code === "A4" ? 14900 : w.preis, w.kosten, "Stk", "VK-CODE");
for (const p of modell.produkte) for (const z of p.stl) art(z[0], z[1], 0, 0, z[3], "TEIL");
for (const m of modell.merkmale) for (const w of m.werte) for (const z of w.stl || []) art(z[0], z[1], 0, 0, z[3], "TEIL");
[["A7", "7 Achsen", 44800, 32200], ["Z-KAM", "Rückfahrkamera mit Monitor", 890, 520], ["Z-TEL", "Telematik-Box mit Achslastanzeige", 1450, 910], ["R195B", "445/45 R19,5 Super Single", 980, 690],
 ["RAL6005", "RAL 6005 Moosgrün", 0, 0], ["Z-VB", "Verbreiterungsbohlen Holz (Satz)", 1250, 780], ["Z-FB", "Fernbedienung Hydraulik", 1850, 1200]].forEach(([c, n, p, k]) => art(c, n, p, k, "Stk", "VK-CODE"));

const out = { modell, einstellungen: einst, kunden, angebote, releases, protokoll, artikel: [...artikel.values()] };
fs.mkdirSync(path.join(__dirname, "../daten"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "../daten/demo.json"), JSON.stringify(out, null, 1));
console.log("demo.json:", JSON.stringify(out).length, "Bytes;", angebote.map(a => a.nr + " " + E.summen(a).netto).join(" | "));
for (const p of modell.produkte) { const t = E.modelltest(modell, p); console.log(p.id, "Kombis", t.total, "gültig", t.gueltig, "Widersprüche", t.widersprueche, "tot", t.tote.map(x => x.wert).join(", ")); }
