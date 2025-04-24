export class Sincronizacion {
  id: number;
  fecha: Date;
  horaServidor: Date;
  nuevasMarcaciones: number;
  totalMarcaciones: number;
  usuariosAgregados: number;
  usuariosEditados: number;
  usuariosEliminados: number;

  constructor(id: number, fecha: Date, horaServidor: Date, nuevasMarcaciones: number,
              totalMarcaciones: number, usuariosAgregados: number, usuariosEditados: number, usuariosEliminados: number) {
    this.id = id;
    this.fecha = fecha;
    this.horaServidor = horaServidor;
    this.nuevasMarcaciones = nuevasMarcaciones;
    this.totalMarcaciones = totalMarcaciones
    this.usuariosAgregados = usuariosAgregados
    this.usuariosEditados = usuariosEditados
    this.usuariosEliminados = usuariosEliminados
  }
}
