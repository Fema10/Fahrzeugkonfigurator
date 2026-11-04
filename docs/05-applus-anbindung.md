# 05 APplus-Anbindung

Die Anwendung ist mit APplus auf zwei Wegen verbunden:

1. **Lesen**: Dashboard-Abfragen über `ViewQuery.aspx?name=<Abfrage>&xhr=json`.
2. **Zurückgeben**: Mappe für den APplus-Datenimport (dynamische Attribute, Regeln, Vertriebsstückliste).

Die Anwendung schreibt nicht direkt in die APplus-Datenbank.

## 1. Abfragen

Die Abfragenamen werden vor `konfigurator.js` eingetragen:

```html
<script>
window.KONF_CONFIG = {
  queries: { artikel: "KONF_ARTIKEL", kunden: "KONF_KUNDEN", vertrieb: "KONF_VERTRIEB", angebotsnummer: "KONF_ANGEBOTSNR" }
};
</script>
<script src="konfigurator.js"></script>
```

Spaltennamen werden automatisch erkannt. Groß- und Kleinschreibung spielt keine Rolle, mehrere Schreibweisen sind möglich.

### A) Stammdaten, für den Echtbetrieb nötig

| Eintrag | Vorschlag Name | Wofür | Spalten |
|---|---|---|---|
| `artikel` | KONF_ARTIKEL | Vertriebscodes, Fahrzeugnummern, Stücklistenteile | **ARTIKEL** (Pflicht), NAME/BEZEICHNUNG, VKPREIS/LISTENPREIS, HERSTELLKOSTEN/KOSTEN, ME, ARTIKELGRUPPE |
| `kunden` | KONF_KUNDEN | Kundenauswahl, Anschrift im Angebot | KUNDENNR/KUNDE/ADRESSE, FIRMA/NAME/NAME1, ANSPRECHPARTNER, STRASSE, PLZ, ORT, LAND, EMAIL, TELEFON |
| `vertrieb` | KONF_VERTRIEB | Bearbeiter im Angebot | PERSONAL/KUERZEL, VORNAME + NACHNAME oder NAME, TELEFON, EMAIL, FUNKTION |
| `angebotsnummer` | KONF_ANGEBOTSNR | Nummer aus dem ERP-Nummernkreis | eine Zeile, Feld NR (oder NUMMER/ANGEBOT) |

Die Vertriebscodes stehen in `ARTIKEL.ARTIKEL`. APplus ist führend für Bezeichnung, VK-Preis und Herstellkosten, solange am Code in der App nichts von Hand überschrieben wurde.

**Angebotsnummer:** Eine Abfrage liest nur, sie reserviert die Nummer nicht. Zwei gleichzeitige Angebote können deshalb dieselbe Nummer bekommen. Sicher wird es mit `KONF_CONFIG.angebotsnummer = async einst => "…"` und einem Webdienst oder Skript, das die Nummer im ERP reserviert.

### B) Produktstruktur aus APplus (optional)

Nur nötig, wenn die Struktur in APplus statt im Studio gepflegt wird. Dann ist APplus führend.

| Eintrag | Wofür | Spalten |
|---|---|---|
| `katalog` | Familien | GRUPPENCODE/CODE, GRUPPE/NAME, UEBERGEORDNET |
| `produkte` | Fahrzeuge | PRODUKTCODE/MODELL/CODE, BEZEICHNUNG, PRODUKTGRUPPE/FAMILIE, GRUNDPREIS, KOSTEN, ARTIKELNR, BESCHREIBUNG |
| `merkmale` | Gruppen (YY) | MERKMALCODE/CODE, MERKMAL/NAME, BEREICH, ABSCHNITT, AUSWAHLART/TYP, DARSTELLUNG, PFLICHT, INFO |
| `codes` | Codes mit Preis | VERTRIEBSCODE/CODE, MERKMAL, BEZEICHNUNG, PREIS, KOSTEN, FELDTYP, je Fahrzeug eine Spalte X/S |
| `regeln` | Abhängigkeiten | REGEL, WENN, TYP, DANN, GILT FÜR, HINWEIS, AKTIV |
| `stueckliste` | Stückliste je Code/Fahrzeug | CODE, ARTIKELNR, BEZEICHNUNG, MENGE, ME |

## 2. Übergabe als dynamische Attribute

Grundlagen:
- APplus 9, Funktionsbeschreibung „Dynamische Attribute“
- Asseco-Folien „Konfiguratoren mit APplus“
- Referenz-Datenimport „MWE Profischrauber“

Spaltenköpfe und Datentypen der Mappe sind aus der Referenz übernommen.

### Zuordnung

| App | APplus | Blatt im Datenimport |
|---|---|---|
| Fahrzeug | Attributklasse (max. 12 Zeichen) an SACHWERTINSTANZ, ARTIKEL, ANGEBOTPOS, AUFTRAGPOS, AUFSTUELIPOS, STUELIPOS, VSTUELI, RECHNUNGPOS, WARENAUSGANGPOS, WAUFTRAGPOS, APLANPOS | SACHGRUPPENKLASSENNAME, SACHGRUPPENKLASSE |
| ZZ-Überschrift | Attributgruppe „Klasse-ZZ-Code“ (max. 15 Zeichen) mit Registerkarte | SACHGRUPPE, SACHWERTREGISTER, SACHGRUPPENKLASSEPOS |
| YY-Gruppe mit Auswahl | Attribut CHAR, Name = YY-Code, Vorbelegung = Standardcode | SACHGRUPPEPOS |
| Codes der Auswahl | zulässige Werte `CODE:Bezeichnung` | SACHVORGABE |
| Ja/Nein, Mehrfach | Attribut BOOLEAN je Code | SACHGRUPPEPOS |
| Zahl | Attribut INT/DECIMAL mit Einheit, Min/Max | SACHGRUPPEPOS |
| Freitext | Attribut CHAR ohne Vorgabe | SACHGRUPPEPOS |
| fest (GA) | kein Attribut, Preisanteil ohne Bedingung | VSTUELIPOS |
| Regeln | Attributdialog-Regeln mit Aktionen | SACHWERTDLGREGEL, SDRPOS |
| Preise | Vertriebsstückliste, Position je Code mit VARIANTE-Bedingung | VSTUELI, VSTUELIPOS |
| Stücklistenzeilen (optional) | Stücklistenpositionen mit VARIANTE | STUELIPOS |

Zusatzblätter der Mappe:
- **Regelübersicht:** Bedingung, Herkunft und Aktionen jeder Regel, zum Erfassen von Hand.
- **Prüfliste:** je Fahrzeug Attributklasse und Anzahlen.
- **Hinweise:** was in APplus von Hand zu tun bleibt.

### Bedingungen und Aktionen

- Syntax: `ATTR=CODE`, `ATTR!=CODE`, Ja/Nein `CODE=1`, Zahl `CODE>0`; `+` bedeutet UND, `,` bedeutet ODER. ODER-Bedingungen werden in einzelne Regeln aufgelöst.
- **setzt** → `setValue`.
- **sperrt / erlaubt nur:** APplus kann einzelne Werte einer Auswahlliste nicht ausblenden, die Aktionen wirken auf das ganze Attribut. Deshalb:
  - Bleibt genau ein Code übrig: `setValue` und `disabled`.
  - Sonst entsteht je gesperrtem Code eine Regel „Bedingung + Attribut=Code“ mit `removeValue` und `warning`.
  - Ja/Nein- und Zahl-Codes: `setValue 0` und `disabled`.
- Regelnummern (SDR) sind 8-stellig, lückenlos ab einer einstellbaren Startnummer.

### Schritte in APplus nach dem Import

1. Mappe mit dem Datenimport einlesen.
2. Attributgruppen freigeben, falls Status 1 gewählt wurde.
3. Am Fahrzeugartikel die Attributklasse eintragen (für die Vertriebsstückliste HASVSTUELI).
4. Systemkonfiguration › Variantenkonfiguration › VariantenParserAdapter2. An der Attributklasse „Attributdialog Regeln aktiv“ setzen.
5. Regelaktionen (SDRPOS) prüfen. Laut Referenz werden sie ggf. nicht importiert und müssen dann nach der Regelübersicht von Hand erfasst werden.

### Grenzen

- Standardmäßig zeigt APplus 8 Attribute je Registerkarte (Systemkonfiguration › Attributwerte). Die App weist darauf hin.
- Mengenpreise (Zahl × Preis) brauchen ein Script an der Vertriebsstücklistenposition.
- Preise für Freitext-Codes werden nicht übertragen.
- Darstellung (Kacheln, Bilder, 3D) und Angebotsvorlagen bleiben in der App.

### Vererbung in APplus

Artikel → Angebotsposition → Auftragsposition → Auftragsstücklistenposition. Kopiert werden nur identische Attributgruppen.
