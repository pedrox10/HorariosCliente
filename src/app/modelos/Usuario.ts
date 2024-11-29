export class Usuario {
  id?: number;
  uid: number;
  ci: number;
  nombre: string;
  seleccionado: boolean;

  constructor(uid:number, ci: number, nombre: string) {
    this.uid = uid;
    this.ci = ci;
    this.nombre = nombre;
    this.seleccionado = false;
  }
}
