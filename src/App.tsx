import { useEffect, useRef, useState } from "react";
import Starfield from "./components/Starfield";
import TopNav from "./components/TopNav";
import type { ViewId } from "./components/TopNav";
import Orrery from "./components/Orrery";
import Controls from "./components/Controls";
import ProfileColumn from "./components/ProfileColumn";
import CelestialModal from "./components/CelestialModal";
import MissionModal from "./components/MissionModal";
import DataSectionsTop from "./components/DataSectionsTop";
import MissionsView from "./components/MissionsView";
import ClassroomView from "./components/ClassroomView";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { ALL_BODIES } from "./data/planets";
import { MISSIONS } from "./data/extras";

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

  /* ── 视图与选中状态 ── */
  const [view, setView] = useState<ViewId>("orrery");
  const [selectedId, setSelectedId] = useState<string | null>(null); // 观测台右侧栏
  const [celestialId, setCelestialId] = useState<string | null>(null); // 天体弹窗
  const [missionId, setMissionId] = useState<string | null>(null); // 任务弹窗

  /* ── 观测台控制 ── */
  const [running, setRunning] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  const title = useScramble(TITLE, !reducedMotion && view === "orrery");
  const selected = ALL_BODIES.find((b) => b.id === selectedId) ?? null;
  const celestial = ALL_BODIES.find((b) => b.id === celestialId) ?? null;
  const mission = MISSIONS.find((m) => m.id === missionId) ?? null;

  const openBody = (id: string) => setCelestialId(id);
  const openMissionFromModal = (id: string) => {
    setMissionId(id);
  };

  /* ── 切换视图时回到顶部 ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view]);

  /* ── 快捷键：仅在观测台且无弹窗时生效 ── */
  const viewRef = useRef(view);
  viewRef.current = view;
  const modalOpenRef = useRef(false);
  modalOpenRef.current = celestialId !== null || missionId !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (viewRef.current !== "orrery" || modalOpenRef.current) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "BUTTON" || t.getAttribute("role") === "button") return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((v) => !v);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedId((cur) => {
          const idx = cur ? ALL_BODIES.findIndex((b) => b.id === cur) : -1;
          const next =
            e.key === "ArrowRight"
              ? ALL_BODIES[(idx + 1) % ALL_BODIES.length]
              : ALL_BODIES[(idx + ALL_BODIES.length - 1) % ALL_BODIES.length];
          return next.id;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden font-body text-snow">
      <Starfield reducedMotion={reducedMotion} />
      <div className="noise-layer" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav view={view} onNavigate={setView} />

        {/* ═══════════ 视图 01 · 轨道观测台 ═══════════ */}
        {view === "orrery" && (
          <main key="orrery" className="view-enter flex flex-1 flex-col px-4 pt-6 sm:px-7 lg:px-10">
            <section ref={stageRef} className="flex min-h-[calc(100dvh-9.5rem)] flex-col">
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
                    <span className="text-mist">点击任意天体</span>，右侧栏即刻打开完整档案；用控制台调节演示速度。
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

              {/* 轨道图 + 右侧档案栏 */}
              <div className="mt-1 flex min-h-[400px] flex-1 flex-col gap-3 sm:min-h-[440px] lg:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Orrery
                    running={running}
                    speed={speed}
                    showOrbits={showOrbits}
                    showLabels={showLabels}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    reducedMotion={reducedMotion}
                  />
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

                <aside className="hud-panel h-[430px] shrink-0 overflow-hidden lg:h-auto lg:w-[356px]" style={{ "--corner-c": "#6ee7d8" } as React.CSSProperties}>
                  <ProfileColumn
                    body={selected}
                    onSelect={setSelectedId}
                    onClose={() => setSelectedId(null)}
                    onNavigate={setSelectedId}
                  />
                </aside>
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
                  顶部导航 <span className="text-solar">→</span> 行星档案 · 探测纪元 · 探索课堂
                </span>
              </div>
            </section>
          </main>
        )}

        {/* ═══════════ 视图 02 · 行星档案 ═══════════ */}
        {view === "registry" && (
          <main key="registry" className="view-enter flex-1 pt-2">
            <div className="mx-auto max-w-6xl px-5 pt-7 md:px-8">
              <header className="reveal max-w-2xl">
                <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
                  <span className="text-solar">02</span>
                  <span className="h-px w-10 bg-line" />
                  <span>Planetary Registry</span>
                </div>
                <h1 className="mt-3 font-display text-3xl tracking-wide text-snow sm:text-[40px]">行星档案库</h1>
                <p className="mt-3 text-[13px] leading-relaxed text-fog">
                  九大轨道天体的完整参数、家族谱系、大气成分与尺度对照。
                  <span className="text-mist">点击任意天体</span>——原地弹出详细档案，不会离开当前页面。
                </p>
              </header>
            </div>
            <DataSectionsTop onSelect={openBody} />
          </main>
        )}

        {/* ═══════════ 视图 03 · 探测纪元 ═══════════ */}
        {view === "missions" && (
          <main key="missions" className="view-enter flex-1">
            <MissionsView onOpenMission={openMissionFromModal} />
          </main>
        )}

        {/* ═══════════ 视图 04 · 探索课堂 ═══════════ */}
        {view === "classroom" && (
          <main key="classroom" className="view-enter flex-1">
            <ClassroomView onOpenBody={openBody} />
          </main>
        )}

        {/* 全局页脚 */}
        <footer className="relative z-10 border-t border-line/70 bg-[#05080f]/70 pb-5 pt-6">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center md:px-8">
            <div>
              <div className="font-display text-base tracking-wide text-snow">太阳系轨道观测台</div>
              <div className="mt-1 font-numeric text-[9px] uppercase tracking-[0.28em] text-fog">
                Solar System Orrery · Interactive Demo
              </div>
            </div>
            <div className="max-w-lg text-[10.5px] leading-relaxed text-fog/80">
              教学说明：公转周期按 T^0.45 指数压缩（相对快慢顺序与真实一致），距离与尺寸经对数/平方根映射，并非真实比例。
              天体数据参考 NASA Planetary Fact Sheet 与 IAU（2006）行星定义。
            </div>
          </div>
        </footer>
      </div>

      {/* ═══════════ 弹窗层 ═══════════ */}
      {celestial && <CelestialModal body={celestial} onClose={() => setCelestialId(null)} onNavigate={setCelestialId} />}
      {mission && !celestial && (
        <MissionModal
          mission={mission}
          onClose={() => setMissionId(null)}
          onNavigate={setMissionId}
          onOpenBody={(id) => {
            setMissionId(null);
            setCelestialId(id);
          }}
        />
      )}
    </div>
  );
}


