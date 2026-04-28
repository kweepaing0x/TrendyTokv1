"use client";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { showToast } from "@/components/ui/Toast";
import { THB_TO_MMK } from "@/lib/data";

export default function CartPage() {
  const { cart, removeFromCart, t } = useStore();
  const total = cart.reduce((s, c) => s + c.priceThb * c.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
        <ShoppingBag size={60} color="#22222E" />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#888899" }}>{t("Cart is empty", "ကတ်ထဲ အချည်းနှီး")}</div>
        <Link href="/products" style={{
          padding: "12px 24px", borderRadius: 14, textDecoration: "none",
          background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff", fontWeight: 700,
        }}>{t("Go Shopping", "ဝယ်ရန်သွား")}</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 16px" }}>
      <span className="font-display" style={{ fontSize: 28, letterSpacing: 1, display: "block", marginBottom: 16 }}>
        {t("MY CART", "ကျွန်ုပ်ကတ်")}
      </span>

      {cart.map((item) => (
        <div key={item.productId} style={{
          background: "#1C1C26", borderRadius: 16, padding: 14, marginBottom: 10,
          border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 36, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "#22222E", borderRadius: 12, flexShrink: 0 }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "#FFD60A", fontWeight: 700 }}>฿{item.priceThb.toLocaleString()} × {item.qty}</div>
            <div style={{ fontSize: 11, color: "#888899" }}>= ฿{(item.priceThb * item.qty).toLocaleString()}</div>
          </div>
          <button onClick={() => { removeFromCart(item.productId); showToast(t("Removed", "ဖယ်ရှားပြီး")); }} style={{
            padding: 8, borderRadius: 10, border: "none", background: "rgba(255,45,85,0.15)", color: "#FF2D55", cursor: "pointer",
          }}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <div style={{ background: "#1C1C26", borderRadius: 20, padding: 20, marginTop: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "#888899", fontSize: 13 }}>{t("Subtotal", "စုစုပေါင်း")}</span>
          <span className="font-display" style={{ fontSize: 24, color: "#FFD60A" }}>฿{total.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: 11, color: "#888899", marginBottom: 16 }}>
          ≈ {Math.round(total * THB_TO_MMK).toLocaleString()} MMK
        </div>
        <button onClick={() => showToast(t("Proceeding to checkout…", "ငွေပေးချေမှုသို့..."))} style={{
          width: "100%", padding: 14, borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#FF2D55,#FF6B35)", color: "#fff",
          fontSize: 15, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {t("Checkout", "ပေးချေရန်")} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
