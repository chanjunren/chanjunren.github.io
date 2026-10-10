import { createContext, type RefObject } from "react";
import type { Session } from "@supabase/supabase-js";

export type AuthContextValue = {
  session: Session | null;
  authLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

// Outlives page navigation, so a remounted launcher can flip from the
// previous page's name instead of appearing already settled.
export const LastPageContext = createContext<RefObject<string | null> | null>(
  null,
);
