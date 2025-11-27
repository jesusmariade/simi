import { CitaService } from "../services/CitaService.js";
import { MedicoService } from "../services/MedicoService.js";
import {cita} from "../models/Cita.js"

export class CitaController{
    //cargar cita por id (me falto pipipi)
    static async obtenerCitaPorId(id_cita){
        try{
            const {data,error} = await CitaService.obtenerCitaPorId(id_cita);
            if(error){
                return{cita:null,error}
            }
            return{cita:data,error:null}
        }
        catch(error){
            return{cita:null,error}
        }
    }
    //controlador para cargar citas
    static async CargarCitasporpaciente(curp_paciente, numero_sucursal){
    try {
        const {data: citas, error} = await CitaService.obtenerCitasporPaciente(curp_paciente, numero_sucursal);

        if (error) return {cita:null, error};

        const citasFiltradas = citas.filter(c =>
            c.medico && c.medico.numero_sucursal == numero_sucursal
        );

        return {cita: citasFiltradas, error:null};

    } catch(error) {
        return {cita:null,error};
    }
}


    //cargar citas por medico
    static async CargarCitaspormedico(codigo_medico){
        try{
            const {data,error} = await CitaService.obtenerCitasporMedico(codigo_medico);
            if(error){
                return{cita:null,error}
            }
            return{cita:data,error:null}
        }
        catch(error){
            return{cita:null,error}
        }
    }
    //crear paciente
    static async crearCita(citaData){
        try{
            const cita = {
                curp_paciente:citaData.curp_paciente,
                codigo_medico:citaData.codigo_medico,
                fecha:citaData.fecha,
                horario:citaData.horario,
                turno:citaData.turno,
                cancelada:citaData.cancelada,
            };
            const {data,error} = await CitaService.crearCita(cita);
            if(error){
                return{cita:null,error};
            }
            return{cita:data,error:null};
        }
        catch(error){
            return{cita:null,error};
        }
    }
    //actualizar paciente
    static async actualizarCita(id_cita,citaData){
        try{
            const cita = {
                
                curp_paciente:citaData.curp_paciente,
                codigo_medico:citaData.codigo_medico,
                fecha:citaData.fecha,
                horario:citaData.horario,
                turno:citaData.turno,
                cancelada:citaData.cancelada,
            };
            const {data,error} = await CitaService.actualizarCita(cita,id_cita);
            if(error){
                return{cita:null,error}
            }
            return{cita:data,error}
        }
        catch(error){
            return{cita:null,error}
        }
    }
    //eliminar cita
    static async eliminarCita(id_cita){
        try{
            const {success,error} = await CitaService.eliminarcita(id_cita)
            if(error){
                console.error('error al eliminar',error)
                return{success:false,error}
            }
            return{success:true,error:null}
        }
        catch(error){
            console.error('Error:',error)
            return{success:false,error}
        }
    }
    //funcion para cancelar cita
    static async cancelarCita(id_cita){
    try{
        const {data, error} = await CitaService.cancelarCita(id_cita);
        if (error) return { cita: null, error };
        return { cita: data, error: null };
    }
        catch(error){
        return { cita: null, error };
        }
    }

    //funcion para reactivar cita
    static async reactivarCita(id_cita){
    try{
        const {data,error} = await CitaService.reactivarCita(id_cita);
        if (error) return { cita:null, error }
        return { cita:data, error:null }
    }
        catch(error){
        return { cita:null, error }
        }
    }

}