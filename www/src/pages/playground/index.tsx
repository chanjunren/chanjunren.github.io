import Page from "@site/src/components/common/Page";
import debounce from "debounce";
import { FC, useCallback, useState } from "react";
import Shapes from "../../components/playground/shapes";
import { ViewBox } from "../../components/playground/viewbox";

const Playground: FC = () => {
  const [viewBox, setViewBox] = useState("30 0 80 80");
  const debouncedSetViewBox = useCallback(debounce(setViewBox, 400), []);

  return (
    <Page
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
      className="lg:max-w-5xl flex flex-col justify-start gap-10"
    >
      <div className="flex flex-col gap-10 items-center justify-center flex-grow">
        <label>
          <span className="mr-5">Viewbox</span>
          <input
            type="text"
            defaultValue={viewBox}
            onChange={(e) => debouncedSetViewBox(e.target.value)}
          />
        </label>
        <ViewBox viewBox={viewBox}>
          <Shapes />
        </ViewBox>
      </div>
    </Page>
  );
};

export default Playground;
