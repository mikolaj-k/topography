export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickN(arr, n, excludeId = null) {
  const pool = excludeId ? arr.filter(x => x.id !== excludeId) : arr;
  return shuffle(pool).slice(0, n);
}

export function regionLabel(r, regions) {
  return regions?.[r]?.label || r;
}

export function toggleSetItem(set, id, add) {
  const next = new Set(set);
  if (add) {
    next.add(id);
  } else {
    next.delete(id);
  }
  return next;
}
