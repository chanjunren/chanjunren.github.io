import { ImageIcon } from "@radix-ui/react-icons";
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
      className="flex-grow gap-10 flex-col justify-center flex items-center md:ml-52"
    >
      {/* <img
        className="rounded-lg md:w-96 md:h-96 overflow-hidden md:absolute aspect-square shadow-md"
        src={homeWallpaper}
      /> */}
      {/* <div className="md:flex md:flex-col md:gap-7 md:left-80 md:relative grid grid-cols-2 gap-5"> */}
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
      <Socials />
      {/* </div> */}
    </Page>
  );
}
