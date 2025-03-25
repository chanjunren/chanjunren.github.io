import { useRef, useState } from "react";
import { THREEJS_TOPIC } from "../constants";

const EXTRA = -5;

export default function useFloatingMenu() {
  const [currentTopic, setCurrentTopic] = useState<THREEJS_TOPIC | null>();
  const [left, setLeft] = useState<number>(20);
  const [right, setRight] = useState<number>(80);
  const menuRef = useRef<HTMLDivElement>(null);

  // x1: (x0 - xc) / Wc
  // x2: (x0 + w0 - xc) / Wc
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
      EXTRA;
    const newRight =
      (100 *
        (menuContainer.x +
          menuContainer.width -
          currentMenuItem.x -
          currentMenuItem.width)) /
        menuContainer.width +
      EXTRA;

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
  };
}
