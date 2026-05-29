import SimpleCard from "@site/src/components/ui/simple-card";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import BadgeList from "@site/src/components/spotlight/badge-list";
import CustomTag from "@site/src/components/ui/custom-tag";
import MvmView from "@site/src/components/mvm/mvm-view";
import { GalleryProjectInfo } from "@site/src/types";
import FaceTile from "./mvm-faces";

const MvmProject: GalleryProjectInfo = {
  id: "mvm",
  title: "MVM",
  subtitle: "Model vs Model",
  containerCss: "md:col-span-3",
  card: () => (
    <SimpleCard className="cursor-not-allowed rounded-lg relative overflow-hidden">
      <FaceTile />
      <CustomTag color="locked" className="absolute top-2 right-2 z-10">
        LOCKED
      </CustomTag>
    </SimpleCard>
  ),
  banner: () => (
    <div className="relative overflow-hidden h-52 bg-(--gray-transparent-bg) self-center w-screen">
      <FaceTile />
    </div>
  ),
  description: () => (
    <div className="flex flex-col w-full gap-5">
      <span>
        A side-by-side comparison tool for Claude models. Submit the same prompt
        to Haiku, Sonnet, and Opus, then compare outputs, token counts, and
        costs in real time.
      </span>
      <MvmView />
    </div>
  ),
  repository:
    "https://github.com/chanjunren/chanjunren.github.io/tree/master/www/src/components/mvm",
  metadata: () => (
    <>
      <div className="flex flex-col gap-2 lg:col-span-4 col-span-6 py-5">
        <SecondaryHeader>Made with</SecondaryHeader>
        <BadgeList badges={["REACT"]} />
      </div>
      <div className="flex flex-col gap-2 lg:col-span-4 col-span-6 py-5">
        <SecondaryHeader>Date</SecondaryHeader>
        <span>052025</span>
      </div>
    </>
  ),
};

export default MvmProject;
