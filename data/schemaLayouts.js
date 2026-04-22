import { AREA_JURA, AREA_PODHALE } from "../utils/constants";

export const SCHEMA_LAYOUTS = {
  [AREA_JURA]: {
    viewBox: "0 0 250 420",
    width: 250,
    regions: [
      { id: "północna",   y: 10,  path: "M 60 10 L 195 10 L 205 100 L 175 140 L 75 140 L 45 100 Z" },
      { id: "centralna",  y: 140, path: "M 75 140 L 175 140 L 185 200 L 165 270 L 85 270 L 65 200 Z" },
      { id: "południowa", y: 270, path: "M 85 270 L 165 270 L 205 330 L 195 410 L 55 410 L 45 330 Z" },
    ],
    cities: {
      "północna":   [{ x: 120, y: 45,  name: "Częstochowa" }, { x: 155, y: 85,  name: "Olsztyn" }, { x: 105, y: 115, name: "Złoty P." }],
      "centralna":  [{ x: 120, y: 165, name: "Podlesice ★" }, { x: 150, y: 210, name: "Mirów/Bob." }, { x: 135, y: 245, name: "Ogrodzieniec" }],
      "południowa": [{ x: 115, y: 305, name: "Ojców" },       { x: 150, y: 345, name: "Dolinki" },     { x: 110, y: 385, name: "Kraków" }],
    },
  },
  [AREA_PODHALE]: {
    viewBox: "0 0 380 280",
    width: 380,
    regions: [
      { id: "beskidy", y: 30,  path: "M 20 30 L 150 30 L 150 140 L 20 140 Z" },
      { id: "podhale", y: 30,  path: "M 150 30 L 270 30 L 270 140 L 150 140 Z" },
      { id: "pieniny", y: 30,  path: "M 270 30 L 360 30 L 360 140 L 270 140 Z" },
      { id: "tatry",   y: 145, path: "M 80 145 L 310 145 L 310 260 L 80 260 Z" },
    ],
    cities: {
      "beskidy": [{ x: 45, y: 65, name: "Żywiec" }, { x: 100, y: 90, name: "Babia G." }, { x: 70, y: 120, name: "Rabka ★" }],
      "podhale": [{ x: 180, y: 65, name: "Maków" }, { x: 215, y: 95, name: "N. Targ" }, { x: 230, y: 125, name: "Limanowa" }],
      "pieniny": [{ x: 295, y: 75, name: "Krościenko" }, { x: 320, y: 105, name: "Szczawnica" }, { x: 335, y: 130, name: "3 Korony" }],
      "tatry":   [{ x: 140, y: 185, name: "Zakopane" }, { x: 200, y: 215, name: "Giewont" }, { x: 260, y: 240, name: "Rysy" }],
    },
  },
};
