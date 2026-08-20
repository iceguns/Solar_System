import { useEffect, useMemo, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  tw: boolean;
  dur: number;
  delay: number;
}

/** 固定种子的伪随机，保证首屏稳定 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(count: number, seed: number): Star[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    r: 0.4 + rnd() * 1.1,
    o: 0.25 + rnd() * 0.65,
    tw: rnd() > 0.55,
    dur: 2.5 + rnd() * 5,
    delay: rnd() * 6,
  }));
}

export default function Starfield({ reducedMotion }: { reducedMotion: boolean }) {
  const farStars = useMemo(() => makeStars(110, 20240817), []);
  const nearStars = useMemo(() => makeStars(60, 99120411), []);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setPar({ x, y });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  const renderLayer = (stars: Star[], vb: number, cls: string) => (
    <svg
      className={`absolute inset-0 h-full w-full ${cls}`}
      viewBox={`0 0 ${vb} ${vb}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={(s.x / 100) * vb}
          cy={(s.y / 100) * vb}
          r={s.r}
          fill="#dfe9f8"
          opacity={s.o}
          className={s.tw && !reducedMotion ? "star-tw" : undefined}
          style={
            s.tw && !reducedMotion
              ? ({ "--tw-dur": `${s.dur}s`, "--tw-delay": `${s.delay}s` } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 深空底色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% -10%, #0d1730 0%, #080e1c 42%, #060a13 78%), linear-gradient(180deg, #081022 0%, #060a13 60%)",
        }}
      />
      {/* 银河色带 */}
      <div
        className="absolute -inset-[20%] opacity-[0.07]"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, #9db8e8 46%, #dfe9f8 50%, #9db8e8 54%, transparent 70%)",
          transform: "rotate(-8deg)",
        }}
      />
      {/* 星云色晕（极暗、缓慢漂移） */}
      <div
        className="nebula-a absolute left-[-10%] top-[-15%] h-[70vh] w-[60vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(46,110,130,0.16), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="nebula-b absolute bottom-[-20%] right-[-8%] h-[75vh] w-[55vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(150,84,30,0.12), transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        className="absolute left-[30%] top-[55%] h-[50vh] w-[40vw] rounded-full opacity-70"
        style={{
          background: "radial-gradient(closest-side, rgba(38,64,120,0.14), transparent 72%)",
          filter: "blur(10px)",
        }}
      />

      {/* 星层（视差） */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${par.x * -8}px, ${par.y * -6}px, 0)` }}
      >
        {renderLayer(farStars, 1000, "")}
      </div>
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `translate3d(${par.x * -18}px, ${par.y * -13}px, 0)` }}
      >
        {renderLayer(nearStars, 1000, "")}
      </div>

      {/* 流星 */}
      {!reducedMotion && (
        <>
          <span className="shooting-star" style={{ top: "12%", right: "4%", ["--sh-delay" as string]: "2.5s" }} />
          <span className="shooting-star" style={{ top: "38%", right: "-6%", ["--sh-delay" as string]: "8s" }} />
        </>
      )}

      {/* 四周暗角 */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(115% 90% at 50% 40%, transparent 55%, rgba(3,6,12,0.72) 100%)" }}
      />
    </div>
  );
}
