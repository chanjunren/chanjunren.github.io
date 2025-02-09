import { DividerHorizontalIcon, ImageIcon } from "@radix-ui/react-icons";
import homeWallpaper from "@site/static/images/wallpaper.webp";
import { ReactElement } from "react";
import HomeButton from "../components/common/HomeButton";
import { LeafIcon } from "../components/common/Icons";
import Page from "../components/common/Page";
import Socials from "../components/home/Socials";

export default function Home(): ReactElement {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex-grow gap-10 md:gap-3 flex flex-col md:flex-row justify-center items-center relative"
    >
      <img
        className="rounded-lg md:w-96 md:h-96 overflow-hidden md:absolute aspect-square shadow-md"
        src={homeWallpaper}
      />
      <div className="md:flex md:flex-col md:gap-7 md:left-80 md:relative grid grid-cols-2 gap-5">
        <HomeButton
          link="/about"
          main={<span className="text-lg align-middle text-center">我</span>}
          subtitle="whoami"
        />
        <HomeButton
          link="/docs/zettelkasten"
          main={<LeafIcon className="w-5 h-5" />}
          subtitle="digital garden"
        />
        <HomeButton
          link="/gallery"
          main={<ImageIcon className="w-5 h-5" />}
          subtitle="gallery"
        />
        {/* <Separator className="separatorRoot w-5" orientation="horizontal" /> */}
        <DividerHorizontalIcon className="opacity-30 hidden md:block" />
        <Socials />
      </div>
    </Page>
  );
}
