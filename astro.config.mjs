import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import storyblok from "@storyblok/astro";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  // TODO: consider SSR vs static
  // output: "server",
  integrations: [
    tailwind(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      bridge: false,
      components: {
        // Add your components here
        UpcomingShowsList: "storyblok/UpcomingShowsList",
        UpcomingShowCard: "storyblok/UpcomingShowCard",
        CalloutCardList: "storyblok/CalloutCardList",
        CalloutCard: "storyblok/CalloutCard",
      },
      apiOptions: {
        // Choose your Storyblok space region
        region: "us", // optional,  or 'eu' (default)
      },
    }),
  ],
});
