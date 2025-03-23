import {
  CropIcon,
  LayersIcon,
  StackIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import classNames from "classnames";
import { CSSProperties, FC, useRef } from "react";
import { THREEJS_TOPIC } from "../constants";
import useFloatingMenu from "../hooks/useFloatingMenu";
import styles from "./index.module.css";

type ThreeJsTopicInfoComponent = {
  icon: FC;
  key: THREEJS_TOPIC;
};
const topics: ThreeJsTopicInfoComponent[] = [
  { icon: CropIcon, key: "item1" },
  { icon: LayersIcon, key: "item2" },
  { icon: StackIcon, key: "item3" },
  { icon: TokensIcon, key: "item4" },
];

const FloatingMenu: FC = () => {
  const { currentTopic, setCurrentTopic, x, x2 } = useFloatingMenu();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <nav
      ref={containerRef}
      style={
        {
          "--x": x,
          "--x2": x2,
        } as CSSProperties
      }
      className={classNames(
        "absolute top-28 left-1/2 transform -translate-x-1/2 flex gap-5 shadow-md p-5 rounded-lg"
      )}
    >
      {topics.map(({ icon: Icon, key }) => (
        <button
          key={key}
          onClick={() => setCurrentTopic(key)}
          className={classNames(styles.menuItem, {
            [styles.active]: currentTopic === key,
          })}
        >
          <Icon />
        </button>
      ))}
    </nav>
  );
};

export default FloatingMenu;
