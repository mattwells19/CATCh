import * as Accordion from "@radix-ui/react-accordion";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

import type { ClassListing } from "~/api/getClassListings";
import type { PTAccordion as PTAccordionEntry } from "~/api/getPerformanceTrackAccordions";

import { UpcomingClassItem } from "./UpcomingClassItem";

interface PTAccordionItemProps {
  title: string;
  value: string;
  classes: Array<ClassListing>;
  image: string;
  children: string;
}

const PTAccordionItem = ({
  title,
  value,
  classes,
  image,
  children,
}: PTAccordionItemProps) => {
  return (
    <>
      {/* preload image even if accordion is closed */}
      <img src={image} hidden />
      <Accordion.Item
        data-value={value}
        value={value}
        className="pt-accordion-item"
      >
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
            <div
              className="pt-accordion-about-content wysiwyg"
              dangerouslySetInnerHTML={{ __html: children }}
            />
            <img
              src={image}
              className="invisible w-0 h-0 lg:visible lg:w-auto lg:h-auto"
            />
          </div>

          <section className="pt-accordion-content-classes">
            <h2 className="pl-8 text-2xl lg:text-3xl lg:font-bold lg:pl-0">
              Upcoming Classes
            </h2>
            <ul className="mt-8">
              {classes.length > 0 ? (
                classes.map((classListing) => (
                  <li
                    key={classListing.id}
                    className="border-primary-purple border-t lg:border-b p-8"
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
    </>
  );
};

interface PTAccordionProps {
  ptAccordionContent: Array<PTAccordionEntry>;
  classListings: Array<Array<ClassListing>>;
}

export const PTAccordion = ({
  ptAccordionContent,
  classListings,
}: PTAccordionProps) => {
  const accordionValues = ["pt1", "pt2", "pt3"];
  const hashValue = location.hash.replace("#", "");
  const value = accordionValues.includes(hashValue)
    ? hashValue
    : accordionValues[0];

  const handleValueChange = (newValue: string) => {
    if (!accordionValues.includes(newValue)) {
      return;
    }

    location.hash = newValue;

    const selectedAccordionItem = document.querySelector<HTMLElement>(
      `[data-value="${newValue}"]`,
    );
    if (selectedAccordionItem) {
      setTimeout(() => {
        window.scrollTo({
          behavior: "smooth",
          top: selectedAccordionItem.offsetTop - 10,
        });
      }, 5);
    }
  };

  return (
    <Accordion.Root
      type="single"
      defaultValue={value}
      onValueChange={handleValueChange}
    >
      {ptAccordionContent.map((ptAccordion, index) => (
        <PTAccordionItem
          key={ptAccordion.title}
          title={ptAccordion.title}
          value={accordionValues[index]}
          classes={classListings[index]}
          image={ptAccordion.image}
        >
          {documentToHtmlString(ptAccordion.description)}
        </PTAccordionItem>
      ))}
    </Accordion.Root>
  );
};
