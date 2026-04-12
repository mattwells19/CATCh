import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { Database } from "./scheduler.types";
import type { AstroCookies } from "astro";
import { createClient } from "@supabase/supabase-js";

export const getSupabaseSchedulerClient = (
  request: Request,
  cookies: AstroCookies,
) =>
  createServerClient<Database>(
    import.meta.env.SUPABASE_SCHEDULER_URL,
    import.meta.env.SUPABASE_SCHEDULER_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => cookies.set(name, value));
        },
      },
      auth: { flowType: "pkce" },
    },
  );

export const supabaseScheduler = createClient<Database>(
  import.meta.env.SUPABASE_SCHEDULER_URL,
  import.meta.env.SUPABASE_SCHEDULER_KEY,
);
