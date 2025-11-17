import { FC } from "react";
import Page from "@site/src/components/common/Page";
import Quote from "@site/src/components/experiment/Quote";
import Welcome from "@site/src/components/experiment/Welcome";
import HomeImage from "@site/src/components/experiment/HomeImage";
import HomeMenu from "@site/src/components/experiment/HomeMenu";
import LitFooter from "@site/src/components/common/LitFooter";

const Experiment: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="grid grid-cols-2 gap-3 content-center w-xl"
      footer={null}
    >
      <div className="flex gap-3 col-span-2">
        <HomeImage />
        <HomeMenu />
      </div>
      <Quote />
    </Page>
  );
};

export default Experiment;
