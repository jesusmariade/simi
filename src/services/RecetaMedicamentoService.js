// src/services/RecetaMedicamentoService.js
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class RecetaMedicamentoService {

    // OBTENER medicamentos de una receta
    static async obtenerRecetaMedicamentoporid(id_receta) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('receta_medicamento')
                .select(`
                    id_receta,
                    id_medicamento,
                    cantidad,
                    dosis,
                    comprado,
                    medicamento (
                        nombre,
                        precio
                    )
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
        try {const supabase = await getSupabaseClient();
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
            const supabase = await getSupabaseClient();
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
            const supabase = await getSupabaseClient();
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
    //funcion para obtener medicamentos de una receta (para farmacia controller)
    static async obtenerMedicamentosDeReceta(idReceta){
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from ('receta_medicamento')
            .select(`
                *,
                medicamento: id_medicamento(
                nombre,
                descripcion,
                precio
                )
                `)
                .eq('id_receta',idReceta);
            if(error){
                return{data:null,error}
            }
            return{data,error:null};
        }
        catch(error){
            return{data:null,error}
        }
    }
    // Marca un registro receta_medicamento como comprado (true)
    static async marcarComoComprado(id_receta, id_medicamento) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('receta_medicamento')
            .update({ comprado: true })
            .eq('id_receta', id_receta)
            .eq('id_medicamento', id_medicamento)
            .select();

        if (error) return { data: null, error };
        return { data, error: null };

    } catch (error) {
        return { data: null, error };
    }
}

}
