import {Terminal} from "./Terminal";

export enum EstadoUsuario {
  Inactivo,
  Activo,
}

export class Usuario {
  id?: number | any;
  uid: number;
  ci: number;
  nombre: string;
  estado: EstadoUsuario;
  seleccionado: boolean;
  fechaAlta: Date
  fechaBaja: Date
  fechaCumpleano: Date
  horarioMes: string

  constructor(uid:number, ci: number, nombre: string, estado: EstadoUsuario, fechaAlta: Date, fechaBaja: Date, fechaCumpleano: Date, horarioMes: string) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.estado = estado
    this.seleccionado = false;
    this.fechaAlta = fechaAlta;
    this.fechaBaja = fechaBaja;
    this.fechaCumpleano = fechaCumpleano;
    this.horarioMes = horarioMes;
  }
}
