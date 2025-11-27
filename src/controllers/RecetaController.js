// src/controllers/RecetaController.js
import { RecetaService } from '../services/RecetaServices.js';
import { MedicamentoService } from '../services/MedicamentoService.js';
import { Receta } from '../models/Receta.js';
export class RecetaController {
    // Crear receta desde una cita
    static async crearRecetaDesdeCita(idCita) {
        try {
            const { data, error } = await RecetaService.crearReceta(idCita);
            
            if (error) {
                console.error('Error al crear receta:', error);
                return { receta: null, error };
            }
            
            return { receta: data, error: null };
        } catch (error) {
            console.error('Error:', error);
            return { receta: null, error };
        }
    }
// Agregar medicamento a receta
static async agregarMedicamentoAReceta(idReceta, medicamentoData) {
    try {
        const { data, error } = await RecetaService.agregarMedicamentoAReceta(
            idReceta,
            medicamentoData.id_medicamento,
            medicamentoData.cantidad,
            medicamentoData.dosis,
            medicamentoData.comprado,
        );
        
        if (error) {
            console.error('Error al agregar medicamento:', error);
            return { success: false, error };
        }
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

// Cargar todos los medicamentos disponibles
static async cargarMedicamentos() {
    try {
        const { data, error } = await MedicamentoService.obtenerTodos();
        
        if (error) {
            return { medicamentos: [], error };
        }
        
        return { medicamentos: data, error: null };
    } catch (error) {
        return { medicamentos: [], error };
    }
}
//cargar receta de cita
static async obtenerRecetaporId(id_cita){
     try{
           const{data, error} = await RecetaService.obtenerRecetaporId(id_cita)
           if(error){
            return{receta:null, error}
           }
           return{receta:data, error:null}
        }
        catch(error){
            return{receta:null, error}
        }
}
}
    