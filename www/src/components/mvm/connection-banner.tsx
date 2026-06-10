import SimpleCard from "@site/src/components/ui/simple-card";
import { FC } from "react";
import { HealthResponse } from "./mvm-client";

type Props = {
  connected: boolean;
  health: HealthResponse | null;
};

const ConnectionBanner: FC<Props> = ({ connected, health }) => {
  if (!connected) {
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
  }

  if (health?.status === "degraded") {
    return (
      <SimpleCard className="flex items-center gap-3 p-3 shadow-none!">
        <span className="text-sm text-(--reduced-emphasis-color)">
          <span className="font-medium text-[var(--ifm-font-color-base)]">
            Server degraded.
          </span>{" "}
          {health.error}
        </span>
      </SimpleCard>
    );
  }

  return null;
};

export default ConnectionBanner;
