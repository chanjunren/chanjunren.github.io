import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useUshiStatus } from "@site/src/components/ushi/hooks/use-status";
import {
  isUshiAvailable,
  type UshiConfig,
} from "@site/src/components/ushi/api";
import { UshiFallback } from "@site/src/components/ushi/fallback";
import { Login } from "@site/src/components/ushi/login";
import { UshiProvider } from "@site/src/components/ushi/provider";
import { UshiLayout } from "@site/src/components/ushi/layout";
import { useEffect } from "react";

function UshiLogin() {
  const { session, authLoading, signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && session) history.replace("/ushi/kakeibo");
  }, [authLoading, history, session]);

  if (authLoading || session) {
    return (
      <UshiLayout
        title="うち"
        description="Ushi is a private workspace for local tools."
        showSidebar={Boolean(session)}
        onSignOut={signOut}
      >
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
          Loading Ushi…
        </main>
      </UshiLayout>
    );
  }

  return (
    <UshiLayout
      title="うち"
      description="Ushi is a private workspace for local tools."
      showSidebar={Boolean(session)}
      onSignOut={signOut}
    >
      <Login />
    </UshiLayout>
  );
}

function UshiLanding({
  ushi,
  kakeibo,
}: {
  ushi: UshiConfig;
  kakeibo: KakeiboConfig;
}) {
  const { status, loading, error } = useUshiStatus(ushi.apiBase);

  if (loading) {
    return (
      <UshiLayout
        title="うち"
        description="Ushi is a private workspace for local tools."
        showSidebar={false}
      >
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
          Checking Ushi…
        </main>
      </UshiLayout>
    );
  }

  if (!isUshiAvailable(status, error)) {
    return (
      <UshiLayout
        title="うち"
        description="Ushi is a private workspace for local tools."
        showSidebar={false}
      >
        <UshiFallback />
      </UshiLayout>
    );
  }

  return (
    <UshiProvider config={kakeibo}>
      <UshiLogin />
    </UshiProvider>
  );
}

export default function UshiPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    ushi: UshiConfig;
    kakeibo: KakeiboConfig;
  };

  return (
    <UshiLanding ushi={customFields.ushi} kakeibo={customFields.kakeibo} />
  );
}
