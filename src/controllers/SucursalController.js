/*// src/controllers/SucursalController.js
import { SucursalService } from '../services/SucursalService.js';
import { Sucursal } from '../models/Sucursal.js';

// Cliente de Supabase que funciona en navegador y Node.js
let supabaseClient = null;

async function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
        // Esperar a que Supabase se cargue si aún no está disponible
        if (!window.supabase && window.supabaseLoaded !== true) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (window.supabase) {
            supabaseClient = window.supabase;
            return supabaseClient;
        }
        
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
        // En Node.js, usar el cliente normal
        const module = await import('../../supabase/supabaseClient.js');
        supabaseClient = module.default;
        return supabaseClient;
    }
}

export class SucursalController {
    static async cargarSucursales() {
        try {
            const { data, error } = await SucursalService.obtenerTodas();
            
            if (error) {
                console.error('Error al cargar sucursales:', error);
                return { sucursales: [], error };
            }
            
            if (!data || data.length === 0) {
                return { sucursales: [], error: null };
            }
            
            const sucursales = data.map(sucursal => Sucursal.fromJSON(sucursal));
            return { sucursales, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { sucursales: [], error };
        }
    }

    static renderizarSucursales(sucursales, container) {
        if (!sucursales || sucursales.length === 0) {
            container.innerHTML = '<p>No hay sucursales disponibles</p>';
            return;
        }

        container.innerHTML = sucursales.map(sucursal => `
            <div class="sucursal-card" 
                    data-sucursal-id="${sucursal.numero_sucursal}"
                    data-sucursal-nombre="${sucursal.nombre || 'Sucursal ' + sucursal.numero_sucursal}">
                <p class="sucursal-id">Sucursal ${sucursal.numero_sucursal}</p>
                <p class="sucursal-nombre">${sucursal.nombre || ''}</p>
                <p class="sucursal-direccion">${sucursal.direccion || ''}</p>
            </div>
        `).join('');

        document.querySelectorAll('.sucursal-card').forEach(card => {
            card.addEventListener('click', function() {
                const sucursalId = this.getAttribute('data-sucursal-id');
                const sucursalNombre = this.getAttribute('data-sucursal-nombre'); // 
                SucursalController.seleccionarSucursal(sucursalId, sucursalNombre); // 
            });
        });
    }

    static async seleccionarSucursal(sucursalId, sucursalNombre) {
        localStorage.setItem('sucursalId', sucursalId);
        localStorage.setItem('sucursalNombre', sucursalNombre);

        const supabase = await getSupabaseClient();
        const { data: farmacia, error } = await supabase
            .from('farmacia')
            .select('id_farmacia')
            .eq('n_sucursal', parseInt(sucursalId))
            .limit(1)
            .single();
        
        if (!error && farmacia) {
            localStorage.setItem('idFarmacia', farmacia.id_farmacia.toString());
        } else {
            localStorage.setItem('idFarmacia', '1');
        }
        console.log('Sucursal seleccionada:', sucursalId, sucursalNombre);
        
        window.location.href = 'bienvenido.html';
    }

    static async inicializar() {
        const container = document.getElementById('sucursales-container');
        if (!container) return;

        const { sucursales, error } = await SucursalController.cargarSucursales();
        
        if (error) {
            container.innerHTML = '<p>Error al cargar las sucursales</p>';
            return;
        }
        SucursalController.renderizarSucursales(sucursales, container);
    }
}*/
import { SucursalService } from '../services/SucursalService.js';
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
import { Sucursal } from '../models/Sucursal.js';

export class SucursalController {
    static async cargarSucursales() {
        try {
            const { data, error } = await SucursalService.obtenerTodas();
            
            if (error) {
                console.error('Error al cargar sucursales:', error);
                return { sucursales: [], error };
            }
            
            if (!data || data.length === 0) {
                return { sucursales: [], error: null };
            }
            
            const sucursales = data.map(sucursal => Sucursal.fromJSON(sucursal));
            return { sucursales, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { sucursales: [], error };
        }
    }

    static renderizarSucursales(sucursales, container) {
        if (!sucursales || sucursales.length === 0) {
            container.innerHTML = '<p>No hay sucursales disponibles</p>';
            return;
        }

        container.innerHTML = sucursales.map(sucursal => `
            <div class="sucursal-card" 
                    data-sucursal-id="${sucursal.numero_sucursal}"
                    data-sucursal-nombre="${sucursal.nombre || 'Sucursal ' + sucursal.numero_sucursal}">
                <p class="sucursal-id">Sucursal ${sucursal.numero_sucursal}</p>
                <p class="sucursal-nombre">${sucursal.nombre || ''}</p>
                <p class="sucursal-direccion">${sucursal.direccion || ''}</p>
            </div>
        `).join('');

        document.querySelectorAll('.sucursal-card').forEach(card => {
            card.addEventListener('click', function() {
                const sucursalId = this.getAttribute('data-sucursal-id');
                const sucursalNombre = this.getAttribute('data-sucursal-nombre');
                SucursalController.seleccionarSucursal(sucursalId, sucursalNombre);
            });
        });
    }

    static async seleccionarSucursal(sucursalId, sucursalNombre) {
        localStorage.setItem('sucursalId', sucursalId);
        localStorage.setItem('sucursalNombre', sucursalNombre);

        try {
            const supabase = await getSupabaseClient();
            const { data: farmacia, error } = await supabase
                .from('farmacia')
                .select('id_farmacia')
                .eq('n_sucursal', parseInt(sucursalId))
                .limit(1)
                .single();
            
            if (!error && farmacia) {
                localStorage.setItem('idFarmacia', farmacia.id_farmacia.toString());
            } else {
                localStorage.setItem('idFarmacia', '1');
            }
        } catch (err) {
            console.error('Error al seleccionar sucursal:', err);
            localStorage.setItem('idFarmacia', '1');
        }
        
        console.log('Sucursal seleccionada:', sucursalId, sucursalNombre);
        window.location.href = 'bienvenido.html';
    }

    static async inicializar() {
        const container = document.getElementById('sucursales-container');
        if (!container) return;

        const { sucursales, error } = await SucursalController.cargarSucursales();
        
        if (error) {
            container.innerHTML = '<p>Error al cargar las sucursales</p>';
            return;
        }
        SucursalController.renderizarSucursales(sucursales, container);
    }
}