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

  constructor(uid:number, ci: number, nombre: string, estado: EstadoUsuario) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.estado = estado
    this.seleccionado = false;
  }
}
