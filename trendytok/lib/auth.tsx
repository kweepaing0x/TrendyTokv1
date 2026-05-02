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
      console.log(`[Auth] Checking admin status for user: ${userId} (${email})`);
      
      // Query admin_users table
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, email, role, user_id")
        .eq("user_id", userId);

      console.log(`[Auth] Query result:`, { data, error });

      if (error) {
        console.error(`[Auth] Database error:`, error.message);
        setIsAdmin(false);
        return;
      }

      if (data && data.length > 0) {
        const adminRecord = data[0];
        console.log(`[Auth] Admin found:`, adminRecord);
        setIsAdmin(true);
      } else {
        console.log(`[Auth] No admin record found for user_id: ${userId}`);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error(`[Auth] Unexpected error:`, err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        console.log(`[Auth Init] User logged in:`, currentUser.id, currentUser.email);
        await checkAdminStatus(currentUser.id, currentUser.email);
      } else {
        console.log(`[Auth Init] No user session`);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      console.log(`[Auth] State changed:`, _event);
      setSession(sess);
      const currentUser = sess?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        console.log(`[Auth] New user session:`, currentUser.id, currentUser.email);
        await checkAdminStatus(currentUser.id, currentUser.email);
      } else {
        console.log(`[Auth] User logged out`);
        setIsAdmin(false);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error) {
      // After sign in, wait a moment then check admin status
      setTimeout(async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.id) {
          await checkAdminStatus(data.session.user.id, data.session.user.email);
        }
      }, 500);
    }
    
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
