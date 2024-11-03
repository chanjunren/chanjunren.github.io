import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import HoverCard from "../common/HoverCard";
import PrimaryHeader from "../common/PrimaryHeader";
import TypewriterText from "../common/TypewriterText";

type HobbyCardProps = {
  label: string;
  mediaUrl?: string;
};

const HobbyCard: FC<PropsWithChildren<HobbyCardProps>> = ({
  children,
  label,
  mediaUrl,
}) => {
  const [hovering, setHovering] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setPlaying(false);
  };

  useEffect(() => {
    if (playing) {
      videoRef?.current?.play();
    }
  }, [videoRef, playing]);

  const cardContent =
    mediaUrl && playing ? (
      <video
        className="rounded-md aspect-square h-32 w-32"
        ref={videoRef}
        playsInline
        src={mediaUrl}
        onEnded={handleVideoEnded}
      />
    ) : (
      <HoverCard className="flex items-center justify-center text-4xl flex-grow min-h-32 min-w-32">
        {children}
      </HoverCard>
    );

  return (
    <div
      className="flex flex-col items-center gap-3 mt-2 h-fit w-fit"
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {cardContent}
      <TypewriterText active={hovering} text={label} />
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <div>
      <PrimaryHeader>🍉 hobbies</PrimaryHeader>
      <div className="flex justify-start gap-4 flex-wrap">
        <HobbyCard label="skating" mediaUrl={skatingVideo}>
          🛼
        </HobbyCard>
        <HobbyCard label="snowboarding" mediaUrl={snowboardingVideo}>
          🏂
        </HobbyCard>
        <HobbyCard label="mahjong 💸" mediaUrl={mahjongVideo}>
          🀄️
        </HobbyCard>
      </div>
    </div>
  );
};

export default Hobbies;
