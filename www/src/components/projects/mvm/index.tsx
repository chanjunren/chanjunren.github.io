import SimpleCard from "@site/src/components/ui/simple-card";
import CustomTag from "@site/src/components/ui/custom-tag";
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
  banner: () => <></>,
  description: () => <></>,
};

export default MvmProject;
