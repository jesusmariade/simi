// src/services/SucursalService.js
// Cliente de Supabase que funciona en navegador y Node.js
/*let supabaseClient = null;

async function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
        // Esperar a que Supabase se cargue si aún no está disponible
        if (!window.supabase && window.supabaseLoaded !== true) {
            // Esperar un poco y reintentar
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (window.supabase) {
            supabaseClient = window.supabase;
            return supabaseClient;
        }
        
        // Si aún no está disponible, intentar cargarlo dinámicamente
        try {
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            supabaseClient = createClient(
                'https://augycbgsquurallcmzir.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Z3ljYmdzcXV1cmFsbGNtemlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjIzMzYsImV4cCI6MjA3ODUzODMzNn0.yNce0WIZiV3HWUUTxLxWSDSTVao-yTwCuoIbSjZc3a4'
            );
            window.supabase = supabaseClient;
            return supabaseClient;
        } catch (error) {
            console.error('Error cargando Supabase desde CDN:', error);
            throw error;
        }
    } else {
        // En Node.js (servidor), usar el cliente normal
        const module = await import('../../supabase/supabaseClient.js');
        supabaseClient = module.default;
        return supabaseClient;
    }
}

export class SucursalService {
    static async obtenerTodas() {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('sucursal')
            .select('*')
            .order('numero_sucursal');
        
        if (error) {
            return { data: null, error };
        }
        
        return { data, error: null };
    }

    static async obtenerPorId(numero_sucursal) {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('sucursal')
            .select('*')
            .eq('numero_sucursal', numero_sucursal)
            .single();
        
        if (error) {
            return { data: null, error };
        }
        
        return { data, error: null };
    }
}*/
/*import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class SucursalService {
    static async obtenerTodas() {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('sucursal')
                .select('*')
                .order('numero_sucursal');
            
            if (error) {
                console.error('Error al obtener sucursales:', error);
                return { data: [], error };
            }
            return { data, error: null };
        } catch (err) {
            console.error('Error en SucursalService.obtenerTodas:', err);
            return { data: [], error: err };
        }
    }

    static async obtenerPorId(numero_sucursal) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('sucursal')
                .select('*')
                .eq('numero_sucursal', numero_sucursal)
                .single();
            
            if (error) {
                console.error('Error al obtener sucursal:', error);
                return { data: null, error };
            }
            return { data, error: null };
        } catch (err) {
            console.error('Error en SucursalService.obtenerPorId:', err);
            return { data: null, error: err };
        }
    }
}*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class SucursalService {
    static async obtenerTodas() {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('sucursal')
                .select('*')
                .order('numero_sucursal');
            
            if (error) {
                console.error('Error al obtener sucursales:', error);
                return { data: [], error };
            }
            return { data, error: null };
        } catch (err) {
            console.error('Error en SucursalService.obtenerTodas:', err);
            return { data: [], error: err };
        }
    }

    static async obtenerPorId(numero_sucursal) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('sucursal')
                .select('*')
                .eq('numero_sucursal', numero_sucursal)
                .single();
            
            if (error) {
                console.error('Error al obtener sucursal:', error);
                return { data: null, error };
            }
            return { data, error: null };
        } catch (err) {
            console.error('Error en SucursalService.obtenerPorId:', err);
            return { data: null, error: err };
        }
    }
}