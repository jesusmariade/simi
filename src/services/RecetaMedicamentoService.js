// src/services/RecetaMedicamentoService.js
import supabase from '../../supabase/supabaseClient.js';

export class RecetaMedicamentoService {

    // OBTENER medicamentos de una receta
    static async obtenerRecetaMedicamentoporid(id_receta) {
        try {
            const { data, error } = await supabase
            .from('receta_medicamento')
            .select(`
            id_receta,
            id_medicamento,
            cantidad,
            dosis,
            comprado,
            medicamento ( nombre )
            `)
            .eq('id_receta', id_receta);

            if (error) return { data: null, error };
            return { data, error: null };

        } catch (error) {
            return { data: null, error };
        }
    }

    // CREAR medicamento en receta
    static async crearRecetaMedicamento(info) {
        try {
            const { data, error } = await supabase
                .from('receta_medicamento')
                .insert(info)
                .select()
                .single();

            if (error) return { data: null, error };
            return { data, error: null };

        } catch (error) {
            return { data: null, error };
        }
    }

    // ACTUALIZAR medicamento
    static async actualizarRecetaMedicamento(id_receta, info) {
        try {
            const { data, error } = await supabase
                .from('receta_medicamento')
                .update(info)
                .eq('id_receta', id_receta)
                .select();

            if (error) return { data: null, error };
            return { data, error: null };

        } catch (error) {
            return { data: null, error };
        }
    }

    // BORRAR medicamento
    static async eliminarRecetaMedicamento(id_receta) {
        try {
            const { data, error } = await supabase
                .from('receta_medicamento')
                .delete()
                .eq('id_receta', id_receta);

            if (error) return { data: null, error };
            return { data, error: null };

        } catch (error) {
            return { data: null, error };
        }
    }
}
