import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createKakeiboApi, type KakeiboConfig } from "../kakeibo/api";
import { ApiContext } from "../kakeibo/context";
import { AuthContext, type AuthContextValue } from "./hooks/context";

export function UshiProvider({
  config,
  children,
}: {
  config: KakeiboConfig;
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );
  const [supabase] = useState<SupabaseClient | null>(() =>
    config.supabaseUrl && config.supabaseAnonKey
      ? createClient(config.supabaseUrl, config.supabaseAnonKey)
      : null,
  );
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const api = useMemo(
    () => (supabase ? createKakeiboApi(config, supabase) : null),
    [config, supabase],
  );

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setAuthError("Supabase is not configured for this build.");
      setAuthLoading(false);
      return () => {
        mounted = false;
      };
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthError(error?.message ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setAuthLoading(false);
      },
    );
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const auth = useMemo<AuthContextValue>(
    () => ({
      session,
      authLoading,
      authError,
      signIn: async (email, password) => {
        if (!supabase)
          throw new Error("Supabase is not configured for this build.");
        setAuthError(null);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setAuthError(error.message);
          throw error;
        }
      },
      signOut: async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        queryClient.clear();
      },
    }),
    [authError, authLoading, queryClient, session, supabase],
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={api}>
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      </ApiContext.Provider>
    </QueryClientProvider>
  );
}
