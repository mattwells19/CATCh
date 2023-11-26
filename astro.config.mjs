import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// import { loadEnv } from "vite";
// const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  // TODO: consider SSR vs static
  // output: "server",
  integrations: [tailwind()],
});
