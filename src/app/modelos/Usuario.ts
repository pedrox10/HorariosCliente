export enum EstadoUsuario {
  Inactivo,
  Activo,
}

export class Usuario {
  id?: number;
  uid: number;
  ci: number;
  nombre: string;
  estado: EstadoUsuario;
  seleccionado: boolean;
  fechaAlta: Date
  fechaBaja: Date
  fechaCumpleano: Date

  constructor(uid:number, ci: number, nombre: string, estado: EstadoUsuario, fechaAlta: Date, fechaBaja: Date, fechaCumpleano: Date) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.estado = estado
    this.seleccionado = false;
    this.fechaAlta = fechaAlta;
    this.fechaBaja = fechaBaja;
    this.fechaCumpleano = fechaCumpleano;
  }
}
