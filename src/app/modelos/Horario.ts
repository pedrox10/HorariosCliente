export class Horario {
  id:number;
  nombre: string
  tolerancia:number
  color: string
  descripcion: string

  constructor(id: number, nombre: string, tolerancia:number, color: string, descripcion: string) {
    this.id = id;
    this.nombre = nombre;
    this.tolerancia = tolerancia
    this.color = color
    this.descripcion = descripcion
  }

}
