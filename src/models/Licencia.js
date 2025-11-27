export class Licencia {
    constructor(data) {
        this.id_licencia = data.id_licencia;
        this.codigo_medico = data.codigo_medico;
        this.fecha_inicio = data.fecha_inicio;
        this.fecha_fin = data.fecha_fin;
        this.duracion_dias = data.duracion_dias;
    }  

    static fromJSON(data) {
        return new Licencia(data);
    }

    toJSON() {
        return {
            id_licencia: this.id_licencia,
            codigo_medico: this.codigo_medico,
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            duracion_dias: this.duracion_dias,
        };
    }
}