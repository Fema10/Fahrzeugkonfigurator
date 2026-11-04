# 08 Offene Punkte

Stand: 04.11.2026

## Entscheidungen

| # | Frage | Vorschlag | Status |
|---|---|---|---|
| 1 | Welches System führt die Produktstruktur? | Pflege im Studio, Übergabe als Datenimport nach APplus. Artikelstamm bleibt in APplus führend. | offen |
| 2 | Status der Attributgruppen beim Import | 2 (freigegeben), so ist es voreingestellt | offen |
| 3 | Namensschema | Attributklasse = Artikelnummer (max. 12 Zeichen), Attributgruppe = Klasse-ZZ-Code | offen |
| 4 | Gemeinsame Datenhaltung im Dashboard | Tabelle oder Webdienst in APplus zum Zurückschreiben von Katalog, Vorlagen und Angeboten | offen |
| 5 | Direkte Übertragung nach APplus statt Excel-Datenimport | Vorhandene ASMX in der APplus-Webanwendung, direkt per SQL, vorher Prüflauf mit Meldung; bei erneuter Übertragung nur ergänzen/ändern, nichts löschen | entschieden, wartet auf ASMX |

## Klärungen mit APplus / IT

1. **Abfrage KONF_ARTIKEL**: Feldnamen für Bezeichnung, VK-Preis, Herstellkosten und Sperre.
2. **Erkennung der Vertriebscodes**: über Artikelgruppe, Nummernmuster oder einen Kenner?
3. **Angebotsnummer**: Abfrage liest nur. Wird eine sichere Reservierung gebraucht (Webdienst/Skript)?
4. **Probeimport** auf einem Testmandanten:
   - Werden die Regelaktionen (SDRPOS) übernommen?
   - Akzeptiert der Parser `!=` und `>0`?
   - Passt die Vertriebsstückliste?
5. **Mengenpreise**: Script an der Vertriebsstücklistenposition für Zahl-Codes (z. B. Mehrlänge).
6. **Registerkarten mit mehr als 8 Attributen**: Systemkonfiguration anpassen oder Gruppen teilen.
7. **ASMX für die direkte Übertragung** (Rechte werden beschafft):
   - WSDL bzw. Methodenliste
   - Was die Methoden tun: freies SQL oder feste Methoden, Transaktion
   - Beispielaufruf aus einem bestehenden Dashboard
   - Lesezugriff per Abfrage auf SACHGRUPPENKLASSE, SACHGRUPPE, SACHGRUPPEPOS, SACHVORGABE, SACHWERTDLGREGEL, SDRPOS, VSTUELI, VSTUELIPOS

## Später

- Testskripte als `tests/` ins Repository übernehmen, mit einem Startbefehl.
- KONFIGOK-Attribut für vollständige Konfiguration.
- ARTIKEL automatisch aktualisieren (Attributklasse, HASVSTUELI).
- 3D-Modelle aus STEP nach GLB, Bauteilnamen = Feld „3D-Teil“.
- Verkaufsraum von außen erreichbar machen (Webserver/Reverse Proxy).
