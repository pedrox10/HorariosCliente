import {Injectable} from '@angular/core';
import {Usuario} from "../modelos/Usuario";

@Injectable({providedIn: "root"})
export class DataService {
  usuarios: Usuario[] = [];
  fechaIni: string = "";
  fechaFin: string = "";

  constructor() {
  }

  cambiarDatos(usuarios: Usuario[], fechaIni: string, fechaFin: string) {
    this.usuarios = usuarios
    this.fechaIni = fechaIni
    this.fechaFin = fechaFin
  }
}


