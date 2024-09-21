import BrowserOnly from "@docusaurus/BrowserOnly";
import type { WrapperProps } from "@docusaurus/types";
import TOC from "@theme-original/TOC";
import LocalGraph from "@theme/LocalGraph";
import type TOCType from "@theme/TOC";

type Props = WrapperProps<typeof TOCType>;

export default function TOCWrapper(props: Props): JSX.Element {
  return (
    <>
      <BrowserOnly>{() => <LocalGraph />}</BrowserOnly>
      <TOC {...props} />
    </>
  );
}
