import {InfoMarcacion} from "./InfoMarcacion";

export class ResumenMarcacion{
    totalCantRetrasos:number;
    totalMinRetrasos: number;
    totalSinMarcar: number;
    infoMarcaciones: InfoMarcacion[];

    constructor(totalCantRetrasos: number, totalMinRetrasos: number, totalSinMarcar: number, infoMarcaciones: InfoMarcacion[]) {
      this.totalCantRetrasos = totalCantRetrasos
      this.totalMinRetrasos = totalMinRetrasos
      this.totalSinMarcar = totalSinMarcar
      this.infoMarcaciones = infoMarcaciones
    }
}
