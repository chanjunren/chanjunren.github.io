import { ThemeConfig } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const PRISM_CONFIG: ThemeConfig["prism"] = {
  theme: prismThemes.duotoneLight,
  darkTheme: prismThemes.duotoneDark,
  additionalLanguages: ["json", "java"],
};

export default PRISM_CONFIG;
