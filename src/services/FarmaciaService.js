// src/services/FarmaciaService.js
/*import supabase from '../../supabase/supabaseClient.js';*/
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

import { VentaMedicamentoService } from './VentaMedicamentoService.js';


export class FarmaciaService {
    static async obtenerRecetas(idFarmacia = null) {
        try {
            const supabase = await getSupabaseClient();
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


    static async crearVenta(ventaData) {
        try {
            const supabase = await getSupabaseClient();
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

    static async actualizarVenta(idVenta, ventaData, medicamentosArray = []) {
    try {
      const supabase = await getSupabaseClient();
      const id = parseInt(idVenta, 10);
      console.log('FarmaciaService.actualizarVenta -> id:', id, 'ventaData (raw):', ventaData);

      const payload = {};
      if (ventaData.total !== undefined && ventaData.total !== null) payload.total = Number(ventaData.total);
      if (ventaData.tipo !== undefined) payload.tipo = ventaData.tipo;
      if (ventaData.fecha_venta !== undefined) payload.fecha_venta = ventaData.fecha_venta;

      console.log('FarmaciaService.actualizarVenta -> payload (sanitizado):', payload);

      const updateRes = await supabase
        .from('venta')
        .update(payload)
        .eq('id_venta', id)
        .select();

      console.log('Supabase update venta response raw:', updateRes);
      if (updateRes.error) {
        console.error('Supabase update error:', {
          message: updateRes.error.message,
          details: updateRes.error.details,
          hint: updateRes.error.hint,
        });
        return { data: null, error: updateRes.error };
      }

      if (Array.isArray(medicamentosArray)) {
        const delRes = await supabase.from('venta_medicamento').delete().eq('id_venta', id);
        if (delRes.error) {
          console.error('Error borrando venta_medicamento:', delRes.error);
          return { data: null, error: delRes.error };
        }

        if (medicamentosArray.length > 0) {
          const inserts = medicamentosArray.map(m => ({
            id_venta: id,
            id_medicamento: m.id_medicamento ?? m.id,
            cantidad: Number(m.cantidad ?? 0),
            // CORRECCIÓN: usar paréntesis al mezclar ?? y ||
            precio_unitario: Number((m.precio ?? m.precio_unitario) || 0),
            subtotal: Number(m.subtotal ?? ( (m.cantidad ?? 0) * ((m.precio ?? m.precio_unitario) || 0) ))
          }));

          const insRes = await supabase.from('venta_medicamento').insert(inserts).select();
          console.log('Supabase insert venta_medicamento response raw:', insRes);
          if (insRes.error) {
            console.error('Error insertando venta_medicamento:', insRes.error);
            return { data: null, error: insRes.error };
          }
        }
      }

      const data = Array.isArray(updateRes.data) ? updateRes.data[0] : updateRes.data;
      return { data, error: null };
    } catch (error) {
      console.error('Error en FarmaciaService.actualizarVenta (catch):', error);
      return { data: null, error };
    }
  }


    static async eliminarVenta(idVenta) {
        try {
            const supabase = await getSupabaseClient();
            // Primero eliminar los medicamentos asociados en venta_medicamento
            const { error: errorMedicamentos } = await supabase
                .from('venta_medicamento')
                .delete()
                .eq('id_venta', idVenta);
            
            if (errorMedicamentos) {
                console.error('Error al eliminar medicamentos de la venta:', errorMedicamentos);
                // Continuar intentando eliminar la venta de todos modos
            }
            
            // Luego eliminar la venta
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
    static async obtenerVentas(idFarmacia = null) {
        try {
            const supabase = await getSupabaseClient();
            let query = supabase
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
        const supabase = await getSupabaseClient();
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

static async surtirReceta(idReceta) {
    try {
        const supabase = await getSupabaseClient();
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
        const supabase = await getSupabaseClient();
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