import { GalleryProjectInfo } from "@site/src/types";
import { FC, PropsWithChildren } from "react";
import useGallery from "../home/hooks/useGallery";
import MyOldPortfolioBaby from "./myOldPortfolioBaby";
import PixelLabInfo from "./pixelLab";
import PortalProject from "./portal";
import ProjectCard from "./ProjectCard";
import VaultusaurusProject from "./vaultusaurus";

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  PixelLabInfo,
  VaultusaurusProject,
  PortalProject,
  MyOldPortfolioBaby,
];

const ProjectGalleryColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className="md:col-span-1 col-span-3">{children}</div>;
};

const ProjectGallery: FC = () => {
  const { onGalleryProjSelected } = useGallery();

  const projectCards = GALLERY_PROJECTS.map((proj) => (
    <ProjectCard
      info={proj}
      onClick={() => onGalleryProjSelected(proj)}
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
