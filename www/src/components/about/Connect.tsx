import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
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

        <a href="https://www.github.com/chanjunren" target="_blank">
          <IconButton>
            <ReaderIcon />
          </IconButton>
        </a>
      </div>
    </section>
  );
}
