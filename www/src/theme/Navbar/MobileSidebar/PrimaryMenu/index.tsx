import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import * as Separator from "@radix-ui/react-separator";
import MobileCarousel from "@site/src/components/gallery/components/MobileCarousel";
import { WORKSPACE, getCurrentLocation } from "@site/src/utils/pathUtils";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import styles from "./index.module.css";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const workspaceActive =
    getCurrentLocation(window.location.pathname) === WORKSPACE;

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems();

  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        />
      ))}
      {workspaceActive && (
        <Separator.Root
          className={styles.separator}
          style={{ margin: "15px 0" }}
        />
      )}

      {workspaceActive && <MobileCarousel />}
    </ul>
  );
}
