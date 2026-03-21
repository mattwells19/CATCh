import type { User } from "@supabase/supabase-js";

type Nullable<T> = { [K in keyof T]: T[K] | null };

declare namespace App {
  interface Locals {
    user: User;
  }
}

/// <reference types="astro/client" />
