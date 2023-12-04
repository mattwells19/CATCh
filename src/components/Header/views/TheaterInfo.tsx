import type { ReactElement } from "react";
import { HeaderSection } from "../components/HeaderSection.tsx";
import type { StaffMember } from "~/api/getStaffMembers.ts";
import { LinkList, LinkListItem } from "../components/LinkList.tsx";

export const TheaterInfo = ({
  staffMembers,
}: {
  staffMembers: Array<StaffMember>;
}): ReactElement => {
  return (
    <div className="grid grid-cols-2 justify-items-center gap-5">
      <HeaderSection title="Our People">
        <LinkList>
          {staffMembers.map((staffMember) => (
            <LinkListItem
              key={staffMember.slug}
              href={`/meet/${staffMember.slug}`}
            >
              {staffMember.name}
              <p className="pl-[22px]">{staffMember.title}</p>
            </LinkListItem>
          ))}
        </LinkList>
      </HeaderSection>
    </div>
  );
};
