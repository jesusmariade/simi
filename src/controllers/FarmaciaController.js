// src/controllers/FarmaciaController.js
import { FarmaciaService } from '../services/FarmaciaService.js';
import { VentaMedicamentoService } from '../services/VentaMedicamentoService.js';
import { MedicamentoService } from '../services/MedicamentoService.js';
import { RecetaMedicamentoService } from '../services/RecetaMedicamentoService.js';//añadido por alo para nueva funcion(trust me)
import { Venta } from '../models/Venta.js';
import { Receta } from '../models/Receta.js';
import { Medicamento } from '../models/Medicamento.js';
import { getSupabaseClient } from '../../supabase/supabaseClient.js';

export class FarmaciaController {
    static async cargarRecetas() {
        try {
            const idFarmacia = localStorage.getItem('idFarmacia');
            const { data, error } = await FarmaciaService.obtenerRecetas(idFarmacia);
            
            if (error) {
                console.error('Error al cargar recetas:', error);
                return { recetas: [], error };
            }
            
            if (!data || data.length === 0) {
                return { recetas: [], error: null };
            }
            
            const recetas = data.map(receta => Receta.fromJSON(receta));
            return { recetas, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { recetas: [], error };
        }
    }

    static async surtirReceta(idReceta) {
        try {
            const { data, error } = await FarmaciaService.surtirReceta(idReceta);
            
            if (error) {
                console.error('Error al surtir receta:', error);
                return { success: false, error };
            }
            
            return { success: true, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { success: false, error };
        }
    }

    static async cargarVentas() {
        try {
            const idFarmacia = parseInt(localStorage.getItem('idFarmacia'));
            const { data, error } = await FarmaciaService.obtenerVentas(idFarmacia);
            
            if (error) {
                console.error('Error al cargar ventas:', error);
                return { ventas: [], error };
            }
            
            if (!data || data.length === 0) {
                return { ventas: [], error: null };
            }
            
            const ventas = data.map(venta => Venta.fromJSON(venta));
            return { ventas, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { ventas: [], error };
        }
    }

    static async cargarMedicamentos() {
        try {
            const idFarmacia = parseInt(localStorage.getItem('idFarmacia'));
            const { data, error } = idFarmacia 
                ? await MedicamentoService.obtenerPorFarmacia(idFarmacia)
                : await MedicamentoService.obtenerTodos();
            
            if (error) {
                console.error('Error al cargar medicamentos:', error);
                return { medicamentos: [], error };
            }
            
            if (!data || data.length === 0) {
                return { medicamentos: [], error: null };
            }
            
            const medicamentos = data.map(med => Medicamento.fromJSON(med));
            return { medicamentos, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { medicamentos: [], error };
        }
    }

    static llenarSelectMedicamentos(medicamentos, selectElement) {
        if (!selectElement) return;
        
        // Limpiar opciones existentes (excepto la primera)
        selectElement.innerHTML = '<option value="">Seleccione un medicamento...</option>';
        
        if (!medicamentos || medicamentos.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay medicamentos disponibles';
            selectElement.appendChild(option);
            return;
        }
        
        medicamentos.forEach(medicamento => {
            const option = document.createElement('option');
            option.value = medicamento.id_medicamento;
            option.textContent = `${medicamento.nombre} - $${medicamento.precio.toFixed(2)}${medicamento.cantidad_stock !== undefined ? ` (Stock: ${medicamento.cantidad_stock})` : ''}`;
            option.dataset.precio = medicamento.precio;
            option.dataset.nombre = medicamento.nombre;
            selectElement.appendChild(option);
        });
    }

    static calcularTotal() {
        const selectMedicamento = document.getElementById('select-medicamento');
        const inputCantidad = document.getElementById('input-cantidad');
        const inputPrecio = document.getElementById('input-precio');
        const inputSubtotal = document.getElementById('input-subtotal');
        
        if (!selectMedicamento || !inputCantidad || !inputPrecio || !inputSubtotal) return;
        
        const selectedOption = selectMedicamento.options[selectMedicamento.selectedIndex];
        if (!selectedOption || !selectedOption.value) {
            inputPrecio.value = '';
            inputSubtotal.value = '';
            return;
        }
        
        const precio = parseFloat(selectedOption.dataset.precio) || 0;
        const cantidad = parseFloat(inputCantidad.value) || 0;
        const subtotal = precio * cantidad;
        
        inputPrecio.value = precio.toFixed(2);
        inputSubtotal.value = subtotal.toFixed(2);
    }

    static async crearVenta(medicamentosArray) {
        try {
            const idFarmacia = parseInt(localStorage.getItem('idFarmacia')) || 1;
            
            // Validar que haya medicamentos
            if (!medicamentosArray || medicamentosArray.length === 0) {
                return { venta: null, error: { message: 'Debe agregar al menos un medicamento' } };
            }
            
            // Agrupar medicamentos duplicados por id_medicamento y sumar cantidades
            const medicamentosAgrupados = {};
            medicamentosArray.forEach(med => {
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
                        subtotal: med.subtotal
                    };
                }
            });
            
            // Convertir el objeto agrupado de vuelta a array
            const medicamentosUnicos = Object.values(medicamentosAgrupados);
            
            console.log('Medicamentos originales:', medicamentosArray.length);
            console.log('Medicamentos únicos después de agrupar:', medicamentosUnicos.length);
            
            // Calcular el total de todos los medicamentos únicos
            const totalVenta = medicamentosUnicos.reduce((sum, med) => sum + med.subtotal, 0);
            
            // Crear la venta sin id_medicamento (será NULL)
            const venta = {
                id_farmacia: idFarmacia,
                id_medicamento: null, // Ya no se usa la relación directa porque no deja registrar varios medicamentos por venta o receta
                fecha_venta: new Date().toISOString().split('T')[0],
                hora_venta: new Date().toTimeString().split(' ')[0],
                total: totalVenta,
                tipo: 'venta',
                vendedor: localStorage.getItem('usuarioNombre') || 'Farmacéutico'
            };
            
            // Crear la venta en la base de datos
            const { data: ventaCreada, error: errorVenta } = await FarmaciaService.crearVenta(venta);
            
            if (errorVenta || !ventaCreada) {
                console.error('Error al crear venta:', errorVenta);
                return { venta: null, error: errorVenta || { message: 'Error al crear la venta' } };
            }
            
            // Agregar cada medicamento único a la venta usando venta_medicamento
            let medicamentosAgregados = 0;
            let erroresMedicamentos = [];
            
            for (const medicamento of medicamentosUnicos) {
                const { success, error: errorMed } = await FarmaciaController.agregarMedicamentoAVenta(
                    ventaCreada.id_venta,
                    medicamento.id_medicamento,
                    medicamento.cantidad,
                    medicamento.precio,
                    medicamento.subtotal
                );
                
                if (!success || errorMed) {
                    console.error('Error al agregar medicamento a venta:', errorMed);
                    erroresMedicamentos.push({
                        medicamento: medicamento.nombre,
                        error: errorMed
                    });
                } else {
                    medicamentosAgregados++;
                }
            }
            
            // Si no se agregó ningún medicamento, eliminar la venta
            if (medicamentosAgregados === 0) {
                console.error('No se pudo agregar ningún medicamento a la venta');
                await FarmaciaService.eliminarVenta(ventaCreada.id_venta);
                return { 
                    venta: null, 
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
            
            console.log('Resumen venta normal: Agregados', medicamentosAgregados, 'de', medicamentosUnicos.length, 'medicamentos únicos');
            
            return { venta: ventaCreada, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { venta: null, error };
        }
    }
    // 
static async agregarMedicamentoAVenta(idVenta, idMedicamento, cantidad, precioUnitario, subtotal) {
    try {
        const { data, error } = await VentaMedicamentoService.agregarMedicamentoAVenta(
            idVenta,
            idMedicamento,
            cantidad,
            precioUnitario,
            subtotal
        );
        
        if (error) {
            console.error('Error al agregar medicamento a venta:', error);
            return { success: false, error };
        }
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

    static async actualizarVenta(idVenta, ventaData, medicamentosArray = []) {
    try {
      const { data, error } = await FarmaciaService.actualizarVenta(idVenta, ventaData, medicamentosArray);
      return { venta: data, error };
    } catch (error) {
      console.error('Error en FarmaciaController.actualizarVenta:', error);
      return { venta: null, error };
    }
  }
    static async eliminarVenta(idVenta) {
        try {
            const { success, error } = await FarmaciaService.eliminarVenta(idVenta);
            
            if (error) {
                console.error('Error al eliminar venta:', error);
                return { success: false, error };
            }
            
            return { success, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { success: false, error };
        }
    }

    static async renderizarRecetas(recetas, container) {//async para que funcione mi await
        if (!container) return;
        
        if (!recetas || recetas.length === 0) {
            container.innerHTML = '<p>No hay recetas disponibles</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'tablita';
        table.innerHTML = `
    <thead>
        <tr>
            <th>ID Receta</th>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Surtida</th>
            <th>Acción</th>
        </tr>
    </thead>
    <tbody></tbody>
`;
        
        const tbody = table.querySelector('tbody');
        //cambio forEach para usar un await dentro
        //recetas.forEach(receta => {
       for (const receta of recetas) {
             //revisar si yase compraron todos los medicamentos
            const tr = document.createElement('tr');
            const nombrePaciente = receta.paciente?.nombre_completo || 'Sin nombre';
            tr.innerHTML = `
                <td>${receta.id_receta}</td>
                <td>${nombrePaciente}</td>
                <td>${receta.fecha_expedicion}</td>
                <td>${receta.surtida ? 'Sí' : 'No'}</td>
                <td></td>
            `;

            //parte para verificar(no afecta mucho la vdd)
             const {todosComprados} = await FarmaciaController.verificarMedicamentosComprados(receta.id_receta);
              console.log(`Medicamentos comprados para receta ${receta.id_receta}:`, todosComprados);
            //si ya estan todos comprados
            if (todosComprados && !receta.surtida) {
                tr.querySelector('td:nth-child(4)').textContent = 'Listo para surtir';
            }

            
            const tdAcc = tr.querySelector('td:last-child');
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = 'Surtir';
            btn.setAttribute('aria-label', `Surtir receta ${receta.id_receta}`);
            //si receta ya surtida
                if (receta.surtida) {
                btn.disabled = true;
                btn.textContent = "Ya surtida";
                }

            //boton surtir
                btn.addEventListener('click', async () => {
                    //para recetas ya surtidas
                     if (receta.surtida) {
                        alert("Esta receta ya fue surtida. No puedes surtirla otra vez.");
                        return;
                    }
                    //si medicamentos no comprados
                    if(!todosComprados){
                       localStorage.setItem("id_cita", receta.id_cita);
                        window.location.href = "surtir.html";

                        return;
                    }

                    //surtir normalmente
                const { success, error } = await FarmaciaController.surtirReceta(receta.id_receta);
                if (success) {
                    alert('Receta surtida exitosamente');
                    FarmaciaController.inicializar();
                    //yo
                    return;
                } /*else {
                    alert('Error al surtir receta');
                }*/

                    //para el error del backend
                    if (error?.message === "Receta ya surtida") {
                    alert("Esta receta ya fue surtida previamente.");
                    return;
                    }
                    alert('Error al surtir receta');
            });
            tdAcc.appendChild(btn);
            
            tbody.appendChild(tr);
        };//});
        
        
        container.innerHTML = '';
        container.appendChild(table);
    }

    static renderizarVentas(ventas, container) {
        if (!container) return;
        
        if (!ventas || ventas.length === 0) {
            container.innerHTML = '<p>No hay ventas registradas</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'ventas-ul';
        
        ventas.forEach(venta => {
            const li = document.createElement('li');
            li.className = 'venta-item';
            const hora = venta.hora_venta || 'N/A';
            const vendedor = venta.vendedor || 'Farmacéutico';
            const fecha = venta.fecha_venta;
            
            // Debug: ver qué datos tenemos
            console.log('Venta ID:', venta.id_venta, 'Datos completos:', venta);
            console.log('venta_medicamento:', venta.venta_medicamento);
            console.log('Es array?', Array.isArray(venta.venta_medicamento));
            console.log('Longitud:', venta.venta_medicamento?.length);
            
            // Obtener medicamentos de la venta
            // Supabase puede devolver un array vacío [] o null, así que verificamos ambos
            let medicamentosVentaMedicamento = [];
            
            // Verificar diferentes formas en que Supabase puede devolver los datos
            if (venta.venta_medicamento) {
                if (Array.isArray(venta.venta_medicamento)) {
                    medicamentosVentaMedicamento = venta.venta_medicamento;
                } else if (typeof venta.venta_medicamento === 'object') {
                    // Si es un objeto, convertirlo a array
                    medicamentosVentaMedicamento = [venta.venta_medicamento];
                }
            }
            
            console.log('Medicamentos procesados:', medicamentosVentaMedicamento);
            
            // Construir lista de medicamentos
            let medicamentosHTML = '';
            if (medicamentosVentaMedicamento.length > 0) {
                // Nuevo sistema: múltiples medicamentos desde venta_medicamento
                medicamentosHTML = '<ul style="margin-top: 10px; padding-left: 20px; list-style: disc;">';
                medicamentosVentaMedicamento.forEach(vm => {
                    // El medicamento puede estar anidado o ser un objeto directo
                    const medicamento = vm.medicamento || vm;
                    const nombreMed = medicamento?.nombre || medicamento?.nombre_medicamento || 'Sin nombre';
                    const cantidad = vm.cantidad || 1;
                    const precioUnitario = vm.precio_unitario || vm.precio || medicamento?.precio || 0;
                    const subtotal = vm.subtotal || (cantidad * precioUnitario);
                    
                    console.log('Procesando medicamento:', { vm, medicamento, nombreMed, cantidad, precioUnitario });
                    
                    medicamentosHTML += `<li>${nombreMed} - Cant: ${cantidad} x $${Number(precioUnitario).toFixed(2)} = $${Number(subtotal).toFixed(2)}</li>`;
                });
                medicamentosHTML += '</ul>';
            } else if (venta.medicamento && venta.id_medicamento) {
                // Fallback: sistema antiguo - medicamento directo (ventas creadas antes del cambio)
                const nombreMedicamento = venta.medicamento.nombre || 'Sin nombre';
                // Intentar obtener cantidad desde el modelo si existe
                const cantidad = venta.cantidad || 1;
                const precio = venta.medicamento.precio || 0;
                const subtotal = cantidad * precio;
                medicamentosHTML = `<div style="margin-top: 5px; padding-left: 20px;">
                    • ${nombreMedicamento} - Cant: ${cantidad} x $${precio.toFixed(2)} = $${subtotal.toFixed(2)}
                </div>`;
            } else {
                // No hay medicamentos - puede ser una venta nueva que aún no tiene medicamentos guardados
                console.warn('Venta sin medicamentos - ID:', venta.id_venta, 'Datos:', {
                    tiene_venta_medicamento: !!venta.venta_medicamento,
                    tipo_venta_medicamento: typeof venta.venta_medicamento,
                    tiene_medicamento: !!venta.medicamento,
                    id_medicamento: venta.id_medicamento
                });
                medicamentosHTML = '<div style="margin-top: 5px; color: #999; padding-left: 20px;">Sin medicamento</div>';
            }
            
            li.innerHTML = `
                <div class="venta-info">
                    <strong>Venta #${venta.id_venta}</strong><br>
                    <small>Total: $${Number(venta.total).toFixed(2)}</small><br>
                    <small>Fecha: ${fecha} | Hora: ${hora}</small><br>
                    <small>Vendido por: ${vendedor}</small>
                    ${medicamentosHTML}
                </div>
            `;
            const actions = document.createElement('div');
            actions.className = 'venta-actions';
            
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn small';
            btnEdit.textContent = 'Editar';
            btnEdit.setAttribute('aria-label', `Editar venta ${venta.id_venta}`);
            btnEdit.addEventListener('click', () => {
                FarmaciaController.abrirFormularioEditar(venta);
            });
            
            actions.appendChild(btnEdit);
            li.appendChild(actions);
            ul.appendChild(li);
        });
        
        container.innerHTML = '';
        container.appendChild(ul);
    }

     static async abrirFormularioEditar(venta) {
        const formPanel = document.getElementById('form-registrar');
        const formVenta = document.getElementById('formVenta');
        
        if (!formVenta || !formPanel) return;
        
        // ✅ CAMBIO: Guardar ID para edición
        formVenta.dataset.editId = venta.id_venta;
        console.log('Abriendo formulario de edición para venta:', venta.id_venta);
        
        // ✅ CAMBIO: Cargar medicamentos si no están cargados
        const selectMedicamento = document.getElementById('select-medicamento');
        if (selectMedicamento && selectMedicamento.options.length <= 1) {
            console.log('Cargando medicamentos...');
            const { medicamentos, error } = await FarmaciaController.cargarMedicamentos();
            
            if (!error && medicamentos && medicamentos.length > 0) {
                FarmaciaController.llenarSelectMedicamentos(medicamentos, selectMedicamento);
                console.log('Medicamentos cargados:', medicamentos.length);
            } else {
                console.error('Error cargando medicamentos:', error);
            }
        }
        
        // ✅ CAMBIO: Limpiar formulario
        if (formVenta) {
            formVenta.reset();
        }
        
        // ✅ IGUAL: Cargar medicamentos de la venta en el formulario
        let medicamentosVentaMedicamento = [];
        if (venta.venta_medicamento) {
            if (Array.isArray(venta.venta_medicamento)) {
                medicamentosVentaMedicamento = venta.venta_medicamento;
            } else if (typeof venta.venta_medicamento === 'object') {
                medicamentosVentaMedicamento = [venta.venta_medicamento];
            }
        }
        
        console.log('Medicamentos a cargar en formulario:', medicamentosVentaMedicamento);
        
        // ✅ CAMBIO: Usar la función expuesta correctamente
        if (medicamentosVentaMedicamento.length > 0) {
            if (typeof window.cargarMedicamentosEnFormulario === 'function') {
                window.cargarMedicamentosEnFormulario(medicamentosVentaMedicamento);
                console.log('Medicamentos cargados en formulario');
            } else {
                console.error('Función cargarMedicamentosEnFormulario no disponible');
            }
        } else {
            if (typeof window.limpiarMedicamentosFormulario === 'function') {
                window.limpiarMedicamentosFormulario();
                console.log('Formulario limpiado (sin medicamentos)');
            }
        }
        
        // ✅ IGUAL: Mostrar panel
        formPanel.classList.remove('hidden');
        formPanel.setAttribute('aria-hidden', 'false');
        console.log('Panel abierto');
    }

    static async inicializar() {
        // Cargar información de la sucursal
        const sucursalNombre = localStorage.getItem('sucursalNombre') || 'Sucursal';
        const titulo = document.getElementById('titulo-sucursal');
        if (titulo) {
            titulo.textContent = `Bienvenido a la sucursal ${sucursalNombre}`;
        }

        const idFarmEl = document.getElementById('id-farmacia');
        const idSucEl = document.getElementById('id-sucursal');
        if (idFarmEl) idFarmEl.textContent = localStorage.getItem('idFarmacia') || '1';
        if (idSucEl) idSucEl.textContent = localStorage.getItem('sucursalId') || 'A1';

        // Cargar medicamentos y llenar el select
        const selectMedicamento = document.getElementById('select-medicamento');
        if (selectMedicamento) {
            const { medicamentos, error: errorMedicamentos } = await FarmaciaController.cargarMedicamentos();
            if (!errorMedicamentos) {
                FarmaciaController.llenarSelectMedicamentos(medicamentos, selectMedicamento);
                
                // Agregar eventos para calcular total automáticamente
                selectMedicamento.addEventListener('change', () => {
                    FarmaciaController.calcularTotal();
                });
                
                const inputCantidad = document.getElementById('input-cantidad');
                if (inputCantidad) {
                    inputCantidad.addEventListener('input', () => {
                        FarmaciaController.calcularTotal();
                    });
                }
            }
        }

        // Cargar recetas
        const { recetas, error: errorRecetas } = await FarmaciaController.cargarRecetas();
        if (!errorRecetas) {
            const recetasContainer = document.getElementById('recetas-list');
            FarmaciaController.renderizarRecetas(recetas, recetasContainer);
        }

        // Cargar ventas
        const { ventas, error: errorVentas } = await FarmaciaController.cargarVentas();
        if (!errorVentas) {
            const ventasContainer = document.getElementById('ventas-list');
            FarmaciaController.renderizarVentas(ventas, ventasContainer);
        }
    }
    //parte de alo para medicamento de receta
    //verifica si ya se compraron todos los medicamentos de una receta
    static async verificarMedicamentosComprados(id_receta){

        console.log("Verificando receta:", id_receta);

        try{
            const {data,error} = await RecetaMedicamentoService.obtenerMedicamentosDeReceta(id_receta);
             console.log("Respuesta de Supabase:", data, "Error:", error);            
            if(error || !data){
                return{todosComprados: false}
            }
            const todos = data.every(m => m.comprado === true);

            return{todosComprados: todos};

        }
        catch(error){
            return{todosComprados: false}
        }
    }
}