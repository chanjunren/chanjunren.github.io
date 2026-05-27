import CustomTag from "@site/src/components/ui/custom-tag";
import { FC } from "react";

const About: FC = () => {
  return (
    <section className="col-span-12">
      <CustomTag
        color="pine"
        className="text-lg tracking-tighter! justify-self-center! mb-5"
      >
        ABOUT
      </CustomTag>
      <p className="text-balance leading-relaxed">
        Hi, I'm Jun Ren — welcome to my digital garden! This is where I tinker
        with ideas and keep my notes. Have fun exploring!
      </p>
    </section>
  );
};

export default About;
