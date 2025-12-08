// Cliente para Node (Docker)
/*import { createClient } from "@supabase/supabase-js";
import config from "./config.js";

export const supabase = createClient(
  config.url,
  config.anonKey
);*/

import config from './config.js';
import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabaseClientNode() {
  if (!client) client = createClient(config.url, config.anonKey);
  return client;
}

// Si ejecutas en navegador con bundler, exporta lo mismo o crea factory.
export default getSupabaseClientNode;
