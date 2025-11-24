import {Grupo} from "./Grupo";

export class Terminal {
  id: number;
  nombre: string;
  ip: string;
  puerto: number;
  numSerie: string;
  modelo: string;
  totalMarcaciones: number;
  ultSincronizacion: Date;
  categoria: number;
  tieneConexion: boolean;
  porSincronizar: boolean;
  latitud: number;
  longitud: number;
  grupos: Grupo[]

  constructor(id: number, nombre: string, ip: string, puerto: number, tieneConexion: boolean,
              numSerie: string, totalMarcaciones: number, categoria: number,
              modelo: string, ultSincronizacion: Date, grupos: Grupo[], porSincronizar: boolean,
              latitud: number, longitud: number) {
    this.id = id;
    this.nombre = nombre;
    this.ip = ip;
    this.puerto = puerto;
    this.tieneConexion = tieneConexion
    this.porSincronizar = porSincronizar
    this.numSerie = numSerie
    this.modelo = modelo
    this.latitud = latitud
    this.longitud = longitud
    this.totalMarcaciones = totalMarcaciones
    this.categoria = categoria
    this.ultSincronizacion = ultSincronizacion
    this.grupos = grupos
  }
}
