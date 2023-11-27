import type { PropsWithChildren, ReactElement } from "react";
import type { Show } from "~/api/getShows";
import FullLogo from "~/images/CATCh-full-big-nobg.webp";
import DotLogo from "~/images/laughing-dot.png";
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
    <NavigationMenuContent className="max-w-7xl m-auto px-12 py-8">
      {children}
    </NavigationMenuContent>
  );
};

const NavItemTrigger = ({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>): ReactElement => {
  return (
    <NavigationMenuTrigger
      className={`${className} px-5 py-3 whitespace-nowrap`.trim()}
    >
      {children}
    </NavigationMenuTrigger>
  );
};

export const Header = ({ nextShow }: { nextShow: Show }): ReactElement => {
  return (
    <header className="w-full shadow-lg sticky top-0 bg-white z-50">
      <NavigationMenu
        skipDelayDuration={500}
        className="flex gap-16 items-center overflow-x-auto p-4"
      >
        <a href="/" className="inline-flex">
          <img
            src={FullLogo.src}
            className="w-64 -translate-y-2 lg:block hidden"
            alt="CATCh - Comedy Arts Theater of Charlotte"
          />
          <img
            src={DotLogo.src}
            className="w-24 lg:hidden"
            alt="CATCh - Comedy Arts Theater of Charlotte"
          />
        </a>
        <NavigationMenuList className="flex items-center font-light">
          <NavigationMenuItem value="Shows">
            <NavItemTrigger className="uppercase">Shows</NavItemTrigger>
            <NavMenuContent>
              <Shows nextShow={nextShow} />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Classes">
            <NavItemTrigger>CATCh A Class!</NavItemTrigger>
            <NavMenuContent>
              <Classes />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Services">
            <NavItemTrigger>Business Services</NavItemTrigger>
            <NavMenuContent>
              <Services />
            </NavMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="Info">
            <NavItemTrigger>Theater Info</NavItemTrigger>
          </NavigationMenuItem>

          <NavigationMenuIndicator className="bg-violet-400 h-0.5 transition-all" />
        </NavigationMenuList>
        <NavigationMenuViewport className="absolute top-full left-0 w-full bg-slate-600 text-slate-300 shadow-xl h-[var(--radix-navigation-menu-viewport-height)] overflow-hidden transition-[height] duration-300" />
      </NavigationMenu>
    </header>
  );
};
