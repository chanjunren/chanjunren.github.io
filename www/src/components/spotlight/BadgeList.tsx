import { FC } from "react";
import { BadgeType } from "../home/types";
import Badge from "./Badge";

type BadgeListProps = {
  badges: BadgeType[];
};
const BadgeList: FC<BadgeListProps> = ({ badges }) => {
  return (
    <div>
      {badges.map((badge, idx) => (
        <Badge key={`badge-${idx}`} type={badge} />
      ))}
    </div>
  );
};

export default BadgeList;
