import { useState } from "react";
import { ALL_BODIES, PLANETS } from "../data/planets";
import type { CelestialBody } from "../data/planets";
import { GAS_COLORS } from "../data/extras";

interface Props {
  body: CelestialBody | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/* ─────────────── 小工具 ─────────────── */

function Cell({ label, value, sub, span }: { label: string; value: string; sub?: string; span?: boolean }) {
  return (
    <div className={`border border-line/60 bg-ink/40 px-2.5 py-2 ${span ? "col-span-2" : ""}`}>
      <div className="text-[9px] tracking-[0.18em] text-fog">{label}</div>
      <div className="mt-0.5 font-numeric text-[13px] font-medium leading-tight text-snow">{value}</div>
      {sub && <div className="font-numeric text-[10px] text-fog">{sub}</div>}
    </div>
  );
}

function GroupTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-[10px] tracking-[0.22em] text-fog">
      <span className="inline-block h-2 w-2" style={{ background: color }} />
      {children}
    </div>
  );
}

/* ─────────────── 系统总览（未选中时） ─────────────── */

function Overview({ onSelect }: { onSelect: (id: string) => void }) {
  const moonTotal = PLANETS.reduce((s, p) => s + (p.moons ?? 0), 0);
  const tiles = [
    { k: "恒星", v: "1", c: "#ffc46b" },
    { k: "行星", v: "8", c: "#6ee7d8" },
    { k: "矮行星", v: "1", c: "#c9b8a8" },
    { k: "已知卫星", v: `${moonTotal}`, c: "#8fb4e8" },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-line/80 px-4 pb-3 pt-4">
        <div className="flex items-center gap-2 font-numeric text-[10px] uppercase tracking-[0.28em] text-fog">
          <span className="blink-dot inline-block h-1.5 w-1.5 rounded-full bg-hud" />
          System Overview
        </div>
        <h2 className="mt-1.5 font-display text-[22px] leading-tight tracking-wide text-snow">系统总览</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-fog">
          点击左侧轨道上的任意天体，或从下方索引中开启完整档案。
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3.5">
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((t) => (
            <div key={t.k} className="border border-line/60 bg-ink/40 px-1 py-2 text-center">
              <div className="font-numeric text-[16px] font-semibold" style={{ color: t.c }}>
                {t.v}
              </div>
              <div className="mt-0.5 text-[9px] tracking-wider text-fog">{t.k}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <GroupTitle color="#6ee7d8">天体索引 · INDEX</GroupTitle>
          <span className="font-numeric text-[9px] uppercase tracking-widest text-fog/60">按轨道次序</span>
        </div>
        <div className="space-y-1">
          {ALL_BODIES.map((b, i) => (
            <button
              key={b.id}
              onClick={() => onSelect(b.id)}
              className="group block w-full border border-transparent bg-ink/30 px-2.5 py-1.5 text-left transition-all duration-200 hover:border-line hover:bg-snow/[0.04]"
              style={{ transitionDelay: `${i * 12}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ background: `linear-gradient(135deg, ${b.color}, ${b.colorDeep})`, boxShadow: `0 0 7px ${b.glow}` }}
                />
                <span className="text-[13px] text-mist transition-colors duration-200 group-hover:text-snow">{b.name}</span>
                <span className="font-numeric text-[9px] uppercase tracking-widest text-fog/60">{b.en}</span>
                <span className="ml-auto font-numeric text-[10.5px] text-fog">
                  {b.id === "sun" ? "系统中心" : b.orbitPeriodLabel}
                </span>
              </div>
              <div className="ml-5 mt-1.5 flex items-center gap-2">
                <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line/50">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full opacity-70 transition-all duration-500 group-hover:opacity-100"
                    style={{
                      width: b.id === "sun" ? "3%" : `${Math.sqrt(parseFloat(b.distanceAU) / 40) * 100}%`,
                      background: `linear-gradient(90deg, ${b.colorDeep}, ${b.color})`,
                    }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right font-numeric text-[9px] text-fog/70">{b.distanceAU}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 border border-dashed border-line/70 px-3 py-2.5 text-[10.5px] leading-relaxed text-fog">
          <span className="text-hud">键盘提示</span> · 空格 = 播放 / 暂停 · ← → = 切换天体
        </div>
      </div>
    </div>
  );
}

/* ─────────────── 标签式天体档案 ─────────────── */

const TABS = [
  { id: "data", label: "核心数据" },
  { id: "archive", label: "深空档案" },
  { id: "facts", label: "冷知识" },
] as const;

function Dossier({ body, onClose, onNavigate }: { body: CelestialBody; onClose: () => void; onNavigate: (id: string) => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("data");
  const idx = ALL_BODIES.findIndex((b) => b.id === body.id);
  const prev = ALL_BODIES[(idx + ALL_BODIES.length - 1) % ALL_BODIES.length];
  const next = ALL_BODIES[(idx + 1) % ALL_BODIES.length];
  const ratio = body.earthRatio;
  const barWidth = Math.min(Math.max((ratio / 109.2) * 100, 2), 100);
  const gases = Array.from(new Set(body.atmo.map((a) => a.gas)));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center gap-3 border-b border-line/80 px-4 pb-3 pt-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg"
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
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-[24px] leading-none tracking-wide text-snow">{body.name}</h2>
            <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-fog">{body.en}</span>
          </div>
          <div
            className="mt-1.5 inline-block border px-1.5 py-0.5 text-[9.5px] tracking-widest"
            style={{ borderColor: `${body.color}55`, color: body.color, background: `${body.color}12` }}
          >
            {body.category}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭档案，返回系统总览"
          className="ml-auto -mr-1 flex h-7 w-7 shrink-0 items-center justify-center border border-transparent text-fog transition-colors duration-200 hover:border-line hover:text-snow"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
          </svg>
        </button>
      </div>

      {/* 标签页 */}
      <div role="tablist" aria-label="档案分页" className="flex border-b border-line/80 px-4">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-2.5 text-xs tracking-wider transition-colors duration-200 ${
                active ? "text-snow" : "text-fog hover:text-mist"
              }`}
            >
              {t.label}
              <span
                className="absolute inset-x-2 bottom-0 h-[2px] transition-all duration-300"
                style={{ background: active ? body.color : "transparent", boxShadow: active ? `0 0 8px ${body.glow}` : "none" }}
              />
            </button>
          );
        })}
        <span className="ml-auto self-center font-numeric text-[9px] uppercase tracking-widest text-fog/50">
          {idx + 1}/{ALL_BODIES.length}
        </span>
      </div>

      {/* 内容区 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {tab === "data" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1.5">
              <Cell label="直径" value={body.diameterLabel} />
              <Cell label="质量" value={body.massLabel} />
              <Cell label="表面重力" value={body.gravityLabel} />
              <Cell label="距太阳" value={body.distanceLabel} sub={body.distanceAU} />
              <Cell label="公转周期" value={body.orbitPeriodLabel} />
              <Cell label="自转周期" value={body.rotationLabel} />
              <Cell label="已知卫星" value={body.moons === null ? "—" : `${body.moons} 颗`} />
              <Cell label="轨道速度" value={body.velocityLabel} />
              <Cell label="轴倾角" value={body.tiltLabel} />
              <Cell label="表面 / 云顶温度" value={body.tempLabel} span />
              <Cell label="光照时延" value={body.lightLabel} />
            </div>

            {/* 直径对比 */}
            <div>
              <div className="flex items-baseline justify-between text-[10px] tracking-widest text-fog">
                <span>直径 · 以地球为 1</span>
                <span className="font-numeric text-[12px] text-snow">
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
              <div className="mt-1 flex justify-between font-numeric text-[9px] text-fog/60">
                <span>地球 1.0</span>
                <span>对数刻度 · 太阳 109</span>
              </div>
            </div>

            {/* 大气速览 */}
            <div>
              <GroupTitle color={body.color}>大气成分</GroupTitle>
              <div className="flex h-3 w-full overflow-hidden rounded-sm border border-line/40 bg-ink/50">
                {body.atmo.map((a) => (
                  <span
                    key={a.gas}
                    title={`${a.gas} ${a.pct}%`}
                    className="h-full"
                    style={{ width: `${Math.max(a.pct, 2)}%`, background: GAS_COLORS[a.gas] ?? "#8b98ab", opacity: 0.85 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {gases.map((g) => (
                  <span key={g} className="flex items-center gap-1 font-numeric text-[9.5px] text-fog">
                    <span className="inline-block h-1.5 w-1.5 rounded-sm" style={{ background: GAS_COLORS[g] ?? "#8b98ab" }} />
                    {g}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-fog">{body.atmoNote}</p>
            </div>
          </div>
        )}

        {tab === "archive" && (
          <div className="space-y-5">
            <div>
              <GroupTitle color={body.color}>探测任务 · MISSIONS</GroupTitle>
              <div className="border border-line/60 bg-ink/30 px-2.5 py-2 text-[11.5px] leading-relaxed text-mist transition-colors duration-200 hover:border-line">
                {body.missionLabel}
              </div>
            </div>
            <div>
              <GroupTitle color={body.color}>著名卫星 · MOONS</GroupTitle>
              <div className="border border-line/60 bg-ink/30 px-2.5 py-2 text-[11.5px] leading-relaxed text-mist transition-colors duration-200 hover:border-line">
                {body.moonsLabel}
              </div>
            </div>
            <div>
              <GroupTitle color={body.color}>观测发现 · DISCOVERY</GroupTitle>
              <p className="text-[11.5px] leading-relaxed text-mist">{body.discoveryLabel}</p>
            </div>
          </div>
        )}

        {tab === "facts" && (
          <div className="space-y-3.5">
            <div className="border-l-2 py-0.5 pl-3" style={{ borderColor: body.color }}>
              <div className="text-[9px] tracking-[0.22em] text-fog">档案主备注</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-snow/90">{body.fact}</p>
            </div>
            {body.facts.map((f, i) => (
              <div key={i} className="flex gap-3 border border-line/60 bg-ink/30 px-3 py-2.5 transition-colors duration-200 hover:border-line">
                <span className="font-numeric text-[11px] font-semibold" style={{ color: body.color }}>
                  0{i + 1}
                </span>
                <p className="text-[11.5px] leading-relaxed text-mist">{f}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上一颗 / 下一颗 */}
      <div className="flex items-center justify-between border-t border-line/80 px-4 py-3">
        <button
          onClick={() => onNavigate(prev.id)}
          className="group flex items-center gap-1.5 text-xs text-fog transition-colors duration-200 hover:text-snow"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true">
            <path d="M7.5 1.5 3 6l4.5 4.5" />
          </svg>
          {prev.name}
        </button>
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
  );
}

/* ─────────────── 容器 ─────────────── */

export default function ProfileColumn({ body, onSelect, onClose }: Props) {
  return (
    <div
      key={body ? body.id : "overview"}
      className="hud-panel info-panel-enter h-full min-h-0 overflow-hidden"
      style={{ "--corner-c": body?.color ?? "#6ee7d8" } as React.CSSProperties}
      role="complementary"
      aria-label={body ? `${body.name}档案` : "系统总览"}
    >
      {body ? <Dossier body={body} onClose={onClose} onNavigate={onSelect} /> : <Overview onSelect={onSelect} />}
    </div>
  );
}
