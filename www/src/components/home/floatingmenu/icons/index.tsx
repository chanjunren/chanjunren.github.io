import {BackpackIcon, GitHubLogoIcon, LinkedInLogoIcon, PersonIcon, ReaderIcon} from "@radix-ui/react-icons";
import {FC} from "react";
import contactStyles from "./contact.module.css";
import styles from "./icons.module.css";

const NOTES_CHARACTERS = ["写", "写", "忘", "忘"];

export const NotesIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={styles.wrapper}>
    <ReaderIcon/>
    {hovering &&
      NOTES_CHARACTERS.map((char, i) => (
        <span key={i} className={`${styles.character} ${styles[`char${i}`]}`}>
          {char}
        </span>
      ))}
  </div>
);

export const AboutIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={styles.wrapper}>
    <PersonIcon/>
    {hovering && <span className={styles.greeting}>嗨！</span>}
  </div>
);

export const GithubIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={hovering ? contactStyles.shake : undefined}>
    <GitHubLogoIcon/>
  </div>
);

export const LinkedinIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={hovering ? contactStyles.jump : undefined}>
    <LinkedInLogoIcon/>
  </div>
);

export const ResumeIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={hovering ? contactStyles.spin : undefined}>
    <BackpackIcon/>
  </div>
);
