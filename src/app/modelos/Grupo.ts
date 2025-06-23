export class Grupo {
  id: number;
  nombre: string; // Ej: 'Limpieza', 'Choferes', 'Serenos', 'Banda Municipal'
  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}
