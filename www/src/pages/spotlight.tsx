import { FC } from "react";
import Page from "../components/common/Page";
import BuildingInProgress from "../components/home/BuildingInProgress";
import useGallery from "../components/home/hooks/useGallery";
import ProjectInfo from "../components/spotlight/ProjectInfo";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();
  const showNav =
    selectedProject?.displayNav === undefined
      ? true
      : selectedProject.displayNav;

  return (
    <Page
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
      className="lg:max-w-5xl flex flex-col justify-start gap-10"
    >
      {/* {showNav && <NavButton className="self-start" label="back" path="/" />} */}
      {selectedProject !== null ? (
        <>
          <selectedProject.banner />
          <ProjectInfo {...selectedProject} />
        </>
      ) : (
        <BuildingInProgress />
      )}
    </Page>
  );
};

export default Spotlight;
