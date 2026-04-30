"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Calculator, Shield } from "lucide-react";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/", icon: Home, en: "Home", my: "ပင်မ" },
  { href: "/products", icon: Store, en: "Shop", my: "ဆိုင်" },
  { href: "/calculator", icon: Calculator, en: "Calc", my: "တွက်" },
  { href: "/privacy", icon: Shield, en: "Privacy", my: "လျှို့ဝှက်" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useStore();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, height: 70,
      background: "#13131A", borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "8px 0", textDecoration: "none",
            color: isActive ? "#FF2D55" : "#888899",
            fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
            position: "relative",
          }}>
            <Icon size={22} />
            <span>{t(item.en, item.my)}</span>
            {isActive && (
              <span style={{
                position: "absolute", bottom: 0, width: 30, height: 2,
                background: "#FF2D55", borderRadius: "2px 2px 0 0",
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
