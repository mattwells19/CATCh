import { defineMiddleware } from "astro:middleware";
import { getSupabaseSchedulerClient } from "~/lib/supabase/scheduler";

export const validateAuth = defineMiddleware(async (ctx, next) => {
  const supabaseScheduler = getSupabaseSchedulerClient(
    ctx.request,
    ctx.cookies,
  );
  const accessToken = ctx.cookies.get("sb-access-token");
  const refreshToken = ctx.cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return ctx.redirect("/protected/sign-in");
  }

  try {
    const session = await supabaseScheduler.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (session.data.user) {
      ctx.locals.user = session.data.user;
      return next();
    }
  } catch (error) {
    ctx.cookies.delete("sb-access-token", {
      path: "/",
    });
    ctx.cookies.delete("sb-refresh-token", {
      path: "/",
    });
    return next(
      new Request("/protected/sign-in", {
        headers: {
          "X-REDIRECT-TO": ctx.url.pathname,
        },
      }),
    );
  }

  ctx.cookies.delete("sb-access-token", {
    path: "/",
  });
  ctx.cookies.delete("sb-refresh-token", {
    path: "/",
  });

  return next(
    new Request("/protected/sign-in", {
      headers: {
        "X-REDIRECT-TO": ctx.url.pathname,
      },
    }),
  );
});
