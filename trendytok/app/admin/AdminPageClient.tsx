"use client";
import { useState, useEffect } from "react";
import { Video, Package, Trash2, Plus, RefreshCw, Link2 } from "lucide-react";
import { useStore } from "@/lib/store";

const ADMIN_PASSWORD = "Adminkweepaing1";

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("tt_admin") === "1") setUnlocked(true);
  }, []);

  const submit = () => {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem("tt_admin", "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", gap: 16, padding: "0 32px" }}>
      <div style={{ fontSize: 36 }}>🔐</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#F0F0F5" }}>Admin Access</div>
      <input
        type="password"
        placeholder="Enter password"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{ width: "100%", maxWidth: 320, background: "#1C1C26", border: `1px solid ${error ? "#FF2D55" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "13px 16px", color: "#F0F0F5", fontSize: 15, outline: "none", fontFamily: "'Space Grotesk',sans-serif" }}
        autoFocus
      />
      {error && <div style={{ fontSize: 12, color: "#FF2D55" }}>Wrong password</div>}
      <button onClick={submit} style={{ width: "100%", maxWidth: 320, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
        Enter
      </button>
    </div>
  );
}
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/Toast";


type Tab = "videos" | "products";

function AdminPanel() {
  const { t } = useStore();
  const [tab, setTab] = useState<Tab>("videos");
  const [videos, setVideos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyVideoForm = { seller: "", description_en: "", description_my: "", tags: "", video_url: "", trending_pct: "50", trending_label: "HOT", selectedProducts: [] as string[] };
  const [videoForm, setVideoForm] = useState(emptyVideoForm);

  const emptyProductForm = { name_en: "", name_my: "", desc_en: "", desc_my: "", instruction_en: "", instruction_my: "", price_thb: "", category: "Fashion", emoji: "📦" };
  const [productForm, setProductForm] = useState(emptyProductForm);

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

  const toggleProduct = (productId: string) => {
    setVideoForm((prev) => {
      const has = prev.selectedProducts.includes(productId);
      return { ...prev, selectedProducts: has ? prev.selectedProducts.filter(id => id !== productId) : [...prev.selectedProducts, productId] };
    });
  };

  const postVideo = async () => {
    if (!videoForm.seller || !videoForm.description_en) { showToast("⚠️ Seller & description required"); return; }
    const { data: newVideo, error } = await supabase.from("videos").insert([{
      seller: videoForm.seller,
      description_en: videoForm.description_en,
      description_my: videoForm.description_my,
      tags: videoForm.tags.split(",").map((tg: string) => tg.trim()).filter(Boolean),
      video_url: videoForm.video_url.trim() || null,
      trending_pct: parseInt(videoForm.trending_pct),
      trending_label: videoForm.trending_label,
      likes: 0, views: 0,
      created_by: null,
    }]).select().single();
    if (error) { showToast("❌ " + error.message); return; }
    if (videoForm.selectedProducts.length > 0 && newVideo) {
      const links = videoForm.selectedProducts.map(pid => ({ video_id: newVideo.id, product_id: pid }));
      await supabase.from("video_products").insert(links);
    }
    showToast("✅ Video posted!");
    setVideoForm(emptyVideoForm);
    fetchData();
  };

  const postProduct = async () => {
    if (!productForm.name_en || !productForm.price_thb) { showToast("⚠️ Name & price required"); return; }
    const { error } = await supabase.from("products").insert([{
      name_en: productForm.name_en, name_my: productForm.name_my,
      desc_en: productForm.desc_en, desc_my: productForm.desc_my,
      instruction_en: productForm.instruction_en, instruction_my: productForm.instruction_my,
      price_thb: parseFloat(productForm.price_thb),
      category: productForm.category, emoji: productForm.emoji,
    }]);
    if (error) { showToast("❌ " + error.message); return; }
    showToast("✅ Product added!");
    setProductForm(emptyProductForm);
    fetchData();
  };

  const deleteVideo = async (id: string) => {
    await supabase.from("video_products").delete().eq("video_id", id);
    await supabase.from("videos").delete().eq("id", id);
    showToast("Deleted"); fetchData();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("video_products").delete().eq("product_id", id);
    await supabase.from("products").delete().eq("id", id);
    showToast("Deleted"); fetchData();
  };

  const inp: React.CSSProperties = { width: "100%", background: "#22222E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", color: "#F0F0F5", fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, outline: "none" };
  const lbl = (txt: string) => <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#888899", letterSpacing: 0.5, textTransform: "uppercase" as const, marginBottom: 5 }}>{txt}</label>;
  const card: React.CSSProperties = { background: "#1C1C26", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 12 };

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
          <button key={tb} onClick={() => setTab(tb)} style={{
            flex: 1, padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif",
            background: tab === tb ? "#FF2D55" : "#1C1C26", color: tab === tb ? "#fff" : "#888899",
          }}>
            {tb === "videos" ? "🎬 Videos" : "📦 Products"}
          </button>
        ))}
        <button onClick={fetchData} style={{ padding: "10px 14px", borderRadius: 12, border: "none", background: "#1C1C26", color: "#888899", cursor: "pointer" }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── VIDEOS TAB ── */}
      {tab === "videos" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FF2D55", marginBottom: 12 }}>+ Add Video</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>{lbl("Seller handle")}<input style={inp} placeholder="@seller_name" value={videoForm.seller} onChange={e => setVideoForm(p => ({ ...p, seller: e.target.value }))} /></div>
              <div>{lbl("Description (EN)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} placeholder="English description..." value={videoForm.description_en} onChange={e => setVideoForm(p => ({ ...p, description_en: e.target.value }))} /></div>
              <div>{lbl("Description (Myanmar)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} placeholder="မြန်မာဖော်ပြချက်..." value={videoForm.description_my} onChange={e => setVideoForm(p => ({ ...p, description_my: e.target.value }))} /></div>
              <div>{lbl("Tags (comma separated)")}<input style={inp} placeholder="#fashion, #beauty" value={videoForm.tags} onChange={e => setVideoForm(p => ({ ...p, tags: e.target.value }))} /></div>
              <div>
                {lbl("Video Storage Path")}
                <input style={inp} placeholder="videos/filename.mp4" value={videoForm.video_url} onChange={e => setVideoForm(p => ({ ...p, video_url: e.target.value }))} />
                <div style={{ fontSize: 10, color: "#555566", marginTop: 3 }}>Upload file to Supabase Storage → videos/ bucket first, then paste path here</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Trending %")}<input style={inp} type="number" min="0" max="100" value={videoForm.trending_pct} onChange={e => setVideoForm(p => ({ ...p, trending_pct: e.target.value }))} /></div>
                <div style={{ flex: 1 }}>{lbl("Label")}<select style={inp} value={videoForm.trending_label} onChange={e => setVideoForm(p => ({ ...p, trending_label: e.target.value }))}><option>HOT</option><option>WARM</option><option>COOL</option></select></div>
              </div>

              {/* Attach Products */}
              <div>
                {lbl("Attach Products to this Video")}
                {products.length === 0
                  ? <div style={{ fontSize: 12, color: "#555566", padding: "8px 0" }}>No products yet — add products first</div>
                  : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      {products.map(p => {
                        const selected = videoForm.selectedProducts.includes(p.id);
                        return (
                          <button key={p.id} onClick={() => toggleProduct(p.id)} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                            background: selected ? "rgba(255,45,85,0.15)" : "rgba(255,255,255,0.04)",
                            border: selected ? "1px solid #FF2D55" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 10, cursor: "pointer", textAlign: "left",
                          }}>
                            <span style={{ fontSize: 18 }}>{p.emoji}</span>
                            <span style={{ fontSize: 12, color: "#F0F0F5", fontWeight: 600, flex: 1 }}>{p.name_en}</span>
                            <span style={{ fontSize: 11, color: "#FFD60A" }}>฿{p.price_thb}</span>
                            {selected && <Link2 size={12} color="#FF2D55" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
            <button onClick={postVideo} style={{ width: "100%", marginTop: 14, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>Post Video</button>
          </div>

          {videos.map(v => {
            const attached = (v.video_products || []).map((vp: any) => vp.products).filter(Boolean);
            return (
              <div key={v.id} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F5" }}>{v.seller}</div>
                    <div style={{ fontSize: 11, color: "#888899", marginTop: 2 }}>{v.description_en}</div>
                    {v.video_url && <div style={{ fontSize: 10, color: "#444455", marginTop: 3 }}>📹 {v.video_url}</div>}
                    <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: "#888899" }}>❤️ {v.likes || 0}</span>
                      <span style={{ fontSize: 10, color: "#888899" }}>👁️ {v.views || 0}</span>
                    </div>
                    {attached.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {attached.map((p: any) => (
                          <span key={p.id} style={{ fontSize: 10, background: "rgba(255,45,85,0.12)", color: "#FF2D55", borderRadius: 6, padding: "2px 7px" }}>{p.emoji} {p.name_en}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteVideo(v.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Trash2 size={16} color="#FF2D55" />
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FF2D55", marginBottom: 12 }}>+ Add Product</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Emoji")}<input style={inp} placeholder="📦" value={productForm.emoji} onChange={e => setProductForm(p => ({ ...p, emoji: e.target.value }))} /></div>
                <div style={{ flex: 3 }}>{lbl("Name (EN)")}<input style={inp} placeholder="Product name" value={productForm.name_en} onChange={e => setProductForm(p => ({ ...p, name_en: e.target.value }))} /></div>
              </div>
              <div>{lbl("Name (Myanmar)")}<input style={inp} placeholder="ကုန်ပစ္စည်းအမည်" value={productForm.name_my} onChange={e => setProductForm(p => ({ ...p, name_my: e.target.value }))} /></div>
              <div>{lbl("Description (EN)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={productForm.desc_en} onChange={e => setProductForm(p => ({ ...p, desc_en: e.target.value }))} /></div>
              <div>{lbl("Description (Myanmar)")}<textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={productForm.desc_my} onChange={e => setProductForm(p => ({ ...p, desc_my: e.target.value }))} /></div>
              <div>{lbl("Instructions (EN)")}<textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} placeholder="How to order, shipping info..." value={productForm.instruction_en} onChange={e => setProductForm(p => ({ ...p, instruction_en: e.target.value }))} /></div>
              <div>{lbl("Instructions (Myanmar)")}<textarea style={{ ...inp, minHeight: 50, resize: "vertical" }} value={productForm.instruction_my} onChange={e => setProductForm(p => ({ ...p, instruction_my: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>{lbl("Price (THB)")}<input style={inp} type="number" placeholder="0.00" value={productForm.price_thb} onChange={e => setProductForm(p => ({ ...p, price_thb: e.target.value }))} /></div>
                <div style={{ flex: 1 }}>{lbl("Category")}<select style={inp} value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}>{["Fashion", "Beauty", "Electronics", "Health"].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
            </div>
            <button onClick={postProduct} style={{ width: "100%", marginTop: 14, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>Add Product</button>
          </div>

          {products.map(p => (
            <div key={p.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 26 }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F0F5" }}>{p.name_en}</div>
                    <div style={{ fontSize: 11, color: "#888899", marginTop: 2 }}>{p.desc_en}</div>
                    <div style={{ fontSize: 13, color: "#FFD60A", marginTop: 4, fontWeight: 700 }}>฿{p.price_thb}</div>
                  </div>
                </div>
                <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Trash2 size={16} color="#FF2D55" />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function AdminPageClient() {
  return (
    <PasswordGate>
      <AdminPanel />
    </PasswordGate>
  );
}
