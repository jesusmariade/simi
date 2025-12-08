/*// Cliente para el navegador
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import config from "./config.js";

export const supabase = createClient(
  config.url,
  config.anonKey
);*/
/*
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/supabase.js";
import SUPABASE_CONFIG from "./config.js";

const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export default supabase;*/
import SUPABASE_CONFIG from "./config.js";

// No crear el cliente aquí — esperar a que se pida (lazy init)
let browserClient = null;

export async function getSupabaseClientBrowser() {
  if (browserClient) return browserClient;

  // Intentar usar window.supabase si ya está cargado (desde HTML UMD)
  if (typeof window !== "undefined" && window.supabase) {
    browserClient = window.supabase;
    return browserClient;
  }

  // Fallback: cargar desde CDN ESM (solo si es necesario)
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/supabase.js");
    browserClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return browserClient;
  } catch (err) {
    console.error("Error cargando Supabase ESM desde CDN:", err);
    throw err;
  }
}

export default getSupabaseClientBrowser;



