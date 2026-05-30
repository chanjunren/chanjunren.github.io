import SimpleCard from "@site/src/components/ui/simple-card";
import CustomTag from "@site/src/components/ui/custom-tag";
import { GalleryProjectInfo } from "@site/src/types";
import { IconArcadeCharacter } from "nucleo-isometric";

const ICON_COUNT = 200;
const icons = Array.from({ length: ICON_COUNT });

const ArcadeTile = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
        rowGap: 16,
        placeItems: "center",
        color: "var(--ifm-font-color-base)",
        opacity: 0.35,
        width: "100%",
      }}
    >
      {icons.map((_, i) => (
        <IconArcadeCharacter key={i} size="24px" />
      ))}
    </div>
  </div>
);

const MvmProject: GalleryProjectInfo = {
  id: "mvm",
  title: "MVM",
  subtitle: "Model vs Model",
  containerCss: "md:col-span-3",
  card: () => (
    <SimpleCard className="cursor-not-allowed rounded-lg relative overflow-hidden">
      <ArcadeTile />
      <CustomTag color="locked" className="absolute top-2 right-2 z-10">
        LOCKED
      </CustomTag>
    </SimpleCard>
  ),
  banner: () => <></>,
  description: () => <></>,
};

export default MvmProject;
