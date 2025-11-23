import { GalleryProjectInfo } from "@site/src/types";
import { FC } from "react";
import useGallery from "../../hooks/useGallery";
import ThreeJsCheatsheetInfo from "./3jscheatsheet";
import MyOldPortfolioBaby from "./oldportfolio";
import PixelLabInfo from "./pixellab";
import PortalProject from "./portal";
import ProjectCard from "./project-card";
import VaultusaurusProject from "./vaultusaurus";

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  VaultusaurusProject,
  // ThreeJsCheatsheetInfo,
  PortalProject,
  MyOldPortfolioBaby,
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
