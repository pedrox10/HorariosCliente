import {EstadoJornada} from "./Jornada";
export class InfoMarcacion{
  fecha: Date;
  dia:string;
  horario: any;
  priEntradas: string[]
  priSalidas: string[]
  segEntradas: string[]
  segSalidas: string[]
  cantRetrasos: number
  cantSalAntes: number
  minRetrasos: number
  noMarcados: number
  mensajeError?: string | any
  hayPriEntExcepcion?: any
  hayPriSalExcepcion?: any
  haySegEntExcepcion?: any
  haySegSalExcepcion?: any
  hayPriRetraso: boolean
  haySegRetraso: boolean
  hayPriAntes: boolean
  haySegAntes: boolean
  mensaje: string
  activo:boolean
  numTurnos: number
  estado: EstadoJornada
  esInvierno:boolean
  esLactancia:boolean
  esJornadaDosDias:boolean
  primerDia?: any

  constructor(fecha: Date, dia:string, horario: any, priEntradas: string[], priSalidas: string[], segEntradas: string[], segSalidas: string[],
              cantRetrasos: number, cantSalAntes: number, minRetrasos: number, noMarcados: number, hayPriRetraso: boolean,
              haySegRetraso: boolean, hayPriAntes: boolean, haySegAntes: boolean, mensaje: string, activo: boolean,
              numTurnos: number, estado: EstadoJornada, esInvierno: boolean, esLactancia: boolean, esJornadaDosDias: boolean) {

    this.fecha = fecha;
    this.dia = dia;
    this.horario = horario;
    this.priEntradas = priEntradas;
    this.priSalidas = priSalidas;
    this.segEntradas = segEntradas;
    this.segSalidas = segSalidas;
    this.cantRetrasos = cantRetrasos
    this.cantSalAntes = cantSalAntes;
    this.minRetrasos = minRetrasos;
    this.noMarcados = noMarcados
    this.hayPriRetraso = hayPriRetraso
    this.haySegRetraso = haySegRetraso
    this.hayPriAntes = hayPriAntes
    this.haySegAntes = haySegAntes
    this.mensaje = mensaje
    this.activo = activo
    this.numTurnos = numTurnos
    this.estado = estado
    this.esInvierno = esInvierno
    this.esLactancia = esLactancia
    this.esJornadaDosDias = esJornadaDosDias
  }
}

