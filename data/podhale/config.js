import {
  Home, Mountain, Waves, Trees, TrendingUp, Radio,
} from "lucide-react";

export const PODHALE_CATEGORIES = {
  "Szczyty":     { icon: TrendingUp, color: "rose",    bgSel: "bg-rose-600",    bgSoft: "bg-rose-950",    text: "text-rose-400",    border: "border-rose-700",    dot: "#f43f5e" },
  "Schroniska":  { icon: Home,       color: "amber",   bgSel: "bg-amber-600",   bgSoft: "bg-amber-950",   text: "text-amber-400",   border: "border-amber-700",   dot: "#f59e0b" },
  "Przełęcze":   { icon: Mountain,   color: "orange",  bgSel: "bg-orange-600",  bgSoft: "bg-orange-950",  text: "text-orange-400",  border: "border-orange-700",  dot: "#f97316" },
  "Doliny":      { icon: Waves,      color: "teal",    bgSel: "bg-teal-600",    bgSoft: "bg-teal-950",    text: "text-teal-400",    border: "border-teal-700",    dot: "#14b8a6" },
  "Atrakcje":    { icon: Trees,      color: "emerald", bgSel: "bg-emerald-600", bgSoft: "bg-emerald-950", text: "text-emerald-400", border: "border-emerald-700", dot: "#10b981" },
  "Stacje GOPR": { icon: Radio,      color: "red",     bgSel: "bg-red-600",     bgSoft: "bg-red-950",     text: "text-red-400",     border: "border-red-700",     dot: "#ef4444" },
};

export const PODHALE_REGIONS = {
  "tatry":    { short: "TA", label: "Tatry",                 desc: "Rysy · Świnica · Giewont · Kasprowy",                 color: "#a78bfa" },
  "podhale":  { short: "PH", label: "Podhale i Sądecczyzna", desc: "Zakopane · Nowy Targ · Kotlina · Beskid Sądecki",     color: "#60a5fa" },
  "beskidy":  { short: "BE", label: "Beskidy",               desc: "Babia Góra · Turbacz · Pilsko · Gorce · Wyspowy",     color: "#f59e0b" },
  "pieniny":  { short: "PI", label: "Pieniny",               desc: "Trzy Korony · Sokolica · Przełom Dunajca",            color: "#10b981" },
};

export const PODHALE_BOUNDS = {
  latMin: 49.15,
  latMax: 49.85,
  lngMin: 19.20,
  lngMax: 20.90,
};

export const PODHALE_ANCHORS = [
  { name: "Rabka-Zdrój",  lat: 49.6144, lng: 19.9786, priority: 1, csr: true },
  { name: "Zakopane",     lat: 49.2992, lng: 19.9496, priority: 1 },
  { name: "Nowy Targ",    lat: 49.4772, lng: 20.0328, priority: 1 },
  { name: "Nowy Sącz",    lat: 49.6211, lng: 20.6969, priority: 2 },
  { name: "Szczawnica",   lat: 49.4239, lng: 20.4922, priority: 2 },
  { name: "Krościenko",   lat: 49.4317, lng: 20.4281, priority: 2 },
  { name: "Limanowa",     lat: 49.7050, lng: 20.4272, priority: 2 },
  { name: "Żywiec",       lat: 49.6856, lng: 19.1939, priority: 2 },
  { name: "Maków Podh.",  lat: 49.7297, lng: 19.6778, priority: 2 },
];

export const PODHALE_OUTLINE = [
  [49.83, 19.35], [49.80, 19.95], [49.82, 20.50], [49.72, 20.75],
  [49.55, 20.88], [49.35, 20.85], [49.25, 20.55], [49.17, 20.10],
  [49.17, 19.95], [49.20, 19.55], [49.35, 19.25], [49.60, 19.20],
  [49.78, 19.22],
];

export const PODHALE_REGION_DIVIDERS = [];

export const PODHALE_COORDINATES = {
  // --- SZCZYTY ---
  // Tatry Wysokie
  1001: [49.1795, 20.0881], // Rysy (polski wierzchołek NW)
  1002: [49.1850, 20.0714], // Mięguszowiecki Szczyt Wielki
  1003: [49.2119, 20.0572], // Kozi Wierch
  1004: [49.2275, 20.0058], // Świnica
  1005: [49.2253, 20.0292], // Granaty (Pośredni)
  1006: [49.2261, 20.0425], // Krzyżne
  1007: [49.2331, 20.0094], // Kościelec
  1008: [49.2056, 20.0456], // Szpiglasowy Wierch
  1009: [49.1942, 20.0719], // Mnich
  1010: [49.2281, 20.0119], // Zawrat
  1011: [49.2242, 20.0669], // Wołoszyn
  1012: [49.2283, 19.7528], // Wołowiec
  // Tatry Zachodnie
  1013: [49.2325, 19.9822], // Kasprowy Wierch
  1014: [49.2511, 19.9342], // Giewont (Wielki)
  1015: [49.2303, 19.9108], // Czerwone Wierchy (Krzesanica)
  1016: [49.2144, 19.8386], // Starorobociański Wierch
  1017: [49.2300, 19.8956], // Ciemniak
  1018: [49.2422, 19.9389], // Kopa Kondracka
  // Beskidy
  1019: [49.5731, 19.5292], // Babia Góra (Diablak)
  1020: [49.5286, 19.3236], // Pilsko
  1021: [49.6217, 19.6253], // Polica
  1022: [49.5444, 20.0808], // Turbacz
  1023: [49.6619, 20.2422], // Mogielica
  1024: [49.6428, 19.9681], // Luboń Wielki
  1025: [49.7600, 19.9722], // Lubomir
  1026: [49.5622, 20.1814], // Gorc
  // Beskid Sądecki
  1027: [49.4597, 20.5611], // Radziejowa
  1028: [49.4758, 20.5083], // Przehyba
  1029: [49.4072, 20.8450], // Jaworzyna Krynicka
  // Pieniny
  1030: [49.3942, 20.5672], // Wysoka (Wysokie Skałki)
  1031: [49.4147, 20.4097], // Trzy Korony (Okrąglica)
  1032: [49.4158, 20.4344], // Sokolica

  // --- SCHRONISKA ---
  // Tatry
  1101: [49.2431, 20.0097], // Murowaniec
  1102: [49.1967, 20.0697], // Morskie Oko (schronisko)
  1103: [49.2194, 20.0458], // Pięciu Stawów
  1104: [49.2314, 20.0800], // Roztoka
  1105: [49.2514, 19.9625], // Kondratowa
  1106: [49.2442, 19.8694], // Ornak
  1107: [49.2494, 19.8036], // Chochołowska
  1108: [49.2697, 19.9639], // Kalatówki
  // Gorce
  1109: [49.5392, 20.0914], // Turbacz schronisko (poniżej szczytu)
  1110: [49.5542, 20.0294], // Stare Wierchy
  1111: [49.5758, 19.9889], // Maciejowa
  1112: [49.6425, 19.9711], // Luboń Wielki (Zaryte)
  // Beskid Żywiecki
  1113: [49.5783, 19.5467], // Markowe Szczawiny
  1114: [49.6214, 19.6411], // Hala Krupowa
  // Beskid Sądecki
  1115: [49.4597, 20.7972], // Hala Łabowska
  // Pieniny
  1116: [49.4019, 20.3983], // Trzy Korony (Sromowce Niżne)
  1117: [49.4283, 20.4919], // Orlica (Szczawnica)
  // Beskid Makowski
  1118: [49.7378, 19.9144], // Kudłacze

  // --- PRZEŁĘCZE ---
  1201: [49.5844, 19.5739], // Krowiarki
  1202: [49.2467, 19.9322], // Kondracka Przełęcz
  1203: [49.2311, 20.0036], // Świnicka Przełęcz
  1204: [49.2286, 19.9958], // Liliowe
  1205: [49.4256, 20.4189], // Szopka (Chwała Bogu)
  1206: [49.5033, 20.3267], // Knurowska
  1207: [49.6167, 19.6211], // Borek
  1208: [49.2897, 20.2669], // Zdziarska

  // --- DOLINY --- (punkt charakterystyczny doliny)
  1301: [49.2556, 19.8047], // Chochołowska (polana)
  1302: [49.2572, 19.8744], // Kościeliska
  1303: [49.2194, 20.0472], // Pięciu Stawów Polskich
  1304: [49.2225, 20.0786], // Rybiego Potoku
  1305: [49.2331, 20.0858], // Roztoki
  1306: [49.2600, 19.9158], // Małej Łąki
  1307: [49.2706, 19.9411], // Strążyska
  1308: [49.2722, 19.9583], // Białego
  1309: [49.4050, 20.4225], // Pieniński Przełom Dunajca
  1310: [49.3711, 20.1206], // Białki

  // --- ATRAKCJE ---
  1401: [49.1972, 20.0697], // Morskie Oko (jezioro)
  1402: [49.1878, 20.0811], // Czarny Staw pod Rysami
  1403: [49.3069, 19.9503], // Gubałówka
  1404: [49.2992, 19.9497], // Krupówki
  1405: [49.4022, 20.5508], // Wąwóz Homole
  1406: [49.2544, 19.8728], // Jaskinia Mroźna
  1407: [49.2714, 19.9853], // Kaplica Jaszczurówka
  1408: [49.4433, 20.3128], // Jezioro Czorsztyńskie
  1409: [49.4456, 20.3108], // Zamek Czorsztyn
  1410: [49.4383, 20.3217], // Zamek Niedzica
  1411: [49.4119, 20.4050], // Spływ Dunajcem (start Sromowce Wyżne)
  1412: [49.2294, 20.0456], // Siklawa
  1413: [49.2722, 19.9411], // Wielka Siklawica (Strążyska)
  1414: [49.2525, 19.8811], // Jaskinia Mylna
  1415: [49.6097, 19.9939], // Skansen Chabówka

  // --- STACJE GOPR ---
  1501: [49.6144, 19.9786], // CSR Rabka al. Tysiąclecia 1
  1502: [49.4772, 20.0328], // Długa Polana Nowy Targ (Kowaniec)
  1503: [49.4317, 20.4281], // Krościenko
  1504: [49.4239, 20.4922], // Szczawnica
  1505: [49.5392, 20.0914], // Turbacz dyżurka
  1506: [49.5442, 20.2903], // Ochotnica Górna
  1507: [49.6214, 19.6411], // Hala Krupowa punkt
  1508: [49.4019, 20.3983], // Trzy Korony (Sromowce Niżne)
  1509: [49.7050, 20.4272], // Limanowa
  1510: [49.6150, 20.4544], // Kamienica
  1511: [49.6278, 20.1178], // Niedźwiedź
  // TOPR
  1512: [49.2978, 19.9567], // TOPR Zakopane Piłsudskiego 63a
  1513: [49.2697, 19.9639], // Kalatówki TOPR
  1514: [49.1967, 20.0697], // Morskie Oko TOPR
};
