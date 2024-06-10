import { FrameIcon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";

import { FC } from "react";
import { GalleryProject } from "../../types";

type CardHeaderProps = {
  project: GalleryProject;
  active: boolean;
};

const CardHeader: FC<CardHeaderProps> = ({ project, active }) => {
  const { tags, id } = project;
  return (
    <header className="group/tags max-[996px]:hidden">
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root open={active}>
          <Tooltip.Trigger asChild>
            <button
              className={
                "h-4 group-hover/card:opacity-100 opacity-0 z-[-99] bg-transparent border-none p-0"
              }
            >
              <FrameIcon />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side={"right"} sideOffset={5}>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, idx) => (
                  <span
                    className="px-3 py-2 mr-2 rounded-3xl bg-transparent text-[var(--ifm-font-color-base)] border-[var(--ifm-font-color-base)]"
                    key={`${id}-tag-${idx}`}
                  >
                    {tag}
                  </span>
                ))}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </header>
  );
};

export default CardHeader;
