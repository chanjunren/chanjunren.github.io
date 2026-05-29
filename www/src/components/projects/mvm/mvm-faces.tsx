import {
  IconFaceSmile,
  IconFaceNerdSmile,
  IconFaceGrin,
  IconFaceWorried,
  IconFaceWorried2,
} from "nucleo-isometric";
import { FC } from "react";

const FACES = [IconFaceSmile, IconFaceNerdSmile, IconFaceGrin, IconFaceWorried, IconFaceWorried2];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

type FaceTileProps = {
  size?: number;
  cellSize?: number;
  seed?: number;
};

const FACE_COUNT = 200;

const FaceTile: FC<FaceTileProps> = ({
  size = 24,
  cellSize = 56,
  seed = 42,
}) => {
  const rand = seededRandom(seed);
  const cells = Array.from({ length: FACE_COUNT }, () => ({
    face: Math.floor(rand() * FACES.length),
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
          rowGap: 16,
          placeItems: "center",
          color: "var(--ifm-font-color-base)",
          opacity: 0.35,
          width: "100%",
        }}
      >
        {cells.map((cell, i) => {
          const FaceIcon = FACES[cell.face];
          return <FaceIcon key={i} size={`${size}px`} />;
        })}
      </div>
    </div>
  );
};

export default FaceTile;
