import { ThemeConfig } from "@docusaurus/theme-search-algolia";

const ALOGLIA_CONFIG: ThemeConfig["algolia"] = {
  // The application ID provided by Algolia
  appId: "050TJREE2O",

  // Public API key: it is safe to commit it
  apiKey: "02ec9e7ad73e37a49de79d457cc7936b",

  indexName: "chanjunrenio",

  // Optional: see doc section below
  contextualSearch: true,
  searchParameters: {},
  searchPagePath: null,
};

export default ALOGLIA_CONFIG;
