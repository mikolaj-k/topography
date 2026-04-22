import { HIT_KM, CLOSE_KM, MAP_DIMENSIONS } from "./constants";

const KM_PER_DEG_LAT = 111;
const KM_PER_DEG_LNG_50N = 71;

export function projectGeo(lat, lng, width, height, padding = MAP_DIMENSIONS.PADDING, bounds) {
  const latRange = bounds.latMax - bounds.latMin;
  const lngRange = bounds.lngMax - bounds.lngMin;
  const rawX = ((lng - bounds.lngMin) / lngRange) * (width - 2 * padding) + padding;
  const rawY = ((bounds.latMax - lat) / latRange) * (height - 2 * padding) + padding;

  const outside =
    lat < bounds.latMin || lat > bounds.latMax ||
    lng < bounds.lngMin || lng > bounds.lngMax;

  const x = Math.max(padding, Math.min(width - padding, rawX));
  const y = Math.max(padding, Math.min(height - padding, rawY));

  let edge = null;
  if (outside) {
    if (lat > bounds.latMax && lng < bounds.lngMin) edge = "NW";
    else if (lat > bounds.latMax) edge = "N";
    else if (lat < bounds.latMin) edge = "S";
    else if (lng < bounds.lngMin) edge = "W";
    else edge = "E";
  }

  return { x, y, outside, edge };
}

export function unprojectGeo(x, y, width, height, padding = MAP_DIMENSIONS.PADDING, bounds) {
  const latRange = bounds.latMax - bounds.latMin;
  const lngRange = bounds.lngMax - bounds.lngMin;
  const lng = ((x - padding) / (width - 2 * padding)) * lngRange + bounds.lngMin;
  const lat = bounds.latMax - ((y - padding) / (height - 2 * padding)) * latRange;
  return { lat, lng };
}

export function kmDistance(lat1, lng1, lat2, lng2) {
  const dLat = (lat1 - lat2) * KM_PER_DEG_LAT;
  const dLng = (lng1 - lng2) * KM_PER_DEG_LNG_50N;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

export function getVerdict(km) {
  if (km <= HIT_KM) return "hit";
  if (km <= CLOSE_KM) return "close";
  return "miss";
}
