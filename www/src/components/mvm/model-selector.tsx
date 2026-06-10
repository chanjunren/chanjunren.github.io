import {CheckIcon} from "@radix-ui/react-icons";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import {Toggle} from "@site/src/components/ui/toggle";
import {ModelInfo} from "@site/src/types/mvm";
import {IconCube} from "nucleo-isometric";
import {FC} from "react";

type Props = {
  models: ModelInfo[];
  selectedModels: string[];
  onToggleModel: (alias: string) => void;
};

const ModelSelector: FC<Props> = ({ models, selectedModels, onToggleModel }) => (
  <div className="flex flex-col gap-2">
    <SecondaryHeader className="flex items-center gap-1.5">
      <IconCube size="18px" />
      Models
    </SecondaryHeader>
    <div className="flex flex-col gap-2 w-fit">
      {models.map((model) => {
        const pressed = selectedModels.includes(model.alias);
        return (
          <Toggle
            key={model.alias}
            variant="outline"
            size="sm"
            className="h-7 px-2 justify-start data-[state=off]:opacity-60 data-[state=on]:border-(--ifm-color-primary) data-[state=on]:text-(--ifm-color-primary) data-[state=on]:bg-(--ifm-color-primary)/10"
            pressed={pressed}
            onPressedChange={() => onToggleModel(model.alias)}
          >
            {model.name}
            {pressed && <CheckIcon className="size-3.5" />}
          </Toggle>
        );
      })}
    </div>
  </div>
);

export default ModelSelector;
