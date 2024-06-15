import { FC } from "react";
import { BadgeType } from "../home/types";

const ThreeJSIcon = require("@site/static/badges/threeJs.svg").default;
const BlenderIcon = require("@site/static/badges/blender.svg").default;
const DocusaurusIcon = require("@site/static/badges/docusaurus.svg").default;
const MyLoveIcon = require("@site/static/badges/myLove.svg").default;
type BadgeProps = {
  type: BadgeType;
};

const BadgeMap: { [key in BadgeType]: FC } = {
  THREE_JS: () => (
    <ThreeJSIcon
      role="img"
      className="h-12 w-12 rounded-lg p-2 hover:bg-[--gray-transparent-bg]"
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

  return <BadgeComponent />;
};

export default Badge;
