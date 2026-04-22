import { useState, useEffect, useMemo } from "react";
import {
  Map as MapIcon, Target, ChevronRight, X, Check,
} from "lucide-react";
import { useAreaData } from "../hooks/useArea";
import { MiniMap } from "./MiniMap";
import { shuffle, pickN, regionLabel } from "../utils/helpers";
import { SCHEMA_LAYOUTS } from "../data/schemaLayouts";

export function MapMode() {
  const { LOCATIONS, REGIONS, meta } = useAreaData();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [miniQuiz, setMiniQuiz] = useState(null);
  const [detailLoc, setDetailLoc] = useState(null);

  const locationsByRegion = useMemo(() => {
    return Object.keys(REGIONS).reduce((acc, reg) => {
      acc[reg] = LOCATIONS.filter(l => l.region === reg);
      return acc;
    }, {});
  }, [LOCATIONS, REGIONS]);

  const startMiniQuiz = (region) => {
    const regLocs = locationsByRegion[region];
    const otherLocs = LOCATIONS.filter(l => l.region !== region);
    if (regLocs.length < 1 || otherLocs.length < 3) return;
    const target = regLocs[Math.floor(Math.random() * regLocs.length)];
    const wrongs = pickN(otherLocs, 3);
    setMiniQuiz({
      region,
      prompt: `Który z tych obiektów leży w ${regionLabel(region, REGIONS)}?`,
      options: shuffle([target.name, ...wrongs.map(w => w.name)]),
      correct: target.name,
      target,
      selected: null,
      correctCount: 0,
      totalCount: 0,
    });
  };

  const nextMiniQuestion = (region, prevStats) => {
    const regLocs = locationsByRegion[region];
    const otherLocs = LOCATIONS.filter(l => l.region !== region);
    const target = regLocs[Math.floor(Math.random() * regLocs.length)];
    const wrongs = pickN(otherLocs, 3);
    setMiniQuiz({
      region,
      prompt: `Który z tych obiektów leży w ${regionLabel(region, REGIONS)}?`,
      options: shuffle([target.name, ...wrongs.map(w => w.name)]),
      correct: target.name,
      target,
      selected: null,
      correctCount: prevStats.correctCount,
      totalCount: prevStats.totalCount,
    });
  };

  const handleMiniSelect = (opt) => {
    if (!miniQuiz || miniQuiz.selected) return;
    const isCorrect = opt === miniQuiz.correct;
    setMiniQuiz({
      ...miniQuiz,
      selected: opt,
      correctCount: miniQuiz.correctCount + (isCorrect ? 1 : 0),
      totalCount: miniQuiz.totalCount + 1,
    });
  };

  return (
    <div className="pt-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-3 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1">
          <MapIcon size={10} /> Schemat – tapnij region
        </div>
        <SchemaMap
          selected={selectedRegion}
          onSelect={(r) => {
            setSelectedRegion(r);
            setMiniQuiz(null);
            setDetailLoc(null);
          }}
          locationsByRegion={locationsByRegion}
        />
      </div>

      {selectedRegion && REGIONS[selectedRegion] && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-3 mb-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: REGIONS[selectedRegion].color }} />
                <div className="font-display text-2xl text-zinc-100 leading-none">{REGIONS[selectedRegion].label}</div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">{REGIONS[selectedRegion].desc}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl text-zinc-300 leading-none">{locationsByRegion[selectedRegion]?.length || 0}</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">lokalizacji</div>
            </div>
          </div>

          {!miniQuiz ? (
            <button
              onClick={() => startMiniQuiz(selectedRegion)}
              className="w-full mb-3 py-2.5 text-xs uppercase tracking-wider font-semibold bg-red-600 border border-red-500 text-white hover:bg-red-500 rounded-sm flex items-center justify-center gap-2"
              style={{ minHeight: 44 }}
            >
              <Target size={14} /> Przetestuj region
            </button>
          ) : (
            <MiniQuizPanel
              quiz={miniQuiz}
              onSelect={handleMiniSelect}
              onNext={() => nextMiniQuestion(selectedRegion, miniQuiz)}
              onClose={() => setMiniQuiz(null)}
            />
          )}

          {!miniQuiz && (
            <RegionLocationsList
              region={selectedRegion}
              locations={locationsByRegion[selectedRegion]}
              onDetail={setDetailLoc}
            />
          )}
        </div>
      )}

      {detailLoc && (
        <LocationDetail loc={detailLoc} onClose={() => setDetailLoc(null)} />
      )}
    </div>
  );
}

function SchemaMap({ selected, onSelect, locationsByRegion }) {
  const { REGIONS, meta } = useAreaData();
  const layout = SCHEMA_LAYOUTS[meta.id];

  if (!layout) {
    return <div className="text-center text-zinc-600 text-xs uppercase tracking-widest py-4">Schemat obszaru niedostępny</div>;
  }

  const { viewBox, regions, cities } = layout;

  return (
    <svg viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: "55vh" }}>
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1f1f23" strokeWidth="0.5" />
        </pattern>
        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.4" fill="#27272a" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <g>
        <circle cx="20" cy="20" r="10" fill="#09090b" stroke="#3f3f46" strokeWidth="0.8" />
        <text x="20" y="24" textAnchor="middle" fontSize="10" fill="#a1a1aa" fontFamily="'Bebas Neue'" fontWeight="700">N</text>
      </g>

      {regions.map(r => {
        const isSelected = selected === r.id;
        const reg = REGIONS[r.id];
        if (!reg) return null;
        const locCount = locationsByRegion[r.id]?.length || 0;
        const centerX = layout.width / 2;
        return (
          <g key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: "pointer" }}>
            <path
              d={r.path}
              fill={isSelected ? reg.color : "#18181b"}
              fillOpacity={isSelected ? 0.25 : 1}
              stroke={isSelected ? reg.color : "#3f3f46"}
              strokeWidth={isSelected ? 2 : 1}
            />
            <path d={r.path} fill="url(#dots)" fillOpacity={0.3} />
            <text
              x={centerX}
              y={r.y + 22}
              textAnchor="middle"
              fontSize="12"
              fontFamily="'Bebas Neue'"
              fontWeight="700"
              fill={isSelected ? reg.color : "#a1a1aa"}
              letterSpacing="0.1em"
            >
              {reg.short}
            </text>
            <text
              x={centerX}
              y={r.y + 34}
              textAnchor="middle"
              fontSize="7"
              fill="#71717a"
              letterSpacing="0.08em"
            >
              {locCount} obiektów
            </text>
          </g>
        );
      })}

      {Object.entries(cities).map(([reg, list]) => {
        if (!REGIONS[reg]) return null;
        return (
          <g key={reg}>
            {list.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r="2" fill={REGIONS[reg].color} />
                <text x={c.x + 5} y={c.y + 2.5} fontSize="6.5" fill="#d4d4d8" fontFamily="monospace">{c.name}</text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function RegionLocationsList({ region, locations, onDetail }) {
  const { CATEGORIES } = useAreaData();
  const [openCat, setOpenCat] = useState(null);

  const grouped = useMemo(() => {
    const g = {};
    Object.keys(CATEGORIES).forEach(c => { g[c] = []; });
    locations.forEach(l => { if (g[l.category]) g[l.category].push(l); });
    return g;
  }, [locations, CATEGORIES]);

  return (
    <div className="space-y-2">
      {Object.keys(CATEGORIES).map(cat => {
        const catLocs = grouped[cat];
        if (catLocs.length === 0) return null;
        const C = CATEGORIES[cat];
        const Icon = C.icon;
        const isOpen = openCat === cat;
        return (
          <div key={cat}>
            <button
              onClick={() => setOpenCat(isOpen ? null : cat)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 ${C.bgSoft} ${C.border} border rounded-sm ${C.text} text-xs uppercase tracking-wider font-semibold`}
              style={{ minHeight: 44 }}
            >
              <Icon size={14} />
              <span className="flex-1 text-left">{cat}</span>
              <span className="text-zinc-500 font-mono text-[11px]">{catLocs.length}</span>
              <ChevronRight size={14} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
            </button>
            {isOpen && (
              <div className="mt-1 grid gap-1">
                {catLocs.map(l => (
                  <button
                    key={l.id}
                    onClick={() => onDetail(l)}
                    className="text-left px-3 py-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 rounded-sm transition-colors"
                    style={{ minHeight: 44 }}
                  >
                    <div className="text-sm text-zinc-100 leading-tight">{l.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{l.subcategory}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MiniQuizPanel({ quiz, onSelect, onNext, onClose }) {
  const { prompt, options, correct, selected, target, correctCount, totalCount } = quiz;
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500">
          <Target size={10} className="inline mr-1" />
          test regionu · {correctCount}/{totalCount} ({pct}%)
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-100 p-1"
          aria-label="Zamknij test"
        >
          <X size={14} />
        </button>
      </div>
      <div className="text-sm text-zinc-100 mb-3 font-semibold leading-tight">{prompt}</div>
      <div className="space-y-1.5">
        {options.map((opt, i) => {
          const isSel = selected === opt;
          const isCor = opt === correct;
          let cls = "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800";
          if (selected) {
            if (isCor) cls = "bg-green-900 border-green-600 text-green-100";
            else if (isSel) cls = "bg-red-950 border-red-600 text-red-100";
            else cls = "opacity-50 bg-zinc-900 border-zinc-800 text-zinc-500";
          }
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              disabled={!!selected}
              className={`w-full text-left px-3 py-2.5 border rounded-sm text-sm flex items-center gap-2 transition-colors ${cls}`}
              style={{ minHeight: 44 }}
            >
              <span className="w-5 h-5 shrink-0 rounded-sm bg-zinc-950 border border-zinc-700 text-[10px] font-bold flex items-center justify-center">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {selected && isCor && <Check size={14} className="text-green-400" />}
              {selected && isSel && !isCor && <X size={14} className="text-red-400" />}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-3">
          <div className="text-[11px] text-zinc-400 mb-2 leading-relaxed border-l-2 border-zinc-700 pl-2">
            <strong className="text-zinc-200">{target.name}</strong> ({target.category}) — {target.description}
          </div>
          <button
            onClick={onNext}
            className="w-full py-2.5 bg-red-600 border border-red-500 text-white rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-red-500 flex items-center justify-center gap-1.5"
            style={{ minHeight: 44 }}
          >
            Następne pytanie <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function LocationDetail({ loc, onClose }) {
  const { CATEGORIES, REGIONS } = useAreaData();
  const C = CATEGORIES[loc.category];
  const Icon = C?.icon;
  const reg = REGIONS[loc.region];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!C || !reg) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-30 flex items-end sm:items-center justify-center p-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md bg-zinc-900 border-2 ${C.border} rounded-sm p-4 my-4 max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`flex items-center gap-1.5 px-2 py-1 ${C.bgSoft} ${C.border} border rounded-sm`}>
            <Icon size={12} className={C.text} />
            <span className={`text-[10px] uppercase tracking-widest ${C.text} font-semibold`}>{loc.category}</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 p-1" aria-label="Zamknij">
            <X size={18} />
          </button>
        </div>

        <div className="font-display text-3xl text-zinc-50 leading-tight mb-1">{loc.name}</div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{loc.subcategory}</div>

        <div className="space-y-2 text-sm text-zinc-200 mb-3">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: reg.color }} />
            <span className="text-xs text-zinc-400">{reg.label} — {loc.county}</span>
          </div>
          <div className="leading-relaxed">{loc.description}</div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">
            <MapIcon size={10} />
            <span>pozycja na mapie</span>
          </div>
          <MiniMap locId={loc.id} accentColor={C.dot} />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800">
          {loc.quizHints.map((h, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-sm text-zinc-400 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
