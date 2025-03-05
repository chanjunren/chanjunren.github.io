import { FC, PropsWithChildren } from "react";

const WIDTH = 40;
const ExperimentBackground: FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  return (
    <div
      className="relative aspect-square w-full flex items-center justify-center"
      {...props}
    >
      {/* Grid Overlay */}
      <svg className="absolute w-full h-full">
        <defs>
          <pattern
            id="grid"
            width={WIDTH}
            height={WIDTH}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${WIDTH} 0 L 0 0 0 ${WIDTH}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.9"
            />
          </pattern>
          <radialGradient id="fadeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Define Mask Using the Gradient */}
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          mask="url(#fadeMask)"
        />
      </svg>

      {/* Children Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default ExperimentBackground;
