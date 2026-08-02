import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://catch.theater",
  integrations: [
    react(),
    sitemap({
      // Output is server-rendered, so no pages are prerendered for the
      // sitemap to discover. List the public marketing routes explicitly
      // (the dynamic listing/ticket pages are intentionally excluded).
      customPages: [
        "https://catch.theater/",
        "https://catch.theater/shows",
        "https://catch.theater/classes",
        "https://catch.theater/classes/unlocking-the-self",
        "https://catch.theater/classes/standup",
        "https://catch.theater/classes/performance-track",
        "https://catch.theater/classes/other",
        "https://catch.theater/organizations",
        "https://catch.theater/respect",
        "https://catch.theater/policies/class-policies",
        "https://catch.theater/faqs/classes",
        "https://catch.theater/faqs/shows",
      ],
    }),
  ],
  output: "server",
  adapter: vercel(),
  // 301 redirects for legacy URLs that were 404ing (confirmed in GA).
  redirects: {
    "/improv-classes": "/classes",
    "/classes/stand-up-comedy": "/classes/standup",
    "/classes/improv-for-life": "/classes/unlocking-the-self",
    "/classes/beginner-improv-class": "/classes/unlocking-the-self",
    "/classes/improv-performance-track-2": "/classes/performance-track",
    "/classes/improv-performance-track-3": "/classes/performance-track",
    "/improv-classes/improv-performance-track-1": "/classes/performance-track",
    "/internal/volunteer": {
      status: 301,
      destination: "https://www.venvyapp.com/public/volunteer",
    },
  },
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
