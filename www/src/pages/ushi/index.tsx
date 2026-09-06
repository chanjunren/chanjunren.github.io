import Head from "@docusaurus/Head";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { useAuth } from "@site/src/components/ushi/hooks";
import { Login } from "@site/src/components/ushi/login";
import { UshiProvider } from "@site/src/components/ushi/provider";
import { useEffect } from "react";

function UshiLogin() {
  const { session, authLoading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && session) history.replace("/ushi/kakeibo");
  }, [authLoading, history, session]);

  if (authLoading || session) {
    return (
      <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Ushi…
      </main>
    );
  }

  return <Login />;
}

export default function UshiPage() {
  const { siteConfig } = useDocusaurusContext();
  const config = (siteConfig.customFields as { kakeibo: KakeiboConfig })
    .kakeibo;

  return (
    <>
      <Head>
        <title>Ushi | うち</title>
        <meta name="description" content="Ushi account sign in." />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <UshiProvider config={config}>
          <UshiLogin />
        </UshiProvider>
      </div>
    </>
  );
}
