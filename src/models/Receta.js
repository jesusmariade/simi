// src/models/Receta.js
export class Receta {
    constructor(data) {
        this.id_receta = data.id_receta;
        this.id_cita = data.id_cita;
        this.fecha_expedicion = data.fecha_expedicion || new Date().toISOString().split('T')[0];
        
        // Se usa false por defecto 
        this.surtida = data.surtida || false;
        
        // Datos del JOIN
        this.cita = data.cita || null;
        this.paciente = data.cita?.paciente || null;
        this.medico = data.cita?.medico || null;
    }

    static fromJSON(data) {
        return new Receta(data);
    }

    toJSON() {
        return {
            id_receta: this.id_receta,
            id_cita: this.id_cita,
            fecha_expedicion: this.fecha_expedicion,
            surtida: this.surtida
        };
    }
}

