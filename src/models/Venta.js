// src/models/Venta.js
export class Venta {
    constructor(data) {
        this.id_venta = data.id_venta;
        this.id_farmacia = data.id_farmacia;
        this.id_medicamento = data.id_medicamento;
        this.fecha_venta = data.fecha_venta || new Date().toISOString().split('T')[0];
        this.hora_venta = data.hora_venta || null; // Agregar hora_venta
        this.total = data.total || 0;
        this.tipo = data.tipo || 'venta';
        this.vendedor = data.vendedor || null; // Agregar vendedor
        this.medicamento = data.medicamento || null; // Agregar medicamento del JOIN
        // Campos 
        this.producto = data.producto || '';
        this.cantidad = data.cantidad || 1;
    }

    static fromJSON(data) {
        return new Venta(data);
    }

    toJSON() {
        return {
            id_venta: this.id_venta,
            id_farmacia: this.id_farmacia,
            id_medicamento: this.id_medicamento,
            fecha_venta: this.fecha_venta,
            total: this.total,
            tipo: this.tipo,
            producto: this.producto,
            cantidad: this.cantidad
        };
    }
}

