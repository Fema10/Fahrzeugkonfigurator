# 07 Betrieb und Entwicklung

## Bauen

Benötigt wird Node.js. Ein npm-Installieren ist nicht nötig.

```bash
node tools/build-demo.js   # daten/demo.json erzeugen und Modelltest für alle Beispielprodukte
node tools/bundle.js       # dist/konfigurator.css, dist/konfigurator.js, dist/beispiel-einbindung.html
node tools/build.js        # dist/fahrzeugkonfigurator.html (Einzeldatei mit Beispieldaten)
```

Zum Entwickeln `index.html` direkt im Browser öffnen. Es lädt die einzelnen Dateien aus `js/` und `css/`.

## In APplus einbinden

1. `dist/konfigurator.css` und `dist/konfigurator.js` im Dashboard hinterlegen.
2. Vor `konfigurator.js` die Konfiguration setzen (Abfragen, ggf. Bibliotheksadressen):

```html
<link rel="stylesheet" href="konfigurator.css">
<script>
window.KONF_CONFIG = {
  queries: { artikel: "KONF_ARTIKEL", kunden: "KONF_KUNDEN", vertrieb: "KONF_VERTRIEB", angebotsnummer: "KONF_ANGEBOTSNR" }
  // libs: { pdflib: "/eigener/pfad/pdf-lib.min.js", ... }
};
</script>
<script src="konfigurator.js"></script>
```

3. Die Abfragen in APplus anlegen, siehe [05 APplus-Anbindung](05-applus-anbindung.md).
4. `dist/beispiel-einbindung.html` zeigt eine nachgebaute APplus-Umgebung zum Ausprobieren.

## Ausrollen einer neuen Version

1. Änderung auf einem Branch, Pull Request, Prüfung, Merge nach `main`.
2. Lokal bauen (`node tools/bundle.js`) und die beiden Dateien aus `dist/` im Dashboard austauschen.
3. Im Browser neu laden. Wenn nötig, den Cache leeren, damit die neuen Dateien geladen werden.
4. Daten im Browser (`konf-v1`) bleiben erhalten. Vor größeren Änderungen das Modell sichern: Studio › Excel-Import › „Aktuelles Modell als Excel exportieren“. Angebote, Vorlagen und Einstellungen sind darin nicht enthalten.

## Testen

Die Tests laufen mit Playwright gegen `dist/beispiel-einbindung.html`. Externe Bibliotheken werden dabei lokal bereitgestellt oder abgeschaltet.

Die Tests prüfen:
- Rauchtest
- APplus-Abfragen mit nachgebildeten Antworten
- Regeln, Modell, Löschen
- Listen- und Mappenimport, Preisimport
- Katalogaufbau, Gliederung, Feldtypen
- Artikelabgleich
- Angebotsdesigner, Briefpapier, PDF
- APplus-Export

Jede Änderung wird vor dem Pull Request mit diesen Tests geprüft. Im Pull Request steht, was getestet wurde.

Die Testskripte liegen noch nicht im Repository. Sie nutzen feste Pfade der Entwicklungsumgebung und sollen als `tests/` mit einem gemeinsamen Startskript nachgezogen werden (siehe [08 Offene Punkte](08-offene-punkte.md)).

Die Engine lässt sich ohne Browser prüfen:

```bash
node tools/build-demo.js   # gibt je Produkt Kombinationen, gültige, Widersprüche und nie wählbare Codes aus
```

## Git-Ablauf

| Art der Änderung | Weg |
|---|---|
| neue Funktion, Umbau, alles mit Auswirkung auf Daten oder APplus | eigener Branch (`feature/…`, `fix/…`, `docs/…`), Pull Request, Prüfung durch die Fachseite, Merge |
| Tippfehler, Beschriftung, kleine Korrektur | direkt auf `main` |

Regeln:
- `dist/` wird mit eingecheckt, damit die fertigen Dateien zu jedem Stand passen.
- Commit-Nachrichten auf Deutsch, kurz, was und warum.
- Keine Kunden- oder Personaldaten ins Repository. Beispieldaten sind erfunden.

## Ordner

| Ordner | Inhalt |
|---|---|
| `js/`, `css/` | Quellcode |
| `daten/` | Beispieldaten (`demo.json`) |
| `tools/` | Bau-Skripte |
| `dist/` | fertige Dateien |
| `docs/` | diese Dokumentation |
