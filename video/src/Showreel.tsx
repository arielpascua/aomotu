import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

const outfit = loadOutfit();
const space = loadSpace();

const C = {
  espresso: "#341A0D",
  espressoDeep: "#26130A",
  rust: "#985322",
  amber: "#DB9F00",
  amberHi: "#FFC42B",
  taupe: "#9F8981",
  slate: "#3C3950",
  cream: "#F2EBE6",
  black: "#080808",
};

const COUNTRIES = [
  "FRANCE", "LUXEMBOURG", "SWEDEN", "PHILIPPINES", "MEXICO", "SAUDI ARABIA",
  "NEW ZEALAND", "GERMANY", "ITALY", "SINGAPORE", "CANADA", "UAE",
  "JAPAN", "UNITED KINGDOM", "UNITED STATES", "AUSTRALIA",
];

/* ----------------------------------------------------------------- helpers */
const ease = Easing.out(Easing.cubic);

const fadeUp = (frame: number, start: number, dist = 28, dur = 22) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  transform: `translateY(${interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  })}px)`,
});

/* ------------------------------------------------------------- background */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90);
  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at ${30 + drift * 6}% 22%, ${C.rust}55, transparent 60%),
                       radial-gradient(55% 55% at ${72 - drift * 5}% 82%, ${C.amber}22, transparent 60%),
                       radial-gradient(80% 80% at 50% 50%, ${C.espresso}, ${C.espressoDeep})`,
        }}
      />
      {/* fine grid */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `linear-gradient(${C.taupe} 1px, transparent 1px), linear-gradient(90deg, ${C.taupe} 1px, transparent 1px)`,
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- starburst */
const Starburst: React.FC<{ size?: number; spin?: number }> = ({ size = 240, spin = 0.7 }) => {
  const frame = useCurrentFrame();
  const rot = frame * spin;
  const N = 16;
  const half = size / 2;
  const spokes = Array.from({ length: N }, (_, i) => {
    const ang = (i / N) * Math.PI * 2;
    const len = half * (0.78 + 0.22 * Math.sin(i * 1.7));
    return {
      x: Math.cos(ang) * len,
      y: Math.sin(ang) * len,
      gold: i % 2 === 0,
      r: 10 + (i % 3 === 0 ? 5 : 0),
    };
  });
  return (
    <div style={{ width: size, height: size, transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox={`${-half} ${-half} ${size} ${size}`} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="coreGrad" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#FFF0C2" />
            <stop offset="45%" stopColor={C.amberHi} />
            <stop offset="100%" stopColor={C.rust} />
          </radialGradient>
          <radialGradient id="ballGrad" cx="36%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#FFE38A" />
            <stop offset="55%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.rust} />
          </radialGradient>
        </defs>
        {spokes.map((s, i) => (
          <line key={`l${i}`} x1={0} y1={0} x2={s.x} y2={s.y} stroke={C.espressoDeep} strokeWidth={5} strokeLinecap="round" />
        ))}
        {spokes.map((s, i) => (
          <circle key={`c${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.gold ? "url(#ballGrad)" : C.black} stroke={s.gold ? "none" : "#1a1a1a"} strokeWidth={1} />
        ))}
        <circle cx={0} cy={0} r={size * 0.17} fill="url(#coreGrad)" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------- scene 1 */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
      <div style={{ transform: `scale(${0.4 + pop * 0.6})`, filter: `drop-shadow(0 18px 50px ${C.amber}44)` }}>
        <Starburst size={260} spin={0.9} />
      </div>
      <div style={{ ...fadeUp(frame, 18), fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 104, letterSpacing: 6, color: C.cream }}>
        AOMOTU<span style={{ color: C.amber }}>.INC</span>
      </div>
      <div style={{ ...fadeUp(frame, 42), fontFamily: space.fontFamily, fontSize: 25, letterSpacing: 9, color: C.taupe, textTransform: "uppercase" }}>
        Digital Advertising&nbsp;&nbsp;·&nbsp;&nbsp;Marketing&nbsp;&nbsp;·&nbsp;&nbsp;Outsourcing
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene 2 */
const SceneCountries: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [8, 46], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ ...fadeUp(frame, 4), fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 8, color: C.amber, textTransform: "uppercase", marginBottom: 8 }}>
        Operating across the globe
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
        <div style={{ fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 220, lineHeight: 1, color: C.cream, transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp", easing: ease })})` }}>
          {count}
        </div>
        <div style={{ fontFamily: outfit.fontFamily, fontWeight: 600, fontSize: 52, color: C.taupe, ...fadeUp(frame, 24) }}>
          countries
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 26px", maxWidth: 1200, marginTop: 36 }}>
        {COUNTRIES.map((name, i) => {
          const start = 40 + i * 4;
          return (
            <span key={name} style={{ ...fadeUp(frame, start, 14, 14), fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 2, color: C.taupe, fontWeight: 500 }}>
              <span style={{ color: C.amber }}>•</span> {name}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene 3 */
const PILLARS = [
  { n: "01", title: "Digital Advertising", desc: "Paid, programmatic & influencer campaigns engineered for ROI." },
  { n: "02", title: "Marketing", desc: "Data-driven strategy with native, localized execution." },
  { n: "03", title: "Outsourcing", desc: "Hyper-scalable creative & media teams, on demand." },
];
const SceneServices: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ ...fadeUp(frame, 2), fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 8, color: C.amber, textTransform: "uppercase", marginBottom: 50 }}>
        What we do
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        {PILLARS.map((p, i) => {
          const start = 14 + i * 16;
          return (
            <div
              key={p.n}
              style={{
                ...fadeUp(frame, start, 40),
                width: 420,
                padding: "44px 38px",
                borderRadius: 18,
                background: `linear-gradient(160deg, ${C.slate}66, ${C.espressoDeep}cc)`,
                border: `1px solid ${C.taupe}22`,
              }}
            >
              <div style={{ fontFamily: space.fontFamily, fontSize: 18, color: C.amber, letterSpacing: 3, marginBottom: 26 }}>{p.n}</div>
              <div style={{ fontFamily: outfit.fontFamily, fontWeight: 600, fontSize: 42, color: C.cream, marginBottom: 18, lineHeight: 1.05 }}>{p.title}</div>
              <div style={{ fontFamily: space.fontFamily, fontSize: 21, color: C.taupe, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene 4 */
const STATS = [
  { value: 16, suffix: "", label: "Global Offices" },
  { value: 450, suffix: "+", label: "Talents Worldwide" },
  { value: 98, suffix: "%", label: "Client Retention" },
];
const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ ...fadeUp(frame, 2), fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 8, color: C.amber, textTransform: "uppercase", marginBottom: 56 }}>
        By the numbers
      </div>
      <div style={{ display: "flex", gap: 130 }}>
        {STATS.map((s, i) => {
          const start = 12 + i * 12;
          const v = Math.round(
            interpolate(frame, [start, start + 40], [0, s.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })
          );
          return (
            <div key={s.label} style={{ ...fadeUp(frame, start, 30), textAlign: "center" }}>
              <div style={{ fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 130, lineHeight: 1, color: C.amberHi }}>
                {v}{s.suffix}
              </div>
              <div style={{ fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 3, color: C.taupe, textTransform: "uppercase", marginTop: 14 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene 5 */
const SceneNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920, H = 1080;
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    x: 260 + random(`x${i}`) * (W - 520),
    y: 300 + random(`y${i}`) * (H - 560),
    gold: random(`g${i}`) > 0.55,
    r: 6 + random(`r${i}`) * 8,
  }));
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > 460) return null;
            const appear = interpolate(frame, [10 + i * 2, 30 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pulse = 0.18 + 0.16 * (0.5 + 0.5 * Math.sin(frame / 12 + i + j));
            return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.amber} strokeWidth={1.2} opacity={appear * pulse} />;
          })
        )}
        {nodes.map((n, i) => {
          const s = interpolate(frame, [6 + i * 2, 22 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          return <circle key={i} cx={n.x} cy={n.y} r={n.r * s} fill={n.gold ? C.amber : C.cream} opacity={n.gold ? 1 : 0.55} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ ...fadeUp(frame, 30), fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 84, color: C.cream, textAlign: "center", lineHeight: 1.1 }}>
          One borderless team.
        </div>
        <div style={{ ...fadeUp(frame, 48), fontFamily: space.fontFamily, fontSize: 26, letterSpacing: 4, color: C.amber, marginTop: 18, textTransform: "uppercase" }}>
          16 markets · native execution
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- scene 6 */
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
      <div style={{ transform: `scale(${0.5 + pop * 0.5})`, filter: `drop-shadow(0 18px 50px ${C.amber}55)` }}>
        <Starburst size={200} spin={1.1} />
      </div>
      <div style={{ ...fadeUp(frame, 16), fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 92, letterSpacing: 6, color: C.cream }}>
        AOMOTU<span style={{ color: C.amber }}>.INC</span>
      </div>
      <div style={{ ...fadeUp(frame, 36), fontFamily: space.fontFamily, fontSize: 24, letterSpacing: 6, color: C.taupe, textTransform: "uppercase" }}>
        Let's build borderless
      </div>
      <div style={{ ...fadeUp(frame, 52), fontFamily: space.fontFamily, fontSize: 20, letterSpacing: 3, color: C.amber, marginTop: 6 }}>
        aomotu-web-production.up.railway.app
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- chrome */
const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* vignette */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 80px rgba(10,5,2,0.6)" }} />
      {/* top label */}
      <div style={{ position: "absolute", top: 40, left: 56, right: 56, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: space.fontFamily }}>
        <span style={{ fontSize: 18, letterSpacing: 3, color: C.taupe }}>AOMOTU&nbsp;//&nbsp;GLOBAL CAMPAIGN SHOWREEL</span>
        <span style={{ fontSize: 14, letterSpacing: 2, color: C.espressoDeep, background: C.amber, padding: "5px 12px", borderRadius: 5, fontWeight: 600 }}>2026</span>
      </div>
      {/* progress */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 46, height: 4, background: `${C.taupe}33`, borderRadius: 3 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: C.amber, borderRadius: 3 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- root */
export const Showreel: React.FC = () => {
  const seq = 165;
  const trans = 18;
  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={seq}><SceneIntro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: trans })} />
        <TransitionSeries.Sequence durationInFrames={seq}><SceneCountries /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: trans })} />
        <TransitionSeries.Sequence durationInFrames={seq}><SceneServices /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: trans })} />
        <TransitionSeries.Sequence durationInFrames={seq}><SceneStats /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: trans })} />
        <TransitionSeries.Sequence durationInFrames={seq}><SceneNetwork /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: trans })} />
        <TransitionSeries.Sequence durationInFrames={seq}><SceneOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
