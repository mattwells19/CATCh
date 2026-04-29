import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: vercel(),
  image: {
    domains: ["tlt-events.s3.amazonaws.com", "catch.theater"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
