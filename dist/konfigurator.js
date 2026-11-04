/* =====================================================================
   Fahrzeugkonfigurator 2026-11-04
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
window.KONF_DEMO_DATEN = window.KONF_DEMO_DATEN || {
 "modell": {
  "version": 1,
  "gruppen": [
   {
    "id": "schwer",
    "name": "Schwertransport",
    "eltern": null,
    "merkmale": [
     {
      "id": "achsen",
      "werte": null
     },
     {
      "id": "lenkung",
      "werte": null
     },
     {
      "id": "federung",
      "werte": null
     },
     {
      "id": "reifen",
      "werte": null
     },
     {
      "id": "ladeflaeche",
      "werte": null
     },
     {
      "id": "breite",
      "werte": null
     },
     {
      "id": "rampen",
      "werte": null
     },
     {
      "id": "farbe",
      "werte": null
     },
     {
      "id": "zubehoer",
      "werte": null
     }
    ]
   },
   {
    "id": "tieflader",
    "name": "Tiefbett-Sattelauflieger",
    "eltern": "schwer",
    "merkmale": [
     {
      "id": "achsen",
      "werte": [
       "a3",
       "a4",
       "a5",
       "a6"
      ]
     },
     {
      "id": "ladeflaeche",
      "werte": [
       "l9000",
       "tele"
      ]
     },
     {
      "id": "hals",
      "werte": null
     },
     {
      "id": "rampen",
      "werte": [
       "keine",
       "hydr"
      ]
     }
    ],
    "reihenfolge": [
     "achsen",
     "lenkung",
     "federung",
     "reifen",
     "ladeflaeche",
     "breite",
     "hals",
     "rampen",
     "farbe",
     "zubehoer"
    ],
    "artikelgruppe": "FZ-TB"
   },
   {
    "id": "semi",
    "name": "Semi-Sattelauflieger",
    "eltern": "schwer",
    "merkmale": [
     {
      "id": "achsen",
      "werte": [
       "a2",
       "a3",
       "a4"
      ]
     }
    ]
   },
   {
    "id": "plattform",
    "name": "Plattform-Sattelauflieger",
    "eltern": "schwer",
    "merkmale": [
     {
      "id": "achsen",
      "werte": [
       "a2",
       "a3"
      ]
     },
     {
      "id": "lenkung",
      "werte": [
       "starr",
       "zwang"
      ]
     },
     {
      "id": "federung",
      "werte": [
       "luft"
      ]
     },
     {
      "id": "breite",
      "werte": [
       "b2550",
       "b2750"
      ]
     },
     {
      "id": "rampen",
      "werte": [
       "keine",
       "mech"
      ]
     },
     {
      "id": "zubehoer",
      "werte": [
       "zurr",
       "rungtaschen",
       "achslift",
       "led",
       "kiste"
      ]
     }
    ]
   },
   {
    "id": "holz",
    "name": "Holztransport",
    "eltern": null,
    "merkmale": [
     {
      "id": "achsen",
      "werte": [
       "a2",
       "a3"
      ]
     },
     {
      "id": "lenkung",
      "werte": [
       "starr",
       "zwang"
      ]
     },
     {
      "id": "reifen",
      "werte": null
     },
     {
      "id": "rungen",
      "werte": null
     },
     {
      "id": "farbe",
      "werte": null
     },
     {
      "id": "zubehoer",
      "werte": [
       "achslift",
       "led",
       "kiste"
      ]
     }
    ]
   },
   {
    "id": "nachlaeufer",
    "name": "Nachläufer-Kombination",
    "eltern": "holz",
    "merkmale": []
   }
  ],
  "merkmale": [
   {
    "id": "achsen",
    "name": "Achsanzahl",
    "abschnitt": "Fahrwerk",
    "typ": "einfach",
    "werte": [
     {
      "id": "a2",
      "name": "2 Achsen",
      "preis": 0,
      "kosten": 0,
      "menge": 2,
      "teil": "achsen_2",
      "stl": [
       [
        "AC-10T-100",
        "Achsaggregat 10 t, Scheibenbremse",
        2,
        "Stk"
       ]
      ],
      "code": "A2"
     },
     {
      "id": "a3",
      "name": "3 Achsen",
      "preis": 6800,
      "kosten": 4900,
      "menge": 3,
      "teil": "achsen_3",
      "stl": [
       [
        "AC-10T-100",
        "Achsaggregat 10 t, Scheibenbremse",
        3,
        "Stk"
       ]
      ],
      "code": "A3"
     },
     {
      "id": "a4",
      "name": "4 Achsen",
      "preis": 14500,
      "kosten": 10400,
      "menge": 4,
      "teil": "achsen_4",
      "stl": [
       [
        "AC-10T-100",
        "Achsaggregat 10 t, Scheibenbremse",
        4,
        "Stk"
       ]
      ],
      "code": "A4"
     },
     {
      "id": "a5",
      "name": "5 Achsen",
      "preis": 23800,
      "kosten": 17100,
      "menge": 5,
      "teil": "achsen_5",
      "stl": [
       [
        "AC-10T-100",
        "Achsaggregat 10 t, Scheibenbremse",
        5,
        "Stk"
       ]
      ],
      "code": "A5"
     },
     {
      "id": "a6",
      "name": "6 Achsen",
      "preis": 33500,
      "kosten": 24100,
      "menge": 6,
      "teil": "achsen_6",
      "stl": [
       [
        "AC-10T-100",
        "Achsaggregat 10 t, Scheibenbremse",
        6,
        "Stk"
       ]
      ],
      "code": "A6"
     }
    ],
    "darstellung": "kacheln",
    "katalogfilter": true,
    "code": "ACH",
    "info": "Anzahl der Achsen im Achsaggregat",
    "bereich": "Grundmaschine"
   },
   {
    "id": "lenkung",
    "name": "Lenkung",
    "abschnitt": "Fahrwerk",
    "typ": "einfach",
    "werte": [
     {
      "id": "starr",
      "name": "Starrachsen",
      "preis": 0,
      "kosten": 0,
      "teil": "lenkung_starr",
      "stl": [],
      "code": "L0"
     },
     {
      "id": "zwang",
      "name": "Zwangslenkung mechanisch",
      "preis": 8900,
      "kosten": 6200,
      "teil": "lenkung_zwang",
      "stl": [
       [
        "LK-ZW-100",
        "Zwangslenkung mit Drehschemelabnahme",
        1,
        "Satz"
       ]
      ],
      "code": "LZM"
     },
     {
      "id": "hydr",
      "name": "Hydraulische Zwangslenkung",
      "preis": 18500,
      "kosten": 12900,
      "teil": "lenkung_hydr",
      "stl": [
       [
        "LK-HY-200",
        "Lenkhydraulik komplett",
        1,
        "Satz"
       ],
       [
        "LK-HY-210",
        "Lenkzylinder",
        2,
        "Stk"
       ]
      ],
      "code": "LZH"
     }
    ],
    "darstellung": "liste",
    "code": "LNK",
    "bereich": "Grundmaschine"
   },
   {
    "id": "federung",
    "name": "Federung",
    "abschnitt": "Fahrwerk",
    "typ": "einfach",
    "multiplikator": "achsen",
    "werte": [
     {
      "id": "luft",
      "name": "Luftfederung",
      "preis": 0,
      "kosten": 0,
      "stl": [
       [
        "FE-LU-010",
        "Luftfederbalg",
        2,
        "Stk"
       ]
      ],
      "code": "FL"
     },
     {
      "id": "hydro",
      "name": "Hydraulische Pendelachsen, Hub 300 mm",
      "preis": 4200,
      "kosten": 3000,
      "teil": "pendel",
      "stl": [
       [
        "FE-HP-020",
        "Pendelachse hydraulisch",
        2,
        "Stk"
       ]
      ],
      "code": "FPH"
     }
    ],
    "darstellung": "liste",
    "code": "FED",
    "bereich": "Grundmaschine"
   },
   {
    "id": "reifen",
    "name": "Bereifung",
    "abschnitt": "Fahrwerk",
    "typ": "einfach",
    "multiplikator": "achsen",
    "werte": [
     {
      "id": "r175",
      "name": "235/75 R17,5 zwillingsbereift",
      "preis": 0,
      "kosten": 0,
      "stl": [
       [
        "RF-175-235",
        "Kompletrad 235/75 R17,5",
        4,
        "Stk"
       ]
      ],
      "code": "R175"
     },
     {
      "id": "r195",
      "name": "245/70 R19,5 zwillingsbereift",
      "preis": 380,
      "kosten": 260,
      "stl": [
       [
        "RF-195-245",
        "Kompletrad 245/70 R19,5",
        4,
        "Stk"
       ]
      ],
      "code": "R195"
     },
     {
      "id": "r225",
      "name": "385/65 R22,5 Super Single",
      "preis": 720,
      "kosten": 500,
      "stl": [
       [
        "RF-225-385",
        "Kompletrad 385/65 R22,5",
        2,
        "Stk"
       ]
      ],
      "code": "R225"
     }
    ],
    "darstellung": "auswahl",
    "code": "BER",
    "bereich": "Grundmaschine"
   },
   {
    "id": "ladeflaeche",
    "name": "Ladefläche",
    "abschnitt": "Tiefbett-Plattform",
    "typ": "einfach",
    "werte": [
     {
      "id": "l9000",
      "name": "9.000 mm",
      "preis": 0,
      "kosten": 0,
      "stl": [
       [
        "BO-HZ-090",
        "Hartholzboden 50 mm, 9 m",
        1,
        "Satz"
       ]
      ],
      "code": "LF090"
     },
     {
      "id": "l11500",
      "name": "11.500 mm",
      "preis": 3200,
      "kosten": 2300,
      "stl": [
       [
        "BO-HZ-115",
        "Hartholzboden 50 mm, 11,5 m",
        1,
        "Satz"
       ]
      ],
      "code": "LF115"
     },
     {
      "id": "tele",
      "name": "9.000 mm, teleskopierbar auf 15.000 mm",
      "preis": 12900,
      "kosten": 9100,
      "teil": "teleskop",
      "stl": [
       [
        "BO-HZ-090",
        "Hartholzboden 50 mm, 9 m",
        1,
        "Satz"
       ],
       [
        "RA-TE-600",
        "Teleskopauszug 6 m",
        1,
        "Stk"
       ]
      ],
      "code": "LFT150"
     }
    ],
    "darstellung": "auswahl",
    "pflicht": true,
    "code": "LAD",
    "bereich": "Grundmaschine"
   },
   {
    "id": "breite",
    "name": "Breite",
    "abschnitt": "Tiefbett-Plattform",
    "typ": "einfach",
    "werte": [
     {
      "id": "b2550",
      "name": "2.550 mm",
      "preis": 0,
      "kosten": 0,
      "stl": [],
      "code": "B255"
     },
     {
      "id": "b2750",
      "name": "2.750 mm",
      "preis": 900,
      "kosten": 600,
      "stl": [
       [
        "RA-BR-275",
        "Außenrahmen 2.750 mm",
        1,
        "Satz"
       ]
      ],
      "code": "B275"
     },
     {
      "id": "b3300",
      "name": "Verbreiterbar auf 3.300 mm",
      "preis": 4600,
      "kosten": 3100,
      "teil": "verbreiterung",
      "stl": [
       [
        "RA-VB-330",
        "Ausziehbare Verbreiterung",
        8,
        "Stk"
       ]
      ],
      "code": "B330V"
     }
    ],
    "darstellung": "liste",
    "code": "BRT",
    "bereich": "Grundmaschine"
   },
   {
    "id": "hals",
    "name": "Schwanenhals",
    "abschnitt": "Schwanenhals-Typ",
    "typ": "einfach",
    "werte": [
     {
      "id": "fest",
      "name": "Fest",
      "preis": 0,
      "kosten": 0,
      "stl": [],
      "code": "SH-F"
     },
     {
      "id": "abnehmbar",
      "name": "Hydraulisch abnehmbar",
      "preis": 16800,
      "kosten": 11900,
      "teil": "hals_abnehmbar",
      "stl": [
       [
        "HA-HY-300",
        "Abnehmbarer Schwanenhals, hydraulisch",
        1,
        "Stk"
       ],
       [
        "HY-AG-050",
        "Hydraulikaggregat 5,5 kW",
        1,
        "Stk"
       ]
      ],
      "code": "SH-AH"
     }
    ],
    "darstellung": "kacheln",
    "pflicht": true,
    "code": "SHT",
    "info": "Fest oder hydraulisch abnehmbar für Beladung von vorn",
    "bereich": "Grundmaschine"
   },
   {
    "id": "rampen",
    "name": "Auffahrrampen",
    "abschnitt": "Heck",
    "typ": "einfach",
    "werte": [
     {
      "id": "keine",
      "name": "Keine",
      "preis": 0,
      "kosten": 0,
      "stl": [],
      "code": "RA0"
     },
     {
      "id": "mech",
      "name": "Mechanisch klappbar",
      "preis": 2900,
      "kosten": 1900,
      "teil": "rampen",
      "stl": [
       [
        "RP-ME-220",
        "Auffahrrampe 2,2 m, federunterstützt",
        2,
        "Stk"
       ]
      ],
      "code": "RAM"
     },
     {
      "id": "hydr",
      "name": "Hydraulisch klappbar",
      "preis": 6400,
      "kosten": 4300,
      "teil": "rampen_hydr",
      "stl": [
       [
        "RP-HY-220",
        "Auffahrrampe 2,2 m, hydraulisch",
        2,
        "Stk"
       ],
       [
        "HY-ZY-080",
        "Hydraulikzylinder Rampe",
        2,
        "Stk"
       ]
      ],
      "code": "RAH"
     },
     {
      "id": "hydrv",
      "name": "Hydraulisch, seitlich verschiebbar",
      "preis": 8900,
      "kosten": 6100,
      "teil": "rampen_verschiebbar",
      "stl": [
       [
        "RP-HY-220",
        "Auffahrrampe 2,2 m, hydraulisch",
        2,
        "Stk"
       ],
       [
        "HY-ZY-080",
        "Hydraulikzylinder Rampe",
        2,
        "Stk"
       ],
       [
        "RP-VS-010",
        "Verschiebeeinrichtung",
        1,
        "Stk"
       ]
      ],
      "code": "RAHV",
      "info": "Rampen lassen sich seitlich verschieben, für Maschinen mit schmaler Spur"
     }
    ],
    "darstellung": "kacheln",
    "code": "RMP",
    "bereich": "Grundmaschine"
   },
   {
    "id": "rungen",
    "name": "Rungenpaare",
    "abschnitt": "Holzaufbau",
    "typ": "einfach",
    "werte": [
     {
      "id": "rp2",
      "name": "2 Rungenpaare",
      "preis": 0,
      "kosten": 0,
      "stl": [
       [
        "RU-HO-180",
        "Rungenpaar 1.800 mm",
        2,
        "Stk"
       ]
      ],
      "code": "RP2"
     },
     {
      "id": "rp3",
      "name": "3 Rungenpaare",
      "preis": 1450,
      "kosten": 980,
      "stl": [
       [
        "RU-HO-180",
        "Rungenpaar 1.800 mm",
        3,
        "Stk"
       ]
      ],
      "code": "RP3"
     },
     {
      "id": "rp4",
      "name": "4 Rungenpaare",
      "preis": 2900,
      "kosten": 1960,
      "stl": [
       [
        "RU-HO-180",
        "Rungenpaar 1.800 mm",
        4,
        "Stk"
       ]
      ],
      "code": "RP4"
     }
    ],
    "darstellung": "liste",
    "code": "RNG",
    "bereich": "Grundmaschine"
   },
   {
    "id": "farbe",
    "name": "Farbe",
    "abschnitt": "Lackierung",
    "typ": "einfach",
    "werte": [
     {
      "id": "r9005",
      "name": "RAL 9005 Tiefschwarz",
      "preis": 0,
      "kosten": 0,
      "hex": "#141416",
      "stl": [
       [
        "LA-9005",
        "Lackierung RAL 9005",
        1,
        "Satz"
       ]
      ],
      "code": "RAL9005"
     },
     {
      "id": "r3000",
      "name": "RAL 3000 Feuerrot",
      "preis": 0,
      "kosten": 0,
      "hex": "#AF2B1E",
      "stl": [
       [
        "LA-3000",
        "Lackierung RAL 3000",
        1,
        "Satz"
       ]
      ],
      "code": "RAL3000"
     },
     {
      "id": "r5010",
      "name": "RAL 5010 Enzianblau",
      "preis": 0,
      "kosten": 0,
      "hex": "#0E4C92",
      "stl": [
       [
        "LA-5010",
        "Lackierung RAL 5010",
        1,
        "Satz"
       ]
      ],
      "code": "RAL5010"
     },
     {
      "id": "r7016",
      "name": "RAL 7016 Anthrazitgrau",
      "preis": 0,
      "kosten": 0,
      "hex": "#383E42",
      "stl": [
       [
        "LA-7016",
        "Lackierung RAL 7016",
        1,
        "Satz"
       ]
      ],
      "code": "RAL7016"
     },
     {
      "id": "r1028",
      "name": "RAL 1028 Melonengelb",
      "preis": 650,
      "kosten": 420,
      "hex": "#F4A900",
      "stl": [
       [
        "LA-1028",
        "Lackierung RAL 1028",
        1,
        "Satz"
       ]
      ],
      "code": "RAL1028"
     }
    ],
    "darstellung": "kacheln",
    "bereich": "Optionen",
    "code": "LCK"
   },
   {
    "id": "zubehoer",
    "name": "Ausstattung",
    "abschnitt": "Ausstattung",
    "typ": "mehrfach",
    "werte": [
     {
      "id": "zurr",
      "name": "Zurrpunkte 10 t, 20 Stück",
      "preis": 1150,
      "kosten": 690,
      "stl": [
       [
        "ZU-ZP-100",
        "Zurrpunkt 10 t",
        20,
        "Stk"
       ]
      ],
      "code": "Z-ZP20"
     },
     {
      "id": "rungtaschen",
      "name": "Rungentaschen mit 10 Stahlrungen",
      "preis": 1900,
      "kosten": 1200,
      "teil": "rungen_seite",
      "stl": [
       [
        "ZU-RT-010",
        "Rungentasche",
        10,
        "Stk"
       ],
       [
        "ZU-RS-080",
        "Stahlrunge 800 mm",
        10,
        "Stk"
       ]
      ],
      "code": "Z-RT10"
     },
     {
      "id": "winde",
      "name": "Seilwinde 12 t",
      "preis": 6900,
      "kosten": 4800,
      "teil": "winde",
      "stl": [
       [
        "ZU-SW-120",
        "Seilwinde hydraulisch 12 t",
        1,
        "Stk"
       ]
      ],
      "code": "Z-SW12"
     },
     {
      "id": "achslift",
      "name": "Achslift 1. Achse",
      "preis": 1600,
      "kosten": 1050,
      "teil": "achslift",
      "stl": [
       [
        "ZU-AL-001",
        "Achslifteinrichtung",
        1,
        "Stk"
       ]
      ],
      "code": "Z-AL1"
     },
     {
      "id": "led",
      "name": "LED-Beleuchtung komplett",
      "preis": 980,
      "kosten": 610,
      "teil": "led",
      "stl": [
       [
        "EL-LED-100",
        "LED-Leuchtenpaket",
        1,
        "Satz"
       ]
      ],
      "code": "Z-LED"
     },
     {
      "id": "stuetz",
      "name": "Hydraulische Stützfüße",
      "preis": 3400,
      "kosten": 2350,
      "teil": "stuetzfuesse",
      "stl": [
       [
        "ZU-SF-200",
        "Stützfuß hydraulisch",
        2,
        "Stk"
       ]
      ],
      "code": "Z-SFH"
     },
     {
      "id": "kiste",
      "name": "Werkzeugkasten",
      "preis": 420,
      "kosten": 240,
      "teil": "werkzeugkasten",
      "stl": [
       [
        "ZU-WK-060",
        "Werkzeugkasten 600 mm",
        1,
        "Stk"
       ]
      ],
      "code": "Z-WK"
     }
    ],
    "darstellung": "option",
    "bereich": "Optionen",
    "code": "ZUB"
   }
  ],
  "produkte": [
   {
    "id": "ST",
    "name": "Semitieflader ST",
    "gruppe": "semi",
    "artnr": "FZ-ST-000",
    "basispreis": 48900,
    "basiskosten": 35600,
    "aktiv": true,
    "beschreibung": "Für Baumaschinen und Stapler bis 40 t. Niedrige Ladehöhe, Auffahrt über das Heck.",
    "visual": {
     "typ": "semi",
     "asset": null
    },
    "stl": [
     [
      "RA-ST-100",
      "Rahmen Semitieflader, geschweißt",
      1,
      "Stk"
     ],
     [
      "KP-200",
      "Königszapfen 2\"",
      1,
      "Stk"
     ],
     [
      "EL-24-100",
      "Elektrik 24 V Grundausstattung",
      1,
      "Satz"
     ],
     [
      "MO-ST-001",
      "Montage und Endabnahme",
      38,
      "h"
     ]
    ],
    "merkmale": [],
    "code": "SEMI_ST3_S3F"
   },
   {
    "id": "TB",
    "name": "Tiefbett-Auflieger TB",
    "gruppe": "tieflader",
    "artnr": "FZ-TB-000",
    "basispreis": 79500,
    "basiskosten": 58200,
    "aktiv": true,
    "beschreibung": "Für hohe Maschinen und Transformatoren. Tiefbett mit 450 mm Ladehöhe.",
    "visual": {
     "typ": "tiefbett",
     "asset": null
    },
    "stl": [
     [
      "RA-TB-100",
      "Rahmen Tiefbett, geschweißt",
      1,
      "Stk"
     ],
     [
      "KP-350",
      "Königszapfen 3,5\"",
      1,
      "Stk"
     ],
     [
      "EL-24-100",
      "Elektrik 24 V Grundausstattung",
      1,
      "Satz"
     ],
     [
      "MO-TB-001",
      "Montage und Endabnahme",
      64,
      "h"
     ]
    ],
    "merkmale": [],
    "code": "TB_T4P_S3F"
   },
   {
    "id": "TB3",
    "name": "Tiefbett-Auflieger TB 3",
    "gruppe": "tieflader",
    "artnr": "FZ-TB-000",
    "basispreis": 71900,
    "basiskosten": 52800,
    "aktiv": true,
    "beschreibung": "Dreiachsige Tiefbett-Ausführung für Baumaschinen bis 45 t.",
    "visual": {
     "typ": "tiefbett",
     "asset": null
    },
    "stl": [
     [
      "RA-TB-100",
      "Rahmen Tiefbett, geschweißt",
      1,
      "Stk"
     ],
     [
      "KP-350",
      "Königszapfen 3,5\"",
      1,
      "Stk"
     ],
     [
      "EL-24-100",
      "Elektrik 24 V Grundausstattung",
      1,
      "Satz"
     ],
     [
      "MO-TB-001",
      "Montage und Endabnahme",
      64,
      "h"
     ]
    ],
    "merkmale": [
     {
      "id": "achsen",
      "werte": [
       "a3"
      ]
     }
    ],
    "code": "TB_T3P_S3F"
   },
   {
    "id": "PA",
    "name": "Plattform-Auflieger PA",
    "gruppe": "plattform",
    "artnr": "FZ-PA-000",
    "basispreis": 36500,
    "basiskosten": 26900,
    "aktiv": true,
    "beschreibung": "Ebene Ladefläche für Stahl, Betonfertigteile und Langgut.",
    "visual": {
     "typ": "plattform",
     "asset": null
    },
    "stl": [
     [
      "RA-PA-100",
      "Rahmen Plattform, geschweißt",
      1,
      "Stk"
     ],
     [
      "KP-200",
      "Königszapfen 2\"",
      1,
      "Stk"
     ],
     [
      "EL-24-100",
      "Elektrik 24 V Grundausstattung",
      1,
      "Satz"
     ],
     [
      "MO-PA-001",
      "Montage und Endabnahme",
      30,
      "h"
     ]
    ],
    "merkmale": [],
    "code": "PLAT_PA2_FL"
   },
   {
    "id": "LN",
    "name": "Langholz-Nachläufer LN",
    "gruppe": "nachlaeufer",
    "artnr": "FZ-LN-000",
    "basispreis": 29800,
    "basiskosten": 21400,
    "aktiv": true,
    "beschreibung": "Teleskopierbarer Nachläufer für Langholz bis 32 m Gesamtlänge.",
    "visual": {
     "typ": "nachlaeufer",
     "asset": null
    },
    "stl": [
     [
      "RA-LN-100",
      "Teleskoprohr mit Drehschemel",
      1,
      "Stk"
     ],
     [
      "EL-24-100",
      "Elektrik 24 V Grundausstattung",
      1,
      "Satz"
     ],
     [
      "MO-LN-001",
      "Montage und Endabnahme",
      22,
      "h"
     ]
    ],
    "merkmale": [],
    "code": "NL_LN2_T"
   }
  ],
  "regeln": [
   {
    "id": "R01",
    "name": "Pendelachsen brauchen Hydrauliklenkung",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "federung",
      "op": "ist",
      "werte": [
       "hydro"
      ]
     }
    ],
    "dann": {
     "typ": "nurErlauben",
     "merkmal": "lenkung",
     "werte": [
      "hydr"
     ]
    },
    "hinweis": "Pendelachsen werden immer mit hydraulischer Zwangslenkung ausgeliefert."
   },
   {
    "id": "R02",
    "name": "Ab 5 Achsen keine Starrachsen",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "achsen",
      "op": "ist",
      "werte": [
       "a5",
       "a6"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "lenkung",
     "werte": [
      "starr"
     ]
    },
    "hinweis": "Mit 5 oder 6 Achsen ist der Reifenverschleiß ohne Lenkung zu hoch."
   },
   {
    "id": "R03",
    "name": "Pendelachsen nur mit 17,5 Zoll",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "federung",
      "op": "ist",
      "werte": [
       "hydro"
      ]
     }
    ],
    "dann": {
     "typ": "nurErlauben",
     "merkmal": "reifen",
     "werte": [
      "r175"
     ]
    },
    "hinweis": "Pendelachsen sind für 17,5\"-Bereifung ausgelegt."
   },
   {
    "id": "R04",
    "name": "Teleskop ohne verschiebbare Rampen",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "ladeflaeche",
      "op": "ist",
      "werte": [
       "tele"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "rampen",
     "werte": [
      "hydrv"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R05",
    "name": "Abnehmbarer Hals: Beladung von vorn",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "hals",
      "op": "ist",
      "werte": [
       "abnehmbar"
      ]
     }
    ],
    "dann": {
     "typ": "nurErlauben",
     "merkmal": "rampen",
     "werte": [
      "keine"
     ]
    },
    "hinweis": "Mit abnehmbarem Schwanenhals wird von vorn beladen, Heckrampen entfallen.",
    "gruppen": [
     "tieflader"
    ]
   },
   {
    "id": "R06",
    "name": "Seilwinde nur mit festem Hals",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "hals",
      "op": "ist",
      "werte": [
       "abnehmbar"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "zubehoer",
     "werte": [
      "winde"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R07",
    "name": "Verbreiterung erst ab 3 Achsen",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "achsen",
      "op": "ist",
      "werte": [
       "a2"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "breite",
     "werte": [
      "b3300"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R08",
    "name": "Achslift nur mit Luftfederung",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "federung",
      "op": "ist",
      "werte": [
       "hydro"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "zubehoer",
     "werte": [
      "achslift"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R09",
    "name": "4 Rungenpaare brauchen 3 Achsen",
    "aktiv": true,
    "produkte": [
     "LN"
    ],
    "wenn": [
     {
      "merkmal": "achsen",
      "op": "ist",
      "werte": [
       "a2"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "rungen",
     "werte": [
      "rp4"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R10",
    "name": "Achslift ab 3 Achsen",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "achsen",
      "op": "ist",
      "werte": [
       "a2"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "zubehoer",
     "werte": [
      "achslift"
     ]
    },
    "hinweis": ""
   },
   {
    "id": "R11",
    "name": "Melonengelb nur für Schwerlast (Entwurf)",
    "aktiv": false,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "achsen",
      "op": "ist",
      "werte": [
       "a2",
       "a3"
      ]
     }
    ],
    "dann": {
     "typ": "sperren",
     "merkmal": "farbe",
     "werte": [
      "r1028"
     ]
    },
    "hinweis": "Noch nicht abgestimmt."
   },
   {
    "id": "T01",
    "name": "Bereifung nach Achsanzahl",
    "aktiv": true,
    "typ": "tabelle",
    "produkte": [],
    "gruppen": [
     "tieflader"
    ],
    "tabelle": {
     "merkmale": [
      "achsen",
      "reifen"
     ],
     "zeilen": [
      [
       "a3",
       "r175"
      ],
      [
       "a3",
       "r195"
      ],
      [
       "a3",
       "r225"
      ],
      [
       "a4",
       "r175"
      ],
      [
       "a4",
       "r195"
      ],
      [
       "a4",
       "r225"
      ],
      [
       "a5",
       "r175"
      ],
      [
       "a6",
       "r175"
      ]
     ]
    }
   },
   {
    "id": "R12",
    "name": "Abnehmbarer Hals braucht Stützfüße",
    "aktiv": true,
    "produkte": [],
    "wenn": [
     {
      "merkmal": "hals",
      "op": "ist",
      "werte": [
       "abnehmbar"
      ]
     }
    ],
    "dann": {
     "typ": "setzen",
     "merkmal": "zubehoer",
     "werte": [
      "stuetz"
     ]
    },
    "hinweis": "Zum Abkuppeln des Schwanenhalses werden hydraulische Stützfüße benötigt."
   }
  ]
 },
 "einstellungen": {
  "firma": {
   "name": "Muster Fahrzeugbau GmbH",
   "strasse": "Industriestraße 12",
   "ort": "77656 Musterstadt",
   "tel": "+49 781 000 00-0",
   "web": "www.muster-fahrzeugbau.example",
   "ustid": "DE000000000"
  },
  "vertrieb": [
   {
    "id": "v1",
    "name": "Jana Weber",
    "tel": "+49 781 000 00-21",
    "mail": "j.weber@muster-fahrzeugbau.example"
   },
   {
    "id": "v2",
    "name": "Markus Hahn",
    "tel": "+49 781 000 00-24",
    "mail": "m.hahn@muster-fahrzeugbau.example"
   }
  ],
  "mwst": 19,
  "praefix": "AN-2026-",
  "naechsteNr": 1047,
  "gueltigTage": 30,
  "vorlage": {
   "einleitung": "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
   "lieferung": "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
   "zahlung": "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
   "gewaehrleistung": "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
   "schluss": "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
   "zeigeMerkmalpreise": true,
   "zeigeBild": true,
   "zeigeStueckliste": false
  }
 },
 "kunden": [
  {
   "id": "k10231",
   "nr": "10231",
   "firma": "Brenner Logistik GmbH",
   "person": "Herr Tobias Brenner",
   "strasse": "Hafenstraße 8",
   "ort": "77694 Kehl",
   "land": "DE",
   "mail": "t.brenner@brenner-logistik.example",
   "tel": "+49 7851 000 11",
   "notiz": "Rahmenvertrag Wartung bis 2027."
  },
  {
   "id": "k10457",
   "nr": "10457",
   "firma": "Kaiser Kran & Schwertransporte GmbH",
   "person": "Frau Melanie Kaiser",
   "strasse": "Werkstraße 3",
   "ort": "77933 Lahr",
   "land": "DE",
   "mail": "m.kaiser@kaiser-schwertransporte.example",
   "tel": "+49 7821 000 22",
   "notiz": "Flotte: 14 Tieflader, Ersatz 2027 geplant."
  },
  {
   "id": "k10512",
   "nr": "10512",
   "firma": "Forstbetrieb Hofmann KG",
   "person": "Herr Stefan Hofmann",
   "strasse": "Waldweg 21",
   "ort": "77709 Wolfach",
   "land": "DE",
   "mail": "s.hofmann@forst-hofmann.example",
   "tel": "+49 7834 000 33",
   "notiz": ""
  },
  {
   "id": "k10603",
   "nr": "10603",
   "firma": "Bauunternehmung Ruf GmbH & Co. KG",
   "person": "Herr Daniel Ruf",
   "strasse": "Gewerbepark 5",
   "ort": "79098 Freiburg",
   "land": "DE",
   "mail": "d.ruf@ruf-bau.example",
   "tel": "+49 761 000 44",
   "notiz": ""
  },
  {
   "id": "k10688",
   "nr": "10688",
   "firma": "Nordsee Anlagenbau AG",
   "person": "Frau Ines Petersen",
   "strasse": "Am Kai 14",
   "ort": "26382 Wilhelmshaven",
   "land": "DE",
   "mail": "i.petersen@nordsee-anlagenbau.example",
   "tel": "+49 4421 000 55",
   "notiz": "Projekt Umspannwerk, Transformatoren bis 120 t."
  }
 ],
 "angebote": [
  {
   "nr": "AN-2026-1043",
   "kundeId": "k10457",
   "kunde": {
    "firma": "Kaiser Kran & Schwertransporte GmbH",
    "person": "Frau Melanie Kaiser",
    "strasse": "Werkstraße 3",
    "ort": "77933 Lahr",
    "mail": "m.kaiser@kaiser-schwertransporte.example"
   },
   "bearbeiter": "v1",
   "erstellt": 1792931508092,
   "gueltig": 1795523508092,
   "status": "versendet",
   "positionen": [
    {
     "typ": "konfig",
     "produkt": "ST",
     "produktName": "Semitieflader ST",
     "sel": {
      "achsen": "a3",
      "lenkung": "zwang",
      "federung": "luft",
      "reifen": "r195",
      "ladeflaeche": "l11500",
      "breite": "b3300",
      "rampen": "hydrv",
      "farbe": "r3000",
      "zubehoer": [
       "zurr",
       "led",
       "stuetz"
      ]
     },
     "zeilen": [
      {
       "mid": "_basis",
       "merkmal": "Grundfahrzeug",
       "text": "Semitieflader ST",
       "preis": 48900,
       "kosten": 35600
      },
      {
       "mid": "achsen",
       "wid": "a3",
       "code": "A3",
       "merkmal": "Achsanzahl",
       "ueberschrift": "Fahrwerk",
       "text": "3 Achsen",
       "preis": 6800,
       "kosten": 4900
      },
      {
       "mid": "lenkung",
       "wid": "zwang",
       "code": "LZM",
       "merkmal": "Lenkung",
       "ueberschrift": "Fahrwerk",
       "text": "Zwangslenkung mechanisch",
       "preis": 8900,
       "kosten": 6200
      },
      {
       "mid": "federung",
       "wid": "luft",
       "code": "FL",
       "merkmal": "Federung",
       "ueberschrift": "Fahrwerk",
       "text": "Luftfederung",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "reifen",
       "wid": "r195",
       "code": "R195",
       "merkmal": "Bereifung",
       "ueberschrift": "Fahrwerk",
       "text": "245/70 R19,5 zwillingsbereift (× 3)",
       "preis": 1140,
       "kosten": 780
      },
      {
       "mid": "ladeflaeche",
       "wid": "l11500",
       "code": "LF115",
       "merkmal": "Ladefläche",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "11.500 mm",
       "preis": 3200,
       "kosten": 2300
      },
      {
       "mid": "breite",
       "wid": "b3300",
       "code": "B330V",
       "merkmal": "Breite",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "Verbreiterbar auf 3.300 mm",
       "preis": 4600,
       "kosten": 3100
      },
      {
       "mid": "rampen",
       "wid": "hydrv",
       "code": "RAHV",
       "merkmal": "Auffahrrampen",
       "ueberschrift": "Heck",
       "text": "Hydraulisch, seitlich verschiebbar",
       "preis": 8900,
       "kosten": 6100
      },
      {
       "mid": "farbe",
       "wid": "r3000",
       "code": "RAL3000",
       "merkmal": "Farbe",
       "ueberschrift": "Lackierung",
       "text": "RAL 3000 Feuerrot",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "zubehoer",
       "wid": "zurr",
       "code": "Z-ZP20",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Zurrpunkte 10 t, 20 Stück",
       "preis": 1150,
       "kosten": 690
      },
      {
       "mid": "zubehoer",
       "wid": "led",
       "code": "Z-LED",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "LED-Beleuchtung komplett",
       "preis": 980,
       "kosten": 610
      },
      {
       "mid": "zubehoer",
       "wid": "stuetz",
       "code": "Z-SFH",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Hydraulische Stützfüße",
       "preis": 3400,
       "kosten": 2350
      }
     ],
     "einzel": 87970,
     "kosten": 62630,
     "menge": 3,
     "rabatt": 4,
     "version": 1
    },
    {
     "typ": "frei",
     "text": "Überführung zum Kunden je Fahrzeug",
     "einzel": 850,
     "kosten": 620,
     "menge": 3,
     "rabatt": 0
    }
   ],
   "rabatt": 2,
   "texte": {
    "einleitung": "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
    "lieferung": "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
    "zahlung": "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
    "gewaehrleistung": "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
    "schluss": "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
    "zeigeMerkmalpreise": true,
    "zeigeBild": true,
    "zeigeStueckliste": false
   },
   "token": "raum-k7q2m9xa4t",
   "freigegeben": true,
   "events": [
    {
     "typ": "aufruf",
     "ts": 1792966068092,
     "dauer": 212,
     "geraet": "Desktop"
    },
    {
     "typ": "aufruf",
     "ts": 1793277108092,
     "dauer": 95,
     "geraet": "Mobil"
    },
    {
     "typ": "aufruf",
     "ts": 1793601108092,
     "dauer": 430,
     "geraet": "Desktop"
    },
    {
     "typ": "pdf",
     "ts": 1793601408092
    },
    {
     "typ": "aufruf",
     "ts": 1793694708092,
     "dauer": 188,
     "geraet": "Desktop"
    },
    {
     "typ": "rueckfrage",
     "ts": 1793694878092,
     "text": "Können die Rampen auch 2,5 m lang ausgeführt werden? Wir verladen Raupenbagger."
    }
   ],
   "beispiel": true
  },
  {
   "nr": "AN-2026-1044",
   "kundeId": "k10688",
   "kunde": {
    "firma": "Nordsee Anlagenbau AG",
    "person": "Frau Ines Petersen",
    "strasse": "Am Kai 14",
    "ort": "26382 Wilhelmshaven",
    "mail": "i.petersen@nordsee-anlagenbau.example"
   },
   "bearbeiter": "v2",
   "erstellt": 1793190708092,
   "gueltig": 1795782708092,
   "status": "versendet",
   "positionen": [
    {
     "typ": "konfig",
     "produkt": "TB",
     "produktName": "Tiefbett-Auflieger TB",
     "sel": {
      "achsen": "a6",
      "lenkung": "hydr",
      "federung": "hydro",
      "reifen": "r175",
      "ladeflaeche": "tele",
      "breite": "b3300",
      "hals": "abnehmbar",
      "rampen": "keine",
      "farbe": "r7016",
      "zubehoer": [
       "zurr",
       "led",
       "kiste",
       "stuetz"
      ]
     },
     "zeilen": [
      {
       "mid": "_basis",
       "merkmal": "Grundfahrzeug",
       "text": "Tiefbett-Auflieger TB",
       "preis": 79500,
       "kosten": 58200
      },
      {
       "mid": "achsen",
       "wid": "a6",
       "code": "A6",
       "merkmal": "Achsanzahl",
       "ueberschrift": "Fahrwerk",
       "text": "6 Achsen",
       "preis": 33500,
       "kosten": 24100
      },
      {
       "mid": "lenkung",
       "wid": "hydr",
       "code": "LZH",
       "merkmal": "Lenkung",
       "ueberschrift": "Fahrwerk",
       "text": "Hydraulische Zwangslenkung",
       "preis": 18500,
       "kosten": 12900
      },
      {
       "mid": "federung",
       "wid": "hydro",
       "code": "FPH",
       "merkmal": "Federung",
       "ueberschrift": "Fahrwerk",
       "text": "Hydraulische Pendelachsen, Hub 300 mm (× 6)",
       "preis": 25200,
       "kosten": 18000
      },
      {
       "mid": "reifen",
       "wid": "r175",
       "code": "R175",
       "merkmal": "Bereifung",
       "ueberschrift": "Fahrwerk",
       "text": "235/75 R17,5 zwillingsbereift",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "ladeflaeche",
       "wid": "tele",
       "code": "LFT150",
       "merkmal": "Ladefläche",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "9.000 mm, teleskopierbar auf 15.000 mm",
       "preis": 12900,
       "kosten": 9100
      },
      {
       "mid": "breite",
       "wid": "b3300",
       "code": "B330V",
       "merkmal": "Breite",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "Verbreiterbar auf 3.300 mm",
       "preis": 4600,
       "kosten": 3100
      },
      {
       "mid": "hals",
       "wid": "abnehmbar",
       "code": "SH-AH",
       "merkmal": "Schwanenhals",
       "ueberschrift": "Schwanenhals-Typ",
       "text": "Hydraulisch abnehmbar",
       "preis": 16800,
       "kosten": 11900
      },
      {
       "mid": "rampen",
       "wid": "keine",
       "code": "RA0",
       "merkmal": "Auffahrrampen",
       "ueberschrift": "Heck",
       "text": "Keine",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "farbe",
       "wid": "r7016",
       "code": "RAL7016",
       "merkmal": "Farbe",
       "ueberschrift": "Lackierung",
       "text": "RAL 7016 Anthrazitgrau",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "zubehoer",
       "wid": "zurr",
       "code": "Z-ZP20",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Zurrpunkte 10 t, 20 Stück",
       "preis": 1150,
       "kosten": 690
      },
      {
       "mid": "zubehoer",
       "wid": "led",
       "code": "Z-LED",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "LED-Beleuchtung komplett",
       "preis": 980,
       "kosten": 610
      },
      {
       "mid": "zubehoer",
       "wid": "stuetz",
       "code": "Z-SFH",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Hydraulische Stützfüße",
       "preis": 3400,
       "kosten": 2350
      },
      {
       "mid": "zubehoer",
       "wid": "kiste",
       "code": "Z-WK",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Werkzeugkasten",
       "preis": 420,
       "kosten": 240
      }
     ],
     "einzel": 196950,
     "kosten": 141190,
     "menge": 1,
     "rabatt": 0,
     "version": 1
    },
    {
     "typ": "frei",
     "text": "Einweisung Fahrpersonal vor Ort (1 Tag)",
     "einzel": 1200,
     "kosten": 700,
     "menge": 1,
     "rabatt": 0
    }
   ],
   "rabatt": 0,
   "texte": {
    "einleitung": "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
    "lieferung": "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
    "zahlung": "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
    "gewaehrleistung": "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
    "schluss": "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
    "zeigeMerkmalpreise": true,
    "zeigeBild": true,
    "zeigeStueckliste": false
   },
   "token": "raum-p3w8n1zc6e",
   "freigegeben": true,
   "events": [
    {
     "typ": "aufruf",
     "ts": 1793233908092,
     "dauer": 66,
     "geraet": "Desktop"
    }
   ],
   "beispiel": true
  },
  {
   "nr": "AN-2026-1045",
   "kundeId": "k10512",
   "kunde": {
    "firma": "Forstbetrieb Hofmann KG",
    "person": "Herr Stefan Hofmann",
    "strasse": "Waldweg 21",
    "ort": "77709 Wolfach",
    "mail": "s.hofmann@forst-hofmann.example"
   },
   "bearbeiter": "v1",
   "erstellt": 1793449908092,
   "gueltig": 1796041908092,
   "status": "angenommen",
   "positionen": [
    {
     "typ": "konfig",
     "produkt": "LN",
     "produktName": "Langholz-Nachläufer LN",
     "sel": {
      "achsen": "a3",
      "lenkung": "zwang",
      "reifen": "r175",
      "rungen": "rp4",
      "farbe": "r5010",
      "zubehoer": [
       "led"
      ]
     },
     "zeilen": [
      {
       "mid": "_basis",
       "merkmal": "Grundfahrzeug",
       "text": "Langholz-Nachläufer LN",
       "preis": 29800,
       "kosten": 21400
      },
      {
       "mid": "achsen",
       "wid": "a3",
       "code": "A3",
       "merkmal": "Achsanzahl",
       "ueberschrift": "Fahrwerk",
       "text": "3 Achsen",
       "preis": 6800,
       "kosten": 4900
      },
      {
       "mid": "lenkung",
       "wid": "zwang",
       "code": "LZM",
       "merkmal": "Lenkung",
       "ueberschrift": "Fahrwerk",
       "text": "Zwangslenkung mechanisch",
       "preis": 8900,
       "kosten": 6200
      },
      {
       "mid": "reifen",
       "wid": "r175",
       "code": "R175",
       "merkmal": "Bereifung",
       "ueberschrift": "Fahrwerk",
       "text": "235/75 R17,5 zwillingsbereift",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "rungen",
       "wid": "rp4",
       "code": "RP4",
       "merkmal": "Rungenpaare",
       "ueberschrift": "Holzaufbau",
       "text": "4 Rungenpaare",
       "preis": 2900,
       "kosten": 1960
      },
      {
       "mid": "farbe",
       "wid": "r5010",
       "code": "RAL5010",
       "merkmal": "Farbe",
       "ueberschrift": "Lackierung",
       "text": "RAL 5010 Enzianblau",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "zubehoer",
       "wid": "led",
       "code": "Z-LED",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "LED-Beleuchtung komplett",
       "preis": 980,
       "kosten": 610
      }
     ],
     "einzel": 49380,
     "kosten": 35070,
     "menge": 2,
     "rabatt": 3,
     "version": 1
    }
   ],
   "rabatt": 0,
   "texte": {
    "einleitung": "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
    "lieferung": "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
    "zahlung": "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
    "gewaehrleistung": "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
    "schluss": "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
    "zeigeMerkmalpreise": true,
    "zeigeBild": true,
    "zeigeStueckliste": false
   },
   "token": "raum-h5d9r2kq8v",
   "freigegeben": true,
   "events": [
    {
     "typ": "aufruf",
     "ts": 1793467188092,
     "dauer": 140,
     "geraet": "Mobil"
    },
    {
     "typ": "aufruf",
     "ts": 1793605428092,
     "dauer": 260,
     "geraet": "Desktop"
    },
    {
     "typ": "angenommen",
     "ts": 1793605678092,
     "name": "Stefan Hofmann"
    }
   ],
   "beispiel": true
  },
  {
   "nr": "AN-2026-1046",
   "kundeId": "k10603",
   "kunde": {
    "firma": "Bauunternehmung Ruf GmbH & Co. KG",
    "person": "Herr Daniel Ruf",
    "strasse": "Gewerbepark 5",
    "ort": "79098 Freiburg",
    "mail": "d.ruf@ruf-bau.example"
   },
   "bearbeiter": "v2",
   "erstellt": 1793622708092,
   "gueltig": 1796214708092,
   "status": "entwurf",
   "positionen": [
    {
     "typ": "konfig",
     "produkt": "PA",
     "produktName": "Plattform-Auflieger PA",
     "sel": {
      "achsen": "a3",
      "lenkung": "zwang",
      "federung": "luft",
      "reifen": "r175",
      "ladeflaeche": "l11500",
      "breite": "b2750",
      "rampen": "keine",
      "farbe": "r9005",
      "zubehoer": [
       "zurr",
       "rungtaschen"
      ]
     },
     "zeilen": [
      {
       "mid": "_basis",
       "merkmal": "Grundfahrzeug",
       "text": "Plattform-Auflieger PA",
       "preis": 36500,
       "kosten": 26900
      },
      {
       "mid": "achsen",
       "wid": "a3",
       "code": "A3",
       "merkmal": "Achsanzahl",
       "ueberschrift": "Fahrwerk",
       "text": "3 Achsen",
       "preis": 6800,
       "kosten": 4900
      },
      {
       "mid": "lenkung",
       "wid": "zwang",
       "code": "LZM",
       "merkmal": "Lenkung",
       "ueberschrift": "Fahrwerk",
       "text": "Zwangslenkung mechanisch",
       "preis": 8900,
       "kosten": 6200
      },
      {
       "mid": "federung",
       "wid": "luft",
       "code": "FL",
       "merkmal": "Federung",
       "ueberschrift": "Fahrwerk",
       "text": "Luftfederung",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "reifen",
       "wid": "r175",
       "code": "R175",
       "merkmal": "Bereifung",
       "ueberschrift": "Fahrwerk",
       "text": "235/75 R17,5 zwillingsbereift",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "ladeflaeche",
       "wid": "l11500",
       "code": "LF115",
       "merkmal": "Ladefläche",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "11.500 mm",
       "preis": 3200,
       "kosten": 2300
      },
      {
       "mid": "breite",
       "wid": "b2750",
       "code": "B275",
       "merkmal": "Breite",
       "ueberschrift": "Tiefbett-Plattform",
       "text": "2.750 mm",
       "preis": 900,
       "kosten": 600
      },
      {
       "mid": "rampen",
       "wid": "keine",
       "code": "RA0",
       "merkmal": "Auffahrrampen",
       "ueberschrift": "Heck",
       "text": "Keine",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "farbe",
       "wid": "r9005",
       "code": "RAL9005",
       "merkmal": "Farbe",
       "ueberschrift": "Lackierung",
       "text": "RAL 9005 Tiefschwarz",
       "preis": 0,
       "kosten": 0
      },
      {
       "mid": "zubehoer",
       "wid": "zurr",
       "code": "Z-ZP20",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Zurrpunkte 10 t, 20 Stück",
       "preis": 1150,
       "kosten": 690
      },
      {
       "mid": "zubehoer",
       "wid": "rungtaschen",
       "code": "Z-RT10",
       "merkmal": "Ausstattung",
       "ueberschrift": "Ausstattung",
       "text": "Rungentaschen mit 10 Stahlrungen",
       "preis": 1900,
       "kosten": 1200
      }
     ],
     "einzel": 59350,
     "kosten": 42790,
     "menge": 2,
     "rabatt": 0,
     "version": 1
    }
   ],
   "rabatt": 0,
   "texte": {
    "einleitung": "Sehr geehrte Damen und Herren,\nvielen Dank für Ihre Anfrage. Gern bieten wir Ihnen die folgenden Fahrzeuge nach Ihren Vorgaben an.",
    "lieferung": "Lieferzeit ca. 14 Wochen nach Auftragsklärung. Lieferung ab Werk, Überführung auf Wunsch.",
    "zahlung": "30 % Anzahlung bei Auftragserteilung, Rest bei Abholung bzw. vor Auslieferung.",
    "gewaehrleistung": "12 Monate Gewährleistung auf Fahrzeug und Aufbau, 24 Monate auf Achsaggregate.",
    "schluss": "Wir freuen uns auf Ihren Auftrag. Für Rückfragen steht Ihnen {{bearbeiter.name}} unter {{bearbeiter.tel}} gern zur Verfügung.",
    "zeigeMerkmalpreise": true,
    "zeigeBild": true,
    "zeigeStueckliste": false
   },
   "token": null,
   "freigegeben": false,
   "events": [],
   "beispiel": true
  }
 ],
 "releases": [
  {
   "version": 1,
   "ts": 1792672308092,
   "von": null,
   "notiz": "Erstes Konfigurationsmodell Auflieger",
   "regeln": 13,
   "merkmale": 11,
   "produkte": 5
  }
 ],
 "protokoll": [
  {
   "monat": "2026-11",
   "eintraege": [
    {
     "ts": 1792672308092,
     "von": null,
     "bereich": "Freigabe",
     "text": "Version 1 veröffentlicht"
    },
    {
     "ts": 1793536308092,
     "von": null,
     "bereich": "Regeln",
     "text": "R11 angelegt (inaktiv)"
    }
   ]
  }
 ],
 "artikel": [
  {
   "ARTIKEL": "SEMI_ST3_S3F",
   "NAME": "Semitieflader ST",
   "VKPREIS": 48900,
   "HERSTELLKOSTEN": 35600,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FAHRZEUG"
  },
  {
   "ARTIKEL": "TB_T4P_S3F",
   "NAME": "Tiefbett-Auflieger TB",
   "VKPREIS": 79500,
   "HERSTELLKOSTEN": 58200,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FZ-TB"
  },
  {
   "ARTIKEL": "TB_T3P_S3F",
   "NAME": "Tiefbett-Auflieger TB 3",
   "VKPREIS": 71900,
   "HERSTELLKOSTEN": 52800,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FZ-TB"
  },
  {
   "ARTIKEL": "PLAT_PA2_FL",
   "NAME": "Plattform-Auflieger PA",
   "VKPREIS": 36500,
   "HERSTELLKOSTEN": 26900,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FAHRZEUG"
  },
  {
   "ARTIKEL": "NL_LN2_T",
   "NAME": "Langholz-Nachläufer LN",
   "VKPREIS": 29800,
   "HERSTELLKOSTEN": 21400,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FAHRZEUG"
  },
  {
   "ARTIKEL": "TB_T5P_S3F",
   "NAME": "Tiefbett-Auflieger TB 5 Schwerlast",
   "VKPREIS": 98500,
   "HERSTELLKOSTEN": 72400,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FZ-TB"
  },
  {
   "ARTIKEL": "TB_T4P_S3F_LB",
   "NAME": "Tiefbett-Auflieger TB, Leichtbau",
   "VKPREIS": 76900,
   "HERSTELLKOSTEN": 56100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FZ-TB"
  },
  {
   "ARTIKEL": "SEMI_ST2_S3F",
   "NAME": "Semitieflader ST 2-achsig",
   "VKPREIS": 44900,
   "HERSTELLKOSTEN": 32800,
   "ME": "Stk",
   "ARTIKELGRUPPE": "FAHRZEUG"
  },
  {
   "ARTIKEL": "A2",
   "NAME": "2 Achsen",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "A3",
   "NAME": "3 Achsen",
   "VKPREIS": 6800,
   "HERSTELLKOSTEN": 4900,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "A4",
   "NAME": "4 Achsen",
   "VKPREIS": 14900,
   "HERSTELLKOSTEN": 10400,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "A5",
   "NAME": "5 Achsen",
   "VKPREIS": 23800,
   "HERSTELLKOSTEN": 17100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "A6",
   "NAME": "6 Achsen",
   "VKPREIS": 33500,
   "HERSTELLKOSTEN": 24100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "L0",
   "NAME": "Starrachsen",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "LZM",
   "NAME": "Zwangslenkung mechanisch",
   "VKPREIS": 8900,
   "HERSTELLKOSTEN": 6200,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "LZH",
   "NAME": "Hydraulische Zwangslenkung",
   "VKPREIS": 18500,
   "HERSTELLKOSTEN": 12900,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "FL",
   "NAME": "Luftfederung",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "FPH",
   "NAME": "Hydraulische Pendelachsen, Hub 300 mm",
   "VKPREIS": 4200,
   "HERSTELLKOSTEN": 3000,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "R175",
   "NAME": "235/75 R17,5 zwillingsbereift",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "R195",
   "NAME": "Bereifung 245/70 R19,5 zwilling",
   "VKPREIS": 380,
   "HERSTELLKOSTEN": 260,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "R225",
   "NAME": "385/65 R22,5 Super Single",
   "VKPREIS": 720,
   "HERSTELLKOSTEN": 500,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "LF090",
   "NAME": "9.000 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "LF115",
   "NAME": "11.500 mm",
   "VKPREIS": 3200,
   "HERSTELLKOSTEN": 2300,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "LFT150",
   "NAME": "9.000 mm, teleskopierbar auf 15.000 mm",
   "VKPREIS": 12900,
   "HERSTELLKOSTEN": 9100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "B255",
   "NAME": "2.550 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "B275",
   "NAME": "2.750 mm",
   "VKPREIS": 900,
   "HERSTELLKOSTEN": 600,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "B330V",
   "NAME": "Verbreiterbar auf 3.300 mm",
   "VKPREIS": 4600,
   "HERSTELLKOSTEN": 3100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "SH-F",
   "NAME": "Fest",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "SH-AH",
   "NAME": "Hydraulisch abnehmbar",
   "VKPREIS": 16800,
   "HERSTELLKOSTEN": 11900,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RA0",
   "NAME": "Keine",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAM",
   "NAME": "Mechanisch klappbar",
   "VKPREIS": 2900,
   "HERSTELLKOSTEN": 1900,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAH",
   "NAME": "Hydraulisch klappbar",
   "VKPREIS": 6400,
   "HERSTELLKOSTEN": 4300,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAHV",
   "NAME": "Hydraulisch, seitlich verschiebbar",
   "VKPREIS": 8900,
   "HERSTELLKOSTEN": 6100,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RP2",
   "NAME": "2 Rungenpaare",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RP3",
   "NAME": "3 Rungenpaare",
   "VKPREIS": 1450,
   "HERSTELLKOSTEN": 980,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RP4",
   "NAME": "4 Rungenpaare",
   "VKPREIS": 2900,
   "HERSTELLKOSTEN": 1960,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL9005",
   "NAME": "RAL 9005 Tiefschwarz",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL3000",
   "NAME": "RAL 3000 Feuerrot",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL5010",
   "NAME": "RAL 5010 Enzianblau",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL7016",
   "NAME": "RAL 7016 Anthrazitgrau",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL1028",
   "NAME": "RAL 1028 Melonengelb",
   "VKPREIS": 650,
   "HERSTELLKOSTEN": 420,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-ZP20",
   "NAME": "Zurrpunkte 10 t, 20 Stück",
   "VKPREIS": 1150,
   "HERSTELLKOSTEN": 690,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-RT10",
   "NAME": "Rungentaschen mit 10 Stahlrungen",
   "VKPREIS": 1900,
   "HERSTELLKOSTEN": 1200,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-SW12",
   "NAME": "Seilwinde 12 t",
   "VKPREIS": 6900,
   "HERSTELLKOSTEN": 4800,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-AL1",
   "NAME": "Achslift 1. Achse",
   "VKPREIS": 1600,
   "HERSTELLKOSTEN": 1050,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-LED",
   "NAME": "LED-Beleuchtung komplett",
   "VKPREIS": 980,
   "HERSTELLKOSTEN": 610,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-SFH",
   "NAME": "Hydraulische Stützfüße",
   "VKPREIS": 3400,
   "HERSTELLKOSTEN": 2350,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-WK",
   "NAME": "Werkzeugkasten",
   "VKPREIS": 420,
   "HERSTELLKOSTEN": 240,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RA-ST-100",
   "NAME": "Rahmen Semitieflader, geschweißt",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "KP-200",
   "NAME": "Königszapfen 2\"",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "EL-24-100",
   "NAME": "Elektrik 24 V Grundausstattung",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "MO-ST-001",
   "NAME": "Montage und Endabnahme",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "h",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-TB-100",
   "NAME": "Rahmen Tiefbett, geschweißt",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "KP-350",
   "NAME": "Königszapfen 3,5\"",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "MO-TB-001",
   "NAME": "Montage und Endabnahme",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "h",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-PA-100",
   "NAME": "Rahmen Plattform, geschweißt",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "MO-PA-001",
   "NAME": "Montage und Endabnahme",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "h",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-LN-100",
   "NAME": "Teleskoprohr mit Drehschemel",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "MO-LN-001",
   "NAME": "Montage und Endabnahme",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "h",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "AC-10T-100",
   "NAME": "Achsaggregat 10 t, Scheibenbremse",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LK-ZW-100",
   "NAME": "Zwangslenkung mit Drehschemelabnahme",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LK-HY-200",
   "NAME": "Lenkhydraulik komplett",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LK-HY-210",
   "NAME": "Lenkzylinder",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "FE-LU-010",
   "NAME": "Luftfederbalg",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "FE-HP-020",
   "NAME": "Pendelachse hydraulisch",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RF-175-235",
   "NAME": "Kompletrad 235/75 R17,5",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RF-195-245",
   "NAME": "Kompletrad 245/70 R19,5",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RF-225-385",
   "NAME": "Kompletrad 385/65 R22,5",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "BO-HZ-090",
   "NAME": "Hartholzboden 50 mm, 9 m",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "BO-HZ-115",
   "NAME": "Hartholzboden 50 mm, 11,5 m",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-TE-600",
   "NAME": "Teleskopauszug 6 m",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-BR-275",
   "NAME": "Außenrahmen 2.750 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RA-VB-330",
   "NAME": "Ausziehbare Verbreiterung",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "HA-HY-300",
   "NAME": "Abnehmbarer Schwanenhals, hydraulisch",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "HY-AG-050",
   "NAME": "Hydraulikaggregat 5,5 kW",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RP-ME-220",
   "NAME": "Auffahrrampe 2,2 m, federunterstützt",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RP-HY-220",
   "NAME": "Auffahrrampe 2,2 m, hydraulisch",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "HY-ZY-080",
   "NAME": "Hydraulikzylinder Rampe",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RP-VS-010",
   "NAME": "Verschiebeeinrichtung",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "RU-HO-180",
   "NAME": "Rungenpaar 1.800 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LA-9005",
   "NAME": "Lackierung RAL 9005",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LA-3000",
   "NAME": "Lackierung RAL 3000",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LA-5010",
   "NAME": "Lackierung RAL 5010",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LA-7016",
   "NAME": "Lackierung RAL 7016",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "LA-1028",
   "NAME": "Lackierung RAL 1028",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-ZP-100",
   "NAME": "Zurrpunkt 10 t",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-RT-010",
   "NAME": "Rungentasche",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-RS-080",
   "NAME": "Stahlrunge 800 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-SW-120",
   "NAME": "Seilwinde hydraulisch 12 t",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-AL-001",
   "NAME": "Achslifteinrichtung",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "EL-LED-100",
   "NAME": "LED-Leuchtenpaket",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Satz",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-SF-200",
   "NAME": "Stützfuß hydraulisch",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "ZU-WK-060",
   "NAME": "Werkzeugkasten 600 mm",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "TEIL"
  },
  {
   "ARTIKEL": "A7",
   "NAME": "7 Achsen",
   "VKPREIS": 44800,
   "HERSTELLKOSTEN": 32200,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-KAM",
   "NAME": "Rückfahrkamera mit Monitor",
   "VKPREIS": 890,
   "HERSTELLKOSTEN": 520,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-TEL",
   "NAME": "Telematik-Box mit Achslastanzeige",
   "VKPREIS": 1450,
   "HERSTELLKOSTEN": 910,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "R195B",
   "NAME": "445/45 R19,5 Super Single",
   "VKPREIS": 980,
   "HERSTELLKOSTEN": 690,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "RAL6005",
   "NAME": "RAL 6005 Moosgrün",
   "VKPREIS": 0,
   "HERSTELLKOSTEN": 0,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-VB",
   "NAME": "Verbreiterungsbohlen Holz (Satz)",
   "VKPREIS": 1250,
   "HERSTELLKOSTEN": 780,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  },
  {
   "ARTIKEL": "Z-FB",
   "NAME": "Fernbedienung Hydraulik",
   "VKPREIS": 1850,
   "HERSTELLKOSTEN": 1200,
   "ME": "Stk",
   "ARTIKELGRUPPE": "VK-CODE"
  }
 ]
};

/* ===== core.js ===== */
/* =========================================================================
   Grundgerüst: Konfiguration, Hilfsfunktionen, Router, Ereignisverteilung
   Alles hängt am Namensraum window.KONF und arbeitet nur innerhalb des
   eigenen Wurzelelements (#konfigurator), damit APplus nicht gestört wird.
   ========================================================================= */
(function () {
  const K = window.KONF = window.KONF || {};

  /* ---------- Konfiguration (überschreibbar über window.KONF_CONFIG) ---------- */
  K.cfg = Object.assign({
    mount: "#konfigurator",
    /** Andere Inhalte im APplus-#content ausblenden und volle Breite nutzen */
    maximize: true,
    /** Ansicht in der Adresszeile (#katalog) führen. In APplus aus, im Prototyp an. */
    hash: !!(window.claude && window.claude.use),
    storageKey: "konf-v1",
    /** APplus-Abfragen. Leer lassen = Beispieldaten. Format siehe LIESMICH. */
    queries: { codes: "", produkte: "", merkmale: "", regeln: "", katalog: "", stueckliste: "", kunden: "", artikel: "", vertrieb: "", angebotsnummer: "" },
    /** Optional: eigene Funktion, die eine Angebotsnummer im ERP reserviert, z. B. über einen Webdienst.
        async (einst) => "AN-2026-01234"  – hat Vorrang vor der Abfrage. */
    angebotsnummer: null,
    /** Spalten der Artikel-Abfrage (Tabelle ARTIKEL). Erste vorhandene Spalte gewinnt, Groß/Klein egal. */
    artikelSpalten: { code: ["ARTIKEL"], name: ["NAME", "BEZEICHNUNG", "ARTIKELBEZEICHNUNG", "BEZ", "TEXT", "KURZTEXT"], preis: ["VKPREIS", "VK_PREIS", "LISTENPREIS", "PREIS"], kosten: ["HERSTELLKOSTEN", "KOSTEN", "EKPREIS", "EK_PREIS", "SELBSTKOSTEN"], me: ["ME", "MENGENEINHEIT", "EINHEIT"], gruppe: ["ARTIKELGRUPPE", "WARENGRUPPE", "GRUPPE"] },
    loadQuery: async function (name) {
      if (!name || location.protocol === "file:") return null;
      const app = location.pathname.split("/").slice(0, 2).join("/");
      const res = await fetch(app + "/kidb/dashboard/ViewQuery.aspx?name=" + encodeURIComponent(name) + "&xhr=json&t=" + Date.now(), { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const t = await res.text(); if (!t) return [];
      const d = JSON.parse(t); if (!Array.isArray(d)) throw new Error("kein Array geliefert");
      return d;
    },
    /** Bibliotheken, die bei Bedarf nachgeladen werden */
    libs: {
      three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      gltfloader: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
      gltfexporter: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js",
      jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
      xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
      pdfjs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs",
      pdfjsWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs",
      pdflib: "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
    }
  }, window.KONF_CONFIG || {});
  K.hashModus = !!K.cfg.hash;

  /* ---------- Bibliotheken nachladen ---------- */
  const PRUEF = { three: () => window.THREE, gltfloader: () => window.THREE && window.THREE.GLTFLoader, gltfexporter: () => window.THREE && window.THREE.GLTFExporter, jspdf: () => window.jspdf, jszip: () => window.JSZip, xlsx: () => window.XLSX, pdflib: () => window.PDFLib };
  const ladend = {};
  K.lib = async (...namen) => {
    for (const n of namen) {
      if (PRUEF[n] && PRUEF[n]()) continue;
      if ((n === "gltfloader" || n === "gltfexporter")) await K.lib("three");
      ladend[n] ||= new Promise((ok, nein) => {
        const s = document.createElement("script"); s.src = K.cfg.libs[n]; s.async = true;
        s.onload = () => PRUEF[n] && !PRUEF[n]() ? nein(new Error(n + " nicht geladen")) : ok(); s.onerror = () => { delete ladend[n]; nein(new Error(n + " nicht erreichbar")); };
        document.head.appendChild(s);
      });
      await ladend[n];
    }
    return true;
  };

  K.esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  K.eur = n => nf0.format(n || 0);
  K.eur2 = n => nf2.format(n || 0);
  K.zahl = (n, d = 0) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: d }).format(n || 0);
  K.datum = ts => ts ? new Date(ts).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–";
  K.zeit = ts => new Date(ts).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  K.dauer = s => { s = Math.round(s || 0); return s < 60 ? `${s} s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`; };
  K.rel = ts => {
    const m = Math.round((Date.now() - ts) / 6e4); if (m < 1) return "gerade eben"; if (m < 60) return `vor ${m} min`;
    const h = Math.round(m / 60); if (h < 24) return `vor ${h} h`; const d = Math.round(h / 24); return d === 1 ? "gestern" : `vor ${d} Tagen`;
  };
  K.id = (p = "") => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  K.token = () => "raum-" + Array.from({ length: 10 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");
  K.clone = o => JSON.parse(JSON.stringify(o));
  K.el = id => document.getElementById(id);

  let tT; K.toast = t => { const el = K.el("konf-toast"); if (!el) return; el.textContent = t; el.hidden = false; clearTimeout(tT); tT = setTimeout(() => el.hidden = true, 3500); };

  /* ---------- Dialog ---------- */
  K.sheet = (html, breit) => {
    const s = K.el("konf-sheet");
    s.innerHTML = `<div class="sheet-bg" data-act="sheetZu"></div><div class="sheet-box${breit ? " breit" : ""}" role="dialog" aria-modal="true">${html}</div>`;
    s.hidden = false; const f = s.querySelector("input,select,textarea,button:not([data-act=sheetZu])"); if (f) f.focus();
  };
  K.sheetZu = () => { const s = K.el("konf-sheet"); if (!s) return; s.hidden = true; s.innerHTML = ""; };

  /* ---------- Router (intern, optional mit Adresszeile) ---------- */
  K.routes = []; K.act = {}; K.inp = {};
  K.route = (muster, fn, opt = {}) => K.routes.push({ muster, fn, ...opt });
  K.ort = (K.hashModus || /^#raum-/.test(location.hash)) && location.hash.length > 1 ? location.hash.slice(1) : "start";
  K.aktuell = () => K.hashModus ? (location.hash.slice(1) || "start") : K.ort;
  function finde(h) {
    for (const r of K.routes) {
      if (r.muster === h) return { r, arg: null };
      if (r.muster.endsWith("-") && h.startsWith(r.muster)) return { r, arg: h.slice(r.muster.length) };
    }
    return { r: K.routes.find(x => x.muster === "start"), arg: null };
  }
  K.nachRender = [];
  K.render = () => {
    const view = K.el("konf-view"); if (!view) return;
    const h = K.aktuell(), { r, arg } = finde(h);
    const ae = document.activeElement, fokus = ae && view.contains(ae) && ae.id ? { id: ae.id, s: ae.selectionStart, e: ae.selectionEnd } : null;
    K.ctx = { route: h, arg, def: r };
    if (K.root) K.root.dataset.modus = r.kunde ? "kunde" : "app";
    K.nachRender = [];
    let html = "";
    try { html = (K.waechter && K.waechter(r)) || r.fn(arg) || ""; } catch (e) { console.error(e); html = `<div class="leer"><b>Diese Ansicht konnte nicht geladen werden.</b><br>${K.esc(e.message)}</div>`; }
    view.innerHTML = html;
    for (const f of K.nachRender) try { f(view); } catch (e) { console.error(e); }
    if (fokus) { const el = K.el(fokus.id); if (el) { el.focus({ preventScroll: true }); try { if (fokus.s != null) el.setSelectionRange(fokus.s, fokus.e); } catch (e) {} } }
    K.navAktualisieren && K.navAktualisieren(h, r);
  };
  K.nach = f => K.nachRender.push(f);
  let letzte = null;
  K.routeGewechselt = () => {
    const h = K.aktuell();
    if (letzte && letzte.startsWith("raum-") && !h.startsWith("raum-") && K.raumVerlassen) K.raumVerlassen();
    letzte = h;
    if (K.kat && K.kat.entwurf && h !== "katalog" && h !== "konfig") K.kat.entwurf = false; // Entwurfs-Vorschau des Katalogs endet beim Verlassen
    K.render();
    if (K.root) { const top = K.root.getBoundingClientRect().top; if (top < 0) K.root.scrollIntoView({ block: "start" }); }
  };
  K.gehe = h => {
    if (K.hashModus) { if (location.hash.slice(1) === h) K.render(); else location.hash = h; return; }
    K.ort = h; K.routeGewechselt();
  };
  if (K.hashModus) window.addEventListener("hashchange", () => K.routeGewechselt());

  /* Neu zeichnen nach Datenänderung, aber nicht mitten in einer Eingabe */
  K._wartend = false;
  K.datenGeaendert = () => {
    const ae = document.activeElement, view = K.el("konf-view");
    if (ae && view && view.contains(ae) && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) { K._wartend = true; return; }
    K.render();
  };
  const imRoot = e => K.root && K.root.contains(e.target);
  document.addEventListener("focusout", e => { if (!imRoot(e) || !K._wartend) return; setTimeout(() => { const ae = document.activeElement; if (!(ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) { K._wartend = false; K.render(); } }, 60); });

  /* Ereignisse nur im eigenen Bereich: data-act (Klick/Änderung), data-in (Eingabe) */
  document.addEventListener("click", e => {
    if (!imRoot(e)) return;
    const a = e.target.closest('a[href^="#"]');
    if (a && !K.hashModus && K.root.contains(a)) { e.preventDefault(); K.gehe(a.getAttribute("href").slice(1)); return; }
    const el = e.target.closest("[data-act]"); if (!el || el.disabled || !K.root.contains(el)) return;
    if (el.tagName === "SELECT" || el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && el.type !== "button")) return;
    const f = K.act[el.dataset.act]; if (f) { e.preventDefault(); f(el, e); }
  });
  document.addEventListener("change", e => {
    if (!imRoot(e)) return;
    const el = e.target; if (!el.dataset) return;
    if (el.dataset.act && (el.tagName === "SELECT" || el.type === "checkbox" || el.type === "radio" || el.type === "file")) { const f = K.act[el.dataset.act]; if (f) f(el, e); }
    if (el.dataset.chg) { const f = K.inp[el.dataset.chg]; if (f) f(el, e); }
  });
  document.addEventListener("input", e => { if (!imRoot(e)) return; const el = e.target; const f = el.dataset && K.inp[el.dataset.in]; if (f) f(el, e); });
  document.addEventListener("keydown", e => {
    const s = K.el("konf-sheet");
    if (e.key === "Escape" && s && !s.hidden) K.sheetZu();
    if (e.key === "Enter" && imRoot(e) && e.target.matches("tr[data-act=oeffne]")) K.gehe(e.target.dataset.ziel);
  });
  K.act.sheetZu = () => K.sheetZu();

  /* Datei speichern: im Claude-Prototyp über dessen Download-Freigabe, sonst direkt im Browser */
  K.downloads = null;
  K.speichereDatei = async (name, data) => {
    if (K.downloads) {
      try { await K.downloads.save({ filename: name, data }); K.toast(name + " gespeichert"); return true; }
      catch (e) { if (e && e.code !== "declined") K.toast("Datei konnte nicht gespeichert werden."); return false; }
    }
    try {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = name; a.style.display = "none"; (K.root || document.body).appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000); K.toast(name + " gespeichert"); return true;
    } catch (e) { K.toast("Datei konnte nicht gespeichert werden."); return false; }
  };
})();


/* ===== engine.js ===== */
/* =========================================================================
   Konfigurations-Engine
   Reine Logik ohne Oberfläche: Regeln auswerten, ungültige Auswahl bereinigen,
   Preis/Kosten/Stückliste berechnen, Modelltest. Läuft im Browser (K.E) und
   in Node (module.exports), damit Tests und Datenimporte dieselbe Logik nutzen.

   Datenmodell (kommt später aus APplus-Queries):
   modell = {
     version, gruppen:[{id,name}],
     produkte:[{id,name,gruppe,artnr,basispreis,basiskosten,beschreibung,aktiv,
                visual:{typ,asset}, stl:[[artnr,bez,menge,me]],
                merkmale:[{id, werte:[ids]|null}] }],
     merkmale:[{id,name,abschnitt,typ:"einfach"|"mehrfach",multiplikator?,
                werte:[{id,name,preis,kosten,menge?,hex?,teil?,stl:[[...]]}]}],
     regeln:[{id,name,aktiv,produkte:[ids],
              wenn:[{merkmal,op:"ist"|"istNicht",werte:[ids]}],
              dann:{typ:"sperren"|"nurErlauben",merkmal,werte:[ids]},
              hinweis}]
   }
   sel = { merkmalId: wertId | [wertIds] }
   ========================================================================= */
(function (root) {
  const E = {};

  E.merkmal = (mo, mid) => mo.merkmale.find(m => m.id === mid);
  E.wert = (mo, mid, wid) => E.merkmal(mo, mid)?.werte.find(w => w.id === wid);
  E.produkt = (mo, pid) => mo.produkte.find(p => p.id === pid);

  /** Merkmale eines Produkts mit den dort zugelassenen Werten, in Produktreihenfolge. */
  /* ---------- Vererbung: Familie → Unterfamilie → Artikel ----------
     Familien (mo.gruppen) und Artikel (mo.produkte) tragen eine Liste von Zuordnungen
     { id: merkmalId, werte: [wertIds] | null, standard?, aus? }.
     Weiter unten stehende Zuordnungen überschreiben: werte (Einschränkung), standard,
     aus: true entfernt ein geerbtes Merkmal. Neue Merkmale werden hinten angehängt. */
  E.gruppenPfad = (mo, gid) => { const out = []; let g = (mo.gruppen || []).find(x => x.id === gid), n = 0; while (g && n++ < 30) { out.unshift(g); g = mo.gruppen.find(x => x.id === g.eltern); } return out; };
  function zuordnungAnwenden(liste, idx, z, quelle) {
    if (idx.has(z.id)) {
      const e = liste[idx.get(z.id)];
      if (z.aus) { e.aus = true; e.ausVon = quelle; return; }
      e.aus = false;
      if (z.werte && z.werte.length) { e.werte = z.werte.slice(); e.werteVon = quelle; }
      if (z.standard) { e.standard = z.standard; e.standardVon = quelle; }
      e.angepasst = true;
    } else if (!z.aus) { idx.set(z.id, liste.length); liste.push({ id: z.id, werte: z.werte && z.werte.length ? z.werte.slice() : null, standard: z.standard || null, herkunft: quelle, werteVon: quelle, standardVon: z.standard ? quelle : null }); }
  }
  /** Wirksame Zuordnungen eines Artikels oder einer Familie (ohne ausgeschlossene, mit "alle"=true auch diese) */
  E.zuordnung = (mo, obj, alle) => {
    const istFamilie = !("basispreis" in obj) && !("gruppe" in obj);
    const pfad = istFamilie ? E.gruppenPfad(mo, obj.id) : E.gruppenPfad(mo, obj.gruppe);
    const liste = [], idx = new Map();
    for (const g of pfad) for (const z of g.merkmale || []) zuordnungAnwenden(liste, idx, z, "g:" + g.id);
    if (!istFamilie) for (const z of obj.merkmale || []) zuordnungAnwenden(liste, idx, z, "p:" + obj.id);
    // Reihenfolge: die tiefste Ebene mit eigener Reihenfolge gewinnt
    const r = (!istFamilie && obj.reihenfolge) || [...pfad].reverse().find(g => g.reihenfolge)?.reihenfolge;
    if (r && r.length) { const pos = id => { const i = r.indexOf(id); return i < 0 ? 1e6 + liste.findIndex(e => e.id === id) : i; }; liste.sort((a, b) => pos(a.id) - pos(b.id)); }
    return alle ? liste : liste.filter(e => !e.aus);
  };
  /** Familien/Artikel aus den Regel-Geltungsbereichen entfernen. Regeln, die danach für niemanden mehr
      gelten würden, werden gelöscht (sonst würden sie plötzlich für alle Produkte gelten). Liefert die Zahl gelöschter Regeln. */
  E.ausGeltungEntfernen = (mo, gids = [], pids = []) => {
    const g = new Set(gids), p = new Set(pids), vorher = mo.regeln.length;
    mo.regeln = mo.regeln.filter(r => {
      const hatte = (r.gruppen || []).length + (r.produkte || []).length;
      if (r.gruppen) r.gruppen = r.gruppen.filter(x => !g.has(x));
      if (r.produkte) r.produkte = r.produkte.filter(x => !p.has(x));
      return !hatte || (r.gruppen || []).length + (r.produkte || []).length > 0;
    });
    return vorher - mo.regeln.length;
  };
  E.hatMerkmal = (mo, prod, mid) => E.zuordnung(mo, prod).some(e => e.id === mid);
  E.produktMerkmale = (mo, prod) => !prod ? [] : E.zuordnung(mo, prod).map(z => {
    const m = E.merkmal(mo, z.id);
    if (!m) return null;
    const werte = z.werte && z.werte.length ? m.werte.filter(w => z.werte.includes(w.id)) : m.werte.slice();
    return { m, werte, standard: z.standard || null, herkunft: z.herkunft };
  }).filter(Boolean);
  /** Alle Artikel unterhalb einer Familie (inkl. Unterfamilien) */
  E.familienArtikel = (mo, gid) => mo.produkte.filter(p => E.gruppenKette(mo, p).includes(gid));
  /** Merkmale, die alle Artikel einer Familie haben, an die Familie übergeben.
      Abweichungen (andere Werte, eigener Standard) bleiben am Artikel. Liefert die Anzahl übergebener Merkmale. */
  E.hochziehen = (mo, gid) => {
    const g = mo.gruppen.find(x => x.id === gid), arts = E.familienArtikel(mo, gid); if (!g || !arts.length) return 0;
    const eff = new Map(arts.map(p => [p.id, E.zuordnung(mo, p)]));
    const vorher = new Map(arts.map(p => [p.id, eff.get(p.id).map(e => e.id).join(",")]));
    const erste = eff.get(arts[0].id).map(e => e.id), gemeinsam = erste.filter(mid => arts.every(p => eff.get(p.id).some(e => e.id === mid)));
    const vorhanden = new Set((g.merkmale || []).map(z => z.id)); let n = 0;
    const elternG = mo.gruppen.find(x => x.id === g.eltern), elternEff = elternG ? E.zuordnung(mo, elternG) : [];
    const unter = mo.gruppen.filter(x => x.id !== gid && E.gruppenPfad(mo, x.id).some(y => y.id === gid));
    for (const mid of gemeinsam) {
      const m = E.merkmal(mo, mid); if (!m) continue;
      const union = new Set(); for (const p of arts) { const e = eff.get(p.id).find(x => x.id === mid); (e.werte || m.werte.map(w => w.id)).forEach(w => union.add(w)); }
      const famWerte = union.size === m.werte.length ? null : m.werte.map(w => w.id).filter(w => union.has(w));
      const stds = new Set(arts.map(p => eff.get(p.id).find(x => x.id === mid).standard || ""));
      const famStd = stds.size === 1 ? [...stds][0] || null : null;
      // aus Unterfamilien und Artikeln entfernen, an Familie setzen
      for (const u of unter) u.merkmale = (u.merkmale || []).filter(z => z.id !== mid);
      g.merkmale = (g.merkmale || []).filter(z => z.id !== mid);
      // nur eintragen, wenn es sich vom Geerbten unterscheidet
      const vonOben = elternEff.find(x => x.id === mid), alleIds = m.werte.map(w => w.id);
      const gleichOben = vonOben && (vonOben.werte || alleIds).join(",") === (famWerte || alleIds).join(",") && (vonOben.standard || null) === famStd;
      if (!gleichOben) g.merkmale.push({ id: mid, werte: famWerte, ...(famStd && famStd !== vonOben?.standard ? { standard: famStd } : {}) });
      for (const p of arts) {
        const e = eff.get(p.id).find(x => x.id === mid);
        p.merkmale = (p.merkmale || []).filter(z => z.id !== mid);
        const pw = e.werte || null, gleich = (pw ? pw.length : m.werte.length) === union.size;
        if (!gleich || (e.standard && e.standard !== famStd)) p.merkmale.push({ id: mid, werte: gleich ? null : pw, ...(e.standard && e.standard !== famStd ? { standard: e.standard } : {}) });
      }
      if (!vorhanden.has(mid)) n++;
    }
    // Reihenfolge der Familie wie beim ersten Artikel; weicht ein Artikel danach ab, behält er seine eigene
    g.merkmale.sort((a, b) => erste.indexOf(a.id) - erste.indexOf(b.id));
    for (const p of arts) { delete p.reihenfolge; const neu = E.zuordnung(mo, p).map(e => e.id).join(","); if (neu !== vorher.get(p.id)) p.reihenfolge = vorher.get(p.id).split(","); }
    // gleiche Reihenfolge aller Artikel einer Familie an die Familie übergeben
    for (const fam of new Set(arts.map(p => p.gruppe))) {
      const ps = mo.produkte.filter(p => p.gruppe === fam), r = ps[0]?.reihenfolge?.join(",");
      if (r && ps.every(p => p.reihenfolge?.join(",") === r)) { mo.gruppen.find(x => x.id === fam).reihenfolge = ps[0].reihenfolge; ps.forEach(p => delete p.reihenfolge); }
    }
    return n;
  };

  const alsListe = v => Array.isArray(v) ? v : (v == null ? [] : [v]);

  const aktivWert = v => v === true || (typeof v === "number" && v > 0) || (typeof v === "string" && v.trim() !== "");
  function bedingungErfuellt(c, sel) {
    if (!(c.merkmal in sel) && !Object.keys(sel).some(k => k.startsWith(c.merkmal + "."))) return false;
    const hit = alsListe(sel[c.merkmal]).some(x => (c.werte || []).includes(x)) || (c.werte || []).some(w => aktivWert(sel[c.merkmal + "." + w]));
    return c.op === "istNicht" ? !hit : hit;
  }

  /** Greift die Regel für dieses Produkt und diese Auswahl? */
  /** Gruppenkette eines Produkts (eigene Gruppe und alle übergeordneten) */
  E.gruppenKette = (mo, prod) => {
    const out = []; let g = (mo.gruppen || []).find(x => x.id === prod.gruppe), n = 0;
    while (g && n++ < 30) { out.push(g.id); g = mo.gruppen.find(x => x.id === g.eltern); }
    return out;
  };
  /** Gilt die Regel für dieses Produkt? Ohne Angabe für alle; sonst Produkt direkt oder über eine (Ober-)Gruppe */
  E.imGeltungsbereich = (mo, r, prod) => {
    const p = r.produkte || [], g = r.gruppen || [];
    if (!p.length && !g.length) return true;
    if (p.includes(prod.id)) return true;
    return g.length > 0 && E.gruppenKette(mo, prod).some(x => g.includes(x));
  };
  E.regelGreift = (r, prod, sel, mo) => {
    if (!r.aktiv) return false;
    if (mo ? !E.imGeltungsbereich(mo, r, prod) : (r.produkte && r.produkte.length && !r.produkte.includes(prod.id) && !(r.gruppen || []).length)) return false;
    if (r.typ === "tabelle") return true;
    if (!r.wenn || !r.wenn.length) return false;
    return r.wenn.every(c => bedingungErfuellt(c, sel));
  };

  /** Gesperrte Werte: { merkmalId: { wertId: regel } }
      "setzen" sperrt bei Einfachauswahl alle anderen Werte (wie "nurErlauben"). */
  E.sperren = (mo, prod, sel, pm) => {
    pm = pm || E.produktMerkmale(mo, prod);
    const erlaubt = Object.fromEntries(pm.map(x => [x.m.id, x.werte.map(w => w.id)]));
    const mehr = Object.fromEntries(pm.map(x => [x.m.id, x.m.typ === "mehrfach"]));
    const g = {};
    for (const r of mo.regeln) {
      if (r.typ === "tabelle") { tabelleSperren(mo, r, prod, sel, erlaubt, g); continue; }
      if (!r.dann || !(r.dann.merkmal in erlaubt) || !E.regelGreift(r, prod, sel, mo)) continue;
      let ids;
      if (r.dann.typ === "nurErlauben" || (r.dann.typ === "setzen" && !mehr[r.dann.merkmal])) ids = erlaubt[r.dann.merkmal].filter(x => !(r.dann.werte || []).includes(x));
      else if (r.dann.typ === "setzen") ids = [];
      else ids = r.dann.werte || [];
      for (const w of ids) { (g[r.dann.merkmal] ||= {}); g[r.dann.merkmal][w] ||= r; }
    }
    return g;
  };

  /** Kombinationstabelle: nur die aufgeführten Wertekombinationen sind erlaubt.
      Für jedes Merkmal der Tabelle bleiben die Werte wählbar, die in einer Zeile stehen,
      die zu den bereits gewählten Werten der anderen Tabellenmerkmale passt. */
  function tabelleSperren(mo, r, prod, sel, erlaubt, g) {
    const t = r.tabelle; if (!r.aktiv || !t || !t.merkmale?.length || !E.imGeltungsbereich(mo, r, prod)) return;
    const ms = t.merkmale.filter(m => m in erlaubt); if (ms.length < 2) return;
    const idx = ms.map(m => t.merkmale.indexOf(m));
    for (let i = 0; i < ms.length; i++) {
      const passend = (t.zeilen || []).filter(z => ms.every((o, j) => j === i || sel[o] == null || Array.isArray(sel[o]) || z[idx[j]] === sel[o]));
      const ok = new Set(passend.map(z => z[idx[i]]));
      for (const w of erlaubt[ms[i]]) if (!ok.has(w)) { (g[ms[i]] ||= {}); g[ms[i]][w] ||= r; }
    }
  }

  /** Von Regeln automatisch gesetzte Werte: { merkmalId: { wertId: regel } } */
  E.gesetzt = (mo, prod, sel, pm) => {
    pm = pm || E.produktMerkmale(mo, prod);
    const erlaubt = Object.fromEntries(pm.map(x => [x.m.id, x.werte.map(w => w.id)]));
    const g = {};
    for (const r of mo.regeln) {
      if (r.dann?.typ !== "setzen" || !(r.dann.merkmal in erlaubt) || !E.regelGreift(r, prod, sel, mo)) continue;
      for (const w of r.dann.werte || []) if (erlaubt[r.dann.merkmal].includes(w)) { (g[r.dann.merkmal] ||= {}); g[r.dann.merkmal][w] ||= r; }
    }
    return g;
  };

  /** Feldtypen eines Merkmals (wie in CPQ-Standards: Auswahl, Mehrfachauswahl, Ja/Nein, Zahl, Text, fester Inhalt) */
  E.FELDTYPEN = [
    ["kacheln", "Auswahl als Kacheln", "genau ein Code, große Kacheln mit Bild"],
    ["liste", "Auswahl als Liste", "genau ein Code, Optionsfelder untereinander"],
    ["dropdown", "Auswahl als Dropdown", "genau ein Code, platzsparend bei vielen Codes"],
    ["janein", "Ja/Nein", "ein Code zum Ankreuzen, z. B. Arbeitsscheinwerfer"],
    ["mehrfach", "Mehrfachauswahl", "beliebig viele Codes ankreuzen, z. B. Zubehör"],
    ["zahl", "Zahl", "Eingabe einer Menge oder eines Maßes, Preis je Einheit"],
    ["text", "Freitext", "z. B. Beschriftung, Kundenwunsch; optional mit Code und Preis"],
    ["fest", "Fest enthalten", "alle Codes immer enthalten, nur Anzeige"]];
  const SPEZIAL = new Set(["zahl", "text", "fest"]);
  /** Feldtyp je Wert (Vertriebscode). „auswahl“ = gehört zur Auswahl der Gruppe, die anderen stehen für sich. */
  E.WERTTYPEN = [
    ["auswahl", "Auswahl", "Teil der Auswahl dieser Gruppe (eine oder mehrere, je nach Gruppe)"],
    ["janein", "Ja/Nein", "eigenes Häkchen, unabhängig von der Auswahl"],
    ["zahl", "Zahl", "Menge oder Maß eingeben, Preis gilt je Einheit"],
    ["text", "Freitext", "Text eingeben, z. B. Beschriftung; Preis fällt an, sobald Text da ist"],
    ["fest", "Fest enthalten", "immer dabei (Grundausstattung), nur Anzeige"]];
  /** Wie die Auswahl-Werte einer Gruppe angeboten werden */
  E.GRUPPENTYPEN = [["kacheln", "eine Auswahl · Kacheln"], ["liste", "eine Auswahl · Liste"], ["dropdown", "eine Auswahl · Dropdown"], ["mehrfach", "mehrere wählbar"]];
  E.wertTyp = (m, w) => (w && w.feld) || (SPEZIAL.has(m.typ) ? m.typ : "auswahl");
  E.schluessel = (m, w) => m.id + "." + w.id;
  E.wahlWerte = (m, werte) => (werte || m.werte).filter(w => E.wertTyp(m, w) === "auswahl");
  E.aktiv = (sel, m, w) => E.wertTyp(m, w) === "auswahl" ? alsListe(sel[m.id]).includes(w.id) : aktivWert(sel[E.schluessel(m, w)]);
  E.wertTypSetzen = (w, t) => { if (t === "auswahl") delete w.feld; else w.feld = t; if (t === "zahl") w.zahl = Object.assign({ min: 0, max: null, schritt: 1, einheit: "Stk", standard: 0 }, w.zahl || {}); if (t === "text") w.text = Object.assign({ maxLaenge: 60, hinweis: "" }, w.text || {}); };
  E.gruppentyp = m => { const f = E.feldtyp(m); return f === "janein" ? "mehrfach" : SPEZIAL.has(f) ? "liste" : f; };
  E.feldtyp = m => {
    if (SPEZIAL.has(m.typ)) return m.typ;
    if (m.typ === "mehrfach") return m.feld === "mehrfach" ? "mehrfach" : m.feld === "janein" || m.werte.length === 1 ? "janein" : "mehrfach";
    const d = m.darstellung || (m.werte.length > 6 ? "auswahl" : "liste");
    return d === "kacheln" ? "kacheln" : d === "auswahl" ? "dropdown" : "liste";
  };
  E.feldtypSetzen = (m, t) => {
    if (SPEZIAL.has(t) || t === "janein") { for (const w of m.werte) E.wertTypSetzen(w, t); if (t === "janein") { m.typ = "mehrfach"; m.feld = "mehrfach"; m.darstellung = "option"; } else { m.typ = "mehrfach"; m.feld = "mehrfach"; delete m.darstellung; } return; }
    const art = { kacheln: ["einfach", "kacheln"], liste: ["einfach", "liste"], dropdown: ["einfach", "auswahl"], janein: ["mehrfach", "option"], mehrfach: ["mehrfach", "option"] }[t];
    if (art) { m.typ = art[0]; m.darstellung = art[1]; } else { m.typ = t; delete m.darstellung; }
    m.feld = t;
    if (t === "zahl") m.zahl = Object.assign({ min: 0, max: null, schritt: 1, einheit: "Stk", standard: 0 }, m.zahl || {});
    if (t === "text") m.text = Object.assign({ maxLaenge: 60, hinweis: "" }, m.text || {});
  };
  E.istSpezial = m => SPEZIAL.has(m.typ);
  /** Darstellung im Konfigurator, mit sinnvollem Standard */
  E.darstellung = m => m.darstellung || (m.typ === "mehrfach" ? "option" : m.werte.length > 6 ? "auswahl" : "liste");
  E.bereich = m => m.bereich || (m.typ === "mehrfach" ? "Optionen" : "Grundmaschine");

  /** Pflichtmerkmale ohne Auswahl */
  E.offenePflicht = (mo, prod, sel) => E.produktMerkmale(mo, prod).filter(x => x.m.pflicht && x.m.typ !== "mehrfach" && E.wahlWerte(x.m, x.werte).length && (sel[x.m.id] == null || sel[x.m.id] === "")).map(x => x.m);

  /** Vertriebscode → { m, w } */
  E.codeIndex = mo => {
    const map = new Map();
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) map.set(String(w.code).toUpperCase(), { m, w });
    return map;
  };

  E.aktiveRegeln = (mo, prod, sel) => mo.regeln.filter(r => r.typ === "tabelle" ? (r.aktiv && E.imGeltungsbereich(mo, r, prod) && (r.tabelle?.merkmale || []).filter(m => m in sel).length >= 2) : E.regelGreift(r, prod, sel, mo));

  /** Ungültig gewordene Werte durch den ersten gültigen ersetzen. `fest` bleibt unangetastet. */
  E.bereinige = (mo, prod, sel, fest) => {
    const pm = E.produktMerkmale(mo, prod), notes = [];
    // fehlende Merkmale ergänzen, fremde Werte entfernen. Pflichtmerkmale bleiben offen (null).
    for (const { m, werte: alleW, standard } of pm) {
      for (const w of alleW) {
        const t = E.wertTyp(m, w), k = E.schluessel(m, w); if (t === "auswahl") { delete sel[k]; continue; }
        if (t === "janein") sel[k] = sel[k] === undefined ? !!(w.vorgabe || (standard && String(standard).split(",").includes(w.id))) : !!sel[k];
        else if (t === "fest") sel[k] = true;
        else if (t === "text") sel[k] = typeof sel[k] === "string" ? sel[k].slice(0, (w.text && w.text.maxLaenge) || 200) : (w.text?.standard || "");
        else if (t === "zahl") { const z = w.zahl || {}; let v = sel[k] === "" || sel[k] == null ? (z.standard ?? 0) : Number(sel[k]); if (!isFinite(v)) v = z.standard ?? 0; if (z.min != null && v < z.min) v = z.min; if (z.max != null && v > z.max) v = z.max; sel[k] = v; }
      }
      const werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
      if (!werte.length) { delete sel[m.id]; continue; }
      const ids = werte.map(w => w.id);
      if (m.typ === "zahl") { const z = m.zahl || {}; let v = sel[m.id] === "" || sel[m.id] == null ? (m.pflicht ? null : (z.standard ?? 0)) : Number(sel[m.id]); if (v != null) { if (!isFinite(v)) v = z.standard ?? 0; if (z.min != null && v < z.min) v = z.min; if (z.max != null && v > z.max) v = z.max; } sel[m.id] = v; continue; }
      if (m.typ === "text") { sel[m.id] = typeof sel[m.id] === "string" ? sel[m.id].slice(0, (m.text && m.text.maxLaenge) || 200) : ""; continue; }
      if (m.typ === "fest") { sel[m.id] = ids.slice(); continue; }
      if (m.typ === "mehrfach") sel[m.id] = sel[m.id] === undefined && standard ? standard.split(",").filter(x => ids.includes(x)) : alsListe(sel[m.id]).filter(x => ids.includes(x));
      else if (!ids.includes(sel[m.id])) sel[m.id] = m.pflicht ? null : (standard && ids.includes(standard) ? standard : ids[0]);
    }
    for (const k of Object.keys(sel)) { const [mid, wid] = k.split("."); const x = pm.find(y => y.m.id === mid); if (!x || (wid && !x.werte.some(w => w.id === wid && E.wertTyp(x.m, w) !== "auswahl"))) delete sel[k]; }
    for (let i = 0; i < 40; i++) {
      let geaendert = false;
      // 1) "setzt"-Regeln anwenden
      const gs = E.gesetzt(mo, prod, sel, pm);
      for (const { m } of pm) {
        if (!gs[m.id]) continue;
        // Ja/Nein-Werte, die eine Regel setzt
        for (const [wid, r] of Object.entries(gs[m.id])) { const w = E.wert(mo, m.id, wid); if (w && E.wertTyp(m, w) === "janein" && sel[E.schluessel(m, w)] !== true) { sel[E.schluessel(m, w)] = true; notes.push({ merkmal: m.name, von: "–", nach: w.name, regel: r.id }); geaendert = true; } }
        if (SPEZIAL.has(m.typ) || !sel.hasOwnProperty(m.id)) continue;
        for (const [wid, r] of Object.entries(gs[m.id])) {
          if (E.wertTyp(m, E.wert(mo, m.id, wid)) !== "auswahl") continue;
          if (m.typ === "mehrfach") { if (!sel[m.id].includes(wid)) { sel[m.id] = [...sel[m.id], wid]; notes.push({ merkmal: m.name, von: "–", nach: E.wert(mo, m.id, wid).name, regel: r.id }); geaendert = true; } }
          else if (sel[m.id] !== wid && m.id !== fest) { notes.push({ merkmal: m.name, von: sel[m.id] ? E.wert(mo, m.id, sel[m.id]).name : "offen", nach: E.wert(mo, m.id, wid).name, regel: r.id }); sel[m.id] = wid; geaendert = true; }
          break;
        }
      }
      // 2) gesperrte Werte ersetzen: von hinten nach vorn und nach jeder Änderung neu rechnen,
      //    damit bei Kombinationstabellen das später stehende Merkmal angepasst wird
      if (geaendert) continue;
      const g = E.sperren(mo, prod, sel, pm);
      for (const { m, werte: alleW } of [...pm].reverse()) {
        if (geaendert) break;
        if (!g[m.id]) continue;
        // gesperrte Ja/Nein-, Zahl- und Textwerte zurücksetzen
        for (const w of alleW) { const t = E.wertTyp(m, w), k = E.schluessel(m, w); if (t === "auswahl" || t === "fest" || !g[m.id][w.id] || !aktivWert(sel[k])) continue; notes.push({ merkmal: m.name, von: w.name, nach: "entfernt", regel: g[m.id][w.id].id }); sel[k] = t === "janein" ? false : t === "zahl" ? 0 : ""; geaendert = true; }
        const werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
        if (geaendert || m.id === fest || SPEZIAL.has(m.typ) || !werte.length) continue;
        if (m.typ === "mehrfach") {
          const raus = sel[m.id].filter(x => g[m.id][x]);
          if (raus.length) {
            for (const x of raus) notes.push({ merkmal: m.name, von: E.wert(mo, m.id, x).name, nach: "entfernt", regel: g[m.id][x].id });
            sel[m.id] = sel[m.id].filter(x => !g[m.id][x]); geaendert = true;
          }
          continue;
        }
        const r = sel[m.id] != null && g[m.id][sel[m.id]];
        if (r) {
          const alt = m.pflicht ? null : werte.find(w => !g[m.id][w.id]);
          const einzig = werte.filter(w => !g[m.id][w.id]);
          if (m.pflicht && einzig.length !== 1) { notes.push({ merkmal: m.name, von: E.wert(mo, m.id, sel[m.id]).name, nach: "bitte neu wählen", regel: r.id }); sel[m.id] = null; geaendert = true; }
          else if (alt || einzig.length === 1) { const n = alt || einzig[0]; notes.push({ merkmal: m.name, von: E.wert(mo, m.id, sel[m.id]).name, nach: n.name, regel: r.id }); sel[m.id] = n.id; geaendert = true; }
        }
      }
      if (!geaendert) break;
    }
    return notes;
  };

  E.standardSel = (mo, prod) => { const s = {}; E.bereinige(mo, prod, s); return s; };

  /** Ist die Auswahl gültig? Liefert Konflikte. */
  E.pruefe = (mo, prod, sel) => {
    const g = E.sperren(mo, prod, sel), k = [];
    for (const [mid, v] of Object.entries(sel)) for (const x of alsListe(v)) if (g[mid]?.[x]) k.push({ merkmal: mid, wert: x, regel: g[mid][x].id });
    return k;
  };

  function faktor(mo, m, sel) {
    if (!m.multiplikator) return 1;
    if (E.merkmal(mo, m.multiplikator)?.typ === "zahl") return Math.max(0, Number(sel[m.multiplikator]) || 0);
    const w = E.wert(mo, m.multiplikator, sel[m.multiplikator]);
    return w && w.menge ? w.menge : 1;
  }

  /** Preis- und Kostenzeilen einer Konfiguration. */
  /** Preis eines Codes je Produktgruppe: Artikel > Unterfamilie > Familie > Preis am Wert */
  E.gruppenPreis = (objs, w) => {
    if (!w || !w.code) return null; const c = String(w.code).toUpperCase();
    for (let i = objs.length - 1; i >= 0; i--) { const pr = objs[i] && objs[i].preise; if (pr && pr[c] != null) return { preis: pr[c], von: objs[i] }; }
    return null;
  };
  E.wertPreis = (mo, prod, w) => { if (!w) return 0; const o = prod ? E.gruppenPreis([...E.gruppenPfad(mo, prod.gruppe), prod], w) : null; return o ? o.preis : (w.preis || 0); };
  E.wertPreisGruppe = (mo, gid, w) => { if (!w) return 0; const o = E.gruppenPreis(E.gruppenPfad(mo, gid), w); return o ? o.preis : (w.preis || 0); };
  E.preis = (mo, prod, sel) => {
    const zeilen = [{ mid: "_basis", merkmal: "Grundfahrzeug", text: prod.name, preis: prod.basispreis || 0, kosten: prod.basiskosten || 0 }];
    for (const { m, werte } of E.produktMerkmale(mo, prod)) {
      const f = faktor(mo, m, sel), ue = m.ueberschrift || m.abschnitt || "";
      const gewaehlt = new Set(alsListe(sel[m.id]));
      for (const w of werte) {
        const t = E.wertTyp(m, w), v = sel[E.schluessel(m, w)], basis = { mid: m.id, wid: w.id, code: w.code || "", merkmal: m.name, ueberschrift: ue };
        if (t === "auswahl" ? !gewaehlt.has(w.id) : !aktivWert(v)) continue;
        if (t === "zahl") { const e = (w.zahl && w.zahl.einheit) || ""; zeilen.push({ ...basis, text: `${w.name}: ${String(v).replace(".", ",")} ${e}`.trim(), preis: Math.round(E.wertPreis(mo, prod, w) * v * f), kosten: Math.round((w.kosten || 0) * v * f), menge: v }); continue; }
        if (t === "text") { zeilen.push({ ...basis, text: `${w.name}: „${String(v).trim()}“`, preis: Math.round(E.wertPreis(mo, prod, w) * f), kosten: Math.round((w.kosten || 0) * f) }); continue; }
        zeilen.push({ mid: m.id, wid: w.id, code: w.code || "", merkmal: m.name, ueberschrift: m.ueberschrift || m.abschnitt || "", text: w.name + (f > 1 && (w.preis || w.kosten) ? ` (× ${f})` : ""),
          preis: Math.round(E.wertPreis(mo, prod, w) * f), kosten: Math.round((w.kosten || 0) * f) });
      }
    }
    const einzel = zeilen.reduce((a, z) => a + z.preis, 0), kosten = zeilen.reduce((a, z) => a + z.kosten, 0);
    return { zeilen, einzel, kosten };
  };

  E.stueckliste = (mo, prod, sel) => {
    const map = new Map();
    const add = (z, herkunft, f) => {
      const [nr, bez, menge, me] = z, q = Math.round(menge * f * 100) / 100;
      if (map.has(nr)) map.get(nr).menge += q; else map.set(nr, { nr, bez, menge: q, me, herkunft });
    };
    for (const z of prod.stl || []) add(z, "Grundfahrzeug", 1);
    for (const { m } of E.produktMerkmale(mo, prod)) {
      const f = faktor(mo, m, sel);
      for (const w of m.werte) {
        if (!E.aktiv(sel, m, w)) continue; const t = E.wertTyp(m, w), n = t === "zahl" ? Number(sel[E.schluessel(m, w)]) || 0 : 1;
        for (const z of w.stl || []) add(z, m.name + ": " + w.name, f * n);
      }
    }
    return [...map.values()];
  };

  /** Summen eines Angebots inkl. Kalkulation. */
  E.summen = (a, mwst = 19) => {
    let liste = 0, nachPos = 0, kosten = 0;
    const pos = (a.positionen || []).map(p => {
      const brutto = (p.einzel || 0) * (p.menge || 0), rab = Math.round(brutto * (p.rabatt || 0)) / 100, ges = brutto - rab;
      liste += brutto; nachPos += ges; kosten += (p.kosten || 0) * (p.menge || 0);
      return { ...p, gesamt: ges };
    });
    const gRab = Math.round(nachPos * (a.rabatt || 0)) / 100, netto = nachPos - gRab, ust = Math.round(netto * mwst) / 100;
    const db = netto - kosten;
    return { pos, liste, posRabatt: liste - nachPos, gesamtRabatt: gRab, netto, kosten, db, marge: netto ? db / netto * 100 : 0, ust, brutto: netto + ust };
  };

  /** Regel als deutscher Satz. */
  E.satz = (mo, r) => {
    if (r.typ === "tabelle") {
      const t = r.tabelle || { merkmale: [], zeilen: [] }, namen = t.merkmale.map(m => E.merkmal(mo, m)?.name || m);
      let alle = 1; for (const m of t.merkmale) alle *= (E.merkmal(mo, m)?.werte.length || 1);
      return `Nur ${t.zeilen.length} von ${alle} Kombinationen aus ${namen.join(", ")} sind erlaubt.`;
    }
    const nm = (mid, ids) => { const m = E.merkmal(mo, mid); return { m: m ? m.name : mid, w: (ids || []).map(id => E.wert(mo, mid, id)?.name || id) }; };
    const oder = l => l.length <= 1 ? (l[0] || "…") : l.slice(0, -1).join(", ") + " oder " + l[l.length - 1];
    const wenn = (r.wenn || []).map(c => { const x = nm(c.merkmal, c.werte); return `${x.m} ${c.op === "istNicht" ? "nicht" : "ist"} ${oder(x.w)}`; }).join(" und ");
    const d = r.dann ? nm(r.dann.merkmal, r.dann.werte) : { m: "…", w: [] };
    const und = l => l.length <= 1 ? (l[0] || "…") : l.slice(0, -1).join(", ") + " und " + l[l.length - 1];
    const dann = r.dann?.typ === "nurErlauben" ? `ist bei ${d.m} nur ${oder(d.w)} erlaubt` : r.dann?.typ === "setzen" ? `wird bei ${d.m} ${und(d.w)} automatisch gewählt` : `ist bei ${d.m} ${oder(d.w)} gesperrt`;
    return `Wenn ${wenn || "…"}, dann ${dann}.`;
  };

  /** Modelltest: alle Kombinationen der Einfach-Merkmale durchrechnen. */
  E.modelltest = (mo, prod, limit = 400000) => {
    const pm = E.produktMerkmale(mo, prod), einfach = pm.filter(x => x.m.typ !== "mehrfach"), mehr = pm.filter(x => x.m.typ === "mehrfach");
    let total = 1; for (const x of einfach) total *= x.werte.length;
    const res = { total, geprueft: 0, gueltig: 0, widersprueche: 0, beispielWiderspruch: null, abgebrochen: total > limit };
    const erreichbar = {}, gefeuert = {};
    for (const { m } of pm) erreichbar[m.id] = new Set();
    const idx = einfach.map(() => 0);
    const sel = {}; for (const x of mehr) sel[x.m.id] = [];
    const n = Math.min(total, limit);
    for (let c = 0; c < n; c++) {
      einfach.forEach((x, i) => sel[x.m.id] = x.werte[idx[i]].id);
      const g = E.sperren(mo, prod, sel, pm);
      for (const r of mo.regeln) if (r.typ !== "tabelle" && E.regelGreift(r, prod, sel, mo)) gefeuert[r.id] = (gefeuert[r.id] || 0) + 1;
      for (const [mid, ws] of Object.entries(g)) for (const r of Object.values(ws)) if (r.typ === "tabelle") gefeuert[r.id] = (gefeuert[r.id] || 0) + 1;
      const ok = einfach.every(x => !g[x.m.id]?.[sel[x.m.id]]);
      const leer = pm.find(x => x.werte.length && x.m.typ !== "mehrfach" && x.werte.every(w => g[x.m.id]?.[w.id]));
      if (leer) { res.widersprueche++; if (!res.beispielWiderspruch) res.beispielWiderspruch = { sel: { ...sel }, merkmal: leer.m.name }; }
      if (ok) {
        res.gueltig++;
        einfach.forEach(x => erreichbar[x.m.id].add(sel[x.m.id]));
        for (const x of mehr) for (const w of x.werte) if (!g[x.m.id]?.[w.id]) erreichbar[x.m.id].add(w.id);
      }
      res.geprueft++;
      for (let i = einfach.length - 1; i >= 0; i--) { idx[i]++; if (idx[i] < einfach[i].werte.length) break; idx[i] = 0; }
    }
    res.tote = [];
    for (const { m, werte } of pm) for (const w of werte) if (!erreichbar[m.id].has(w.id)) res.tote.push({ merkmal: m.name, mid: m.id, wert: w.name, wid: w.id });
    const relevant = mo.regeln.filter(r => r.aktiv && E.imGeltungsbereich(mo, r, prod));
    res.regeln = relevant.map(r => {
      const mehrBed = (r.wenn || []).some(c => mehr.some(x => x.m.id === c.merkmal));
      return { id: r.id, name: r.name, treffer: gefeuert[r.id] || 0, nurMitZubehoer: mehrBed };
    });
    return res;
  };

  E.neueId = (prefix, vorhandene) => {
    let i = 1; const set = new Set(vorhandene);
    while (set.has(prefix + String(i).padStart(2, "0"))) i++;
    return prefix + String(i).padStart(2, "0");
  };

  E.slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "x";

  if (typeof module !== "undefined" && module.exports) module.exports = E;
  else { root.KONF = root.KONF || {}; root.KONF.E = E; }
})(typeof window !== "undefined" ? window : globalThis);


/* ===== store.js ===== */
/* =========================================================================
   Datenschicht
   Eine Schnittstelle, zwei Umsetzungen:
   - "db":   gemeinsamer Datenspeicher dieses Prototyps (live, mehrere Nutzer)
   - "demo": nur im Speicher, geladen aus daten/demo.json (nichts wird gesichert)
   Für APplus wird eine dritte Umsetzung geschrieben, die dieselben Methoden
   über Queries und Tabellen bedient. Der Rest der Anwendung ruft nur K.Store.

   Dokumente:
     modell/entwurf, modell/live      Konfigurationsmodell (Pflege / freigegeben)
     releases/v<N>                    Freigabe-Historie
     kunden/<id>, angebote/<nr>       Adressen, Angebote (Aufrufe im Angebot)
     einstellungen/allgemein          Firma, Vertrieb, Nummernkreis, Vorlage
     protokoll/<JJJJ-MM>              Änderungsprotokoll je Monat
     data/users/<id>/prefs            Favoriten je Nutzer
   ========================================================================= */
(function () {
  const K = window.KONF;
  const clone = o => JSON.parse(JSON.stringify(o));
  /** Vertriebsmitarbeiter aus APplus (z. B. PERSONAL bzw. Vertreter) */
  const vertriebAusZeile = z => {
    const n = {}; for (const [k, v] of Object.entries(z)) n[String(k).toLowerCase().replace(/[^a-z0-9]/g, "")] = v;
    const f = (...ks) => { for (const k of ks) if (n[k] != null && String(n[k]).trim()) return String(n[k]).trim(); return ""; };
    const nr = f("personal", "personalnr", "vertreter", "kuerzel", "mitarbeiter", "nr", "id");
    const name = f("name") || [f("vorname"), f("nachname")].filter(Boolean).join(" ") || f("suchname");
    return { id: "p" + String(nr || name).replace(/[^A-Za-z0-9_-]/g, ""), nr, name, tel: f("telefon", "tel", "durchwahl"), mail: f("email", "mail"), funktion: f("funktion", "abteilung", "position") };
  };
  const kundeAusZeile = z => {
    const n = {}; for (const [k, v] of Object.entries(z)) n[String(k).toLowerCase().replace(/[^a-z0-9]/g, "")] = v;
    const f = (...ks) => { for (const k of ks) if (n[k] != null && String(n[k]).trim()) return String(n[k]).trim(); return ""; };
    const nr = f("kundennr", "kundennummer", "kunde", "adresse", "nr", "id");
    return { id: "k" + (nr || Math.random().toString(36).slice(2, 8)).replace(/[^A-Za-z0-9_-]/g, ""), nr, firma: f("firma", "name", "kundenname", "name1", "suchname"), person: f("ansprechpartner", "kontakt", "person"),
      strasse: f("strasse", "str", "anschrift"), ort: f("ort") && f("plz") ? f("plz") + " " + f("ort") : f("ort", "plzort"), land: f("land") || "DE", mail: f("email", "mail"), tel: f("telefon", "tel"), notiz: "" };
  };
  const leer = () => ({ entwurf: null, live: null, kunden: [], angebote: [], einst: null, releases: [], protokoll: [], prefs: { favoriten: [] }, geladen: false });

  const Store = K.Store = {
    modus: "laden", db: null, user: null, uid: null, schreiben: true, S: leer(), hoerer: [],
    onChange(fn) { this.hoerer.push(fn); },
    _melde(was) { if (this.S.geladen && was !== "alles") this._lokalSichern(); for (const f of this.hoerer) try { f(was); } catch (e) { console.error(e); } },

    async init() {
      let db = null, user = null;
      try {
        if (window.claude && window.claude.use) [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      } catch (e) { db = null; }
      this.user = user;
      if (db) {
        this.db = db; this.modus = "db";
        try { this.uid = user ? await user.id() : null; } catch (e) { this.uid = null; }
        try { const c = user ? await user.can("data.write") : null; this.schreiben = c !== false; } catch (e) {}
        this._abonnieren();
        const ex = this._artikelAusExcel();
        if (ex && ex.length) { this.artikelSetzen(ex, "excel"); this._melde("artikel"); }
        else this.demoDaten().then(d => { this.artikelSetzen(d.artikel || [], "beispiel"); this._melde("artikel"); }).catch(() => {});
      } else {
        this.modus = "lokal";
        await this.ladeLokal();
      }
    },

    /* ---------- Betrieb ohne Claude (z. B. APplus): Browser-Speicher + APplus-Abfragen ---------- */
    _schluessel() { return (K.cfg && K.cfg.storageKey) || "konf-v1"; },
    async ladeLokal() {
      const S = this.S; let gespeichert = null;
      try { gespeichert = JSON.parse(localStorage.getItem(this._schluessel()) || "null"); } catch (e) { gespeichert = null; }
      const d = await this.demoDaten();
      const q = await this._applusLaden();
      const quelle = gespeichert || { entwurf: d.modell, live: d.modell, kunden: d.kunden, angebote: d.angebote, einst: d.einstellungen, releases: d.releases, protokoll: d.protokoll, prefs: { favoriten: [] } };
      Object.assign(S, clone(quelle));
      if (q.modell) {
        // Stammdaten aus APplus sind führend: Live-Stand immer aus den Abfragen, Entwurf bleibt bis zur Freigabe
        q.modell.version = Math.max(S.live?.version || 0, 1); S.live = q.modell;
        if (!gespeichert || !gespeichert.entwurf || gespeichert.quelle !== "applus") S.entwurf = clone(q.modell);
      }
      if (q.kunden) S.kunden = q.kunden;
      if (q.vertrieb && q.vertrieb.length) { S.einst ||= d.einstellungen; S.einst.vertrieb = q.vertrieb; S.einst.vertriebQuelle = "applus"; }
      const ex = q.artikel ? null : this._artikelAusExcel();
      this.artikelSetzen(q.artikel || ex || d.artikel || [], q.artikel ? "applus" : ex && ex.length ? "excel" : "beispiel");
      if (q.artikel) this.stammAnwenden();
      if (!S.einst) S.einst = d.einstellungen;
      S.prefs ||= { favoriten: [] }; S.quelle = q.modell ? "applus" : "lokal"; S.geladen = true;
      this._melde("alles");
    },
    async _applusLaden() {
      const out = {}, cfg = K.cfg || {}, qs = cfg.queries || {}; this.ladefehler = []; this.applusQuellen = 0;
      if (!cfg.loadQuery) return out;
      const blaetter = {};
      await Promise.all(["katalog", "produkte", "merkmale", "codes", "regeln", "stueckliste", "kunden", "artikel", "vertrieb"].map(async typ => {
        if (!qs[typ]) return;
        try {
          const rows = await cfg.loadQuery(qs[typ], typ);
          if (!Array.isArray(rows)) return;
          this.applusQuellen++;
          if (typ === "kunden") { out.kunden = rows.map(kundeAusZeile).filter(k => k.firma); return; }
          if (typ === "vertrieb") { out.vertrieb = rows.map(vertriebAusZeile).filter(v => v.name); return; }
          if (typ === "artikel") { out.artikel = rows; return; }
          const kopf = [...new Set(rows.flatMap(r => Object.keys(r)))];
          blaetter[typ] = [kopf, ...rows.map(r => kopf.map(h => r[h] ?? ""))];
        } catch (e) { console.warn("[Konfigurator] Abfrage fehlgeschlagen:", qs[typ], e); this.ladefehler.push(qs[typ] + ": " + (e.message || e)); }
      }));
      if (Object.keys(blaetter).length && K.X) {
        const zuo = K.X.zuordnungVorschlagen(blaetter, (this.S.einst || {}).importZuordnung);
        const r = K.X.umwandeln(blaetter, zuo, null, "ersetzen");
        if (r.warn.length) console.info("[Konfigurator] Hinweise beim Lesen der APplus-Abfragen:", r.warn);
        if (r.modell.produkte.length) out.modell = r.modell;
      }
      return out;
    },
    /* ---------- Artikelstamm (APplus-Tabelle ARTIKEL, Feld ARTIKEL) ---------- */
    artikel: new Map(), artikelQuelle: null,
    artikelSetzen(rows, quelle) {
      const sp = (K.cfg && K.cfg.artikelSpalten) || {}, map = new Map();
      const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g, "");
      for (const r of rows || []) {
        const n = {}; for (const [k, v] of Object.entries(r)) n[norm(k)] = v;
        const f = (key, fallback) => { for (const c of (sp[key] || []).concat(fallback || [])) { const v = n[norm(c)]; if (v != null && String(v).trim() !== "") return v; } return ""; };
        const code = String(f("code", ["code", "artikel"])).trim(); if (!code) continue;
        const zahl = v => typeof v === "number" ? v : (K.X ? K.X.zahl(v) : parseFloat(String(v).replace(",", ".")) || 0);
        map.set(code.toUpperCase(), { code, name: String(f("name", ["name"])).trim(), preis: zahl(f("preis", ["preis"])), kosten: zahl(f("kosten", ["kosten"])), me: String(f("me", ["me"])).trim(), gruppe: String(f("gruppe", ["gruppe"])).trim() });
      }
      this.artikel = map; this.artikelQuelle = map.size ? quelle : null;
    },
    /** Artikelstamm aus einer Excel-Mappe (Blatt „Import“), wenn APplus keinen liefert */
    artikelImport(rows) {
      const alt = [...this.artikel.values()].filter(() => this.artikelQuelle === "excel").map(a => ({ ARTIKEL: a.code, NAME: a.name, VKPREIS: a.preis, HERSTELLKOSTEN: a.kosten, ME: a.me }));
      const neu = new Map(alt.map(r => [String(r.ARTIKEL).toUpperCase(), r])); for (const r of rows) neu.set(String(r.ARTIKEL).toUpperCase(), r);
      const liste = [...neu.values()]; this.artikelSetzen(liste, "excel");
      try { localStorage.setItem(this._schluessel() + "-artikel", JSON.stringify(liste)); } catch (e) {}
      this._melde && this._melde("artikel");
    },
    _artikelAusExcel() { try { return JSON.parse(localStorage.getItem(this._schluessel() + "-artikel") || "null"); } catch (e) { return null; } },
    /**
     * APplus ist führend für Stammdaten: Bezeichnung und Preis jedes Codes und jedes Fahrzeugs, das als Artikel
     * in ARTIKEL steht, werden beim Laden übernommen. Ausnahme: im Studio bewusst überschrieben (apStamm = false).
     * Preise je Produktgruppe (Excel-Import „Codes und Preise“) gelten weiterhin vorrangig.
     */
    stammAnwenden() {
      if (this.artikelQuelle !== "applus") return 0; let n = 0;
      for (const mo of [this.S.live, this.S.entwurf]) {
        if (!mo) continue;
        for (const m of mo.merkmale || []) for (const w of m.werte) {
          if (w.apStamm === false || !w.code) continue; const a = this.artikelZu(w.code); if (!a) continue;
          if (a.name && w.name !== a.name) { w.name = a.name; n++; } if (a.preis != null && w.preis !== a.preis) { w.preis = a.preis; n++; } if (a.kosten && w.kosten !== a.kosten) w.kosten = a.kosten;
        }
        for (const p of mo.produkte || []) {
          if (p.apStamm === false || !p.code) continue; const a = this.artikelZu(p.code); if (!a) continue;
          if (a.preis && p.basispreis !== a.preis) { p.basispreis = a.preis; n++; } if (a.kosten) p.basiskosten = a.kosten;
        }
      }
      return n;
    },
    artikelZu(code) { return code ? this.artikel.get(String(code).trim().toUpperCase()) || null : null; },
    artikelSuche(q, n = 12) {
      q = String(q || "").trim().toLowerCase(); if (!q) return [];
      const out = [], spaeter = [];
      for (const a of this.artikel.values()) {
        const c = a.code.toLowerCase(), nm = a.name.toLowerCase();
        if (c.startsWith(q)) out.push(a); else if (c.includes(q) || nm.includes(q)) spaeter.push(a);
        if (out.length >= n) break;
      }
      return out.concat(spaeter).slice(0, n);
    },
    _lokalTimer: null,
    _lokalSichern() {
      if (this.modus !== "lokal") return;
      clearTimeout(this._lokalTimer);
      this._lokalTimer = setTimeout(() => {
        const S = this.S;
        try { localStorage.setItem(this._schluessel(), JSON.stringify({ entwurf: S.entwurf, live: S.live, kunden: S.kunden, angebote: S.angebote, einst: S.einst, releases: S.releases, protokoll: S.protokoll, prefs: S.prefs, quelle: S.quelle })); }
        catch (e) { console.warn("[Konfigurator] Browser-Speicher voll oder gesperrt", e); }
      }, 400);
    },
    lokalZuruecksetzen() { try { localStorage.removeItem(this._schluessel()); } catch (e) {} },

    async demoDaten() {
      if (window.KONF_DEMO_DATEN) return JSON.parse(JSON.stringify(window.KONF_DEMO_DATEN));
      const inline = document.getElementById("demo-daten");
      if (inline) return JSON.parse(inline.textContent);
      const r = await fetch("daten/demo.json"); return r.json();
    },

    async ladeDemo() {
      const d = await this.demoDaten(); const S = this.S;
      S.entwurf = clone(d.modell); S.live = clone(d.modell); S.kunden = d.kunden; S.angebote = d.angebote;
      S.einst = d.einstellungen; S.releases = d.releases; S.protokoll = d.protokoll; S.geladen = true;
      this._melde("alles");
    },

    /** Leeren Datenspeicher mit dem Startmodell füllen (nur auf Knopfdruck). */
    async startmodellLaden() {
      const d = await this.demoDaten(), db = this.db;
      if (!db) { this.lokalZuruecksetzen(); return this.ladeLokal(); }
      await db.doc("modell/entwurf").set(d.modell);
      await db.doc("modell/live").set(d.modell);
      await db.doc("einstellungen/allgemein").set(d.einstellungen);
      for (const k of d.kunden) await db.doc("kunden/" + k.id).set(k);
      for (const a of d.angebote) await db.doc("angebote/" + a.nr).set(a);
      for (const r of d.releases) await db.doc("releases/v" + r.version).set(r);
      for (const p of d.protokoll) await db.doc("protokoll/" + p.monat).set(p);
    },

    _abonnieren() {
      const db = this.db, S = this.S, self = this;
      const fehler = e => { console.warn("Datenspeicher", e); if (e && e.code === "revoked") { self.schreiben = false; self._melde("fehler"); } };
      let offen = 5; const fertig = () => { if (--offen === 0) { S.geladen = true; self._melde("alles"); } };
      const einmal = fn => { let f = false; return (...a) => { fn(...a); if (!f) { f = true; fertig(); } }; };
      db.doc("modell/entwurf").onSnapshot(einmal(s => { if (!self._entwurfOffen) S.entwurf = s.exists ? clone(s.data()) : null; self._melde("entwurf"); }), fehler);
      db.doc("modell/live").onSnapshot(einmal(s => { S.live = s.exists ? clone(s.data()) : null; self._melde("live"); }), fehler);
      db.collection("kunden").onSnapshot(einmal(q => { S.kunden = q.docs.map(d => d.data()); self._melde("kunden"); }), fehler);
      db.collection("angebote").onSnapshot(einmal(q => { S.angebote = q.docs.map(d => d.data()); self._melde("angebote"); }), fehler);
      db.doc("einstellungen/allgemein").onSnapshot(einmal(s => { S.einst = s.exists ? s.data() : null; self._melde("einst"); }), fehler);
      db.collection("releases").orderBy("version", "desc").limit(50).onSnapshot(q => { S.releases = q.docs.map(d => d.data()); self._melde("releases"); }, fehler);
      db.collection("protokoll").orderBy("monat", "desc").limit(3).onSnapshot(q => { S.protokoll = q.docs.map(d => d.data()); self._melde("protokoll"); }, fehler);
      if (this.uid) db.doc("data/users/" + this.uid + "/prefs").onSnapshot(s => { S.prefs = s.exists ? clone(s.data()) : { favoriten: [] }; self._melde("prefs"); }, () => {});
    },

    async _set(pfad, daten) {
      if (this.modus !== "db") return;
      try { await this.db.doc(pfad).set(daten); }
      catch (e) {
        if (e && e.code === "invalid_argument") { this.schreiben = false; this._melde("fehler"); }
        if (e && e.code === "quota_exceeded") K.toast("Der Datenspeicher ist voll. Bitte alte Angebote löschen.");
        throw e;
      }
    },
    async _del(pfad) { if (this.modus === "db") await this.db.doc(pfad).delete(); },

    /* ---------- Modell ---------- */
    _entwurfTimer: null, _entwurfOffen: false,
    entwurfGeaendert(protokollText) {
      // Entwurf wurde lokal geändert (K.Store.S.entwurf mutiert). Gebündelt speichern.
      this._entwurfOffen = true; this._melde("entwurf");
      clearTimeout(this._entwurfTimer);
      this._entwurfTimer = setTimeout(() => this._entwurfSichern(), 700);
      if (protokollText) this._protokollMerken("Pflege", protokollText);
    },
    async _entwurfSichern() {
      const daten = clone(this.S.entwurf); daten.geaendert = Date.now(); daten.geaendertVon = this.uid;
      try { await this._set("modell/entwurf", daten); } catch (e) {}
      this._entwurfOffen = false;
    },
    async veroeffentlichen(notiz) {
      clearTimeout(this._entwurfTimer); if (this._entwurfOffen) await this._entwurfSichern();
      const S = this.S, v = (S.live?.version || 0) + 1;
      const live = clone(S.entwurf); live.version = v; live.freigegeben = Date.now(); live.freigegebenVon = this.uid;
      S.live = live; S.entwurf.version = v;
      const rel = { version: v, ts: Date.now(), von: this.uid, notiz: notiz || "", regeln: live.regeln.length, merkmale: live.merkmale.length, produkte: live.produkte.length };
      if (this.modus === "db") { await this._set("modell/live", live); await this._set("modell/entwurf", clone(S.entwurf)); await this._set("releases/v" + v, rel); }
      else { S.releases.unshift(rel); }
      await this.log("Freigabe", `Version ${v} veröffentlicht${notiz ? ": " + notiz : ""}`);
      this._melde("live");
    },
    async entwurfVerwerfen() {
      clearTimeout(this._entwurfTimer);
      this.S.entwurf = clone(this.S.live);
      await this._set("modell/entwurf", clone(this.S.entwurf)).catch(() => {});
      this._entwurfOffen = false;
      await this.log("Freigabe", "Entwurf verworfen, Stand der Version " + this.S.live.version + " wiederhergestellt");
      this._melde("entwurf");
    },
    async alteVersionLaden(v) {
      // Nur der aktuelle Live-Stand ist komplett gespeichert; ältere Releases sind Protokolleinträge.
    },

    /* ---------- Kunden ---------- */
    async kundeSpeichern(k, neu) {
      const S = this.S; const i = S.kunden.findIndex(x => x.id === k.id);
      if (i >= 0) S.kunden[i] = k; else S.kunden.push(k);
      this._melde("kunden");
      await this._set("kunden/" + k.id, k);
      if (neu) await this.log("Kunden", `Kunde ${k.firma} angelegt`);
    },
    async kundeLoeschen(id) {
      const k = this.S.kunden.find(x => x.id === id);
      this.S.kunden = this.S.kunden.filter(x => x.id !== id); this._melde("kunden");
      await this._del("kunden/" + id); await this.log("Kunden", `Kunde ${k ? k.firma : id} gelöscht`);
    },

    /* ---------- Angebote ---------- */
    async angebotSpeichern(a) {
      const S = this.S; const i = S.angebote.findIndex(x => x.nr === a.nr);
      a.geaendert = Date.now();
      if (i >= 0) S.angebote[i] = a; else S.angebote.push(a);
      this._melde("angebote");
      await this._set("angebote/" + a.nr, clone(a));
    },
    async angebotLoeschen(nr) {
      this.S.angebote = this.S.angebote.filter(x => x.nr !== nr); this._melde("angebote");
      await this._del("angebote/" + nr); await this.log("Angebote", `Angebot ${nr} gelöscht`);
    },
    /** Kundenaktion im Verkaufsraum anhängen (Aufruf, Rückfrage, Annahme). */
    async ereignis(nr, ev) {
      const a = this.S.angebote.find(x => x.nr === nr); if (!a) return;
      a.events = a.events || [];
      const i = ev.id ? a.events.findIndex(x => x.id === ev.id) : -1;
      if (i >= 0) a.events[i] = ev; else a.events.push(ev);
      if (a.events.length > 300) a.events = a.events.slice(-300);
      if (ev.typ === "angenommen") a.status = "angenommen";
      this._melde("angebote");
      if (this.modus === "db") { try { await this.db.doc("angebote/" + nr).update({ events: clone(a.events), status: a.status }); } catch (e) {} }
    },
    /** Eigener Nummernkreis der App */
    naechsteNrLokal() {
      const e = this.S.einst; let n = e.naechsteNr;
      const vorhanden = new Set(this.S.angebote.map(a => a.nr));
      while (vorhanden.has(e.praefix + n)) n++;
      return e.praefix + n;
    },
    /**
     * Nächste Angebotsnummer. Quelle laut Einstellungen › Nummern:
     *  app    – eigener Nummernkreis (Präfix + laufende Nummer)
     *  applus – aus dem ERP: eigene Funktion KONF_CONFIG.angebotsnummer (z. B. Webdienst, der reserviert)
     *           oder Abfrage, die die nächste freie bzw. die zuletzt vergebene Nummer liefert.
     * Liefert { nr, quelle }. Wirft einen Fehler, wenn das ERP keine Nummer liefert und keine Ersatznummer erlaubt ist.
     */
    async naechsteNr() {
      const e = this.S.einst, z = Object.assign({ quelle: "app", abfrage: (K.cfg.queries || {}).angebotsnummer || "", feld: "", art: "naechste", ersatz: false }, e.nummern || {});
      if (z.quelle !== "applus") return { nr: this.naechsteNrLokal(), quelle: "app" };
      try {
        let nr = null;
        if (typeof K.cfg.angebotsnummer === "function") nr = await K.cfg.angebotsnummer(e);
        else {
          if (!z.abfrage) throw new Error("Keine Abfrage für die Angebotsnummer eingetragen");
          const rows = await K.cfg.loadQuery(z.abfrage, "angebotsnummer");
          if (!rows || !rows.length) throw new Error("Die Abfrage " + z.abfrage + " liefert keine Zeile");
          const r = rows[0], keys = Object.keys(r), k = z.feld ? keys.find(x => x.toLowerCase() === z.feld.toLowerCase()) : keys.find(x => /^(nr|nummer|angebot|angebotsnr|angebotsnummer|naechste|next|belegnr|max)$/i.test(x)) || keys[0];
          nr = r[k]; if (nr == null || String(nr).trim() === "") throw new Error("Feld " + (k || "?") + " ist leer");
          nr = String(nr).trim();
          if (z.art === "hoechste") { const m = nr.match(/^(.*?)(\d+)$/); if (!m) throw new Error("Nummer " + nr + " endet nicht mit einer Zahl"); nr = m[1] + String(+m[2] + 1).padStart(m[2].length, "0"); }
        }
        // im selben Browser schon vergebene Nummern überspringen (bei „zuletzt vergeben“ ohne Reservierung)
        const vorhanden = new Set(this.S.angebote.map(a => a.nr));
        while (vorhanden.has(nr)) { const m = String(nr).match(/^(.*?)(\d+)$/); if (!m) break; nr = m[1] + String(+m[2] + 1).padStart(m[2].length, "0"); }
        return { nr: String(nr), quelle: "applus" };
      } catch (err) {
        console.warn("[Konfigurator] Angebotsnummer aus APplus nicht verfügbar:", err);
        if (z.ersatz) return { nr: this.naechsteNrLokal(), quelle: "ersatz", fehler: err.message };
        throw new Error("Angebotsnummer aus APplus nicht verfügbar: " + err.message);
      }
    },
    async nrVerbrauchen(nr) {
      const e = this.S.einst; if (!String(nr).startsWith(e.praefix)) return;
      const n = parseInt(String(nr).replace(e.praefix, ""), 10);
      if (n >= e.naechsteNr) { e.naechsteNr = n + 1; await this.einstSpeichern(e, true); }
    },

    /* ---------- Einstellungen ---------- */
    _einstTimer: null,
    async einstSpeichern(e, sofort) {
      this.S.einst = e; this._melde("einst");
      clearTimeout(this._einstTimer);
      const f = () => this._set("einstellungen/allgemein", clone(e)).catch(() => {});
      if (sofort) await f(); else this._einstTimer = setTimeout(f, 700);
    },

    /* ---------- Favoriten ---------- */
    async favorit(pid) {
      const p = this.S.prefs; p.favoriten = p.favoriten || [];
      p.favoriten = p.favoriten.includes(pid) ? p.favoriten.filter(x => x !== pid) : [...p.favoriten, pid];
      this._melde("prefs");
      if (this.modus === "db" && this.uid) try { await this.db.doc("data/users/" + this.uid + "/prefs").set(clone(p)); } catch (e) {}
    },

    /* ---------- Protokoll ---------- */
    _merk: {}, _merkTimer: null,
    _protokollMerken(bereich, text) {
      // Tippen in einem Feld erzeugt nur einen Eintrag je Objekt und Pause
      this._merk[bereich + "|" + text] = { bereich, text };
      clearTimeout(this._merkTimer);
      this._merkTimer = setTimeout(() => { const l = Object.values(this._merk); this._merk = {}; this.log(l.map(x => x.bereich), l.map(x => x.text)); }, 4000);
    },
    async log(bereich, text) {
      const bs = [].concat(bereich), ts = [].concat(text);
      const monat = new Date().toISOString().slice(0, 7), S = this.S;
      let doc = S.protokoll.find(p => p.monat === monat);
      if (!doc) { doc = { monat, eintraege: [] }; S.protokoll.unshift(doc); }
      ts.forEach((t, i) => doc.eintraege.push({ ts: Date.now(), von: this.uid, bereich: bs[i] || bs[0], text: t }));
      if (doc.eintraege.length > 800) doc.eintraege = doc.eintraege.slice(-800);
      this._melde("protokoll");
      await this._set("protokoll/" + monat, clone(doc)).catch(() => {});
    },

    /* ---------- Personen ---------- */
    async namen(ids) {
      ids = [...new Set(ids.filter(Boolean))];
      if (!this.user || !ids.length) return {};
      try { const p = await this.user.profiles(ids); return Object.fromEntries(ids.map(id => [id, p[id]?.name || ""])); } catch (e) { return {}; }
    }
  };
})();


/* ===== viewer3d.js ===== */
/* =========================================================================
   3D-Ansicht (360°)
   Zwei Quellen:
   1) GLB-Modell je Produkt (aus STEP konvertiert). Jeder Merkmalswert kann über
      sein Feld "teil" einen Knotennamen im Modell schalten: Knoten, die in
      irgendeinem "teil" vorkommen, sind nur sichtbar, wenn der Wert gewählt ist.
      Materialien mit "lack" im Namen bekommen die gewählte RAL-Farbe.
   2) Ohne GLB: ein aus Parametern erzeugtes Ersatzmodell (Demo).
   ========================================================================= */
(function () {
  const K = window.KONF;
  const T = () => window.THREE;
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888";

  /* ---------- Ersatzmodell aus Parametern ---------- */
  function mats(hex) {
    const THREE = T();
    const m = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .55, metalness: .25, ...o });
    return {
      lack: m(hex || "#0E4C92", { roughness: .38, metalness: .35 }),
      lackHell: m(new THREE.Color(hex || "#0E4C92").lerp(new THREE.Color("#ffffff"), .25), { roughness: .4 }),
      stahl: m("#2b3036", { metalness: .55, roughness: .45 }),
      holz: m("#7b5a3a", { roughness: .92, metalness: 0 }),
      reifen: m("#17181a", { roughness: .95, metalness: 0 }),
      felge: m("#c8ced4", { metalness: .7, roughness: .3 }),
      chrom: m("#dfe4e8", { metalness: .9, roughness: .15 }),
      rot: m("#d4201a", { emissive: "#5a0000" }), orange: m("#ff8c00", { emissive: "#5a2a00" }),
      alu: m("#a9b1b8", { metalness: .7, roughness: .35 })
    };
  }
  function box(g, w, h, d, mat, x, y, z, rz) {
    const THREE = T(); const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    me.position.set(x, y, z); if (rz) me.rotation.z = rz; me.castShadow = true; me.receiveShadow = true; g.add(me); return me;
  }
  function zyl(g, r, l, mat, x, y, z, achse) {
    const THREE = T(); const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 28), mat);
    if (achse === "z") me.rotation.x = Math.PI / 2; else if (achse === "x") me.rotation.z = Math.PI / 2;
    me.position.set(x, y, z); me.castShadow = true; g.add(me); return me;
  }
  /* Schräges Verbindungsstück von (x1,y1) nach (x2,y2) */
  function rampe(g, x1, y1, x2, y2, dicke, breite, mat) {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy);
    return box(g, l, dicke, breite, mat, (x1 + x2) / 2, (y1 + y2) / 2, 0, Math.atan2(dy, dx));
  }

  function achsen(g, M, xVorn, n, r, W, superSingle, lift, pendel) {
    for (let i = 0; i < n; i++) {
      const x = xVorn - i * 1.36, hub = (lift && i === 0) ? .16 : 0, y = r + hub;
      zyl(g, .07, W - .5, M.stahl, x, y, 0, "z");
      const seiten = superSingle ? [[W / 2 - .24, .38]] : [[W / 2 - .15, .24], [W / 2 - .42, .24]];
      for (const s of [1, -1]) for (const [z, b] of seiten) {
        zyl(g, r, b, M.reifen, x, y, s * z, "z");
        zyl(g, r * .56, b + .01, M.felge, x, y, s * z, "z");
      }
      if (pendel) for (const s of [1, -1]) zyl(g, .06, .5, M.chrom, x + .25, y + r * .4, s * (W / 2 - .7));
    }
  }

  function bauen(mo, prod, sel) {
    const THREE = T(), g = new THREE.Group();
    const E = K.E, w = (mid) => E.wert(mo, mid, sel[mid]);
    const M = mats(w("farbe")?.hex);
    const typ = prod.visual?.typ || "semi";
    const n = w("achsen")?.menge || 3;
    const r = { r175: .38, r195: .43, r225: .52 }[sel.reifen] || .42;
    const ss = sel.reifen === "r225";
    const L = { l9000: 9, l11500: 11.5, tele: 9 }[sel.ladeflaeche] || 9;
    const W = sel.breite === "b2750" ? 2.75 : 2.55;
    const zub = new Set(sel.zubehoer || []);
    const lift = zub.has("achslift"), pendel = sel.federung === "hydro";

    const seitenteile = (x1, x2, top, h) => {
      const l = x1 - x2, xm = (x1 + x2) / 2;
      box(g, l, .08, W, M.holz, xm, top - .04, 0);
      for (const s of [1, -1]) box(g, l, h, .12, M.lack, xm, top - h / 2 - .02, s * (W / 2 - .06));
      for (const s of [1, -1]) box(g, l, h * 1.4, .18, M.lack, xm, top - h * .7 - .05, s * .55);
      for (let x = x1 - .6; x > x2 + .3; x -= 1.4) box(g, .08, h * .8, W - .2, M.lack, x, top - h * .5, 0);
      if (sel.breite === "b3300") for (let x = x1 - .8; x > x2 + .4; x -= 2) for (const s of [1, -1]) box(g, .14, .1, .5, M.lackHell, x, top - .1, s * (W / 2 + .2));
      if (zub.has("rungtaschen")) for (let x = x1 - .5; x > x2 + .2; x -= 1.5) for (const s of [1, -1]) box(g, .08, 1, .08, M.stahl, x, top + .5, s * (W / 2 - .08));
      if (zub.has("led")) for (let x = x1 - 1; x > x2 + .5; x -= 2) for (const s of [1, -1]) box(g, .1, .05, .03, M.orange, x, top - h * .5, s * (W / 2 + .01));
      if (sel.ladeflaeche === "tele") { box(g, .12, .02, W - .1, M.stahl, (x1 + x2) / 2, top + .005, 0); box(g, l * .45, .22, .5, M.alu, xm - l * .2, top - h - .2, 0); }
    };
    const heck = (x, top) => {
      for (const s of [1, -1]) { box(g, .06, .12, .3, zub.has("led") ? M.rot : M.stahl, x - .03, top - .25, s * (W / 2 - .3)); }
      box(g, .1, .25, W, M.stahl, x - .05, top - .45, 0);
      if (sel.rampen && sel.rampen !== "keine") {
        const winkel = 1.15;
        for (const s of [1, -1]) {
          const piv = new THREE.Group(); piv.position.set(x, top, s * (W / 2 - .55)); piv.rotation.z = winkel;
          box(piv, 2.2, .07, .7, M.lack, 1.1, .04, 0);
          for (let i = 0; i < 6; i++) box(piv, .04, .03, .66, M.stahl, .25 + i * .35, .09, 0);
          g.add(piv);
          if (sel.rampen !== "mech") { const c = rampe(g, x + 1.4, top + .02, x + .45, top + .85, .07, .07, M.chrom); c.position.z = s * (W / 2 - .95); }
        }
        if (sel.rampen === "hydrv") box(g, .12, .12, W - .2, M.chrom, x - .02, top + .02, 0);
      }
    };
    const front = (x, top, h) => {
      box(g, .1, h, W, M.lack, x + .05, top - h / 2, 0);
      if (zub.has("winde")) box(g, .7, .55, .9, M.stahl, x - .7, top + .28, 0);
      if (zub.has("stuetz")) for (const s of [1, -1]) { zyl(g, .08, top - .25, M.chrom, x - .9, (top - .1) / 2, s * .8); box(g, .35, .05, .35, M.stahl, x - .9, .03, s * .8); }
      if (zub.has("kiste")) box(g, .6, .45, .4, M.stahl, x - 2.2, top - .55, -(W / 2 - .25));
    };

    if (typ === "nachlaeufer") {
      const lBogie = 1.2 + (n - 1) * 1.36 + 1.2, top = 1.25;
      zyl(g, .09, 5.5, M.lack, -2.75, .95, 0, "x");
      zyl(g, .07, 1.6, M.alu, -.6, .95, 0, "x");
      zyl(g, .1, .05, M.stahl, .05, .95, 0, "z");
      box(g, lBogie, .35, 1.0, M.lack, -5.5 - lBogie / 2, top - .2, 0);
      achsen(g, M, -5.5 - 1.2, n, r, W, ss, lift, false);
      const paare = { rp2: 2, rp3: 3, rp4: 4 }[sel.rungen] || 2;
      for (let i = 0; i < paare; i++) {
        const x = -5.5 - .5 - i * ((lBogie - 1) / Math.max(1, paare - 1));
        box(g, .25, .22, W, M.lack, x, top + .1, 0);
        for (const s of [1, -1]) box(g, .12, 1.8, .12, M.lack, x, top + 1.1, s * (W / 2 - .1));
      }
      if (zub.has("led")) for (const s of [1, -1]) box(g, .06, .12, .3, M.rot, -5.5 - lBogie - .03, top - .2, s * .4);
      if (zub.has("kiste")) box(g, .6, .4, .4, M.stahl, -5.5 - lBogie / 2, top - .6, .7);
    } else if (typ === "plattform") {
      const top = 1.45, h = .45, x2 = -L - 1;
      seitenteile(0, x2, top, h); front(0, top, h); heck(x2, top);
      zyl(g, .05, .2, M.stahl, -1.1, top - h - .45, 0);
      achsen(g, M, x2 + 1.3 + (n - 1) * 1.36, n, r, W, ss, lift, false);
    } else if (typ === "tiefbett") {
      const neckTop = 1.6, wellTop = .55, bogieTop = 1.3, lw = L * .72;
      const xN = -3.2, xW1 = xN - .7, xW2 = xW1 - lw, xB1 = xW2 - .7, lB = 1.4 + (n - 1) * 1.36 + 1.2, xB2 = xB1 - lB;
      seitenteile(0, xN, neckTop, .4); front(0, neckTop, .4);
      rampe(g, xN, neckTop - .2, xW1, wellTop - .1, .45, W, M.lack);
      seitenteile(xW1, xW2, wellTop, .35);
      rampe(g, xW2, wellTop - .1, xB1, bogieTop - .2, .45, W, M.lack);
      seitenteile(xB1, xB2, bogieTop, .4); heck(xB2, bogieTop);
      if (sel.hals === "abnehmbar") { box(g, .05, .5, W + .02, M.stahl, xN - .05, neckTop - .2, 0); for (const s of [1, -1]) rampe(g, -1.2, neckTop + .05, xN + .2, neckTop + .35, .1, .1, M.chrom).position.z = s * .7; }
      zyl(g, .05, .2, M.stahl, -1.1, neckTop - .65, 0);
      achsen(g, M, xB1 - 1.4, n, r, W, ss, lift, pendel);
    } else { // semi
      const neckTop = 1.55, deckTop = 1.15, xN = -3.0, xD1 = xN - .6, xD2 = xD1 - L;
      seitenteile(0, xN, neckTop, .35); front(0, neckTop, .35);
      rampe(g, xN, neckTop - .18, xD1, deckTop - .2, .4, W, M.lack);
      seitenteile(xD1, xD2, deckTop, .38); heck(xD2, deckTop);
      zyl(g, .05, .2, M.stahl, -1.0, neckTop - .55, 0);
      achsen(g, M, xD2 + 1.3 + (n - 1) * 1.36, n, r, W, ss, lift, pendel);
    }
    return g;
  }

  /* ---------- GLB ---------- */
  const glbCache = {};
  function ladeGlb(asset) {
    if (glbCache[asset]) return glbCache[asset];
    // "asset" ist entweder eine URL zur .glb-Datei (APplus/Webserver) oder eine Ablage-ID des Prototyps.
    // Im Prototyp liegt die Datei als JSON-Hülle { name, glb: Base64 }, weil GLB dort kein zugelassener Dateityp ist.
    const istUrl = /^(https?:)?\/\/|^\/(?!_blob)|\.glb(\?|$)/i.test(asset);
    return glbCache[asset] = K.lib("gltfloader").then(() => istUrl
      ? fetch(asset, { credentials: "same-origin" }).then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.arrayBuffer(); })
      : fetch("/_blob/" + asset).then(r => r.json()).then(j => { const bin = atob(j.glb), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i); return buf.buffer; })
    ).then(buf => new Promise((ok, nein) => new (T().GLTFLoader)().parse(buf, "", gl => ok(gl.scene), nein)))
     .catch(e => { delete glbCache[asset]; throw e; });
  }
  function glbAnwenden(szene, mo, sel) {
    const alle = new Set(), an = new Set();
    for (const m of mo.merkmale) for (const w of m.werte) if (w.teil) {
      for (const t of String(w.teil).split(",").map(s => s.trim()).filter(Boolean)) {
        alle.add(t);
        if (K.E.aktiv(sel, m, w)) an.add(t);
      }
    }
    const hex = K.E.wert(mo, "farbe", sel.farbe)?.hex;
    szene.traverse(o => {
      if (alle.has(o.name)) o.visible = an.has(o.name);
      if (o.isMesh) { o.castShadow = true; const ms = [].concat(o.material); for (const m of ms) if (hex && /lack/i.test(m.name || "")) m.color.set(hex); }
    });
  }
  K.glbKnoten = async asset => { const s = await ladeGlb(asset); const l = []; s.traverse(o => { if (o.name && o !== s) l.push(o.name); }); return l; };

  /* ---------- Viewer ---------- */
  class Viewer {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "v3d"; this.ok = false;
      const THREE = T();
      if (!THREE) { this.el.innerHTML = `<div class="v3d-leer">Die 3D-Ansicht konnte nicht geladen werden.</div>`; return; }
      try { this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); }
      catch (e) { this.el.innerHTML = `<div class="v3d-leer">Dieses Gerät unterstützt keine 3D-Darstellung.</div>`; return; }
      this.ok = true;
      const r = this.r; r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.outputEncoding = THREE.sRGBEncoding; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
      this.el.appendChild(r.domElement);
      const sc = this.scene = new THREE.Scene();
      this.cam = new THREE.PerspectiveCamera(30, 1.6, .1, 300);
      sc.add(new THREE.HemisphereLight(0xffffff, 0x3a4048, .8));
      const d = new THREE.DirectionalLight(0xffffff, .95); d.position.set(9, 16, 11); d.castShadow = true;
      Object.assign(d.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); d.shadow.camera.updateProjectionMatrix(); d.shadow.mapSize.set(2048, 2048); sc.add(d);
      const d2 = new THREE.DirectionalLight(0xffffff, .3); d2.position.set(-10, 6, -8); sc.add(d2);
      const boden = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: .22 })); boden.rotation.x = -Math.PI / 2; boden.receiveShadow = true; sc.add(boden);
      this.gitter();
      this.rotY = -.8; this.rotX = .3; this.dist = 24; this.ziel = new THREE.Vector3(0, 1, 0); this.auto = false; this.need = true;
      this.el.insertAdjacentHTML("beforeend", `<div class="v3d-knoepfe">
        <button type="button" data-v="auto" aria-pressed="false" title="Automatisch drehen">360°</button>
        <button type="button" data-v="seite">Seite</button><button type="button" data-v="heck">Heck</button><button type="button" data-v="schraeg">3/4</button>
        <button type="button" data-v="rein" aria-label="Näher">+</button><button type="button" data-v="raus" aria-label="Weiter weg">−</button></div>
        <div class="v3d-tipp">Ziehen zum Drehen</div><div class="v3d-status" hidden></div>`);
      this.el.querySelector(".v3d-knoepfe").addEventListener("click", e => {
        const b = e.target.closest("[data-v]"); if (!b) return; const v = b.dataset.v;
        if (v === "auto") { this.auto = !this.auto; b.setAttribute("aria-pressed", this.auto); }
        if (v === "seite") { this.rotY = -Math.PI / 2 + .001; this.rotX = .12; }
        if (v === "heck") { this.rotY = -Math.PI + .001; this.rotX = .2; }
        if (v === "schraeg") { this.rotY = -.8; this.rotX = .3; }
        if (v === "rein") this.dist = Math.max(6, this.dist * .85);
        if (v === "raus") this.dist = Math.min(70, this.dist * 1.18);
        this.need = true;
      });
      const c = r.domElement, zeiger = new Map(); let pinch = 0;
      c.addEventListener("pointerdown", e => { c.setPointerCapture(e.pointerId); zeiger.set(e.pointerId, [e.clientX, e.clientY]); this.drag = true; this.el.classList.add("benutzt"); });
      c.addEventListener("pointermove", e => {
        if (!zeiger.has(e.pointerId)) return; const [x0, y0] = zeiger.get(e.pointerId); zeiger.set(e.pointerId, [e.clientX, e.clientY]);
        if (zeiger.size === 2) { const [a, b] = [...zeiger.values()]; const dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) this.dist = Math.min(70, Math.max(6, this.dist * pinch / dd)); pinch = dd; }
        else { this.rotY -= (e.clientX - x0) * .008; this.rotX = Math.min(1.25, Math.max(.04, this.rotX + (e.clientY - y0) * .006)); }
        this.need = true;
      });
      const ende = e => { zeiger.delete(e.pointerId); pinch = 0; if (!zeiger.size) this.drag = false; };
      c.addEventListener("pointerup", ende); c.addEventListener("pointercancel", ende);
      c.addEventListener("wheel", e => { e.preventDefault(); this.dist = Math.min(70, Math.max(6, this.dist * (1 + e.deltaY * .001))); this.need = true; }, { passive: false });
      new ResizeObserver(() => this.groesse()).observe(this.el);
      const loop = () => {
        requestAnimationFrame(loop);
        if (!this.el.isConnected) return;
        if (this.auto && !this.drag) { this.rotY += .005; this.need = true; }
        if (this.need) { this.need = false; this.kamera(); r.render(sc, this.cam); }
      };
      requestAnimationFrame(loop);
    }
    groesse() {
      if (!this.ok) return; const b = this.el.clientWidth, h = this.el.clientHeight; if (!b || !h) return;
      this.r.setSize(b, h, false); this.cam.aspect = b / h; this.cam.updateProjectionMatrix(); this.need = true;
    }
    kamera() {
      const c = this.cam, z = this.ziel, d = this.dist;
      c.position.set(z.x + d * Math.cos(this.rotX) * Math.sin(this.rotY), z.y + d * Math.sin(this.rotX), z.z + d * Math.cos(this.rotX) * Math.cos(this.rotY));
      c.lookAt(z);
    }
    _setze(g) {
      const THREE = T();
      if (this.gruppe) { this.scene.remove(this.gruppe); this.gruppe.traverse(o => { if (o.geometry && !o.userData.glb) o.geometry.dispose(); }); }
      const b = new THREE.Box3().setFromObject(g), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
      g.position.x -= c.x; g.position.z -= c.z; g.position.y -= b.min.y;
      this.gruppe = g; this.scene.add(g);
      this.ziel.set(0, s.y * .45, 0); this.dist = Math.max(14, Math.max(s.x, s.z) * 1.55);
      this.gitter();
      this.need = true;
    }
    gitter() {
      // Bodenraster in der Linienfarbe des aktuellen Themas
      const THREE = T(), gc = cssVar("--line");
      if (this.grid && this.gridFarbe === gc) return;
      if (this.grid) { this.scene.remove(this.grid); this.grid.geometry.dispose(); }
      this.grid = new THREE.GridHelper(40, 40, gc, gc); this.grid.material.transparent = true; this.grid.material.opacity = .5;
      this.gridFarbe = gc; this.scene.add(this.grid);
    }
    status(t) { const el = this.el.querySelector(".v3d-status"); if (!el) return; el.hidden = !t; el.textContent = t || ""; }
    async zeige(mo, prod, sel) {
      if (!this.ok || !prod) return;
      const key = prod.id + "|" + (prod.visual?.asset || "") + "|" + JSON.stringify(sel);
      if (key === this.key) return; this.key = key;
      const asset = prod.visual?.asset;
      if (asset) {
        this.status("3D-Modell wird geladen …");
        try {
          const s = (await ladeGlb(asset)).clone(true); s.traverse(o => o.userData.glb = true);
          if (this.key !== key) return;
          glbAnwenden(s, mo, sel); const g = new (T().Group)(); g.add(s); this._setze(g); this.status("");
          return;
        } catch (e) { this.status("GLB nicht ladbar, Ersatzmodell wird gezeigt"); }
      }
      try { this._setze(bauen(mo, prod, sel)); }
      catch (e) { console.error(e); this.status("3D-Modell konnte nicht erzeugt werden"); }
    }
    /** Standbild für PDF (PNG data URL) */
    async bild(mo, prod, sel, w = 1400, h = 760) {
      if (!this.ok) return null;
      await this.zeige(mo, prod, sel);
      const alt = { rotY: this.rotY, rotX: this.rotX }; this.rotY = -.8; this.rotX = .28;
      this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.kamera();
      this.r.render(this.scene, this.cam);
      const url = this.r.domElement.toDataURL("image/png");
      Object.assign(this, alt); this.groesse();
      return url;
    }
  }

  K._bauen = bauen; // für Tests

  /** Aktuelle 3D-Szene als GLB, verpackt in ZIP (GLB ist als Download-Typ nicht zugelassen) */
  K.export3d = async name => {
    try { await K.lib("gltfexporter", "jszip"); } catch (e) { return null; }
    const THREE = T(), v = haupt;
    if (!THREE || !THREE.GLTFExporter || !window.JSZip || !v || !v.gruppe) return null;
    const glb = await new Promise((ok, nein) => new THREE.GLTFExporter().parse(v.gruppe, ok, { binary: true }));
    const zip = new window.JSZip(); zip.file(name + ".glb", glb);
    zip.file("LIESMICH.txt", "3D-Szene aus dem Fahrzeugkonfigurator im GLB-Format (glTF 2.0).\nÖffnen z. B. mit Windows 3D-Viewer, Blender oder https://gltf-viewer.donmccurdy.com\n");
    return zip.generateAsync({ type: "blob" });
  };
  let haupt = null;
  K.viewer = () => (haupt && (haupt.ok || !T())) ? haupt : (haupt = new Viewer());
  K.viewerBereit = async () => { try { await K.lib("three"); } catch (e) {} return K.viewer(); };
  /** Viewer in einen Platzhalter <div data-viewer> einhängen; three.js wird bei Bedarf nachgeladen */
  K.viewerEinhaengen = (platz, mo, prod, sel) => {
    if (!T()) {
      platz.innerHTML = `<div class="v3d-leer">3D-Ansicht wird geladen …</div>`;
      K.lib("three").then(() => { if (platz.isConnected) { platz.innerHTML = ""; K.viewerEinhaengen(platz, mo, prod, sel); } })
        .catch(() => { if (platz.isConnected) platz.innerHTML = `<div class="v3d-leer">Die 3D-Bibliothek ist nicht erreichbar. Konfiguration und Preise funktionieren trotzdem.</div>`; });
      return null;
    }
    const v = K.viewer(); platz.appendChild(v.el); v.groesse(); v.zeige(mo, prod, sel); return v;
  };
})();


/* ===== pdf.js ===== */
/* Angebotsdokument als PDF, aufgebaut aus der Vorlage (Einstellungen → Vorlagen) */
(function () {
  const K = window.KONF;

  K.platzhalter = (text, a, einst) => {
    const b = (einst.vertrieb || []).find(v => v.id === a.bearbeiter) || {};
    const werte = {
      "kunde.firma": a.kunde?.firma, "kunde.person": a.kunde?.person, "angebot.nr": a.nr, "angebot.datum": K.datum(a.erstellt),
      "angebot.gueltig": K.datum(a.gueltig), "bearbeiter.name": b.name, "bearbeiter.tel": b.tel, "bearbeiter.mail": b.mail, "firma.name": einst.firma?.name
    };
    return String(text || "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => werte[k] ?? m);
  };

  const n2 = v => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0) + " EUR";

  K.pdfErzeugen = async (a, mo) => {
    await K.lib("jspdf");
    if (mo && K.cfg && (K.Store.S.einst?.vorlage || {}).zeigeBild) await K.viewerBereit();
    const { jsPDF } = window.jspdf; const d = new jsPDF({ unit: "mm", format: "a4" });
    const S = K.Store.S, e = S.einst, f = e.firma, t = a.texte || e.vorlage, opt = e.vorlage;
    const sum = K.E.summen(a, e.mwst); const bearb = (e.vertrieb || []).find(v => v.id === a.bearbeiter) || {};
    const LI = 20, RE = 190; let y = 0, seite = 1;
    const kopf = () => {
      for (let i = 0; i < 21; i++) { d.setFillColor(i % 2 ? 27 : 242, i % 2 ? 35 : 183, i % 2 ? 43 : 5); d.rect(i * 10, 0, 10, 2.5, "F"); }
      d.setFont("helvetica", "normal"); d.setFontSize(7.5); d.setTextColor(110);
      d.text(`${f.name} · ${f.strasse} · ${f.ort} · ${f.tel}`, LI, 289);
      d.text(`Angebot ${a.nr} · Seite ${seite}`, RE, 289, { align: "right" }); d.setTextColor(20);
    };
    const platz = mm => { if (y + mm > 278) { d.addPage(); seite++; kopf(); y = 18; } };
    const absatz = (txt, size = 10, abstand = 4.6) => {
      if (!txt) return; d.setFont("helvetica", "normal"); d.setFontSize(size);
      for (const zeile of d.splitTextToSize(K.platzhalter(txt, a, e), RE - LI)) { platz(abstand); d.text(zeile, LI, y); y += abstand; }
    };
    kopf();
    d.setFontSize(7.5); d.setTextColor(110); d.text(`${f.name} · ${f.strasse} · ${f.ort}`, LI, 20); d.setTextColor(20);
    d.setFontSize(10.5); d.text([a.kunde.firma, a.kunde.person, a.kunde.strasse, a.kunde.ort].filter(Boolean), LI, 28);
    d.setFont("helvetica", "bold"); d.setFontSize(13); d.text(f.name, RE, 20, { align: "right" });
    d.setFont("helvetica", "normal"); d.setFontSize(9);
    const kd = S.kunden.find(k => k.id === a.kundeId);
    const rechts = [["Angebot", a.nr], ["Datum", K.datum(a.erstellt)], ["Gültig bis", K.datum(a.gueltig)], ["Kunden-Nr.", kd?.nr || "–"], ["Ihr Kontakt", bearb.name || "–"], ["Telefon", bearb.tel || "–"]];
    rechts.forEach(([l, v], i) => { d.setTextColor(110); d.text(l, 140, 30 + i * 5); d.setTextColor(20); d.text(String(v), RE, 30 + i * 5, { align: "right" }); });
    d.setFont("helvetica", "bold"); d.setFontSize(17); d.text(`Angebot ${a.nr}`, LI, 70); y = 80;
    absatz(t.einleitung);
    y += 4;

    let posNr = 0;
    for (const p of a.positionen) {
      posNr++;
      const gesamt = p.einzel * p.menge * (1 - (p.rabatt || 0) / 100);
      if (p.typ === "konfig") {
        platz(30); d.setFillColor(242, 244, 246); d.rect(LI, y - 5, RE - LI, 8, "F");
        d.setFont("helvetica", "bold"); d.setFontSize(10.5); d.text(`Pos. ${posNr * 10}   ${p.produktName}`, LI + 2, y); d.text(`${p.menge} Stk`, RE - 2, y, { align: "right" }); y += 8;
        if (opt.zeigeBild) {
          const prod = K.E.produkt(mo, p.produkt);
          const url = prod ? await K.viewer().bild(mo, prod, p.sel).catch(() => null) : null;
          if (url) { platz(90); d.addImage(url, "PNG", LI + 10, y - 2, 150, 81.4); y += 84; }
        }
        d.setFontSize(9);
        let ueber = null;
        for (const z of p.zeilen) {
          if (z.ueberschrift && z.ueberschrift !== ueber) { // ZZ-Überschrift als Gliederung im Angebot
            ueber = z.ueberschrift; platz(10); y += 1.5; d.setFont("helvetica", "bold"); d.setFontSize(9.5); d.setTextColor(20); d.text(ueber, LI + 2, y); y += 5; d.setFontSize(9);
          }
          platz(5.5); d.setFont("helvetica", "normal"); d.setTextColor(100); d.text(z.ueberschrift ? (z.code || "") : z.merkmal, LI + (z.ueberschrift ? 6 : 2), y); d.setTextColor(20);
          const tx = d.splitTextToSize(z.text, 95); d.text(tx, 62, y);
          if (opt.zeigeMerkmalpreise) d.text(z.preis ? n2(z.preis) : "inkl.", RE - 2, y, { align: "right" });
          y += 4.6 * tx.length; d.setDrawColor(225); d.line(LI, y - 3, RE, y - 3);
        }
        if (p.grundausstattung && p.grundausstattung.length && opt.zeigeGrundausstattung !== false) {
          platz(10); d.setFont("helvetica", "bold"); d.setTextColor(100); d.text("Grundausstattung", LI + 2, y); d.setFont("helvetica", "normal"); d.setTextColor(20);
          const tx = d.splitTextToSize(p.grundausstattung.map(x => x.name).join(" · "), 120); for (const zeile of tx) { platz(5); d.text(zeile, 62, y); y += 4.3; }
          y += 1; d.setDrawColor(225); d.line(LI, y - 3, RE, y - 3);
        }
      } else {
        platz(10); d.setFillColor(242, 244, 246); d.rect(LI, y - 5, RE - LI, 8, "F");
        d.setFont("helvetica", "bold"); d.setFontSize(10.5); d.text(`Pos. ${posNr * 10}   ${p.text}`, LI + 2, y); d.text(`${p.menge} Stk`, RE - 2, y, { align: "right" }); y += 7;
      }
      platz(12); d.setFont("helvetica", "normal"); d.setFontSize(9.5);
      d.text(`Einzelpreis ${n2(p.einzel)}${p.rabatt ? `   abzgl. ${K.zahl(p.rabatt, 1)} % Rabatt` : ""}`, LI + 2, y + 1);
      d.setFont("helvetica", "bold"); d.text(n2(gesamt), RE - 2, y + 1, { align: "right" }); y += 10;
    }

    platz(44); y += 2; const z = (l, v, fett) => { d.setFont("helvetica", fett ? "bold" : "normal"); d.text(l, 118, y); d.text(v, RE - 2, y, { align: "right" }); y += 6; };
    d.setFontSize(10);
    z("Summe Positionen", n2(sum.liste - sum.posRabatt));
    if (a.rabatt) z(`Gesamtrabatt ${K.zahl(a.rabatt, 1)} %`, "- " + n2(sum.gesamtRabatt));
    z("Summe netto", n2(sum.netto)); z(`USt. ${e.mwst} %`, n2(sum.ust));
    d.setDrawColor(27); d.setLineWidth(.5); d.line(118, y - 4, RE, y - 4); d.setLineWidth(.2); z("Gesamtbetrag", n2(sum.brutto), true);
    y += 4;
    for (const [titel, key] of [["Lieferung", "lieferung"], ["Zahlungsbedingungen", "zahlung"], ["Gewährleistung", "gewaehrleistung"]]) {
      if (!t[key]) continue; platz(12); d.setFont("helvetica", "bold"); d.setFontSize(10); d.text(titel, LI, y); y += 5; absatz(t[key], 9.5, 4.4); y += 2;
    }
    y += 2; absatz(t.schluss);

    if (opt.zeigeStueckliste) {
      for (const p of a.positionen.filter(p => p.typ === "konfig")) {
        const prod = K.E.produkt(mo, p.produkt); if (!prod) continue;
        d.addPage(); seite++; kopf(); y = 20;
        d.setFont("helvetica", "bold"); d.setFontSize(13); d.text(`Anlage: Stückliste ${p.produktName}`, LI, y); y += 9; d.setFontSize(8.5);
        for (const r of K.E.stueckliste(mo, prod, p.sel)) { platz(5); d.setFont("courier", "normal"); d.text(r.nr, LI, y); d.setFont("helvetica", "normal"); d.text(r.bez, 52, y); d.text(`${K.zahl(r.menge, 2)} ${r.me}`, RE, y, { align: "right" }); y += 4.6; }
      }
    }
    return d.output("blob");
  };
})();


/* ===== sales.js ===== */
/* =========================================================================
   Vertrieb: Übersicht, Katalog, Konfigurator, Angebote, Kunden, Verkaufsraum
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const live = () => S().live;

  /* ---------- gemeinsame Bausteine ---------- */
  const STATUS = { entwurf: "Entwurf", versendet: "Versendet", angenommen: "Angenommen", abgelehnt: "Abgelehnt" };
  K.statusChip = a => `<span class="chip st-${a.status}">${STATUS[a.status] || a.status}</span>`;
  K.aufrufe = a => (a.events || []).filter(e => e.typ === "aufruf");
  K.offeneFragen = a => (a.events || []).filter(e => e.typ === "rueckfrage" && !e.erledigt);
  K.heiss = a => a.status !== "angenommen" && a.status !== "abgelehnt" && (K.aufrufe(a).filter(e => Date.now() - e.ts < 48 * 36e5).length >= 2 || K.offeneFragen(a).length > 0);
  const vertriebName = id => (S().einst?.vertrieb || []).find(v => v.id === id)?.name || "–";
  const lesezeit = a => K.aufrufe(a).reduce((n, e) => n + (e.dauer || 0), 0);
  const kopf = (eyebrow, titel, text, aktionen = "") => `<div class="kopfzeile"><div><div class="eyebrow">${eyebrow}</div><h2>${titel}</h2>${text ? `<p>${text}</p>` : ""}</div>${aktionen ? `<div class="row">${aktionen}</div>` : ""}</div>`;

  /* Silhouetten für den Katalog (Seitenansicht, schematisch) */
  K.silhouette = (typ, farbe = "currentColor") => {
    const rad = (x, r = 9) => `<circle cx="${x}" cy="${62 - r}" r="${r}" fill="${farbe}"/><circle cx="${x}" cy="${62 - r}" r="${r * .45}" fill="var(--surface)"/>`;
    const k = {
      semi: `<path d="M8 22h46l8 10h112v8H60l-6-8H8z" fill="${farbe}"/>${[140, 160, 180].map(x => rad(x)).join("")}<path d="M184 32l14-22 4 2-12 22z" fill="${farbe}" opacity=".7"/>`,
      tiefbett: `<path d="M6 18h44l10 22h86l8-14h44v10h-40l-8 14H56L46 28H6z" fill="${farbe}"/>${[160, 176, 192].map(x => rad(x, 8)).join("")}`,
      plattform: `<path d="M8 22h190v10H8z" fill="${farbe}"/><rect x="20" y="32" width="8" height="10" fill="${farbe}"/>${[160, 182].map(x => rad(x)).join("")}`,
      nachlaeufer: `<path d="M6 36h120v5H6z" fill="${farbe}"/><path d="M118 30h70v12h-70z" fill="${farbe}"/><path d="M130 6h5v24h-5zM172 6h5v24h-5z" fill="${farbe}"/>${[144, 164].map(x => rad(x)).join("")}`
    }[typ] || "";
    return `<svg viewBox="0 0 210 64" aria-hidden="true">${k}<line x1="0" y1="62.5" x2="210" y2="62.5" stroke="var(--line)" stroke-width="1"/></svg>`;
  };

  /* =====================================================================
     Übersicht
     ===================================================================== */
  K.route("start", () => {
    const A = S().angebote, offen = A.filter(a => a.status === "entwurf" || a.status === "versendet");
    const sum = a => E.summen(a, S().einst.mwst).netto;
    const woche = A.reduce((n, a) => n + K.aufrufe(a).filter(e => Date.now() - e.ts < 7 * 864e5).length, 0);
    const entsch = A.filter(a => a.status === "angenommen" || a.status === "abgelehnt");
    const quote = entsch.length ? Math.round(A.filter(a => a.status === "angenommen").length / entsch.length * 100) : null;
    const heiss = A.filter(K.heiss);
    const feed = A.flatMap(a => (a.events || []).map(e => ({ ...e, a }))).sort((x, y) => y.ts - x.ts).slice(0, 8);
    const fav = (S().prefs.favoriten || []).map(id => E.produkt(live(), id)).filter(Boolean);
    const neueste = [...A].sort((x, y) => y.erstellt - x.erstellt).slice(0, 6);
    return kopf("Vertrieb", "Übersicht", "", `<a class="btn" href="#katalog">Fahrzeug konfigurieren</a><button class="btn primary" type="button" data-act="angebotNeu">Neues Angebot</button>`) + `
    <div class="kpis">
      <div class="kpi"><b class="num">${offen.length}</b><span>offene Angebote</span></div>
      <div class="kpi"><b class="num">${K.eur(offen.reduce((n, a) => n + sum(a), 0))}</b><span>Volumen offen, netto</span></div>
      <div class="kpi"><b class="num">${woche}</b><span>Aufrufe im Verkaufsraum, 7 Tage</span></div>
      <div class="kpi"><b class="num">${quote == null ? "–" : quote + " %"}</b><span>Annahmequote</span></div>
    </div>
    <div class="zwei-spalten">
      <section class="panel">
        <div class="panelkopf"><h3>Aktuelles Interesse</h3><span class="hinweistext">Mehrere Aufrufe in 48 h oder offene Rückfrage</span></div>
        ${heiss.length ? `<ul class="liste">${heiss.map(a => `<li><a href="#angebot-${a.nr}" class="zeile-link">
          <span><b>${esc(a.kunde.firma)}</b><br><span class="mono klein">${a.nr}</span> · ${K.eur(sum(a))}</span>
          <span class="rechts">${K.offeneFragen(a).length ? `<span class="chip st-rueckfrage">Rückfrage</span>` : ""}<span class="chip heiss">${K.aufrufe(a).length} Aufrufe</span></span></a></li>`).join("")}</ul>`
          : `<p class="leer-klein">Gerade keine Angebote mit frischem Interesse.</p>`}
      </section>
      <section class="panel">
        <div class="panelkopf"><h3>Letzte Kundenaktivität</h3></div>
        ${feed.length ? `<ul class="zeitachse">${feed.map(e => `<li class="${e.typ}"><time>${K.zeit(e.ts)} · ${K.rel(e.ts)}</time>
          <a href="#angebot-${e.a.nr}">${esc(e.a.kunde.firma)}</a> ${e.typ === "aufruf" ? `hat das Angebot geöffnet (${K.dauer(e.dauer)}, ${esc(e.geraet || "")})` : e.typ === "pdf" ? "hat das PDF gespeichert" : e.typ === "rueckfrage" ? "hat eine Rückfrage gestellt" : "hat das Angebot angenommen"}</li>`).join("")}</ul>`
          : `<p class="leer-klein">Noch keine Aufrufe. Sobald ein Kunde seinen Verkaufsraum-Link öffnet, erscheint das hier.</p>`}
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <div class="panelkopf"><h3>Neueste Angebote</h3><a href="#angebote" class="klein">Alle Angebote</a></div>
      ${angebotsTabelle(neueste)}
    </section>
    ${fav.length ? `<section style="margin-top:20px"><h3 class="abschnitt">Ihre Favoriten</h3><div class="kacheln">${fav.map(produktKarte).join("")}</div></section>` : ""}`;
  });

  function angebotsTabelle(liste) {
    if (!liste.length) return `<p class="leer-klein">Keine Angebote.</p>`;
    return `<div class="tabwrap"><table class="klickbar"><thead><tr><th>Angebot</th><th>Kunde</th><th>Fahrzeuge</th><th class="r">Netto</th><th>Status</th><th class="r">Aufrufe</th><th>Zuletzt geöffnet</th><th>Bearbeiter</th></tr></thead><tbody>
      ${liste.map(a => {
        const av = K.aufrufe(a), letzte = av.length ? Math.max(...av.map(e => e.ts)) : null;
        const fz = a.positionen.filter(p => p.typ === "konfig").map(p => `${p.menge}× ${esc(p.produktName)}`).join(", ") || "–";
        return `<tr data-act="oeffne" data-ziel="angebot-${a.nr}" tabindex="0"><td class="mono">${a.nr}${a.beispiel ? ` <span class="chip bsp">Beispiel</span>` : ""}</td><td><b>${esc(a.kunde.firma)}</b></td><td class="gedimmt">${fz}</td>
          <td class="r num">${K.eur(E.summen(a, S().einst.mwst).netto)}</td><td>${K.statusChip(a)}${K.heiss(a) ? ` <span class="chip heiss">Heiß</span>` : ""}</td>
          <td class="r num">${av.length}</td><td class="gedimmt">${letzte ? K.rel(letzte) : "–"}</td><td class="gedimmt">${esc(vertriebName(a.bearbeiter))}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }
  K.act.oeffne = el => K.gehe(el.dataset.ziel);

  /* =====================================================================
     Katalog (Baum, Filter, Kacheln)
     ===================================================================== */
  K.kat = { gruppe: "", suche: "", filter: {}, offen: {} };
  const kinder = (mo, gid) => mo.gruppen.filter(g => (g.eltern || "") === (gid || ""));
  const nachfahren = (mo, gid) => { const out = [gid]; for (const k of kinder(mo, gid)) out.push(...nachfahren(mo, k.id)); return out; };
  const pfad = (mo, gid) => { const out = []; let g = mo.gruppen.find(x => x.id === gid); while (g) { out.unshift(g); g = mo.gruppen.find(x => x.id === g.eltern); } return out; };
  K.bildUrl = id => id ? "/_blob/" + id : null;
  const produktBild = (p, farbe) => p.bild ? `<img src="${K.bildUrl(p.bild)}" alt="" loading="lazy">` : K.silhouette(p.visual?.typ, farbe || "var(--ink)");
  function gruppenBild(mo, g) {
    if (g.bild) return `<img src="${K.bildUrl(g.bild)}" alt="">`;
    const p = mo.produkte.find(x => nachfahren(mo, g.id).includes(x.gruppe));
    return p ? produktBild(p, "var(--muted)") : "";
  }
  /** „ab“-Preis = Preis der Standardkonfiguration (Grundpreis + vorausgewählte und feste Codes) */
  const abPreis = (mo, p) => { try { return E.preis(mo, p, E.standardSel(mo, p)).einzel; } catch (e) { return p.basispreis || 0; } };
  function produktKarte(p, mo) {
    const fav = (S().prefs.favoriten || []).includes(p.id);
    return `<article class="kachel">
      <button type="button" class="kachel-bild" data-act="konfigStart" data-p="${p.id}" aria-label="${esc(p.name)} konfigurieren">${produktBild(p)}</button>
      <div class="kachel-text">
        <div class="kachel-titel"><b>${esc(p.name)}</b><span class="info" title="${esc(p.beschreibung)}" tabindex="0" aria-label="${esc(p.beschreibung)}">i</span>
          <button type="button" class="stern" data-act="favorit" data-p="${p.id}" aria-pressed="${fav}" title="${fav ? "Aus Favoriten entfernen" : "Zu Favoriten"}">${fav ? "★" : "☆"}</button></div>
        <span class="mono klein gedimmt">${esc(p.code || p.artnr || "")}</span>
        <div class="kachel-fuss"><span class="num">ab ${K.eur(mo ? abPreis(mo, p) : p.basispreis)}</span><button type="button" class="zahnrad" data-act="konfigStart" data-p="${p.id}" title="Konfigurieren" aria-label="Konfigurieren">⚙</button></div>
      </div></article>`;
  }
  function baum(mo, gid, tiefe) {
    const zahl = id => mo.produkte.filter(p => p.aktiv !== false && nachfahren(mo, id).includes(p.gruppe)).length;
    return kinder(mo, gid).filter(g => zahl(g.id) > 0).map(g => {
      const hatKinder = kinder(mo, g.id).some(k => zahl(k.id) > 0), offen = K.kat.offen[g.id] ?? true, aktiv = K.kat.gruppe === g.id;
      const anzahl = zahl(g.id);
      return `<li><div class="baum-zeile${aktiv ? " aktiv" : ""}" style="--tiefe:${tiefe}">
        ${hatKinder ? `<button type="button" class="baum-auf" data-act="katAuf" data-g="${g.id}" aria-expanded="${offen}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${offen ? "▾" : "▸"}</button>` : `<span class="baum-auf"></span>`}
        <button type="button" class="baum-name" data-act="katGruppe" data-g="${g.id}"><span class="baum-bild">${gruppenBild(mo, g)}</span>${esc(g.name)}<span class="gedimmt klein">${anzahl}</span></button></div>
        ${hatKinder && offen ? `<ul>${baum(mo, g.id, tiefe + 1)}</ul>` : ""}</li>`;
    }).join("");
  }
  K.route("katalog", () => {
    const mo = K.kat.entwurf ? S().entwurf : live(); if (!mo) return keinModell();
    const k = K.kat, q = k.suche.toLowerCase(), fav = S().prefs.favoriten || [];
    const imBaum = k.gruppe === "fav" ? null : k.gruppe ? nachfahren(mo, k.gruppe) : null;
    let prods = mo.produkte.filter(p => p.aktiv !== false)
      .filter(p => k.gruppe === "fav" ? fav.includes(p.id) : !imBaum || imBaum.includes(p.gruppe))
      .filter(p => !q || (p.name + " " + p.beschreibung + " " + (p.artnr || "") + " " + (p.code || "")).toLowerCase().includes(q));
    // Katalogfilter aus Merkmalen mit "katalogfilter" (z. B. Anzahl Achsen)
    const filterM = mo.merkmale.filter(m => m.katalogfilter);
    const filterHtml = filterM.map(m => {
      const moeglich = m.werte.filter(w => prods.some(p => E.produktMerkmale(mo, p).some(x => x.m.id === m.id && x.werte.some(v => v.id === w.id))));
      return `<div class="katfilter"><span class="gedimmt klein">${esc(m.name)}</span>${moeglich.length ? moeglich.map(w => `<button type="button" class="chipbtn" data-act="katFilter" data-m="${m.id}" data-w="${w.id}" aria-pressed="${k.filter[m.id] === w.id}">${esc(w.name)}</button>`).join("") : `<b class="klein">Keine Auswahl möglich</b>`}</div>`;
    }).join("");
    for (const [mid, wid] of Object.entries(k.filter)) if (wid) prods = prods.filter(p => E.produktMerkmale(mo, p).some(x => x.m.id === mid && x.werte.some(v => v.id === wid)));
    const ziel = K.konf.ziel;
    const krumen = k.gruppe === "fav" ? ["Favoriten"] : ["Katalog", ...(k.gruppe ? pfad(mo, k.gruppe).map(g => g.name) : [])];
    return `${K.kat.entwurf ? `<div class="hinweis warn" style="margin-bottom:12px"><b>Vorschau des Entwurfs.</b> So sieht der Katalog nach der Freigabe aus. <button class="btn klein" type="button" data-act="katZumBau">Zurück zum Aufbau</button> <a class="btn klein primary" href="#studio-freigabe">Freigeben</a></div>` : ""}${ziel ? `<div class="hinweis" style="margin-bottom:12px">Das konfigurierte Fahrzeug wird als neue Position in <b>${esc(ziel.nr)}</b> übernommen. <button class="btn klein" type="button" data-act="zielAbbrechen">Abbrechen</button></div>` : ""}
    <div class="katalog">
      <nav class="baum panel" aria-label="Produktgruppen">
        <input type="search" id="kat-suche" data-in="katSuche" placeholder="Suche im Katalog" value="${esc(k.suche)}">
        <ul><li><div class="baum-zeile${!k.gruppe ? " aktiv" : ""}" style="--tiefe:0"><span class="baum-auf"></span><button type="button" class="baum-name" data-act="katGruppe" data-g="">Gesamter Katalog<span class="gedimmt klein">${mo.produkte.filter(p => p.aktiv !== false).length}</span></button></div>
          <ul>${baum(mo, "", 1)}</ul></li>
          <li><div class="baum-zeile${k.gruppe === "fav" ? " aktiv" : ""}" style="--tiefe:0"><span class="baum-auf"></span><button type="button" class="baum-name" data-act="katGruppe" data-g="fav">★ Favoriten<span class="gedimmt klein">${fav.length}</span></button></div></li></ul>
      </nav>
      <section class="katalog-inhalt">
        <div class="krumen eyebrow">${krumen.map(esc).join(" › ")}</div>
        ${filterHtml ? `<div class="katfilterleiste">${filterHtml}${Object.values(k.filter).some(Boolean) ? `<button type="button" class="btn klein" data-act="katFilterWeg">Filter zurücksetzen</button>` : ""}</div>` : ""}
        ${prods.length ? `<div class="kacheln">${prods.map(p => produktKarte(p, mo)).join("")}</div>` : `<div class="leer">In dieser Auswahl gibt es keine Fahrzeuge.</div>`}
      </section></div>`;
  });
  K.act.katZumBau = () => { K.kat.entwurf = false; K.gehe("studio-katalog"); };
  K.act.katGruppe = el => { K.kat.gruppe = el.dataset.g; K.render(); };
  K.act.katAuf = el => { K.kat.offen[el.dataset.g] = !(K.kat.offen[el.dataset.g] ?? true); K.render(); };
  K.act.katFilter = el => { const f = K.kat.filter; f[el.dataset.m] = f[el.dataset.m] === el.dataset.w ? null : el.dataset.w; K.render(); };
  K.act.katFilterWeg = () => { K.kat.filter = {}; K.render(); };
  K.act.zielAbbrechen = () => { const nr = K.konf.ziel?.nr; K.konf.ziel = null; nr ? K.gehe("angebot-" + nr) : K.render(); };
  K.inp.katSuche = el => { K.kat.suche = el.value; K.render(); };
  K.act.favorit = el => K.Store.favorit(el.dataset.p);
  function keinModell() { return `<div class="leer"><b>Es ist noch kein Konfigurationsmodell freigegeben.</b><br>Im Studio Produkte und Merkmale anlegen oder per Excel importieren und unter Freigabe veröffentlichen.<br><br><a class="btn" href="#studio-freigabe">Zur Freigabe</a></div>`; }

  /* Vorschaubild eines Werts: hochgeladenes Bild, Farbfeld oder schematische Grafik */
  K.wertGrafik = (m, w, i, p) => {
    if (w.bild) return `<img src="${K.bildUrl(w.bild)}" alt="" loading="lazy">`;
    if (w.hex) return `<span class="farbkachel" style="background:${esc(w.hex)}"></span>`;
    const farben = ["#2E9E5B", "#1F3F9A", "#B23AC4", "#C8312B", "#2BB3A5", "#8A5A2B", "#D98C00", "#56606B"];
    const f = farben[i % farben.length], typ = p?.visual?.typ || "semi";
    if (m.id === "achsen" || /achs/i.test(m.name)) {
      const n = w.menge || i + 2;
      return `<svg viewBox="0 0 120 50" aria-hidden="true"><rect x="6" y="18" width="108" height="7" fill="var(--ink)"/>${Array.from({ length: n }, (_, j) => `<circle cx="${110 - j * 13 - 4}" cy="33" r="6" fill="${f}"/>`).join("")}</svg>`;
    }
    return `<div class="silh" style="color:${f}">${K.silhouette(typ, "currentColor")}</div>`;
  };

  /* =====================================================================
     Konfigurator
     ===================================================================== */
  K.konf = { produkt: null, sel: null, notes: [], ziel: null, tab: "Grundmaschine", entwurf: false, kalk: false };
  K.konfModell = () => K.konf.entwurf ? S().entwurf : live();
  K.act.konfigStart = el => {
    const ent = !!K.kat.entwurf && K.aktuell() === "katalog", mo = ent ? S().entwurf : live(), p = E.produkt(mo, el.dataset.p);
    Object.assign(K.konf, { produkt: p.id, sel: E.standardSel(mo, p), notes: [], tab: "Grundmaschine", entwurf: ent });
    K.gehe("konfig");
  };
  K.konfigOeffnen = (pid, sel, ziel, entwurf) => {
    const mo = entwurf ? S().entwurf : live(), p = E.produkt(mo, pid); if (!p) { K.toast("Dieses Fahrzeug gibt es im Modell nicht mehr."); return; }
    const s = K.clone(sel || {}); const notes = E.bereinige(mo, p, s);
    Object.assign(K.konf, { produkt: pid, sel: s, notes, ziel, tab: "Grundmaschine", entwurf: !!entwurf });
    K.gehe("konfig");
  };

  function merkmalHtml(mo, p, m, werte, g, gs, sel) {
    const multi = m.typ === "mehrfach", d = E.darstellung(m), gm = g[m.id] || {}, gsm = gs[m.id] || {};
    const f = m.multiplikator ? (E.wert(mo, m.multiplikator, sel[m.multiplikator])?.menge || 1) : 1;
    const offen = m.pflicht && !multi && E.wahlWerte(m, werte).length > 0 && sel[m.id] == null;
    const gruende = new Map();
    const preisText = w => { const pr = Math.round(E.wertPreis(mo, p, w) * f); return pr ? K.eur(pr) : "inklusive"; };
    const info = w => w.info ? `<span class="info" title="${esc(w.info)}" tabindex="0" aria-label="${esc(w.info)}">i</span>` : "";
    for (const w of werte) { if (gm[w.id]) gruende.set(gm[w.id].id, gm[w.id].hinweis || E.satz(mo, gm[w.id])); }
    const kopf = `<div class="mm-kopf">${offen ? `<span class="warnzeichen" title="Pflichtangabe">⚠</span>` : ""}<b>${esc(m.name)}</b>${m.multiplikator ? `<span class="gedimmt klein">Preis × ${esc(E.merkmal(mo, m.multiplikator)?.name || "")}</span>` : ""}${m.info ? `<span class="info" title="${esc(m.info)}" tabindex="0">i</span>` : ""}</div>`;
    let inhalt = "";
    // Werte mit eigenem Feldtyp (Ja/Nein, Zahl, Text, fest) stehen für sich, die übrigen bilden die Auswahl der Gruppe
    const alleW = werte; werte = alleW.filter(w => E.wertTyp(m, w) === "auswahl");
    const eigene = alleW.filter(w => E.wertTyp(m, w) !== "auswahl").map(w => {
      const t = E.wertTyp(m, w), k = E.schluessel(m, w), v = sel[k], r = gm[w.id], gesetzt = gsm[w.id], pr = E.wertPreis(mo, p, w);
      const lock = r ? ` <span class="lock">gesperrt · ${r.id}</span>` : gesetzt ? ` <span class="chip">gesetzt · ${gesetzt.id}</span>` : "";
      if (t === "janein") return `<label class="woption${r ? " gesperrt" : ""}"><input type="checkbox" data-act="wahlJN" data-m="${m.id}" data-w="${w.id}" ${v ? "checked" : ""} ${r || gesetzt ? "disabled" : ""}><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><span class="num gedimmt">${preisText(w)}</span></label>`;
      if (t === "fest") return `<div class="wfest-z"><span class="haken-ok">✓</span><span class="wo-name">${esc(w.name)}${info(w)}</span><span class="num gedimmt">${pr ? K.eur(pr) : "inklusive"}</span></div>`;
      if (t === "zahl") { const z = w.zahl || {}; return `<div class="wzahl"><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><input id="zahl-${k}" type="number" inputmode="decimal" data-chg="wahlZahl" data-k="${k}" value="${esc(v ?? "")}" ${z.min != null ? `min="${z.min}"` : ""} ${z.max != null ? `max="${z.max}"` : ""} step="${z.schritt || 1}" aria-label="${esc(w.name)}" ${r ? "disabled" : ""}><span class="einheit">${esc(z.einheit || "")}</span><span class="num gedimmt">${pr ? `${K.eur2(pr)} je ${esc(z.einheit || "Einheit")}${+v ? ` · ${K.eur(Math.round(pr * v * f))}` : ""}` : ""}</span>${z.min != null || z.max != null ? `<span class="gedimmt klein">${z.min != null ? `ab ${z.min}` : ""}${z.max != null ? ` bis ${z.max}` : ""}</span>` : ""}</div>`; }
      const x = w.text || {}; return `<div class="wtext"><span class="wo-name">${esc(w.name)}${info(w)}${lock}</span><input id="text-${k}" type="text" data-chg="wahlText" data-k="${k}" value="${esc(v || "")}" maxlength="${x.maxLaenge || 200}" placeholder="${esc(x.hinweis || "")}" aria-label="${esc(w.name)}" ${r ? "disabled" : ""}>${pr ? `<span class="num gedimmt">${K.eur(pr)}</span>` : ""}</div>`;
    }).join("");
    if (!werte.length) inhalt = "";
    else if (d === "kacheln") {
      inhalt = `<div class="wkacheln">${werte.map((w, i) => {
        const an = multi ? (sel[m.id] || []).includes(w.id) : sel[m.id] === w.id, r = gm[w.id];
        return `<button type="button" class="wkachel${offen ? " offen" : ""}" data-act="wahl" data-m="${m.id}" data-w="${w.id}" aria-pressed="${an}" ${r ? "disabled" : ""} title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : (w.code ? "Code " + w.code : ""))}">
          <span class="wk-bild">${K.wertGrafik(m, w, i, p)}</span><span class="wk-name">${esc(w.name)}${info(w)}</span>
          <span class="wk-preis num">${r ? `<span class="lock">gesperrt · ${r.id}</span>` : preisText(w)}</span></button>`;
      }).join("")}</div>`;
    } else if (d === "auswahl" && !multi) {
      inhalt = `<select id="sel-${m.id}" class="wauswahl${offen ? " offen" : ""}" data-act="wahlSelect" data-m="${m.id}" aria-label="${esc(m.name)}">
        ${sel[m.id] == null ? `<option value="" selected>Bitte auswählen …</option>` : ""}
        ${werte.map(w => { const r = gm[w.id]; return `<option value="${w.id}" ${sel[m.id] === w.id ? "selected" : ""} ${r ? "disabled" : ""}>${esc(w.name)}${r ? ` (gesperrt ${r.id})` : ` · ${preisText(w)}`}</option>`; }).join("")}</select>`;
    } else if (d === "option" || multi) {
      inhalt = `<div class="woptionen">${werte.map(w => {
        const an = multi ? (sel[m.id] || []).includes(w.id) : sel[m.id] === w.id, r = gm[w.id], gesetzt = gsm[w.id];
        return `<label class="woption${r ? " gesperrt" : ""}" title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : gesetzt ? "Automatisch gewählt durch " + gesetzt.id : "")}">
          <input type="checkbox" data-act="wahl" data-m="${m.id}" data-w="${w.id}" ${an ? "checked" : ""} ${r || gesetzt ? "disabled" : ""}>
          <span class="wo-name">${esc(w.name)}${info(w)}${gesetzt ? ` <span class="chip">gesetzt · ${gesetzt.id}</span>` : ""}${r ? ` <span class="lock">gesperrt · ${r.id}</span>` : ""}</span><span class="num gedimmt">${preisText(w)}</span></label>`;
      }).join("")}</div>`;
    } else {
      inhalt = `<div class="wliste${offen ? " offen" : ""}" role="radiogroup" aria-label="${esc(m.name)}">${werte.map(w => {
        const an = sel[m.id] === w.id, r = gm[w.id];
        return `<button type="button" role="radio" class="wradio" data-act="wahl" data-m="${m.id}" data-w="${w.id}" aria-checked="${an}" aria-pressed="${an}" ${r ? "disabled" : ""} title="${esc(r ? r.id + ": " + (r.hinweis || E.satz(mo, r)) : "")}">
          <span class="wr-name">${esc(w.name)}${info(w)}</span><span class="num gedimmt">${r ? `<span class="lock">gesperrt · ${r.id}</span>` : preisText(w)}</span></button>`;
      }).join("")}</div>`;
    }
    return `<div class="mm${offen ? " ist-offen" : ""}" id="mm-${m.id}">${kopf}${inhalt}${eigene ? `<div class="weigene">${eigene}</div>` : ""}${gruende.size ? `<p class="sperr">${[...gruende].map(([id, t]) => `<span><b>${id}</b>${esc(t)}</span>`).join("")}</p>` : ""}</div>`;
  }

  K.route("konfig", () => {
    const mo = K.konfModell(); if (!mo) return keinModell();
    const k = K.konf; const p = E.produkt(mo, k.produkt);
    if (!p) return `<div class="leer">Bitte zuerst im Katalog ein Fahrzeug wählen.<br><br><a class="btn primary" href="#katalog">Zum Katalog</a></div>`;
    const pm = E.produktMerkmale(mo, p), g = E.sperren(mo, p, k.sel, pm), gs = E.gesetzt(mo, p, k.sel, pm), preis = E.preis(mo, p, k.sel);
    const regeln = E.aktiveRegeln(mo, p, k.sel), offenAlle = E.offenePflicht(mo, p, k.sel);
    const bereiche = [...new Set(pm.map(x => E.bereich(x.m)))];
    if (![...bereiche, "kalkulation", "stueckliste"].includes(k.tab)) k.tab = bereiche[0];
    let links = "";
    const ga = p.grundausstattung || [];
    const gaHtml = !ga.length ? "" : `<details class="ga-block" ${k.gaOffen ? "open" : ""}><summary data-act="konfGa"><b>Grundausstattung</b><span class="gedimmt klein">${ga.length} Positionen inklusive</span></summary>
      ${[...new Set(ga.map(x => x.gruppe || ""))].map(gr => `${gr ? `<div class="eyebrow">${esc(gr)}</div>` : ""}<ul>${ga.filter(x => (x.gruppe || "") === gr).map(x => `<li><code>${esc(x.code)}</code> ${esc(x.name)}</li>`).join("")}</ul>`).join("")}</details>`;
    if (!bereiche.length && !["kalkulation", "stueckliste"].includes(k.tab)) links = gaHtml || `<div class="leer">Für dieses Fahrzeug gibt es keine Auswahl.</div>`;
    else if (bereiche.includes(k.tab)) {
      const imBereich = pm.filter(x => E.bereich(x.m) === k.tab), abschnitte = [...new Set(imBereich.map(x => x.m.abschnitt || ""))];
      links = (k.tab === bereiche[0] ? gaHtml : "") + abschnitte.map(ab => `<section class="abschnittblock">${ab && ab !== k.tab ? `<h2>${esc(ab)}</h2>` : ""}${imBereich.filter(x => (x.m.abschnitt || "") === ab).map(x => merkmalHtml(mo, p, x.m, x.werte, g, gs, k.sel)).join("")}</section>`).join("");
    } else if (k.tab === "stueckliste") {
      const st = E.stueckliste(mo, p, k.sel);
      links = `<div class="tabwrap"><table><thead><tr><th class="r">Pos</th><th>Artikel</th><th>Bezeichnung</th><th class="r">Menge</th><th>ME</th><th>Herkunft</th></tr></thead><tbody>
        ${st.map((z, i) => `<tr><td class="r num">${(i + 1) * 10}</td><td class="mono">${esc(z.nr)}</td><td>${esc(z.bez)}</td><td class="r num">${K.zahl(z.menge, 2)}</td><td>${esc(z.me)}</td><td class="gedimmt">${esc(z.herkunft)}</td></tr>`).join("")}</tbody></table></div>
        <div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="stlCsv">Als CSV speichern</button><span class="gedimmt klein">${st.length} Positionen aus der aktuellen Auswahl</span></div>`;
    } else {
      const db = preis.einzel - preis.kosten, marge = preis.einzel ? db / preis.einzel * 100 : 0;
      links = `<div class="tabwrap"><table><thead><tr><th>Code</th><th>Merkmal</th><th>Ausführung</th><th class="r">Preis</th><th class="r">Kosten</th><th class="r">DB</th></tr></thead><tbody>
        ${preis.zeilen.map(z => `<tr><td class="mono gedimmt">${esc(z.code || (z.mid === "_basis" ? p.code || "" : ""))}</td><td class="gedimmt">${esc(z.merkmal)}</td><td>${esc(z.text)}</td><td class="r num">${K.eur(z.preis)}</td><td class="r num gedimmt">${K.eur(z.kosten)}</td><td class="r num">${K.eur(z.preis - z.kosten)}</td></tr>`).join("")}
        <tr class="summe"><td colspan="3">Summe je Fahrzeug</td><td class="r num">${K.eur(preis.einzel)}</td><td class="r num">${K.eur(preis.kosten)}</td><td class="r num">${K.eur(db)}</td></tr></tbody></table></div>
        <p class="klein gedimmt" style="margin-top:8px">Marge ${K.zahl(marge, 1)} %. Kalkulationswerte sind intern und erscheinen nicht im Angebot.</p>`;
    }
    const ziel = k.ziel;
    K.nach(v => { const pl = v.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, p, k.sel); });
    const zahl = b => offenAlle.filter(m => E.bereich(m) === b).length;
    const uebernehmenText = k.entwurf ? "" : ziel && ziel.idx != null ? `Position ${(ziel.idx + 1) * 10} aktualisieren` : ziel ? `In ${esc(ziel.nr)} übernehmen` : "Übernehmen";
    return `${k.entwurf ? `<div class="hinweis warn" style="margin-bottom:10px">Sie testen den <b>Entwurf</b> des Modells. Das Ergebnis kann nicht in Angebote übernommen werden. <a href="#studio-regeln">Zurück ins Studio</a></div>` : ""}
    <header class="konf-bar">
      <span class="kb-bild">${produktBild(p, "currentColor")}</span>
      <div class="kb-name"><b>${esc(p.name)}</b><span class="mono">${esc(p.code || p.artnr || "")}</span></div>
      <span class="kb-version">${k.entwurf ? "Entwurf" : "Modell v" + mo.version}</span>
      <div class="kb-preis num">${K.eur2(preis.einzel)}</div>
      ${uebernehmenText ? `<button class="btn gelb" type="button" data-act="konfUebernehmen">✓ ${uebernehmenText}</button>` : ""}
      ${ziel && ziel.idx != null ? `<button class="btn kb-btn" type="button" data-act="konfZielLoesen">Als neue Position</button>` : ""}
      <button class="btn kb-btn" type="button" data-act="konfSchliessen">✕ Schließen</button>
    </header>
    <div class="konf2">
      <div class="konf-links">
        <div class="tabs-innen" role="tablist">${bereiche.map(b => `<button type="button" role="tab" data-act="konfTab" data-t="${esc(b)}" aria-selected="${k.tab === b}">${esc(b)}${zahl(b) ? ` <span class="tabzahl">${zahl(b)}</span>` : ""}</button>`).join("")}
          <button type="button" role="tab" data-act="konfTab" data-t="kalkulation" aria-selected="${k.tab === "kalkulation"}">Kalkulation</button>
          <button type="button" role="tab" data-act="konfTab" data-t="stueckliste" aria-selected="${k.tab === "stueckliste"}">Stückliste</button></div>
        ${k.notes.length ? `<div class="hinweise" style="margin-bottom:14px">${k.notes.map(n => `<div class="hinweis warn"><b>${esc(n.merkmal)}</b> angepasst: ${esc(n.von)} → ${esc(n.nach)} <span class="mono">(${n.regel})</span></div>`).join("")}</div>` : ""}
        <div class="abschnitte">${links}</div>
      </div>
      <aside class="side">
        <div class="panel ansicht"><div data-viewer class="viewerplatz"></div>
          <div class="row zwischen" style="padding:0 4px"><span class="gedimmt klein">${offenAlle.length ? `⚠ ${offenAlle.length} Pflichtangaben offen` : "Konfiguration vollständig"}</span>
            <span class="row"><button class="btn klein" type="button" data-act="export3d" data-f="png">Bild speichern</button><button class="btn klein" type="button" data-act="export3d" data-f="glb">3D-Szene exportieren</button></span></div></div>
        <details class="panel regeln"><summary>Aktive Regeln (${regeln.length})</summary>
          <ul class="regelliste">${regeln.map(r => `<li><span class="mono">${r.id}</span><span>${esc(r.hinweis || E.satz(mo, r))}</span></li>`).join("") || "<li><span></span><span>Keine Einschränkungen aktiv.</span></li>"}</ul></details>
        <div class="row"><button class="btn klein" type="button" data-act="konfReset">Auswahl zurücksetzen</button><select id="konf-produkt" data-act="konfProdukt" aria-label="Grundfahrzeug wechseln">${mo.produkte.filter(x => x.aktiv !== false).map(x => `<option value="${x.id}" ${x.id === p.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
      </aside></div>`;
  });
  K.act.konfTab = el => { K.konf.tab = el.dataset.t; K.render(); };
  K.act.konfProdukt = el => { const mo = K.konfModell(), p = E.produkt(mo, el.value); const alt = K.konf.sel; const s = {}; for (const { m } of E.produktMerkmale(mo, p)) if (alt[m.id] != null) s[m.id] = alt[m.id]; K.konf.produkt = p.id; K.konf.sel = s; K.konf.notes = E.bereinige(mo, p, s); K.render(); };
  K.act.konfReset = () => { const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt); K.konf.sel = E.standardSel(mo, p); K.konf.notes = []; K.render(); };
  K.act.konfZielLoesen = () => { K.konf.ziel = { nr: K.konf.ziel.nr }; K.render(); };
  K.act.konfSchliessen = () => { const z = K.konf.ziel; if (K.konf.entwurf) return K.gehe("studio-regeln"); K.konf.ziel = null; K.gehe(z ? "angebot-" + z.nr : "katalog"); };
  function waehle(mid, w) {
    const mo = K.konfModell(), k = K.konf, p = E.produkt(mo, k.produkt), m = E.merkmal(mo, mid);
    if (m.typ === "mehrfach") { const l = k.sel[m.id] || []; k.sel[m.id] = l.includes(w) ? l.filter(x => x !== w) : [...l, w]; }
    else k.sel[m.id] = w;
    k.notes = E.bereinige(mo, p, k.sel, m.id); K.render();
  }
  K.act.wahl = el => waehle(el.dataset.m, el.dataset.w);
  const eigenSetzen = (key, v) => { const mo = K.konfModell(), k = K.konf, p = E.produkt(mo, k.produkt); k.sel[key] = v; k.notes = E.bereinige(mo, p, k.sel, key.split(".")[0]); K.render(); };
  K.inp.wahlZahl = el => eigenSetzen(el.dataset.k, el.value === "" ? null : Number(el.value));
  K.inp.wahlText = el => eigenSetzen(el.dataset.k, el.value);
  K.act.wahlJN = el => eigenSetzen(el.dataset.m + "." + el.dataset.w, !K.konf.sel[el.dataset.m + "." + el.dataset.w]);
  K.act.wahlSelect = el => { if (el.value) waehle(el.dataset.m, el.value); };
  K.act.export3d = async el => {
    const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt), name = (p.code || p.id) + "_" + new Date().toISOString().slice(0, 10);
    if (el.dataset.f === "png") { const url = await K.viewer().bild(mo, p, K.konf.sel, 1920, 1080); if (!url) return K.toast("3D-Ansicht nicht verfügbar."); const b = await (await fetch(url)).blob(); K.speichereDatei(name + ".png", b); }
    else { const z = await K.export3d(name).catch(e => { console.error(e); return null; }); if (z) K.speichereDatei(name + ".zip", z); else K.toast("3D-Export ist in dieser Ansicht nicht verfügbar."); }
  };
  K.act.stlCsv = () => {
    const mo = K.konfModell(), p = E.produkt(mo, K.konf.produkt), st = E.stueckliste(mo, p, K.konf.sel);
    const csv = "Pos;Artikel;Bezeichnung;Menge;ME;Herkunft\n" + st.map((r, i) => [(i + 1) * 10, r.nr, r.bez, String(r.menge).replace(".", ","), r.me, r.herkunft].join(";")).join("\n");
    K.speichereDatei(`Stueckliste_${p.code || p.id}.csv`, "﻿" + csv);
  };

  function positionAusKonfig() {
    const mo = live(), k = K.konf, p = E.produkt(mo, k.produkt), pr = E.preis(mo, p, k.sel);
    return { typ: "konfig", produkt: p.id, produktName: p.name, sel: K.clone(k.sel), zeilen: pr.zeilen, grundausstattung: (p.grundausstattung || []).map(x => ({ code: x.code, name: x.name })), einzel: pr.einzel, kosten: pr.kosten, menge: 1, rabatt: 0, version: mo.version };
  }
  K.act.konfUebernehmen = () => {
    const k = K.konf;
    if (!K.Store.schreiben) { K.toast("Sie haben nur Leserechte."); return; }
    { const mo = live(), p = E.produkt(mo, k.produkt), offen = E.offenePflicht(mo, p, k.sel);
      if (offen.length) { k.tab = E.bereich(offen[0]); K.render(); document.getElementById("mm-" + offen[0].id)?.scrollIntoView({ block: "center", behavior: "smooth" }); K.toast(`Noch ${offen.length} Pflichtangabe${offen.length > 1 ? "n" : ""} offen: ${offen.map(m => m.name).join(", ")}`); return; } }
    if (k.ziel) {
      const a = S().angebote.find(x => x.nr === k.ziel.nr); if (!a) { k.ziel = null; return K.act.konfUebernehmen(); }
      const neu = positionAusKonfig();
      if (k.ziel.idx != null && a.positionen[k.ziel.idx]) { const alt = a.positionen[k.ziel.idx]; neu.menge = alt.menge; neu.rabatt = alt.rabatt; a.positionen[k.ziel.idx] = neu; }
      else a.positionen.push(neu);
      K.Store.angebotSpeichern(a); const nr = a.nr; k.ziel = null; K.toast("Position übernommen"); K.gehe("angebot-" + nr); return;
    }
    const offen = S().angebote.filter(a => a.status === "entwurf").sort((x, y) => y.erstellt - x.erstellt);
    K.sheet(`<h3>In Angebot übernehmen</h3>
      <div class="feld"><label for="ua-kunde">Neues Angebot für</label><select id="ua-kunde">${kundenOptionen()}</select></div>
      <div class="row"><button class="btn primary" type="button" data-act="uebernehmenNeu">Neues Angebot anlegen</button></div>
      ${offen.length ? `<div class="trenner">oder zu einem Entwurf hinzufügen</div><ul class="liste">${offen.map(a => `<li><button type="button" class="zeile-link" data-act="uebernehmenIn" data-nr="${a.nr}"><span><b>${esc(a.kunde.firma)}</b><br><span class="mono klein">${a.nr}</span></span><span class="gedimmt klein">${a.positionen.length} Pos.</span></button></li>`).join("")}</ul>` : ""}
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button></div>`);
  };
  function kundenOptionen(aktiv) { return [...S().kunden].sort((a, b) => a.firma.localeCompare(b.firma)).map(k => `<option value="${k.id}" ${k.id === aktiv ? "selected" : ""}>${esc(k.firma)} · ${esc(k.ort)}</option>`).join(""); }
  K.act.konfGa = () => { K.konf.gaOffen = !K.konf.gaOffen; K.render(); };
  K.act.uebernehmenNeu = async () => { const kid = document.getElementById("ua-kunde").value; K.sheetZu(); const a = await neuesAngebot(kid); if (!a) return; a.positionen.push(positionAusKonfig()); await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };
  K.act.uebernehmenIn = el => { K.sheetZu(); K.konf.ziel = { nr: el.dataset.nr }; K.act.konfUebernehmen(); };

  /* =====================================================================
     Angebote
     ===================================================================== */
  async function neuesAngebot(kid) {
    const e = S().einst, k = S().kunden.find(x => x.id === kid);
    let num; try { num = await K.Store.naechsteNr(); } catch (err) { K.toast(err.message + " – Einstellungen › Nummern prüfen."); return null; }
    const nr = num.nr; if (num.quelle === "ersatz") K.toast("APplus hat keine Nummer geliefert, vorläufige Nummer " + nr + " vergeben.");
    const ich = K.Store.meinVertrieb || e.vertrieb[0]?.id;
    const a = { nr, kundeId: kid, kunde: k ? { firma: k.firma, person: k.person, strasse: k.strasse, ort: k.ort, mail: k.mail } : { firma: "", person: "", strasse: "", ort: "" },
      bearbeiter: ich, erstellt: Date.now(), gueltig: Date.now() + e.gueltigTage * 864e5, status: "entwurf", positionen: [], rabatt: 0,
      texte: { einleitung: e.vorlage.einleitung, lieferung: e.vorlage.lieferung, zahlung: e.vorlage.zahlung, gewaehrleistung: e.vorlage.gewaehrleistung, schluss: e.vorlage.schluss },
      token: null, freigegeben: false, events: [], nrQuelle: num.quelle, kundeNr: k?.nr || "" };
    { const b = (e.vertrieb || []).find(v => v.id === ich); if (b) a.bearbeiterInfo = { name: b.name, tel: b.tel, mail: b.mail, nr: b.nr || "" }; }
    await K.Store.nrVerbrauchen(nr); await K.Store.log("Angebote", `Angebot ${nr} angelegt`);
    return a;
  }
  K.act.angebotNeu = () => {
    if (!S().kunden.length) { K.toast("Bitte zuerst einen Kunden anlegen."); K.gehe("kunde-neu"); return; }
    K.sheet(`<h3>Neues Angebot</h3><div class="feld"><label for="na-kunde">Kunde</label><select id="na-kunde">${kundenOptionen()}</select></div>
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="angebotNeuOk">Anlegen</button></div>`);
  };
  K.act.angebotNeuOk = async () => { const kid = document.getElementById("na-kunde").value; K.sheetZu(); const a = await neuesAngebot(kid); if (!a) return; await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };

  K.ang = { status: "alle", suche: "" };
  K.route("angebote", () => {
    const f = K.ang, q = f.suche.toLowerCase();
    const liste = [...S().angebote].sort((a, b) => b.erstellt - a.erstellt)
      .filter(a => f.status === "alle" || (f.status === "heiss" ? K.heiss(a) : a.status === f.status))
      .filter(a => !q || (a.nr + " " + a.kunde.firma + " " + a.positionen.map(p => p.produktName || p.text).join(" ")).toLowerCase().includes(q));
    const zahl = s => S().angebote.filter(a => s === "heiss" ? K.heiss(a) : a.status === s).length;
    return kopf("Vertrieb", "Angebote", "", `<button class="btn primary" type="button" data-act="angebotNeu">Neues Angebot</button>`) + `
      <div class="filterleiste"><div class="segment" role="group" aria-label="Status">
        ${[["alle", "Alle", S().angebote.length], ["heiss", "Heiß", zahl("heiss")], ...Object.entries(STATUS).map(([k, v]) => [k, v, zahl(k)])].map(([id, n, c]) => `<button type="button" data-act="angStatus" data-s="${id}" aria-pressed="${f.status === id}">${n} <span class="zaehler">${c}</span></button>`).join("")}
      </div><input type="search" id="ang-suche" data-in="angSuche" placeholder="Nummer, Kunde oder Fahrzeug" value="${esc(f.suche)}"></div>
      ${angebotsTabelle(liste)}`;
  });
  K.act.angStatus = el => { K.ang.status = el.dataset.s; K.render(); };
  K.inp.angSuche = el => { K.ang.suche = el.value; K.render(); };

  /* ----- Angebot bearbeiten ----- */
  const ang = nr => S().angebote.find(a => a.nr === nr);
  let speicherTimer = {};
  function aendern(nr, fn, sofortZeichnen = true) {
    const a = ang(nr); if (!a) return; fn(a);
    clearTimeout(speicherTimer[nr]); speicherTimer[nr] = setTimeout(() => K.Store.angebotSpeichern(ang(nr) || a), 600);
    if (sofortZeichnen) K.render();
  }
  K.route("angebot-", nr => {
    const a = ang(nr); if (!a) return `<div class="leer">Angebot ${esc(nr)} nicht gefunden.<br><br><a class="btn" href="#angebote">Zu den Angeboten</a></div>`;
    const e = S().einst, sum = E.summen(a, e.mwst), lesbar = K.Store.schreiben;
    const av = K.aufrufe(a), mo = live();
    const tage = [...Array(14)].map((_, i) => { const t = new Date(); t.setHours(0, 0, 0, 0); const t0 = t.getTime() - (13 - i) * 864e5; return av.filter(x => x.ts >= t0 && x.ts < t0 + 864e5).length; });
    const mx = Math.max(1, ...tage), link = a.token ? location.href.split("#")[0] + "#" + a.token : "";
    const posZeilen = a.positionen.map((p, i) => {
      const veraltet = p.typ === "konfig" && mo && p.version !== mo.version;
      const brutto = p.einzel * p.menge, ges = brutto * (1 - (p.rabatt || 0) / 100);
      return `<tr>
        <td class="r num gedimmt">${(i + 1) * 10}</td>
        <td>${p.typ === "konfig" ? `<b>${esc(p.produktName)}</b>${veraltet ? ` <span class="chip warn" title="Mit Modell v${p.version} konfiguriert">Modell v${p.version}</span>` : ""}
            <details class="posdetail"><summary>${p.zeilen.length - 1} Merkmale</summary><ul>${p.zeilen.slice(1).map(z => `<li><span class="gedimmt">${esc(z.ueberschrift || z.merkmal)}:</span> ${esc(z.text)}</li>`).join("")}</ul></details>`
          : `<input id="pt-${i}" class="flach" data-in="posText" data-nr="${a.nr}" data-i="${i}" value="${esc(p.text)}" aria-label="Positionstext" ${lesbar ? "" : "disabled"}>`}</td>
        <td class="r">${p.typ === "frei" ? `<input id="pe-${i}" class="flach zahl" type="number" step="10" data-in="posEinzel" data-nr="${a.nr}" data-i="${i}" value="${p.einzel}" aria-label="Einzelpreis" ${lesbar ? "" : "disabled"}>` : `<span class="num">${K.eur2(p.einzel)}</span>`}</td>
        <td class="r"><input id="pm-${i}" class="flach zahl kurz" type="number" min="1" data-in="posMenge" data-nr="${a.nr}" data-i="${i}" value="${p.menge}" aria-label="Menge" ${lesbar ? "" : "disabled"}></td>
        <td class="r"><input id="pr-${i}" class="flach zahl kurz" type="number" min="0" max="100" step="0.5" data-in="posRabatt" data-nr="${a.nr}" data-i="${i}" value="${p.rabatt || 0}" aria-label="Rabatt in Prozent" ${lesbar ? "" : "disabled"}></td>
        <td class="r num"><b>${K.eur2(ges)}</b></td>
        <td class="r nowrap">${lesbar ? `${p.typ === "konfig" ? `<button type="button" class="ikon" data-act="posBearbeiten" data-nr="${a.nr}" data-i="${i}" title="Konfiguration bearbeiten">✎</button>${veraltet ? `<button type="button" class="ikon" data-act="posNeuBewerten" data-nr="${a.nr}" data-i="${i}" title="Mit aktuellem Modell neu bewerten">↻</button>` : ""}` : ""}
          <button type="button" class="ikon" data-act="posKopie" data-nr="${a.nr}" data-i="${i}" title="Position kopieren">⧉</button>
          <button type="button" class="ikon" data-act="posHoch" data-nr="${a.nr}" data-i="${i}" title="Nach oben" ${i ? "" : "disabled"}>↑</button>
          <button type="button" class="ikon gefahr" data-act="posWeg" data-nr="${a.nr}" data-i="${i}" title="Position entfernen">✕</button>` : ""}</td></tr>`;
    }).join("");
    const textFeld = (key, titel, zeilen = 3) => `<div class="feld"><label for="tx-${key}">${titel}</label><textarea id="tx-${key}" rows="${zeilen}" data-in="angText" data-nr="${a.nr}" data-k="${key}" ${lesbar ? "" : "disabled"}>${esc(a.texte?.[key] || "")}</textarea></div>`;
    return `${kopf("Angebot", `${esc(a.nr)} <span class="titel-zusatz">${esc(a.kunde.firma)}</span>`, "",
      `${K.statusChip(a)}${a.nrQuelle === "applus" ? `<span class="chip" title="Nummer aus dem Nummernkreis von APplus">Nr. aus APplus</span>` : a.nrQuelle === "ersatz" ? `<span class="chip warn" title="APplus hat beim Anlegen keine Nummer geliefert">vorläufige Nr.</span>` : ""}<select id="a-vorlage" class="ang-vorlage" data-act="angVorlage" data-nr="${a.nr}" aria-label="Vorlage für das Dokument" title="Vorlage für das Angebotsdokument" ${lesbar ? "" : "disabled"}><option value="">Vorlage: automatisch (${esc(K.dok.vorlageFuer({ ...a, vorlageId: null }, mo).name)})</option>${K.dok.vorlagen().map(v => `<option value="${v.id}" ${a.vorlageId === v.id ? "selected" : ""}>Vorlage: ${esc(v.name)}</option>`).join("")}</select>
       <button class="btn" type="button" data-act="angVorschau" data-nr="${a.nr}">Dokument ansehen</button><button class="btn" type="button" data-act="angDrucken" data-nr="${a.nr}">Drucken</button><button class="btn primary" type="button" data-act="angPdf" data-nr="${a.nr}">PDF speichern</button>
       <button class="btn" type="button" data-act="angKopie" data-nr="${a.nr}">Duplizieren</button>
       <button class="btn gefahr-text" type="button" data-act="angLoeschen" data-nr="${a.nr}">Löschen</button>`)}
    ${a.beispiel ? `<div class="hinweis" style="margin-bottom:12px">Beispielangebot mit erfundenen Kundenaktivitäten.</div>` : ""}
    ${K.offeneFragen(a).map(q => `<div class="hinweis warn frage"><div><b>Rückfrage vom ${K.zeit(q.ts)}</b><q>${esc(q.text)}</q></div><button class="btn klein" type="button" data-act="frageErledigt" data-nr="${a.nr}" data-ts="${q.ts}">Als beantwortet markieren</button></div>`).join("")}
    <div class="angebot-layout"><div class="haupt">
      <section class="panel"><div class="formgitter">
        <div class="feld"><label for="a-kunde">Kunde</label><select id="a-kunde" data-act="angKunde" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${kundenOptionen(a.kundeId)}</select></div>
        <div class="feld"><label for="a-person">Ansprechpartner</label><input id="a-person" data-in="angKundeFeld" data-k="person" data-nr="${a.nr}" value="${esc(a.kunde.person)}" ${lesbar ? "" : "disabled"}></div>
        <div class="feld"><label for="a-bearb">Bearbeiter</label><select id="a-bearb" data-act="angFeld" data-k="bearbeiter" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${(e.vertrieb || []).map(v => `<option value="${v.id}" ${v.id === a.bearbeiter ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div>
        <div class="feld"><label for="a-status">Status</label><select id="a-status" data-act="angFeld" data-k="status" data-nr="${a.nr}" ${lesbar ? "" : "disabled"}>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === a.status ? "selected" : ""}>${v}</option>`).join("")}</select></div>
        <div class="feld"><label>Erstellt</label><div class="wert">${K.datum(a.erstellt)}</div></div>
        <div class="feld"><label for="a-gueltig">Gültig bis</label><input id="a-gueltig" type="date" data-chg="angGueltig" data-nr="${a.nr}" value="${new Date(a.gueltig).toISOString().slice(0, 10)}" ${lesbar ? "" : "disabled"}></div>
      </div></section>
      <section class="panel"><div class="panelkopf"><h3>Positionen</h3>${lesbar ? `<div class="row"><button class="btn klein" type="button" data-act="posKonfig" data-nr="${a.nr}">+ Fahrzeug konfigurieren</button><button class="btn klein" type="button" data-act="posFrei" data-nr="${a.nr}">+ Freie Position</button></div>` : ""}</div>
        ${a.positionen.length ? `<div class="tabwrap ohne-rand"><table class="positionen"><thead><tr><th class="r">Pos</th><th>Bezeichnung</th><th class="r">Einzelpreis</th><th class="r">Menge</th><th class="r">Rabatt %</th><th class="r">Gesamt</th><th></th></tr></thead><tbody>${posZeilen}</tbody></table></div>`
          : `<p class="leer-klein">Noch keine Positionen. Fahrzeug konfigurieren oder eine freie Position (z. B. Überführung, Einweisung) hinzufügen.</p>`}
        <div class="summenblock">
          <div class="kalkbox"><div class="eyebrow">Kalkulation (intern)</div>
            <dl class="kalk"><dt>Herstellkosten</dt><dd class="num">${K.eur(sum.kosten)}</dd><dt>Deckungsbeitrag</dt><dd class="num">${K.eur(sum.db)}</dd><dt>Marge</dt><dd class="num ${sum.marge < 20 ? "warn" : "ok"}">${K.zahl(sum.marge, 1)} %</dd></dl></div>
          <dl class="summen num">
            <dt>Listenpreis</dt><dd>${K.eur2(sum.liste)}</dd>
            ${sum.posRabatt ? `<dt>Positionsrabatte</dt><dd>− ${K.eur2(sum.posRabatt)}</dd>` : ""}
            <dt><label for="a-rabatt">Gesamtrabatt %</label></dt><dd><input id="a-rabatt" class="flach zahl kurz" type="number" min="0" max="100" step="0.5" data-in="angRabatt" data-nr="${a.nr}" value="${a.rabatt || 0}" ${lesbar ? "" : "disabled"}>${sum.gesamtRabatt ? ` <span class="gedimmt">− ${K.eur2(sum.gesamtRabatt)}</span>` : ""}</dd>
            <dt>Summe netto</dt><dd>${K.eur2(sum.netto)}</dd><dt>USt. ${e.mwst} %</dt><dd>${K.eur2(sum.ust)}</dd>
            <dt class="gesamt">Gesamtbetrag</dt><dd class="gesamt">${K.eur2(sum.brutto)}</dd></dl>
        </div></section>
      <details class="panel texte" ${a.positionen.length ? "" : "open"}><summary><h3>Angebotstexte</h3><span class="gedimmt klein">Platzhalter wie {{kunde.firma}} werden im PDF ersetzt</span></summary>
        ${textFeld("einleitung", "Einleitung", 4)}${textFeld("lieferung", "Lieferung", 2)}${textFeld("zahlung", "Zahlungsbedingungen", 2)}${textFeld("gewaehrleistung", "Gewährleistung", 2)}${textFeld("schluss", "Schlusstext", 3)}
        ${lesbar ? `<button class="btn klein" type="button" data-act="angTexteVorlage" data-nr="${a.nr}">Texte aus Vorlage übernehmen</button>` : ""}</details>
    </div>
    <aside class="neben">
      <section class="panel"><div class="panelkopf"><h3>Verkaufsraum</h3>${a.freigegeben ? `<span class="chip st-angenommen">Freigegeben</span>` : `<span class="chip">Nicht freigegeben</span>`}</div>
        ${a.freigegeben ? `<p class="klein gedimmt">Der Kunde sieht Konfiguration, 3D-Ansicht und Preis und kann annehmen oder nachfragen. Jeder Aufruf wird hier gezählt.</p>
          <div class="linkfeld"><input id="a-link" readonly value="${esc(link)}" aria-label="Link für den Kunden"><button class="btn klein" type="button" data-act="linkKopieren">Kopieren</button></div>
          <div class="row" style="margin-top:8px"><button class="btn klein" type="button" data-act="vorschau" data-t="${a.token}">Als Kunde ansehen</button>${lesbar ? `<button class="btn klein" type="button" data-act="freigabe" data-nr="${a.nr}" data-an="0">Freigabe zurückziehen</button>` : ""}</div>
          <p class="klein gedimmt" style="margin-top:8px">Hinweis Prototyp: Kunden außerhalb Ihrer Organisation können den Link erst öffnen, wenn die Seite geteilt ist. In APplus läuft der Link über Ihren Webserver.</p>`
          : `<p class="klein gedimmt">Erzeugt einen persönlichen Link für ${esc(a.kunde.person || a.kunde.firma)}.</p>${lesbar ? `<button class="btn gelb" type="button" data-act="freigabe" data-nr="${a.nr}" data-an="1" ${a.positionen.length ? "" : "disabled"}>Im Verkaufsraum freigeben</button>` : ""}`}
      </section>
      <section class="panel"><div class="panelkopf"><h3>Aktivität</h3></div>
        <div class="miniwerte"><div><b class="num">${av.length}</b><span>Aufrufe</span></div><div><b class="num">${av.length ? K.dauer(lesezeit(a)) : "–"}</b><span>Lesezeit</span></div><div><b class="num">${av.length ? K.rel(Math.max(...av.map(x => x.ts))) : "–"}</b><span>zuletzt</span></div></div>
        <div class="balken" aria-label="Aufrufe der letzten 14 Tage">${tage.map(n => `<div class="${n ? "" : "leer"}" style="height:${n ? Math.max(12, n / mx * 100) : 4}%" title="${n} Aufrufe"></div>`).join("")}</div>
        <div class="balkenlabel"><span>vor 14 Tagen</span><span>heute</span></div>
        <ul class="zeitachse" style="margin-top:14px">
          <li><time>${K.zeit(a.erstellt)}</time>Angebot erstellt von ${esc(vertriebName(a.bearbeiter))}</li>
          ${[...(a.events || [])].sort((x, y) => x.ts - y.ts).map(ev => `<li class="${ev.typ}"><time>${K.zeit(ev.ts)}</time>${ev.typ === "aufruf" ? `Geöffnet · ${K.dauer(ev.dauer)} · ${esc(ev.geraet || "")}` : ev.typ === "pdf" ? "PDF gespeichert" : ev.typ === "rueckfrage" ? `Rückfrage${ev.erledigt ? " (beantwortet)" : ""}<q>${esc(ev.text)}</q>` : `Angenommen von ${esc(ev.name)}`}</li>`).join("")}
        </ul></section>
    </aside></div>`;
  });
  K.inp.posMenge = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].menge = Math.max(1, +el.value || 1));
  K.inp.posRabatt = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].rabatt = Math.min(100, Math.max(0, +el.value || 0)));
  K.inp.posEinzel = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].einzel = +el.value || 0);
  K.inp.posText = el => aendern(el.dataset.nr, a => a.positionen[el.dataset.i].text = el.value, false);
  K.inp.angRabatt = el => aendern(el.dataset.nr, a => a.rabatt = Math.min(100, Math.max(0, +el.value || 0)));
  K.inp.angText = el => aendern(el.dataset.nr, a => { a.texte = a.texte || {}; a.texte[el.dataset.k] = el.value; }, false);
  K.inp.angKundeFeld = el => aendern(el.dataset.nr, a => a.kunde[el.dataset.k] = el.value, false);
  K.inp.angGueltig = el => { const t = new Date(el.value).getTime(); if (t) aendern(el.dataset.nr, a => a.gueltig = t); };
  K.act.angFeld = el => aendern(el.dataset.nr, a => { a[el.dataset.k] = el.value; if (el.dataset.k === "status") K.Store.log("Angebote", `${a.nr} auf ${STATUS[el.value]} gesetzt`); });
  K.act.angKunde = el => aendern(el.dataset.nr, a => { const k = S().kunden.find(x => x.id === el.value); a.kundeId = k.id; a.kunde = { firma: k.firma, person: k.person, strasse: k.strasse, ort: k.ort, mail: k.mail }; });
  K.act.posHoch = el => aendern(el.dataset.nr, a => { const i = +el.dataset.i; [a.positionen[i - 1], a.positionen[i]] = [a.positionen[i], a.positionen[i - 1]]; });
  K.act.posKopie = el => aendern(el.dataset.nr, a => a.positionen.splice(+el.dataset.i + 1, 0, K.clone(a.positionen[el.dataset.i])));
  K.act.posWeg = el => aendern(el.dataset.nr, a => a.positionen.splice(+el.dataset.i, 1));
  K.act.posFrei = el => aendern(el.dataset.nr, a => a.positionen.push({ typ: "frei", text: "Überführung zum Kunden", einzel: 850, kosten: 600, menge: 1, rabatt: 0 }));
  K.act.posKonfig = el => { K.konf.ziel = { nr: el.dataset.nr }; K.gehe("katalog"); };
  K.act.posBearbeiten = el => { const a = ang(el.dataset.nr), p = a.positionen[el.dataset.i]; K.konfigOeffnen(p.produkt, p.sel, { nr: a.nr, idx: +el.dataset.i }); };
  K.act.posNeuBewerten = el => aendern(el.dataset.nr, a => {
    const p = a.positionen[el.dataset.i], mo = live(), prod = E.produkt(mo, p.produkt); if (!prod) return K.toast("Fahrzeug existiert im aktuellen Modell nicht mehr.");
    const s = K.clone(p.sel), notes = E.bereinige(mo, prod, s), pr = E.preis(mo, prod, s);
    Object.assign(p, { sel: s, zeilen: pr.zeilen, einzel: pr.einzel, kosten: pr.kosten, version: mo.version, produktName: prod.name });
    K.toast(notes.length ? `Neu bewertet, ${notes.length} Merkmale angepasst` : "Mit aktuellem Modell neu bewertet");
  });
  K.act.angTexteVorlage = el => aendern(el.dataset.nr, a => { const v = S().einst.vorlage; a.texte = { einleitung: v.einleitung, lieferung: v.lieferung, zahlung: v.zahlung, gewaehrleistung: v.gewaehrleistung, schluss: v.schluss }; });
  K.act.frageErledigt = el => aendern(el.dataset.nr, a => { const q = a.events.find(x => x.typ === "rueckfrage" && String(x.ts) === el.dataset.ts); if (q) q.erledigt = true; });
  K.act.freigabe = el => aendern(el.dataset.nr, a => {
    const an = el.dataset.an === "1"; a.freigegeben = an; if (an && !a.token) a.token = K.token();
    if (an && a.status === "entwurf") a.status = "versendet";
    K.Store.log("Angebote", `${a.nr} im Verkaufsraum ${an ? "freigegeben" : "zurückgezogen"}`);
  });
  K.act.linkKopieren = () => { const i = document.getElementById("a-link"); (navigator.clipboard ? navigator.clipboard.writeText(i.value) : Promise.reject()).then(() => K.toast("Link kopiert"), () => { i.select(); K.toast("Link markiert, bitte mit Strg+C kopieren"); }); };
  K.act.angKopie = async el => {
    let num; try { num = await K.Store.naechsteNr(); } catch (err) { return K.toast(err.message); }
    const a = K.clone(ang(el.dataset.nr)), nr = num.nr; a.nrQuelle = num.quelle;
    Object.assign(a, { nr, erstellt: Date.now(), gueltig: Date.now() + S().einst.gueltigTage * 864e5, status: "entwurf", token: null, freigegeben: false, events: [], beispiel: false });
    await K.Store.nrVerbrauchen(nr); await K.Store.angebotSpeichern(a); await K.Store.log("Angebote", `${nr} als Kopie von ${el.dataset.nr} angelegt`); K.gehe("angebot-" + nr);
  };
  K.act.angLoeschen = el => K.sheet(`<h3>Angebot ${esc(el.dataset.nr)} löschen?</h3><p>Das Angebot und alle Aufrufe im Verkaufsraum werden entfernt. Der Kundenlink funktioniert danach nicht mehr.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="angLoeschenOk" data-nr="${esc(el.dataset.nr)}">Endgültig löschen</button></div>`);
  K.act.angLoeschenOk = async el => { K.sheetZu(); await K.Store.angebotLoeschen(el.dataset.nr); K.gehe("angebote"); K.toast("Angebot gelöscht"); };
  K.act.angPdf = async el => {
    const a = ang(el.dataset.nr); if (!a.positionen.length) return K.toast("Das Angebot hat noch keine Positionen.");
    el.disabled = true; el.textContent = "PDF wird erstellt …";
    try { const blob = await K.pdfErzeugen(a, live()); await K.speichereDatei(`Angebot_${a.nr}.pdf`, blob); }
    catch (e) { console.error(e); K.toast("PDF konnte nicht erstellt werden."); }
    K.render();
  };

  /* =====================================================================
     Kunden
     ===================================================================== */
  K.kd = { suche: "" };
  K.route("kunden", () => {
    const q = K.kd.suche.toLowerCase();
    const liste = [...S().kunden].sort((a, b) => a.firma.localeCompare(b.firma)).filter(k => !q || Object.values(k).join(" ").toLowerCase().includes(q));
    return kopf("Vertrieb", "Kunden", "", `<a class="btn primary" href="#kunde-neu">Neuer Kunde</a>`) + `
      <div class="filterleiste"><input type="search" id="kd-suche" data-in="kdSuche" placeholder="Firma, Ort, Ansprechpartner oder Kundennummer" value="${esc(K.kd.suche)}"></div>
      ${liste.length ? `<div class="tabwrap"><table class="klickbar"><thead><tr><th>Nr.</th><th>Firma</th><th>Ansprechpartner</th><th>Ort</th><th class="r">Angebote</th><th class="r">Volumen netto</th></tr></thead><tbody>
      ${liste.map(k => { const as = S().angebote.filter(a => a.kundeId === k.id); return `<tr data-act="oeffne" data-ziel="kunde-${k.id}" tabindex="0"><td class="mono">${esc(k.nr)}</td><td><b>${esc(k.firma)}</b></td><td>${esc(k.person)}</td><td class="gedimmt">${esc(k.ort)}</td><td class="r num">${as.length}</td><td class="r num">${K.eur(as.reduce((n, a) => n + E.summen(a, S().einst.mwst).netto, 0))}</td></tr>`; }).join("")}
      </tbody></table></div>` : `<div class="leer">Keine Kunden gefunden.</div>`}`;
  });
  K.inp.kdSuche = el => { K.kd.suche = el.value; K.render(); };
  K.kdEntwurf = null;
  K.route("kunde-", id => {
    const neu = id === "neu";
    let k = neu ? (K.kdEntwurf ||= { id: K.id("k"), nr: String(10000 + Math.floor(Math.random() * 9000)), firma: "", person: "", strasse: "", ort: "", land: "DE", mail: "", tel: "", notiz: "" }) : S().kunden.find(x => x.id === id);
    if (!k) return `<div class="leer">Kunde nicht gefunden.</div>`;
    const as = S().angebote.filter(a => a.kundeId === k.id).sort((a, b) => b.erstellt - a.erstellt);
    const f = (key, l, typ = "text", breit) => `<div class="feld${breit ? " breit" : ""}"><label for="kd-${key}">${l}</label><input id="kd-${key}" type="${typ}" data-in="kdFeld" data-k="${key}" data-id="${neu ? "neu" : k.id}" value="${esc(k[key])}" ${K.Store.schreiben ? "" : "disabled"}></div>`;
    return kopf("Kunde", neu ? "Neuer Kunde" : esc(k.firma), "", neu ? `<button class="btn primary" type="button" data-act="kdAnlegen">Kunde anlegen</button>` : `<button class="btn" type="button" data-act="kdAngebot" data-id="${k.id}">Neues Angebot</button><button class="btn gefahr-text" type="button" data-act="kdLoeschen" data-id="${k.id}">Löschen</button>`) + `
      <section class="panel"><div class="formgitter">${f("firma", "Firma", "text", true)}${f("nr", "Kundennummer")}${f("person", "Ansprechpartner")}${f("strasse", "Straße")}${f("ort", "PLZ und Ort")}${f("mail", "E-Mail", "email")}${f("tel", "Telefon", "tel")}
        <div class="feld breit"><label for="kd-notiz">Notiz</label><textarea id="kd-notiz" rows="2" data-in="kdFeld" data-k="notiz" data-id="${neu ? "neu" : k.id}">${esc(k.notiz)}</textarea></div></div></section>
      ${neu ? "" : `<section style="margin-top:16px"><h3 class="abschnitt">Angebote</h3>${angebotsTabelle(as)}</section>`}`;
  });
  let kdTimer;
  K.inp.kdFeld = el => {
    if (el.dataset.id === "neu") { K.kdEntwurf[el.dataset.k] = el.value; return; }
    const k = S().kunden.find(x => x.id === el.dataset.id); k[el.dataset.k] = el.value;
    clearTimeout(kdTimer); kdTimer = setTimeout(() => K.Store.kundeSpeichern(k), 600);
  };
  K.act.kdAnlegen = async () => {
    const k = K.kdEntwurf; if (!k.firma.trim()) { K.toast("Bitte die Firma eintragen."); document.getElementById("kd-firma").focus(); return; }
    K.kdEntwurf = null; await K.Store.kundeSpeichern(k, true); K.gehe("kunde-" + k.id);
  };
  K.act.kdAngebot = async el => { const a = await neuesAngebot(el.dataset.id); if (!a) return; await K.Store.angebotSpeichern(a); K.gehe("angebot-" + a.nr); };
  K.act.kdLoeschen = el => {
    const n = S().angebote.filter(a => a.kundeId === el.dataset.id).length;
    K.sheet(`<h3>Kunde löschen?</h3><p>${n ? `Zu diesem Kunden gibt es ${n} Angebote. Sie bleiben erhalten, verweisen aber auf keinen Kunden mehr.` : "Der Kunde wird entfernt."}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="kdLoeschenOk" data-id="${el.dataset.id}">Löschen</button></div>`);
  };
  K.act.kdLoeschenOk = async el => { K.sheetZu(); await K.Store.kundeLoeschen(el.dataset.id); K.gehe("kunden"); };

  /* =====================================================================
     Verkaufsraum (Kundensicht)
     ===================================================================== */
  K.raum = { token: null, ev: null, start: 0, pos: 0, modus: null };
  K.vorschau = false;
  K.act.vorschau = el => { K.vorschau = true; K.gehe(el.dataset.t); };
  function raumBesuchBeenden() {
    const r = K.raum; if (!r.ev) return;
    const a = S().angebote.find(x => x.token === r.token);
    const ev = { ...r.ev, dauer: Math.round((r.ev.dauer || 0) + (Date.now() - r.start) / 1000) };
    r.ev = null; if (a) K.Store.ereignis(a.nr, ev);
  }
  K.raumVerlassen = () => { raumBesuchBeenden(); K.raum.token = null; };
  document.addEventListener("visibilitychange", () => {
    const r = K.raum; if (!r.token || K.vorschau) return;
    if (document.visibilityState === "hidden" && r.ev) { const ev = r.ev; raumBesuchBeenden(); r.pausiert = ev; }
    else if (document.visibilityState === "visible" && r.pausiert) { r.ev = r.pausiert; r.pausiert = null; r.start = Date.now(); }
  });
  window.addEventListener("pagehide", raumBesuchBeenden);

  K.route("raum-", token => {
    const a = S().angebote.find(x => x.token === "raum-" + token);
    const firma = S().einst?.firma || { name: "" };
    const bar = K.vorschau ? `<div class="demobar"><b>Vorschau aus Kundensicht</b><span>Wird nicht als Aufruf gezählt.</span><button class="btn klein" type="button" data-act="vorschauEnde" data-nr="${a ? a.nr : ""}">Zurück zum Angebot</button></div>` : "";
    if (!a || !a.freigegeben) return bar + `<div class="raum"><div class="leer"><b>Dieses Angebot ist nicht mehr verfügbar.</b><br>Bitte wenden Sie sich an Ihren Ansprechpartner bei ${esc(firma.name)}.</div></div>`;
    const r = K.raum;
    if (r.token !== a.token) {
      raumBesuchBeenden(); r.token = a.token; r.pos = 0; r.modus = null;
      if (!K.vorschau) { r.ev = { id: K.id("e"), typ: "aufruf", ts: Date.now(), dauer: 0, geraet: matchMedia("(max-width:700px)").matches ? "Mobil" : "Desktop" }; r.start = Date.now(); K.Store.ereignis(a.nr, r.ev); }
    }
    const e = S().einst, sum = E.summen(a, e.mwst), v = (e.vertrieb || []).find(x => x.id === a.bearbeiter) || {}, mo = live();
    const konf = a.positionen.filter(p => p.typ === "konfig"), p = konf[Math.min(r.pos, konf.length - 1)];
    const prod = p && mo ? E.produkt(mo, p.produkt) : null;
    if (prod) K.nach(view => { const pl = view.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, prod, p.sel); });
    const angenommen = a.status === "angenommen", abgelaufen = Date.now() > a.gueltig;
    const vorname = (a.kunde.person || "").replace(/^(Herr|Frau)\s+/, "");
    return bar + `<div class="raum">
      <header class="raum-kopf"><div class="raum-marke">${esc(firma.name)}<i></i></div><span class="gedimmt">Angebot <span class="mono">${esc(a.nr)}</span> · gültig bis ${K.datum(a.gueltig)}</span></header>
      <section class="raum-hero"><div>
        <div class="eyebrow">Für ${esc(a.kunde.firma)}</div>
        <h1>${konf.length === 1 ? `Ihr ${esc(konf[0].produktName)}` : `Ihre ${konf.length} Fahrzeuge`}</h1>
        <p>${a.kunde.person ? `Guten Tag ${esc(a.kunde.person)}, ` : ""}hier sehen Sie Ihre Konfiguration in 3D, alle Ausstattungsdetails und Ihren Preis. Drehen Sie das Fahrzeug mit der Maus oder dem Finger.</p>
      </div></section>
      ${konf.length > 1 ? `<div class="segment raum-tabs" role="tablist">${konf.map((x, i) => `<button type="button" role="tab" data-act="raumPos" data-i="${i}" aria-selected="${i === r.pos}">${x.menge}× ${esc(x.produktName)}</button>`).join("")}</div>` : ""}
      <div class="raum-grid">
        <div class="panel ansicht gross"><div data-viewer class="viewerplatz"></div></div>
        <div class="panel"><div class="eyebrow">Ausstattung</div>
          ${p ? `<dl class="spec">${p.zeilen.slice(1).map(z => `<dt>${esc(z.ueberschrift || z.merkmal)}</dt><dd>${esc(z.text)}</dd>`).join("")}</dl>
          <div class="row zwischen" style="margin-top:12px"><span class="gedimmt">Einzelpreis netto</span><b class="num">${K.eur2(p.einzel)}</b></div>` : ""}
        </div>
      </div>
      <div class="raum-grid unten">
        <section class="panel"><div class="eyebrow">Ihr Angebot im Überblick</div>
          <div class="tabwrap ohne-rand"><table><tbody>${a.positionen.map(x => `<tr><td>${x.menge}×</td><td>${esc(x.produktName || x.text)}${x.rabatt ? ` <span class="gedimmt klein">abzgl. ${K.zahl(x.rabatt, 1)} %</span>` : ""}</td><td class="r num">${K.eur2(x.einzel * x.menge * (1 - (x.rabatt || 0) / 100))}</td></tr>`).join("")}
          ${a.rabatt ? `<tr><td></td><td>Gesamtrabatt ${K.zahl(a.rabatt, 1)} %</td><td class="r num">− ${K.eur2(sum.gesamtRabatt)}</td></tr>` : ""}</tbody></table></div>
          <div class="raum-preis"><span>Gesamt netto</span><b class="num">${K.eur2(sum.netto)}</b><small>zzgl. ${e.mwst} % USt. ${K.eur2(sum.ust)} · brutto ${K.eur2(sum.brutto)}</small></div>
          ${a.texte?.lieferung ? `<p class="klein gedimmt">${esc(K.platzhalter(a.texte.lieferung, a, e))}</p>` : ""}
        </section>
        <section class="panel" id="raum-aktion">
          ${angenommen ? `<div class="hinweis ok"><b>Sie haben dieses Angebot angenommen.</b> Vielen Dank. Wir melden uns in Kürze mit der Auftragsbestätigung.</div>`
            : abgelaufen ? `<div class="hinweis warn">Dieses Angebot ist am ${K.datum(a.gueltig)} abgelaufen. Für eine Verlängerung wenden Sie sich bitte an uns.</div>`
            : r.modus === "annehmen" ? `<div class="form"><div class="feld"><label for="r-name">Name der unterzeichnenden Person</label><input id="r-name" value="${esc(vorname)}"></div>
                <p class="klein gedimmt">Mit der Bestätigung nehmen Sie das Angebot ${esc(a.nr)} über ${K.eur2(sum.brutto)} brutto verbindlich an.</p>
                <div class="row"><button class="btn gelb" type="button" data-act="raumAnnehmen" data-nr="${a.nr}">Verbindlich annehmen</button><button class="btn" type="button" data-act="raumModus" data-m="">Abbrechen</button></div></div>`
            : r.modus === "frage" ? `<div class="form"><div class="feld"><label for="r-frage">Ihre Frage an ${esc(v.name || "uns")}</label><textarea id="r-frage" rows="4" placeholder="z. B. Lieferzeit, andere Bereifung, Finanzierung"></textarea></div>
                <div class="row"><button class="btn primary" type="button" data-act="raumFrage" data-nr="${a.nr}">Frage senden</button><button class="btn" type="button" data-act="raumModus" data-m="">Abbrechen</button></div></div>`
            : `<div class="eyebrow">Wie möchten Sie weitermachen?</div><div class="raum-knoepfe">
                <button class="btn gelb gross" type="button" data-act="raumModus" data-m="annehmen">Angebot annehmen</button>
                <button class="btn gross" type="button" data-act="raumModus" data-m="frage">Rückfrage stellen</button>
                <button class="btn gross" type="button" data-act="raumPdf" data-nr="${a.nr}">Angebot als PDF</button></div>`}
          <div class="ansprech"><div class="avatar">${esc((v.name || "?").split(" ").map(x => x[0]).join(""))}</div><div><b>${esc(v.name || "")}</b><br><span class="gedimmt klein">Ihr Ansprechpartner</span><br><span class="mono klein">${esc(v.tel || "")}</span><br><span class="mono klein">${esc(v.mail || "")}</span></div></div>
        </section>
      </div></div>`;
  }, { kunde: true });
  K.act.raumPos = el => { K.raum.pos = +el.dataset.i; K.render(); };
  K.act.raumModus = el => { K.raum.modus = el.dataset.m || null; K.render(); };
  K.act.vorschauEnde = el => { K.vorschau = false; K.raum.token = null; K.gehe(el.dataset.nr ? "angebot-" + el.dataset.nr : "angebote"); };
  K.act.raumAnnehmen = async el => {
    const n = document.getElementById("r-name").value.trim(); if (!n) { document.getElementById("r-name").focus(); return; }
    if (K.vorschau) { K.toast("Vorschau: Annahme wird nicht gespeichert."); K.raum.modus = null; K.render(); return; }
    await K.Store.ereignis(el.dataset.nr, { id: K.id("e"), typ: "angenommen", ts: Date.now(), name: n }); K.raum.modus = null; K.toast("Angebot angenommen"); K.render();
  };
  K.act.raumFrage = async el => {
    const t = document.getElementById("r-frage").value.trim(); if (!t) { document.getElementById("r-frage").focus(); return; }
    if (K.vorschau) { K.toast("Vorschau: Rückfrage wird nicht gespeichert."); K.raum.modus = null; K.render(); return; }
    await K.Store.ereignis(el.dataset.nr, { id: K.id("e"), typ: "rueckfrage", ts: Date.now(), text: t }); K.raum.modus = null; K.toast("Ihre Frage wurde übermittelt"); K.render();
  };
  K.act.raumPdf = async el => {
    const a = S().angebote.find(x => x.nr === el.dataset.nr); el.disabled = true; el.textContent = "PDF wird erstellt …";
    try { const ok = await K.speichereDatei(`Angebot_${a.nr}.pdf`, await K.pdfErzeugen(a, live())); if (ok && !K.vorschau) K.Store.ereignis(a.nr, { id: K.id("e"), typ: "pdf", ts: Date.now() }); }
    catch (e) { K.toast("PDF konnte nicht erstellt werden."); }
    K.render();
  };
})();


/* ===== studio.js ===== */
/* =========================================================================
   Studio: Pflege des Konfigurationsmodells
   Alle Änderungen gehen in den ENTWURF. Der Vertrieb arbeitet mit der zuletzt
   veröffentlichten Version, bis unter "Freigabe" eine neue Version erzeugt wird.
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const ent = () => S().entwurf;
  K.st = { produkt: null, merkmal: null, regelTab: "liste", regelOffen: null, regelFilter: { produkt: "", merkmal: "", suche: "" }, matrix: { a: "achsen", b: "lenkung", produkt: "" }, test: { produkt: null, res: null }, offenWert: null };
  const ro = () => !K.Store.schreiben;
  const dis = () => ro() ? "disabled" : "";
  const geaendert = (text, zeichnen = true) => { K.Store.entwurfGeaendert(text); if (zeichnen) K.render(); };
  const kopf = (titel, text, aktionen = "") => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Entwurf${ent()?.version ? ` auf Basis v${ent().version}` : ""}</div><h2>${titel}</h2>${text ? `<p>${text}</p>` : ""}</div>${aktionen ? `<div class="row">${aktionen}</div>` : ""}</div>`;
  const chipWahl = (werte, aktiv, act, daten) => `<div class="chipwahl">${werte.map(w => `<button type="button" class="chipbtn" data-act="${act}" ${daten} data-w="${esc(w.id)}" aria-pressed="${aktiv.includes(w.id)}" ${dis()}>${esc(w.name)}</button>`).join("")}</div>`;
  const merkmalOptionen = (aktiv, leerText) => `${leerText ? `<option value="">${leerText}</option>` : ""}${ent().merkmale.map(m => `<option value="${m.id}" ${m.id === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("")}`;
  const verwendung = mid => ({ produkte: ent().produkte.filter(p => E.hatMerkmal(ent(), p, mid)), regeln: ent().regeln.filter(r => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).includes(mid) : ((r.wenn || []).some(c => c.merkmal === mid) || r.dann?.merkmal === mid)) });
  const keinEntwurf = () => `<div class="leer"><b>Es gibt noch kein Konfigurationsmodell.</b><br>${K.Store.modus === "db" && K.Store.schreiben ? `Laden Sie das Startmodell mit Beispielfahrzeugen und passen Sie es an.<br><br><button class="btn primary" type="button" data-act="startmodell">Startmodell laden</button>` : ""}</div>`;
  K.act.startmodell = async el => { el.disabled = true; el.textContent = "Wird geladen …"; await K.Store.startmodellLaden(); K.toast("Startmodell geladen"); };

  /* =====================================================================
     Produkte
     ===================================================================== */
  K.route("studio-produkte", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const st = K.st; if (!E.produkt(mo, st.produkt)) st.produkt = mo.produkte[0]?.id || null;
    const p = E.produkt(mo, st.produkt);
    const liste = mo.gruppen.map(g => `<div class="listgruppe">${esc(g.name)}</div>${mo.produkte.filter(x => x.gruppe === g.id).map(x => `<button type="button" class="listeintrag" data-act="stProdukt" data-p="${x.id}" aria-current="${x.id === st.produkt}"><span>${esc(x.name)}</span><span class="gedimmt klein">${E.zuordnung(mo, x).length} Merkmale${x.aktiv === false ? " · inaktiv" : ""}</span></button>`).join("")}`).join("");
    let ed = `<div class="leer">Noch keine Produkte.</div>`;
    if (p) {
      const pm = E.produktMerkmale(mo, p);
      const zugeordnet = p.merkmale.map((z, i) => {
        const m = E.merkmal(mo, z.id); if (!m) return "";
        const erlaubt = z.werte && z.werte.length ? z.werte : m.werte.map(w => w.id);
        return `<li class="zuordnung"><div class="row zwischen"><b>${esc(m.name)}</b><span class="row">
          <button type="button" class="ikon" data-act="pmHoch" data-i="${i}" ${i ? "" : "disabled"} ${dis()} title="Nach oben">↑</button>
          <button type="button" class="ikon gefahr" data-act="pmWeg" data-i="${i}" ${dis()} title="Merkmal entfernen">✕</button></span></div>
          ${chipWahl(m.werte, erlaubt, "pmWert", `data-i="${i}"`)}
          <div class="row klein gedimmt">${erlaubt.length === m.werte.length ? "Alle Werte erlaubt" : `${erlaubt.length} von ${m.werte.length} Werten erlaubt`}.
            ${m.typ !== "mehrfach" ? (m.pflicht ? "Pflichtangabe ohne Vorbelegung." : `<label class="inline">Standard <select id="pm-std-${i}" data-act="pmStandard" data-i="${i}" ${dis()}><option value="">erster erlaubter Wert</option>${m.werte.filter(w => erlaubt.includes(w.id)).map(w => `<option value="${w.id}" ${z.standard === w.id ? "selected" : ""}>${esc(w.name)}</option>`).join("")}</select></label>`) : ""}</div></li>`;
      }).join("");
      const frei = mo.merkmale.filter(m => !p.merkmale.some(z => z.id === m.id));
      ed = `<div class="panel"><div class="formgitter">
        <div class="feld breit"><label for="p-name">Bezeichnung</label><input id="p-name" data-in="pFeld" data-k="name" value="${esc(p.name)}" ${dis()}></div>
        <div class="feld"><label for="p-code">Produkt-Code (Vertrieb)</label><input id="p-code" class="mono${artKlasse(p.code)}" data-in="pFeld" data-k="code" data-art="produkt" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(p.code))}" value="${esc(p.code || "")}" ${dis()}></div>
        <div class="feld"><label for="p-artnr">Artikelnummer</label><input id="p-artnr" class="mono" data-in="pFeld" data-k="artnr" value="${esc(p.artnr)}" ${dis()}></div>
        <div class="feld"><label for="p-gruppe">Produktgruppe</label><select id="p-gruppe" data-act="pGruppe" ${dis()}>${gruppenOptionen(mo, p.gruppe)}<option value="__neu">+ Neue Gruppe …</option></select></div>
        <div class="feld"><label for="p-preis">Grundpreis netto</label><input id="p-preis" type="number" step="100" data-in="pZahl" data-k="basispreis" value="${p.basispreis}" ${dis()}></div>
        <div class="feld"><label for="p-kosten">Herstellkosten</label><input id="p-kosten" type="number" step="100" data-in="pZahl" data-k="basiskosten" value="${p.basiskosten}" ${dis()}></div>
        <div class="feld breit"><label for="p-beschr">Beschreibung für Katalog und Verkaufsraum</label><textarea id="p-beschr" rows="2" data-in="pFeld" data-k="beschreibung" ${dis()}>${esc(p.beschreibung)}</textarea></div>
        <div class="feld"><label>Katalogbild</label>${bildFeld(p.bild, "pBild", "")}</div>
        <div class="feld"><label for="p-aktiv"><input id="p-aktiv" type="checkbox" data-act="pAktiv" ${p.aktiv !== false ? "checked" : ""} ${dis()}> Im Katalog sichtbar</label></div>
      </div></div>
      <section class="panel"><div class="panelkopf"><h3>Merkmale</h3><button class="btn klein primary" type="button" data-act="zuModell" data-k="p:${p.id}">Im Produktmodell bearbeiten</button></div>
        <p class="klein gedimmt">Merkmale werden von der Familie geerbt und im Produktmodell gepflegt. Wirksam für ${esc(p.name)}:</p>
        <div class="chipwahl">${pm.map(x => `<span class="chip">${esc(x.m.name)} · ${x.werte.length}</span>`).join("") || `<span class="gedimmt">keine</span>`}</div></section>
      <section class="panel"><div class="panelkopf"><h3>3D-Darstellung</h3></div>
        <div class="formgitter">
          <div class="feld"><label for="p-vis">Ersatzmodell (ohne CAD)</label><select id="p-vis" data-act="pVisual" ${dis()}>${[["semi", "Semitieflader"], ["tiefbett", "Tiefbett"], ["plattform", "Plattform"], ["nachlaeufer", "Nachläufer"]].map(([k, v]) => `<option value="${k}" ${p.visual?.typ === k ? "selected" : ""}>${v}</option>`).join("")}</select></div>
          <div class="feld breit"><label>CAD-Modell (GLB)</label>
            ${p.visual?.asset ? `<div class="row"><span class="chip st-angenommen">GLB hinterlegt</span><button class="btn klein" type="button" data-act="glbKnoten" data-a="${p.visual.asset}">Bauteilnamen anzeigen</button>${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="glbEntfernen">Entfernen</button>`}</div>`
              : K.assets ? `<input id="p-glb" type="file" accept=".glb,model/gltf-binary" data-act="glbHochladen" ${dis()}>` : `<span class="klein gedimmt">Hochladen ist nur für Bearbeiter der Seite möglich.</span>`}
            <p class="klein gedimmt">STEP-Dateien vorher in GLB umwandeln (z. B. mit FreeCAD oder CAD Exchanger). Jedes Bauteil, das ein Merkmalswert ein- oder ausblendet, braucht einen eindeutigen Namen. Diesen Namen tragen Sie beim Merkmalswert im Feld „3D-Teil“ ein. Materialien mit „lack“ im Namen erhalten die gewählte Farbe.</p>
            <div id="glb-knoten"></div></div>
        </div>
        <div data-viewer class="viewerplatz klein-hoch"></div></section>
      <section class="panel"><div class="panelkopf"><h3>Grundstückliste</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="pStlNeu">+ Zeile</button>`}</div>
        ${stlTabelle(p.stl, "pStl")}</section>
      <div class="row"><button class="btn" type="button" data-act="stTesten" data-p="${p.id}">Im Konfigurator testen</button><button class="btn" type="button" data-act="regelnFuer" data-k="p:${p.id}">Regeln für ${esc(p.name)} (${mo.regeln.filter(r => E.imGeltungsbereich(mo, r, p)).length})</button>${ro() ? "" : `<button class="btn" type="button" data-act="pKopie">Duplizieren</button><button class="btn gefahr-text" type="button" data-act="pLoeschen">Produkt löschen</button>`}</div>`;
      K.nach(v => { const pl = v.querySelector("[data-viewer]"); if (pl) K.viewerEinhaengen(pl, mo, p, E.standardSel(mo, p)); });
    }
    return kopf("Produkte", "Grundfahrzeuge mit Grundpreis, Merkmalen und erlaubten Werten.", ro() ? "" : `<button class="btn" type="button" data-act="katalogPflege">Katalogstruktur</button><button class="btn primary" type="button" data-act="pNeu">Neues Produkt</button>`) +
      `<div class="studio-layout"><nav class="liste-links">${liste}</nav><div class="editor">${ed}</div></div>`;
  });
  function stlTabelle(stl, act, extra = "") {
    const ex = extra.replace(/\W/g, "");
    if (!stl || !stl.length) return `<p class="leer-klein">Keine Stücklistenpositionen.</p>`;
    return `<div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Artikel</th><th>Bezeichnung</th><th class="r">Menge</th><th>ME</th><th></th></tr></thead><tbody>
      ${stl.map((z, i) => `<tr><td><input id="${act}-${ex}${i}-0" class="flach mono${artKlasse(z[0])}" data-in="${act}" data-i="${i}" data-c="0" ${extra} data-art="stl" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(z[0]))}" value="${esc(z[0])}" aria-label="Artikelnummer" ${dis()}></td>
        <td><input id="${act}-${ex}${i}-1" class="flach" data-in="${act}" data-i="${i}" data-c="1" ${extra} value="${esc(z[1])}" aria-label="Bezeichnung" ${dis()}></td>
        <td class="r"><input id="${act}-${ex}${i}-2" class="flach zahl kurz" type="number" step="0.1" data-in="${act}" data-i="${i}" data-c="2" ${extra} value="${z[2]}" aria-label="Menge" ${dis()}></td>
        <td><input id="${act}-${ex}${i}-3" class="flach kurz" data-in="${act}" data-i="${i}" data-c="3" ${extra} value="${esc(z[3])}" aria-label="Mengeneinheit" ${dis()}></td>
        <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="${act}Weg" data-i="${i}" ${extra} title="Zeile entfernen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>`;
  }
  const prod = () => E.produkt(ent(), K.st.produkt);
  K.act.stProdukt = el => { K.st.produkt = el.dataset.p; K.render(); };
  K.inp.pFeld = el => { prod()[el.dataset.k] = el.value; geaendert(`Produkt ${prod().name} geändert`, false); };
  K.inp.pZahl = el => { const p = (K.aktuell() === "studio-modell" && K.st.knoten?.startsWith("p:") ? E.produkt(ent(), K.st.knoten.slice(2)) : null) || prod(); p[el.dataset.k] = +el.value || 0; if (K.Store.artikelZu(p.code)) p.apStamm = false; geaendert(`Preis von ${prod().name} geändert`, false); };
  K.act.pAktiv = el => { prod().aktiv = el.checked; geaendert(`${prod().name} ${el.checked ? "aktiviert" : "deaktiviert"}`); };
  K.act.pVisual = el => { prod().visual = { ...(prod().visual || {}), typ: el.value }; geaendert(`3D-Ersatzmodell von ${prod().name} geändert`); };
  K.act.pGruppe = el => {
    if (el.value === "__neu") {
      K.sheet(`<h3>Neue Produktgruppe</h3><div class="feld"><label for="ng-name">Name</label><input id="ng-name"></div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="gruppeOk">Anlegen</button></div>`);
      return;
    }
    prod().gruppe = el.value; geaendert(`${prod().name} in andere Gruppe verschoben`);
  };
  K.act.gruppeOk = () => { const n = document.getElementById("ng-name").value.trim(); if (!n) return; const id = E.slug(n); if (!ent().gruppen.some(g => g.id === id)) ent().gruppen.push({ id, name: n }); prod().gruppe = id; K.sheetZu(); geaendert(`Gruppe ${n} angelegt`); };
  K.act.pmNeu = el => { if (!el.value) return; prod().merkmale.push({ id: el.value, werte: null }); geaendert(`Merkmal ${E.merkmal(ent(), el.value).name} zu ${prod().name} hinzugefügt`); };
  K.act.pmWeg = el => { const z = prod().merkmale.splice(+el.dataset.i, 1)[0]; geaendert(`Merkmal ${E.merkmal(ent(), z.id)?.name} aus ${prod().name} entfernt`); };
  K.act.pmHoch = el => { const l = prod().merkmale, i = +el.dataset.i; [l[i - 1], l[i]] = [l[i], l[i - 1]]; geaendert(`Merkmalsreihenfolge von ${prod().name} geändert`); };
  K.act.pmWert = el => {
    const z = prod().merkmale[+el.dataset.i], m = E.merkmal(ent(), z.id), alle = m.werte.map(w => w.id);
    let l = z.werte && z.werte.length ? [...z.werte] : [...alle];
    l = l.includes(el.dataset.w) ? l.filter(x => x !== el.dataset.w) : alle.filter(x => l.includes(x) || x === el.dataset.w);
    if (!l.length) return K.toast("Mindestens ein Wert muss erlaubt bleiben.");
    z.werte = l.length === alle.length ? null : l; geaendert(`Erlaubte Werte für ${m.name} bei ${prod().name} geändert`);
  };
  K.inp.pStl = el => { const z = prod().stl[+el.dataset.i]; z[+el.dataset.c] = el.dataset.c === "2" ? +el.value || 0 : el.value; geaendert(`Grundstückliste ${prod().name} geändert`, false); };
  K.act.pStlNeu = () => { (prod().stl ||= []).push(["", "", 1, "Stk"]); geaendert(null); };
  K.act.pStlWeg = el => { prod().stl.splice(+el.dataset.i, 1); geaendert(`Grundstückliste ${prod().name} geändert`); };
  K.act.pNeu = () => {
    const mo = ent(), id = E.neueId("P", mo.produkte.map(p => p.id));
    mo.produkte.push({ id, name: "Neues Fahrzeug", gruppe: mo.gruppen[0]?.id, artnr: "FZ-" + id, basispreis: 0, basiskosten: 0, aktiv: false, beschreibung: "", visual: { typ: "plattform", asset: null }, stl: [], merkmale: [] });
    K.st.produkt = id; geaendert(`Produkt ${id} angelegt`);
  };
  K.act.pKopie = () => { const mo = ent(), p = K.clone(prod()); p.id = E.neueId("P", mo.produkte.map(x => x.id)); p.name += " (Kopie)"; p.aktiv = false; mo.produkte.push(p); K.st.produkt = p.id; geaendert(`Produkt ${p.name} angelegt`); };
  K.act.pLoeschen = () => K.sheet(`<h3>${esc(prod().name)} löschen?</h3><p>Der Artikel wird aus dem Konfigurationsmodell entfernt (nicht aus APplus). Er verschwindet nach der nächsten Freigabe aus dem Katalog; bestehende Angebote behalten ihre Positionen. Regeln, die nur für diesen Artikel galten, werden mit gelöscht.</p><div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="pLoeschenOk">Löschen</button></div>`);
  K.act.pLoeschenOk = () => { const p = prod(), mo = ent(); mo.produkte = mo.produkte.filter(x => x.id !== p.id); const n = E.ausGeltungEntfernen(mo, [], [p.id]); K.sheetZu(); K.st.produkt = null; if (K.st.knoten === "p:" + p.id) K.st.knoten = p.gruppe ? "g:" + p.gruppe : ""; geaendert(`Artikel ${p.code || p.name} gelöscht${n ? `, ${n} Regeln nur für diesen Artikel entfernt` : ""}`); };
  K.act.stTesten = el => K.konfigOeffnen(el.dataset.p, null, null, true);
  K.act.glbHochladen = async el => {
    const f = el.files[0]; if (!f) return;
    if (!/\.glb$/i.test(f.name)) return K.toast("Bitte eine .glb-Datei wählen.");
    K.toast("Wird hochgeladen …");
    try {
      // GLB ist kein erlaubter Medientyp; als Binärdatei unter einem zugelassenen Typ ablegen geht nicht.
      // Daher: GLB in eine JSON-Hülle (Base64) verpacken.
      const buf = new Uint8Array(await f.arrayBuffer()); let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      const blob = new Blob([JSON.stringify({ name: f.name, glb: btoa(bin) })], { type: "application/json" });
      const r = await K.assets.upload(blob, { type: "application/json" });
      prod().visual = { ...(prod().visual || {}), asset: r.id }; geaendert(`CAD-Modell für ${prod().name} hinterlegt`);
    } catch (e) { K.toast(e && e.code === "too_large" ? "Die Datei ist zu groß (max. ca. 14 MB)." : "Hochladen fehlgeschlagen."); }
  };
  K.act.glbEntfernen = () => { prod().visual.asset = null; geaendert(`CAD-Modell von ${prod().name} entfernt`); };
  K.act.glbKnoten = async el => {
    const ziel = document.getElementById("glb-knoten"); ziel.textContent = "Wird gelesen …";
    try { const l = await K.glbKnoten(el.dataset.a); ziel.innerHTML = `<div class="knotenliste">${l.map(n => `<code>${esc(n)}</code>`).join("")}</div>`; }
    catch (e) { ziel.textContent = "Das Modell konnte nicht gelesen werden."; }
  };

  function gruppenOptionen(mo, aktiv) {
    const zeile = (eltern, tiefe) => mo.gruppen.filter(g => (g.eltern || "") === (eltern || "")).map(g => `<option value="${g.id}" ${g.id === aktiv ? "selected" : ""}>${"\u00a0\u00a0".repeat(tiefe)}${esc(g.name)}</option>` + zeile(g.id, tiefe + 1)).join("");
    return zeile("", 0);
  }
  function bildFeld(id, act, daten) {
    return `<div class="bildfeld">${id ? `<img src="${K.bildUrl(id)}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}
      ${K.assets && !ro() ? `<label class="btn klein">${id ? "Ersetzen" : "Hochladen"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-act="${act}" ${daten} hidden></label>${id ? `<button type="button" class="btn klein" data-act="${act}" data-weg="1" ${daten}>Entfernen</button>` : ""}` : ""}</div>`;
  }
  async function bildHochladen(el) {
    if (el.dataset.weg) return null;
    const f = el.files && el.files[0]; if (!f) return undefined;
    if (f.size > 4e6) { K.toast("Bitte Bilder unter 4 MB verwenden."); return undefined; }
    try { const r = await K.assets.upload(f); return r.id; } catch (e) { K.toast("Bild konnte nicht hochgeladen werden."); return undefined; }
  }
  K.act.pBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; prod().bild = id; geaendert(`Bild von ${prod().name} ${id ? "hinterlegt" : "entfernt"}`); };
  K.act.wBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; const w = mm().werte[+el.dataset.i]; w.bild = id; geaendert(`Bild für ${w.name} ${id ? "hinterlegt" : "entfernt"}`); };
  K.act.pmStandard = el => { const z = prod().merkmale[+el.dataset.i]; if (el.value) z.standard = el.value; else delete z.standard; geaendert(`Standardwert bei ${prod().name} geändert`); };
  K.act.mDarst = el => { mm().darstellung = el.value; geaendert(`Darstellung von ${mm().name} geändert`); };
  K.act.mFlag = el => { mm()[el.dataset.k] = el.checked; geaendert(`${mm().name}: ${el.dataset.k === "pflicht" ? "Pflicht" : "Katalogfilter"} ${el.checked ? "an" : "aus"}`); };

  /* ---------- Artikelstamm: Suche, Markierung, Abgleich ---------- */
  const artBekannt = code => !K.Store.artikelQuelle || !code || !!K.Store.artikelZu(code);
  const artKlasse = code => artBekannt(code) ? "" : " unbekannt";
  const artTitel = code => !code ? "" : artBekannt(code) ? (K.Store.artikelZu(code)?.name || "") : "Nicht im Artikelstamm (ARTIKEL) gefunden";
  function artikelFehlend(mo) {
    if (!K.Store.artikelQuelle) return [];
    const out = [], seen = new Set(), add = (code, wo) => { if (code && !K.Store.artikelZu(code) && !seen.has(code + wo)) { seen.add(code + wo); out.push({ code, wo }); } };
    for (const p of mo.produkte) { add(p.code, "Fahrzeug " + p.name); for (const z of p.stl || []) add(z[0], "Stückliste " + p.name); }
    for (const m of mo.merkmale) for (const w of m.werte) { add(w.code, m.name); for (const z of w.stl || []) add(z[0], "Stückliste " + w.name); }
    return out;
  }
  K.artikelFehlend = artikelFehlend;
  K.inp.artPruef = () => K.render();
  // Vorschlagsliste unter dem Eingabefeld
  let drop = null, dropEl = null, dropIdx = 0, dropTreffer = [];
  function dropZu() { if (drop) drop.remove(); drop = null; dropEl = null; }
  function dropZeigen(el) {
    dropTreffer = K.Store.artikelSuche(el.value, 12); dropIdx = 0;
    if (!dropTreffer.length || !K.Store.artikelQuelle) return dropZu();
    if (!drop) { drop = document.createElement("div"); drop.className = "artdrop"; drop.setAttribute("role", "listbox"); K.root.appendChild(drop); }
    dropEl = el;
    const r = el.getBoundingClientRect(), rr = K.root.getBoundingClientRect();
    Object.assign(drop.style, { left: (r.left - rr.left) + "px", top: (r.bottom - rr.top + 2) + "px", minWidth: Math.max(r.width, 340) + "px" });
    drop.innerHTML = dropTreffer.map((a, i) => `<div class="artdrop-z${i === dropIdx ? " aktiv" : ""}" role="option" data-i="${i}"><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num gedimmt">${a.preis ? K.eur(a.preis) : ""}</span></div>`).join("");
  }
  function artUebernehmen(el, a) {
    const typ = el.dataset.art, i = +el.dataset.i;
    if (typ === "wert") {
      const m = mm(), w = m.werte[i], alt = w.code;
      w.code = a.code; if (!w.name || w.name === "Neuer Wert" || w.name === alt) w.name = a.name || w.name;
      if (!w.preis && a.preis) w.preis = a.preis; if (!w.kosten && a.kosten) w.kosten = a.kosten;
      geaendert(`Wert ${w.name} mit Artikel ${a.code} verknüpft`);
    } else if (typ === "produkt") {
      const p = prod(); p.code = a.code; if (!p.name || p.name === "Neues Fahrzeug") p.name = a.name || p.name;
      if (!p.basispreis && a.preis) p.basispreis = a.preis; if (!p.basiskosten && a.kosten) p.basiskosten = a.kosten;
      geaendert(`${p.name} mit Artikel ${a.code} verknüpft`);
    } else if (typ === "stl") {
      const z = el.dataset.in === "pStl" ? prod().stl[i] : mm().werte[+el.dataset.w].stl[i];
      z[0] = a.code; if (!z[1]) z[1] = a.name; if (a.me) z[3] = a.me;
      geaendert(`Stückliste: Artikel ${a.code} eingetragen`);
    }
    dropZu();
  }
  document.addEventListener("input", e => { const el = e.target; if (el.dataset && el.dataset.art && K.root && K.root.contains(el)) dropZeigen(el); });
  document.addEventListener("keydown", e => {
    if (!drop || e.target !== dropEl) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); dropIdx = (dropIdx + (e.key === "ArrowDown" ? 1 : -1) + dropTreffer.length) % dropTreffer.length; drop.querySelectorAll(".artdrop-z").forEach((z, i) => z.classList.toggle("aktiv", i === dropIdx)); }
    else if (e.key === "Enter") { e.preventDefault(); artUebernehmen(dropEl, dropTreffer[dropIdx]); }
    else if (e.key === "Escape") dropZu();
  });
  document.addEventListener("mousedown", e => { if (!drop) return; const z = e.target.closest(".artdrop-z"); if (z) { e.preventDefault(); artUebernehmen(dropEl, dropTreffer[+z.dataset.i]); } else if (!e.target.closest(".artdrop")) dropZu(); });
  document.addEventListener("focusout", e => { if (drop && e.target === dropEl) setTimeout(() => { if (document.activeElement !== dropEl) dropZu(); }, 150); });

  // Werte aus dem Artikelstamm hinzufügen
  K.act.wAusArtikel = () => {
    if (!K.Store.artikelQuelle) return K.toast("Kein Artikelstamm geladen. Bitte die Abfrage für ARTIKEL einrichten.");
    K.sheet(`<h3>Werte aus dem Artikelstamm</h3><p class="klein gedimmt">Artikel suchen und anklicken. Er wird als neuer Wert in „${esc(mm().name)}“ angelegt.</p>
      <input id="as-q" type="search" data-in="artSheetSuche" placeholder="Artikelnummer oder Bezeichnung" autocomplete="off"><div id="as-liste" class="artliste"></div>
      <div class="row" style="justify-content:flex-end"><button class="btn primary" type="button" data-act="sheetZuUndZeichnen">Fertig</button></div>`, true);
    K.inp.artSheetSuche(K.el("as-q"));
  };
  K.inp.artSheetSuche = el => {
    const mo = ent(), benutzt = new Map(); for (const m of mo.merkmale) for (const w of m.werte) if (w.code) benutzt.set(w.code.toUpperCase(), m.name);
    const l = el.value.trim() ? K.Store.artikelSuche(el.value, 40) : [...K.Store.artikel.values()].filter(a => !benutzt.has(a.code.toUpperCase())).slice(0, 40);
    K.el("as-liste").innerHTML = l.map(a => { const b = benutzt.get(a.code.toUpperCase()); return `<button type="button" class="artliste-z" data-act="artHinzu" data-c="${esc(a.code)}" ${b ? "disabled" : ""}><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num">${a.preis ? K.eur(a.preis) : ""}</span>${b ? `<span class="chip">in ${esc(b)}</span>` : ""}</button>`; }).join("") || `<p class="leer-klein">Keine Treffer.</p>`;
  };
  K.act.artHinzu = el => {
    const a = K.Store.artikelZu(el.dataset.c), m = mm(); if (!a) return;
    let id = a.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40); while (m.werte.some(w => w.id === id)) id += "_";
    m.werte.push({ id, code: a.code, name: a.name || a.code, preis: a.preis || 0, kosten: a.kosten || 0, stl: [] });
    K.Store.entwurfGeaendert(`Artikel ${a.code} als Wert in ${m.name} angelegt`);
    el.disabled = true; el.insertAdjacentHTML("beforeend", `<span class="chip st-angenommen">hinzugefügt</span>`);
  };
  K.act.sheetZuUndZeichnen = () => { K.sheetZu(); K.render(); };

  // Abgleich mit dem Artikelstamm
  function abweichungen(mo) {
    const out = [];
    for (const p of mo.produkte) { const a = K.Store.artikelZu(p.code); if (!a) continue;
      if (a.name && a.name !== p.name) out.push({ art: "name", wo: "Fahrzeug", code: p.code, alt: p.name, neu: a.name, setze: () => p.name = a.name });
      if (a.preis && a.preis !== p.basispreis) out.push({ art: "preis", wo: "Fahrzeug", code: p.code, alt: p.basispreis, neu: a.preis, setze: () => p.basispreis = a.preis });
      if (a.kosten && a.kosten !== p.basiskosten) out.push({ art: "kosten", wo: "Fahrzeug", code: p.code, alt: p.basiskosten, neu: a.kosten, setze: () => p.basiskosten = a.kosten }); }
    for (const m of mo.merkmale) for (const w of m.werte) { const a = K.Store.artikelZu(w.code); if (!a) continue;
      if (a.name && a.name !== w.name) out.push({ art: "name", wo: m.name, code: w.code, alt: w.name, neu: a.name, setze: () => w.name = a.name });
      if (a.preis && a.preis !== w.preis) out.push({ art: "preis", wo: m.name, code: w.code, alt: w.preis, neu: a.preis, setze: () => w.preis = a.preis });
      if (a.kosten && a.kosten !== w.kosten) out.push({ art: "kosten", wo: m.name, code: w.code, alt: w.kosten, neu: a.kosten, setze: () => w.kosten = a.kosten }); }
    return out;
  }
  K.act.artAbgleich = () => {
    const mo = ent(), ab = abweichungen(mo), fehl = artikelFehlend(mo), n = t => ab.filter(x => x.art === t).length;
    const wert = (x, v) => x.art === "name" ? esc(v) : K.eur(v);
    K.sheet(`<h3>Abgleich mit dem Artikelstamm</h3>
      <p class="klein gedimmt">Vergleicht Bezeichnung, Verkaufspreis und Kosten der Codes und Fahrzeuge mit ARTIKEL. Hinweis: Preise mit Multiplikator (z. B. je Achse) gelten im Modell je Einheit.</p>
      ${ab.length ? `<div class="tabwrap ohne-rand abgleich"><table class="kompakt"><thead><tr><th>Code</th><th>Wo</th><th>Feld</th><th>Im Modell</th><th>In ARTIKEL</th></tr></thead><tbody>
        ${ab.map(x => `<tr><td class="mono">${esc(x.code)}</td><td class="gedimmt">${esc(x.wo)}</td><td>${x.art === "name" ? "Bezeichnung" : x.art === "preis" ? "Preis" : "Kosten"}</td><td>${wert(x, x.alt)}</td><td><b>${wert(x, x.neu)}</b></td></tr>`).join("")}</tbody></table></div>
        <div class="row">${n("name") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="name">${n("name")} Bezeichnungen übernehmen</button>` : ""}${n("preis") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="preis">${n("preis")} Preise übernehmen</button>` : ""}${n("kosten") ? `<button class="btn" type="button" data-act="artUebernahme" data-t="kosten">${n("kosten")} Kosten übernehmen</button>` : ""}</div>`
        : `<div class="hinweis ok">Bezeichnungen, Preise und Kosten stimmen mit dem Artikelstamm überein.</div>`}
      ${fehl.length ? `<div class="hinweis warn"><b>${fehl.length} Nummern fehlen im Artikelstamm:</b> ${fehl.slice(0, 40).map(x => `<code>${esc(x.code)}</code>`).join(", ")}${fehl.length > 40 ? " …" : ""}</div>` : ""}
      <div class="row" style="justify-content:flex-end"><button class="btn primary" type="button" data-act="sheetZuUndZeichnen">Schließen</button></div>`, true);
  };
  K.act.artUebernahme = el => { const mo = ent(), l = abweichungen(mo).filter(x => x.art === el.dataset.t); l.forEach(x => x.setze()); K.Store.entwurfGeaendert(`${l.length} ${el.dataset.t === "name" ? "Bezeichnungen" : el.dataset.t === "preis" ? "Preise" : "Kosten"} aus dem Artikelstamm übernommen`); K.toast(`${l.length} Werte übernommen`); K.act.artAbgleich(); };

  /* Katalogstruktur (Gruppen mit Übergeordneter Gruppe und Bild) */
  K.act.katalogPflege = () => katalogSheet();
  function katalogSheet() {
    const mo = ent();
    K.sheet(`<h3>Katalogstruktur</h3><p class="klein gedimmt">Gruppen bilden den Baum im Katalog. Eine Gruppe ohne übergeordnete Gruppe steht oben.</p>
      <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Gruppe</th><th>Übergeordnet</th><th>Bild</th><th class="r">Produkte</th><th></th></tr></thead><tbody>
      ${mo.gruppen.map((g, i) => `<tr><td><input id="kg-n-${i}" class="flach" data-in="kgName" data-i="${i}" value="${esc(g.name)}" ${dis()}></td>
        <td><select id="kg-e-${i}" data-act="kgEltern" data-i="${i}" ${dis()}><option value="">– oben –</option>${mo.gruppen.filter(x => x.id !== g.id).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></td>
        <td>${bildFeld(g.bild, "kgBild", `data-i="${i}"`)}</td><td class="r num">${mo.produkte.filter(p => p.gruppe === g.id).length}</td>
        <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="kgWeg" data-i="${i}" title="Gruppe löschen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>
      <div class="row zwischen">${ro() ? "<span></span>" : `<button class="btn klein" type="button" data-act="kgNeu">+ Gruppe</button>`}<button class="btn primary" type="button" data-act="sheetZu">Fertig</button></div>`, true);
  }
  K.inp.kgName = el => { ent().gruppen[+el.dataset.i].name = el.value; geaendert("Katalogstruktur geändert", false); };
  K.act.kgEltern = el => { const g = ent().gruppen[+el.dataset.i]; let x = el.value; while (x) { if (x === g.id) { K.toast("Eine Gruppe kann nicht unter sich selbst stehen."); return katalogSheet(); } x = ent().gruppen.find(y => y.id === x)?.eltern; } g.eltern = el.value || null; geaendert("Katalogstruktur geändert", false); };
  K.act.kgBild = async el => { const id = await bildHochladen(el); if (id === undefined) return; ent().gruppen[+el.dataset.i].bild = id; geaendert("Gruppenbild geändert", false); katalogSheet(); };
  K.act.kgNeu = () => { const mo = ent(); let id = "gruppe"; let n = 1; while (mo.gruppen.some(g => g.id === id + n)) n++; mo.gruppen.push({ id: id + n, name: "Neue Gruppe", eltern: null }); geaendert("Gruppe angelegt", false); katalogSheet(); };
  K.act.kgWeg = el => {
    const mo = ent(), g = mo.gruppen[+el.dataset.i];
    if (mo.produkte.some(p => p.gruppe === g.id) || mo.gruppen.some(x => x.eltern === g.id)) { K.toast("Die Gruppe enthält noch Produkte oder Untergruppen."); return; }
    mo.gruppen.splice(+el.dataset.i, 1); E.ausGeltungEntfernen(mo, [g.id], []); geaendert(`Gruppe ${g.name} gelöscht`, false); katalogSheet();
  };

  /* =====================================================================
     Merkmale
     ===================================================================== */
  K.route("studio-merkmale", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const st = K.st; if (!E.merkmal(mo, st.merkmal)) st.merkmal = mo.merkmale[0]?.id || null;
    const m = E.merkmal(mo, st.merkmal), abschnitte = [...new Set(mo.merkmale.map(x => x.abschnitt).filter(Boolean))];
    const liste = abschnitte.concat(mo.merkmale.some(x => !x.abschnitt) ? [""] : []).map(ab => `<div class="listgruppe">${esc(ab || "Ohne Abschnitt")}</div>${mo.merkmale.filter(x => (x.abschnitt || "") === ab).map(x => `<button type="button" class="listeintrag" data-act="stMerkmal" data-m="${x.id}" aria-current="${x.id === st.merkmal}"><span>${esc(x.name)}</span><span class="gedimmt klein">${x.werte.length} Werte${x.typ === "mehrfach" ? " · mehrfach" : ""}</span></button>`).join("")}`).join("");
    let ed = `<div class="leer">Noch keine Merkmale.</div>`;
    if (m) {
      const vw = verwendung(m.id), mitMenge = mo.merkmale.filter(x => x.id !== m.id && x.werte.some(w => w.menge));
      const istFarbe = m.werte.some(w => w.hex) || /farb|lack/i.test(m.name);
      ed = `<div class="panel"><div class="formgitter">
        <div class="feld"><label for="m-name">Bezeichnung</label><input id="m-name" data-in="mFeld" data-k="name" value="${esc(m.name)}" ${dis()}></div>
        <div class="feld"><label for="m-ab">Abschnitt im Konfigurator</label><input id="m-ab" list="abschnitte" data-in="mFeld" data-k="abschnitt" value="${esc(m.abschnitt || "")}" ${dis()}><datalist id="abschnitte">${abschnitte.map(a => `<option value="${esc(a)}">`).join("")}</datalist></div>
        <div class="feld"><label for="m-typ">Auswahl in dieser Gruppe</label><select id="m-typ" data-act="mFeldtyp" ${dis()}>${E.GRUPPENTYPEN.map(([k, n]) => `<option value="${k}" ${E.gruppentyp(m) === k ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <div class="feld"><label for="m-mult">Preis und Menge multiplizieren mit</label><select id="m-mult" data-act="mMult" ${dis()}><option value="">nicht multiplizieren</option>${mitMenge.map(x => `<option value="${x.id}" ${x.id === m.multiplikator ? "selected" : ""}>${esc(x.name)} (Menge des Werts)</option>`).join("")}</select></div>
        <div class="feld"><label for="m-bereich">Reiter im Konfigurator</label><input id="m-bereich" list="bereiche" data-in="mFeld" data-k="bereich" value="${esc(E.bereich(m))}" ${dis()}><datalist id="bereiche">${[...new Set(["Grundmaschine", "Optionen", ...mo.merkmale.map(x => E.bereich(x))])].map(a => `<option value="${esc(a)}">`).join("")}</datalist></div>

        <div class="feld"><label for="m-code">Merkmal-Code</label><input id="m-code" class="mono" data-in="mFeld" data-k="code" value="${esc(m.code || "")}" placeholder="${esc(m.id)}" ${dis()}></div>
        <div class="feld"><label>Optionen</label><div class="haken-liste"><label class="haken"><input type="checkbox" data-act="mFlag" data-k="pflicht" ${m.pflicht ? "checked" : ""} ${m.typ === "mehrfach" ? "disabled" : dis()}> Pflichtangabe ohne Vorbelegung</label>
          <label class="haken"><input type="checkbox" data-act="mFlag" data-k="katalogfilter" ${m.katalogfilter ? "checked" : ""} ${dis()}> Als Filter im Katalog</label></div></div>
        <div class="feld breit"><label for="m-info">Info-Text (Symbol i im Konfigurator)</label><input id="m-info" data-in="mFeld" data-k="info" value="${esc(m.info || "")}" ${dis()}></div>
        <div class="feld"><label>Verwendet in</label><div class="wert">${vw.produkte.length} Produkten, ${vw.regeln.length} Regeln</div></div>
      </div></div>
      <section class="panel"><div class="panelkopf"><h3>Werte</h3>${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="wAusArtikel">+ Aus Artikelstamm</button><button class="btn klein" type="button" data-act="wNeu">+ Wert</button></div>`}</div>
        <p class="klein gedimmt">Der Code ist die Artikelnummer aus APplus (ARTIKEL.ARTIKEL). Beim Tippen werden passende Artikel vorgeschlagen; Bezeichnung und Preis werden übernommen.</p>
        <div class="tabwrap ohne-rand"><table class="kompakt werte"><thead><tr><th></th><th>Code</th><th>Bezeichnung</th><th title="Bezeichnung und Preis automatisch aus APplus (ARTIKEL)">aus APplus</th><th>Feldtyp</th><th class="r">Preis</th><th class="r">Kosten</th><th class="r" title="Wird von anderen Merkmalen als Multiplikator verwendet, z. B. Achsanzahl">Menge</th>${istFarbe ? "<th>Farbe</th>" : ""}<th>3D-Teil</th><th>Details</th><th></th></tr></thead><tbody>
        ${m.werte.map((w, i) => `<tr>
          <td><button type="button" class="ikon" data-act="wHoch" data-i="${i}" ${i && !ro() ? "" : "disabled"} title="Nach oben">↑</button></td>
          <td><input id="w-c-${i}" class="flach mono code${artKlasse(w.code)}" data-in="wFeld" data-k="code" data-i="${i}" data-art="wert" data-chg="artPruef" autocomplete="off" title="${esc(artTitel(w.code))}" value="${esc(w.code || "")}" aria-label="Vertriebscode (Artikel)" ${dis()}></td>
          <td><input id="w-n-${i}" class="flach" data-in="wFeld" data-k="name" data-i="${i}" value="${esc(w.name)}" aria-label="Bezeichnung" ${dis()}></td>
          <td class="mitte">${K.Store.artikelZu(w.code) ? `<input type="checkbox" data-act="wAp" data-i="${i}" ${w.apStamm !== false ? "checked" : ""} aria-label="aus APplus" ${dis()}>` : `<span class="gedimmt klein" title="nicht im Artikelstamm">–</span>`}</td>
          <td><select id="w-ty-${i}" data-act="wTyp" data-i="${i}" aria-label="Feldtyp" ${dis()}>${E.WERTTYPEN.map(([k, n, h]) => `<option value="${k}" ${E.wertTyp(m, w) === k ? "selected" : ""} title="${esc(h)}">${n}</option>`).join("")}</select></td>
          <td class="r"><input id="w-p-${i}" class="flach zahl" type="number" step="10" data-in="wZahl" data-k="preis" data-i="${i}" value="${w.preis || 0}" aria-label="Preis" ${dis()}></td>
          <td class="r"><input id="w-k-${i}" class="flach zahl" type="number" step="10" data-in="wZahl" data-k="kosten" data-i="${i}" value="${w.kosten || 0}" aria-label="Kosten" ${dis()}></td>
          <td class="r"><input id="w-m-${i}" class="flach zahl kurz" type="number" step="1" data-in="wZahl" data-k="menge" data-i="${i}" value="${w.menge ?? ""}" aria-label="Menge" ${dis()}></td>
          ${istFarbe ? `<td><input id="w-h-${i}" type="color" data-in="wFeld" data-k="hex" data-i="${i}" value="${esc(w.hex || "#888888")}" aria-label="Farbe" ${dis()}></td>` : ""}
          <td><input id="w-t-${i}" class="flach mono" data-in="wFeld" data-k="teil" data-i="${i}" value="${esc(w.teil || "")}" placeholder="–" aria-label="3D-Teil" ${dis()}></td>
          <td><button type="button" class="btn klein" data-act="wStl" data-i="${i}" aria-expanded="${K.st.offenWert === m.id + i}">${w.bild ? "Bild · " : ""}${(w.stl || []).length} Stl.</button></td>
          <td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="wWeg" data-i="${i}" title="Wert löschen">✕</button>`}</td></tr>
          ${K.st.offenWert === m.id + i ? `<tr class="unterzeile"><td></td><td colspan="${istFarbe ? 11 : 10}">${K.wertExtras ? K.wertExtras(m, w, "st") : ""}<div class="formgitter"><div class="feld breit"><label for="w-info-${i}">Info-Text</label><input id="w-info-${i}" data-in="wFeld" data-k="info" data-i="${i}" value="${esc(w.info || "")}" ${dis()}></div>
            <div class="feld"><label>Bild für Kacheln</label>${bildFeld(w.bild, "wBild", `data-i="${i}"`)}</div></div>
            <div class="eyebrow" style="margin:8px 0 4px">Stückliste</div>${stlTabelle(w.stl, "wStlZ", `data-w="${i}"`)}${ro() ? "" : `<button class="btn klein" type="button" data-act="wStlNeu" data-i="${i}">+ Stücklistenzeile</button>`}</td></tr>` : ""}`).join("")}
        </tbody></table></div>
        <p class="klein gedimmt">Preise und Kosten sind netto. ${m.multiplikator ? `Beide werden mit der Menge aus „${esc(E.merkmal(mo, m.multiplikator)?.name)}“ multipliziert.` : ""}</p></section>
      ${ro() ? "" : `<div class="row"><button class="btn gefahr-text" type="button" data-act="mLoeschen">Merkmal löschen</button></div>`}`;
    }
    return kopf("Merkmale", "Merkmale und Werte mit Preis, Kosten, Stückliste und 3D-Bauteil. Ein Merkmal kann in mehreren Produkten verwendet werden.", ro() ? "" : `${K.Store.artikelQuelle ? `<button class="btn" type="button" data-act="artAbgleich">Mit Artikelstamm abgleichen</button>` : ""}<button class="btn primary" type="button" data-act="mNeu">Neues Merkmal</button>`) +
      `<div class="studio-layout"><nav class="liste-links">${liste}</nav><div class="editor">${ed}</div></div>`;
  });
  const mm = () => E.merkmal(ent(), K.st.merkmal);
  K.act.stMerkmal = el => { K.st.merkmal = el.dataset.m; K.st.offenWert = null; K.render(); };
  K.inp.mFeld = el => { mm()[el.dataset.k] = el.value; geaendert(`Merkmal ${mm().name} geändert`, false); };
  K.inp.ckFeld = async el => { const e = S().einst; e.codeKennung = Object.assign({ ueber: "ZZ", option: "YY", grund: "GA" }, e.codeKennung || {}, { [el.dataset.k]: el.value.trim().toUpperCase() }); await K.Store.einstSpeichern(e, true); K.toast("Code-Kennzeichen gespeichert"); };
  K.act.mTyp = el => { mm().typ = el.value; geaendert(`Auswahlart von ${mm().name} geändert`); };
  K.act.wTyp = el => { const w = mm().werte[+el.dataset.i]; E.wertTypSetzen(w, el.value); geaendert(`${w.code || w.name}: ${E.WERTTYPEN.find(x => x[0] === el.value)[1]}`); };
  K.act.mFeldtyp = el => { E.feldtypSetzen(mm(), el.value); geaendert(`Feldtyp von ${mm().name}: ${E.FELDTYPEN.find(x => x[0] === el.value)[1]}`); };
  K.act.mMult = el => { mm().multiplikator = el.value || undefined; geaendert(`Multiplikator von ${mm().name} geändert`); };
  K.inp.wFeld = el => { const w = mm().werte[+el.dataset.i]; w[el.dataset.k] = el.value; if (el.dataset.k === "name" && K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Wert in ${mm().name} geändert`, false); };
  K.inp.wZahl = el => { const w = mm().werte[+el.dataset.i]; if (el.value === "" && el.dataset.k === "menge") delete w.menge; else w[el.dataset.k] = +el.value || 0; if ((el.dataset.k === "preis" || el.dataset.k === "kosten") && K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Preise in ${mm().name} geändert`, false); };
  K.act.wAp = el => { const w = mm().werte[+el.dataset.i]; w.apStamm = el.checked; if (el.checked) K.Store.stammAnwenden(); geaendert(`${w.code}: ${el.checked ? "Bezeichnung und Preis aus APplus" : "eigene Bezeichnung und Preis"}`); };
  K.act.wHoch = el => { const l = mm().werte, i = +el.dataset.i; [l[i - 1], l[i]] = [l[i], l[i - 1]]; geaendert(`Wertereihenfolge ${mm().name} geändert`); };
  K.act.wNeu = () => { const m = mm(), id = E.neueId("w", m.werte.map(w => w.id)); m.werte.push({ id, name: "Neuer Wert", preis: 0, kosten: 0, stl: [] }); geaendert(`Wert in ${m.name} angelegt`); };
  K.act.wStl = el => { const k = mm().id + el.dataset.i; K.st.offenWert = K.st.offenWert === k ? null : k; K.render(); };
  K.act.wStlNeu = el => { (mm().werte[+el.dataset.i].stl ||= []).push(["", "", 1, "Stk"]); geaendert(null); };
  K.inp.wStlZ = el => { const z = mm().werte[+el.dataset.w].stl[+el.dataset.i]; z[+el.dataset.c] = el.dataset.c === "2" ? +el.value || 0 : el.value; geaendert(`Stückliste in ${mm().name} geändert`, false); };
  K.act.wStlZWeg = el => { mm().werte[+el.dataset.w].stl.splice(+el.dataset.i, 1); geaendert(`Stückliste in ${mm().name} geändert`); };
  K.act.wWeg = el => {
    const m = mm(), w = m.werte[+el.dataset.i];
    const inRegeln = ent().regeln.filter(r => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).includes(m.id) : ((r.wenn || []).some(c => c.merkmal === m.id && c.werte.includes(w.id)) || (r.dann?.merkmal === m.id && r.dann.werte.includes(w.id))));
    K.sheet(`<h3>Wert „${esc(w.name)}“ löschen?</h3><p>${inRegeln.length ? `Er wird aus ${inRegeln.length} Regeln entfernt (${inRegeln.map(r => r.id).join(", ")}).` : "Er wird in keiner Regel verwendet."}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="wWegOk" data-i="${el.dataset.i}">Löschen</button></div>`);
  };
  K.act.wWegOk = el => {
    const m = mm(), w = m.werte.splice(+el.dataset.i, 1)[0];
    for (const r of ent().regeln) { if (r.typ === "tabelle") { const i = r.tabelle.merkmale.indexOf(m.id); if (i >= 0) r.tabelle.zeilen = r.tabelle.zeilen.filter(z => z[i] !== w.id); continue; } for (const c of r.wenn) if (c.merkmal === m.id) c.werte = c.werte.filter(x => x !== w.id); if (r.dann?.merkmal === m.id) r.dann.werte = r.dann.werte.filter(x => x !== w.id); }
    for (const o of [...ent().produkte, ...ent().gruppen]) for (const z of o.merkmale || []) if (z.id === m.id && z.werte) { z.werte = z.werte.filter(x => x !== w.id); if (z.standard === w.id) delete z.standard; }
    K.sheetZu(); geaendert(`Wert ${w.name} aus ${m.name} gelöscht`);
  };
  K.act.mNeu = () => K.sheet(`<h3>Neues Merkmal</h3><div class="feld"><label for="nm-name">Bezeichnung</label><input id="nm-name" placeholder="z. B. Bremsanlage"></div>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mNeuOk">Anlegen</button></div>`);
  K.act.mNeuOk = () => {
    const n = document.getElementById("nm-name").value.trim(); if (!n) return;
    let id = E.slug(n).replace(/-/g, ""); const ids = ent().merkmale.map(m => m.id); while (ids.includes(id)) id += "2";
    ent().merkmale.push({ id, name: n, abschnitt: "Ausstattung", typ: "einfach", werte: [{ id: "w01", name: "Standard", preis: 0, kosten: 0, stl: [] }] });
    K.st.merkmal = id; K.sheetZu();
    if (K.st.mNeuZiel) { const z = K.studio.knotenObjekt(ent(), K.st.mNeuZiel); if (z) (z.merkmale ||= []).push({ id, werte: null }); K.st.mNeuZiel = null; }
    geaendert(`Merkmal ${n} angelegt`);
  };
  K.act.mLoeschen = () => {
    const m = mm(), vw = verwendung(m.id);
    K.sheet(`<h3>Merkmal „${esc(m.name)}“ löschen?</h3><p>${vw.produkte.length ? `Es wird aus ${vw.produkte.length} Produkten entfernt. ` : ""}${vw.regeln.length ? `${vw.regeln.length} Regeln, die es verwenden, werden ebenfalls gelöscht (${vw.regeln.map(r => r.id).join(", ")}).` : ""}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="mLoeschenOk">Löschen</button></div>`);
  };
  K.act.mLoeschenOk = () => {
    const m = mm(), mo = ent();
    mo.merkmale = mo.merkmale.filter(x => x.id !== m.id);
    for (const o of [...mo.produkte, ...mo.gruppen]) { if (o.merkmale) o.merkmale = o.merkmale.filter(z => z.id !== m.id); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(x => x !== m.id); }
    mo.regeln = mo.regeln.filter(r => r.typ === "tabelle" || !(r.wenn.some(c => c.merkmal === m.id) || r.dann?.merkmal === m.id));
    for (const r of mo.regeln) if (r.typ === "tabelle") { const i = r.tabelle.merkmale.indexOf(m.id); if (i >= 0) { r.tabelle.merkmale.splice(i, 1); const neu = new Map(); for (const z of r.tabelle.zeilen) { const k = z.filter((_, j) => j !== i); neu.set(k.join("|"), k); } r.tabelle.zeilen = [...neu.values()]; } }
    for (const x of mo.merkmale) if (x.multiplikator === m.id) delete x.multiplikator;
    K.st.merkmal = null; K.sheetZu(); geaendert(`Merkmal ${m.name} gelöscht`);
  };

  /* =====================================================================
     Regeln: Kontext (Produkt/Gruppe), Regelliste, Matrix, Kombinationstabellen, Regelgraph
     ===================================================================== */
  Object.assign(K.st, { kontext: "", regelTab: "liste", regelFilter: { merkmal: "", suche: "" }, matrix: { modus: "gesamt", a: "achsen", b: "lenkung" }, tabOffen: null, graphFokus: null });

  /* ---------- Kontext ---------- */
  function kontext(mo) {
    const k = K.st.kontext || "";
    if (k.startsWith("p:")) { const p = E.produkt(mo, k.slice(2)); if (p) return { typ: "p", id: p.id, name: p.name, produkte: [p], scope: { produkte: [p.id], gruppen: [] } }; }
    if (k.startsWith("g:")) { const g = mo.gruppen.find(x => x.id === k.slice(2)); if (g) return { typ: "g", id: g.id, name: g.name, produkte: mo.produkte.filter(p => E.gruppenKette(mo, p).includes(g.id)), scope: { produkte: [], gruppen: [g.id] } }; }
    return { typ: "", id: "", name: "Alle Produkte", produkte: mo.produkte.slice(), scope: { produkte: [], gruppen: [] } };
  }
  // Regel ist im Kontext sichtbar, wenn sie für mindestens ein Produkt gilt, das die betroffenen Merkmale auch hat
  const hatM = (p, mid) => E.hatMerkmal(ent(), p, mid);
  const relevant = (r, p) => r.typ === "tabelle" ? (r.tabelle?.merkmale || []).filter(m => hatM(p, m)).length >= 2 || !(r.tabelle?.merkmale || []).length : (!r.dann?.merkmal || hatM(p, r.dann.merkmal));
  const regelImKontext = (mo, r, kx) => kx.produkte.some(p => E.imGeltungsbereich(mo, r, p) && relevant(r, p));
  // Merkmale des Kontexts, jeweils nur mit den Werten, die dort mindestens ein Produkt zulässt
  const kontextMerkmale = (mo, kx) => mo.merkmale.map(m => {
    const ids = new Set(); for (const p of kx.produkte) { const z = E.zuordnung(mo, p).find(x => x.id === m.id); if (z) (z.werte && z.werte.length ? z.werte : m.werte.map(w => w.id)).forEach(id => ids.add(id)); }
    return ids.size ? { ...m, werte: m.werte.filter(w => ids.has(w.id)) } : null;
  }).filter(Boolean);
  const scopeText = (mo, r) => {
    const t = [...(r.gruppen || []).map(id => "Gruppe " + (mo.gruppen.find(g => g.id === id)?.name || id)), ...(r.produkte || []).map(id => E.produkt(mo, id)?.name || id)];
    return t.length ? t.join(", ") : "Alle Produkte";
  };
  const gleicherScope = (r, sc) => JSON.stringify([...(r.produkte || [])].sort()) === JSON.stringify([...sc.produkte].sort()) && JSON.stringify([...(r.gruppen || [])].sort()) === JSON.stringify([...sc.gruppen].sort());
  function kontextAuswahl(mo) {
    const zeile = (eltern, tiefe) => mo.gruppen.filter(g => (g.eltern || "") === (eltern || "")).map(g => `<option value="g:${g.id}" ${K.st.kontext === "g:" + g.id ? "selected" : ""}>${"  ".repeat(tiefe)}▸ ${esc(g.name)}</option>` + zeile(g.id, tiefe + 1)).join("");
    return `<select id="r-kontext" data-act="rKontext" aria-label="Regeln für">
      <option value="" ${!K.st.kontext ? "selected" : ""}>Alle Produkte</option>
      <optgroup label="Produktgruppen">${zeile("", 0)}</optgroup>
      <optgroup label="Produkte">${mo.produkte.map(p => `<option value="p:${p.id}" ${K.st.kontext === "p:" + p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</optgroup></select>`;
  }
  K.act.rKontext = el => { K.st.kontext = el.value; K.st.regelOffen = null; K.st.tabOffen = null; K.st.graphFokus = null; K.render(); };
  K.act.regelnFuer = el => { K.st.kontext = el.dataset.k; K.st.regelTab = "liste"; K.gehe("studio-regeln"); };

  K.route("studio-regeln", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const kx = kontext(mo), t = K.st.regelTab;
    const imK = mo.regeln.filter(r => regelImKontext(mo, r, kx));
    const zahl = { liste: imK.filter(r => r.typ !== "tabelle").length, tabellen: imK.filter(r => r.typ === "tabelle").length };
    const tabs = `<div class="tabs-innen" role="tablist">${[["liste", "Regeln", zahl.liste], ["matrix", "Matrix"], ["tabellen", "Kombinationstabellen", zahl.tabellen], ["graph", "Regelgraph"]].map(([id, n, z]) => `<button type="button" role="tab" data-act="regelTab" data-t="${id}" aria-selected="${t === id}">${n}${z != null ? ` <span class="zaehler">${z}</span>` : ""}</button>`).join("")}</div>`;
    const leiste = `<div class="kontextleiste"><div class="kl-wahl"><span class="eyebrow">Regeln für</span>${kontextAuswahl(mo)}</div>
      <div class="kl-info">${kx.typ ? `<span>${kx.produkte.length} Produkt${kx.produkte.length === 1 ? "" : "e"}: ${kx.produkte.map(p => esc(p.name)).join(", ")}</span>` : `<span>${mo.produkte.length} Produkte</span>`}
      <span class="gedimmt">Neue Regeln gelten für ${esc(kx.typ === "g" ? "die Gruppe " + kx.name : kx.typ === "p" ? kx.name : "alle Produkte")}.</span></div>
      <div class="row">${kx.produkte[0] ? `<button class="btn klein" type="button" data-act="stTesten" data-p="${kx.produkte[0].id}">Im Konfigurator testen</button>` : ""}<a class="btn klein" href="#studio-test">Modelltest</a></div></div>`;
    const body = t === "matrix" ? matrixAnsicht(mo, kx) : t === "tabellen" ? tabellenAnsicht(mo, kx) : t === "graph" ? graph(mo, kx) : regelListe(mo, kx);
    const neu = t === "tabellen" ? `<button class="btn primary" type="button" data-act="tNeu">Neue Kombinationstabelle</button>` : `<button class="btn primary" type="button" data-act="rNeu">Neue Regel</button>`;
    return kopf("Regeln", "Regeln sperren Werte, erlauben nur bestimmte Werte oder wählen Werte automatisch. Wählen Sie oben Produkt oder Produktgruppe; alle Ansichten und neuen Regeln beziehen sich darauf.", ro() ? "" : neu) + leiste + tabs + body;
  });
  K.act.regelTab = el => { K.st.regelTab = el.dataset.t; K.render(); };

  /* ---------- Liste mit grafischen Regelkarten ---------- */
  const TYP = { sperren: ["sperrt", "sperren"], nurErlauben: ["erlaubt nur", "nur"], setzen: ["wählt automatisch", "setzen"] };
  const wertChips = (mo, mid, ids, klasse = "") => { const m = E.merkmal(mo, mid); return `<span class="rf-merkmal">${esc(m?.name || "…")}</span>${(ids || []).map(id => `<span class="rf-chip ${klasse}">${esc(E.wert(mo, mid, id)?.name || id)}${E.wert(mo, mid, id)?.code ? ` <code>${esc(E.wert(mo, mid, id).code)}</code>` : ""}</span>`).join("") || `<span class="rf-chip leer">…</span>`}`; };
  function regelBild(mo, r) {
    if (r.typ === "tabelle") {
      const t = r.tabelle || { merkmale: [], zeilen: [] };
      return `<div class="rflow"><span class="rf-wort tab">TABELLE</span>${t.merkmale.map(m => `<span class="rf-merkmal">${esc(E.merkmal(mo, m)?.name || m)}</span>`).join('<span class="rf-x">×</span>')}<span class="rf-pfeil">→</span><span class="rf-typ nur">${t.zeilen.length} Kombinationen erlaubt</span></div>`;
    }
    const wenn = (r.wenn || []).map((c, i) => `${i ? '<span class="rf-und">und</span>' : ""}<span class="rf-bed${c.op === "istNicht" ? " nicht" : ""}">${c.op === "istNicht" ? '<span class="rf-nicht">nicht</span>' : ""}${wertChips(mo, c.merkmal, c.werte)}</span>`).join("");
    const [t, k] = TYP[r.dann?.typ] || TYP.sperren;
    return `<div class="rflow"><span class="rf-wort">WENN</span>${wenn}<span class="rf-pfeil">→</span><span class="rf-typ ${k}">${t}</span><span class="rf-bed">${wertChips(mo, r.dann?.merkmal, r.dann?.werte, k)}</span></div>`;
  }
  function regelListe(mo, kx) {
    const f = K.st.regelFilter, q = f.suche.toLowerCase();
    const liste = mo.regeln.filter(r => r.typ !== "tabelle" && regelImKontext(mo, r, kx) && (!K.st.nurEigene || gleicherScope(r, kx.scope)) && (!f.merkmal || r.wenn.some(c => c.merkmal === f.merkmal) || r.dann?.merkmal === f.merkmal) && (!q || (r.id + r.name + E.satz(mo, r) + (r.hinweis || "")).toLowerCase().includes(q)));
    return `<div class="filterleiste">
      <select id="rf-m" data-act="rFilter" data-k="merkmal" aria-label="Nach Merkmal filtern">${merkmalOptionen(f.merkmal, "Alle Merkmale")}</select>
      <input type="search" id="rf-q" data-in="rSuche" placeholder="Regel, Code oder Text suchen" value="${esc(f.suche)}">
      ${kx.typ ? `<label class="haken klein"><input type="checkbox" data-act="nurEigene" ${K.st.nurEigene ? "checked" : ""}> nur hier angelegte (ohne geerbte)</label>` : ""}
      <span class="gedimmt klein">${liste.length} Regeln · ${liste.filter(r => r.aktiv).length} aktiv</span></div>
      <div class="regelkarten">${liste.map(r => regelKarte(mo, r)).join("") || `<div class="leer">Keine Regeln für diese Auswahl.${ro() ? "" : `<br><br><button class="btn primary" type="button" data-act="rNeu">Erste Regel anlegen</button>`}</div>`}</div>`;
  }
  K.act.nurEigene = el => { K.st.nurEigene = el.checked; K.render(); };
  K.act.rFilter = el => { K.st.regelFilter[el.dataset.k] = el.value; K.render(); };
  K.inp.rSuche = el => { K.st.regelFilter.suche = el.value; K.render(); };
  function regelKarte(mo, r) {
    const offen = K.st.regelOffen === r.id, fehler = regelFehler(mo, r);
    let html = `<article class="regelkarte${r.aktiv ? "" : " inaktiv"}${offen ? " offen" : ""}">
      <div class="regelkopf">
        <label class="schalter" title="${r.aktiv ? "Regel ist aktiv" : "Regel ist inaktiv"}"><input type="checkbox" data-act="rAktiv" data-r="${r.id}" ${r.aktiv ? "checked" : ""} ${dis()}><span></span><span class="sr">aktiv</span></label>
        <button type="button" class="regeltitel" data-act="rOeffnen" data-r="${r.id}" aria-expanded="${offen}">
          <span class="rt-zeile"><span class="mono">${r.id}</span> <b>${esc(r.name || "Ohne Namen")}</b>${r.matrix ? ` <span class="chip">Matrix</span>` : ""}${r.quelle === "excel" ? ` <span class="chip">Excel</span>` : ""}<span class="chip scope${K.st.kontext && !gleicherScope(r, kontext(mo).scope) ? " geerbt" : ""}">${K.st.kontext && !gleicherScope(r, kontext(mo).scope) ? "geerbt · " : ""}${esc(scopeText(mo, r))}</span></span>
          ${regelBild(mo, r)}
          ${fehler.length ? `<span class="klein warntext">${esc(fehler[0])}</span>` : ""}</button>
      </div>`;
    if (offen) html += regelEditor(mo, r);
    return html + `</article>`;
  }
  function regelFehler(mo, r) {
    const f = [];
    if (!r.wenn.length || r.wenn.some(c => !c.merkmal || !c.werte.length)) f.push("Bedingung unvollständig");
    if (!r.dann?.merkmal || !r.dann.werte.length) f.push("Folge unvollständig");
    if (r.dann && r.wenn.some(c => c.merkmal === r.dann.merkmal)) f.push("Bedingung und Folge betreffen dasselbe Merkmal");
    return f;
  }
  function geltungChips(mo, r, act) {
    const g = r.gruppen || [], p = r.produkte || [];
    return `<div class="chipwahl"><button type="button" class="chipbtn" data-act="${act}" data-w="" aria-pressed="${!g.length && !p.length}" ${dis()}>Alle Produkte</button>
      ${mo.gruppen.map(x => `<button type="button" class="chipbtn gruppe" data-act="${act}" data-w="g:${x.id}" aria-pressed="${g.includes(x.id)}" ${dis()}>▸ ${esc(x.name)}</button>`).join("")}
      ${mo.produkte.map(x => `<button type="button" class="chipbtn" data-act="${act}" data-w="p:${x.id}" aria-pressed="${p.includes(x.id)}" ${dis()}>${esc(x.name)}</button>`).join("")}</div>`;
  }
  function geltungUmschalten(r, w) {
    if (!w) { r.produkte = []; r.gruppen = []; return; }
    const [t, id] = [w[0], w.slice(2)], key = t === "g" ? "gruppen" : "produkte";
    r[key] = r[key] || []; r[key] = r[key].includes(id) ? r[key].filter(x => x !== id) : [...r[key], id];
  }
  function regelEditor(mo, r) {
    const bed = r.wenn.map((c, i) => {
      const m = E.merkmal(mo, c.merkmal);
      return `<div class="bedingung"><span class="wort">${i ? "und" : "Wenn"}</span>
        <select id="rc-m-${i}" data-act="rcMerkmal" data-i="${i}" aria-label="Merkmal" ${dis()}>${merkmalOptionen(c.merkmal, "Merkmal wählen")}</select>
        <select id="rc-op-${i}" data-act="rcOp" data-i="${i}" aria-label="Vergleich" ${dis()}><option value="ist" ${c.op !== "istNicht" ? "selected" : ""}>ist</option><option value="istNicht" ${c.op === "istNicht" ? "selected" : ""}>ist nicht</option></select>
        ${r.wenn.length > 1 && !ro() ? `<button type="button" class="ikon gefahr" data-act="rcWeg" data-i="${i}" title="Bedingung entfernen">✕</button>` : ""}
        ${m ? chipWahl(m.werte, c.werte, "rcWert", `data-i="${i}"`) : ""}<span class="klein gedimmt">${c.werte.length > 1 ? "Eine der markierten Ausprägungen genügt." : ""}</span></div>`;
    }).join("");
    const dm = r.dann?.merkmal ? E.merkmal(mo, r.dann.merkmal) : null;
    return `<div class="regeleditor">
      <div class="formgitter"><div class="feld breit"><label for="r-name">Name</label><input id="r-name" data-in="rName" value="${esc(r.name || "")}" ${dis()}></div></div>
      <div class="baustein"><div class="eyebrow">Bedingung</div>${bed}${ro() ? "" : `<button class="btn klein" type="button" data-act="rcNeu">+ weitere Bedingung (und)</button>`}</div>
      <div class="baustein"><div class="eyebrow">Dann</div><div class="bedingung"><span class="wort">dann</span>
        <select id="rd-typ" data-act="rdTyp" aria-label="Art der Folge" ${dis()}><option value="sperren" ${r.dann?.typ === "sperren" ? "selected" : ""}>sperre bei</option><option value="nurErlauben" ${r.dann?.typ === "nurErlauben" ? "selected" : ""}>erlaube nur bei</option><option value="setzen" ${r.dann?.typ === "setzen" ? "selected" : ""}>wähle automatisch bei</option></select>
        <select id="rd-m" data-act="rdMerkmal" aria-label="Merkmal" ${dis()}>${merkmalOptionen(r.dann?.merkmal, "Merkmal wählen")}</select>
        ${dm ? chipWahl(dm.werte, r.dann.werte, "rdWert", "") : ""}</div></div>
      <div class="baustein"><div class="eyebrow">Gilt für</div>${geltungChips(mo, r, "rGeltung")}<span class="klein gedimmt">Eine Gruppe schließt alle Untergruppen und deren Produkte ein.</span></div>
      <div class="formgitter"><div class="feld breit"><label for="r-hinweis">Hinweis im Konfigurator (optional, sonst wird der Regelsatz gezeigt)</label><input id="r-hinweis" data-in="rHinweis" value="${esc(r.hinweis || "")}" ${dis()}></div></div>
      <p class="klein gedimmt">${esc(E.satz(mo, r))}</p>
      <div class="row">${ro() ? "" : `<button class="btn klein" type="button" data-act="rKopie">Duplizieren</button><button class="btn klein gefahr-text" type="button" data-act="rLoeschen">Löschen</button>`}
        <button class="btn klein" type="button" data-act="rTest">Im Konfigurator testen</button><button class="btn klein" type="button" data-act="rOeffnen" data-r="${r.id}">Schließen</button></div></div>`;
  }
  const regel = () => ent().regeln.find(r => r.id === K.st.regelOffen);
  const rText = r => `Regel ${r.id} geändert`;
  K.act.rOeffnen = el => { K.st.regelOffen = K.st.regelOffen === el.dataset.r ? null : el.dataset.r; K.render(); };
  K.act.rAktiv = el => { const r = ent().regeln.find(x => x.id === el.dataset.r); r.aktiv = el.checked; geaendert(`Regel ${r.id} ${r.aktiv ? "aktiviert" : "deaktiviert"}`); };
  K.inp.rName = el => { regel().name = el.value; geaendert(rText(regel()), false); };
  K.inp.rHinweis = el => { regel().hinweis = el.value; geaendert(rText(regel()), false); };
  K.act.rcMerkmal = el => { const c = regel().wenn[+el.dataset.i]; c.merkmal = el.value; c.werte = []; geaendert(rText(regel())); };
  K.act.rcOp = el => { regel().wenn[+el.dataset.i].op = el.value; geaendert(rText(regel())); };
  K.act.rcWert = el => { const c = regel().wenn[+el.dataset.i]; c.werte = c.werte.includes(el.dataset.w) ? c.werte.filter(x => x !== el.dataset.w) : [...c.werte, el.dataset.w]; geaendert(rText(regel())); };
  K.act.rcNeu = () => { regel().wenn.push({ merkmal: "", op: "ist", werte: [] }); geaendert(null); };
  K.act.rcWeg = el => { regel().wenn.splice(+el.dataset.i, 1); geaendert(rText(regel())); };
  K.act.rdTyp = el => { regel().dann.typ = el.value; geaendert(rText(regel())); };
  K.act.rdMerkmal = el => { regel().dann.merkmal = el.value; regel().dann.werte = []; geaendert(rText(regel())); };
  K.act.rdWert = el => { const d = regel().dann; d.werte = d.werte.includes(el.dataset.w) ? d.werte.filter(x => x !== el.dataset.w) : [...d.werte, el.dataset.w]; geaendert(rText(regel())); };
  K.act.rGeltung = el => { const r = regel(); geltungUmschalten(r, el.dataset.w); geaendert(rText(r)); };
  K.act.rNeu = () => {
    const mo = ent(), id = E.neueId("R", mo.regeln.map(r => r.id)), sc = kontext(mo).scope;
    const f = K.st.regelFilter.merkmal;
    mo.regeln.push({ id, name: "", aktiv: true, produkte: [...sc.produkte], gruppen: [...sc.gruppen], wenn: [{ merkmal: f || "", op: "ist", werte: [] }], dann: { typ: "sperren", merkmal: "", werte: [] }, hinweis: "" });
    K.st.regelTab = "liste"; K.st.regelOffen = id; K.st.regelFilter.suche = ""; geaendert(`Regel ${id} angelegt`);
    K.nach(v => v.querySelector(".regelkarte.offen")?.scrollIntoView({ block: "center" }));
  };
  K.act.rKopie = () => { const mo = ent(), r = K.clone(regel()); r.id = E.neueId("R", mo.regeln.map(x => x.id)); r.name = (r.name || "") + " (Kopie)"; r.aktiv = false; delete r.matrix; delete r.quelle; mo.regeln.push(r); K.st.regelOffen = r.id; geaendert(`Regel ${r.id} als Kopie angelegt`); };
  K.act.rLoeschen = () => { const r = regel(); ent().regeln = ent().regeln.filter(x => x.id !== r.id); K.st.regelOffen = null; geaendert(`Regel ${r.id} gelöscht`); };
  K.act.rTest = () => {
    const mo = ent(), r = regel(), kx = kontext(mo);
    const p = kx.produkte.find(x => E.imGeltungsbereich(mo, r, x) && r.wenn.every(c => E.hatMerkmal(mo, x, c.merkmal)));
    if (!p) return K.toast("Kein Produkt in dieser Auswahl erfüllt die Bedingungen der Regel.");
    const sel = E.standardSel(mo, p); for (const c of r.wenn) if (c.op === "ist" && c.werte[0]) { const m = E.merkmal(mo, c.merkmal); sel[c.merkmal] = m.typ === "mehrfach" ? [c.werte[0]] : c.werte[0]; }
    K.konfigOeffnen(p.id, sel, null, true);
  };

  /* ---------- Matrix (Code gegen Code) ---------- */
  // Zellzustand für "Wenn a gewählt, was gilt für b?" aus Sicht der Produkte im Kontext
  function matrixLage(mo, kx, aM, bM) {
    const prods = kx.produkte.filter(p => E.hatMerkmal(mo, p, aM.id) && E.hatMerkmal(mo, p, bM.id));
    const fremd = {}; // a -> b -> [regeln]
    for (const a of aM.werte) {
      fremd[a.id] = {};
      for (const p of prods) {
        const sel = E.standardSel(mo, p); sel[aM.id] = aM.typ === "mehrfach" ? [a.id] : a.id; if (bM.typ === "mehrfach") sel[bM.id] = [];
        const g = E.sperren(mo, p, sel), gs = E.gesetzt(mo, p, sel);
        for (const b of bM.werte) {
          const r = g[bM.id]?.[b.id] || gs[bM.id]?.[b.id];
          if (r) (fremd[a.id][b.id] ||= new Map()).set(r.id, { r, art: g[bM.id]?.[b.id] ? "sperrt" : "setzt" });
        }
      }
    }
    return { prods, fremd };
  }
  const eigeneRegel = (mo, sc, aM, a, bM, typ) => mo.regeln.find(r => r.matrix && r.typ !== "tabelle" && r.wenn.length === 1 && r.wenn[0].merkmal === aM && r.wenn[0].op === "ist" && r.wenn[0].werte.length === 1 && r.wenn[0].werte[0] === a && r.dann?.typ === typ && r.dann.merkmal === bM && gleicherScope(r, sc));
  function zelle(mo, kx, aM, a, bM, b, lage) {
    const sc = kx.scope;
    const sp = eigeneRegel(mo, sc, aM.id, a.id, bM.id, "sperren"), st = eigeneRegel(mo, sc, aM.id, a.id, bM.id, "setzen");
    const eigen = sp && sp.aktiv && sp.dann.werte.includes(b.id) ? "gesperrt" : st && st.aktiv && st.dann.werte.includes(b.id) ? "gesetzt" : null;
    const andere = [...(lage.fremd[a.id]?.[b.id] || new Map()).values()].filter(x => !x.r.matrix || !gleicherScope(x.r, sc) || !(x.r.wenn.length === 1 && x.r.wenn[0].merkmal === aM.id && x.r.wenn[0].werte.length === 1));
    let klasse = eigen || (andere.length ? (andere.some(x => x.art === "sperrt") ? "fremd" : "fremd gesetzt") : "frei");
    const titel = `${aM.name} „${a.name}“ → ${bM.name} „${b.name}“: ` + (eigen === "gesperrt" ? `ausgeschlossen (${sp.id}). Klick: wird automatisch gewählt.` : eigen === "gesetzt" ? `wird automatisch gewählt (${st.id}). Klick: wieder frei.` : andere.length ? `${andere.map(x => x.art + " durch " + x.r.id + (x.r.name ? " " + x.r.name : "")).join(", ")}. Nur in der Regel änderbar.` : "erlaubt. Klick: ausschließen.");
    const inhalt = eigen === "gesperrt" ? "✕" : eigen === "gesetzt" ? "●" : andere.length ? andere.map(x => x.r.id).join(" ") : "";
    return `<button type="button" class="mx ${klasse}" data-act="mxKlick" data-am="${aM.id}" data-a="${a.id}" data-bm="${bM.id}" data-b="${b.id}" title="${esc(titel)}" ${andere.length && !eigen || ro() ? "disabled" : ""}>${esc(inhalt)}</button>`;
  }
  function matrixAnsicht(mo, kx) {
    const mx = K.st.matrix, ms = kontextMerkmale(mo, kx);
    if (ms.length < 2) return `<div class="leer">In dieser Auswahl gibt es zu wenige Merkmale.</div>`;
    const modus = `<div class="segment" role="group" aria-label="Darstellung"><button type="button" data-act="mxModus" data-m="gesamt" aria-pressed="${mx.modus === "gesamt"}">Alle Codes</button><button type="button" data-act="mxModus" data-m="paar" aria-pressed="${mx.modus === "paar"}">Zwei Merkmale</button></div>`;
    const legende = `<div class="legende"><span><i class="mx frei"></i> erlaubt</span><span><i class="mx gesperrt">✕</i> ausgeschlossen</span><span><i class="mx gesetzt">●</i> wird automatisch gewählt</span><span><i class="mx fremd">R</i> durch andere Regel oder Tabelle</span><span><i class="mx diag"></i> gleiches Merkmal</span></div>`;
    const lesart = `<p class="klein gedimmt">Lesart: Ist der Code in der <b>Zeile</b> gewählt, gilt für den Code in der <b>Spalte</b> … Ein Klick schaltet um: erlaubt → ausgeschlossen → automatisch gewählt → erlaubt. Die Regeln gelten für <b>${esc(kx.name)}</b>.</p>`;
    if (mx.modus === "paar") {
      const A = ms.find(m => m.id === mx.a) || ms[0], B = ms.find(m => m.id === mx.b && m.id !== A.id) || ms.find(m => m.id !== A.id);
      const lage = matrixLage(mo, kx, A, B);
      const opt = (aktiv, k) => ms.map(m => `<option value="${m.id}" ${m.id === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("");
      return `<div class="filterleiste">${modus}<label class="inline">Zeilen <select id="mx-a" data-act="mxWahl" data-k="a">${opt(A.id)}</select></label><label class="inline">Spalten <select id="mx-b" data-act="mxWahl" data-k="b">${opt(B.id)}</select></label></div>${lesart}
        <div class="tabwrap matrixwrap"><table class="matrix"><thead><tr><th class="mx-ecke">${esc(A.name)} ↓ · ${esc(B.name)} →</th>${B.werte.map(b => `<th class="mx-kopf"><span>${esc(b.name)}</span></th>`).join("")}</tr></thead>
        <tbody>${A.werte.map(a => `<tr><th class="mx-zeile">${esc(a.name)}${a.code ? ` <code>${esc(a.code)}</code>` : ""}</th>${B.werte.map(b => `<td>${zelle(mo, kx, A, a, B, b, lage)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${legende}`;
    }
    // Gesamtmatrix: alle Codes aller Merkmale, nach Merkmal gruppiert
    const lagen = {}; for (const A of ms) for (const B of ms) if (A !== B) lagen[A.id + ">" + B.id] = matrixLage(mo, kx, A, B);
    const kopf1 = ms.map(m => `<th class="mx-gruppe" colspan="${m.werte.length}">${esc(m.name)}</th>`).join("");
    const kopf2 = ms.map(m => m.werte.map((w, j) => `<th class="mx-kopf${j === 0 ? " start" : ""}" title="${esc(m.name + ": " + w.name)}"><span>${esc(w.code || w.name)}</span></th>`).join("")).join("");
    const zeilen = ms.map(A => A.werte.map((a, i) => `<tr class="${i === 0 ? "start" : ""}">${i === 0 ? `<th class="mx-gruppe-z" rowspan="${A.werte.length}"><span>${esc(A.name)}</span></th>` : ""}<th class="mx-zeile" title="${esc(a.name)}">${esc(a.code || a.name)}<small>${esc(a.name)}</small></th>
      ${ms.map(B => B.werte.map((b, j) => `<td class="${j === 0 ? "start" : ""}">${A === B ? `<span class="mx diag"></span>` : zelle(mo, kx, A, a, B, b, lagen[A.id + ">" + B.id])}</td>`).join("")).join("")}</tr>`).join("")).join("");
    return `<div class="filterleiste">${modus}<span class="gedimmt klein">${ms.length} Merkmale, ${ms.reduce((n, m) => n + m.werte.length, 0)} Codes</span></div>${lesart}
      <div class="tabwrap matrixwrap gross"><table class="matrix gesamt"><thead><tr><th colspan="2" rowspan="2" class="mx-ecke">Wenn ↓ · dann →</th>${kopf1}</tr><tr>${kopf2}</tr></thead><tbody>${zeilen}</tbody></table></div>${legende}`;
  }
  K.act.mxModus = el => { K.st.matrix.modus = el.dataset.m; K.render(); };
  K.act.mxWahl = el => { K.st.matrix[el.dataset.k] = el.value; K.render(); };
  K.act.mxKlick = el => {
    const mo = ent(), kx = kontext(mo), sc = kx.scope, { am, a, bm, b } = el.dataset;
    const A = E.merkmal(mo, am), B = E.merkmal(mo, bm), an = E.wert(mo, am, a).name, bn = E.wert(mo, bm, b).name;
    const holen = typ => {
      let r = eigeneRegel(mo, sc, am, a, bm, typ);
      if (!r) { r = { id: E.neueId("M", mo.regeln.map(x => x.id)), name: `${A.name} „${an}“ ${typ === "setzen" ? "wählt" : "sperrt"} ${B.name}`, aktiv: true, matrix: true, produkte: [...sc.produkte], gruppen: [...sc.gruppen], wenn: [{ merkmal: am, op: "ist", werte: [a] }], dann: { typ, merkmal: bm, werte: [] }, hinweis: "" }; mo.regeln.push(r); }
      r.aktiv = true; return r;
    };
    const weg = (r, w) => { if (!r) return; r.dann.werte = r.dann.werte.filter(x => x !== w); if (!r.dann.werte.length) mo.regeln = mo.regeln.filter(x => x !== r); };
    const sp = eigeneRegel(mo, sc, am, a, bm, "sperren"), st = eigeneRegel(mo, sc, am, a, bm, "setzen");
    if (sp && sp.dann.werte.includes(b)) {
      weg(sp, b); const r = holen("setzen");
      if (B.typ !== "mehrfach") r.dann.werte = [b]; else if (!r.dann.werte.includes(b)) r.dann.werte.push(b);
      geaendert(`Matrix ${kx.name}: ${an} wählt ${bn} automatisch`);
    } else if (st && st.dann.werte.includes(b)) { weg(st, b); geaendert(`Matrix ${kx.name}: ${an} und ${bn} wieder frei`); }
    else { const r = holen("sperren"); r.dann.werte.push(b); geaendert(`Matrix ${kx.name}: ${an} schließt ${bn} aus`); }
  };

  /* ---------- Kombinationstabellen ---------- */
  const kombis = (mo, ms) => ms.reduce((acc, mid) => acc.flatMap(z => E.merkmal(mo, mid).werte.map(w => [...z, w.id])), [[]]);
  const zKey = z => z.join("|");
  function tabellenAnsicht(mo, kx) {
    const liste = mo.regeln.filter(r => r.typ === "tabelle" && regelImKontext(mo, r, kx));
    const offen = liste.find(r => r.id === K.st.tabOffen);
    const karten = liste.map(r => `<button type="button" class="tabkarte${r === offen ? " aktiv" : ""}${r.aktiv ? "" : " inaktiv"}" data-act="tOeffnen" data-r="${r.id}">
      <span class="rt-zeile"><span class="mono">${r.id}</span> <b>${esc(r.name || "Kombinationstabelle")}</b><span class="chip scope">${esc(scopeText(mo, r))}</span></span>${regelBild(mo, r)}</button>`).join("");
    const erkl = `<p class="klein gedimmt">Eine Kombinationstabelle legt fest, welche Wertekombinationen mehrerer Merkmale zusammen erlaubt sind (wie eine Variantentabelle). Alles, was nicht angehakt ist, kann der Vertrieb nicht kombinieren. Ideal für Abhängigkeiten wie Achsanzahl × Bereifung × Achslast.</p>`;
    return `${erkl}<div class="tab-layout"><div class="tabliste">${karten || `<div class="leer klein">Noch keine Kombinationstabelle für ${esc(kx.name)}.</div>`}</div>
      <div class="tabeditor">${offen ? tabellenEditor(mo, kx, offen) : `<div class="leer">Tabelle links wählen oder neu anlegen.</div>`}</div></div>`;
  }
  function tabellenEditor(mo, kx, r) {
    const km = Object.fromEntries(kontextMerkmale(mo, kx).map(m => [m.id, m]));
    const t = r.tabelle, ms = t.merkmale.map(id => km[id] || E.merkmal(mo, id)).filter(Boolean), erlaubt = new Set(t.zeilen.map(zKey));
    const waehlbar = kontextMerkmale(mo, kx).filter(m => m.typ !== "mehrfach");
    let gitter = "";
    if (ms.length === 2) {
      const [A, B] = ms;
      gitter = `<div class="tabwrap matrixwrap"><table class="matrix kombi"><thead><tr><th class="mx-ecke">${esc(A.name)} ↓ · ${esc(B.name)} →</th>${B.werte.map(b => `<th class="mx-kopf"><button type="button" class="kopfknopf" data-act="tSpalte" data-b="${b.id}" title="Ganze Spalte umschalten" ${dis()}><span>${esc(b.name)}</span></button></th>`).join("")}</tr></thead>
        <tbody>${A.werte.map(a => `<tr><th class="mx-zeile"><button type="button" class="kopfknopf" data-act="tZeile" data-a="${a.id}" title="Ganze Zeile umschalten" ${dis()}>${esc(a.name)}</button></th>${B.werte.map(b => { const k = zKey([a.id, b.id]), an = erlaubt.has(k); return `<td><button type="button" class="mx ${an ? "erlaubt" : "aus"}" data-act="tZelle" data-k="${esc(k)}" aria-pressed="${an}" title="${esc(a.name + " + " + b.name + (an ? ": erlaubt" : ": nicht erlaubt"))}" ${dis()}>${an ? "✓" : ""}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
    } else if (ms.length > 2) {
      const alle = ms.reduce((acc, m) => acc.flatMap(z => m.werte.map(w => [...z, w.id])), [[]]), zuviel = alle.length > 400;
      gitter = zuviel ? `<div class="hinweis warn">${alle.length} mögliche Kombinationen sind zu viele für die Ansicht. Bitte höchstens ${ms.length - 1} Merkmale verwenden oder Werte über das Produkt einschränken.</div>`
        : `<div class="tabwrap kombiliste"><table class="kompakt"><thead><tr>${ms.map(m => `<th>${esc(m.name)}</th>`).join("")}<th class="r">Erlaubt</th></tr></thead><tbody>
        ${alle.map(z => { const k = zKey(z), an = erlaubt.has(k); return `<tr class="${an ? "" : "aus"}">${z.map((w, i) => `<td>${esc(E.wert(mo, t.merkmale[i], w)?.name || w)}</td>`).join("")}<td class="r"><button type="button" class="mx ${an ? "erlaubt" : "aus"}" data-act="tZelle" data-k="${esc(k)}" aria-pressed="${an}" ${dis()}>${an ? "✓" : ""}</button></td></tr>`; }).join("")}</tbody></table></div>`;
    }
    const tote = ms.flatMap((m, i) => m.werte.filter(w => !t.zeilen.some(z => z[i] === w.id)).map(w => w.name));
    return `<div class="panel">
      <div class="row zwischen"><label class="schalter" title="aktiv"><input type="checkbox" data-act="tAktiv" ${r.aktiv ? "checked" : ""} ${dis()}><span></span><span class="sr">aktiv</span></label>
        <input id="t-name" class="flach titelfeld" data-in="tName" value="${esc(r.name || "")}" placeholder="Name der Tabelle" ${dis()}>
        ${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="tLoeschen">Löschen</button>`}</div>
      <div class="baustein"><div class="eyebrow">Merkmale der Tabelle (2 bis 4)</div><div class="chipwahl">${waehlbar.map(m => `<button type="button" class="chipbtn" data-act="tMerkmal" data-m="${m.id}" aria-pressed="${t.merkmale.includes(m.id)}" ${dis()}>${esc(m.name)}</button>`).join("")}</div></div>
      <div class="baustein"><div class="eyebrow">Gilt für</div>${geltungChips(mo, r, "tGeltung")}</div>
      ${ms.length >= 2 ? `<div class="row zwischen"><span><b>${t.zeilen.length}</b> von ${kombis(mo, t.merkmale).length} Kombinationen erlaubt</span>${ro() ? "" : `<span class="row"><button class="btn klein" type="button" data-act="tAlle" data-an="1">Alle erlauben</button><button class="btn klein" type="button" data-act="tAlle" data-an="0">Alle sperren</button></span>`}</div>${gitter}
        ${tote.length ? `<div class="hinweis warn">Nie wählbar: ${tote.map(esc).join(", ")}</div>` : ""}` : `<div class="leer klein">Bitte mindestens zwei Merkmale wählen.</div>`}
    </div>`;
  }
  const tab = () => ent().regeln.find(r => r.id === K.st.tabOffen);
  const tText = () => `Kombinationstabelle ${tab().id} geändert`;
  K.act.tOeffnen = el => { K.st.tabOffen = el.dataset.r; K.render(); };
  K.act.tNeu = () => {
    const mo = ent(), kx = kontext(mo), ms = kontextMerkmale(mo, kx).filter(m => m.typ !== "mehrfach").slice(0, 2).map(m => m.id);
    const id = E.neueId("T", mo.regeln.map(r => r.id));
    mo.regeln.push({ id, name: "Neue Kombinationstabelle", aktiv: true, typ: "tabelle", produkte: [...kx.scope.produkte], gruppen: [...kx.scope.gruppen], tabelle: { merkmale: ms, zeilen: kombis(mo, ms) } });
    K.st.regelTab = "tabellen"; K.st.tabOffen = id; geaendert(`Kombinationstabelle ${id} angelegt`);
  };
  K.inp.tName = el => { tab().name = el.value; geaendert(tText(), false); };
  K.act.tAktiv = el => { tab().aktiv = el.checked; geaendert(tText()); };
  K.act.tLoeschen = () => { const r = tab(); ent().regeln = ent().regeln.filter(x => x !== r); K.st.tabOffen = null; geaendert(`Kombinationstabelle ${r.id} gelöscht`); };
  K.act.tGeltung = el => { geltungUmschalten(tab(), el.dataset.w); geaendert(tText()); };
  K.act.tMerkmal = el => {
    const mo = ent(), t = tab().tabelle, m = el.dataset.m;
    if (t.merkmale.includes(m)) { // Spalte entfernen, Zeilen zusammenfassen
      const i = t.merkmale.indexOf(m); t.merkmale.splice(i, 1);
      const neu = new Map(); for (const z of t.zeilen) { const k = z.filter((_, j) => j !== i); neu.set(zKey(k), k); } t.zeilen = [...neu.values()];
    } else {
      if (t.merkmale.length >= 4) return K.toast("Höchstens vier Merkmale je Tabelle.");
      const werte = E.merkmal(mo, m).werte.map(w => w.id); t.merkmale.push(m);
      t.zeilen = t.merkmale.length === 1 ? werte.map(w => [w]) : t.zeilen.flatMap(z => werte.map(w => [...z, w]));
      if (t.merkmale.length === 2 && !t.zeilen.length) t.zeilen = kombis(mo, t.merkmale);
    }
    geaendert(tText());
  };
  K.act.tZelle = el => { const t = tab().tabelle, k = el.dataset.k; const i = t.zeilen.findIndex(z => zKey(z) === k); if (i >= 0) t.zeilen.splice(i, 1); else t.zeilen.push(k.split("|")); geaendert(tText()); };
  K.act.tZeile = el => { const mo = ent(), t = tab().tabelle, a = el.dataset.a, bs = E.merkmal(mo, t.merkmale[1]).werte.map(w => w.id); const alle = bs.every(b => t.zeilen.some(z => z[0] === a && z[1] === b)); t.zeilen = t.zeilen.filter(z => z[0] !== a); if (!alle) for (const b of bs) t.zeilen.push([a, b]); geaendert(tText()); };
  K.act.tSpalte = el => { const mo = ent(), t = tab().tabelle, b = el.dataset.b, as = E.merkmal(mo, t.merkmale[0]).werte.map(w => w.id); const alle = as.every(a => t.zeilen.some(z => z[0] === a && z[1] === b)); t.zeilen = t.zeilen.filter(z => z[1] !== b); if (!alle) for (const a of as) t.zeilen.push([a, b]); geaendert(tText()); };
  K.act.tAlle = el => { const mo = ent(), t = tab().tabelle; t.zeilen = el.dataset.an === "1" ? kombis(mo, t.merkmale) : []; geaendert(tText()); };

  /* ---------- Regelgraph (geschichtet: Ursache links, Wirkung rechts) ---------- */
  function graph(mo, kx) {
    const regeln = mo.regeln.filter(r => regelImKontext(mo, r, kx));
    const kanten = []; // {von, nach, r, art}
    for (const r of regeln) {
      if (r.typ === "tabelle") { const ms = r.tabelle?.merkmale || []; for (let i = 0; i < ms.length - 1; i++) kanten.push({ von: ms[i], nach: ms[i + 1], r, art: "tabelle" }); continue; }
      for (const c of r.wenn || []) if (c.merkmal && r.dann?.merkmal && c.merkmal !== r.dann.merkmal) kanten.push({ von: c.merkmal, nach: r.dann.merkmal, r, art: r.dann.typ });
    }
    const ids = [...new Set(kanten.flatMap(k => [k.von, k.nach]))].filter(id => E.merkmal(mo, id));
    if (!ids.length) return `<div class="leer">Für ${esc(kx.name)} gibt es noch keine Regeln.</div>`;
    // Ebenen: längster Weg von den Ursachen aus (Kreise werden abgebrochen)
    const rang = Object.fromEntries(ids.map(id => [id, 0]));
    for (let i = 0; i < ids.length; i++) { let geaendert2 = false; for (const k of kanten) if (k.art !== "tabelle" && rang[k.nach] < rang[k.von] + 1 && rang[k.von] + 1 < ids.length) { rang[k.nach] = rang[k.von] + 1; geaendert2 = true; } if (!geaendert2) break; }
    const spalten = []; for (const id of ids) (spalten[rang[id]] ||= []).push(id);
    const reihenfolge = mo.merkmale.map(m => m.id); spalten.forEach(s => s && s.sort((a, b) => reihenfolge.indexOf(a) - reihenfolge.indexOf(b)));
    const BW = 180, BH = 42, DX = 400, DY = 76, X0 = 30, Y0 = 50;
    const hoehe = Math.max(...spalten.map(s => (s || []).length)) * DY + Y0 + 30, breite = X0 * 2 + (spalten.length - 1) * DX + BW;
    const pos = {}; spalten.forEach((s, i) => (s || []).forEach((id, j) => { const off = (hoehe - Y0 - 30 - s.length * DY) / 2; pos[id] = { x: X0 + i * DX, y: Y0 + off + j * DY }; }));
    const fokus = K.st.graphFokus && ids.includes(K.st.graphFokus) ? K.st.graphFokus : null;
    const verbunden = k => !fokus || k.von === fokus || k.nach === fokus;
    const farbe = { sperren: "var(--bad)", nurErlauben: "var(--info)", setzen: "var(--ok)", tabelle: "#7a4fb5" };
    // gleiche Kanten bündeln
    const buendel = new Map(); for (const k of kanten) { const key = k.von + ">" + k.nach + ">" + k.art; if (!buendel.has(key)) buendel.set(key, { ...k, rs: [] }); buendel.get(key).rs.push(k.r); }
    let svg = `<defs>${Object.entries(farbe).map(([a, f]) => `<marker id="pf-${a}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${f}"/></marker>`).join("")}</defs>`;
    spalten.forEach((s, i) => { svg += `<text x="${X0 + i * DX + BW / 2}" y="22" text-anchor="middle" class="g-spalte">${i === 0 ? "Auslöser" : i === spalten.length - 1 ? "Wirkung" : "Stufe " + (i + 1)}</text>`; });
    let n = 0; const zielZahl = {};
    for (const k of buendel.values()) {
      const a = pos[k.von], b = pos[k.nach]; if (!a || !b) continue;
      const vorwaerts = b.x > a.x;
      const x1 = vorwaerts ? a.x + BW : a.x + BW / 2, y1 = vorwaerts ? a.y + BH / 2 : a.y, x2 = vorwaerts ? b.x : b.x + BW / 2, y2 = vorwaerts ? b.y + BH / 2 : b.y + (b.y >= a.y ? 0 : BH);
      const d = vorwaerts ? `M${x1} ${y1} C${x1 + 140} ${y1} ${x2 - 140} ${y2} ${x2} ${y2}` : `M${x1} ${y1} C${x1 + 30} ${y1 - 60 - (n % 3) * 14} ${x2 + 30} ${y2 - 60 - (n % 3) * 14} ${x2} ${y2}`;
      const aktiv = k.rs.some(r => r.aktiv), dim = !verbunden(k);
      svg += `<path d="${d}" fill="none" stroke="${farbe[k.art] || "var(--muted)"}" stroke-width="${1.4 + Math.min(k.rs.length, 4) * .5}" ${aktiv ? "" : 'stroke-dasharray="4 4"'} ${k.art === "tabelle" ? 'stroke-dasharray="7 3"' : ""} marker-end="${k.art === "tabelle" ? "" : `url(#pf-${k.art})`}" class="g-kante${dim ? " dim" : ""}"/>`;
      // Beschriftung nahe am Ziel, damit sich Kanten aus demselben Merkmal nicht überlagern
      const bz = (t, p0, p1, p2, p3) => (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3;
      zielZahl[k.nach] = (zielZahl[k.nach] || 0) + 1; const tl = Math.max(.25, .82 - (zielZahl[k.nach] - 1) * .17);
      const lx = vorwaerts ? bz(tl, x1, x1 + 140, x2 - 140, x2) : (x1 + x2) / 2 + 15, ly = vorwaerts ? bz(tl, y1, y1, y2, y2) : Math.min(y1, y2) - 48 - (n % 3) * 10;
      const txt = k.rs.slice(0, 3).map(r => r.id).join(" ") + (k.rs.length > 3 ? ` +${k.rs.length - 3}` : "");
      svg += `<g class="g-label${dim ? " dim" : ""}" data-act="graphRegel" data-r="${k.rs[0].id}" role="button" tabindex="0"><rect x="${lx - txt.length * 3.4 - 6}" y="${ly - 9}" width="${txt.length * 6.8 + 12}" height="18" rx="9" fill="var(--surface)" stroke="${farbe[k.art]}"/><text x="${lx}" y="${ly + 4}" text-anchor="middle">${esc(txt)}</text></g>`;
      n++;
    }
    for (const id of ids) {
      const m = E.merkmal(mo, id), p = pos[id], anz = kanten.filter(k => k.von === id || k.nach === id).length, dim = fokus && fokus !== id && !kanten.some(k => (k.von === fokus && k.nach === id) || (k.nach === fokus && k.von === id));
      svg += `<g class="g-knoten${fokus === id ? " fokus" : ""}${dim ? " dim" : ""}" data-act="graphMerkmal" data-m="${id}" role="button" tabindex="0"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="6"/>
        <text x="${p.x + 12}" y="${p.y + 17}" class="g-name">${esc(m.name.length > 22 ? m.name.slice(0, 21) + "…" : m.name)}</text><text x="${p.x + 12}" y="${p.y + 31}" class="g-zahl">${m.werte.length} Werte · ${anz} Beziehungen</text></g>`;
    }
    const fokusRegeln = fokus ? regeln.filter(r => r.typ === "tabelle" ? r.tabelle?.merkmale.includes(fokus) : (r.wenn.some(c => c.merkmal === fokus) || r.dann?.merkmal === fokus)) : [];
    return `<div class="legende" style="margin-bottom:8px"><span><i class="g-leg" style="background:var(--bad)"></i> sperrt</span><span><i class="g-leg" style="background:var(--info)"></i> erlaubt nur</span><span><i class="g-leg" style="background:var(--ok)"></i> wählt automatisch</span><span><i class="g-leg" style="background:#7a4fb5"></i> Kombinationstabelle</span><span class="gedimmt">Gestrichelt: inaktiv. Merkmal anklicken zeigt seine Beziehungen.</span></div>
      <div class="graph-layout"><div class="panel graphwrap"><svg viewBox="0 0 ${breite} ${hoehe}" width="${breite}" height="${hoehe}" style="width:${breite}px;max-width:none;min-width:0" role="img" aria-label="Regelgraph">${svg}</svg></div>
      ${fokus ? `<aside class="panel graph-seite"><div class="panelkopf"><h3>${esc(E.merkmal(mo, fokus).name)}</h3><button class="ikon" type="button" data-act="graphMerkmal" data-m="" title="Auswahl aufheben">✕</button></div>
        <ul class="regelliste">${fokusRegeln.map(r => `<li><button type="button" class="link" data-act="graphRegel" data-r="${r.id}">${r.id}</button><span>${esc(E.satz(mo, r))}</span></li>`).join("")}</ul>
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="graphNeu" data-m="${fokus}">Neue Regel mit ${esc(E.merkmal(mo, fokus).name)}</button>`}</aside>` : ""}</div>`;
  }
  K.act.graphRegel = el => { const r = ent().regeln.find(x => x.id === el.dataset.r); if (r?.typ === "tabelle") { K.st.regelTab = "tabellen"; K.st.modellTab = "kombinationen"; K.st.tabOffen = r.id; } else { K.st.regelTab = "liste"; K.st.modellTab = "regeln"; K.st.regelOffen = el.dataset.r; K.st.regelFilter = { merkmal: "", suche: "" }; } K.render(); };
  K.act.graphMerkmal = el => { K.st.graphFokus = el.dataset.m && K.st.graphFokus !== el.dataset.m ? el.dataset.m : null; K.render(); };
  K.act.graphNeu = el => { K.st.regelFilter.merkmal = el.dataset.m; K.st.modellTab = "regeln"; K.act.rNeu(); };
  /* =====================================================================
     Modelltest
     ===================================================================== */
  K.route("studio-test", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const t = K.st.test; if (!E.produkt(mo, t.produkt)) t.produkt = mo.produkte[0]?.id;
    const r = t.res && t.res.produkt === t.produkt ? t.res : null;
    return kopf("Modelltest", "Rechnet alle Kombinationen eines Produkts durch und findet Widersprüche, unerreichbare Werte und Regeln, die nie greifen.") + `
      <div class="filterleiste"><select id="t-p" data-act="tProdukt" aria-label="Produkt">${mo.produkte.map(p => `<option value="${p.id}" ${p.id === t.produkt ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
        <button class="btn primary" type="button" data-act="tStart">Test starten</button><button class="btn" type="button" data-act="stTesten" data-p="${t.produkt}">Entwurf im Konfigurator öffnen</button></div>
      ${r ? `<div class="kpis">
        <div class="kpi"><b class="num">${K.zahl(r.total)}</b><span>Kombinationen${r.abgebrochen ? " (Teilprüfung)" : ""}</span></div>
        <div class="kpi"><b class="num">${K.zahl(r.gueltig)}</b><span>gültig (${K.zahl(r.gueltig / r.geprueft * 100, 1)} %)</span></div>
        <div class="kpi ${r.widersprueche ? "schlecht" : "gut"}"><b class="num">${K.zahl(r.widersprueche)}</b><span>Widersprüche</span></div>
        <div class="kpi ${r.tote.length ? "schlecht" : "gut"}"><b class="num">${r.tote.length}</b><span>unerreichbare Werte</span></div></div>
        ${r.widersprueche ? `<div class="hinweis warn">In ${K.zahl(r.widersprueche)} Kombinationen bleibt bei <b>${esc(r.beispielWiderspruch.merkmal)}</b> kein Wert übrig. Beispiel: ${esc(Object.entries(r.beispielWiderspruch.sel).filter(([, v]) => !Array.isArray(v)).map(([m, v]) => `${E.merkmal(mo, m)?.name} = ${E.wert(mo, m, v)?.name}`).join(", "))}</div>` : `<div class="hinweis ok">Keine Widersprüche: In jeder Kombination bleibt für jedes Merkmal mindestens ein Wert wählbar.</div>`}
        ${r.tote.length ? `<div class="hinweis warn"><b>Diese Werte kann man nie wählen:</b> ${r.tote.map(x => `${esc(x.merkmal)}: ${esc(x.wert)}`).join(" · ")}</div>` : ""}
        <section class="panel" style="margin-top:12px"><h3>Regelabdeckung</h3><div class="tabwrap ohne-rand"><table><thead><tr><th>Regel</th><th>Name</th><th class="r">Greift in Kombinationen</th><th>Bewertung</th></tr></thead><tbody>
          ${r.regeln.map(x => `<tr><td class="mono">${x.id}</td><td>${esc(x.name)}</td><td class="r num">${K.zahl(x.treffer)}</td><td>${x.treffer ? `<span class="chip st-angenommen">greift</span>` : x.nurMitZubehoer ? `<span class="chip">hängt von Ausstattung ab</span>` : `<span class="chip warn">greift nie</span>`}</td></tr>`).join("") || `<tr><td colspan="4" class="gedimmt">Keine Regeln für dieses Produkt.</td></tr>`}
        </tbody></table></div></section>` : `<div class="leer">Produkt wählen und Test starten.</div>`}`;
  });
  K.act.tProdukt = el => { K.st.test.produkt = el.value; K.render(); };
  K.act.tStart = el => {
    el.disabled = true; el.textContent = "Wird gerechnet …";
    setTimeout(() => { const mo = ent(), p = E.produkt(mo, K.st.test.produkt); const res = E.modelltest(mo, p); res.produkt = p.id; K.st.test.res = res; K.render(); }, 30);
  };

  /* =====================================================================
     Freigabe
     ===================================================================== */
  function unterschiede(alt, neu) {
    const out = [];
    const vergleich = (bereich, la, ln, name) => {
      const ma = new Map((la || []).map(x => [x.id, x])), mn = new Map((ln || []).map(x => [x.id, x]));
      for (const [id, x] of mn) { if (!ma.has(id)) out.push({ bereich, art: "neu", text: name(x) }); else if (JSON.stringify(ma.get(id)) !== JSON.stringify(x)) out.push({ bereich, art: "geändert", text: name(x) }); }
      for (const [id, x] of ma) if (!mn.has(id)) out.push({ bereich, art: "gelöscht", text: name(x) });
    };
    vergleich("Produkte", alt?.produkte, neu.produkte, x => x.name);
    vergleich("Merkmale", alt?.merkmale, neu.merkmale, x => x.name);
    vergleich("Regeln", alt?.regeln, neu.regeln, x => `${x.id} ${x.name || ""}`);
    vergleich("Gruppen", alt?.gruppen, neu.gruppen, x => x.name);
    return out;
  }
  K.unterschiede = unterschiede;
  K.freigabeOffen = () => S().entwurf && S().live ? unterschiede(S().live, S().entwurf).length : 0;
  K.route("studio-freigabe", () => {
    const mo = ent(); if (!mo) return keinEntwurf();
    const lv = S().live, diff = unterschiede(lv, mo);
    const pruef = mo.produkte.map(p => ({ p, t: E.modelltest(mo, p, 60000) }));
    const probleme = pruef.filter(x => x.t.widersprueche || x.t.tote.length);
    const fehlArt = artikelFehlend(mo);
    const namen = K.namenCache || {};
    return kopf("Freigabe", "Der Vertrieb arbeitet immer mit der veröffentlichten Version. Änderungen im Studio werden erst mit einer neuen Version sichtbar.") + `
      <div class="zwei-spalten">
        <section class="panel"><div class="panelkopf"><h3>Änderungen im Entwurf</h3><span class="chip">${diff.length}</span></div>
          ${diff.length ? `<ul class="diffliste">${diff.map(d => `<li><span class="chip diff-${d.art === "neu" ? "neu" : d.art === "gelöscht" ? "weg" : "mod"}">${d.art}</span><span class="gedimmt">${d.bereich}</span> ${esc(d.text)}</li>`).join("")}</ul>` : `<p class="leer-klein">Der Entwurf entspricht der veröffentlichten Version ${lv?.version || ""}.</p>`}
          <h3 style="margin-top:16px">Automatische Prüfung</h3>
          ${fehlArt.length ? `<div class="hinweis warn"><b>${fehlArt.length} Artikelnummern fehlen im Artikelstamm:</b> ${fehlArt.slice(0, 30).map(x => `<code>${esc(x.code)}</code> <span class="gedimmt">(${esc(x.wo)})</span>`).join(", ")}${fehlArt.length > 30 ? " …" : ""}</div>` : K.Store.artikelQuelle ? `<div class="hinweis ok">Alle Codes, Fahrzeugnummern und Stücklisten-Artikel sind im Artikelstamm vorhanden.</div>` : ""}
          ${probleme.length ? probleme.map(x => `<div class="hinweis warn"><b>${esc(x.p.name)}:</b> ${x.t.widersprueche ? `${K.zahl(x.t.widersprueche)} Widersprüche. ` : ""}${x.t.tote.length ? `Unerreichbar: ${x.t.tote.map(t => esc(t.wert)).join(", ")}` : ""}</div>`).join("") : `<div class="hinweis ok">Alle ${pruef.length} Produkte ohne Widersprüche und ohne unerreichbare Werte.</div>`}
          ${ro() ? "" : `<div class="feld" style="margin-top:12px"><label for="fr-notiz">Was ändert sich? (für das Protokoll)</label><input id="fr-notiz" placeholder="z. B. Neue Rampen, Preise 2027"></div>
          <div class="row" style="margin-top:10px"><button class="btn gelb" type="button" data-act="veroeffentlichen" ${diff.length ? "" : "disabled"}>Version ${(lv?.version || 0) + 1} veröffentlichen</button><button class="btn" type="button" data-act="verwerfen" ${diff.length ? "" : "disabled"}>Entwurf verwerfen</button></div>`}
        </section>
        <section class="panel"><div class="panelkopf"><h3>Versionen</h3></div>
          <ul class="zeitachse">${S().releases.map(r => `<li class="${r.version === lv?.version ? "angenommen" : ""}"><time>${K.zeit(r.ts)}${r.von && namen[r.von] ? " · " + esc(namen[r.von]) : ""}</time><b>Version ${r.version}</b>${r.version === lv?.version ? " · aktuell im Vertrieb" : ""}<br><span class="klein gedimmt">${r.produkte} Produkte, ${r.merkmale} Merkmale, ${r.regeln} Regeln</span>${r.notiz ? `<q>${esc(r.notiz)}</q>` : ""}</li>`).join("") || "<li>Noch keine Version veröffentlicht.</li>"}</ul>
        </section></div>`;
  });
  K.act.veroeffentlichen = async el => { const n = document.getElementById("fr-notiz").value.trim(); el.disabled = true; await K.Store.veroeffentlichen(n); K.toast(`Version ${S().live.version} ist jetzt im Vertrieb aktiv`); K.render(); };
  K.act.verwerfen = () => K.sheet(`<h3>Entwurf verwerfen?</h3><p>Alle Änderungen seit Version ${S().live.version} gehen verloren.</p><div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="verwerfenOk">Verwerfen</button></div>`);
  K.act.verwerfenOk = async () => { K.sheetZu(); await K.Store.entwurfVerwerfen(); K.toast("Entwurf verworfen"); };

  /* =====================================================================
     Vorlagen (Angebotsdokument)
     ===================================================================== */
  K.route("studio-vorlagen-texte", () => {
    const e = S().einst; if (!e) return keinEntwurf();
    const v = e.vorlage, bsp = S().angebote[0];
    const feld = (k, t, z = 3) => `<div class="feld"><label for="v-${k}">${t}</label><textarea id="v-${k}" rows="${z}" data-in="vText" data-k="${k}" ${dis()}>${esc(v[k] || "")}</textarea>${bsp ? `<span class="klein gedimmt vorschau">Vorschau: ${esc(K.platzhalter(v[k], bsp, e)).slice(0, 220)}</span>` : ""}</div>`;
    const opt = (k, t) => `<label class="haken"><input type="checkbox" data-act="vOpt" data-k="${k}" ${v[k] ? "checked" : ""} ${dis()}> ${t}</label>`;
    return kopf("Vorlagen", "Standardtexte und Aufbau des Angebotsdokuments. Neue Angebote übernehmen diese Texte; im Angebot lassen sie sich einzeln anpassen.") + `
      <div class="angebot-layout"><div class="haupt"><section class="panel">
        ${feld("einleitung", "Einleitung", 4)}${feld("lieferung", "Lieferung", 2)}${feld("zahlung", "Zahlungsbedingungen", 2)}${feld("gewaehrleistung", "Gewährleistung", 2)}${feld("schluss", "Schlusstext", 3)}
      </section></div>
      <aside class="neben"><section class="panel"><h3>Inhalt des PDF</h3><div class="haken-liste">
        ${opt("zeigeBild", "3D-Ansicht jedes Fahrzeugs")}${opt("zeigeMerkmalpreise", "Preis je Merkmal")}${opt("zeigeStueckliste", "Stückliste als Anlage")}</div></section>
        <section class="panel"><h3>Platzhalter</h3><ul class="platzhalter">${["kunde.firma", "kunde.person", "angebot.nr", "angebot.datum", "angebot.gueltig", "bearbeiter.name", "bearbeiter.tel", "bearbeiter.mail", "firma.name"].map(p => `<li><code>{{${p}}}</code></li>`).join("")}</ul>
          <p class="klein gedimmt">Für Word-Vorlagen wie beim Document Designer bräuchte es eine serverseitige Dokumentenerzeugung. Der Prototyp erzeugt das PDF direkt im Browser.</p></section></aside></div>`;
  });
  K.inp.vText = el => { const e = S().einst; e.vorlage[el.dataset.k] = el.value; K.Store.einstSpeichern(e); };
  K.act.vOpt = el => { const e = S().einst; e.vorlage[el.dataset.k] = el.checked; K.Store.einstSpeichern(e); K.Store.log("Vorlagen", "PDF-Inhalt geändert"); };

  /* =====================================================================
     Einstellungen
     ===================================================================== */
  K.route("studio-einstellungen", () => {
    const e = S().einst; if (!e) return keinEntwurf();
    const f = (obj, k, t, typ = "text") => `<div class="feld"><label for="e-${obj}-${k}">${t}</label><input id="e-${obj}-${k}" type="${typ}" data-in="eFeld" data-o="${obj}" data-k="${k}" value="${esc(obj === "root" ? e[k] : e[obj][k])}" ${dis()}></div>`;
    const ich = S().prefs.vertrieb || "";
    return kopf("Einstellungen", "") + `
      <section class="panel"><h3>Firma</h3><div class="formgitter">${f("firma", "name", "Firmenname")}${f("firma", "strasse", "Straße")}${f("firma", "ort", "PLZ und Ort")}${f("firma", "tel", "Telefon")}${f("firma", "web", "Website")}${f("firma", "ustid", "USt-IdNr.")}</div></section>
      <section class="panel"><h3>Angebote</h3><div class="formgitter">${f("root", "gueltigTage", "Gültigkeit in Tagen", "number")}${f("root", "mwst", "Umsatzsteuer %", "number")}</div></section>
      ${nummernPanel(e, f)}
      <section class="panel"><div class="panelkopf"><h3>Vertrieb</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="vtNeu">+ Person</button>`}</div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Name</th><th>Telefon</th><th>E-Mail</th><th></th></tr></thead><tbody>
        ${e.vertrieb.map((v, i) => `<tr>${["name", "tel", "mail"].map(k => `<td><input id="vt-${i}-${k}" class="flach" data-in="vtFeld" data-i="${i}" data-k="${k}" value="${esc(v[k])}" aria-label="${k}" ${dis()}></td>`).join("")}<td>${ro() ? "" : `<button type="button" class="ikon gefahr" data-act="vtWeg" data-i="${i}" title="Entfernen">✕</button>`}</td></tr>`).join("")}</tbody></table></div>
        <div class="feld" style="max-width:320px;margin-top:12px"><label for="e-ich">Ich bin (für neue Angebote)</label><select id="e-ich" data-act="ichBin"><option value="">–</option>${e.vertrieb.map(v => `<option value="${v.id}" ${v.id === ich ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div></section>
      <section class="panel"><h3>Code-Kennzeichen</h3><p class="klein gedimmt">Gilt überall: Katalogaufbau, Liste einfügen und Excel-Import.</p>
        <div class="formgitter">${[["ueber", "Überschrift (im Angebot)", "ZZ"], ["option", "Untergruppe", "YY"], ["grund", "Grundausstattung (fest enthalten)", "GA"]].map(([k, n, d]) => `<div class="feld"><label for="ck-${k}">${n}</label><input id="ck-${k}" class="mono kurz" data-chg="ckFeld" data-k="${k}" value="${esc((e.codeKennung || {})[k] ?? d)}" ${dis()}></div>`).join("")}</div></section>
      <section class="panel"><h3>Daten</h3><p class="klein">Artikelstamm: ${K.Store.artikelQuelle === "applus" ? `${K.zahl(K.Store.artikel.size)} Artikel aus APplus (ARTIKEL)` : K.Store.artikelQuelle === "excel" ? `${K.zahl(K.Store.artikel.size)} Artikel aus dem Excel-Import (Blatt „Import“), gespeichert in diesem Browser. Mit einer Abfrage <code>queries.artikel</code> kommt der Stamm direkt aus APplus.` : K.Store.artikelQuelle === "beispiel" ? `${K.Store.artikel.size} Beispielartikel. Für echte Daten die Abfrage <code>queries.artikel</code> einrichten.` : "nicht geladen"}.</p><p class="klein">${K.Store.modus === "db" ? `Daten liegen im gemeinsamen Speicher dieser Seite und sind für alle sichtbar, die die Seite öffnen dürfen.${K.Store.schreiben ? "" : " Sie haben nur Leserechte."}` : K.Store.modus === "lokal" ? `${K.Store.applusQuellen ? `Stammdaten kommen aus ${K.Store.applusQuellen} APplus-Abfrage(n). ` : "Es sind keine APplus-Abfragen eingerichtet, es gelten die Beispieldaten. "}Angebote, Kunden und Änderungen im Studio werden in diesem Browser gespeichert (nur auf diesem Rechner).` : "Demo-Modus: Änderungen gehen beim Neuladen verloren."}</p>
        ${K.Store.modus === "lokal" ? `<div class="row"><button class="btn klein" type="button" data-act="lokalReset">Gespeicherte Daten in diesem Browser löschen</button><button class="btn klein" type="button" data-act="lokalNeu">APplus-Daten neu laden</button></div>` : ""}
        <p class="klein gedimmt">Für den Betrieb in APplus wird die Datenschicht (store.js) gegen Ihre Queries und Tabellen getauscht. Die Struktur steht in daten/demo.json.</p></section>`;
  });
  /* Angebotsnummern: eigener Nummernkreis oder aus APplus */
  function nummernPanel(e, f) {
    const z = Object.assign({ quelle: "app", abfrage: (K.cfg.queries || {}).angebotsnummer || "", feld: "", art: "naechste", ersatz: false }, e.nummern || {}), ap = z.quelle === "applus";
    const inp = (k, t, ph, hint) => `<div class="feld"><label for="nr-${k}">${t}</label><input id="nr-${k}" class="mono" data-chg="nrFeld" data-k="${k}" value="${esc(z[k] || "")}" placeholder="${esc(ph || "")}" ${dis()}>${hint ? `<span class="klein gedimmt">${hint}</span>` : ""}</div>`;
    return `<section class="panel"><h3>Nummern aus dem ERP</h3>
      <div class="formgitter">
        <div class="feld"><label for="nr-quelle">Angebotsnummer kommt aus</label><select id="nr-quelle" data-act="nrQuelle" ${dis()}><option value="app" ${!ap ? "selected" : ""}>eigenem Nummernkreis dieser App</option><option value="applus" ${ap ? "selected" : ""}>APplus (Nummernkreis des ERP)</option></select></div>
        ${ap ? `${inp("abfrage", "Abfrage (Dashboard-Query)", "z. B. KONF_ANGEBOTSNR", "liefert eine Zeile mit der Nummer")}${inp("feld", "Feld mit der Nummer", "automatisch", "leer = Feld NR, NUMMER, ANGEBOT … oder das erste")}
          <div class="feld"><label for="nr-art">Die Abfrage liefert</label><select id="nr-art" data-act="nrArt" ${dis()}><option value="naechste" ${z.art !== "hoechste" ? "selected" : ""}>die nächste freie Nummer</option><option value="hoechste" ${z.art === "hoechste" ? "selected" : ""}>die zuletzt vergebene Nummer (+1)</option></select></div>
          <div class="feld"><label>&nbsp;</label><label class="haken"><input type="checkbox" data-act="nrErsatz" ${z.ersatz ? "checked" : ""} ${dis()}> Wenn APplus nicht antwortet: vorläufige Nummer aus der App</label></div>`
        : `${f("root", "praefix", "Präfix")}${f("root", "naechsteNr", "Nächste Nummer", "number")}`}
      </div>
      <div class="row"><button class="btn klein" type="button" data-act="nrTest">Nächste Nummer abrufen (Test)</button><span id="nr-test" class="klein gedimmt"></span></div>
      <p class="klein gedimmt">Kundennummern kommen aus der Kunden-Abfrage (<code>queries.kunden</code>, ${S().kunden?.length || 0} Kunden${(K.cfg.queries || {}).kunden ? ", aus APplus" : ", Beispieldaten"}), Bearbeiter aus <code>queries.vertrieb</code>${e.vertriebQuelle === "applus" ? " (aus APplus geladen)" : " (nicht eingerichtet, Liste unten)"}, Artikel- und Vertriebscodes aus ARTIKEL. ${ap && !z.abfrage && typeof K.cfg.angebotsnummer !== "function" ? `<b class="warntext">Bitte eine Abfrage eintragen.</b>` : ""} Mit <code>KONF_CONFIG.angebotsnummer</code> kann statt der Abfrage auch eine Funktion die Nummer im ERP reservieren (z. B. über einen Webdienst).</p></section>`;
  }
  const nrSetzen = async (k, v) => { const e = S().einst; e.nummern = Object.assign({}, e.nummern || {}, { [k]: v }); await K.Store.einstSpeichern(e, true); K.Store.log("Einstellungen", "Nummernvergabe geändert"); K.render(); };
  K.act.nrQuelle = el => nrSetzen("quelle", el.value);
  K.act.nrArt = el => nrSetzen("art", el.value);
  K.act.nrErsatz = el => nrSetzen("ersatz", el.checked);
  K.inp.nrFeld = el => nrSetzen(el.dataset.k, el.value.trim());
  K.act.nrTest = async () => { const t = K.el("nr-test"); t.textContent = "frage ab …"; try { const r = await K.Store.naechsteNr(); t.innerHTML = `Nächste Nummer: <b class="mono">${esc(r.nr)}</b> (${r.quelle === "applus" ? "aus APplus" : r.quelle === "ersatz" ? "Ersatz, APplus: " + esc(r.fehler) : "eigener Nummernkreis"}). Sie wird erst beim Anlegen vergeben.`; } catch (err) { t.innerHTML = `<span class="warntext">${esc(err.message)}</span>`; } };
  K.act.lokalReset = () => K.sheet(`<h3>Daten in diesem Browser löschen?</h3><p>Angebote, Kunden und Studio-Änderungen, die nur hier gespeichert sind, gehen verloren. Danach gelten wieder die APplus- bzw. Beispieldaten.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="lokalResetOk">Löschen</button></div>`);
  K.act.lokalResetOk = async () => { K.sheetZu(); K.Store.lokalZuruecksetzen(); await K.Store.ladeLokal(); K.toast("Lokale Daten gelöscht"); K.render(); };
  K.act.lokalNeu = async () => { await K.Store.ladeLokal(); K.render(); K.toast(K.Store.ladefehler.length ? `${K.Store.ladefehler.length} Abfrage(n) fehlgeschlagen, Details in der Konsole` : "Daten neu geladen"); };
  K.inp.eFeld = el => { const e = S().einst, ziel = el.dataset.o === "root" ? e : e[el.dataset.o]; ziel[el.dataset.k] = el.type === "number" ? +el.value : el.value; K.Store.einstSpeichern(e); };
  K.inp.vtFeld = el => { const e = S().einst; e.vertrieb[+el.dataset.i][el.dataset.k] = el.value; K.Store.einstSpeichern(e); };
  K.act.vtNeu = () => { const e = S().einst; e.vertrieb.push({ id: K.id("v"), name: "", tel: "", mail: "" }); K.Store.einstSpeichern(e, true); K.render(); };
  K.act.vtWeg = el => { const e = S().einst; e.vertrieb.splice(+el.dataset.i, 1); K.Store.einstSpeichern(e, true); K.render(); };
  K.act.ichBin = async el => { const p = S().prefs; p.vertrieb = el.value; K.Store.meinVertrieb = el.value; if (K.Store.modus === "db" && K.Store.uid) await K.Store.db.doc("data/users/" + K.Store.uid + "/prefs").set(K.clone(p)).catch(() => {}); K.toast("Gespeichert"); };

  /* =====================================================================
     Protokoll
     ===================================================================== */
  K.prot = { bereich: "" };
  K.route("studio-protokoll", () => {
    const alle = S().protokoll.flatMap(p => p.eintraege).sort((a, b) => b.ts - a.ts);
    const bereiche = [...new Set(alle.map(x => x.bereich))];
    const liste = alle.filter(x => !K.prot.bereich || x.bereich === K.prot.bereich).slice(0, 300);
    const namen = K.namenCache || {};
    const fehlend = [...new Set(alle.map(x => x.von).filter(id => id && !(id in namen)))];
    if (fehlend.length) K.Store.namen(fehlend).then(n => { K.namenCache = { ...(K.namenCache || {}), ...n }; for (const id of fehlend) if (!(id in K.namenCache)) K.namenCache[id] = ""; K.render(); });
    return kopf("Protokoll", "Wer hat wann was geändert. Die letzten drei Monate.") + `
      <div class="filterleiste"><div class="segment">${[["", "Alle"], ...bereiche.map(b => [b, b])].map(([id, n]) => `<button type="button" data-act="protBereich" data-b="${esc(id)}" aria-pressed="${K.prot.bereich === id}">${esc(n)}</button>`).join("")}</div></div>
      ${liste.length ? `<div class="tabwrap"><table><thead><tr><th>Zeit</th><th>Bereich</th><th>Änderung</th><th>Von</th></tr></thead><tbody>
      ${liste.map(x => `<tr><td class="nowrap gedimmt">${K.zeit(x.ts)}</td><td><span class="chip">${esc(x.bereich)}</span></td><td>${esc(x.text)}</td><td class="gedimmt">${x.von ? esc(namen[x.von] || "Jemand") : "System"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="leer">Noch keine Einträge.</div>`}`;
  });
  K.act.protBereich = el => { K.prot.bereich = el.dataset.b; K.render(); };
  K.act.zuModell = el => { K.st.knoten = el.dataset.k; K.st.modellTab = "merkmale"; K.gehe("studio-modell"); };
  K.studio = { kontext, regelListe, matrixAnsicht, tabellenAnsicht, graph, stlTabelle, chipWahl, geaendert, bildFeld, bildHochladen, artKlasse, artTitel, gruppenOptionen, keinEntwurf, kopf, ro, dis, merkmalOptionen, gleicherScope,
    knotenObjekt: (mo, k) => !k ? null : k.startsWith("g:") ? mo.gruppen.find(g => g.id === k.slice(2)) : k.startsWith("p:") ? E.produkt(mo, k.slice(2)) : null };
})();


/* ===== modell.js ===== */
/* =========================================================================
   Studio → Produktmodell
   Einstieg für die Pflege: links der Baum aus Familien, Unterfamilien und
   konfigurierbaren Artikeln (Artikelnummer aus ARTIKEL), rechts das gewählte
   Objekt mit Merkmalen, Regeln, Matrix, Kombinationstabellen, Graph,
   Stammdaten, Preisen/Stückliste und Test.
   Merkmale und Regeln werden an der Familie gepflegt und vererbt; am Artikel
   wird nur eingeschränkt, vorbelegt, ausgeblendet oder ergänzt.
   ========================================================================= */
(function () {
  const K = window.KONF, E = K.E, esc = K.esc, S = () => K.Store.S, ent = () => S().entwurf;
  const St = () => K.studio;
  K.st.knoten ||= ""; K.st.modellTab ||= "merkmale"; K.st.baumOffen ||= {}; K.st.baumSuche ||= "";

  const obj = (mo, k) => St().knotenObjekt(mo, k);
  const istFam = k => k && k.startsWith("g:");
  const famName = (mo, gid) => mo.gruppen.find(g => g.id === gid)?.name || gid;
  const quelleName = (mo, q) => !q ? "" : q.startsWith("g:") ? famName(mo, q.slice(2)) : (E.produkt(mo, q.slice(2))?.name || q);
  const ro = () => St().ro(), dis = () => St().dis();
  const geaendert = (t, z) => St().geaendert(t, z);

  /* ---------- Baum ---------- */
  /** Familien ohne Artikel (auch nicht in Unterfamilien) */
  const leereFamilien = mo => mo.gruppen.filter(g => !E.familienArtikel(mo, g.id).length);
  K.act.mLeerWeg = () => {
    const mo = ent(), leer = leereFamilien(mo); if (!leer.length) return;
    const ids = new Set(leer.map(g => g.id)), n = E.ausGeltungEntfernen(mo, [...ids], []);
    mo.gruppen = mo.gruppen.filter(g => !ids.has(g.id));
    if (K.st.knoten && ids.has(K.st.knoten.slice(2))) K.st.knoten = "";
    geaendert(`${leer.length} leere Familien entfernt${n ? `, ${n} Regeln gelöscht` : ""}`);
  };
  function baum(mo) {
    const q = K.st.baumSuche.toLowerCase();
    const passt = p => !q || (p.name + " " + (p.code || "")).toLowerCase().includes(q);
    const artZeile = (p, tiefe) => `<li><button type="button" class="mb-zeile artikel${K.st.knoten === "p:" + p.id ? " aktiv" : ""}" style="--tiefe:${tiefe}" data-act="mKnoten" data-k="p:${p.id}">
      <span class="mb-ikon">▢</span><span class="mb-name"><code class="${St().artKlasse(p.code).trim()}">${esc(p.code || p.id)}</code> ${esc(p.name)}</span>${p.aktiv === false ? `<span class="chip">inaktiv</span>` : ""}</button></li>`;
    const famZeile = (g, tiefe) => {
      const kinder = mo.gruppen.filter(x => x.eltern === g.id), arts = mo.produkte.filter(p => p.gruppe === g.id && passt(p));
      const alleArt = E.familienArtikel(mo, g.id).filter(passt);
      if (q && !alleArt.length && !g.name.toLowerCase().includes(q)) return "";
      const offen = q ? true : (K.st.baumOffen[g.id] ?? true), aktiv = K.st.knoten === "g:" + g.id;
      const nm = (g.merkmale || []).length;
      return `<li><div class="mb-famzeile" style="--tiefe:${tiefe}">
          <button type="button" class="mb-auf" data-act="mAuf" data-g="${g.id}" aria-expanded="${offen}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${kinder.length || arts.length ? (offen ? "▾" : "▸") : ""}</button>
          <button type="button" class="mb-zeile familie${aktiv ? " aktiv" : ""}" data-act="mKnoten" data-k="g:${g.id}"><span class="mb-ikon">▤</span><span class="mb-name">${esc(g.name)}</span><span class="gedimmt klein">${alleArt.length}${nm ? ` · ${nm} M` : ""}</span></button></div>
        ${offen ? `<ul>${kinder.map(k => famZeile(k, tiefe + 1)).join("")}${arts.map(p => artZeile(p, tiefe + 1)).join("")}</ul>` : ""}</li>`;
    };
    const ohne = mo.produkte.filter(p => !mo.gruppen.some(g => g.id === p.gruppe) && passt(p));
    return `<nav class="modellbaum panel" aria-label="Produktmodell">
      <input type="search" id="mb-suche" data-in="mbSuche" placeholder="Artikelnummer oder Name" value="${esc(K.st.baumSuche)}">
      ${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="mFamNeu">+ Familie</button><button class="btn klein primary" type="button" data-act="mArtNeu">+ Konfigurierbarer Artikel</button></div>`}
      ${ro() || !leereFamilien(mo).length ? "" : `<button type="button" class="btn klein mb-leer" data-act="mLeerWeg">${leereFamilien(mo).length} leere Familien entfernen</button>`}
      <ul class="mb-liste">${mo.gruppen.filter(g => !g.eltern || !mo.gruppen.some(x => x.id === g.eltern)).map(g => famZeile(g, 0)).join("")}
        ${ohne.length ? `<li><div class="mb-famzeile" style="--tiefe:0"><span class="mb-auf"></span><span class="mb-zeile familie gedimmt">Ohne Familie</span></div><ul>${ohne.map(p => artZeile(p, 1)).join("")}</ul></li>` : ""}</ul></nav>`;
  }
  K.act.mKnoten = el => { K.st.knoten = el.dataset.k; K.st.regelOffen = null; K.st.tabOffen = null; K.st.graphFokus = null; K.render(); };
  K.act.mAuf = el => { K.st.baumOffen[el.dataset.g] = !(K.st.baumOffen[el.dataset.g] ?? true); K.render(); };
  K.inp.mbSuche = el => { K.st.baumSuche = el.value; K.render(); };

  /* ---------- Seite ---------- */
  K.route("studio-modell", () => {
    const mo = ent(); if (!mo) return St().keinEntwurf();
    if (!obj(mo, K.st.knoten)) K.st.knoten = mo.gruppen[0] ? "g:" + mo.gruppen[0].id : mo.produkte[0] ? "p:" + mo.produkte[0].id : "";
    const k = K.st.knoten, o = obj(mo, k), fam = istFam(k);
    K.st.kontext = k; if (!fam && o) K.st.produkt = o.id;
    const kopf = St().kopf("Produktmodell", "Familie oder konfigurierbaren Artikel wählen. Merkmale und Regeln einer Familie gelten für alle Artikel darunter; am Artikel werden nur Abweichungen gepflegt.");
    if (!o) return kopf + `<div class="modell-layout">${baum(mo)}<div class="leer">Noch keine Familien oder Artikel. Legen Sie links eine Familie an.</div></div>`;
    const tabs = [["merkmale", "Merkmale"], ["regeln", "Regeln"], ["matrix", "Matrix"], ["kombinationen", "Kombinationstabellen"], ["graph", "Regelgraph"], ["stamm", "Stammdaten"], ["preise", fam ? "Preise" : "Preise & Stückliste"], ["test", "Test"]];
    if (!tabs.some(t => t[0] === K.st.modellTab)) K.st.modellTab = "merkmale";
    const t = K.st.modellTab;
    let inhalt = "";
    const kx = St().kontext(mo);
    if (t === "merkmale") inhalt = merkmaleTab(mo, k, o, fam);
    else if (t === "regeln") inhalt = (ro() ? "" : `<div class="row" style="margin-bottom:10px"><button class="btn primary klein" type="button" data-act="rNeu">Neue Regel für ${esc(o.name)}</button></div>`) + St().regelListe(mo, kx);
    else if (t === "matrix") inhalt = St().matrixAnsicht(mo, kx);
    else if (t === "kombinationen") inhalt = (ro() ? "" : `<div class="row" style="margin-bottom:10px"><button class="btn primary klein" type="button" data-act="tNeu">Neue Kombinationstabelle für ${esc(o.name)}</button></div>`) + St().tabellenAnsicht(mo, kx);
    else if (t === "graph") inhalt = St().graph(mo, kx);
    else if (t === "stamm") inhalt = fam ? famStamm(mo, o) : artStamm(mo, o);
    else if (t === "preise") inhalt = fam ? famPreise(mo, o) : artPreise(mo, o);
    else inhalt = testTab(mo, k, o, fam);
    return kopf + `<div class="modell-layout">${baum(mo)}<section class="modell-inhalt">${objektKopf(mo, k, o, fam)}
      <div class="tabs-innen" role="tablist">${tabs.map(([id, n]) => `<button type="button" role="tab" data-act="mTab" data-t="${id}" aria-selected="${t === id}">${n}</button>`).join("")}</div>
      ${inhalt}</section></div>`;
  });
  K.act.mTab = el => { K.st.modellTab = el.dataset.t; K.render(); };

  function objektKopf(mo, k, o, fam) {
    const pfad = fam ? E.gruppenPfad(mo, o.id).slice(0, -1) : E.gruppenPfad(mo, o.gruppe);
    const eff = fam ? E.zuordnung(mo, o) : E.zuordnung(mo, o), eigen = eff.filter(e => e.herkunft === k || (o.merkmale || []).some(z => z.id === e.id)).length + E.zuordnung(mo, o, true).filter(e => e.aus).length;
    const regeln = mo.regeln.filter(r => fam ? E.familienArtikel(mo, o.id).some(p => E.imGeltungsbereich(mo, r, p)) : E.imGeltungsbereich(mo, r, o));
    const hier = regeln.filter(r => St().gleicherScope(r, St().kontext(mo).scope)).length;
    const a = !fam && K.Store.artikelZu(o.code);
    return `<div class="objektkopf">
      <div class="ok-pfad">${pfad.map(g => `<button type="button" class="link-krume" data-act="mKnoten" data-k="g:${g.id}">${esc(g.name)}</button>`).join(" › ")}${pfad.length ? " ›" : ""}</div>
      ${ro() || !fam ? "" : `<button type="button" class="btn klein ok-excel" data-act="piFuerGruppe" data-g="${o.id}">Preise aus Excel</button>`}${ro() ? "" : `<button type="button" class="btn klein gefahr-text ok-loeschen" data-act="${fam ? "fWeg" : "pLoeschen"}">${fam ? "Familie löschen" : "Artikel löschen"}</button>`}
      <div class="ok-titel"><span class="chip ${fam ? "fam" : "art"}">${fam ? "Familie" : "Konfigurierbarer Artikel"}</span><h3>${esc(o.name)}</h3>${fam ? "" : `<code class="${St().artKlasse(o.code).trim()}" title="${esc(St().artTitel(o.code))}">${esc(o.code || "ohne Artikelnummer")}</code>${a ? `<span class="gedimmt klein">ARTIKEL: ${esc(a.name)}</span>` : K.Store.artikelQuelle && o.code ? `<span class="warntext klein">nicht in ARTIKEL</span>` : ""}`}</div>
      <div class="ok-werte">
        <div><b>${eff.length}</b><span>Merkmale wirksam</span></div><div><b>${eigen}</b><span>${fam ? "hier zugeordnet oder angepasst" : "am Artikel angepasst"}</span></div>
        <div><b>${regeln.length}</b><span>Regeln wirksam</span></div><div><b>${hier}</b><span>hier angelegt</span></div>
        ${fam ? `<div><b>${E.familienArtikel(mo, o.id).length}</b><span>Artikel darunter</span></div>` : `<div><b>${K.eur(o.basispreis)}</b><span>Grundpreis</span></div>`}
      </div></div>`;
  }

  /* ---------- Merkmale mit Vererbung ---------- */
  function elternZuordnung(mo, k, o, fam) {
    // was ohne die Einträge dieses Objekts wirksam wäre
    if (fam) { const p = mo.gruppen.find(g => g.id === o.eltern); return p ? E.zuordnung(mo, p) : []; }
    const g = mo.gruppen.find(x => x.id === o.gruppe); return g ? E.zuordnung(mo, g) : [];
  }
  function merkmaleTab(mo, k, o, fam) {
    const alle = E.zuordnung(mo, o, true), eltern = new Map(elternZuordnung(mo, k, o, fam).map(e => [e.id, e])), eigen = new Map((o.merkmale || []).map(z => [z.id, z]));
    const wirksam = alle.filter(e => !e.aus), aus = alle.filter(e => e.aus);
    const karte = (e, i) => {
      const m = E.merkmal(mo, e.id); if (!m) return "";
      const geerbt = e.herkunft !== k, angepasst = geerbt && eigen.has(e.id), el = eltern.get(e.id);
      const erlaubt = e.werte || m.werte.map(w => w.id), oben = el ? (el.werte || m.werte.map(w => w.id)) : m.werte.map(w => w.id);
      const chips = m.werte.map(w => {
        const an = erlaubt.includes(w.id), gesperrtOben = geerbt && !oben.includes(w.id);
        return `<button type="button" class="wchip${an ? " an" : ""}${gesperrtOben ? " oben" : ""}" data-act="mWert" data-m="${m.id}" data-w="${w.id}" aria-pressed="${an}" ${gesperrtOben || ro() ? "disabled" : ""} title="${esc(gesperrtOben ? "In der übergeordneten Familie nicht erlaubt" : w.code ? "Code " + w.code : "")}">${esc(w.name)}${w.code ? ` <code>${esc(w.code)}</code>` : ""}</button>`;
      }).join("");
      const std = m.typ !== "mehrfach" && !m.pflicht ? `<label class="inline klein">Vorbelegung <select id="mstd-${m.id}" data-act="mStd" data-m="${m.id}" ${dis()}>
          <option value="">${geerbt && el?.standard ? "wie geerbt: " + esc(E.wert(mo, m.id, el.standard)?.name || el.standard) : "erster erlaubter Wert"}</option>
          ${m.werte.filter(w => erlaubt.includes(w.id)).map(w => `<option value="${w.id}" ${eigen.get(m.id)?.standard === w.id || (!geerbt && e.standard === w.id) ? "selected" : ""}>${esc(w.name)}</option>`).join("")}</select></label>` : m.pflicht ? `<span class="klein gedimmt">Pflichtangabe, keine Vorbelegung</span>` : "";
      return `<article class="mkarte${geerbt ? " geerbt" : " eigen"}${angepasst ? " angepasst" : ""}">
        <div class="mk-kopf"><span class="mk-griff">
          <button type="button" class="ikon" data-act="mHoch" data-m="${m.id}" ${i && !ro() ? "" : "disabled"} title="Nach oben">↑</button><button type="button" class="ikon" data-act="mRunter" data-m="${m.id}" ${i < wirksam.length - 1 && !ro() ? "" : "disabled"} title="Nach unten">↓</button></span>
          <b>${esc(m.name)}</b><span class="gedimmt klein">${esc(E.bereich(m))}${m.abschnitt ? " · " + esc(m.abschnitt) : ""} · ${m.typ === "mehrfach" ? "mehrfach" : "einfach"}</span>
          ${geerbt ? `<button type="button" class="chip herkunft" data-act="mKnoten" data-k="${e.herkunft}" title="Dort bearbeiten">geerbt von ${esc(quelleName(mo, e.herkunft))}</button>` : `<span class="chip eigen">${fam ? "an dieser Familie" : "nur dieser Artikel"}</span>`}
          ${angepasst ? `<span class="chip angepasst">hier angepasst</span>` : ""}
          <span class="mk-aktionen">${ro() ? "" : geerbt
            ? `${angepasst ? `<button class="btn klein" type="button" data-act="mReset" data-m="${m.id}">Anpassung zurücksetzen</button>` : ""}<button class="btn klein" type="button" data-act="mAus" data-m="${m.id}">Hier ausblenden</button>`
            : `${!fam || o.eltern ? `<button class="btn klein" type="button" data-act="mHoch1" data-m="${m.id}" title="An die übergeordnete Familie übergeben">↑ an ${esc(famName(mo, fam ? o.eltern : o.gruppe))}</button>` : ""}<button class="btn klein gefahr-text" type="button" data-act="mWeg" data-m="${m.id}" title="Nur hier entfernen; das Merkmal bleibt im Modell">Entfernen</button><button class="btn klein gefahr-text" type="button" data-act="mGanz" data-m="${m.id}" title="Merkmal mit allen Werten aus dem ganzen Modell löschen">Überall löschen</button>`}</span></div>
        <div class="mk-werte">${chips}</div>
        <div class="row klein gedimmt"><span>${erlaubt.length} von ${m.werte.length} Werten</span>${std}</div></article>`;
    };
    const frei = mo.merkmale.filter(m => !alle.some(e => e.id === m.id));
    const arts = fam ? E.familienArtikel(mo, o.id) : [];
    let gemeinsam = 0;
    if (fam && arts.length) { const eff = arts.map(p => E.zuordnung(mo, p).map(e => e.id)); gemeinsam = eff[0].filter(id => eff.every(l => l.includes(id)) && !(o.merkmale || []).some(z => z.id === id) && !E.zuordnung(mo, o).some(e => e.id === id && e.herkunft !== "g:" + o.id)).length; }
    return `<div class="mk-leiste">
      <span class="klein gedimmt">${fam ? `Merkmale dieser Familie gelten für alle ${arts.length} Artikel darunter. Werte abwählen schränkt für die ganze Familie ein.` : "Geerbte Merkmale: Werte abwählen schränkt nur diesen Artikel ein. Eigene Merkmale gelten nur hier."}</span>
      ${ro() ? "" : `<span class="row">${frei.length ? `<select id="m-neu-zu" data-act="mZu" aria-label="Merkmal zuordnen"><option value="">+ Merkmal zuordnen</option>${frei.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select>` : ""}
        <button class="btn klein" type="button" data-act="mNeuHier">+ Neues Merkmal</button>
        ${gemeinsam ? `<button class="btn klein gelb" type="button" data-act="mZusammen" title="Merkmale, die alle Artikel dieser Familie haben, an die Familie übergeben">${gemeinsam} gemeinsame Merkmale der Artikel übernehmen</button>` : ""}</span>`}</div>
      <div class="mkarten">${wirksam.map(karte).join("") || `<div class="leer">Noch keine Merkmale. Ordnen Sie oben ein Merkmal zu${fam ? "" : " oder pflegen Sie es an der Familie"}.</div>`}</div>
      ${aus.length ? `<h3 class="abschnitt" style="margin-top:18px">Hier ausgeblendet</h3><div class="mkarten">${aus.map(e => `<article class="mkarte aus"><div class="mk-kopf"><b>${esc(E.merkmal(mo, e.id)?.name || e.id)}</b><span class="chip herkunft">geerbt von ${esc(quelleName(mo, e.herkunft))}</span>${ro() ? "" : `<span class="mk-aktionen"><button class="btn klein" type="button" data-act="mEin" data-m="${e.id}">Wieder aufnehmen</button></span>`}</div></article>`).join("")}</div>` : ""}`;
  }
  const knoten = () => obj(ent(), K.st.knoten);
  const eintrag = (o, mid, anlegen) => { o.merkmale ||= []; let z = o.merkmale.find(x => x.id === mid); if (!z && anlegen) { z = { id: mid, werte: null }; o.merkmale.push(z); } return z; };
  function aufraeumen(o, mid) {
    // Eintrag entfernen, wenn er nichts mehr überschreibt und das Merkmal nicht hier definiert ist
    const mo = ent(), z = eintrag(o, mid); if (!z) return;
    const eltern = new Map(elternZuordnung(mo, K.st.knoten, o, istFam(K.st.knoten)).map(e => [e.id, e]));
    const el = eltern.get(mid); if (!el) return;
    const m = E.merkmal(mo, mid), alle = m.werte.map(w => w.id), ew = (el.werte || alle).join(","), zw = (z.werte || alle).join(",");
    if (!z.aus && ew === zw && !z.standard) o.merkmale = o.merkmale.filter(x => x !== z);
    else if (z.werte && zw === ew) z.werte = null;
  }
  K.act.mWert = el => {
    const mo = ent(), o = knoten(), m = E.merkmal(mo, el.dataset.m), w = el.dataset.w;
    const e = E.zuordnung(mo, o).find(x => x.id === m.id), aktuell = e.werte || m.werte.map(x => x.id);
    let neu = aktuell.includes(w) ? aktuell.filter(x => x !== w) : m.werte.map(x => x.id).filter(x => aktuell.includes(x) || x === w);
    if (!neu.length) return K.toast("Mindestens ein Wert muss erlaubt bleiben.");
    const z = eintrag(o, m.id, true); z.werte = neu.length === m.werte.length ? null : neu;
    if (z.standard && !neu.includes(z.standard)) delete z.standard;
    aufraeumen(o, m.id); geaendert(`${o.name}: erlaubte Werte für ${m.name} geändert`);
  };
  K.act.mStd = el => { const o = knoten(), z = eintrag(o, el.dataset.m, true); if (el.value) z.standard = el.value; else delete z.standard; aufraeumen(o, el.dataset.m); geaendert(`${o.name}: Vorbelegung für ${E.merkmal(ent(), el.dataset.m).name} geändert`); };
  K.act.mReset = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); geaendert(`${o.name}: Anpassung an ${E.merkmal(ent(), el.dataset.m).name} zurückgesetzt`); };
  K.act.mAus = el => { const o = knoten(), z = eintrag(o, el.dataset.m, true); z.aus = true; delete z.werte; delete z.standard; geaendert(`${o.name}: ${E.merkmal(ent(), el.dataset.m).name} ausgeblendet`); };
  K.act.mEin = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); geaendert(`${o.name}: ${E.merkmal(ent(), el.dataset.m).name} wieder aufgenommen`); };
  K.act.mWeg = el => {
    const mo = ent(), o = knoten(), n = istFam(K.st.knoten) ? E.familienArtikel(mo, o.id).length : 0;
    if (n && !el.dataset.ok) return K.sheet(`<h3>${esc(E.merkmal(mo, el.dataset.m).name)} aus ${esc(o.name)} entfernen?</h3><p>Das Merkmal verschwindet bei ${n} Artikeln dieser Familie aus dem Konfigurator. Anpassungen an den Artikeln bleiben gespeichert, wirken aber nicht mehr.</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn gefahr" type="button" data-act="mWeg" data-m="${el.dataset.m}" data-ok="1">Entfernen</button></div>`);
    K.sheetZu(); mWegAusfuehren(el); };
  const mWegAusfuehren = el => { const o = knoten(); o.merkmale = (o.merkmale || []).filter(z => z.id !== el.dataset.m); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(x => x !== el.dataset.m); geaendert(`${E.merkmal(ent(), el.dataset.m).name} aus ${o.name} entfernt`); };
  K.act.mZu = el => { if (!el.value) return; const o = knoten(); (o.merkmale ||= []).push({ id: el.value, werte: null }); geaendert(`${E.merkmal(ent(), el.value).name} zu ${o.name} zugeordnet`); };
  K.act.mGanz = el => { K.st.merkmal = el.dataset.m; K.act.mLoeschen(); };
  K.act.mNeuHier = () => { K.st.mNeuZiel = K.st.knoten; K.act.mNeu(); };
  K.act.mHoch1 = el => {
    const mo = ent(), o = knoten(), mid = el.dataset.m, fam = istFam(K.st.knoten), ziel = mo.gruppen.find(g => g.id === (fam ? o.eltern : o.gruppe)); if (!ziel) return;
    const z = eintrag(o, mid); o.merkmale = o.merkmale.filter(x => x !== z);
    (ziel.merkmale ||= []).push({ id: mid, werte: z.werte || null, ...(z.standard ? { standard: z.standard } : {}) });
    geaendert(`${E.merkmal(mo, mid).name} an ${ziel.name} übergeben`);
  };
  function verschieben(mid, d) {
    const mo = ent(), o = knoten(), liste = E.zuordnung(mo, o).map(e => e.id), i = liste.indexOf(mid), j = i + d;
    if (i < 0 || j < 0 || j >= liste.length) return;
    [liste[i], liste[j]] = [liste[j], liste[i]]; o.reihenfolge = liste; geaendert(`${o.name}: Reihenfolge der Merkmale geändert`);
  }
  K.act.mHoch = el => verschieben(el.dataset.m, -1);
  K.act.mRunter = el => verschieben(el.dataset.m, 1);
  K.act.mZusammen = () => { const o = knoten(), n = E.hochziehen(ent(), o.id); geaendert(`${n} gemeinsame Merkmale an ${o.name} übergeben`); K.toast(`${n} Merkmale an ${o.name} übergeben; Abweichungen bleiben an den Artikeln.`); };

  /* ---------- Stammdaten ---------- */
  function famStamm(mo, g) {
    const ag = g.artikelgruppe ? [...K.Store.artikel.values()].filter(a => a.gruppe && a.gruppe.toUpperCase() === g.artikelgruppe.toUpperCase()) : [];
    const neu = ag.filter(a => !mo.produkte.some(p => (p.code || "").toUpperCase() === a.code.toUpperCase()));
    return `<section class="panel"><div class="formgitter">
      <div class="feld breit"><label for="f-name">Bezeichnung</label><input id="f-name" data-in="fFeld" data-k="name" value="${esc(g.name)}" ${dis()}></div>
      <div class="feld"><label>Familien-Code</label><div class="wert mono">${esc(g.id)}</div></div>
      <div class="feld"><label for="f-eltern">Übergeordnete Familie</label><select id="f-eltern" data-act="fEltern" ${dis()}><option value="">– oberste Ebene –</option>${mo.gruppen.filter(x => x.id !== g.id && !E.gruppenPfad(mo, x.id).some(y => y.id === g.id)).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
      <div class="feld"><label for="f-ag">Artikelgruppe in APplus</label><input id="f-ag" class="mono" data-in="fFeld" data-k="artikelgruppe" value="${esc(g.artikelgruppe || "")}" placeholder="z. B. FZ-TB" ${dis()}></div>
      <div class="feld breit"><label for="f-beschr">Beschreibung</label><textarea id="f-beschr" rows="2" data-in="fFeld" data-k="beschreibung" ${dis()}>${esc(g.beschreibung || "")}</textarea></div>
      <div class="feld"><label>Bild im Katalog</label>${St().bildFeld(g.bild, "fBild", "")}</div></div>
      <p class="klein gedimmt">Mit hinterlegter Artikelgruppe werden neue konfigurierbare Artikel dieser Gruppe automatisch dieser Familie zugeordnet.</p>
      ${g.artikelgruppe ? `<div class="hinweis">${ag.length} Artikel in der Artikelgruppe <code>${esc(g.artikelgruppe)}</code>, davon ${neu.length} noch nicht konfigurierbar.${neu.length && !ro() ? ` <button class="btn klein" type="button" data-act="fAgAlle">Alle ${neu.length} als konfigurierbare Artikel anlegen</button>` : ""}</div>` : ""}
      ${ro() ? "" : `<div class="row"><button class="btn klein" type="button" data-act="mFamNeu" data-eltern="${g.id}">+ Unterfamilie</button><button class="btn klein" type="button" data-act="mArtNeu">+ Artikel in dieser Familie</button><button class="btn klein gefahr-text" type="button" data-act="fWeg">Familie löschen</button></div>`}</section>`;
  }
  const fam = () => knoten();
  K.inp.fFeld = el => { fam()[el.dataset.k] = el.value; geaendert(`Familie ${fam().name} geändert`, false); };
  K.act.fEltern = el => { fam().eltern = el.value || null; geaendert(`Familie ${fam().name} verschoben`); };
  K.act.fBild = async el => { const id = await St().bildHochladen(el); if (id === undefined) return; fam().bild = id; geaendert(`Bild der Familie ${fam().name} geändert`); };
  K.act.fWeg = () => {
    const mo = ent(), g = fam(), unter = mo.gruppen.filter(x => x.id !== g.id && E.gruppenPfad(mo, x.id).some(y => y.id === g.id)), arts = E.familienArtikel(mo, g.id);
    const regelnNur = mo.regeln.filter(r => (r.gruppen || []).includes(g.id)).length, eltern = mo.gruppen.find(x => x.id === g.eltern);
    const leer = !unter.length && !arts.length;
    K.sheet(`<h3>Familie „${esc(g.name)}“ löschen?</h3>
      ${leer ? `<p>Die Familie ist leer. ${(g.merkmale || []).length} Merkmalzuordnungen und ${regelnNur} Regeln für diese Familie werden mit gelöscht.</p>`
        : `<p>Sie enthält ${unter.length} Unterfamilien und ${arts.length} Artikel. Wie soll damit verfahren werden?</p>
        <div class="loesch-wahl">
          <button type="button" class="loesch-opt" data-act="fWegOk" data-art="hoch"><b>Inhalt nach ${esc(eltern ? eltern.name : "oben")} verschieben</b><span>Unterfamilien und Artikel bleiben erhalten. Merkmale und Regeln dieser Familie werden an sie weitergegeben, im Konfigurator ändert sich nichts.</span></button>
          <button type="button" class="loesch-opt gefahr" data-act="fWegOk" data-art="alles"><b>Familie mit allem darunter löschen</b><span>${unter.length} Unterfamilien und ${arts.length} konfigurierbare Artikel werden aus dem Modell entfernt (nicht aus APplus), dazu Regeln, die nur für sie gelten.</span></button>
        </div>`}
      <p class="klein gedimmt">Alles passiert im Entwurf. Bis zur Freigabe lässt es sich unter Freigabe → „Entwurf verwerfen“ rückgängig machen.</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button>${leer ? `<button class="btn gefahr" type="button" data-act="fWegOk" data-art="leer">Löschen</button>` : ""}</div>`);
  };
  K.act.fWegOk = el => {
    const mo = ent(), g = fam(), art = el.dataset.art;
    if (art === "hoch") {
      // Merkmale und Regeln an die direkten Kinder weitergeben, damit sich nichts ändert
      const kinderF = mo.gruppen.filter(x => x.eltern === g.id), kinderP = mo.produkte.filter(p => p.gruppe === g.id);
      for (const k of [...kinderF, ...kinderP]) {
        const eigen = k.merkmale || [], vorne = (g.merkmale || []).filter(z => !eigen.some(e => e.id === z.id)).map(z => ({ ...z }));
        k.merkmale = [...vorne, ...eigen];
        if (g.reihenfolge && !k.reihenfolge) k.reihenfolge = g.reihenfolge.slice();
      }
      for (const r of mo.regeln) if ((r.gruppen || []).includes(g.id)) { r.gruppen = [...r.gruppen.filter(x => x !== g.id), ...kinderF.map(x => x.id)]; r.produkte = [...new Set([...(r.produkte || []), ...kinderP.map(p => p.id)])]; }
      kinderF.forEach(x => x.eltern = g.eltern || null); kinderP.forEach(p => p.gruppe = g.eltern || null);
      mo.gruppen = mo.gruppen.filter(x => x !== g); E.ausGeltungEntfernen(mo, [g.id], []);
      K.sheetZu(); K.st.knoten = g.eltern ? "g:" + g.eltern : ""; geaendert(`Familie ${g.name} gelöscht, Inhalt nach ${g.eltern ? famName(mo, g.eltern) : "oben"} verschoben`);
    } else {
      const fams = mo.gruppen.filter(x => x.id === g.id || E.gruppenPfad(mo, x.id).some(y => y.id === g.id)).map(x => x.id), arts = E.familienArtikel(mo, g.id).map(p => p.id);
      mo.gruppen = mo.gruppen.filter(x => !fams.includes(x.id)); mo.produkte = mo.produkte.filter(p => !arts.includes(p.id));
      const n = E.ausGeltungEntfernen(mo, fams, arts);
      K.sheetZu(); K.st.knoten = g.eltern ? "g:" + g.eltern : ""; geaendert(`Familie ${g.name} gelöscht (${fams.length - 1} Unterfamilien, ${arts.length} Artikel, ${n} Regeln)`);
    }
  };
  K.act.fAgAlle = () => {
    const mo = ent(), g = fam(), ag = g.artikelgruppe.toUpperCase();
    const neu = [...K.Store.artikel.values()].filter(a => a.gruppe && a.gruppe.toUpperCase() === ag && !mo.produkte.some(p => (p.code || "").toUpperCase() === a.code.toUpperCase()));
    for (const a of neu) mo.produkte.push(neuerArtikel(mo, a.code, a.name, g.id, a));
    geaendert(`${neu.length} Artikel aus Artikelgruppe ${g.artikelgruppe} in ${g.name} angelegt`); K.toast(`${neu.length} Artikel angelegt; sie erben alle Merkmale und Regeln von ${g.name}.`);
  };

  function artStamm(mo, p) {
    return `<section class="panel"><div class="formgitter">
      <div class="feld"><label for="p-code">Artikelnummer (ARTIKEL)</label><input id="p-code" class="mono${St().artKlasse(p.code)}" data-in="pFeld" data-k="code" data-art="produkt" data-chg="artPruef" autocomplete="off" title="${esc(St().artTitel(p.code))}" value="${esc(p.code || "")}" ${dis()}></div>
      <div class="feld breit"><label for="p-name">Bezeichnung</label><input id="p-name" data-in="pFeld" data-k="name" value="${esc(p.name)}" ${dis()}></div>
      <div class="feld"><label for="p-gruppe">Familie</label><select id="p-gruppe" data-act="pGruppe" ${dis()}>${St().gruppenOptionen(mo, p.gruppe)}<option value="__neu">+ Neue Familie …</option></select></div>
      <div class="feld breit"><label for="p-beschr">Beschreibung für Katalog und Verkaufsraum</label><textarea id="p-beschr" rows="2" data-in="pFeld" data-k="beschreibung" ${dis()}>${esc(p.beschreibung || "")}</textarea></div>
      <div class="feld"><label>Katalogbild</label>${St().bildFeld(p.bild, "pBild", "")}</div>
      <div class="feld"><label class="haken"><input id="p-aktiv" type="checkbox" data-act="pAktiv" ${p.aktiv !== false ? "checked" : ""} ${dis()}> Im Katalog sichtbar</label></div></div>
      <div class="row"><button class="btn klein" type="button" data-act="mDetails" data-p="${p.id}">3D-Modell und weitere Details</button>${ro() ? "" : `<button class="btn klein" type="button" data-act="pKopie">Duplizieren</button><button class="btn klein gefahr-text" type="button" data-act="pLoeschen">Artikel aus dem Modell löschen</button>`}</div></section>`;
  }
  K.act.mDetails = el => { K.st.produkt = el.dataset.p; K.gehe("studio-produkte"); };

  /** Preise einer Produktgruppe: Codes aller Fahrzeuge darunter mit Gruppenpreis */
  function famPreise(mo, g) {
    const ig = K.preisImport.inGruppe(mo, g.id), zeilen = [...ig.werte.values()].sort((a, b) => mo.merkmale.indexOf(a.m) - mo.merkmale.indexOf(b.m) || a.m.werte.indexOf(a.w) - b.m.werte.indexOf(b.w));
    const eigen = g.preise || {}, eltern = w => E.gruppenPreis(E.gruppenPfad(mo, g.id).slice(0, -1), w);
    let letztes = null;
    return `<section class="panel"><div class="panelkopf"><h3>Preise in ${esc(g.name)}</h3>${ro() ? "" : `<button class="btn klein primary" type="button" data-act="piFuerGruppe" data-g="${g.id}">Preise aus Excel übernehmen</button>`}</div>
      <p class="klein gedimmt">Ein Preis, der hier eingetragen ist, gilt für alle Fahrzeuge dieser Gruppe. Leer = Preis am Code (${ig.werte.size} Codes).</p>
      ${zeilen.length ? `<div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Merkmal</th><th>Code</th><th>Bezeichnung</th><th class="r">Preis am Code</th><th class="r">Preis in ${esc(g.name)}</th><th></th></tr></thead><tbody>
      ${zeilen.map(({ m, w }) => { const C = String(w.code).toUpperCase(), el = eltern(w), kopfM = letztes !== m; letztes = m;
        return `<tr><td class="gedimmt">${kopfM ? esc(m.name) : ""}</td><td class="mono">${esc(w.code)}</td><td>${esc(w.name)}</td><td class="r num gedimmt">${K.eur(el ? el.preis : w.preis)}${el ? ` <span class="klein" title="aus ${esc(el.von.name)}">↑</span>` : ""}</td>
          <td class="r"><input id="gp-${esc(C)}" class="flach zahl${eigen[C] != null ? " gesetzt" : ""}" type="number" step="10" data-chg="gpPreis" data-c="${esc(C)}" value="${eigen[C] ?? ""}" placeholder="${el ? el.preis : w.preis || 0}" aria-label="Preis in ${esc(g.name)}" ${dis()}></td>
          <td>${eigen[C] != null && !ro() ? `<button type="button" class="ikon" data-act="gpWeg" data-c="${esc(C)}" title="Gruppenpreis entfernen">✕</button>` : ""}</td></tr>`; }).join("")}</tbody></table></div>` : `<div class="leer">Den Fahrzeugen dieser Gruppe sind noch keine Codes zugeordnet.</div>`}</section>`;
  }
  K.inp.gpPreis = el => { const g = knoten(), C = el.dataset.c; g.preise ||= {}; if (el.value === "") delete g.preise[C]; else g.preise[C] = +el.value; geaendert(`Preis ${C} in ${g.name}`); };
  K.act.gpWeg = el => { const g = knoten(); delete g.preise[el.dataset.c]; geaendert(`Gruppenpreis ${el.dataset.c} in ${g.name} entfernt`); };
  function artPreise(mo, p) {
    const a = K.Store.artikelZu(p.code), pm = E.produktMerkmale(mo, p);
    return `<section class="panel"><div class="formgitter">
      <div class="feld"><label for="p-preis">Grundpreis netto</label><input id="p-preis" type="number" step="100" data-in="pZahl" data-k="basispreis" value="${p.basispreis}" ${dis()}></div>
      <div class="feld"><label for="p-kosten">Herstellkosten</label><input id="p-kosten" type="number" step="100" data-in="pZahl" data-k="basiskosten" value="${p.basiskosten}" ${dis()}></div>
      ${a ? `<div class="feld"><label>Im Artikelstamm</label><div class="wert">${K.eur(a.preis)}${a.kosten ? ` · Kosten ${K.eur(a.kosten)}` : ""}${(a.preis && a.preis !== p.basispreis) && !ro() ? ` <button class="btn klein" type="button" data-act="mPreisAusArtikel">übernehmen</button>` : ""}</div></div>` : ""}</div></section>
      ${(p.grundausstattung || []).length ? `<section class="panel"><div class="panelkopf"><h3>Grundausstattung (inklusive)</h3><span class="klein gedimmt">${p.grundausstattung.length} Positionen · aus dem Excel-Import, im Grundpreis enthalten</span></div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Gruppe</th><th>Code</th><th>Bezeichnung</th><th class="r">Wert</th>${ro() ? "" : "<th></th>"}</tr></thead><tbody>
        ${p.grundausstattung.map((x, i) => `<tr><td class="gedimmt">${esc(x.gruppe || "")}</td><td class="mono">${esc(x.code)}</td><td>${esc(x.name)}</td><td class="r num">${x.preis ? K.eur(x.preis) : "inkl."}</td>${ro() ? "" : `<td><button type="button" class="ikon gefahr" data-act="mGaWeg" data-i="${i}" title="Entfernen">✕</button></td>`}</tr>`).join("")}
        <tr class="summe"><td colspan="3">Summe der Grundausstattung</td><td class="r num">${K.eur(p.grundausstattung.reduce((n, x) => n + (x.preis || 0), 0))}</td>${ro() ? "" : "<td></td>"}</tr></tbody></table></div></section>` : ""}
      <section class="panel"><div class="panelkopf"><h3>Aufpreise der wirksamen Merkmalswerte</h3><span class="klein gedimmt">Preise werden je Wert am Merkmal gepflegt</span></div>
        <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Merkmal</th><th>Code</th><th>Wert</th><th class="r">Preis</th><th class="r">Kosten</th></tr></thead><tbody>
        ${pm.flatMap(x => x.werte.map((w, i) => `<tr><td class="gedimmt">${i ? "" : esc(x.m.name)}</td><td class="mono">${esc(w.code || "")}</td><td>${esc(w.name)}</td><td class="r num">${K.eur(E.wertPreis(mo, p, w))}${E.wertPreis(mo, p, w) !== (w.preis || 0) ? ` <span class="gedimmt klein" title="Preis der Produktgruppe, am Wert ${K.eur(w.preis)}">Gruppe</span>` : ""}${x.m.multiplikator ? " ×" : ""}</td><td class="r num gedimmt">${K.eur(w.kosten)}</td></tr>`)).join("")}</tbody></table></div></section>
      <section class="panel"><div class="panelkopf"><h3>Grundstückliste</h3>${ro() ? "" : `<button class="btn klein" type="button" data-act="pStlNeu">+ Zeile</button>`}</div>${St().stlTabelle(p.stl, "pStl")}
        <p class="klein gedimmt">Die Stückliste der Merkmalswerte kommt bei der Konfiguration automatisch dazu.</p></section>`;
  }
  K.act.mGaWeg = el => { const p = knoten(), x = p.grundausstattung.splice(+el.dataset.i, 1)[0]; geaendert(`${x.code} aus der Grundausstattung von ${p.name} entfernt`); };
  K.act.mPreisAusArtikel = () => { const p = knoten(), a = K.Store.artikelZu(p.code); p.basispreis = a.preis; if (a.kosten) p.basiskosten = a.kosten; geaendert(`Grundpreis von ${p.name} aus ARTIKEL übernommen`); };

  /* ---------- Test ---------- */
  function testTab(mo, k, o, fam) {
    const arts = fam ? E.familienArtikel(mo, o.id) : [o];
    const zeilen = arts.slice(0, 40).map(p => ({ p, t: E.modelltest(mo, p, 60000) }));
    return `<section class="panel"><div class="tabwrap ohne-rand"><table><thead><tr><th>Artikel</th><th class="r">Kombinationen</th><th class="r">gültig</th><th>Befund</th><th></th></tr></thead><tbody>
      ${zeilen.map(({ p, t }) => `<tr><td><code>${esc(p.code || p.id)}</code> ${esc(p.name)}</td><td class="r num">${K.zahl(t.total)}${t.abgebrochen ? "+" : ""}</td><td class="r num">${K.zahl(t.gueltig)}</td>
        <td>${t.widersprueche ? `<span class="chip warn">${K.zahl(t.widersprueche)} Widersprüche</span> ` : ""}${t.tote.length ? `<span class="chip warn" title="${esc(t.tote.map(x => x.merkmal + ": " + x.wert).join(", "))}">${t.tote.length} nie wählbar</span> ` : ""}${t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).length ? `<span class="chip" title="${esc(t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).map(r => r.id).join(", "))}">${t.regeln.filter(r => !r.treffer && !r.nurMitZubehoer).length} Regeln greifen nie</span>` : ""}${!t.widersprueche && !t.tote.length ? `<span class="chip st-angenommen">ok</span>` : ""}</td>
        <td class="r"><button class="btn klein" type="button" data-act="stTesten" data-p="${p.id}">Im Konfigurator testen</button></td></tr>`).join("") || `<tr><td colspan="5" class="gedimmt">Keine Artikel.</td></tr>`}</tbody></table></div>
      ${zeilen.flatMap(z => z.t.tote.map(x => ({ p: z.p, ...x }))).slice(0, 12).map(x => `<div class="hinweis warn klein">${esc(x.p.name)}: <b>${esc(x.merkmal)} „${esc(x.wert)}“</b> ist durch Regeln nie wählbar.</div>`).join("")}</section>`;
  }

  /* ---------- Anlegen: Familie, Artikel ---------- */
  K.act.mFamNeu = el => {
    const mo = ent(), aktuell = istFam(K.st.knoten) ? K.st.knoten.slice(2) : (knoten()?.gruppe || "");
    const eltern = el.dataset.eltern ?? aktuell;
    K.sheet(`<h3>Neue Familie</h3>
      <div class="feld"><label for="nf-name">Bezeichnung</label><input id="nf-name" placeholder="z. B. Tiefbett-Sattelauflieger"></div>
      <div class="feld"><label for="nf-eltern">Übergeordnete Familie</label><select id="nf-eltern"><option value="">– oberste Ebene –</option>${mo.gruppen.map(g => `<option value="${g.id}" ${g.id === eltern ? "selected" : ""}>${"  ".repeat(E.gruppenPfad(mo, g.id).length - 1)}${esc(g.name)}</option>`).join("")}</select></div>
      <div class="feld"><label for="nf-ag">Artikelgruppe in APplus (optional)</label><input id="nf-ag" class="mono"></div>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mFamNeuOk">Anlegen</button></div>`);
  };
  K.act.mFamNeuOk = () => {
    const mo = ent(), n = K.el("nf-name").value.trim(); if (!n) return K.el("nf-name").focus();
    let id = E.slug(n); while (mo.gruppen.some(g => g.id === id)) id += "-2";
    mo.gruppen.push({ id, name: n, eltern: K.el("nf-eltern").value || null, artikelgruppe: K.el("nf-ag").value.trim() || undefined, merkmale: [] });
    K.sheetZu(); K.st.knoten = "g:" + id; K.st.modellTab = "merkmale"; geaendert(`Familie ${n} angelegt`);
  };
  function neuerArtikel(mo, code, name, gruppe, a) {
    let id = String(code).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "P"; while (mo.produkte.some(p => p.id === id)) id += "_";
    const t = (name + " " + famName(mo, gruppe)).toLowerCase();
    return { id, code, name: name || code, gruppe, artnr: code, basispreis: a?.preis || 0, basiskosten: a?.kosten || 0, aktiv: true, beschreibung: "",
      visual: { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst/.test(t) ? "nachlaeufer" : "semi", asset: null }, stl: [], merkmale: [] };
  }
  const familieFuerArtikel = (mo, a) => a?.gruppe ? mo.gruppen.find(g => (g.artikelgruppe || "").toUpperCase() === a.gruppe.toUpperCase() || g.id.toUpperCase() === a.gruppe.toUpperCase() || g.name.toUpperCase() === a.gruppe.toUpperCase())?.id : null;
  K.mNeu = { code: "", name: "", gruppe: "" };
  K.act.mArtNeu = () => {
    const mo = ent(), aktuell = istFam(K.st.knoten) ? K.st.knoten.slice(2) : (knoten()?.gruppe || mo.gruppen[0]?.id || "");
    K.mNeu = { code: "", name: "", gruppe: aktuell };
    K.sheet(`<h3>Konfigurierbaren Artikel hinzufügen</h3>
      <p class="klein gedimmt">Artikel aus dem Artikelstamm wählen. Er erbt alle Merkmale und Regeln seiner Familie und ist sofort konfigurierbar.</p>
      ${K.Store.artikelQuelle ? `<input id="na-q" type="search" data-in="mArtSuche" placeholder="Artikelnummer oder Bezeichnung suchen" autocomplete="off"><div id="na-liste" class="artliste kurz"></div>` : ""}
      <div class="formgitter">
        <div class="feld"><label for="na-code">Artikelnummer</label><input id="na-code" class="mono" data-in="mArtFeld" data-k="code"></div>
        <div class="feld breit"><label for="na-name">Bezeichnung</label><input id="na-name" data-in="mArtFeld" data-k="name"></div>
        <div class="feld"><label for="na-fam">Familie</label><select id="na-fam" data-chg="mArtFam">${St().gruppenOptionen(mo, aktuell)}</select></div></div>
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="sheetZu">Abbrechen</button><button class="btn primary" type="button" data-act="mArtNeuOk">Hinzufügen</button></div>`, true);
    if (K.Store.artikelQuelle) K.inp.mArtSuche(K.el("na-q"));
  };
  K.inp.mArtSuche = el => {
    const mo = ent(), vorhanden = new Set(mo.produkte.map(p => (p.code || "").toUpperCase()));
    const l = el.value.trim() ? K.Store.artikelSuche(el.value, 30) : [...K.Store.artikel.values()].filter(a => /FAHRZ|FZ|KMAT/i.test(a.gruppe || "")).slice(0, 30);
    K.el("na-liste").innerHTML = l.map(a => { const da = vorhanden.has(a.code.toUpperCase()); return `<button type="button" class="artliste-z" data-act="mArtWahl" data-c="${esc(a.code)}" ${da ? "disabled" : ""}><code>${esc(a.code)}</code><span>${esc(a.name)}</span><span class="num">${a.preis ? K.eur(a.preis) : ""}</span>${da ? `<span class="chip">schon im Modell</span>` : a.gruppe ? `<span class="chip">${esc(a.gruppe)}</span>` : ""}</button>`; }).join("") || `<p class="leer-klein">Keine Treffer.</p>`;
  };
  K.act.mArtWahl = el => {
    const mo = ent(), a = K.Store.artikelZu(el.dataset.c); if (!a) return;
    K.el("na-code").value = a.code; K.el("na-name").value = a.name; K.mNeu.code = a.code; K.mNeu.name = a.name;
    const f = familieFuerArtikel(mo, a); if (f) K.el("na-fam").value = f;
    K.el("na-liste").querySelectorAll(".artliste-z").forEach(b => b.classList.toggle("gewaehlt", b === el));
  };
  K.inp.mArtFeld = el => { K.mNeu[el.dataset.k] = el.value; };
  K.inp.mArtFam = () => {};
  K.act.mArtNeuOk = () => {
    const mo = ent(), code = K.el("na-code").value.trim(), name = K.el("na-name").value.trim(), gruppe = K.el("na-fam").value;
    if (!code) { K.toast("Bitte eine Artikelnummer angeben."); return K.el("na-code").focus(); }
    if (mo.produkte.some(p => (p.code || "").toUpperCase() === code.toUpperCase())) return K.toast(`${code} ist bereits im Modell.`);
    const a = K.Store.artikelZu(code);
    if (K.Store.artikelQuelle && !a && !K.mNeu.bestaetigt) { K.mNeu.bestaetigt = true; return K.toast(`${code} ist nicht im Artikelstamm. Zum Anlegen trotzdem erneut auf „Hinzufügen“ klicken.`); }
    const p = neuerArtikel(mo, code, name || a?.name || code, gruppe, a); mo.produkte.push(p);
    K.sheetZu(); K.st.knoten = "p:" + p.id; K.st.modellTab = "merkmale"; geaendert(`Konfigurierbarer Artikel ${code} in ${famName(mo, gruppe)} angelegt`);
  };
})();


/* ===== excel.js ===== */
/* =========================================================================
   Excel-Import und -Export der Produktfamilie
   Teil 1 (ohne Oberfläche, auch in Node lauffähig):
     - Blätter und Spalten erkennen (Synonyme für typische Spaltennamen)
     - Tabellenzeilen in das Konfigurationsmodell umwandeln
     - Modell als Tabellen (Vorlage) ausgeben
   Teil 2: Oberfläche im Studio (Datei wählen → Zuordnen → Prüfen → Übernehmen)

   Unterstützte Blätter (Namen frei, werden erkannt oder zugeordnet):
     Katalog      Gruppen-Code | Gruppe | Übergeordnet
     Produkte     Produkt-Code | Bezeichnung | Gruppe | Grundpreis | Kosten | Artikelnr. | Beschreibung
     Merkmale     Merkmal-Code | Merkmal | Bereich | Abschnitt | Auswahl | Darstellung | Pflicht | Multiplikator
     Codes        Vertriebscode | Merkmal | Bezeichnung | Preis | Kosten | Menge | … | <je Produkt eine Spalte: X / S>
     Regeln       Regel | Name | Wenn | Typ | Dann | Gilt für | Hinweis | Aktiv
     Matrix       Codes in Zeilen (Wenn) gegen Codes in Spalten (Dann), markierte Zellen
     Stückliste   Code | Artikelnr. | Bezeichnung | Menge | ME
   ========================================================================= */
(function (root) {
  const X = {};
  const E = typeof module !== "undefined" && module.exports ? require("./engine.js") : root.KONF.E;

  /* ---------- Erkennung ---------- */
  X.norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  X.FELDER = {
    katalog: { name: "Katalog", felder: {
      code: ["gruppencode", "gruppeid", "gruppenid", "code", "id", "kuerzel"], name: ["gruppe", "gruppenname", "bezeichnung", "name", "katalog"], eltern: ["uebergeordnet", "eltern", "parent", "obergruppe", "uebergeordnetegruppe"] }, pflicht: ["name"] },
    produkte: { name: "Produkte", felder: {
      code: ["produktcode", "produkt", "typcode", "typ", "modellcode", "modell", "code", "grundmaschine"], name: ["bezeichnung", "produktname", "name", "produktbezeichnung"], gruppe: ["gruppe", "produktgruppe", "familie", "kategorie", "katalog"],
      basispreis: ["grundpreis", "basispreis", "listenpreis", "preis", "vkpreis", "vk"], basiskosten: ["kosten", "herstellkosten", "selbstkosten", "ek", "ekpreis"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material", "materialnummer"], beschreibung: ["beschreibung", "langtext", "text", "info"] }, pflicht: ["code"] },
    merkmale: { name: "Merkmale", felder: {
      code: ["merkmalcode", "merkmalid", "merkmalkuerzel", "code", "id", "kuerzel"], name: ["merkmal", "merkmalname", "bezeichnung", "name"], bereich: ["bereich", "reiter", "tab", "register"], abschnitt: ["abschnitt", "kapitel", "baugruppe", "gruppe"],
      typ: ["auswahl", "auswahlart", "typ", "mehrfach"], darstellung: ["darstellung", "anzeige", "anzeigeart"], pflicht: ["pflicht", "muss", "pflichtfeld", "required"], multiplikator: ["multiplikator", "je", "mengevon"], info: ["info", "hinweis", "beschreibung"] }, pflicht: ["name"] },
    codes: { name: "Codes", felder: {
      code: ["vertriebscode", "vkcode", "verkaufscode", "salescode", "optionscode", "code", "merkmalswert", "wertcode"], merkmal: ["merkmal", "merkmalcode", "merkmalgruppe", "optionsgruppe", "gruppe"], name: ["bezeichnung", "text", "beschreibung", "name", "kurztext"],
      preis: ["preis", "vkpreis", "listenpreis", "verkaufspreis", "vk", "aufpreis"], kosten: ["kosten", "ek", "ekpreis", "herstellkosten"], menge: ["menge", "anzahl", "stueckzahl"], hex: ["farbe", "hex", "farbcode"],
      teil: ["3dteil", "3d", "cad", "bauteil", "cadteil"], info: ["info", "hinweis", "langtext"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material"], feld: ["feldtyp", "eingabe", "eingabeart", "art"] }, pflicht: ["code"] },
    regeln: { name: "Regeln", felder: {
      id: ["regel", "regelnr", "nr", "id", "regelid"], name: ["name", "bezeichnung", "beschreibung", "regelname"], wenn: ["wenn", "bedingung", "wenncode", "wenncodes", "ausloeser", "voraussetzung"], typ: ["typ", "art", "regeltyp", "aktion", "beziehung"],
      dann: ["dann", "folge", "ziel", "danncode", "danncodes", "betroffen", "betroffenecodes"], produkte: ["giltfuer", "produkte", "produkt", "nurfuer"], hinweis: ["hinweis", "meldung", "text", "begruendung"], aktiv: ["aktiv", "status", "gueltig"] }, pflicht: ["wenn", "dann"] },
    matrix: { name: "Matrix", felder: {}, pflicht: [] },
    kombinationen: { name: "Kombinationen", felder: {
      tabelle: ["tabelle", "tabellennr", "kombinationstabelle", "variantentabelle", "tabellenid"], name: ["name", "bezeichnung", "tabellenname"], produkte: ["giltfuer", "produkte", "produkt", "nurfuer"] }, pflicht: ["tabelle"] },
    stueckliste: { name: "Stückliste", felder: {
      code: ["vertriebscode", "code", "produktcode", "produkt", "wertcode"], artnr: ["artikelnr", "artikelnummer", "artnr", "artikel", "material", "komponente"], bez: ["bezeichnung", "text", "beschreibung", "kurztext"], menge: ["menge", "anzahl"], me: ["me", "einheit", "mengeneinheit"] }, pflicht: ["code", "artnr"] }
  };
  const BLATTNAMEN = { katalog: ["katalog", "gruppen", "produktgruppen", "struktur"], produkte: ["produkte", "produkt", "typen", "modelle", "grundmaschinen"], merkmale: ["merkmale", "merkmal", "merkmalsliste"],
    codes: ["codes", "vertriebscodes", "vkcodes", "optionen", "werte", "merkmalswerte", "preisliste"], regeln: ["regeln", "regelwerk", "abhaengigkeiten", "regelliste"], matrix: ["matrix", "kompatibilitaet", "ausschluss", "ausschlussmatrix"], kombinationen: ["kombinationen", "kombinationstabelle", "kombinationstabellen", "variantentabelle", "variantentabellen"], stueckliste: ["stueckliste", "stl", "bom"] };

  /** Kopfzeile finden: die Zeile mit den meisten bekannten Spaltennamen unter den ersten 12 */
  X.kopfzeile = (aoa, typ) => {
    const syn = Object.values(X.FELDER[typ]?.felder || {}).flat();
    let best = 0, bestScore = -1;
    for (let i = 0; i < Math.min(12, aoa.length); i++) {
      const z = aoa[i] || [], gefuellt = z.filter(c => String(c).trim()).length;
      const score = z.filter(c => syn.includes(X.norm(c))).length * 3 + (gefuellt >= 2 ? 1 : 0);
      if (score > bestScore) { bestScore = score; best = i; }
    }
    return best;
  };
  /** Spalten den Feldern zuordnen (exakt vor "enthält") */
  X.spaltenRaten = (kopf, typ) => {
    const out = {}, belegt = new Set(), n = kopf.map(X.norm);
    for (const [feld, syn] of Object.entries(X.FELDER[typ].felder)) {
      let idx = -1;
      for (const s of syn) { idx = n.findIndex((h, i) => h === s && !belegt.has(i)); if (idx >= 0) break; }
      const nicht = typ === "codes" && feld === "merkmal" ? /produkt|familie|baureihe/ : null; // „Produktgruppe“ ist kein Merkmal
      if (idx < 0) for (const s of syn) { if (s.length < 3) continue; idx = n.findIndex((h, i) => h && h.includes(s) && !belegt.has(i) && !(nicht && nicht.test(h))); if (idx >= 0) break; }
      if (idx >= 0) { out[feld] = idx; belegt.add(idx); }
    }
    return out;
  };
  /** Blatttyp aus Name und Inhalt raten */
  X.blattTypRaten = (name, aoa) => {
    const nn = X.norm(name);
    for (const [typ, l] of Object.entries(BLATTNAMEN)) if (l.some(s => nn === s || nn.includes(s))) return typ;
    let best = null, bs = 0;
    for (const typ of Object.keys(X.FELDER)) { if (typ === "matrix" || typ === "katalog") continue; /* Produktgruppen nur aus einem Blatt namens Katalog/Gruppen */ const k = aoa[X.kopfzeile(aoa, typ)] || []; const s = Object.keys(X.spaltenRaten(k, typ)).length; if (s > bs) { bs = s; best = typ; } }
    return bs >= 2 ? best : null;
  };
  /** Komplette Zuordnung für eine Arbeitsmappe vorschlagen (oder gespeicherte anwenden) */
  X.zuordnungVorschlagen = (blaetter, gespeichert) => {
    const zuo = {};
    const ignorieren = n => /^(anleitung|hinweise?|info|readme|liesmich|deckblatt|inhalt)$/.test(X.norm(n));
    // Blätter mit passendem Namen zuerst, dann nach Inhalt erkannte
    const namen = Object.keys(blaetter).filter(n => !ignorieren(n));
    const nachName = n => Object.values(BLATTNAMEN).some(l => l.some(s => X.norm(n) === s || X.norm(n).includes(s)));
    namen.sort((a, b) => (nachName(b) ? 1 : 0) - (nachName(a) ? 1 : 0));
    for (const name of namen) {
      const aoa = blaetter[name];
      const g = gespeichert && Object.entries(gespeichert).find(([, v]) => v.blatt === name);
      const typ = g ? g[0] : X.blattTypRaten(name, aoa);
      if (!typ || zuo[typ]) continue;
      const kz = X.kopfzeile(aoa, typ), kopf = aoa[kz] || [];
      const felder = X.spaltenRaten(kopf, typ);
      if (g && g[1].spaltenNamen) for (const [f, h] of Object.entries(g[1].spaltenNamen)) { const i = kopf.findIndex(c => X.norm(c) === X.norm(h)); if (i >= 0) felder[f] = i; }
      zuo[typ] = { blatt: name, kopfzeile: kz, felder, matrixBedeutung: g?.[1].matrixBedeutung || "sperrt" };
    }
    return zuo;
  };

  /* ---------- Umwandlung ---------- */
  const txt = v => String(v ?? "").trim();
  X.zahl = v => {
    if (typeof v === "number") return v;
    let s = txt(v).replace(/[€\s]|EUR/gi, ""); if (!s || s === "-") return 0;
    if (/,\d{1,2}$/.test(s) || (s.includes(",") && s.includes("."))) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, ".");
    const n = parseFloat(s); return isFinite(n) ? n : 0;
  };
  const ja = v => /^(x|ja|j|yes|y|1|true|wahr|s|std|standard|o|opt|optional|●|✓|✔)$/i.test(txt(v));
  const istStandard = v => /^(s|std|standard)$/i.test(txt(v));
  const listeCodes = s => txt(s).split(/\s*(?:[,;/|\n]|\s+oder\s+|\s+or\s+)\s*/i).map(x => x.trim()).filter(Boolean);
  const typAus = s => {
    const n = X.norm(s);
    if (/nurerlaubt|erlaubtnur|nurmit|nur$|^nur|nurzulaessig/.test(n)) return "nurErlauben";
    if (/setzt|automatisch|inklusive|beinhaltet|erfordert|benoetigt|requires|braucht|zwingend/.test(n)) return "setzen";
    return "sperren"; // sperrt, schließt aus, ausschluss, nicht mit, inkompatibel, exclude
  };

  function zeilen(blaetter, z) {
    if (!z || !z.blatt || !blaetter[z.blatt]) return [];
    const aoa = blaetter[z.blatt];
    return aoa.slice(z.kopfzeile + 1).filter(r => r && r.some(c => txt(c))).map((r, i) => {
      const o = { _zeile: z.kopfzeile + 2 + i };
      for (const [f, idx] of Object.entries(z.felder || {})) if (idx != null && idx >= 0) o[f] = r[idx];
      o._roh = r; return o;
    });
  }

  /**
   * Tabellen → Modell. basis = aktueller Entwurf, modus "zusammen" (Codes aktualisieren, Rest behalten) oder "ersetzen".
   * Liefert { modell, warn:[{blatt,zeile,text}], stat }
   */
  X.umwandeln = (blaetter, zuo, basis, modus = "zusammen") => {
    const warn = [], w = (blatt, zeile, text) => warn.push({ blatt, zeile, text });
    const mo = modus === "ersetzen" || !basis ? { version: basis?.version || 0, gruppen: [], produkte: [], merkmale: [], regeln: [] } : JSON.parse(JSON.stringify(basis));
    const stat = { gruppen: 0, produkte: 0, merkmale: 0, codes: 0, regeln: 0, stueckliste: 0 };
    const bl = t => zuo[t]?.blatt || X.FELDER[t].name;

    // Katalog
    for (const r of zeilen(blaetter, zuo.katalog)) {
      const name = txt(r.name); if (!name) continue;
      const id = E.slug(txt(r.code) || name), eltern = txt(r.eltern) ? E.slug(txt(r.eltern)) : null;
      const g = mo.gruppen.find(x => x.id === id);
      if (g) Object.assign(g, { name, eltern }); else mo.gruppen.push({ id, name, eltern });
      stat.gruppen++;
    }
    for (const g of mo.gruppen) if (g.eltern && !mo.gruppen.some(x => x.id === g.eltern)) { const n = mo.gruppen.find(x => X.norm(x.name) === X.norm(g.eltern)); if (n) g.eltern = n.id; else { w(bl("katalog"), null, `Übergeordnete Gruppe „${g.eltern}“ von „${g.name}“ fehlt, Gruppe steht oben im Katalog.`); g.eltern = null; } }

    // Produkte
    const gruppeFinden = s => { const n = X.norm(s); if (!n) return null; let g = mo.gruppen.find(x => X.norm(x.id) === n || X.norm(x.name) === n); if (!g) { g = { id: E.slug(s), name: txt(s), eltern: null }; mo.gruppen.push(g); stat.gruppen++; } return g.id; };
    const neueProdukte = new Set();
    for (const r of zeilen(blaetter, zuo.produkte)) {
      const code = txt(r.code); if (!code) { w(bl("produkte"), r._zeile, "Zeile ohne Produkt-Code übersprungen."); continue; }
      let p = mo.produkte.find(x => X.norm(x.code || x.id) === X.norm(code));
      if (!p) { p = { id: code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code, name: code, gruppe: null, artnr: "", basispreis: 0, basiskosten: 0, aktiv: true, beschreibung: "", visual: { typ: "semi", asset: null }, stl: [], merkmale: [] }; mo.produkte.push(p); }
      if (txt(r.name)) p.name = txt(r.name);
      if (r.gruppe !== undefined && txt(r.gruppe)) p.gruppe = gruppeFinden(r.gruppe);
      if (r.basispreis !== undefined) p.basispreis = X.zahl(r.basispreis);
      if (r.basiskosten !== undefined) p.basiskosten = X.zahl(r.basiskosten);
      if (r.artnr !== undefined) p.artnr = txt(r.artnr);
      if (r.beschreibung !== undefined) p.beschreibung = txt(r.beschreibung);
      const t = X.norm(p.name + " " + (p.gruppe || ""));
      if (!p.visual?.asset) p.visual = { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform|platform/.test(t) ? "plattform" : /nachlaeufer|holz|forst/.test(t) ? "nachlaeufer" : "semi", asset: null };
      neueProdukte.add(p.id); stat.produkte++;
    }
    if (!mo.gruppen.length) { mo.gruppen.push({ id: "alle", name: "Fahrzeuge", eltern: null }); }
    for (const p of mo.produkte) if (!p.gruppe) p.gruppe = mo.gruppen[0].id;

    // Merkmale
    const merkmalFinden = (s, anlegen, zeile) => {
      const n = X.norm(s); if (!n) return null;
      let m = mo.merkmale.find(x => X.norm(x.id) === n || X.norm(x.name) === n || X.norm(x.code) === n);
      if (!m && anlegen) { m = { id: E.slug(s).replace(/-/g, "") || "m" + mo.merkmale.length, name: txt(s), abschnitt: "", typ: "einfach", werte: [] }; mo.merkmale.push(m); stat.merkmale++; }
      return m;
    };
    for (const r of zeilen(blaetter, zuo.merkmale)) {
      const name = txt(r.name) || txt(r.code); if (!name) continue;
      let m = merkmalFinden(txt(r.code) || name, false) || merkmalFinden(name, false);
      if (!m) { m = { id: (E.slug(txt(r.code) || name).replace(/-/g, "")) || "m" + mo.merkmale.length, name, abschnitt: "", typ: "einfach", werte: [] }; mo.merkmale.push(m); }
      m.name = name; if (txt(r.code)) m.code = txt(r.code);
      if (r.bereich !== undefined && txt(r.bereich)) m.bereich = txt(r.bereich);
      if (r.abschnitt !== undefined) m.abschnitt = txt(r.abschnitt);
      if (r.typ !== undefined && txt(r.typ)) m.typ = /mehr|multi|viele|zubehoer|option|checkbox|x/i.test(txt(r.typ)) && !/einfach|eine?n?$/i.test(txt(r.typ)) ? "mehrfach" : "einfach";
      if (r.darstellung !== undefined && txt(r.darstellung)) { const d = X.norm(r.darstellung); m.darstellung = /kachel|bild|tile/.test(d) ? "kacheln" : /dropdown|auswahl|liste?nfeld|combo/.test(d) ? "auswahl" : /check|haken|option/.test(d) ? "option" : "liste"; }
      if (r.pflicht !== undefined) m.pflicht = ja(r.pflicht);
      if (r.info !== undefined && txt(r.info)) m.info = txt(r.info);
      if (r.multiplikator !== undefined && txt(r.multiplikator)) m._mult = txt(r.multiplikator);
      stat.merkmale++;
    }

    // Codes (Merkmalswerte) inkl. Verfügbarkeit je Produkt
    const zc = zuo.codes;
    const verfuegbar = {}; // pid -> mid -> Set(wid), standard
    const prodSpalten = [];
    if (zc && blaetter[zc.blatt]) {
      const kopf = blaetter[zc.blatt][zc.kopfzeile] || [], belegt = new Set(Object.values(zc.felder || {}));
      kopf.forEach((h, i) => {
        if (belegt.has(i) || !txt(h)) return;
        const n = X.norm(h), p = mo.produkte.find(x => X.norm(x.code || x.id) === n || X.norm(x.name) === n);
        if (p || (zc.produktSpalten || []).includes(txt(h))) prodSpalten.push({ i, p, h: txt(h) });
      });
      for (const s of prodSpalten) if (!s.p) {
        const p = { id: s.h.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code: s.h, name: s.h, gruppe: mo.gruppen[0].id, artnr: "", basispreis: 0, basiskosten: 0, aktiv: true, beschreibung: "", visual: { typ: "semi", asset: null }, stl: [], merkmale: [] };
        mo.produkte.push(p); s.p = p; neueProdukte.add(p.id); stat.produkte++; w(bl("codes"), null, `Produkt „${s.h}“ nur aus Spaltenkopf angelegt (Grundpreis 0).`);
      }
    }
    const gesehen = new Map();
    let letztesMerkmal = null;
    for (const r of zeilen(blaetter, zc)) {
      const code = txt(r.code);
      // Zwischenüberschriften ("Merkmal: Achsen") ohne Code als Merkmal für die folgenden Zeilen
      if (!code) { const t = txt(r.name) || txt(r.merkmal); if (t) letztesMerkmal = t; continue; }
      const mname = txt(r.merkmal) || letztesMerkmal;
      if (!mname) { w(bl("codes"), r._zeile, `Code ${code} hat kein Merkmal und wurde übersprungen.`); continue; }
      const m = merkmalFinden(mname, true);
      const key = code.toUpperCase();
      if (gesehen.has(key)) { w(bl("codes"), r._zeile, `Code ${code} kommt doppelt vor (zuerst Zeile ${gesehen.get(key)}). Die spätere Zeile gilt.`); }
      gesehen.set(key, r._zeile);
      // Code auch in anderem Merkmal vorhanden? → dort entfernen
      for (const m2 of mo.merkmale) if (m2 !== m) { const j = m2.werte.findIndex(x => (x.code || "").toUpperCase() === key); if (j >= 0) m2.werte.splice(j, 1); }
      let wv = m.werte.find(x => (x.code || "").toUpperCase() === key) || m.werte.find(x => x.id.toUpperCase() === key);
      if (!wv) { wv = { id: code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), code, name: code, preis: 0, kosten: 0, stl: [] }; m.werte.push(wv); }
      wv.code = code;
      if (txt(r.name)) wv.name = txt(r.name);
      if (r.preis !== undefined) wv.preis = X.zahl(r.preis);
      if (r.kosten !== undefined) wv.kosten = X.zahl(r.kosten);
      if (r.menge !== undefined && txt(r.menge)) wv.menge = X.zahl(r.menge);
      if (r.hex !== undefined && /^#?[0-9a-f]{6}$/i.test(txt(r.hex))) wv.hex = "#" + txt(r.hex).replace("#", "");
      if (r.teil !== undefined) wv.teil = txt(r.teil);
      if (r.feld !== undefined && txt(r.feld)) { const f = X.norm(r.feld), t = E.WERTTYPEN ? (E.WERTTYPEN.find(([k, n]) => X.norm(k) === f || X.norm(n) === f) || [/zahl|menge|anzahl/.test(f) ? "zahl" : /text/.test(f) ? "text" : /fest|inkl|grund/.test(f) ? "fest" : /ja|nein|bool|haken/.test(f) ? "janein" : "auswahl"])[0] : null; if (t && E.wertTypSetzen) E.wertTypSetzen(wv, t); }
      if (r.info !== undefined && txt(r.info)) wv.info = txt(r.info);
      if (r.artnr !== undefined && txt(r.artnr)) wv.stl = [[txt(r.artnr), wv.name, 1, "Stk"]];
      for (const s of prodSpalten) {
        const v = r._roh[s.i]; if (!ja(v)) continue;
        const pv = (verfuegbar[s.p.id] ||= {}), e = (pv[m.id] ||= { ids: new Set(), std: [] });
        e.ids.add(wv.id); if (istStandard(v)) e.std.push(wv.id);
      }
      stat.codes++;
    }
    for (const m of mo.merkmale) if (m._mult) { const z = merkmalFinden(m._mult, false); if (z) m.multiplikator = z.id; else w(bl("merkmale"), null, `Multiplikator „${m._mult}“ von ${m.name} nicht gefunden.`); delete m._mult; }

    // Produktzuordnung aus Verfügbarkeitsspalten
    if (prodSpalten.length) {
      for (const s of prodSpalten) {
        const p = s.p, pv = verfuegbar[p.id] || {};
        const alt = new Map((p.merkmale || []).map(z => [z.id, z]));
        p.merkmale = []; delete p.reihenfolge;
        for (const m of mo.merkmale) {
          const e = pv[m.id];
          if (!e) { if (alt.has(m.id) && !m.werte.some(x => x.code)) p.merkmale.push(alt.get(m.id)); continue; }
          const ids = m.werte.filter(x => e.ids.has(x.id)).map(x => x.id);
          const z = { id: m.id, werte: ids.length === m.werte.length ? null : ids };
          if (e.std.length) z.standard = m.typ === "mehrfach" ? e.std.join(",") : e.std[0];
          p.merkmale.push(z);
        }
        if (!p.merkmale.length) w(bl("codes"), null, `Für ${p.name} ist kein Code markiert.`);
      }
    } else if (zc) {
      // keine Produktspalten: neue Produkte erhalten alle Merkmale
      for (const p of mo.produkte) if (neueProdukte.has(p.id) && !p.merkmale.length) p.merkmale = mo.merkmale.map(m => ({ id: m.id, werte: null }));
    }

    // Regeln
    const idx = E.codeIndex(mo);
    const codeAuf = (c, blatt, zeile) => { const t = idx.get(c.toUpperCase()); if (!t) w(blatt, zeile, `Unbekannter Code „${c}“.`); return t; };
    const bedingungen = (s, blatt, zeile) => {
      const teile = txt(s).split(/\s*(?:&|\+|\bund\b|\band\b|\bUND\b|\bAND\b)\s*/).filter(Boolean), out = [];
      for (let t of teile) {
        let op = "ist"; const neg = t.match(/^(?:!|nicht\s+|not\s+|kein(?:e|en)?\s+)(.*)$/i); if (neg) { op = "istNicht"; t = neg[1]; }
        const tr = listeCodes(t).map(c => codeAuf(c, blatt, zeile)).filter(Boolean);
        const nachM = new Map(); for (const x of tr) { if (!nachM.has(x.m.id)) nachM.set(x.m.id, []); nachM.get(x.m.id).push(x.w.id); }
        if (nachM.size > 1) w(blatt, zeile, `„${t}“ mischt Codes verschiedener Merkmale in einer Oder-Bedingung. Sie wurde je Merkmal aufgeteilt (Und-Verknüpfung).`);
        for (const [mid, ws] of nachM) out.push({ merkmal: mid, op, werte: ws });
      }
      return out;
    };
    const geltung = (s, blatt, zeile) => {
      const out = { produkte: [], gruppen: [] };
      for (const c of listeCodes(s)) {
        const n = X.norm(c.replace(/^gruppe\s*:?\s*/i, ""));
        const p = mo.produkte.find(x => X.norm(x.code || x.id) === n || X.norm(x.name) === n), g = mo.gruppen.find(x => X.norm(x.id) === n || X.norm(x.name) === n);
        if (p && !/^gruppe/i.test(c)) out.produkte.push(p.id); else if (g) out.gruppen.push(g.id); else w(blatt, zeile, `„${c}“ ist weder Produkt noch Gruppe.`);
      }
      return out;
    };
    const importiert = [];
    for (const r of zeilen(blaetter, zuo.regeln)) {
      const blatt = bl("regeln"), wenn = bedingungen(r.wenn, blatt, r._zeile);
      const typ = typAus(r.typ), dannCodes = listeCodes(r.dann).map(c => codeAuf(c, blatt, r._zeile)).filter(Boolean);
      if (!wenn.length || !dannCodes.length) { w(blatt, r._zeile, "Regel ohne gültige Wenn- oder Dann-Codes übersprungen."); continue; }
      const nachM = new Map(); for (const x of dannCodes) { if (!nachM.has(x.m.id)) nachM.set(x.m.id, []); nachM.get(x.m.id).push(x.w.id); }
      let teil = 0;
      for (const [mid, ws] of nachM) {
        const basisId = txt(r.id) ? txt(r.id).replace(/[^A-Za-z0-9_-]/g, "") : null;
        const rid = basisId ? basisId + (nachM.size > 1 ? "-" + (++teil) : "") : E.neueId("X", [...mo.regeln.map(x => x.id), ...importiert.map(x => x.id)]);
        importiert.push({ id: rid, name: txt(r.name) || "", aktiv: r.aktiv === undefined || !txt(r.aktiv) ? true : !/^(nein|n|0|false|inaktiv|aus)$/i.test(txt(r.aktiv)),
          ...(r.produkte !== undefined ? geltung(r.produkte, blatt, r._zeile) : { produkte: [], gruppen: [] }), wenn: JSON.parse(JSON.stringify(wenn)), dann: { typ, merkmal: mid, werte: ws }, hinweis: txt(r.hinweis), quelle: "excel" });
        if (wenn.some(c => c.merkmal === mid)) w(blatt, r._zeile, `Regel ${rid}: Bedingung und Folge betreffen dasselbe Merkmal.`);
      }
    }
    // Matrix
    const zm = zuo.matrix;
    if (zm && blaetter[zm.blatt]) {
      const aoa = blaetter[zm.blatt], kopf = aoa[zm.kopfzeile] || [], blatt = zm.blatt;
      const spalten = kopf.map((h, i) => i === 0 || !txt(h) ? null : idx.get(txt(h).toUpperCase())).map((t, i) => t ? { i, ...t } : null).filter(Boolean);
      kopf.forEach((h, i) => { if (i > 0 && txt(h) && !idx.get(txt(h).toUpperCase())) w(blatt, zm.kopfzeile + 1, `Spaltencode „${txt(h)}“ unbekannt.`); });
      aoa.slice(zm.kopfzeile + 1).forEach((r, j) => {
        const c = txt(r?.[0]); if (!c) return; const a = idx.get(c.toUpperCase()); if (!a) { w(blatt, zm.kopfzeile + 2 + j, `Zeilencode „${c}“ unbekannt.`); return; }
        const nachM = new Map();
        for (const s of spalten) { if (s.m.id === a.m.id) continue; if (!nachM.has(s.m.id)) nachM.set(s.m.id, { alle: [], markiert: [] }); const e = nachM.get(s.m.id); e.alle.push(s.w.id); if (ja(r[s.i])) e.markiert.push(s.w.id); }
        for (const [mid, e] of nachM) {
          let typ, ws;
          if (zm.matrixBedeutung === "erlaubt") { if (e.markiert.length === e.alle.length) continue; typ = "nurErlauben"; ws = e.markiert; if (!ws.length) { typ = "sperren"; ws = e.alle; } }
          else { if (!e.markiert.length) continue; typ = "sperren"; ws = e.markiert; }
          importiert.push({ id: `M-${a.w.id}-${mid}`.slice(0, 60), name: `Matrix: ${a.w.name} × ${E.merkmal(mo, mid).name}`, aktiv: true, matrix: true, produkte: [], wenn: [{ merkmal: a.m.id, op: "ist", werte: [a.w.id] }], dann: { typ, merkmal: mid, werte: ws }, hinweis: "", quelle: "excel" });
        }
      });
    }
    // Kombinationstabellen: je Zeile eine erlaubte Kombination aus Codes
    const zk = zuo.kombinationen;
    if (zk && blaetter[zk.blatt]) {
      const blatt = zk.blatt, belegt = new Set(Object.values(zk.felder || {})), tabs = new Map();
      for (const r of zeilen(blaetter, zk)) {
        const tid = txt(r.tabelle).replace(/[^A-Za-z0-9_-]/g, ""); if (!tid) continue;
        const codes = r._roh.map((v, i) => belegt.has(i) ? "" : txt(v)).filter(Boolean);
        const tr = codes.map(c => codeAuf(c, blatt, r._zeile)); if (tr.some(x => !x) || tr.length < 2) continue;
        if (!tabs.has(tid)) tabs.set(tid, { id: tid, name: txt(r.name) || "Kombinationstabelle " + tid, aktiv: true, typ: "tabelle", quelle: "excel", ...(r.produkte !== undefined ? geltung(r.produkte, blatt, r._zeile) : { produkte: [], gruppen: [] }), tabelle: { merkmale: tr.map(x => x.m.id), zeilen: [] } });
        const t = tabs.get(tid).tabelle;
        if (tr.length !== t.merkmale.length || tr.some((x, i) => x.m.id !== t.merkmale[i])) { w(blatt, r._zeile, `Tabelle ${tid}: Codes passen nicht zu den Merkmalen der ersten Zeile (${t.merkmale.map(m => E.merkmal(mo, m).name).join(", ")}).`); continue; }
        t.zeilen.push(tr.map(x => x.w.id));
      }
      importiert.push(...tabs.values());
    }
    if (zuo.regeln || zuo.matrix || zuo.kombinationen) {
      // Regeln aus Excel ersetzen frühere Excel-Regeln; von Hand angelegte bleiben (im Modus "zusammen")
      const ids = new Set(importiert.map(r => r.id));
      mo.regeln = mo.regeln.filter(r => r.quelle !== "excel" && !ids.has(r.id)).concat(importiert);
      stat.regeln = importiert.length;
    }

    // Stückliste
    const stlNeu = new Map();
    for (const r of zeilen(blaetter, zuo.stueckliste)) {
      const c = txt(r.code), nr = txt(r.artnr); if (!c || !nr) continue;
      const t = idx.get(c.toUpperCase()), p = mo.produkte.find(x => X.norm(x.code || x.id) === X.norm(c));
      const ziel = t ? t.w : p; if (!ziel) { w(bl("stueckliste"), r._zeile, `Code „${c}“ unbekannt.`); continue; }
      if (!stlNeu.has(ziel)) stlNeu.set(ziel, []);
      stlNeu.get(ziel).push([nr, txt(r.bez), X.zahl(r.menge) || 1, txt(r.me) || "Stk"]); stat.stueckliste++;
    }
    for (const [ziel, l] of stlNeu) ziel.stl = l;

    // Leere Gruppen aus diesem Import nicht anlegen (keine Artikel, keine Untergruppen)
    const vorher = new Set((basis && modus !== "ersetzen" ? basis.gruppen : []).map(g => g.id));
    for (let runde = 0; runde < 5; runde++) {
      const leer = mo.gruppen.filter(g => !vorher.has(g.id) && !mo.produkte.some(p => p.gruppe === g.id) && !mo.gruppen.some(x => x.eltern === g.id));
      if (!leer.length) break; mo.gruppen = mo.gruppen.filter(g => !leer.includes(g)); stat.gruppen -= leer.length;
      w(bl("katalog"), null, `${leer.length} Gruppen ohne Fahrzeuge wurden nicht angelegt: ${leer.slice(0, 6).map(g => g.name).join(", ")}${leer.length > 6 ? " …" : ""}`);
    }
    // Plausibilität
    for (const m of mo.merkmale) if (!m.werte.length) w("Modell", null, `Merkmal ${m.name} hat keine Codes.`);
    for (const p of mo.produkte) if (!E.zuordnung(mo, p).length) w("Modell", null, `Produkt ${p.name} hat keine Merkmale.`);
    return { modell: mo, warn, stat };
  };

  /* ---------- Export als Tabellen (Vorlage) ---------- */
  X.alsTabellen = mo => {
    const ja1 = b => b ? "ja" : "nein";
    const codeVon = (m, w) => w.code || (m.id + "-" + w.id).toUpperCase();
    const codeZu = (mid, wid) => { const m = E.merkmal(mo, mid), w = m && E.wert(mo, mid, wid); return w ? codeVon(m, w) : wid; };
    const t = {};
    t.Anleitung = [["Importvorlage Fahrzeugkonfigurator"], [""],
      ["Blatt", "Inhalt"],
      ["Katalog", "Produktgruppen. „Übergeordnet“ verweist auf den Gruppen-Code der Obergruppe."],
      ["Produkte", "Grundfahrzeuge mit Code, Gruppe, Grundpreis, Kosten."],
      ["Merkmale", "Bereich = Reiter im Konfigurator (z. B. Grundmaschine, Optionen). Auswahl: einfach/mehrfach. Darstellung: kacheln, liste, auswahl, option. Pflicht: ja/nein."],
      ["Codes", "Ein Vertriebscode je Zeile. „Feldtyp“: Auswahl, Ja/Nein, Zahl, Freitext oder Fest enthalten. Danach steht je Produkt eine Spalte: X = verfügbar, S = Standard, leer = nicht verfügbar."],
      ["Regeln", "Wenn: Codes; mit Komma = oder, mit & = und, „nicht“ davor = ausgeschlossen. Typ: sperrt, erlaubt nur, setzt (erfordert). Dann: Codes eines Merkmals. Gilt für: Produkt-Codes oder „Gruppe <Gruppen-Code>“, leer = alle."],
      ["Matrix", "Optional: Codes in Zeilen gegen Codes in Spalten, X = schließt aus (oder beim Import „X = erlaubt“ wählen)."],
      ["Kombinationen", "Kombinationstabellen: je Zeile eine erlaubte Kombination aus Codes (eine Spalte je Merkmal). Alle Zeilen mit gleicher Tabellen-Nr. bilden eine Tabelle; nicht aufgeführte Kombinationen sind gesperrt."],
      ["Stückliste", "Je Zeile eine Komponente zu einem Vertriebs- oder Produkt-Code."]];
    t.Katalog = [["Gruppen-Code", "Gruppe", "Übergeordnet"], ...mo.gruppen.map(g => [g.id, g.name, g.eltern || ""])];
    t.Produkte = [["Produkt-Code", "Bezeichnung", "Gruppe", "Grundpreis", "Kosten", "Artikelnr.", "Beschreibung", "Aktiv"], ...mo.produkte.map(p => [p.code || p.id, p.name, p.gruppe, p.basispreis, p.basiskosten, p.artnr || "", p.beschreibung || "", ja1(p.aktiv !== false)])];
    t.Merkmale = [["Merkmal-Code", "Merkmal", "Bereich", "Abschnitt", "Auswahl", "Darstellung", "Pflicht", "Multiplikator", "Info"], ...mo.merkmale.map(m => [m.code || m.id, m.name, E.bereich(m), m.abschnitt || "", m.typ === "mehrfach" ? "mehrfach" : "einfach", E.darstellung(m), ja1(m.pflicht), m.multiplikator ? (E.merkmal(mo, m.multiplikator)?.code || m.multiplikator) : "", m.info || ""])];
    const prods = mo.produkte;
    t.Codes = [["Vertriebscode", "Merkmal", "Bezeichnung", "Preis", "Kosten", "Menge", "Farbe", "3D-Teil", "Info", "Feldtyp", ...prods.map(p => p.code || p.id)]];
    for (const m of mo.merkmale) for (const w of m.werte) t.Codes.push([codeVon(m, w), m.code || m.id, w.name, w.preis || 0, w.kosten || 0, w.menge ?? "", w.hex || "", w.teil || "", w.info || "", (E.WERTTYPEN.find(x => x[0] === E.wertTyp(m, w)) || ["", ""])[1],
      ...prods.map(p => { const z = E.zuordnung(mo, p).find(x => x.id === m.id); if (!z) return ""; const ok = !z.werte || !z.werte.length || z.werte.includes(w.id); if (!ok) return ""; const std = z.standard && z.standard.split(",").includes(w.id); return std ? "S" : "X"; })]);
    const typT = { sperren: "sperrt", nurErlauben: "erlaubt nur", setzen: "setzt" };
    const geltungText = r => [...(r.produkte || []).map(id => E.produkt(mo, id)?.code || id), ...(r.gruppen || []).map(id => "Gruppe " + id)].join(", ");
    t.Regeln = [["Regel", "Name", "Wenn", "Typ", "Dann", "Gilt für", "Hinweis", "Aktiv"], ...mo.regeln.filter(r => r.dann && r.wenn?.length).map(r => [r.id, r.name || "",
      r.wenn.map(c => (c.op === "istNicht" ? "nicht " : "") + c.werte.map(x => codeZu(c.merkmal, x)).join(", ")).join(" & "), typT[r.dann.typ] || "sperrt",
      r.dann.werte.map(x => codeZu(r.dann.merkmal, x)).join(", "), geltungText(r), r.hinweis || "", ja1(r.aktiv)])];
    const tabellen = mo.regeln.filter(r => r.typ === "tabelle" && r.tabelle?.merkmale?.length);
    const maxM = Math.max(2, ...tabellen.map(r => r.tabelle.merkmale.length));
    t.Kombinationen = [["Tabelle", "Name", "Gilt für", ...Array.from({ length: maxM }, (_, i) => "Code " + (i + 1))]];
    for (const r of tabellen) for (const z of r.tabelle.zeilen) t.Kombinationen.push([r.id, r.name || "", geltungText(r), ...z.map((w, i) => codeZu(r.tabelle.merkmale[i], w))]);
    t["Stückliste"] = [["Code", "Artikelnr.", "Bezeichnung", "Menge", "ME"]];
    for (const p of prods) for (const z of p.stl || []) t["Stückliste"].push([p.code || p.id, ...z]);
    for (const m of mo.merkmale) for (const w of m.werte) for (const z of w.stl || []) t["Stückliste"].push([codeVon(m, w), ...z]);
    return t;
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = X; return; }
  const K = root.KONF; K.X = X;

  /* =====================================================================
     Oberfläche: Studio → Excel-Import
     ===================================================================== */
  const esc = K.esc, S = () => K.Store.S;
  K.imp = { schritt: "datei", datei: null, blaetter: null, zuo: null, modus: "zusammen", ergebnis: null, fehler: null };
  const TYPEN = Object.keys(X.FELDER);
  const FELDNAMEN = { tabelle: "Tabellen-Nr.", code: "Code", name: "Bezeichnung", eltern: "Übergeordnet", gruppe: "Gruppe", basispreis: "Grundpreis", basiskosten: "Kosten", artnr: "Artikelnr.", beschreibung: "Beschreibung",
    bereich: "Bereich (Reiter)", abschnitt: "Abschnitt", typ: "Auswahl einfach/mehrfach", darstellung: "Darstellung", pflicht: "Pflicht", multiplikator: "Multiplikator", info: "Info",
    merkmal: "Merkmal", preis: "Preis", kosten: "Kosten", menge: "Menge", hex: "Farbe (Hex)", teil: "3D-Teil", id: "Regel-Nr.", wenn: "Wenn (Codes)", dann: "Dann (Codes)", produkte: "Gilt für", hinweis: "Hinweis", aktiv: "Aktiv", bez: "Bezeichnung", me: "ME" };

  async function dateiLesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek (SheetJS) ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" });
    const blaetter = {};
    for (const n of wb.SheetNames) blaetter[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return blaetter;
  }

  K.route("studio-import-vorlage", () => {
    const i = K.imp, ro = !K.Store.schreiben, mo = S().entwurf;
    const kopf = `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Expertenimport</h2><p>Produktfamilie mit Vertriebscodes, Preisen, Verfügbarkeit je Produkt, Regeln und Stückliste aus Excel übernehmen. Der Import landet im Entwurf; der Vertrieb sieht ihn erst nach der Freigabe.</p></div>
      <div class="row"><a class="btn" href="#studio-import-struktur">Zum einfachen Listen-Import</a><button class="btn" type="button" data-act="excelVorlage">Aktuelles Modell als Excel exportieren</button></div></div>`;
    const schritte = [["datei", "Datei"], ["zuordnung", "Zuordnung"], ["vorschau", "Prüfen"], ["fertig", "Übernommen"]];
    const leiste = `<ol class="schritte">${schritte.map(([id, n], j) => `<li class="${i.schritt === id ? "aktiv" : schritte.findIndex(s => s[0] === i.schritt) > j ? "erledigt" : ""}">${j + 1}. ${n}</li>`).join("")}</ol>`;
    if (ro) return kopf + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (i.schritt === "datei") {
      return kopf + leiste + `<section class="panel upload">
        <label class="ablage" for="xl-datei"><b>Excel-Datei wählen</b><span class="gedimmt">.xlsx, .xlsm, .xls oder .csv · oder hierher ziehen</span><input id="xl-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="excelDatei"></label>
        ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}
        <div class="zwei-spalten klein"><div><h3>Was erkannt wird</h3><ul class="punkte">
          <li><b>Codes</b>: ein Vertriebscode je Zeile mit Merkmal, Bezeichnung, Preis. Spalten mit Produkt-Codes im Kopf werden als Verfügbarkeit gelesen (X = verfügbar, S = Standard).</li>
          <li><b>Regeln</b>: Wenn-Codes, Typ (sperrt, erlaubt nur, setzt/erfordert), Dann-Codes. Komma = oder, &amp; = und, „nicht“ = Ausschluss.</li>
          <li><b>Matrix</b>: Codes gegen Codes mit Kreuzen.</li>
          <li><b>Produkte, Merkmale, Katalog, Stückliste</b>: optional.</li></ul></div>
          <div><h3>Tipp</h3><p class="gedimmt">Exportieren Sie das aktuelle Modell als Excel. Die Datei zeigt genau das erwartete Format und lässt sich bearbeitet wieder importieren. Weichen Ihre Tabellen ab, ordnen Sie im nächsten Schritt Blätter und Spalten selbst zu. Die Zuordnung wird für den nächsten Import gespeichert.</p></div></div>
      </section>`;
    }
    if (i.schritt === "zuordnung") {
      const blattOpt = aktiv => `<option value="">nicht vorhanden</option>${Object.keys(i.blaetter).map(n => `<option value="${esc(n)}" ${n === aktiv ? "selected" : ""}>${esc(n)}</option>`).join("")}`;
      const karten = TYPEN.map(typ => {
        const z = i.zuo[typ] || { blatt: "", kopfzeile: 0, felder: {} }, aoa = z.blatt ? i.blaetter[z.blatt] : null, kopfz = aoa ? aoa[z.kopfzeile] || [] : [];
        const spOpt = aktiv => `<option value="">–</option>${kopfz.map((h, j) => `<option value="${j}" ${aktiv === j ? "selected" : ""}>${esc(String.fromCharCode(65 + (j % 26)))}: ${esc(String(h).slice(0, 40) || "(leer)")}</option>`).join("")}`;
        const felder = Object.keys(X.FELDER[typ].felder);
        const prodSp = typ === "codes" && aoa ? kopfz.map((h, j) => ({ h: String(h).trim(), j })).filter(x => x.h && !Object.values(z.felder).includes(x.j)) : [];
        return `<section class="panel zuo-karte${z.blatt ? "" : " leer-karte"}"><div class="panelkopf"><h3>${X.FELDER[typ].name}</h3>
          <select id="zb-${typ}" data-act="zuoBlatt" data-t="${typ}" aria-label="Blatt für ${X.FELDER[typ].name}">${blattOpt(z.blatt)}</select></div>
          ${z.blatt ? `<div class="formgitter eng">
            <div class="feld"><label for="zk-${typ}">Kopfzeile</label><input id="zk-${typ}" type="number" min="1" data-chg="zuoKopf" data-t="${typ}" value="${z.kopfzeile + 1}"></div>
            ${felder.map(f => `<div class="feld"><label for="zf-${typ}-${f}">${FELDNAMEN[f] || f}${X.FELDER[typ].pflicht.includes(f) ? " *" : ""}</label><select id="zf-${typ}-${f}" data-act="zuoFeld" data-t="${typ}" data-f="${f}">${spOpt(z.felder[f])}</select></div>`).join("")}
            ${typ === "matrix" ? `<div class="feld breit"><label for="zm-bed">Markierte Zellen bedeuten</label><select id="zm-bed" data-act="zuoMatrix"><option value="sperrt" ${z.matrixBedeutung !== "erlaubt" ? "selected" : ""}>Kombination ausgeschlossen</option><option value="erlaubt" ${z.matrixBedeutung === "erlaubt" ? "selected" : ""}>Kombination erlaubt (alles andere gesperrt)</option></select></div>` : ""}
          </div>
          ${prodSp.length ? `<div class="feld"><label>Weitere Spalten (als Produkt-Verfügbarkeit gelesen, wenn der Kopf ein Produkt-Code ist)</label><div class="chipwahl">${prodSp.map(x => `<button type="button" class="chipbtn" data-act="zuoProd" data-h="${esc(x.h)}" aria-pressed="${(z.produktSpalten || []).includes(x.h) || (S().entwurf?.produkte || []).some(p => X.norm(p.code || p.id) === X.norm(x.h))}">${esc(x.h)}</button>`).join("")}</div></div>` : ""}
          <div class="tabwrap ohne-rand vorschau-tab"><table class="kompakt"><tbody>${(aoa || []).slice(z.kopfzeile, z.kopfzeile + 4).map((r, j) => `<tr class="${j ? "" : "kopfreihe"}">${(r || []).slice(0, 12).map(c => `<td>${esc(String(c).slice(0, 30))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
          : `<p class="klein gedimmt">Nicht zugeordnet.</p>`}</section>`;
      }).join("");
      return kopf + leiste + `<div class="row zwischen" style="margin-bottom:12px"><span><b>${esc(i.datei)}</b> · ${Object.keys(i.blaetter).length} Blätter</span>
        <span class="row"><button class="btn" type="button" data-act="impZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="impPruefen">Prüfen</button></span></div>
        <div class="zuo-gitter">${karten}</div>`;
    }
    if (i.schritt === "vorschau") {
      const e = i.ergebnis, st = e.stat, diff = K.unterschiede ? K.unterschiede(mo, e.modell) : [];
      const tests = e.modell.produkte.slice(0, 40).map(p => ({ p, t: E.modelltest(e.modell, p, 40000) }));
      const gruppiert = {}; for (const x of e.warn) (gruppiert[x.blatt] ||= []).push(x);
      return kopf + leiste + `<div class="kpis">
        <div class="kpi"><b class="num">${st.produkte}</b><span>Produkte gelesen</span></div><div class="kpi"><b class="num">${st.codes}</b><span>Vertriebscodes</span></div>
        <div class="kpi"><b class="num">${st.regeln}</b><span>Regeln</span></div><div class="kpi ${e.warn.length ? "schlecht" : "gut"}"><b class="num">${e.warn.length}</b><span>Hinweise</span></div></div>
        <div class="zwei-spalten">
          <section class="panel"><div class="panelkopf"><h3>Änderungen am Entwurf</h3><span class="chip">${diff.length}</span></div>
            <div class="feld"><label for="imp-modus">Vorgehen</label><select id="imp-modus" data-act="impModus"><option value="zusammen" ${i.modus === "zusammen" ? "selected" : ""}>Zusammenführen: Codes aktualisieren, Bestehendes behalten</option><option value="ersetzen" ${i.modus === "ersetzen" ? "selected" : ""}>Ersetzen: Entwurf komplett aus der Datei neu aufbauen</option></select></div>
            ${diff.length ? `<ul class="diffliste lang">${diff.slice(0, 200).map(d => `<li><span class="chip diff-${d.art === "neu" ? "neu" : d.art === "gelöscht" ? "weg" : "mod"}">${d.art}</span><span class="gedimmt">${d.bereich}</span> ${esc(d.text)}</li>`).join("")}${diff.length > 200 ? `<li class="gedimmt">… und ${diff.length - 200} weitere</li>` : ""}</ul>` : `<p class="leer-klein">Keine Änderungen gegenüber dem Entwurf.</p>`}
          </section>
          <section class="panel"><div class="panelkopf"><h3>Hinweise</h3></div>
            ${e.warn.length ? Object.entries(gruppiert).map(([b, l]) => `<details ${l.length < 12 ? "open" : ""}><summary><b>${esc(b)}</b> · ${l.length}</summary><ul class="warnliste">${l.slice(0, 150).map(x => `<li>${x.zeile ? `<span class="mono">Z. ${x.zeile}</span> ` : ""}${esc(x.text)}</li>`).join("")}</ul></details>`).join("") : `<div class="hinweis ok">Keine Auffälligkeiten.</div>`}
            <h3 style="margin-top:8px">Modelltest nach dem Import</h3>
            <div class="tabwrap ohne-rand"><table class="kompakt"><thead><tr><th>Produkt</th><th class="r">Kombinationen</th><th class="r">gültig</th><th>Probleme</th></tr></thead><tbody>
            ${tests.map(({ p, t }) => `<tr><td>${esc(p.name)}</td><td class="r num">${K.zahl(t.total)}</td><td class="r num">${K.zahl(t.gueltig)}</td><td>${t.widersprueche ? `<span class="chip warn">${K.zahl(t.widersprueche)} Widersprüche</span> ` : ""}${t.tote.length ? `<span class="chip warn" title="${esc(t.tote.map(x => x.wert).join(", "))}">${t.tote.length} unerreichbar</span>` : ""}${!t.widersprueche && !t.tote.length ? `<span class="chip st-angenommen">ok</span>` : ""}</td></tr>`).join("")}</tbody></table></div>
          </section></div>
        <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn" type="button" data-act="impZurueck" data-s="zuordnung">Zurück zur Zuordnung</button><button class="btn gelb" type="button" data-act="impUebernehmen">In den Entwurf übernehmen</button></div>`;
    }
    const st = i.ergebnis?.stat || {};
    return kopf + leiste + `<section class="panel"><div class="hinweis ok"><b>Import übernommen.</b> ${st.produkte || 0} Produkte, ${st.codes || 0} Codes und ${st.regeln || 0} Regeln stehen jetzt im Entwurf.</div>
      <div class="row"><a class="btn" href="#studio-produkte">Produkte ansehen</a><a class="btn" href="#studio-regeln">Regeln ansehen</a><a class="btn primary" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="impZurueck" data-s="datei">Weitere Datei importieren</button></div></section>`;
  });

  K.act.excelDatei = async el => {
    const f = el.files[0]; if (!f) return;
    try {
      const bl = await dateiLesen(f);
      Object.assign(K.imp, { datei: f.name, blaetter: bl, zuo: X.zuordnungVorschlagen(bl, S().einst?.importZuordnung), schritt: "zuordnung", fehler: null });
    } catch (e) { console.error(e); K.imp.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import-vorlage" && K.imp.schritt === "datei") { e.preventDefault(); } });
  document.addEventListener("drop", e => {
    if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import-vorlage" || K.imp.schritt !== "datei") return; e.preventDefault();
    const f = e.dataTransfer?.files?.[0]; if (f) K.act.excelDatei({ files: [f] });
  });
  K.act.zuoBlatt = el => {
    const t = el.dataset.t, n = el.value;
    if (!n) delete K.imp.zuo[t];
    else { const aoa = K.imp.blaetter[n], kz = X.kopfzeile(aoa, t); K.imp.zuo[t] = { blatt: n, kopfzeile: kz, felder: X.FELDER[t] ? X.spaltenRaten(aoa[kz] || [], t) : {}, matrixBedeutung: "sperrt" }; }
    K.render();
  };
  K.inp.zuoKopf = el => { const z = K.imp.zuo[el.dataset.t]; const aoa = K.imp.blaetter[z.blatt]; z.kopfzeile = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); z.felder = X.spaltenRaten(aoa[z.kopfzeile] || [], el.dataset.t); K.render(); };
  K.act.zuoFeld = el => { const z = K.imp.zuo[el.dataset.t]; if (el.value === "") delete z.felder[el.dataset.f]; else z.felder[el.dataset.f] = +el.value; K.render(); };
  K.act.zuoMatrix = el => { K.imp.zuo.matrix.matrixBedeutung = el.value; };
  K.act.zuoProd = el => { const z = K.imp.zuo.codes; z.produktSpalten = z.produktSpalten || []; const h = el.dataset.h; z.produktSpalten = z.produktSpalten.includes(h) ? z.produktSpalten.filter(x => x !== h) : [...z.produktSpalten, h]; K.render(); };
  K.act.impZurueck = el => { K.imp.schritt = el.dataset.s; K.render(); };
  K.act.impModus = el => { K.imp.modus = el.value; K.act.impPruefen(); };
  K.act.impPruefen = () => {
    const i = K.imp;
    for (const [t, z] of Object.entries(i.zuo)) { const fehlt = X.FELDER[t].pflicht.filter(f => z.felder[f] == null); if (fehlt.length) { K.toast(`${X.FELDER[t].name}: bitte Spalte für ${fehlt.map(f => FELDNAMEN[f] || f).join(", ")} wählen.`); return; } }
    if (!i.zuo.codes && !i.zuo.regeln && !i.zuo.matrix && !i.zuo.produkte) { K.toast("Bitte mindestens ein Blatt für Codes, Produkte oder Regeln zuordnen."); return; }
    try {
      i.ergebnis = X.umwandeln(i.blaetter, i.zuo, S().entwurf, i.modus); i.schritt = "vorschau";
      for (const x of (K.artikelFehlend ? K.artikelFehlend(i.ergebnis.modell) : [])) i.ergebnis.warn.push({ blatt: "Artikelstamm", zeile: null, text: `${x.code} (${x.wo}) ist nicht in ARTIKEL.` });
    }
    catch (e) { console.error(e); K.toast("Fehler beim Umwandeln: " + e.message); }
    K.render();
  };
  K.act.impUebernehmen = async () => {
    const i = K.imp, st = i.ergebnis.stat, mo = i.ergebnis.modell;
    mo.version = S().entwurf?.version || S().live?.version || 0;
    K.Store.S.entwurf = mo;
    K.Store.entwurfGeaendert();
    // Zuordnung mit Spaltennamen speichern, damit der nächste Import sie wiederfindet
    const e = S().einst; e.importZuordnung = {};
    for (const [t, z] of Object.entries(i.zuo)) { const kopf = i.blaetter[z.blatt][z.kopfzeile] || []; e.importZuordnung[t] = { blatt: z.blatt, matrixBedeutung: z.matrixBedeutung, spaltenNamen: Object.fromEntries(Object.entries(z.felder).map(([f, j]) => [f, String(kopf[j] ?? "")])) }; }
    await K.Store.einstSpeichern(e, true);
    await K.Store.log("Import", `Excel „${i.datei}“ importiert (${i.modus === "ersetzen" ? "ersetzt" : "zusammengeführt"}): ${st.produkte} Produkte, ${st.codes} Codes, ${st.regeln} Regeln`);
    i.schritt = "fertig"; i.blaetter = null; K.render(); K.toast("Import im Entwurf gespeichert");
  };
  K.act.excelVorlage = async () => {
    const mo = S().entwurf; if (!mo) return;
    try { await K.lib("xlsx"); } catch (e) { return K.toast("Die Excel-Bibliothek (SheetJS) ist nicht erreichbar."); }
    const t = X.alsTabellen(mo), wb = window.XLSX.utils.book_new();
    for (const [n, aoa] of Object.entries(t)) {
      const ws = window.XLSX.utils.aoa_to_sheet(aoa);
      ws["!cols"] = (aoa[0] || []).map((_, j) => ({ wch: Math.min(48, Math.max(8, ...aoa.slice(0, 200).map(r => String(r[j] ?? "").length + 2))) }));
      if (n !== "Anleitung") ws["!autofilter"] = { ref: window.XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(1, aoa.length - 1), c: (aoa[0] || []).length - 1 } }) };
      window.XLSX.utils.book_append_sheet(wb, ws, n);
    }
    const buf = window.XLSX.write(wb, { bookType: "xlsx", type: "array" });
    K.speichereDatei(`Produktmodell_${new Date().toISOString().slice(0, 10)}.xlsx`, new Blob([buf]));
  };
})(typeof window !== "undefined" ? window : globalThis);


/* ===== liste.js ===== */
/* =========================================================================
   Einfacher Import einer Produktliste
   Aufbau der Liste (eine Tabelle, beliebige Reihenfolge der Spalten):
     Geschäftsart | Produktfamilie | Variante | (Merkmal) | Vertriebscode | (Bezeichnung) | (Preis) …
   - Leere Zellen in Geschäftsart, Familie, Variante, Merkmal gelten wie die Zeile darüber.
   - Zeilen ohne Code, aber mit Text, sind Zwischenüberschriften (= Merkmal).
   - Alternativ eine Spalte je Variante mit X (verfügbar) bzw. S (Standard).
   - Fehlende Bezeichnung oder Preis werden aus dem Artikelstamm (ARTIKEL) ergänzt.
   Ergebnis im Modell:
     Geschäftsart → Familie (oberste Ebene), Produktfamilie → Unterfamilie,
     Variante → konfigurierbarer Artikel, Vertriebscodes → Werte ihrer Merkmale.
   Teil 1 ist reine Logik (auch in Node testbar), Teil 2 die Oberfläche.
   ========================================================================= */
(function (root) {
  const L = {};
  const node = typeof module !== "undefined" && module.exports;
  const E = node ? require("./engine.js") : root.KONF.E;
  const norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  const txt = v => String(v ?? "").trim();
  const zahl = v => { if (typeof v === "number") return v; let s = txt(v).replace(/[€\s]|EUR/gi, ""); if (!s || s === "-") return null; if (/,\d{1,2}$/.test(s) || (s.includes(",") && s.includes("."))) s = s.replace(/\./g, "").replace(",", "."); else s = s.replace(/,/g, "."); const n = parseFloat(s); return isFinite(n) ? n : null; };
  const ja = v => /^(x|ja|j|yes|y|1|true|wahr|s|std|standard|o|opt|optional|●|✓|✔)$/i.test(txt(v));
  const istStd = v => /^(s|std|standard|serie)$/i.test(txt(v));
  const ALLE = /^(alle|\*|alle varianten|allgemein|familie)$/i;

  /* ---------- Spaltenrollen ---------- */
  L.ROLLEN = [
    ["ga", "Geschäftsart", ["geschaeftsart", "geschaeftsbereich", "geschaeftsfeld", "sparte", "segment", "anwendung", "branche", "bereich"]],
    ["familie", "Produktfamilie", ["produktfamilie", "familie", "baureihe", "produktlinie", "modellreihe", "typreihe", "serie", "produktgruppe"]],
    ["variante", "Variante", ["variante", "varianten", "variantenbezeichnung", "ausfuehrung", "modell", "typ", "fahrzeug", "fahrzeugtyp"]],
    ["variantNr", "Artikelnummer der Variante", ["artikelnummerdervariante", "artikelnrdervariante", "nummerdervariante", "variantenartikelnr", "variantenr", "variantennummer", "variantenartikel", "variantenartikelnummer", "fahrzeugnummer", "fahrzeugartikel", "grundartikel", "kmat", "grundmaschine", "variantennr"]],
    ["variantPreis", "Grundpreis der Variante", ["grundpreis", "basispreis", "fahrzeugpreis", "variantenpreis", "grundpreisvariante"]],
    ["merkmal", "Merkmal (Gruppe der Codes)", ["merkmal", "merkmale", "merkmalgruppe", "optionsgruppe", "optionsart", "kategorie", "baugruppe", "kapitel", "gruppe"]],
    ["code", "Vertriebscode (Artikelnummer)", ["vertriebscode", "vertriebscodes", "vkcode", "verkaufscode", "salescode", "optionscode", "code", "artikelnummer", "artikelnr", "artikel", "option"]],
    ["name", "Bezeichnung des Codes", ["bezeichnung", "text", "beschreibung", "kurztext", "name", "optionstext", "artikelbezeichnung"]],
    ["preis", "Preis des Codes", ["preis", "vkpreis", "listenpreis", "aufpreis", "verkaufspreis", "vk", "preiseur"]],
    ["kosten", "Kosten des Codes", ["kosten", "ek", "ekpreis", "herstellkosten", "selbstkosten"]],
    ["standard", "Standard (ja/nein)", ["standard", "serienmaessig", "default", "vorbelegung", "std"]],
    ["xvariante", "Spalte einer Variante (X = verfügbar)", []],
    ["", "nicht verwenden", []]
  ];
  L.rollenName = Object.fromEntries(L.ROLLEN.map(r => [r[0], r[1]]));

  L.kopfzeile = aoa => {
    const syn = L.ROLLEN.flatMap(r => r[2]); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(15, aoa.length); i++) {
      const z = aoa[i] || [], s = z.filter(c => syn.includes(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0);
      if (s > bs) { bs = s; best = i; }
    }
    return best;
  };
  /** Rolle je Spalte raten. istVariante(h) prüft, ob ein Spaltenkopf eine bekannte Variante ist. */
  L.raten = (aoa, kz, istVariante) => {
    const kopf = aoa[kz] || [], daten = aoa.slice(kz + 1, kz + 60), rollen = kopf.map(() => ""), belegt = new Set();
    const n = kopf.map(norm);
    for (const [rolle, , syn] of L.ROLLEN) {
      if (!syn.length) continue;
      let i = -1;
      for (const s of syn) { i = n.findIndex((h, j) => h === s && !rollen[j]); if (i >= 0) break; }
      if (i < 0) for (const s of syn) { if (s.length < 4) continue; i = n.findIndex((h, j) => h && h.includes(s) && !rollen[j]); if (i >= 0) break; }
      if (i >= 0 && !belegt.has(rolle)) { rollen[i] = rolle; belegt.add(rolle); }
    }
    // "… der Variante" / "Varianten…" mit Nummer oder Artikel im Namen
    if (!belegt.has("variantNr")) n.forEach((h, j) => { if (!belegt.has("variantNr") && /variante/.test(h) && /(artikel|nummer|nr)/.test(h) && rollen[j] !== "variante") { if (rollen[j] === "code") belegt.delete("code"); rollen[j] = "variantNr"; belegt.add("variantNr"); } });
    // Spalten mit fast nur X/S/leer → Variante als Spalte
    kopf.forEach((h, j) => {
      if (rollen[j] || !txt(h)) return;
      const werte = daten.map(r => txt(r?.[j])).filter(Boolean);
      if ((werte.length && werte.every(v => /^(x|s|o|ja|nein|-|●|✓)$/i.test(v))) || (istVariante && istVariante(txt(h)))) rollen[j] = "xvariante";
    });
    return gruppenRollenPruefen(aoa, kz, rollen);
  };
  /** Eine Spalte taugt nur als Familie/Geschäftsart/Gruppe, wenn sich ihre Werte wiederholen (sonst ist es Text je Code) */
  L.gruppenSpalteOk = (aoa, kz, j) => {
    const w = aoa.slice(kz + 1, kz + 400).map(r => txt(r?.[j])).filter(Boolean); if (w.length < 6) return true;
    return new Set(w.map(norm)).size <= Math.max(6, w.length * 0.3);
  };
  const gruppenRollenPruefen = (aoa, kz, rollen) => rollen.map((r, j) => ["ga", "familie", "merkmal"].includes(r) && !L.gruppenSpalteOk(aoa, kz, j) ? "" : r);
  L.praefix = c => { const s = txt(c).toUpperCase(); const m = s.match(/^([A-ZÄÖÜ]+)[-_ .]?(?=\d|[-_ .])/) || s.match(/^([A-ZÄÖÜ]+)-/); return m ? m[1] : (/[\d\W_]/.test(s) ? s.replace(/[\d\W_].*$/, "") : s.slice(0, 1)) || s.slice(0, 1); };

  /**
   * Liste → Zusammenstellung (neutral, im Assistenten änderbar)
   * opts: { fuellen: true, artikel: code => {name, preis, kosten} | null }
   */
  L.zusammenstellen = (aoa, kz, rollen, opts = {}) => {
    const fuellen = opts.fuellen !== false, art = opts.artikel || (() => null);
    const idx = r => rollen.indexOf(r), hat = r => idx(r) >= 0, wert = (row, r) => hat(r) ? row[idx(r)] : "";
    const xs = rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
    const kopf = aoa[kz] || [];
    const zs = { ga: new Map(), fam: new Map(), var: new Map(), merkmale: new Map(), codes: new Map(), warn: [], zeilen: 0 };
    const w = (zeile, text) => zs.warn.push({ zeile, text });
    let cGa = "", cFam = "", cVar = "", cVarNr = "", cM = "";
    const merkmalKey = name => { const k = norm(name) || "ohne"; if (!zs.merkmale.has(k)) zs.merkmale.set(k, { key: k, name: txt(name) || "Ohne Merkmal", mehrfach: /zubehoer|option|ausstattung|extras|sonder/.test(k), auto: false }); return k; };
    const famKey = (ga, fam) => (ga ? norm(ga) + "/" : "") + (norm(fam) || "import");
    const varAnlegen = (fk, nr, name, zeile) => {
      const key = fk + "|" + (norm(nr) || norm(name));
      if (!zs.var.has(key)) {
        const a = art(nr) || art(name);
        zs.var.set(key, { key, fam: fk, code: txt(nr) || (a ? a.code : txt(name)), name: txt(name) && txt(name) !== txt(nr) ? txt(name) : (a?.name || txt(name) || txt(nr)), preis: null, kosten: null, zeile });
        if (a && !txt(nr)) zs.var.get(key).code = a.code;
      }
      return key;
    };
    const famAnlegen = (ga, fam) => {
      if (ga && !zs.ga.has(norm(ga))) zs.ga.set(norm(ga), { key: norm(ga), name: txt(ga) });
      const fk = famKey(ga, fam); if (!zs.fam.has(fk)) zs.fam.set(fk, { key: fk, name: txt(fam) || txt(ga) || "Import", ga: ga ? norm(ga) : null });
      return fk;
    };
    aoa.slice(kz + 1).forEach((row, i) => {
      const zeile = kz + 2 + i; if (!row || !row.some(c => txt(c))) return;
      zs.zeilen++;
      const ga = txt(wert(row, "ga")), fam = txt(wert(row, "familie")), va = txt(wert(row, "variante")), vnr = txt(wert(row, "variantNr")), mk = txt(wert(row, "merkmal")), code = txt(wert(row, "code"));
      // Ebenenwechsel setzt die darunterliegenden Ebenen zurück
      if (ga && ga !== cGa) { cGa = ga; cFam = ""; cVar = ""; cVarNr = ""; cM = ""; }
      if (fam && fam !== cFam) { cFam = fam; cVar = ""; cVarNr = ""; cM = ""; }
      if ((va && va !== cVar) || (vnr && vnr !== cVarNr)) { cVar = va || (vnr && !va ? "" : cVar); cVarNr = vnr || (va ? "" : cVarNr); cM = ""; }
      if (mk) cM = mk;
      const eGa = ga || (fuellen ? cGa : ""), eFam = fam || (fuellen ? cFam : ""), eVa = va || (fuellen ? cVar : ""), eVnr = vnr || (fuellen ? cVarNr : ""), eM = mk || (fuellen ? cM : "");
      if (!hat("familie") && !hat("ga") && !eFam) cFam = "Import";
      const fk = famAnlegen(eGa, eFam || (hat("familie") ? "" : (hat("ga") ? eGa : "Import")));
      // Variante dieser Zeile ("alle" oder leer bei fehlender Variantenspalte = ganze Familie)
      let vk = null;
      if ((eVa || eVnr) && !ALLE.test(eVa)) vk = varAnlegen(fk, eVnr, eVa, zeile);
      if (vk && hat("variantPreis")) { const p = zahl(wert(row, "variantPreis")); const v = zs.var.get(vk); if (p != null && v.preis == null) v.preis = p; }
      if (!code) {
        // Zwischenüberschrift ohne Merkmal-Spalte
        const t = txt(wert(row, "name")); if (t && !hat("merkmal") && !va && !vnr) cM = t;
        return;
      }
      const ck = code.toUpperCase();
      let c = zs.codes.get(ck);
      const a = art(code);
      if (!c) { c = { code, name: "", preis: null, kosten: null, merkmal: eM ? merkmalKey(eM) : null, varianten: new Set(), famAlle: new Set(), std: new Set(), zeile }; zs.codes.set(ck, c); }
      else if (eM && c.merkmal && c.merkmal !== norm(eM)) w(zeile, `Code ${code} steht bei „${eM}“ und bei „${zs.merkmale.get(c.merkmal)?.name}“. Er wird beim ersten Merkmal geführt.`);
      if (!c.merkmal && eM) c.merkmal = merkmalKey(eM);
      if (!c.name) c.name = txt(wert(row, "name")) || a?.name || "";
      if (c.preis == null) c.preis = hat("preis") ? zahl(wert(row, "preis")) : null;
      if (c.preis == null && a?.preis) c.preis = a.preis;
      if (c.kosten == null) c.kosten = hat("kosten") ? zahl(wert(row, "kosten")) : (a?.kosten ?? null);
      const std = hat("standard") && ja(wert(row, "standard"));
      if (xs.length) {
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const xk = varAnlegen(fk, "", txt(kopf[j]), zeile); c.varianten.add(xk); if (istStd(v)) c.std.add(xk); }
      }
      if (vk) { c.varianten.add(vk); if (std) c.std.add(vk); }
      else if (!xs.length) c.famAlle.add(fk);
    });
    // Familien ohne Variante: Familie selbst wird zur Variante
    for (const f of zs.fam.values()) if (![...zs.var.values()].some(v => v.fam === f.key)) {
      const vk = varAnlegen(f.key, "", f.name, null);
      for (const c of zs.codes.values()) if (c.famAlle.has(f.key)) { c.varianten.add(vk); c.famAlle.delete(f.key); }
    }
    // Codes ohne Merkmal: zuerst aus dem bestehenden Modell, sonst nach Code-Anfang gruppieren
    if (opts.merkmalVon) { let n = 0; for (const c of zs.codes.values()) if (!c.merkmal) { const t = opts.merkmalVon(c.code); if (t) { c.merkmal = merkmalKey(t.name); zs.merkmale.get(c.merkmal).mehrfach = t.mehrfach; n++; } } if (n) w(null, `${n} Codes ohne Merkmal wurden dem Merkmal zugeordnet, in dem sie im Modell schon stehen.`); }
    const ohne = [...zs.codes.values()].filter(c => !c.merkmal);
    if (ohne.length) {
      for (const c of ohne) { const p = L.praefix(c.code), k = merkmalKey("Codes " + p); zs.merkmale.get(k).auto = true; c.merkmal = k; }
      w(null, `${ohne.length} Codes hatten kein Merkmal und wurden nach ihrem Anfang gruppiert. Bitte die Gruppen in der Zusammenstellung benennen oder zusammenführen.`);
    }
    for (const v of zs.var.values()) if (![...zs.codes.values()].some(c => c.varianten.has(v.key) || c.famAlle.has(v.fam))) w(v.zeile, `Variante „${v.name}“ hat keine Codes.`);
    if (opts.artikel && opts.artikelGeladen) {
      const fehlt = [...zs.codes.values()].filter(c => !art(c.code)).map(c => c.code);
      if (fehlt.length) w(null, `${fehlt.length} Codes sind nicht im Artikelstamm: ${fehlt.slice(0, 15).join(", ")}${fehlt.length > 15 ? " …" : ""}`);
    }
    return zs;
  };

  /** Kennzahlen einer Zusammenstellung */
  L.zahlen = zs => ({ ga: zs.ga.size, fam: zs.fam.size, var: zs.var.size, merkmale: [...zs.merkmale.values()].filter(m => [...zs.codes.values()].some(c => c.merkmal === m.key)).length, codes: zs.codes.size });

  /** Codes einer Variante (inkl. Codes, die für die ganze Familie gelten) */
  L.codesVon = (zs, v) => [...zs.codes.values()].filter(c => c.varianten.has(v.key) || c.famAlle.has(v.fam));

  /**
   * Zusammenstellung → Modell.  opts: { ersetzen: false, zusammenfassen: true }
   */
  L.inModell = (zs, basis, opts = {}) => {
    const mo = opts.ersetzen || !basis ? { version: basis?.version || 0, gruppen: [], produkte: [], merkmale: [], regeln: opts.ersetzen ? [] : (basis?.regeln || []) } : JSON.parse(JSON.stringify(basis));
    if (opts.ersetzen && basis) mo.regeln = [];
    const stat = { gaNeu: 0, famNeu: 0, artNeu: 0, artGeaendert: 0, merkmalNeu: 0, codesNeu: 0, codesGeaendert: 0, zusammengefasst: 0 };
    const eindeutig = (basisId, liste) => { let id = basisId || "x", n = 2; while (liste.some(x => x.id === id)) id = basisId + "-" + n++; return id; };
    // Geschäftsarten und Familien
    const gaId = new Map(), famId = new Map();
    for (const ga of zs.ga.values()) {
      let g = mo.gruppen.find(x => !x.eltern && norm(x.name) === ga.key);
      if (!g) { g = { id: eindeutig(E.slug(ga.name), mo.gruppen), name: ga.name, eltern: null, merkmale: [] }; mo.gruppen.push(g); stat.gaNeu++; }
      gaId.set(ga.key, g.id);
    }
    const mitVar = new Set([...zs.var.values()].map(v => v.fam));
    for (const f of zs.fam.values()) {
      if (!mitVar.has(f.key)) continue; // Familien ohne Fahrzeuge nicht anlegen
      const eltern = f.ga ? gaId.get(f.ga) : null;
      let g = mo.gruppen.find(x => norm(x.name) === norm(f.name) && (x.eltern || null) === eltern) || (!eltern ? null : mo.gruppen.find(x => norm(x.name) === norm(f.name)));
      if (!g) { g = { id: eindeutig(E.slug(f.name), mo.gruppen), name: f.name, eltern, merkmale: [] }; mo.gruppen.push(g); stat.famNeu++; }
      else if (eltern && g.id !== eltern) g.eltern = eltern;
      famId.set(f.key, g.id);
    }
    // Merkmale und Werte
    const mId = new Map(), wertVon = new Map(); // code -> {m, w}
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) wertVon.set(w.code.toUpperCase(), { m, w });
    // Grundausstattung wird ein Merkmal, dessen Codes den Feldtyp „fest enthalten“ haben (wie im Katalogaufbau)
    const genutzt = [...zs.merkmale.values()].filter(m => [...zs.codes.values()].some(c => c.merkmal === m.key));
    const festeKeys = new Set();
    for (const zm of genutzt) {
      const codes = [...zs.codes.values()].filter(c => c.merkmal === zm.key);
      let m = mo.merkmale.find(x => norm(x.name) === norm(zm.name));
      if (!m) { // gleiches Merkmal an den Codes erkennen
        const z = new Map(); for (const c of codes) { const t = wertVon.get(c.code.toUpperCase()); if (t) z.set(t.m, (z.get(t.m) || 0) + 1); }
        const best = [...z.entries()].sort((a, b) => b[1] - a[1])[0]; if (best && best[1] >= Math.ceil(codes.length / 2)) m = best[0];
      }
      if (!m) { m = { id: eindeutig(E.slug(zm.name).replace(/-/g, "") || "m", mo.merkmale), name: zm.name, abschnitt: "", typ: zm.mehrfach || zm.fest ? "mehrfach" : "einfach", bereich: zm.mehrfach || zm.fest ? "Optionen" : "Grundmaschine", werte: [] }; mo.merkmale.push(m); stat.merkmalNeu++; }
      else { m.name = zm.name; if (zm.mehrfach !== undefined) { m.typ = zm.mehrfach ? "mehrfach" : "einfach"; if (!m.bereich) m.bereich = zm.mehrfach ? "Optionen" : "Grundmaschine"; } }
      mId.set(zm.key, m.id);
      for (const c of codes) {
        const t = wertVon.get(c.code.toUpperCase());
        let w = t?.w;
        if (t && t.m !== m) { t.m.werte = t.m.werte.filter(x => x !== w); m.werte.push(w); for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (z.id === t.m.id && z.werte) z.werte = z.werte.filter(x => x !== w.id); }
        if (!w) { w = { id: eindeutig(c.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), m.werte), code: c.code, name: c.name || c.code, preis: c.preis || 0, kosten: c.kosten || 0, stl: [] }; m.werte.push(w); stat.codesNeu++; }
        else { const vorher = JSON.stringify([w.name, w.preis, w.kosten]); if (c.name) w.name = c.name; if (c.preis != null) w.preis = c.preis; if (c.kosten != null) w.kosten = c.kosten; if (vorher !== JSON.stringify([w.name, w.preis, w.kosten])) stat.codesGeaendert++; }
        if (c.stl && c.stl.length) w.stl = c.stl.map(z => z.slice());
        if (zm.fest) w.feld = "fest"; else if (w.feld === "fest") delete w.feld;
        wertVon.set(c.code.toUpperCase(), { m, w });
      }
    }
    // Varianten → konfigurierbare Artikel
    const reihen = genutzt.map(zm => mId.get(zm.key));
    for (const v of zs.var.values()) {
      const gruppe = famId.get(v.fam);
      let p = mo.produkte.find(x => v.code && norm(x.code) === norm(v.code)) || mo.produkte.find(x => norm(x.name) === norm(v.name) && x.gruppe === gruppe);
      if (!p) {
        const t = (v.name + " " + (mo.gruppen.find(g => g.id === gruppe)?.name || "")).toLowerCase();
        p = { id: eindeutig(String(v.code || v.name).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40), mo.produkte), code: v.code, name: v.name, gruppe, artnr: v.code, basispreis: v.preis || 0, basiskosten: v.kosten || 0, aktiv: true, beschreibung: "",
          visual: { typ: /tiefbett/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst|logo/.test(t) ? "nachlaeufer" : "semi", asset: null }, stl: [], merkmale: [] };
        mo.produkte.push(p); stat.artNeu++;
      } else { p.gruppe = gruppe; if (v.preis != null) p.basispreis = v.preis; if (v.name) p.name = v.name; stat.artGeaendert++; }
      const codes = L.codesVon(zs, v), nachM = new Map();
      // Reihenfolge der Preisliste merken: daraus gliedert der Katalogaufbau nach ZZ (Überschrift) und YY (Untergruppe)
      if (zs.folge && zs.folge.length) { const pz = zs.praefix || {}, hat = new Set(codes.map(c => c.code.toUpperCase())), mark = c => [pz.ueber, pz.option].some(x => x && c.toUpperCase().startsWith(x.toUpperCase())); p.codeFolge = zs.folge.filter(c => mark(c) || hat.has(c.toUpperCase())); p._gliedern = true; }
      // feste Grundausstattung (Überschriften nur mit GA-Codes)
      const fest = codes.filter(c => festeKeys.has(c.merkmal));
      if (fest.length || zs.mappe) {
        delete p.grundausstattung; // feste Codes stehen als Werte mit Feldtyp „fest“ im Modell und kosten im Angebot ihren Preis
        if (v.stl && v.stl.length) p.stl = v.stl.map(z => z.slice());
      } else if (v.stl && v.stl.length) p.stl = v.stl.map(z => z.slice());
      for (const c of codes) { const t = wertVon.get(c.code.toUpperCase()); if (!t) continue; if (!nachM.has(t.m.id)) nachM.set(t.m.id, { ids: [], std: [] }); nachM.get(t.m.id).ids.push(t.w.id); if (c.std.has(v.key)) nachM.get(t.m.id).std.push(t.w.id); }
      // eigene Zuordnungen für importierte Merkmale ersetzen, übrige behalten
      p.merkmale = (p.merkmale || []).filter(z => !nachM.has(z.id)); delete p.reihenfolge;
      for (const mid of reihen) {
        const e = nachM.get(mid); if (!e) continue; const m = E.merkmal(mo, mid);
        const ids = m.werte.map(w => w.id).filter(id => e.ids.includes(id));
        p.merkmale.push({ id: mid, werte: ids.length === m.werte.length ? null : ids, ...(e.std.length && m.typ !== "mehrfach" ? { standard: e.std[0] } : {}) });
      }
    }
    if (zs.texte) mo.codeTexte = Object.assign(mo.codeTexte || {}, zs.texte);
    // Gemeinsame Merkmale an Familie und Geschäftsart übergeben (von unten nach oben, dann Feinschliff)
    if (opts.zusammenfassen !== false) {
      // Geschäftsart nur, wenn sie mehrere Familien hat; sonst bleiben die Merkmale an der Produktfamilie
      const fams = [...new Set([...famId.values()])], gas = [...new Set([...gaId.values()])].filter(id => mo.gruppen.filter(g => g.eltern === id).length >= 2);
      for (const id of [...fams, ...gas.filter(x => !fams.includes(x)), ...fams]) stat.zusammengefasst += E.hochziehen(mo, id) || 0;
    }
    return { modell: mo, stat };
  };

  /** Beispielliste im erwarteten Aufbau (für "Beispiel herunterladen") */
  L.beispiel = () => [
    ["Geschäftsart", "Produktfamilie", "Variante", "Artikelnummer der Variante", "Grundpreis", "Merkmal", "Vertriebscode", "Bezeichnung", "Preis"],
    ["Holztransport", "Logo12", "Logo12 2-achsig", "LOGO12-2A", 29800, "Achsanzahl", "A2", "2 Achsen", 0],
    ["", "", "", "", "", "Lenkung", "L0", "Starrachsen", 0],
    ["", "", "", "", "", "", "LZM", "Zwangslenkung mechanisch", 8900],
    ["", "", "", "", "", "Rungenpaare", "RP2", "2 Rungenpaare", 0],
    ["", "", "", "", "", "", "RP3", "3 Rungenpaare", 1450],
    ["", "", "", "", "", "Farbe", "RAL9005", "RAL 9005 Tiefschwarz", 0],
    ["", "", "", "", "", "", "RAL5010", "RAL 5010 Enzianblau", 0],
    ["", "", "Logo12 3-achsig", "LOGO12-3A", 36500, "Achsanzahl", "A3", "3 Achsen", 6800],
    ["", "", "", "", "", "Lenkung", "LZM", "Zwangslenkung mechanisch", 8900],
    ["", "", "", "", "", "", "LZH", "Hydraulische Zwangslenkung", 18500],
    ["", "", "", "", "", "Rungenpaare", "RP3", "3 Rungenpaare", 1450],
    ["", "", "", "", "", "", "RP4", "4 Rungenpaare", 2900],
    ["", "", "", "", "", "Farbe", "RAL9005", "RAL 9005 Tiefschwarz", 0],
    ["", "", "", "", "", "", "RAL5010", "RAL 5010 Enzianblau", 0],
    ["", "", "alle", "", "", "Ausstattung", "Z-LED", "LED-Beleuchtung komplett", 980],
    ["", "", "", "", "", "", "Z-WK", "Werkzeugkasten", 420],
    ["Schwertransport", "Tiefbett T4", "Tiefbett T4 Standard", "TB_T4P_S3F", 79500, "Achsanzahl", "A4", "4 Achsen", 14500],
    ["", "", "", "", "", "", "A5", "5 Achsen", 23800],
    ["", "", "", "", "", "Schwanenhals", "SH-F", "Fest", 0],
    ["", "", "", "", "", "", "SH-AH", "Hydraulisch abnehmbar", 16800]
  ];

  /* =====================================================================
     Arbeitsmappe mit mehreren Blättern (z. B. Preisliste, Import, Modell-Code-Kombinatorik,
     Prio MCK, Produkte Typen, Teileverwendungsnachweis, Geänderte Preise)
     ===================================================================== */
  L.INHALTE = [
    ["codes", "Preisliste / Konfigurationscodes", ["ga", "familie", "variante", "variantNr", "merkmal", "rang", "status", "code", "name", "preis", "kosten", "standard", "xvariante"]],
    ["artikel", "Artikelstamm", ["code", "name", "preis", "kosten", "me"]],
    ["kombi", "Zulässige Codes je Modell (Kombinatorik)", ["familie", "variante", "variantNr", "code", "standard", "xvariante"]],
    ["prio", "Reihenfolge und Überschriften", ["merkmal", "rang", "status", "code", "name"]],
    ["modelle", "Modelle / Produkttypen", ["ga", "familie", "variante", "variantNr", "variantPreis"]],
    ["stl", "Stückliste (Teileverwendung)", ["variante", "variantNr", "code", "teil", "name", "menge", "me"]],
    ["preise", "Geänderte Preise", ["variante", "code", "preis", "kosten"]],
    ["liste", "Produktliste (alles in einer Tabelle)", ["ga", "familie", "variante", "variantNr", "variantPreis", "merkmal", "code", "name", "preis", "kosten", "standard", "xvariante"]],
    ["", "nicht verwenden", []]
  ];
  L.inhaltName = Object.fromEntries(L.INHALTE.map(x => [x[0], x[1]]));
  L.ROLLEN_EXTRA = [["rang", "Reihenfolge / Rang", ["rangfolge", "rang", "prio", "prioritaet", "reihenfolge", "sortierung", "pos", "position"]],
    ["status", "Art des Codes (Grundausstattung/Option)", ["konfigurationsstatus", "status", "codeart", "art", "kennzeichen", "typ"]],
    ["teil", "Artikelnummer des Bauteils", ["teil", "teilenummer", "komponente", "material", "artikel", "artikelnummer", "artikelnr"]],
    ["menge", "Menge", ["menge", "anzahl", "stueck", "stk"]], ["me", "Mengeneinheit", ["me", "mengeneinheit", "einheit"]]];
  for (const r of L.ROLLEN_EXTRA) L.rollenName[r[0]] = r[1];
  // Spaltennamen je Blattinhalt (zuerst geprüft)
  const SYN_INHALT = {
    codes: { familie: ["produktgruppe", "produktfamilie", "familie", "baureihe"], variante: ["modell", "modelle", "variante", "typ"], merkmal: ["ueberschrift", "gruppe", "merkmal"], code: ["code", "konfigurationscode", "vertriebscode", "vkcode", "codes"], name: ["ausstattungsposition", "ausstattung", "bezeichnung", "benennung", "codebezeichnung", "text", "position"], preis: ["preisaufschlag", "aufschlag", "aufpreis", "preis", "vkpreis", "listenpreis", "preiseur"], status: ["konfigurationsstatus", "status", "codeart", "art"] },
    artikel: { code: ["artikel", "artikelnummer", "artikelnr", "teilenummer"], name: ["benennung", "bezeichnung", "artikelbezeichnung", "text"], preis: ["vkpreis", "listenpreis", "preis", "verkaufspreis"], kosten: ["herstellkosten", "sek", "mek", "kosten", "selbstkosten"], me: ["me", "mengeneinheit", "einheit"] },
    kombi: { code: ["code", "konfigurationscode", "vertriebscode", "codes"], variante: ["modell", "variante", "typ"], familie: ["produktgruppe", "familie"] },
    prio: { merkmal: ["ueberschrift", "gruppe"], rang: ["rangfolge", "rang", "prio", "prioritaet", "reihenfolge"], code: ["code"], name: ["codebezeichnung", "bezeichnung", "text"], status: ["status"] },
    modelle: { familie: ["produktgruppe", "produktfamilie", "familie", "baureihe"], variante: ["modell", "typ", "produkttyp", "bezeichnung", "modellbezeichnung"], variantNr: ["artikel", "artikelnummer", "modellcode", "typcode", "code", "modellnummer"], variantPreis: ["grundpreis", "preis", "vkpreis", "listenpreis"], ga: ["geschaeftsart", "sparte", "bereich"] },
    stl: { code: ["code", "konfigurationscode", "vertriebscode", "option", "optionscode"], teil: ["artikel", "teil", "teilenummer", "komponente", "material", "artikelnummer"], name: ["benennung", "bezeichnung", "text"], menge: ["menge", "anzahl"], me: ["me", "einheit"], variante: ["modell", "typ"] },
    preise: { code: ["code", "artikel", "konfigurationscode"], preis: ["neuerpreis", "preisneu", "geaenderterpreis", "neu", "preis", "vkpreis"], variante: ["modell"] }
  };
  L.inhaltRaten = (name, aoa) => {
    const n = norm(name);
    if (/teileverwendung|stueckliste|stkl|bom/.test(n)) return "stl";
    if (/geaendert.*preis|preisaenderung|neuepreise/.test(n)) return "preise";
    if (/kombinatorik|zulaessig|codekombination/.test(n)) return "kombi";
    if (/prio|rangfolge|reihenfolge/.test(n)) return "prio";
    if (/produktetypen|produkttypen|typen|modelle/.test(n)) return "modelle";
    if (/^import$|artikelstamm|artikel$/.test(n)) return "artikel";
    if (/preisliste|konfiguration|codes/.test(n)) return "codes";
    if (/export|sonderwunsch|anleitung|hinweis|deckblatt|info/.test(n)) return "";
    return "";
  };
  /** Spaltenrollen für ein Blatt bestimmten Inhalts */
  L.ratenInhalt = (aoa, kz, inhalt, istVariante) => {
    const erlaubt = (L.INHALTE.find(x => x[0] === inhalt) || [, , []])[2]; if (!erlaubt.length) return (aoa[kz] || []).map(() => "");
    if (inhalt === "liste") return L.raten(aoa, kz, istVariante);
    const kopf = aoa[kz] || [], n = kopf.map(norm), rollen = kopf.map(() => ""), syn = SYN_INHALT[inhalt] || {};
    const allg = Object.fromEntries([...L.ROLLEN, ...L.ROLLEN_EXTRA].map(r => [r[0], r[2]]));
    const liste = rolle => syn[rolle] || allg[rolle] || [];
    for (const rolle of erlaubt) { // 1. exakte Treffer
      if (rolle === "xvariante") continue; let i = -1;
      for (const s of liste(rolle)) { i = n.findIndex((h, j) => h === s && !rollen[j]); if (i >= 0) break; }
      if (i >= 0) rollen[i] = rolle;
    }
    for (const rolle of erlaubt) { // 2. Teiltreffer für noch fehlende Rollen
      if (rolle === "xvariante" || rollen.includes(rolle)) continue; let i = -1;
      for (const s of liste(rolle)) { if (s.length < 4) continue; i = n.findIndex((h, j) => h && h.includes(s) && !rollen[j]); if (i >= 0) break; }
      if (i >= 0) rollen[i] = rolle;
    }
    if (erlaubt.includes("xvariante")) {
      const daten = aoa.slice(kz + 1, kz + 80);
      kopf.forEach((h, j) => { if (rollen[j] || !txt(h)) return; const w = daten.map(r => txt(r?.[j])).filter(Boolean); if ((w.length && w.every(v => /^(x|s|o|ja|nein|-|●|✓|0|1)$/i.test(v))) || (istVariante && istVariante(txt(h)))) rollen[j] = "xvariante"; });
    }
    return inhalt === "codes" ? gruppenRollenPruefen(aoa, kz, rollen) : rollen;
  };
  L.kopfzeileInhalt = (aoa, inhalt) => {
    const syn = new Set([...Object.values(SYN_INHALT[inhalt] || {}).flat(), ...L.ROLLEN.flatMap(r => r[2])]); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(20, aoa.length); i++) { const z = aoa[i] || [], s = z.filter(c => syn.has(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0); if (s > bs) { bs = s; best = i; } }
    return best;
  };

  /** Art eines Codes: "ZZ" Überschrift, "GA" Grundausstattung, "YY" Option */
  L.codeArt = (code, status, pz) => {
    const s = norm(status), c = txt(code).toUpperCase();
    if (/ueberschrift|gruppe|kapitel|^zz/.test(s)) return "ZZ";
    if (/grund|serie|standard|^ga$|inklusive/.test(s)) return "GA";
    if (/option|sonder|extra|^yy$|zusatz/.test(s)) return "YY";
    const p = pz || {};
    if (p.ueber && c.startsWith(p.ueber.toUpperCase())) return "ZZ";
    if (p.grund && c.startsWith(p.grund.toUpperCase())) return "GA";
    if (p.option && c.startsWith(p.option.toUpperCase())) return "YY";
    return "YY";
  };

  /**
   * Arbeitsmappe → Zusammenstellung
   * cfg: { ga: "Holztransport", praefix: {ueber, grund, option}, blaetter: { name: {inhalt, kz, rollen} }, fuellen }
   */
  L.zusammenstellenMappe = (bl, cfg, opts = {}) => {
    const pz = cfg.praefix || { ueber: "ZZ", grund: "GA", option: "YY" }, fuellen = cfg.fuellen !== false;
    const zs = { ga: new Map(), fam: new Map(), var: new Map(), merkmale: new Map(), codes: new Map(), warn: [], zeilen: 0, artikelstamm: [], mappe: true, folge: [], texte: {}, praefix: pz };
    const w = (blatt, zeile, text) => zs.warn.push({ zeile: zeile ? `${blatt} ${zeile}` : blatt, text });
    const blaetter = Object.entries(cfg.blaetter || {}).filter(([n, b]) => b.inhalt && bl[n]);
    const von = inh => blaetter.filter(([, b]) => b.inhalt === inh);
    const zeilenVon = (name, b) => { const aoa = bl[name], ix = r => b.rollen.indexOf(r); return aoa.slice(b.kz + 1).map((row, i) => ({ row, z: b.kz + 2 + i, g: r => ix(r) >= 0 ? row?.[ix(r)] : "", hat: r => ix(r) >= 0 })).filter(x => x.row && x.row.some(c => txt(c))); };
    // 1) Artikelstamm
    const amap = new Map();
    for (const [name, b] of von("artikel")) for (const { g } of zeilenVon(name, b)) {
      const code = txt(g("code")); if (!code) continue;
      const a = { code, name: txt(g("name")), preis: zahl(g("preis")), kosten: zahl(g("kosten")), me: txt(g("me")) };
      amap.set(code.toUpperCase(), a); zs.artikelstamm.push({ ARTIKEL: a.code, NAME: a.name, VKPREIS: a.preis ?? "", HERSTELLKOSTEN: a.kosten ?? "", ME: a.me });
    }
    const art = c => !c ? null : amap.get(txt(c).toUpperCase()) || (opts.artikel ? opts.artikel(c) : null);
    // Hilfen für Familien und Varianten
    const gaStd = txt(cfg.ga);
    const famAnlegen = (ga, fam) => {
      ga = txt(ga) || gaStd; fam = txt(fam);
      if (ga && !zs.ga.has(norm(ga))) zs.ga.set(norm(ga), { key: norm(ga), name: ga });
      const name = fam || ga || "Import", fk = (ga ? norm(ga) + "/" : "") + norm(name);
      if (!zs.fam.has(fk)) zs.fam.set(fk, { key: fk, name, ga: ga ? norm(ga) : null });
      return fk;
    };
    const varFinden = (nrOderName) => { const n = norm(nrOderName); return [...zs.var.values()].find(v => norm(v.code) === n || norm(v.name) === n); };
    const varAnlegen = (fk, nr, name, zeile) => {
      const vorhanden = varFinden(nr) || varFinden(name); if (vorhanden) return vorhanden.key;
      const a = art(nr) || art(name), key = fk + "|" + (norm(nr) || norm(name));
      zs.var.set(key, { key, fam: fk, code: txt(nr) || (a ? a.code : txt(name)), name: txt(name) && txt(name) !== txt(nr) ? txt(name) : (a?.name || txt(name) || txt(nr)), preis: null, kosten: null, zeile, stl: [] });
      return key;
    };
    // 2) Modelle / Produkttypen
    for (const [name, b] of von("modelle")) { let cGa = "", cFam = ""; for (const { g, z } of zeilenVon(name, b)) {
      const ga = txt(g("ga")) || (fuellen ? cGa : ""), fam = txt(g("familie")) || (fuellen ? cFam : ""); if (txt(g("ga"))) cGa = ga; if (txt(g("familie"))) cFam = fam;
      const va = txt(g("variante")), nr = txt(g("variantNr")); if (!va && !nr) continue;
      const vk = varAnlegen(famAnlegen(ga, fam), nr, va, z), p = zahl(g("variantPreis")); if (p != null) zs.var.get(vk).preis = p;
    } }
    // 3) Reihenfolge und Überschriften
    const prio = new Map(); let rangLauf = 0;
    for (const [name, b] of von("prio")) { let cUe = ""; for (const { g, hat } of zeilenVon(name, b)) {
      const code = txt(g("code")), ue = txt(g("merkmal")), artC = L.codeArt(code, g("status"), pz), rang = zahl(g("rang"));
      if (ue) cUe = ue;
      if (!code) continue;
      if (artC === "ZZ") { cUe = txt(g("name")) || ue || code; continue; }
      prio.set(code.toUpperCase(), { ue: ue || cUe, rang: rang ?? ++rangLauf, name: txt(g("name")) });
    } }
    // 4) Preisliste / Codes
    const merkmalKey = (name, rang) => { const k = norm(name) || "ohne"; if (!zs.merkmale.has(k)) zs.merkmale.set(k, { key: k, name: txt(name) || "Ohne Überschrift", mehrfach: true, fest: false, auto: false, rang: rang ?? 1e9 }); const m = zs.merkmale.get(k); if (rang != null && rang < m.rang) m.rang = rang; return k; };
    let lauf = 0;
    for (const [name, b] of von("codes").concat(von("liste"))) {
      const kopf = bl[name][b.kz] || [], xs = b.rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
      let cGa = "", cFam = "", cVar = "", cNr = "", cUe = "";
      for (const { g, z, row } of zeilenVon(name, b)) {
        zs.zeilen++;
        const ga = txt(g("ga")), fam = txt(g("familie")), va = txt(g("variante")), nr = txt(g("variantNr")), ue = txt(g("merkmal")), code = txt(g("code"));
        if (ga && ga !== cGa) { cGa = ga; cFam = ""; cVar = ""; cNr = ""; }
        if (fam && fam !== cFam) { cFam = fam; cVar = ""; cNr = ""; cUe = ""; }
        if (va || nr) { cVar = va; cNr = nr; }
        if (ue) cUe = ue;
        const eGa = ga || (fuellen ? cGa : ""), eFam = fam || (fuellen ? cFam : ""), eVa = va || (fuellen ? cVar : ""), eNr = nr || (fuellen ? cNr : "");
        const artC = L.codeArt(code, g("status"), pz);
        if (!code) { const t = txt(g("name")); if (t && !b.rollen.includes("merkmal")) cUe = t; continue; }
        if (artC === "ZZ") { cUe = txt(g("name")) || prio.get(code.toUpperCase())?.ue || code; if (!zs.folge.includes(code)) zs.folge.push(code); zs.texte[code.toUpperCase()] = cUe; continue; }
        if (!zs.folge.includes(code)) zs.folge.push(code);
        if (txt(g("name"))) zs.texte[code.toUpperCase()] ||= txt(g("name"));
        const fk = (eFam || eGa || !zs.fam.size) ? famAnlegen(eGa, eFam) : null;
        const p = prio.get(code.toUpperCase()), a = art(code), ck = code.toUpperCase();
        let c = zs.codes.get(ck);
        if (!c) { c = { code, name: "", preis: null, kosten: null, merkmal: null, varianten: new Set(), famAlle: new Set(), std: new Set(), zeile: z, art: artC, rang: p?.rang ?? (1e6 + ++lauf), stl: [] }; zs.codes.set(ck, c); }
        if (!c.merkmal) { const ueName = ue || p?.ue || cUe; if (ueName) c.merkmal = merkmalKey(ueName, p?.rang ?? c.rang); }
        if (!c.name) c.name = txt(g("name")) || p?.name || a?.name || "";
        if (c.preis == null) c.preis = zahl(g("preis")) ?? a?.preis ?? null;
        if (c.kosten == null) c.kosten = zahl(g("kosten")) ?? a?.kosten ?? null;
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const xk = varAnlegen(fk || famAnlegen(eGa, eFam), "", txt(kopf[j]), z); c.varianten.add(xk); if (istStd(v)) c.std.add(xk); }
        if ((eVa || eNr) && !ALLE.test(eVa)) { const vk = varAnlegen(fk || famAnlegen(eGa, eFam), eNr, eVa, z); c.varianten.add(vk); if (b.rollen.includes("standard") && ja(g("standard"))) c.std.add(vk); }
        else if (!xs.length && fk) c.famAlle.add(fk);
      }
    }
    // 5) Kombinatorik: welche Codes bei welchem Modell zulässig sind (ersetzt die Angaben aus der Preisliste)
    const kombiGesehen = new Set();
    for (const [name, b] of von("kombi")) {
      const kopf = bl[name][b.kz] || [], xs = b.rollen.map((r, j) => r === "xvariante" ? j : -1).filter(j => j >= 0);
      const standardFam = zs.fam.size === 1 ? [...zs.fam.keys()][0] : null; let cFam = "", cVar = "";
      for (const { g, z, row } of zeilenVon(name, b)) {
        const code = txt(g("code")); const fam = txt(g("familie")) || cFam; if (txt(g("familie"))) cFam = fam;
        const va = txt(g("variante")) || txt(g("variantNr")) || cVar; if (txt(g("variante")) || txt(g("variantNr"))) cVar = va;
        if (!code) continue; const c = zs.codes.get(code.toUpperCase());
        if (!c) { if (L.codeArt(code, "", pz) !== "ZZ") w(name, z, `Code ${code} steht nicht in der Preisliste.`); continue; }
        if (!kombiGesehen.has(c)) { kombiGesehen.add(c); c.varianten = new Set(); c.famAlle = new Set(); c.std = new Set(); }
        const fk = fam ? famAnlegen("", fam) : standardFam || famAnlegen("", "Ohne Familie");
        for (const j of xs) { const v = row[j]; if (!ja(v)) continue; const vk = varFinden(txt(kopf[j]))?.key || varAnlegen(fk, "", txt(kopf[j]), z); c.varianten.add(vk); if (istStd(v)) c.std.add(vk); }
        if (va && !xs.length) { const vk = varFinden(va)?.key || varAnlegen(fk, va, "", z); c.varianten.add(vk); if (b.rollen.includes("standard") && ja(g("standard"))) c.std.add(vk); }
      }
    }
    // Codes ohne Angabe gelten für alle Varianten
    for (const c of zs.codes.values()) if (!c.varianten.size && !c.famAlle.size) for (const f of zs.fam.keys()) c.famAlle.add(f);
    // 6) Geänderte Preise
    for (const [name, b] of von("preise")) for (const { g, z } of zeilenVon(name, b)) {
      const code = txt(g("code")), p = zahl(g("preis")); if (!code || p == null) continue;
      const c = zs.codes.get(code.toUpperCase());
      if (c) { c.preis = p; const k = zahl(g("kosten")); if (k != null) c.kosten = k; if (txt(g("variante"))) w(name, z, `Preis für ${code} gilt im Modell für alle Varianten.`); }
      else { const v = varFinden(code); if (v) v.preis = p; else w(name, z, `Code ${code} für Preisänderung unbekannt.`); }
    }
    // 7) Stückliste
    for (const [name, b] of von("stl")) { let cCode = ""; for (const { g, z } of zeilenVon(name, b)) {
      const code = txt(g("code")) || (fuellen ? cCode : ""), teil = txt(g("teil")); if (txt(g("code"))) cCode = code;
      if (!teil) continue;
      const a = art(teil), zeile = [teil, txt(g("name")) || a?.name || "", zahl(g("menge")) || 1, txt(g("me")) || a?.me || "Stk"];
      const c = code && zs.codes.get(code.toUpperCase()), v = varFinden(txt(g("variantNr")) || txt(g("variante")) || (!c ? code : ""));
      if (c) c.stl.push(zeile); else if (v) v.stl.push(zeile); else w(name, z, `Teil ${teil}: Code ${code || "?"} unbekannt.`);
    } }
    // Familien ohne Varianten: Familie selbst ist die Variante
    for (const f of zs.fam.values()) if (![...zs.var.values()].some(v => v.fam === f.key)) { const vk = varAnlegen(f.key, "", f.name, null); for (const c of zs.codes.values()) if (c.famAlle.has(f.key)) { c.varianten.add(vk); c.famAlle.delete(f.key); } }
    // Codes ohne Überschrift
    const ohne = [...zs.codes.values()].filter(c => !c.merkmal);
    for (const c of ohne) c.merkmal = merkmalKey(c.art === "GA" ? "Grundausstattung" : "Weitere Optionen");
    if (ohne.length) w("Preisliste", null, `${ohne.length} Codes ohne Überschrift wurden unter „Grundausstattung“ bzw. „Weitere Optionen“ gesammelt.`);
    // Art je Überschrift: nur GA = feste Grundausstattung; GA + YY = Auswahl mit GA als Standard; nur YY = Optionen
    for (const m of zs.merkmale.values()) {
      const cs = [...zs.codes.values()].filter(c => c.merkmal === m.key), ga = cs.filter(c => c.art === "GA"), yy = cs.filter(c => c.art !== "GA");
      if (ga.length && !yy.length) { m.fest = true; m.mehrfach = false; }
      else if (ga.length && yy.length) { m.fest = false; m.mehrfach = false; for (const c of ga) { for (const v of c.varianten) c.std.add(v); for (const f of c.famAlle) for (const v of zs.var.values()) if (v.fam === f) c.std.add(v.key); } }
      else { m.fest = false; m.mehrfach = true; }
    }
    // Sortierung nach Rang
    zs.merkmale = new Map([...zs.merkmale.entries()].sort((a, b) => a[1].rang - b[1].rang));
    zs.codes = new Map([...zs.codes.entries()].sort((a, b) => a[1].rang - b[1].rang));
    for (const v of zs.var.values()) if (!L.codesVon(zs, v).length) w("Modelle", v.zeile, `Variante „${v.name}“ hat keine Codes.`);
    if (amap.size || opts.artikelGeladen) { const fehlt = [...zs.codes.values()].filter(c => !art(c.code)).map(c => c.code); if (fehlt.length) w("Artikelstamm", null, `${fehlt.length} Codes sind nicht im Artikelstamm: ${fehlt.slice(0, 12).join(", ")}${fehlt.length > 12 ? " …" : ""}`); }
    return zs;
  };

  if (node) { module.exports = L; return; }

  /* =====================================================================
     Oberfläche: Studio → Excel-Import (einfach)
     ===================================================================== */
  const K = root.KONF, esc = K.esc, S = () => K.Store.S; K.L = L;
  K.li = { schritt: "datei", datei: null, blaetter: null, blatt: null, kz: 0, rollen: [], zs: null, auswahl: new Set(), ersetzen: false, zusammenfassen: true, fuellen: true, fehler: null, ergebnis: null };
  const ro = () => !K.Store.schreiben;
  const VORLAGE = ["codes", "regeln", "produkte", "merkmale", "kombinationen", "stueckliste", "katalog"];
  const artikelFn = () => code => code ? K.Store.artikelZu(code) : null;
  const istVariante = h => { const mo = S().entwurf; return !!(mo && mo.produkte.some(p => norm(p.code) === norm(h) || norm(p.name) === norm(h))); };

  function neuRechnen() {
    const i = K.li;
    if (i.mappe) { i.zs = L.zusammenstellenMappe(i.blaetter, i.mappe, { artikel: artikelFn(), artikelGeladen: K.Store.artikelQuelle === "applus" }); i.auswahl = new Set(); return; }
    const aoa = i.blaetter[i.blatt];
    const bekannt = new Map(); for (const m of (S().entwurf?.merkmale || [])) for (const w of m.werte) if (w.code) bekannt.set(w.code.toUpperCase(), { name: m.name, mehrfach: m.typ === "mehrfach" });
    i.zs = L.zusammenstellen(aoa, i.kz, i.rollen, { fuellen: i.fuellen, artikel: artikelFn(), artikelGeladen: !!K.Store.artikelQuelle, merkmalVon: c => bekannt.get(String(c).toUpperCase()) });
    i.auswahl = new Set();
  }
  const kopf = () => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Familien und Varianten importieren</h2><p>Eine Liste mit Geschäftsart, Produktfamilie, Variante und Vertriebscodes genügt. Bezeichnungen und Preise, die fehlen, holt der Import aus dem Artikelstamm. Vor der Übernahme sehen Sie die Zusammenstellung und können sie anpassen.</p></div>
    <div class="row"><a class="btn" href="#studio-import">← Nur Codes und Preise</a><button class="btn" type="button" data-act="liBeispiel">Beispiel-Liste herunterladen</button><a class="btn" href="#studio-import-vorlage">Expertenimport (mehrere Blätter, Regeln)</a></div></div>`;
  const leiste = () => { const st = [["datei", "Datei"], ["spalten", "Spalten"], ["zs", "Zusammenstellung"], ["fertig", "Fertig"]], j = st.findIndex(s => s[0] === K.li.schritt); return `<ol class="schritte">${st.map(([id, n], k) => `<li class="${k === j ? "aktiv" : k < j ? "erledigt" : ""}">${k + 1}. ${n}</li>`).join("")}</ol>`; };

  K.route("studio-import-struktur", () => {
    const i = K.li;
    if (ro()) return kopf() + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (i.schritt === "datei") return kopf() + leiste() + `<section class="panel upload">
      <label class="ablage" for="li-datei"><b>Excel-Datei hierher ziehen oder auswählen</b><span class="gedimmt">.xlsx, .xls oder .csv</span><input id="li-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="liDatei"></label>
      ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}
      <div class="aufbau"><div class="eyebrow">So kann die Liste aussehen</div>
        <div class="tabwrap ohne-rand"><table class="kompakt beispieltab"><thead><tr>${L.beispiel()[0].map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${L.beispiel().slice(1, 7).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <ul class="punkte klein"><li>Leere Zellen bei Geschäftsart, Familie, Variante und Merkmal gelten wie die Zeile darüber.</li><li>„alle“ als Variante heißt: Code gilt für alle Varianten der Familie.</li><li>Statt einer Variantenspalte geht auch je Variante eine Spalte mit X (verfügbar) oder S (Standard).</li><li>Ohne Merkmal-Spalte werden Zwischenüberschriften oder der Anfang der Codes zum Gruppieren genutzt.</li></ul></div></section>`;
    if (i.schritt === "spalten" && i.mappe) return kopf() + leiste() + mappeAnsicht();
    if (i.schritt === "spalten") {
      const aoa = i.blaetter[i.blatt], kopfz = aoa[i.kz] || [], breite = Math.max(...aoa.slice(i.kz, i.kz + 12).map(r => (r || []).length), kopfz.length);
      const vorlage = Object.keys(i.blaetter).filter(n => VORLAGE.includes(norm(n))).length >= 2;
      const fehlt = !i.rollen.includes("code") ? "Bitte die Spalte mit den Vertriebscodes wählen." : (!i.rollen.includes("variante") && !i.rollen.includes("variantNr") && !i.rollen.includes("xvariante") && !i.rollen.includes("familie")) ? "Bitte die Spalte mit der Variante oder Produktfamilie wählen." : "";
      const mehrere = Object.keys(i.blaetter).filter(n => L.inhaltRaten(n, i.blaetter[n])).length >= 2;
      return kopf() + leiste() + `${mehrere ? `<div class="hinweis">Die Datei hat mehrere Blätter (Preisliste, Artikel, Kombinatorik …). <button class="btn klein" type="button" data-act="lmStart">Alle Blätter zusammen einlesen</button></div>` : ""}${vorlage ? `<div class="hinweis">Diese Datei sieht aus wie die vollständige Vorlage mit mehreren Blättern. <button class="btn klein" type="button" data-act="liZurVorlage">Mit dem Expertenimport öffnen</button></div>` : ""}
      <section class="panel"><div class="row zwischen"><span><b>${esc(i.datei)}</b></span>
        <span class="row">${Object.keys(i.blaetter).length > 1 ? `<label class="inline">Blatt <select id="li-blatt" data-act="liBlatt">${Object.keys(i.blaetter).map(n => `<option ${n === i.blatt ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></label>` : ""}
        <label class="inline">Überschriften in Zeile <input id="li-kz" type="number" min="1" class="kurz" data-chg="liKz" value="${i.kz + 1}"></label>
        <label class="haken klein"><input type="checkbox" data-act="liFuellen" ${i.fuellen ? "checked" : ""}> leere Zellen von oben übernehmen</label></span></div>
        <p class="klein gedimmt">Wählen Sie über jeder Spalte, was darin steht. Vorschläge sind schon eingetragen.</p>
        <div class="tabwrap spaltenwahl"><table class="kompakt"><thead><tr>${Array.from({ length: breite }, (_, j) => `<th><select id="li-r-${j}" data-act="liRolle" data-j="${j}" class="${i.rollen[j] ? "gesetzt" : ""}">${L.ROLLEN.map(([k, n]) => `<option value="${k}" ${(i.rollen[j] || "") === k ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></th>`).join("")}</tr>
          <tr class="kopfreihe">${Array.from({ length: breite }, (_, j) => `<td>${esc(kopfz[j] ?? "")}</td>`).join("")}</tr></thead>
          <tbody>${aoa.slice(i.kz + 1, i.kz + 11).map(r => `<tr>${Array.from({ length: breite }, (_, j) => `<td class="${i.rollen[j] ? "" : "aus"}">${esc(String(r?.[j] ?? "").slice(0, 40))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        ${fehlt ? `<div class="hinweis warn">${fehlt}</div>` : ""}
        <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="liWeiter" ${fehlt ? "disabled" : ""}>Weiter zur Zusammenstellung</button></div></section>`;
    }
    if (i.schritt === "zs") return kopf() + leiste() + zusammenstellung();
    const st = i.ergebnis?.stat || {};
    return kopf() + leiste() + `<section class="panel"><div class="hinweis ok"><b>Übernommen in den Entwurf.</b> ${st.gaNeu} neue Geschäftsarten, ${st.famNeu} neue Familien, ${st.artNeu} neue und ${st.artGeaendert} aktualisierte Varianten, ${st.codesNeu} neue und ${st.codesGeaendert} geänderte Codes.${st.zusammengefasst ? ` ${st.zusammengefasst} Merkmale wurden an Familien bzw. Geschäftsarten zusammengefasst.` : ""}${st.gegliedert ? ` ${st.gegliedert} Fahrzeuge wurden nach Überschriften (ZZ) und Untergruppen (YY) gegliedert.` : ""}</div>
      <p class="klein gedimmt">Der Vertrieb sieht die Änderungen nach der Freigabe. Regeln legen Sie im Produktmodell je Familie oder Variante an.</p>
      <div class="row"><button class="btn primary" type="button" data-act="liZumModell">Im Produktmodell ansehen</button><a class="btn" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="liZurueck" data-s="datei">Weitere Liste importieren</button></div></section>`;
  });

  function zusammenstellung() {
    const i = K.li, zs = i.zs, z = L.zahlen(zs), codes = [...zs.codes.values()];
    const merkmale = [...zs.merkmale.values()].filter(m => codes.some(c => c.merkmal === m.key));
    const baumGa = (gaKey) => [...zs.fam.values()].filter(f => f.ga === gaKey).map(f => `<li><span class="zs-fam">▤ ${esc(f.name)}</span><ul>${[...zs.var.values()].filter(v => v.fam === f.key).map(v => `<li><span class="zs-var">▢ <code>${esc(v.code)}</code> ${esc(v.name !== v.code ? v.name : "")}</span><span class="gedimmt klein">${L.codesVon(zs, v).length} Codes${v.preis != null ? " · " + K.eur(v.preis) : ""}</span></li>`).join("")}</ul></li>`).join("");
    const baum = `${[...zs.ga.values()].map(g => `<li><span class="zs-ga">${esc(g.name)}</span><ul>${baumGa(g.key)}</ul></li>`).join("")}${baumGa(null)}`;
    const mOpt = aktiv => merkmale.map(m => `<option value="${m.key}" ${m.key === aktiv ? "selected" : ""}>${esc(m.name)}</option>`).join("");
    const karten = merkmale.map(m => {
      const cs = codes.filter(c => c.merkmal === m.key), vs = new Set(cs.flatMap(c => [...c.varianten]));
      return `<article class="zs-merkmal${m.auto ? " auto" : ""}${m.fest ? " fest" : ""}">
        <div class="zs-mkopf"><input id="li-mn-${m.key}" class="flach titelfeld" data-in="liMName" data-k="${m.key}" value="${esc(m.name)}" aria-label="Name des Merkmals">
          <select id="li-mt-${m.key}" data-act="liMTyp" data-k="${m.key}" aria-label="Art"><option value="0" ${!m.mehrfach && !m.fest ? "selected" : ""}>eine Auswahl</option><option value="1" ${m.mehrfach && !m.fest ? "selected" : ""}>mehrere (Optionen)</option><option value="f" ${m.fest ? "selected" : ""}>Grundausstattung (fest, inklusive)</option></select>
          <select id="li-mm-${m.key}" data-act="liMerge" data-k="${m.key}" aria-label="Zusammenführen"><option value="">zusammenführen mit …</option>${merkmale.filter(x => x !== m).map(x => `<option value="${x.key}">${esc(x.name)}</option>`).join("")}</select></div>
        ${m.auto ? `<p class="klein warntext">Automatisch nach Code-Anfang gebildet. Bitte sinnvoll benennen.</p>` : ""}
        ${m.fest ? `<p class="klein gedimmt">Ist immer im Fahrzeug enthalten und erscheint im Konfigurator und im Angebot als Grundausstattung, ohne Auswahl.</p>` : ""}
        <div class="zs-codes">${cs.map(c => `<button type="button" class="zs-code${i.auswahl.has(c.code.toUpperCase()) ? " gewaehlt" : ""}${K.Store.artikelQuelle && !K.Store.artikelZu(c.code) ? " unbekannt" : ""}" data-act="liCode" data-c="${esc(c.code.toUpperCase())}" title="${esc((c.name || "") + (c.preis ? " · " + K.eur(c.preis) : "") + " · " + c.varianten.size + " Varianten" + (c.stl?.length ? " · " + c.stl.length + " Stücklistenpositionen" : ""))}">${c.art ? `<span class="art-${c.art}">${c.art}</span>` : ""}<code>${esc(c.code)}</code> ${esc(c.name)}${c.preis ? ` <span class="num">${K.eur(c.preis)}</span>` : ""}</button>`).join("")}</div>
        <div class="klein gedimmt">${cs.length} Codes · in ${vs.size} von ${zs.var.size} Varianten</div></article>`;
    }).join("");
    return `<div class="kpis">
      <div class="kpi"><b class="num">${z.ga}</b><span>Geschäftsarten</span></div><div class="kpi"><b class="num">${z.fam}</b><span>Produktfamilien</span></div>
      <div class="kpi"><b class="num">${z.var}</b><span>Varianten</span></div><div class="kpi"><b class="num">${z.codes}</b><span>Vertriebscodes in ${z.merkmale} Merkmalen</span></div></div>
      ${zs.warn.length ? `<details class="panel" ${zs.warn.length < 6 ? "open" : ""}><summary><b>${zs.warn.length} ${zs.warn.length === 1 ? "Hinweis" : "Hinweise"}</b></summary><ul class="warnliste">${zs.warn.slice(0, 80).map(w => `<li>${w.zeile ? `<span class="mono">${zs.mappe ? "" : "Zeile "}${esc(w.zeile)}</span> ` : ""}${esc(w.text)}</li>`).join("")}</ul></details>` : ""}
      <div class="zs-layout">
        <aside class="panel zs-baum"><h3>Aufbau</h3><ul>${baum}</ul></aside>
        <section class="zs-rechts">
          <div class="zs-werkzeug panel"><span><b>${i.auswahl.size}</b> Codes ausgewählt</span>
            <select id="li-ziel" aria-label="Ziel-Merkmal"><option value="">verschieben nach …</option>${mOpt("")}<option value="__neu">neues Merkmal</option></select>
            <button class="btn klein" type="button" data-act="liVerschieben" ${i.auswahl.size ? "" : "disabled"}>Verschieben</button>
            <button class="btn klein" type="button" data-act="liAuswahlWeg" ${i.auswahl.size ? "" : "disabled"}>Auswahl aufheben</button>
            <span class="gedimmt klein">Codes anklicken, um sie auszuwählen.</span></div>
          <div class="zs-merkmale">${karten}</div>
        </section></div>
      <section class="panel" style="margin-top:14px"><h3>Übernehmen</h3>
        <label class="haken"><input type="checkbox" data-act="liOpt" data-k="zusammenfassen" ${i.zusammenfassen ? "checked" : ""}> Gemeinsame Merkmale automatisch an Produktfamilie und Geschäftsart übergeben (empfohlen)</label>
        <label class="haken"><input type="checkbox" data-act="liOpt" data-k="ersetzen" ${i.ersetzen ? "checked" : ""}> Bestehendes Modell ersetzen statt ergänzen (Regeln werden dabei gelöscht)</label>
        <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="spalten">Zurück zu den Spalten</button><button class="btn gelb" type="button" data-act="liUebernehmen">In das Produktmodell übernehmen</button></div></section>`;
  }

  async function lesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" }), bl = {};
    for (const n of wb.SheetNames) bl[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return bl;
  }
  function blattWaehlen(n) {
    const i = K.li, aoa = i.blaetter[n]; i.blatt = n;
    i.kz = L.kopfzeile(aoa);
    const gesp = S().einst?.listenImport;
    const kopfz = (aoa[i.kz] || []).map(txt);
    i.rollen = L.raten(aoa, i.kz, istVariante);
    if (gesp) kopfz.forEach((h, j) => { if (h && gesp[norm(h)] !== undefined) i.rollen[j] = gesp[norm(h)]; });
  }

  /* ---------- Arbeitsmappe mit mehreren Blättern ---------- */
  function mappeBlatt(n, inhalt) {
    const i = K.li, aoa = i.blaetter[n], gesp = S().einst?.mappenImport?.blaetter?.[norm(n)];
    inhalt = inhalt ?? (gesp ? gesp.inhalt : L.inhaltRaten(n, aoa));
    const kz = inhalt ? L.kopfzeileInhalt(aoa, inhalt) : 0, rollen = L.ratenInhalt(aoa, kz, inhalt, istVariante);
    if (gesp && gesp.inhalt === inhalt) (aoa[kz] || []).forEach((h, j) => { const r = gesp.rollen?.[norm(h)]; if (r !== undefined) rollen[j] = r; });
    return { inhalt, kz, rollen };
  }
  function mappeStarten() {
    const i = K.li, gesp = S().einst?.mappenImport || {};
    const gaRaten = (i.datei || "").replace(/\.[a-z]+$/i, "").replace(/doll|konfigurator|preisliste|_|-/gi, " ").replace(/\s+/g, " ").trim();
    i.mappe = { ga: gesp.ga || gaRaten, praefix: Object.assign({ ueber: "ZZ", grund: "GA", option: "YY" }, gesp.praefix || {}, S().einst?.codeKennung || {}), fuellen: true, blaetter: {}, tab: null };
    for (const n of Object.keys(i.blaetter)) i.mappe.blaetter[n] = mappeBlatt(n);
    i.mappe.tab = Object.keys(i.mappe.blaetter).find(n => i.mappe.blaetter[n].inhalt) || null;
  }
  const PFLICHT = { codes: ["code"], artikel: ["code"], kombi: ["code"], prio: ["code"], modelle: [], stl: ["teil"], preise: ["code", "preis"], liste: ["code"] };
  function mappeAnsicht() {
    const i = K.li, mp = i.mappe, namen = Object.keys(i.blaetter), genutzt = namen.filter(n => mp.blaetter[n].inhalt);
    const fehlt = genutzt.flatMap(n => (PFLICHT[mp.blaetter[n].inhalt] || []).filter(r => !mp.blaetter[n].rollen.includes(r)).map(r => `${n}: Spalte „${L.rollenName[r]}“ fehlt`));
    if (mp.blaetter[mp.tab]?.inhalt === "modelle" && !mp.blaetter[mp.tab].rollen.some(r => r === "variante" || r === "variantNr")) fehlt.push(`${mp.tab}: Spalte „Modell“ fehlt`);
    if (!genutzt.some(n => ["codes", "liste"].includes(mp.blaetter[n].inhalt))) fehlt.unshift("Bitte das Blatt mit der Preisliste bzw. den Codes festlegen.");
    const t = mp.tab && mp.blaetter[mp.tab], aoa = t ? i.blaetter[mp.tab] : null;
    let tabelle = "";
    if (t && t.inhalt) {
      const erlaubt = ["", ...L.INHALTE.find(x => x[0] === t.inhalt)[2]], kopfz = aoa[t.kz] || [], breite = Math.min(40, Math.max(...aoa.slice(t.kz, t.kz + 12).map(r => (r || []).length), kopfz.length));
      tabelle = `<div class="row zwischen" style="margin-top:12px"><b>${esc(mp.tab)}</b><span class="row"><label class="inline">Überschriften in Zeile <input id="lm-kz" type="number" min="1" class="kurz" data-chg="lmKz" value="${t.kz + 1}"></label></span></div>
        <div class="tabwrap spaltenwahl"><table class="kompakt"><thead><tr>${Array.from({ length: breite }, (_, j) => `<th><select id="lm-r-${j}" data-act="lmRolle" data-j="${j}" class="${t.rollen[j] ? "gesetzt" : ""}">${erlaubt.map(k => `<option value="${k}" ${(t.rollen[j] || "") === k ? "selected" : ""}>${esc(k ? L.rollenName[k] : "– nicht verwenden –")}</option>`).join("")}</select></th>`).join("")}</tr>
          <tr class="kopfreihe">${Array.from({ length: breite }, (_, j) => `<td>${esc(kopfz[j] ?? "")}</td>`).join("")}</tr></thead>
          <tbody>${aoa.slice(t.kz + 1, t.kz + 9).map(r => `<tr>${Array.from({ length: breite }, (_, j) => `<td class="${t.rollen[j] ? "" : "aus"}">${esc(String(r?.[j] ?? "").slice(0, 40))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    return `<section class="panel"><div class="row zwischen"><span><b>${esc(i.datei)}</b> <span class="gedimmt klein">${namen.length} Blätter</span></span>
        <button class="btn klein" type="button" data-act="lmEnde">Nur ein Blatt verwenden</button></div>
      <p class="klein gedimmt">Die Blätter werden zusammengeführt: Codes aus der Preisliste, Bezeichnungen und Preise aus dem Artikelstamm, Reihenfolge und Überschriften aus der Prio-Liste, zulässige Codes je Modell aus der Kombinatorik, Stücklisten aus dem Teileverwendungsnachweis. Formeln werden nicht ausgewertet, es zählt der zuletzt berechnete Wert.</p>
      <div class="lm-grid">
        <table class="kompakt lm-blaetter"><thead><tr><th>Blatt</th><th>Zeilen</th><th>Inhalt</th></tr></thead><tbody>${namen.map(n => `<tr class="${n === mp.tab ? "aktiv" : ""}${mp.blaetter[n].inhalt ? "" : " aus"}"><td><button type="button" class="link" data-act="lmTab" data-n="${esc(n)}">${esc(n)}</button></td><td class="num">${Math.max(0, i.blaetter[n].length - 1)}</td><td><select id="lm-i-${namen.indexOf(n)}" data-act="lmInhalt" data-n="${esc(n)}">${L.INHALTE.map(([k, nm]) => `<option value="${k}" ${mp.blaetter[n].inhalt === k ? "selected" : ""}>${esc(nm)}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>
        <div class="lm-einst">
          <div class="feld"><label for="lm-ga">Geschäftsart</label><input id="lm-ga" data-in="lmGa" value="${esc(mp.ga)}" placeholder="z. B. Holztransport"></div>
          <div class="feld"><label>Code-Kennzeichen</label><div class="lm-praefix">
            <label><input id="lm-p-ueber" class="kurz mono" data-in="lmPz" data-k="ueber" value="${esc(mp.praefix.ueber)}"> Überschrift</label>
            <label><input id="lm-p-grund" class="kurz mono" data-in="lmPz" data-k="grund" value="${esc(mp.praefix.grund)}"> Grundausstattung</label>
            <label><input id="lm-p-option" class="kurz mono" data-in="lmPz" data-k="option" value="${esc(mp.praefix.option)}"> Option</label></div></div>
          <label class="haken klein"><input type="checkbox" data-act="lmFuellen" ${mp.fuellen !== false ? "checked" : ""}> leere Zellen von oben übernehmen</label></div>
      </div>
      ${t && !t.inhalt ? `<p class="klein gedimmt" style="margin-top:12px">Blatt „${esc(mp.tab)}“ wird nicht verwendet.</p>` : tabelle}
      ${fehlt.length ? `<div class="hinweis warn">${fehlt.map(esc).join("<br>")}</div>` : ""}
      <div class="row" style="justify-content:flex-end"><button class="btn" type="button" data-act="liZurueck" data-s="datei">Andere Datei</button><button class="btn primary" type="button" data-act="liWeiter" ${fehlt.length ? "disabled" : ""}>Weiter zur Zusammenstellung</button></div></section>`;
  }
  K.act.lmStart = () => { mappeStarten(); K.render(); };
  K.act.lmEnde = () => { K.li.mappe = null; K.render(); };
  K.act.lmTab = el => { K.li.mappe.tab = el.dataset.n; K.render(); };
  K.act.lmInhalt = el => { const mp = K.li.mappe, n = el.dataset.n; mp.blaetter[n] = mappeBlatt(n, el.value); mp.tab = n; K.render(); };
  K.act.lmRolle = el => {
    const t = K.li.mappe.blaetter[K.li.mappe.tab], j = +el.dataset.j, r = el.value;
    if (r && r !== "xvariante") t.rollen = t.rollen.map((x, k) => x === r && k !== j ? "" : x);
    t.rollen[j] = r; K.render();
  };
  K.inp.lmKz = el => { const mp = K.li.mappe, t = mp.blaetter[mp.tab], aoa = K.li.blaetter[mp.tab]; t.kz = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); t.rollen = L.ratenInhalt(aoa, t.kz, t.inhalt, istVariante); K.render(); };
  K.inp.lmGa = el => { K.li.mappe.ga = el.value; };
  K.inp.lmPz = el => { K.li.mappe.praefix[el.dataset.k] = el.value.trim(); };
  K.act.lmFuellen = el => { K.li.mappe.fuellen = el.checked; };
  K.act.liDatei = async el => {
    const f = el.files[0]; if (!f) return;
    try {
      const bl = await lesen(f), i = K.li; i.datei = f.name; i.blaetter = bl; i.fehler = null; i.mappe = null;
      if (Object.keys(bl).filter(n => L.inhaltRaten(n, bl[n]) && bl[n].length > 1).length >= 3) { mappeStarten(); i.schritt = "spalten"; return K.render(); }
      const namen = Object.keys(bl).filter(n => bl[n].length > 1);
      const best = namen.sort((a, b) => bl[b].length - bl[a].length).find(n => !/^(anleitung|hinweis|info|liesmich)/i.test(n)) || Object.keys(bl)[0];
      blattWaehlen(best); i.schritt = "spalten";
    } catch (e) { console.error(e); K.li.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import-struktur" && K.li.schritt === "datei") e.preventDefault(); });
  document.addEventListener("drop", e => { if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import-struktur" || K.li.schritt !== "datei") return; e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) K.act.liDatei({ files: [f] }); });
  K.act.liBlatt = el => { blattWaehlen(el.value); K.render(); };
  K.inp.liKz = el => { const i = K.li, aoa = i.blaetter[i.blatt]; i.kz = Math.max(0, Math.min(aoa.length - 1, (+el.value || 1) - 1)); i.rollen = L.raten(aoa, i.kz, istVariante); K.render(); };
  K.act.liFuellen = el => { K.li.fuellen = el.checked; };
  K.act.liRolle = el => {
    const i = K.li, j = +el.dataset.j, r = el.value;
    if (r && r !== "xvariante") i.rollen = i.rollen.map((x, k) => x === r && k !== j ? "" : x);
    i.rollen[j] = r; K.render();
  };
  K.act.liZurVorlage = () => {
    const i = K.li;
    Object.assign(K.imp, { datei: i.datei, blaetter: i.blaetter, zuo: K.X.zuordnungVorschlagen(i.blaetter, S().einst?.importZuordnung), schritt: "zuordnung", fehler: null });
    K.gehe("studio-import-vorlage");
  };
  K.act.liZurueck = el => { K.li.schritt = el.dataset.s; K.render(); };
  K.act.liWeiter = () => { neuRechnen(); K.li.schritt = "zs"; K.render(); };
  K.inp.liMName = el => { const m = K.li.zs.merkmale.get(el.dataset.k); m.name = el.value; m.auto = false; };
  K.act.liMTyp = el => { const m = K.li.zs.merkmale.get(el.dataset.k); m.fest = el.value === "f"; m.mehrfach = el.value === "1"; K.render(); };
  K.act.liMerge = el => {
    if (!el.value) return; const zs = K.li.zs, von = el.dataset.k, nach = el.value;
    for (const c of zs.codes.values()) if (c.merkmal === von) c.merkmal = nach;
    zs.merkmale.delete(von); K.render(); K.toast("Merkmale zusammengeführt");
  };
  K.act.liCode = el => { const a = K.li.auswahl, c = el.dataset.c; a.has(c) ? a.delete(c) : a.add(c); K.render(); };
  K.act.liAuswahlWeg = () => { K.li.auswahl.clear(); K.render(); };
  K.act.liVerschieben = () => {
    const i = K.li, zs = i.zs, sel = K.el("li-ziel").value; if (!sel) return K.toast("Bitte ein Ziel-Merkmal wählen.");
    let ziel = sel;
    if (sel === "__neu") { let n = 1; while (zs.merkmale.has("neu" + n)) n++; ziel = "neu" + n; zs.merkmale.set(ziel, { key: ziel, name: "Neues Merkmal " + n, mehrfach: false, auto: false }); }
    for (const c of i.auswahl) { const x = zs.codes.get(c); if (x) x.merkmal = ziel; }
    const n = i.auswahl.size; i.auswahl = new Set(); K.render(); K.toast(`${n} Codes verschoben`);
    if (sel === "__neu") K.nach(v => { const f = v.querySelector(`#li-mn-${ziel}`); if (f) { f.focus(); f.select(); } });
  };
  K.act.liOpt = el => { K.li[el.dataset.k] = el.checked; };
  K.act.liUebernehmen = async () => {
    const i = K.li;
    const r = L.inModell(i.zs, S().entwurf, { ersetzen: i.ersetzen, zusammenfassen: i.zusammenfassen });
    r.modell.version = S().entwurf?.version || S().live?.version || 0;
    K.Store.S.entwurf = r.modell;
    // Arbeitsmappe: wie im Katalogaufbau nach ZZ/YY gliedern
    let gegliedert = 0; for (const p of r.modell.produkte) if (p._gliedern) { delete p._gliedern; if (K.kbStrukturieren && K.kbStrukturieren(p)) gegliedert++; }
    if (gegliedert) r.stat.gegliedert = gegliedert;
    K.Store.entwurfGeaendert();
    if (i.zs.artikelstamm?.length && K.Store.artikelQuelle !== "applus") K.Store.artikelImport(i.zs.artikelstamm);
    const e = S().einst;
    if (e && i.mappe) { e.mappenImport = { ga: i.mappe.ga, praefix: i.mappe.praefix, blaetter: Object.fromEntries(Object.entries(i.mappe.blaetter).map(([n, b]) => [norm(n), { inhalt: b.inhalt, rollen: Object.fromEntries((i.blaetter[n][b.kz] || []).map((h, j) => [norm(h), b.rollen[j] || ""]).filter(([h]) => h)) }])) }; await K.Store.einstSpeichern(e, true); }
    else if (e) { const aoa = i.blaetter[i.blatt]; e.listenImport = Object.fromEntries((aoa[i.kz] || []).map((h, j) => [norm(h), i.rollen[j] || ""]).filter(([h]) => h)); await K.Store.einstSpeichern(e, true); }
    const st = r.stat; await K.Store.log("Import", `Liste „${i.datei}“ importiert: ${st.famNeu} Familien, ${st.artNeu} Varianten neu, ${st.codesNeu} Codes neu, ${st.codesGeaendert} geändert`);
    i.ergebnis = r; i.schritt = "fertig"; i.blaetter = null; i.zs = null; i.mappe = null; K.render();
  };
  K.act.liZumModell = () => { const mo = S().entwurf, f = mo.gruppen.find(g => !g.eltern); K.st.knoten = f ? "g:" + f.id : ""; K.st.modellTab = "merkmale"; K.gehe("studio-modell"); };
  K.act.liBeispiel = async () => {
    try { await K.lib("xlsx"); } catch (e) { return K.toast("Die Excel-Bibliothek ist nicht erreichbar."); }
    const ws = window.XLSX.utils.aoa_to_sheet(L.beispiel()); ws["!cols"] = L.beispiel()[0].map(h => ({ wch: Math.max(12, h.length + 4) }));
    const wb = window.XLSX.utils.book_new(); window.XLSX.utils.book_append_sheet(wb, ws, "Produktliste");
    K.speichereDatei("Beispiel_Produktliste.xlsx", new Blob([window.XLSX.write(wb, { bookType: "xlsx", type: "array" })]));
  };
})(typeof window !== "undefined" ? window : globalThis);


/* ===== preise.js ===== */
/* =====================================================================
   Excel-Import „Codes & Preise“ für eine Produktgruppe
   1. Produktgruppe wählen  2. Excel ablegen  3. prüfen und übernehmen
   Aus der Datei werden nur Code und Preis gelesen. Die Preise gelten für die
   gewählte Produktgruppe (inkl. Unterfamilien und Fahrzeuge darunter).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const norm = s => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  const txt = v => String(v ?? "").trim();
  const zahl = v => K.X && K.X.zahl ? K.X.zahl(v) : (typeof v === "number" ? v : null);
  const ro = () => !K.Store.schreiben;
  const SYN = {
    code: ["code", "vertriebscode", "konfigurationscode", "vkcode", "artikel", "artikelnummer", "artikelnr", "codes", "option", "nr", "nummer"],
    preis: ["preis", "vkpreis", "listenpreis", "preisaufschlag", "aufpreis", "aufschlag", "verkaufspreis", "preiseur", "preisnetto", "nettopreis", "neuerpreis", "betrag"],
    name: ["bezeichnung", "benennung", "ausstattungsposition", "codebezeichnung", "text", "beschreibung", "artikelbezeichnung"],
    gruppe: ["produktgruppe", "produktfamilie", "familie", "baureihe", "gruppe"]
  };
  K.pi = { schritt: "start", gruppe: "", datei: null, blaetter: null, blatt: null, kz: 0, sp: {}, filter: "", neuAn: false, neuZiel: "", fehler: null, ergebnis: null };

  /* ---------- Spalten und Blatt erkennen ---------- */
  function bekannteCodes() {
    const mo = S().entwurf, set = new Set(); if (!mo) return set;
    for (const m of mo.merkmale) for (const w of m.werte) if (w.code) set.add(String(w.code).toUpperCase());
    for (const p of mo.produkte) if (p.code) set.add(String(p.code).toUpperCase());
    return set;
  }
  function kopfzeile(aoa) {
    const alle = new Set(Object.values(SYN).flat()); let best = 0, bs = -1;
    for (let i = 0; i < Math.min(25, aoa.length); i++) { const z = aoa[i] || [], s = z.filter(c => alle.has(norm(c))).length * 3 + (z.filter(c => txt(c)).length >= 2 ? 1 : 0); if (s > bs) { bs = s; best = i; } }
    return best;
  }
  function spaltenRaten(aoa, kz) {
    const kopf = (aoa[kz] || []).map(norm), daten = aoa.slice(kz + 1, kz + 300), bek = bekannteCodes(), breite = Math.max(kopf.length, ...daten.slice(0, 30).map(r => (r || []).length));
    const sp = {}, besetzt = new Set();
    const nachName = rolle => { for (const s of SYN[rolle]) { const j = kopf.findIndex((h, k) => h === s && !besetzt.has(k)); if (j >= 0) return j; } for (const s of SYN[rolle]) { if (s.length < 4) continue; const j = kopf.findIndex((h, k) => h && h.includes(s) && !besetzt.has(k)); if (j >= 0) return j; } return -1; };
    // Code: Spalte mit den meisten bekannten Codes, sonst nach Überschrift
    let jc = -1, bestT = 0;
    for (let j = 0; j < breite; j++) { const t = daten.filter(r => bek.has(txt(r?.[j]).toUpperCase())).length; if (t > bestT) { bestT = t; jc = j; } }
    if (jc < 0 || bestT < 2) { const j = nachName("code"); if (j >= 0) jc = j; }
    if (jc >= 0) { sp.code = jc; besetzt.add(jc); }
    // Preis: nach Überschrift, sonst Spalte mit den meisten Zahlen
    let jp = nachName("preis");
    if (jp < 0) { let bz = 0; for (let j = 0; j < breite; j++) { if (besetzt.has(j)) continue; const z = daten.filter(r => typeof r?.[j] === "number" || (txt(r?.[j]) && zahl(r[j]) != null)).length; if (z > bz) { bz = z; jp = j; } } }
    if (jp >= 0) { sp.preis = jp; besetzt.add(jp); }
    const jn = nachName("name"); if (jn >= 0) { sp.name = jn; besetzt.add(jn); }
    const jg = nachName("gruppe"); if (jg >= 0) { sp.gruppe = jg; besetzt.add(jg); }
    return sp;
  }
  function blattRaten(bl) {
    const bek = bekannteCodes(); let best = null, bs = -1;
    for (const [n, aoa] of Object.entries(bl)) {
      if (aoa.length < 2) continue;
      const treffer = aoa.reduce((a, r) => a + ((r || []).some(c => bek.has(txt(c).toUpperCase())) ? 1 : 0), 0);
      const s = treffer * 10 + (/preis/i.test(n) ? 50 : 0) + Math.min(aoa.length, 40) - (/export|anleitung|hinweis/i.test(n) ? 500 : 0);
      if (s > bs) { bs = s; best = n; }
    }
    return best || Object.keys(bl)[0];
  }
  function blattSetzen(n) {
    const i = K.pi, aoa = i.blaetter[n]; i.blatt = n; i.kz = kopfzeile(aoa); i.sp = spaltenRaten(aoa, i.kz); i.filter = filterRaten();
  }
  /** Werte der Produktgruppen-Spalte und Vorschlag passend zur gewählten Gruppe */
  function gruppenWerte() {
    const i = K.pi; if (i.sp.gruppe == null) return [];
    const aoa = i.blaetter[i.blatt], set = new Map(); let akt = "";
    for (const r of aoa.slice(i.kz + 1)) { const v = txt(r?.[i.sp.gruppe]) || akt; if (txt(r?.[i.sp.gruppe])) akt = v; if (v && !set.has(norm(v))) set.set(norm(v), v); }
    return [...set.values()];
  }
  function filterRaten() {
    const g = gruppeObj(); if (!g) return ""; const werte = gruppenWerte(), n = norm(g.name), a = norm(g.artikelgruppe || "");
    return werte.find(v => norm(v) === n || (a && norm(v) === a)) || werte.find(v => norm(v).includes(n) || n.includes(norm(v))) || "";
  }
  const gruppeObj = () => (S().entwurf?.gruppen || []).find(g => g.id === K.pi.gruppe);

  /* ---------- Abgleich ---------- */
  /** Codes, die in der Gruppe vorkommen: Wert → Merkmal; Fahrzeuge der Gruppe */
  function inGruppe(mo, gid) {
    const g = mo.gruppen.find(x => x.id === gid), werte = new Map(), fahrzeuge = new Map();
    const objekte = [g, ...mo.gruppen.filter(x => x.id !== gid && E.gruppenPfad(mo, x.id).some(y => y.id === gid)), ...E.familienArtikel(mo, gid)];
    for (const o of objekte) for (const { m, werte: ws } of E.zuordnung(mo, o).map(z => ({ m: E.merkmal(mo, z.id), werte: z.werte })).filter(x => x.m)) for (const w of ws && ws.length ? x(m, ws) : m.werte) if (w.code) werte.set(String(w.code).toUpperCase(), { m, w });
    function x(m, ws) { return m.werte.filter(w => ws.includes(w.id)); }
    for (const p of E.familienArtikel(mo, gid)) if (p.code) fahrzeuge.set(String(p.code).toUpperCase(), p);
    return { werte, fahrzeuge };
  }
  function zeilenLesen() {
    const i = K.pi, aoa = i.blaetter[i.blatt], out = new Map(), warn = []; let akt = "";
    if (i.sp.code == null || i.sp.preis == null) return { zeilen: [], warn };
    aoa.slice(i.kz + 1).forEach((r, k) => {
      if (i.sp.gruppe != null) { const v = txt(r?.[i.sp.gruppe]); if (v) akt = v; if (i.filter && norm(akt) !== norm(i.filter)) return; }
      const code = txt(r?.[i.sp.code]); if (!code) return;
      const roh = r?.[i.sp.preis]; if (txt(roh) === "") return; const preis = zahl(roh); if (preis == null) return;
      const C = code.toUpperCase();
      if (out.has(C)) { if (out.get(C).preis !== preis) out.get(C).doppelt = true; return; }
      out.set(C, { code, preis, name: i.sp.name != null ? txt(r?.[i.sp.name]) : "", zeile: i.kz + 2 + k });
    });
    for (const z of out.values()) if (z.doppelt) warn.push(`${z.code}: mehrere Preise in der Datei, der erste (${K.eur(z.preis)}) wird verwendet.`);
    return { zeilen: [...out.values()], warn };
  }
  function abgleich() {
    const mo = S().entwurf, i = K.pi, { zeilen, warn } = zeilenLesen(), ig = inGruppe(mo, i.gruppe);
    const alleWerte = new Map(); for (const m of mo.merkmale) for (const w of m.werte) if (w.code && !alleWerte.has(String(w.code).toUpperCase())) alleWerte.set(String(w.code).toUpperCase(), { m, w });
    const liste = zeilen.map(z => {
      const C = z.code.toUpperCase(), fz = ig.fahrzeuge.get(C), t = ig.werte.get(C);
      if (fz) return { ...z, art: fz.basispreis === z.preis ? "gleich" : "aendern", typ: "fahrzeug", bisher: fz.basispreis, text: fz.name, ziel: fz };
      if (t) { const bisher = E.wertPreisGruppe(mo, i.gruppe, t.w); return { ...z, art: bisher === z.preis ? "gleich" : "aendern", typ: "wert", bisher, text: t.w.name, merkmal: t.m.name, ziel: t }; }
      const a = alleWerte.get(C); if (a) return { ...z, art: "fremd", typ: "wert", bisher: null, text: a.w.name, merkmal: a.m.name, ziel: a };
      const art = K.Store.artikelZu(z.code); return { ...z, art: "neu", typ: "neu", bisher: null, text: z.name || art?.name || "" };
    });
    const ord = { aendern: 0, neu: 1, fremd: 2, gleich: 3 }; liste.sort((a, b) => ord[a.art] - ord[b.art]);
    const imExcel = new Set(liste.map(z => z.code.toUpperCase())), fehlen = [...ig.werte.keys()].filter(c => !imExcel.has(c));
    return { liste, warn, fehlen };
  }

  /* ---------- Übernehmen ---------- */
  function zuordnen(mo, g, m, w) {
    const eff = E.zuordnung(mo, g).find(e => e.id === m.id);
    let eigen = (g.merkmale ||= []).find(z => z.id === m.id);
    if (!eff) { if (eigen) { eigen.aus = false; eigen.werte = [w.id]; } else g.merkmale.push({ id: m.id, werte: [w.id] }); return; }
    if (!eff.werte) return; // alle Werte schon frei
    if (eff.werte.includes(w.id)) return;
    if (!eigen) { eigen = { id: m.id }; g.merkmale.push(eigen); }
    eigen.werte = [...eff.werte, w.id];
  }
  function uebernehmen() {
    const mo = S().entwurf, i = K.pi, g = mo.gruppen.find(x => x.id === i.gruppe), ab = abgleich();
    const st = { preise: 0, fahrzeuge: 0, neu: 0, zugeordnet: 0, gleich: 0 };
    const unter = [...mo.gruppen.filter(x => x.id !== g.id && E.gruppenPfad(mo, x.id).some(y => y.id === g.id)), ...E.familienArtikel(mo, g.id)];
    const preisSetzen = (w, preis) => {
      const C = String(w.code).toUpperCase(), eltern = E.gruppenPreis(E.gruppenPfad(mo, g.id).slice(0, -1), w), basis = eltern ? eltern.preis : (w.preis || 0);
      g.preise ||= {}; if (basis === preis) delete g.preise[C]; else g.preise[C] = preis;
      for (const o of unter) if (o.preise && o.preise[C] != null) delete o.preise[C]; // Gruppenpreis gilt für alles darunter
    };
    let ziel = null;
    const zielMerkmal = () => {
      if (ziel) return ziel;
      if (i.neuZiel && i.neuZiel !== "__neu") ziel = E.merkmal(mo, i.neuZiel);
      if (!ziel) { let id = "weitere", n = 2; while (E.merkmal(mo, id)) id = "weitere" + n++; ziel = { id, name: "Weitere Optionen", abschnitt: "", typ: "mehrfach", bereich: "Optionen", werte: [] }; mo.merkmale.push(ziel); }
      return ziel;
    };
    for (const z of ab.liste) {
      if (z.art === "gleich") { st.gleich++; continue; }
      if (z.typ === "fahrzeug") { z.ziel.basispreis = z.preis; st.fahrzeuge++; continue; }
      if (z.art === "aendern") { preisSetzen(z.ziel.w, z.preis); st.preise++; continue; }
      if (!i.neuAn) continue;
      if (z.art === "fremd") { zuordnen(mo, g, z.ziel.m, z.ziel.w); preisSetzen(z.ziel.w, z.preis); st.zugeordnet++; continue; }
      const m = zielMerkmal(); let id = z.code.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "w", n = 2; while (m.werte.some(w => w.id === id)) id = id + "-" + n++;
      const a = K.Store.artikelZu(z.code), w = { id, code: z.code, name: z.text || z.code, preis: z.preis, kosten: a?.kosten || 0, stl: [] };
      m.werte.push(w); zuordnen(mo, g, m, w); st.neu++;
    }
    if (g.preise && !Object.keys(g.preise).length) delete g.preise;
    return st;
  }

  /* ---------- Oberfläche ---------- */
  function gruppenOptionen(mo, aktiv) {
    const kinder = id => mo.gruppen.filter(g => (g.eltern || null) === id);
    const zeile = (g, tiefe) => `<option value="${g.id}" ${g.id === aktiv ? "selected" : ""}>${"   ".repeat(tiefe)}${esc(g.name)} (${E.familienArtikel(mo, g.id).length})</option>` + kinder(g.id).map(k => zeile(k, tiefe + 1)).join("");
    return kinder(null).map(g => zeile(g, 0)).join("");
  }
  const kopf = () => `<div class="kopfzeile"><div><div class="eyebrow">Studio · Excel</div><h2>Codes und Preise importieren</h2><p>Produktgruppe wählen, Excel-Datei ablegen, prüfen, übernehmen. Aus der Datei werden nur die Codes und ihre Preise gelesen. Die Preise gelten für die gewählte Produktgruppe und alle Fahrzeuge darunter.</p></div>
    <div class="row"><a class="btn" href="#studio-import-struktur">Familien und Varianten importieren</a></div></div>`;

  K.route("studio-import", () => {
    const i = K.pi, mo = S().entwurf;
    if (ro()) return kopf() + `<div class="leer">Sie haben nur Leserechte.</div>`;
    if (!mo || !mo.gruppen.length) return kopf() + `<div class="leer">Es gibt noch keine Produktgruppen. Legen Sie diese im <a href="#studio-modell">Produktmodell</a> an oder importieren Sie zuerst <a href="#studio-import-struktur">Familien und Varianten</a>.</div>`;
    if (!mo.gruppen.some(g => g.id === i.gruppe)) i.gruppe = "";
    if (i.schritt === "fertig") {
      const st = i.ergebnis || {}, g = gruppeObj();
      return kopf() + `<section class="panel"><div class="hinweis ok"><b>Übernommen in den Entwurf für „${esc(g?.name || "")}“.</b> ${st.preise} Preise geändert${st.fahrzeuge ? `, ${st.fahrzeuge} Fahrzeugpreise` : ""}${st.neu ? `, ${st.neu} neue Codes` : ""}${st.zugeordnet ? `, ${st.zugeordnet} Codes der Gruppe zugeordnet` : ""}. ${st.gleich} Preise waren schon aktuell.</div>
        <p class="klein gedimmt">Der Vertrieb sieht die neuen Preise nach der Freigabe.</p>
        <div class="row"><button class="btn primary" type="button" data-act="piZurGruppe">Preise der Gruppe ansehen</button><a class="btn" href="#studio-freigabe">Zur Freigabe</a><button class="btn" type="button" data-act="piNeu">Weitere Datei</button></div></section>`;
    }
    const schritt1 = `<section class="panel pi-start">
        <div class="pi-schritt"><span class="pi-nr">1</span><div class="feld"><label for="pi-gruppe">Produktgruppe</label><select id="pi-gruppe" data-act="piGruppe"><option value="">Bitte wählen …</option>${gruppenOptionen(mo, i.gruppe)}</select></div></div>
        <div class="pi-schritt${i.gruppe ? "" : " gesperrt"}"><span class="pi-nr">2</span>
          <label class="ablage" for="pi-datei"><b>Excel-Datei hierher ziehen oder auswählen</b><span class="gedimmt">.xlsx, .xls oder .csv · eine Spalte mit Codes und eine mit Preisen genügt</span><input id="pi-datei" type="file" accept=".xlsx,.xlsm,.xls,.csv" data-act="piDatei" ${i.gruppe ? "" : "disabled"}></label></div>
        ${i.fehler ? `<div class="hinweis warn">${esc(i.fehler)}</div>` : ""}</section>`;
    if (i.schritt !== "pruefen" || !i.blaetter) return kopf() + schritt1;
    return kopf() + pruefen(mo);
  });

  function pruefen(mo) {
    const i = K.pi, g = gruppeObj(), aoa = i.blaetter[i.blatt], kopfz = aoa[i.kz] || [], breite = Math.max(kopfz.length, ...aoa.slice(i.kz, i.kz + 20).map(r => (r || []).length));
    const spOpt = (k, leer) => `<option value="">${leer}</option>` + Array.from({ length: breite }, (_, j) => `<option value="${j}" ${i.sp[k] === j ? "selected" : ""}>${esc(txt(kopfz[j]) || "Spalte " + String.fromCharCode(65 + (j % 26)))}</option>`).join("");
    const gw = gruppenWerte(), ab = abgleich(), n = a => ab.liste.filter(z => z.art === a).length;
    const merkmaleGruppe = [...new Set(E.familienArtikel(mo, g.id).flatMap(p => E.zuordnung(mo, p).map(z => z.id)))].map(id => E.merkmal(mo, id)).filter(Boolean);
    const status = { aendern: ["Preis ändert sich", "aendern"], gleich: ["unverändert", "gleich"], neu: ["neuer Code", "neu"], fremd: ["nicht in dieser Gruppe", "fremd"] };
    const fehlt = i.sp.code == null ? "Bitte die Spalte mit den Codes wählen." : i.sp.preis == null ? "Bitte die Spalte mit den Preisen wählen." : !ab.liste.length ? "In dieser Auswahl wurden keine Codes mit Preis gefunden." : "";
    const zuTun = n("aendern") + (i.neuAn ? n("neu") + n("fremd") : 0);
    return `<section class="panel">
      <div class="pi-einst">
        <div class="feld"><label for="pi-gruppe">Produktgruppe</label><select id="pi-gruppe" data-act="piGruppe">${gruppenOptionen(mo, i.gruppe)}</select></div>
        ${Object.keys(i.blaetter).length > 1 ? `<div class="feld"><label for="pi-blatt">Blatt</label><select id="pi-blatt" data-act="piBlatt">${Object.keys(i.blaetter).map(b => `<option ${b === i.blatt ? "selected" : ""}>${esc(b)}</option>`).join("")}</select></div>` : ""}
        <div class="feld"><label for="pi-sc">Spalte Code</label><select id="pi-sc" data-act="piSp" data-k="code" class="${i.sp.code != null ? "gesetzt" : ""}">${spOpt("code", "– wählen –")}</select></div>
        <div class="feld"><label for="pi-sp">Spalte Preis</label><select id="pi-sp" data-act="piSp" data-k="preis" class="${i.sp.preis != null ? "gesetzt" : ""}">${spOpt("preis", "– wählen –")}</select></div>
        ${gw.length > 1 ? `<div class="feld"><label for="pi-f">Nur Zeilen der Produktgruppe</label><select id="pi-f" data-act="piFilter"><option value="">alle Zeilen</option>${gw.map(v => `<option ${v === i.filter ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></div>` : ""}
      </div>
      <p class="klein gedimmt"><b>${esc(i.datei)}</b> · Überschriften in Zeile ${i.kz + 1} · <button type="button" class="link" data-act="piNeu">andere Datei</button></p>
      ${fehlt ? `<div class="hinweis warn">${fehlt}</div>` : `
      <div class="kpis pi-kpis">
        <div class="kpi aendern"><b class="num">${n("aendern")}</b><span>Preise ändern sich</span></div>
        <div class="kpi"><b class="num">${n("gleich")}</b><span>unverändert</span></div>
        <div class="kpi neu"><b class="num">${n("neu") + n("fremd")}</b><span>Codes noch nicht in ${esc(g.name)}</span></div>
        <div class="kpi"><b class="num">${ab.fehlen.length}</b><span>Codes der Gruppe fehlen in der Datei</span></div></div>
      ${ab.warn.length ? `<div class="hinweis warn klein">${ab.warn.slice(0, 8).map(esc).join("<br>")}${ab.warn.length > 8 ? ` <br>… und ${ab.warn.length - 8} weitere` : ""}</div>` : ""}
      ${n("neu") + n("fremd") ? `<div class="pi-neu"><label class="haken"><input type="checkbox" data-act="piNeuAn" ${i.neuAn ? "checked" : ""}> ${n("neu") + n("fremd")} Codes, die noch nicht in ${esc(g.name)} sind, mit übernehmen</label>
        ${i.neuAn && n("neu") ? `<label class="inline klein">neue Codes ins Merkmal <select id="pi-ziel" data-act="piZiel"><option value="__neu">Weitere Optionen (neu)</option>${merkmaleGruppe.map(m => `<option value="${m.id}" ${m.id === i.neuZiel ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></label>` : ""}</div>` : ""}
      <div class="tabwrap pi-tab"><table class="kompakt"><thead><tr><th>Code</th><th>Bezeichnung</th><th class="r">bisher</th><th class="r">neu</th><th>Status</th></tr></thead><tbody>
        ${ab.liste.slice(0, 400).map(z => `<tr class="pi-${z.art}${(z.art === "neu" || z.art === "fremd") && !i.neuAn ? " pi-aus" : ""}"><td class="mono">${esc(z.code)}</td><td>${esc(z.text)}${z.typ === "fahrzeug" ? ` <span class="chip art">Fahrzeug</span>` : z.merkmal ? ` <span class="gedimmt klein">${esc(z.merkmal)}</span>` : ""}</td><td class="r num gedimmt">${z.bisher == null ? "–" : K.eur(z.bisher)}</td><td class="r num"><b>${K.eur(z.preis)}</b></td><td><span class="pi-status ${status[z.art][1]}">${status[z.art][0]}</span></td></tr>`).join("")}
      </tbody></table>${ab.liste.length > 400 ? `<p class="klein gedimmt">… ${ab.liste.length - 400} weitere Zeilen</p>` : ""}</div>`}
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" type="button" data-act="piNeu">Abbrechen</button><button class="btn gelb" type="button" data-act="piUebernehmen" ${fehlt || !zuTun ? "disabled" : ""}>${zuTun ? `${zuTun} ${zuTun === 1 ? "Änderung" : "Änderungen"} übernehmen` : "Nichts zu ändern"}</button></div></section>`;
  }

  async function lesen(f) {
    try { await K.lib("xlsx"); } catch (e) { throw new Error("Die Excel-Bibliothek ist nicht erreichbar."); }
    const wb = window.XLSX.read(await f.arrayBuffer(), { type: "array" }), bl = {};
    for (const n of wb.SheetNames) bl[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true, blankrows: false });
    return bl;
  }
  K.act.piGruppe = el => { const i = K.pi; i.gruppe = el.value; if (i.blaetter) i.filter = filterRaten(); K.render(); };
  K.act.piDatei = async el => {
    const f = el.files[0]; if (!f) return; const i = K.pi;
    try { i.blaetter = await lesen(f); i.datei = f.name; i.fehler = null; blattSetzen(blattRaten(i.blaetter)); i.schritt = "pruefen"; }
    catch (e) { console.error(e); i.fehler = "Die Datei konnte nicht gelesen werden: " + (e.message || e); }
    K.render();
  };
  document.addEventListener("dragover", e => { if (K.root && K.root.contains(e.target) && K.aktuell() === "studio-import" && K.pi.schritt === "start" && K.pi.gruppe) e.preventDefault(); });
  document.addEventListener("drop", e => { if (!K.root || !K.root.contains(e.target) || K.aktuell() !== "studio-import" || K.pi.schritt !== "start" || !K.pi.gruppe) return; e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) K.act.piDatei({ files: [f] }); });
  K.act.piBlatt = el => { blattSetzen(el.value); K.render(); };
  K.act.piSp = el => { const i = K.pi, k = el.dataset.k; i.sp[k] = el.value === "" ? null : +el.value; for (const x of Object.keys(i.sp)) if (x !== k && i.sp[x] === i.sp[k]) i.sp[x] = null; K.render(); };
  K.act.piFilter = el => { K.pi.filter = el.value; K.render(); };
  K.act.piNeuAn = el => { K.pi.neuAn = el.checked; K.render(); };
  K.act.piZiel = el => { K.pi.neuZiel = el.value; };
  K.act.piNeu = () => { Object.assign(K.pi, { schritt: "start", blaetter: null, datei: null, fehler: null }); K.render(); };
  K.act.piUebernehmen = async () => {
    const i = K.pi, g = gruppeObj(); if (!g) return;
    const st = uebernehmen(); K.Store.entwurfGeaendert();
    await K.Store.log("Import", `Preise für „${g.name}“ aus „${i.datei}“: ${st.preise} geändert, ${st.fahrzeuge} Fahrzeuge, ${st.neu} neue Codes, ${st.zugeordnet} zugeordnet`);
    i.ergebnis = st; i.schritt = "fertig"; i.blaetter = null; K.render();
  };
  K.act.piZurGruppe = () => { K.st.knoten = "g:" + K.pi.gruppe; K.st.modellTab = "preise"; K.gehe("studio-modell"); };
  /** Aus dem Produktmodell mit vorgewählter Gruppe öffnen */
  K.act.piFuerGruppe = el => { Object.assign(K.pi, { gruppe: el.dataset.g, schritt: "start", blaetter: null, fehler: null }); K.gehe("studio-import"); };
  K.preisImport = { abgleich, uebernehmen, spaltenRaten, inGruppe };
})(window);


/* ===== katalogbau.js ===== */
/* =====================================================================
   Studio › Katalog aufbauen
   Links der Katalogbaum (Familien und Fahrzeuge, per Drag & Drop sortieren),
   Mitte das gewählte Element mit seinen Vertriebscodes, rechts der Artikelstamm
   als Baukasten: Artikel auf eine Familie ziehen = neues Fahrzeug,
   auf ein Fahrzeug oder eine Gruppe ziehen = Vertriebscode.
   Was hier steht, zeigt der Katalog nach der Freigabe genau so.
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S, ent = () => S().entwurf, St = () => K.studio;
  const ro = () => !K.Store.schreiben;
  const norm = s => String(s ?? "").toUpperCase().trim();
  const geaendert = t => St().geaendert(t);
  K.kb = { sel: "", poolTab: "artikel", poolSuche: "", poolWahl: new Set(), codeSuche: "", einfuegen: false, einfuegenText: "", ziel: "", loeschen: null, offen: {} };

  /* ---------- Modell-Hilfen ---------- */
  const gruppe = id => ent().gruppen.find(g => g.id === id);
  const kinder = id => ent().gruppen.filter(g => (g.eltern || "") === (id || ""));
  const fahrzeuge = gid => ent().produkte.filter(p => (p.gruppe || "") === (gid || ""));
  const eindeutig = (basis, liste) => { let id = String(basis || "x").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "x", n = 2; const b = id; while (liste.some(x => x.id === id)) id = b + "-" + n++; return id; };
  const wertVon = code => { const C = norm(code); for (const m of ent().merkmale) for (const w of m.werte) if (w.code && norm(w.code) === C) return { m, w }; return null; };
  const codesVon = p => E.produktMerkmale(ent(), p).reduce((n, x) => n + x.werte.length, 0);
  const istUnter = (gid, ziel) => { let g = gruppe(ziel), n = 0; while (g && n++ < 40) { if (g.id === gid) return true; g = gruppe(g.eltern); } return false; };
  const typRaten = t => { t = String(t || "").toLowerCase(); return /tiefbett|tieflader/.test(t) ? "tiefbett" : /plattform/.test(t) ? "plattform" : /nachl|holz|forst|logo|langholz/.test(t) ? "nachlaeufer" : "semi"; };

  /** Ein Merkmal bekommt einen neuen Wert: wer das Merkmal bisher „mit allen Werten“ hatte, behält genau die bisherigen */
  function einfrieren(m) {
    const alle = m.werte.map(w => w.id), mo = ent();
    for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (z.id === m.id && !z.aus && !(z.werte && z.werte.length)) z.werte = alle.slice();
  }
  /** Wert am Fahrzeug verfügbar machen */
  function amFahrzeug(p, m, w) {
    const mo = ent(), eff = E.zuordnung(mo, p).find(e => e.id === m.id); p.merkmale ||= [];
    let eigen = p.merkmale.find(z => z.id === m.id);
    if (!eff) { if (eigen) { eigen.aus = false; eigen.werte = [w.id]; } else p.merkmale.push({ id: m.id, werte: [w.id] }); return; }
    if (!eff.werte || eff.werte.includes(w.id)) return;
    if (!eigen) { eigen = { id: m.id }; p.merkmale.push(eigen); }
    eigen.werte = [...eff.werte, w.id]; eigen.aus = false;
  }
  function vomFahrzeug(p, mid, wid) {
    const mo = ent(), m = E.merkmal(mo, mid), eff = E.zuordnung(mo, p).find(e => e.id === mid); if (!eff) return;
    const rest = (eff.werte || m.werte.map(w => w.id)).filter(id => id !== wid);
    p.merkmale ||= []; let eigen = p.merkmale.find(z => z.id === mid); if (!eigen) { eigen = { id: mid }; p.merkmale.push(eigen); }
    if (rest.length) { eigen.werte = rest; eigen.aus = false; } else { eigen.aus = true; delete eigen.werte; }
    if (eigen.standard === wid) delete eigen.standard;
  }
  function merkmalNeu(name, mehrfach) {
    const mo = ent(), m = { id: eindeutig(E.slug(name).replace(/-/g, "") || "gruppe", mo.merkmale), name, abschnitt: "", typ: mehrfach ? "mehrfach" : "einfach", bereich: mehrfach ? "Optionen" : "Grundmaschine", werte: [] };
    mo.merkmale.push(m); return m;
  }
  function weitereOptionen() { return ent().merkmale.find(m => m.name === "Weitere Optionen") || merkmalNeu("Weitere Optionen", true); }
  /** Codes einem Fahrzeug geben. ziel: Merkmal-ID, "__neu" oder leer. preise: Map CODE → Preis */
  /* ---------- Codes sinnvoll ordnen ----------
     ZZ-Code = Überschrift. Gliedert das Angebot und erscheint dort.
     YY-Code = Untergruppe. Fasst die folgenden Vertriebscodes zu einer Auswahl zusammen,
               erscheint nicht extra im Angebot.
     alle anderen Codes = Vertriebscodes (Auswahlmöglichkeiten) der aktuellen Untergruppe.
       mehrere Codes mit gleichem Anfang (SC590, SC592 …) = eine Auswahl
       mehrere Codes mit verschiedenem Anfang = mehrere wählbar
       ein einzelner Code = Option ja/nein, ein einzelner GA-Code = fest in der Grundausstattung
     Die Reihenfolge der Liste bestimmt die Gliederung. Gleiche ZZ/YY bei mehreren Fahrzeugen
     nutzen dieselben Gruppen. Selbst geänderte Einstellungen einer Gruppe bleiben beim erneuten Ordnen. */
  const praefixe = () => Object.assign({ ueber: "ZZ", grund: "GA", option: "YY" }, S().einst?.codeKennung || {});
  K.codeKennung = praefixe;
  const buchstaben = c => (String(c).toUpperCase().match(/^[A-ZÄÖÜ]+/) || [""])[0];
  const hatName = w => w && w.name && norm(w.name) !== norm(w.code);
  function strukturieren(p) {
    const mo = ent(), pz = praefixe(), U = norm(pz.ueber), G = norm(pz.grund), O = norm(pz.option);
    const istU = c => U && norm(c).startsWith(U), istO = c => O && norm(c).startsWith(O), istG = c => G && norm(c).startsWith(G);
    const pm = E.produktMerkmale(mo, p), jetzt = pm.flatMap(x => x.werte.map(w => ({ w, m: x.m, std: x.standard === w.id })));
    const info = new Map(); // CODE → { code, name, preis, kosten, w, std }
    for (const e of jetzt) info.set(norm(e.w.code), { code: e.w.code, name: hatName(e.w) ? e.w.name : "", w: e.w, std: e.std });
    for (const g of p.grundausstattung || []) if (!info.has(norm(g.code))) info.set(norm(g.code), { code: g.code, name: g.name, preis: g.preis, std: true });
    // Reihenfolge: gemerkte Folge (mit ZZ/YY), neue Codes hinten an
    let folge = (p.codeFolge || []).filter(c => istU(c) || istO(c) || info.has(norm(c)));
    for (const e of [...info.values()]) if (!folge.some(c => norm(c) === norm(e.code))) folge.push(e.code);
    if (!folge.some(c => !istU(c) && !istO(c))) return null;
    mo.codeTexte ||= {};
    const nameVon = (code, sonst) => { const n = info.get(norm(code))?.name || mo.codeTexte[norm(code)] || K.Store.artikelZu(code)?.name || sonst || code; if (n && norm(n) !== norm(code) && (istU(code) || istO(code))) mo.codeTexte[norm(code)] = n; return n; };
    // Gliederung bilden
    const abschnitte = []; let ab = null, grp = null;
    for (const c of folge) {
      if (istU(c)) { const alt = mo.merkmale.find(m => m.abschnittCode && norm(m.abschnittCode) === norm(c)); ab = { code: c, name: nameVon(c, alt?.abschnitt), gruppen: [] }; abschnitte.push(ab); grp = null; continue; }
      if (!ab) { ab = { code: "", name: "Ausstattung", gruppen: [] }; abschnitte.push(ab); }
      if (istO(c)) { const alt = mo.merkmale.find(m => m.code && norm(m.code) === norm(c)); grp = { code: c, name: nameVon(c, alt?.name), codes: [] }; ab.gruppen.push(grp); continue; }
      if (!grp) { grp = { code: "", name: ab.name, codes: [] }; ab.gruppen.push(grp); }
      grp.codes.push(c);
    }
    // alte Zuordnungen des Fahrzeugs ausblenden, neu aufbauen
    const alt = new Set(pm.map(x => x.m.id)); p.merkmale = (p.merkmale || []).filter(z => !alt.has(z.id)); for (const id of alt) p.merkmale.push({ id, aus: true });
    p.grundausstattung = [];
    const neueReihe = [], stat = { abschnitte: 0, auswahl: 0, optionen: 0, fest: 0 };
    const neuAngelegt = new Set();
    const merkmalFuer = (schluessel, name, mehrfach) => {
      let m = mo.merkmale.find(x => x.struktur === schluessel);
      if (!m) { m = merkmalNeu(name, mehrfach); m.struktur = schluessel; neuAngelegt.add(m); }
      return m;
    };
    const wertIn = (m, code) => {
      let x = m.werte.find(v => norm(v.code) === norm(code)); if (x) return x;
      const i = info.get(norm(code)) || {}, a = K.Store.artikelZu(code);
      einfrieren(m); x = i.w ? { ...JSON.parse(JSON.stringify(i.w)), id: eindeutig(i.w.id, m.werte) } : { id: eindeutig(code, m.werte), code, name: i.name || a?.name || code, preis: i.preis ?? a?.preis ?? 0, kosten: a?.kosten || 0, stl: [] };
      m.werte.push(x); return x;
    };
    for (const a of abschnitte) {
      if (!a.gruppen.some(g => g.codes.length)) continue; stat.abschnitte++;
      for (const g of a.gruppen) {
        if (!g.codes.length) continue;
        // Alternativen = größte Gruppe von Codes mit gleichem Anfang (z. B. FW301/FW302). Codes mit anderem Anfang
        // daneben werden eigene Ja/Nein-Codes (z. B. LA325 Arbeitsscheinwerfer). Ohne Alternativen: mehrere wählbar.
        const nurGA = g.codes.every(istG), anf = new Map(); for (const c of g.codes) { const b = buchstaben(c); anf.set(b, (anf.get(b) || 0) + 1); }
        const [hauptAnfang, hauptZahl] = [...anf.entries()].sort((x, y) => y[1] - x[1])[0] || ["", 0];
        const mitAlternativen = !nurGA && hauptZahl >= 2, mehrfach = !mitAlternativen;
        const m = merkmalFuer(`${a.code || a.name}|${g.code || "*"}`, g.name, mehrfach);
        Object.assign(m, { abschnitt: a.name, abschnittCode: a.code, ueberschrift: a.name, bereich: a.name, code: g.code || "" });
        const ws = g.codes.map(c => wertIn(m, c)), ids = ws.map(w => w.id);
        if (nurGA) for (const w of ws) if (!w.feld) { w.feld = "fest"; stat.fest++; } // Grundausstattung: fest enthalten
        if (mitAlternativen && neuAngelegt.has(m)) for (const w of ws) if (!w.feld && buchstaben(w.code) !== hauptAnfang && !istG(w.code)) w.feld = "janein";
        const z = { id: m.id, werte: ids };
        if (m.typ !== "mehrfach" && E.wahlWerte(m, ws).length) { const std = g.codes.find(c => info.get(norm(c))?.std) || g.codes.find(istG) || g.codes[0]; z.standard = ws[g.codes.indexOf(std)].id; stat.auswahl++; } else stat.optionen++;
        p.merkmale.push(z); neueReihe.push(m.id);
      }
    }
    // Grundpreis aus der Grundausstattung, wenn noch keiner gepflegt ist
    p.codeFolge = folge; p.reihenfolge = neueReihe;
    aufraeumen();
    return stat;
  }
  /** Merkmale, die niemand mehr nutzt und keine Regel kennt, entfernen */
  function aufraeumen() {
    const mo = ent(), benutzt = new Set();
    for (const o of [...mo.gruppen, ...mo.produkte]) for (const z of o.merkmale || []) if (!z.aus) benutzt.add(z.id);
    const inRegeln = JSON.stringify(mo.regeln || []);
    const weg = mo.merkmale.filter(m => !benutzt.has(m.id) && !inRegeln.includes(`"${m.id}"`)); if (!weg.length) return;
    const ids = new Set(weg.map(m => m.id)); mo.merkmale = mo.merkmale.filter(m => !ids.has(m.id));
    for (const o of [...mo.gruppen, ...mo.produkte]) { if (o.merkmale) o.merkmale = o.merkmale.filter(z => !ids.has(z.id)); if (o.reihenfolge) o.reihenfolge = o.reihenfolge.filter(id => !ids.has(id)); }
  }
  K.kbStrukturieren = strukturieren;
  function codesZuFahrzeug(p, codes, ziel, preise, namen) {
    const mo = ent(); let zm = ziel && ziel !== "__neu" ? E.merkmal(mo, ziel) : null, neuGruppe = null, schon = 0, anders = 0, neu = 0;
    for (const code of codes) {
      const t = wertVon(code), pr = preise && preise.get(norm(code)), nm = namen && namen.get(norm(code));
      if (t && nm && !hatName(t.w)) t.w.name = nm;
      if (t) {
        if (E.produktMerkmale(mo, p).some(x => x.werte.includes(t.w))) schon++; else amFahrzeug(p, t.m, t.w);
        if (zm && t.m !== zm) anders++;
        if (pr != null && pr !== E.wertPreis(mo, p, t.w)) { p.preise ||= {}; p.preise[norm(code)] = pr; }
        continue;
      }
      if (!zm) zm = ziel === "__neu" ? (neuGruppe = merkmalNeu("Neue Gruppe", true)) : weitereOptionen();
      einfrieren(zm);
      const a = K.Store.artikelZu(code), w = { id: eindeutig(code, zm.werte), code: a?.code || String(code).trim(), name: nm || a?.name || String(code).trim(), preis: pr ?? a?.preis ?? 0, kosten: a?.kosten || 0, stl: [] };
      zm.werte.push(w); amFahrzeug(p, zm, w); neu++;
    }
    return { neu, schon, anders, neuGruppe };
  }
  function fahrzeugeAnlegen(gid, codes) {
    const mo = ent(); let neu = 0, verschoben = 0;
    for (const code of codes) {
      const vorh = mo.produkte.find(p => norm(p.code) === norm(code));
      if (vorh) { if (vorh.gruppe !== gid) { vorh.gruppe = gid; verschoben++; } continue; }
      const a = K.Store.artikelZu(code), name = a?.name || String(code).trim();
      mo.produkte.push({ id: eindeutig(code, mo.produkte), code: a?.code || String(code).trim(), name, gruppe: gid, artnr: a?.code || String(code).trim(), basispreis: a?.preis || 0, basiskosten: a?.kosten || 0, aktiv: true, beschreibung: "",
        visual: { typ: typRaten(name + " " + (gruppe(gid)?.name || "")), asset: null }, stl: [], merkmale: [] });
      neu++;
    }
    return { neu, verschoben };
  }
  /** Element in einem Array vor/nach ein anderes setzen */
  function umsetzen(liste, el, ziel, nach) { const i = liste.indexOf(el); if (i >= 0) liste.splice(i, 1); let j = ziel ? liste.indexOf(ziel) : liste.length; if (j < 0) j = liste.length; liste.splice(nach ? j + 1 : j, 0, el); }

  /* ---------- Bilder (in APplus ohne Dateiablage: verkleinert im Modell) ---------- */
  const alteBildUrl = K.bildUrl;
  K.bildUrl = id => id && String(id).startsWith("data:") ? id : alteBildUrl(id);
  async function bildLesen(el) {
    if (el.dataset.weg) return null;
    if (K.assets) return St().bildHochladen(el);
    const f = el.files && el.files[0]; if (!f) return undefined;
    const url = await new Promise((ok, nein) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = nein; r.readAsDataURL(f); });
    if (/svg/.test(f.type)) return f.size < 150e3 ? url : (K.toast("SVG bitte unter 150 KB."), undefined);
    const img = await new Promise((ok, nein) => { const i = new Image(); i.onload = () => ok(i); i.onerror = nein; i.src = url; });
    const s = Math.min(1, 640 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", .82);
  }
  K.bildLesen = bildLesen;
  const bildFeld = (id, act, daten) => `<div class="bildfeld">${id ? `<img src="${K.bildUrl(id)}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}
    ${ro() ? "" : `<label class="btn klein">${id ? "Ersetzen" : "Bild wählen"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-act="${act}" ${daten} hidden></label>${id ? `<button type="button" class="btn klein" data-act="${act}" data-weg="1" ${daten}>Entfernen</button>` : ""}`}</div>`;

  /* ---------- Ansicht ---------- */
  K.route("studio-katalog", () => {
    const mo = ent(); if (!mo) return St().keinEntwurf();
    const kb = K.kb; if (kb.sel && !objekt(kb.sel)) kb.sel = "";
    const leer = !mo.gruppen.length && !mo.produkte.length;
    return `<div class="kopfzeile"><div><div class="eyebrow">Studio · Entwurf</div><h2>Katalog aufbauen</h2><p>Familien anlegen und per Drag &amp; Drop ordnen. Artikel aus dem Artikelstamm rechts auf eine Familie ziehen ergibt ein Fahrzeug, auf ein Fahrzeug ziehen ergibt Vertriebscodes. Mehrere Artikel ankreuzen und zusammen ziehen.</p></div>
      <div class="row"><button class="btn" type="button" data-act="kbVorschau">Vorschau im Katalog</button><a class="btn primary" href="#studio-freigabe">Freigeben</a>${ro() ? "" : `<button class="btn klein gefahr-text" type="button" data-act="kbLeeren">${kb.leeren ? "Wirklich alles leeren?" : "Neu beginnen"}</button>`}</div></div>
      ${leer ? `<div class="hinweis">Der Entwurf ist leer. Legen Sie links mit „+ Familie“ die erste Familie an, z. B. „Holztransport“.</div>` : mo.produkte.some(p => /^(ST|TB|TB3|PA|LN)$/.test(p.id)) ? `<div class="hinweis">Hier stehen noch die <b>Beispieldaten</b> (Schwertransport, Holztransport …). Mit „Neu beginnen“ starten Sie mit einem leeren Katalog. Der Vertrieb sieht weiter den alten Stand, bis Sie freigeben.</div>` : ""}
      <div class="kb-layout">${baumAnsicht(mo)}<section class="kb-mitte">${mitte(mo)}</section>${pool(mo)}</div>`;
  });
  function objekt(sel) { if (!sel) return null; const id = sel.slice(2); return sel[0] === "g" ? gruppe(id) : E.produkt(ent(), id); }

  function baumAnsicht(mo) {
    const kb = K.kb;
    const famZeile = (g, t) => {
      const ks = kinder(g.id), fs = fahrzeuge(g.id), offen = kb.offen[g.id] ?? true, n = E.familienArtikel(mo, g.id).length;
      return `<li><div class="kb-zeile fam${kb.sel === "g:" + g.id ? " aktiv" : ""}" style="--t:${t}" draggable="${!ro()}" data-drag="g:${g.id}" data-drop="g:${g.id}">
          <button type="button" class="kb-auf" data-act="kbAuf" data-g="${g.id}" aria-label="${offen ? "Zuklappen" : "Aufklappen"}">${ks.length || fs.length ? (offen ? "▾" : "▸") : ""}</button>
          <button type="button" class="kb-nm" data-act="kbWahl" data-s="g:${g.id}"><span class="kb-ik">▤</span>${esc(g.name)}</button><span class="kb-zahl">${n}</span>
          ${ro() ? "" : `<button type="button" class="kb-plus" data-act="kbFamNeu" data-g="${g.id}" title="Unterfamilie anlegen" aria-label="Unterfamilie anlegen">+</button>`}</div>
        ${offen ? `<ul>${ks.map(k => famZeile(k, t + 1)).join("")}${fs.map(p => artZeile(p, t + 1)).join("")}</ul>` : ""}</li>`;
    };
    const artZeile = (p, t) => `<li><div class="kb-zeile art${kb.sel === "p:" + p.id ? " aktiv" : ""}${p.aktiv === false ? " inaktiv" : ""}" style="--t:${t}" draggable="${!ro()}" data-drag="p:${p.id}" data-drop="p:${p.id}">
        <span class="kb-auf"></span><button type="button" class="kb-nm" data-act="kbWahl" data-s="p:${p.id}"><span class="kb-ik">▢</span><span class="kb-artname">${esc(p.name)}<code>${esc(p.code || "")}</code></span></button><span class="kb-zahl" title="Vertriebscodes">${codesVon(p)}</span></div></li>`;
    const ohne = mo.produkte.filter(p => !p.gruppe || !gruppe(p.gruppe));
    return `<nav class="panel kb-baum" aria-label="Katalog">
      <div class="kb-baumkopf"><b>Katalog</b>${ro() ? "" : `<button class="btn klein" type="button" data-act="kbFamNeu" data-g="">+ Familie</button>`}</div>
      <ul class="kb-liste" data-drop="g:">${kinder("").map(g => famZeile(g, 0)).join("")}
        ${ohne.length ? `<li><div class="kb-zeile fam gedimmt" style="--t:0"><span class="kb-auf"></span><span class="kb-nm">Ohne Familie (nicht im Katalog)</span></div><ul>${ohne.map(p => artZeile(p, 1)).join("")}</ul></li>` : ""}</ul>
      ${ro() ? "" : `<div class="kb-wurzel" data-drop="g:">Hierher ziehen = oberste Ebene</div>`}</nav>`;
  }

  function mitte(mo) {
    const kb = K.kb, o = objekt(kb.sel);
    if (!o) return `<div class="leer kb-tipp"><b>So geht es</b><ol><li>Links „+ Familie“ anlegen, z. B. Holztransport, darunter Logo 12.</li><li>Rechts im Artikelstamm die Fahrzeugnummern suchen und auf die Familie ziehen.</li><li>Das Fahrzeug anklicken und die Vertriebscodes hineinziehen oder als Liste einfügen.</li><li>„Vorschau im Katalog“ zeigt das Ergebnis, „Freigeben“ macht es für den Vertrieb sichtbar.</li></ol></div>`;
    return kb.sel[0] === "g" ? familie(mo, o) : fahrzeug(mo, o);
  }
  function familie(mo, g) {
    const fs = fahrzeuge(g.id), ks = kinder(g.id), pfad = E.gruppenPfad(mo, g.id).slice(0, -1);
    return `<div class="panel kb-objekt" data-drop="g:${g.id}">
      <div class="eyebrow">${pfad.length ? pfad.map(x => esc(x.name)).join(" › ") + " ›" : "Familie"}</div>
      <div class="kb-kopf"><input id="kb-gname" class="flach titelfeld" data-chg="kbGName" value="${esc(g.name)}" aria-label="Name der Familie" ${St().dis()}>
        ${ro() ? "" : `<button type="button" class="btn klein gefahr-text" data-act="kbLoeschen">${K.kb.loeschen === "g:" + g.id ? "Wirklich löschen?" : "Löschen"}</button>`}</div>
      <div class="formgitter">
        <div class="feld"><label for="kb-geltern">liegt unter</label><select id="kb-geltern" data-act="kbGEltern" ${St().dis()}><option value="">– oberste Ebene –</option>${mo.gruppen.filter(x => x.id !== g.id && !istUnter(g.id, x.id)).map(x => `<option value="${x.id}" ${x.id === g.eltern ? "selected" : ""}>${esc(E.gruppenPfad(mo, x.id).map(y => y.name).join(" › "))}</option>`).join("")}</select></div>
        <div class="feld"><label>Bild im Katalog</label>${bildFeld(g.bild, "kbBild", `data-s="g:${g.id}"`)}</div></div>
      <div class="feld"><label for="kb-gbes">Beschreibung</label><textarea id="kb-gbes" rows="2" data-chg="kbGBes" ${St().dis()}>${esc(g.beschreibung || "")}</textarea></div>
      <h3>Inhalt</h3>
      ${ks.length || fs.length ? `<div class="kb-kacheln">${ks.map(k => `<button type="button" class="kb-kachel fam" data-act="kbWahl" data-s="g:${k.id}"><span>▤</span><b>${esc(k.name)}</b><small>${E.familienArtikel(mo, k.id).length} Fahrzeuge</small></button>`).join("")}
        ${fs.map(p => `<button type="button" class="kb-kachel" data-act="kbWahl" data-s="p:${p.id}"><span class="kb-silh">${p.bild ? `<img src="${K.bildUrl(p.bild)}" alt="">` : K.silhouette(p.visual?.typ, "var(--ink)")}</span><b>${esc(p.name)}</b><small><code>${esc(p.code || "")}</code> · ${codesVon(p)} Codes</small></button>`).join("")}</div>` : ""}
      <div class="kb-ablage">Fahrzeuge aus dem Artikelstamm hierher ziehen<br><span class="gedimmt klein">oder rechts ankreuzen und „Als Fahrzeuge hinzufügen“</span></div>
      ${famStruktur(mo, g)}</div>`;
  }
  /** Struktur, die alle Fahrzeuge der Familie erben */
  function famStruktur(mo, g) {
    const eff = E.zuordnung(mo, g).map(z => ({ z, m: E.merkmal(mo, z.id) })).filter(x => x.m), n = E.familienArtikel(mo, g.id).length;
    const abs = [...new Set(eff.map(x => x.m.abschnitt || ""))];
    return `<h3>Struktur für alle Fahrzeuge dieser Familie</h3>
      <p class="klein gedimmt">Überschriften und Gruppen, die hier stehen, erbt jedes Fahrzeug darunter. Am Fahrzeug werden nur Abweichungen gepflegt (Codes weglassen, andere Vorauswahl). So legen Sie die Struktur einmal fest statt für jede Variante.</p>
      ${eff.length ? abs.map(ab => `<div class="kb-famab"><span class="kb-abmarke">Überschrift</span> <b>${esc(ab || "ohne Überschrift")}</b></div><table class="kompakt kb-famtab"><tbody>${eff.filter(x => (x.m.abschnitt || "") === ab).map(({ z, m }) => `<tr><td>${esc(m.name)}${m.code ? ` <code class="gedimmt">${esc(m.code)}</code>` : ""}</td><td><select id="kb-fmt-${m.id}" data-act="kbMTyp" data-m="${m.id}" aria-label="Auswahl in dieser Gruppe" ${St().dis()}>${E.GRUPPENTYPEN.map(([k, nm]) => `<option value="${k}" ${E.gruppentyp(m) === k ? "selected" : ""}>${nm}</option>`).join("")}</select></td><td class="r gedimmt klein">${(z.werte || m.werte.map(w => w.id)).length} Codes${z.herkunft !== "g:" + g.id ? " · geerbt" : ""}</td></tr>`).join("")}</tbody></table>`).join("") : `<p class="klein">Noch keine gemeinsame Struktur.</p>`}
      ${ro() || n < 2 ? "" : `<button class="btn klein" type="button" data-act="kbHoch">Gemeinsame Gruppen der ${n} Fahrzeuge an die Familie übergeben</button>`}`;
  }
  function abschnittsweise(pm, karte, p) {
    const ga = p.grundausstattung || [], namen = [...new Set([...pm.map(x => x.m.abschnitt || ""), ...ga.map(g => g.gruppe || "")])];
    if (namen.length === 1 && !namen[0] && !ga.length) return pm.map(karte).join("");
    return namen.map(ab => { const ms = pm.filter(x => (x.m.abschnitt || "") === ab), gs = ga.map((g, i) => ({ g, i })).filter(x => (x.g.gruppe || "") === ab);
      return `<section class="kb-abschnitt"><div class="kb-abkopf"><span class="kb-abmarke">Überschrift</span><input id="kb-ab-${esc(E.slug(ab) || "x")}" class="flach" data-chg="kbAbName" data-ab="${esc(ab)}" value="${esc(ab || "Ohne Überschrift")}" aria-label="Überschrift" ${St().dis()}></div>
        ${gs.length ? `<div class="kb-gruppe fest"><div class="kb-gkopf"><b>Grundausstattung</b><span class="gedimmt klein">fest enthalten, keine Auswahl</span></div><div class="kb-chips">${gs.map(({ g, i }) => `<span class="kb-chip std"><code>${esc(g.code)}</code><span class="kb-cn">${esc(g.name)}</span>${ro() ? "" : `<button type="button" data-act="kbGaWeg" data-i="${i}" title="Entfernen" aria-label="Entfernen">✕</button>`}</span>`).join("")}</div></div>` : ""}
        ${ms.map(karte).join("")}</section>`; }).join("");
  }
  function fahrzeug(mo, p) {
    const kb = K.kb, pm = E.produktMerkmale(mo, p), q = kb.codeSuche.toLowerCase(), a = K.Store.artikelZu(p.code);
    const passt = w => !q || (w.code + " " + w.name).toLowerCase().includes(q);
    const gruppenOpt = `<option value="">Weitere Optionen</option>${pm.map(x => `<option value="${x.m.id}" ${kb.ziel === x.m.id ? "selected" : ""}>${esc(x.m.name)}</option>`).join("")}<option value="__neu" ${kb.ziel === "__neu" ? "selected" : ""}>neue Gruppe</option>`;
    const karte = x => {
      const ws = x.werte.filter(passt); if (q && !ws.length) return "";
      const geerbt = x.herkunft && x.herkunft.startsWith("g:") ? gruppe(x.herkunft.slice(2)) : null;
      return `<article class="kb-gruppe" data-drop="m:${x.m.id}" draggable="${!ro()}" data-drag="m:${x.m.id}">
        <div class="kb-gkopf"><span class="kb-griff" title="Ziehen zum Sortieren">⋮⋮</span><input id="kb-mn-${x.m.id}" class="flach" data-chg="kbMName" data-m="${x.m.id}" value="${esc(x.m.name)}" aria-label="Name der Gruppe" ${St().dis()}>
          <select id="kb-mt-${x.m.id}" class="kb-feldtyp" data-act="kbMTyp" data-m="${x.m.id}" aria-label="Auswahl in dieser Gruppe" title="Gilt für die Codes mit Feldtyp „Auswahl“" ${St().dis()}>${E.GRUPPENTYPEN.map(([k, n]) => `<option value="${k}" ${E.gruppentyp(x.m) === k ? "selected" : ""}>${n}</option>`).join("")}</select>
          ${x.m.typ !== "mehrfach" && E.wahlWerte(x.m, x.werte).length ? `<label class="haken klein" title="Ohne Vorbelegung, der Vertrieb muss wählen"><input type="checkbox" data-act="kbMPflicht" data-m="${x.m.id}" ${x.m.pflicht ? "checked" : ""} ${St().dis()}> Pflicht</label>` : ""}
          <span class="gedimmt klein">${x.werte.length}${geerbt ? ` · von ${esc(geerbt.name)}` : ""}</span>${ro() ? "" : `<button type="button" class="ikon" data-act="kbMWeg" data-m="${x.m.id}" title="Gruppe bei diesem Fahrzeug ausblenden" aria-label="Gruppe ausblenden">✕</button>`}</div>
        <div class="kb-werte">${ws.map(w => { const pr = E.wertPreis(mo, p, w), std = x.standard === w.id, t = E.wertTyp(x.m, w), wahl = t === "auswahl";
          return `<div class="kb-wert${std && wahl ? " std" : ""} t-${t}" draggable="${!ro()}" data-drag="w:${x.m.id}:${w.id}">
            <span class="kb-griff">⋮⋮</span><code class="${K.Store.artikelQuelle && w.code && !K.Store.artikelZu(w.code) ? "unbekannt" : ""}">${esc(w.code || "–")}</code>
            <input id="kb-wn-${x.m.id}-${w.id}" class="flach kb-wname" data-chg="kbWName" data-m="${x.m.id}" data-w="${w.id}" value="${esc(w.name)}" aria-label="Bezeichnung" ${St().dis()}>
            <select id="kb-wt-${x.m.id}-${w.id}" class="kb-werttyp" data-act="kbWTyp" data-m="${x.m.id}" data-w="${w.id}" aria-label="Feldtyp des Codes" ${St().dis()}>${E.WERTTYPEN.map(([k, n, h]) => `<option value="${k}" ${t === k ? "selected" : ""} title="${esc(h)}">${n}</option>`).join("")}</select>
            <span class="num">${K.Store.artikelQuelle === "applus" && w.apStamm !== false && K.Store.artikelZu(w.code) ? `<small class="kb-ap" title="Bezeichnung und Preis kommen aus APplus (ARTIKEL)">AP</small> ` : ""}${pr ? K.eur(pr) : "inkl."}${t === "zahl" ? ` <small>je ${esc(w.zahl?.einheit || "Einheit")}</small>` : ""}</span>
            ${ro() ? "" : wahl && x.m.typ !== "mehrfach" ? `<button type="button" class="kb-stern${std ? " an" : ""}" data-act="kbStd" data-m="${x.m.id}" data-w="${w.id}" title="${std ? "Ist vorausgewählt" : "Als Vorauswahl festlegen"}" aria-label="Als Vorauswahl">${std ? "★" : "☆"}</button>` : t === "janein" ? `<button type="button" class="kb-stern${w.vorgabe ? " an" : ""}" data-act="kbJNVorgabe" data-m="${x.m.id}" data-w="${w.id}" title="${w.vorgabe ? "Ist vorab angekreuzt" : "Vorab ankreuzen"}" aria-label="Vorab ankreuzen">${w.vorgabe ? "★" : "☆"}</button>` : `<span></span>`}
            ${ro() ? "" : `<button type="button" class="kb-x" data-act="kbWWeg" data-m="${x.m.id}" data-w="${w.id}" title="Vom Fahrzeug entfernen" aria-label="Entfernen">✕</button>`}
            ${K.wertExtras(x.m, w, "kb")}</div>`; }).join("")}</div></article>`;
    };
    return `<div class="panel kb-objekt" data-drop="p:${p.id}">
      <div class="eyebrow">${E.gruppenPfad(mo, p.gruppe).map(x => esc(x.name)).join(" › ") || "Ohne Familie"} ›</div>
      <div class="kb-kopf"><input id="kb-pname" class="flach titelfeld" data-chg="kbPFeld" data-k="name" value="${esc(p.name)}" aria-label="Name" ${St().dis()}>
        ${ro() ? "" : `<button type="button" class="btn klein gefahr-text" data-act="kbLoeschen">${K.kb.loeschen === "p:" + p.id ? "Wirklich löschen?" : "Löschen"}</button>`}</div>
      <div class="formgitter kb-pfelder">
        <div class="feld"><label>Artikelnummer</label><div class="wert"><code>${esc(p.code || "–")}</code>${K.Store.artikelQuelle ? (a ? ` <span class="gedimmt klein">${esc(a.name)}</span>` : ` <span class="warntext klein">nicht im Artikelstamm</span>`) : ""}</div></div>
        <div class="feld"><label for="kb-ppreis">Grundpreis</label><input id="kb-ppreis" type="number" step="100" data-chg="kbPFeld" data-k="basispreis" value="${p.basispreis || 0}" ${St().dis()}></div>
        <div class="feld"><label for="kb-pfam">Familie</label><select id="kb-pfam" data-act="kbPFam" ${St().dis()}>${mo.gruppen.map(x => `<option value="${x.id}" ${x.id === p.gruppe ? "selected" : ""}>${esc(E.gruppenPfad(mo, x.id).map(y => y.name).join(" › "))}</option>`).join("")}</select></div>
        <div class="feld"><label class="haken"><input type="checkbox" data-act="kbPAktiv" ${p.aktiv !== false ? "checked" : ""} ${St().dis()}> im Katalog sichtbar</label></div></div>
      <details class="kb-mehr"><summary>Beschreibung und Bild</summary><div class="formgitter"><div class="feld"><label for="kb-pbes">Beschreibung (Info im Katalog)</label><textarea id="kb-pbes" rows="3" data-chg="kbPFeld" data-k="beschreibung" ${St().dis()}>${esc(p.beschreibung || "")}</textarea></div>
        <div class="feld"><label>Bild im Katalog</label>${bildFeld(p.bild, "kbBild", `data-s="p:${p.id}"`)}</div></div></details>
      <div class="kb-codekopf"><h3>Vertriebscodes <span class="gedimmt">${codesVon(p)}</span></h3>
        <input id="kb-csuche" type="search" data-in="kbCSuche" placeholder="Codes filtern" value="${esc(kb.codeSuche)}">
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="kbEinfuegen">${kb.einfuegen ? "Liste schließen" : "Liste einfügen"}</button><button class="btn klein" type="button" data-act="kbOrdnen" title="${esc(praefixe().ueber)}-Codes werden Überschriften, ${esc(praefixe().option)}-Codes Untergruppen, die übrigen Codes deren Auswahlmöglichkeiten">Nach Überschriften ordnen</button><button class="btn klein" type="button" data-act="kbMNeu">+ Gruppe</button>`}</div>
      ${kb.einfuegen ? `<div class="kb-einfuegen"><label for="kb-liste" class="klein">Codes aus Excel kopieren und hier einfügen, eine Zeile pro Code. Steht ein Preis daneben, wird er übernommen.</label>
        <textarea id="kb-liste" rows="6" data-in="kbListeText" placeholder="YY301&#9;3900&#10;YY302&#9;640&#10;7307464">${esc(kb.einfuegenText)}</textarea>
        <div class="row"><label class="haken klein"><input type="checkbox" data-act="kbAuto" ${kb.auto !== false ? "checked" : ""}> nach ${esc(praefixe().ueber)}-Überschriften ordnen</label><label class="inline klein">sonst in <select id="kb-ziel1" data-act="kbZiel">${gruppenOpt}</select></label><button class="btn primary klein" type="button" data-act="kbListeUebernehmen">Codes übernehmen</button></div>
        <p class="klein gedimmt">Spalten: Code, Bezeichnung, Preis (Reihenfolge egal). Die Reihenfolge der Zeilen bestimmt die Gliederung: ${esc(praefixe().ueber)}-Code = Überschrift (erscheint im Angebot), ${esc(praefixe().option)}-Code = Untergruppe, alle Codes darunter = Auswahlmöglichkeiten dieser Untergruppe.</p></div>` : ""}
      <div class="kb-gruppen">${abschnittsweise(pm, karte, p) || `<div class="leer klein">Noch keine Codes. Ziehen Sie Artikel aus dem Artikelstamm hierher oder fügen Sie eine Liste ein.</div>`}
        ${ro() ? "" : `<div class="kb-ablage klein" data-drop="m:__neu">Hierher ziehen = neue Gruppe</div>`}</div></div>`;
  }

  /* Artikelsuche rechts: nur ein Suchfeld mit Vorschlägen (Autocomplete). Treffer per „Übernehmen“,
     Enter oder Ziehen in den Katalog. Gesucht wird im APplus-Artikelstamm und in den Codes des Modells. */
  function treffer(mo, q) {
    q = q.trim(); if (!q) return [];
    const out = [], gesehen = new Set(), ql = q.toLowerCase();
    if (K.Store.artikelQuelle) for (const a of K.Store.artikelSuche(q, 40)) { const C = norm(a.code); if (gesehen.has(C)) continue; gesehen.add(C); out.push({ code: a.code, name: a.name, preis: a.preis }); }
    for (const m of mo.merkmale) for (const w of m.werte) { if (!w.code || out.length >= 40) continue; const C = norm(w.code); if (gesehen.has(C) || !(w.code + " " + w.name).toLowerCase().includes(ql)) continue; gesehen.add(C); out.push({ code: w.code, name: w.name, preis: w.preis, gruppe: m.name }); }
    const vorn = out.filter(x => x.code.toLowerCase().startsWith(ql)); return [...vorn, ...out.filter(x => !vorn.includes(x))].slice(0, 40);
  }
  function pool(mo) {
    const kb = K.kb, o = objekt(kb.sel), istFz = kb.sel[0] === "p", istFam = kb.sel[0] === "g", q = kb.poolSuche;
    const vorhanden = new Set(); if (o && (istFz || istFam)) for (const x of istFz ? E.produktMerkmale(mo, o) : (o.merkmale || []).map(z => ({ werte: (E.merkmal(mo, z.id)?.werte || []).filter(w => !z.werte || z.werte.includes(w.id)) }))) for (const w of x.werte) if (w.code) vorhanden.add(norm(w.code));
    const nutzung = new Map(); for (const p of mo.produkte) { if (p.code) nutzung.set(norm(p.code), "Fahrzeug"); for (const x of E.produktMerkmale(mo, p)) for (const w of x.werte) if (w.code) { const C = norm(w.code), alt = nutzung.get(C); if (alt !== "Fahrzeug") nutzung.set(C, (alt || 0) + 1); } }
    const liste = treffer(mo, q), ziel = !ro() && o && (istFz || istFam), neu = liste.filter(a => !vorhanden.has(norm(a.code)));
    if (kb.acIdx >= liste.length) kb.acIdx = Math.max(0, liste.length - 1);
    const zielText = istFz ? `Ziel: <b>${esc(o.name)}</b>${kb.ziel && E.merkmal(mo, kb.ziel) ? ` › ${esc(E.merkmal(mo, kb.ziel).name)}` : ""}` : istFam ? `Ziel: Familie <b>${esc(o.name)}</b> (gilt für alle Fahrzeuge darin)` : "Links ein Fahrzeug oder eine Familie wählen.";
    return `<aside class="panel kb-pool">
      <h3 class="kb-pooltitel">Codes hinzufügen</h3>
      <div class="kb-ac">
        <input id="kb-psuche" type="search" data-in="kbPSuche" role="combobox" aria-autocomplete="list" aria-expanded="${!!liste.length}" aria-controls="kb-ac-liste" ${liste.length ? `aria-activedescendant="kb-ac-${kb.acIdx || 0}"` : ""} aria-label="Artikel suchen" placeholder="Artikelnummer oder Bezeichnung" value="${esc(q)}" autocomplete="off">
        ${q.trim() ? (liste.length ? `<ul id="kb-ac-liste" class="kb-ac-liste" role="listbox">${liste.map((a, i) => { const da = vorhanden.has(norm(a.code)), nz = nutzung.get(norm(a.code));
          return `<li id="kb-ac-${i}" role="option" aria-selected="${i === (kb.acIdx || 0)}" class="${da ? "da" : ""}" draggable="${!ro()}" data-drag="a:${esc(a.code)}" data-act="kbAcZeile" data-i="${i}">
            <span class="kb-ac-text"><code>${esc(a.code)}</code> <span>${esc(a.name || "")}</span>${a.gruppe ? ` <i class="gedimmt">${esc(a.gruppe)}</i>` : ""}</span>
            <span class="kb-ac-info">${da ? `<span class="kb-nutz">schon drin</span>` : nz ? `<span class="kb-nutz" title="${nz === "Fahrzeug" ? "ist ein Fahrzeug im Katalog" : "als Code in " + nz + " Fahrzeugen"}">${nz === "Fahrzeug" ? "Fzg." : "×" + nz}</span>` : ""}<span class="num klein">${a.preis ? K.eur(a.preis) : ""}</span></span>
            ${ziel && !da ? `<span class="kb-ac-knopf">${istFam ? `<button type="button" class="btn klein ghost" data-act="kbAlsFz" data-c="${esc(a.code)}" title="Als Fahrzeug in dieser Familie anlegen">als Fahrzeug</button>` : ""}<button type="button" class="btn klein primary" data-act="kbUebernehmen" data-c="${esc(a.code)}">Übernehmen</button></span>` : ""}</li>`; }).join("")}</ul>`
          : `<p class="kb-ac-leer klein">Kein Artikel gefunden.</p>`) : ""}
      </div>
      <p class="klein ${ziel ? "" : "gefahr-text"}">${zielText}</p>
      ${q.trim() && ziel && neu.length > 1 ? `<button type="button" class="btn klein" data-act="kbAlleUebernehmen">Alle ${neu.length} neuen Treffer übernehmen</button>` : ""}
      ${!q.trim() ? `<p class="klein gedimmt">Tippen, dann mit <b>Übernehmen</b>, <kbd>Enter</kbd> oder per Ziehen in den Katalog. <kbd>↑</kbd> <kbd>↓</kbd> wählen den Vorschlag.${istFz ? " Ziehen auf eine Gruppe legt den Code dort ab." : ""}</p>` : ""}
      ${!K.Store.artikelQuelle ? `<div class="hinweis klein">Kein Artikelstamm geladen, gesucht wird nur in den Codes des Modells. In APplus die Abfrage <code>queries.artikel</code> auf Tabelle ARTIKEL einrichten oder unter Excel-Import eine Mappe mit Blatt „Import“ einlesen.</div>` : ""}</aside>`;
  }


  /* ---------- Aktionen ---------- */
  const A = K.act, I = K.inp;
  A.kbWahl = el => { K.kb.sel = el.dataset.s; K.kb.loeschen = null; K.kb.codeSuche = ""; K.render(); };
  A.kbAuf = el => { K.kb.offen[el.dataset.g] = !(K.kb.offen[el.dataset.g] ?? true); K.render(); };
  A.kbFamNeu = el => {
    const mo = ent(), eltern = el.dataset.g || null, g = { id: eindeutig("familie", mo.gruppen), name: "Neue Familie", eltern, merkmale: [] };
    mo.gruppen.push(g); if (eltern) K.kb.offen[eltern] = true; K.kb.sel = "g:" + g.id; geaendert("Familie angelegt");
    K.nach(v => { const f = v.querySelector("#kb-gname"); if (f) { f.focus(); f.select(); } });
  };
  I.kbGName = el => { const g = objekt(K.kb.sel); g.name = el.value.trim() || g.name; geaendert(`Familie „${g.name}“ umbenannt`); };
  I.kbGBes = el => { const g = objekt(K.kb.sel); g.beschreibung = el.value; geaendert(`Beschreibung von ${g.name}`); };
  A.kbGEltern = el => { const g = objekt(K.kb.sel); g.eltern = el.value || null; geaendert(`${g.name} verschoben`); };
  A.kbBild = async el => { const o = objekt(el.dataset.s), id = await bildLesen(el); if (id === undefined) return; if (id) o.bild = id; else delete o.bild; geaendert(`Bild von ${o.name} ${id ? "hinterlegt" : "entfernt"}`); };
  I.kbPFeld = el => { const p = objekt(K.kb.sel), k = el.dataset.k; p[k] = k === "basispreis" ? (+el.value || 0) : el.value; if (k === "basispreis" && K.Store.artikelZu(p.code)) p.apStamm = false; geaendert(`${p.name}: ${k === "basispreis" ? "Grundpreis" : k === "name" ? "Name" : "Beschreibung"} geändert`); };
  A.kbPFam = el => { const p = objekt(K.kb.sel); p.gruppe = el.value; geaendert(`${p.name} nach ${gruppe(el.value)?.name} verschoben`); };
  A.kbPAktiv = el => { const p = objekt(K.kb.sel); p.aktiv = el.checked; geaendert(`${p.name} ${el.checked ? "im Katalog sichtbar" : "ausgeblendet"}`); };
  A.kbLoeschen = () => {
    const kb = K.kb, mo = ent(); if (kb.loeschen !== kb.sel) { kb.loeschen = kb.sel; return K.render(); }
    const o = objekt(kb.sel);
    if (kb.sel[0] === "g") {
      for (const k of kinder(o.id)) k.eltern = o.eltern || null; for (const p of fahrzeuge(o.id)) p.gruppe = o.eltern || (mo.gruppen.find(x => x.id !== o.id)?.id || "");
      E.ausGeltungEntfernen(mo, [o.id], []); mo.gruppen = mo.gruppen.filter(g => g !== o);
      geaendert(`Familie ${o.name} gelöscht, Inhalt eine Ebene höher`);
    } else { E.ausGeltungEntfernen(mo, [], [o.id]); mo.produkte = mo.produkte.filter(p => p !== o); geaendert(`Fahrzeug ${o.name} gelöscht`); }
    kb.sel = o.eltern ? "g:" + o.eltern : o.gruppe ? "g:" + o.gruppe : ""; kb.loeschen = null; K.render();
  };
  A.kbLeeren = () => {
    const kb = K.kb; if (!kb.leeren) { kb.leeren = true; K.render(); setTimeout(() => { kb.leeren = false; }, 6000); return; }
    const mo = ent(); Object.assign(mo, { gruppen: [], produkte: [], merkmale: [], regeln: [] }); kb.leeren = false; kb.sel = "";
    geaendert("Entwurf geleert, Katalog wird neu aufgebaut");
  };
  A.kbVorschau = () => { K.kat.entwurf = true; K.kat.gruppe = K.kb.sel[0] === "g" ? K.kb.sel.slice(2) : ""; K.gehe("katalog"); };
  // Codes und Gruppen am Fahrzeug
  I.kbCSuche = el => { K.kb.codeSuche = el.value; K.render(); K.nach(v => { const f = v.querySelector("#kb-csuche"); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } }); };
  I.kbMName = el => { const m = E.merkmal(ent(), el.dataset.m); m.name = el.value.trim() || m.name; geaendert(`Gruppe „${m.name}“ umbenannt`); };
  A.kbWTyp = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); E.wertTypSetzen(w, el.value); geaendert(`${w.code}: ${E.WERTTYPEN.find(x => x[0] === el.value)[1]}`); };
  A.kbJNVorgabe = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); w.vorgabe = !w.vorgabe; geaendert(`${w.code} ${w.vorgabe ? "vorab angekreuzt" : "nicht vorab angekreuzt"}`); };
  I.kbWName = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w); w.name = el.value.trim() || w.name; if (K.Store.artikelZu(w.code)) w.apStamm = false; geaendert(`Bezeichnung von ${w.code} geändert`); };
  /** Einstellungen eines Codes mit Feldtyp Zahl oder Text */
  K.wertExtras = (m, w, px) => {
    const t = E.wertTyp(m, w), d = St().dis(), attr = k => `data-chg="wertExtra" data-m="${m.id}" data-w="${w.id}" data-k="${k}"`;
    if (t === "zahl") { const z = w.zahl || {}; return `<div class="kb-extras">${[["einheit", "Einheit", "text", z.einheit], ["min", "von", "number", z.min], ["max", "bis", "number", z.max], ["schritt", "Schritt", "number", z.schritt], ["standard", "Vorgabe", "number", z.standard]].map(([k, n, ty, v]) => `<label>${n} <input id="${px}-z-${m.id}-${w.id}-${k}" type="${ty}" class="kurz" data-g="zahl" ${attr(k)} value="${esc(v ?? "")}" ${d}></label>`).join("")}</div>`; }
    if (t === "text") { const x = w.text || {}; return `<div class="kb-extras"><label>max. Zeichen <input id="${px}-t-${m.id}-${w.id}-l" type="number" class="kurz" data-g="text" ${attr("maxLaenge")} value="${esc(x.maxLaenge ?? 60)}" ${d}></label><label>Hinweis im Feld <input id="${px}-t-${m.id}-${w.id}-h" data-g="text" ${attr("hinweis")} value="${esc(x.hinweis || "")}" placeholder="z. B. Firmenname" ${d}></label></div>`; }
    return "";
  };
  I.wertExtra = el => { const m = E.merkmal(ent(), el.dataset.m), w = m.werte.find(v => v.id === el.dataset.w), g = el.dataset.g, k = el.dataset.k; w[g] ||= {}; w[g][k] = el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value; geaendert(`${w.code}: ${k} geändert`); };
  A.kbMTyp = el => { const m = E.merkmal(ent(), el.dataset.m); E.feldtypSetzen(m, el.value); geaendert(`${m.name}: ${E.FELDTYPEN.find(x => x[0] === el.value)[1]}`); };
  A.kbHoch = () => { const g = objekt(K.kb.sel), n = E.hochziehen(ent(), g.id); geaendert(`Gemeinsame Struktur an ${g.name} übergeben`); K.toast(n ? `${n} Gruppen gelten jetzt für die ganze Familie` : "Die Fahrzeuge haben keine gemeinsamen Gruppen"); };
  A.kbMPflicht = el => { const m = E.merkmal(ent(), el.dataset.m); m.pflicht = el.checked; geaendert(`${m.name}: ${el.checked ? "Pflichtangabe" : "mit Vorauswahl"}`); };
  A.kbStd = el => { const p = objekt(K.kb.sel), mid = el.dataset.m; p.merkmale ||= []; let z = p.merkmale.find(x => x.id === mid && !x.aus); if (!z) { z = { id: mid }; p.merkmale.push(z); } z.standard = el.dataset.w; const m = E.merkmal(ent(), mid); if (m.pflicht) m.pflicht = false; geaendert(`Vorauswahl bei ${m.name} geändert`); };
  /** Zusatzeinstellungen je Feldtyp (Zahl: Einheit, Grenzen; Text: Länge, Hinweis) */
  K.feldtypExtras = (m, px) => {
    const t = E.feldtyp(m), d = St().dis();
    if (t === "zahl") { const z = m.zahl || {}; return `<div class="kb-extras">${[["einheit", "Einheit", "text", z.einheit], ["min", "von", "number", z.min], ["max", "bis", "number", z.max], ["schritt", "Schritt", "number", z.schritt], ["standard", "Vorgabe", "number", z.standard]].map(([k, n, ty, v]) => `<label class="inline klein">${n} <input id="${px}-z-${m.id}-${k}" type="${ty}" class="kurz" data-chg="feldExtra" data-m="${m.id}" data-g="zahl" data-k="${k}" value="${esc(v ?? "")}" ${d}></label>`).join("")}<span class="gedimmt klein">Preis des Codes gilt je Einheit</span></div>`; }
    if (t === "text") { const x = m.text || {}; return `<div class="kb-extras"><label class="inline klein">max. Zeichen <input id="${px}-t-${m.id}-l" type="number" class="kurz" data-chg="feldExtra" data-m="${m.id}" data-g="text" data-k="maxLaenge" value="${esc(x.maxLaenge ?? 60)}" ${d}></label><label class="inline klein">Hinweis im Feld <input id="${px}-t-${m.id}-h" data-chg="feldExtra" data-m="${m.id}" data-g="text" data-k="hinweis" value="${esc(x.hinweis || "")}" placeholder="z. B. Firmenname" ${d}></label><span class="gedimmt klein">Erster Code liefert Preis und Code fürs Angebot</span></div>`; }
    if (t === "fest") return `<div class="kb-extras"><span class="gedimmt klein">Alle Codes sind immer enthalten und stehen im Angebot unter der Überschrift.</span></div>`;
    return "";
  };
  I.feldExtra = el => { const m = E.merkmal(ent(), el.dataset.m), g = el.dataset.g, k = el.dataset.k; m[g] ||= {}; m[g][k] = el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value; geaendert(`${m.name}: ${k} geändert`); };
  A.kbMNeu = () => { const p = objekt(K.kb.sel), m = merkmalNeu("Neue Gruppe", false); (p.merkmale ||= []).push({ id: m.id, werte: [] }); geaendert("Gruppe angelegt"); K.nach(v => { const f = v.querySelector("#kb-mn-" + m.id); if (f) { f.focus(); f.select(); } }); };
  A.kbMWeg = el => { const p = objekt(K.kb.sel), mid = el.dataset.m; p.merkmale ||= []; const z = p.merkmale.find(x => x.id === mid); if (z) { z.aus = true; delete z.werte; } else p.merkmale.push({ id: mid, aus: true }); geaendert(`Gruppe bei ${p.name} ausgeblendet`); };
  A.kbWWeg = el => { const p = objekt(K.kb.sel); vomFahrzeug(p, el.dataset.m, el.dataset.w); geaendert(`Code bei ${p.name} entfernt`); };
  A.kbEinfuegen = () => { K.kb.einfuegen = !K.kb.einfuegen; K.render(); if (K.kb.einfuegen) K.nach(v => v.querySelector("#kb-liste")?.focus()); };
  I.kbListeText = el => { K.kb.einfuegenText = el.value; };
  A.kbZiel = el => { K.kb.ziel = el.value; };
  A.kbListeUebernehmen = () => {
    const p = objekt(K.kb.sel), preise = new Map(), namen = new Map(), codes = [];
    const istZahl = t => /^-?[\d.,]+\s*(€|EUR)?$/i.test(t);
    for (const zeile of K.kb.einfuegenText.split(/\r?\n/)) {
      const teile = zeile.split(/\t|;|\s{2,}/).map(s => s.trim()).filter(Boolean); if (!teile.length) continue;
      const code = teile[0]; if (!code || /^(code|vertriebscode|artikel)$/i.test(code)) continue;
      codes.push(code);
      const z = teile.slice(1).find(istZahl); if (z != null) preise.set(norm(code), K.X.zahl(z));
      const t = teile.slice(1).find(x => !istZahl(x) && /[a-zäöü]{2}/i.test(x)); if (t) namen.set(norm(code), t);
    }
    if (!codes.length) return K.toast("Keine Codes gefunden.");
    const r = codesZuFahrzeug(p, codes, K.kb.ziel, preise, namen); K.kb.einfuegenText = ""; K.kb.einfuegen = false;
    mitOrdnen(p, codes, r);
  };
  const ordnenText = st => st ? `Geordnet: ${st.abschnitte} Überschriften, ${st.auswahl} Auswahlen, ${st.optionen} Gruppen mit Optionen${st.fest ? `, ${st.fest} Codes fest in der Grundausstattung` : ""}` : "Keine Codes zum Ordnen";
  A.kbOrdnen = () => { const p = objekt(K.kb.sel), st = strukturieren(p); geaendert(`Codes von ${p.name} nach Überschriften geordnet`); K.toast(ordnenText(st)); };
  A.kbAuto = el => { K.kb.auto = el.checked; };
  I.kbAbName = el => { const p = objekt(K.kb.sel), alt = el.dataset.ab, neu = el.value.trim(); if (!neu || neu === alt) return;
    for (const x of E.produktMerkmale(ent(), p)) if ((x.m.abschnitt || "") === alt) { x.m.abschnitt = neu; if (x.m.name === alt) x.m.name = neu; else if (x.m.name.startsWith(alt + " – ")) x.m.name = neu + x.m.name.slice(alt.length); }
    for (const g of p.grundausstattung || []) if (g.gruppe === alt) g.gruppe = neu;
    geaendert(`Überschrift „${neu}“`); };
  A.kbGaWeg = el => { const p = objekt(K.kb.sel); p.grundausstattung.splice(+el.dataset.i, 1); geaendert(`Grundausstattung von ${p.name} geändert`); };
  function meldung(p, r) {
    geaendert(`${r.neu === 1 ? "1 neuer Code" : r.neu + " neue Codes"} bei ${p.name}`);
    const t = [r.neu ? (r.neu === 1 ? "1 neuer Code" : `${r.neu} neue Codes`) : "", r.schon ? `${r.schon} waren schon da` : "", r.anders ? `${r.anders} stehen bereits in einer anderen Gruppe und bleiben dort` : ""].filter(Boolean).join(", ");
    K.toast(t || "Codes hinzugefügt");
    if (r.neuGruppe) K.nach(v => { const f = v.querySelector("#kb-mn-" + r.neuGruppe.id); if (f) { f.focus(); f.select(); } });
  }
  // Baukasten
  A.kbPoolTab = el => { K.kb.poolTab = el.dataset.t; K.kb.poolWahl.clear(); K.render(); };
  const sucheFokus = () => K.nach(v => { const f = v.querySelector("#kb-psuche"); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); v.querySelector('.kb-ac-liste [aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); } });
  I.kbPSuche = el => { K.kb.poolSuche = el.value; K.kb.acIdx = 0; K.render(); sucheFokus(); };
  /** Codes an das gewählte Fahrzeug bzw. die Familie hängen, danach Suchfeld leeren für den nächsten Code */
  const uebernehmen = codes => {
    const o = objekt(K.kb.sel), t = K.kb.sel[0]; if (!o || ro() || !codes.length) return;
    K.kb.poolSuche = ""; K.kb.acIdx = 0;
    if (t === "p") mitOrdnen(o, codes, codesZuFahrzeug(o, codes, K.kb.ziel));
    else if (t === "g") { o.merkmale ||= []; const r = codesZuFahrzeug(o, codes, K.kb.ziel); geaendert(`${codes.length} Codes an Familie ${o.name}`); K.toast(`${codes.length === 1 ? codes[0] + " gilt" : codes.length + " Codes gelten"} jetzt für alle Fahrzeuge in ${o.name}${r.schon ? ` (${r.schon} waren schon da)` : ""}`); }
    else return;
    K.render(); sucheFokus();
  };
  A.kbUebernehmen = (el, e) => { e?.stopPropagation?.(); uebernehmen([el.dataset.c]); };
  A.kbAlleUebernehmen = () => { const mo = ent(), o = objekt(K.kb.sel), da = new Set(); if (K.kb.sel[0] === "p") for (const x of E.produktMerkmale(mo, o)) for (const w of x.werte) if (w.code) da.add(norm(w.code)); uebernehmen(treffer(mo, K.kb.poolSuche).map(a => a.code).filter(c => !da.has(norm(c)))); };
  A.kbAlsFz = (el, e) => { e?.stopPropagation?.(); const g = objekt(K.kb.sel); if (!g) return; const r = fahrzeugeAnlegen(g.id, [el.dataset.c]); K.kb.poolSuche = ""; geaendert(`${el.dataset.c} als Fahrzeug in ${g.name}`); K.toast(r.neu ? `${el.dataset.c} als Fahrzeug angelegt` : r.verschoben ? `${el.dataset.c} hierher verschoben` : `${el.dataset.c} ist schon ein Fahrzeug`); sucheFokus(); };
  A.kbAcZeile = (el, e) => { if (e?.target?.closest?.("button")) return; K.kb.acIdx = +el.dataset.i; K.render(); sucheFokus(); };
  document.addEventListener("keydown", e => {
    const f = e.target; if (!f || f.id !== "kb-psuche" || !K.root || !K.root.contains(f)) return;
    const n = K.root.querySelectorAll(".kb-ac-liste [role=option]").length, kb = K.kb;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { if (!n) return; e.preventDefault(); kb.acIdx = ((kb.acIdx || 0) + (e.key === "ArrowDown" ? 1 : -1) + n) % n; K.render(); sucheFokus(); }
    else if (e.key === "Enter") { e.preventDefault(); const li = K.root.querySelector(`#kb-ac-${kb.acIdx || 0}`), b = li?.querySelector("[data-act=kbUebernehmen]"); if (b) uebernehmen([b.dataset.c]); else if (li) K.toast(objekt(kb.sel) ? "Dieser Code ist schon drin." : "Links ein Fahrzeug oder eine Familie wählen."); }
    else if (e.key === "Escape" && kb.poolSuche) { e.preventDefault(); kb.poolSuche = ""; kb.acIdx = 0; K.render(); sucheFokus(); }
  });
  A.kbPoolWahl = el => { const s = K.kb.poolWahl; el.checked ? s.add(el.dataset.c) : s.delete(el.dataset.c); K.render(); };
  A.kbPoolLeer = () => { K.kb.poolWahl.clear(); K.render(); };
  A.kbPoolAlle = () => { K.root.querySelectorAll(".kb-poolliste input[data-c]").forEach(i => K.kb.poolWahl.add(i.dataset.c)); K.render(); };
  const mitOrdnen = (p, codes, r) => { if (K.kb.auto !== false && (codes.some(c => norm(c).startsWith(norm(praefixe().ueber))) || p.codeFolge)) { if (!p.codeFolge || codes.some(c => norm(c).startsWith(norm(praefixe().ueber)))) p.codeFolge = [...(p.codeFolge || []), ...codes]; const st = strukturieren(p); geaendert(`${codes.length} Codes bei ${p.name} eingefügt und geordnet`); return K.toast(ordnenText(st)); } meldung(p, r); };
  A.kbPoolZuFz = () => { const p = objekt(K.kb.sel), codes = [...K.kb.poolWahl], r = codesZuFahrzeug(p, codes, K.kb.ziel); K.kb.poolWahl.clear(); mitOrdnen(p, codes, r); };
  A.kbPoolFilter = el => { K.kb.poolFilter = el.dataset.f; K.render(); };
  A.kbPoolCodesFam = () => { const g = objekt(K.kb.sel), codes = [...K.kb.poolWahl]; g.merkmale ||= []; const r = codesZuFahrzeug(g, codes, K.kb.ziel); K.kb.poolWahl.clear(); geaendert(`${r.neu + codes.length - r.neu} Codes an Familie ${g.name}`); K.toast(`${codes.length} Codes gelten jetzt für alle Fahrzeuge in ${g.name}${r.schon ? ` (${r.schon} waren schon da)` : ""}`); };
  A.kbPoolZuFam = () => { const g = objekt(K.kb.sel), r = fahrzeugeAnlegen(g.id, [...K.kb.poolWahl]); K.kb.poolWahl.clear(); geaendert(`${r.neu} Fahrzeuge in ${g.name} angelegt`); K.toast(`${r.neu} Fahrzeuge angelegt${r.verschoben ? `, ${r.verschoben} hierher verschoben` : ""}`); };

  /* ---------- Drag & Drop ---------- */
  let zug = null; // { art: "g"|"p"|"a"|"w"|"m", ids: [...] }
  const imBau = e => K.root && K.root.contains(e.target) && K.aktuell() === "studio-katalog" && !ro();
  const lage = (e, el) => { const r = el.getBoundingClientRect(), y = (e.clientY - r.top) / r.height; return y < .28 ? "vor" : y > .72 ? "nach" : "in"; };
  function erlaubt(z, ziel, pos) {
    if (!z || !ziel) return null; const [t, id] = [ziel.slice(0, 1), ziel.slice(2)];
    if (z.art === "g") { if (t !== "g") return null; if (id && (id === z.ids[0] || istUnter(z.ids[0], id))) return null; return id ? pos : "in"; }
    if (z.art === "p") { if (t === "g") return id ? "in" : null; if (t === "p") return pos === "in" ? "nach" : pos; return null; }
    if (z.art === "a") { if (t === "g") return id ? "in" : null; if (t === "p" || t === "m") return "in"; return null; }
    if (z.art === "w") { if (t === "p" || t === "m") return "in"; return null; }
    if (z.art === "m") { if (t === "m" && id !== z.ids[0] && id !== "__neu") return pos === "in" ? "vor" : pos; return null; }
    return null;
  }
  document.addEventListener("dragstart", e => {
    if (!imBau(e)) return; const el = e.target.closest && e.target.closest("[data-drag]"); if (!el) return;
    const d = el.dataset.drag, art = d[0]; let ids = [d.slice(2)];
    if (art === "a" && K.kb.poolWahl.has(ids[0])) ids = [...K.kb.poolWahl];
    if (art === "a" && !K.kb.poolWahl.has(ids[0]) && K.kb.poolWahl.size) ids = [ids[0]];
    zug = { art, ids }; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", ids.join("\n")); } catch (x) {}
    if (ids.length > 1) { const b = document.createElement("div"); b.className = "kb-ziehbild"; b.textContent = `${ids.length} Artikel`; document.body.appendChild(b); e.dataTransfer.setDragImage(b, 10, 10); setTimeout(() => b.remove(), 0); }
    el.classList.add("kb-zieht"); e.stopPropagation();
  });
  document.addEventListener("dragend", () => { zug = null; K.root && K.root.querySelectorAll(".kb-zieht,.kb-in,.kb-vor,.kb-nach").forEach(x => x.classList.remove("kb-zieht", "kb-in", "kb-vor", "kb-nach")); });
  let markiert = null;
  document.addEventListener("dragover", e => {
    if (!zug || !imBau(e)) return; const el = e.target.closest("[data-drop]"); if (!el) return;
    const pos = erlaubt(zug, el.dataset.drop, lage(e, el)); if (!pos) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    if (markiert && markiert !== el) markiert.classList.remove("kb-in", "kb-vor", "kb-nach");
    el.classList.remove("kb-in", "kb-vor", "kb-nach"); el.classList.add("kb-" + pos); markiert = el;
  });
  document.addEventListener("dragleave", e => { const el = e.target.closest && e.target.closest("[data-drop]"); if (el && !el.contains(e.relatedTarget)) el.classList.remove("kb-in", "kb-vor", "kb-nach"); });
  document.addEventListener("drop", e => {
    if (!zug || !imBau(e)) return; const el = e.target.closest("[data-drop]"); if (!el) return;
    const ziel = el.dataset.drop, pos = erlaubt(zug, ziel, lage(e, el)); if (!pos) return;
    e.preventDefault(); const z = zug; zug = null; ablegen(z, ziel, pos);
  });
  function ablegen(z, ziel, pos) {
    const mo = ent(), t = ziel[0], id = ziel.slice(2);
    if (z.art === "g") {
      const g = gruppe(z.ids[0]), zg = gruppe(id);
      if (!zg || pos === "in") { g.eltern = zg ? zg.id : null; umsetzen(mo.gruppen, g, null); if (zg) K.kb.offen[zg.id] = true; }
      else { g.eltern = zg.eltern || null; umsetzen(mo.gruppen, g, zg, pos === "nach"); }
      return geaendert(`${g.name} verschoben`);
    }
    if (z.art === "p") {
      const p = E.produkt(mo, z.ids[0]);
      if (t === "g") { p.gruppe = id; umsetzen(mo.produkte, p, null); K.kb.offen[id] = true; return geaendert(`${p.name} nach ${gruppe(id).name} verschoben`); }
      const zp = E.produkt(mo, id); if (!zp || zp === p) return; p.gruppe = zp.gruppe; umsetzen(mo.produkte, p, zp, pos === "nach"); return geaendert(`${p.name} einsortiert`);
    }
    if (z.art === "a") {
      K.kb.poolWahl.clear();
      if (t === "g") { const r = fahrzeugeAnlegen(id, z.ids); K.kb.offen[id] = true; geaendert(`${r.neu} Fahrzeuge in ${gruppe(id).name} angelegt`); return K.toast(`${r.neu} Fahrzeuge angelegt${r.verschoben ? `, ${r.verschoben} hierher verschoben` : ""}${z.ids.length - r.neu - r.verschoben ? `, ${z.ids.length - r.neu - r.verschoben} waren schon da` : ""}`); }
      const p = t === "p" ? E.produkt(mo, id) : objekt(K.kb.sel); if (!p || K.kb.sel[0] !== "p" && t === "m") return;
      return mitOrdnen(p, z.ids, codesZuFahrzeug(p, z.ids, t === "m" ? id : ""));
    }
    if (z.art === "w") {
      const [mid, wid] = z.ids[0].split(":"), m = E.merkmal(mo, mid), w = m && m.werte.find(x => x.id === wid); if (!w) return;
      const p = t === "p" ? E.produkt(mo, id) : objekt(K.kb.sel); if (!p) return;
      if (t === "p" || (t === "m" && id === mid)) { if (p.id === K.kb.sel.slice(2) && t === "p") return; amFahrzeug(p, m, w); return geaendert(`${w.code} zu ${p.name}`); }
      // in eine andere Gruppe verschieben
      const nutzer = mo.produkte.filter(x => x !== p && E.produktMerkmale(mo, x).some(y => y.werte.includes(w)));
      if (nutzer.length) return K.toast(`${w.code} wird auch bei ${nutzer.length} anderen Fahrzeugen verwendet (z. B. ${nutzer[0].name}) und bleibt in „${m.name}“.`);
      const zm = id === "__neu" ? merkmalNeu("Neue Gruppe", m.typ === "mehrfach") : E.merkmal(mo, id); if (!zm) return;
      vomFahrzeug(p, mid, wid); m.werte = m.werte.filter(x => x !== w);
      for (const o of [...mo.gruppen, ...mo.produkte]) for (const zz of o.merkmale || []) if (zz.id === mid && zz.werte) zz.werte = zz.werte.filter(x => x !== wid);
      einfrieren(zm); if (zm.werte.some(x => x.id === w.id)) w.id = eindeutig(w.id, zm.werte); zm.werte.push(w); amFahrzeug(p, zm, w);
      geaendert(`${w.code} nach „${zm.name}“ verschoben`);
      if (id === "__neu") K.nach(v => { const f = v.querySelector("#kb-mn-" + zm.id); if (f) { f.focus(); f.select(); } });
      return;
    }
    if (z.art === "m") {
      const p = objekt(K.kb.sel); if (!p || K.kb.sel[0] !== "p") return;
      const ordnung = E.zuordnung(mo, p).map(x => x.id), von = z.ids[0];
      const ohne = ordnung.filter(x => x !== von); let j = ohne.indexOf(id); if (j < 0) return; if (pos === "nach") j++; ohne.splice(j, 0, von);
      p.reihenfolge = ohne; geaendert(`Reihenfolge der Gruppen bei ${p.name} geändert`);
    }
  }
})(window);


/* ===== dokument.js ===== */
/* =====================================================================
   Angebotsdokument: Vorlagen aus Bausteinen, Seitenumbruch, Vorschau,
   Druck und PDF. Ein einziger Aufbau für Designer-Vorschau, Druck,
   PDF-Datei und Verkaufsraum, damit überall dasselbe Dokument entsteht.
   PDF: Die fertig gesetzten Seiten werden mit pdf-lib als Vektor-PDF
   nachgezeichnet (Text bleibt markier- und durchsuchbar).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const D = K.dok = {};
  const uid = () => "b" + Math.random().toString(36).slice(2, 9);

  /* ---------- Vorlagen ---------- */
  D.TEXTQUELLEN = [["frei", "eigener Text"], ["einleitung", "Angebotstext: Einleitung"], ["lieferung", "Angebotstext: Lieferung"], ["zahlung", "Angebotstext: Zahlungsbedingungen"], ["gewaehrleistung", "Angebotstext: Gewährleistung"], ["schluss", "Angebotstext: Schluss"]];
  D.BAUSTEINE = [
    ["briefkopf", "Briefkopf", "Logo und Firmenname"], ["adresse", "Anschrift & Infoblock", "Empfänger links, Angebotsdaten rechts"],
    ["titel", "Titel", "z. B. Angebot {{angebot.nr}}"], ["text", "Text", "freier Text oder Angebotstext"],
    ["positionen", "Positionen", "Fahrzeuge mit Konfiguration"], ["uebersicht", "Positionsübersicht", "eine Zeile je Position"],
    ["summen", "Summen", "netto, USt., Gesamtbetrag"], ["bild", "Bild", "Foto, Grafik, Zertifikat"], ["tabelle", "Tabelle", "freie Tabelle"],
    ["unterschrift", "Gruß & Unterschrift", "mit Feld für Auftragserteilung"], ["agb", "AGB / Kleingedrucktes", "mehrspaltig, kleine Schrift"],
    ["stueckliste", "Stückliste", "als Anlage"], ["abstand", "Abstand", ""], ["linie", "Linie", ""], ["seitenumbruch", "Seitenumbruch", ""]];
  const NAME = Object.fromEntries(D.BAUSTEINE.map(b => [b[0], b[1]]));
  D.neuerBlock = typ => ({ id: uid(), typ, aktiv: true, ...({
    briefkopf: { logo: null, logoBreite: 45, ausrichtung: "rechts", zeigeName: true, zusatz: "" },
    adresse: { absenderzeile: true, info: "Angebot: {{angebot.nr}}\nDatum: {{angebot.datum}}\nGültig bis: {{angebot.gueltig}}\nKunden-Nr.: {{kunde.nr}}\nIhr Kontakt: {{bearbeiter.name}}\nTelefon: {{bearbeiter.tel}}\nE-Mail: {{bearbeiter.mail}}" },
    titel: { text: "Angebot {{angebot.nr}}", untertitel: "", groesse: 18 },
    text: { quelle: "frei", titel: "", text: "Text eingeben …" },
    positionen: { bild: "3d", ueberschriften: true, codes: true, preise: "aufpreise", fest: "liste", grundpreis: true, rabatt: true },
    uebersicht: { titel: "Übersicht" },
    summen: { liste: true, rabatte: true, ust: true, hervorheben: true },
    bild: { bild: null, breite: 60, ausrichtung: "mitte", unterschrift: "" },
    tabelle: { titel: "", inhalt: "Merkmal | Wert\nNutzlast | 32 t", kopf: true },
    unterschrift: { gruss: "Mit freundlichen Grüßen", firma: true, bild: null, funktion: "Vertrieb", kunde: true, kundeText: "Auftrag erteilt" },
    agb: { titel: "Allgemeine Geschäftsbedingungen", text: "1. Geltungsbereich …", spalten: 2, neueSeite: true },
    stueckliste: { neueSeite: true },
    abstand: { hoehe: 8 }, linie: { farbe: "#D0D6DC", staerke: 0.3 }, seitenumbruch: {}
  }[typ] || {}) });
  D.standardVorlage = () => ({
    id: "standard", name: "Standardangebot", standard: true, gruppen: [],
    seite: { o: 16, r: 18, u: 26, l: 22, schrift: "helvetica", groesse: 9.5, akzent: "#F2B705", dunkel: "#1A2129", streifen: true, briefpapier: null, briefpapierFolge: null },
    folgekopf: "Angebot {{angebot.nr}} · {{kunde.firma}}",
    fuss: { zeigen: true, seitenzahl: true, spalten: ["{{firma.name}}\n{{firma.strasse}}\n{{firma.ort}}", "Telefon {{firma.tel}}\n{{firma.web}}", "USt-IdNr. {{firma.ustid}}"] },
    bloecke: [D.neuerBlock("briefkopf"), D.neuerBlock("adresse"), D.neuerBlock("titel"),
      { ...D.neuerBlock("text"), quelle: "einleitung", text: "" }, D.neuerBlock("positionen"), D.neuerBlock("summen"),
      { ...D.neuerBlock("text"), quelle: "lieferung", titel: "Lieferung", text: "" }, { ...D.neuerBlock("text"), quelle: "zahlung", titel: "Zahlungsbedingungen", text: "" },
      { ...D.neuerBlock("text"), quelle: "gewaehrleistung", titel: "Gewährleistung", text: "" }, { ...D.neuerBlock("text"), quelle: "schluss", text: "" },
      D.neuerBlock("unterschrift"), { ...D.neuerBlock("stueckliste"), aktiv: false }]
  });
  /** Vorlagen sicherstellen; alte Einstellungen (zeigeBild usw.) werden übernommen */
  D.vorlagen = () => {
    const e = S().einst; if (!e) return [];
    if (!Array.isArray(e.dokumente) || !e.dokumente.length) {
      const v = D.standardVorlage(), alt = e.vorlage || {}, pos = v.bloecke.find(b => b.typ === "positionen");
      pos.bild = alt.zeigeBild === false ? "kein" : "3d"; pos.preise = alt.zeigeMerkmalpreise === false ? "keine" : "aufpreise";
      v.bloecke.find(b => b.typ === "stueckliste").aktiv = !!alt.zeigeStueckliste;
      e.dokumente = [v];
    }
    return e.dokumente;
  };
  D.vorlage = id => { const l = D.vorlagen(); return l.find(v => v.id === id) || l.find(v => v.standard) || l[0]; };
  /** Vorlage für ein Angebot: eigene Wahl, sonst passend zur Produktfamilie, sonst Standard */
  D.vorlageFuer = (a, mo) => {
    const l = D.vorlagen(); if (a.vorlageId && l.some(v => v.id === a.vorlageId)) return D.vorlage(a.vorlageId);
    const p = mo && a.positionen.find(x => x.typ === "konfig"), prod = p && E.produkt(mo, p.produkt);
    if (prod) { const kette = E.gruppenKette(mo, prod); const v = l.find(x => (x.gruppen || []).some(g => kette.includes(g))); if (v) return v; }
    return D.vorlage();
  };

  /* ---------- Platzhalter und einfache Auszeichnung ---------- */
  D.PLATZHALTER = ["kunde.firma", "kunde.person", "kunde.strasse", "kunde.ort", "kunde.nr", "angebot.nr", "angebot.datum", "angebot.gueltig", "angebot.netto", "angebot.brutto", "bearbeiter.name", "bearbeiter.tel", "bearbeiter.mail", "firma.name", "firma.strasse", "firma.ort", "firma.tel", "firma.web", "firma.ustid", "heute"];
  K.platzhalter = (text, a, einst) => {
    einst = einst || S().einst || {}; const b = (einst.vertrieb || []).find(v => v.id === a.bearbeiter) || a.bearbeiterInfo || {}, f = einst.firma || {};
    const kd = (S().kunden || []).find(k => k.id === a.kundeId) || {}, sum = E.summen(a, einst.mwst);
    const werte = { "kunde.firma": a.kunde?.firma, "kunde.person": a.kunde?.person, "kunde.strasse": a.kunde?.strasse || kd.strasse, "kunde.ort": a.kunde?.ort || kd.ort, "kunde.nr": kd.nr || a.kunde?.nr,
      "angebot.nr": a.nr, "angebot.datum": K.datum(a.erstellt), "angebot.gueltig": K.datum(a.gueltig), "angebot.netto": K.eur2(sum.netto), "angebot.brutto": K.eur2(sum.brutto),
      "bearbeiter.name": b.name, "bearbeiter.tel": b.tel, "bearbeiter.mail": b.mail, "firma.name": f.name, "firma.strasse": f.strasse, "firma.ort": f.ort, "firma.tel": f.tel, "firma.web": f.web, "firma.ustid": f.ustid, heute: K.datum(Date.now()) };
    return String(text || "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => werte[k] ?? (k in werte ? "" : m));
  };
  /** **fett**, *kursiv*, Zeilen mit „- “ als Liste, Leerzeile = neuer Absatz. Liefert Absätze (für den Seitenumbruch). */
  D.absaetze = (txt, a) => {
    const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<i>$2</i>");
    return String(K.platzhalter(txt, a) || "").split(/\n\s*\n/).map(abs => {
      const z = abs.split("\n");
      if (z.every(l => /^\s*[-•]\s+/.test(l))) return `<ul>${z.map(l => `<li>${inl(l.replace(/^\s*[-•]\s+/, ""))}</li>`).join("")}</ul>`;
      return `<p>${z.map(inl).join("<br>")}</p>`;
    }).filter(x => x !== "<p></p>");
  };

  /* ---------- Bausteine → Fließelemente ---------- */
  const eur = v => K.eur2(v || 0);
  const bildUrl = id => id ? K.bildUrl(id) : null;
  const zeile = (b, html, extra = {}) => ({ blk: b.id, html, ...extra });
  D.elemente = (a, v, mo, ctx = {}) => {
    const e = S().einst || {}, f = e.firma || {}, out = [], sum = E.summen(a, e.mwst);
    for (const b of v.bloecke) {
      if (b.aktiv === false) continue;
      const P = t => K.platzhalter(t, a, e);
      switch (b.typ) {
        case "briefkopf": out.push(zeile(b, `<div class="d-kopf ${b.ausrichtung === "links" ? "links" : ""}">${b.logo ? `<img src="${bildUrl(b.logo)}" style="width:${b.logoBreite || 45}mm" alt="">` : ""}<div class="d-kopf-text">${b.zeigeName !== false ? `<b>${esc(f.name || "")}</b>` : ""}${b.zusatz ? `<span>${esc(P(b.zusatz))}</span>` : ""}</div></div>`)); break;
        case "adresse": {
          const info = String(b.info || "").split("\n").filter(Boolean).map(l => { const i = l.indexOf(":"); return i < 0 ? [l, ""] : [l.slice(0, i), l.slice(i + 1)]; });
          out.push(zeile(b, `<div class="d-adresse"><div class="d-empf">${b.absenderzeile !== false ? `<div class="d-absender">${esc([f.name, f.strasse, f.ort].filter(Boolean).join(" · "))}</div>` : ""}
            ${[a.kunde?.firma, a.kunde?.person, a.kunde?.strasse, a.kunde?.ort].filter(Boolean).map(esc).join("<br>")}</div>
            <table class="d-info">${info.map(([l, w]) => `<tr><td>${esc(P(l).trim())}</td><td>${esc(P(w).trim())}</td></tr>`).join("")}</table></div>`)); break;
        }
        case "titel": out.push(zeile(b, `<div class="d-titel" style="font-size:${b.groesse || 18}pt">${esc(P(b.text))}</div>${b.untertitel ? `<div class="d-untertitel">${esc(P(b.untertitel))}</div>` : ""}`, { mitNaechstem: true })); break;
        case "text": {
          const q = b.quelle && b.quelle !== "frei" ? b.quelle : null, t = q ? (a.texte && a.texte[q] != null ? a.texte[q] : e.vorlage?.[q]) : b.text; if (!String(t || "").trim()) break;
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          for (const abs of D.absaetze(t, a)) out.push(zeile(b, `<div class="d-text">${abs}</div>`));
          break;
        }
        case "positionen": {
          let nr = 0;
          for (const [i, p] of a.positionen.entries()) {
            nr += 10; const ges = p.einzel * p.menge * (1 - (p.rabatt || 0) / 100);
            out.push(zeile(b, `<div class="d-poskopf"><span>Pos. ${nr}</span><b>${esc(p.typ === "konfig" ? p.produktName : p.text)}</b><span>${p.menge} Stk</span></div>`, { mitNaechstem: true }));
            if (p.typ === "konfig") {
              const prod = mo && E.produkt(mo, p.produkt);
              if (b.bild !== "kein") { const img = ctx.bilder?.[i] || (prod?.bild ? bildUrl(prod.bild) : null); out.push(zeile(b, `<div class="d-posbild">${img ? `<img src="${img}" alt="">` : prod ? K.silhouette(prod.visual?.typ, "#1A2129") : ""}</div>`)); }
              let ue = null; const fest = [];
              const zeilen = (p.zeilen || []).filter((z, k) => k > 0 || b.grundpreis !== false);
              for (const z of zeilen) {
                const istFest = mo && z.mid && z.wid && (() => { const m = E.merkmal(mo, z.mid), w = m && m.werte.find(x => x.id === z.wid); return w && E.wertTyp(m, w) === "fest"; })();
                if (istFest && b.fest === "aus") continue;
                if (istFest && b.fest === "zusammen") { fest.push(z); continue; }
                if (b.ueberschriften !== false && z.ueberschrift && z.ueberschrift !== ue) { ue = z.ueberschrift; out.push(zeile(b, `<div class="d-ue">${esc(ue)}</div>`, { mitNaechstem: true })); }
                const preis = b.preise === "keine" ? "" : z.preis ? eur(z.preis) : b.preise === "alle" ? "inklusive" : "";
                out.push(zeile(b, `<div class="d-zeile${b.codes === false ? " ohne-code" : ""}">${b.codes !== false ? `<span class="d-code">${esc(z.mid === "_basis" ? (prod?.code || "") : z.code || "")}</span>` : ""}<span class="d-zt">${esc(z.mid === "_basis" ? z.text : (z.ueberschrift || b.ueberschriften === false ? "" : z.merkmal + ": ") + z.text)}</span><span class="d-zp">${preis}</span></div>`));
              }
              if (fest.length) out.push(zeile(b, `<div class="d-zeile ohne-code"><span class="d-zt"><b>Grundausstattung:</b> ${fest.map(z => esc(z.text)).join(" · ")}</span><span class="d-zp">${b.preise === "keine" ? "" : eur(fest.reduce((n, z) => n + z.preis, 0))}</span></div>`));
              for (const g of p.grundausstattung || []) out.push(zeile(b, `<div class="d-zeile"><span class="d-code">${esc(g.code)}</span><span class="d-zt">${esc(g.name)}</span><span class="d-zp">${b.preise === "alle" ? "inklusive" : ""}</span></div>`));
            }
            out.push(zeile(b, `<div class="d-posfuss"><span>Einzelpreis ${eur(p.einzel)}${p.menge > 1 ? ` × ${p.menge}` : ""}${p.rabatt && b.rabatt !== false ? ` · abzgl. ${K.zahl(p.rabatt, 1)} % Rabatt` : ""}</span><b>${eur(ges)}</b></div>`));
          }
          break;
        }
        case "uebersicht":
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          out.push(zeile(b, `<div class="d-tab d-kopfzeile"><span>Pos.</span><span>Bezeichnung</span><span>Menge</span><span>Gesamt</span></div>`, { mitNaechstem: true }));
          for (const [i, p] of a.positionen.entries()) out.push(zeile(b, `<div class="d-tab"><span>${(i + 1) * 10}</span><span>${esc(p.typ === "konfig" ? p.produktName : p.text)}</span><span>${p.menge}</span><span>${eur(p.einzel * p.menge * (1 - (p.rabatt || 0) / 100))}</span></div>`));
          break;
        case "summen": out.push(zeile(b, `<table class="d-summen">
            ${b.liste !== false ? `<tr><td>Summe Positionen</td><td>${eur(sum.liste - sum.posRabatt)}</td></tr>` : ""}
            ${b.rabatte !== false && a.rabatt ? `<tr><td>Gesamtrabatt ${K.zahl(a.rabatt, 1)} %</td><td>− ${eur(sum.gesamtRabatt)}</td></tr>` : ""}
            <tr><td>Summe netto</td><td>${eur(sum.netto)}</td></tr>
            ${b.ust !== false ? `<tr><td>USt. ${e.mwst} %</td><td>${eur(sum.ust)}</td></tr><tr class="${b.hervorheben !== false ? "gesamt" : ""}"><td>Gesamtbetrag</td><td>${eur(sum.brutto)}</td></tr>` : ""}</table>`)); break;
        case "bild": if (b.bild) out.push(zeile(b, `<figure class="d-bild ${b.ausrichtung || "mitte"}"><img src="${bildUrl(b.bild)}" style="width:${b.breite || 60}%" alt="">${b.unterschrift ? `<figcaption>${esc(P(b.unterschrift))}</figcaption>` : ""}</figure>`)); break;
        case "tabelle": {
          const rows = String(b.inhalt || "").split("\n").filter(l => l.trim()).map(l => l.split("|").map(c => c.trim()));
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          const n = Math.max(1, ...rows.map(r => r.length));
          rows.forEach((r, i) => out.push(zeile(b, `<div class="d-tab frei${i === 0 && b.kopf !== false ? " d-kopfzeile" : ""}" style="grid-template-columns:repeat(${n},1fr)">${Array.from({ length: n }, (_, j) => `<span>${esc(P(r[j] || ""))}</span>`).join("")}</div>`, i === 0 && b.kopf !== false ? { mitNaechstem: true } : {})));
          break;
        }
        case "unterschrift": {
          const bear = (e.vertrieb || []).find(x => x.id === a.bearbeiter) || a.bearbeiterInfo || {};
          out.push(zeile(b, `<div class="d-unterschrift"><div><p>${esc(P(b.gruss || ""))}</p>${b.firma !== false ? `<p><b>${esc(f.name || "")}</b></p>` : ""}${b.bild ? `<img src="${bildUrl(b.bild)}" alt="">` : `<div class="d-ulinie"></div>`}<p>${esc(bear.name || "")}${b.funktion ? `<br><span class="d-klein">${esc(P(b.funktion))}</span>` : ""}</p></div>
            ${b.kunde !== false ? `<div><p><b>${esc(P(b.kundeText || "Auftrag erteilt"))}</b></p><div class="d-ulinie hoch"></div><p class="d-klein">Datum, Unterschrift, Firmenstempel</p></div>` : ""}</div>`)); break;
        }
        case "agb":
          if (b.neueSeite) out.push({ blk: b.id, umbruch: true });
          if (b.titel) out.push(zeile(b, `<h3 class="d-h">${esc(P(b.titel))}</h3>`, { mitNaechstem: true }));
          out.push(zeile(b, `<div class="d-agb" style="column-count:${b.spalten || 2}">${D.absaetze(b.text, a).join("")}</div>`)); break;
        case "stueckliste":
          for (const p of a.positionen.filter(x => x.typ === "konfig")) {
            const prod = mo && E.produkt(mo, p.produkt); if (!prod) continue;
            if (b.neueSeite !== false) out.push({ blk: b.id, umbruch: true });
            out.push(zeile(b, `<h3 class="d-h">Anlage: Stückliste ${esc(p.produktName)}</h3>`, { mitNaechstem: true }));
            for (const r of E.stueckliste(mo, prod, p.sel)) out.push(zeile(b, `<div class="d-tab stl"><span class="d-code">${esc(r.nr)}</span><span>${esc(r.bez)}</span><span>${K.zahl(r.menge, 2)} ${esc(r.me)}</span></div>`));
          }
          break;
        case "abstand": out.push(zeile(b, `<div style="height:${b.hoehe || 8}mm"></div>`)); break;
        case "linie": out.push(zeile(b, `<div class="d-linie" style="border-top:${b.staerke || 0.3}mm solid ${esc(b.farbe || "#D0D6DC")}"></div>`)); break;
        case "seitenumbruch": out.push({ blk: b.id, umbruch: true, html: ctx.designer ? `<div class="d-umbruch">Seitenumbruch</div>` : "" }); break;
      }
    }
    return out;
  };

  /* ---------- Seiten setzen ---------- */
  const seiteCss = v => { const s = v.seite || {}; return `--d-akzent:${s.akzent || "#F2B705"};--d-dunkel:${s.dunkel || "#1A2129"};--d-groesse:${s.groesse || 9.5}pt;font-family:${s.schrift === "times" ? '"Times New Roman",Times,serif' : 'Helvetica,Arial,sans-serif'}`; };
  function seitenRahmen(a, v, nr, gesamt, inhalt) {
    const s = v.seite || {}, e = S().einst || {}, bg = nr === 1 ? s.briefpapier : (s.briefpapierFolge || s.briefpapier);
    return `<div class="d-seite" data-seite="${nr}" style="${seiteCss(v)}">
      ${bg ? `<img class="d-briefpapier" src="${bildUrl(bg)}" alt="">` : ""}
      ${s.streifen !== false ? `<div class="d-streifen"></div>` : ""}
      ${nr > 1 && v.folgekopf ? `<div class="d-folgekopf" style="left:${s.l}mm;right:${s.r}mm;top:${Math.max(6, (s.oFolge ?? s.o) - 8)}mm">${esc(K.platzhalter(v.folgekopf, a, e))}</div>` : ""}
      <div class="d-inhalt" style="top:${nr > 1 ? (s.oFolge ?? s.o) : s.o}mm;left:${s.l}mm;right:${s.r}mm;bottom:${s.u}mm">${inhalt}</div>
      ${!bg && s.briefpapierPdf ? `<div class="d-bp-hinweis">PDF-Briefpapier</div>` : ""}
      ${v.fuss?.zeigen !== false ? `<div class="d-fuss" style="left:${s.l}mm;right:${s.r}mm;bottom:${Math.max(5, s.u - 18)}mm">${(v.fuss?.spalten || []).map(t => `<div>${esc(K.platzhalter(t, a, e)).replace(/\n/g, "<br>")}</div>`).join("")}${v.fuss?.seitenzahl !== false ? `<div class="d-seitenzahl">Seite ${nr} von ${gesamt}</div>` : ""}</div>` : ""}
    </div>`;
  }
  /** Elemente auf Seiten verteilen. Misst im Dokument selbst, damit Vorschau, Druck und PDF gleich umbrechen. */
  D.setzen = (a, v, mo, ctx = {}) => {
    const els = D.elemente(a, v, mo, ctx), s = v.seite || {};
    const mess = document.createElement("div"); mess.className = "dok d-messen"; mess.setAttribute("aria-hidden", "true");
    mess.innerHTML = `<div class="d-seite" style="${seiteCss(v)}"><div class="d-inhalt" style="position:static;width:${210 - s.l - s.r}mm"></div></div><div class="d-mm" style="height:100mm"></div>`;
    (K.root || document.body).appendChild(mess);
    const box = mess.querySelector(".d-inhalt"), pxMm = mess.querySelector(".d-mm").getBoundingClientRect().height / 100;
    const hoehe1 = (297 - s.o - s.u) * pxMm, hoeheF = (297 - (s.oFolge ?? s.o) - s.u) * pxMm, hoehe = () => seiten.length === 1 ? hoehe1 : hoeheF;
    const h = els.map(el => { if (el.umbruch && !el.html) return 0; const d = document.createElement("div"); d.className = "d-el"; d.innerHTML = el.html || ""; box.appendChild(d); const r = d.getBoundingClientRect().height; box.removeChild(d); return r; });
    mess.remove();
    var seiten = [[]]; let y = 0;
    els.forEach((el, i) => {
      if (el.umbruch) { if (seiten[seiten.length - 1].length) { seiten.push([]); y = 0; } if (el.html) { seiten[seiten.length - 1].push(el); y += h[i]; } return; }
      let bedarf = h[i]; if (el.mitNaechstem) { let j = i + 1; while (j < els.length && els[j].mitNaechstem) bedarf += h[j++]; if (j < els.length && !els[j].umbruch) bedarf += h[j]; }
      if (y + Math.min(bedarf, hoehe()) > hoehe() + 0.5 && seiten[seiten.length - 1].length) { seiten.push([]); y = 0; }
      seiten[seiten.length - 1].push(el); y += h[i];
    });
    return seiten;
  };
  D.html = (a, v, mo, ctx = {}) => {
    const seiten = D.setzen(a, v, mo, ctx);
    if (ctx.designer) setTimeout(() => K.root && K.root.querySelectorAll("#ad-seiten .d-inhalt").forEach(x => x.classList.toggle("satzspiegel", !!(v.seite.briefpapier || v.seite.briefpapierPdf))), 0);
    return seiten.map((els, i) => seitenRahmen(a, v, i + 1, seiten.length, els.map(el => `<div class="d-el${ctx.auswahl === el.blk ? " gewaehlt" : ""}" data-blk="${el.blk}">${el.html || ""}</div>`).join(""))).join("");
  };
  /** 3D-Bilder der Positionen vorbereiten (falls die Vorlage sie zeigt) */
  D.bilder = async (a, v, mo) => {
    const pb = v.bloecke.find(b => b.typ === "positionen" && b.aktiv !== false); const out = {};
    if (!pb || pb.bild !== "3d" || !mo) return out;
    try { await K.viewerBereit(); } catch (e) { return out; }
    for (const [i, p] of a.positionen.entries()) { if (p.typ !== "konfig") continue; const prod = E.produkt(mo, p.produkt); if (!prod) continue; try { const u = await K.viewer().bild(mo, prod, p.sel, 1400, 760); if (u) out[i] = u; } catch (e) {} }
    return out;
  };

  /* ---------- Briefpapier aus PDF: Original fürs PDF behalten, Vorschaubilder mit pdf.js ---------- */
  D.briefpapierLesen = async f => {
    const buf = await f.arrayBuffer();
    let pdf = null;
    if (K.assets) { try { pdf = (await K.assets.upload(f)).id; } catch (e) { pdf = null; } }
    if (!pdf) pdf = "data:application/pdf;base64," + btoa(Array.from(new Uint8Array(buf), b => String.fromCharCode(b)).join(""));
    let seiten = 1; const vorschau = [];
    try {
      const lib = await import(/* webpackIgnore: true */ K.cfg.libs.pdfjs); lib.GlobalWorkerOptions.workerSrc = K.cfg.libs.pdfjsWorker;
      const d = await lib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise; seiten = d.numPages;
      for (let i = 1; i <= Math.min(2, seiten); i++) {
        const pg = await d.getPage(i), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 1240 / vp0.width }), c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: g, canvas: c, viewport: vp }).promise; vorschau.push(c.toDataURL("image/jpeg", .85));
      }
    } catch (e) { console.warn("[Konfigurator] Vorschau des Briefpapiers nicht möglich (pdf.js)", e); try { const PL = (await K.lib("pdflib"), window.PDFLib); seiten = (await PL.PDFDocument.load(buf)).getPageCount(); } catch (x) {} }
    return { pdf, seiten, vorschau };
  };

  /* ---------- Druck ---------- */
  D.drucken = async (a, mo) => {
    const v = D.vorlageFuer(a, mo), html = D.html(a, v, mo, { bilder: await D.bilder(a, v, mo) });
    const css = [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).filter(t => /\.d-|\.dok/.test(t)).join("\n"); } catch (e) { return ""; } }).join("\n");
    const f = document.createElement("iframe"); f.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0"; document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(`<!doctype html><html><head><meta charset="utf-8"><title>Angebot ${esc(a.nr)}</title><style>@page{size:A4;margin:0}body{margin:0}${css.replace(/#konfigurator\s*/g, "")}</style></head><body><div class="dok drucken">${html}</div></body></html>`); f.contentDocument.close();
    await new Promise(ok => setTimeout(ok, 400)); f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 3000);
  };

  /* ---------- PDF (Vektor, aus den gesetzten Seiten) ---------- */
  const WIN = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
  const pdfText = s => s.replace(/[✓✔]/g, "x").replace(/[★☆]/g, "*").replace(/→/g, "->").replace(/[−]/g, "-").replace(/­/g, "").replace(/[^\x20-\x7E\xA0-\xFF]/g, c => WIN.includes(c) ? c : "");
  const farbe = (c, PL) => { const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m) return null; if (m[4] !== undefined && +m[4] === 0) return null; return { c: PL.rgb(m[1] / 255, m[2] / 255, m[3] / 255), a: m[4] !== undefined ? +m[4] : 1 }; };
  async function bildBytes(img) {
    const c = document.createElement("canvas"), w = img.naturalWidth || 800, h = img.naturalHeight || 400; c.width = w; c.height = h;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
    const u = c.toDataURL("image/png"); return Uint8Array.from(atob(u.split(",")[1]), ch => ch.charCodeAt(0));
  }
  async function svgBytes(svg, rect) {
    const s = new XMLSerializer().serializeToString(svg), img = new Image(), sc = 3; img.width = rect.width * sc; img.height = rect.height * sc;
    await new Promise((ok, nein) => { img.onload = ok; img.onerror = nein; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s); });
    const c = document.createElement("canvas"); c.width = Math.max(1, rect.width * sc); c.height = Math.max(1, rect.height * sc); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]), ch => ch.charCodeAt(0));
  }
  D.pdf = async (a, mo) => {
    await K.lib("pdflib"); const PL = window.PDFLib;
    const v = D.vorlageFuer(a, mo), html = D.html(a, v, mo, { bilder: await D.bilder(a, v, mo) });
    const host = document.createElement("div"); host.className = "dok d-export"; host.innerHTML = html; (K.root || document.body).appendChild(host);
    await Promise.all([...host.querySelectorAll("img")].map(i => i.complete ? 0 : new Promise(ok => { i.onload = i.onerror = ok; })));
    const doc = await PL.PDFDocument.create(); doc.setTitle(`Angebot ${a.nr}`); doc.setAuthor(S().einst?.firma?.name || ""); doc.setCreator("Fahrzeugkonfigurator");
    const serif = v.seite?.schrift === "times", F = PL.StandardFonts, fonts = {};
    const font = async (fett, kursiv, mono) => { const k = (mono ? "C" : serif ? "T" : "H") + (fett ? "b" : "") + (kursiv ? "i" : ""); if (!fonts[k]) { const n = mono ? (fett ? F.CourierBold : F.Courier) : serif ? (fett && kursiv ? F.TimesRomanBoldItalic : fett ? F.TimesRomanBold : kursiv ? F.TimesRomanItalic : F.TimesRoman) : (fett && kursiv ? F.HelveticaBoldOblique : fett ? F.HelveticaBold : kursiv ? F.HelveticaOblique : F.Helvetica); fonts[k] = await doc.embedFont(n); } return fonts[k]; };
    try {
      let bp = null;
      if (v.seite?.briefpapierPdf) { try { const bytes = new Uint8Array(await (await fetch(bildUrl(v.seite.briefpapierPdf))).arrayBuffer()); const quelle = await PL.PDFDocument.load(bytes); const n = quelle.getPageCount(); bp = await doc.embedPdf(bytes, n > 1 ? [0, 1] : [0]); } catch (e) { console.warn("Briefpapier-PDF nicht eingebettet", e); } }
      let seitenNr = 0;
      for (const seite of host.querySelectorAll(".d-seite")) {
        const P = seite.getBoundingClientRect(), k = 595.28 / P.width, H = 841.89, pg = doc.addPage([595.28, H]); seitenNr++;
        if (bp) { const e = bp[seitenNr > 1 && bp[1] ? 1 : 0]; pg.drawPage(e, { x: 0, y: 0, width: 595.28, height: H }); }
        const X = x => (x - P.left) * k, Y = y => H - (y - P.top) * k;
        for (const el of seite.querySelectorAll("*")) {
          const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
          const bg = farbe(cs.backgroundColor, PL); if (bg && el.tagName !== "IMG") pg.drawRectangle({ x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k, color: bg.c, opacity: bg.a });
          if (cs.backgroundImage && cs.backgroundImage.includes("linear-gradient") && el.classList.contains("d-streifen")) { // Warnstreifen
            for (let i = 0; i * 10 < 210; i++) pg.drawRectangle({ x: i * 10 / 210 * 595.28, y: Y(r.bottom), width: 10 / 210 * 595.28, height: r.height * k, color: i % 2 ? PL.rgb(.106, .137, .169) : PL.rgb(.949, .718, .02) });
          }
          for (const [s, x1, y1, x2, y2] of [["Top", r.left, r.top, r.right, r.top], ["Bottom", r.left, r.bottom, r.right, r.bottom], ["Left", r.left, r.top, r.left, r.bottom], ["Right", r.right, r.top, r.right, r.bottom]]) {
            const w = parseFloat(cs["border" + s + "Width"]); if (!w || cs["border" + s + "Style"] === "none") continue; const c = farbe(cs["border" + s + "Color"], PL); if (!c) continue;
            const o = (s === "Top" || s === "Left" ? 1 : -1) * w / 2;
            pg.drawLine({ start: { x: X(x1 + (s === "Left" || s === "Right" ? o : 0)), y: Y(y1 + (s === "Top" || s === "Bottom" ? o : 0)) }, end: { x: X(x2 + (s === "Left" || s === "Right" ? o : 0)), y: Y(y2 + (s === "Top" || s === "Bottom" ? o : 0)) }, thickness: w * k, color: c.c, opacity: c.a });
          }
          if (el.tagName === "IMG" && bp && el.classList.contains("d-briefpapier")) continue;
          if (el.tagName === "IMG") { try { const b = await bildBytes(el), im = await doc.embedPng(b); pg.drawImage(im, { x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k }); } catch (e) { console.warn("Bild nicht ins PDF übernommen", e); } }
          if (el.tagName === "svg" && !el.closest("svg svg")) { try { const im = await doc.embedPng(await svgBytes(el, r)); pg.drawImage(im, { x: X(r.left), y: Y(r.bottom), width: r.width * k, height: r.height * k }); } catch (e) {} }
        }
        // Text zeilenweise an der gesetzten Stelle
        const tw = document.createTreeWalker(seite, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          const el = n.parentElement; if (!el || el.closest("svg")) continue; const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          const t = n.textContent; if (!t.trim()) continue;
          const fs = parseFloat(cs.fontSize), fett = (+cs.fontWeight || (cs.fontWeight === "bold" ? 700 : 400)) >= 600, kursiv = cs.fontStyle === "italic", mono = /mono|courier/i.test(cs.fontFamily);
          const fnt = await font(fett, kursiv, mono), c = farbe(cs.color, PL) || { c: PL.rgb(0, 0, 0), a: 1 }, gross = cs.textTransform === "uppercase";
          const re = /\S+/g, woerter = []; let m; const rg = document.createRange();
          while ((m = re.exec(t))) { rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rs = rg.getClientRects(); if (rs.length) woerter.push({ i: m.index, j: m.index + m[0].length, r: rs[0] }); }
          const zeilen = []; for (const w of woerter) { const z = zeilen[zeilen.length - 1]; if (z && Math.abs(z.r.top - w.r.top) < fs * .5) { z.j = w.j; z.right = w.r.right; } else zeilen.push({ i: w.i, j: w.j, r: w.r, right: w.r.right }); }
          for (const z of zeilen) {
            let s = pdfText(t.slice(z.i, z.j).replace(/\s+/g, " ")); if (gross) s = s.toUpperCase(); if (!s) continue;
            const size = fs * k, breite = fnt.widthOfTextAtSize(s, size), soll = (z.right - z.r.left) * k;
            const ls = parseFloat(cs.letterSpacing) || 0; const zusatz = ls && s.length > 1 ? (soll - breite) / (s.length - 1) : 0;
            const base = z.r.bottom - (z.r.height - fs) / 2 - fs * 0.21;
            pg.drawText(s, { x: X(z.r.left), y: Y(base), size, font: fnt, color: c.c, opacity: c.a, ...(zusatz > 0 ? { characterSpacing: zusatz } : {}) });
          }
        }
      }
    } finally { host.remove(); }
    return new Blob([await doc.save()], { type: "application/pdf" });
  };
  /** Einheitlicher Einstieg: PDF aus der Vorlage, bei Problemen das einfache PDF */
  const altesPdf = K.pdfErzeugen;
  K.pdfErzeugen = async (a, mo) => { try { return await D.pdf(a, mo); } catch (e) { console.warn("[Konfigurator] Vorlagen-PDF nicht möglich, einfaches PDF", e); if (altesPdf) return altesPdf(a, mo); throw e; } };

  /* =====================================================================
     Angebotsdesigner (Studio › Angebotsdesigner)
     ===================================================================== */
  K.ad = { vorlage: null, blk: null, beispiel: null, zoom: 0.62, tab: "baustein" };
  const ro = () => !K.Store.schreiben, St = () => K.studio;
  const vor = () => D.vorlage(K.ad.vorlage), blk = () => vor().bloecke.find(b => b.id === K.ad.blk);
  const speichern = (text, neu = true) => { K.Store.einstSpeichern(S().einst); if (text) K.Store.log("Angebotsdesigner", text); if (neu) vorschauNeu(); };
  function beispiel() {
    const l = S().angebote || []; let a = l.find(x => x.nr === K.ad.beispiel) || l.find(x => x.positionen.length) || l[0];
    if (!a) { const e = S().einst || {}; a = { nr: "AN-MUSTER", erstellt: Date.now(), gueltig: Date.now() + 30 * 864e5, kunde: { firma: "Musterkunde GmbH", person: "Frau Muster", strasse: "Musterweg 1", ort: "12345 Musterstadt" }, bearbeiter: e.vertrieb?.[0]?.id, positionen: [{ typ: "frei", text: "Beispielposition", einzel: 1000, menge: 1, rabatt: 0, kosten: 0 }], texte: e.vorlage, rabatt: 0 }; }
    return a;
  }
  function vorschauNeu() {
    const box = K.root && K.root.querySelector("#ad-seiten"); if (!box) return;
    const a = beispiel(), mo = S().live || S().entwurf;
    box.innerHTML = D.html(a, vor(), mo, { designer: true, auswahl: K.ad.blk });
    box.style.setProperty("--zoom", K.ad.zoom);
    const n = box.querySelectorAll(".d-seite").length, z = K.root.querySelector("#ad-seitenzahl"); if (z) z.textContent = `${n} ${n === 1 ? "Seite" : "Seiten"}`;
  }
  const feld = (id, label, inner, hint) => `<div class="feld"><label for="${id}">${label}</label>${inner}${hint ? `<span class="klein gedimmt">${hint}</span>` : ""}</div>`;
  const dis = () => ro() ? "disabled" : "";
  function eigenschaften(b) {
    const v = vor(), i = (k, typ = "text", extra = "") => `<input id="ad-${k}" type="${typ}" data-chg="adFeld" data-k="${k}" value="${esc(b[k] ?? "")}" ${extra} ${dis()}>`;
    const h = (k, t) => `<label class="haken"><input type="checkbox" data-act="adHaken" data-k="${k}" ${b[k] !== false ? "checked" : ""} ${dis()}> ${t}</label>`;
    const w = (k, opts) => `<select id="ad-${k}" data-act="adWahlFeld" data-k="${k}" ${dis()}>${opts.map(([x, n]) => `<option value="${x}" ${String(b[k]) === String(x) ? "selected" : ""}>${n}</option>`).join("")}</select>`;
    const lang = (k, z = 6) => `<textarea id="ad-${k}" rows="${z}" data-in="adText" data-k="${k}" ${dis()}>${esc(b[k] ?? "")}</textarea>`;
    const bild = k => `<div class="bildfeld">${b[k] ? `<img src="${bildUrl(b[k])}" alt="">` : `<span class="gedimmt klein">kein Bild</span>`}${ro() ? "" : `<label class="btn klein">${b[k] ? "Ersetzen" : "Bild wählen"}<input type="file" accept="image/png,image/jpeg,image/webp" data-act="adBild" data-k="${k}" hidden></label>${b[k] ? `<button type="button" class="btn klein" data-act="adBild" data-k="${k}" data-weg="1">Entfernen</button>` : ""}`}</div>`;
    const ph = `<div class="ad-ph">${D.PLATZHALTER.map(p => `<button type="button" class="chipbtn" data-act="adPh" data-p="${p}" title="Platzhalter einfügen">{{${p}}}</button>`).join("")}</div>`;
    const tools = `<div class="ad-tools"><button type="button" class="btn klein" data-act="adFmt" data-f="b" title="Fett"><b>F</b></button><button type="button" class="btn klein" data-act="adFmt" data-f="i" title="Kursiv"><i>K</i></button><button type="button" class="btn klein" data-act="adFmt" data-f="l" title="Aufzählung">• Liste</button></div>`;
    let x = "";
    switch (b.typ) {
      case "briefkopf": x = feld("ad-logo", "Logo", bild("logo")) + feld("ad-logoBreite", "Logobreite (mm)", i("logoBreite", "number", 'min="10" max="120"')) + feld("ad-ausrichtung", "Logo", w("ausrichtung", [["rechts", "rechts"], ["links", "links"]])) + h("zeigeName", "Firmenname anzeigen") + feld("ad-zusatz", "Zusatzzeile", i("zusatz")); break;
      case "adresse": x = h("absenderzeile", "Absenderzeile über der Anschrift") + feld("ad-info", "Infoblock rechts", lang("info", 8), "Eine Zeile je Angabe: Bezeichnung: Wert") + ph; break;
      case "titel": x = feld("ad-text", "Titel", i("text")) + feld("ad-untertitel", "Untertitel", i("untertitel")) + feld("ad-groesse", "Schriftgröße (pt)", i("groesse", "number", 'min="8" max="40"')) + ph; break;
      case "text": {
        const q = b.quelle || "frei", e = S().einst;
        x = feld("ad-quelle", "Inhalt", w("quelle", D.TEXTQUELLEN), q === "frei" ? "Steht in jedem Angebot mit dieser Vorlage gleich." : "Standardtext. In jedem Angebot unter „Angebotstexte“ einzeln änderbar.") + feld("ad-titel", "Überschrift", i("titel"));
        x += q === "frei" ? feld("ad-text", "Text", tools + lang("text", 8)) : feld("ad-std", "Standardtext", tools + `<textarea id="ad-std" rows="7" data-in="adStdText" data-q="${q}" ${dis()}>${esc(e.vorlage?.[q] || "")}</textarea>`);
        x += ph + `<p class="klein gedimmt">**fett**, *kursiv*, Zeilen mit „- “ als Liste, Leerzeile = neuer Absatz.</p>`; break;
      }
      case "positionen": x = feld("ad-bild", "Fahrzeugbild", w("bild", [["3d", "3D-Ansicht der Konfiguration"], ["produkt", "Produktbild"], ["kein", "kein Bild"]])) + h("ueberschriften", "Überschriften (ZZ) als Gliederung") + h("codes", "Vertriebscodes anzeigen") + feld("ad-preise", "Preise je Code", w("preise", [["aufpreise", "nur Aufpreise"], ["alle", "alle, sonst „inklusive“"], ["keine", "keine (nur Positionspreis)"]])) + feld("ad-fest", "Feste Codes (Grundausstattung)", w("fest", [["liste", "einzeln aufführen"], ["zusammen", "in einer Zeile"], ["aus", "nicht aufführen"]])) + h("grundpreis", "Grundfahrzeug-Zeile") + h("rabatt", "Positionsrabatt zeigen"); break;
      case "uebersicht": x = feld("ad-titel", "Überschrift", i("titel")); break;
      case "summen": x = h("liste", "Summe Positionen") + h("rabatte", "Gesamtrabatt") + h("ust", "USt. und Gesamtbetrag") + h("hervorheben", "Gesamtbetrag hervorheben"); break;
      case "bild": x = feld("ad-bild", "Bild", bild("bild")) + feld("ad-breite", "Breite (%)", i("breite", "number", 'min="10" max="100"')) + feld("ad-ausrichtung", "Ausrichtung", w("ausrichtung", [["links", "links"], ["mitte", "mittig"], ["rechts", "rechts"]])) + feld("ad-unterschrift", "Bildunterschrift", i("unterschrift")); break;
      case "tabelle": x = feld("ad-titel", "Überschrift", i("titel")) + feld("ad-inhalt", "Zeilen", lang("inhalt", 8), "Spalten mit | trennen") + h("kopf", "Erste Zeile als Kopfzeile") + ph; break;
      case "unterschrift": x = feld("ad-gruss", "Gruß", i("gruss")) + h("firma", "Firmenname") + feld("ad-bild", "Unterschrift als Bild", bild("bild")) + feld("ad-funktion", "Funktion", i("funktion")) + h("kunde", "Feld für Auftragserteilung") + feld("ad-kundeText", "Text dazu", i("kundeText")); break;
      case "agb": x = feld("ad-titel", "Überschrift", i("titel")) + feld("ad-text", "Text", tools + lang("text", 12)) + feld("ad-spalten", "Spalten", w("spalten", [[1, "1"], [2, "2"], [3, "3"]])) + h("neueSeite", "auf neuer Seite beginnen"); break;
      case "stueckliste": x = h("neueSeite", "je Fahrzeug auf neuer Seite"); break;
      case "abstand": x = feld("ad-hoehe", "Höhe (mm)", i("hoehe", "number", 'min="1" max="200"')); break;
      case "linie": x = feld("ad-farbe", "Farbe", i("farbe", "color")) + feld("ad-staerke", "Stärke (mm)", i("staerke", "number", 'step="0.1" min="0.1" max="3"')); break;
      default: x = `<p class="klein gedimmt">Keine Einstellungen.</p>`;
    }
    return `<div class="ad-eigen-kopf"><b>${esc(NAME[b.typ] || b.typ)}</b>${ro() ? "" : `<button type="button" class="ikon" data-act="adBlkKopie" title="Duplizieren">⧉</button><button type="button" class="ikon gefahr" data-act="adBlkWeg" title="Baustein entfernen">✕</button>`}</div>
      <label class="haken"><input type="checkbox" data-act="adAktiv" ${b.aktiv !== false ? "checked" : ""} ${dis()}> im Dokument anzeigen</label>${x}`;
  }
  function seiteEigenschaften(v) {
    const s = v.seite, n = (k, t, min, max) => feld("ad-s-" + k, t, `<input id="ad-s-${k}" type="number" min="${min}" max="${max}" step="0.5" data-chg="adSeite" data-k="${k}" value="${s[k]}" ${dis()}>`);
    const bp = s.briefpapierPdf ? `<div class="ad-bp"><b>PDF-Briefpapier</b> · ${s.briefpapierSeiten || 1} ${s.briefpapierSeiten > 1 ? "Seiten (Seite 1 für die erste, Seite 2 für alle weiteren Seiten)" : "Seite (für alle Seiten)"}${s.briefpapier ? "" : `<br><span class="warntext klein">Vorschau nicht verfügbar, im PDF ist es enthalten.</span>`}</div>` : "";
    const bild = (k, t) => feld("", t, `<div class="bildfeld">${s[k] ? `<img src="${bildUrl(s[k])}" alt="">` : `<span class="gedimmt klein">keins</span>`}${ro() ? "" : `<label class="btn klein">${s[k] ? "Ersetzen" : "Datei wählen"}<input type="file" accept="application/pdf,image/png,image/jpeg" data-act="adSeiteBild" data-k="${k}" hidden></label>${s[k] || (k === "briefpapier" && s.briefpapierPdf) ? `<button type="button" class="btn klein" data-act="adSeiteBild" data-k="${k}" data-weg="1">Entfernen</button>` : ""}`}</div>`, k === "briefpapier" ? "PDF (empfohlen, bleibt im Angebot gestochen scharf) oder Bild in A4. Ein zweiseitiges PDF liefert Seite 1 und Folgeseiten." : "nur nötig, wenn die Folgeseiten anders aussehen");
    return `<div class="ad-eigen-kopf"><b>Seite und Gestaltung</b></div>
      ${feld("ad-vname", "Name der Vorlage", `<input id="ad-vname" data-chg="adVName" value="${esc(v.name)}" ${dis()}>`)}
      <div class="ad-4">${n("o", "Rand oben", 5, 120)}${n("r", "rechts", 5, 50)}${n("u", "unten", 10, 80)}${n("l", "links", 5, 50)}</div>
      ${feld("ad-s-oFolge", "Rand oben ab Seite 2 (mm)", `<input id="ad-s-oFolge" type="number" min="5" max="120" step="0.5" data-chg="adSeite" data-k="oFolge" value="${s.oFolge ?? s.o}" ${dis()}>`)}
      ${feld("ad-s-schrift", "Schrift", `<select id="ad-s-schrift" data-act="adSeiteWahl" data-k="schrift" ${dis()}><option value="helvetica" ${s.schrift !== "times" ? "selected" : ""}>Helvetica / Arial</option><option value="times" ${s.schrift === "times" ? "selected" : ""}>Times</option></select>`, "PDF-Standardschriften, damit das PDF überall gleich aussieht")}
      ${n("groesse", "Grundschrift (pt)", 7, 14)}
      <div class="ad-2">${feld("ad-s-akzent", "Akzentfarbe", `<input id="ad-s-akzent" type="color" data-chg="adSeite" data-k="akzent" value="${esc(s.akzent)}" ${dis()}>`)}${feld("ad-s-dunkel", "Textfarbe", `<input id="ad-s-dunkel" type="color" data-chg="adSeite" data-k="dunkel" value="${esc(s.dunkel)}" ${dis()}>`)}</div>
      <label class="haken"><input type="checkbox" data-act="adSeiteHaken" data-k="streifen" ${s.streifen !== false ? "checked" : ""} ${dis()}> Warnstreifen oben</label>
      <div class="ad-block"><div class="eyebrow">Briefpapier</div>${bp}
      ${bild("briefpapier", "Briefpapier Seite 1")}${s.briefpapierPdf && s.briefpapierSeiten > 1 ? "" : bild("briefpapierFolge", "Briefpapier Folgeseiten")}
      ${s.briefpapier || s.briefpapierPdf ? `<p class="klein gedimmt">Die Ränder oben bestimmen, wo der Text beginnt. Die gestrichelte Linie in der Vorschau zeigt den Textbereich.</p>${ro() ? "" : `<button class="btn klein" type="button" data-act="adBpEigenesAus">Eigenen Briefkopf, Streifen und Fußzeile ausblenden</button>`}` : ""}</div>
      ${feld("ad-fk", "Kopfzeile ab Seite 2", `<input id="ad-fk" data-chg="adFolgekopf" value="${esc(v.folgekopf || "")}" ${dis()}>`)}
      <label class="haken"><input type="checkbox" data-act="adFussHaken" data-k="zeigen" ${v.fuss?.zeigen !== false ? "checked" : ""} ${dis()}> Fußzeile</label>
      <label class="haken"><input type="checkbox" data-act="adFussHaken" data-k="seitenzahl" ${v.fuss?.seitenzahl !== false ? "checked" : ""} ${dis()}> Seitenzahl</label>
      ${(v.fuss?.spalten || []).map((t, j) => feld("ad-f" + j, `Fußzeile Spalte ${j + 1}`, `<textarea id="ad-f${j}" rows="3" data-in="adFuss" data-j="${j}" ${dis()}>${esc(t)}</textarea>`)).join("")}
      ${feld("ad-gruppen", "Automatisch für Produktfamilien", `<div class="ad-gruppen">${((S().live || S().entwurf)?.gruppen || []).map(g => `<label class="haken klein"><input type="checkbox" data-act="adGruppe" data-g="${g.id}" ${(v.gruppen || []).includes(g.id) ? "checked" : ""} ${dis()}> ${esc(g.name)}</label>`).join("") || `<span class="gedimmt klein">keine Familien</span>`}</div>`, "Angebote mit Fahrzeugen dieser Familien nutzen diese Vorlage, wenn nichts anderes gewählt ist.")}`;
  }

  K.route("studio-vorlagen", () => {
    const e = S().einst; if (!e) return St().keinEntwurf();
    const l = D.vorlagen(), v = vor(); if (!v) return "";
    K.ad.vorlage = v.id; if (K.ad.blk && !v.bloecke.some(b => b.id === K.ad.blk)) K.ad.blk = null;
    const b = blk(), ang = (S().angebote || []).filter(a => a.positionen.length), bsp = beispiel();
    K.nach(vorschauNeu);
    return St().kopf("Angebotsdesigner", "Aufbau und Gestaltung der Angebotsdokumente. Bausteine links in die Seite ziehen, anklicken zum Bearbeiten, Reihenfolge per Ziehen ändern. Vorschau, Druck und PDF zeigen genau dasselbe Dokument.") + `
      <div class="ad-leiste panel">
        <label class="inline">Vorlage <select id="ad-vorlage" data-act="adVorlage">${l.map(x => `<option value="${x.id}" ${x.id === v.id ? "selected" : ""}>${esc(x.name)}${x.standard ? " (Standard)" : ""}</option>`).join("")}</select></label>
        ${ro() ? "" : `<button class="btn klein" type="button" data-act="adNeu">+ Neue Vorlage</button><button class="btn klein" type="button" data-act="adKopie">Duplizieren</button>${v.standard ? "" : `<button class="btn klein" type="button" data-act="adStandard">Als Standard</button><button class="btn klein gefahr-text" type="button" data-act="adWeg">Löschen</button>`}`}
        <span class="ad-trenner"></span>
        <label class="inline">Vorschau mit <select id="ad-bsp" data-act="adBeispiel">${ang.map(a => `<option value="${a.nr}" ${a.nr === bsp.nr ? "selected" : ""}>${esc(a.nr)} · ${esc(a.kunde.firma)}</option>`).join("") || `<option>Musterangebot</option>`}</select></label>
        <label class="inline">Zoom <input id="ad-zoom" type="range" min="0.35" max="1.2" step="0.05" value="${K.ad.zoom}" data-in="adZoom"></label>
        <span id="ad-seitenzahl" class="gedimmt klein"></span>
        <span class="ad-trenner"></span>
        <button class="btn klein" type="button" data-act="adDrucken">Drucken</button><button class="btn klein primary" type="button" data-act="adPdf">PDF erzeugen</button>
      </div>
      <div class="ad-layout">
        <aside class="panel ad-links">
          <div class="tabs-innen klein" role="tablist"><button type="button" role="tab" data-act="adTab" data-t="baustein" aria-selected="${K.ad.tab === "baustein"}">Bausteine</button><button type="button" role="tab" data-act="adTab" data-t="aufbau" aria-selected="${K.ad.tab === "aufbau"}">Aufbau</button></div>
          ${K.ad.tab === "baustein" ? `<p class="klein gedimmt">In die Seite ziehen oder anklicken (fügt nach dem gewählten Baustein ein).</p><ul class="ad-palette">${D.BAUSTEINE.map(([t, n, h]) => `<li draggable="${!ro()}" data-adneu="${t}"><button type="button" data-act="adEinfuegen" data-t="${t}" ${dis()}><b>${n}</b>${h ? `<span>${esc(h)}</span>` : ""}</button></li>`).join("")}</ul>`
            : `<ol class="ad-aufbau">${v.bloecke.map(x => `<li class="${x.id === K.ad.blk ? "aktiv" : ""}${x.aktiv === false ? " aus" : ""}" draggable="${!ro()}" data-adblk="${x.id}"><span class="kb-griff">⋮⋮</span><button type="button" data-act="adWahl" data-b="${x.id}">${esc(NAME[x.typ] || x.typ)}${x.typ === "text" ? `<small>${esc(x.titel || (D.TEXTQUELLEN.find(q => q[0] === x.quelle) || [, ""])[1])}</small>` : ""}</button><button type="button" class="ikon" data-act="adAktivL" data-b="${x.id}" title="${x.aktiv === false ? "einblenden" : "ausblenden"}">${x.aktiv === false ? "◌" : "●"}</button></li>`).join("")}</ol>`}
        </aside>
        <section class="ad-mitte"><div id="ad-seiten" class="dok ad-seiten" data-addrop="1"></div></section>
        <aside class="panel ad-rechts">${b ? eigenschaften(b) : seiteEigenschaften(v)}${b ? `<button type="button" class="btn klein" data-act="adWahl" data-b="" style="margin-top:12px">← Seite und Gestaltung</button>` : ""}</aside>
      </div>`;
  });
  // Aktionen
  const A = K.act, I = K.inp;
  A.adVorlage = el => { K.ad.vorlage = el.value; K.ad.blk = null; K.render(); };
  A.adBeispiel = el => { K.ad.beispiel = el.value; vorschauNeu(); };
  I.adZoom = el => { K.ad.zoom = +el.value; const box = K.root.querySelector("#ad-seiten"); if (box) box.style.setProperty("--zoom", K.ad.zoom); };
  A.adTab = el => { K.ad.tab = el.dataset.t; K.render(); };
  A.adWahl = el => { K.ad.blk = el.dataset.b || null; K.render(); };
  A.adNeu = () => { const v = D.standardVorlage(); v.id = uid(); v.name = "Neue Vorlage"; v.standard = false; S().einst.dokumente.push(v); K.ad.vorlage = v.id; K.ad.blk = null; speichern("Vorlage angelegt", false); K.render(); };
  A.adKopie = () => { const v = K.clone(vor()); v.id = uid(); v.name += " (Kopie)"; v.standard = false; v.gruppen = []; for (const b of v.bloecke) b.id = uid(); S().einst.dokumente.push(v); K.ad.vorlage = v.id; K.ad.blk = null; speichern(`Vorlage ${v.name} angelegt`, false); K.render(); };
  A.adStandard = () => { for (const x of S().einst.dokumente) x.standard = x.id === K.ad.vorlage; speichern(`${vor().name} ist Standard`, false); K.render(); };
  A.adWeg = () => { const e = S().einst, v = vor(); if (K.ad.loeschen !== v.id) { K.ad.loeschen = v.id; return K.toast("Zum Löschen noch einmal auf „Löschen“ klicken."); } e.dokumente = e.dokumente.filter(x => x !== v); K.ad.vorlage = null; K.ad.loeschen = null; speichern(`Vorlage ${v.name} gelöscht`, false); K.render(); };
  I.adVName = el => { vor().name = el.value.trim() || vor().name; speichern("Vorlage umbenannt", false); K.render(); };
  const einfuegen = (typ, vorId, nach) => {
    const v = vor(), b = D.neuerBlock(typ); let i = vorId ? v.bloecke.findIndex(x => x.id === vorId) : -1;
    if (i < 0) i = K.ad.blk ? v.bloecke.findIndex(x => x.id === K.ad.blk) + 1 : v.bloecke.length; else if (nach) i++;
    v.bloecke.splice(i, 0, b); K.ad.blk = b.id; speichern(`Baustein ${NAME[typ]} eingefügt`, false); K.render();
  };
  A.adEinfuegen = el => einfuegen(el.dataset.t);
  A.adBlkWeg = () => { const v = vor(); v.bloecke = v.bloecke.filter(x => x.id !== K.ad.blk); K.ad.blk = null; speichern("Baustein entfernt", false); K.render(); };
  A.adBlkKopie = () => { const v = vor(), i = v.bloecke.findIndex(x => x.id === K.ad.blk), b = { ...K.clone(v.bloecke[i]), id: uid() }; v.bloecke.splice(i + 1, 0, b); K.ad.blk = b.id; speichern("Baustein dupliziert", false); K.render(); };
  A.adAktiv = el => { blk().aktiv = el.checked; speichern(); K.render(); };
  A.adAktivL = el => { const b = vor().bloecke.find(x => x.id === el.dataset.b); b.aktiv = b.aktiv === false; speichern(); K.render(); };
  I.adFeld = el => { const b = blk(), k = el.dataset.k; b[k] = el.type === "number" ? Number(el.value) : el.value; speichern(); };
  A.adHaken = el => { blk()[el.dataset.k] = el.checked; speichern(); };
  A.adWahlFeld = el => { const b = blk(), k = el.dataset.k; b[k] = /^\d+$/.test(el.value) ? +el.value : el.value; speichern(); K.render(); };
  I.adText = el => { blk()[el.dataset.k] = el.value; speichern(); };
  I.adStdText = el => { const e = S().einst; e.vorlage[el.dataset.q] = el.value; speichern(); };
  A.adBild = async el => { const id = await (K.bildLesen ? K.bildLesen(el) : St().bildHochladen(el)); if (id === undefined) return; blk()[el.dataset.k] = id; speichern("Bild geändert", false); K.render(); };
  I.adSeite = el => { const s = vor().seite, k = el.dataset.k; s[k] = el.type === "number" ? Number(el.value) : el.value; speichern(); };
  A.adSeiteWahl = el => { vor().seite[el.dataset.k] = el.value; speichern(); };
  A.adSeiteHaken = el => { vor().seite[el.dataset.k] = el.checked; speichern(); };
  A.adSeiteBild = async el => {
    const s = vor().seite, k = el.dataset.k, f = el.files && el.files[0];
    if (el.dataset.weg) { s[k] = null; if (k === "briefpapier") { s.briefpapierPdf = null; s.briefpapierSeiten = 0; if (s.briefpapierAusPdf) s.briefpapierFolge = null; s.briefpapierAusPdf = false; } speichern("Briefpapier entfernt", false); return K.render(); }
    if (f && (f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      if (f.size > 3e6) return K.toast("Bitte ein Briefpapier-PDF unter 3 MB verwenden.");
      K.toast("Briefpapier wird gelesen …");
      try { const r = await D.briefpapierLesen(f); Object.assign(s, { briefpapierPdf: r.pdf, briefpapierSeiten: r.seiten, briefpapier: r.vorschau[0] || null, briefpapierFolge: r.vorschau[1] || null, briefpapierAusPdf: true }); speichern("PDF-Briefpapier hinterlegt", false); K.toast(r.vorschau.length ? "Briefpapier übernommen" : "Briefpapier übernommen, Vorschau nicht verfügbar"); }
      catch (e) { console.error(e); K.toast("Das PDF konnte nicht gelesen werden: " + (e.message || e)); }
      return K.render();
    }
    const id = await (K.bildLesen ? K.bildLesen(el) : St().bildHochladen(el)); if (id === undefined) return; s[k] = id; if (k === "briefpapier") { s.briefpapierPdf = null; s.briefpapierAusPdf = false; } speichern("Briefpapier geändert", false); K.render();
  };
  A.adBpEigenesAus = () => { const v = vor(); v.seite.streifen = false; v.fuss = Object.assign(v.fuss || {}, { zeigen: false }); for (const b of v.bloecke) if (b.typ === "briefkopf") b.aktiv = false; speichern("Eigener Kopf und Fuß bei Briefpapier ausgeblendet", false); K.render(); };
  I.adFolgekopf = el => { vor().folgekopf = el.value; speichern(); };
  A.adFussHaken = el => { const v = vor(); v.fuss ||= { spalten: [] }; v.fuss[el.dataset.k] = el.checked; speichern(); };
  I.adFuss = el => { vor().fuss.spalten[+el.dataset.j] = el.value; speichern(); };
  A.adGruppe = el => { const v = vor(), g = el.dataset.g; v.gruppen ||= []; if (el.checked) { for (const x of S().einst.dokumente) x.gruppen = (x.gruppen || []).filter(y => y !== g); v.gruppen.push(g); } else v.gruppen = v.gruppen.filter(y => y !== g); speichern("Zuordnung zu Produktfamilien geändert", false); };
  let letztesFeld = null;
  document.addEventListener("focusin", e => { if (K.root && K.root.contains(e.target) && e.target.matches && e.target.matches(".ad-rechts textarea, .ad-rechts input[type=text], .ad-rechts input:not([type])")) letztesFeld = e.target; });
  A.adPh = el => { const f = letztesFeld && K.root.contains(letztesFeld) ? letztesFeld : K.root.querySelector(".ad-rechts textarea, .ad-rechts input:not([type=number]):not([type=checkbox]):not([type=color]):not([type=file])"); if (!f) return; const t = `{{${el.dataset.p}}}`, s = f.selectionStart ?? f.value.length; f.value = f.value.slice(0, s) + t + f.value.slice(f.selectionEnd ?? s); f.focus(); f.setSelectionRange(s + t.length, s + t.length); f.dispatchEvent(new Event(f.tagName === "TEXTAREA" ? "input" : "change", { bubbles: true })); if (f.tagName !== "TEXTAREA") f.dispatchEvent(new Event("input", { bubbles: true })); };
  A.adFmt = el => { const f = el.closest(".feld")?.querySelector("textarea"); if (!f) return; const s = f.selectionStart, e2 = f.selectionEnd, sel = f.value.slice(s, e2) || "Text", art = el.dataset.f;
    const neu = art === "b" ? `**${sel}**` : art === "i" ? `*${sel}*` : sel.split("\n").map(l => "- " + l.replace(/^\s*[-•]\s+/, "")).join("\n");
    f.value = f.value.slice(0, s) + neu + f.value.slice(e2); f.focus(); f.setSelectionRange(s, s + neu.length); f.dispatchEvent(new Event("input", { bubbles: true })); };
  A.adDrucken = () => D.drucken(beispiel(), S().live || S().entwurf).catch(e => { console.error(e); K.toast("Drucken nicht möglich."); });
  A.adPdf = async el => { el.disabled = true; try { const a = beispiel(); await K.speichereDatei(`Angebot_${a.nr}.pdf`, await D.pdf(a, S().live || S().entwurf)); } catch (e) { console.error(e); K.toast("PDF konnte nicht erzeugt werden: " + (e.message || e)); } el.disabled = false; };
  // Auswahl per Klick in die Vorschau
  document.addEventListener("click", e => {
    if (!K.root || K.aktuell() !== "studio-vorlagen") return; const el = e.target.closest && e.target.closest("#ad-seiten .d-el[data-blk]"); if (!el) return;
    K.ad.blk = el.dataset.blk; K.render();
  });

  /* Drag & Drop: Bausteine aus der Palette und Umsortieren */
  let zug = null;
  const imDesigner = e => K.root && K.root.contains(e.target) && K.aktuell() === "studio-vorlagen" && !ro();
  const ziel = (e) => { const el = e.target.closest("#ad-seiten .d-el[data-blk], .ad-aufbau li[data-adblk]"); if (!el) return null; const r = el.getBoundingClientRect(); return { el, id: el.dataset.blk || el.dataset.adblk, nach: e.clientY > r.top + r.height / 2 }; };
  document.addEventListener("dragstart", e => { if (!imDesigner(e)) return; const p = e.target.closest && e.target.closest("[data-adneu],[data-adblk]"); if (!p) return; zug = p.dataset.adneu ? { neu: p.dataset.adneu } : { id: p.dataset.adblk }; e.dataTransfer.effectAllowed = "copyMove"; try { e.dataTransfer.setData("text/plain", zug.neu || zug.id); } catch (x) {} });
  document.addEventListener("dragend", () => { zug = null; K.root && K.root.querySelectorAll(".ad-vor,.ad-nach").forEach(x => x.classList.remove("ad-vor", "ad-nach")); });
  document.addEventListener("dragover", e => { if (!zug || !imDesigner(e)) return; const z = ziel(e); const leer = e.target.closest && e.target.closest("#ad-seiten"); if (!z && !leer) return; e.preventDefault(); K.root.querySelectorAll(".ad-vor,.ad-nach").forEach(x => x.classList.remove("ad-vor", "ad-nach")); if (z) z.el.classList.add(z.nach ? "ad-nach" : "ad-vor"); });
  document.addEventListener("drop", e => {
    if (!zug || !imDesigner(e)) return; const z = ziel(e), leer = e.target.closest && e.target.closest("#ad-seiten"); if (!z && !leer) return; e.preventDefault();
    const q = zug; zug = null; const v = vor();
    if (q.neu) return einfuegen(q.neu, z ? z.id : v.bloecke[v.bloecke.length - 1]?.id, z ? z.nach : true);
    if (!z || z.id === q.id) return; const b = v.bloecke.find(x => x.id === q.id); v.bloecke = v.bloecke.filter(x => x !== b);
    let i = v.bloecke.findIndex(x => x.id === z.id); if (z.nach) i++; v.bloecke.splice(i, 0, b); K.ad.blk = b.id; speichern("Reihenfolge geändert", false); K.render();
  });

  /* ---------- Angebot: Vorlage wählen, Vorschau, Druck ---------- */
  K.act.angVorlage = el => { const a = (S().angebote || []).find(x => x.nr === el.dataset.nr); a.vorlageId = el.value || null; K.Store.angebotSpeichern(a); K.render(); };
  K.act.angVorschau = async el => {
    const a = (S().angebote || []).find(x => x.nr === el.dataset.nr), mo = S().live, v = D.vorlageFuer(a, mo);
    K.sheet(`<div class="ad-sheetkopf"><h3>Angebot ${esc(a.nr)} · ${esc(v.name)}</h3><div class="row"><button class="btn klein" type="button" data-act="angDrucken" data-nr="${esc(a.nr)}">Drucken</button><button class="btn klein primary" type="button" data-act="angPdf" data-nr="${esc(a.nr)}">PDF speichern</button><button class="btn klein" type="button" data-act="sheetZu">Schließen</button></div></div><div class="dok ad-seiten im-sheet" style="--zoom:.7"><p class="gedimmt">Dokument wird gesetzt …</p></div>`);
    const box = document.querySelector("#konf-sheet .ad-seiten"); const bilder = await D.bilder(a, v, mo); if (box) box.innerHTML = D.html(a, v, mo, { bilder });
  };
  K.act.angDrucken = el => { const a = (S().angebote || []).find(x => x.nr === el.dataset.nr); D.drucken(a, S().live).catch(e => { console.error(e); K.toast("Drucken nicht möglich."); }); };
})(window);


/* ===== applus-da.js ===== */
/* Spaltenaufbau des APplus-Datenimports (je Blatt: Kopf, Datentyp, Von-Zeile, Bis-Zeile).
   Übernommen aus einer APplus-9-Exportmappe für dynamische Attribute (Beispiel Profischrauber). */
(function (root) { (root.KONF = root.KONF || {}).DA_VORLAGE = {"SACHGRUPPE": [["SACHGRUPPE", "NAME", "KLASSIFIZIERUNG", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "KONFIGSACHGRUPPE", "STATUS", "ZEICHNUNG", "MESAKTIV", "SACHWERTINSTANZ", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "nvarchar-(63)", "nvarchar-(15)", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "smallint-APbool", "smallint-smallint not null", "nvarchar-(256)", "smallint-APbool", "smallint-APbool", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["MWE", "Name der Sachgruppe", "Klassifizierung der Sachgruppe", "Benutzer, der diesen Datensatz eingefügt hat", "Datum, an dem dieser Datensatz angelegt wurde", "Benutzer, der diesen Datensatz zuletzt geändert hat", "Datum, an dem dieser Datensatz zuletzt geändert wurde", "Gibt an, ob es sich bei der Sachgruppe um eine Konfiguratorsachgruppe handelt", "Status der Sachgruppe", "Zeichung", "Attributgruppe ist relevant für MES", "Wenn der Kenner gesetzt ist, darf die Sachgruppe (Attributgruppe) nur einer Sachwert-Instanz (Attributwert-Instanz) zugeordnet werden.", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["MWEZZZ", "EXAMPLE", "EXAMPLE", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", 1, 1, "EXAMPLE", 1, 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHWERTREGISTER": [["INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "SACHWERTREGISTER", "SACHGRUPPENKLASSE", "NAME", "GUI_COLUMNS", "ID", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "IDX: nvarchar-(15) not null", "where", "nvarchar-(63) not null", "smallint-smallint", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "Eindeutiger Schlüssel", "MWE", "IDX: Name", "Anzahl der Spalten, die in diesem Register angezeigt werden sollen. Der Standardwert ist  3 um eine effiziente Ausnutzung des Platzes zu gewährleisten.", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "EXAMPLE", "MWEZZZ", "EXAMPLE", 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHGRUPPEPOS": [["SACHGRUPPE", "POSITION", "NAME", "KENN", "PFL", "VORGABE", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "EPOS_FUNC", "TYPE", "BERECHNET", "EINHEITTYPE", "EINHEIT", "REIHENFOLGE", "MAXWERT", "MINWERT", "VORBELEGUNG", "PICKURL", "BBCOL", "PICKLISTENAME", "SACHWERTREGISTER", "BESTTRENNCHARGE", "BESTTRENNVARIANTE", "ISAKTIVEVARIANTE", "GUI_GROUPNEXT", "GUI_GROUPWIDTH", "GUI_GROUPNAME", "GUI_EMPTYNEXT", "GUI_TRIGGERRULE", "AKTIV", "LANGTEXT", "BESTANDSTRENNUNG", "BESCHRIFTUNG", "GUELTIGVON", "GUELTIGBIS", "FOKUSSIERESUCHFELDNICHT", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "IDX: smallint-smallint not null", "nvarchar-(63)", "nvarchar-(4)", "smallint-smallint", "smallint-smallint", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "smallint-smallint", "nvarchar-(15)", "smallint-APbool", "nvarchar-(2)", "nvarchar-(11)", "smallint-smallint", "nvarchar-(20)", "nvarchar-(20)", "nvarchar-(50)", "nvarchar-(255)", "nvarchar-(63)", "nvarchar-(63)", "nvarchar-(15)", "smallint-APbool", "smallint-APbool", "smallint-APbool", "smallint-smallint", "smallint-smallint", "nvarchar-(64)", "smallint-smallint", "smallint-APbool", "smallint-APbool", "smallint-APbool", "smallint-APbool", "nvarchar-(63)", "date-date", "date-date", "smallint-APbool", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["MWE", "eindeutige Position innerhalb der Sachgruppe", "Benennung des Sachmerkmals", "Abkürzung/Kennung aus Sachbegriff", "Kenner: Pflichtmerkmal", "Kenner: Vorgabewert existiert (redundantes Merkmal, entfällt)", "Benutzer, der diesen Datensatz eingefügt hat", "Datum, an dem dieser Datensatz angelegt wurde", "Benutzer, der diesen Datensatz zuletzt geändert hat", "Datum, an dem dieser Datensatz zuletzt geändert wurde", "Gibt an, ob der zugehörige Sachwert in ePos smart gesetzt oder ausgewertet werden soll, oder ob er eine Ressource bereitstellt bzw. verbraucht.", "Datentyp vom Merkmal", "Der Wert wird automatisch berechnet. Feld ist dann disabled.", "z.B. Mengeinheit, Währung, Einheit", "Mengeneinheit, Währung oder Einheit", "Wert dient zur Festlegung der Reihenfolge der Anzeige.", "Maximal zulässiger Wert. Nur numerische Werte.", "Minimal zulässiger Wert. Nur numerische Werte.", "Merkmal mit diesem Wert vorbelegen", "URL der Pickliste", "BringbackCol der Pickliste", "Name der Pickliste", "Eindeutige Nummer des Attributwert-Registers", "Kenner Verwendung des Merkmals CHARGE zur Bestandstrennung", "Kenner Verwendung des Merkmals VARIANTE zur Bestandstrennung", "Gibt an, ob der Sachwert in der Notation \"Name.Wert\" als aktive Variante an die Belegposition übergeben wird.", "Fasst die nächsten n Elemente in einer Gruppe zusammen. Diese werden auch optisch mit einem Rahmen zusammengefasst und können optional mit einem Label versehen werden.", "Anzahl der Spalten über die sich die Gruppe erstreckt. Ist die Anzahl größer als die verfügbare Anzahl, wird diese auf die verfügbare Anzahl begrenzt.", "optionale Benennung der Gruppe", "Es werden n nachfolgende Platzhalter ausgegeben. Damit kann je nach Layout eine Gruppierung von Elementen erreicht werden.", "Kenner der angibt, ob bei einer Wertänderung des Elementes das Regelwerk ausgeführt werden soll.", "Aktiv-Flag", "Langtext-Flag", "Bestandstrennung Lager", "Labeltext des Attributs", "Datum, ab dem dem der Eintrag gütig ist", "Datum, bis zu dem der Eintrag gütig ist", "Suchfeld nicht fokussieren-Flag", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["MWEZZZ", 1, "EXAMPLE", "EXAMPLE", 1, 1, "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", 1, "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", 1, 1, 1, 1, 1, "EXAMPLE", 1, 1, 1, 1, 1, "EXAMPLE", "22.12.2019", "22.12.2019", 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHVORGABE": [["SACHGRUPPE", "POSITION", "VORGABE", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "VORGABEKOPIE", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "IDX: smallint-smallint", "nvarchar-(MAX)", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "nvarchar-(MAX)", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["MWE", "Nummer des Merkmals (Bezeichner)", "Zulässige Werte für dieses Merkmal", "Benutzer, der diesen Datensatz eingefügt hat", "Datum, an dem dieser Datensatz angelegt wurde", "Benutzer, der diesen Datensatz zuletzt geändert hat", "Datum, an dem dieser Datensatz zuletzt geändert wurde", "Hilfsfeld", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["MWEZZZ", 1, "EXAMPLE", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "EXAMPLE", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHGRUPPENKLASSENNAME": [["INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "SACHGRUPPENKLASSENNAME", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "where", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "MWE", "", "C_CLIENTDESCRIPTION", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "MWEZZZ", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHGRUPPENKLASSE": [["INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "SACHGRUPPENKLASSE", "TABELLE", "KLASSIFIZIERUNG", "GUI_MODE", "EPOS_MODE", "TECHDLG_MODE", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "where", "IDX: nvarchar-(63) not null", "nvarchar-(15)", "smallint-APbool", "smallint-APbool", "smallint-APbool", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "MWE", "Tabelle, der diese Sachgruppenklasse zugeordnet ist.", "Klassifizierung der Sachgruppenklasse", "Kenner der angibt, ob die Erfassung der Attributwerte regelgestützt erfolgen soll.", "", "Kenner der angibt, ob die technischen Einstellungen im Dialog Attributwerte angezeigt werden.", "", "C_CLIENTDESCRIPTION", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "MWEZZZ", "EXAMPLE", "EXAMPLE", 1, 1, 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHGRUPPENKLASSEPOS": [["INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "SACHGRUPPENKLASSE", "TABELLE", "SACHGRUPPE", "REIHENFOLGE", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "where", "IDX: nvarchar-(63) not null", "IDX: nvarchar-(63) not null", "smallint-smallint", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "MWE", "IDX: Name der Tabelle der Sachgruppenklasse", "Name der Sachgruppe", "IDX: Reihenfolge innerhalb der Attributklasse", "", "IDX: C_CLIENTDESCRIPTION", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "MWEZZZ", "EXAMPLE", "EXAMPLE", 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SACHWERTDLGREGEL": [["SDR", "SACHGRUPPENKLASSE", "TABELLE", "REIHENFOLGE", "VARIANTE", "VARIANTE_EDIT", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "AKTIV", "GUELTIGVON", "GUELTIGBIS", "ID", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["IDX: nvarchar-(15) not null", "where", "nvarchar-(63)", "int-int", "nvarchar-(800)", "nvarchar-(MAX)", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "smallint-APbool", "date-date", "date-date", "int-int identity(1,1) not null", "nvarchar-(15)", "Bsp: EXP:Where", ""], ["Ident-Nr.", "MWE", "IDX: BusinessObject", "IDX: Reihenfolge", "IDX: Variante", "Variante", "", "", "", "", "AKTIV-Flag", "Datum, ab dem dem der Eintrag gütig ist", "Datum, bis zu dem der Eintrag gütig ist", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", "MWEZZZ", "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", 1, "22.12.2019", "22.12.2019", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "SDRPOS": [["SDR", "ACTIONTYPE", "VALUE", "SACHBEGRIFF", "MESSAGE", "SACHWERTREGISTER", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "AKTIV", "GUELTIGVON", "GUELTIGBIS", "ID", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "nvarchar-(20)", "nvarchar-(1023)", "nvarchar-(63)", "nvarchar-(MAX)", "nvarchar-(15)", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "smallint-APbool", "date-date", "date-date", "int-int identity(1,1) not null", "nvarchar-(15)", "Bsp: EXP:Where", ""], ["00000017", "type", "value @value", "Attr. @id", "Message @text", "Register @id", "", "", "", "", "Aktiv-Flag", "Datum, ab dem dem der Eintrag gütig ist", "Datum, bis zu dem der Eintrag gütig ist", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["00000999", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", 1, "22.12.2019", "22.12.2019", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "VSTUELI": [["VSTUELI", "NAME", "ZEICHNUNG", "BEMERKUNG", "VARIANTE", "GUELTIGVON", "GUELTIGBIS", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "ABMESSUNG", "GEWICHT", "VBME", "VKME", "NETTO", "NETTO1", "NETTO2", "NETTO3", "NETTO4", "NETTO5", "NETTO6", "NETTO7", "DISPO_LAGER", "DISPO_AUFTRAG", "NODISPO", "POSDISPO", "NEUASTL", "POSDRUCKEN", "SCRIPT", "PREISGRUPPE", "PROV", "BONUS", "TEXT", "KONFIGTYP", "NOAUFSTUELI", "AUFLOESEN", "KONFIGDATEN", "NICHTBUCHEN", "AKTIV", "SACHGRUPPENKLASSE", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "nvarchar-(63)", "nvarchar-(63)", "nvarchar-(254)", "nvarchar-(MAX)", "date-date", "date-date", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "decimal-decimal(15,3)", "nvarchar-(11)", "nvarchar-(11)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(MAX)", "nvarchar-(15)", "smallint-smallint", "smallint-smallint", "nvarchar-(MAX)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(MAX)", "smallint-APbool", "smallint-APbool", "nvarchar-(63)", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["MWE-SCHRAUBER-01", "Benennung der Vertriebsstückliste", "Zeichnungsnummer", "Bemerkungen", "Mögliche Varianten", "Gültigkeitsbeginn", "Gültigkeitsende", "Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "Abmessung", "Gewicht pro VBME", "Verbrauchsmengeneinheit", "Verkaufsmengeneinheit", "Nettopreis pro VKME Preisliste 1", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Der Artikel ist lagerdisponiert (Kenner).", "Der Artikel ist auftragsdisponiert (Kenner).", "Der Artikel wird nicht disponiert (Kenner).", "Bezieht sich nur auf Vertriebsstücklisten.Die Unterpositionen der Vertriebsstückliste werden auch an die AV übergeben.", "Bezieht sich nur auf Vertriebsstücklisten.Beim Erzeugen der Auftragsstückliste wird für diese Position eine neue Auftragsstückliste erzeugt.", "Bezieht sich nur auf Vertriebsstücklisten.Beim Ausdruck dieser Position werden die Unterpositionen auch ausgedruckt.", "Script für programmierte Variante", "Preisgruppe der Vertriebsstücklisten", "Artikel ist provisionsfähig", "Artikel ist bonusfähig", "individueller Verkaufstext", "Konfigurationstyp (Variante/Konfigurator)", "Keine Aufstueliposition erzeugen", "in AV nachauflösen", "XML vom Konfigurator", "Position wird nicht gebucht.", "Gibt an, ob die VStueli verwendet wird", "Zugehoerige Sachgruppenklasse", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["MWE-SCHRAUBER-01", "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", "22.12.2019", "22.12.2019", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", "EXAMPLE", "15,3         ", "EXAMPLE", "EXAMPLE", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", 1, 1, 1, 1, 1, 1, "EXAMPLE", "EXAMPLE", 1, 1, "EXAMPLE", 1, 1, 1, "EXAMPLE", 1, 1, "EXAMPLE", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "VSTUELIPOS": [["VSTUELI", "POSITION", "ARTIKEL", "VARIANTE", "MENGE", "BEMERKUNG", "ABMESSUNG", "ERSATZ", "NAME", "VBME", "VKME", "ZEICHNUNG", "AENDERUNGSINDEX", "IMMER1", "PROV", "ERLOESGRUPPE", "NETTO", "NETTO2", "NETTO3", "NETTO4", "NETTO5", "NETTO6", "NETTO7", "NETTO8", "NETTO9", "ARTIKELGRUPPE", "RABATTGRUPPE", "NORABATT", "TEXT", "VZUBEHOER", "SCRIPT", "PREISGRUPPE", "BONUS", "DISPO_LAGER", "DISPO_AUFTRAG", "NODISPO", "NOAUFSTUELI", "KONFIGDATEN", "DONTCALC", "DONTPRINT", "DONTPRINTPRICE", "NICHTBUCHEN", "SACHGRUPPENKLASSE", "SACHWERTREGELID", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["where", "IDX: smallint-smallint not null", "nvarchar-(22)", "nvarchar-(MAX)", "decimal-decimal(15,3)", "nvarchar-(254)", "nvarchar-(31)", "smallint-smallint", "nvarchar-(63)", "nvarchar-(11)", "nvarchar-(11)", "nvarchar-(63)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(7)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "decimal-(14,2)", "nvarchar-(31)", "nvarchar-(15)", "smallint-smallint", "nvarchar-(MAX)", "smallint-smallint", "nvarchar-(MAX)", "nvarchar-(15)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(MAX)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-APbool", "nvarchar-(63)", "nvarchar-(15)", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["MWE-SCHRAUBER-01", "Positionsnummer", "Artikelnummer", "Mögliche Varianten", "Menge in Verkaufseinheiten", "Bemerkungen", "Abmessungen des Artikels", "Der Artikel ist ein Ersatzteil (Kenner).", "Interne Benennung", "Verbrauchsmengeneinheit", "Verkaufsmengeneinheit", "Zeichnungsnummer", "Intern verwendet", "Intern verwendet", "Intern verwendet", "Erlösgruppe", "Nettopreis pro VKME Preisliste 1", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Nettopreise für alle Preislisten", "Artikelgruppe (Teilefamilie)", "Gruppe für Rabattermittlung", "Diese Position wird nicht automatisch rabattiert (Kenner).", "Verkaufstext des Artikels", "Der Artikel ist Zubehör (Kenner).Die Menge wird nicht mit Menge des Kopfs multipliziert.", "Script für programmierte Variante", "Preisgruppe der Position", "Artikel ist bonusfähig", "lagerdisponiert", "auftragsdisponiert", "keine Disposition", "keine Aufstueliposition anlegen", "XML vom Konfigurator", "true wenn Preis dieser Pos nicht in die Berechnung des Gesamtpreises einfliessen soll", "Position wird nicht gedruckt", "Preise werden nicht gedruckt", "Position wird nicht gebucht.", "Zugehoerige Sachgruppenklasse", "ID der Regel für die Attributwertberechnung", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["MWE-SCHRAUBER-01", 1, "EXAMPLE", "EXAMPLE", "15,3         ", "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", "EXAMPLE", "EXAMPLE", 1, 1, 1, "EXAMPLE", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "14,2         ", "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", 1, 1, 1, 1, 1, "EXAMPLE", 1, 1, 1, 1, "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", "Bsp: EXP:Bis", ""]], "STUELIPOS": [["STUELI", "POSITION", "ARTIKEL", "VARIANTE", "MENGE", "BEMERKUNG", "ABMESSUNG", "ERSATZ", "NAME", "VBME", "FERTIGUNG", "EINKAUF", "ZEICHNUNG", "INSUSER", "INSDATE", "UPDUSER", "UPDDATE", "AENDERUNGSINDEX", "SCRIPT", "IMMER1", "VERSCHNFAKTOR", "AGBEDARF", "BUCHENAUFTRAG", "ZUSCHNITT", "BEISTELL", "ZEICHNUNGPOS", "NOCALC", "FADRESSE", "INFOTEIL", "CADDATE", "CADUSER", "KOSTENGRUPPE", "MENGEPMNG", "MENGEAUFRUNDEN", "KONFIGDATEN", "CADPOSITION", "ISBEISTELLPOSITION", "PSEUDOSTUELI", "ISBM", "BMSTARTAG", "BMENDEAG", "BMK", "VERSCHLEISSTEIL", "GEWICHT", "KUPPELPRODUKT", "PDMIDENTNR", "NUP_PDMNBR", "CALCPROD", "MEHRFACHFALLEND", "AUTOMATENTNAHME", "ISFERTIGUNGSBEHAELTER", "ISCONTAINERCHARGE", "SACHGRUPPENKLASSE", "KALKFAKTORMF", "MESMATERIALENTNAHME", "MESMDEENTNAHME", "SACHWERTREGELID", "ANP_LIEFERPOSITION", "id", "MANDANT", "IMPORT_INFO", "IMPORT_FEHLER"], ["IDX: nvarchar-(22) not null", "IDX: smallint-smallint not null", "nvarchar-(22)", "IDX: nvarchar-(MAX)", "decimal-decimal(15,3)", "nvarchar-(MAX)", "nvarchar-(31)", "smallint-smallint", "nvarchar-(63)", "nvarchar-(11)", "smallint-smallint", "smallint-smallint", "where", "nvarchar-(31)", "datetime-datetime", "nvarchar-(31)", "datetime-datetime", "smallint-smallint", "nvarchar-(MAX)", "smallint-smallint", "decimal-(14,2)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(1)", "nvarchar-(3)", "smallint-smallint", "nvarchar-(15)", "smallint-smallint", "date-date", "nvarchar-(31)", "nvarchar-(15)", "decimal-(14,2)", "smallint-smallint", "nvarchar-(MAX)", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "smallint-smallint", "nvarchar-(31)", "smallint-smallint", "decimal-decimal(15,3)", "smallint-smallint", "nvarchar-(22)", "nvarchar-(500)", "smallint-APbool", "smallint-APbool", "smallint-APbool", "smallint-APbool", "smallint-APbool", "nvarchar-(63)", "decimal-(14,2)", "smallint-smallint", "smallint-APbool", "nvarchar-(15)", "smallint-APbool", "int-int identity(1,1) not null", "IDX: nvarchar-(15)", "Bsp: EXP:Where", ""], ["Stücklistennummer = Artikelnummer", "Stücklistenposition", "Artikelnummer", "Varianten, für die die Position gültig ist", "Menge (Variablen)", "Bemerkungen", "Abmessungen des Artikels (Variablen)", "Position wird als Ersatzteil gebraucht", "Artikelname", "Verbrauchsmengeneinheit", "Fertigungsteil", "Einkaufsteil", "MWE-001", "Benutzer, der den Datensatz angelegt hat", "Datum, an dem der Datensatz angelegt wurde", "Benutzer, der den Datensatz zuletzt geändert hat", "Datum, an dem der Datensatz zuletzt geändert wurde", "Zähler Änderungsindex", "Script für Variantengenerator", "Zubehörteil", "Verschnittfaktor", "Nummer des zugehörigen Arbeitsgangs", "Die Position wird nicht ans Lager gebucht, sondern direkt auf die verursachende Auftragsstückliste oder den verursachenden Werkstattauftrag (Kenner).", "Die Stücklistenposition ist ein Zuschnittsteil (Kenner).", "Art der Beistellung", "Zugehörige Zeichnungsposition", "Position bei Kalkulation auslassen", "Adresse des Lieferanten (für Bestellvorschlag)", "Kenner: Kommentarposition", "Gefüllt, falls Artikel aus CAD-Schnittstelle angelegt/geändert", "Gefüllt, falls Artikel aus CAD-Schnittstelle angelegt/geändert", "Wird für die Projektkalkulation benötigt", "Pro Menge, wird beim Auflösen der Stückliste als Divisor für die Menge verwendet", "Kenner: Beim Auflösen der Stückliste wird die ausmultiplizierte Menge auf ganzzahlige Werte aufgerundet", "Daten des Konfigurators in XML-Form", "Positionsnummer im CAD-System. Falls null, ist diese Stücklistenposition nicht im CAD-System vorhanden", "Kenner, ob diese eine Beistellposition ist", "Kenner: Baugruppe ist eine Pseudostückliste", "Kenner: Dieser Artikel ist ein Betriebsmittel", "Das Das BM wird ab diesem AG gebraucht", "Das BM wird bis zu diesem AG gebraucht", "Betriebsmittelnummer BM", "Kenner: Verschleissteil", "Das Gewicht einer Stücklistenposition in kg", "Kenner:Kuppelprodukt", "Eindeutige ID aus dem PDM-System", "", "Kenner. Ist der Kenner gesetzt, wird der gesetzte Kenner NOCALC aus Stücklisten nicht in die Auftragsstücklistenpositionen übernommen.", "Kenner: Stammstücklistenposition ist ein mehrfach fallendes Teil", "Kenner: automatische Entnahmebuchung durchführen", "Dieses Packmittel wird zum Buchen in der Fertigung verwendet", "Die Charge dieses Ausgangsmaterials soll in den Fertigungsbehälter übernommen werden", "Zugehörige Sachgruppenklasse", "Kalkulationsfaktor mehrfach fallendes Teil in Prozent", "Art der Materialentnahme im MES (1 - Standard, 2 - FIFO, ...)", "Kennzeichnet, dass die Materialentnahme im MES über eine Maschinenanbindung gezählt wird", "ID der Regel für die Attributwertberechnung", "", "", "Mandant, für den dieser Datensatz verfügbar ist", "Bsp: EXP:Von, Imp:OK / NOK, DEL:DELETE / DELETE_NOK", ""], ["EXAMPLE", 1, "EXAMPLE", "EXAMPLE", "15,3         ", "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", "EXAMPLE", 1, 1, "MWE-001", "EXAMPLE", "22.12.2019", "EXAMPLE", "22.12.2019", 1, "EXAMPLE", 1, "14,2         ", 1, 1, 1, "EXAMPLE", "EXAMPLE", 1, "EXAMPLE", 1, "22.12.2019", "EXAMPLE", "EXAMPLE", "14,2         ", 1, "EXAMPLE", 1, 1, 1, 1, 1, 1, "EXAMPLE", 1, "15,3         ", 1, "EXAMPLE", "EXAMPLE", 1, 1, 1, 1, 1, "EXAMPLE", "14,2         ", 1, 1, "EXAMPLE", 1, 1, "EXAMPLE", "Bsp: EXP:Bis", ""]]}; })(typeof window !== "undefined" ? window : globalThis);


/* ===== applus.js ===== */
/* =====================================================================
   Übergabe an APplus über dynamische Attribute (APplus-Datenimport)
   Aus dem Katalogaufbau entsteht je Fahrzeug ein Attribute-Konfigurator:
     Fahrzeug           → Attributklasse (SACHGRUPPENKLASSE), an Artikel, Angebots-/Auftragsposition …
     ZZ-Überschrift     → Attributgruppe (SACHGRUPPE) + Registerkarte (SACHWERTREGISTER)
     YY-Gruppe          → Attribut CHAR mit zulässigen Werten (SACHGRUPPEPOS, SACHVORGABE)
     Ja/Nein, Mehrfach  → Attribut BOOLEAN je Code
     Zahl / Freitext    → Attribut INT bzw. CHAR
     Regeln             → Attributdialog-Regeln (SACHWERTDLGREGEL, SDRPOS)
     Preise             → Vertriebsstückliste mit Variantenbedingung (VSTUELI, VSTUELIPOS)
     Stückliste         → Stücklistenpositionen mit Variantenbedingung (STUELIPOS), optional
   Ausgabe: Excel-Mappe im Format des APplus-Datenimports (Kopf, Datentyp, Von, Bis, Daten).
   ===================================================================== */
(function (root) {
  const K = root.KONF, E = K.E, esc = K.esc, S = () => K.Store.S;
  const AP = K.AP = {};
  const TABELLEN = ["SACHWERTINSTANZ", "ARTIKEL", "ANGEBOTPOS", "AUFTRAGPOS", "AUFSTUELIPOS", "STUELIPOS", "VSTUELI", "RECHNUNGPOS", "WARENAUSGANGPOS", "WAUFTRAGPOS", "APLANPOS"];
  AP.TABELLEN = TABELLEN;
  const schl = (s, n) => String(s || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "SS").replace(/[^A-Z0-9_-]/g, "").slice(0, n);
  const attrName = s => schl(String(s || "").replace(/-/g, "_"), 63) || "ATTR";
  AP.standardOpts = () => Object.assign({ mandant: "", sdrStart: 100, status: 2, spalten: 2, tabellen: TABELLEN.slice(), preise: true, stueckliste: false, preisArtikel: "", klassen: {} }, S().einst?.applusExport || {});
  AP.klasseVon = (p, opts) => schl((opts.klassen || {})[p.id] || p.code || p.id, 12) || "KONF";

  /** Aufbau eines Fahrzeugs als Attribute */
  function aufbau(mo, p, opts) {
    const k = AP.klasseVon(p, opts), hinweise = [], gruppen = [], ref = new Map(); // ref: "mid|wid" → {attr, wert, typ}
    const pm = E.produktMerkmale(mo, p), namen = new Set();
    const eindeutig = n => { let x = n, i = 2; while (namen.has(x)) x = n.slice(0, 60) + "_" + i++; namen.add(x); return x; };
    const gr = new Map();
    for (const x of pm) {
      const ab = x.m.abschnitt || x.m.ueberschrift || "Allgemein", code = x.m.abschnittCode || ab;
      const zz = schl(code, 6) || "ALLG", key = k.slice(0, 15 - 1 - zz.length) + "-" + zz; // Attributgruppe max. 15 Zeichen
      if (!gr.has(key)) gr.set(key, { key, name: ab, attribute: [] }); const g = gr.get(key);
      const wahl = x.werte.filter(w => E.wertTyp(x.m, w) === "auswahl"), eigene = x.werte.filter(w => E.wertTyp(x.m, w) !== "auswahl");
      if (wahl.length && x.m.typ !== "mehrfach") {
        const a = { name: eindeutig(attrName(x.m.code || x.m.name)), beschriftung: x.m.name, typ: "CHAR", pfl: 1, vorgaben: wahl.map(w => `${w.code || w.id}:${w.name}`), vorbelegung: (wahl.find(w => w.id === (x.standard || x.m.standard)) || (x.m.pflicht ? null : wahl[0]))?.code || "", merkmal: x.m };
        g.attribute.push(a); for (const w of wahl) ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: w.code || w.id, typ: "CHAR" });
        for (const w of wahl) if (/[^A-Za-z0-9_]/.test(w.code || "")) hinweise.push(`Code „${w.code}“ enthält Sonderzeichen. Bitte prüfen, ob APplus ihn in Bedingungen akzeptiert (${x.m.name}).`);
      } else for (const w of wahl) { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "BOOLEAN", pfl: 1, vorbelegung: (w.vorgabe || String(x.standard || "").split(",").includes(w.id)) ? "1" : "0", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: "1", typ: "BOOLEAN" }); }
      for (const w of eigene) {
        const t = E.wertTyp(x.m, w);
        if (t === "fest") { ref.set(x.m.id + "|" + w.id, { fest: true }); continue; }
        if (t === "janein") { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "BOOLEAN", pfl: 1, vorbelegung: w.vorgabe ? "1" : "0", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: "1", typ: "BOOLEAN" }); continue; }
        if (t === "zahl") { const z = w.zahl || {}, ganz = !z.schritt || Number.isInteger(z.schritt); const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: ganz ? "INT" : "DECIMAL", pfl: 1, einheit: z.einheit || "", min: z.min ?? "", max: z.max ?? "", vorbelegung: z.standard ?? 0, merkmal: x.m }; if (!ganz) hinweise.push(`${w.name}: Dezimalzahl – Datentyp in APplus prüfen (Referenz kennt INT).`); g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: ">0", typ: "ZAHL" }); continue; }
        if (t === "text") { const a = { name: eindeutig(attrName(w.code || w.id)), beschriftung: w.name, typ: "CHAR", pfl: 0, vorbelegung: "", merkmal: x.m }; g.attribute.push(a); ref.set(x.m.id + "|" + w.id, { attr: a.name, wert: null, typ: "TEXT" }); }
      }
    }
    for (const g of gr.values()) if (g.attribute.length) gruppen.push(g);
    for (const g of gruppen) if (g.attribute.length > 8) hinweise.push(`Registerkarte „${g.name}“ hat ${g.attribute.length} Attribute. APplus zeigt standardmäßig 8 je Registerkarte (Systemkonfiguration › Attributwerte › Maximale Anzahl von Attributklassenpositionen).`);
    return { k, gruppen, ref, hinweise, pm };
  }

  /** Bedingung als Varianten-Ausdruck: + = UND, , = ODER. Mehrere Werte (ODER) ergeben getrennte Regeln. */
  function term(ref, mid, wid, neg) {
    const r = ref.get(mid + "|" + wid); if (!r || r.fest) return null;
    if (r.typ === "ZAHL") return neg ? `${r.attr}=0` : `${r.attr}>0`;
    if (r.typ === "TEXT") return null;
    return `${r.attr}${neg ? "!=" : "="}${r.wert}`;
  }
  function regeln(mo, p, a, opts, sdr) {
    const kopf = [], pos = [], hinweise = [], pm = a.pm, verfuegbar = mid => (pm.find(x => x.m.id === mid)?.werte || []).map(w => w.id);
    const aktion = (id, typ, attr, wert, msg) => pos.push({ SDR: id, ACTIONTYPE: typ, VALUE: wert ?? "", SACHBEGRIFF: attr || "", MESSAGE: msg || "", AKTIV: 1, MANDANT: opts.mandant || "" });
    /* APplus kann einzelne Werte einer Auswahlliste nicht ausblenden (Aktionen wirken auf das ganze Attribut).
       Darum: bleibt genau ein Code übrig → setValue + disabled; sonst je gesperrtem Code eine Zusatzregel
       „Bedingung + Attribut=Code“ → removeValue + warning. Ja/Nein und Zahl: setValue 0 + disabled. */
    const sperrMenge = (id, bed, mid, wids, name, text) => {
      const charW = [], rest = [];
      for (const wid of wids) { const r = a.ref.get(mid + "|" + wid); if (!r || r.fest) continue; (r.typ === "CHAR" ? charW : rest).push(r); }
      for (const r of rest) { if (r.typ === "TEXT") { aktion(id, "disabled", r.attr); continue; } aktion(id, "setValue", r.attr, "0"); aktion(id, "disabled", r.attr); }
      if (!charW.length) return;
      const attr = charW[0].attr, gesperrt = new Set(charW.map(r => r.wert));
      const uebrig = verfuegbar(mid).map(w => a.ref.get(mid + "|" + w)).filter(r => r && r.attr === attr && !gesperrt.has(r.wert));
      if (uebrig.length === 1) { aktion(id, "setValue", attr, uebrig[0].wert); aktion(id, "disabled", attr); if (text) aktion(id, "info", attr, "", text); return; }
      if (!uebrig.length) { aktion(id, "error", attr, "", text || `Keine zulässige Auswahl für ${attr}.`); return; }
      for (const r of charW) { const z = neu(`${bed}+${attr}=${r.wert}`, `${name}: ${r.wert} nicht zulässig`); aktion(z, "removeValue", attr); aktion(z, "warning", attr, "", text || `${r.wert} ist in dieser Kombination nicht zulässig.`); }
    };
    const setze = (id, mid, wid) => { const r = a.ref.get(mid + "|" + wid); if (!r || r.fest) return; if (r.typ === "CHAR") aktion(id, "setValue", r.attr, r.wert); else if (r.typ === "BOOLEAN") aktion(id, "setValue", r.attr, "1"); };
    let rf = 0; const neu = (bed, name) => { const id = String(sdr.n++).padStart(8, "0"); kopf.push({ SDR: id, SACHGRUPPENKLASSE: a.k, TABELLE: "", REIHENFOLGE: rf += 10, VARIANTE: bed, VARIANTE_EDIT: bed, _name: name, AKTIV: 1, MANDANT: opts.mandant || "" }); return id; };
    for (const r of mo.regeln) {
      if (!r.aktiv || !E.imGeltungsbereich(mo, r, p)) continue;
      if (r.typ === "tabelle") {
        const t = r.tabelle || {}; if ((t.merkmale || []).length !== 2) { hinweise.push(`Kombinationstabelle „${r.name || r.id}“ mit ${(t.merkmale || []).length} Spalten bitte von Hand anlegen.`); continue; }
        const [A, B] = t.merkmale;
        for (const x of verfuegbar(A)) { const b = term(a.ref, A, x); if (!b) continue; const ok = new Set((t.zeilen || []).filter(z => z[0] === x).map(z => z[1])), weg = verfuegbar(B).filter(y => !ok.has(y)); if (!weg.length) continue; const id = neu(b, `${r.name || r.id}`); sperrMenge(id, b, B, weg, r.name || r.id, r.hinweis); }
        continue;
      }
      if (!r.dann || !r.wenn?.length) continue;
      // Bedingungen: je Bedingung Alternativen (ODER), zusammen UND
      let alternativen = [[]], ok = true;
      for (const c of r.wenn) {
        const ws = (c.werte || []).filter(w => verfuegbar(c.merkmal).includes(w) || true);
        if (c.op === "istNicht") { const t = ws.map(w => term(a.ref, c.merkmal, w, true)).filter(Boolean); if (!t.length) { ok = false; break; } alternativen = alternativen.map(x => [...x, ...t]); }
        else { const t = ws.map(w => term(a.ref, c.merkmal, w)).filter(Boolean); if (!t.length) { ok = false; break; } alternativen = alternativen.flatMap(x => t.map(y => [...x, y])); }
      }
      if (!ok) { hinweise.push(`Regel ${r.id} („${r.name || ""}“) bezieht sich auf Codes, die es bei ${p.name} nicht gibt oder die Freitext sind, nicht übernommen.`); continue; }
      if (alternativen.length > 40) { hinweise.push(`Regel ${r.id} hätte ${alternativen.length} Varianten-Kombinationen, bitte von Hand vereinfachen.`); continue; }
      for (const alt of alternativen) {
        const id = neu(alt.join("+"), `${r.id} ${r.name || ""}`.trim()), d = r.dann;
        const bed = alt.join("+"), nm = `${r.id} ${r.name || ""}`.trim();
        if (d.typ === "sperren") sperrMenge(id, bed, d.merkmal, d.werte || [], nm, r.hinweis);
        else if (d.typ === "nurErlauben") sperrMenge(id, bed, d.merkmal, verfuegbar(d.merkmal).filter(w => !(d.werte || []).includes(w)), nm, r.hinweis);
        else if (d.typ === "setzen") for (const w of d.werte || []) setze(id, d.merkmal, w);
        if (r.hinweis && d.typ === "setzen") { const r0 = a.ref.get(d.merkmal + "|" + (d.werte || [])[0]) || [...a.ref.values()].find(x => x.attr); aktion(id, "info", r0?.attr, "", r.hinweis); }
      }
    }
    // Regeln ohne Aktion entfallen, Nummern lückenlos
    const start = kopf.length ? +kopf[0].SDR : sdr.n, neuNr = new Map(); let n = start;
    const bleibt = kopf.filter(k => pos.some(x => x.SDR === k.SDR)); bleibt.forEach((k, i) => { neuNr.set(k.SDR, String(n++).padStart(8, "0")); k.SDR = neuNr.get(k.SDR); k.REIHENFOLGE = (i + 1) * 10; });
    for (const x of pos) x.SDR = neuNr.get(x.SDR); sdr.n = n;
    return { kopf: bleibt, pos, hinweise };
  }

  /** Alle Blätter für die gewählten Fahrzeuge */
  AP.erzeugen = (mo, produkte, opts) => {
    opts = Object.assign(AP.standardOpts(), opts || {}); const sdr = { n: +opts.sdrStart || 100 };
    const D = { SACHGRUPPENKLASSENNAME: [], SACHGRUPPENKLASSE: [], SACHGRUPPE: [], SACHWERTREGISTER: [], SACHGRUPPENKLASSEPOS: [], SACHGRUPPEPOS: [], SACHVORGABE: [], SACHWERTDLGREGEL: [], SDRPOS: [], VSTUELI: [], VSTUELIPOS: [], STUELIPOS: [] };
    const hinweise = [], pruef = [], M = opts.mandant || "";
    const klassen = new Set(), gruppenKeys = new Map();
    for (const p of produkte) {
      const a = aufbau(mo, p, opts);
      if (klassen.has(a.k)) { hinweise.push(`Attributklasse ${a.k} doppelt (${p.name}). Bitte bei den Fahrzeugen eindeutige Klassen eintragen.`); continue; }
      klassen.add(a.k); hinweise.push(...a.hinweise.map(h => `${p.name}: ${h}`));
      D.SACHGRUPPENKLASSENNAME.push({ SACHGRUPPENKLASSENNAME: a.k, MANDANT: M });
      for (const t of opts.tabellen) D.SACHGRUPPENKLASSE.push({ SACHGRUPPENKLASSE: a.k, TABELLE: t, GUI_MODE: t === "SACHWERTINSTANZ" ? 1 : "", TECHDLG_MODE: t === "SACHWERTINSTANZ" ? 0 : "", MANDANT: M });
      for (const g of a.gruppen) { if (gruppenKeys.has(g.key)) hinweise.push(`${p.name}: Attributgruppe ${g.key} gibt es schon bei ${gruppenKeys.get(g.key)}. Bitte eine kürzere, eindeutige Attributklasse wählen (Gruppen nutzen die ersten ${15 - 1 - g.key.split("-").pop().length} Zeichen).`); else gruppenKeys.set(g.key, p.name); }
      a.gruppen.forEach((g, gi) => {
        D.SACHGRUPPE.push({ SACHGRUPPE: g.key, NAME: g.name.slice(0, 63), STATUS: +opts.status || 1, SACHWERTINSTANZ: 1, MANDANT: M });
        D.SACHWERTREGISTER.push({ SACHWERTREGISTER: g.key, SACHGRUPPENKLASSE: a.k, NAME: g.name.slice(0, 63), GUI_COLUMNS: +opts.spalten || 2, MANDANT: M });
        D.SACHGRUPPENKLASSEPOS.push({ SACHGRUPPENKLASSE: a.k, TABELLE: "SACHWERTINSTANZ", SACHGRUPPE: g.key, REIHENFOLGE: (gi + 1) * 10, MANDANT: M });
        g.attribute.forEach((at, i) => {
          D.SACHGRUPPEPOS.push({ SACHGRUPPE: g.key, POSITION: i + 1, NAME: at.name, PFL: at.pfl ? 1 : "", TYPE: at.typ, EINHEITTYPE: at.einheit ? "ME" : "NO", EINHEIT: at.einheit || "", REIHENFOLGE: (i + 1) * 10, MAXWERT: at.max ?? "", MINWERT: at.min ?? "", VORBELEGUNG: at.vorbelegung ?? "", SACHWERTREGISTER: g.key, ISAKTIVEVARIANTE: 1, GUI_TRIGGERRULE: 1, AKTIV: 1, BESCHRIFTUNG: String(at.beschriftung || at.name).slice(0, 63), MANDANT: M });
          if (at.vorgaben) { const v = at.vorgaben.join("\n") + "\n"; D.SACHVORGABE.push({ SACHGRUPPE: g.key, POSITION: i + 1, VORGABE: v, VORGABEKOPIE: v, MANDANT: M }); }
        });
      });
      const rg = regeln(mo, p, a, opts, sdr); D.SACHWERTDLGREGEL.push(...rg.kopf); D.SDRPOS.push(...rg.pos); hinweise.push(...rg.hinweise.map(h => `${p.name}: ${h}`));
      if (opts.preise) {
        D.VSTUELI.push({ VSTUELI: p.code, NAME: p.name, SACHGRUPPENKLASSE: a.k, MANDANT: M }); let n = 0;
        for (const x of a.pm) for (const w of x.werte) {
          const pr = E.wertPreis(mo, p, w), r = a.ref.get(x.m.id + "|" + w.id); if (!pr || !r) continue;
          const bed = r.fest ? "" : term(a.ref, x.m.id, w.id); if (bed === null) { hinweise.push(`${p.name}: Preis für ${w.code} (Freitext) bitte von Hand hinterlegen.`); continue; }
          D.VSTUELIPOS.push({ VSTUELI: p.code, POSITION: ++n, ARTIKEL: opts.preisArtikel || w.code, VARIANTE: bed, MENGE: 1, NAME: String(w.name).slice(0, 63), VKME: "Stück", NETTO: pr, NODISPO: 1, NOAUFSTUELI: 1, DONTPRINTPRICE: 1, NICHTBUCHEN: 1, MANDANT: M });
          if (r.typ === "ZAHL") hinweise.push(`${p.name}: ${w.name} kostet ${K.eur(pr)} je ${w.zahl?.einheit || "Einheit"}. In der Vertriebsstücklistenposition die Menge mit dem Attributwert ${r.attr} verknüpfen (Script).`);
        }
      }
      if (opts.stueckliste) {
        let n = 0; for (const z of p.stl || []) D.STUELIPOS.push({ STUELI: p.code, POSITION: (++n) * 10, ARTIKEL: z[0], VARIANTE: "", MENGE: z[2] || 1, NAME: String(z[1] || "").slice(0, 63), VBME: z[3] || "", MANDANT: M });
        for (const x of a.pm) for (const w of x.werte) for (const z of w.stl || []) { const bed = a.ref.get(x.m.id + "|" + w.id)?.fest ? "" : term(a.ref, x.m.id, w.id); if (bed === null) continue; D.STUELIPOS.push({ STUELI: p.code, POSITION: (++n) * 10, ARTIKEL: z[0], VARIANTE: bed, MENGE: z[2] || 1, NAME: String(z[1] || "").slice(0, 63), VBME: z[3] || "", MANDANT: M }); }
      }
      pruef.push([p.name, p.code, a.k, a.gruppen.length, a.gruppen.reduce((s, g) => s + g.attribute.length, 0), rg.kopf.length, `Artikel ${p.code}: Feld Attributklasse = ${a.k}${opts.preise ? ", Vertriebsstückliste aktiv" : ""}`]);
    }
    return { D, hinweise, pruef, sdrBis: sdr.n - 1, opts };
  };

  /** Blatt im Format des Datenimports: Kopf, Datentyp, Von, Bis, Daten */
  function blatt(name, zeilen) {
    const v = K.DA_VORLAGE[name]; if (!v) return null;
    const kopf = v[0], typ = v[1], wo = typ.map((t, i) => t === "where" ? i : -1).filter(i => i >= 0);
    const von = v[2].slice(), bis = v[3].slice();
    for (const i of wo) { const werte = zeilen.map(z => String(z[kopf[i]] ?? "")).filter(Boolean).sort(); if (werte.length) { von[i] = werte[0]; bis[i] = werte[werte.length - 1] + (/^\d+$/.test(werte[werte.length - 1]) ? "" : "ZZZ"); } else { von[i] = ""; bis[i] = ""; } }
    const daten = zeilen.map(z => kopf.map(h => z[h] ?? ""));
    return [kopf, typ, von, bis, ...daten];
  }
  AP.mappe = async erg => {
    await K.lib("xlsx"); const X = window.XLSX, wb = X.utils.book_new(), D = erg.D;
    const kl = D.SACHGRUPPENKLASSENNAME.map(z => z.SACHGRUPPENKLASSENNAME).sort();
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([[], ["", "Klasse", kl[0] || ""], ["", "bis", (kl[kl.length - 1] || "") + "ZZZ"], [], [], ["", "SDRPOS", String(erg.opts.sdrStart).padStart(8, "0")], ["", "bis", String(Math.max(erg.sdrBis, erg.opts.sdrStart)).padStart(8, "0")]]), "setup");
    const reihe = ["SACHGRUPPE", "SACHWERTREGISTER", "SACHGRUPPEPOS", "SACHVORGABE", "SACHGRUPPENKLASSENNAME", "SACHGRUPPENKLASSE", "SACHGRUPPENKLASSEPOS", "SACHWERTDLGREGEL", "SDRPOS"];
    if (erg.opts.preise) reihe.push("VSTUELI", "VSTUELIPOS"); if (erg.opts.stueckliste) reihe.push("STUELIPOS");
    for (const n of reihe) { const a = blatt(n, D[n]); if (a) { const ws = X.utils.aoa_to_sheet(a); ws["!cols"] = a[0].map(h => ({ wch: Math.max(10, Math.min(40, String(h).length + 2)) })); X.utils.book_append_sheet(wb, ws, n); } }
    if (D.SACHWERTDLGREGEL.length) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Regel (SDR)", "Attributklasse", "Bedingung", "Herkunft im Konfigurator", "Aktionen (zum Erfassen von Hand)"], ...D.SACHWERTDLGREGEL.map(r => [r.SDR, r.SACHGRUPPENKLASSE, r.VARIANTE, r._name || "", D.SDRPOS.filter(x => x.SDR === r.SDR).map(x => `${x.ACTIONTYPE} ${x.SACHBEGRIFF}${x.VALUE !== "" ? " = " + x.VALUE : ""}${x.MESSAGE ? " „" + x.MESSAGE + "“" : ""}`).join("; ")])]), "Regelübersicht");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Fahrzeug", "Artikel", "Attributklasse", "Attributgruppen", "Attribute", "Regeln", "Am Artikel eintragen"], ...erg.pruef]), "Prüfliste");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Hinweise"], ...erg.hinweise.map(h => [h]), [], ["Ablauf"], ["1. Mappe mit dem APplus-Datenimport einlesen (Blätter in dieser Reihenfolge)."], ["2. Attributgruppen freigeben, falls Status 1 (angelegt) gewählt."], ["3. Am Fahrzeugartikel die Attributklasse eintragen (siehe Prüfliste)."], ["4. Systemkonfiguration: Variantenkonfiguration › VariantenParserAdapter2; an der Attributklasse „Attributdialog Regeln aktiv“."], ["5. SDRPOS (Regelaktionen): laut Referenz-Mappe ggf. von Hand erfassen, falls der Import sie nicht übernimmt. Die Regelübersicht listet je Regel die Aktionen."], ["6. Gesperrte Einzelcodes: APplus blendet keine einzelnen Werte aus. Darum je Code eine Regel „Bedingung + Attribut=Code“ mit removeValue und Warnung."]]), "Hinweise");
    return new Blob([X.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  };

  /* ---------- Oberfläche: Studio › Nach APplus ---------- */
  K.apx = { auswahl: null, tab: "SACHGRUPPEPOS" };
  const ro = () => !K.Store.schreiben, St = () => K.studio;
  K.route("studio-applus", () => {
    const mo = S().entwurf; if (!mo) return St().keinEntwurf();
    const opts = AP.standardOpts(), fz = mo.produkte.filter(p => E.produktMerkmale(mo, p).length);
    if (!K.apx.auswahl) K.apx.auswahl = new Set(fz.slice(0, 1).map(p => p.id));
    const gew = fz.filter(p => K.apx.auswahl.has(p.id)), erg = gew.length ? AP.erzeugen(mo, gew, opts) : null;
    const dis = ro() ? "disabled" : "";
    const tabs = erg ? Object.entries(erg.D).filter(([n, z]) => z.length || ["SACHGRUPPEPOS", "SACHVORGABE", "SACHWERTDLGREGEL", "SDRPOS"].includes(n)) : [];
    const t = K.apx.tab, zeilen = erg?.D[t] || [], kopf = K.DA_VORLAGE[t]?.[0] || [], belegt = [...kopf.filter(h => zeilen.some(z => z[h] !== undefined && z[h] !== "")), ...(t === "SACHWERTDLGREGEL" ? ["_name"] : [])];
    return St().kopf("Nach APplus übertragen", "Die Konfiguration aus dem Katalogaufbau als dynamische Attribute für APplus: je Fahrzeug eine Attributklasse, ZZ-Überschriften als Attributgruppen, YY-Gruppen als Attribute mit zulässigen Codes, Regeln als Attributdialog-Regeln, Preise als Vertriebsstückliste. Ausgabe als Mappe für den APplus-Datenimport.") + `
      <div class="apx-layout">
        <section class="panel"><h3>Fahrzeuge</h3>
          <table class="kompakt apx-fz"><thead><tr><th></th><th>Fahrzeug</th><th>Artikel</th><th>Attributklasse</th><th class="r">Codes</th><th></th></tr></thead><tbody>
          ${fz.map(p => { const eigen = (opts.klassen || {})[p.id], frage = K.apx.loeschen === p.id; return `<tr><td><input type="checkbox" data-act="apxWahl" data-p="${p.id}" ${K.apx.auswahl.has(p.id) ? "checked" : ""} aria-label="${esc(p.name)} übertragen"></td>
            <td><input id="apx-n-${p.id}" data-chg="apxName" data-p="${p.id}" value="${esc(p.name)}" aria-label="Fahrzeugname" ${dis}></td>
            <td><input id="apx-c-${p.id}" class="mono" data-chg="apxCode" data-p="${p.id}" value="${esc(p.code || "")}" aria-label="Artikelnummer" ${dis}></td>
            <td><span class="apx-kl"><input id="apx-k-${p.id}" class="mono kurz" data-chg="apxKlasse" data-p="${p.id}" value="${esc(AP.klasseVon(p, opts))}" maxlength="12" aria-label="Attributklasse" ${dis}>${eigen && !ro() ? `<button type="button" class="btn klein ghost" data-act="apxKlasseZurueck" data-p="${p.id}" title="Wieder aus der Artikelnummer bilden" aria-label="Attributklasse zurücksetzen">↺</button>` : ""}</span></td>
            <td class="r num">${E.produktMerkmale(mo, p).reduce((n, x) => n + x.werte.length, 0)}</td>
            <td class="r">${ro() ? "" : frage ? `<span class="apx-frage"><button type="button" class="btn klein gefahr" data-act="apxLoeschenOk" data-p="${p.id}">Löschen</button><button type="button" class="btn klein ghost" data-act="apxLoeschen" data-p="">Abbrechen</button></span>` : `<button type="button" class="btn klein gefahr-text" data-act="apxLoeschen" data-p="${p.id}" aria-label="${esc(p.name)} löschen">Löschen</button>`}</td></tr>`; }).join("") || `<tr><td colspan="6" class="gedimmt">Noch keine Fahrzeuge mit Codes. Erst im Katalogaufbau anlegen.</td></tr>`}</tbody></table>
          ${K.apx.loeschen ? `<p class="klein gefahr-text">Das Fahrzeug wird aus dem Entwurf gelöscht (mit seinen Codes-Zuordnungen und Regel-Geltungen). Bis zur nächsten Freigabe bleibt die freigegebene Version unverändert.</p>` : ""}
          <p class="klein gedimmt">Attributklasse höchstens 12 Zeichen. Attributgruppen heißen Klasse-ZZ-Code (max. 15 Zeichen).</p></section>
        <section class="panel"><h3>Einstellungen</h3><div class="formgitter">
          <div class="feld"><label for="apx-m">Mandant</label><input id="apx-m" class="mono kurz" data-chg="apxOpt" data-k="mandant" value="${esc(opts.mandant)}" placeholder="leer" ${dis}></div>
          <div class="feld"><label for="apx-sdr">Erste Regelnummer (SDR)</label><input id="apx-sdr" type="number" min="1" data-chg="apxOpt" data-k="sdrStart" value="${opts.sdrStart}" ${dis}><span class="klein gedimmt">frei bis ${erg ? String(Math.max(erg.sdrBis, opts.sdrStart)).padStart(8, "0") : "–"}</span></div>
          <div class="feld"><label for="apx-st">Status der Attributgruppen</label><select id="apx-st" data-act="apxOptW" data-k="status" ${dis}><option value="1" ${+opts.status === 1 ? "selected" : ""}>1 – angelegt (danach in APplus freigeben)</option><option value="2" ${+opts.status === 2 ? "selected" : ""}>2 – freigegeben</option></select></div>
          <div class="feld"><label for="apx-sp">Spalten je Registerkarte</label><select id="apx-sp" data-act="apxOptW" data-k="spalten" ${dis}>${[1, 2, 3].map(n => `<option ${+opts.spalten === n ? "selected" : ""}>${n}</option>`).join("")}</select></div>
          <div class="feld"><label for="apx-pa">Artikel für Preisanteile</label><input id="apx-pa" class="mono" data-chg="apxOpt" data-k="preisArtikel" value="${esc(opts.preisArtikel)}" placeholder="leer = Vertriebscode selbst" ${dis}></div>
        </div>
          <label class="haken"><input type="checkbox" data-act="apxOptH" data-k="preise" ${opts.preise ? "checked" : ""} ${dis}> Preise als Vertriebsstückliste (VSTUELI/VSTUELIPOS)</label>
          <label class="haken"><input type="checkbox" data-act="apxOptH" data-k="stueckliste" ${opts.stueckliste ? "checked" : ""} ${dis}> Stücklistenpositionen mit Variantenbedingung (STUELIPOS)</label>
          <details><summary class="klein">Tabellen der Attributklasse (${opts.tabellen.length})</summary><div class="apx-tab">${TABELLEN.map(x => `<label class="haken klein"><input type="checkbox" data-act="apxTabelle" data-t="${x}" ${opts.tabellen.includes(x) ? "checked" : ""} ${dis}> ${x}</label>`).join("")}</div></details>
          <div class="row"><button class="btn primary" type="button" data-act="apxLaden" ${erg ? "" : "disabled"}>Mappe für den APplus-Datenimport herunterladen</button></div></section>
      </div>
      ${erg ? `<section class="panel"><div class="panelkopf"><h3>Vorschau</h3><span class="klein gedimmt">${erg.D.SACHGRUPPE.length} Attributgruppen · ${erg.D.SACHGRUPPEPOS.length} Attribute · ${erg.D.SACHWERTDLGREGEL.length} Regeln · ${erg.D.VSTUELIPOS.length} Preisanteile</span></div>
        <div class="tabs-innen apx-tabs klein" role="tablist">${tabs.map(([n, z]) => `<button type="button" role="tab" data-act="apxTab" data-t="${n}" aria-selected="${t === n}">${n} <span class="tabzahl">${z.length}</span></button>`).join("")}</div>
        <div class="tabwrap apx-vorschau"><table class="kompakt"><thead><tr>${belegt.map(h => `<th>${h === "_name" ? "Herkunft" : esc(h)}</th>`).join("")}</tr></thead><tbody>${zeilen.slice(0, 200).map(z => `<tr>${belegt.map(h => `<td class="${/VORGABE|VARIANTE|MESSAGE/.test(h) ? "mono klein umbruch" : ""}">${esc(String(z[h] ?? "")).replace(/\n/g, "<br>")}</td>`).join("")}</tr>`).join("") || `<tr><td class="gedimmt">keine Zeilen</td></tr>`}</tbody></table></div>
        ${erg.hinweise.length ? `<details class="apx-hinweise" open><summary><b>${erg.hinweise.length} Hinweise</b></summary><ul>${erg.hinweise.map(h => `<li>${esc(h)}</li>`).join("")}</ul></details>` : ""}
        <div class="hinweis klein"><b>Danach in APplus:</b> Mappe mit dem Datenimport einlesen, am Fahrzeugartikel die Attributklasse eintragen (${erg.pruef.map(x => `${esc(x[1])} → ${esc(x[2])}`).join(", ")}), in der Systemkonfiguration den VariantenParserAdapter2 wählen und an der Attributklasse „Attributdialog Regeln aktiv“ setzen. Laut Ihrer Referenzmappe werden Regelaktionen (SDRPOS) ggf. nicht importiert und müssen dann von Hand erfasst werden.</div></section>` : ""}`;
  });
  const optSetzen = async (k, v) => { const e = S().einst; e.applusExport = Object.assign(AP.standardOpts(), e.applusExport || {}, { [k]: v }); await K.Store.einstSpeichern(e, true); K.render(); };
  K.act.apxWahl = el => { const s = K.apx.auswahl; el.checked ? s.add(el.dataset.p) : s.delete(el.dataset.p); K.render(); };
  K.inp.apxKlasse = el => { const o = AP.standardOpts(); o.klassen = Object.assign({}, o.klassen, { [el.dataset.p]: schl(el.value, 12) }); optSetzen("klassen", o.klassen); };
  K.inp.apxOpt = el => optSetzen(el.dataset.k, el.type === "number" ? +el.value : el.value.trim());
  K.act.apxOptW = el => optSetzen(el.dataset.k, +el.value || el.value);
  K.act.apxOptH = el => optSetzen(el.dataset.k, el.checked);
  K.act.apxTabelle = el => { const o = AP.standardOpts(); optSetzen("tabellen", el.checked ? [...new Set([...o.tabellen, el.dataset.t])] : o.tabellen.filter(x => x !== el.dataset.t)); };
  const fzg = id => S().entwurf.produkte.find(p => p.id === id), aenderung = t => K.Store.entwurfGeaendert(t);
  K.inp.apxName = el => { const p = fzg(el.dataset.p), v = el.value.trim(); if (!p || !v || v === p.name) return K.render(); const alt = p.name; p.name = v; aenderung(`Fahrzeug ${alt} umbenannt in ${v}`); K.render(); };
  K.inp.apxCode = el => { const p = fzg(el.dataset.p), v = el.value.trim(); if (!p || v === (p.code || "")) return; if (v && S().entwurf.produkte.some(x => x !== p && (x.code || "") === v)) { K.toast(`Artikelnummer ${v} ist schon vergeben`); return K.render(); } const alt = p.code; p.code = v; aenderung(`Artikelnummer ${alt || "–"} → ${v || "–"} (${p.name})`); K.render(); };
  K.act.apxKlasseZurueck = el => { const o = AP.standardOpts(), k = Object.assign({}, o.klassen); delete k[el.dataset.p]; optSetzen("klassen", k); };
  K.act.apxLoeschen = el => { K.apx.loeschen = el.dataset.p || null; K.render(); };
  K.act.apxLoeschenOk = el => {
    const mo = S().entwurf, p = fzg(el.dataset.p); if (!p) return; K.apx.loeschen = null;
    E.ausGeltungEntfernen(mo, [], [p.id]); mo.produkte = mo.produkte.filter(x => x !== p); K.apx.auswahl.delete(p.id);
    const o = AP.standardOpts(); if ((o.klassen || {})[p.id]) { const k = Object.assign({}, o.klassen); delete k[p.id]; optSetzen("klassen", k); }
    aenderung(`Fahrzeug ${p.name} gelöscht`); K.toast(`${p.name} gelöscht`); K.render();
  };
  K.act.apxTab = el => { K.apx.tab = el.dataset.t; K.render(); };
  K.act.apxLaden = async el => {
    const mo = S().entwurf, gew = mo.produkte.filter(p => K.apx.auswahl.has(p.id)); el.disabled = true;
    try { const erg = AP.erzeugen(mo, gew, AP.standardOpts()); const blob = await AP.mappe(erg); await K.speichereDatei(`APplus_Attribute_${gew.map(p => AP.klasseVon(p, erg.opts)).join("_").slice(0, 60)}.xlsx`, blob); K.Store.log("APplus", `Datenimport-Mappe für ${gew.map(p => p.name).join(", ")} erzeugt`); }
    catch (e) { console.error(e); K.toast("Mappe konnte nicht erzeugt werden: " + (e.message || e)); }
    el.disabled = false;
  };
})(typeof window !== "undefined" ? window : globalThis);


/* ===== app.js ===== */
/* Start der Anwendung: Navigation, Datenschicht, erstes Zeichnen */
(function () {
  const K = window.KONF, S = () => K.Store.S;

  const NAV = [
    ["Vertrieb", [["start", "Übersicht", "M3 12h7V3H3zm11 9h7v-9h-7zM3 21h7v-6H3zm11-12h7V3h-7z"], ["katalog", "Katalog", "M4 6h16M4 12h16M4 18h10"], ["konfig", "Konfigurator", "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6"], ["angebote", "Angebote", "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"], ["kunden", "Kunden", "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2-2.8M4 19v-1a3 3 0 0 1 2-2.8"]]],
    ["Studio", [["studio-katalog", "Katalog aufbauen", "M3 5h7v6H3zM14 5h7v6h-7zM3 15h7v4H3zM14 15h7v4h-7z"], ["studio-regeln", "Regeln", "M5 5h6v6H5zM13 13h6v6h-6zM11 8h4a2 2 0 0 1 2 2v3"], ["studio-import", "Excel-Import", "M4 4h16v16H4zM4 9h16M9 4v16M12 13l2 3m0-3-2 3"], ["studio-test", "Modelltest", "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"], ["studio-freigabe", "Freigabe", "M5 12l4 4L19 6"], ["studio-applus", "Nach APplus", "M4 12h12M12 6l6 6-6 6M20 4v16"], ["studio-vorlagen", "Angebotsdesigner", "M5 3h14v18H5zM9 7h6M9 11h6M9 15h3"], ["studio-einstellungen", "Einstellungen", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"], ["studio-protokoll", "Protokoll", "M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"]]],
    ["Experte", [["studio-modell", "Produktmodell", "M4 4h6v5H4zM14 15h6v5h-6zM4 15h6v5H4zM7 9v6M7 12h10v3"], ["studio-produkte", "Produkte", "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7"], ["studio-merkmale", "Merkmale", "M4 6h10M4 12h16M4 18h7M17 4v4M14 16v4"]]]
  ];
  const ikon = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  function navBauen() {
    K.el("konf-nav").innerHTML = `<div class="marke"><b>Fahrzeug&shy;konfigurator</b><span>CPQ für Auflieger</span></div>` +
      NAV.map(([titel, l]) => `<div class="navgruppe"><div class="navtitel">${titel}</div>${l.map(([h, n, d]) => `<a href="#${h}" data-r="${h}">${ikon(d)}<span>${n}</span><span class="badge" data-b="${h}" hidden></span></a>`).join("")}</div>`).join("") +
      `<div class="navfuss" id="konf-navfuss"></div>`;
  }
  const gruppeVon = h => h === "studio-import-vorlage" || h === "studio-import-struktur" ? "studio-import" : h.startsWith("angebot-") ? "angebote" : h.startsWith("kunde-") ? "kunden" : h;
  K.navAktualisieren = h => {
    const g = gruppeVon(h);
    K.root.querySelectorAll("#konf-nav a[data-r]").forEach(a => a.dataset.r === g ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const setze = (r, n) => { const b = K.root.querySelector(`[data-b="${r}"]`); if (b) { b.hidden = !n; b.textContent = n; } };
    setze("angebote", S().angebote.filter(a => K.offeneFragen(a).length).length);
    setze("studio-freigabe", K.freigabeOffen());
    const f = K.el("konf-navfuss"), m = K.Store.modus;
    f.innerHTML = m === "db" ? `<span class="punkt ${K.Store.schreiben ? "ok" : "warn"}"></span>${K.Store.schreiben ? "Gemeinsame Daten, live" : "Nur lesen"}` : m === "lokal" ? `<span class="punkt ${K.Store.applusQuellen ? "ok" : "warn"}"></span>${K.Store.applusQuellen ? "APplus-Daten, Änderungen lokal" : "Beispieldaten, im Browser gespeichert"}` : m === "demo" ? `<span class="punkt warn"></span>Demo-Modus, nichts wird gespeichert` : "Wird verbunden …";
  };

  K.waechter = r => {
    if (!S().geladen) return `<div class="leer laden"><span class="spinner"></span>Daten werden geladen …</div>`;
    if (!S().einst || (!S().live && !S().entwurf)) {
      return `<div class="leer"><h2>Willkommen</h2><p>Der Datenspeicher ist noch leer.</p>${K.Store.schreiben ? `<p>Laden Sie das Startmodell mit Aufliegertypen, Regeln und Beispielkunden oder importieren Sie Ihre Excel-Datei.</p><div class="row"><button class="btn primary" type="button" data-act="startmodell">Startmodell laden</button><a class="btn" href="#studio-import">Excel importieren</a></div>` : "<p>Bitte wenden Sie sich an die Person, die diese Anwendung eingerichtet hat.</p>"}</div>`;
    }
    return null;
  };

  /* Wie die übrigen APplus-Dashboards: oben in #content einhängen und den Rest ausblenden */
  function einhaengen() {
    let r = document.querySelector(K.cfg.mount);
    const content = document.getElementById("content");
    if (!r) {
      r = document.createElement("div"); r.id = "konfigurator";
      if (content) content.insertBefore(r, content.firstChild); else document.body.insertBefore(r, document.body.firstChild);
    }
    if (K.cfg.maximize && content && content.contains(r)) {
      Array.from(content.children).forEach(c => { if (c !== r) { c.setAttribute("data-konf-ausgeblendet", "1"); c.style.display = "none"; } });
      Object.assign(content.style, { width: "100%", maxWidth: "none", paddingLeft: "0", paddingRight: "0" });
    }
    r.innerHTML = `<div class="app"><nav id="konf-nav" aria-label="Konfigurator-Navigation"></nav><main id="konf-view" class="inhalt"></main></div><div id="konf-sheet" hidden></div><div class="toast" id="konf-toast" hidden role="status"></div>`;
    return r;
  }

  async function start() {
    if (K.gestartet) return; K.gestartet = true;
    K.root = einhaengen();
    navBauen(); K.render();
    try { if (window.claude && window.claude.use) { const [d, a] = await Promise.all([window.claude.use("downloads"), window.claude.use("assets")]); K.downloads = d; K.assets = a; } } catch (e) {}
    K.Store.onChange(was => {
      if (was === "prefs") K.Store.meinVertrieb = S().prefs.vertrieb || null;
      K.datenGeaendert();
    });
    await K.Store.init();
    K.Store.meinVertrieb = S().prefs.vertrieb || null;
    K.render();
    if (K.Store.ladefehler && K.Store.ladefehler.length) K.toast(`${K.Store.ladefehler.length} APplus-Abfrage(n) nicht geladen, dort gelten Beispieldaten. Details in der Konsole.`);
  }
  window.KONF.neuLaden = async () => { await K.Store.init(); K.render(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
