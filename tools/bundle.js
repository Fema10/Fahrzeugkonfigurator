/* Baut eine CSS- und eine JavaScript-Datei für den Einsatz z. B. im APplus-Dashboard.
   Aufruf: node tools/build-demo.js && node tools/bundle.js */
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const stand = new Date().toISOString().slice(0, 10);
const css = `/* Fahrzeugkonfigurator ${stand} */\n@import url("https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");\n` + fs.readFileSync(path.join(root, "css/app.css"), "utf8");
const dateien = ["core", "engine", "store", "viewer3d", "pdf", "sales", "studio", "modell", "excel", "liste", "preise", "katalogbau", "dokument", "applus-da", "applus", "rechte", "app"];
const demo = fs.readFileSync(path.join(root, "daten/demo.json"), "utf8");
const js = `/* =====================================================================
   Fahrzeugkonfigurator ${stand}
   ---------------------------------------------------------------------
   EINBINDUNG IN EIN APPLUS-DASHBOARD
   konfigurator.css und konfigurator.js wie gewohnt im Dashboard hinterlegen.
   Die App hängt sich selbst oben in #content ein und blendet den übrigen
   Dashboard-Inhalt aus. Ein vorhandenes <div id="konfigurator"></div> wird
   stattdessen verwendet.

   EINSTELLUNGEN (optional, VOR konfigurator.js setzen)
     window.KONF_CONFIG = {
       queries: { codes: "KONF_CODES", produkte: "KONF_PRODUKTE", regeln: "KONF_REGELN",
                  merkmale: "", katalog: "", stueckliste: "", kunden: "KONF_KUNDEN",
                  artikel: "KONF_ARTIKEL",       // Artikelstamm aus Tabelle ARTIKEL
                  vertrieb: "KONF_VERTRIEB",     // Bearbeiter (PERSONAL): Name, Telefon, E-Mail
                  angebotsnummer: "KONF_ANGEBOTSNR" }, // nächste bzw. letzte Angebotsnummer aus dem ERP
       // angebotsnummer: async einst => "AN26-01234",  // alternativ: Funktion, die im ERP reserviert
       artikelSpalten: { code: ["ARTIKEL"], name: ["NAME"], preis: ["VKPREIS"] },  // nur falls abweichend
       maximize: true,          // übrigen #content ausblenden
       libs: { three: "/pfad/three.min.js", ... }   // falls kein Internetzugriff
     };
   ARTIKELSTAMM: Vertriebscodes, Fahrzeugnummern und Stücklistenteile sind Artikel
   (Tabelle ARTIKEL, Feld ARTIKEL). Die Abfrage KONF_ARTIKEL liefert mindestens die
   Spalte ARTIKEL, sinnvoll dazu Bezeichnung, Verkaufspreis, Kosten, Mengeneinheit.
   Spaltennamen für Bezeichnung/Preis werden automatisch erkannt (NAME, BEZEICHNUNG,
   VKPREIS, PREIS …) oder über artikelSpalten festgelegt. Bei großen Artikelstämmen
   die Abfrage auf die relevanten Artikelgruppen einschränken.
   Die Abfragen werden über <App>/kidb/dashboard/ViewQuery.aspx?name=<Query>&xhr=json
   geladen und haben dieselben Spalten wie die Excel-Importvorlage.
   Ohne Abfragen gelten die eingebetteten Beispieldaten. Angebote, Kunden und
   Studio-Änderungen werden im Browser gespeichert (localStorage).

   BIBLIOTHEKEN werden nur bei Bedarf nachgeladen (3D, PDF, Excel, ZIP).
   Sind sie nicht erreichbar, läuft der Rest weiter.
   ===================================================================== */
window.KONF_DEMO_DATEN = window.KONF_DEMO_DATEN || ${demo.trim()};
` + dateien.map(d => `\n/* ===== ${d}.js ===== */\n` + fs.readFileSync(path.join(root, "js", d + ".js"), "utf8")).join("\n");
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/konfigurator.css"), css);
fs.writeFileSync(path.join(root, "dist/konfigurator.js"), js);
fs.writeFileSync(path.join(root, "dist/beispiel-einbindung.html"), `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fahrzeugkonfigurator – Test wie in APplus</title>
<style>/* nachgestellte APplus-Seite mit eigenen, globalen Styles */
body{margin:0;font:14px Verdana,sans-serif;background:#ddd} #kopf{height:60px;background:#444;color:#fff;padding:18px} #content{padding:20px;width:900px;margin:auto}
button{background:#ccc;border-radius:12px;font-size:16px} table{border:3px solid red} h2{color:blue;font-size:30px} input{width:300px}</style>
<link rel="stylesheet" href="konfigurator.css">
</head><body>
<div id="kopf">APplus</div>
<div id="content"><div class="dashboard-alt"><h2>Bisheriger Dashboard-Inhalt</h2></div></div>
<script src="konfigurator.js"></script>
</body></html>
`);
console.log("konfigurator.css", Math.round(css.length / 1024), "KB · konfigurator.js", Math.round(js.length / 1024), "KB");
