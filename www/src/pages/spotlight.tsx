import { FC } from "react";
import LayoutWrapper from "../components/common/LayoutWrapper";
import BuildingInProgress from "../components/home/BuildingInProgress";
import useGallery from "../components/home/hooks/useGallery";
import ProjectInfo from "../components/spotlight/ProjectInfo";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();

  return (
    <LayoutWrapper
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
    >
      {selectedProject !== null ? (
        <div className="flex-grow flex flex-col w-full p-10 justify-start gap-10">
          <selectedProject.banner />
          <ProjectInfo {...selectedProject} />
        </div>
      ) : (
        <BuildingInProgress />
      )}
    </LayoutWrapper>
  );
};

export default Spotlight;
