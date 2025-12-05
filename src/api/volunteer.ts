import { supabase } from "~/lib/supabase";

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

export const volunteer = async (
  listingId: number,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
) => {
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
    throw new Error("Error adding member.");
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
