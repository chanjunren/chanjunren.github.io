import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useUchiStatus } from "@site/src/components/uchi/hooks/use-status";
import {
  isUchiAvailable,
  type UchiConfig,
} from "@site/src/components/uchi/api";
import { UchiFallback } from "@site/src/components/uchi/fallback";
import { Login } from "@site/src/components/uchi/login";
import { UchiProvider } from "@site/src/components/uchi/provider";
import { UchiLayout } from "@site/src/components/uchi/layout";
import { useEffect } from "react";

function UchiLogin() {
  const { session, authLoading, signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && session) history.replace("/uchi/kakeibo");
  }, [authLoading, history, session]);

  if (authLoading || session) {
    return (
      <UchiLayout
        title="うち"
        description="Uchi is a private workspace for local tools."
        showSidebar={Boolean(session)}
        onSignOut={signOut}
      >
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
          Loading Uchi…
        </main>
      </UchiLayout>
    );
  }

  return (
    <UchiLayout
      title="うち"
      description="Uchi is a private workspace for local tools."
      showSidebar={Boolean(session)}
      onSignOut={signOut}
    >
      <Login />
    </UchiLayout>
  );
}

function UchiLanding({
  uchi,
  kakeibo,
}: {
  uchi: UchiConfig;
  kakeibo: KakeiboConfig;
}) {
  const { status, loading, error } = useUchiStatus(uchi.apiBase);

  if (loading) {
    return (
      <UchiLayout
        title="うち"
        description="Uchi is a private workspace for local tools."
        showSidebar={false}
      >
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
          Checking Uchi…
        </main>
      </UchiLayout>
    );
  }

  if (!isUchiAvailable(status, error)) {
    return (
      <UchiLayout
        title="うち"
        description="Uchi is a private workspace for local tools."
        showSidebar={false}
      >
        <UchiFallback />
      </UchiLayout>
    );
  }

  return (
    <UchiProvider config={kakeibo}>
      <UchiLogin />
    </UchiProvider>
  );
}

export default function UchiPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    uchi: UchiConfig;
    kakeibo: KakeiboConfig;
  };

  return (
    <UchiLanding uchi={customFields.uchi} kakeibo={customFields.kakeibo} />
  );
}
