"use client";
import { useState } from "react";
import { Calculator, Zap, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { showToast } from "@/components/ui/Toast";
import { PRODUCTS, CATEGORIES, THB_TO_MMK } from "@/lib/data";

export default function ProductsPage() {
  const { t, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [photoIdx, setPhotoIdx] = useState<Record<string, number>>({});

  const filtered = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    addToCart({ productId: p.id, name: t(p.name.en, p.name.my), priceThb: p.priceThb, emoji: p.emoji });
    showToast(`🛒 ${t("Added to cart!", "ကတ်ထဲထည့်ပြီး!")}`);
  };

  return (
    <div style={{ paddingTop: 10, paddingBottom: 10 }}>
      {/* Header */}
      <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="font-display" style={{ fontSize: 26, letterSpacing: 1, color: "#F0F0F5" }}>
          {t("SHOP", "ဆိုင်")}
        </span>
        <Search size={20} color="#888899" />
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: "1px solid", whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.2s",
            borderColor: activeCategory === cat ? "#FF2D55" : "rgba(255,255,255,0.08)",
            background: activeCategory === cat ? "#FF2D55" : "#1C1C26",
            color: activeCategory === cat ? "#fff" : "#888899",
          }}>{cat}</button>
        ))}
      </div>

      {/* Products */}
      {filtered.map((product) => {
        const imgIdx = photoIdx[product.id] ?? 0;
        return (
          <div key={product.id} style={{
            margin: "0 16px 16px",
            background: "#1C1C26", borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {/* Image area */}
            <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg,#22222E,#1C1C26)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 80, cursor: "pointer",
              }} onClick={() => setPhotoIdx({ ...photoIdx, [product.id]: (imgIdx + 1) % product.photos.length })}>
                {product.photos[imgIdx]}
              </div>
              {product.badge && (
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: product.badgeColor ?? "#FF2D55",
                  color: "#fff", fontSize: 10, fontWeight: 800,
                  padding: "3px 8px", borderRadius: 8,
                }}>{product.badge}</div>
              )}
              {/* Dots */}
              <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {product.photos.map((_, i) => (
                  <div key={i} onClick={() => setPhotoIdx({ ...photoIdx, [product.id]: i })} style={{
                    height: 5, borderRadius: 3, cursor: "pointer",
                    width: i === imgIdx ? 14 : 5,
                    background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                  }} />
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 14px 12px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                {t(product.name.en, product.name.my)}
              </div>
              <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.5, marginBottom: 10 }}>
                {t(product.description.en, product.description.my)}
              </div>

              {/* Instruction band */}
              <div style={{
                background: "linear-gradient(90deg,rgba(255,45,85,0.15),rgba(255,107,53,0.08))",
                borderLeft: "3px solid #FF2D55", borderRadius: "0 8px 8px 0",
                padding: "8px 10px", marginBottom: 10,
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#FF2D55", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                  {t("HOW TO ORDER / USAGE", "မှာနည်း / သုံးနည်း")}
                </div>
                <p style={{ fontSize: 11, color: "#888899", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                  {t(product.instruction.en, product.instruction.my)}
                </p>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span className="font-display" style={{ fontSize: 30, color: "#FFD60A" }}>
                  ฿{product.priceThb.toLocaleString()}
                </span>
                <div>
                  <div style={{ fontSize: 11, color: "#888899", fontWeight: 600 }}>THB</div>
                  <div style={{ fontSize: 11, color: "#888899" }}>
                    ≈ {Math.round(product.priceThb * THB_TO_MMK).toLocaleString()} MMK
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Link href="/calculator" style={{ textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                    border: "1px solid #FF2D55", color: "#FF2D55", background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Calculator size={14} /> {t("Calc Fee", "တွက်")}
                  </button>
                </Link>
                <button onClick={() => showToast(t("Redirecting to checkout…", "ငွေပေးချေမှုသို့..."))} style={{
                  padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                  border: "none", color: "#fff",
                  background: "linear-gradient(135deg,#FF2D55,#FF6B35)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 4px 15px rgba(255,45,85,0.3)",
                }}>
                  <Zap size={14} /> {t("Buy Now", "ဝယ်ယူ")}
                </button>
                <button onClick={() => handleAddToCart(product)} style={{
                  gridColumn: "span 2", padding: 11, borderRadius: 12, fontSize: 13, fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.08)", color: "#F0F0F5", background: "#22222E",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}>
                  <ShoppingCart size={16} /> {t("Add to Cart", "ကတ်ထဲထည့်")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export const dynamic = 'force-dynamic';
