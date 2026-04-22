import { useState, useCallback, useMemo } from "react";
import "./styles/app.css";
import { DEFAULT_AREA, STORAGE_PREFIX, MODE } from "./utils/constants";
import { readStorage, writeStorage } from "./utils/storage";
import { AREA_DATA } from "./data/index";
import { AreaContext, useAreaData } from "./hooks/useArea";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { EmptyAreaPlaceholder } from "./components/EmptyAreaPlaceholder";
import { FlashcardsMode } from "./components/FlashcardsMode";
import { QuizMode } from "./components/QuizMode";
import { MapMode } from "./components/MapMode";

export function App() {
  const [mode, setMode] = useState(MODE.FISZKI);
  const [areaId, _setAreaId] = useState(() => {
    const stored = readStorage(`${STORAGE_PREFIX}:currentArea`, null);
    return stored && AREA_DATA[stored] ? stored : DEFAULT_AREA;
  });

  const setAreaId = useCallback((id) => {
    if (!AREA_DATA[id]) return;
    _setAreaId(id);
    writeStorage(`${STORAGE_PREFIX}:currentArea`, id);
  }, []);

  const ctxValue = useMemo(() => ({ areaId, setAreaId }), [areaId, setAreaId]);

  return (
    <AreaContext.Provider value={ctxValue}>
      <div
        className="min-h-screen bg-zinc-950 text-zinc-100"
        style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace" }}
      >
        <div className="topo-bg min-h-screen">
          <Header mode={mode} setMode={setMode} />

          <main className="max-w-3xl mx-auto px-3 pb-24">
            <AreaContent key={areaId} mode={mode} />
          </main>

          <Footer />
        </div>
      </div>
    </AreaContext.Provider>
  );
}

function AreaContent({ mode }) {
  const { LOCATIONS, meta } = useAreaData();

  if (LOCATIONS.length === 0) {
    return <EmptyAreaPlaceholder meta={meta} />;
  }

  if (mode === MODE.FISZKI) return <FlashcardsMode />;
  if (mode === MODE.QUIZ)   return <QuizMode />;
  if (mode === MODE.MAPA)   return <MapMode />;
  return null;
}
