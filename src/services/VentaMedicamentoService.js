// src/services/VentaMedicamentoService.js
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class VentaMedicamentoService {
    static async agregarMedicamentoAVenta(idVenta, idMedicamento, cantidad, precioUnitario, subtotal) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('venta_medicamento')
                .insert({
                    id_venta: idVenta,
                    id_medicamento: idMedicamento,
                    cantidad: cantidad,
                    precio_unitario: precioUnitario,
                    subtotal: subtotal
                })
                .select()
                .single();
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
    
    static async obtenerMedicamentosDeVenta(idVenta) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('venta_medicamento')
                .select(`
                    *,
                    medicamento (
                        id_medicamento,
                        nombre,
                        descripcion,
                        precio
                    )
                `)
                .eq('id_venta', idVenta);
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}