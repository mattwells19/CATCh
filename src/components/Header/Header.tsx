import type { PropsWithChildren, ReactElement } from "react";
import type { Show } from "~/api/getShows";
import Logo from "~/images/CATCh-full-big-nobg.webp";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@radix-ui/react-navigation-menu";
import { Shows } from "./views/Shows.tsx";
import { Classes } from "./views/Classes.tsx";
import { Services } from "./views/Services.tsx";

const NavMenuContent = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <NavigationMenuContent className="absolute w-full top-full left-0 bg-slate-600 text-slate-300 shadow-xl z-10 px-12 py-8">
      <div className="max-w-7xl m-auto">{children}</div>
    </NavigationMenuContent>
  );
};

export const Header = ({ nextShow }: { nextShow: Show }): ReactElement => {
  return (
    <header
      id="nav-header"
      className="w-full shadow-lg sticky top-0 bg-white p-4 z-50"
    >
      <NavigationMenu
        skipDelayDuration={500}
        className="flex gap-16 items-center"
      >
        <a href="/">
          <img
            src={Logo.src}
            className="w-64 -translate-y-2"
            alt="CATCh - Comedy Arts Theater of Charlotte"
          />
        </a>
        <NavigationMenuList className="gap-2 items-center font-light lg:flex">
          <NavigationMenuItem value="Shows">
            <NavigationMenuTrigger className="uppercase px-4 py-3">
              Shows
            </NavigationMenuTrigger>
            <NavMenuContent>
              <Shows nextShow={nextShow} />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Classes">
            <NavigationMenuTrigger className="px-4 py-3">
              CATCh A Class!
            </NavigationMenuTrigger>
            <NavMenuContent>
              <Classes />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Services">
            <NavigationMenuTrigger className="px-4 py-3">
              Business Services
            </NavigationMenuTrigger>
            <NavMenuContent>
              <Services />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Info">
            <NavigationMenuTrigger className="px-4 py-3">
              Theater Info
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuIndicator className="bg-violet-400 h-0.5 transition-all" />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </header>
  );
};
