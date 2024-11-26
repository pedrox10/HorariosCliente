export class Usuario {
  id?: number;
  ci: number;
  nombre: string;
  seleccionado: boolean;

  constructor(ci: number, nombre: string) {
    this.ci = ci;
    this.nombre = nombre;
    this.seleccionado = false;
  }
}
