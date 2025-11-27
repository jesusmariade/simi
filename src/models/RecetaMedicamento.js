export class RecetaMedicamento {
    constructor(data) {
        this.id_receta = data.id_receta;
        this.id_medicamento = data.id_medicamento;
        this.cantidad = data.cantidad;
        this.dosis = data.dosis;
        this.comprado = data.comprado;
        
    }

    static fromJSON(data){
        return new RecetaMedicamento(data);
    }

    toJSON(){
        return{
            id_receta: this.id_receta,
            id_medicamento: this.id_medicamento,
            cantidad: this.cantidad,
            dosis: this.dosis,
            comprado: this.comprado
            
        };
    }
}