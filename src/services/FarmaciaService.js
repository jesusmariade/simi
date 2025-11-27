// src/services/FarmaciaService.js
import supabase from '../../supabase/supabaseClient.js';


export class FarmaciaService {
    static async obtenerRecetas(idFarmacia = null) {
        try {
            let query = supabase
                .from('receta')
                .select(`
                    *,
                    cita (
                        curp_paciente,
                        codigo_medico,
                        medico:codigo_medico (
                            numero_sucursal
                        ),
                        paciente:curp_paciente (
                            nombre_completo
                        )
                    )
                `)
                .order('fecha_expedicion', { ascending: false });
            
            //Si hay idFarmacia, obtener la sucursal y filtrar
          //Si hay idFarmacia, obtener la sucursal y filtrar
if (idFarmacia) {
    // Obtener la sucursal de la farmacia
    const { data: farmacia } = await supabase
        .from('farmacia')
        .select('n_sucursal')
        .eq('id_farmacia', parseInt(idFarmacia))
        .single();
    
    if (farmacia) {
        // Obtener los códigos de médicos de esta sucursal
        const { data: medicos } = await supabase
            .from('medico')
            .select('codigo')
            .eq('numero_sucursal', farmacia.n_sucursal);
        
        if (medicos && medicos.length > 0) {
            const codigosMedicos = medicos.map(m => m.codigo);
            
            // Obtener las citas de esos médicos
            const { data: citas } = await supabase
                .from('cita')
                .select('id_cita')
                .in('codigo_medico', codigosMedicos);
            
            if (citas && citas.length > 0) {
                const idsCitas = citas.map(c => c.id_cita);
                // Filtrar recetas por esas citas
                query = query.in('id_cita', idsCitas);
            } else {
                // Si no hay citas, retornar array vacío
                return { data: [], error: null };
            }
        } else {
            // Si no hay médicos en esta sucursal, retornar array vacío
            return { data: [], error: null };
        }
    }
}
            
            const { data, error } = await query;
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

static async surtirReceta(idReceta) {
    try {
        const { data, error } = await supabase
            .from('receta')
            .select('*')
            .eq('id_receta', idReceta)
            .single();
        
        if (error) {
            return { success: false, error };
        }
        
        if (data.surtida === true) {
            return { success: false, error: { message: 'Receta ya surtida' } };
        }
        
        const { data: medicamentos, error: errorMedicamentos } = await this.obtenerMedicamentosdeRecetas(idReceta);

        if (errorMedicamentos || !medicamentos || medicamentos.length === 0) {
            return { success: false, error: errorMedicamentos || { message: 'No hay medicamentos en la receta' } };
        }
        
        const idFarmacia = localStorage.getItem('idFarmacia') || 1;

        for (const medicamento of medicamentos) {
            const total = medicamento.precio * medicamento.cantidad;
            
            const ventaData = {
                id_farmacia: parseInt(idFarmacia),
                id_medicamento: medicamento.id_medicamento,
                fecha_venta: new Date().toISOString().split('T')[0],
                total: total,
                tipo: 'receta'
            };
            
            const { error: errorVenta } = await this.crearVenta(ventaData);
            
            if (errorVenta) {
                return { success: false, error: errorVenta };
            }
        }
        
        const { success, error: errorMarcar } = await this.marcarRecetaComoSurtida(idReceta);

        if (!success || errorMarcar) {
            return { success: false, error: errorMarcar };
        }
        
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
}

    static async obtenerVentas(idFarmacia = null) {
        try {
            let query = supabase
            .from('venta')
            .select(`
                *,
                medicamento (
                    id_medicamento,
                    nombre,
                    precio
                )
            `)
            .order('fecha_venta', { ascending: false });
            
                if (idFarmacia) {
                    query = query.eq('id_farmacia', parseInt(idFarmacia));
                }
            
            const { data, error } = await query;
            
            if (error) {
                return { data: null, error };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async crearVenta(ventaData) {
        try {
            const { data, error } = await supabase
                .from('venta')
                
.insert({
    id_farmacia: ventaData.id_farmacia,
    id_medicamento: ventaData.id_medicamento || null, // Permitir NULL
    fecha_venta: ventaData.fecha_venta || new Date().toISOString().split('T')[0],
    hora_venta: ventaData.hora_venta || new Date().toTimeString().split(' ')[0],
    total: ventaData.total,
    tipo: ventaData.tipo || 'venta',
    vendedor: ventaData.vendedor || null
})
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

    static async actualizarVenta(idVenta, ventaData) {
        try {
            const { data, error } = await supabase
                .from('venta')
                .update({
                    total: ventaData.total,
                    tipo: ventaData.tipo,
                    fecha_venta: ventaData.fecha_venta
                })
                .eq('id_venta', idVenta)
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

    static async eliminarVenta(idVenta) {
        try {
            const { error } = await supabase
                .from('venta')
                .delete()
                .eq('id_venta', idVenta);
            
            if (error) {
                return { success: false, error };
            }
            
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error };
        }
    }

static async obtenerMedicamentosdeRecetas(idReceta){
	//metodo para obtener medicamentos asociados a una receta
	try{
		const {data,error} = await supabase
		.from('receta_medicamento')
		.select(`
                id_medicamento,
                cantidad,
                dosis,
                medicamento (
        id_medicamento,
        nombre,
        precio,
        descripcion
    )
`)
            .eq('id_receta', idReceta);
        
        if (error) {
            console.error('Error al obtener medicamentos de receta:', error);
            return { data: null, error };
        }
        
        // Transformar los datos para que sean más fáciles de usar y ver
        const medicamentos = data.map(item => ({
            id_medicamento: item.id_medicamento,
            cantidad: item.cantidad,
            dosis: item.dosis,
            nombre: item.medicamento.nombre,
            precio: item.medicamento.precio,
            descripcion: item.medicamento.descripcion
        }));
        
        return { data: medicamentos, error: null };
    } catch (error) {
        console.error('Error:', error);
        return { data: null, error };
    }
}
//no quiero cachar aaaaaaaa
static async marcarRecetaComoSurtida(idReceta) {
    try {
        const { error } = await supabase
            .from('receta')
            .update({ surtida: true })
            .eq('id_receta', idReceta);
        
        if (error) {
            console.error('Error al marcar receta como surtida:', error);
            return { success: false, error };
        }
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}
}