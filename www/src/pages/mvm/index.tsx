import Page from "@site/src/components/ui/page";
import MvmView from "@site/src/components/mvm/mvm-view";
import { FC } from "react";

const MvmPage: FC = () => {
  return (
    <Page title="MVM" description="Compare Claude model outputs side-by-side">
      <MvmView />
    </Page>
  );
};

export default MvmPage;
