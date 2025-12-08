//src/services/LicenciaService.js
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';


export class LicenciaService {

    // Crear una nueva licencia
    static async crearLicencia(codigoMedico, fechaInicio, fechaFin) {
        try {
            const supabase = await getSupabaseClient();
            // Calculamos duracion
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            const diffMs = fin - inicio;
            const duracionDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))+1;

            const { data, error } = await supabase
                .from('licencia')
                .insert({
                    codigo_medico: parseInt(codigoMedico),
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    duracion_dias: duracionDias
                })
                .select()
                .single();

            if (error) return { data: null, error };

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
    //obtener licencias por medico
    static async ObtenerLicenciaPorMedico(codigo_medico){
        try{
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
            .from('licencia')
            .select('*')
            .eq('codigo_medico',codigo_medico)
            if(error){
                return{data:null,error};
            }
            return{data,error}
    }
    catch(error){
        return{data:null,error}
    }
}
    // Obtener todas las licencias
    static async obtenerLicencias() {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('licencia')
                .select('*')
                .order('id_licencia', { ascending: true });

            if (error) return { data: null, error };

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Obtener una licencia por ID
    static async obtenerLicenciaPorId(idLicencia) {
        try {
            const supabase = await getSupabaseClient();
            const { data, error } = await supabase
                .from('licencia')
                .select('*')
                .eq('id_licencia', parseInt(idLicencia))
                .single();

            if (error) return { data: null, error };

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Actualizar una licencia
    static async actualizarLicencia(idLicencia, datos) {
        try {
            const supabase = await getSupabaseClient();
            let { fecha_inicio, fecha_fin } = datos;

            // Recalcular duración si cambian fechas
            if (fecha_inicio && fecha_fin) {
                const diffMs = new Date(fecha_fin) - new Date(fecha_inicio);
                datos.duracion_dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))+1;
            }

            const { data, error } = await supabase
                .from('licencia')
                .update(datos)
                .eq('id_licencia', parseInt(idLicencia))
                .select()
                .single();

            if (error) return { data: null, error };

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Eliminar una licencia
    static async eliminarLicencia(idLicencia) {
        try {
            const supabase = await getSupabaseClient();
            const { error } = await supabase
                .from('licencia')
                .delete()
                .eq('id_licencia', parseInt(idLicencia));

            if (error) return { success: false, error };

            return { success: true, error: null };
        } catch (error) {
            return { success: false, error };
        }
    }
}