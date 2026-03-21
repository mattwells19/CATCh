import { createClient } from "@supabase/supabase-js";
import type { Database } from "./volunteer.types";

export const supabaseVolunteer = createClient<Database>(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_KEY,
);
