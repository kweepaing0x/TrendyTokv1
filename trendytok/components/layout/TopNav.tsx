"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";

export default function TopNav() {
  const { lang, setLang, cartCount } = useStore();

  return (
    <nav style={{
      position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, height: 60,
      background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", zIndex: 100,
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <span className="font-display" style={{
          fontSize: 28, letterSpacing: 2,
          background: "linear-gradient(90deg,#FF2D55,#FF6B35,#FFD60A)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>TrendyTok</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/cart" style={{ position: "relative", color: "#888899", display: "flex" }}>
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6,
              width: 16, height: 16, background: "#FF2D55", borderRadius: "50%",
              fontSize: 9, fontWeight: 800, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{cartCount}</span>
          )}
        </Link>

        <div style={{ display: "flex", gap: 4 }}>
          {(["en", "my"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              border: "1px solid", cursor: "pointer", transition: "all 0.2s",
              borderColor: lang === l ? "#FF2D55" : "rgba(255,255,255,0.08)",
              background: lang === l ? "#FF2D55" : "transparent",
              color: lang === l ? "#fff" : "#888899",
            }}>
              {l === "en" ? "EN" : "MM"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
