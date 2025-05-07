export class Horario {
  id:number;
  nombre: string
  tolerancia:number
  color: string
  area: string
  descripcion: string
  jornadaDias:  any
  jornadasDosDias: boolean
  diasIntercalados: boolean

  constructor(id: number, nombre: string, tolerancia:number, color: string, area: string, descripcion: string, jornadasDosDias: boolean, diasIntercalados: boolean, jornadaDias:any) {
    this.id = id;
    this.nombre = nombre;
    this.tolerancia = tolerancia
    this.color = color
    this.area = area
    this.descripcion = descripcion
    this.jornadasDosDias = jornadasDosDias
    this.diasIntercalados = diasIntercalados
    this.jornadaDias = jornadaDias
  }

}
