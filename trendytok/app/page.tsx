"use client";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrendingMeter from "@/components/ui/TrendingMeter";
import ProductTag from "@/components/ui/ProductTag";
import { VIDEOS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const { t } = useStore();
  const router = useRouter();
  const [videoData, setVideoData] = useState<Record<string, any>>({});
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  // Fetch real video data from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from("videos").select("*");
      if (!error && data) {
        const dataMap = data.reduce((acc: any, v: any) => {
          acc[v.id] = v;
          return acc;
        }, {});
        setVideoData(dataMap);
      }
    };
    fetchVideos();
  }, []);

  const handleLike = async (videoId: string) => {
    const isLiked = likedVideos.has(videoId);
    
    if (isLiked) {
      setLikedVideos(prev => new Set([...prev].filter(id => id !== videoId)));
      // Decrease likes in DB
      await supabase.from("videos").update({ likes: (videoData[videoId]?.likes || 0) - 1 }).eq("id", videoId);
    } else {
      setLikedVideos(prev => new Set([...prev, videoId]));
      // Increase likes in DB
      await supabase.from("videos").update({ likes: (videoData[videoId]?.likes || 0) + 1 }).eq("id", videoId);
    }
  };

  const handleView = async (videoId: string) => {
    // Increment views
    const currentViews = videoData[videoId]?.views || 0;
    await supabase.from("videos").update({ views: currentViews + 1 }).eq("id", videoId);
  };

  return (
    <div className="snap-feed" onScroll={() => {}}>
      {VIDEOS.map((video) => {
        const dbVideo = videoData[video.id];
        const likes = dbVideo?.likes || 0;
        const views = dbVideo?.views || 0;
        const isLiked = likedVideos.has(video.id);

        return (
          <div 
            key={video.id} 
            className="snap-card" 
            style={{ position: "relative", overflow: "hidden" }}
            onMouseEnter={() => handleView(video.id)}
          >
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
              <div onClick={() => router.push(`/products#${video.products[0].name.replace(/\s+/g, '-')}`)}>
                <ProductTag name={video.products[0].name} price={video.products[0].price} emoji={video.products[0].emoji} style={{ top: "32%", left: "5%" }} />
              </div>
            )}
            {video.products[1] && (
              <div onClick={() => router.push(`/products#${video.products[1].name.replace(/\s+/g, '-')}`)}>
                <ProductTag name={video.products[1].name} price={video.products[1].price} emoji={video.products[1].emoji} style={{ top: "56%", right: "5%" }} delay />
              </div>
            )}
            <div style={{ position: "absolute", right: 12, bottom: 100, zIndex: 10, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }} onClick={() => handleLike(video.id)}>
                <div style={{ color: isLiked ? "#FF2D55" : "#fff" }}>
                  <Heart size={28} fill={isLiked ? "#FF2D55" : "none"} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{likes > 0 ? (likes > 999 ? (likes / 1000).toFixed(1) + 'K' : likes) : 0}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                <div style={{ color: "#fff" }}><MessageCircle size={28} /></div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{video.comments}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                <div style={{ color: "#fff" }}><Share2 size={28} /></div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{video.shares}</span>
              </div>
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
              <div style={{ fontSize: 10, color: "#888899", marginTop: 4 }}>👁️ {views} views</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
