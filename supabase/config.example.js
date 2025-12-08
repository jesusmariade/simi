/*const SUPABASE_CONFIG = {
  url: 'TU_SUPABASE_URL_AQUI',
  anonKey: 'TU_SUPABASE_ANON_KEY_AQUI'
};

export default SUPABASE_CONFIG;*/

const isNode = typeof process !== "undefined" && process.env;

const SUPABASE_CONFIG = {
  url: isNode
    ? process.env.SUPABASE_URL || 'TU_SUPABASE_URL_AQUI'
    : 'TU_SUPABASE_URL_AQUI',

  anonKey: isNode
    ? process.env.SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY_AQUI'
    : 'TU_SUPABASE_ANON_KEY_AQUI'
};

export default SUPABASE_CONFIG;

