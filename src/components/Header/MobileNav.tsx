import { forwardRef, type ReactElement } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from "@radix-ui/react-accordion";

import type { NavProps } from "./Header.astro";
import FullLogo from "~/images/CATCh-full-big-nobg.webp";
import { Icon } from "../Icon.tsx";

import { Shows } from "./views/Shows.tsx";
import { Classes } from "./views/Classes.tsx";
import { Services } from "./views/Services.tsx";
import { TheaterInfo } from "./views/TheaterInfo.tsx";

import "~/styles/mobile-nav.css";

const AccordionSectionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <AccordionItem {...props} ref={ref}>
        {children}
      </AccordionItem>
    );
  },
);

const AccordionSectionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <AccordionHeader>
      <AccordionTrigger
        className="flex w-full justify-between items-center py-3 px-5 hover:bg-slate-400 hover:bg-opacity-20 focus:bg-slate-400 focus:bg-opacity-20 transition-colors data-[state='open']:rounded-b-none"
        {...props}
        ref={ref}
      >
        {children}
        <Icon icon="arrow-down-s" />
      </AccordionTrigger>
    </AccordionHeader>
  );
});

const AccordionSectionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, ...props }, ref) => {
  return (
    <AccordionContent
      className="AccordionContent bg-slate-600 text-slate-300 p-4"
      {...props}
      ref={ref}
    >
      {children}
    </AccordionContent>
  );
});

export const MobileNav = ({
  nextShow,
  staffMembers,
  teams,
  classes,
}: NavProps): ReactElement => {
  return (
    <nav className="flex justify-between items-center px-2">
      <a href="/" className="shrink-0" aria-label="Home">
        <img
          src={FullLogo.src}
          className="w-52 -translate-y-2"
          alt="CATCh - Comedy Arts Theater of Charlotte"
        />
      </a>
      <Dialog>
        <DialogTrigger
          aria-label="Open navigation"
          title="Open navigation"
          className="p-3 hover:bg-slate-400 hover:bg-opacity-20 rounded-md"
        >
          <Icon icon="menu" />
        </DialogTrigger>
        <DialogOverlay className="absolute inset-0 w-screen h-screen bg-black bg-opacity-40 overflow-hidden">
          <DialogContent className="DrawerContent absolute right-0 top-0 w-screen h-screen bg-white overflow-auto">
            <DialogClose className="p-3 hover:bg-slate-400 hover:bg-opacity-20 rounded-md block w-fit m-4 ml-auto">
              <Icon icon="close" />
            </DialogClose>

            <Accordion type="single" collapsible>
              <AccordionSectionItem value="Shows">
                <AccordionSectionTrigger>Shows</AccordionSectionTrigger>
                <AccordionSectionContent>
                  <Shows nextShow={nextShow} teams={teams} />
                </AccordionSectionContent>
              </AccordionSectionItem>

              <AccordionSectionItem value="Classes">
                <AccordionSectionTrigger>
                  CATCh a Class!
                </AccordionSectionTrigger>
                <AccordionSectionContent>
                  <Classes classes={classes} />
                </AccordionSectionContent>
              </AccordionSectionItem>

              <AccordionSectionItem value="Services">
                <AccordionSectionTrigger>
                  Business Services
                </AccordionSectionTrigger>
                <AccordionSectionContent>
                  <Services />
                </AccordionSectionContent>
              </AccordionSectionItem>

              <AccordionSectionItem value="Info">
                <AccordionSectionTrigger>Theater Info</AccordionSectionTrigger>
                <AccordionSectionContent>
                  <TheaterInfo staffMembers={staffMembers} />
                </AccordionSectionContent>
              </AccordionSectionItem>
            </Accordion>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </nav>
  );
};
