import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useUchiStatus } from "@site/src/components/uchi/hooks/use-status";
import {
  isUchiAvailable,
  type UchiConfig,
} from "@site/src/components/uchi/api";
import { UchiFallback } from "@site/src/components/uchi/fallback";
import { Login } from "@site/src/components/uchi/login";
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

function UchiLanding({ uchi }: { uchi: UchiConfig }) {
  const { session, authLoading, signOut } = useAuth();
  const { status, loading, error } = useUchiStatus(uchi.apiBase);

  if (loading || authLoading) {
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
    <UchiLogin />
  );
}

export default function UchiPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    uchi: UchiConfig;
  };

  return (
    <UchiLanding uchi={customFields.uchi} />
  );
}
