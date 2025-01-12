import homeWallpaper from "@site/static/images/test.webp";
import { ReactElement } from "react";
import CardButton from "../components/common/CardButton";
import Page from "../components/common/Page";
import Socials from "../components/home/Socials";
export default function Home(): ReactElement {
  return (
    <Page title={"home"} description="Hello! Welcome to my digital garden">
      <div className="flex-grow gap-10 flex flex-col md:flex-row items-center">
        <img
          className="rounded-lg md:w-96 md:h-96 w-60 h-60"
          src={homeWallpaper}
        />
        <div className="flex flex-col gap-2 w-full">
          <CardButton
            extraProps="hover:scale-105"
            title="About"
            subtitle="whoami"
            redirect="/about"
          />
          <CardButton
            extraProps="hover:rotate-1"
            redirect="/docs/zettelkasten"
            title="zett"
            subtitle="digital garden"
          />
          <CardButton
            extraProps="hover:scale-105"
            redirect="gallery"
            title="gallery"
            subtitle="stuff i made"
          />
          <Socials />
        </div>
      </div>
    </Page>
  );
}
