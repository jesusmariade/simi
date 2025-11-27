// src/controllers/FarmaciaController.js
import { FarmaciaService } from '../services/FarmaciaService.js';
import { VentaMedicamentoService } from '../services/VentaMedicamentoService.js';
import { MedicamentoService } from '../services/MedicamentoService.js';
import { Venta } from '../models/Venta.js';
import { Receta } from '../models/Receta.js';
import { Medicamento } from '../models/Medicamento.js';

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
        const precio = parseFloat(selectedOption.dataset.precio) || 0;
        const cantidad = parseFloat(inputCantidad.value) || 0;
        const subtotal = precio * cantidad;
        
        inputPrecio.value = precio.toFixed(2);
        inputSubtotal.value = subtotal.toFixed(2);
    }

    static async crearVenta(ventaData) {
        try {
            const idFarmacia = parseInt(localStorage.getItem('idFarmacia')) || 1;
            const venta = {
                id_farmacia: idFarmacia,
                id_medicamento: parseInt(ventaData.id_medicamento),
                fecha_venta: new Date().toISOString().split('T')[0],
                hora_venta: new Date().toTimeString().split(' ')[0], // Agregar hora
                total: parseFloat(ventaData.total),
                tipo: 'venta',
                vendedor: localStorage.getItem('usuarioNombre') || 'Farmacéutico' // Agregar vendedor
            };
            
            const { data, error } = await FarmaciaService.crearVenta(venta);
            
            if (error) {
                console.error('Error al crear venta:', error);
                return { venta: null, error };
            }
            
            return { venta: data, error: null };
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

    static async actualizarVenta(idVenta, ventaData) {
        try {
            const venta = {
                total: parseFloat(ventaData.total),
                tipo: 'venta',
                fecha_venta: new Date().toISOString().split('T')[0]
            };
            
            const { data, error } = await FarmaciaService.actualizarVenta(idVenta, venta);
            
            if (error) {
                console.error('Error al actualizar venta:', error);
                return { venta: null, error };
            }
            
            return { venta: data, error: null };
        } catch (error) {
            console.error('Error:', error);
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

    static renderizarRecetas(recetas, container) {
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
        
        recetas.forEach(receta => {
            const tr = document.createElement('tr');
            const nombrePaciente = receta.paciente?.nombre_completo || 'Sin nombre';
            tr.innerHTML = `
                <td>${receta.id_receta}</td>
                <td>${nombrePaciente}</td>
                <td>${receta.fecha_expedicion}</td>
                <td>${receta.surtida ? 'Sí' : 'No'}</td>
                <td></td>
            `;
            
            const tdAcc = tr.querySelector('td:last-child');
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = 'Surtir';
            btn.setAttribute('aria-label', `Surtir receta ${receta.id_receta}`);
            btn.addEventListener('click', async () => {
                const { success, error } = await FarmaciaController.surtirReceta(receta.id_receta);
                if (success) {
                    alert('Receta surtida exitosamente');
                    FarmaciaController.inicializar();
                } else {
                    alert('Error al surtir receta');
                }
            });
            tdAcc.appendChild(btn);
            
            tbody.appendChild(tr);
        });
        
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
            const nombreMedicamento = venta.medicamento?.nombre || 'Sin medicamento';
            const hora = venta.hora_venta || 'N/A';
            const vendedor = venta.vendedor || 'Farmacéutico';
            const fecha = venta.fecha_venta;
            
            li.innerHTML = `
                <div class="venta-info">
                    <strong>${nombreMedicamento}</strong><br>
                    <small>ID: ${venta.id_venta} | Total: $${Number(venta.total).toFixed(2)}</small><br>
                    <small>Fecha: ${fecha} | Hora: ${hora}</small><br>
                    <small>Vendido por: ${vendedor}</small>
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
            
            const btnDel = document.createElement('button');
            btnDel.className = 'btn small danger';
            btnDel.textContent = 'Eliminar';
            btnDel.setAttribute('aria-label', `Eliminar venta ${venta.id_venta}`);
            btnDel.addEventListener('click', async () => {
                if (!confirm('¿Eliminar venta?')) return;
                const { success, error } = await FarmaciaController.eliminarVenta(venta.id_venta);
                if (success) {
                    FarmaciaController.inicializar();
                } else {
                    alert('Error al eliminar venta');
                }
            });
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDel);
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
        
        // Guardar ID para edición
        formVenta.dataset.editId = venta.id_venta;
        
        // Cargar medicamentos si no están cargados
        const selectMedicamento = document.getElementById('select-medicamento');
        if (selectMedicamento && selectMedicamento.options.length <= 1) {
            const { medicamentos } = await FarmaciaController.cargarMedicamentos();
            FarmaciaController.llenarSelectMedicamentos(medicamentos, selectMedicamento);
        }
        
        // Llenar formulario
        const cantidadInput = document.getElementById('input-cantidad');
        const totalInput = document.getElementById('input-total');
        
        if (venta.id_medicamento && selectMedicamento) {
            selectMedicamento.value = venta.id_medicamento;
            FarmaciaController.calcularTotal();
        }
        if (cantidadInput) cantidadInput.value = venta.cantidad || 1;
        if (totalInput) totalInput.value = venta.total || 0;
        
        // Recalcular total
        FarmaciaController.calcularTotal();
        
        // Mostrar panel
        formPanel.classList.remove('hidden');
        formPanel.setAttribute('aria-hidden', 'false');
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
}