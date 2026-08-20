import { useEffect, useRef, useState } from "react";
import Starfield from "./components/Starfield";
import Orrery from "./components/Orrery";
import Controls from "./components/Controls";
import InfoPanel from "./components/InfoPanel";
import DataSectionsTop from "./components/DataSectionsTop";
import DataSectionsBottom from "./components/DataSectionsBottom";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ALL_BODIES } from "./data/planets";

const TITLE = "太阳系轨道观测台";
const SCRAMBLE_CHARS = "☄✦·×＋01轨道行星太阳观测系";

function useScramble(text: string, animate: boolean) {
  const [out, setOut] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setOut(text);
      return;
    }
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 4);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        s += i < settled ? text[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setOut(s);
      if (settled >= text.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [text, animate]);

  return out;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [running, setRunning] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<HTMLElement>(null);

  const title = useScramble(TITLE, !reducedMotion);
  const selected = ALL_BODIES.find((b) => b.id === selectedId) ?? null;

  const jumpToStage = (id: string) => {
    setSelectedId(id);
    stageRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-body text-snow">
      <Starfield reducedMotion={reducedMotion} />
      <div className="noise-layer" aria-hidden="true" />

      <div className="relative z-10">
        {/* ═══════════ 观测台主舞台 ═══════════ */}
        <section ref={stageRef} className="flex min-h-screen flex-col px-4 pt-6 sm:px-7 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 font-numeric text-[10px] uppercase tracking-[0.32em] text-fog">
                <span className={`inline-block h-1.5 w-1.5 rounded-full bg-hud ${reducedMotion ? "" : "blink-dot"}`} />
                <span>Interactive Orrery · 交互式教学演示</span>
              </div>
              <h1 className="mt-3 font-display text-[34px] leading-tight tracking-wide text-snow sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-fog">
                模拟太阳、八大行星与冥王星的轨道运动，小行星带与柯伊伯带环绕其间——内圈快、外圈慢，一如开普勒所见。
                <span className="text-mist">点击任意天体</span>查看质量、大气、探测任务等完整档案，或用控制台调节演示速度。
              </p>
            </div>
            <Controls
              running={running}
              onToggleRun={() => setRunning((v) => !v)}
              speed={speed}
              onSpeedChange={setSpeed}
              showOrbits={showOrbits}
              onToggleOrbits={() => setShowOrbits((v) => !v)}
              showLabels={showLabels}
              onToggleLabels={() => setShowLabels((v) => !v)}
            />
          </header>

          {/* 轨道图区域 */}
          <div
            className={`relative mt-1 min-h-[400px] flex-1 transition-all duration-500 ease-out sm:min-h-[440px] ${
              selected ? "lg:mr-[368px]" : ""
            }`}
          >
            <Orrery
              running={running}
              speed={speed}
              showOrbits={showOrbits}
              showLabels={showLabels}
              selectedId={selectedId}
              onSelect={setSelectedId}
              reducedMotion={reducedMotion}
            />
            <InfoPanel body={selected} onClose={() => setSelectedId(null)} onNavigate={setSelectedId} />

            {!selected && (
              <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
                <div
                  className={`flex items-center gap-2.5 border border-line bg-panel/85 px-4 py-2 text-xs tracking-widest text-mist ${
                    reducedMotion ? "" : "blink-dot"
                  }`}
                  style={{ animationDuration: "2.6s" }}
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#6ee7d8" strokeWidth="1.4" aria-hidden="true">
                    <circle cx="7" cy="7" r="5.2" />
                    <circle cx="7" cy="7" r="1.4" fill="#6ee7d8" stroke="none" />
                  </svg>
                  点击任意天体 · 打开档案
                </div>
              </div>
            )}
          </div>

          {/* 天体快捷栏 */}
          <nav aria-label="天体快捷选择" className="mt-2 flex gap-2 overflow-x-auto pb-1.5">
            {ALL_BODIES.map((b) => {
              const active = selectedId === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  aria-pressed={active}
                  className={`group flex shrink-0 items-center gap-2 border px-3 py-1.5 text-xs transition-all duration-300 ${
                    active
                      ? "border-transparent text-snow"
                      : "border-line bg-panel/50 text-fog hover:border-fog/50 hover:text-mist"
                  }`}
                  style={active ? { borderColor: b.color, background: `${b.color}14`, boxShadow: `0 0 14px ${b.glow.replace("0.4", "0.25")}` } : undefined}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{ background: `linear-gradient(135deg, ${b.color}, ${b.colorDeep})`, boxShadow: `0 0 6px ${b.glow}` }}
                  />
                  {b.name}
                </button>
              );
            })}
          </nav>

          {/* 状态栏 */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t border-line/60 py-3 font-numeric text-[10px] uppercase tracking-[0.24em] text-fog/70">
            <span>周期按 T^0.45 压缩 · 相对快慢保持真实</span>
            <span className="hidden md:inline">Tracking 10 Bodies · Kepler Mode</span>
            <span className="text-fog">
              SCROLL <span className="text-solar">↓</span> 档案 · 定律 · 探测史
            </span>
          </div>
        </section>

        {/* ═══════════ 档案区 ═══════════ */}
        <DataSectionsTop onSelect={jumpToStage} />
        <DataSectionsBottom onSelect={jumpToStage} />
      </div>
    </div>
  );
}
