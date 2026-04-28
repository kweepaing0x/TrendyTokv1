"use client";
import { useEffect, useState } from "react";

let toastFn: (msg: string) => void = () => {};
export const showToast = (msg: string) => toastFn(msg);

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (m: string) => {
      setMsg(m);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: visible ? 90 : 70,
      left: "50%", transform: "translateX(-50%)",
      background: "#22222E", borderRadius: 12, padding: "12px 20px",
      fontSize: 13, fontWeight: 700, color: "#F0F0F5",
      border: "1px solid rgba(255,255,255,0.08)",
      zIndex: 9999, opacity: visible ? 1 : 0,
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      pointerEvents: "none",
    }}>
      {msg}
    </div>
  );
}
