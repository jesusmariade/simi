// src/services/VentaMedicamentoService.js
<<<<<<< HEAD
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
=======
import { getSupabase } from '../../supabase/supabaseClient.js';
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06

export class VentaMedicamentoService {
    static async agregarMedicamentoAVenta(idVenta, idMedicamento, cantidad, precioUnitario, subtotal) {
        try {
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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