import {InfoMarcacion} from "./InfoMarcacion";
import {Usuario} from "./Usuario";

export class ResumenMarcacion{

  usuario: Usuario;
  totalCantRetrasos:number;
  totalMinRetrasos: number;
  multaRetrasos: number;
  totalSinMarcar: number;
  multaSinMarcar: number;
  totalSalAntes: number;
  multaSalAntes: number;
  totalAusencias: number;
  multaAusencias: number;
  totalSanciones: number
  totalPermisosSG: number;
  diasComputados: number;
  infoMarcaciones: InfoMarcacion[];
  mensajeError?: string | any
  sinAsignar?: number;

  constructor(usuario: Usuario, totalCantRetrasos: number, totalMinRetrasos: number, totalSalAntes: number,
              multaRetrasos: number, multaSinMarcar: number, multaSalAntes: number, multaAusencias: number,
              totalSinMarcar: number, totalAusencias: number, totalPermisosSG: number,
              diasComputados: number, infoMarcaciones: InfoMarcacion[], totalSanciones: number) {
    this.usuario = usuario
    this.totalCantRetrasos = totalCantRetrasos
    this.totalMinRetrasos = totalMinRetrasos
    this.totalSalAntes = totalSalAntes
    this.totalSinMarcar = totalSinMarcar
    this.totalAusencias = totalAusencias
    this.totalPermisosSG = totalPermisosSG
    this.diasComputados = diasComputados
    this.infoMarcaciones = infoMarcaciones
    this.multaRetrasos = multaRetrasos
    this.multaSinMarcar = multaSinMarcar
    this.multaSalAntes = multaSalAntes
    this.multaAusencias = multaAusencias
    this.totalSanciones = totalSanciones
  }
}

export interface IReporte {
  nombre: string;
  ci: number;
  fechaAlta: string,
  diasComputados: number,
  retraso: number,
  sinMarcar: number,
  salAntes: number,
  faltas: number,
  observaciones: string
  detalleRetrasos: string
}

