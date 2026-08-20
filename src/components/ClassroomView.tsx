import { useState } from "react";
import { DEMO_C, KEPLER_ROWS, PLANETS } from "../data/planets";
import { DWARFS, FRONTIERS } from "../data/extras";
import SectionHead from "./SectionHead";
import { useRevealObserver } from "../hooks/useReducedMotion";

interface Props {
  onOpenBody: (id: string) => void;
}

/** 开普勒第三定律实验台 */
function KeplerLab({ onOpenBody }: { onOpenBody: (id: string) => void }) {
  const [a, setA] = useState(2.8);
  const realT = Math.pow(a, 1.5); // 年
  const demoSecs = DEMO_C * Math.pow(365.25 * realT, 0.45);
  const nearest = KEPLER_ROWS.reduce((best, r) =>
    Math.abs(Math.log(a / r.a)) < Math.abs(Math.log(a / best.a)) ? r : best
  );
  const tLabel =
    realT < 2 ? `${(realT * 365.25).toFixed(0)} 天` : realT < 100 ? `${realT.toFixed(1)} 年` : `${realT.toFixed(0)} 年`;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="reveal hud-panel p-6 sm:p-7 lg:col-span-5" style={{ "--rv-delay": "0.06s", "--corner-c": "#ffc46b" } as React.CSSProperties}>
        <div className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">Interactive · 拖一拖试试</div>
        <h3 className="mt-2 font-display text-xl tracking-wide text-snow">如果这里多一颗行星……</h3>
        <p className="mt-2 text-xs leading-relaxed text-fog">
          开普勒第三定律：<span className="font-numeric text-solar">T² = a³</span>（T 以年计，a 以 AU 计）。
          拖动滑杆，把一颗假想行星放到任意轨道半径上，看看它的一年有多长。
        </p>
        <div className="mt-5">
          <div className="flex items-baseline justify-between font-numeric text-[11px] text-fog">
            <span>轨道半径 a</span>
            <span className="text-[15px] text-snow">
              {a.toFixed(2)} <span className="text-xs text-fog">AU</span>
            </span>
          </div>
          <input
            type="range"
            min={0.3}
            max={45}
            step={0.05}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="speed-range mt-3"
            style={{ "--fill": `${((a - 0.3) / 44.7) * 100}%` } as React.CSSProperties}
            aria-label="假想行星轨道半径"
          />
          <div className="mt-1.5 flex justify-between font-numeric text-[10px] text-fog/60">
            <span>0.3 AU（水星内侧）</span>
            <span>45 AU（冥王星外）</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="border border-line/70 bg-ink/40 px-3 py-2.5">
            <div className="text-[10px] tracking-[0.18em] text-fog">真实公转周期</div>
            <div className="mt-1 font-numeric text-lg text-solar">{tLabel}</div>
          </div>
          <div className="border border-line/70 bg-ink/40 px-3 py-2.5">
            <div className="text-[10px] tracking-[0.18em] text-fog">演示中约</div>
            <div className="mt-1 font-numeric text-lg text-hud">{demoSecs.toFixed(1)} 秒/圈</div>
          </div>
        </div>
        <p className="mt-4 border-t border-line/60 pt-3 text-xs text-fog">
          这个位置最接近 <span className="text-mist">{nearest.name}</span>
          （{nearest.a} AU）。试试拖到 39.5 附近——那里住着冥王星。
        </p>
      </div>

      <div className="reveal hud-panel overflow-x-auto lg:col-span-7" style={{ "--rv-delay": "0.12s", "--corner-c": "#6ee7d8" } as React.CSSProperties}>
        <div className="px-6 pt-5">
          <div className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">Verification · 用真实数据验算</div>
        </div>
        <table className="mt-3 w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-numeric text-[10px] uppercase tracking-[0.2em] text-fog">
              <th className="px-6 py-3 font-medium">行星</th>
              <th className="px-4 py-3 font-medium">a（AU）</th>
              <th className="px-4 py-3 font-medium">a³</th>
              <th className="px-4 py-3 font-medium">T（年）</th>
              <th className="px-4 py-3 font-medium">T²</th>
              <th className="px-6 py-3 font-medium">T² / a³</th>
            </tr>
          </thead>
          <tbody>
            {KEPLER_ROWS.map((r, i) => {
              const ratio = (r.T * r.T) / (r.a * r.a * r.a);
              const body = PLANETS.find((p) => p.name === r.name);
              return (
                <tr
                  key={r.name}
                  onClick={() => body && onOpenBody(body.id)}
                  className="cursor-pointer border-b border-line/60 transition-colors duration-200 last:border-0 hover:bg-snow/[0.035]"
                  style={{ transitionDelay: `${i * 15}ms` }}
                >
                  <td className="px-6 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-mist">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: body?.color ?? "#8b98ab" }} />
                      {r.name}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-numeric text-sm text-mist">{r.a.toFixed(3)}</td>
                  <td className="px-4 py-2.5 font-numeric text-sm text-fog">{(r.a ** 3).toFixed(3)}</td>
                  <td className="px-4 py-2.5 font-numeric text-sm text-mist">{r.T.toFixed(3)}</td>
                  <td className="px-4 py-2.5 font-numeric text-sm text-fog">{(r.T ** 2).toFixed(3)}</td>
                  <td className="px-6 py-2.5 font-numeric text-sm font-medium text-solar">{ratio.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="px-6 py-4 text-xs leading-relaxed text-fog">
          八颗行星的 T²/a³ 全部约等于 <span className="text-solar">1.00</span>——这正是 1619 年开普勒从第谷的观测数据里找到的规律，
          后来被牛顿的万有引力定律从理论上证明。本演示把周期按 T^0.45 压缩以便同屏观看，但相对快慢完全遵守这一定律。
        </p>
      </div>
    </div>
  );
}

export default function ClassroomView({ onOpenBody }: Props) {
  const setRef = useRevealObserver<HTMLDivElement>();
  const pluto = PLANETS.find((p) => p.id === "pluto")!;

  const notes = [
    { tag: "时间", title: "金星的一天，比它的一年还长", text: "金星自转一圈需要 243 个地球日，而绕太阳一圈只要 225 天。加上它是逆向自转——在金星上，太阳从西边升起。", color: "#f3d9a4" },
    { tag: "发现", title: "先被算出来，才被看见", text: "海王星是唯一先由数学预测位置、后被望远镜证实的行星。1846 年发现它的人类，直到 2011 年才见证它走完被发现后的第一整圈。", color: "#7ea6ff" },
    { tag: "质量", title: "99.86% 的绝对统治者", text: "太阳占据了太阳系总质量的 99.86%。八大行星、所有卫星、彗星与小行星加起来，只分享剩下的 0.14%。", color: "#ffc46b" },
    { tag: "自转", title: "木星的一天不到 10 小时", text: "木星是转得最快的行星，赤道被甩得明显鼓起。快速自转加上内部热对流，织出了它条条分明的云带。", color: "#f2c49b" },
    { tag: "风暴", title: "海王星刮着超音速风", text: "尽管距离太阳最远、接收的能量最少，海王星的风速却可达 2,100 km/h，远超地球上的任何飓风。", color: "#bfeef2" },
    { tag: "密度", title: "土星能浮在水上", text: "土星的平均密度只有 0.69 g/cm³，比水还低——如果有一个足够大的浴缸，它会浮起来（当然，你找不到那么大的浴缸）。", color: "#f0d9a8" },
    { tag: "奇观", title: "冰巨行星内部可能下钻石雨", text: "天王星与海王星内部的高温高压，可能把甲烷里的碳直接压成钻石，像雨点一样沉向行星核心。", color: "#9fe8f2" },
    { tag: "温度", title: "水星不是最热的行星", text: "离太阳最近的水星最高 427°C，却被金星（约 464°C）反超——失控的温室效应比距离更有话语权。", color: "#ff9a6b" },
  ];

  return (
    <div ref={setRef} className="relative z-10 mx-auto max-w-6xl px-5 pb-20 md:px-8">
      {/* 视图导言 */}
      <header className="reveal flex flex-wrap items-end justify-between gap-4 pb-2 pt-9">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
            <span className="text-solar">04</span>
            <span className="h-px w-10 bg-line" />
            <span>Laws · Frontier · Field Notes</span>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-wide text-snow sm:text-[40px]">探索课堂</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-fog">
            一条管住所有轨道的定律、一片海王星之外的冰原，以及八条课堂内外都用得上的冷知识。
          </p>
        </div>
      </header>

      {/* ─── 开普勒第三定律 ─── */}
      <section className="pt-8">
        <SectionHead dense index="06" en="Kepler's Third Law" title="轨道的节拍器：T² = a³" note="" />
        <KeplerLab onOpenBody={onOpenBody} />
      </section>

      {/* ─── 矮行星与太阳系边疆 ─── */}
      <section className="pt-20">
        <SectionHead
          dense
          index="07"
          en="Dwarfs & Frontier"
          title="矮行星与太阳系边疆"
          note=""
        />
        <div className="grid gap-5 md:grid-cols-12">
          <button
            onClick={() => onOpenBody(pluto.id)}
            className="reveal hud-panel group relative overflow-hidden p-6 text-left transition-transform duration-500 hover:-translate-y-1.5 md:col-span-5"
            style={{ "--rv-delay": "0.05s", "--corner-c": "#e0c9a8" } as React.CSSProperties}
          >
            <div
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full transition-transform duration-700 group-hover:scale-110"
              style={{ background: "radial-gradient(circle at 38% 32%, #e0c9a8, #8a6f4d 78%)", boxShadow: "0 0 40px rgba(224,201,168,0.25)", opacity: 0.85 }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="font-numeric text-[10px] uppercase tracking-[0.26em] text-fog">已加入观测台轨道 · 虚线轨道</div>
              <h3 className="mt-2 font-display text-3xl tracking-wide text-snow">冥王星 Pluto</h3>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-numeric text-[11px] text-fog">
                <span>直径 <span className="text-mist">2,377 km</span></span>
                <span>距日 <span className="text-mist">39.48 AU</span></span>
                <span>公转 <span className="text-mist">248 年</span></span>
                <span>卫星 <span className="text-mist">5 颗</span></span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-fog">
                2006 年被重新归类为矮行星，却在 2015 年凭借新视野号拍下的「心形」氮冰平原，成为全太阳系人气最高的天体之一。
                <span className="ml-1 text-mist transition-colors duration-200 group-hover:text-solar">点击打开档案 →</span>
              </p>
            </div>
          </button>

          <div className="grid gap-5 sm:grid-cols-2 md:col-span-7">
            {DWARFS.map((d, i) => (
              <div
                key={d.cn}
                className="reveal hud-panel group p-5 transition-transform duration-500 hover:-translate-y-1.5"
                style={{ "--rv-delay": `${0.1 + i * 0.07}s`, "--corner-c": d.color } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-8 w-8 rounded-full transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${d.color}, #5a5f6e 85%)` }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-display text-lg tracking-wide text-snow">{d.cn}</div>
                    <div className="font-numeric text-[10px] uppercase tracking-[0.22em] text-fog">{d.en}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-numeric text-[10.5px] text-fog">
                  <span>Ø {d.diameter}</span>
                  <span>{d.au}</span>
                  <span>公转 {d.period}</span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-fog">{d.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal mt-6 grid gap-5 md:grid-cols-3" style={{ "--rv-delay": "0.1s" } as React.CSSProperties}>
          {FRONTIERS.map((f) => (
            <div key={f.cn} className="hud-panel relative overflow-hidden p-5" style={{ "--corner-c": f.color } as React.CSSProperties}>
              <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-display text-xl tracking-wide text-snow">{f.cn}</h4>
                <span className="font-numeric text-[11px]" style={{ color: f.color }}>{f.range}</span>
              </div>
              <div className="mt-0.5 font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">{f.en}</div>
              <p className="mt-2.5 text-xs leading-relaxed text-fog">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 观测员手记 ─── */}
      <section className="pt-20">
        <SectionHead
          dense
          index="08"
          en="Field Notes"
          title="观测员手记"
          note=""
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((n, i) => (
            <article
              key={n.title}
              className="reveal hud-panel group p-5 transition-transform duration-500 hover:-translate-y-1.5"
              style={{ "--rv-delay": `${Math.min(i * 0.05, 0.35)}s`, "--corner-c": n.color } as React.CSSProperties}
            >
              <div
                className="inline-block border px-2 py-0.5 font-numeric text-[9px] uppercase tracking-[0.22em]"
                style={{ borderColor: `${n.color}55`, color: n.color }}
              >
                {n.tag}
              </div>
              <h3 className="mt-3 font-display text-[17px] leading-snug tracking-wide text-snow">{n.title}</h3>
              <p className="mt-2.5 text-xs leading-relaxed text-fog transition-colors duration-300 group-hover:text-mist">
                {n.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
