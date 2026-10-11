import type { WrapperProps } from "@docusaurus/types";
import {
  DocFocusButton,
  DocFocusProvider,
} from "@site/src/components/docs/focus-mode";
import FloatingMenu from "@site/src/components/home/floatingmenu";
import Layout from "@theme-original/DocRoot/Layout";
import type LayoutType from "@theme/DocRoot/Layout";
import { type ReactNode } from "react";

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <DocFocusProvider>
      <DocFocusButton />
      <Layout {...props} />
      <FloatingMenu />
    </DocFocusProvider>
  );
}
