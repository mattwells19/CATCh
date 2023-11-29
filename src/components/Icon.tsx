export const Icon = ({
  icon,
  variant = "fill",
}: {
  icon: string;
  variant?: "fill" | "line";
}) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <use xlinkHref={`/icons.svg#ri-${icon}-${variant}`}></use>
    </svg>
  );
};
