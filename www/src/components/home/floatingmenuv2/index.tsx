import { useWindowSize } from "@docusaurus/theme-common";

import {
  BackpackIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Kbd, KbdGroup } from "@site/src/components/ui/Kbd";
import { Link } from "@site/src/components/ui/Link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@site/src/components/ui/NavigationMenu";
import { FC } from "react";

const FloatingMenu: FC = () => {
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";

  return (
    <NavigationMenu
      viewport={isMobile}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-(--menu-background) p-2 rounded-xl"
    >
      <NavigationMenuList className="m-0 pl-3!">
        <NavigationMenuItem>
          <span className="text-lg pr-2 text-nowrap">陈俊任</span>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>pages</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4 m-0! p-0!">
              <li>
                <NavigationMenuLink asChild>
                  <Link variant="menu" href="#">
                    whoami
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="flex-row! justify-between items-center"
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
          <NavigationMenuTrigger>contact</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4 m-0! p-0!">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className={"flex-row! gap-2 items-center"}
                    variant="menu"
                    href="https://www.github.com/chanjunren"
                  >
                    <GitHubLogoIcon className="text-background" />
                    github
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className={"flex-row! gap-2 items-center"}
                    variant="menu"
                    href="https://www.linkedin.com/in/jun-ren-chan-90240a175/"
                  >
                    <LinkedInLogoIcon className="text-background" />
                    linkedin
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className={"flex-row! gap-2 items-center"}
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
  );
};

export default FloatingMenu;
