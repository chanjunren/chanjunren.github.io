import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { DEFAULT_PUBLIC_BACKIES_API_BASE } from "@site/src/constants/api";

export function useMateriaApiBase() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    materia?: {
      backiesApiBase?: string;
    };
  };

  return customFields.materia?.backiesApiBase ?? DEFAULT_PUBLIC_BACKIES_API_BASE;
}
