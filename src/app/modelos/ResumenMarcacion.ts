import {InfoMarcacion} from "./InfoMarcacion";
import {Usuario} from "./Usuario";

export class ResumenMarcacion{
  usuario: Usuario;
  totalCantRetrasos:number;
  totalMinRetrasos: number;
  multaRetrasos: number;
  totalSinMarcar: number;
  totalSinMarcarEntradas: number
  totalSinMarcarSalidas: number
  multaSinMarcar: number;
  totalSalAntes: number;
  multaSalAntes: number;
  totalAusencias: number;
  multaAusencias: number;
  totalSanciones: number
  //Contadores de excepciones
  totalExcTickeos: number
  totalInterrupciones: number
  totalTolerancias: number
  totalExcepciones: number
  totalVacaciones: number;
  totalBajas: number;
  totalPermisosSG: number;
  totalPermisos: number;
  totalLicencias: number;
  totalCapacitaciones: number;
  totalOtros: number;
  diasComputados: number;
  infoMarcaciones: InfoMarcacion[];
  organigrama?: any
  sinAsignar?: number;

  constructor(usuario: Usuario, totalCantRetrasos: number, totalMinRetrasos: number, totalSalAntes: number,
              multaRetrasos: number, multaSinMarcar: number, multaSalAntes: number, multaAusencias: number,
              totalExcTickeos: number, totalInterrupciones: number, totalTolerancias: number, totalExcepciones: number,
              totalVacaciones: number, totalBajas: number, totalPermisos: number, totalLicencias: number,
              totalCapacitaciones: number, totalOtros: number, totalSinMarcar: number, totalAusencias: number,
              totalPermisosSG: number, diasComputados: number, infoMarcaciones: InfoMarcacion[], totalSanciones: number,
              totalSinMarcarEntradas: number, totalSinMarcarSalidas: number) {
    this.usuario = usuario
    this.totalCantRetrasos = totalCantRetrasos
    this.totalMinRetrasos = totalMinRetrasos
    this.totalSalAntes = totalSalAntes
    this.totalSinMarcar = totalSinMarcar
    this.totalSinMarcarEntradas = totalSinMarcarEntradas
    this.totalSinMarcarSalidas = totalSinMarcarSalidas
    this.totalAusencias = totalAusencias
    this.diasComputados = diasComputados
    this.infoMarcaciones = infoMarcaciones
    this.multaRetrasos = multaRetrasos
    this.multaSinMarcar = multaSinMarcar
    this.multaSalAntes = multaSalAntes
    this.multaAusencias = multaAusencias
    this.totalSanciones = totalSanciones
    //Contadores de excepciones
    this.totalExcTickeos = totalExcTickeos
    this.totalInterrupciones = totalInterrupciones
    this.totalTolerancias = totalTolerancias
    this.totalExcepciones = totalExcepciones
    this.totalVacaciones = totalVacaciones;
    this.totalBajas = totalBajas;
    this.totalPermisosSG = totalPermisosSG
    this.totalPermisos = totalPermisos;
    this.totalLicencias = totalLicencias;
    this.totalCapacitaciones = totalCapacitaciones;
    this.totalOtros = totalOtros;
  }
}

export interface IReporte {
  nombre: string;
  ci: number;
  fechaAlta: string,
  diasComputados: number,
  retraso: number,
  sinMarcarEnt: number,
  sinMarcarSal: number,
  sinMarcar: number,
  salAntes: number,
  faltas: number,
  totalSancion: number,
  permisosSG: number,
  observaciones: string
  detalleRetrasos: string
}

