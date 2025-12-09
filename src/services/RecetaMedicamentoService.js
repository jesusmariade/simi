// src/services/RecetaMedicamentoService.js
<<<<<<< HEAD
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
=======
import { getSupabase } from '../../supabase/supabaseClient.js';
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06

export class RecetaMedicamentoService {

    // OBTENER medicamentos de una receta
    static async obtenerRecetaMedicamentoporid(id_receta) {
        try {
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        try {const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
        try {
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
