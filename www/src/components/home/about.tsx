import { SplitFlap } from "@site/src/components/ui/split-flap";
import { FC } from "react";

const About: FC = () => {
  return (
    <section className="col-span-12">
      <SplitFlap flipIn value="ABOUT" className="mb-5 text-lg" />
      <p className="text-balance leading-relaxed">
        Hi, I'm Jun Ren — welcome to my digital garden! This is where I tinker
        with ideas and keep my notes. Have fun exploring!
      </p>
    </section>
  );
};

export default About;
