import { useEffect, useRef, useState } from "react";
import { ALL_BODIES, PLANETS, SUN, EARTH_DEMO_PERIOD } from "../data/planets";
import type { CelestialBody } from "../data/planets";

const CX = 460;
const CY = 330;
const TILT = 0.78; // 轻微俯视倾角，制造纵深

const START_ANGLES = [-0.9, 0.7, 2.1, -2.35, 0.35, -1.15, 1.65, -0.2];

interface OrreryProps {
  running: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}

export default function Orrery({
  running,
  speed,
  showOrbits,
  showLabels,
  selectedId,
  onSelect,
  reducedMotion,
}: OrreryProps) {
  const anglesRef = useRef<number[]>([...START_ANGLES]);
  const moonRef = useRef(0.8);
  const simDaysRef = useRef(0);
  const [, setFrame] = useState(0);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (runningRef.current) {
        const s = speedRef.current;
        PLANETS.forEach((p, i) => {
          anglesRef.current[i] += ((Math.PI * 2) / p.demoPeriod) * s * dt;
        });
        moonRef.current += ((Math.PI * 2) / (EARTH_DEMO_PERIOD / 12)) * s * dt;
        simDaysRef.current +=
          ((((Math.PI * 2) / EARTH_DEMO_PERIOD) * s * dt) / (Math.PI * 2)) * 365.25;
        setFrame((f) => (f + 1) % 1_000_000);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pos = (p: CelestialBody, i: number) => {
    const a = anglesRef.current[i];
    return {
      x: CX + p.orbitRadius * Math.cos(a),
      y: CY + p.orbitRadius * Math.sin(a) * TILT,
      behind: Math.sin(a) < 0,
    };
  };

  const positions = PLANETS.map(pos);
  const behind = PLANETS.map((p, i) => ({ p, i, ...positions[i] })).filter((d) => d.behind);
  const front = PLANETS.map((p, i) => ({ p, i, ...positions[i] })).filter((d) => !d.behind);

  const days = simDaysRef.current;
  const years = Math.floor(days / 365.25);
  const remDays = Math.floor(days % 365.25);

  const hotId = hoverId ?? selectedId;

  const renderPlanet = (p: CelestialBody, i: number, x: number, y: number) => {
    const isSel = selectedId === p.id;
    const isHot = hotId === p.id;
    return (
      <g
        key={p.id}
        className="planet-node"
        onClick={() => onSelect(p.id)}
        onMouseEnter={() => setHoverId(p.id)}
        onMouseLeave={() => setHoverId(null)}
        tabIndex={0}
        role="button"
        aria-label={`查看${p.name}档案`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(p.id);
          }
        }}
      >
        {isSel && (
          <circle
            className="scan-ring"
            cx={x}
            cy={y}
            r={p.sizeRadius + 9}
            fill="none"
            stroke={p.color}
            strokeWidth="1.5"
          />
        )}
        <circle
          className="planet-body"
          cx={x}
          cy={y}
          r={p.sizeRadius}
          fill={`url(#pg-${p.id})`}
          stroke={isSel || isHot ? p.color : "rgba(234,242,252,0.14)"}
          strokeWidth={isSel ? 1.6 : 1}
          style={isHot ? { filter: `drop-shadow(0 0 10px ${p.glow})` } : undefined}
        />
        {/* 气态行星云带 */}
        {(p.id === "jupiter" || p.id === "saturn") && (
          <g clipPath={`url(#clip-${p.id})`} className="planet-body" pointerEvents="none">
            <rect x={x - p.sizeRadius} y={y - p.sizeRadius * 0.42} width={p.sizeRadius * 2} height={p.sizeRadius * 0.22} fill={p.colorDeep} opacity="0.4" />
            <rect x={x - p.sizeRadius} y={y + p.sizeRadius * 0.08} width={p.sizeRadius * 2} height={p.sizeRadius * 0.16} fill={p.colorDeep} opacity="0.3" />
            <rect x={x - p.sizeRadius} y={y + p.sizeRadius * 0.45} width={p.sizeRadius * 2} height={p.sizeRadius * 0.18} fill={p.colorDeep} opacity="0.24" />
          </g>
        )}
        {/* 木星大红斑 */}
        {p.id === "jupiter" && (
          <ellipse
            cx={x + p.sizeRadius * 0.32}
            cy={y + p.sizeRadius * 0.3}
            rx={p.sizeRadius * 0.24}
            ry={p.sizeRadius * 0.14}
            fill="#c9502e"
            opacity="0.75"
            pointerEvents="none"
          />
        )}
        {/* 土星环 */}
        {p.id === "saturn" && (
          <g transform={`rotate(-16 ${x} ${y})`} pointerEvents="none">
            <ellipse cx={x} cy={y} rx={p.sizeRadius * 1.95} ry={p.sizeRadius * 0.6} fill="none" stroke="#e3cd9c" strokeWidth="4" opacity="0.55" />
            <ellipse cx={x} cy={y} rx={p.sizeRadius * 1.55} ry={p.sizeRadius * 0.47} fill="none" stroke="#cbb183" strokeWidth="1.6" opacity="0.4" />
          </g>
        )}
        {/* 地球的月球 */}
        {p.id === "earth" && (
          <circle
            cx={x + Math.cos(moonRef.current) * (p.sizeRadius + 8)}
            cy={y + Math.sin(moonRef.current) * (p.sizeRadius + 8) * 0.6}
            r="2"
            fill="#c9d4e4"
            opacity="0.9"
            pointerEvents="none"
          />
        )}
        {(showLabels || isSel || isHot) && (
          <text
            className="label-txt"
            x={x}
            y={y - p.sizeRadius - (p.id === "saturn" ? 16 : 9)}
            textAnchor="middle"
            fontSize="13"
            fill="#eaf2fc"
            stroke="#060a13"
            strokeWidth="3.5"
            paintOrder="stroke"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.08em" }}
          >
            {p.name}
          </text>
        )}
        {/* 扩大点击热区 */}
        <circle cx={x} cy={y} r={Math.max(p.sizeRadius + 11, 16)} fill="transparent" />
      </g>
    );
  };

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 920 660"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="太阳系轨道运动演示图"
      >
        <defs>
          <radialGradient id="pg-sun" cx="42%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fff8dc" />
            <stop offset="45%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#ff8f1f" />
          </radialGradient>
          <radialGradient id="sun-halo">
            <stop offset="0%" stopColor="rgba(255,180,80,0.5)" />
            <stop offset="45%" stopColor="rgba(255,150,50,0.16)" />
            <stop offset="100%" stopColor="rgba(255,140,40,0)" />
          </radialGradient>
          {ALL_BODIES.filter((b) => b.id !== "sun").map((p) => (
            <radialGradient key={p.id} id={`pg-${p.id}`} cx="38%" cy="34%" r="72%">
              <stop offset="0%" stopColor={p.color} />
              <stop offset="58%" stopColor={p.color} />
              <stop offset="100%" stopColor={p.colorDeep} />
            </radialGradient>
          ))}
          <clipPath id="clip-jupiter">
            <circle cx={positions[4].x} cy={positions[4].y} r={PLANETS[4].sizeRadius} />
          </clipPath>
          <clipPath id="clip-saturn">
            <circle cx={positions[5].x} cy={positions[5].y} r={PLANETS[5].sizeRadius} />
          </clipPath>
        </defs>

        {/* 观测台 HUD 装饰 */}
        <g opacity="0.5" pointerEvents="none">
          <circle cx={CX} cy={CY} r="402" fill="none" stroke="#22304a" strokeWidth="1" strokeDasharray="2 9" className={reducedMotion ? "" : "hud-rotor"} />
          <circle cx={CX} cy={CY} r="60" fill="none" stroke="#22304a" strokeWidth="1" strokeDasharray="1 6" />
          <line x1={CX - 420} y1={CY} x2={CX + 420} y2={CY} stroke="#22304a" strokeWidth="0.6" opacity="0.5" />
          <line x1={CX} y1={CY - 318} x2={CX} y2={CY + 318} stroke="#22304a" strokeWidth="0.6" opacity="0.5" />
          {[
            { t: "0°", x: CX + 412, y: CY + 4 },
            { t: "90°", x: CX, y: CY + 316 },
            { t: "180°", x: CX - 412, y: CY + 4 },
            { t: "270°", x: CX, y: CY - 306 },
          ].map((d) => (
            <text key={d.t} x={d.x} y={d.y} textAnchor="middle" fontSize="10" fill="#4a5c78" style={{ fontFamily: "var(--font-numeric)" }}>
              {d.t}
            </text>
          ))}
        </g>

        {/* 轨道 */}
        {showOrbits &&
          PLANETS.map((p) => {
            const hot = hotId === p.id;
            return (
              <ellipse
                key={`orbit-${p.id}`}
                className={`orbit-line${hot ? " is-hot" : ""}`}
                cx={CX}
                cy={CY}
                rx={p.orbitRadius}
                ry={p.orbitRadius * TILT}
                fill="none"
                stroke={hot ? p.color : "#2c3d5c"}
                strokeWidth={hot ? 1.4 : 1}
                opacity={hot ? 0.9 : 0.55}
              />
            );
          })}

        {/* 太阳后方的行星 */}
        {behind.map((d) => renderPlanet(d.p, d.i, d.x, d.y))}

        {/* 太阳 */}
        <g
          className="planet-node"
          onClick={() => onSelect("sun")}
          onMouseEnter={() => setHoverId("sun")}
          onMouseLeave={() => setHoverId(null)}
          tabIndex={0}
          role="button"
          aria-label="查看太阳档案"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect("sun");
            }
          }}
        >
          <circle cx={CX} cy={CY} r="86" fill="url(#sun-halo)" className="sun-glow" pointerEvents="none" />
          <circle
            cx={CX}
            cy={CY}
            r={SUN.sizeRadius}
            fill="url(#pg-sun)"
            stroke={selectedId === "sun" ? "#ffd166" : "rgba(255,220,150,0.35)"}
            strokeWidth="1.4"
            className="planet-body"
            style={hotId === "sun" ? { filter: "drop-shadow(0 0 22px rgba(255,170,60,0.8))" } : undefined}
          />
          {(showLabels || selectedId === "sun" || hoverId === "sun") && (
            <text
              className="label-txt"
              x={CX}
              y={CY - SUN.sizeRadius - 12}
              textAnchor="middle"
              fontSize="13"
              fill="#ffd9a0"
              stroke="#060a13"
              strokeWidth="3.5"
              paintOrder="stroke"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.08em" }}
            >
              太阳
            </text>
          )}
          <circle cx={CX} cy={CY} r={SUN.sizeRadius + 12} fill="transparent" />
        </g>

        {/* 太阳前方的行星 */}
        {front.map((d) => renderPlanet(d.p, d.i, d.x, d.y))}
      </svg>

      {/* 模拟时钟 */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2.5 font-numeric text-[11px] tracking-wider text-fog sm:bottom-4 sm:left-4">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${running ? "blink-dot bg-hud" : "bg-fog/50"}`} />
        <span className="uppercase">SIM-TIME</span>
        <span className="text-snow">
          已模拟 <span className="text-solar">{years}</span> 年 <span className="text-solar">{remDays}</span> 天
        </span>
      </div>
    </div>
  );
}
