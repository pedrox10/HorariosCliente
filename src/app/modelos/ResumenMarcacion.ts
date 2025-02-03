import {InfoMarcacion} from "./InfoMarcacion";
import {Usuario} from "./Usuario";

export class ResumenMarcacion{

  usuario: Usuario;
  totalCantRetrasos:number;
  totalMinRetrasos: number;
  totalSinMarcar: number;
  infoMarcaciones: InfoMarcacion[];

  constructor(usuario: Usuario, totalCantRetrasos: number, totalMinRetrasos: number, totalSinMarcar: number, infoMarcaciones: InfoMarcacion[]) {
    this.usuario = usuario
    this.totalCantRetrasos = totalCantRetrasos
    this.totalMinRetrasos = totalMinRetrasos
    this.totalSinMarcar = totalSinMarcar
    this.infoMarcaciones = infoMarcaciones
  }
}
