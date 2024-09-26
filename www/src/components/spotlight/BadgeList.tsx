import { BadgeType } from "@site/src/types";
import { FC } from "react";
import Badge from "./Badge";

type BadgeListProps = {
  badges: BadgeType[];
};
const BadgeList: FC<BadgeListProps> = ({ badges }) => {
  return (
    <div className="flex items-center">
      {badges.map((badge, idx) => (
        <Badge key={`badge-${idx}`} type={badge} />
      ))}
    </div>
  );
};

export default BadgeList;
