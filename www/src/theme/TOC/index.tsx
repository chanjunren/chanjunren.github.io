import BrowserOnly from "@docusaurus/BrowserOnly";
import type {WrapperProps} from "@docusaurus/types";
import TOC from "@theme-original/TOC";
import type TOCType from "@theme/TOC";
import VaultusaurusGraph from "@theme/VaultusaurusGraph";
import type {ReactNode} from "react";

type Props = WrapperProps<typeof TOCType>;

export default function TOCWrapper(props: Props): ReactNode {
  return (
    <>
      <BrowserOnly>{() => <VaultusaurusGraph/>}</BrowserOnly>
      <TOC {...props} />
    </>
  );
}
