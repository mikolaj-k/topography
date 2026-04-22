import { useState, useEffect, useRef } from "react";
import { readStorage, writeStorage } from "../utils/storage";

export function usePersistedState(key, defaultValue, isSet = false) {
  const [value, setValue] = useState(() => {
    const stored = readStorage(key, null);
    if (stored === null) return isSet ? new Set(defaultValue) : defaultValue;
    return isSet ? new Set(stored) : stored;
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const toStore = isSet ? [...value] : value;
    writeStorage(key, toStore);
  }, [key, value, isSet]);

  return [value, setValue];
}
