import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        peach: "var(--peach)",
        "primary-purple": "var(--primary-purple)",
        coral: "var(--coral)",
        yellow: "var(--yellow)",
        black: "var(--black)",
      },
      fontFamily: {
        serif: ["Fraunces", ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        shapes: "url('/svgs/shapes-bg.svg')",
      },
    },
  },
  plugins: [],
};
