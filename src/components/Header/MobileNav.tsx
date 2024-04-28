import { useRef, type ReactElement } from "react";

import FullLogo from "~/images/CATCh-full-big-nobg.webp";
import { Icon } from "../Icon.tsx";

import { socialMediaLinkList } from "~/utils/socialMediaLinkList.ts";
import { routeCategories, routes } from "./routes.ts";
import "~/styles/mobile-nav.scss";

export const MobileNav = ({ url }: { url: URL }): ReactElement => {
  const drawerRef = useRef<HTMLDialogElement | null>(null);

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>,
  ) => {
    const drawerDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < drawerDimensions.left ||
      e.clientX > drawerDimensions.right ||
      e.clientY < drawerDimensions.top ||
      e.clientY > drawerDimensions.bottom
    ) {
      e.currentTarget.close();
    }
  };

  const activePath = url.pathname;

  return (
    <nav className="flex justify-between items-center p-2">
      <a href="/" className="shrink-0" aria-label="Home">
        <img
          src={FullLogo.src}
          className="w-52 -translate-y-2"
          alt="CATCh - Comedy Arts Theater of Charlotte"
        />
      </a>
      <button
        type="button"
        onClick={() => drawerRef.current?.showModal()}
        className="py-2 px-3 hover:bg-purple-400 hover:bg-opacity-20 transition-colors rounded-md flex flex-col items-center text-primary-purple"
      >
        <Icon fill="currentColor" icon="menu" />
        <span className="text-sm font-bold">Menu</span>
      </button>
      <dialog
        ref={drawerRef}
        onClick={handleOutsideClick}
        className="drawer m-0 fixed right-0 ml-auto h-screen max-h-none bg-primary-purple overflow-auto"
      >
        <button
          type="button"
          onClick={() => drawerRef.current?.close()}
          className="py-2 px-3 hover:bg-purple-400 hover:bg-opacity-20 transition-colors rounded-md m-2 ml-auto text-peach flex flex-col items-center"
        >
          <Icon fill="currentColor" icon="close" height="36" width="36" />
          <span className="text-sm font-bold -mt-1">Close</span>
        </button>

        <ul className="flex flex-col gap-8 p-6">
          <li>
            <a
              href="/"
              aria-current={activePath === "/" ? "page" : undefined}
              className="block font-serif text-3xl text-peach font-bold aria-[current=page]:text-coral"
            >
              Home
            </a>
          </li>
          {routeCategories.map((routeCategory) => (
            <li key={routeCategory}>
              <a
                href={routes[routeCategory][0].path}
                className="block font-serif text-3xl text-peach font-bold"
              >
                {routeCategory}
              </a>
              <ul className="p-4 pt-1">
                {routes[routeCategory].map((route) => (
                  <li key={route.label}>
                    <a
                      href={route.path}
                      aria-current={
                        activePath === route.path ? "page" : undefined
                      }
                      target={route.isExternal ? "_blank" : undefined}
                      className="block text-peach border-b-2 border-b-light-purple text-xl py-3 aria-[current=page]:text-coral"
                    >
                      {route.label}
                      {route.isExternal ? (
                        <span aria-hidden>&nbsp;↗</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <ul className="flex justify-evenly m-auto p-6">
          {socialMediaLinkList.map((socialLink) => (
            <li key={socialLink.path}>
              <a href={socialLink.path} target="_blank">
                <span className="sr-only">{socialLink.label}</span>
                <Icon
                  icon={socialLink.remixIcon}
                  fill="var(--light-purple)"
                  width="36"
                  height="36"
                />
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </nav>
  );
};
