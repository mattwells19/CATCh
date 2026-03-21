import { defineMiddleware } from "astro:middleware";
import { validateAuth } from "./validateAuth";

export const onRequest = defineMiddleware((ctx, next) => {
  if (
    ctx.url.pathname.startsWith("/protected") &&
    !ctx.url.pathname.endsWith("/sign-in")
  ) {
    return validateAuth(ctx, next);
  }

  return next();
});
