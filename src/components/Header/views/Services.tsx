import type { ReactElement } from "react";
import { HeaderSection } from "../components/HeaderSection.tsx";
import { LinkList, LinkListItem } from "../components/LinkList.tsx";

export const Services = (): ReactElement => {
  return (
    <div className="grid grid-cols-2 justify-items-center gap-5">
      <HeaderSection title="For Organizations">
        <LinkList>
          <LinkListItem href="#">Corporate Training</LinkListItem>
          <LinkListItem href="#">Videos</LinkListItem>
          <LinkListItem href="#">Emcees</LinkListItem>
        </LinkList>
      </HeaderSection>
      <HeaderSection title="For Individuals">
        <LinkList>
          <LinkListItem href="#">Audition Taping</LinkListItem>
          <LinkListItem href="#">Creativity Coaching</LinkListItem>
        </LinkList>
      </HeaderSection>
    </div>
  );
};
