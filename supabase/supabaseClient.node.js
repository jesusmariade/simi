// Cliente para Node (Docker)
import { createClient } from "@supabase/supabase-js";
import config from "./config.js";

export const supabase = createClient(
  config.url,
  config.anonKey
);
