import {PersonIcon, ReaderIcon} from "@radix-ui/react-icons";
import {FC} from "react";
import styles from "./icons.module.css";

const NOTES_CHARACTERS = ["读", "累"];

export const NotesIcon: FC<{ hovering: boolean }> = ({hovering}) => (
  <div className={styles.wrapper}>
    <ReaderIcon/>
    {hovering &&
      NOTES_CHARACTERS.map((char, i) => (
        <span key={char} className={`${styles.character} ${styles[`char${i}`]}`}>
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
