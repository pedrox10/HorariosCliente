export enum EstadoJornada {
  dia_libre,
  activa,
  feriado,
  vacacion,
  baja_medica,
  permiso,
  licencia,
  otro,
  sin_asignar,
  sin_registros,
  ausencia,
  teletrabajo
}

export class Jornada {
  id: number;
  fecha: string;
  horario: any;
  priTurno: any;
  segTurno: any;
  estado: EstadoJornada;
  esInvierno: boolean;
  esLactancia: boolean;
  infoExtra: any;

  constructor(id: number, fecha: string, horario:any, priTurno: any, segTurno: any, estado: EstadoJornada, esInvierno: boolean, esLactancia: boolean, infoExtra: any) {
    this.id = id;
    this.fecha = fecha;
    this.horario = horario;
    this.priTurno = priTurno;
    this.segTurno = segTurno;
    this.estado = estado;
    this.esInvierno = esInvierno;
    this.esLactancia = esLactancia;
    this.infoExtra = infoExtra;
  }
}
