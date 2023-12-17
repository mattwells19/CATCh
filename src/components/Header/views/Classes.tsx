import type { ReactElement } from "react";
import type { Class } from "~/api/getClasses.ts";
import { HeaderSection } from "../components/HeaderSection.tsx";
import { LinkList, LinkListItem } from "../components/LinkList.tsx";

export const Classes = ({
  classes,
}: {
  classes: Array<Class>;
}): ReactElement => {
  console.log(classes);
  const separatedClasses = classes.reduce(
    (acc, curr) => {
      switch (curr.category) {
        case "Personal & Professional Development":
          return {
            ...acc,
            ppDevClasses: [...acc.ppDevClasses, curr],
          };
        case "Improv Performance Track":
          return {
            ...acc,
            ptClasses: [...acc.ptClasses, curr],
          };
        case "Stand-up Comedy":
        case "Sketch Comedy":
        case "Other":
          return {
            ...acc,
            otherClasses: [...acc.otherClasses, curr],
          };
      }
    },
    {
      ptClasses: new Array<Class>(),
      ppDevClasses: new Array<Class>(),
      otherClasses: new Array<Class>(),
    },
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 justify-items-center">
      <HeaderSection title="Why Improv?">
        <p className="mb-3">
          We offer a wide variety of classes for those looking to dive deeper
          into their own creativity. From improv to sketch, storytelling to
          peronal development, please look through our current offerings to find
          what's best for you.
        </p>
        <LinkList>
          {separatedClasses.ppDevClasses.map((ppDevClass) => (
            <LinkListItem
              key={ppDevClass._id}
              href={`/classes/${ppDevClass.slug}`}
              subText={ppDevClass.navDesc}
            >
              {ppDevClass.navName}
            </LinkListItem>
          ))}
        </LinkList>
      </HeaderSection>
      <HeaderSection title="Performance Track">
        <p className="mb-3">
          For those who wish to — and can commit to — practice & perform improv
          for the stage as an artist.
        </p>
        <LinkList>
          {separatedClasses.ptClasses
            .sort((a, b) => (a.trackNum ?? 0) - (b.trackNum ?? 0))
            .map((ptClass) => (
              <LinkListItem
                key={ptClass._id}
                href={`/classes/${ptClass.slug}`}
                subText={ptClass.navDesc}
              >
                PT {ptClass.trackNum}: {ptClass.navName}
              </LinkListItem>
            ))}
        </LinkList>
      </HeaderSection>
      <div className="flex flex-col gap-8 w-full items-center">
        <HeaderSection title="Other Classes">
          <LinkList>
            {separatedClasses.otherClasses.map((otherClass) => (
              <LinkListItem
                key={otherClass._id}
                href={`/classes/${otherClass.slug}`}
              >
                {otherClass.navName}
              </LinkListItem>
            ))}
          </LinkList>
        </HeaderSection>
        <HeaderSection title="More Information">
          <LinkList>
            <LinkListItem href="/policies/class-policies">
              Class Policies
            </LinkListItem>
            <LinkListItem href="/faqs/improv-class-faq">
              Classes FAQ
            </LinkListItem>
            <LinkListItem href="#">Workstudy Program</LinkListItem>
          </LinkList>
        </HeaderSection>
      </div>
    </div>
  );
};
