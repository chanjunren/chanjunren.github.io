import {useWindowSize} from "@docusaurus/theme-common";
import BrowserOnly from "@docusaurus/BrowserOnly";

import {BackpackIcon, GitHubLogoIcon, HomeIcon, LinkedInLogoIcon, PersonIcon, ReaderIcon,} from "@radix-ui/react-icons";
import {Link} from "@site/src/components/ui/link";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from "@site/src/components/ui/navigation-menu";
import {Tooltip, TooltipContent, TooltipTrigger,} from "@site/src/components/ui/tooltip";
import {FC, ReactNode} from "react";
import NavbarExtras from "./extras";

const Divider: FC = () => (
  <div className="h-5 w-px bg-(--menu-subtle)/40 mx-1"/>
);

interface MenuIconLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

const MenuIconLink: FC<MenuIconLinkProps> = ({href, label, children}) => (
  <NavigationMenuItem>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          variant="menu"
          href={href}
          className="flex items-center text-md tracking-tight p-2 rounded-md hover:bg-(--menu-accent)!"
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  </NavigationMenuItem>
);

const FloatingMenu: FC = () => {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";
  return (
    <BrowserOnly>
      {() => (
        <NavigationMenu
          viewport={isMobile}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-(--menu-background) p-2 rounded-xl border border-border shadow-sm"
        >
          <NavigationMenuList className="m-0 pl-3!">
            <NavbarExtras/>

            {/* Pages */}
            <MenuIconLink href="/" label="home">
              <HomeIcon/>
            </MenuIconLink>
            <MenuIconLink href="/docs/zettelkasten" label="notes">
              <ReaderIcon/>
            </MenuIconLink>
            <MenuIconLink href="/whoami" label="about">
              <PersonIcon/>
            </MenuIconLink>

            <Divider/>

            {/* Contact */}
            <MenuIconLink href="https://www.github.com/chanjunren" label="github">
              <GitHubLogoIcon/>
            </MenuIconLink>
            <MenuIconLink href="https://www.linkedin.com/in/jun-ren-chan-90240a175/" label="linkedin">
              <LinkedInLogoIcon/>
            </MenuIconLink>
            <MenuIconLink href="/documents/resume.pdf" label="resume">
              <BackpackIcon/>
            </MenuIconLink>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </BrowserOnly>
  );
};

export default FloatingMenu;
