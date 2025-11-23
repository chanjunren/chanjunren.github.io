import Page from "@site/src/components/ui/page";
import FloatingMenu from "@site/src/components/home/floatingmenu";
import { FC } from "react";
import Work from "@site/src/components/home/experience";
import Hobbies from "@site/src/components/home/hobbies";
import Gallery from "@site/src/components/home/gallery";

const WhoAmI: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="grow grid grid-cols-12 gap-5 md:gap-10 gap-y-20 pt-7"
      footer={null}
      menu={<FloatingMenu />}
    >
      <Work />
      <Hobbies />
      <Gallery />
    </Page>
  );
};

export default WhoAmI;
