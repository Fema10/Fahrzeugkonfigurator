# Fahrzeugkonfigurator (CPQ-Prototyp)

**Dokumentation:** [docs/](docs/README.md) – Idee und Ziele, Prozesse, Bedienung, Codesystem, APplus-Anbindung, Architektur, Betrieb, offene Punkte.

Reines JavaScript und CSS, ohne Build-Werkzeug, damit es in ein APplus-Dashboard passt.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `js/engine.js` | Regel-Engine, Bereinigung, Preis/Kosten, Stückliste, Modelltest. Ohne Oberfläche, läuft auch in Node. |
| `js/store.js` | Datenschicht. **Einzige Stelle, die für APplus ersetzt wird.** |
| `js/viewer3d.js` | 360°-Ansicht (three.js r128). GLB-Modell je Produkt oder Ersatzmodell aus Parametern. |
| `js/pdf.js` | Angebots-PDF aus Vorlage (jsPDF). |
| `js/sales.js` | Übersicht, Katalog, Konfigurator, Angebote, Kunden, Verkaufsraum. |
| `js/studio.js` | Produkte, Merkmale, Regeln (Liste, Matrix, Graph), Modelltest, Freigabe, Vorlagen, Einstellungen, Protokoll. |
| `js/core.js`, `js/app.js` | Router, Ereignisse, Navigation, Start. |
| `css/app.css` | Gesamtes Layout, helles und dunkles Thema. |
| `daten/demo.json` | Beispieldaten und zugleich die Referenz für das Datenmodell. |
| `tools/build.js` | Baut `dist/fahrzeugkonfigurator.html` als Einzeldatei. |

## Datenmodell

Siehe Kommentar am Anfang von `js/engine.js`. Kurz:

- **Produkt**: Grundpreis, Herstellkosten, Grundstückliste, zugeordnete Merkmale mit erlaubten Werten.
- **Merkmal**: Werte mit Preis, Kosten, Menge (als Multiplikator nutzbar), Farbe, 3D-Teil, Stücklistenzeilen.
- **Regel**: `wenn` (Merkmal ist / ist nicht Wert …, mehrere Bedingungen = UND) → `dann` (Werte sperren oder nur bestimmte erlauben), optional auf Produkte begrenzt.
- **Entwurf / Live**: Pflege im Entwurf, Vertrieb nutzt die veröffentlichte Version.

## Anbindung an APplus

`store.js` neu schreiben und dieselben Methoden bedienen (`init`, `veroeffentlichen`, `kundeSpeichern`, `angebotSpeichern`, `ereignis`, `log` …):

1. Stammdaten (Produkte, Merkmale, Werte, Preise, Stücklisten) per Query lesen und in die Struktur von `demo.json` mappen.
2. Regeln, Angebote, Aufrufe und Protokoll in eigenen Tabellen ablegen.
3. Verkaufsraum: Der Kundenlink muss von außen erreichbar sein (Webserver/Reverse Proxy vor APplus). Dort wird jeder Aufruf mit Dauer als Ereignis gespeichert.
4. 3D: STEP-Dateien vorab nach GLB konvertieren (FreeCAD, CAD Exchanger). Bauteilnamen im GLB = Feld „3D-Teil“ am Merkmalswert. Materialien mit „lack“ im Namen erhalten die RAL-Farbe.

## Prüfen

```
node tools/build-demo.js   # erzeugt demo.json und führt den Modelltest für alle Produkte aus
node tools/build.js        # Einzeldatei bauen
```

## Einbindung in APplus (Stand: zwei Dateien)

`node tools/bundle.js` erzeugt `dist/konfigurator.css` und `dist/konfigurator.js`.

- Die App hängt sich wie die übrigen Dashboards oben in `#content` ein und blendet den restlichen Inhalt aus (`maximize`).
- Alle Stile sind auf `#konfigurator` begrenzt, globale APplus-Styles werden innerhalb neutralisiert.
- Navigation intern, die Adresszeile wird nicht verändert.
- Daten: `window.KONF_CONFIG.queries` (siehe Kopf von konfigurator.js). Abfragen liefern dieselben Spalten wie die Excel-Vorlage. Ohne Abfragen gelten Beispieldaten. Angebote, Kunden und Studio-Änderungen liegen im Browser (localStorage, Schlüssel `konf-v1`).
- three.js, jsPDF, JSZip und SheetJS werden nur bei Bedarf nachgeladen; Adressen über `KONF_CONFIG.libs` änderbar.
