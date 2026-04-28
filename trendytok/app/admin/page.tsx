"use client";
import { useState, useEffect } from "react";
import { Upload, Video, Package, Edit2, Trash2, Plus, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/Toast";
import AdminLoginGate from "@/components/admin/AdminLoginGate";

type Tab = "videos" | "products";

function AdminPanel() {
  const { t } = useStore();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("videos");
  const [videos, setVideos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [videoForm, setVideoForm] = useState({ seller: "", description_en: "", description_my: "", tags: "", trending_pct: "50", trending_label: "HOT" });
  const [productForm, setProductForm] = useState({ name_en: "", name_my: "", desc_en: "", desc_my: "", instruction_en: "", instruction_my: "", price_thb: "", category: "Fashion", emoji: "📦" });

  const fetchData = async () => {
    setLoading(true);
    const [{ data: vids }, { data: prods }] = await Promise.all([
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);
    setVideos(vids ?? []);
    setProducts(prods ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const postVideo = async () => {
    if (!videoForm.seller || !videoForm.description_en) { showToast("⚠️ Fill in required fields"); return; }
    const { error } = await supabase.from("videos").insert([{
      seller: videoForm.seller,
      description_en: videoForm.description_en,
      description_my: videoForm.description_my,
      tags: videoForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      trending_pct: parseInt(videoForm.trending_pct),
      trending_label: videoForm.trending_label,
      created_by: user?.id,
    }]);
    if (error) { showToast("❌ " + error.message); return; }
    showToast("✅ Video posted!");
    setVideoForm({ seller: "", description_en: "", description_my: "", tags: "", trending_pct: "50", trending_label: "HOT" });
    fetchData();
  };

  const postProduct = async () => {
    if (!productForm.name_en || !productForm.price_thb) { showToast("⚠️ Name & price required"); return; }
    const { error } = await supabase.from("products").insert([{
      name_en: productForm.name_en,
      name_my: productForm.name_my,
      desc_en: productForm.desc_en,
      desc_my: productForm.desc_my,
      instruction_en: productForm.instruction_en,
      instruction_my: productForm.instruction_my,
      price_thb: parseFloat(productForm.price_thb),
      category: productForm.category,
      emoji: productForm.emoji,
      created_by: user?.id,
    }]);
    if (error) { showToast("❌ " + error.message); return; }
    showToast("✅ Product added!");
    setProductForm({ name_en: "", name_my: "", desc_en: "", desc_my: "", instruction_en: "", instruction_my: "", price_thb: "", category: "Fashion", emoji: "📦" });
    fetchData();
  };

  const deleteVideo = async (id: string) => {
    await supabase.from("videos").delete().eq("id", id);
    showToast(t("Deleted", "ဖျက်ပြီး"));
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    showToast(t("Deleted", "ဖျက်ပြီး"));
    fetchData();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#22222E", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "11px 13px", color: "#F0F0F5",
    fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, outline: "none",
  };
  const label = (txt: string) => (
    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 0.5, textTransform: "uppercase" as const, marginBottom: 6 }}>{txt}</label>
  );
  const card = { background: "#1C1C26", borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 };

  // Stats
  const stats = [
    { num: videos.length, lbl: t("Videos","ဗီဒီယို") },
    { num: products.length, lbl: t("Products","ပစ္စည်း") },
    { num: videos.reduce((s,v)=>s+(v.views??0),0)||"—", lbl: t("Views","ကြည့်ရှု") },
  ];

  return (
    <div style={{ padding: "10px 16px 10px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {stats.map(({ num, lbl }) => (
          <div key={lbl} style={{ background: "#1C1C26", borderRadius: 16, padding: "14px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="font-display" style={{ fontSize: 26, color: "#FFD60A" }}>{num}</div>
            <div style={{ fontSize: 10, color: "#888899", fontWeight: 600, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#13131A", borderRadius: 12, padding: 4, marginBottom: 18 }}>
        {([["videos","🎬 Videos","🎬 ဗီဒီယို"],["products","📦 Products","📦 ပစ္စည်"]] as [Tab,string,string][]).map(([key,en,my]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
            border: "none", cursor: "pointer", transition: "all 0.2s",
            background: tab === key ? "#FF2D55" : "transparent",
            color: tab === key ? "#fff" : "#888899",
          }}>{t(en, my)}</button>
        ))}
      </div>

      {/* ── VIDEO TAB ── */}
      {tab === "videos" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              {t("POST NEW VIDEO","ဗီဒီယိုအသစ်တင်")}
            </div>
            {/* Upload zone */}
            <div style={{ border: "2px dashed rgba(255,45,85,0.3)", borderRadius: 16, padding: "22px 16px", textAlign: "center", marginBottom: 14, cursor: "pointer", background: "rgba(255,45,85,0.03)" }}>
              <Upload size={32} color="#FF2D55" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t("Upload Video File","ဗီဒီယိုဖိုင်တင်ပါ")}</div>
              <div style={{ fontSize: 11, color: "#888899" }}>MP4, MOV · Stored in Supabase Storage</div>
            </div>
            {[
              { lbl: t("Seller Handle","ရောင်းသူ"), key: "seller", ph: "@your_handle" },
              { lbl: t("Description (EN)","ဖော်ပြ (EN)"), key: "description_en", ph: "Video description..." },
              { lbl: t("Description (MM)","ဖော်ပြ (MM)"), key: "description_my", ph: "မြန်မာဖော်ပြချက်..." },
              { lbl: t("Tags (comma)","တဂ်များ"), key: "tags", ph: "#fashion, #beauty" },
              { lbl: "Trending %", key: "trending_pct", ph: "50" },
            ].map(({ lbl, key, ph }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                {label(lbl)}
                <input value={(videoForm as any)[key]} onChange={e => setVideoForm({ ...videoForm, [key]: e.target.value })} placeholder={ph} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              {label("Trending Label")}
              <select value={videoForm.trending_label} onChange={e => setVideoForm({ ...videoForm, trending_label: e.target.value })} style={{ ...inputStyle }}>
                {["HOT","WARM","COOL"].map(l => <option key={l} value={l} style={{ background: "#22222E" }}>{l}</option>)}
              </select>
            </div>
            <button onClick={postVideo} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Space Grotesk',sans-serif" }}>
              <Plus size={16} /> {t("Post Video","ဗီဒီယိုတင်")}
            </button>
          </div>

          {/* List */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase" }}>{t("ALL VIDEOS","ဗီဒီယိုများ")} ({videos.length})</div>
            <button onClick={fetchData} style={{ background: "none", border: "none", color: "#888899", cursor: "pointer" }}><RefreshCw size={14} /></button>
          </div>
          {loading && <div style={{ textAlign: "center", color: "#888899", padding: 20 }}>Loading…</div>}
          {videos.map(v => (
            <div key={v.id} style={{ background: "#1C1C26", borderRadius: 14, padding: 12, marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "#22222E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎬</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.seller}</div>
                <div style={{ fontSize: 10, color: "#888899", marginTop: 2 }}>🔥 {v.trending_pct}% {v.trending_label}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => showToast("Edit coming soon")} style={{ padding: "6px 9px", borderRadius: 8, border: "none", background: "rgba(0,201,255,0.15)", color: "#00C9FF", cursor: "pointer" }}><Edit2 size={12} /></button>
                <button onClick={() => deleteVideo(v.id)} style={{ padding: "6px 9px", borderRadius: 8, border: "none", background: "rgba(255,45,85,0.15)", color: "#FF2D55", cursor: "pointer" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {!loading && videos.length === 0 && <div style={{ textAlign: "center", color: "#888899", padding: 24, fontSize: 13 }}>{t("No videos yet","ဗီဒီယိုမရှိသေး")}</div>}
        </>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              {t("ADD PRODUCT","ပစ္စည်းထည့်")}
            </div>
            {[
              { lbl: t("Name (EN)","အမည် (EN)"), key: "name_en", ph: "e.g. Korean Handbag" },
              { lbl: t("Name (MM)","အမည် (MM)"), key: "name_my", ph: "မြန်မာ အမည်..." },
              { lbl: t("Description (EN)","ဖော်ပြ (EN)"), key: "desc_en", ph: "Product description..." },
              { lbl: t("Description (MM)","ဖော်ပြ (MM)"), key: "desc_my", ph: "မြန်မာ ဖော်ပြ..." },
              { lbl: t("Instructions (EN)","ညွှန် (EN)"), key: "instruction_en", ph: "How to order / use..." },
              { lbl: t("Instructions (MM)","ညွှန် (MM)"), key: "instruction_my", ph: "မြန်မာ ညွှန်..." },
              { lbl: t("Price (THB)","စျေး (THB)"), key: "price_thb", ph: "e.g. 1290" },
              { lbl: t("Emoji Icon","အိုင်ကွန်"), key: "emoji", ph: "📦" },
            ].map(({ lbl, key, ph }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                {label(lbl)}
                <input value={(productForm as any)[key]} onChange={e => setProductForm({ ...productForm, [key]: e.target.value })} placeholder={ph} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              {label(t("Category","အမျိုးအစား"))}
              <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ ...inputStyle }}>
                {["Fashion","Beauty","Electronics","Health"].map(c => <option key={c} value={c} style={{ background: "#22222E" }}>{c}</option>)}
              </select>
            </div>
            <button onClick={postProduct} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Space Grotesk',sans-serif" }}>
              <Plus size={16} /> {t("Add Product","ပစ္စည်းထည့်")}
            </button>
          </div>

          {/* List */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase" }}>{t("ALL PRODUCTS","ပစ္စည်းများ")} ({products.length})</div>
            <button onClick={fetchData} style={{ background: "none", border: "none", color: "#888899", cursor: "pointer" }}><RefreshCw size={14} /></button>
          </div>
          {loading && <div style={{ textAlign: "center", color: "#888899", padding: 20 }}>Loading…</div>}
          {products.map(p => (
            <div key={p.id} style={{ background: "#1C1C26", borderRadius: 14, padding: 12, marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "#22222E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name_en}</div>
                <div style={{ fontSize: 11, color: "#FFD60A", fontWeight: 700, marginTop: 2 }}>฿{Number(p.price_thb).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => showToast("Edit coming soon")} style={{ padding: "6px 9px", borderRadius: 8, border: "none", background: "rgba(0,201,255,0.15)", color: "#00C9FF", cursor: "pointer" }}><Edit2 size={12} /></button>
                <button onClick={() => deleteProduct(p.id)} style={{ padding: "6px 9px", borderRadius: 8, border: "none", background: "rgba(255,45,85,0.15)", color: "#FF2D55", cursor: "pointer" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {!loading && products.length === 0 && <div style={{ textAlign: "center", color: "#888899", padding: 24, fontSize: 13 }}>{t("No products yet","ပစ္စည်းမရှိသေး")}</div>}
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminLoginGate>
      <AdminPanel />
    </AdminLoginGate>
  );
}
export const dynamic = 'force-dynamic';
