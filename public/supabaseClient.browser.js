// Versión del navegador de supabaseClient.js
// Este archivo es servido cuando el navegador intenta cargar supabaseClient.js
// NO tiene imports de @supabase/supabase-js porque no funciona en el navegador

console.warn('⚠️ supabaseClient.js está siendo cargado en el navegador. Este módulo solo funciona en el servidor.');
console.warn('⚠️ Si necesitas datos de Supabase, usa los endpoints API del servidor en su lugar.');

export default null;

