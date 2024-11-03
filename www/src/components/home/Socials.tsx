import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import IconButton from "../common/IconButton";
import PrimaryHeader from "../common/PrimaryHeader";

export default function Socials() {
  //
  return (
    <div>
      <PrimaryHeader>📟 socials</PrimaryHeader>
      <div className="flex gap-5">
        <a href="https://www.github.com/chanjunren" target="_blank">
          <IconButton>
            <GitHubLogoIcon style={{ color: "var(--ifm-font-color-base)" }} />
          </IconButton>
        </a>
        <a
          href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
          target="_blank"
        >
          <IconButton>
            <LinkedInLogoIcon style={{ color: "var(--ifm-font-color-base)" }} />
          </IconButton>
        </a>

        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <a href="/documents/resume.pdf" target="_blank">
                <IconButton>
                  <ReaderIcon style={{ color: "var(--ifm-font-color-base)" }} />
                </IconButton>
              </a>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="TooltipContent"
                sideOffset={5}
                side="bottom"
              >
                Resume (I haven't been updating this :D)
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
}
