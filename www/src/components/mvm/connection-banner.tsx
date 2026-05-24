import SimpleCard from "@site/src/components/ui/simple-card";
import { FC } from "react";

type Props = {
  connected: boolean;
};

const ConnectionBanner: FC<Props> = ({ connected }) => {
  if (connected) return null;

  return (
    <SimpleCard className="flex items-center gap-3 p-3 shadow-none!">
      <span className="text-sm text-(--reduced-emphasis-color)">
        <span className="font-medium text-[var(--ifm-font-color-base)]">
          Local API not running.
        </span>{" "}
        Start with{" "}
        <code className="rounded bg-[#191724] px-1.5 py-0.5 text-xs text-[#e0def4]">
          make run
        </code>{" "}
        in{" "}
        <code className="rounded bg-[#191724] px-1.5 py-0.5 text-xs text-[#e0def4]">
          backies/
        </code>
      </span>
    </SimpleCard>
  );
};

export default ConnectionBanner;
