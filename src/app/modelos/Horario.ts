export class Horario {
  id:number;
  nombre: string
  tolerancia:number
  color: string
  area: string
  descripcion: string
  jornadaDias:  any
  incluyeFeriados: boolean
  jornadasDosDias: boolean
  diasIntercalados: boolean
  esContinuoDosDias: boolean

  constructor(id: number, nombre: string, tolerancia:number, color: string, area: string, descripcion: string,
              incluyeFeriados: boolean, jornadasDosDias: boolean, diasIntercalados: boolean, esContinuoDosDias: boolean, jornadaDias:any) {
    this.id = id;
    this.nombre = nombre;
    this.tolerancia = tolerancia
    this.color = color
    this.area = area
    this.descripcion = descripcion
    this.incluyeFeriados = incluyeFeriados
    this.jornadasDosDias = jornadasDosDias
    this.diasIntercalados = diasIntercalados
    this.esContinuoDosDias = esContinuoDosDias
    this.jornadaDias = jornadaDias
  }

}
