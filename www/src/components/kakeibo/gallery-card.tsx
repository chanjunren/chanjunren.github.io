import useBaseUrl from "@docusaurus/useBaseUrl";
import { useEffect, useRef, useState } from "react";

export default function KakeiboGalleryCard({
  onClick,
}: {
  onClick: () => void;
}) {
  const still = useBaseUrl("images/kakeibo-card.png");
  const gif = useBaseUrl("images/kakeibo-card.gif");
  const gifBlob = useRef<Promise<Blob> | null>(null);
  const hovering = useRef(false);
  const [playing, setPlaying] = useState<string | null>(null);

  // The GIF has no loop block, so it plays once and holds its last frame.
  // Browsers won't restart a finished GIF at the same URL, so each hover gets
  // a fresh object URL for the same downloaded blob.
  const play = async () => {
    hovering.current = true;
    gifBlob.current ??= fetch(gif).then((res) => res.blob());
    try {
      const blob = await gifBlob.current;
      if (hovering.current) {
        setPlaying(URL.createObjectURL(blob));
      }
    } catch {
      gifBlob.current = null;
    }
  };

  const stop = () => {
    hovering.current = false;
    setPlaying(null);
  };

  useEffect(() => {
    return () => {
      if (playing) {
        URL.revokeObjectURL(playing);
      }
    };
  }, [playing]);

  return (
    <div
      className="relative flex-grow cursor-pointer overflow-hidden rounded-lg shadow-md"
      onClick={onClick}
      onMouseEnter={play}
      onMouseLeave={stop}
    >
      <img
        src={playing ?? still}
        alt="Kiki counting coins and banknotes on her bed while Jiji sleeps"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
