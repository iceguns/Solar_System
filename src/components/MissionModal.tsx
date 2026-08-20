import { useEffect } from "react";
import { MISSIONS } from "../data/extras";
import type { Mission } from "../data/extras";
import { ALL_BODIES } from "../data/planets";

interface Props {
  mission: Mission;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onOpenBody: (id: string) => void;
}

/** 探测任务档案弹窗：含任务场景渲染图、关键成就与关联天体 */
export default function MissionModal({ mission, onClose, onNavigate, onOpenBody }: Props) {
  const idx = MISSIONS.findIndex((m) => m.id === mission.id);
  const prev = MISSIONS[(idx + MISSIONS.length - 1) % MISSIONS.length];
  const next = MISSIONS[(idx + 1) % MISSIONS.length];
  const relatedBody = ALL_BODIES.find((b) => b.id === mission.related);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prev.id);
      if (e.key === "ArrowRight") onNavigate(next.id);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate, prev.id, next.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`${mission.cn}任务档案`}>
      <div className="overlay-enter absolute inset-0 bg-[#03060c]/80 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />
      <div
        key={mission.id}
        className="hud-panel info-panel-enter relative max-h-[90vh] w-full max-w-2xl overflow-y-auto"
        style={{ "--corner-c": "#f59b23" } as React.CSSProperties}
      >
        {/* 任务场景图 */}
        <div className="relative h-56 overflow-hidden border-b border-line/80 sm:h-72">
          <img src={mission.image} alt={mission.imageAlt} className="kenburns h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/25 to-transparent" aria-hidden="true" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="border border-solar/60 bg-[#0a1120]/85 px-2.5 py-1 font-numeric text-sm font-semibold tracking-widest text-solar">
              {mission.year}
            </span>
            <span className="border border-line bg-[#0a1120]/85 px-2.5 py-1 font-numeric text-[10px] uppercase tracking-[0.18em] text-mist">
              {mission.agencyShort}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭任务档案"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-line bg-[#0a1120]/85 text-fog transition-colors duration-200 hover:border-solar/60 hover:text-snow"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden="true">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 sm:px-6">
            <div className="font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">{mission.en}</div>
            <h3 className="mt-0.5 font-display text-3xl tracking-wide text-snow" style={{ textShadow: "0 2px 18px rgba(3,6,12,0.9)" }}>
              {mission.cn}
            </h3>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {/* 状态条 */}
          <div className="flex flex-wrap gap-2">
            {[
              { l: "发射", v: mission.launch },
              { l: "目标", v: mission.target },
              { l: "现状", v: mission.status },
            ].map((s) => (
              <span key={s.l} className="border border-line/80 bg-ink/40 px-2.5 py-1.5">
                <span className="mr-1.5 text-[9px] tracking-[0.2em] text-fog">{s.l}</span>
                <span className="font-numeric text-[11px] text-mist">{s.v}</span>
              </span>
            ))}
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-mist">{mission.desc}</p>

          {/* 关键成就 */}
          <div className="mt-5">
            <div className="mb-2.5 flex items-center gap-2.5 font-numeric text-[10px] uppercase tracking-[0.24em] text-fog">
              <span className="text-solar">✦</span> 关键成就
            </div>
            <ul className="space-y-2">
              {mission.achievements.map((a) => (
                <li key={a} className="flex gap-2.5 border border-line/60 bg-ink/30 px-3 py-2 text-[12.5px] leading-relaxed text-mist">
                  <svg width="7" height="7" viewBox="0 0 8 8" className="mt-[7px] shrink-0" aria-hidden="true">
                    <path d="M4 0l1.1 2.9L8 4 5.1 5.1 4 8 2.9 5.1 0 4l2.9-1.1z" fill="#ffc46b" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* 机构 + 关联天体 */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
            <div className="font-numeric text-[10.5px] text-fog">{mission.agency}</div>
            {relatedBody && (
              <button
                onClick={() => onOpenBody(relatedBody.id)}
                className="group flex items-center gap-2 border border-line bg-ink/40 px-3 py-1.5 text-xs text-mist transition-all duration-200 hover:-translate-y-0.5 hover:border-solar/50 hover:text-snow"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${relatedBody.color}, ${relatedBody.colorDeep})`, boxShadow: `0 0 7px ${relatedBody.glow}` }}
                />
                查看{relatedBody.name}档案
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                  <path d="m4.5 1.5 4.5 4.5-4.5 4.5" />
                </svg>
              </button>
            )}
          </div>

          {/* 翻页 */}
          <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4">
            <button
              onClick={() => onNavigate(prev.id)}
              className="group flex items-center gap-1.5 text-xs text-fog transition-colors duration-200 hover:text-snow"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true">
                <path d="M7.5 1.5 3 6l4.5 4.5" />
              </svg>
              {prev.cn}
            </button>
            <span className="font-numeric text-[10px] uppercase tracking-[0.2em] text-fog/60">
              {idx + 1} / {MISSIONS.length}
            </span>
            <button
              onClick={() => onNavigate(next.id)}
              className="group flex items-center gap-1.5 text-xs text-fog transition-colors duration-200 hover:text-snow"
            >
              {next.cn}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="m4.5 1.5 4.5 4.5-4.5 4.5" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-right font-numeric text-[9px] tracking-wider text-fog/50">任务场景图 · 艺术渲染</p>
        </div>
      </div>
    </div>
  );
}
