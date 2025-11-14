import { FC } from "react";
import Page from "../components/common/Page";
import Quote from "../components/home/Quote";

const Experiment: FC = () => {
  return (
    <Page
      title={"home"}
      description="Hello! Welcome to my digital garden"
      className="flex-grow flex pt-7"
    >
      <Quote />
    </Page>
  );
};

export default Experiment;
