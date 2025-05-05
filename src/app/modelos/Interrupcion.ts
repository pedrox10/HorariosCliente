import {Terminal} from "./Terminal";

export class Interrupcion {
  id: number;
  fecha: Date;
  motivo: string
  horaIni: Date;
  horaFin: Date;
  detalle: string
  terminal: Terminal

  constructor(id: number, fecha: Date, motivo: string, horaIni: Date,  horaFin: Date, detalle: string, terminal: Terminal) {
    this.id = id;
    this.fecha = fecha;
    this.motivo = motivo
    this.horaIni = horaIni
    this.horaFin = horaFin
    this.detalle = detalle
    this.terminal = terminal
  }
}
