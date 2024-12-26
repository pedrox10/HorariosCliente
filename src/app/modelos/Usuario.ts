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
  horarioActual: string

  constructor(uid:number, ci: number, nombre: string, estado: EstadoUsuario, horarioActual: string) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.estado = estado
    this.seleccionado = false;
    this.horarioActual = horarioActual;
  }
}
