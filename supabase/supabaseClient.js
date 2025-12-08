/*// supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import SUPABASE_CONFIG from './config.js';

const supabase = createClient(
  SUPABASE_CONFIG.url, 
  SUPABASE_CONFIG.anonKey
);

/*export default supabase;*/
let supabase;

if (typeof window === "undefined") {
  // Ejecutado en Node
  supabase = (await import("./supabaseClient.node.js")).supabase;
} else {
  // Ejecutado en navegador
  supabase = (await import("./supabaseClient.browser.js")).default;
}

/*if (typeof window === "undefined") {
  console.log("Cargando cliente Node...");
  supabase = (await import("./supabaseClient.node.js")).supabase;
} else {
  console.log("Cargando cliente Browser...");
  const mod = await import("./supabaseClient.browser.js");
  console.log("Contenido cargado:", mod);
  supabase = mod.default;
}*/


export default supabase;





