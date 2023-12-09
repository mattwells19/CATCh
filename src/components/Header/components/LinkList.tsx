import type { ReactNode } from "react";
import { HeaderLink } from "./HeaderLink";

type LinkListProps = {
  children: ReactNode;
  columns?: number;
};

export const LinkList = ({ children, columns = 1 }: LinkListProps) => {
  return (
    <ul
      className={`grid grid-cols-${columns} gap-y-3 gap-x-1 list-disc list-inside`}
    >
      {children}
    </ul>
  );
};

export const LinkListItem = ({
  href,
  children,
  subText,
}: {
  href: string;
  children: ReactNode;
  subText?: string;
}) => {
  return (
    <li>
      <span className="relative -left-2">
        <HeaderLink href={href}>{children}</HeaderLink>
      </span>
      {subText ? <p className="text-xs">{subText}</p> : null}
    </li>
  );
};
