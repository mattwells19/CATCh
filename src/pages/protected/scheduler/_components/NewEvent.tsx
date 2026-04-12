import React, { useMemo, useState } from "react";
import { actions } from "astro:actions";
import { TZDateMini } from "@date-fns/tz";
import { format, formatDistanceStrict, formatISO } from "date-fns";
import type { Database as SchedulerDatabase } from "~/lib/supabase/scheduler";
import { RemixIcon } from "~/components/RemixIcon";

interface NewEventProps {
  selectedDate: Date;
  selectedDayEvents: Array<
    SchedulerDatabase["public"]["Tables"]["events"]["Row"]
  >;
  onCancel: () => void;
}

export const NewEvent = ({
  selectedDate,
  selectedDayEvents,
  onCancel,
}: NewEventProps) => {
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("20:00");

  const start = useMemo(() => {
    const d = new Date(selectedDate);
    const [hour, minute] = startTime.split(":").map(Number);
    d.setHours(hour);
    d.setMinutes(minute);
    return d;
  }, [selectedDate, startTime]);

  const end = useMemo(() => {
    const d = new Date(selectedDate);
    const [hour, minute] = endTime.split(":").map(Number);
    d.setHours(hour);
    d.setMinutes(minute);
    return d;
  }, [selectedDate, endTime]);

  const dateValidationError = useMemo(() => {
    const now = new TZDateMini("America/New_York");
    const from = new TZDateMini(start, "America/New_York");
    const to = new TZDateMini(end, "America/New_York");

    if (from < now) {
      return "The event start time cannot be in the past.";
    } else if (from >= to) {
      return "The event end time must be after the start time.";
    }
  }, [start, end]);

  const handleDialogMount = (el: HTMLDialogElement | null) => {
    if (el) {
      el.showModal();
      el.addEventListener("close", onCancel);
    }
  };

  return (
    <dialog
      id="new-event"
      className="w-5/6 lg:max-w-screen-sm m-auto bg-peach rounded-sm py-5 px-7 relative shadow-sm"
      ref={handleDialogMount}
    >
      <button
        title="Close dialog"
        commandfor="new-event"
        command="close"
        className="absolute right-7 top-5 p-2"
      >
        <RemixIcon icon="close" />
      </button>
      <h1 className="text-gradient text-3xl font-bold">New Event</h1>

      <p className="my-6">
        Schedule a new event for{" "}
        <span className="font-semibold">
          {format(selectedDate, "MMM do yyyy")}
        </span>
        .
      </p>

      <form className="new-event flex flex-col gap-4" action={actions.newEvent}>
        <input
          type="hidden"
          name="date"
          value={formatISO(selectedDate, { representation: "date" })}
        />
        <div className="field-group">
          <label htmlFor="name">Event name</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div className="field-group">
          <div className="flex gap-4 flex-wrap">
            <div className="field-group flex-1">
              <label htmlFor="start">From</label>
              <input
                id="start"
                name="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="field-group flex-1">
              <label htmlFor="end">To</label>
              <input
                id="end"
                name="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          {dateValidationError ? (
            <p className="text-red-900">{dateValidationError}</p>
          ) : (
            <p className="text-gray-600">{formatDistanceStrict(start, end)}</p>
          )}
        </div>
        <fieldset className="field-group">
          <legend className="pb-1">Location</legend>
          <div className="radio-item">
            <input
              id="theater"
              name="location"
              type="radio"
              value="Theater"
              defaultChecked
            />
            <label htmlFor="theater">Main Theater</label>
          </div>
          <div className="radio-item">
            <input id="annex" name="location" type="radio" value="Annex" />
            <label htmlFor="annex">Annex</label>
          </div>
          <div className="radio-item">
            <input id="office" name="location" type="radio" value="Office" />
            <label htmlFor="office">Office</label>
          </div>
        </fieldset>
        <div role="group" className="flex gap-4 w-fit ml-auto mt-4">
          <button
            type="button"
            commandfor="new-event"
            command="close"
            className="font-semibold text-lg rounded py-2 px-4 w-fit"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-coral text-white font-semibold text-lg hover:bg-[#B7433C] transition-colors rounded py-2 px-4 w-fit"
          >
            Create event
          </button>
        </div>
      </form>
    </dialog>
  );
};
