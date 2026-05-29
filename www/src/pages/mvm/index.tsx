import Page from "@site/src/components/ui/page";
import SimpleCard from "@site/src/components/ui/simple-card";
import CustomTag from "@site/src/components/ui/custom-tag";
import MvmView from "@site/src/components/mvm/mvm-view";
import {
  IconNodes2,
  IconFaceWorried,
  IconSwitchOff,
  IconBrowserPen,
} from "nucleo-isometric";
import { FC } from "react";

const MvmPage: FC = () => {
  return (
    <Page
      title="MVM"
      description="Compare Claude model outputs side-by-side"
      className="flex flex-col gap-4 pt-7"
    >
      {/* Row 1: Title + Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleCard className="flex items-center gap-3 p-4">
          <IconNodes2
            size="28px"
            style={{ color: "var(--ifm-font-color-base)", flexShrink: 0 }}
          />
          <div className="flex flex-col">
            <span className="text-xl tracking-tight font-medium">MVM</span>
            <span className="text-xs text-(--reduced-emphasis-color)">
              Model vs Model
            </span>
          </div>
        </SimpleCard>

        <SimpleCard className="flex items-center gap-3 p-4">
          <IconBrowserPen
            size="24px"
            style={{ color: "var(--ifm-font-color-base)", flexShrink: 0 }}
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Streamdown</span>
            <span className="text-xs text-(--reduced-emphasis-color)">
              Streaming markdown renderer for live model output
            </span>
          </div>
        </SimpleCard>
      </div>

      {/* Row 2: Description / Disclaimer */}
      <SimpleCard className="flex items-start gap-3 p-4">
        <IconFaceWorried
          size="24px"
          style={{ color: "var(--ifm-font-color-base)", flexShrink: 0, marginTop: 2 }}
        />
        <span className="text-sm text-(--reduced-emphasis-color)">
          Compare Claude model outputs side-by-side. This tool requires a local
          server running from the{" "}
          <code className="rounded bg-[#191724] px-1.5 py-0.5 text-xs text-[#e0def4]">
            backies/
          </code>{" "}
          project. If you're interested in trying this out, please reach out to
          me personally.
        </span>
      </SimpleCard>

      {/* Row 3: Server status */}
      {/* TODO: wire up actual healthcheck once server port/path is finalized */}
      <SimpleCard className="flex items-center gap-2 p-3">
        <IconSwitchOff
          size="20px"
          style={{ color: "var(--reduced-emphasis-color)" }}
        />
        <span className="text-sm text-(--reduced-emphasis-color)">
          Server status:
        </span>
        <CustomTag color="muted" className="text-xs!">
          DISCONNECTED
        </CustomTag>
      </SimpleCard>

      {/* MVM tool */}
      <MvmView />
    </Page>
  );
};

export default MvmPage;
