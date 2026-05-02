"use client";
import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, RefreshCw, Link2, X, Edit2, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/Toast";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ADMIN_PASSWORD = "Adminkweepaing1";

// ─── helpers ────────────────────────────────────────────────────
function pubUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
}

async function uploadFile(bucket: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: false });
  if (error) { showToast("❌ Upload: " + error.message); return null; }
  return `${bucket}/${name}`;
}

// ─── password gate ────────────────────────────────────────────
function PasswordGate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => { if (sessionStorage.getItem("tt_admin") === "1") setUnlocked(true); }, []);
  const submit = () => {
    if (input === ADMIN_PASSWORD) { sessionStorage.setItem("tt_admin", "1"); setUnlocked(true); }
    else { setError(true); setInput(""); }
  };
  if (unlocked) return <>{children}</>;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: 16, padding: "0 32px" }}>
      <div style={{ fontSize: 36 }}>🔐</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#F0F0F5" }}>Admin Access</div>
      <input type="password" placeholder="Enter password" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
        style={{ width: "100%", maxWidth: 320, background: "#1C1C26", border: `1px solid ${error ? "#FF2D55" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "13px 16px", color: "#F0F0F5", fontSize: 15, outline: "none", fontFamily: "'Space Grotesk',sans-serif" }} autoFocus />
      {error && <div style={{ fontSize: 12, color: "#FF2D55" }}>Wrong password</div>}
      <button onClick={submit} style={{ width: "100%", maxWidth: 320, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>Enter</button>
    </div>
  );
}

// ─── shared styles ────────────────────────────────────────────
const inp: React.CSSProperties = { width: "100%", background: "#22222E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", color: "#F0F0F5", fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" };
const card: React.CSSProperties = { background: "#1C1C26", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 12 };
const lbl = (txt: string) => <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#888899", letterSpacing: 0.5, textTransform: "uppercase" as const, marginBottom: 5 }}>{txt}</label>;
const btn = (label: string, onClick: () => void, accent = false) => (
  <button onClick={onClick} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: accent ? "linear-gradient(135deg,#FF2D55,#FF6B35)" : "#22222E", color: accent ? "#fff" : "#888899", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>{label}</button>
);

type Tab = "videos" | "products";

// ─── video form ───────────────────────────────────────────────
const emptyVF = () => ({ seller: "", description_en: "", description_my: "", tags: "", video_url: "", trending_pct: "50", trending_label: "HOT", selectedProducts: [] as string[] });

// ─── product form ─────────────────────────────────────────────
const emptyPF = () => ({ name_en: "", name_my: "", desc_en: "", desc_my: "", instruction_en: "", instruction_my: "", price_thb: "", category: "Fashion", emoji: "📦", badge: "", badge_color: "#FF2D55" });

// ═══════════════════════════════════════════════════════════════
function AdminPanel() {
  const { t } = useStore();
  const [tab, setTab] = useState<Tab>("videos");
  const [videos, setVideos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // video form state
  const [vf, setVf] = useState(emptyVF());
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const videoFileRef = useRef<HTMLInputElement>(null);

  // product form state
  const [pf, setPf] = useState(emptyPF());
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]); // paths uploaded but not saved yet
  const photoFileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: vids }, { data: prods }] = await Promise.all([
      supabase.from("videos").select("*, video_products(product_id, products(id, name_en, emoji))").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);
    setVideos(vids ?? []);
    setProducts(prods ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── video file upload ──
  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setVideoUploading(true);
    const path = await uploadFile("videos", file);
    if (path) { setVf(p => ({ ...p, video_url: path })); showToast("✅ Video uploaded!"); }
    setVideoUploading(false);
    e.target.value = "";
  };

  // ── product photo upload (multi) ──
  const handlePhotoFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setPhotoUploading(true);
    const paths: string[] = [];
    for (const file of files) {
      const path = await uploadFile("products", file);
      if (path) paths.push(path);
    }
    setPendingPhotos(prev => [...prev, ...paths]);
    if (paths.length) showToast(`✅ ${paths.length} photo(s) uploaded`);
    setPhotoUploading(false);
    e.target.value = "";
  };

  // ── post / update video ──
  const saveVideo = async () => {
    if (!vf.seller || !vf.description_en) { showToast("⚠️ Seller & description required"); return; }
    const payload = {
      seller: vf.seller,
      description_en: vf.description_en,
      description_my: vf.description_my,
      tags: vf.tags.split(",").map((tg: string) => tg.trim()).filter(Boolean),
      video_url: vf.video_url.trim() || null,
      trending_pct: parseInt(vf.trending_pct),
      trending_label: vf.trending_label,
    };

    if (editingVideo) {
      const { error } = await supabase.from("videos").update(payload).eq("id", editingVideo);
      if (error) { showToast("❌ " + error.message); return; }
      // re-link products
      await supabase.from("video_products").delete().eq("video_id", editingVideo);
      if (vf.selectedProducts.length > 0) {
        await supabase.from("video_products").insert(vf.selectedProducts.map(pid => ({ video_id: editingVideo, product_id: pid })));
      }
      showToast("✅ Video updated!");
      setEditingVideo(null);
    } else {
      const { data: newV, error } = await supabase.from("videos").insert([{ ...payload, likes: 0, views: 0 }]).select().single();
      if (error) { showToast("❌ " + error.message); return; }
      if (vf.selectedProducts.length > 0 && newV) {
        await supabase.from("video_products").insert(vf.selectedProducts.map(pid => ({ video_id: newV.id, product_id: pid })));
      }
      showToast("✅ Video posted!");
    }
    setVf(emptyVF());
    fetchData();
  };

  const startEditVideo = (v: any) => {
    const attached = (v.video_products || []).map((vp: any) => vp.product_id).filter(Boolean);
    setVf({ seller: v.seller, description_en: v.description_en || "", description_my: v.description_my || "", tags: (v.tags || []).join(", "), video_url: v.video_url || "", trending_pct: String(v.trending_pct ?? 50), trending_label: v.trending_label || "HOT", selectedProducts: attached });
    setEditingVideo(v.id);
    setTab("videos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteVideo = async (id: string) => {
    await supabase.from("video_products").delete().eq("video_id", id);
    await supabase.from("videos").delete().eq("id", id);
    showToast("Deleted"); fetchData();
  };

  // ── post / update product ──
  const saveProduct = async () => {
    if (!pf.name_en || !pf.price_thb) { showToast("⚠️ Name & price required"); return; }
    const payload: any = {
      name_en: pf.name_en, name_my: pf.name_my,
      desc_en: pf.desc_en, desc_my: pf.desc_my,
      instruction_en: pf.instruction_en, instruction_my: pf.instruction_my,
      price_thb: parseFloat(pf.price_thb),
      category: pf.category, emoji: pf.emoji,
      badge: pf.badge || null, badge_color: pf.badge_color || null,
    };
    if (pendingPhotos.length > 0) payload.photos = pendingPhotos;

    if (editingProduct) {
      // merge photos: keep existing + add new
      const existing = products.find(p => p.id === editingProduct);
      const existingPhotos: string[] = existing?.photos ?? [];
      if (pendingPhotos.length > 0) payload.photos = [...existingPhotos, ...pendingPhotos];
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct);
      if (error) { showToast("❌ " + error.message); return; }
      showToast("✅ Product updated!");
      setEditingProduct(null);
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) { showToast("❌ " + error.message); return; }
      showToast("✅ Product added!");
    }
    setPf(emptyPF());
    setPendingPhotos([]);
    fetchData();
  };

  const startEditProduct = (p: any) => {
    setPf({ name_en: p.name_en || "", name_my: p.name_my || "", desc_en: p.desc_en || "", desc_my: p.desc_my || "", instruction_en: p.instruction_en || "", instruction_my: p.instruction_my || "", price_thb: String(p.price_thb ?? ""), category: p.category || "Fashion", emoji: p.emoji || "📦", badge: p.badge || "", badge_color: p.badge_color || "#FF2D55" });
    setPendingPhotos([]);
    setEditingProduct(p.id);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProductPhoto = async (productId: string, path: string) => {
    const product = products.find(p => p.id === productId);
    const newPhotos = (product?.photos ?? []).filter((ph: string) => ph !== path);
    await supabase.from("products").update({ photos: newPhotos }).eq("id", productId);
    showToast("Photo removed"); fetchData();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("video_products").delete().eq("product_id", id);
    await supabase.from("products").delete().eq("id", id);
    showToast("Deleted"); fetchData();
  };

  const toggleProduct = (pid: string) => setVf(prev => {
    const has = prev.selectedProducts.includes(pid);
    return { ...prev, selectedProducts: has ? prev.selectedProducts.filter(id => id !== pid) : [...prev.selectedProducts, pid] };
  });

  const cancelEdit = () => { setEditingVideo(null); setEditingProduct(null); setVf(emptyVF()); setPf(emptyPF()); setPendingPhotos([]); };

  // ═══════════════════ RENDER ═══════════════════
  return (
    <div style={{ padding: "10px 14px", paddingBottom: 90 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        {[{ num: videos.length, lbl: "Videos" }, { num: products.length, lbl: "Products" }, { num: videos.reduce((s, v) => s + (v.views ?? 0), 0), lbl: "Views" }].map(s => (
          <div key={s.lbl} style={{ background: "#1C1C26", borderRadius: 14, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FF2D55" }}>{s.num}</div>
            <div style={{ fontSize: 10, color: "#888899", marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["videos", "products"] as Tab[]).map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif", background: tab === tb ? "#FF2D55" : "#1C1C26", color: tab === tb ? "#fff" : "#888899" }}>
            {tb === "videos" ? "🎬 Videos" : "📦 Products"}
          </button>
        ))}
        <button onClick={fetchData} style={{ padding: "10px 14px", borderRadius: 12, border: "none", background: "#1C1C26", color: "#888899", cursor: "pointer" }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ════ VIDEOS TAB ════ */}
      {tab === "videos" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FF2D55", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>{editingVideo ? "✏️ Edit Video" : "+ Add Video"}</span>
              {editingVideo && <button onClick={cancelEdit} style={{ background: "none", border: "none", color: "#888899", cursor: "pointer", fontSize: 12 }}>Cancel</button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>{lbl("Seller handle")}<input style={inp} placeholder="@seller_name" value={vf.seller} onChange={e => setVf(p => ({ ...p, seller: e.target.value }))} /></div>
              <div>{lbl("Description (EN)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={vf.description_en} onChange={e => setVf(p => ({ ...p, description_en: e.target.value }))} /></div>
              <div>{lbl("Description (Myanmar)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={vf.description_my} onChange={e => setVf(p => ({ ...p, description_my: e.target.value }))} /></div>
              <div>{lbl("Tags (comma separated)")}<input style={inp} placeholder="#fashion, #beauty" value={vf.tags} onChange={e => setVf(p => ({ ...p, tags: e.target.value }))} /></div>

              {/* Video upload */}
              <div>
                {lbl("Video File")}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input style={{ ...inp, flex: 1 }} placeholder="videos/filename.mp4" value={vf.video_url} onChange={e => setVf(p => ({ ...p, video_url: e.target.value }))} />
                  <button onClick={() => videoFileRef.current?.click()} disabled={videoUploading} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#FF2D55", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {videoUploading ? "..." : "Upload"}
                  </button>
                </div>
                <input ref={videoFileRef} type="file" accept="video/mp4,video/*" style={{ display: "none" }} onChange={handleVideoFile} />
                {vf.video_url && <div style={{ fontSize: 10, color: "#00C853", marginTop: 4 }}>✅ {vf.video_url}</div>}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Trending %")}<input style={inp} type="number" min="0" max="100" value={vf.trending_pct} onChange={e => setVf(p => ({ ...p, trending_pct: e.target.value }))} /></div>
                <div style={{ flex: 1 }}>{lbl("Label")}<select style={inp} value={vf.trending_label} onChange={e => setVf(p => ({ ...p, trending_label: e.target.value }))}><option>HOT</option><option>WARM</option><option>COOL</option></select></div>
              </div>

              {/* Attach products */}
              <div>
                {lbl("Attach Products")}
                {products.length === 0
                  ? <div style={{ fontSize: 12, color: "#555566", padding: "6px 0" }}>No products yet</div>
                  : products.map(p => {
                    const sel = vf.selectedProducts.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleProduct(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", width: "100%", marginBottom: 6, background: sel ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.04)", border: sel ? "1px solid #FF2D55" : "1px solid rgba(255,255,255,0.08)", borderRadius: 10, cursor: "pointer", textAlign: "left" }}>
                        <span style={{ fontSize: 18 }}>{p.emoji}</span>
                        <span style={{ fontSize: 12, color: "#F0F0F5", fontWeight: 600, flex: 1 }}>{p.name_en}</span>
                        <span style={{ fontSize: 11, color: "#FFD60A" }}>฿{p.price_thb}</span>
                        {sel && <Link2 size={12} color="#FF2D55" />}
                      </button>
                    );
                  })}
              </div>
            </div>
            <button onClick={saveVideo} style={{ width: "100%", marginTop: 14, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
              {editingVideo ? "Update Video" : "Post Video"}
            </button>
          </div>

          {/* Video list */}
          {videos.map(v => {
            const attached = (v.video_products || []).map((vp: any) => vp.products).filter(Boolean);
            const vidUrl = pubUrl(v.video_url);
            return (
              <div key={v.id} style={card}>
                {vidUrl && (
                  <video src={vidUrl} style={{ width: "100%", borderRadius: 10, maxHeight: 160, objectFit: "cover", marginBottom: 10 }} muted playsInline preload="metadata" />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F5" }}>{v.seller}</div>
                    <div style={{ fontSize: 11, color: "#888899", marginTop: 2 }}>{v.description_en}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: "#888899" }}>❤️ {v.likes || 0}</span>
                      <span style={{ fontSize: 10, color: "#888899" }}>👁️ {v.views || 0}</span>
                    </div>
                    {attached.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {attached.map((p: any) => <span key={p.id} style={{ fontSize: 10, background: "rgba(255,45,85,0.12)", color: "#FF2D55", borderRadius: 6, padding: "2px 7px" }}>{p.emoji} {p.name_en}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                    <button onClick={() => startEditVideo(v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Edit2 size={15} color="#888899" /></button>
                    <button onClick={() => deleteVideo(v.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash2 size={15} color="#FF2D55" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ════ PRODUCTS TAB ════ */}
      {tab === "products" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FF2D55", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>{editingProduct ? "✏️ Edit Product" : "+ Add Product"}</span>
              {editingProduct && <button onClick={cancelEdit} style={{ background: "none", border: "none", color: "#888899", cursor: "pointer", fontSize: 12 }}>Cancel</button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Emoji")}<input style={inp} placeholder="📦" value={pf.emoji} onChange={e => setPf(p => ({ ...p, emoji: e.target.value }))} /></div>
                <div style={{ flex: 3 }}>{lbl("Name (EN)")}<input style={inp} placeholder="Product name" value={pf.name_en} onChange={e => setPf(p => ({ ...p, name_en: e.target.value }))} /></div>
              </div>
              <div>{lbl("Name (Myanmar)")}<input style={inp} placeholder="ကုန်ပစ္စည်းအမည်" value={pf.name_my} onChange={e => setPf(p => ({ ...p, name_my: e.target.value }))} /></div>
              <div>{lbl("Description (EN)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={pf.desc_en} onChange={e => setPf(p => ({ ...p, desc_en: e.target.value }))} /></div>
              <div>{lbl("Description (Myanmar)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={pf.desc_my} onChange={e => setPf(p => ({ ...p, desc_my: e.target.value }))} /></div>
              <div>{lbl("Instructions (EN)")}<textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} placeholder="How to order, shipping..." value={pf.instruction_en} onChange={e => setPf(p => ({ ...p, instruction_en: e.target.value }))} /></div>
              <div>{lbl("Instructions (Myanmar)")}<textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} value={pf.instruction_my} onChange={e => setPf(p => ({ ...p, instruction_my: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Price (THB)")}<input style={inp} type="number" placeholder="0.00" value={pf.price_thb} onChange={e => setPf(p => ({ ...p, price_thb: e.target.value }))} /></div>
                <div style={{ flex: 1 }}>{lbl("Category")}<select style={inp} value={pf.category} onChange={e => setPf(p => ({ ...p, category: e.target.value }))}>{["Fashion", "Beauty", "Electronics", "Health"].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 2 }}>{lbl("Badge Text")}<input style={inp} placeholder="🔥 HOT" value={pf.badge} onChange={e => setPf(p => ({ ...p, badge: e.target.value }))} /></div>
                <div style={{ flex: 1 }}>{lbl("Badge Color")}<input style={inp} type="color" value={pf.badge_color} onChange={e => setPf(p => ({ ...p, badge_color: e.target.value }))} /></div>
              </div>

              {/* Photo upload */}
              <div>
                {lbl("Product Photos")}
                {/* Existing photos when editing */}
                {editingProduct && (() => {
                  const existing = products.find(p => p.id === editingProduct);
                  const photos: string[] = existing?.photos ?? [];
                  return photos.length > 0 ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {photos.map((ph: string) => (
                        <div key={ph} style={{ position: "relative" }}>
                          <img src={pubUrl(ph) ?? ""} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }} />
                          <button onClick={() => removeProductPhoto(editingProduct, ph)} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#FF2D55", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={11} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
                {/* Pending new photos */}
                {pendingPhotos.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    {pendingPhotos.map((ph, i) => (
                      <div key={ph} style={{ position: "relative" }}>
                        <img src={pubUrl(ph) ?? ""} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, opacity: 0.7 }} />
                        <button onClick={() => setPendingPhotos(prev => prev.filter((_, idx) => idx !== i))} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#888899", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={11} color="#fff" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => photoFileRef.current?.click()} disabled={photoUploading} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", color: "#888899", fontSize: 13, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
                  {photoUploading ? "Uploading..." : "📷 Upload Photos (multiple)"}
                </button>
                <input ref={photoFileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotoFiles} />
              </div>
            </div>
            <button onClick={saveProduct} style={{ width: "100%", marginTop: 14, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>

          {/* Product list */}
          {products.map(p => {
            const photos: string[] = p.photos ?? [];
            return (
              <div key={p.id} style={card}>
                {/* Photo strip */}
                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto" }}>
                    {photos.map((ph: string) => <img key={ph} src={pubUrl(ph) ?? ""} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />)}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, flex: 1 }}>
                    <span style={{ fontSize: 26 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F5" }}>{p.name_en}</div>
                      <div style={{ fontSize: 11, color: "#888899", marginTop: 2 }}>{p.desc_en}</div>
                      <div style={{ fontSize: 13, color: "#FFD60A", marginTop: 4, fontWeight: 700 }}>฿{p.price_thb}</div>
                      {p.badge && <span style={{ fontSize: 10, background: p.badge_color + "22", color: p.badge_color, borderRadius: 6, padding: "2px 7px", marginTop: 4, display: "inline-block" }}>{p.badge}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                    <button onClick={() => startEditProduct(p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Edit2 size={15} color="#888899" /></button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash2 size={15} color="#FF2D55" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default function AdminPageClient() {
  return <PasswordGate><AdminPanel /></PasswordGate>;
}
