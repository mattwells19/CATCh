import { useMemo, useState } from "react";
import {
  getDaysInMonth,
  getWeeksInMonth,
  getDay,
  isSameDay,
  isAfter,
} from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import classnames from "classnames";

import type { ShowListing } from "~/api/getShowListings";
import type { ClassListing } from "~/api/getClassListings";
import { formatEst } from "~/utils/formatEst";
import { getNow } from "~/utils/getNow";
import { RemixIcon } from "~/components/RemixIcon";
import { NewEvent } from "./NewEvent";

interface CalendarProps {
  visibleMonth: number;
  visibleYear: number;
  upcomingShows: Array<ShowListing>;
  upcomingClasses: Array<ClassListing>;
}

export const Calendar = ({
  upcomingClasses,
  upcomingShows,
  visibleMonth,
  visibleYear,
}: CalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const now = useMemo(() => getNow(), []);

  const calendarDays = useMemo(() => {
    const monthDate = new TZDateMini(
      visibleYear,
      visibleMonth,
      "America/New_York",
    );
    const numOfDaysInMonth = getDaysInMonth(monthDate);

    const dayOfWeekForFirstDay = getDay(monthDate);
    const numWeeksInMonth = getWeeksInMonth(monthDate);

    const availableDates = Array.from(
      { length: numOfDaysInMonth },
      (_, index) => index + 1,
    );

    const daysAccumulator: Array<Array<number>> = Array.from(
      { length: numWeeksInMonth },
      () => Array.from({ length: 7 }, () => -1),
    );

    for (let weekCnt = 0; weekCnt < numWeeksInMonth; weekCnt++) {
      for (let dayCnt = 0; dayCnt < 7; dayCnt++) {
        if (
          (weekCnt === 0 && dayCnt < dayOfWeekForFirstDay) ||
          availableDates.length === 0
        ) {
          daysAccumulator[weekCnt][dayCnt] = -1;
        } else {
          // !! This mutates the array so watch out !!
          const dateToAdd = availableDates.shift();
          if (!dateToAdd) throw new Error("Got nothing to add");
          daysAccumulator[weekCnt][dayCnt] = dateToAdd;
        }
      }
    }

    return daysAccumulator;
  }, []);

  return (
    <>
      <table className="w-full table-fixed">
        <thead>
          <tr className="hidden lg:table-row">
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
          <tr className="table-row lg:hidden">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tues</th>
            <th>Wed</th>
            <th>Thur</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {calendarDays.map((weekInMonth, weekIndex) => (
            <tr key={`week-${weekIndex}`}>
              {weekInMonth.map((dayInWeek, dayIndex) => {
                const dayDate = new TZDateMini(
                  visibleYear,
                  visibleMonth,
                  dayInWeek,
                  "America/New_York",
                );
                const dayListings = [
                  ...upcomingShows,
                  ...upcomingClasses,
                ].filter((show) => isSameDay(dayDate, show.date));
                const dayDateIsToday = isSameDay(dayDate, now);

                return dayInWeek === -1 ? (
                  <td key={`week-${weekIndex}-day-${dayIndex}`} />
                ) : (
                  <td
                    key={`week-${weekIndex}-day-${dayIndex}`}
                    className={classnames("align-top p-2 border relative", {
                      "bg-violet-100": dayDateIsToday,
                    })}
                  >
                    <span
                      title={formatEst(dayDate, "MMMM do, yyyy")}
                      className={classnames({
                        "font-bold": dayDateIsToday,
                      })}
                    >
                      {dayInWeek}
                    </span>
                    <ul>
                      {dayListings.map((listing) => (
                        <li key={listing.id}>
                          <a
                            href={listing.listingUrl}
                            className="block bg-primary-purple text-white py-0.5 px-1 rounded my-1"
                          >
                            {listing.name} ({formatEst(listing.date, "h:mm a")})
                          </a>
                        </li>
                      ))}
                      {dayDateIsToday || isAfter(dayDate, now) ? (
                        <li>
                          <button
                            onClick={() => setSelectedDay(dayDate)}
                            className="flex gap-1 items-center w-full justify-center p-2 lg:py-0.5 lg:px-1"
                          >
                            <RemixIcon width="16" height="16" icon="add" />
                            <span className="hidden lg:inline">Add Event</span>
                          </button>
                        </li>
                      ) : null}
                    </ul>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDay ? (
        <NewEvent
          selectedDate={selectedDay}
          onCancel={() => setSelectedDay(null)}
          selectedDayEvents={[...upcomingShows, ...upcomingClasses].filter(
            (show) => isSameDay(selectedDay, show.date),
          )}
        />
      ) : null}
    </>
  );
};
