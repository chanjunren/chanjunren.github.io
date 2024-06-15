import { FC, PropsWithChildren, useState } from "react";
import PrimaryHeader from "../common/PrimaryHeader";
import TypewriterText from "../common/TypewriterText";

type HobbyCardProps = {
  label: string;
  mediaUrl: string;
};

const HobbyCard: FC<PropsWithChildren<HobbyCardProps>> = ({
  children,
  label,
  mediaUrl,
}) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className="flex flex-col items-center gap-3"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <span className="text-4xl bg-[var(--gray-transparent-bg)] p-14 rounded-md cursor-default">
        {children}
      </span>
      <TypewriterText active={hovering} text={label} />
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <section className="col-span-2">
      <PrimaryHeader>🍉 hobbies</PrimaryHeader>
      <div className="flex gap-5">
        <HobbyCard label="skating" mediaUrl="cdn_url">
          🛼
        </HobbyCard>
        <HobbyCard label="snowboarding" mediaUrl="cdn_url">
          🏂
        </HobbyCard>
        <HobbyCard label="mahjong 💸" mediaUrl="cdn_url">
          🀄️
        </HobbyCard>
      </div>
    </section>
  );
};

export default Hobbies;
