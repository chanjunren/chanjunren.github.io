import {
  BackpackIcon,
  DividerVerticalIcon,
  GitHubLogoIcon,
  HomeIcon,
  LinkedInLogoIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FC } from "react";

type ThreeJsTopicInfoComponent = {
  type: "link" | "externalLink" | "custom";
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  link?: string;
  label?: string;
  custom?: FC;
};

const topics: ThreeJsTopicInfoComponent[] = [
  { type: "link", icon: HomeIcon, link: "/", label: "home" },
  {
    type: "link",
    icon: Pencil2Icon,
    link: "/docs/zettelkasten",
    label: "notes",
  },
  {
    type: "custom",
    custom: () => <DividerVerticalIcon className="self-center opacity-20" />,
  },
  {
    type: "externalLink",
    icon: BackpackIcon,
    link: "/documents/resume.pdf",
    label: "resume",
  },
  {
    type: "externalLink",
    icon: GitHubLogoIcon,
    link: "https://www.github.com/chanjunren",
    label: "github",
  },
  {
    type: "externalLink",
    icon: LinkedInLogoIcon,
    link: "https://www.linkedin.com/in/jun-ren-chan-90240a175/",
    label: "linkedin",
  },
];

const FloatingMenu: FC = () => {
  return (
    <nav
      className={
        "flex gap-2 sticky bottom-5 shadow-md " +
        "rounded-full z-10 bg-white w-fit max-w-full inset-x-0 mx-auto p-5"
      }
    >
      {topics.map(
        ({ type, icon: Icon, link: key, custom: CustomItem, label }, index) =>
          type === "link" || type === "externalLink" ? (
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a
                    className={`!no-underline !text-[var(--ifm-font-color-base)] 
              flex items-center bg-transparent justify-center aspect-square
              `}
                    href={key}
                    target={type === "externalLink" ? "_blank" : "_self"}
                    key={"menuItem" + index}
                  >
                    <Icon className="w-8 h-8 p-1 text-lg" />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="TooltipContent"
                    sideOffset={22}
                    side="bottom"
                  >
                    <span>{label || "Hello"}</span>

                    {/* <Tooltip.Arrow className="TooltipArrow" /> */}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <CustomItem />
          )
      )}
    </nav>
  );
};

export default FloatingMenu;
