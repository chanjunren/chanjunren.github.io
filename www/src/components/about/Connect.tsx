import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import IconButton from "../common/IconButton";
import PrimaryHeader from "../common/PrimaryHeader";

export default function Connect() {
  //
  return (
    <section>
      <PrimaryHeader>📟 socials</PrimaryHeader>
      <div className="flex gap-5">
        <a href="https://www.github.com/chanjunren" target="_blank">
          <IconButton>
            <GitHubLogoIcon />
          </IconButton>
        </a>
        <a
          href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
          target="_blank"
        >
          <IconButton>
            <LinkedInLogoIcon />
          </IconButton>
        </a>

        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <a href="https://www.github.com/chanjunren" target="_blank">
                <IconButton>
                  <ReaderIcon />
                </IconButton>
              </a>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="TooltipContent"
                sideOffset={5}
                side="bottom"
              >
                (My resume) I haven't been updating this hehe
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </section>
  );
}
