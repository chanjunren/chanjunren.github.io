import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { useApi } from "@site/src/components/kakeibo/hooks";
import {
  isUchiAvailable,
  type UchiConfig,
} from "@site/src/components/uchi/api";
import { UchiFallback } from "@site/src/components/uchi/fallback";
import { useAuth, useUchiStatus } from "@site/src/components/uchi/hooks";
import { UchiLayout } from "@site/src/components/uchi/layout";
import { LoadingFallback } from "@site/src/components/ui/loading-fallback";
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
  };

  return (
    <KakeiboGate
      apiBase={customFields.uchi.apiBase}
    />
  );
}

function KakeiboGate({
  apiBase,
}: {
  apiBase: string;
}) {
  const { session, authLoading, signOut } = useAuth();
  const { status, loading, error } = useUchiStatus(apiBase);

  if (loading || authLoading) {
    return (
      <UchiLayout
        title="家計簿"
        description="A personal finance dashboard."
        showSidebar={Boolean(session)}
        onSignOut={signOut}
      >
        <LoadingFallback />
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

  return <KakeiboApp />;
}
