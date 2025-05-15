export class Terminal {
  id: number;
  nombre: string;
  ip: string;
  puerto: number;
  numSerie: string;
  totalMarcaciones: number;
  ultSincronizacion: Date;
  categoria: number;
  tieneConexion: boolean;

  constructor(id: number, nombre: string, ip: string, puerto: number, tieneConexion: boolean,
              numSerie: string, totalMarcaciones: number, categoria: number, ultSincronizacion: Date) {
    this.id = id;
    this.nombre = nombre;
    this.ip = ip;
    this.puerto = puerto;
    this.tieneConexion = tieneConexion
    this.numSerie = numSerie
    this.totalMarcaciones = totalMarcaciones
    this.categoria = categoria
    this.ultSincronizacion = ultSincronizacion
  }
}
