import {
  CropIcon,
  LayersIcon,
  StackIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import classNames from "classnames";
import { CSSProperties, FC } from "react";
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
  const { currentTopic, onMenuItemSelect, x1, x2, menuRef } = useFloatingMenu();

  return (
    <nav
      style={
        {
          "--x1": x1,
          "--x2": x2,
        } as CSSProperties
      }
      ref={menuRef}
      className={classNames(
        "flex gap-5 absolute top-28 left-1/2 transform -translate-x-1/2 shadow-md p-5 rounded-3xl"
      )}
    >
      <div className={styles.barBackground} />
      {topics.map(({ icon: Icon, key }) => (
        <button
          key={key}
          onClick={(e) => onMenuItemSelect(e, key)}
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
