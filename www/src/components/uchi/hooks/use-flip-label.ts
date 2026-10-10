import { useContext, useEffect, useState } from "react";
import { LastPageContext } from "./context";

// Starts at the previous page's label, then switches to `label` after mount
// so the split-flap animates the change across navigation.
export function useFlipLabel(label: string) {
  const lastPage = useContext(LastPageContext);
  if (!lastPage) throw new Error("useFlipLabel must be used within UchiProvider");
  const [shown, setShown] = useState(() => lastPage.current ?? label);

  useEffect(() => {
    setShown(label);
    lastPage.current = label;
  }, [label, lastPage]);

  return shown;
}
