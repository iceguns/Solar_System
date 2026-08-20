import { ALL_BODIES } from "../data/planets";
import type { CelestialBody } from "../data/planets";
import { GAS_COLORS } from "../data/extras";

interface InfoPanelProps {
  body: CelestialBody | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-line/70 bg-ink/40 px-3 py-2.5">
      <div className="text-[10px] tracking-[0.18em] text-fog">{label}</div>
      <div className="mt-1 font-numeric text-[14px] font-medium leading-tight text-snow">{value}</div>
      {sub && <div className="mt-0.5 font-numeric text-[10.5px] text-fog">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/50 py-2 last:border-0">
      <span className="shrink-0 text-[10px] tracking-[0.18em] text-fog">{label}</span>
      <span className="text-right text-xs leading-relaxed text-mist">{value}</span>
    </div>
  );
}

export default function InfoPanel({ body, onClose, onNavigate }: InfoPanelProps) {
  if (!body) return null;

  const idx = ALL_BODIES.findIndex((b) => b.id === body.id);
  const prev = ALL_BODIES[(idx + ALL_BODIES.length - 1) % ALL_BODIES.length];
  const next = ALL_BODIES[(idx + 1) % ALL_BODIES.length];
  const ratio = body.earthRatio;
  const barWidth = Math.max((ratio / 11.2) * 100, 3.5);

  return (
    <aside
      key={body.id}
      className="hud-panel info-panel-enter absolute inset-x-3 bottom-3 z-20 max-h-[62%] overflow-y-auto sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-1/2 sm:z-10 sm:max-h-[88%] sm:w-[352px] sm:-translate-y-1/2"
      style={{ "--corner-c": body.color } as React.CSSProperties}
      role="dialog"
      aria-label={`${body.name}档案`}
    >
      {/* 头部 */}
      <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-line/80 bg-panel/95 px-5 pb-4 pt-5 backdrop-blur-sm">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl"
          style={{
            borderColor: body.color,
            color: body.color,
            background: `radial-gradient(circle at 35% 30%, ${body.glow}, transparent 70%)`,
            textShadow: `0 0 12px ${body.glow}`,
          }}
        >
          {body.symbol}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[26px] leading-none tracking-wide text-snow">{body.name}</h3>
          <div className="mt-1.5 font-numeric text-[11px] uppercase tracking-[0.22em] text-fog">{body.en}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭档案面板"
          className="ml-auto -mr-1 -mt-1 flex h-7 w-7 items-center justify-center border border-transparent text-fog transition-colors duration-200 hover:border-line hover:text-snow"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-block border px-2.5 py-1 text-[11px] tracking-widest"
            style={{ borderColor: `${body.color}55`, color: body.color, background: `${body.color}12` }}
          >
            {body.category}
          </div>
          <div className="font-numeric text-[10px] uppercase tracking-[0.18em] text-fog/80">#{String(idx + 1).padStart(2, "0")}</div>
        </div>

        {/* 核心数据 */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <Stat label="直径 SIZE" value={body.diameterLabel} sub={`≈ 地球 × ${body.earthRatio}`} />
          <Stat label="距太阳 DISTANCE" value={body.distanceLabel} sub={body.distanceAU} />
          <Stat label="公转周期 ORBIT" value={body.orbitPeriodLabel} />
          <Stat label="自转周期 SPIN" value={body.rotationLabel} />
          <Stat label="质量 MASS" value={body.massLabel} />
          <Stat label="表面重力 GRAVITY" value={body.gravityLabel} />
          <Stat label="轴倾角 TILT" value={body.tiltLabel} />
          <Stat label="光照时延 LIGHT" value={body.lightLabel} />
          <Stat label="已知卫星 MOONS" value={body.moons === null ? "—" : `${body.moons} 颗`} />
          <Stat label="轨道速度 VELOCITY" value={body.velocityLabel} />
        </div>
        <div className="mt-2">
          <Stat label="温度 TEMPERATURE" value={body.tempLabel} />
        </div>

        {/* 与地球对比 */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-[11px] tracking-widest text-fog">
            <span>直径 · 以地球为 1</span>
            <span className="font-numeric text-[13px] text-snow">
              {ratio >= 1 ? `${ratio.toFixed(ratio >= 10 ? 1 : 2)} 倍` : `${ratio.toFixed(2)} 倍`}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line/60">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${barWidth}%`,
                background: `linear-gradient(90deg, ${body.colorDeep}, ${body.color})`,
                boxShadow: `0 0 10px ${body.glow}`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between font-numeric text-[10px] text-fog/70">
            <span>地球 1.0</span>
            <span>木星 11.2</span>
          </div>
        </div>

        {/* 大气成分 */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-[11px] tracking-widest text-fog">
            <span>大气成分 ATMOSPHERE</span>
            <span className="font-numeric text-[10px] text-fog/70">体积占比 · 约数</span>
          </div>
          <div className="mt-2 flex h-3 w-full overflow-hidden rounded-sm bg-line/40">
            {body.atmo.map((a) => (
              <div
                key={a.gas}
                title={`${a.gas} ${a.pct}%`}
                className="h-full transition-opacity duration-200 hover:opacity-75"
                style={{
                  width: `${Math.max(a.pct, 2)}%`,
                  background: GAS_COLORS[a.gas] ?? "#8b98ab",
                }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
            {body.atmo.map((a) => (
              <span key={a.gas} className="flex items-center gap-1.5 font-numeric text-[10.5px] text-fog">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: GAS_COLORS[a.gas] ?? "#8b98ab" }} />
                {a.gas} {a.pct}%
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-fog/80">{body.atmoNote}</p>
        </div>

        {/* 卫星 / 探测 / 发现 */}
        <div className="mt-3.5 border border-line/60 bg-ink/30 px-3.5 py-1.5">
          <Row label="著名卫星" value={body.moonsLabel} />
          <Row label="探测任务" value={body.missionLabel} />
          <Row label="观测发现" value={body.discoveryLabel} />
        </div>

        {/* 趣闻 */}
        <div className="mt-4 border-l-2 pl-3" style={{ borderColor: body.color }}>
          <div className="text-[10px] tracking-[0.22em] text-fog">档案备注 · NOTE</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{body.fact}</p>
          <ul className="mt-2.5 space-y-1.5">
            {body.facts.map((f) => (
              <li key={f} className="flex gap-2 text-xs leading-relaxed text-fog">
                <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: body.color }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* 上一颗 / 下一颗 */}
        <div className="mt-5 flex items-center justify-between border-t border-line/80 pt-4">
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
      </div>
    </aside>
  );
}
