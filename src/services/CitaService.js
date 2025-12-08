//src/services/CitaService.js

/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class CitaService{//funciones
    //obtener citas por paciente 
   //obtener citas por paciente CON DATOS DEL MÉDICO (para filtrar por sucursal)
    //funciones
    //obtener citas por paciente (SIN JOIN - se filtrará en el controller)
    /*static async obtenerCitasporPaciente(curp_paciente){
        try{
            const {data, error} = await supabase
            .from ('cita')
            .select ('*')
            .eq('curp_paciente', curp_paciente)
            .order('fecha')//que se ordene por fecha
            if(error){
                return {data:null, error};
            }
            return { data, error:null};
        }
        catch(error){
            return{data:null,error};
        }
    }*/

   static async obtenerCitasporPaciente(curp_paciente, numero_sucursal) {
    try {
        const supabase = await getSupabaseClient();
        const {data, error} = await supabase
            .from('cita')
            .select(`
                *,
                medico:codigo_medico (
                    nombre_completo,
                    numero_sucursal
                )
            `)
            .eq('curp_paciente', curp_paciente)
            .order('fecha');

        if (error) return {data:null, error};
        return {data, error:null};

    } catch (error) {
        return {data:null,error};
    }
}

    //obtenere citas por medico
    static async obtenerCitasporMedico(codigo_medico){
        try{
            const supabase = await getSupabaseClient();
            const {data, error} = await supabase
            .from ('cita')
            .select ('*')
            .eq('codigo_medico', codigo_medico)
            .order('fecha')//se organizen por fecha de la mas cercana a la actual espero
            if(error){
                return {data:null, error}
            }
            return {data, error:null}
        }
        catch(error){
            return{data:null, error}
        }
    }
    //crear cita
    static async crearCita(citaData){
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from ('cita')
            .insert({
                curp_paciente: citaData.curp_paciente,
                codigo_medico: citaData.codigo_medico,
                fecha: citaData.fecha,
                horario: citaData.horario,
                turno: citaData.turno,
                cancelada: citaData.cancelada
            })
            .select()
            .single()
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
        }
        catch(error){
            return{data:null,error}
        }
    }
    //funcion de obtener cita por id_cita(esta es para que funcione actualizar cita)
  static async obtenerCitaPorId(id_cita) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from("cita")
            .select("*")
            .eq("id_cita", id_cita)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

    //funcion para editar cita
    static async actualizarCita(citaData,id_cita){
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from('cita')
            .update({
                curp_paciente: citaData.curp_paciente,
                codigo_medico: citaData.codigo_medico,
                fecha: citaData.fecha,
                horario: citaData.horario,
                turno: citaData.turno,
                cancelada: citaData.cancelada
            })
            .eq('id_cita', id_cita)
            .select()
            .single()
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
        }
        catch(error){
            return{data:null,error}
        }
    }
    //funcion para eliminar  si tienen dudas me dicen jeje ya me voy (oka xdxdxd - ATTE: yo)(oki att.alo)
    static async eliminarcita(id_cita){
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from('cita')
            .delete()
            .eq('id_cita', id_cita);
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
            
        }
        catch(error){
            return{data:null,error}
        }
    }
    //funcion para cancelar cita
    static async cancelarCita(id_cita) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('cita')
            .update({ cancelada: true })
            .eq('id_cita', id_cita)
            .select()
            .single();

        if (error) return { data: null, error };
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
    }
    //funcion para reactivar cita
    static async reactivarCita(id_cita) {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('cita')
            .update({ cancelada: false })
            .eq('id_cita', id_cita)
            .select()
            .single();

        if (error) return { data: null, error };
        return { data, error: null };
     } 
     catch (error) {
        return { data: null, error };
        }
    }


}