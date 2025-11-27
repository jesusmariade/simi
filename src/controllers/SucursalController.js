// src/controllers/SucursalController.js
import { SucursalService } from '../services/SucursalService.js';
import supabase from '../../supabase/supabaseClient.js';
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
                const sucursalNombre = this.getAttribute('data-sucursal-nombre'); // 
                SucursalController.seleccionarSucursal(sucursalId, sucursalNombre); // 
            });
        });
    }

    
static async seleccionarSucursal(sucursalId, sucursalNombre) 
{    localStorage.setItem('sucursalId', sucursalId);   
        localStorage.setItem('sucursalNombre', sucursalNombre);

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
}