export type Lang = "en" | "my";

export interface Product {
  id: string;
  name: { en: string; my: string };
  description: { en: string; my: string };
  instruction: { en: string; my: string };
  photos: string[];
  emoji: string;
  priceThb: number;
  badge?: string;
  badgeColor?: string;
  category: string;
  trending?: number;
}

export interface Video {
  id: string;
  seller: string;
  description: { en: string; my: string };
  tags: string[];
  bgColor: string;
  bgEmoji: string;
  likes: string;
  comments: string;
  shares: string;
  trendingPct: number;
  trendingLabel: "HOT" | "WARM" | "COOL";
  products: { name: string; price: number; emoji: string }[];
}

export interface CartItem {
  productId: string;
  name: string;
  priceThb: number;
  qty: number;
  emoji: string;
}
