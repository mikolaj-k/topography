import { STORAGE_PREFIX } from "./constants";

const memoryFallback = {};

export function readStorage(key, defaultValue) {
  try {
    if (typeof window === "undefined" || !window.localStorage) throw new Error("no ls");
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return key in memoryFallback ? memoryFallback[key] : defaultValue;
  }
}

export function writeStorage(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) throw new Error("no ls");
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    memoryFallback[key] = value;
  }
}

export function storageKey(...parts) {
  return [STORAGE_PREFIX, ...parts].join(":");
}
