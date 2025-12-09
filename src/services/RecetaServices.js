// src/services/RecetaService.js
<<<<<<< HEAD
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
=======
import { getSupabase } from '../../supabase/supabaseClient.js';
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
export class RecetaService {
    // Crear una nueva receta asociada a una cita ahora vamos a crear el controlador y nuestro modelo 
    static async crearReceta(idCita) {
        try {
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
=======
            const sb = await getSupabase();
            const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
                .from('receta')
                .insert({
                    id_cita: parseInt(idCita),
                    fecha_expedicion: new Date().toISOString().split('T')[0],
                    surtida: false
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
    // Agregar un medicamento a una receta noooooo guardaaa las recetaaas aaaaaaaaaaaa
static async agregarMedicamentoAReceta(idReceta, idMedicamento, cantidad, dosis, comprado) {
<<<<<<< HEAD
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        try {
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta_medicamento')
            .insert({
                id_receta: idReceta,
                id_medicamento: idMedicamento,
                cantidad: cantidad,
                dosis: dosis || null,
                comprado: comprado,
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
//parte para obtener receta a traves de la id de la cita
    static async obtenerRecetaporId(id_cita){
        try{
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta')
            .select('*')
            .eq('id_cita',id_cita)
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
        }
        catch(error){

        }
    }
//funcion para surtir receta con el boton
    static async SurtirReceta(id_receta){
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta')
            .update({ surtida: true })
            .eq('id_receta', id_receta)
            .select()
            .single();

        if (error) return { data: null, error };
        return { data, error: null };
    }
    //para editar
   static async obtenerRecetaporCita(id_cita) {
    try {
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data: receta, error } = await supabase
=======
        const sb = await getSupabase();
        const { data: receta, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta')
            .select(`
                id_receta,
                receta_medicamento (
                    id_receta,
                    id_medicamento,
                    cantidad,
                    dosis,
                    comprado,
                    medicamento (nombre, precio)
                )
            `)
            .eq('id_cita', id_cita)
            .maybeSingle();  // ← cambia .single() por esto

        if (error) return { data: null, error };

        return { data: receta, error: null };
    }
    catch (error) {
        return { data: null, error };
    }
}

// Actualizar medicamento en la receta
// Actualizar medicamento en la receta usando la PK compuesta
static async actualizarMedicamentoReceta(idReceta, idMedicamentoOld, idMedicamentoNew, cantidad, dosis) {
    try {
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta_medicamento')
            .update({
                id_medicamento: idMedicamentoNew,
                cantidad,
                dosis
            })
            .eq('id_receta', idReceta)
            .eq('id_medicamento', idMedicamentoOld)
            .select()
            .single();

        if (error) return { data: null, error };
        return { data, error: null };

    } catch (error) {
        return { data: null, error };
    }
}


// Eliminar medicamento de receta (llave compuesta)
static async eliminarMedicamentoReceta(id_receta, id_medicamento) {
    try {
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { error } = await supabase
=======
        const sb = await getSupabase();
        const { error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
            .from('receta_medicamento')
            .delete()
            .eq('id_receta', id_receta)
            .eq('id_medicamento', id_medicamento);

        return { error };
    } catch (error) {
        return { error };
    }
}

}