import { useEffect } from "react";
import { ALL_BODIES } from "../data/planets";
import type { CelestialBody } from "../data/planets";
import BodyProfile from "./BodyProfile";

interface Props {
  body: CelestialBody;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

/** 天体档案弹窗：在任意视图原地打开，不离开当前页面 */
export default function CelestialModal({ body, onClose, onNavigate }: Props) {
  const idx = ALL_BODIES.findIndex((b) => b.id === body.id);
  const prev = ALL_BODIES[(idx + ALL_BODIES.length - 1) % ALL_BODIES.length];
  const next = ALL_BODIES[(idx + 1) % ALL_BODIES.length];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`${body.name}档案`}>
      <div className="overlay-enter absolute inset-0 bg-[#03060c]/80 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />
      <div
        key={body.id}
        className="hud-panel info-panel-enter relative max-h-[88vh] w-full max-w-md overflow-y-auto"
        style={{ "--corner-c": body.color } as React.CSSProperties}
      >
        <BodyProfile body={body} onClose={onClose} footer={footer} />
      </div>
    </div>
  );
}
