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

/* ------------------------------------------------------------------ timing
   8 scenes joined by 7 cross-fades. Because a TransitionSeries transition
   overlaps the two sequences it sits between, the real runtime is
   SEQ * SCENES - TRANS * (SCENES - 1). Root.tsx imports TOTAL_FRAMES so the
   composition length can never drift out of sync with the scene list.      */
export const FPS = 30;
const SEQ = 185;
const TRANS = 18;
const SCENES = 8;
export const TOTAL_FRAMES = SEQ * SCENES - TRANS * (SCENES - 1); // 1354 ≈ 45.1s

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

const Overline: React.FC<{ frame: number; children: React.ReactNode; mb?: number }> = ({
  frame,
  children,
  mb = 46,
}) => (
  <div
    style={{
      ...fadeUp(frame, 2),
      fontFamily: space.fontFamily,
      fontSize: 22,
      letterSpacing: 8,
      color: C.amber,
      textTransform: "uppercase",
      marginBottom: mb,
    }}
  >
    {children}
  </div>
);

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

/* --------------------------------------------------- 01 · intro / identity */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 32 }}>
      <div style={{ transform: `scale(${0.4 + pop * 0.6})`, filter: `drop-shadow(0 18px 50px ${C.amber}44)` }}>
        <Starburst size={260} spin={0.9} />
      </div>
      <div style={{ ...fadeUp(frame, 18), fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 104, letterSpacing: 6, color: C.cream }}>
        AOMOTU<span style={{ color: C.amber }}>.INC</span>
      </div>
      <div style={{ ...fadeUp(frame, 42), fontFamily: outfit.fontFamily, fontWeight: 300, fontSize: 44, letterSpacing: 2, color: C.amberHi }}>
        When Tradition Meets Innovation
      </div>
      <div style={{ ...fadeUp(frame, 62), fontFamily: space.fontFamily, fontSize: 20, letterSpacing: 6, color: C.taupe, textTransform: "uppercase", marginTop: 4 }}>
        Advertising · Marketing · Outsourcing · Manufacturing · Printing · Trading
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ 02 · who we are / network */
const CHIPS = ["DIGITAL", "OUTSOURCING", "MANUFACTURING", "PRINTING", "GIVEAWAYS", "TRADING"];

const SceneWhoWeAre: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920, H = 1080;
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    x: 240 + random(`x${i}`) * (W - 480),
    y: 240 + random(`y${i}`) * (H - 480),
    gold: random(`g${i}`) > 0.55,
    r: 6 + random(`r${i}`) * 8,
  }));
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
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
        <Overline frame={frame} mb={34}>Who we are</Overline>
        <div
          style={{
            ...fadeUp(frame, 20, 34),
            fontFamily: outfit.fontFamily,
            fontWeight: 600,
            fontSize: 76,
            lineHeight: 1.18,
            color: C.cream,
            textAlign: "center",
            maxWidth: 1420,
            textShadow: `0 8px 40px ${C.espressoDeep}`,
          }}
        >
          Where digital imagination<br />meets real-world outcomes.
        </div>
        <div
          style={{
            ...fadeUp(frame, 44, 26),
            fontFamily: space.fontFamily,
            fontSize: 26,
            lineHeight: 1.6,
            color: C.taupe,
            textAlign: "center",
            maxWidth: 1080,
            marginTop: 28,
          }}
        >
          One multi-service ecosystem bridging digital creativity and physical brand execution.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 44, maxWidth: 1300 }}>
          {CHIPS.map((c, i) => (
            <span
              key={c}
              style={{
                ...fadeUp(frame, 52 + i * 5, 16, 16),
                fontFamily: space.fontFamily,
                fontSize: 19,
                letterSpacing: 3,
                color: C.amberHi,
                padding: "10px 22px",
                borderRadius: 40,
                border: `1px solid ${C.amber}55`,
                background: `${C.espressoDeep}aa`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- 03 · 16 countries */
const SceneCountries: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [8, 46], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Overline frame={frame} mb={8}>A borderless one-stop-shop</Overline>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
        <div style={{ fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 220, lineHeight: 1, color: C.cream, transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp", easing: ease })})` }}>
          {count}
        </div>
        <div style={{ fontFamily: outfit.fontFamily, fontWeight: 600, fontSize: 52, color: C.taupe, ...fadeUp(frame, 24) }}>
          countries
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 28px", maxWidth: 1560, marginTop: 36 }}>
        {COUNTRIES.map((name, i) => {
          const start = 30 + i * 3;
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

/* --------------------------------------------------- 04 · six divisions */
const DIVISIONS = [
  { n: "01", title: "Digital Marketing\n& Advertising", desc: "Social campaigns, SEO/SEM, content creation and brand strategy." },
  { n: "02", title: "Outsourcing\nServices", desc: "Customer support, back-office, IT & cloud, virtual assistance." },
  { n: "03", title: "Manufacturing\n& Offset Printing", desc: "Commercial printing, packaging design, large-scale production." },
  { n: "04", title: "Corporate\nGiveaways", desc: "Promotional items, curated gift sets, event merchandise." },
  { n: "05", title: "Trading\n& Distribution", desc: "Import/export, logistics, retail partnerships, supply chain." },
  { n: "06", title: "Creative, Production\n& Events", desc: "Key visuals, TVC and digital ads, activations, PR, talent." },
];

const SceneDivisions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Overline frame={frame} mb={40}>What we do</Overline>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 500px)",
          gap: 28,
        }}
      >
        {DIVISIONS.map((d, i) => {
          const start = 12 + i * 9;
          return (
            <div
              key={d.n}
              style={{
                ...fadeUp(frame, start, 34),
                padding: "30px 32px",
                borderRadius: 18,
                background: `linear-gradient(160deg, ${C.slate}66, ${C.espressoDeep}cc)`,
                border: `1px solid ${C.taupe}22`,
                minHeight: 250,
              }}
            >
              <div style={{ fontFamily: space.fontFamily, fontSize: 17, color: C.amber, letterSpacing: 3, marginBottom: 18 }}>{d.n}</div>
              <div style={{ fontFamily: outfit.fontFamily, fontWeight: 600, fontSize: 35, color: C.cream, marginBottom: 16, lineHeight: 1.12, whiteSpace: "pre-line" }}>
                {d.title}
              </div>
              <div style={{ fontFamily: space.fontFamily, fontSize: 19, color: C.taupe, lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 05 · the USP */
const USP_LINES = [
  { text: "We make it.", hi: false },
  { text: "We print it.", hi: false },
  { text: "We package it.", hi: false },
  { text: "We exchange it into reality.", hi: true },
];

const SceneUSP: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Overline frame={frame} mb={26}>Unique selling point</Overline>
      <div
        style={{
          ...fadeUp(frame, 14, 26),
          fontFamily: space.fontFamily,
          fontSize: 27,
          color: C.taupe,
          textAlign: "center",
          maxWidth: 1160,
          lineHeight: 1.55,
          marginBottom: 52,
        }}
      >
        We don&rsquo;t simply sell your concept or market your vision.
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {USP_LINES.map((l, i) => {
          const start = 22 + i * 15;
          return (
            <div
              key={l.text}
              style={{
                ...fadeUp(frame, start, 30, 18),
                fontFamily: outfit.fontFamily,
                fontWeight: l.hi ? 700 : 600,
                fontSize: l.hi ? 82 : 74,
                lineHeight: 1.12,
                color: l.hi ? C.amberHi : C.cream,
                textShadow: l.hi ? `0 10px 44px ${C.amber}44` : "none",
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------- 06 · the numbers */
const STATS = [
  { value: 16, suffix: "", label: "Countries Served", count: true },
  { value: 2023, suffix: "", label: "Ecosystem Launched", count: false },
  { value: 12, suffix: "", label: "Service Divisions", count: true },
];

const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Overline frame={frame} mb={56}>By the numbers</Overline>
      <div style={{ display: "flex", gap: 120 }}>
        {STATS.map((s, i) => {
          const start = 12 + i * 12;
          // A year should never tick up from zero — it fades and settles instead.
          const shown = s.count
            ? Math.round(
                interpolate(frame, [start, start + 40], [0, s.value], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: ease,
                })
              )
            : s.value;
          const settle = s.count
            ? 1
            : interpolate(frame, [start, start + 34], [1.14, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: ease,
              });
          return (
            <div key={s.label} style={{ ...fadeUp(frame, start, 30), textAlign: "center" }}>
              <div
                style={{
                  fontFamily: outfit.fontFamily,
                  fontWeight: 700,
                  fontSize: 130,
                  lineHeight: 1,
                  color: C.amberHi,
                  transform: `scale(${settle})`,
                }}
              >
                {shown}{s.suffix}
              </div>
              <div style={{ fontFamily: space.fontFamily, fontSize: 22, letterSpacing: 3, color: C.taupe, textTransform: "uppercase", marginTop: 14 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 07 · clients */
const CLIENTS = [
  { name: "Product de Jamaica", meta: "Because you deserve the best" },
  { name: "StatusSymbol", meta: "House of Printing Co." },
  { name: "The Generals Brand", meta: "Toll Manufacturing" },
  { name: "Jo Galvez", meta: "Parfum" },
  { name: "GeBBS", meta: "Healthcare Solutions" },
  { name: "First Philec", meta: "Energy & Electronics" },
  { name: "Lionbridge", meta: "Localisation & Language" },
  { name: "HC Arnoldi", meta: "Gem Lapidaries" },
  { name: "Schauerte", meta: "Präzisionsdrehtechnik" },
  { name: "Elevated Play", meta: "Play & Entertainment" },
  { name: "Villa Pétrusse", meta: "Luxembourg" },
  { name: "Asia Brewery", meta: "Incorporated" },
];

const SceneClients: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Overline frame={frame} mb={40}>Portfolio highlights</Overline>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 396px)", gap: 22 }}>
        {CLIENTS.map((c, i) => {
          const start = 10 + i * 5;
          return (
            <div
              key={c.name}
              style={{
                ...fadeUp(frame, start, 24, 18),
                padding: "26px 22px",
                borderRadius: 14,
                background: `linear-gradient(160deg, ${C.slate}4d, ${C.espressoDeep}bb)`,
                border: `1px solid ${C.taupe}1f`,
                textAlign: "center",
                minHeight: 116,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div style={{ fontFamily: outfit.fontFamily, fontWeight: 600, fontSize: 30, color: C.cream, lineHeight: 1.15 }}>{c.name}</div>
              <div style={{ fontFamily: space.fontFamily, fontSize: 15, letterSpacing: 2, color: C.taupe, textTransform: "uppercase", lineHeight: 1.4 }}>{c.meta}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- 08 · outro */
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
      <div style={{ transform: `scale(${0.5 + pop * 0.5})`, filter: `drop-shadow(0 18px 50px ${C.amber}55)` }}>
        <Starburst size={190} spin={1.1} />
      </div>
      <div style={{ ...fadeUp(frame, 14), fontFamily: outfit.fontFamily, fontWeight: 700, fontSize: 92, letterSpacing: 6, color: C.cream }}>
        AOMOTU<span style={{ color: C.amber }}>.INC</span>
      </div>
      <div style={{ ...fadeUp(frame, 32), fontFamily: outfit.fontFamily, fontWeight: 300, fontSize: 38, letterSpacing: 2, color: C.amberHi }}>
        When Tradition Meets Innovation
      </div>

      <div style={{ ...fadeUp(frame, 48), width: 340, height: 1, background: `${C.taupe}55`, marginTop: 14, marginBottom: 4 }} />

      <div style={{ ...fadeUp(frame, 56), fontFamily: space.fontFamily, fontSize: 26, letterSpacing: 2, color: C.amber }}>
        acquireinfodesk@aomotu.com&nbsp;&nbsp;·&nbsp;&nbsp;+63 960 656 4910
      </div>
      <div style={{ ...fadeUp(frame, 70), fontFamily: space.fontFamily, fontSize: 20, letterSpacing: 2, color: C.taupe, textAlign: "center" }}>
        Sugi Tower, Kai Garden · M. Vicente St., Malamig · Mandaluyong City, Philippines
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
      {/* Top label. Both parts stay left-aligned: when this plays inside the
          site's showreel modal, a top-right badge lands under the close button. */}
      <div style={{ position: "absolute", top: 40, left: 56, right: 56, display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 16, fontFamily: space.fontFamily }}>
        <span style={{ fontSize: 18, letterSpacing: 3, color: C.taupe }}>AOMOTU&nbsp;//&nbsp;COMPANY PROFILE SHOWREEL</span>
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
const SCENE_LIST: React.FC[] = [
  SceneIntro,
  SceneWhoWeAre,
  SceneCountries,
  SceneDivisions,
  SceneUSP,
  SceneStats,
  SceneClients,
  SceneOutro,
];

export const Showreel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso }}>
      <Background />
      <TransitionSeries>
        {SCENE_LIST.map((Scene, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANS })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={SEQ}>
              <Scene />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
