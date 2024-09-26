import type { ReactElement } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { routeCategories, routes } from "./routes.ts";

import FullLogo from "~/images/CATCh-big-no-tag.png";
import "../../styles/desktop-nav.scss";

export const DesktopNav = (): ReactElement => {
  return (
    <NavigationMenu
      skipDelayDuration={500}
      className="flex gap-16 items-center overflow-visible py-4 px-16"
    >
      <a href="/" aria-label="Home" className="shrink-0">
        <img
          src={FullLogo.src}
          className="w-64"
          alt="CATCh - Comedy Arts Theater of Charlotte"
        />
      </a>
      <NavigationMenuList className="flex items-center">
        {routeCategories.map((routeCategory) => (
          <NavigationMenuItem
            value={routeCategory}
            key={routeCategory}
            className="relative"
          >
            <NavigationMenuTrigger className="flex items-center gap-1 font-serif text-primary-purple text-xl font-bold max-w-7xl m-auto px-8 py-6 rounded-lg group data-[state=open]:bg-primary-purple data-[state=open]:text-peach">
              {routeCategory}
              <span aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-data-[state=open]:rotate-180"
                >
                  <path
                    d="M11.1808 15.8297L6.54199 9.20285C5.89247 8.27496 6.55629 7 7.68892 7L16.3111 7C17.4437 7 18.1075 8.27496 17.458 9.20285L12.8192 15.8297C12.4211 16.3984 11.5789 16.3984 11.1808 15.8297Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="nav-menu-content absolute top-[85%] left-0 w-64 bg-primary-purple rounded-lg p-4 shadow-lg">
              <ul className="flex flex-col gap-4">
                {routes[routeCategory].map((route) => (
                  <li key={route.label}>
                    <NavigationMenuLink
                      href={route.path}
                      target={route.isExternal ? "_blank" : undefined}
                      className="block text-peach border-b-2 border-b-light-purple text-xl pb-3 aria-[current=page]:text-coral hover:text-coral"
                    >
                      {route.label}
                      {route.isExternal ? (
                        <span aria-hidden="true">&nbsp;↗</span>
                      ) : null}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
