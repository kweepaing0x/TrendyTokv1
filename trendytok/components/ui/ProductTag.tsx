"use client";
import Link from "next/link";

interface Props {
  name: string;
  price: number;
  emoji: string;
  style?: React.CSSProperties;
  delay?: boolean;
}

export default function ProductTag({ name, price, emoji, style, delay }: Props) {
  return (
    <Link href="/products" style={{ textDecoration: "none", position: "absolute", zIndex: 10, ...style }}>
      <div className={delay ? "float-tag-delay" : "float-tag"}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: 24,
          padding: "6px 12px 6px 6px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "2px solid #FF2D55",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>{emoji}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{name}</div>
            <div style={{ fontSize: 10, color: "#FFD60A", fontWeight: 600 }}>฿{price.toLocaleString()}</div>
          </div>
          <div className="pulse-dot" style={{
            width: 8, height: 8, borderRadius: "50%", background: "#00E096",
            boxShadow: "0 0 8px #00E096",
          }} />
        </div>
      </div>
    </Link>
  );
}
