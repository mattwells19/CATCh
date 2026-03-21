import type { APIRoute } from "astro";
import { getSupabaseSchedulerClient } from "~/lib/supabase/scheduler";

export const POST: APIRoute = async ({ request, url, redirect, cookies }) => {
  const supabaseScheduler = getSupabaseSchedulerClient(request, cookies);
  const formData = await request.formData();
  const provider = formData.get("provider")?.toString();
  if (provider !== "discord") {
    return new Response(`Invalid provider: ${provider}`, { status: 400 });
  }

  const redirectUrl = new URL("/api/auth/callback", url.origin);

  const { data, error } = await supabaseScheduler.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: redirectUrl.toString() },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect(data.url);
};
