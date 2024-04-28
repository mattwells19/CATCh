interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: string;
  variant?: "fill" | "line";
}

export const Icon = ({ icon, variant = "fill", ...svgProps }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      height="24"
      width="24"
      {...svgProps}
    >
      <use xlinkHref={`/icons.svg#ri-${icon}-${variant}`}></use>
    </svg>
  );
};
