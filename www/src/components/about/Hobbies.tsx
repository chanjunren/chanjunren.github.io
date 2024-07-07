import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
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
        className="rounded-md h-28 w-28 md:h-32 md:w-32"
        ref={videoRef}
        playsInline
        src={mediaUrl}
        onEnded={handleVideoEnded}
      />
    ) : (
      <span className="flex items-center justify-center text-4xl bg-[var(--gray-transparent-bg)] h-28 w-28 md:h-32 md:w-32 rounded-md cursor-pointer flex-grow">
        {children}
      </span>
    );

  return (
    <div
      className="flex flex-col items-center gap-3"
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
    <section>
      <PrimaryHeader>🍉 hobbies</PrimaryHeader>
      <div className="grid grid-cols-3 justify-items-start">
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
    </section>
  );
};

export default Hobbies;
