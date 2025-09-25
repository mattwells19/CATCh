import * as Accordion from "@radix-ui/react-accordion";
import type { PropsWithChildren } from "react";
import type { ClassListing } from "~/api/getClassListings";
import { UpcomingClassItem } from "./UpcomingClassItem";
import PTHero from "../_images/PTHero.png";

interface PTAccordionItemProps {
  title: string;
  classes: Array<ClassListing>;
  image: string;
}

const PTAccordionItem = ({
  title,
  classes,
  image,
  children,
}: PropsWithChildren<PTAccordionItemProps>) => {
  return (
    <Accordion.Item value={title} className="pt-accordion-item">
      <Accordion.Header className="pt-accordion-header">
        <Accordion.Trigger>
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.8192 15.1703L36.458 31.7972C37.1075 32.725 36.4437 34 35.3111 34L12.6889 34C11.5563 34 10.8925 32.725 11.542 31.7972L23.1808 15.1703C23.5789 14.6016 24.4211 14.6016 24.8192 15.1703Z"
              fill="var(--coral)"
            />
          </svg>
          {title}
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="pt-accordion-content">
        <div className="pt-accordion-about">
          <div className="pt-accordion-about-content">{children}</div>
          <img
            src={image}
            className="invisible w-0 h-0 lg:visible lg:w-auto lg:h-auto"
          />
        </div>

        <section className="pt-accordion-content-classes">
          <h2 className="pl-5 lg:pl-0">Upcoming Classes</h2>
          <ul className="mt-8">
            {classes.length > 0 ? (
              classes.map((classListing) => (
                <li
                  key={classListing.id}
                  className="border-primary-purple border-y p-8"
                >
                  <UpcomingClassItem classListing={classListing} />
                </li>
              ))
            ) : (
              <li className="border-primary-purple border-y px-2 py-8">
                Check back soon!
              </li>
            )}
          </ul>
        </section>
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface PTAccordionProps {
  pt1Classes: Array<ClassListing>;
  pt2Classes: Array<ClassListing>;
  pt3Classes: Array<ClassListing>;
}

export const PTAccordion = ({
  pt1Classes,
  pt2Classes,
  pt3Classes,
}: PTAccordionProps) => {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={["PT 1: Discovering the Scene"]}
    >
      <PTAccordionItem
        title="PT 1: Discovering the Scene"
        classes={pt1Classes}
        image={PTHero.src}
      >
        <p>
          The first class in our Improv Performance Track, which is targeted to
          those who wish to — and can commit to — practice & perform improv for
          the stage as an artist. This class teaches improvisers the basic
          tenets of character-driven long form improv.
        </p>
        <p>
          Through more advanced exercises and two-person scenework, students
          will be challenged to initiate scenes from the top of their
          intelligence, develop characters from their life experiences, and
          build relationships with their scene partners. This highly engaging
          class will bring each student closer to trusting themselves and their
          instincts as well as those of their fellow classmates. Truly focused
          on grounded, patient, and collaborative play, this course will awaken
          each student's curiosity to discover themselves and the world around
          them.
        </p>
      </PTAccordionItem>
      <PTAccordionItem
        title="PT 2: Improv Stagecraft & Techniques"
        classes={pt2Classes}
        image={PTHero.src}
      >
        <p>
          The first class in our Improv Performance Track, which is targeted to
          those who wish to — and can commit to — practice & perform improv for
          the stage as an artist. This class teaches improvisers the basic
          tenets of character-driven long form improv.
        </p>
        <p>
          Through more advanced exercises and two-person scenework, students
          will be challenged to initiate scenes from the top of their
          intelligence, develop characters from their life experiences, and
          build relationships with their scene partners. This highly engaging
          class will bring each student closer to trusting themselves and their
          instincts as well as those of their fellow classmates. Truly focused
          on grounded, patient, and collaborative play, this course will awaken
          each student's curiosity to discover themselves and the world around
          them.
        </p>
      </PTAccordionItem>
      <PTAccordionItem
        title="PT 3: Improv Stagecraft & Techniques"
        classes={pt3Classes}
        image={PTHero.src}
      >
        <p>
          The first class in our Improv Performance Track, which is targeted to
          those who wish to — and can commit to — practice & perform improv for
          the stage as an artist. This class teaches improvisers the basic
          tenets of character-driven long form improv.
        </p>
        <p>
          Through more advanced exercises and two-person scenework, students
          will be challenged to initiate scenes from the top of their
          intelligence, develop characters from their life experiences, and
          build relationships with their scene partners. This highly engaging
          class will bring each student closer to trusting themselves and their
          instincts as well as those of their fellow classmates. Truly focused
          on grounded, patient, and collaborative play, this course will awaken
          each student's curiosity to discover themselves and the world around
          them.
        </p>
      </PTAccordionItem>
    </Accordion.Root>
  );
};
