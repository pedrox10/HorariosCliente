export class Terminal {
  id: number;
  nombre: string;
  ip: string;
  puerto: number;
  ult_sincronizacion?: Date;
  tieneConexion: boolean;

  constructor(id: number, nombre: string, ip: string, puerto: number, tieneConexion: boolean) {
    this.id = id;
    this.nombre = nombre;
    this.ip = ip;
    this.puerto = puerto;
    this.tieneConexion = tieneConexion
  }
}
