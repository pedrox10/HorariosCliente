export class Jornada {
  id: number;
  fecha: string;
  horario: any;
  priTurno: any;
  segTurno: any;
  estado: number;
  infoExtra: any;

  constructor(id: number, fecha: string, horario:any, priTurno: any, segTurno: any, estado: number, infoExtra: any) {
    this.id = id;
    this.fecha = fecha;
    this.horario = horario;
    this.priTurno = priTurno;
    this.segTurno = segTurno;
    this.estado = estado;
    this.infoExtra = infoExtra;
  }
}
