"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { showToast } from "@/components/ui/Toast";

export default function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { showToast("⚠️ Fill in email & password"); return; }
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      showToast(`❌ ${error}`);
    } else if (!isAdmin) {
      showToast("🚫 No admin access for this account");
      await signOut();
    } else {
      showToast("✅ Welcome, Admin!");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ fontSize: 14, color: "#888899" }}>Loading…</div>
      </div>
    );
  }

  // Logged in + is admin → show admin panel
  if (user && isAdmin) {
    return (
      <>
        {/* Admin top bar */}
        <div style={{
          background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.2)",
          borderRadius: 14, padding: "10px 14px", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FF2D55" }}>🔐 ADMIN MODE</div>
            <div style={{ fontSize: 11, color: "#888899", marginTop: 1 }}>{user.email}</div>
          </div>
          <button onClick={async () => { await signOut(); showToast("Signed out"); }} style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,45,85,0.3)",
            background: "transparent", color: "#FF2D55", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>Logout</button>
        </div>
        {children}
      </>
    );
  }

  // Logged in but NOT admin
  if (user && !isAdmin) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16, padding: "0 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>No Admin Access</div>
        <div style={{ fontSize: 13, color: "#888899" }}>Your account ({user.email}) does not have admin privileges.</div>
        <button onClick={signOut} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#FF2D55", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    );
  }

  // Not logged in → show login form
  return (
    <div style={{ padding: "10px 16px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1C1C26,#22222E)",
        borderRadius: 24, padding: "32px 24px", marginBottom: 24,
        border: "1px solid rgba(255,255,255,0.08)", textAlign: "center",
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          background: "linear-gradient(135deg,#FF2D55,#FF6B35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(255,45,85,0.4)",
        }}>
          <Lock size={30} color="#fff" />
        </div>
        <div className="font-display" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 6 }}>ADMIN LOGIN</div>
        <div style={{ fontSize: 13, color: "#888899" }}>TrendyTok Management Portal</div>
      </div>

      <div style={{ background: "#1C1C26", borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@trendytok.app"
            className="input-dark"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#888899", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-dark"
              style={{ paddingRight: 44 }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button onClick={() => setShowPw(!showPw)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#888899", cursor: "pointer", padding: 0,
            }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={submitting} style={{
          width: "100%", padding: 14, borderRadius: 14, border: "none",
          background: submitting ? "#444" : "linear-gradient(135deg,#FF2D55,#FF6B35)",
          color: "#fff", fontSize: 15, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: "0 4px 16px rgba(255,45,85,0.4)",
        }}>
          <LogIn size={18} />
          {submitting ? "Signing in…" : "Sign In to Admin"}
        </button>
      </div>

      {/* Info box */}
      <div style={{
        background: "rgba(0,201,255,0.06)", border: "1px solid rgba(0,201,255,0.12)",
        borderRadius: 14, padding: 14, marginTop: 16,
      }}>
        <div style={{ fontSize: 12, color: "#888899", lineHeight: 1.6 }}>
          🔒 Admin access is controlled via <strong style={{ color: "#00C9FF" }}>Supabase Auth</strong>.<br />
          Create your admin account in Supabase dashboard → Authentication → Users, then add your email to <code style={{ color: "#FFD60A" }}>ADMIN_EMAILS</code> in <code style={{ color: "#FFD60A" }}>lib/auth.tsx</code>
        </div>
      </div>
    </div>
  );
}
