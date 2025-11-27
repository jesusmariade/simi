import { LicenciaService } from "../services/LicenciaService.js";
import { Licencia } from "../models/Licencia.js";

export class LicenciaController {
    static async CargarLicenciaPorMedico(codigo_medico) {
        try {
            const { data, error } = await LicenciaService.ObtenerLicenciaPorMedico(codigo_medico);

            if (error) {
                console.error('Error al cargar las licencias', error);
                return { licencia: null, error };
            }

            return { licencia: data, error: null };
        } catch (error) {
            return { licencia: null, error };
        }
    }
    static async CargarLicencia() {
        try {
            const { data, error } = await LicenciaService.obtenerLicencias();

            if (error) {
                console.error('Error al cargar las licencias', error);
                return { licencia: null, error };
            }

            return { licencia: data, error: null };
            console.log("Enviando a Supabase:", licenciaData);
            console.log("Respuesta Supabase (insert):", data, error);

        } catch (error) {
            return { licencia: null, error };
        }
    }
    static async CrearLicencia(licenciaData) {
        try {
            const licencia = {
                id_licencia: licenciaData.id_licencia,
                codigo_medico: licenciaData.codigo_medico,
                fecha_inicio: licenciaData.fecha_inicio,
                fecha_fin: licenciaData.fecha_fin,
                duracion_dias: licenciaData.duracion_dias
            };

            const { data, error } = await LicenciaService.crearLicencia(
                licencia.codigo_medico,
                licencia.fecha_inicio,
                licencia.fecha_fin
            );

            if (error) {
                console.error('Error al crear la licencia', error);
                return { licencia: null, error };
            }

            return { licencia: data, error: null };
        } catch (error) {
            return { licencia: null, error };
        }
    }
    static async actualizarLicencia(id_licencia, licenciaData) {
        try {
            const licencia = {
                id_licencia: licenciaData.id_licencia,
                codigo_medico: licenciaData.codigo_medico,
                fecha_inicio: licenciaData.fecha_inicio,
                fecha_fin: licenciaData.fecha_fin,
                duracion_dias: licenciaData.duracion_dias
            };

            const { data, error } = await LicenciaService.actualizarLicencia(id_licencia, licencia);

            if (error) {
                console.error('Error al actualizar la licencia', error);
                return { licencia: null, error };
            }

            return { licencia: data, error: null };
        } catch (error) {
            return { licencia: null, error };
        }
    }
    static async CargarLicenciaPorID(id_licencia) {
    try {
        const { data, error } = await LicenciaService.obtenerLicenciaPorId(id_licencia);

        if (error) {
            console.error('Error al cargar la licencia por ID', error);
            return { licencia: null, error };
        }

        return { licencia: data, error: null };
    } catch (error) {
        return { licencia: null, error };
    }
}
    static async eliminarLicencia(id_licencia) {
        try {
            const { success, error } = await LicenciaService.eliminarLicencia(id_licencia);

            if (error) {
                console.error('No se pudo eliminar la licencia', error);
                return { success: false, error };
            }

            return { success: true, error: null };
        } catch (error) {
            return { success: false, error };
        }
    }
}