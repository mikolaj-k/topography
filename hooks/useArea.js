import { createContext, useContext } from "react";
import { AREA_DATA } from "../data/index";
import { storageKey } from "../utils/storage";
import { usePersistedState } from "./usePersistedState";

export const AreaContext = createContext(null);

export function useArea() {
  const ctx = useContext(AreaContext);
  if (!ctx) throw new Error("useArea must be used within AreaContext.Provider");
  return ctx;
}

export function useAreaData() {
  const { areaId } = useArea();
  return AREA_DATA[areaId];
}

export function useAreaProgress() {
  const { areaId } = useArea();
  const keyKnown = storageKey(areaId, "known");
  const keyUnknown = storageKey(areaId, "unknown");
  const [known, setKnown] = usePersistedState(keyKnown, [], true);
  const [unknown, setUnknown] = usePersistedState(keyUnknown, [], true);
  return { known, setKnown, unknown, setUnknown };
}
