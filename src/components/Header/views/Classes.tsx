import type { ReactElement } from "react";
import { HeaderLink } from "../components/HeaderLink.tsx";
import { HeaderSection } from "../components/HeaderSection.tsx";

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
        <ul className="list-inside list-disc flex flex-col gap-3">
          <li>
            <HeaderLink href="#">PT 1: Discovering the Scene</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">
              PT 2: Improv Stagecraft & Techniques
            </HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">PT 3: True to Form</HeaderLink>
          </li>
        </ul>
      </HeaderSection>
      <div className="flex flex-col gap-12 w-full items-center">
        <HeaderSection title="Other Classes">
          <ul className="list-inside list-disc flex flex-col gap-3">
            <li>
              <HeaderLink href="#">Stand-up Comedy</HeaderLink>
            </li>
            <li>
              <HeaderLink href="#">
                Comedy Writing for TV, Stage, & Film
              </HeaderLink>
            </li>
            <li>
              <HeaderLink href="#">IMPROVe Your Acting</HeaderLink>
            </li>
          </ul>
        </HeaderSection>
        <HeaderSection title="More Information">
          <ul className="list-inside list-disc flex flex-col gap-3">
            <li>
              <HeaderLink href="#">Class Policies</HeaderLink>
            </li>
            <li>
              <HeaderLink href="#">Classes FAQ</HeaderLink>
            </li>
            <li>
              <HeaderLink href="#">Workstudy Program</HeaderLink>
            </li>
          </ul>
        </HeaderSection>
      </div>
    </div>
  );
};
