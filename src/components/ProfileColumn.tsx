import { ALL_BODIES, PLANETS, SUN } from "../data/planets";
import type { CelestialBody } from "../data/planets";
import BodyProfile from "./BodyProfile";

interface Props {
  body: CelestialBody | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function OverviewPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const groups = [
    { label: "恒星 · STAR", bodies: [SUN] },
    { label: "行星 · PLANETS", bodies: PLANETS.filter((p) => p.id !== "pluto") },
    { label: "矮行星 · DWARF", bodies: PLANETS.filter((p) => p.id === "pluto") },
  ];
  const totalMoons = PLANETS.reduce((s, p) => s + (p.moons ?? 0), 0);

  return (
    <div className="info-panel-enter flex h-full flex-col">
      <div className="border-b border-line/80 px-5 pb-4 pt-5">
        <div className="font-numeric text-[10px] uppercase tracking-[0.26em] text-fog">System Overview</div>
        <h3 className="mt-1.5 font-display text-2xl tracking-wide text-snow">太阳系总览</h3>
        <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
          {[
            { v: "1", l: "恒星" },
            { v: "8", l: "行星" },
            { v: "1", l: "矮行星" },
            { v: `${totalMoons}`, l: "已知卫星" },
          ].map((s) => (
            <div key={s.l} className="border border-line/70 bg-ink/40 py-2">
              <div className="font-numeric text-lg leading-none text-solar">{s.v}</div>
              <div className="mt-1 text-[9px] tracking-[0.2em] text-fog">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {groups.map((g) => (
          <div key={g.label} className="mb-3.5">
            <div className="mb-1.5 px-2 font-numeric text-[9px] uppercase tracking-[0.26em] text-fog/80">{g.label}</div>
            <ul>
              {g.bodies.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => onSelect(b.id)}
                    className="group flex w-full items-center gap-2.5 px-2 py-[7px] text-left transition-colors duration-200 hover:bg-snow/[0.04]"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{ background: `linear-gradient(135deg, ${b.color}, ${b.colorDeep})`, boxShadow: `0 0 7px ${b.glow}` }}
                    />
                    <span className="w-14 shrink-0 text-[13px] text-mist transition-colors duration-200 group-hover:text-snow">{b.name}</span>
                    <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line/50">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${Math.min((Math.sqrt(b.orbitRadius) / Math.sqrt(398)) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${b.colorDeep}, ${b.color})`,
                        }}
                      />
                    </span>
                    <span className="w-[74px] shrink-0 text-right font-numeric text-[9.5px] text-fog">{b.orbitPeriodLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/70 px-5 py-3 text-[10.5px] leading-relaxed text-fog/80">
        点击左侧轨道图中的任意天体，或上方列表，即可在此打开档案。
      </div>
    </div>
  );
}

export default function ProfileColumn({ body, onSelect, onClose, onNavigate }: Props) {
  if (!body) return <OverviewPanel onSelect={onSelect} />;

  const idx = ALL_BODIES.findIndex((b) => b.id === body.id);
  const prev = ALL_BODIES[(idx + ALL_BODIES.length - 1) % ALL_BODIES.length];
  const next = ALL_BODIES[(idx + 1) % ALL_BODIES.length];

  const footer = (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onNavigate(prev.id)}
        className="group flex items-center gap-1.5 text-xs text-fog transition-colors duration-200 hover:text-snow"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true">
          <path d="M7.5 1.5 3 6l4.5 4.5" />
        </svg>
        {prev.name}
      </button>
      <span className="font-numeric text-[10px] uppercase tracking-[0.2em] text-fog/60">
        {idx + 1} / {ALL_BODIES.length}
      </span>
      <button
        onClick={() => onNavigate(next.id)}
        className="group flex items-center gap-1.5 text-xs text-fog transition-colors duration-200 hover:text-snow"
      >
        {next.name}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
          <path d="m4.5 1.5 4.5 4.5-4.5 4.5" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <BodyProfile body={body} onClose={onClose} footer={footer} />
      </div>
    </div>
  );
}
