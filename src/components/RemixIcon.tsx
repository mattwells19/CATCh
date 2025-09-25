type Props = React.SVGProps<SVGSVGElement> & {
  icon: string;
  variant?: "fill" | "line";
};

export const RemixIcon = ({
  icon,
  variant = "fill",
  width = "24",
  height = "24",
  fill = "currentColor",
  ...svgProps
}: Props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      height={height}
      width={width}
      fill={fill}
      {...svgProps}
    >
      <use xlinkHref={`/icons.svg#ri-${icon}-${variant}`} />
    </svg>
  );
};
