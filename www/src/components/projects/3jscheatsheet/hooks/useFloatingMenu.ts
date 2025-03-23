import { useState } from "react";
import { THREEJS_TOPIC } from "../constants";

export default function useFloatingMenu() {
  const [currentTopic, setCurrentTopic] = useState<THREEJS_TOPIC | null>();
  const [x, setX] = useState<number>(0);
  const [x2, setX2] = useState<number>(0);

  return {
    currentTopic,
    setCurrentTopic,
    x,
    x2,
  };
}
