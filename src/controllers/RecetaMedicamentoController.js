//src/controllers/RecetaMedicamentoController.js
import { RecetaMedicamentoService } from '../services/RecetaMedicamentoService.js';

export class RecetaMedicamentoController {

    static async obtenerRecetaMedicamentoporid(id_receta) {
        try {
            const { data, error } = await RecetaMedicamentoService.obtenerRecetaMedicamentoporid(id_receta);

            if (error) return { RecetaMedicamento: null, error };
            return { RecetaMedicamento: data, error: null };

        } catch (error) {
            return { RecetaMedicamento: null, error };
        }
    }
}
