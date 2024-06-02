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
                "h-4 group-hover/card:animate-bouncingShow opacity-0 z-[-99] bg-transparent border-none p-0"
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
                    className="p-2 rounded-md bg-black/70 mr-2 text-white"
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
