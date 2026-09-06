import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { useApi } from "@site/src/components/kakeibo/hooks";
import { useAuth } from "@site/src/components/ushi/hooks";
import { UshiProvider } from "@site/src/components/ushi/provider";
import { useHistory } from "@docusaurus/router";
import { useEffect } from "react";

function KakeiboApp() {
  const api = useApi();
  const { session, authLoading } = useAuth();
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
  return <Dashboard />;
}

export default function KakeiboPage() {
  const { siteConfig } = useDocusaurusContext();
  const config = (siteConfig.customFields as { kakeibo: KakeiboConfig })
    .kakeibo;
  return (
    <>
      <Head>
        <title>Kakeibo | うち</title>
        <meta name="description" content="A personal finance dashboard." />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <UshiProvider config={config}>
          <KakeiboApp />
        </UshiProvider>
      </div>
    </>
  );
}
