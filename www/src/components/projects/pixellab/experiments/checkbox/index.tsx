import { FC } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";

const CheckboxIcon: FC = () => {
  return (
    <svg viewBox="0 0 24 24" width="45" stroke="currentColor">
      <rect
        width="8"
        height="8"
        y="8"
        x="6"
        fill="none"
        rx="1"
        strokeWidth={0.8}
      />
      <path
        className="checkmark"
        d="M7.75 11.75 L10 14.25 L16.25 7.75"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export default function Checkbox() {
  return (
    <PixelLabContainer label="009">
      <CheckboxIcon />
    </PixelLabContainer>
  );
}
