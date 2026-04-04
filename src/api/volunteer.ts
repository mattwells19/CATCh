import { ActionError } from "astro:actions";
import { supabase, type Database } from "~/lib/supabase";
import { getShowListings } from "./getShowListings";
import { validateTurnstileToken } from "./cloudflare";

export const VOLUNTEER_LIMIT = 3;
export const TECH_LIMIT = 1;

export interface ListingVolunteer {
  id: number;
  firstName: string;
  lastName: string;
  role: Database["public"]["Enums"]["Volunteer Role"];
}

export type ListingVolunteers = ReadonlyArray<Readonly<ListingVolunteer>>;

export const getListingVolunteers = async (
  listingId: number,
): Promise<ListingVolunteers> => {
  const { data } = await supabase
    .from("signup")
    .select(
      `
    listing_id,
    role,
    member (
      id,
      first_name,
      last_name
    )
`,
    )
    .eq("listing_id", listingId);

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row) => ({
    id: row.member.id,
    firstName: row.member.first_name,
    lastName: row.member.last_name,
    role: row.role,
  }));
};

export type VolunteerCounts = Readonly<
  Record<number, Readonly<{ volunteer: number; tech: number }>>
>;

export const getVolunteerCounts = async (
  listingIds: Array<number>,
): Promise<VolunteerCounts> => {
  const { data, error } = await supabase
    .from("signup")
    .select("listing_id, role")
    .in("listing_id", listingIds);

  if (error) {
    throw error;
  }

  const signUpSummariesMap = new Map<
    number,
    { volunteer: number; tech: number }
    // initializing the map ensures each listing has a default object even if it's not in the DB
  >(listingIds.map((listingId) => [listingId, { volunteer: 0, tech: 0 }]));

  for (const row of data) {
    const listingDetails = signUpSummariesMap.get(row.listing_id) ?? {
      volunteer: 0,
      tech: 0,
    };

    signUpSummariesMap.set(row.listing_id, {
      ...listingDetails,
      [row.role]: listingDetails[row.role] + 1,
    });
  }

  return Object.fromEntries(signUpSummariesMap);
};

export const volunteer = async (
  listingId: number,
  turnstileResponse: string,
  firstName: string,
  lastName: string,
  email: string,
  role: Database["public"]["Enums"]["Volunteer Role"],
): Promise<ListingVolunteers> => {
  const isValid = await validateTurnstileToken(turnstileResponse);
  if (!isValid) {
    throw new ActionError({
      code: "PRECONDITION_FAILED",
      message: "CAPTCHA validation failed",
    });
  }

  // validate role is available
  const { count: roleCount } = await supabase
    .from("signup")
    .select("role")
    .eq("listing_id", listingId)
    .eq("role", role);

  if (typeof roleCount === "number") {
    if (
      (role === "volunteer" && roleCount >= VOLUNTEER_LIMIT) ||
      (role === "tech" && roleCount >= TECH_LIMIT)
    ) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `The maximum number of people have already signed up for this role: ${role}.`,
      });
    }
  }

  const listingDetails = await getShowListings().then((showListings) =>
    showListings.find((listing) => listing.id === listingId),
  );
  if (!listingDetails) {
    throw new ActionError({
      code: "FAILED_DEPENDENCY",
      message: `Could not find listing with ID ${listingId}.`,
    });
  }

  // update/create member signing up
  const { data: existingMemberRecord } = await supabase
    .from("member")
    .select("id")
    .eq("email", email);
  const existingMemberId = existingMemberRecord?.at(0)?.id;

  const memberUpsert = await supabase
    .from("member")
    .upsert({
      id: existingMemberId,
      first_name: firstName,
      last_name: lastName,
      email: email,
    })
    .select("id");

  if (memberUpsert.error) {
    console.error("Error trying to update member.", memberUpsert.error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error trying to update member.",
      stack: memberUpsert.error.stack,
    });
  }

  const memberId = memberUpsert.data?.at(0)?.id;
  if (!memberId) {
    throw new ActionError({
      code: "FAILED_DEPENDENCY",
      message: "Error adding member.",
    });
  }

  const listingUpsert = await supabase.from("listing").upsert({
    id: listingId,
    name: listingDetails.name,
    show_datetime: listingDetails.date.toISOString(),
  });

  if (listingUpsert.error) {
    console.error("Error trying to update listing.", listingUpsert.error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error trying to update listing.",
      stack: listingUpsert.error.stack,
    });
  }

  const { error: signupError } = await supabase.from("signup").upsert([
    {
      member_id: memberId,
      listing_id: listingId,
      role,
    },
  ]);

  if (signupError) {
    console.error("Error trying to add signup.", signupError);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error trying to add signup.",
      stack: signupError.stack,
    });
  }

  return getListingVolunteers(listingId);
};

export const removeSignUp = async (
  listingId: number,
  turnstileResponse: string,
  email: string,
): Promise<ListingVolunteers> => {
  const isValid = await validateTurnstileToken(turnstileResponse);
  if (!isValid) {
    throw new ActionError({
      code: "PRECONDITION_FAILED",
      message: "CAPTCHA validation failed",
    });
  }

  const { data: memberIdRow } = await supabase
    .from("member")
    .select("id")
    .eq("email", email);

  const memberId = memberIdRow?.at(0)?.id;
  if (!memberId) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "No member with that email is signed up for this event.",
    });
  }

  const { data } = await supabase
    .from("signup")
    .delete()
    .eq("listing_id", listingId)
    .eq("member_id", memberId)
    .select("listing_id");

  if (data?.at(0)?.listing_id !== listingId) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: "No member with that email is signed up for this event.",
    });
  }

  return getListingVolunteers(listingId);
};
