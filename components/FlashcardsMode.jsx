import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronRight, RotateCcw, Check, X, Crosshair, MapPin, AlertTriangle,
} from "lucide-react";
import { useAreaData, useAreaProgress } from "../hooks/useArea";
import { MiniMap } from "./MiniMap";
import { shuffle, toggleSetItem } from "../utils/helpers";
import { unprojectGeo, kmDistance, getVerdict } from "../utils/geo";
import { FILTER_ALL, MAP_DIMENSIONS, HIT_KM, CLOSE_KM, VERDICT_CONFIG } from "../utils/constants";

const { W, H, PADDING } = MAP_DIMENSIONS;

export function FlashcardsMode() {
  const { LOCATIONS, CATEGORIES, REGIONS, COORDINATES, BOUNDS, meta } = useAreaData();
  const { known, setKnown, unknown, setUnknown } = useAreaProgress();

  const [catFilter, setCatFilter] = useState(FILTER_ALL);
  const [regFilter, setRegFilter] = useState(FILTER_ALL);
  const [guess, setGuess] = useState(null);
  const [repeatMode, setRepeatMode] = useState(false);
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);

  const baseDeck = useMemo(() => {
    let pool = LOCATIONS;
    if (catFilter !== FILTER_ALL) pool = pool.filter(l => l.category === catFilter);
    if (regFilter !== FILTER_ALL) pool = pool.filter(l => l.region === regFilter);
    if (repeatMode) pool = pool.filter(l => unknown.has(l.id));
    return pool;
  }, [LOCATIONS, catFilter, regFilter, repeatMode, unknown]);

  useEffect(() => {
    setDeck(shuffle(baseDeck));
    setIndex(0);
    setGuess(null);
  }, [baseDeck]);

  const current = deck[index];

  const { distance, verdict } = useMemo(() => {
    if (!guess || !current) return { distance: null, verdict: null };
    const coords = COORDINATES[current.id];
    if (!coords) return { distance: null, verdict: null };
    const { lat: clickLat, lng: clickLng } = unprojectGeo(guess.x, guess.y, W, H, PADDING, BOUNDS);
    const [targetLat, targetLng] = coords;
    const km = kmDistance(clickLat, clickLng, targetLat, targetLng);
    return { distance: km, verdict: getVerdict(km) };
  }, [guess, current, COORDINATES, BOUNDS]);

  const handleGuess = useCallback((g) => {
    setGuess(prev => prev || g);
  }, []);

  const handleNext = useCallback(() => {
    if (!current || !verdict) return;
    if (verdict === "hit" || verdict === "close") {
      setKnown(prev => toggleSetItem(prev, current.id, true));
      setUnknown(prev => toggleSetItem(prev, current.id, false));
    } else {
      setUnknown(prev => toggleSetItem(prev, current.id, true));
      setKnown(prev => toggleSetItem(prev, current.id, false));
    }
    setGuess(null);
    if (index + 1 < deck.length) {
      setIndex(index + 1);
    } else {
      setDeck(shuffle(deck));
      setIndex(0);
    }
  }, [current, verdict, index, deck, setKnown, setUnknown]);

  const handleReset = () => {
    setKnown(new Set());
    setUnknown(new Set());
    setDeck(shuffle(baseDeck));
    setIndex(0);
    setGuess(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Enter" && verdict) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [verdict, handleNext]);

  const total = deck.length;
  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  const regionOptions = [
    { id: FILTER_ALL, label: `Cały obszar` },
    ...Object.entries(REGIONS).map(([id, r]) => ({ id, label: r.short })),
  ];

  return (
    <div className="pt-4">
      <div className="space-y-2 mb-4">
        <FilterRow
          label="KATEGORIA"
          value={catFilter}
          setValue={setCatFilter}
          options={[{ id: FILTER_ALL, label: "Wszystkie" }, ...Object.keys(CATEGORIES).map(k => ({ id: k, label: k }))]}
          categoriesMap={CATEGORIES}
        />
        <FilterRow
          label="REGION"
          value={regFilter}
          setValue={setRegFilter}
          options={regionOptions}
          categoriesMap={CATEGORIES}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRepeatMode(r => !r)}
            disabled={unknown.size === 0}
            className={`flex-1 px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold border transition-colors ${
              repeatMode
                ? "bg-amber-600 border-amber-500 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-40"
            }`}
            style={{ minHeight: 44 }}
          >
            <RotateCcw size={12} className="inline mr-1" />
            Tryb powtórki {unknown.size > 0 && `(${unknown.size})`}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            style={{ minHeight: 44 }}
            aria-label="Resetuj talię"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {total > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">
            <span>{Math.min(index + 1, total)} / {total}</span>
            <span className="flex gap-3">
              <span className="text-green-500"><Check size={10} className="inline" /> {known.size}</span>
              <span className="text-red-500"><X size={10} className="inline" /> {unknown.size}</span>
            </span>
          </div>
          <div className="h-1 bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!current ? (
        <EmptyDeck repeatMode={repeatMode} />
      ) : (
        <>
          <Flashcard
            loc={current}
            guess={guess}
            onGuess={handleGuess}
            distance={distance}
            verdict={verdict}
          />

          <div className="mt-3">
            <button
              onClick={handleNext}
              disabled={!verdict}
              className={`w-full py-4 px-3 rounded-sm text-sm uppercase tracking-wider font-semibold border flex items-center justify-center gap-2 transition-colors ${
                verdict
                  ? "bg-red-600 border-red-500 text-white hover:bg-red-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
              style={{ minHeight: 56 }}
            >
              {verdict ? (<>Dalej <ChevronRight size={16} /></>) : "Wskaż lokalizację na mapie"}
            </button>
          </div>

          <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-zinc-600 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Enter = dalej</span>
            <span className="text-green-600">≤{HIT_KM} km trafione</span>
            <span className="text-amber-600">≤{CLOSE_KM} km blisko</span>
            <span className="text-red-600">&gt;{CLOSE_KM} km pudło</span>
          </div>
        </>
      )}
    </div>
  );
}

function FilterRow({ label, value, setValue, options, categoriesMap }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
      <div className="flex gap-1 overflow-x-auto scroll-hide -mx-1 px-1 pb-1">
        {options.map(o => {
          const active = value === o.id;
          const catConfig = categoriesMap?.[o.id];
          const borderClass = active && catConfig ? catConfig.border : "border-zinc-800";
          const bgClass = active
            ? (catConfig ? catConfig.bgSel : "bg-red-600")
            : "bg-zinc-900";
          const textClass = active ? "text-white" : "text-zinc-400 hover:text-zinc-100";
          return (
            <button
              key={o.id}
              onClick={() => setValue(o.id)}
              className={`shrink-0 px-3 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold border transition-colors ${bgClass} ${borderClass} ${textClass}`}
              style={{ minHeight: 44 }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Flashcard({ loc, guess, onGuess, distance, verdict }) {
  const { CATEGORIES, REGIONS } = useAreaData();
  const cat = CATEGORIES[loc.category];
  const reg = REGIONS[loc.region];
  if (!cat || !reg) return null;
  const Icon = cat.icon;
  const vc = verdict ? VERDICT_CONFIG[verdict] : null;

  return (
    <div className={`card-grain relative bg-zinc-900 border-2 ${cat.border} rounded-sm p-3 sm:p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 ${cat.bgSoft} ${cat.border} border rounded-sm`}>
          <Icon size={12} className={cat.text} />
          <span className={`text-[10px] uppercase tracking-widest ${cat.text} font-semibold`}>{loc.category}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: reg.color }} />
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">{reg.short}</span>
        </div>
      </div>

      <div className="text-center mb-3">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5 flex items-center justify-center gap-1.5">
          <Crosshair size={10} className="text-red-500" />
          <span>wskaż na mapie</span>
        </div>
        <div className="font-display text-2xl sm:text-3xl text-zinc-50 leading-tight">
          {loc.name}
        </div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
          {loc.subcategory}
        </div>
      </div>

      <MiniMap
        locId={loc.id}
        accentColor={cat.dot}
        interactive
        guess={guess}
        onGuess={onGuess}
        verdict={verdict}
      />

      {guess && vc && distance !== null && (
        <div className={`mt-3 p-3 border-l-2 ${vc.border} ${vc.bg} rounded-sm`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className={`font-display text-xl ${vc.text} leading-none`}>{vc.label}</div>
            <div className="text-right">
              <div className="font-display text-2xl text-zinc-100 leading-none tracking-tight">
                {distance < 1 ? distance.toFixed(2) : distance.toFixed(1)}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">km od celu</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-zinc-500 mt-0.5 shrink-0" />
              <div className="text-xs text-zinc-400">{loc.county}</div>
            </div>
            <div className="text-sm text-zinc-200 leading-relaxed">{loc.description}</div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {loc.quizHints.map((h, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-sm text-zinc-400 uppercase tracking-wider">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 text-[9px] font-mono text-zinc-700">#{String(loc.id).padStart(3, "0")}</div>
    </div>
  );
}

function EmptyDeck({ repeatMode }) {
  return (
    <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-sm p-8 text-center">
      <AlertTriangle size={32} className="mx-auto text-zinc-600 mb-3" />
      <div className="text-sm text-zinc-400 uppercase tracking-wider mb-1">Talia pusta</div>
      <div className="text-xs text-zinc-600">
        {repeatMode
          ? "Brak kart do powtórki. Oznacz jakąś jako 'nie wiem' lub wyłącz tryb powtórki."
          : "Brak lokalizacji dla wybranych filtrów."}
      </div>
    </div>
  );
}
