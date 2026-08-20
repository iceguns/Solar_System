import { SPEED_PRESETS } from "../data/planets";

interface ControlsProps {
  running: boolean;
  onToggleRun: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`group flex items-center gap-2 border px-2.5 py-1.5 text-xs transition-colors duration-300 ${
        on
          ? "border-hud/50 bg-hud/10 text-hud"
          : "border-line bg-panel/60 text-fog hover:border-fog/50 hover:text-mist"
      }`}
    >
      <span
        className={`relative h-3 w-6 rounded-full transition-colors duration-300 ${
          on ? "bg-hud/70" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-[2px] h-2 w-2 rounded-full bg-snow transition-all duration-300 ${
            on ? "left-[14px]" : "left-[2px]"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export default function Controls({
  running,
  onToggleRun,
  speed,
  onSpeedChange,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
}: ControlsProps) {
  return (
    <div className="hud-panel flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3" style={{ "--corner-c": "#f59b23" } as React.CSSProperties}>
      {/* 播放 / 暂停 */}
      <button
        onClick={onToggleRun}
        aria-label={running ? "暂停轨道运动" : "播放轨道运动"}
        className={`group flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
          running
            ? "border-solar/60 bg-solar/15 text-solar shadow-[0_0_18px_rgba(245,155,35,0.25)]"
            : "border-line bg-panel text-mist hover:border-solar/60 hover:text-solar"
        }`}
      >
        {running ? (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2.5" width="3.6" height="11" rx="0.8" />
            <rect x="9.4" y="2.5" width="3.6" height="11" rx="0.8" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.5 2.3a1 1 0 0 1 1.53-.85l8.2 5.7a1 1 0 0 1 0 1.7l-8.2 5.7a1 1 0 0 1-1.53-.85V2.3Z" />
          </svg>
        )}
      </button>

      {/* 速度 */}
      <div className="flex flex-col gap-1.5">
        <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-fog">
          演示速度 <span className="text-solar">{speed}×</span>
        </span>
        <div className="flex gap-1">
          {SPEED_PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => onSpeedChange(v)}
              aria-pressed={speed === v}
              className={`border px-2 py-1 font-numeric text-xs transition-all duration-200 ${
                speed === v
                  ? "border-solar/70 bg-solar/15 text-solar shadow-[0_0_12px_rgba(245,155,35,0.2)]"
                  : "border-line bg-transparent text-fog hover:border-fog/60 hover:text-mist"
              }`}
            >
              {v}×
            </button>
          ))}
        </div>
      </div>

      <div className="hidden h-9 w-px bg-line sm:block" />

      {/* 显示开关 */}
      <div className="flex gap-2">
        <Toggle label="轨道" on={showOrbits} onClick={onToggleOrbits} />
        <Toggle label="标签" on={showLabels} onClick={onToggleLabels} />
      </div>
    </div>
  );
}
