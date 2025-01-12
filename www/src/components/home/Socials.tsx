import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import CardButton from "../common/CardButton";

const LogoProps = "text-[var(--ifm-font-color-base)] h-4 w-4";

export default function Socials() {
  return (
    <div className="grid grid-cols-3 justify-center gap-3">
      <CardButton
        extraProps="hover:translate-y-1"
        externalLink="https://www.github.com/chanjunren"
        graphic={<GitHubLogoIcon className={LogoProps} />}
      />
      <CardButton
        extraProps="hover:translate-y-1"
        externalLink="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
        graphic={<LinkedInLogoIcon className={LogoProps} />}
      />
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="h-full">
              <CardButton
                extraProps="hover:translate-y-1 h-full"
                externalLink="/documents/resume.pdf"
                graphic={<BackpackIcon className={LogoProps} />}
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="TooltipContent"
              sideOffset={5}
              side="bottom"
            >
              resume (I haven't been updating this :D)
              <Tooltip.Arrow className="TooltipArrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
