import { Kbd } from "@site/src/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@site/src/components/ui/tooltip";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";

/**
 * Focus mode hides the docs sidebar and the graph/TOC column on desktop for the
 * rest of the visit (resets on reload). Layout and motion live in
 * src/css/doc-focus.css, keyed off `html[data-doc-focus]`.
 */
interface DocFocus {
  focused: boolean;
  toggle: () => void;
}

const SHORTCUT_LABEL = "⌘\\";
const isShortcut = (e: KeyboardEvent) =>
  (e.metaKey || e.ctrlKey) && e.key === "\\";

// Not in TypeScript 5.2's DOM types yet.
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

/** Animates the DOM change as a view transition where supported. */
const withViewTransition = (update: () => void) => {
  const doc = document as ViewTransitionDocument;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!doc.startViewTransition || reducedMotion) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
};

const DocFocusContext = createContext<DocFocus | null>(null);

export const DocFocusProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [focused, setFocused] = useState(false);
  const toggle = useCallback(
    () => withViewTransition(() => setFocused((f) => !f)),
    [],
  );

  // Layout effect so the attribute lands inside the view transition's update.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (focused) root.dataset.docFocus = "";
    else delete root.dataset.docFocus;
    return () => {
      delete root.dataset.docFocus;
    };
  }, [focused]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isShortcut(e)) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(() => ({ focused, toggle }), [focused, toggle]);
  return (
    <DocFocusContext.Provider value={value}>
      {children}
    </DocFocusContext.Provider>
  );
};

/**
 * Sits as the first row of the docs sidebar and stays put when the panels
 * hide; position and styling are in src/css/doc-focus.css. Desktop only.
 */
export const DocFocusButton: FC = () => {
  const focus = useContext(DocFocusContext);
  if (!focus) return null;
  const label = focus.focused ? "show panels" : "hide panels";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={focus.focused}
          onClick={focus.toggle}
          className="doc-focus-button"
        >
          {focus.focused ? <PanelLeftOpen /> : <PanelLeftClose />}
          <Kbd>{SHORTCUT_LABEL}</Kbd>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};
