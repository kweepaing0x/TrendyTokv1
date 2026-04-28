import { Product, Video } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: { en: "Korean Luxury Handbag", my: "ကိုရီးယားဂရုနှင်းအိတ်" },
    description: {
      en: "Premium quality leather handbag imported directly from Korea. Available in 5 colors. Perfect for daily use or special occasions.",
      my: "ကိုရီးယားနိုင်ငံမှ တိုက်ရိုက်တင်သွင်းသည့် အရည်အသွေးကောင်းသော အရေပြားအိတ်။ အရောင် ၅ မျိုး ရနိုင်သည်",
    },
    instruction: {
      en: "1. Choose your color\n2. Add to cart & checkout\n3. Pay via bank transfer\n4. We ship within 3–5 days to Myanmar",
      my: "၁. အရောင်ရွေးပါ\n၂. ကတ်ထဲထည့်ပြီး ပေးချေပါ\n၃. ဘဏ်လွှဲငွေဖြင့် ပေးချေပါ\n၄. မြန်မာသို့ ၃–၅ ရက်အတွင်း ပို့ဆောင်မည်",
    },
    photos: ["👜", "🛍️", "💼"],
    emoji: "👜",
    priceThb: 1290,
    badge: "🔥 HOT",
    badgeColor: "#FF2D55",
    category: "Fashion",
    trending: 85,
  },
  {
    id: "p2",
    name: { en: "Premium Lip Gloss Set (6 pcs)", my: "ပရီမီယံနှုတ်ခမ်းနုနှင်ဆေးစု (၆ ချောင်း)" },
    description: {
      en: "Long-lasting glossy finish with moisturizing formula. Set of 6 vibrant colors. Cruelty-free & vegan certified.",
      my: "ကြာရှည်ခံသော နှုတ်ခမ်းနုနှင်ဆေး ၆ မျိုးစု၊ Cruelty-free နှင့် vegan အသိအမှတ်ပြု",
    },
    instruction: {
      en: "Apply directly to lips. Layer for intense color. Remove gently with makeup remover. Suitable for all skin tones.",
      my: "နှုတ်ခမ်းပေါ် တိုက်ရိုက်လိမ်းပါ။ အရေပြားအားလုံးနှင့် သင့်တော်သည်",
    },
    photos: ["💄", "💋", "✨"],
    emoji: "💄",
    priceThb: 320,
    badge: "⚡ NEW",
    badgeColor: "#FF6B35",
    category: "Beauty",
    trending: 52,
  },
  {
    id: "p3",
    name: { en: "Sport Sneakers Pro 2025", my: "ကစားဖိနပ်ပရို ၂၀၂၅" },
    description: {
      en: "Lightweight performance sneakers with memory foam insole. EU 36–45. Unisex design, shipped from Thailand.",
      my: "မှတ်ဉာဏ်အမြှုပ်ပါ ပေါ့ပါးသော ကစားဖိနပ်။ EU 36–45 ရနိုင်သည်",
    },
    instruction: {
      en: "Size guide: EU36=23cm / EU38=24.5cm / EU40=26cm / EU42=27cm / EU44=28.5cm\nHalf size up recommended for wide feet.",
      my: "အရွယ်လမ်းညွှန်: EU36=23cm / EU38=24.5cm / EU40=26cm\nချောင်သောခြေထောက်အတွက် တစ်ဆင့်ကြီး",
    },
    photos: ["👟", "🏃", "⚡"],
    emoji: "👟",
    priceThb: 2450,
    badge: "LIMITED",
    badgeColor: "#6f42c1",
    category: "Fashion",
    trending: 70,
  },
  {
    id: "p4",
    name: { en: "Glow Skin Serum 30ml", my: "အသားဖြူဆေးရည် ၃၀မီလီ" },
    description: {
      en: "Natural organic serum with Vitamin C & Niacinamide. Reduces dark spots and brightens skin within 2 weeks.",
      my: "သဘာဝဗိုက်တာမင် C ပါ ဆေးရည်။ ၂ ပတ်အတွင်း အသားဖြူ နှင့် အကွက်ပျောက်သည်",
    },
    instruction: {
      en: "Apply 2–3 drops to cleansed face morning & night. Avoid direct sunlight after use. Store below 25°C.",
      my: "မနက်နှင့် ည မျက်နှာသန့်ပြီး ယမ်း ၂–၃ ချက် ထည့်လိမ်းပါ",
    },
    photos: ["🌿", "✨", "💧"],
    emoji: "🌿",
    priceThb: 890,
    badge: "🌱 ORGANIC",
    badgeColor: "#00C853",
    category: "Beauty",
    trending: 30,
  },
];

export const VIDEOS: Video[] = [
  {
    id: "v1",
    seller: "@beauty_mm_official",
    description: {
      en: "✨ New luxury bag collection just arrived! Limited stock from Korea 🇰🇷 Ships to Myanmar in 3 days!",
      my: "✨ ကိုရီးယားမှ အိတ်သစ်များ ရောက်ရှိပြီ! ကန့်သတ်ပစ္စည်း — မြန်မာသို့ ၃ ရက်အတွင်း ပို့ဆောင်မည်!",
    },
    tags: ["#LuxuryBag", "#KoreaFashion", "#TrendyTok"],
    bgColor: "from-rose-950 to-pink-900",
    bgEmoji: "👜",
    likes: "124K", comments: "8.2K", shares: "2.1K",
    trendingPct: 85, trendingLabel: "HOT",
    products: [
      { name: "Luxury Bag", price: 1290, emoji: "👜" },
      { name: "Lip Gloss", price: 320, emoji: "💄" },
    ],
  },
  {
    id: "v2",
    seller: "@sneaker_king_th",
    description: {
      en: "🔥 Best sneakers for 2025 — comfort meets style. Now ships to Myanmar!",
      my: "🔥 ၂၀၂၅ ခုနှစ် အကောင်းဆုံး sneakers — မြန်မာနိုင်ငံသို့ ယခုပို့ဆောင်!",
    },
    tags: ["#Sneakers", "#ShipToMyanmar", "#Style2025"],
    bgColor: "from-indigo-950 to-violet-900",
    bgEmoji: "👟",
    likes: "89K", comments: "4.3K", shares: "980",
    trendingPct: 70, trendingLabel: "WARM",
    products: [{ name: "Sneakers Pro", price: 2450, emoji: "👟" }],
  },
  {
    id: "v3",
    seller: "@naturalskin_mm",
    description: {
      en: "🌿 Natural serum for glowing skin — organic ingredients, visible results in 2 weeks!",
      my: "🌿 သဘာဝဆေးများဖြင့် ပြုလုပ်သော ဆေးရည် — ၂ ပတ်အတွင်း အသားဖြူ!",
    },
    tags: ["#Skincare", "#NaturalBeauty", "#GlowUp"],
    bgColor: "from-emerald-950 to-teal-900",
    bgEmoji: "🌿",
    likes: "45K", comments: "2.1K", shares: "540",
    trendingPct: 30, trendingLabel: "COOL",
    products: [{ name: "Glow Serum", price: 890, emoji: "🌿" }],
  },
];

export const THB_TO_MMK = 40.37;
export const CATEGORIES = ["All", "Fashion", "Beauty", "Electronics", "Health"];
