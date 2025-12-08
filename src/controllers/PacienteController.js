//cambio 1 prueba
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

import {PacienteService} from '../services/PacienteService.js';
import {Paciente} from '../models/Paciente.js';

export class PacienteController{
    //para cargar todos los pacientes en la tabla de pacientes pagina pacientes.html
    static async cargarPacientes() {
        try{
            /*const curp = localStorage.getItem("curpPaciente");*/
            const {data, error} = await PacienteService.obtenerPacientes();
            if (error){
                console.error('Error al cargar a los pacientes', error);
                return {pacientes: [], error};
            }
            if (!data || data.length == 0) {
                return {pacientes: [], error: null}
            }
            const pacientes = data.map(paciente => Paciente.fromJSON(paciente));
            return {pacientes, error: null};
        }
        catch(error){
            return{pacientes:null, error}
        }
    }
    //lista nos servira para editar paciente en pagina editarpacientes.html
    static async obtenerPacientesporCurp(curp){
        try{
           const{data, error} = await PacienteService.obtenerPacientesporCurp(curp)
           if(error){
            return{paciente:null, error}
           }
           return{paciente:data, error:null}
        }
        catch(error){
            return{paciente:null, error}
        }
        
    }
    //crear paciente en pagina agregarpacientes.html
    static async crearPaciente(paciente){
        try{//aqui no ocupamos sucursal
        //arreglo para acomodar datos
        const pacientes = {
            /*todos los datos a guardar*/
            curp: paciente.curp,
            ine: paciente.ine,
            nombre_completo: paciente.nombre_completo,
            direccion: paciente.direccion,
            edad: parseInt(paciente.edad),
            peso: parseFloat(paciente.peso),
            estatura: paciente.estatura,
            descripcion_deestado: paciente.descripcion_deestado,
        };
        const {data, error} = await PacienteService.agregarPaciente(pacientes)
        if(error){
           console.error('Error al agregar paciente',error)
            return{pacientes:null, error}
        }
        return{pacientes:data,error:null}
    }
    catch(error){
        console.error('Error:', error);
        return {pacientes: null, error};
    }
    }
    //actualizar datos del paciente
    static  async actualizarPaciente(curp,paciente){
        try{
            const pacientes = {
                curp: paciente.curp,
                ine: paciente.ine,
                nombre_completo: paciente.nombre_completo,
                direccion: paciente.direccion,
                edad: parseInt(paciente.edad),
                peso: parseFloat(paciente.peso),
                estatura: paciente.estatura,
                descripcion_deestado: paciente.descripcion_deestado,
            };
            const {data,error} = await PacienteService.actualizarPaciente(pacientes,curp);
            if(error){
              console.error('Error al actualizar paciente',error)
              return {pacientes:null,error}
            }
            return{pacientes:data,error:null}
        }
        catch(error){
            console.error('Error diomio',error)
            return{pacientes:null,error}
        }
    }
    // eliminar(bien hecho chuyo)
    //el q es god es god alo >:p
    static async eliminarPaciente(curp){
        try{
            const {success, error} = await PacienteService.eliminarPaciente(curp);
            if(error){
                console.error('Error al borrar al causa', error)
                return{success:false, error}
            }
            return{success:true, error:null}
        }
        catch(error){
            console.error('Error:', error)
            return{success:false, error}
        }
    }
    //funcion para actualizar el estado del paciente
    static async ActualizarEstado(curp,paciente){
    try{
        const {data, error} = await PacienteService.ActualizarEstado(curp,paciente);
        if (error) return { paciente: null, error };
        return { paciente: data, error: null };
    }
        catch(error){
        return { paciente: null, error };
        }
    }
    //funcion para estado
    static async obtenerEstadoPaciente(curp){
        try{
            const {data,error} = await PacienteService.obtenerEstadoPaciente(curp);
            if (error){
                return{paciente:null,error};
            }
            return{paciente:data,error:null}
            }
            catch(error){
                return{paciente:null,error};
            }
        }
    
}