"use client";
import { Heart, MessageCircle, Share2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import TrendingMeter from "@/components/ui/TrendingMeter";
import ProductTag from "@/components/ui/ProductTag";
import { VIDEOS } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { t } = useStore();
  return (
    <div className="snap-feed">
      {VIDEOS.map((video) => (
        <div key={video.id} className="snap-card" style={{ position: "relative", overflow: "hidden" }}>
          <div className={"bg-gradient-to-b " + video.bgColor} style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 120, opacity: 0.08 }}>{video.bgEmoji}</span>
          </div>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top,rgba(0,0,0,0.88) 30%,rgba(0,0,0,0.1) 60%,transparent 100%)",
          }} />
          <TrendingMeter pct={video.trendingPct} label={video.trendingLabel} />
          {video.products[0] && (
            <ProductTag name={video.products[0].name} price={video.products[0].price} emoji={video.products[0].emoji} style={{ top: "32%", left: "5%" }} />
          )}
          {video.products[1] && (
            <ProductTag name={video.products[1].name} price={video.products[1].price} emoji={video.products[1].emoji} style={{ top: "56%", right: "5%" }} delay />
          )}
          <div style={{ position: "absolute", right: 12, bottom: 100, zIndex: 10, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
              <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, background: "#FF2D55", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700, border: "2px solid #0A0A0F" }}>+</div>
            </div>
            {[{ icon: <Heart size={28} />, val: video.likes }, { icon: <MessageCircle size={28} />, val: video.comments }, { icon: <Share2 size={28} />, val: video.shares }].map(({ icon, val }, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                <div style={{ color: "#fff" }}>{icon}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{val}</span>
              </div>
            ))}
            <Link href="/products" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textDecoration: "none" }}>
              <ShoppingBag size={28} color="#FFD60A" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{t("Shop","ဝယ်")}</span>
            </Link>
          </div>
          <div style={{ position: "absolute", left: 12, bottom: 16, right: 70, zIndex: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{video.seller}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{t(video.description.en, video.description.my)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {video.tags.map((tag) => (<span key={tag} style={{ fontSize: 11, color: "#FFD60A", fontWeight: 600 }}>{tag}</span>))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
