import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import HomeButton from "../common/HomeButton";

const LogoProps = "text-[var(--ifm-font-color-base)] h-5 w-5";

export default function Socials() {
  return (
    <section className="col-span-2">
      <div className="flex gap-5">
        <HomeButton
          link="https://www.github.com/chanjunren"
          external
          main={<GitHubLogoIcon className={LogoProps} />}
        />
        <HomeButton
          link="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
          external
          main={<LinkedInLogoIcon className={LogoProps} />}
        />
        <HomeButton
          link="/documents/resume.pdf"
          external
          main={<BackpackIcon className={LogoProps} />}
        />
      </div>
    </section>
  );
}
