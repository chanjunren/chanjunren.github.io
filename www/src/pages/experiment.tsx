import Page from "@site/src/components/common/Page";
import Quote from "@site/src/components/experiment/Quote";
import FloatingMenu from "@site/src/components/home/floatingmenuv2";
import { FC } from "react";

const Experiment: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex flex-col items-center justify-center gap-1.5 w-fit!"
      footer={null}
      menu={<FloatingMenu />}
    >
      <Quote />
    </Page>
  );
};

export default Experiment;
