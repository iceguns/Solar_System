import { useEffect, useState } from "react";
import type { CelestialBody } from "../data/planets";
import { GAS_COLORS } from "../data/extras";

const TABS = [
  { id: "core", label: "核心数据", en: "CORE" },
  { id: "deep", label: "深空档案", en: "DEEP" },
  { id: "notes", label: "冷知识", en: "NOTES" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Cell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-line/70 bg-ink/40 px-3 py-2">
      <div className="text-[9.5px] tracking-[0.16em] text-fog">{label}</div>
      <div className="mt-0.5 font-numeric text-[13px] font-medium leading-tight text-snow">{value}</div>
      {sub && <div className="mt-0.5 font-numeric text-[10px] text-fog">{sub}</div>}
    </div>
  );
}

export default function BodyProfile({
  body,
  onClose,
  footer,
}: {
  body: CelestialBody;
  onClose?: () => void;
  footer?: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("core");

  useEffect(() => {
    setTab("core");
  }, [body.id]);

  const ratio = body.earthRatio;
  const barWidth = Math.min((ratio / 11.2) * 100, 100);

  return (
    <div key={body.id}>
      {/* 头部 */}
      <div className="flex items-start gap-3 border-b border-line/80 px-5 pb-4 pt-5">
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
        {onClose && (
          <button
            onClick={onClose}
            aria-label="关闭档案"
            className="ml-auto -mr-1 -mt-1 flex h-7 w-7 items-center justify-center border border-transparent text-fog transition-colors duration-200 hover:border-line hover:text-snow"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-5 pb-5 pt-4">
        <div
          className="mb-4 inline-block border px-2.5 py-1 text-[10.5px] tracking-widest"
          style={{ borderColor: `${body.color}55`, color: body.color, background: `${body.color}12` }}
        >
          {body.category}
        </div>

        {/* 标签页 */}
        <div className="mb-4 flex border-b border-line/70">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3 pb-2 pt-1 text-[12px] tracking-wider transition-colors duration-200 ${
                tab === t.id ? "text-snow" : "text-fog hover:text-mist"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5" style={{ background: body.color, boxShadow: `0 0 8px ${body.glow}` }} />
              )}
            </button>
          ))}
        </div>

        {/* ── 核心数据 ── */}
        {tab === "core" && (
          <div>
            <div className="grid grid-cols-2 gap-1.5">
              <Cell label="直径 SIZE" value={body.diameterLabel} />
              <Cell label="距太阳 DISTANCE" value={body.distanceLabel} sub={body.distanceAU} />
              <Cell label="公转周期 ORBIT" value={body.orbitPeriodLabel} />
              <Cell label="自转周期 SPIN" value={body.rotationLabel} />
              <Cell label="质量 MASS" value={body.massLabel} />
              <Cell label="表面重力 GRAVITY" value={body.gravityLabel} />
              <Cell label="轴倾角 AXIAL TILT" value={body.tiltLabel} />
              <Cell label="光照时延 LIGHT" value={body.lightLabel} />
              <Cell label="已知卫星 MOONS" value={body.moons === null ? "—" : `${body.moons} 颗`} />
              <Cell label="轨道速度 VELOCITY" value={body.velocityLabel} />
            </div>
            <div className="mt-1.5">
              <Cell label="温度 TEMPERATURE" value={body.tempLabel} />
            </div>

            {/* 与地球对比 */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-[10.5px] tracking-widest text-fog">
                <span>直径 · 以地球为 1</span>
                <span className="font-numeric text-[12.5px] text-snow">
                  {ratio >= 1 ? `${ratio.toFixed(ratio >= 10 ? 1 : 2)} 倍` : `${ratio.toFixed(2)} 倍`}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line/60">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${body.colorDeep}, ${body.color})`,
                    boxShadow: `0 0 10px ${body.glow}`,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between font-numeric text-[9.5px] text-fog/70">
                <span>地球 1.0</span>
                <span>木星 11.2</span>
              </div>
            </div>
          </div>
        )}

        {/* ── 深空档案 ── */}
        {tab === "deep" && (
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 text-[9.5px] tracking-[0.18em] text-fog">大气成分（体积占比 · 约数）</div>
              <div className="flex h-3.5 w-full overflow-hidden rounded-sm border border-line/50 bg-ink/50">
                {body.atmo.map((a) => (
                  <span
                    key={a.gas}
                    title={`${a.gas} ${a.pct}%`}
                    className="h-full"
                    style={{ width: `${Math.max(a.pct, 2)}%`, background: GAS_COLORS[a.gas] ?? "#8b98ab", opacity: 0.85 }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {body.atmo.map((a) => (
                  <span key={a.gas} className="flex items-center gap-1 font-numeric text-[10px] text-mist">
                    <span className="inline-block h-2 w-2 rounded-sm" style={{ background: GAS_COLORS[a.gas] ?? "#8b98ab" }} />
                    {a.gas} {a.pct}%
                  </span>
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-fog">{body.atmoNote}</div>
            </div>

            <div>
              <div className="text-[9.5px] tracking-[0.18em] text-fog">著名卫星</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-mist">{body.moonsLabel}</div>
            </div>

            <div>
              <div className="text-[9.5px] tracking-[0.18em] text-fog">代表探测任务</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-mist">{body.missionLabel}</div>
            </div>

            <div>
              <div className="text-[9.5px] tracking-[0.18em] text-fog">观测 · 发现史</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-mist">{body.discoveryLabel}</div>
            </div>
          </div>
        )}

        {/* ── 冷知识 ── */}
        {tab === "notes" && (
          <div>
            <div className="border-l-2 pl-3" style={{ borderColor: body.color }}>
              <div className="text-[9.5px] tracking-[0.2em] text-fog">档案备注 · NOTE</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mist">{body.fact}</p>
            </div>
            <ul className="mt-4 space-y-2.5">
              {body.facts.map((f) => (
                <li key={f} className="flex gap-2.5 text-[12.5px] leading-relaxed text-fog">
                  <svg width="7" height="7" viewBox="0 0 8 8" className="mt-[7px] shrink-0" aria-hidden="true">
                    <path d="M4 0l1.1 2.9L8 4 5.1 5.1 4 8 2.9 5.1 0 4l2.9-1.1z" fill={body.color} />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {footer && <div className="mt-5 border-t border-line/80 pt-4">{footer}</div>}
      </div>
    </div>
  );
}
