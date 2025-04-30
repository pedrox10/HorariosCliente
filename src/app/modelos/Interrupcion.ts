import {Terminal} from "./Terminal";

export class Interrupcion {
  id: number;
  fecha: Date;
  horaIni: Date;
  horaFin: Date;
  tipo: string
  detalle: string
  terminal: Terminal

  constructor(id: number, fecha: Date,  horaIni: Date,  horaFin: Date, tipo: string, detalle: string, terminal: Terminal) {
    this.id = id;
    this.fecha = fecha;
    this.horaIni = horaIni
    this.horaFin = horaFin
    this.tipo = tipo
    this.detalle = detalle
    this.terminal = terminal
  }
}
