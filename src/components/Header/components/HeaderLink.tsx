export const HeaderLink = ({
  children,
  ...props
}: JSX.IntrinsicElements["a"]) => {
  return (
    <a
      {...props}
      className="text-violet-200 hover:underline focus:underline whitespace-nowrap"
    >
      {children}
    </a>
  );
};
