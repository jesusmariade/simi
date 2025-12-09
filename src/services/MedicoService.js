//src/services/MedicoService.js
<<<<<<< HEAD
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
=======
import { getSupabase } from "../../supabase/supabaseClient.js";
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06

export class MedicoService{
    static async obtenerMedicos(numero_sucursal){
        try{
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data, error} = await supabase
            .from ('medico')
            .select ('*')/*todos los campos*/
            .eq('numero_sucursal',numero_sucursal)
            .order('nombre_completo');//se ordenan por nombre
=======
            const sb = await getSupabase();
            const {data, error} = await sb
            .from ("medico")
            .select("*")
            .eq("numero_sucursal", numero_sucursal)
            .order ("nombre_completo");
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const{ data,error} =await supabase
=======
            const sb = await getSupabase();
            const{ data,error} =await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
        try{  
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
        try{   
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {data,error} = await supabase
=======
            const sb = await getSupabase();
            const {data,error} = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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
<<<<<<< HEAD
            const supabase = await getSupabaseClient();
            const {error} = await supabase
=======
            const sb = await getSupabase();
        const { data, error } = await sb
>>>>>>> 7e50ab2d024fdc0d096947f9c7091498c8e1de06
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