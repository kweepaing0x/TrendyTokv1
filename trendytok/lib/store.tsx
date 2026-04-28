"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Lang } from "@/types";

interface StoreCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, my: string) => string;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
}

const Ctx = createContext<StoreCtx>({} as StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<CartItem[]>([]);

  const t = (en: string, my: string) => (lang === "en" ? en : my);

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === item.productId);
      if (existing) return prev.map((c) => c.productId === item.productId ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.productId !== id));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <Ctx.Provider value={{ lang, setLang, t, cart, addToCart, removeFromCart, cartCount }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
