import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CSSProperties } from "react";
import CardButton from "../common/CardButton";

const LogoProps: CSSProperties = {
  color: "var(--ifm-font-color-base)",
  minWidth: "1.2rem",
  minHeight: "1.2rem",
};

export default function Socials() {
  return (
    <div className="grid grid-cols-3 justify-center gap-5">
      <CardButton
        extraProps="hover:translate-y-1"
        graphic={
          <a href="https://www.github.com/chanjunren" target="_blank">
            <GitHubLogoIcon style={LogoProps} />
          </a>
        }
      />
      <CardButton
        extraProps="hover:translate-y-1"
        graphic={
          <a
            href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
            target="_blank"
          >
            <LinkedInLogoIcon style={LogoProps} />
          </a>
        }
      />
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="h-full">
              <CardButton
                extraProps="hover:translate-y-1 h-full"
                redirect="/documents/resume.pdf"
                graphic={<BackpackIcon style={LogoProps} />}
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
