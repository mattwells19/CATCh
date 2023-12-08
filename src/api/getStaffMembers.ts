import type { CockpitImage, WYSIWYGString } from "./api.types";
import { getCollectionEntries } from "./utils";

export interface StaffMember {
  name: string;
  pronouns: string;
  title: string;
  headshot: CockpitImage;
  bio: WYSIWYGString;
  website: string; // url
  facebook: string;
  twitter: string;
  instagram: string;
  metaDesc: string; // ?
  slug: string;

  // used for footer
  isFounder: boolean;
  pullQuote: WYSIWYGString;
}

export async function getStaffMembers(): Promise<Array<StaffMember>> {
  const staffEntries = await getCollectionEntries<StaffMember>("staff");

  return staffEntries.map((staffEntry) => ({
    ...staffEntry,
    headshot: {
      path: `https://catch.theater${staffEntry.headshot.path}`,
    },
  }));
}

export async function getStaffMember(
  staffMemberSlug: string,
): Promise<StaffMember | null> {
  const staffMembers = await getStaffMembers();

  return (
    staffMembers.find((staffMember) => staffMember.slug === staffMemberSlug) ??
    null
  );
}
