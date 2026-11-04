# 03 Bedienung

Die Anwendung hat links eine Navigation mit drei Bereichen: **Vertrieb**, **Studio** und **Experte**. Alle Seiten funktionieren auch auf dem Tablet und dem Telefon.

## Vertrieb

### Übersicht
Kennzahlen zu offenen Angeboten, Angebotssumme, Aufrufen im Verkaufsraum der letzten 7 Tage und die zuletzt bearbeiteten Angebote.

### Katalog
Familien und Fahrzeuge als Kacheln mit „ab“-Preis (Preis der Standardkonfiguration). Familien ohne Fahrzeuge mit Codes werden nicht angezeigt. Ein Klick öffnet den Konfigurator.

### Konfigurator
- **Registerkarten** je ZZ-Überschrift, darin die Gruppen (YY).
- **Darstellung je Gruppe:** Kacheln, Liste, Dropdown oder Mehrfachauswahl, im Studio einstellbar.
- **Darstellung je Code nach Feldtyp:** Ja/Nein als Häkchen, Zahl mit Einheit und von/bis, Freitext als Eingabefeld. Feste Codes (GA) stehen als Grundausstattung dabei.
- **Gesperrte Codes** sind ausgegraut, der Grund (Regel) steht am Code. Ändert eine Regel automatisch etwas, erscheint ein Hinweis mit der Regel.
- **Preis oben** aktualisiert sich sofort. Je nach Einstellung sind Preisanteile je Code sichtbar.
- **360°-Ansicht**, wenn ein 3D-Modell hinterlegt ist, sonst ein Ersatzmodell.
- Aus dem Konfigurator heraus: **Angebot anlegen** oder eine Position in ein bestehendes Angebot übernehmen.

### Angebote
Liste mit Filter nach Status. Im Angebot:
- Kunde, Bearbeiter, Gültigkeit, Positionen, Rabatt.
- Nummer mit Kennzeichen „Nr. aus APplus“, wenn sie aus dem ERP kommt.
- Vorlage wählen, **Dokument ansehen**, **Drucken**, **PDF**.
- Status: Entwurf, Versendet, Angenommen, Abgelehnt.
- Link für den **Verkaufsraum**: Kundenansicht des Angebots. Aufrufe werden gezählt; die eigene Vorschau zählt nicht.

### Kunden
Kunden aus APplus (Abfrage `kunden`) oder lokal angelegt, mit Angeboten je Kunde.

## Studio

### Katalog aufbauen
Drei Spalten:
1. **Baum** mit Familien und Fahrzeugen. Familien und Fahrzeuge lassen sich per Drag & Drop verschieben und mit „+“ anlegen.
2. **Mitte**: das gewählte Fahrzeug bzw. die Familie.
   - Überschriften (ZZ) mit Gruppen (YY) und Codes.
   - Je Code ein Feldtyp-Auswahlfeld und ☆ für die Standardauswahl, bei Ja/Nein „vorab angekreuzt“.
   - Mit dem Abzeichen „AP“ markierte Codes kommen aus dem APplus-Stamm.
   - Ganze Code-Listen lassen sich einfügen (Code, Text, Preis, je Zeile). Die Gliederung entsteht dabei aus dem Codesystem.
   - Bei Familien: „gemeinsame Struktur hochziehen“, Gruppentyp je Gruppe.
3. **Artikel-Pool** rechts mit den Artikeln aus APplus.
   - Filter „alle / frei / benutzt“ und Suche.
   - Anhaken oder ziehen, um Codes zuzuordnen.
   - „Als Codes für die ganze Familie“ ordnet die Codes allen Fahrzeugen der Familie zu.

### Regeln
- **Liste:** Regeln „wenn Gruppe ist / ist nicht Code … dann sperrt / erlaubt nur / setzt …“ mit Hinweistext. Sie gelten für alle oder nur für bestimmte Familien und Fahrzeuge.
- **Matrix:** Paare von Gruppen mit erlaubten und gesperrten Kombinationen.
- **Kombinationstabelle:** nur die aufgeführten Kombinationen sind erlaubt.
- **Regelgraph:** zeigt, welche Gruppen sich gegenseitig beeinflussen.

### Excel-Import
- **Codes und Preise importieren** (Standard): eine Produktgruppe wählen und die Excel-Datei laden. Übernommen werden nur Codes und Preise dieser Gruppe, als Gruppenpreis.
- **Struktur importieren** (Experte): eine ganze Mappe einlesen, Spalten zuordnen, Vorschau ansehen, übernehmen.
- **Vorlage**: leere Excel-Vorlage mit Spalte „Feldtyp“.

### Modelltest
Prüft je Fahrzeug alle Kombinationen. Er meldet gültige Kombinationen, Widersprüche, nie wählbare Codes und Regeln, die nie greifen.

### Nach APplus
Erzeugt die Mappe für den APplus-Datenimport (dynamische Attribute, Regeln, Vertriebsstückliste).
- **Fahrzeugliste:** Name, Artikelnummer und Attributklasse sind änderbar. Bei einer geänderten Klasse erscheint ein Knopf zum Zurücksetzen. „Löschen“ fragt vorher nach.
- **Einstellungen:** Mandant, erste Regelnummer, Status der Attributgruppen, Spalten je Registerkarte, Artikel für Preisanteile, Vertriebsstückliste, Stückliste, Tabellen der Attributklasse.
- **Vorschau:** je Tabelle, mit Hinweisen zu allem, was in APplus von Hand nötig ist.

### Freigabe
Änderungen gegenüber der letzten Version, Notiz, „Version n veröffentlichen“ oder „Entwurf verwerfen“.

### Angebotsdesigner
- **Bausteine:** Briefkopf, Anschrift & Infoblock, Titel, Text, Positionen, Positionsübersicht, Summen, Bild, Tabelle, Gruß & Unterschrift, AGB, Stückliste, Abstand, Linie, Seitenumbruch.
- **Platzhalter** in doppelten geschweiften Klammern:
  - Kunde: `{{kunde.firma}}`, `{{kunde.person}}`, `{{kunde.strasse}}`, `{{kunde.ort}}`, `{{kunde.nr}}`
  - Angebot: `{{angebot.nr}}`, `{{angebot.datum}}`, `{{angebot.gueltig}}`, `{{angebot.netto}}`, `{{angebot.brutto}}`
  - Bearbeiter: `{{bearbeiter.name}}`, `{{bearbeiter.tel}}`, `{{bearbeiter.mail}}`
  - Firma: `{{firma.name}}`, `{{firma.strasse}}`, `{{firma.ort}}`, `{{firma.tel}}`, `{{firma.web}}`, `{{firma.ustid}}`
  - Datum: `{{heute}}`
- **Briefpapier-PDF** für die erste Seite und die Folgeseiten. Ränder getrennt für die erste Seite und ab Seite 2.
- **Zuordnung** einer Vorlage zu einer Produktfamilie.

### Einstellungen
- Firma, Mehrwertsteuer, Gültigkeit von Angeboten.
- **Nummern aus dem ERP:**
  - Quelle: eigener Zähler oder APplus.
  - Abfrage, Feld, Art (nächste freie oder höchste + 1), Ersatz bei Fehler, Test-Knopf.
- **Code-Kennzeichen** (Standard ZZ, YY, GA).
- Vertriebsmitarbeiter (oder Abfrage `vertrieb`).

### Protokoll
Alle Änderungen mit Zeit und Text, z. B. Freigaben, Importe, Umbenennungen und erzeugte APplus-Mappen.

## Experte
- **Produktmodell:** Familienbaum mit Vererbung der Gruppen und Preise.
- **Produkte:** Fahrzeuge mit Grundpreis, Kosten, Stückliste, 3D-Modell.
- **Merkmale:** Gruppen mit allen Codes. Hier lassen sich je Code Feldtyp, Preis, Kosten, Stücklistenzeilen, Farbe und 3D-Teil pflegen. Mit dem Häkchen „aus APplus“ übernehmen Name und Preis den Stamm.
