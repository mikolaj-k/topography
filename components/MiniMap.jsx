import { Crosshair } from "lucide-react";
import { useAreaData } from "../hooks/useArea";
import { projectGeo } from "../utils/geo";
import { MAP_DIMENSIONS, VERDICT_CONFIG } from "../utils/constants";

const { W, H, PADDING } = MAP_DIMENSIONS;

export function MiniMap({
  locId,
  accentColor = "#ef4444",
  interactive = false,
  guess = null,
  onGuess = null,
  verdict = null,
}) {
  const { BOUNDS, ANCHORS, COORDINATES, OUTLINE, DIVIDERS } = useAreaData();
  const coords = COORDINATES[locId];
  if (!coords) return null;

  const [lat, lng] = coords;
  const pin = projectGeo(lat, lng, W, H, PADDING, BOUNDS);

  const revealed = !interactive || guess !== null;
  const awaitingGuess = interactive && guess === null;
  const guessColor = verdict ? VERDICT_CONFIG[verdict].color : "#60a5fa";

  const outlinePoints = OUTLINE.map(([olat, olng]) => projectGeo(olat, olng, W, H, PADDING, BOUNDS));
  const outlinePath = outlinePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";

  const handleClick = (e) => {
    if (!awaitingGuess || !onGuess) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const x = Math.max(PADDING, Math.min(W - PADDING, (clickX / rect.width) * W));
    const y = Math.max(PADDING, Math.min(H - PADDING, (clickY / rect.height) * H));
    onGuess({ x, y });
  };

  const labelSide = (p) => (p.x > W * 0.7 ? -4 : 4);

  return (
    <div className="relative bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleClick}
        style={{ cursor: awaitingGuess ? "crosshair" : "default", touchAction: "manipulation" }}
      >
        <defs>
          <pattern id={`mm-grid-${locId}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#1f1f23" strokeWidth="0.5" />
          </pattern>
          <pattern id={`mm-dots-${locId}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#27272a" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="#0a0a0a" />
        <rect width={W} height={H} fill={`url(#mm-grid-${locId})`} />

        <path d={outlinePath} fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
        <path d={outlinePath} fill={`url(#mm-dots-${locId})`} fillOpacity="0.5" />

        {DIVIDERS.length > 0 && (
          <g opacity="0.3">
            {DIVIDERS.map((d, i) => {
              const y = projectGeo(d.lat, BOUNDS.lngMin, W, H, PADDING, BOUNDS).y;
              return (
                <g key={i}>
                  <line x1="12" y1={y} x2={W - 12} y2={y} stroke="#52525b" strokeWidth="0.5" strokeDasharray="2 3" />
                  <text x={W - 14} y={y - 3} textAnchor="end" fontSize="7" fill="#52525b" letterSpacing="0.1em">{d.label}</text>
                </g>
              );
            })}
          </g>
        )}

        {ANCHORS.map((a, i) => {
          const p = projectGeo(a.lat, a.lng, W, H, PADDING, BOUNDS);
          const isPrimary = a.priority === 1;
          const r = isPrimary ? 2.2 : 1.6;
          const textDx = labelSide(p);
          const textAnchor = textDx < 0 ? "end" : "start";
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={r} fill={isPrimary ? "#f4f4f5" : "#a1a1aa"} />
              {isPrimary && <circle cx={p.x} cy={p.y} r={r + 1.5} fill="none" stroke="#f4f4f5" strokeWidth="0.5" opacity="0.3" />}
              {revealed && (
                <text
                  x={p.x + textDx}
                  y={p.y + 2.5}
                  textAnchor={textAnchor}
                  fontSize={isPrimary ? 8 : 7}
                  fill={isPrimary ? "#d4d4d8" : "#71717a"}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ paintOrder: "stroke", stroke: "#0a0a0a", strokeWidth: 2, strokeLinejoin: "round" }}
                >
                  {a.name}
                </text>
              )}
              {revealed && a.csr && (
                <text
                  x={p.x + textDx}
                  y={p.y + 11}
                  textAnchor={textAnchor}
                  fontSize="6"
                  fill="#ef4444"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="0.08em"
                  style={{ paintOrder: "stroke", stroke: "#0a0a0a", strokeWidth: 2, strokeLinejoin: "round" }}
                >
                  ★ CSR
                </text>
              )}
            </g>
          );
        })}

        <g transform={`translate(${W - 22}, 18)`}>
          <circle cx="0" cy="0" r="10" fill="#09090b" stroke="#3f3f46" strokeWidth="0.6" />
          <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#a1a1aa" fontFamily="'Bebas Neue', sans-serif" fontWeight="700">N</text>
        </g>

        {revealed && (pin.outside ? (
          <g transform={`translate(${pin.x}, ${pin.y})`}>
            <circle cx="0" cy="0" r="8" fill={accentColor} opacity="0.25" />
            <circle cx="0" cy="0" r="5" fill={accentColor} stroke="#0a0a0a" strokeWidth="1.5" />
            <text x="0" y="2" textAnchor="middle" fontSize="6" fill="#ffffff" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
              {pin.edge}
            </text>
            <text x="0" y="-12" textAnchor="middle" fontSize="7" fill={accentColor} fontFamily="'JetBrains Mono', monospace" fontWeight="700"
              style={{ paintOrder: "stroke", stroke: "#0a0a0a", strokeWidth: 2.5, strokeLinejoin: "round" }}>
              poza mapą
            </text>
          </g>
        ) : (
          <g>
            {!guess && (
              <circle cx={pin.x} cy={pin.y} r="14" fill={accentColor} opacity="0.15">
                <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={pin.x} cy={pin.y} r="8" fill={accentColor} opacity="0.35" />
            <line x1={pin.x - 14} y1={pin.y} x2={pin.x - 5} y2={pin.y} stroke={accentColor} strokeWidth="1" />
            <line x1={pin.x + 5} y1={pin.y} x2={pin.x + 14} y2={pin.y} stroke={accentColor} strokeWidth="1" />
            <line x1={pin.x} y1={pin.y - 14} x2={pin.x} y2={pin.y - 5} stroke={accentColor} strokeWidth="1" />
            <line x1={pin.x} y1={pin.y + 5} x2={pin.x} y2={pin.y + 14} stroke={accentColor} strokeWidth="1" />
            <circle cx={pin.x} cy={pin.y} r="4" fill={accentColor} stroke="#0a0a0a" strokeWidth="1.2" />
            <circle cx={pin.x} cy={pin.y} r="1.5" fill="#ffffff" />
          </g>
        ))}

        {guess && (
          <g>
            {!pin.outside && (
              <line
                x1={guess.x} y1={guess.y}
                x2={pin.x} y2={pin.y}
                stroke={guessColor}
                strokeWidth="1.2"
                strokeDasharray="3 2"
                opacity="0.65"
              />
            )}
            <circle cx={guess.x} cy={guess.y} r="9" fill={guessColor} opacity="0.15" />
            <circle cx={guess.x} cy={guess.y} r="5" fill={guessColor} opacity="0.4" />
            <circle cx={guess.x} cy={guess.y} r="3" fill={guessColor} stroke="#0a0a0a" strokeWidth="1" />
          </g>
        )}
      </svg>

      {revealed ? (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 to-transparent px-2 py-1 pointer-events-none">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono flex justify-between">
            <span>{lat.toFixed(3)}°N</span>
            <span>{lng.toFixed(3)}°E</span>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent px-2 py-2 pointer-events-none">
          <div className="text-[10px] uppercase tracking-widest text-zinc-300 font-mono text-center flex items-center justify-center gap-1.5">
            <Crosshair size={10} className="text-red-500" />
            <span>tapnij gdzie leży</span>
          </div>
        </div>
      )}
    </div>
  );
}
