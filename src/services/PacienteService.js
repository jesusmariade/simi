//src/services/PacienteService.js
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class PacienteService {
    //obtiene pacientes en general
    static async obtenerPacientes() {
    try{
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
        .from('paciente')
        .select('*');
        if (error) {
            return { data: null, error };
        }
        return { data, error: null };
    }
    catch (error) {
    return { data: null, error };
    }
    }
    //obtener solo pacientes por curp
    static async obtenerPacientesporCurp(curp){
        try{
            const supabase = await getSupabaseClient();
           const {data,error} = await supabase
           .from('paciente')
           .select('*')
           .eq('curp',curp)//se optiene por curp
           .single();//un solo paciente
           if(error){
            return{data:null, error}
           }
           return{data, error:null}
        }
        catch(error){
            return{data:null,error}
        }
    }
    //agregas los pacientes
     static async agregarPaciente(paciente) {
       try{ 
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
            .from('paciente')
            .insert({
                curp: paciente.curp,
                ine: paciente.ine,
                nombre_completo: paciente.nombre_completo,
                direccion: paciente.direccion,
                edad: paciente.edad,
                peso: paciente.peso,
                estatura: paciente.estatura,
                descripcion_deestado: paciente.descripcion_deestado,
            })
            .select()
            .single();
        if (error) {
            return { data: null, error };
        }
        return { data, error: null };
    }
        catch (error) {
        return { data: null, error };
        }
    }
    //actualiza datos de los pacientes
    static async actualizarPaciente(paciente, curp) {
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from('paciente')
            .update({
                curp: paciente.curp,
                ine: paciente.ine,
                nombre_completo: paciente.nombre_completo,
                direccion: paciente.direccion,
                edad: paciente.edad,
                peso: paciente.peso,
                estatura: paciente.estatura,
                descripcion_deestado: paciente.descripcion_deestado,
            })
            .eq('curp', curp)
            .select()
            .single()
        if (error) {
            return { data: null, error };
        }
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
    }
    //elimina los pacientes dah
    static async eliminarPaciente(curp) {
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from('paciente')
            .delete()
            .eq('curp', curp)
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
    //ver solo el estado del paciente

    //actualizar solo estado del paciente(funcion se usara en 2 partes)
     static async ActualizarEstado(curp,paciente) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('paciente')
            .update({
                descripcion_deestado: paciente.descripcion_deestado, 

            })
            .eq('curp', curp)
            .select()
            .single();

        if (error) return { data: null, error };
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
    }
    static async obtenerEstadoPaciente(curp) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('paciente')
            .select('descripcion_deestado, nombre_completo')
            .eq('curp', curp)
            .single();

        if (error) return { data: null, error };
        return { data, error: null };

    } catch (error) {
        return { data: null, error };
    }
}


}