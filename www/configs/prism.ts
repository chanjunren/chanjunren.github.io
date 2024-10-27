import { ThemeConfig } from "@docusaurus/types";
import { themes } from "prism-react-renderer";

const PRISM_CONFIG: ThemeConfig["prism"] = {
  additionalLanguages: ["json", "java", "bash"],
  theme: themes.nightOwl,
};

export default PRISM_CONFIG;
