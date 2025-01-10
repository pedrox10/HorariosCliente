export class Horario {
  id:number;
  nombre: string
  tolerancia:number
  color: string
  descripcion: string
  jornadaDias:  any

  constructor(id: number, nombre: string, tolerancia:number, color: string, descripcion: string, jornadaDias:any) {
    this.id = id;
    this.nombre = nombre;
    this.tolerancia = tolerancia
    this.color = color
    this.descripcion = descripcion
    this.jornadaDias = jornadaDias
  }

}
