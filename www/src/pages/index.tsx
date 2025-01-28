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
          className="rounded-lg md:min-w-96 md:min-h-96 min-w-80 min-h-72 overflow-hidden absolute"
          src={homeWallpaper}
        />
        <div className="flex flex-col gap-7 items-start justify-center md:left-80 left-48 relative">
          <HomeButton link="/about" main={"我"} subtitle="whoami" />
          <HomeButton
            link="/docs/zettelkasten"
            main={<LeafIcon className="w-4 h-4" />}
            subtitle="digital garden"
          />
          <HomeButton link="/gallery" main={<ImageIcon />} subtitle="gallery" />
          <Separator className="separatorRoot w-5" orientation="horizontal" />
          <Socials />
        </div>
      </div>
    </Page>
  );
}
