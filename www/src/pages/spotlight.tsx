import { FC } from "react";
import Page from "../components/common/Page";
import BuildingInProgress from "../components/home/BuildingInProgress";
import useGallery from "../components/home/hooks/useGallery";
import ProjectInfo from "../components/spotlight/ProjectInfo";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();

  return (
    <Page title={"spotlight"} description="Hello! Welcome to my digital garden">
      {selectedProject !== null ? (
        <div className="flex-grow flex flex-col w-full p-10 justify-start gap-10">
          <selectedProject.banner />
          <ProjectInfo {...selectedProject} />
        </div>
      ) : (
        <BuildingInProgress />
      )}
    </Page>
  );
};

export default Spotlight;
