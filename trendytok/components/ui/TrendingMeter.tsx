"use client";

interface Props {
  pct: number;
  label: "HOT" | "WARM" | "COOL";
}

const config = {
  HOT:  { color: "#FF2D55", emoji: "🔥", bar: "linear-gradient(90deg,#FF2D55,#FF6B35)" },
  WARM: { color: "#FF6B35", emoji: "⚡", bar: "linear-gradient(90deg,#FF6B35,#FFD60A)" },
  COOL: { color: "#00C9FF", emoji: "💧", bar: "linear-gradient(90deg,#00C9FF,#0099ff)" },
};

export default function TrendingMeter({ pct, label }: Props) {
  const c = config[label];
  return (
    <div style={{
      position: "absolute", top: 16, left: 16, zIndex: 10,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)",
      borderRadius: 16, padding: "8px 12px",
      border: `1px solid ${c.color}44`,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#888899", letterSpacing: 1, textTransform: "uppercase" }}>
        Trending
      </div>
      <div style={{ width: 100, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, margin: "4px 0 3px" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: c.bar, transition: "width 0.5s" }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: c.color }}>
        {c.emoji} {pct}% {label}
      </div>
    </div>
  );
}
