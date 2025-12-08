/*// supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import SUPABASE_CONFIG from './config.js';

const supabase = createClient(
  SUPABASE_CONFIG.url, 
  SUPABASE_CONFIG.anonKey
);

/*export default supabase;*/
/*let supabase;

if (typeof window === "undefined") {
  // Ejecutado en Node
  supabase = (await import("./supabaseClient.node.js")).supabase;
} else {
  // Ejecutado en navegador
  supabase = (await import("./supabaseClient.browser.js")).default;
}

export default supabase;*/
let cachedClient = null;

export async function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  if (typeof window === "undefined") {
    // Node.js (servidor)
    const mod = await import("./supabaseClient.node.js");
    cachedClient = mod.default(); // getSupabaseClientNode es la función por defecto
    return cachedClient;
  } else {
    // Navegador
    const mod = await import("./supabaseClient.browser.js");
    cachedClient = await mod.getSupabaseClientBrowser();
    return cachedClient;
  }
}

export default getSupabaseClient;







