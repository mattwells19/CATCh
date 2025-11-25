import type { WYSIWYGString } from "./api.types";
import { getCollectionEntries } from "./utils";

export interface Policy {
  name: string;
  slug: string;
  tags: Array<string>; // not sure what this is used for
  note: string;
  policy: WYSIWYGString;
  // "links": "", ??
  _modified: Date; // number date
  _id: string;
  date: string; // YYYY-MM-DD
  subhead: string;
  metaDesc: string;
}

export async function getPolicies(): Promise<Array<Policy>> {
  const policyEntries = await getCollectionEntries<Policy>("policies");

  return policyEntries.map((policyEntry) => ({
    ...policyEntry,
    _modified: new Date(policyEntry._modified),
  }));
}

export async function getPolicy(policySlug: string): Promise<Policy | null> {
  const policies = await getPolicies();

  return (
    policies.find((policyEntry) => policyEntry.slug === policySlug) ?? null
  );
}
