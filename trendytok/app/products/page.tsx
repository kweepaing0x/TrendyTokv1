"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, THB_TO_MMK } from "@/lib/data";

export default function ProductsPage() {
  const { t } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data ?? []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Hash navigation — scroll to product on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && products.length > 0) {
      setTimeout(() => {
        document.getElementById(`product-${hash}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById(`product-${hash}`)?.classList.add("highlight-product");
      }, 150);
    }
  }, [products]);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.name_en?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openTelegram = (product: any) => {
    const mmk = Math.round(product.price_thb * THB_TO_MMK).toLocaleString();
    const msg = encodeURIComponent(`Hi! I want to order:\n🛍️ ${product.name_en}\n💰 ฿${product.price_thb} (${mmk} MMK)\n\nPlease confirm availability!`);
    window.open(`https://t.me/Trendytok88?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#888899" }}>
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "#888899" }}>
        <div style={{ fontSize: 48 }}>📦</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>No products yet</div>
        <div style={{ fontSize: 13 }}>Admin can add products from the admin panel</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 14px", paddingBottom: 90 }}>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={14} color="#888899" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ width: "100%", background: "#1C1C26", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px 10px 34px", color: "#F0F0F5", fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, outline: "none" }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: activeCategory === cat ? "#FF2D55" : "#1C1C26",
            color: activeCategory === cat ? "#fff" : "#888899",
            fontSize: 12, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif",
          }}>{cat}</button>
        ))}
      </div>

      {/* Product Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(product => {
          const mmk = Math.round(product.price_thb * THB_TO_MMK).toLocaleString();
          return (
            <div
              key={product.id}
              id={`product-${product.id}`}
              style={{
                background: "#1C1C26", borderRadius: 20, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.3s",
              }}
            >
              {/* Product Header */}
              <div style={{ background: "linear-gradient(135deg,#22222E,#1A1A28)", padding: "24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 52 }}>{product.emoji || "📦"}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F0F5" }}>{t(product.name_en, product.name_my)}</div>
                  <div style={{ fontSize: 11, color: "#888899", marginTop: 3 }}>{product.category}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#FF2D55" }}>฿{product.price_thb}</span>
                    <span style={{ fontSize: 12, color: "#888899", marginLeft: 8 }}>{mmk} MMK</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ padding: "14px 20px" }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, margin: 0 }}>
                  {t(product.desc_en, product.desc_my)}
                </p>
                {(product.instruction_en || product.instruction_my) && (
                  <div style={{ marginTop: 10, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#888899", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>How to order</div>
                    <p style={{ fontSize: 12, color: "#888899", lineHeight: 1.55, margin: 0, whiteSpace: "pre-line" }}>
                      {t(product.instruction_en, product.instruction_my)}
                    </p>
                  </div>
                )}
              </div>

              {/* Buy Button */}
              <div style={{ padding: "0 20px 16px" }}>
                <button onClick={() => openTelegram(product)} style={{
                  width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#FF2D55,#FF6B35)",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 14px rgba(255,45,85,0.35)",
                }}>
                  <ShoppingBag size={16} /> Buy via Telegram
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#888899", padding: "40px 0" }}>
          <div style={{ fontSize: 32 }}>🔍</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>No products found</div>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
