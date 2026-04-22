import { Mountain, Clock } from "lucide-react";

export function EmptyAreaPlaceholder({ meta }) {
  return (
    <div className="pt-8">
      <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-sm p-8 text-center">
        <Mountain size={40} className="mx-auto text-zinc-600 mb-4" />
        <div className="font-display text-2xl text-zinc-200 mb-2">{meta.full}</div>
        <div className="text-sm text-zinc-400 mb-4">Dane dla tego modułu są przygotowywane.</div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/50 border border-amber-800 rounded-sm text-amber-400 text-xs uppercase tracking-widest">
          <Clock size={12} />
          <span>Wkrótce</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-6">
          Przełącz na Jurę w pasku powyżej by kontynuować naukę
        </div>
      </div>
    </div>
  );
}
