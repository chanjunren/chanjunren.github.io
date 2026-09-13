import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { type ReactNode } from "react";
import { type KakeiboConfig } from "@site/src/components/kakeibo/api";
import { UchiProvider } from "@site/src/components/uchi/provider";

export default function Root({ children }: { children: ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    kakeibo: KakeiboConfig;
  };

  return (
    <UchiProvider config={customFields.kakeibo}>
      {children}
    </UchiProvider>
  );
}
