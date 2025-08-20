export class Marcacion {
  id: number;
  fecha: Date;
  hora: Date;

  constructor(id: number, fecha: Date, hora: Date) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
  }
}
