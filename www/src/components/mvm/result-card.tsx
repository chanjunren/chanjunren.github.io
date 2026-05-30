import {CheckCircledIcon, CounterClockwiseClockIcon, CrossCircledIcon, TimerIcon, TokensIcon,} from "@radix-ui/react-icons";
import {ModelResult} from "@site/src/types/mvm";
import {FC} from "react";
import {Streamdown} from "streamdown";

type Props = {
  modelName: string;
  result: ModelResult;
};

const formatCost = (usd: number) =>
  usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(3)}`;

const ResultCard: FC<Props> = ({ modelName, result }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5 min-h-[4.5rem]">
        <div className="flex items-center gap-1.5">
          <span className="uppercase text-sm tracking-tightest text-(--reduced-emphasis-color)">
            {modelName}
          </span>
          {result.status === "streaming" && (
            <CounterClockwiseClockIcon className="size-3.5 text-(--reduced-emphasis-color) animate-spin" />
          )}
          {result.status === "error" && (
            <CrossCircledIcon className="size-3.5 text-(--ifm-color-primary)" />
          )}
          {result.status === "idle" && (
            <TimerIcon className="size-3.5 text-(--reduced-emphasis-color)" />
          )}
          {result.status === "done" && (
            <CheckCircledIcon className="size-3.5 text-green-600" />
          )}
        </div>
        {result.status === "done" && result.usage && (
          <div className="flex flex-col gap-0.5 text-(--reduced-emphasis-color)">
            <span className="flex items-center gap-1.5">
              <TokensIcon className="size-3" />
              {result.usage.input_tokens} in / {result.usage.output_tokens} out
            </span>
            {result.total_cost_usd != null && (
              <span className="flex items-center gap-1.5">
                {formatCost(result.total_cost_usd)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-(--menu-background) p-4 rounded-xl border border-border shadow-sm">
        <div className="min-h-20">
          {result.status === "error" ? (
            <p className="italic text-(--ifm-color-primary)">
              {result.error}
            </p>
          ) : result.status === "idle" && !result.text ? (
            <p className="italic text-(--reduced-emphasis-color)">
              Waiting for response...
            </p>
          ) : (
            <Streamdown
              mode={result.status === "streaming" ? "streaming" : "static"}
              isAnimating={result.status === "streaming"}
              animated={{ animation: "fadeIn", duration: 150 }}
              controls={false}
              lineNumbers={false}
              className="leading-relaxed [&_pre]:rounded-md [&_pre]:text-xs [&_table]:text-sm"
            >
              {result.text}
            </Streamdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
