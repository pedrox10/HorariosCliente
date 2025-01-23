export enum TipoExcepcion {
  rango,
  completa,
}

export class ExcepcionTickeo {
  id?: number;
  fecha: Date
  tipo: TipoExcepcion;
  horaIni?: string;
  horaFin?: string;
  licencia: string;
  detalle: string;

  constructor(fecha: Date, tipo: TipoExcepcion, licencia: string, detalle: string) {
    this.fecha = fecha;
    this.tipo = tipo;
    this.licencia = licencia
    this.detalle = detalle
  }
}
