import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import convertToDocusaurusMdx from "remark-docusaurus-obsidian-bridge";
import ALOGLIA_CONFIG from "./configs/algolia";
import PRISM_CONFIG from "./configs/prism";
import pluginIdealImage from "./plugins/ideal-image.cjs";
import tailwindPlugin from "./plugins/tailwind.cjs";
import customWebpack from "./plugins/webpack.cjs";
import dateTagReplacer from "./src/utils/dateTagReplacer";

const config: Config = {
  title: "jun ren's digital garden",
  tagline: "勤奋决定你的下限，天赋决定你的上线",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://chanjunren.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "chanjunren", // Usually your GitHub org/user name.
  projectName: "chanjunren.github.io", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          exclude: ["**/templates/*"],
          beforeDefaultRemarkPlugins: [
            [convertToDocusaurusMdx, { customReplacers: [dateTagReplacer] }],
          ],
        },
        blog: false,
        theme: {
          customCss: "./src/css/index.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "🌳",
      items: [
        {
          label: "about",
          to: "about",
        },

        {
          type: "docSidebar",
          sidebarId: "docs",
          label: "zettelkasten",
        },
      ],
    },
    algolia: ALOGLIA_CONFIG,
    prism: PRISM_CONFIG,
  } satisfies Preset.ThemeConfig,
  plugins: [
    tailwindPlugin,
    [pluginIdealImage.name, pluginIdealImage.options],
    customWebpack,
  ],
  staticDirectories: ["docs/assets", "static"],
};

export default config;
