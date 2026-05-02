"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share2, ShoppingBag, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrendingMeter from "@/components/ui/TrendingMeter";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { THB_TO_MMK } from "@/lib/data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getVideoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export default function HomePage() {
  const { t } = useStore();
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from("videos")
      .select(`*, video_products ( product_id, products ( id, name_en, name_my, price_thb, emoji ) )`)
      .order("created_at", { ascending: false });
    if (!error && data) setVideos(data);
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  // TikTok-style: autoplay when 70% visible, pause when scrolled away
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
            vid.currentTime = 0;
          }
        });
      },
      { threshold: 0.7 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const setVideoRef = useCallback((el: HTMLVideoElement | null, videoId: string) => {
    if (el && !videoRefs.current[videoId]) {
      videoRefs.current[videoId] = el;
      observerRef.current?.observe(el);
    }
  }, []);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    Object.values(videoRefs.current).forEach((vid) => { if (vid) vid.muted = newMuted; });
  };

  const handleLike = async (videoId: string, currentLikes: number) => {
    const isLiked = likedVideos.has(videoId);
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    setLikedVideos((prev) => { const n = new Set(prev); isLiked ? n.delete(videoId) : n.add(videoId); return n; });
    await supabase.from("videos").update({ likes: newLikes }).eq("id", videoId);
    setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, likes: newLikes } : v));
  };

  const handleView = async (videoId: string, currentViews: number) => {
    await supabase.from("videos").update({ views: currentViews + 1 }).eq("id", videoId);
  };

  if (videos.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: 12, color: "#888899" }}>
        <div style={{ fontSize: 48 }}>🎬</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>No videos yet</div>
        <div style={{ fontSize: 13 }}>Admin can add videos from the admin panel</div>
      </div>
    );
  }

  return (
    <div className="snap-feed">
      <button onClick={toggleMute} style={{
        position: "fixed", top: 70, right: 16, zIndex: 100,
        width: 38, height: 38, borderRadius: "50%",
        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", backdropFilter: "blur(8px)",
      }}>
        {muted ? <VolumeX size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
      </button>

      {videos.map((video) => {
        const videoUrl = getVideoUrl(video.video_url);
        const isLiked = likedVideos.has(video.id);
        const attachedProducts: any[] = (video.video_products || []).map((vp: any) => vp.products).filter(Boolean);
        const mmk = (n: number) => Math.round(n * THB_TO_MMK).toLocaleString();

        return (
          <div key={video.id} className="snap-card" style={{ position: "relative", overflow: "hidden", background: "#0A0A0F" }}>
            {videoUrl ? (
              <video
                ref={(el) => setVideoRef(el, video.id)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 1 }}
                loop muted={muted} playsInline preload="metadata"
                onPlay={() => handleView(video.id, video.views || 0)}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1C1C26,#22222E)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                <div style={{ textAlign: "center", color: "#888899" }}>
                  <div style={{ fontSize: 48 }}>🎬</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>No video uploaded yet</div>
                </div>
              </div>
            )}

            <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

            {video.trending_pct > 0 && <TrendingMeter pct={video.trending_pct} label={video.trending_label || "HOT"} />}

            {/* Attached product tags */}
            {attachedProducts.slice(0, 2).map((product: any, i: number) => (
              <button key={product.id} onClick={() => router.push(`/products#${product.id}`)} style={{
                position: "absolute",
                top: i === 0 ? "32%" : "50%",
                left: i === 0 ? "5%" : undefined,
                right: i === 1 ? "5%" : undefined,
                zIndex: 6,
                background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "6px 12px",
                display: "flex", alignItems: "center", gap: 6,
                cursor: "pointer", backdropFilter: "blur(8px)",
              }}>
                <span style={{ fontSize: 16 }}>{product.emoji}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{product.name_en}</div>
                  <div style={{ fontSize: 10, color: "#FFD60A" }}>฿{product.price_thb} · {mmk(product.price_thb)}</div>
                </div>
              </button>
            ))}

            <div style={{ position: "absolute", right: 12, bottom: 110, zIndex: 10, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }} onClick={() => handleLike(video.id, video.likes || 0)}>
                <Heart size={28} color={isLiked ? "#FF2D55" : "#fff"} fill={isLiked ? "#FF2D55" : "none"} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                  {(video.likes || 0) > 999 ? ((video.likes) / 1000).toFixed(1) + "K" : (video.likes || 0)}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <MessageCircle size={28} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{video.comments || 0}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Share2 size={28} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{video.shares || 0}</span>
              </div>
              <Link href="/products" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textDecoration: "none" }}>
                <ShoppingBag size={28} color="#FFD60A" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{t("Shop", "ဝယ်")}</span>
              </Link>
            </div>

            <div style={{ position: "absolute", left: 12, bottom: 20, right: 70, zIndex: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{video.seller}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.45, marginBottom: 6 }}>
                {t(video.description_en || "", video.description_my || "")}
              </div>
              {video.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {video.tags.map((tag: string) => <span key={tag} style={{ fontSize: 11, color: "#FFD60A", fontWeight: 600 }}>{tag}</span>)}
                </div>
              )}
              <div style={{ fontSize: 10, color: "#666677", marginTop: 4 }}>👁️ {video.views || 0} views</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const dynamic = "force-dynamic";
