import type { ReactElement } from "react";
import { HeaderLink } from "../components/HeaderLink.tsx";
import { HeaderSection } from "../components/HeaderSection.tsx";
import { LinkList, LinkListItem } from "../components/LinkList.tsx";

export const Classes = (): ReactElement => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 justify-items-center">
      <HeaderSection title="Why Improv?">
        <p className="mb-3">
          We offer a wide variety of classes for those looking to dive deeper
          into their own creativity. From improv to sketch, storytelling to
          peronal development, please look through our current offerings to find
          what's best for you.
        </p>
        <HeaderLink href="#">
          Unlocking the Self: Improv Skills for Life
        </HeaderLink>
      </HeaderSection>
      <HeaderSection title="Performance Track">
        <p className="mb-3">
          For those who wish to — and can commit to — practice & perform improv
          for the stage as an artist.
        </p>
        <LinkList>
          <LinkListItem href="#">PT 1: Discovering the Scene</LinkListItem>
          <LinkListItem href="#">
            PT 2: Improv Stagecraft & Techniques
          </LinkListItem>
          <LinkListItem href="#">PT 3: True to Form</LinkListItem>
        </LinkList>
      </HeaderSection>
      <div className="flex flex-col gap-12 w-full items-center">
        <HeaderSection title="Other Classes">
          <LinkList>
            <LinkListItem href="#">Stand-up Comedy</LinkListItem>
            <LinkListItem href="#">
              Comedy Writing for TV, Stage, & Film
            </LinkListItem>
            <LinkListItem href="#">IMPROVe Your Acting</LinkListItem>
          </LinkList>
        </HeaderSection>
        <HeaderSection title="More Information">
          <LinkList>
            <LinkListItem href="#">Class Policies</LinkListItem>
            <LinkListItem href="#">Classes FAQ</LinkListItem>
            <LinkListItem href="#">Workstudy Program</LinkListItem>
          </LinkList>
        </HeaderSection>
      </div>
    </div>
  );
};
