import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { useApi } from "@site/src/components/kakeibo/hooks";
import {
  isUchiAvailable,
  type UchiConfig,
} from "@site/src/components/uchi/api";
import { UchiFallback } from "@site/src/components/uchi/fallback";
import { useAuth, useUchiStatus } from "@site/src/components/uchi/hooks";
import { UchiProvider } from "@site/src/components/uchi/provider";
import { UchiLayout } from "@site/src/components/uchi/layout";
import { useHistory } from "@docusaurus/router";
import { useEffect } from "react";

function KakeiboApp() {
  const api = useApi();
  const { session, authLoading, signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && !session) history.replace("/uchi");
  }, [authLoading, history, session]);

  if (!api)
    return (
      <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
        Kakeibo requires SUPABASE_URL and SUPABASE_ANON_KEY to be configured for
        this build.
      </main>
    );
  if (authLoading)
    return (
      <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Kakeibo…
      </main>
    );
  if (!session) return null;
  return (
    <UchiLayout
      title="家計簿"
      description="A personal finance dashboard."
      onSignOut={signOut}
    >
      <div className="text-base text-foreground [&_[data-slot=button]]:text-base">
        <Dashboard />
      </div>
    </UchiLayout>
  );
}

export default function KakeiboPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    uchi: UchiConfig;
    kakeibo: KakeiboConfig;
  };

  return (
    <KakeiboGate
      apiBase={customFields.uchi.apiBase}
      config={customFields.kakeibo}
    />
  );
}

function KakeiboGate({
  apiBase,
  config,
}: {
  apiBase: string;
  config: KakeiboConfig;
}) {
  const { status, loading, error } = useUchiStatus(apiBase);

  if (loading) {
    return (
      <UchiLayout title="家計簿" description="A personal finance dashboard.">
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
        Checking Uchi…
        </main>
      </UchiLayout>
    );
  }

  if (!isUchiAvailable(status, error)) {
    return (
      <UchiLayout title="家計簿" description="A personal finance dashboard.">
        <UchiFallback />
      </UchiLayout>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <UchiProvider config={config}>
        <KakeiboApp />
      </UchiProvider>
    </div>
  );
}
