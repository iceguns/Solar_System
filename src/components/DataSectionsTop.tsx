import { ALL_BODIES, PLANETS, SUN, LIGHT_MINUTES } from "../data/planets";
import { CLASSIFICATIONS, MASS_SHARES, GAS_COLORS } from "../data/extras";
import SectionHead from "./SectionHead";
import { useRevealObserver } from "../hooks/useReducedMotion";

interface Props {
  onSelect: (id: string) => void;
}

const bodyByName = new Map(ALL_BODIES.map((b) => [b.name, b]));
const ALL_GASES = Array.from(new Set(ALL_BODIES.flatMap((b) => b.atmo.map((a) => a.gas))));

export default function DataSectionsTop({ onSelect }: Props) {
  const setRef = useRevealObserver<HTMLDivElement>();

  return (
    <div ref={setRef} className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
      {/* ─────────── 01 行星档案总览 ─────────── */}
      <section className="pt-8">
        <SectionHead
          index="01"
          en="Data Registry"
          title="行星档案总览"
          note="九大轨道天体的关键参数，点击任意一行可返回观测台定位。数据参考 NASA 行星事实表。"
        />
        <div className="reveal hud-panel overflow-x-auto" style={{ "--rv-delay": "0.08s", "--corner-c": "#6ee7d8" } as React.CSSProperties}>
          <table className="w-full min-w-[1020px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line font-numeric text-[10px] uppercase tracking-[0.22em] text-fog">
                <th className="px-5 py-3.5 font-medium">天体</th>
                <th className="px-4 py-3.5 font-medium">直径</th>
                <th className="px-4 py-3.5 font-medium">距太阳</th>
                <th className="px-4 py-3.5 font-medium">公转周期</th>
                <th className="px-4 py-3.5 font-medium">自转周期</th>
                <th className="px-4 py-3.5 font-medium">质量</th>
                <th className="px-4 py-3.5 font-medium">表面重力</th>
                <th className="px-4 py-3.5 font-medium">卫星</th>
                <th className="px-4 py-3.5 font-medium">光照时延</th>
                <th className="px-5 py-3.5 font-medium">温度</th>
              </tr>
            </thead>
            <tbody>
              {PLANETS.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelect(p.id);
                  }}
                  className="group cursor-pointer border-b border-line/60 transition-colors duration-200 last:border-0 hover:bg-snow/[0.035] focus-visible:bg-snow/[0.035]"
                  style={{ transitionDelay: `${i * 15}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{ background: `linear-gradient(135deg, ${p.color}, ${p.colorDeep})`, boxShadow: `0 0 8px ${p.glow}` }}
                      />
                      <div>
                        <div className="text-sm font-medium text-snow">
                          {p.name}
                          {p.id === "pluto" && (
                            <span className="ml-2 border border-line px-1.5 py-0.5 text-[9px] tracking-widest text-fog">矮行星</span>
                          )}
                        </div>
                        <div className="font-numeric text-[10px] uppercase tracking-widest text-fog">{p.en}</div>
                      </div>
                      {!p.rocky && p.id !== "pluto" && (
                        <span className="ml-1 hidden border border-line px-1.5 py-0.5 text-[9px] tracking-widest text-fog lg:inline">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.diameterLabel}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-numeric text-sm text-mist">{p.distanceLabel}</div>
                    <div className="font-numeric text-[10px] text-fog">{p.distanceAU}</div>
                  </td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.orbitPeriodLabel}</td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.rotationLabel}</td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.massLabel}</td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.gravityLabel}</td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.moons} 颗</td>
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.lightLabel}</td>
                  <td className="px-5 py-3.5 font-numeric text-xs leading-relaxed text-fog">{p.tempLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────── 02 分类与质量账本 ─────────── */}
      <section className="pt-24">
        <SectionHead
          index="02"
          en="Taxonomy & Mass Ledger"
          title="家族谱系与质量账本"
          note="行星按组成分为三族，另有 2006 年新设的矮行星。至于质量——太阳一个人就几乎包圆了。"
        />

        {/* 太阳的质量横幅 */}
        <div className="reveal hud-panel px-6 py-6 sm:px-8" style={{ "--rv-delay": "0.05s", "--corner-c": "#ffc46b" } as React.CSSProperties}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-display text-xl tracking-wide text-snow">
              太阳系总质量 <span className="font-numeric text-solar">100%</span>
            </div>
            <div className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">Mass Distribution</div>
          </div>
          <div className="mt-4 flex h-9 w-full overflow-hidden border border-line/60">
            <div
              className="group relative flex h-full items-center overflow-hidden pl-3 transition-transform duration-300 hover:brightness-110"
              style={{ width: "99.86%", background: "linear-gradient(90deg, #ff8f1f, #ffd166)" }}
            >
              <span className="font-numeric text-[11px] font-semibold tracking-wider text-[#3a2405]">太阳 99.86%</span>
            </div>
            <div className="flex h-full items-center bg-line/70 pl-1.5">
              <span className="font-numeric text-[10px] text-mist">0.14%</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-fog">
            八大行星、数百颗卫星、所有彗星与小行星加在一起，只分得 <span className="text-mist">0.14%</span>。下面把这 0.14% 放大来看——
          </p>
          <div className="mt-4">
            <div className="mb-2 font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">0.14% 放大图 · 行星之间怎么分</div>
            <div className="flex h-7 w-full overflow-hidden border border-line/60 bg-ink/40">
              {MASS_SHARES.map((m) => (
                <div
                  key={m.name}
                  title={`${m.name} 占行星总质量 ${m.pct}%`}
                  className="group relative h-full transition-[filter] duration-200 hover:brightness-125"
                  style={{ width: `${Math.max(m.pct, 0.35)}%`, background: m.color, opacity: 0.85 }}
                />
              ))}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
              {MASS_SHARES.map((m) => (
                <div key={m.name} className="flex items-center gap-2 font-numeric text-[11px] text-fog">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: m.color }} />
                  <span className="text-mist">{m.name}</span>
                  <span>{m.pct < 1 ? `<1%` : `${m.pct}%`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 分类行 */}
        <div className="mt-6 space-y-4">
          {CLASSIFICATIONS.map((c, ci) => (
            <div
              key={c.name}
              className="reveal hud-panel group relative overflow-hidden p-5 pl-6 transition-transform duration-500 hover:-translate-y-1 sm:p-6 sm:pl-7"
              style={{ "--rv-delay": `${ci * 0.08}s`, "--corner-c": c.color } as React.CSSProperties}
            >
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: `linear-gradient(180deg, ${c.color}, transparent)` }} />
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="md:w-56 md:shrink-0">
                  <h3 className="font-display text-2xl tracking-wide text-snow">{c.name}</h3>
                  <div className="mt-1 font-numeric text-[10px] uppercase tracking-[0.26em]" style={{ color: c.color }}>
                    {c.en}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {c.members.map((m) => {
                      const body = bodyByName.get(m);
                      return body ? (
                        <button
                          key={m}
                          onClick={() => onSelect(body.id)}
                          className="flex items-center gap-1.5 border border-line bg-ink/40 px-2.5 py-1 text-xs text-mist transition-all duration-200 hover:-translate-y-0.5 hover:text-snow"
                          style={{ boxShadow: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${body.color}88`)}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                        >
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: `linear-gradient(135deg, ${body.color}, ${body.colorDeep})` }} />
                          {m}
                        </button>
                      ) : (
                        <span key={m} className="flex items-center gap-1.5 border border-line bg-ink/40 px-2.5 py-1 text-xs text-fog">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: c.color, opacity: 0.7 }} />
                          {m}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-3 max-w-xl text-xs leading-relaxed text-fog">{c.desc}</p>
                </div>
                <div
                  className="shrink-0 border px-3 py-2 font-numeric text-[11px] tracking-wider md:w-44 md:text-center"
                  style={{ borderColor: `${c.color}44`, color: c.color }}
                >
                  {c.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── 03 大气成分光谱 ─────────── */}
      <section className="pt-24">
        <SectionHead
          index="03"
          en="Atmospheric Survey"
          title="大气成分光谱"
          note="同样是行星，呼吸的东西天差地别：类地行星多二氧化碳与氮，巨行星几乎全是氢和氦。"
        />
        <div className="reveal hud-panel px-6 py-6 sm:px-8" style={{ "--rv-delay": "0.06s", "--corner-c": "#9fe8f2" } as React.CSSProperties}>
          {/* 图例 */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/60 pb-4">
            <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">图例</span>
            {ALL_GASES.map((g) => (
              <span key={g} className="flex items-center gap-1.5 font-numeric text-[11px] text-mist">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: GAS_COLORS[g] ?? "#8b98ab" }} />
                {g}
              </span>
            ))}
          </div>
          <div className="space-y-3.5">
            {ALL_BODIES.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className="group block w-full text-left"
                aria-label={`查看${b.name}档案`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-right text-xs text-fog transition-colors duration-200 group-hover:text-snow">
                    {b.name}
                  </span>
                  <span className="flex h-4 flex-1 overflow-hidden rounded-sm border border-line/40 bg-ink/50">
                    {b.atmo.map((a) => (
                      <span
                        key={a.gas}
                        className="h-full transition-[filter] duration-200 group-hover:brightness-110"
                        style={{ width: `${Math.max(a.pct, 2)}%`, background: GAS_COLORS[a.gas] ?? "#8b98ab", opacity: 0.82 }}
                        title={`${a.gas} ${a.pct}%`}
                      />
                    ))}
                  </span>
                  <span className="hidden w-64 shrink-0 truncate font-numeric text-[10px] text-fog/70 sm:block">
                    {b.atmoNote}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 04 尺度与光的旅行 ─────────── */}
      <section className="pt-24">
        <SectionHead
          index="04"
          en="Scale & Light Travel"
          title="把行星排成一排，再让光跑一趟"
          note="圆的大小按直径的平方根映射，否则水星只剩一个像素；太阳（地球的 109 倍）仅作示意。下方是阳光跑到每颗行星所需的时间。"
        />
        <div className="reveal hud-panel px-6 pb-8 pt-10 sm:px-10" style={{ "--rv-delay": "0.06s", "--corner-c": "#ffc46b" } as React.CSSProperties}>
          <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-8 sm:gap-x-8">
            {[SUN, ...PLANETS].map((p) => {
              const rPx = p.id === "sun" ? 96 : 7 + Math.sqrt(p.diameterKm / 142984) * 74;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="group flex flex-col items-center gap-3 focus:outline-none"
                  aria-label={`查看${p.name}`}
                >
                  <div className="flex h-[205px] items-end">
                    <div
                      className="rounded-full transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      style={{
                        width: rPx * 2,
                        height: rPx * 2,
                        background: `radial-gradient(circle at 35% 30%, ${p.color}, ${p.colorDeep})`,
                        boxShadow: `0 0 ${rPx / 2.5}px ${p.glow}, inset -${rPx / 6}px -${rPx / 8}px ${rPx / 3}px rgba(0,0,0,0.35)`,
                        opacity: p.id === "sun" ? 0.9 : 1,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-snow transition-colors duration-200 group-hover:text-solar">{p.name}</div>
                    <div className="font-numeric text-[10px] text-fog">
                      {p.id === "sun" ? "Ø 139.27万 km · 示意" : p.diameterLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 光的旅行 */}
        <div className="reveal hud-panel mt-6 px-6 py-6 sm:px-8" style={{ "--rv-delay": "0.12s", "--corner-c": "#8fb4e8" } as React.CSSProperties}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-xl tracking-wide text-snow">光的旅行 · 从太阳出发</h3>
            <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">c = 299,792 km/s</span>
          </div>
          <div className="mt-5 space-y-2.5">
            {LIGHT_MINUTES.map((l, i) => {
              const body = bodyByName.get(l.name);
              const w = Math.sqrt(l.minutes / 328) * 100;
              return (
                <button key={l.id} onClick={() => onSelect(l.id)} className="group flex w-full items-center gap-3 text-left">
                  <span className="w-16 shrink-0 text-right text-xs text-fog transition-colors duration-200 group-hover:text-snow">
                    {l.name}
                  </span>
                  <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-ink/60">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out group-hover:brightness-125"
                      style={{
                        width: `${w}%`,
                        background: `linear-gradient(90deg, rgba(255,196,107,0.25), ${body?.color ?? "#8fb4e8"})`,
                        boxShadow: `0 0 8px ${body?.glow ?? "transparent"}`,
                        transitionDelay: `${i * 30}ms`,
                      }}
                    />
                  </span>
                  <span className="w-24 shrink-0 font-numeric text-[11px] text-mist">{body?.lightLabel ?? ""}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 border-t border-line/60 pt-3 text-xs leading-relaxed text-fog">
            光速每秒约 30 万公里，也要 <span className="text-solar">8 分 20 秒</span> 才能抵达地球——你看到的太阳永远是
            8 分钟前的太阳；而冥王星收到的是 <span className="text-solar">5 个半小时前</span> 出发的光。
          </p>
        </div>
      </section>
    </div>
  );
}
