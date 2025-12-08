/*// Cliente para el navegador
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import config from "./config.js";

export const supabase = createClient(
  config.url,
  config.anonKey
);*/

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/supabase.js";
import SUPABASE_CONFIG from "./config.js";

const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export default supabase;



