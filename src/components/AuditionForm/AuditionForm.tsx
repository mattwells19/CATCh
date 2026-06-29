import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Static data (demo content carried over verbatim from the mockup)
 * ------------------------------------------------------------------ */

type Accordion = { q: string; a: string };

const ACCORDIONS: Accordion[] = [
  {
    q: "Who may audition?",
    a: "Everyone is welcome, including performers from outside CATCh. The standard qualification is completing all three CATCh Performance Track classes (or equivalent experience elsewhere, with PT1 finished or an Artistic Director recommendation). The panel may limit auditioners with very little experience. Eyeing a Harold team? We recommend 6–12 months of experience first.",
  },
  {
    q: "What happens at the audition",
    a: "Think of it like an improv jam: come have fun. You'll do scene work alongside other improvisers and get direction from the panel as you go. Wear something comfy you can move in. That's genuinely all the prep you need.",
  },
  {
    q: "What the coaches look for",
    a: "Bring energy, have fun, and take notes well. The panel watches the fundamentals: making bold choices, supporting your scene partners, physicality, recognizing when a game is heightening, and communicating clearly. More experienced auditioners may also be assessed on second-beat initiations, group games, and character work.",
  },
];

const EXPERIENCE_OPTIONS = [
  "Still a student",
  "Completed the Performance Track at CATCh (or equivalent elsewhere)",
  "6+ months on a Harold Team",
  "12+ months on any House Team",
  "2+ years regularly performing (post-student teams)",
];

type Team = {
  id: string;
  name: string;
  kind: "House" | "Resident";
  blurb: string;
  practice: string;
  show: string;
  seeking: string;
  coach: string;
};

const TEAMS: Team[] = [
  {
    id: "screenwriters",
    name: "Screenwriters",
    kind: "House",
    blurb: "An improvised movie, scene by scene",
    practice: "2nd & 4th Mon · 6–8 PM",
    show: "4th Fri · 7:30 PM",
    seeking: "Seeking 1–2",
    coach: "Coach: Abby Head",
  },
  {
    id: "courtroom-prov",
    name: "Courtroom Prov",
    kind: "Resident",
    blurb: "A brand-new team. A full improvised court trial.",
    practice: "1st & 3rd Mon · 8–10 PM",
    show: "Show night TBD",
    seeking: "Seeking 1–2",
    coach: "Coach: Matt Wells",
  },
  {
    id: "dear-diary",
    name: "Dear Diary",
    kind: "Resident",
    blurb: "Character monologues & scenes",
    practice: "1st & 3rd Mon · 8–10 PM",
    show: "2nd Sat · 7:30 PM",
    seeking: "Seeking 1–2",
    coach: "Coach: Ken Breeze",
  },
];

const VIBE_CHIPS = ["A Harold Team", "Just for practice / fun"];

const SLOT_COLS = ["Morn", "Aft", "6–8 PM", "8–10 PM"] as const;
type SlotCol = (typeof SLOT_COLS)[number];

type DayRow = { day: string; offered: Record<SlotCol, boolean> };

const AVAILABILITY: DayRow[] = [
  { day: "Mon", offered: { Morn: false, Aft: false, "6–8 PM": true, "8–10 PM": true } },
  { day: "Tue", offered: { Morn: false, Aft: false, "6–8 PM": true, "8–10 PM": true } },
  { day: "Wed", offered: { Morn: false, Aft: false, "6–8 PM": true, "8–10 PM": true } },
  { day: "Thu", offered: { Morn: false, Aft: false, "6–8 PM": true, "8–10 PM": true } },
  { day: "Fri", offered: { Morn: false, Aft: false, "6–8 PM": true, "8–10 PM": true } },
  { day: "Sat", offered: { Morn: true, Aft: true, "6–8 PM": true, "8–10 PM": true } },
  { day: "Sun", offered: { Morn: true, Aft: true, "6–8 PM": true, "8–10 PM": true } },
];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function AuditionForm() {
  // Accordions
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // About you
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [experienceNotes, setExperienceNotes] = useState("");

  // Interests
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  // Availability: key = `${day}-${col}`
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Flow
  const [submitted, setSubmitted] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitted) {
      successHeadingRef.current?.focus();
    }
  }, [submitted]);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  // Success-summary derivations
  const interestLabels = [
    ...TEAMS.filter((t) => selectedTeams.includes(t.id)).map((t) => t.name),
    ...selectedVibes,
  ];
  const interestSummary =
    interestLabels.length > 0
      ? interestLabels.join(" · ")
      : "Open to wherever you need me";

  const slotCount = selectedSlots.length;
  const availabilitySummary =
    slotCount > 0
      ? `${slotCount} slot${slotCount === 1 ? "" : "s"} selected`
      : "Flexible, no specific slots picked";

  /* -------------------------------- success state -------------------------------- */
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div
          aria-hidden="true"
          className="audition-pop mx-auto flex size-20 items-center justify-center rounded-full bg-coral text-peach"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-10"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-6 font-serif text-4xl font-bold text-primary-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-purple"
        >
          You said yes! 🎉
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-black">
          Break a leg. Auditions are{" "}
          <strong className="font-bold text-primary-purple">
            Sat, Aug 22, 4–6 PM at The Annex
          </strong>
          . Come ready to play; there's nothing to prepare.
        </p>

        <div className="mt-8 rounded border border-light-purple bg-peach p-6 text-left shadow-lg">
          <dl className="flex flex-col gap-5">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-primary-purple">
                Your interests
              </dt>
              <dd className="mt-1 text-black">{interestSummary}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-primary-purple">
                Availability
              </dt>
              <dd className="mt-1 text-black">{availabilitySummary}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href="https://www.google.com/calendar/render?action=TEMPLATE&text=CATCh+Auditions&dates=20260822T160000/20260822T180000&location=The+Annex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-sm border-2 border-primary-purple px-5 py-3 font-serif font-bold text-primary-purple transition-colors hover:bg-primary-purple hover:text-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple lg:w-fit lg:min-w-65 lg:text-xl"
          >
            <span aria-hidden="true">📅</span> Add Aug 22 to my calendar
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-sm font-serif font-bold text-primary-purple underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple"
          >
            Edit my response
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- form state -------------------------------- */
  return (
    <div className="flex flex-col gap-12">
      {/* ---------- Before you register (accordions) ---------- */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-primary-purple lg:text-3xl">
          Before you register
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {ACCORDIONS.map((item, i) => {
            const isOpen = openAccordion === i;
            const panelId = `accordion-panel-${i}`;
            const btnId = `accordion-btn-${i}`;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded border border-light-purple bg-peach"
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenAccordion(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-lg font-bold text-primary-purple transition-colors hover:bg-primary-purple/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-purple"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-2xl leading-none text-coral transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="px-5 pb-5 text-black"
                  >
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-12"
      >
        {/* ---------- About you ---------- */}
        <fieldset>
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-primary-purple">
            About you
          </legend>
          <p className="mb-5 text-sm italic text-black/60">* Required</p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full-name" className="text-sm font-medium">
                Full name *
              </label>
              <input
                id="full-name"
                type="text"
                required
                autoComplete="name"
                maxLength={70}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={14}
                  placeholder="(704) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="experience" className="text-sm font-medium">
                Improv experience *
              </label>
              <p id="experience-help" className="text-sm text-primary-purple">
                Please select the HIGHEST level of experience you currently have. If your experience is partially or wholly away from CATCh, please describe below. Exclude High School and College improv classes / performance experience when selecting below, but include in the notes.
              </p>
              <select
                id="experience"
                required
                aria-describedby="experience-help"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={inputClass}
              >
                <option value="">Select one…</option>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="experience-notes" className="text-sm font-medium">
                Experience notes{" "}
                <span className="font-normal text-primary-purple">
                  (optional)
                </span>
              </label>
              <textarea
                id="experience-notes"
                rows={3}
                maxLength={2000}
                placeholder="Classes you've taken, theaters you've played, anything else about your background…"
                value={experienceNotes}
                onChange={(e) => setExperienceNotes(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </fieldset>

        {/* ---------- Which teams interest you? ---------- */}
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest text-primary-purple">
            Which teams interest you?
          </legend>
          <p className="mt-3 text-black">
            Tap any opening. Pick as many as you like. These teams are actively
            casting this cycle.
          </p>
          <ul className="mt-5 flex flex-col gap-4">
            {TEAMS.map((team) => {
              const isSelected = selectedTeams.includes(team.id);
              return (
                <li key={team.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      toggle(team.id, selectedTeams, setSelectedTeams)
                    }
                    className={`flex w-full items-start gap-4 rounded border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple ${
                      isSelected
                        ? "border-primary-purple bg-primary-purple/5"
                        : "border-light-purple bg-peach hover:border-primary-purple"
                    }`}
                  >
                    {/* check box indicator (shape, not color-only) */}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                        isSelected
                          ? "border-[#B7433C] bg-[#B7433C] text-peach"
                          : "border-light-purple"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>

                    <span className="flex flex-1 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-lg font-bold text-primary-purple">
                          {team.name}
                        </span>
                        <span
                          className={`rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            team.kind === "House"
                              ? "bg-[#B7433C] text-peach"
                              : "border border-light-purple text-primary-purple"
                          }`}
                        >
                          {team.kind}
                        </span>
                      </span>
                      <span className="text-black">{team.blurb}</span>
                      <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-purple">
                        <span>
                          <span className="font-bold">Practice Schedule:</span>{" "}
                          {team.practice}
                        </span>
                        <span>{team.show}</span>
                        <span className="font-bold">{team.seeking}</span>
                        <span>{team.coach}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <ul className="mt-6 flex flex-col gap-4">
            {VIBE_CHIPS.map((chip) => {
              const isSelected = selectedVibes.includes(chip);
              return (
                <li key={chip}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      toggle(chip, selectedVibes, setSelectedVibes)
                    }
                    className={`flex w-full items-start gap-4 rounded border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple ${
                      isSelected
                        ? "border-primary-purple bg-primary-purple/5"
                        : "border-light-purple bg-peach hover:border-primary-purple"
                    }`}
                  >
                    {/* check box indicator (shape, not color-only) */}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                        isSelected
                          ? "border-[#B7433C] bg-[#B7433C] text-peach"
                          : "border-light-purple"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-primary-purple">
                          {chip}
                        </span>
                        {chip === "A Harold Team" && (
                          <span className="rounded-sm bg-[#B7433C] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-peach">
                            House
                          </span>
                        )}
                      </span>
                      {chip === "A Harold Team" && (
                        <span className="text-sm text-black">
                          This is the first team for students fresh out of Performance Track 3 class.
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {/* ---------- Your availability ---------- */}
        <fieldset className="min-w-0">
          <legend className="text-xs font-bold uppercase tracking-widest text-primary-purple">
            Your availability
          </legend>
          <p className="mt-3 text-black">
            Teams commit to a regular practice night for at least six months. The single biggest issue is members who can't make
            most practices and shows, so this part matters. Tap every slot you
            could reliably commit to. Mornings and afternoons are weekend-only;
            grey slots aren't offered.
          </p>

          <div className="mt-5 max-w-full overflow-x-auto">
            <table className="table-fixed border-collapse">
              <caption className="sr-only">
                Rehearsal availability grid. Tap a time slot to select it.
              </caption>
              <thead>
                <tr>
                  <th className="w-10" />
                  {SLOT_COLS.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="w-16 pb-3 text-center text-sm font-bold text-primary-purple"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AVAILABILITY.map((row) => (
                  <tr key={row.day}>
                    <th
                      scope="row"
                      className="pr-2 text-right text-sm font-bold text-primary-purple"
                    >
                      {row.day}
                    </th>
                    {SLOT_COLS.map((col) => {
                      const offered = row.offered[col];
                      const slotKey = `${row.day}-${col}`;
                      const isSelected = selectedSlots.includes(slotKey);

                      if (!offered) {
                        return (
                          <td key={col} className="p-1">
                            <div
                              aria-hidden="true"
                              className="flex h-12 items-center justify-center rounded bg-black/5 text-[#595959]"
                            >
                              –
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={col} className="p-1">
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${row.day} ${col}`}
                            onClick={() =>
                              toggle(slotKey, selectedSlots, setSelectedSlots)
                            }
                            className={`flex h-12 w-full items-center justify-center rounded border-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple ${
                              isSelected
                                ? "border-[#B7433C] bg-[#B7433C] text-peach"
                                : "border-light-purple text-primary-purple hover:border-primary-purple"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium">
              Scheduling notes{" "}
              <span className="font-normal text-primary-purple">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={2000}
              placeholder="Standing conflicts, travel, anything we should know…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
        </fieldset>

        {/* ---------- Submit ---------- */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded bg-coral px-5 py-3 font-serif font-bold text-peach shadow-md transition-colors hover:bg-[#B7433C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-purple lg:w-fit lg:min-w-65 lg:text-xl"
          >
            Submit registration
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded border-2 border-light-purple bg-white px-3 py-2 text-black placeholder:text-black/40 focus-visible:border-primary-purple focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-purple";
