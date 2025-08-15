import type { WrapperProps } from "@docusaurus/types";
import SearchBar from "@theme-original/SearchBar";
import type SearchBarType from "@theme/SearchBar";
import { type ReactNode } from "react";

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): ReactNode {
  return (
    <>
      <SearchBar
        {...{
          ...props,
          className: "hidden",
        }}
      />
    </>
  );
}
