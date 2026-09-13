import CustomTag from "@site/src/components/ui/custom-tag";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@site/src/components/ui/tooltip";

export function Wordmark() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="w-fit border-0 bg-transparent p-0">
          <CustomTag color="rose" className="text-base! font-semibold">
            うち
          </CustomTag>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="max-w-64 leading-relaxed"
      >
        うち (uchi)
        <br />
        meaning home, inside, or one&apos;s inner circle
        <br />
        <br />
        my secret projects
      </TooltipContent>
    </Tooltip>
  );
}
