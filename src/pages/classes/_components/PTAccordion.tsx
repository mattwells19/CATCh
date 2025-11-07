import * as Accordion from "@radix-ui/react-accordion";
import type { PropsWithChildren } from "react";
import type { ClassListing } from "~/api/getClassListings";
import { UpcomingClassItem } from "./UpcomingClassItem";
import PT1AccordionImg from "../_images/PT1-accordion.webp";
import PT2AccordionImg from "../_images/PT2-accordion.webp";
import PT3AccordionImg from "../_images/PT3-accordion.webp";

interface PTAccordionItemProps {
  title: string;
  value: string;
  classes: Array<ClassListing>;
  image: string;
}

const PTAccordionItem = ({
  title,
  value,
  classes,
  image,
  children,
}: PropsWithChildren<PTAccordionItemProps>) => {
  return (
    <Accordion.Item value={value} className="pt-accordion-item">
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
  const accordionValues = ["pt1", "pt2", "pt3"];
  const hashValue = location.hash.replace("#", "");
  const value = accordionValues.includes(hashValue)
    ? hashValue
    : accordionValues[0];

  return (
    <Accordion.Root
      type="single"
      defaultValue={value}
      onValueChange={(value) => (location.hash = value)}
    >
      <PTAccordionItem
        title="PT 1: Discovering the Scene"
        value={accordionValues[0]}
        classes={pt1Classes}
        image={PT1AccordionImg.src}
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
        value={accordionValues[1]}
        classes={pt2Classes}
        image={PT2AccordionImg.src}
      >
        <p>
          Improv Performance Track The second class in our Improv Performance
          Track, which is targeted to those who wish to — and can commit to —
          practice & perform improv for the stage as an artist. This class
          teaches improvisers the techniques and components of a long-form
          improv show. This includes edits, tag-outs, walk-ons, group game, and
          openings.
        </p>
        <p>
          In the second class of CATCh's Performance Track, you will master the
          essential elements of long-form improv such as openings, game, edits,
          tag-outs, beats, call-backs, and making people laugh.
        </p>
      </PTAccordionItem>
      <PTAccordionItem
        title="PT 3: Improv Stagecraft & Techniques"
        value={accordionValues[2]}
        classes={pt3Classes}
        image={PT3AccordionImg.src}
      >
        <p>
          Learn the basics of an improv form, including openings, how and when
          to edit a scene, callbacks, tag-outs, and way more!
        </p>
        <p>
          The third course in our Performance Track, specifically for students
          who are ready to learn how to sustain, manage, and support a full
          long-form set.
        </p>
        <p>
          This 6 week course introduces students to long-form style
          improvisation, which is thematic, narrative-focused, and character
          driven. This level teaches students a structured format that delves
          into many of the essential elements of sustaning long-form improv,
          including second & third beats, group games, and more.
        </p>
      </PTAccordionItem>
    </Accordion.Root>
  );
};
