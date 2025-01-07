import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";

import mahjongPreview from "@site/static/images/mahjong.webp";
import skatingPreview from "@site/static/images/skating.webp";
import snowboardingPreview from "@site/static/images/snowboarding.webp";

import { FC, useEffect, useRef, useState } from "react";
import PrimaryHeader from "../common/PrimaryHeader";

type HobbyCardProps = {
  label: string;
  mediaUrl?: string;
  size?: "md" | "lg";
  preview: string;
};

const HobbyCard: FC<HobbyCardProps> = ({
  label,
  mediaUrl,
  size = "md",
  preview,
}) => {
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
      className={`flex flex-col items-center`}
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={`overflow-hidden rounded-md transition-all`}>
        <video
          className={`rounded-md aspect-square ${size === "lg" && "h-44"} ${
            size === "md" && "h-32"
          }  h-${size} w-${size} cursor-pointer ${
            playing ? "saturate-50" : "saturate-0"
          }`}
          ref={videoRef}
          playsInline
          autoPlay={false}
          src={mediaUrl}
          onEnded={handleVideoEnded}
          poster={preview}
        />
      </div>
      <span>{label}</span>
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <section>
      <PrimaryHeader>🍉 hobbies</PrimaryHeader>
      <div className="flex gap-5">
        <HobbyCard
          size="lg"
          label="skating"
          mediaUrl={skatingVideo}
          preview={skatingPreview}
        />
        <div className="flex flex-col gap-5">
          <HobbyCard
            label="snowboarding"
            mediaUrl={snowboardingVideo}
            preview={snowboardingPreview}
          />
          <HobbyCard
            label="mahjong 💸"
            mediaUrl={mahjongVideo}
            preview={mahjongPreview}
          />
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
