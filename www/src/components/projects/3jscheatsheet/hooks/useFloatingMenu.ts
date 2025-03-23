import { useRef, useState } from "react";
import { THREEJS_TOPIC } from "../constants";

export default function useFloatingMenu() {
  const [currentTopic, setCurrentTopic] = useState<THREEJS_TOPIC | null>();
  const [x1, setX1] = useState<number>(20);
  const [x2, setX2] = useState<number>(80);
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
    const menu = menuRef.current?.getBoundingClientRect();
    setCurrentTopic(topic);
  }

  return {
    currentTopic,
    onMenuItemSelect,
    menuRef,
    x1,
    x2,
  };
}
