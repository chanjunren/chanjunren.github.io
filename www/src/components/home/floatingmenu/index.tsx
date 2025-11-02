import * as Tooltip from "@radix-ui/react-tooltip";
import { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import HeaderTag from "../../common/HeaderTag";

type IFloatingMenuItem = {
  type: "link" | "externalLink" | "custom";
  icon?: ReactNode;
  link?: string;
  label?: string;
  custom?: FC;
};

const topics: IFloatingMenuItem[] = [
  {
    type: "link",
    icon: <HeaderTag label="哈喽" color="rose" />,
    link: "/",
    label: "home",
  },
  {
    type: "link",
    icon: <HeaderTag color="pine" label="数园" />,
    link: "/docs/zettelkasten",
    label: "notes",
  },
  // {
  //   type: "custom",
  //   custom: () => <DividerVerticalIcon className="self-center opacity-20" />,
  // },
  {
    type: "externalLink",
    icon: <HeaderTag label="请我" color="foam" />,
    link: "/documents/resume.pdf",
    label: "resume",
  },
  {
    type: "externalLink",
    icon: <HeaderTag label="吉特" color="iris" />,
    link: "https://www.github.com/chanjunren",
    label: "github",
  },
  {
    type: "externalLink",
    icon: <HeaderTag label="力银" color="muted" />,
    link: "https://www.linkedin.com/in/jun-ren-chan-90240a175/",
    label: "linkedin",
  },
];

const FloatingMenu: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // SSR-safe
  return createPortal(
    <nav
      className={
        "flex gap-4 fixed bottom-5 shadow-md " +
        "rounded-md z-10 bg-white w-fit max-w-full inset-x-0 mx-auto px-6 py-5"
      }
    >
      {topics.map(
        ({ type, icon, link: key, custom: CustomItem, label }, index) =>
          type === "link" || type === "externalLink" ? (
            <Tooltip.Provider delayDuration={0} key={"menuItem" + index}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a
                    className={`!no-underline !text-[var(--ifm-font-color-base)] bg-transparent
                      flex items-center
              `}
                    href={key}
                    target={type === "externalLink" ? "_blank" : "_self"}
                    key={"menuItem" + index}
                  >
                    {icon}
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="TooltipContent"
                    sideOffset={17}
                    side="bottom"
                  >
                    <span>{label}</span>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <CustomItem />
          )
      )}
    </nav>,
    document.body
  );
};

export default FloatingMenu;
