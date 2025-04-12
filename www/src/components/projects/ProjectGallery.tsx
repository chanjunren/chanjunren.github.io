import { GalleryProjectInfo } from "@site/src/types";
import { FC } from "react";
import useGallery from "../home/hooks/useGallery";
import ThreeJsCheatsheetInfo from "./3jscheatsheet";
import MyOldPortfolioBaby from "./oldportfolio";
import PixelLabInfo from "./pixellab";
import PortalProject from "./portal";
import ProjectCard from "./ProjectCard";
import VaultusaurusProject from "./vaultusaurus";
import Zettelkasten from "./zettelkasten";

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  VaultusaurusProject,
  Zettelkasten,
  PortalProject,
  MyOldPortfolioBaby,
  ThreeJsCheatsheetInfo,
  PixelLabInfo,
];

const ProjectGallery: FC = () => {
  const { onGalleryProjSelected } = useGallery();

  return (
    <>
      {GALLERY_PROJECTS.map((proj) => (
        <ProjectCard
          info={proj}
          onClick={() => onGalleryProjSelected(proj)}
          key={`proj-${proj.id}`}
        />
      ))}
    </>
  );
};

export default ProjectGallery;
