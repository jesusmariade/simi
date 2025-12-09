// src/services/MedicamentoService.js
import { getSupabase } from '../../supabase/supabaseClient.js';

export class MedicamentoService {
    static async obtenerTodos() {
        try {
            const sb = await getSupabase();
            const { data, error } = await sb
                .from('medicamento')
                .select('*')
                .order('nombre');
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async obtenerPorId(idMedicamento) {
        try {
            const sb = await getSupabase();
            const { data, error } = await sb
                .from('medicamento')
                .select('*')
                .eq('id_medicamento', idMedicamento)
                .single();
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
    static async obtenerPorFarmacia(idFarmacia) {
        try {
            const sb = await getSupabase();
            const { data, error } = await sb
                .from('inventario')
                .select(`
                    id_medicamento,
                    cantidad,
                    precio,
                    medicamento (
                        id_medicamento,
                        nombre,
                        descripcion,
                        precio
                    )
                `)
                .eq('id_farmacia', parseInt(idFarmacia));
            
            if (error) {
                return { data: null, error };
            }
            
            // Transformar los datos
            const medicamentos = data.map(item => ({
                id_medicamento: item.id_medicamento,
                nombre: item.medicamento.nombre,
                descripcion: item.medicamento.descripcion,
                precio: item.precio || item.medicamento.precio, //
                cantidad_stock: item.cantidad
            }));
            
            return { data: medicamentos, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}

