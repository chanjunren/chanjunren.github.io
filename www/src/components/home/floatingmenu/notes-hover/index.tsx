import {FC, ReactNode, useState} from "react";
import styles from "./notes-hover.module.css";

const CHARACTERS = ["读", "学", "累", "思", "记"];

interface NotesHoverWrapperProps {
  children: ReactNode;
}

const NotesHoverWrapper: FC<NotesHoverWrapperProps> = ({children}) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children}
      {hovering &&
        CHARACTERS.map((char, i) => (
          <span
            key={char}
            className={`${styles.character} ${styles[`char${i}`]}`}
          >
            {char}
          </span>
        ))}
    </div>
  );
};

export default NotesHoverWrapper;
