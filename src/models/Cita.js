//src/models/cita.js
//termindo
export class cita{
    constructor (data){
        this.id_cita = data.id_cita;
        this.curp_paciente = data.curp_paciente ;
        this.codigo_medico = data.codigo_medico ;
        this.fecha = data.fecha ;
        this.horario = data.horario ;
        this.turno = data.turno;
        this.cancelada = data.cancelada ;
    }
    static fromJSON(data){
        return new Cita(data);
    }

    toJSON(){
        return{
            id_cita:this.id_cita,
            curp_paciente:this.curp_paciente,
            codigo_medico:this.codigo_medico,
            edad:this.edad,
            fecha:this.fecha,
            horario:this.horario,
            turno:this.turno,
            cancelada:this.cancelada,
        };
    }
}