export class Usuario {
  id: number;
  ci: number;
  nombre: string;
  genero: string;
  seleccionado: boolean;

  constructor(id: number, ci: number, nombre: string, cargo: string, genero: string) {
    this.id = id;
    this.ci = ci;
    this.nombre = nombre;
    this.genero = genero;
    this.seleccionado = false;
  }
}
