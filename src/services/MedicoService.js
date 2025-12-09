//src/services/MedicoService.js
import { getSupabase } from "../../supabase/supabaseClient.js";

export class MedicoService{
    static async obtenerMedicos(numero_sucursal){
        try{
            const sb = await getSupabase();
            const {data, error} = await sb
            .from ("medico")
            .select("*")
            .eq("numero_sucursal", numero_sucursal)
            .order ("nombre_completo");
            if(error){
                return{data:null, error};
            }
            return{data, error: null};
        }
        catch(error){
            return{data:null,error};
        }
    }
    static async CrearMedico(medicoData){
        try{
            const sb = await getSupabase();
            const{ data,error} =await sb
            .from('medico')
            .insert({
                codigo: medicoData.codigo,
                curp: medicoData.curp,
                nombre_completo: medicoData.nombre_completo,
                edad: medicoData.edad,
                telefono: medicoData.telefono,
                direccion: medicoData.direccion,
                especialidad: medicoData.especialidad,
                numero_sucursal: medicoData.numero_sucursal,
            })
            .select()
            .single();
        if(error){
            return{data: null,error};
        }
        return{data, error: null};
        } catch(error){
            return{data:null, error};
        }
    }
    //se usara para editar los datos del medico con ese codigo
    static async obtenerMedicosporCodigo(codigo){
        try{   
            const sb = await getSupabase();
            const {data,error} = await sb
            .from('medico')
            .select('*')
            .eq('codigo',codigo)//para buscar medico exacto
            .single();//solo un medico
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
        }
        catch(error){
            return{data:null,error}
        }
    }
    static async actualizarMedico(medicoData,codigo){
        try{
            const sb = await getSupabase();
            const {data,error} = await sb
            .from('medico')
            .update({
                codigo: medicoData.codigo,
                curp: medicoData.curp,
                nombre_completo: medicoData.nombre_completo,
                edad: medicoData.edad,
                telefono: medicoData.telefono,
                direccion: medicoData.direccion,
                especialidad: medicoData.especialidad,
                numero_sucursal: medicoData.numero_sucursal
            })
            .eq('codigo',codigo)
            .select()
            .single();
            if(error){
                return{data:null,error}
            }
            return{data,error:null}
        }
        catch{
            return{data:null, error}
        }
    }
    static async EliminarMedico(codigo){
        try{ 
            const sb = await getSupabase();
        const { data, error } = await sb
            .from('medico')//desde medico
            .delete()//borrar
            .eq('codigo',codigo);//que seleccione solo los que sean igualitos al valor
        
            if(error){//si error regresar que no fue success
                return{success: false,error };
            }
            return { success:true, error: null};//si no error vacio y success true
        }
        catch (error){
            return {success:false, error};//atrapar el error 
        }

    }
   
}