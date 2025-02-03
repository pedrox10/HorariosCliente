import {EstadoUsuario} from "./Usuario";
import {EstadoJornada} from "./Jornada";
export class InfoMarcacion{
  dia:string;
  horario: string;
  priEntradas: string[]
  priSalidas: string[]
  segEntradas: string[]
  segSalidas: string[]
  cantRetrasos: number
  minRetrasos: number
  noMarcados: number
  hayPriRetraso: boolean
  haySegRetraso: boolean
  mensaje: string
  activo:boolean
  numTurnos: number
  estado: EstadoJornada

  constructor(dia:string, horario: string, priEntradas: string[], priSalidas: string[], segEntradas: string[],
              segSalidas: string[], cantRetrasos: number, minRetrasos: number, noMarcados: number, hayPriRetraso: boolean,
              haySegRetraso: boolean, mensaje: string, activo: boolean, numTurnos: number, estado: EstadoJornada) {

    this.dia = dia;
    this.horario = horario;
    this.priEntradas = priEntradas;
    this.priSalidas = priSalidas;
    this.segEntradas = segEntradas;
    this.segSalidas = segSalidas;
    this.cantRetrasos = cantRetrasos
    this.minRetrasos = minRetrasos;
    this.noMarcados = noMarcados
    this.hayPriRetraso = hayPriRetraso
    this.haySegRetraso = haySegRetraso
    this.mensaje = mensaje
    this.activo = activo
    this.numTurnos = numTurnos
    this.estado = estado
  }
}
