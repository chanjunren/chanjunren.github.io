import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";
import { FC, useEffect, useRef, useState } from "react";
import PrimaryHeader from "../common/PrimaryHeader";
import TypewriterText from "../common/TypewriterText";

type HobbyCardProps = {
  label: string;
  mediaUrl?: string;
  size?: "md" | "lg";
};

const HobbyCard: FC<HobbyCardProps> = ({ label, mediaUrl, size = "md" }) => {
  const [hovering, setHovering] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setPlaying(false);
    videoRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (playing) {
      videoRef?.current?.play();
    }
  }, [videoRef, playing]);

  return (
    <div
      className={`flex flex-col items-center gap-3`}
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={`overflow-hidden rounded-md transition-all`}>
        <video
          className={`rounded-md aspect-square ${size === "lg" && "h-56"} ${
            size === "md" && "h-32"
          }  h-${size} w-${size} cursor-pointer saturate-50 ${
            playing ? "" : "lg:blur-md"
          }`}
          ref={videoRef}
          playsInline
          autoPlay={false}
          src={mediaUrl}
          onEnded={handleVideoEnded}
        />
      </div>

      <TypewriterText
        className={`${hovering ? "opacity-100" : "opacity-0"}`}
        active={hovering}
        text={label}
      />
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <div>
      <PrimaryHeader>🍉 hobbies</PrimaryHeader>
      <div className="flex gap-5">
        <HobbyCard size="lg" label="skating" mediaUrl={skatingVideo} />
        <div className="flex flex-col gap-5">
          <HobbyCard label="snowboarding" mediaUrl={snowboardingVideo} />
          <HobbyCard label="mahjong 💸" mediaUrl={mahjongVideo} />
        </div>
      </div>
    </div>
  );
};

export default Hobbies;
