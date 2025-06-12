import {InfoMarcacion} from "./InfoMarcacion";
import {Usuario} from "./Usuario";

export class ResumenMarcacion{

  usuario: Usuario;
  totalCantRetrasos:number;
  totalMinRetrasos: number;
  totalSalAntes: number;
  totalSinMarcar: number;
  totalAusencias: number;
  totalPermisosSG: number;
  diasComputados: number;
  infoMarcaciones: InfoMarcacion[];
  mensajeError?: string | any
  sinAsignar?: number;

  constructor(usuario: Usuario, totalCantRetrasos: number, totalMinRetrasos: number, totalSalAntes: number,
              totalSinMarcar: number, totalAusencias: number, totalPermisosSG: number,
              diasComputados: number, infoMarcaciones: InfoMarcacion[]) {
    this.usuario = usuario
    this.totalCantRetrasos = totalCantRetrasos
    this.totalMinRetrasos = totalMinRetrasos
    this.totalSalAntes = totalSalAntes
    this.totalSinMarcar = totalSinMarcar
    this.totalAusencias = totalAusencias
    this.totalPermisosSG = totalPermisosSG
    this.diasComputados = diasComputados
    this.infoMarcaciones = infoMarcaciones
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

