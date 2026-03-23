import {FC} from "react";
import PixelLabContainer from "../../helpers/container";
import FlipDotDisplay from "./display";

const FlipDot: FC = () => {
  return (
    <PixelLabContainer label="010" className={"aspect-auto! h-3"}
    >
      <FlipDotDisplay
        texts={["HOME", "ZETT", "ABOUT"]}
        font="micro"
        stagger="center"
        dotSize={6}
        dotGap={2}
        interval={5000}
        transitionMs={300}
      />
    </PixelLabContainer>
  );
};

export default FlipDot;
