import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";
import Toast from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "TrendyTok",
  description: "Shop trending products via short videos — ships to Myanmar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StoreProvider>
            <TopNav />
            <main style={{ paddingTop: "60px", paddingBottom: "70px", minHeight: "100vh" }}>
              {children}
            </main>
            <BottomNav />
            <Toast />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
