// src/services/FarmaciaService.js
import { getSupabase } from "../../supabase/supabaseClient.js";
import { VentaMedicamentoService } from './VentaMedicamentoService.js';


export class FarmaciaService {
    static async obtenerRecetas(idFarmacia = null) {
        try {
            const sb = await getSupabase();
            let query = sb
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
    if (idFarmacia) {
    // Obtener la sucursal de la farmacia
    const { data: farmacia } = await sb
        .from('farmacia')
        .select('n_sucursal')
        .eq('id_farmacia', parseInt(idFarmacia))
        .single();
    
    if (farmacia) {
        // Obtener los códigos de médicos de esta sucursal
        const { data: medicos } = await sb
            .from('medico')
            .select('codigo')
            .eq('numero_sucursal', farmacia.n_sucursal);
        
        if (medicos && medicos.length > 0) {
            const codigosMedicos = medicos.map(m => m.codigo);
            
            // Obtener las citas de esos médicos
            const { data: citas } = await sb
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


    static async crearVenta(ventaData) {
        try {
            const sb = await getSupabase();
            const { data, error } = await sb
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
            const sb = await getSupabase();
            const { data, error } = await sb
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

    // Actualiza una venta y reemplaza sus medicamentos en una sola operación
    static async actualizarVentaConMedicamentos(idVenta, medicamentosArray) {
        try {
            const sb = await getSupabase();

            // Calcular total si no viene
            const total = medicamentosArray && medicamentosArray.length > 0
                ? medicamentosArray.reduce((s, m) => s + (m.subtotal || 0), 0)
                : 0;

            // Eliminar medicamentos antiguos asociados a la venta
            const { error: delError } = await sb
                .from('venta_medicamento')
                .delete()
                .eq('id_venta', idVenta);

            if (delError) {
                // No abortamos la operación por esto, pero lo registramos
                console.warn('Error eliminando medicamentos antiguos:', delError);
            }

            // Actualizar la venta con el nuevo total / fecha
            const fecha = new Date().toISOString().split('T')[0];
            const { data: ventaActualizada, error: errUpd } = await sb
                .from('venta')
                .update({ total, fecha_venta: fecha })
                .eq('id_venta', idVenta)
                .select()
                .single();

            if (errUpd) {
                return { data: null, error: errUpd };
            }

            // Insertar los nuevos medicamentos (si hay)
            if (medicamentosArray && medicamentosArray.length > 0) {
                const rows = medicamentosArray.map(m => ({
                    id_venta: idVenta,
                    id_medicamento: m.id_medicamento,
                    cantidad: m.cantidad,
                    precio_unitario: m.precio,
                    subtotal: m.subtotal
                }));

                const { data: inserted, error: insertErr } = await sb
                    .from('venta_medicamento')
                    .insert(rows);

                if (insertErr) {
                    return { data: null, error: insertErr };
                }

                return { data: { venta: ventaActualizada, venta_medicamento: inserted }, error: null };
            }

            return { data: { venta: ventaActualizada, venta_medicamento: [] }, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async eliminarVenta(idVenta) {
        try {
            // Primero eliminar los medicamentos asociados en venta_medicamento
            const sb = await getSupabase();
            const { error: errorMedicamentos } = await sb
                .from('venta_medicamento')
                .delete()
                .eq('id_venta', idVenta);
            
            if (errorMedicamentos) {
                console.error('Error al eliminar medicamentos de la venta:', errorMedicamentos);
                // Continuar intentando eliminar la venta de todos modos
            }
            
            // Luego eliminar la venta
            const { error } = await sb
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
    static async obtenerVentas(idFarmacia = null) {
        try {
            const sb = await getSupabase();
            let query = sb
            .from('venta')
            .select(`
                *,
                venta_medicamento (
                    id_venta_medicamento,
                    cantidad,
                    precio_unitario,
                    subtotal,
                    medicamento (
                        id_medicamento,
                        nombre,
                        precio
                    )
                ),
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
                console.error('Error en obtenerVentas:', error);
                return { data: null, error };
            }
            
            console.log('Datos obtenidos de Supabase:', data);
            return { data, error: null };
        } catch (error) {
            console.error('Error en obtenerVentas:', error);
            return { data: null, error };
        }
    }

static async obtenerMedicamentosdeRecetas(idReceta){
	//metodo para obtener medicamentos asociados a una receta
	try{
        const sb = await getSupabase();
        const {data,error} = await sb
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

static async surtirReceta(idReceta) {
    try {
        const sb = await getSupabase();
        const { data, error } = await sb
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
        
        // Agrupar medicamentos duplicados por id_medicamento y sumar cantidades
        const medicamentosAgrupados = {};
        medicamentos.forEach(med => {
            const idMed = med.id_medicamento;
            if (medicamentosAgrupados[idMed]) {
                // Si ya existe, sumar la cantidad
                medicamentosAgrupados[idMed].cantidad += med.cantidad;
                medicamentosAgrupados[idMed].subtotal = medicamentosAgrupados[idMed].cantidad * medicamentosAgrupados[idMed].precio;
            } else {
                // Si no existe, agregarlo
                medicamentosAgrupados[idMed] = {
                    id_medicamento: med.id_medicamento,
                    nombre: med.nombre,
                    precio: med.precio,
                    cantidad: med.cantidad,
                    subtotal: med.precio * med.cantidad
                };
            }
        });
        
        // Convertir el objeto agrupado de vuelta a array
        const medicamentosUnicos = Object.values(medicamentosAgrupados);
        
        console.log('Medicamentos originales:', medicamentos.length);
        console.log('Medicamentos únicos después de agrupar:', medicamentosUnicos.length);
        
        const idFarmacia = localStorage.getItem('idFarmacia') || 1;

        // Calcular el total de TODOS los medicamentos de la receta
        const totalVenta = medicamentosUnicos.reduce((sum, med) => {
            return sum + med.subtotal;
        }, 0);
		  // Crear UNA SOLA venta sin id_medicamento (será NULL) una sola venta con varios medicamentos 
        const ventaData = {
            id_farmacia: parseInt(idFarmacia),
            id_medicamento: null, // Ya no se usa la relación directa
            fecha_venta: new Date().toISOString().split('T')[0],
            hora_venta: new Date().toTimeString().split(' ')[0],
            total: totalVenta,
            tipo: 'receta',
            vendedor: localStorage.getItem('usuarioNombre') || 'Farmacéutico'
        };
// Crear la venta en la base de datos
        const { data: ventaCreada, error: errorVenta } = await this.crearVenta(ventaData);
        
        if (errorVenta || !ventaCreada) {
            console.error('Error al crear venta:', errorVenta);
            return { success: false, error: errorVenta || { message: 'Error al crear la venta' } };
        }
		// Agregar cada medicamento a la venta usando venta_medicamento
        let medicamentosAgregados = 0;
        let erroresMedicamentos = [];
        
        console.log('Total de medicamentos únicos a agregar:', medicamentosUnicos.length);
        console.log('ID de venta creada:', ventaCreada.id_venta);
        
        for (const medicamento of medicamentosUnicos) {
            console.log('Intentando agregar medicamento:', medicamento.nombre || 'Sin nombre', 'ID:', medicamento.id_medicamento, 'a venta', ventaCreada.id_venta);
            
            const precioUnitario = medicamento.precio;
            const cantidad = medicamento.cantidad;
            const subtotal = precioUnitario * cantidad;
            
            console.log('Datos del medicamento:', { id_medicamento: medicamento.id_medicamento, cantidad, precioUnitario, subtotal });
            
            const { data, error: errorMed } = await VentaMedicamentoService.agregarMedicamentoAVenta(
                ventaCreada.id_venta,
                medicamento.id_medicamento,
                cantidad,
                precioUnitario,
                subtotal
            );
            
            if (errorMed || !data) {
                console.error('Error al agregar medicamento:', medicamento.nombre || 'Sin nombre', 'Error:', errorMed);
                erroresMedicamentos.push({
                    medicamento: medicamento.nombre || 'Sin nombre',
                    error: errorMed
                });
            } else {
                console.log('Medicamento agregado exitosamente:', medicamento.nombre || 'Sin nombre', 'Datos:', data);
                medicamentosAgregados++;
            }
        }
        
        console.log('Resumen: Agregados:', medicamentosAgregados, 'de', medicamentosUnicos.length, 'medicamentos únicos');
        if (erroresMedicamentos.length > 0) {
            console.error('Errores encontrados:', erroresMedicamentos);
        }
        
        // Si no se agregó ningún medicamento, eliminar la venta y retornar error
        if (medicamentosAgregados === 0) {
            console.error('No se pudo agregar ningún medicamento a la venta');
            await this.eliminarVenta(ventaCreada.id_venta);
            return { 
                success: false, 
                error: { 
                    message: 'Error al agregar medicamentos a la venta', 
                    detalles: erroresMedicamentos 
                } 
            };
        }
        // Si hubo algunos errores pero al menos uno se agregó, mostrar advertencia
        if (erroresMedicamentos.length > 0) {
            console.warn('Algunos medicamentos no se pudieron agregar:', erroresMedicamentos);
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
static async marcarRecetaComoSurtida(idReceta) {
    try {
        const sb = await getSupabase();
        const { error } = await sb
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