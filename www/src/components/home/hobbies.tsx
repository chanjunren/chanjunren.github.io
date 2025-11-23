import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";

import mahjongPreview from "@site/static/images/mahjong.webp";
import skatingPreview from "@site/static/images/skating.webp";
import snowboardingPreview from "@site/static/images/snowboarding.webp";

import { FC, useEffect, useRef, useState } from "react";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import CustomTag from "@site/src/components/ui/custom-tag";

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
      className={`cursor-pointer relative ${size === "lg" && "md:h-44 h-36"} ${
        size === "md" && "h-36"
      }`}
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
          hovering && !playing
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 backdrop-blur-none pointer-events-none"
        }`}
      >
        <TypewriterText
          className="cursor-pointer text-shadow-md"
          text={label}
          active={hovering && !playing}
          color="rgb(255, 255, 255)"
        />
      </div>
      <video
        className={`rounded-lg saturate-50 h-full`}
        ref={videoRef}
        playsInline
        autoPlay={false}
        src={mediaUrl}
        onEnded={handleVideoEnded}
        poster={preview}
      />
    </div>
  );
};

const Hobbies: FC = () => {
  return (
    <section className="col-span-6 justify-self-end">
      <CustomTag
        color="iris"
        className="text-lg tracking-tighter! justify-self-center! mb-5"
      >
        HOBBIES
      </CustomTag>
      <div className="flex gap-5 flex-col md:flex-row">
        <HobbyCard
          size={"lg"}
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
