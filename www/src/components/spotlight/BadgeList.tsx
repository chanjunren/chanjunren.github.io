import { FC } from "react";
import { BadgeType } from "../home/types";
import Badge from "./Badge";

type BadgeListProps = {
  badges: BadgeType[];
};
const BadgeList: FC<BadgeListProps> = ({ badges }) => {
  return (
    <div className="flex items-center">
      <span className="mr-3">Made with</span>
      {badges.map((badge, idx) => (
        <Badge key={`badge-${idx}`} type={badge} />
      ))}
    </div>
  );
};

export default BadgeList;
