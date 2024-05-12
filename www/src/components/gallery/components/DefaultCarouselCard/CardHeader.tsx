import { FrameIcon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";

import { FC } from "react";
import { GalleryProject } from "../../types";

const CardHeader: FC<GalleryProject> = ({ tags, id }) => {
  return (
    <header className="group/tags">
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className={
                "h-4 group-hover/card:animate-bouncing-show opacity-0 z-[-99] translate-y-[2rem] bg-transparent border-none p-0"
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
