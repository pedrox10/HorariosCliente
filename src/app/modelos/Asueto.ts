export enum TipoAsueto {
  Algunos,
  Todos,
}

export class Asueto {
  id?: number;
  fecha: Date
  nombre: string;
  tipo: TipoAsueto;
  descripcion: string;

  constructor(fecha: Date, nombre: string, tipo: TipoAsueto, descripcion: string) {
    this.fecha = fecha;
    this.nombre = nombre;
    this.tipo = tipo
    this.descripcion = descripcion
  }
}
