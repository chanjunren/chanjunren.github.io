import { CubeIcon, Pencil2Icon, RocketIcon } from "@radix-ui/react-icons";
import { Button } from "@site/src/components/ui/button";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import { Toggle } from "@site/src/components/ui/toggle";
import { ModelInfo } from "@site/src/types/mvm";
import { FC } from "react";

type Props = {
  models: ModelInfo[];
  selectedModels: string[];
  onToggleModel: (alias: string) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
};

const PromptForm: FC<Props> = ({
  models,
  selectedModels,
  onToggleModel,
  prompt,
  onPromptChange,
  onSubmit,
  loading,
  disabled,
}) => {
  const canSubmit =
    !disabled && !loading && selectedModels.length > 0 && prompt.trim() !== "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SecondaryHeader className="flex items-center gap-1.5 ">
          <CubeIcon className="size-3" />
          Models
        </SecondaryHeader>
        <div className="flex flex-wrap gap-2">
          {models.map((model) => (
            <Toggle
              key={model.alias}
              variant="outline"
              size="sm"
              pressed={selectedModels.includes(model.alias)}
              onPressedChange={() => onToggleModel(model.alias)}
            >
              {model.name}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SecondaryHeader className="flex items-center gap-1.5 ">
          <Pencil2Icon className="size-3" />
          Prompt
        </SecondaryHeader>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter a prompt to compare across models..."
          rows={3}
          className="w-full resize-y rounded-md border bg-[var(--background)] px-3 py-2.5 text-sm leading-relaxed text-[var(--ifm-font-color-base)] placeholder:text-[var(--reduced-emphasis-color)] focus:outline-none focus:ring-[3px] focus:ring-ring/50 transition-colors"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-fit"
      >
        <RocketIcon className="size-3" />
        {loading ? "Comparing..." : "Compare"}
      </Button>
    </div>
  );
};

export default PromptForm;
