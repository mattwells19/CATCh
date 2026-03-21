import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("sb-access-token", { path: "/protected" });
  cookies.delete("sb-refresh-token", { path: "/protected" });
  return redirect("/protected/sign-in");
};
