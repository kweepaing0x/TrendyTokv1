"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin in database
  const checkAdminStatus = async (userId: string | undefined, email: string | undefined) => {
    if (!userId || !email) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        checkAdminStatus(currentUser.id, currentUser.email);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      const currentUser = sess?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        checkAdminStatus(currentUser.id, currentUser.email);
      } else {
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
