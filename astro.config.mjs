import { defineConfig } from "astro/config";
import vercelStatic from "@astrojs/vercel/static";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), icon()],
  output: "static",
  adapter: vercelStatic({
    imageService: true,
  }),
  image: {
    domains: ["tlt-events.s3.amazonaws.com", "catch.theater"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
});
