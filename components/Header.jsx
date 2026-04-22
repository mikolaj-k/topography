import { Mountain, BookOpen, Target, Map as MapIcon, Radio, Activity } from "lucide-react";
import { useArea, useAreaData } from "../hooks/useArea";
import { AREA_JURA, AREA_PODHALE, MODE } from "../utils/constants";

export function Header({ mode, setMode }) {
  const { areaId, setAreaId } = useArea();
  const { LOCATIONS, meta } = useAreaData();

  const tabs = [
    { id: MODE.FISZKI, label: "Fiszki", icon: BookOpen },
    { id: MODE.QUIZ,   label: "Quiz",   icon: Target },
    { id: MODE.MAPA,   label: "Mapa",   icon: MapIcon },
  ];

  const areaTabs = [
    { id: AREA_JURA,    label: "Jura" },
    { id: AREA_PODHALE, label: "Podhale" },
  ];

  const locCountLabel = LOCATIONS.length > 0
    ? `${LOCATIONS.length} lokalizacji`
    : "dane wkrótce";

  return (
    <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-3xl mx-auto px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-sm bg-red-600 flex items-center justify-center shrink-0 border border-red-500">
              <Radio size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display text-xl leading-none text-zinc-100">GOPR / TOPOGRAFIA</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{meta.label} ⸱ {locCountLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Activity size={12} className="text-green-500" />
            <span className="hidden sm:inline">offline</span>
          </div>
        </div>

        {/* Przełącznik obszaru */}
        <div className="grid grid-cols-2 gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-sm mb-1">
          {areaTabs.map(a => {
            const active = areaId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAreaId(a.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[11px] uppercase tracking-widest font-semibold rounded-sm transition-colors ${
                  active
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
                style={{ minHeight: 36 }}
              >
                <Mountain size={11} />
                {a.label}
              </button>
            );
          })}
        </div>

        {/* Przełącznik trybu */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-sm">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
                style={{ minHeight: 44 }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
