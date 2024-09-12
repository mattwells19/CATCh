import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), icon()],
  output: "server",
  adapter: node({
    mode: "standalone",
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
