import DocusaurusLink from "@site/src/components/common/DocusaurusLink";
import BadgeList from "@site/src/components/spotlight/BadgeList";
import { GalleryProjectInfo } from "@site/src/types";
import IdealImage from "@theme/IdealImage";
import { DocusaurusIcon } from "../../common/Icons";
import SecondaryHeader from "../../common/SecondaryHeader";
import VaultusaurusDemo from "./VaultusaurusDemo";

const VaultusaurusProject: GalleryProjectInfo = {
  id: "vaultusaurus",
  title: "Vaultusaurus",
  subtitle: "Docusaurus plugin",
  containerCss: "md:col-span-6 md:row-span-2",
  card: ({ onClick }) => <VaultusaurusDemo onClick={onClick} />,
  banner: () => (
    <div className="flex items-center w-full justify-center h-36 gap-5 bg-graphPaper">
      <DocusaurusIcon className="h-14 w-14" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  description: () => (
    <div className="flex flex-col w-full gap-5">
      <span>
        I wanted to have a system for organizing what little I know and have a
        means of quickly accessing golden nuggets of knowledge that I have come
        across
      </span>
      <span>
        And through my Youtube adventures I came across the concept of a
        <a
          className="ml-2"
          href="https://en.wikipedia.org/wiki/Zettelkasten"
          target="_blank"
        >
          Zettelkasten
        </a>
      </span>
      <span>
        Basically, I write notes in markdown using{" "}
        <a href="https://obsidian.md/" target="_blank" className="mr-2">
          Obsidian
        </a>
        and publish them to my{" "}
        <a href="https://docusaurus.io/docs" target="_blank">
          Docusaurus
        </a>{" "}
        portfolio website, which is a static site generator that can render
        markdown pages
      </span>
      <span>
        However, Obsidian's markdown syntax differs from that of Docusaurus{" "}
        {":("} resulting in these lackluster displays
      </span>
      <div className="grid lg:grid-cols-2 grid-cols-1 items-end justify-items-center gap-5">
        <div className="flex flex-col gap-5 items-center">
          <IdealImage
            className="flex-grow"
            img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/obsidian_demo.png"
          />
          <SecondaryHeader>Obsidian markdown</SecondaryHeader>
        </div>
        <div className="flex flex-col gap-5 items-center">
          <IdealImage
            className="flex-grow "
            img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/docusaurus_without_plugin_demo.png"
          />
          <SecondaryHeader>Corresponding docusaurus page</SecondaryHeader>
        </div>
      </div>
      <span>
        And thus I gave birth to Vaultusaurus - a Docusaurus plugin for
        transforming Obsidian's markdown syntax into Docusaurus-compatible
        format
      </span>
      <span>
        I was also fascinated by Obsidian's
        <a
          className="mx-2"
          href="https://help.obsidian.md/Plugins/Graph+view"
          target="_blank"
        >
          graph view
        </a>
      </span>
      <span>
        It's fun playing with the graph, and it also serves as a useful tool for
        have a bird eye view of how notes relate to one another through tags and
        internal links, so I included this in my plugin as well
      </span>
      <IdealImage img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/vaultusaurus_demo.png" />
      <span>
        The markdown files are processed using MDAST related libraries with a
        remark plugin, and the graph is rendered using D3
      </span>
    </div>
  ),
  repository: "https://github.com/chanjunren/vaultusaurus",
  // Span of 8 / 12
  metadata: () => (
    <>
      <div className="flex flex-col gap-2 lg:col-span-2 col-span-4">
        <SecondaryHeader>Made with</SecondaryHeader>
        <BadgeList badges={["REACT"]} />
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2 col-span-4">
        <SecondaryHeader>Libraries</SecondaryHeader>
        <div className="flex flex-col gap-1">
          <span>MDAST</span>
          <span>UNIST</span>
          <span>REMARK</span>
          <span>D3</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 col-span-4">
        <SecondaryHeader>Date</SecondaryHeader>
        <span>03082024 - NOW</span>
      </div>
    </>
  ),
  extraButtons: ({ className }) => (
    <>
      <DocusaurusLink
        className={className}
        to={"https://github.com/chanjunren/vaultusaurus/wiki"}
        subLabel="📚"
        label="Wiki"
      />
      <DocusaurusLink
        className={className}
        to={"https://chanjunren.github.io/docs/zettelkasten/skywalking"}
        subLabel="📃"
        label="Sample"
      />
    </>
  ),
};

export default VaultusaurusProject;
