import { ActionError } from "astro/actions/runtime/shared.js";
import type { Database } from "~/lib/supabase/database.types";
import { supabase } from "~/lib/supabase";

export const VOLUNTEER_LIMIT = 3;
export const TECH_LIMIT = 1;

export const getListingVolunteers = async (listingId: number) => {
  const { data } = await supabase
    .from("signup")
    .select(
      `
    listing_id,
    role,
    member (
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
    firstName: row.member.first_name,
    lastName: row.member.last_name,
    role: row.role,
  }));
};

export const getVolunteerCounts = async (listingIds: Array<number>) => {
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
  firstName: string,
  lastName: string,
  email: string,
  role: Database["public"]["Enums"]["Volunteer Role"],
) => {
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

  // update/create member signing up
  const { data: existingMemberRecord } = await supabase
    .from("member")
    .select("id")
    .eq("email", email);
  const existingMemberId = existingMemberRecord?.at(0)?.id;

  const { data, error: memberError } = await supabase
    .from("member")
    .upsert({
      id: existingMemberId,
      first_name: firstName,
      last_name: lastName,
      email: email,
    })
    .select("id");

  if (memberError) {
    throw memberError;
  }

  const memberId = data?.at(0)?.id;
  if (!memberId) {
    throw new ActionError({
      code: "FAILED_DEPENDENCY",
      message: "Error adding member.",
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
    throw signupError;
  }

  return getListingVolunteers(listingId);
};
