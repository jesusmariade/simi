/*creamos tambien nuestro servicio a qui es donde va a hashear las contraseñas 
va a verificar las contraseñas busca el usuario 
 retorna si es valido 
 y correspondiente a el tipo de usuario a y crear un nuevo usuario tambien */ 
/* se cambio import supabase from por {getSupabaseClient}*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';
import { Usuario } from "../models/Usuario.js";

export class AuthService {
    
    //verificamos la contraseña del usuario 
    static async verificarPassword(password, hash){
        return new Promise(async (resolve) => {
            try {
                const supabase = await getSupabaseClient();
                if (typeof window !== 'undefined' && window.bcryptjsLoaded) {
                    await window.bcryptjsLoaded;
                }
                
                let bcryptLib = null;
                
                if (typeof window !== 'undefined') {
                    if (window.bcryptjs && window.bcryptjs.compareSync) {
                        bcryptLib = window.bcryptjs;
                    } else if (window.bcrypt && window.bcrypt.compareSync) {
                        bcryptLib = window.bcrypt;
                    } else if (window.dcodeIO && window.dcodeIO.bcrypt && window.dcodeIO.bcrypt.compareSync) {
                        bcryptLib = window.dcodeIO.bcrypt;
                    }
                }
                
                if (!bcryptLib) {
                    if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt && dcodeIO.bcrypt.compareSync) {
                        bcryptLib = dcodeIO.bcrypt;
                    } else if (typeof bcryptjs !== 'undefined' && bcryptjs.compareSync) {
                        bcryptLib = bcryptjs;
                    } else if (typeof bcrypt !== 'undefined' && bcrypt.compareSync) {
                        bcryptLib = bcrypt;
                    }
                }
                
                if (bcryptLib && bcryptLib.compareSync) {
                    const resultado = bcryptLib.compareSync(password, hash);
                    console.log('Verificación de password:', { password: password.substring(0, 1) + '***', hashLength: hash.length, resultado });
                    resolve(resultado);
                } else {
                    console.error('bcryptjs no está disponible después de esperar.');
                    console.log('Variables disponibles:', { 
                        window: typeof window,
                        window_bcryptjs: typeof window !== 'undefined' ? typeof window.bcryptjs : 'undefined',
                        window_dcodeIO: typeof window !== 'undefined' ? typeof window.dcodeIO : 'undefined',
                        dcodeIO: typeof dcodeIO,
                        bcryptjs: typeof bcryptjs,
                        bcrypt: typeof bcrypt
                    });
                    resolve(false);
                }
            } catch (error) {
                console.error('Error al verificar password:', error);
                resolve(false);
            }
        });
    }

//iniciamos sesion 
static async iniciarSesion(email, password){
 try {
    const supabase = await getSupabaseClient();
    console.log('Intentando iniciar sesión con email:', email);
    
    //buscarel usuario por email 
    const {data: UsuarioData, error} = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("activo", true)
    .single();

    console.log('Respuesta de Supabase:', { UsuarioData, error });

//error 
    if (error || !UsuarioData){
        console.error('Error al buscar usuario:', error);
        return {usuario: null, error: { message: "Email o contraseña incorrectos" }};
    }

    console.log('Usuario encontrado, verificando contraseña...');
// error verificacion 
const passwordValido = await this.verificarPassword(password, UsuarioData.password_hash);
console.log('Password válido:', passwordValido);

if (!passwordValido){
    console.error('Contraseña inválida');
    return {usuario: null, error: { message: "Email o contraseña incorrectos" }};
 }

 //creamos instancia de usaurio 
 const usuario = new Usuario(UsuarioData);

 return {usuario, error: null};
} catch (error){
    return {usuario: null, error: {message: "Error al iniciar sesion", details: error}};
}
}

//OBTENEMOS EL USUARIO POR EL id        
static async obtenerUsuarioPorId(id){
    try{
        const supabase = await getSupabaseClient();
        const {data: UsuarioData, error} = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .eq("activo", true)
    .single();

    if (error || !UsuarioData){
        return{ usuario: null, error}
    }
    return {usuario: new Usuario(UsuarioData), error: null };
    }catch (error){
        return{ usuario: null, error };
    }
}

//metodo para crear el nuevo usuario 
static async crearUsuario(usuarioData){
    try {
        const supabase = await getSupabaseClient();
        if (typeof window !== 'undefined' && window.bcryptjsLoaded) {
            await window.bcryptjsLoaded;
        }

        let bcryptLib = null;
        
        if (typeof window !== 'undefined') {
            if (window.bcryptjs && window.bcryptjs.hashSync) {
                bcryptLib = window.bcryptjs;
            } else if (window.bcrypt && window.bcrypt.hashSync) {
                bcryptLib = window.bcrypt;
            } else if (window.dcodeIO && window.dcodeIO.bcrypt && window.dcodeIO.bcrypt.hashSync) {
                bcryptLib = window.dcodeIO.bcrypt;
            }
        }
        
        if (!bcryptLib) {
            if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt && dcodeIO.bcrypt.hashSync) {
                bcryptLib = dcodeIO.bcrypt;
            } else if (typeof bcryptjs !== 'undefined' && bcryptjs.hashSync) {
                bcryptLib = bcryptjs;
            } else if (typeof bcrypt !== 'undefined' && bcrypt.hashSync) {
                bcryptLib = bcrypt;
            }
        }

        if (!bcryptLib || !bcryptLib.hashSync) {
            return { usuario: null, error: { message: 'Error: bcryptjs no está disponible' } };
        }

        const passwordHash = bcryptLib.hashSync(usuarioData.password, 10);

        const {data, error} = await supabase 
            .from('usuarios')
            .insert({
                email: usuarioData.email,
                password_hash: passwordHash,
                tipo_usuario: usuarioData.tipo_usuario,
                id_relacionado: usuarioData.id_relacionado || null,
                activo: true
            }) 
            .select()
            .single();
    
        if (error){
            return { usuario: null, error };
        }
        return { usuario: new Usuario(data), error: null };

    } catch (error) {
        return { usuario: null, error: { message: 'Error al crear usuario', details: error } };
    }
}
}