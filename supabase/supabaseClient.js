import SUPABASE_CONFIG from './config.js';

// Detectar si es navegador o Node.js
const isNodeEnvironment = typeof window === 'undefined';

let supabase = null;
let initPromise = null;

async function initializeSupabase() {
  if (supabase) return supabase;

  try {
    if (isNodeEnvironment) {
      // Node.js: usar import de npm
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(
        SUPABASE_CONFIG.url, 
        SUPABASE_CONFIG.anonKey
      );
    } else {
      // Navegador: usar CDN
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(
        SUPABASE_CONFIG.url, 
        SUPABASE_CONFIG.anonKey
      );
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }

  return supabase;
}

// Inicializar inmediatamente si es Node.js (sincrónico)
if (isNodeEnvironment) {
  await initializeSupabase();
}

// Crear un proxy que espere a la inicialización en navegador
const handler = {
  get: (target, prop) => {
    if (supabase && supabase[prop]) {
      return supabase[prop];
    }
    // Devolver una función que espere la inicialización
    return async function (...args) {
      const client = await initializeSupabase();
      if (client && client[prop]) {
        return client[prop](...args);
      }
      throw new Error(`Supabase property ${String(prop)} not found`);
    };
  }
};

async function getSupabase() {
  if (supabase) return supabase;
  await initializeSupabase();
  return supabase;
}

export { getSupabase };

export default supabase || new Proxy({}, handler);