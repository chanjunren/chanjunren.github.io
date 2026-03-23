import {FC} from "react";
import Page from "@site/src/components/ui/page";
import FloatingMenu from "@site/src/components/home/floatingmenu";
import SvgEditor from "@site/src/components/utilities/svgeditor";

const Experiment: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex flex-col items-center justify-center gap-1.5 w-fit!"
      footer={null}
      menu={<FloatingMenu/>}
    >
      <SvgEditor/>
    </Page>
  );
};

export default Experiment;
