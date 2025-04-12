import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import HomeButton from "../common/HomeButton";
import PrimaryHeader from "../common/PrimaryHeader";

const LogoProps = "text-[var(--ifm-font-color-base)] h-5 w-5";

export default function Socials() {
  return (
    <section className="col-span-2">
      <PrimaryHeader>📞 socials</PrimaryHeader>
      <HomeButton
        link="https://www.github.com/chanjunren"
        subtitle="github"
        external
        main={<GitHubLogoIcon className={LogoProps} />}
      />
      <HomeButton
        link="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
        subtitle="linkedin"
        external
        main={<LinkedInLogoIcon className={LogoProps} />}
      />
      <HomeButton
        link="/documents/resume.pdf"
        subtitle="resume"
        external
        main={<BackpackIcon className={LogoProps} />}
      />

      {/* <CardButton
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
              resume
              <Tooltip.Arrow className="TooltipArrow" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider> */}
    </section>
  );
}
