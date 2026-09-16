import { GalleryProjectInfo } from "@site/src/types";
import {FC} from "react";
import useGallery from "../../hooks/useGallery";
import MyOldPortfolioBaby from "./oldportfolio";
import PixelLabInfo from "./pixelLab";
import PortalProject from "./portal";
import ProjectCard from "./project-card";
import MvmProject from "./mvm";
import VaultusaurusProject from "./vaultusaurus";
import KakeiboGalleryCard from "@site/src/components/kakeibo/gallery-card";

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  VaultusaurusProject,
  {
    id: "kakeibo",
    title: "家計簿",
    subtitle: "Finance tracker",
    containerCss: "md:col-span-6 md:row-span-2",
    card: KakeiboGalleryCard,
    banner: () => <></>,
    description: () => (
      <p>
        A personal finance dashboard for turning bank statements into a clear
        view of cash flow, spending categories, and recent transactions.
      </p>
    ),
  } satisfies GalleryProjectInfo,
  // ThreeJsCheatsheetInfo,
  MvmProject,
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
