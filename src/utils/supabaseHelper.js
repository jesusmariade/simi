// src/utils/supabaseHelper.js
// Helper para obtener el cliente de Supabase usando import dinámico
// Esto evita imports estáticos que causan problemas en el navegador

let supabaseClientCache = null;

export async function getSupabaseClient() {
	// Si estamos en el navegador, lanzar error
	if (typeof window !== 'undefined') {
		throw new Error('getSupabaseClient() solo puede usarse en el servidor (Node.js). Use endpoints API del servidor en el navegador.');
	}
	
	// Si ya tenemos el cliente cacheado, retornarlo
	if (supabaseClientCache) {
		return supabaseClientCache;
	}
	
	// Import dinámico (solo funciona en Node.js)
	try {
		const module = await import('../../supabase/supabaseClient.js');
		// supabaseClient.js exporta una promesa, así que esperarla
		supabaseClientCache = await module.default;
		return supabaseClientCache;
	} catch (error) {
		console.error('Error al cargar Supabase client:', error);
		throw error;
	}
}

