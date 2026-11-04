# 01 Idee und Ziele

## Ausgangslage

Angebote für Auflieger und Nachläufer entstehen heute aus Excel-Mappen mit Vertriebscodes, Preisen und Abhängigkeiten. Zu einem Fahrzeug gehören oft 50 bis 100 Codes. Die Mappen sind schwer konsistent zu halten, Abhängigkeiten stehen im Kopf der Verkäufer, und das Angebot wird von Hand in APplus oder Word übertragen. Dabei entstehen Medienbrüche: Codes, Preise und Nummern liegen an mehreren Stellen und laufen auseinander.

## Idee

Eine eigene Anwendung im Stil eines CPQ-Systems (vergleichbar encoway), die **innerhalb von APplus** läuft:

- Die Oberfläche ist eine App aus JavaScript und CSS, eingebettet in ein APplus-Dashboard.
- Die Daten kommen aus APplus (Artikelstamm, Kunden, Vertrieb, Nummernkreis) über Dashboard-Abfragen.
- Die Produktstruktur wird einmal sauber aufgebaut: Familien, Fahrzeuge, Überschriften, Gruppen, Codes, Feldtypen, Regeln und Preise.
- Der Vertrieb konfiguriert geführt, sieht sofort Preis und Konflikte und erzeugt ein gestaltetes Angebot auf dem Firmenbriefpapier.
- Die fertige Struktur geht als **dynamische Attribute** zurück nach APplus, damit Angebots- und Auftragspositionen dort dieselbe Konfiguration tragen.

## Ziele

1. **Eine Quelle je Information.** Code, Bezeichnung und Preis kommen aus dem APplus-Artikelstamm. Struktur und Regeln werden im Studio gepflegt. Nummern vergibt das ERP.
2. **Nur gültige Konfigurationen.** Regeln sperren, erlauben oder setzen Codes; der Konfigurator bereinigt automatisch und zeigt, warum.
3. **Schnelle Pflege.** Katalogaufbau per Drag & Drop, Codes aus der Artikelsuche anhaken, Codes und Preise aus Excel je Produktgruppe übernehmen, Struktur aus dem Codesystem (ZZ/YY) automatisch ableiten.
4. **Gute Angebote.** Angebotsdesigner mit Bausteinen, Briefpapier-PDF, Überschriften aus den ZZ-Codes, Vektor-PDF.
5. **Durchgängig bis in den Auftrag.** Übergabe an APplus als Attributklasse mit Regeln und Vertriebsstückliste.
6. **Nachvollziehbar.** Versionen mit Freigabe, Protokoll aller Änderungen, Modelltest vor der Freigabe.

## Abgrenzung

| Gehört dazu | Gehört nicht dazu |
|---|---|
| Produktstruktur, Regeln, Preise je Familie/Fahrzeug | Artikelstamm pflegen (bleibt in APplus) |
| Konfigurieren, Angebot gestalten, PDF | Auftragsabwicklung, Fertigung, Disposition |
| Übergabe als Datenimport-Mappe an APplus | direktes Schreiben in APplus-Tabellen per SQL |
| Kundenansicht „Verkaufsraum“ (Prototyp) | Webshop, Bezahlung |

## Nutzen

- Weniger Fehler im Angebot durch geprüfte Kombinationen und Preise aus dem Stamm.
- Kürzere Angebotszeit, einheitliches Erscheinungsbild.
- Wissen über Abhängigkeiten liegt im System statt bei Einzelnen.
- Dieselbe Konfiguration in Angebot, Auftrag und Stückliste.
