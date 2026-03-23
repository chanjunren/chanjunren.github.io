import {FC} from "react";
import Page from "@site/src/components/ui/page";
import FloatingMenu from "@site/src/components/home/floatingmenu";
import CustomTag from "@site/src/components/ui/custom-tag";

const Experiment: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex flex-col items-center justify-center gap-1.5 w-fit!"
      footer={null}
      menu={<FloatingMenu/>}
    >
      <div className={"flex flex-col gap-3"}>
        <CustomTag color="rose">SVG Editor</CustomTag>
        <svg width="100%" viewBox="0 0 100 100">
          <defs>
            <pattern id=":r1:" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M 0 10 h 10 v -10" className="stroke-[var(--ifm-font-color-base)]" fill="none"
                    vector-effect="non-scaling-stroke" stroke-dasharray="5"></path>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#:r1:)" opacity={"0.7"}/>
          <path className="stroke-[var(--ifm-font-color-base)]" d="M 0 100 v -100 h 100" fill="none"
                opacity={"0.4"}
                stroke-dasharray="5"
                vector-effect="non-scaling-stroke"></path>
        </svg>
      </div>
    </Page>
  );
};

export default Experiment;
