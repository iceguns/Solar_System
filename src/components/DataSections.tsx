import { PLANETS, SUN } from "../data/planets";
import type { CelestialBody } from "../data/planets";
import { useRevealObserver } from "../hooks/useReducedMotion";

function SectionHead({ index, en, title, note }: { index: string; en: string; title: string; note: string }) {
  return (
    <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
          <span className="text-solar">{index}</span>
          <span className="h-px w-10 bg-line" />
          <span>{en}</span>
        </div>
        <h2 className="mt-3 font-display text-3xl tracking-wide text-snow sm:text-4xl">{title}</h2>
      </div>
      <p className="max-w-xs text-xs leading-relaxed text-fog">{note}</p>
    </div>
  );
}

interface DataSectionsProps {
  onSelect: (id: string) => void;
}

export default function DataSections({ onSelect }: DataSectionsProps) {
  const setRef = useRevealObserver<HTMLDivElement>();

  const notes = [
    {
      tag: "时间",
      title: "金星的一天，比它的一年还长",
      text: "金星自转一圈需要 243 个地球日，而绕太阳一圈只要 225 天。加上它是逆向自转——在金星上，太阳从西边升起。",
      color: "#f3d9a4",
      span: "md:col-span-5",
      offset: "",
    },
    {
      tag: "发现",
      title: "先被算出来，才被看见",
      text: "海王星是唯一先由数学预测位置、后被望远镜证实的行星。1846 年发现它的人类，直到 2011 年才见证它走完被发现后的第一整圈。",
      color: "#7ea6ff",
      span: "md:col-span-4",
      offset: "md:mt-10",
    },
    {
      tag: "分类",
      title: "冥王星为什么「出局」",
      text: "2006 年国际天文学联合会为行星增设门槛：必须清空自己轨道附近的天体。冥王星未能达标，被重新归类为矮行星。",
      color: "#b9c3d4",
      span: "md:col-span-3",
      offset: "md:mt-20",
    },
    {
      tag: "质量",
      title: "99.86% 的绝对统治者",
      text: "太阳占据了太阳系总质量的 99.86%。八大行星、所有卫星、彗星与小行星加起来，只分享剩下的 0.14%。",
      color: "#ffc46b",
      span: "md:col-span-4 md:col-start-4",
      offset: "md:-mt-6",
    },
  ];

  return (
    <div ref={setRef} className="relative z-10 mx-auto max-w-6xl px-5 pb-16 md:px-8">
      {/* ─────────── 01 行星档案 ─────────── */}
      <section className="pt-8">
        <SectionHead
          index="01"
          en="Data Registry"
          title="行星档案总览"
          note="点击任意一行，可返回观测台定位该行星。数据参考 NASA 行星事实表。"
        />
        <div className="reveal hud-panel overflow-x-auto" style={{ "--rv-delay": "0.08s", "--corner-c": "#6ee7d8" } as React.CSSProperties}>
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line font-numeric text-[10px] uppercase tracking-[0.22em] text-fog">
                <th className="px-5 py-3.5 font-medium">天体</th>
                <th className="px-4 py-3.5 font-medium">直径</th>
                <th className="px-4 py-3.5 font-medium">距太阳</th>
                <th className="px-4 py-3.5 font-medium">公转周期</th>
                <th className="px-4 py-3.5 font-medium">自转周期</th>
                <th className="px-4 py-3.5 font-medium">卫星</th>
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
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{ background: `linear-gradient(135deg, ${p.color}, ${p.colorDeep})`, boxShadow: `0 0 8px ${p.glow}` }}
                      />
                      <div>
                        <div className="text-sm font-medium text-snow">{p.name}</div>
                        <div className="font-numeric text-[10px] uppercase tracking-widest text-fog">{p.en}</div>
                      </div>
                      {!p.rocky && (
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
                  <td className="px-4 py-3.5 font-numeric text-sm text-mist">{p.moons} 颗</td>
                  <td className="px-5 py-3.5 font-numeric text-xs leading-relaxed text-fog">{p.tempLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────── 02 尺度对照 ─────────── */}
      <section className="pt-24">
        <SectionHead
          index="02"
          en="Scale Comparison"
          title="把行星排成一排"
          note="圆的大小按直径的平方根映射，否则水星将只剩一个像素。太阳（地球的 109 倍）没有画进来——它会占满整块屏幕。"
        />
        <div className="reveal hud-panel px-6 pb-8 pt-10 sm:px-10" style={{ "--rv-delay": "0.08s", "--corner-c": "#ffc46b" } as React.CSSProperties}>
          <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-8 sm:gap-x-9">
            {[SUN, ...PLANETS].map((p) => {
              const rPx =
                p.id === "sun"
                  ? 96
                  : 7 + Math.sqrt(p.diameterKm / 142984) * 74;
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
                    <div className="text-sm font-medium text-snow transition-colors duration-200 group-hover:text-solar">
                      {p.name}
                    </div>
                    <div className="font-numeric text-[10px] text-fog">
                      {p.id === "sun" ? "Ø 139.27万 km · 示意" : p.diameterLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── 03 观测员手记 ─────────── */}
      <section className="pt-24">
        <SectionHead
          index="03"
          en="Field Notes"
          title="观测员手记"
          note="四条值得记住的冷知识——课堂提问时通常用得上。"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {notes.map((n, i) => (
            <article
              key={n.title}
              className={`reveal hud-panel group p-6 transition-transform duration-500 hover:-translate-y-1.5 ${n.span} ${n.offset}`}
              style={{ "--rv-delay": `${i * 0.1}s`, "--corner-c": n.color } as React.CSSProperties}
            >
              <div
                className="inline-block border px-2 py-0.5 font-numeric text-[10px] uppercase tracking-[0.22em]"
                style={{ borderColor: `${n.color}55`, color: n.color }}
              >
                {n.tag}
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug tracking-wide text-snow">{n.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-fog transition-colors duration-300 group-hover:text-mist">
                {n.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────── 页脚 ─────────── */}
      <footer className="mt-24 border-t border-line/70 pb-4 pt-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-lg tracking-wide text-snow">太阳系轨道观测台</div>
            <div className="mt-1 font-numeric text-[10px] uppercase tracking-[0.28em] text-fog">
              Solar System Orrery · Interactive Demo
            </div>
          </div>
          <div className="max-w-md text-[11px] leading-relaxed text-fog/80">
            教学说明：为保证每颗行星的运动都清晰可见，演示中的公转周期按 T^0.45
            指数压缩，行星的相对快慢顺序与真实一致，但并非真实时间比例。天体数据参考 NASA Planetary Fact Sheet。
          </div>
        </div>
      </footer>
    </div>
  );
}
