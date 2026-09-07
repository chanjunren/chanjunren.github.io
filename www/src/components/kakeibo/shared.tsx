import CustomTag from "@site/src/components/ui/custom-tag";
import { type ReactNode } from "react";

export function CategoryTag({
  children,
  markerColor,
}: {
  children: ReactNode;
  markerColor?: string;
}) {
  return (
    <CustomTag
      color="neutral"
      className="inline-flex! items-center gap-1.5 text-sm! font-normal"
    >
      {markerColor && (
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: markerColor }}
        />
      )}
      {children}
    </CustomTag>
  );
}
