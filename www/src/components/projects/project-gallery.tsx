import KakeiboGalleryCard from "@site/src/components/kakeibo/gallery-card";
import { KakeiboMockup } from "@site/src/components/kakeibo/mockup";
import CustomTag from "@site/src/components/ui/custom-tag";
import { GalleryProjectInfo } from "@site/src/types";
import { FC } from "react";
import useGallery from "../../hooks/useGallery";
import MyOldPortfolioBaby from "./oldportfolio";
import PixelLabInfo from "./pixelLab";
import PortalProject from "./portal";
import ProjectCard from "./project-card";
import VaultusaurusProject from "./vaultusaurus";

function KakeiboSpotlightBanner() {
  return (
    <KakeiboMockup>
      <div className="pb-5 pt-5 lg:pb-10 lg:pt-10">
        <CustomTag color="locked" className="font-mono">
          MOCK DATA
        </CustomTag>
      </div>
    </KakeiboMockup>
  );
}

export const GALLERY_PROJECTS: GalleryProjectInfo[] = [
  VaultusaurusProject,
  {
    id: "kakeibo",
    title: "家計簿",
    subtitle: "Finance tracker",
    containerCss: "md:col-span-6 md:row-span-2",
    card: KakeiboGalleryCard,
    banner: KakeiboSpotlightBanner,
    description: () => (
      <div className="flex flex-col gap-4">
        <p>
          A simple dashboard to keep track of how my money is currently
          disappearing 😭
        </p>
        <p>
          It works by extracting transactions from my bank-statement PDFs, then
          running the categorisation logic locally. Each category has a list of
          keywords, and every transaction resolves to one of them.
        </p>
        <p>
          Because this contains personal financial data, most flows stay local.
          It&apos;s not available to the public for now 🤓
        </p>
      </div>
    ),
  } satisfies GalleryProjectInfo,
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
