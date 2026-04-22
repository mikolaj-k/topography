import { useAreaData } from "../hooks/useArea";

export function Footer() {
  const { meta } = useAreaData();
  return (
    <footer className="mt-8 px-3 py-4 text-center text-[10px] text-zinc-600 uppercase tracking-widest border-t border-zinc-900">
      <div>{meta.footer}</div>
      <div className="mt-1 text-zinc-700">{meta.group} ⸱ trening indywidualny</div>
    </footer>
  );
}
