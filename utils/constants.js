export const AREA_JURA = "jura";
export const AREA_PODHALE = "podhale";
export const DEFAULT_AREA = AREA_JURA;

export const STORAGE_PREFIX = "gopr-study";

export const MODE = {
  FISZKI: "fiszki",
  QUIZ: "quiz",
  MAPA: "mapa",
};

export const FILTER_ALL = "ALL";

export const MAP_DIMENSIONS = {
  W: 280,
  H: 340,
  PADDING: 12,
};

export const HIT_KM = 7;
export const CLOSE_KM = 15;

export const VERDICT_CONFIG = {
  hit:   { color: "#22c55e", bg: "bg-green-950",  border: "border-green-700", text: "text-green-300", label: "Trafione" },
  close: { color: "#f59e0b", bg: "bg-amber-950",  border: "border-amber-700", text: "text-amber-300", label: "Blisko"   },
  miss:  { color: "#ef4444", bg: "bg-red-950",    border: "border-red-700",   text: "text-red-300",   label: "Pudło"    },
};
