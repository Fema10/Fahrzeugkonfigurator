# Dokumentation Fahrzeugkonfigurator

Der Fahrzeugkonfigurator ist eine Vertriebsanwendung (CPQ: Configure, Price, Quote) für DOLL Fahrzeugbau. Er läuft als Dashboard innerhalb von APplus, nutzt dessen Stammdaten und gibt die fertige Produktstruktur als dynamische Attribute an APplus zurück.

| Dokument | Inhalt | Für wen |
|---|---|---|
| [01 Idee und Ziele](01-idee-und-ziele.md) | Warum es die Anwendung gibt, was sie leisten soll, Abgrenzung | alle |
| [02 Prozesse](02-prozesse.md) | Katalogpflege, Freigabe, Angebot, Übergabe an APplus, Rollen | Vertrieb, Produktmanagement, Leitung |
| [03 Bedienung](03-bedienung.md) | Alle Seiten im Vertrieb und im Studio, Schritt für Schritt | Anwender |
| [04 Codesystem und Katalog](04-codesystem-und-katalog.md) | ZZ/YY/GA-Codes, Feldtypen, Standardkonfiguration, Regeln, Preise | Produktmanagement |
| [05 APplus-Anbindung](05-applus-anbindung.md) | Abfragen, Nummern, dynamische Attribute, Datenimport | IT, APplus-Betreuung |
| [06 Architektur](06-architektur.md) | Module, Datenmodell, Datenhaltung, Bibliotheken | Entwicklung |
| [07 Betrieb und Entwicklung](07-betrieb-und-entwicklung.md) | Bauen, Testen, Einbinden, Ausrollen, Git-Ablauf | Entwicklung, IT |
| [08 Offene Punkte](08-offene-punkte.md) | Entscheidungen und Klärungen, die noch ausstehen | Projektleitung |

Begriffe, die häufig vorkommen:

| Begriff | Bedeutung |
|---|---|
| Vertriebscode | Artikel aus `ARTIKEL.ARTIKEL`, der eine wählbare oder feste Ausstattung beschreibt, z. B. `SW326` |
| Familie | Produktgruppe, z. B. „Logo 12“. Vererbt Struktur und Preise an ihre Fahrzeuge |
| Fahrzeug | konfigurierbarer Artikel, z. B. `H3S-12XL` |
| Entwurf / Version | Im Studio wird der Entwurf gepflegt; der Vertrieb sieht nur die freigegebene Version |
| Studio | Pflegebereich für Katalog, Regeln, Vorlagen und Einstellungen |
| Attributklasse | APplus-Gegenstück zu einem Fahrzeug bei den dynamischen Attributen |
