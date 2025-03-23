import { useRef, useState } from "react";
import { THREEJS_TOPIC } from "../constants";

const offset = -5;

export default function useFloatingMenu() {
  const [currentTopic, setCurrentTopic] = useState<THREEJS_TOPIC | null>();
  const [left, setLeft] = useState<number | null>(100);
  const [right, setRight] = useState<number | null>(100);
  const [direction, setDirection] = useState<"left" | "right">();
  const menuRef = useRef<HTMLDivElement>(null);

  function onMenuItemSelect(
    e: React.MouseEvent<HTMLButtonElement>,
    topic: THREEJS_TOPIC
  ) {
    const currentMenuItem = (
      e.target as HTMLButtonElement
    ).getBoundingClientRect();
    const menuContainer = menuRef.current?.getBoundingClientRect();

    const newLeft =
      (100 * (currentMenuItem.x - menuContainer.x)) / menuContainer.width +
      offset;
    const newRight =
      (100 *
        (menuContainer.x +
          menuContainer.width -
          currentMenuItem.x -
          currentMenuItem.width)) /
        menuContainer.width +
      offset;

    if ((left == 100 && right == 100) || newLeft > left) {
      setDirection("right");
    } else {
      setDirection("left");
    }

    setRight(newRight);
    setLeft(newLeft);
    setCurrentTopic(topic);
  }

  return {
    currentTopic,
    onMenuItemSelect,
    menuRef,
    left,
    right,
    direction,
  };
}
