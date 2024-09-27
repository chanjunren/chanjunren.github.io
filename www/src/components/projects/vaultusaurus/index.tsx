import DocusaurusLink from "@site/src/components/common/DocusaurusLink";
import { GalleryProjectInfo } from "@site/src/types";
import IdealImage from "@theme/IdealImage";
import { DocusaurusIcon } from "../../common/Icons";
import SecondaryHeader from "../../common/SecondaryHeader";

const VaultusaurusProject: GalleryProjectInfo = {
  id: "vaultusaurus",
  title: "Vaultusaurus",
  subtitle: "Docusaurus plugin",
  card: ({ onClick }) => (
    <div
      className="flex items-center w-full justify-center h-36 cursor-pointer gap-5 bg-graphPaper rounded-lg border-[#D3D3D3] border-[1px] border-solid border-opacity-40"
      onClick={onClick}
    >
      <DocusaurusIcon className="h-14 w-14" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  banner: () => (
    <div className="flex items-center w-full justify-center h-36 cursor-pointer gap-5 bg-graphPaper">
      <DocusaurusIcon className="h-14 w-14" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  dob: "03082024 - NOW",
  badges: ["REACT"],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => (
    <div className="flex flex-col w-full gap-5">
      <span>
        I wanted to have a system for organizing what little I know and have a
        means of quickly accessing golden nuggets of knowledge that I have come
        across, and through my Youtube adventures I came across the concept of a
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
      <div className="grid items-center justify-items-center gap-5">
        <IdealImage
          className="flex-grow"
          img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/obsidian_demo.png"
        />
        <SecondaryHeader>Obsidian markdown</SecondaryHeader>
        <IdealImage
          className="flex-grow "
          img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/docusaurus_without_plugin_demo.png"
        />
        <SecondaryHeader>
          Corresponding markdown rendered by Docusaurus
        </SecondaryHeader>
      </div>
      <span>
        I was fascinated by Obsidian's
        <a
          className="mx-2"
          href="https://help.obsidian.md/Plugins/Graph+view"
          target="_blank"
        >
          graph view
        </a>
        as it was fun playing with the graph, and it also served as a useful
        tool for revision / have a bird eye view of how notes relate to one
        another through tags and internal links
      </span>
      <span>
        And thus I gave birth to Vaultusaurus - a Docusaurus plugin for
        transforming Obsidian's markdown syntax into Docusaurus-compatible
        format and rendering Obsidian's Local Graph
      </span>
      <IdealImage img="https://raw.githubusercontent.com/chanjunren/vaultusaurus/master/assets/vaultusaurus_demo.png" />
      <span>
        The markdown files are processed using MDAST related libraries with a
        remark plugin, and the graph is rendered using D3
      </span>
    </div>
  ),
  repository: "https://github.com/chanjunren/vaultusaurus",
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
        subLabel="🐵"
        label="See it in action"
      />
    </>
  ),
};

export default VaultusaurusProject;
