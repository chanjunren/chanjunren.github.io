import CustomTag from "@site/src/components/ui/custom-tag";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import {ModelInfo} from "@site/src/types/mvm";
import {IconManufacture, IconSwitchOff,} from "nucleo-isometric";
import {FC} from "react";
import ModelSelector from "./model-selector";
type Props = {
  connected: boolean;
  models: ModelInfo[];
  selectedModels: string[];
  onToggleModel: (alias: string) => void;
};

const MUTED_ICON_STYLE = { color: "var(--reduced-emphasis-color)", flexShrink: 0 } as const;

const MvmSidebar: FC<Props> = ({
  connected,
  models,
  selectedModels,
  onToggleModel,
}) => (
  <div className="flex flex-col gap-6">
    {/* Server status */}
    {/* TODO: wire up actual healthcheck once server port/path is finalized */}
    <div className="flex flex-col gap-2">
      <SecondaryHeader className="flex items-center gap-1.5">
        <IconSwitchOff size="18px" style={MUTED_ICON_STYLE} />
        Status
      </SecondaryHeader>
      <div className="flex items-center gap-2">
        <CustomTag color={connected ? "foam" : "muted"} className="text-sm!">
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </CustomTag>
      </div>
    </div>

    {/* Controls */}
    <div className="flex flex-col gap-4">
      <ModelSelector
        models={models}
        selectedModels={selectedModels}
        onToggleModel={onToggleModel}
      />
    </div>

    {/* Components */}
    <div className="flex flex-col gap-3">
      <SecondaryHeader className="flex items-center gap-1.5">
        <IconManufacture size="18px" />
        Components
      </SecondaryHeader>
      <div className="flex items-center gap-2">
        <span className="text-sm">Custom server</span>
        <CustomTag color="locked" className="text-xs!">LOCKED</CustomTag>
      </div>
      <span className="text-sm">Streamdown</span>
      <span className="text-sm">Claude Code</span>
    </div>
  </div>
);

export default MvmSidebar;
