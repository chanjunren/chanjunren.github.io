import { ImageIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";
import homeWallpaper from "@site/static/images/wallpaper.webp";
import { ReactElement } from "react";
import HomeButton from "../components/common/HomeButton";
import { LeafIcon } from "../components/common/Icons";
import Page from "../components/common/Page";
import Socials from "../components/home/Socials";
export default function Home(): ReactElement {
  return (
    <Page title={"home"} description="Hello! Welcome to my digital garden">
      <div className="flex-grow gap-3 flex justify-center items-center relative">
        <img
          className="rounded-lg md:min-w-96 md:min-h-96 min-w-64 min-h-72 overflow-hidden absolute"
          src={homeWallpaper}
        />
        <div className="flex flex-col md:gap-7 gap-6 items-start justify-center md:left-80 left-40 relative">
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
          <Separator className="separatorRoot w-5" orientation="horizontal" />
          <Socials />
        </div>
      </div>
    </Page>
  );
}
