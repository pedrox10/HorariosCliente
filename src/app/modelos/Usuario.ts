import {Terminal} from "./Terminal";
import {Grupo} from "./Grupo";
import {SafeHtml} from "@angular/platform-browser";

export enum EstadoUsuario {
  Inactivo,
  Activo,
  Eliminado,
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
  ultAsignacion?: string
  ultMarcacion?: string
  grupo: Grupo;
  horarioHtml?: SafeHtml; // Añade esta propiedad
  estadoHtml?: SafeHtml;  // Añade esta propiedad

  constructor(uid:number, ci: number, nombre: string, estado: EstadoUsuario, fechaAlta: Date, fechaBaja: Date,
              fechaCumpleano: Date, grupo: Grupo) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.estado = estado
    this.seleccionado = false;
    this.fechaAlta = fechaAlta;
    this.fechaBaja = fechaBaja;
    this.fechaCumpleano = fechaCumpleano;
    this.grupo = grupo
  }
}
