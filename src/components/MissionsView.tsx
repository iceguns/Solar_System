import { MISSIONS } from "../data/extras";
import { useRevealObserver } from "../hooks/useReducedMotion";

interface Props {
  onOpenMission: (id: string) => void;
}

const STATS = [
  { v: "13", l: "里程碑任务" },
  { v: "1962–2023", l: "行星大航海时代" },
  { v: "6+", l: "航天机构参与" },
  { v: "2", l: "已进入星际空间" },
];

export default function MissionsView({ onOpenMission }: Props) {
  const setRef = useRevealObserver<HTMLDivElement>();

  return (
    <div ref={setRef} className="relative z-10 mx-auto max-w-6xl px-5 pb-20 md:px-8">
      {/* 视图导言 */}
      <header className="reveal flex flex-wrap items-end justify-between gap-5 pb-9 pt-9">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
            <span className="text-solar">03</span>
            <span className="h-px w-10 bg-line" />
            <span>Age of Exploration</span>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-wide text-snow sm:text-[40px] sm:leading-tight">
            探测纪元 · 六十年行星大航海
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-fog">
            从 1962 年第一次行星飞掠，到今天仍在星际空间飞行的旅行者号——人类用 13 次里程碑任务丈量了整个太阳系。
            <span className="text-mist">点击任意任务卡片</span>，打开含任务场景图与关键成就的完整档案。
          </p>
        </div>
        <div className="reveal flex flex-wrap gap-2" style={{ "--rv-delay": "0.1s" } as React.CSSProperties}>
          {STATS.map((s) => (
            <div key={s.l} className="hud-panel min-w-[118px] px-3.5 py-2.5" style={{ "--corner-c": "#f59b23" } as React.CSSProperties}>
              <div className="font-numeric text-lg leading-none text-solar">{s.v}</div>
              <div className="mt-1.5 text-[9px] tracking-[0.18em] text-fog">{s.l}</div>
            </div>
          ))}
        </div>
      </header>

      {/* 任务卡片网格 */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onOpenMission(m.id)}
            className="reveal hud-panel group overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-solar/70"
            style={{ "--rv-delay": `${Math.min(i * 0.05, 0.4)}s`, "--corner-c": "#f59b23" } as React.CSSProperties}
            aria-label={`打开${m.cn}任务档案`}
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={m.image}
                alt={m.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] via-transparent to-transparent opacity-80" aria-hidden="true" />
              <span className="absolute left-3 top-3 border border-solar/60 bg-[#0a1120]/85 px-2 py-0.5 font-numeric text-[13px] font-semibold tracking-widest text-solar">
                {m.year}
              </span>
              <span className="absolute right-3 top-3 border border-line bg-[#0a1120]/85 px-2 py-0.5 font-numeric text-[9px] uppercase tracking-[0.16em] text-mist">
                {m.agencyShort}
              </span>
              <span className="absolute bottom-3 left-3 border border-hud/40 bg-[#0a1120]/85 px-2 py-0.5 text-[10px] tracking-widest text-hud">
                ◎ {m.target}
              </span>
            </div>
            <div className="p-5">
              <div className="font-display text-lg tracking-wide text-snow">{m.cn}</div>
              <div className="mt-0.5 font-numeric text-[9.5px] uppercase tracking-[0.22em] text-fog">{m.en}</div>
              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-fog transition-colors duration-300 group-hover:text-mist">
                {m.note}
              </p>
              <div className="mt-3.5 flex items-center justify-between border-t border-line/60 pt-3">
                <span className="font-numeric text-[9.5px] text-fog/70">{m.status}</span>
                <span className="flex items-center gap-1 text-[11px] tracking-widest text-solar opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                  打开档案
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="m4.5 1.5 4.5 4.5-4.5 4.5" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="reveal mt-6 text-right font-numeric text-[10px] tracking-wider text-fog/60" style={{ "--rv-delay": "0.15s" } as React.CSSProperties}>
        卡片配图根据任务场景进行艺术渲染 · 非原始照片档案
      </p>
    </div>
  );
}
