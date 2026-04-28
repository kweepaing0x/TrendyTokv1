"use client";
import { useState } from "react";
import { Calculator, ArrowRightLeft, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { showToast } from "@/components/ui/Toast";
import { THB_TO_MMK } from "@/lib/data";

type Currency = "thb-mmk" | "thb-thb";

export default function CalculatorPage() {
  const { t } = useStore();
  const [currency, setCurrency] = useState<Currency>("thb-mmk");
  const [price, setPrice] = useState("");
  const [shipping, setShipping] = useState("150");
  const [buyerFee, setBuyerFee] = useState("5");
  const [result, setResult] = useState<{ price: number; ship: number; fee: number; total: number; mmk: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(price) || 0;
    const s = parseFloat(shipping) || 0;
    const f = (p * (parseFloat(buyerFee) || 0)) / 100;
    const total = p + s + f;
    const mmk = total * THB_TO_MMK;
    setResult({ price: p, ship: s, fee: f, total, mmk });
    showToast(t("✅ Calculated!", "✅ တွက်ထုတ်ပြီး!"));
  };

  const fmt = (n: number) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ padding: "10px 16px 10px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1C1C26,#22222E)",
        borderRadius: 24, padding: 24, marginBottom: 20,
        border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,45,85,0.2),transparent)",
        }} />
        <span className="font-display" style={{ fontSize: 34, letterSpacing: 1, display: "block" }}>
          {t("COST CALC", "ကုန်ကျစရိတ်")}
        </span>
        <span style={{ fontSize: 12, color: "#888899" }}>
          {t("Total cost with fees & shipping", "ကြေးနှင့် ဆောင်ရွက်ခ ပေါင်းတွက်ပါ")}
        </span>
      </div>

      {/* Currency toggle */}
      <div style={{ display: "flex", background: "#13131A", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {(["thb-mmk", "thb-thb"] as Currency[]).map((c) => (
          <button key={c} onClick={() => setCurrency(c)} style={{
            flex: 1, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700,
            border: "none", cursor: "pointer", transition: "all 0.2s",
            background: currency === c ? "#FF2D55" : "transparent",
            color: currency === c ? "#fff" : "#888899",
            boxShadow: currency === c ? "0 2px 10px rgba(255,45,85,0.4)" : "none",
          }}>{c === "thb-mmk" ? "THB → MMK" : "THB Only"}</button>
        ))}
      </div>

      {/* Rate badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(0,224,150,0.1)", border: "1px solid rgba(0,224,150,0.2)",
        borderRadius: 20, padding: "6px 12px", marginBottom: 16,
      }}>
        <ArrowRightLeft size={12} color="#00E096" />
        <span style={{ fontSize: 12, color: "#00E096", fontWeight: 700 }}>
          1 THB = {THB_TO_MMK} MMK ({t("est. rate", "ခန့်မှန်း")})
        </span>
      </div>

      {/* Input card */}
      <div style={{
        background: "#1C1C26", borderRadius: 20, padding: 20,
        border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
          {t("PRODUCT DETAILS", "ပစ္စည်းအသေးစိတ်")}
        </div>

        {[
          { label: t("Product Price (THB)", "ပစ္စည်းစျေး (THB)"), val: price, set: setPrice, ph: "e.g. 1290" },
          { label: t("Shipping Fee (THB)", "ပို့ဆောင်ခ (THB)"), val: shipping, set: setShipping, ph: "e.g. 150" },
          { label: t("Buyer Fee %", "ဝယ်သူကြေး %"), val: buyerFee, set: setBuyerFee, ph: "e.g. 5" },
        ].map(({ label, val, set, ph }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888899", marginBottom: 6 }}>{label}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={ph}
              className="input-dark"
            />
          </div>
        ))}
      </div>

      {/* Result card */}
      {result && (
        <div style={{
          background: "#1C1C26", borderRadius: 20, padding: 20,
          border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            {t("BREAKDOWN", "အသေးစိတ်")}
          </div>
          {[
            { name: t("Product Price", "ပစ္စည်းစျေး"), val: `฿${fmt(result.price)}` },
            { name: t("Shipping Fee", "ပို့ဆောင်ခ"), val: `฿${fmt(result.ship)}` },
            { name: t("Buyer Fee", "ဝယ်သူကြေး"), val: `฿${fmt(result.fee)}` },
          ].map(({ name, val }) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: "#888899" }}>{name}</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{t("TOTAL", "စုစုပေါင်း")}</span>
            <span className="font-display" style={{ fontSize: 28, color: "#FFD60A" }}>฿{fmt(result.total)}</span>
          </div>
          {currency === "thb-mmk" && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#888899" }}>{t("Equivalent in MMK", "MMK တွင်")}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#00E096", marginTop: 4 }}>
                {Math.round(result.mmk).toLocaleString()} MMK
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={calculate} style={{
        width: "100%", padding: 16, borderRadius: 16, border: "none",
        background: "linear-gradient(135deg,#FF2D55,#FF6B35)",
        color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
        boxShadow: "0 6px 20px rgba(255,45,85,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <Calculator size={18} /> {t("Calculate Now", "ယခုတွက်မည်")}
      </button>

      {/* Info box */}
      <div style={{
        background: "rgba(0,201,255,0.06)", border: "1px solid rgba(0,201,255,0.15)",
        borderRadius: 16, padding: "14px 16px", marginTop: 16,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <TrendingUp size={16} color="#00C9FF" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}>
          {t(
            "Exchange rate is estimated. Actual rate may vary. Shipping & buyer fees may differ by seller.",
            "ငွေလဲနှုန်းသည် ခန့်မှန်းချက်ဖြစ်သည်။ အမှန်တကယ်နှုန်းကွာနိုင်သည်"
          )}
        </p>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
