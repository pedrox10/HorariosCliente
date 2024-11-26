export class Terminal {
  id: number;
  nombre: string;
  ip: string;
  puerto: number;
  ult_sincronizacion?: Date;

  constructor(id: number, nombre: string, ip: string, puerto: number) {
    this.id = id;
    this.nombre = nombre;
    this.ip = ip;
    this.puerto = puerto;
  }
}
