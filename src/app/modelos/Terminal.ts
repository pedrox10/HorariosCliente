export class Terminal {
  id: number;
  nombre: string;
  ip: string;
  puerto: number;
  numSerie: string;
  totalMarcaciones: number;
  ultSincronizacion: Date;
  tieneConexion: boolean;

  constructor(id: number, nombre: string, ip: string, puerto: number, tieneConexion: boolean, numSerie: string, totalMarcaciones: number, ultSincronizacion: Date) {
    this.id = id;
    this.nombre = nombre;
    this.ip = ip;
    this.puerto = puerto;
    this.tieneConexion = tieneConexion
    this.numSerie = numSerie
    this.totalMarcaciones = totalMarcaciones
    this.ultSincronizacion = ultSincronizacion
  }
}
