import cn from "classnames";
import type { ClassListing } from "~/api/getClassListings";
import { formatClassDateRange } from "~/utils/formatClassTime";
import { CalendarIcon } from "~/icons/CalendarIcon";

type Props = {
  classListing: ClassListing;
};

export const UpcomingClassItem = ({ classListing }: Props) => {
  const formattedClassDate = formatClassDateRange(classListing);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
        <CalendarIcon
          name="calendar"
          className="h-10 w-10 text-primary-purple"
        />
        <div className="font-serif text-xl text-primary-purple">
          <h3 className="font-bold">{classListing.className}</h3>
          <p className="my-4 lg:my-0">{formattedClassDate}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
        <p className="font-serif font-bold text-xl text-primary-purple px-2">
          {classListing.price}
        </p>

        <a
          href={classListing.listingUrl}
          className={cn(
            "w-fit rounded-sm px-5 py-3 min-w-[200px] font-bold font-serif shadow-md text-lg flex items-center justify-center gap-3 transition-colors",
            classListing.isSoldOut
              ? "bg-peach text-coral"
              : "bg-coral hover:bg-[#B7433C] text-peach",
          )}
        >
          {classListing.isSoldOut ? "SOLD OUT" : "Enroll"}
        </a>
      </div>
    </div>
  );
};
