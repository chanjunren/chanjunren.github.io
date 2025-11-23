import { useWindowSize } from "@docusaurus/theme-common";
import BrowserOnly from "@docusaurus/BrowserOnly";

import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Kbd, KbdGroup } from "@site/src/components/ui/kbd";
import { Link } from "@site/src/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@site/src/components/ui/navigation-menu";
import { FC } from "react";
import NavbarExtras from "./extras";

const FloatingMenu: FC = () => {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";
  return (
    <BrowserOnly>
      {() => (
        <NavigationMenu
          viewport={isMobile}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-(--menu-background) p-2 rounded-xl"
        >
          <NavigationMenuList className="m-0 pl-3!">
            <NavbarExtras />
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md tracking-tight">
                pages
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4 m-0! p-0!">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        variant="menu"
                        href="/whoami"
                        className={"text-md tracking-tight"}
                      >
                        whoami
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex-row! justify-between items-center text-md tracking-tight"
                        variant="menu"
                        href="/docs/zettelkasten"
                      >
                        <span>zettelkasten</span>
                        <KbdGroup className="ml-2">
                          <Kbd className="text-(--menu-subtle) bg-(--menu-muted-background)">
                            ⌘
                          </Kbd>
                          <Kbd className="text-(--menu-subtle) bg-(--menu-muted-background)">
                            K
                          </Kbd>
                        </KbdGroup>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md tracking-tight">
                contact
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4 m-0! p-0!">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className={
                          "flex-row! gap-2 items-center text-md tracking-tight"
                        }
                        variant="menu"
                        href="https://www.github.com/chanjunren"
                      >
                        <GitHubLogoIcon className="text-background" />
                        github
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className={
                          "flex-row! gap-2 items-center text-md tracking-tight"
                        }
                        variant="menu"
                        href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
                      >
                        <LinkedInLogoIcon className="text-background" />
                        linkedin
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className={
                          "flex-row! gap-2 items-center text-md tracking-tight"
                        }
                        variant="menu"
                        href="/documents/resume.pdf"
                      >
                        <BackpackIcon className="text-background" />
                        resume
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </BrowserOnly>
  );
};

export default FloatingMenu;
