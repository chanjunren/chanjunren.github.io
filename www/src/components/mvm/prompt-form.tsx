import { Button } from "@site/src/components/ui/button";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import { IconPen } from "nucleo-isometric";
import { FC } from "react";

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
};

const PromptForm: FC<Props> = ({
  prompt,
  onPromptChange,
  onSubmit,
  loading,
  disabled,
}) => {
  const canSubmit = !disabled && !loading && prompt.trim() !== "";

  return (
    <div className="flex flex-col gap-4">
      <SecondaryHeader className="flex items-center gap-1.5">
        <IconPen size="18px" />
        Prompt
      </SecondaryHeader>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Enter a prompt to compare across models..."
        rows={3}
        className="w-full resize-y rounded-md border bg-[var(--background)] px-3 py-2.5 text-sm leading-relaxed text-[var(--ifm-font-color-base)] placeholder:text-[var(--reduced-emphasis-color)] focus:outline-none focus:ring-[3px] focus:ring-ring/50 transition-colors"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-fit"
      >
        {loading ? "Comparing..." : "Compare"}
      </Button>
    </div>
  );
};

export default PromptForm;
