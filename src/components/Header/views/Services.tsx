import type { ReactElement } from "react";
import { HeaderLink } from "../components/HeaderLink.tsx";
import { HeaderSection } from "../components/HeaderSection.tsx";

export const Services = (): ReactElement => {
  return (
    <div className="grid grid-cols-2 justify-items-center gap-5">
      <HeaderSection title="For Organizations">
        <ul className="list-inside list-disc flex flex-col gap-3">
          <li>
            <HeaderLink href="#">Corporate Training</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">Videos</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">Emcees</HeaderLink>
          </li>
        </ul>
      </HeaderSection>
      <HeaderSection title="For Individuals">
        <ul className="list-inside list-disc flex flex-col gap-3">
          <li>
            <HeaderLink href="#">Audition Taping</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">Creativity Coaching</HeaderLink>
          </li>
        </ul>
      </HeaderSection>
    </div>
  );
};
