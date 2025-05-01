import {
  BackpackIcon,
  CardStackIcon,
  DividerVerticalIcon,
  GitHubLogoIcon,
  HomeIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import classNames from "classnames";
import { FC } from "react";

type ThreeJsTopicInfoComponent = {
  type: "link" | "externalLink" | "custom";
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  link?: string;
  custom?: FC;
};

const topics: ThreeJsTopicInfoComponent[] = [
  { type: "link", icon: HomeIcon, link: "/" },
  { type: "link", icon: CardStackIcon, link: "/docs/zettelkasten" },
  {
    type: "custom",
    custom: () => <DividerVerticalIcon className="self-center opacity-20" />,
  },
  {
    type: "externalLink",
    icon: BackpackIcon,
    link: "/documents/resume.pdf",
  },
  {
    type: "externalLink",
    icon: GitHubLogoIcon,
    link: "https://www.github.com/chanjunren",
  },
  {
    type: "externalLink",
    icon: LinkedInLogoIcon,
    link: "https://www.linkedin.com/in/jun-ren-chan-90240a175/",
  },
];

const FloatingMenu: FC = () => {
  return (
    <nav
      className={classNames(
        "flex gap-1 sticky bottom-5 shadow-md " +
          "rounded-full z-10 bg-white w-fit max-w-full inset-x-0 mx-auto p-3"
      )}
    >
      {topics.map(
        ({ type, icon: Icon, link: key, custom: CustomItem }, index) =>
          type === "link" || type === "externalLink" ? (
            <a
              className={`rounded-md !no-underline !text-[var(--ifm-font-color-base)] 
              text-center flex items-center bg-transparent bg-gray-400 justify-center aspect-square
              hover:scale-125 transition-transform
              `}
              href={key}
              target={type === "externalLink" ? "_blank" : "_self"}
              key={"menuItem" + index}
            >
              <Icon className="w-9 h-9 p-2 text-lg" />
            </a>
          ) : (
            <CustomItem />
          )
      )}
    </nav>
  );
};

export default FloatingMenu;
