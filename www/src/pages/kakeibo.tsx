import Head from "@docusaurus/Head";

import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { Login } from "@site/src/components/kakeibo/login";
import { useState } from "react";

type Screen = "login" | "dashboard";

export default function KakeiboPage() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <>
      <Head>
        <title>Kakeibo | うち</title>
        <meta name="description" content="A personal finance dashboard." />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        {screen === "login" ? (
          <Login onContinue={() => setScreen("dashboard")} />
        ) : (
          <Dashboard />
        )}
      </div>
    </>
  );
}
