import * as Tooltip from "@radix-ui/react-tooltip";
import { BadgeType } from "@site/src/types";
import { FC } from "react";

const ThreeJSIcon = require("@site/static/svg/threeJs.svg").default;
const BlenderIcon = require("@site/static/svg/blender.svg").default;
const DocusaurusIcon = require("@site/static/svg/docusaurus.svg").default;
const MyLoveIcon = require("@site/static/svg/myLove.svg").default;

type BadgeProps = {
  type: BadgeType;
};

const BadgeLabel: { [key in BadgeType]: string } = {
  THREE_JS: "threeJS",
  BLENDER: "blender",
  MY_LOVE: "my love",
  DOCUSAURUS: "docusaurus",
};

const BadgeMap: { [key in BadgeType]: FC } = {
  THREE_JS: () => (
    <ThreeJSIcon
      role="img"
      className="h-12 w-12 rounded-lg p-2 hover:bg-[--gray-transparent-bg] "
    />
  ),
  BLENDER: () => (
    <BlenderIcon
      role="img"
      className="h-12 w-12 rounded-lg p-2 hover:bg-[--gray-transparent-bg]"
    />
  ),
  DOCUSAURUS: () => (
    <DocusaurusIcon
      role="img"
      className="h-12 w-12 rounded-lg p-1 hover:bg-[--gray-transparent-bg]"
    />
  ),
  MY_LOVE: () => (
    <MyLoveIcon
      role="img"
      className="h-12 w-12 rounded-lg p-1 hover:bg-[--gray-transparent-bg]"
    />
  ),
};

const Badge: FC<BadgeProps> = ({ type }) => {
  const BadgeComponent = BadgeMap[type];

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="w-fit bg-transparent border-none p-0">
            <BadgeComponent />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={5}
            side="bottom"
          >
            {BadgeLabel[type]}
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default Badge;
