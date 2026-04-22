import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight, RotateCcw, Check, X, Zap, Clock, Gauge, HelpCircle,
} from "lucide-react";
import { useAreaData } from "../hooks/useArea";
import { generateQuestion } from "../utils/quiz";

export function QuizMode() {
  const { LOCATIONS, REGIONS, meta } = useAreaData();
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setQuestion(generateQuestion(LOCATIONS, difficulty, REGIONS));
    setSelected(null);
    setCorrect(0);
    setTotal(0);
    setStreak(0);
  }, [LOCATIONS, difficulty, REGIONS, meta.id]);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    setTotal(t => t + 1);
    if (opt === question.correct) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setQuestion(generateQuestion(LOCATIONS, difficulty, REGIONS));
    setSelected(null);
  };

  const handleReset = () => {
    setCorrect(0);
    setTotal(0);
    setStreak(0);
    setStartTime(Date.now());
    handleNext();
  };

  const handleNextCb = useCallback(() => {
    if (selected) handleNext();
  }, [selected, question]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Enter" && selected) {
        e.preventDefault();
        handleNextCb();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, handleNextCb]);

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");

  if (!question) return <div className="pt-8 text-center text-zinc-500 text-sm">Ładuję pytanie...</div>;

  const feedback = selected ? (selected === question.correct ? "correct" : "wrong") : null;

  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-sm mb-3">
        {[
          { id: "easy", label: "Łatwy · wszystkie" },
          { id: "hard", label: "Trudny · jaskinie+skałki" },
        ].map(d => {
          const active = difficulty === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`py-2.5 px-2 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-colors ${
                active ? "bg-red-600 text-white" : "text-zinc-400 hover:text-zinc-100"
              }`}
              style={{ minHeight: 44 }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        <StatBox label="Wynik" value={`${correct}/${total}`} icon={Check} color="text-green-400" />
        <StatBox label="Trafn." value={`${pct}%`} icon={Gauge} color="text-sky-400" />
        <StatBox label="Streak" value={streak} icon={Zap} color="text-amber-400" />
        <StatBox label="Czas"   value={`${m}:${s}`} icon={Clock} color="text-zinc-400" />
      </div>

      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-sm p-4 mb-3 card-grain">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
          <HelpCircle size={10} className="inline mr-1" />
          {question.subprompt}
        </div>
        <div className="font-display text-xl sm:text-2xl text-zinc-50 leading-tight">
          {question.prompt}
        </div>
      </div>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === question.correct;
          let cls = "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800";
          if (selected) {
            if (isCorrect) cls = "bg-green-900 border-green-600 text-green-100";
            else if (isSelected) cls = "bg-red-950 border-red-600 text-red-100";
            else cls = "bg-zinc-900 border-zinc-800 text-zinc-500 opacity-60";
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`w-full text-left px-3 py-3 border rounded-sm transition-colors flex items-center gap-3 ${cls}`}
              style={{ minHeight: 56 }}
            >
              <span className="w-7 h-7 shrink-0 rounded-sm bg-zinc-950 border border-zinc-700 text-xs font-bold flex items-center justify-center">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm">{opt}</span>
              {selected && isCorrect && <Check size={18} className="text-green-400 shrink-0" />}
              {selected && isSelected && !isCorrect && <X size={18} className="text-red-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 space-y-3">
          <div className={`p-3 border rounded-sm text-sm ${
            feedback === "correct"
              ? "bg-green-950 border-green-800 text-green-100"
              : "bg-red-950 border-red-800 text-red-100"
          }`}>
            <div className="font-semibold uppercase tracking-wider text-xs mb-2">
              {feedback === "correct" ? "✓ Dobrze" : "✗ Pomyłka"}
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-zinc-100">{question.target.name}</strong> — {question.target.description}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleReset}
              className="py-3 px-2 text-xs uppercase tracking-wider font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-sm"
              style={{ minHeight: 48 }}
              aria-label="Reset wyniku"
            >
              <RotateCcw size={14} className="inline" />
            </button>
            <button
              onClick={handleNext}
              className="col-span-3 py-3 px-4 text-sm uppercase tracking-wider font-semibold bg-red-600 border border-red-500 text-white hover:bg-red-500 rounded-sm flex items-center justify-center gap-2"
              style={{ minHeight: 48 }}
            >
              Dalej <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-2">
      <div className="flex items-center justify-center gap-1">
        <Icon size={10} className={color} />
        <span className="text-[9px] uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <div className={`font-display text-lg ${color} text-center mt-0.5 leading-none`}>{value}</div>
    </div>
  );
}
