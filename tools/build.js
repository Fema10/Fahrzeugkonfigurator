/* Baut eine einzelne HTML-Datei (dist/fahrzeugkonfigurator.html) mit allen
   eigenen CSS- und JS-Dateien und den Beispieldaten eingebettet.
   Aufruf: node tools/build-demo.js && node tools/build.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (m, f) => `<style>\n${fs.readFileSync(path.join(root, f), "utf8")}\n</style>`);
const demo = fs.readFileSync(path.join(root, "daten/demo.json"), "utf8").replace(/</g, "\\u003c");
html = html.replace(/<script src="js\/core\.js"><\/script>/, m => `<script id="demo-daten" type="application/json">${demo}</script>\n${m}`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (m, f) => `<script>\n${fs.readFileSync(path.join(root, f), "utf8").replace(/<\/script/gi, "<\\/script")}\n</script>`);
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/fahrzeugkonfigurator.html"), html);
console.log("dist/fahrzeugkonfigurator.html", Math.round(html.length / 1024), "KB");
