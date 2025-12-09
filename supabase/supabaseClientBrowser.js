import SUPABASE_CONFIG from './config.js';

let supabase = null;

async function initSupabase() {
  if (supabase) return supabase;
  
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = createClient(
      SUPABASE_CONFIG.url, 
      SUPABASE_CONFIG.anonKey
    );
  } catch (error) {
    console.error('Error initializing Supabase from CDN:', error);
  }
  
  return supabase;
}

export { initSupabase };
export default supabase;
