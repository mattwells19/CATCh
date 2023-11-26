export const HeaderSection = ({
  title,
  className,
  children,
  ...props
}: JSX.IntrinsicElements["a"] & { title: string }) => {
  return (
    <section {...props} className="max-w-sm w-full">
      <h2 className="uppercase font-semibold border-b border-b-slate-400 text-slate-50 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
};
