import mahjongVideo from "@site/static/videos/mahjong.mp4";
import skatingVideo from "@site/static/videos/skating.mp4";
import snowboardingVideo from "@site/static/videos/snowboarding.mp4";

import mahjongPreview from "@site/static/images/mahjong.webp";
import skatingPreview from "@site/static/images/skating.webp";
import snowboardingPreview from "@site/static/images/snowboarding.webp";

import { PlayIcon } from "@radix-ui/react-icons";
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
      className={`flex flex-col items-center relative py-3 px-5 h-fit`}
      onClick={() => setPlaying(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`overflow-hidden transition-all relative items-center justify-center`}
      >
        {!playing && (
          <PlayIcon className="bg-gray-700 backdrop-blur-sm bg-opacity-5 rounded-md text-white absolute left-1/2 top-1/2 z-10 p-1 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        )}
        <video
          className={`rounded-md bg-white shadow-md p-2 aspect-square ${
            size === "lg" && "h-44"
          } ${
            size === "md" && "h-32"
          }  h-${size} w-${size} cursor-pointer ${"saturate-50"}`}
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
