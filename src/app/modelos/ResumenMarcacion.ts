import {InfoMarcacion} from "./InfoMarcacion";
import {Usuario} from "./Usuario";

export class ResumenMarcacion{

  usuario: Usuario;
  totalCantRetrasos:number;
  totalMinRetrasos: number;
  totalSinMarcar: number;
  totalAusencias: number;
  infoMarcaciones: InfoMarcacion[];

  constructor(usuario: Usuario, totalCantRetrasos: number, totalMinRetrasos: number, totalSinMarcar: number, totalAusencias: number, infoMarcaciones: InfoMarcacion[]) {
    this.usuario = usuario
    this.totalCantRetrasos = totalCantRetrasos
    this.totalMinRetrasos = totalMinRetrasos
    this.totalSinMarcar = totalSinMarcar
    this.totalAusencias = totalAusencias
    this.infoMarcaciones = infoMarcaciones
  }
}

export interface IReporte {
  nombre: string;
  ci: number;
  fechaAlta: string,
  retraso: number,
  sinMarcar: number,
  faltas: number,
}

