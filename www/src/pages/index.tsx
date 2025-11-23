import Page from "@site/src/components/ui/page";
import Quote from "@site/src/components/home/quote";
import FloatingMenu from "@site/src/components/home/floatingmenu";
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
