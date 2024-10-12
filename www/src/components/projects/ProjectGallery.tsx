import { GalleryProjectInfo } from "@site/src/types";
import { FC, PropsWithChildren } from "react";
import useGallery from "../home/hooks/useGallery";
import PixelLabInfo from "./pixelLab";
import PortalProject from "./portal";
import ProjectCard from "./ProjectCard";
import VaultusaurusProject from "./vaultusaurus";

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  PixelLabInfo,
  VaultusaurusProject,
  PortalProject,
];

const ProjectGalleryColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className="col-span-12 lg:col-span-4">{children}</div>;
};

const ProjectGallery: FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();

  const projectCards = GALLERY_PROJECTS.map((proj) => (
    <ProjectCard
      info={proj}
      mini={selectedProject !== null}
      onClick={() => onGalleryProjSelected(proj)}
      selected={selectedProject?.id === proj?.id}
      key={`proj-${proj.id}`}
      cardImgClass={proj.cardImgClass}
    />
  ));

  const columns = [[], [], []] as JSX.Element[][];

  projectCards.forEach((card, index) => {
    columns[index % 3].push(card);
  });

  return (
    <>
      <ProjectGalleryColumn>{columns[0]}</ProjectGalleryColumn>
      <ProjectGalleryColumn>{columns[1]}</ProjectGalleryColumn>
      <ProjectGalleryColumn>{columns[2]}</ProjectGalleryColumn>
    </>
  );
};

export default ProjectGallery;
