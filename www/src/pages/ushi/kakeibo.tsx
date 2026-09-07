import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { useApi } from "@site/src/components/kakeibo/hooks";
import {
  isUshiAvailable,
  type UshiConfig,
} from "@site/src/components/ushi/api";
import { UshiFallback } from "@site/src/components/ushi/fallback";
import { useAuth, useUshiStatus } from "@site/src/components/ushi/hooks";
import { UshiProvider } from "@site/src/components/ushi/provider";
import { UshiLayout } from "@site/src/components/ushi/layout";
import { useHistory } from "@docusaurus/router";
import { useEffect } from "react";

function KakeiboApp() {
  const api = useApi();
  const { session, authLoading, signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && !session) history.replace("/ushi");
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
    <UshiLayout
      title="家計簿"
      description="A personal finance dashboard."
      onSignOut={signOut}
    >
      <div className="text-base text-foreground [&_[data-slot=button]]:text-base">
        <Dashboard />
      </div>
    </UshiLayout>
  );
}

export default function KakeiboPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    ushi: UshiConfig;
    kakeibo: KakeiboConfig;
  };

  return (
    <KakeiboGate
      apiBase={customFields.ushi.apiBase}
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
  const { status, loading, error } = useUshiStatus(apiBase);

  if (loading) {
    return (
      <UshiLayout title="家計簿" description="A personal finance dashboard.">
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
        Checking Ushi…
        </main>
      </UshiLayout>
    );
  }

  if (!isUshiAvailable(status, error)) {
    return (
      <UshiLayout title="家計簿" description="A personal finance dashboard.">
        <UshiFallback />
      </UshiLayout>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <UshiProvider config={config}>
        <KakeiboApp />
      </UshiProvider>
    </div>
  );
}
