import React from "react";
import { RemixIcon } from "~/components/RemixIcon";
import { CalendarIcon } from "~/icons/CalendarIcon";

interface HeaderProps {
  userName: string;
  currentMonth: string;
  prevMonthHref: URL | null;
  nextMonthHref: URL;
}

export const Header = ({
  userName,
  currentMonth,
  nextMonthHref,
  prevMonthHref,
}: HeaderProps) => {
  return (
    <>
      <div className="flex gap-4 w-fit items-center ml-auto">
        <div className="flex gap-1 items-center">
          <RemixIcon icon="user-5" variant="line" width="20" height="20" />
          <p>{userName}</p>
        </div>
        <form method="get" action="/api/auth/sign-out">
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className="p-2 mr-2 bg-coral text-white rounded"
          >
            <RemixIcon
              icon="logout-box"
              variant="line"
              width="20"
              height="20"
            />
          </button>
        </form>
      </div>

      <nav className="pb-12 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {prevMonthHref ? (
            <a
              href={prevMonthHref.toString()}
              aria-label="Last month"
              className="hover:bg-purple-400/20 transition-colors rounded-md p-1"
            >
              <RemixIcon icon="arrow-left-s" variant="line" />
            </a>
          ) : null}
          <h3 className="text-primary-purple text-4xl font-serif font-bold flex items-center gap-2">
            <CalendarIcon name="calendar" className="size-9" />
            <span>{currentMonth}</span>
          </h3>
          <a
            href={nextMonthHref.toString()}
            aria-label="Next month"
            className="hover:bg-purple-400/20 transition-colors rounded-md p-1"
          >
            <RemixIcon icon="arrow-right-s" variant="line" />
          </a>
        </div>
      </nav>
    </>
  );
};
