import { useWindowSize } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Link } from "@site/src/components/ui/link";
import { NavigationMenuItem } from "@site/src/components/ui/navigation-menu";
import { FC } from "react";

const ZETTELKASTEN = "zettelkasten";

const NavbarExtras: FC = () => {
  const windowSize = useWindowSize();
  const path = window.location.pathname;
  const isMobile = windowSize === "mobile";
  const isZett = path.includes(ZETTELKASTEN);
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <>
      {isMobile && isZett && (
        <NavigationMenuItem className="flex gap-2 items-center cursor-alias pr-3">
          <HamburgerMenuIcon onClick={mobileSidebar.toggle} />
        </NavigationMenuItem>
      )}
      <NavigationMenuItem className="flex gap-2 items-center cursor-alias pr-3">
        <Link
          variant="menu"
          href="/"
          className={"text-lg tracking-tight hover:bg-transparent! text-nowrap"}
        >
          陈俊任
        </Link>
      </NavigationMenuItem>
    </>
  );
};

export default NavbarExtras;
