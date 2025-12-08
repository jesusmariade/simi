import { getSupabaseClient } from '../../supabase/supabaseClient.js';

import {MedicoService} from '../services/MedicoService.js';
import {Medico} from '../models/Medico.js';

export class MedicoController{
    static async CargarMedicos(){
        try{
        const numero_sucursal = localStorage.getItem("numero_sucursal");
        const { data,error} = await MedicoService.obtenerMedicos(numero_sucursal);
        if(error){
            console.error('Error al cargar medicos', error);
            return {medicos: [], error};
        }
        if(!data || data.length == 0){
            return {medicos: [], error: null};
        }
        const medicos = data.map(medico => Medico.fromJSON(medico));
        return{medicos,error: null};
        }
        catch(error){
        console.error('algo salio mal:', error);
        return{medicos:[],error};
        }
    }
    static async obtenerMedicosporCodigo(codigo){
        try{
            const {data,error} = await MedicoService.obtenerMedicosporCodigo(codigo)
            if(error){
                return{medico:null, error};
            }
            return{medico:data, error:null};
        }
        catch(error){
            return{ medico:null, error};
        }
    }
    static async crearMedico(medicoData){
        try{
            //agregar sucursal??
            const numero_sucursal = localStorage.getItem('numero_sucursal');
            const medico = {
                codigo: parseInt(medicoData.codigo),
                curp:medicoData.curp,
                nombre_completo:medicoData.nombre_completo,
                edad:parseInt(medicoData.edad),
                telefono:medicoData.telefono,
                direccion:medicoData.direccion,
                especialidad:medicoData.especialidad,
                numero_sucursal: numero_sucursal,

            };
            const {data,error} = await MedicoService.CrearMedico(medico);
            if(error){
                console.error('Error al crear medico:', error);
                return {medico:null,error};
            }
            return{medico:data,error:null};
        } catch (error){
            console.error('Error:', error);
            return {medico: null, error};
        }
    }
    static async actualizarMedico(codigo,medicoData){
        try{
            const medico ={
                codigo: parseInt(medicoData.codigo),
                curp:medicoData.curp,
                nombre_completo:medicoData.nombre_completo,
                edad:parseInt(medicoData.edad),
                telefono:medicoData.telefono,
                direccion:medicoData.direccion,
                especialidad:medicoData.especialidad,
        };
        const {data,error} = await MedicoService.actualizarMedico(medico,codigo);
        if(error){
            console.error('Error al actualizar medico',error);
            return{medico:null,error};
        }
        return { medico:data,error:null};

    }catch(error){
        console.error('Error:',error);
        return{medico:null,error};
    }
}
    static async eliminarMedico(codigo){
        try{
            const { success, error } = await MedicoService.EliminarMedico(codigo);
        if(error){
            console.error('Error al eliminar',error)
            return{ success:false, error}
        }
        return { success:true, error:null}
    }catch(error){
        console.error('Error:',error)
        return { success:false, error}
    }
}
}