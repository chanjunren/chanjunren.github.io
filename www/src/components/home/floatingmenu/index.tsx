import {useWindowSize} from "@docusaurus/theme-common";
import BrowserOnly from "@docusaurus/BrowserOnly";

import {HomeIcon,} from "@radix-ui/react-icons";
import {Link} from "@site/src/components/ui/link";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from "@site/src/components/ui/navigation-menu";
import {Tooltip, TooltipContent, TooltipTrigger,} from "@site/src/components/ui/tooltip";
import {FC, ReactNode, useState} from "react";
import NavbarExtras from "./extras";
import {AboutIcon, GithubIcon, LinkedinIcon, NotesIcon, ResumeIcon} from "./icons";
import {SnowboarderMouse} from "./icons/SnowboarderMouse";

const Divider: FC = () => (
  <div className="h-5 w-px bg-(--menu-subtle)/40 mx-1"/>
);

interface MenuIconLinkProps {
  href: string;
  label: string;
  children: ReactNode | ((hovering: boolean) => ReactNode);
  onHoverChange?: (hovering: boolean) => void;
}

const MenuIconLink: FC<MenuIconLinkProps> = ({href, label, children, onHoverChange}) => {
  const [hovering, setHovering] = useState(false);

  return (
    <NavigationMenuItem
      onMouseEnter={() => {
        setHovering(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
        onHoverChange?.(false);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            variant="menu"
            href={href}
            className="flex items-center text-md tracking-tight p-2 rounded-md hover:bg-(--menu-accent)!"
          >
            {typeof children === "function" ? children(hovering) : children}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </NavigationMenuItem>
  );
};

const ResumeMenuIcon: FC = () => {
  const [hovering, setHovering] = useState(false);
  return (
    <NavigationMenuItem
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="/documents/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-(--menu-foreground)! no-underline! text-md tracking-tight p-2 rounded-md hover:bg-(--menu-accent)! hover:text-(--menu-foreground)!"
          >
            <ResumeIcon hovering={hovering}/>
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          resume
        </TooltipContent>
      </Tooltip>
    </NavigationMenuItem>
  );
};

const FloatingMenu: FC = () => {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";
  const [homeHovering, setHomeHovering] = useState(false);

  return (
    <BrowserOnly>
      {() => (
        <NavigationMenu
          viewport={isMobile}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-(--menu-background) p-2 rounded-xl border border-border shadow-sm"
        >
          {homeHovering && <SnowboarderMouse/>}
          <NavigationMenuList className="m-0 pl-3!">
            <NavbarExtras/>

            {/* Pages */}
            <MenuIconLink href="/" label="home" onHoverChange={setHomeHovering}>
              <HomeIcon/>
            </MenuIconLink>
            <MenuIconLink href="/docs/zettelkasten" label="notes">
              {(hovering) => <NotesIcon hovering={hovering}/>}
            </MenuIconLink>
            <MenuIconLink href="/whoami" label="about">
              {(hovering) => <AboutIcon hovering={hovering}/>}
            </MenuIconLink>

            <Divider/>

            {/* Contact */}
            <MenuIconLink href="https://www.github.com/chanjunren" label="github">
              {(hovering) => <GithubIcon hovering={hovering}/>}
            </MenuIconLink>
            <MenuIconLink href="https://www.linkedin.com/in/jun-ren-chan-90240a175/" label="linkedin">
              {(hovering) => <LinkedinIcon hovering={hovering}/>}
            </MenuIconLink>
            <ResumeMenuIcon/>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </BrowserOnly>
  );
};

export default FloatingMenu;
