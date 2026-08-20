export type ViewId = "orrery" | "registry" | "missions" | "classroom";

export const TABS: { id: ViewId; idx: string; label: string; en: string }[] = [
  { id: "orrery", idx: "01", label: "轨道观测台", en: "Orrery" },
  { id: "registry", idx: "02", label: "行星档案", en: "Registry" },
  { id: "missions", idx: "03", label: "探测纪元", en: "Missions" },
  { id: "classroom", idx: "04", label: "探索课堂", en: "Classroom" },
];

interface Props {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
}

/** 顶层导航：品牌 + 视图切换 */
export default function TopNav({ view, onNavigate }: Props) {
  return (
    <nav
      className="sticky top-0 z-40 border-b border-line/70 bg-[#060a13]/85 backdrop-blur-md"
      aria-label="主导航"
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* 品牌 */}
        <button
          onClick={() => onNavigate("orrery")}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="回到轨道观测台"
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-180">
            <circle cx="14" cy="14" r="3.4" fill="#ffc46b" />
            <circle cx="14" cy="14" r="3.4" fill="none" stroke="#ff8f1f" strokeWidth="0.8" opacity="0.8" />
            <ellipse cx="14" cy="14" rx="11.5" ry="6.2" stroke="#6ee7d8" strokeWidth="1" opacity="0.75" transform="rotate(-18 14 14)" />
            <circle cx="23.6" cy="9.2" r="1.8" fill="#7ea6ff" />
            <ellipse cx="14" cy="14" rx="7.2" ry="11.8" stroke="#8fa2bb" strokeWidth="0.7" opacity="0.4" transform="rotate(24 14 14)" />
          </svg>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="font-display text-[15px] tracking-wider text-snow">太阳系轨道观测台</span>
            <span className="mt-1 font-numeric text-[8px] uppercase tracking-[0.3em] text-fog">Solar System Orrery</span>
          </span>
        </button>

        {/* 视图切换 */}
        <div className="ml-2 flex flex-1 items-center gap-0.5 overflow-x-auto sm:ml-8 sm:gap-1" role="tablist" aria-label="视图切换">
          {TABS.map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => onNavigate(t.id)}
                className={`group relative flex shrink-0 items-baseline gap-1.5 px-2.5 py-2 text-[13px] tracking-wider transition-colors duration-200 sm:px-3.5 ${
                  active ? "text-snow" : "text-fog hover:text-mist"
                }`}
              >
                <span className={`font-numeric text-[9px] ${active ? "text-solar" : "text-fog/60 group-hover:text-fog"}`}>{t.idx}</span>
                {t.label}
                <span
                  className={`absolute inset-x-2 bottom-0 h-[2px] origin-left transition-all duration-300 sm:inset-x-3 ${
                    active ? "scale-x-100 bg-solar shadow-[0_0_10px_rgba(245,155,35,0.7)]" : "scale-x-0 bg-line"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* 右侧徽标 */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <span className="border border-line/80 bg-panel/60 px-2.5 py-1 font-numeric text-[9px] uppercase tracking-[0.22em] text-fog">
            数据 · NASA Fact Sheet / IAU 2006
          </span>
        </div>
      </div>
    </nav>
  );
}
