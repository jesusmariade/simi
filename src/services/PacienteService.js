//src/services/PacienteService.js
<<<<<<< HEAD
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
=======
import { getSupabase } from '../../supabase/supabaseClient.js';
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06

export class PacienteService {
    //obtiene pacientes en general
    static async obtenerPacientes() {
    try{
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        try{
            const supabase = await getSupabaseClient();
           const {data,error} = await supabase
           .from('paciente')
=======
          try{
              const sb = await getSupabase();
              const {data,error} = await sb
              .from('paciente')
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
       try{ 
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
            .from('paciente')
            .insert({
=======
      try{ const sb = await getSupabase(); const { data, error } = await sb
          .from('paciente')
          .insert({
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
=======
        const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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