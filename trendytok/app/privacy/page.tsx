"use client";
import { useStore } from "@/lib/store";

const sections = [
  {
    en: "Information We Collect",
    my: "ကျွန်ုပ်တို့ စုဆောင်းသည့် အချက်အလက်",
    bodyEn: "TrendyTok collects basic account information including name, email address, and phone number when you register. We also collect browsing data, purchase history, and device information to improve your shopping experience.",
    bodyMy: "TrendyTok သည် မှတ်ပုံတင်သည့်အခါ နာမည်၊ အီးမေးလ်နှင့် ဖုန်းနံပါတ် အပါဝင် အကောင့်အချက်အလက်အခြေခံများကို စုဆောင်းသည်",
  },
  {
    en: "How We Use Your Data",
    my: "သင့်ဒေတာကို မည်သို့အသုံးပြုသနည်း",
    bodyEn: "Your data is used to process orders, personalize your feed, send order updates, and improve our platform. We never sell your personal data to third parties.",
    bodyMy: "သင့်ဒေတာကို မှာယူမှုများ ဆောင်ရွက်ရန်၊ feed ကိုပုဂ္ဂိုလ်ရည်ညွှန်းစေရန်နှင့် ပလက်ဖောင်းကို တိုးတက်ရန် အသုံးပြုသည်",
  },
  {
  en: "Use of Creator Content and Affiliation",
  my: "ဖန်တီးသူ၏ အကြောင်းအရာနှင့် ညွှန်းဆိုမှု အသုံးပြုခြင်း",
  bodyEn: "Our policy is that we use the creator's video and will use their affiliation when a user makes a purchase. If there are any copyright issues or concerns, you can contact us to edit or delete the content.",
  bodyMy: "ကျွန်ုပ်တို့၏ မူဝါဒမှာ ကုန်ပစ္စည်းဖန်တီးသူ၏ ဗီဒီယိုကို အသုံးပြုပြီး သုံးစွဲသူတစ်ဦးက ဝယ်ယူမှုပြုလုပ်သည့်အခါ ၎င်းတို့၏ ညွှန်းဆိုမှုကို အသုံးပြုမည်ဖြစ်သည်။ မူပိုင်ခွင့်ဆိုင်ရာ ပြဿနာများ သို့မဟုတ် စိုးရိမ်မှုများရှိပါက၊ အကြောင်းအရာကို ပြင်ဆင်ရန် သို့မဟုတ် ဖျက်ရန် ကျွန်ုပ်တို့ထံ ဆက်သွယ်နိုင်ပါသည်။"
},
  {
    en: "Data Security",
    my: "ဒေတာလုံခြုံရေး",
    bodyEn: "All payment information is encrypted using SSL/TLS. We do not store full credit card details. Your account is protected with industry-standard security practices.",
    bodyMy: "ငွေပေးချေမှု အချက်အလက်အားလုံးကို SSL/TLS ဖြင့် ကုဒ်ဝှက်ထားသည်",
  },
  {
  en: "Shipping & Cross-Border",
  my: "ပို့ဆောင်ရေးနှင့် နိုင်ငံဖြတ်ကျော် ဝန်ဆောင်မှု",
  bodyEn: "Orders shipping to Myanmar may be subject to local customs regulations. We partner with trusted local land and air cargo services to deliver your order according to their policies. The cargo service is responsible for the shipment during transit. Buyer is responsible for any applicable import duties. Estimated delivery is 7 – 10 business days.",
  bodyMy: "မြန်မာနိုင်ငံသို့ ပို့ဆောင်သော မှာယူမှုများသည် ဒေသဆိုင်ရာ အကောက်ခွန် စည်းမျဉ်းများနှင့် သက်ဆိုင်နိုင်ပါသည်။ ကျွန်ုပ်တို့သည် ယုံကြည်စိတ်ချရသော ပြည်တွင်း ကုန်းလမ်းနှင့် လေကြောင်း ကုန်စည်ပို့ဆောင်ရေးများနှင့် ချိတ်ဆက်ပြီး ၎င်းတို့၏ စည်းကမ်းချက်များအတိုင်း သင့်မှာယူမှုကို ပို့ဆောင်ပေးပါသည်။ ပို့ဆောင်နေစဉ်အတွင်း ကုန်ပစ္စည်းအတွက် တာဝန်ကို သက်ဆိုင်ရာ ကုန်စည်ပို့ဆောင်ရေးမှ တာဝန်ယူမည်ဖြစ်ပါသည်။ ဝယ်ယူသူသည် သက်ဆိုင်ရာ သွင်းကုန်အခွန်များအတွက် တာဝန်ရှိပါသည်။ ခန့်မှန်းခြေ ပို့ဆောင်ချိန်မှာ ရုံးဖွင့်ရက် ၇ ရက်မှ ၁၀ ရက်အထိ ကြာမြင့်နိုင်ပါသည်။"
},
  {
    en: "Your Rights",
    my: "သင့်အခွင့်အရေးများ",
    bodyEn: "You have the right to access, correct, or delete your personal data at any time. Contact our support team via the app to make a request.",
    bodyMy: "သင်သည် မည်သည့်အချိန်မဆို သင့်ကိုယ်ရေးအချက်အလက်ကို ကြည့်ရှု၊ ပြင်ဆင် သို့မဟုတ် ဖျက်ပိုင်ခွင့်ရှိသည်",
  },
  {
    en: "Contact Us",
    my: "ဆက်သွယ်ရန်",
    bodyEn: "For privacy concerns, email us at stxephen@gmail.com or reach us via in-app chat support. We respond within 24 hours.",
    bodyMy: "ကိုယ်ရေးအချက်အလက် ကိစ္စရပ်များအတွက် stxephen@gmail.com  သို့ အီးမေးပို့ပါ",
  },
];

export default function PrivacyPage() {
  const { t } = useStore();
  return (
    <div style={{ padding: "10px 16px 10px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1C1C26,rgba(0,201,255,0.05))",
        borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        border: "1px solid rgba(255,255,255,0.08)", textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 34, letterSpacing: 1, marginBottom: 6 }}>
          {t("PRIVACY POLICY", "ကိုယ်ပိုင် မူဝါဒ")}
        </div>
        <div style={{ fontSize: 11, color: "#888899" }}>{t("Last updated: April 2025", "နောက်ဆုံးပြင်ဆင်မှု: ဧပြီ ၂၀၂၅")}</div>
      </div>

      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "#F0F0F5", marginBottom: 8,
            paddingLeft: 10, borderLeft: "3px solid #FF2D55",
          }}>
            {t(s.en, s.my)}
          </div>
          <p style={{ fontSize: 13, color: "#888899", lineHeight: 1.7 }}>
            {t(s.bodyEn, s.bodyMy)}
          </p>
        </div>
      ))}

      <div style={{
        background: "rgba(255,45,85,0.06)", border: "1px solid rgba(255,45,85,0.15)",
        borderRadius: 16, padding: "16px", textAlign: "center", marginTop: 8,
      }}>
        <div style={{ fontSize: 13, color: "#888899" }}>
          {t("By using TrendyTok, you agree to this Privacy Policy.", "TrendyTok ကိုအသုံးပြုခြင်းဖြင့် ဤမူဝါဒကို သဘောတူသည်")}
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
