import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";

import mahjongPreview from "@site/static/images/mahjong.webp";
import skatingPreview from "@site/static/images/skating.webp";
import snowboardingPreview from "@site/static/images/snowboarding.webp";

import { FC, useEffect, useRef, useState } from "react";
import PrimaryHeader from "../common/PrimaryHeader";
import TypewriterText from "../common/TypewriterText";

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
      className={`flex flex-col items-center relative h-fit`}
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`overflow-hidden transition-all relative items-center justify-center rounded-md aspect-square ${
          size === "lg" && "h-44"
        } ${size === "md" && "h-36"}`}
      >
        {hovering && !playing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm rounded-md cursor-pointer">
            <TypewriterText
              className="cursor-pointer text-shadow-lg"
              text={label}
              active={hovering}
              color="rgb(255, 255, 255)"
            />
          </div>
        )}
        <video
          className={`rounded-md saturate-50 h-full cursor-pointer transition-all duration-300`}
          ref={videoRef}
          playsInline
          autoPlay={false}
          src={mediaUrl}
          onEnded={handleVideoEnded}
          poster={preview}
        />
      </div>
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <section className="md:col-span-4 col-span-12">
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
