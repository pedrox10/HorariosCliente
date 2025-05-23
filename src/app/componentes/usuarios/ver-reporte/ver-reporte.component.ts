import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as XLSX from "xlsx-js-style";
import {ModalService} from "ngx-modal-ease";
import {TerminalService} from "../../../servicios/terminal.service";
import {Usuario} from "../../../modelos/Usuario";
import {HttpClientModule} from "@angular/common/http";
import {concatMap, from, Subject, takeUntil, toArray} from "rxjs";
import {IReporte, ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {color, format, mensaje} from "../../inicio/Global";
import {InfoMarcacion} from "../../../modelos/InfoMarcacion";
import moment from "moment";
import {EstadoJornada} from "../../../modelos/Jornada";
import {CommonModule, Location} from "@angular/common";
import {DataService} from "../../../servicios/data.service";
import {Router, RouterLink} from "@angular/router";
import {VerHorarioComponent} from "../ver-horario/ver-horario.component";
import {EditarUsuarioComponent} from "../editar-usuario/editar-usuario.component";
import {AsignarHorariosComponent} from "../../horarios/asignar-horarios/asignar-horarios.component";
import {Terminal} from "../../../modelos/Terminal";
import {env} from "../../../../environments/environments";

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [HttpClientModule, RouterLink, CommonModule],
  providers: [TerminalService, DataService],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})

export class VerReporteComponent implements OnInit{

  usuarios: Usuario[] = [];
  fileName= 'ExcelSheet.xlsx';
  terminal: string | any;
  fechaIni: string | any;
  fechaFin: string | any;
  fechaCreacion: string | any;
  resumenMarcaciones: ResumenMarcacion[] = [];
  rmActual: ResumenMarcacion | any;
  filasExcel = [] as Array<IReporte>
  private destroy$ = new Subject<void>();
  showScrollButton = false;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;
  originalResumenMarcaciones: ResumenMarcacion[] = [];

  constructor(private modalService: ModalService, private terminalService: TerminalService,
              private location: Location, private router: Router) {

  }

  ngOnInit() {
    const data=JSON.parse(sessionStorage.getItem('reporte') || '[]')
    this.originalResumenMarcaciones = data;
    this.resumenMarcaciones = data;
    this.terminal = sessionStorage.getItem("terminal")
    this.fechaIni = sessionStorage.getItem("fechaIni")
    this.fechaFin = sessionStorage.getItem("fechaFin")
    this.fechaCreacion = sessionStorage.getItem("fechaCreacion")
    for(let resumenMarcacion of this.resumenMarcaciones) {
      let fila = {} as IReporte;
      fila.nombre = resumenMarcacion.usuario.nombre;
      fila.ci = resumenMarcacion.usuario.ci;
      fila.fechaAlta = format(resumenMarcacion.usuario.fechaAlta);
      fila.diasComputados = resumenMarcacion.diasComputados;
      fila.retraso = resumenMarcacion.totalMinRetrasos;
      fila.sinMarcar = resumenMarcacion.totalSinMarcar;
      fila.salAntes = resumenMarcacion.totalSalAntes
      fila.faltas = resumenMarcacion.totalAusencias;

      this.filasExcel.push(fila)
    }

    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.cerrarOcultar()
      }
    });
    document.getElementById("fondo_ocultar")?.addEventListener("click", (e) => {
      this.cerrarOcultar()
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  verMarcaciones(usuario: Usuario) {
    env.indexResumenMarcacion = usuario.id
    this.router.navigate(['/ver-marcaciones', usuario.id, this.fechaIni, this.fechaFin]);
  }

  modalCambiarHorario(usuario: Usuario) {
    console.log(usuario)
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    let usuarios: Usuario[] = [];
    usuarios.push(usuario);
    let fechaMin = usuario.fechaAlta;
    this.modalService.open(AsignarHorariosComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {usuarios, fechaMin}
    })
      .subscribe((data) => {
        if (data !== undefined)
          this.actualizarResumenMarcaciones(usuario)
      });
  }

  modalVerHorario(id_usuario: number | any) {
    let id = id_usuario;
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(VerHorarioComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {id}
    })
      .subscribe((data) => {
        if (data !== undefined)
          console.log(data)
      });
  }

  modalEditarUsuario(id_usuario: number | any) {
    let id = id_usuario;
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(EditarUsuarioComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {id}
    })
      .subscribe((data) => {
        if (data !== undefined)
          this.actualizarResumenMarcaciones(data)
      });
  }

  actualizarResumenMarcaciones(usuario: Usuario) {
    const indice = this.resumenMarcaciones.findIndex(
      resumen => resumen.usuario.id === usuario.id
    );

    this.terminalService.getResumenMarcaciones(usuario.id!, this.fechaIni, this.fechaFin).subscribe(
      (data: any) => {
        let rm: ResumenMarcacion = data;
        this.resumenMarcaciones[indice] = rm
        let reporte = JSON.parse(sessionStorage.getItem('reporte') || '[]');
        reporte[indice] = rm
        sessionStorage.setItem('reporte', JSON.stringify(reporte));
        mensaje("¡Reporte actualizado!", "is-success")
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ocultarRegistro() {
    const index = this.resumenMarcaciones.findIndex(i => i.usuario.id === this.rmActual.usuario.id);
    if (index !== -1) {
      // Eliminar del array en memoria
      this.resumenMarcaciones.splice(index, 1);
      // Eliminar del sessionStorage
      let reporte = JSON.parse(sessionStorage.getItem('reporte') || '[]');
      reporte.splice(index, 1);
      sessionStorage.setItem('reporte', JSON.stringify(reporte));
      this.cerrarOcultar()
    }
  }

  mostrarOcultar(rm: ResumenMarcacion) {
    document.getElementById("ocultar_modal")?.classList.add("is-active");
    this.rmActual = rm;
  }

  cerrarOcultar() {
    document.getElementById("ocultar_modal")?.classList.remove("is-active");
  }

  irAtras() {
    this.location.back();
  }

  imprimir() {
    window.print();
  }

  exportexcel(): void {
    const headers = [
      "Nombre",
      "CI",
      "Fecha de Alta",
      "Días Computados",
      "Retraso [min]",
      "Sin Marcar",
      "Salió Antes",
      "Faltas",
    ];

    const colWidths = [
      { wch: 30 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 7.5 }, { wch: 7.5 }, { wch: 7.5 }, { wch: 7.5 }
    ];

    const userData = this.filasExcel;

    const worksheet = XLSX.utils.json_to_sheet([]);

    // 👉 1. Agregar cabecera principal
    const titulo = [["Reporte General " + this.terminal]];
    const subCabecera = [
      ["Rango de Fechas:", moment(this.fechaIni, "YYYYMMDD").format("DD/MM/YYYY") + " - " + moment(this.fechaFin, "YYYYMMDD").format("DD/MM/YYYY")],
      ["Total Días:", this.getTotalDias()],
      ["Fecha de Creación:", this.fechaCreacion]
    ];

    XLSX.utils.sheet_add_aoa(worksheet, titulo, { origin: "A1" });
    XLSX.utils.sheet_add_aoa(worksheet, subCabecera, { origin: "A2" });

    // 👉 2. Aplicar estilo al título
    worksheet["A1"].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center" }
    };

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } }
    ];



    // 👉 3. Agregar headers y datos
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: `A5` });
    XLSX.utils.sheet_add_json(worksheet, userData, {
      skipHeader: true,
      origin: "A6"
    });

    // 👉 4. Dimensiones
    worksheet['!cols'] = colWidths;
    worksheet['!rows'] = [
      { hpt: 30 }, // Título
      { hpt: 20 }, // Subcabecera 1
      { hpt: 20 }, // Subcabecera 2
      { hpt: 20 }, // Subcabecera 3
      { hpt: 30 }, // Headers
      ...Array.from({ length: userData.length }, () => ({ hpt: 20 }))
    ];

    // 👉 5. Estilos generales
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
    for (let row = 0; row <= range.e.r; row++) {
      for (let col = 0; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        worksheet[cellRef] = worksheet[cellRef] || {};
        worksheet[cellRef].s = worksheet[cellRef].s || {};
        worksheet[cellRef].s.alignment = { horizontal: "left", wrapText: true };

        // Estilo para headers
        if (row === 4) {
          worksheet[cellRef].s = {
            ...worksheet[cellRef].s,
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '295A8C' } }
          };
        }
      }
    }

    // 👉 6. Crear y descargar
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Reporte');
    XLSX.writeFile(wb, this.fileName);
  }

  formatear(fecha: Date) {
    return format(fecha)
  }

  getFechaIni() {
    return moment(this.fechaIni).format("DD/MM/YYYY")
  }

  getFechaFin() {
    return moment(this.fechaFin).format("DD/MM/YYYY")
  }

  getTotalDias() {
    let fin = moment(this.fechaFin);
    let ini = moment(this.fechaIni);
    return fin.diff(ini, 'days') + 1 // =1
  }

  getRetrasos(infoMarcaciones: InfoMarcacion[]) {
    let retrasos = "";
    for (let info of infoMarcaciones) {
      if(info.cantRetrasos > 0) {
        retrasos = retrasos + "<div class='hbox'><div class='hitem'>" +
          "<span><i class='fas fa-calendar-alt'></i></span>" +
          "<span class='semibold'>" + moment(info.fecha).format("DD/MM/YYYY") + "</span></div>" +
        "<div class='hitem'>" +
          "<span>" + info.minRetrasos + " min.</span></div></div>"
      }
    }
    return retrasos
  }

  getSinMarcar(infoMarcaciones: InfoMarcacion[]) {
    let noMarcados = "";
    for (let info of infoMarcaciones) {
      if(info.noMarcados > 0) {
        noMarcados = noMarcados + "<div class='hbox'><div class='hitem'>" +
          "<span><i class='fas fa-calendar-alt'></i></span>" +
          "<span class='semibold'>" + moment(info.fecha).format("DD/MM/YYYY") + "</span></div>" +
          "<div class='hitem'>" +
          "<span>" + info.noMarcados + "</span></div></div>"
      }
    }
    return noMarcados;
  }

  getSalAntes(infoMarcaciones: InfoMarcacion[]) {
    let salidasAnticipadas = "";
    for (let info of infoMarcaciones) {
      if(info.cantSalAntes > 0) {
        salidasAnticipadas = salidasAnticipadas + "<div class='hbox'><div class='hitem'>" +
          "<span><i class='fas fa-calendar-alt'></i></span>" +
          "<span class='semibold'>" + moment(info.fecha).format("DD/MM/YYYY") + "</span></div>" +
          "<div class='hitem'>" +
          "<span>" + info.cantSalAntes + "</span></div></div>"
      }
    }
    return salidasAnticipadas;
  }

  getAusencias(infoMarcaciones: InfoMarcacion[]) {
    let ausencias = "";
    for (let info of infoMarcaciones) {
      if(info.estado == EstadoJornada.ausencia) {
        ausencias = ausencias + "<div class='hbox'><div class='hitem'>" +
          "<span><i class='fas fa-calendar-alt'></i></span>" +
          "<span class='semibold'>" + moment(info.fecha).format("DD/MM/YYYY") + "</span></div>" +
          "</div>"
      }
    }
    return ausencias;
  }

  getColor(nombre: string) {
    return color(nombre);
  }

  selectRow(id: number | any) {
    env.indexResumenMarcacion = id;
  }

  isSelected(id: number | any): boolean {
    return env.indexResumenMarcacion === id;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Muestra el botón si el usuario ha hecho scroll más allá del viewport
    this.showScrollButton = window.scrollY > window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Lógica de clic en encabezado para alternar asc → desc → none */
  onSort(column: string): void {
    if (column === 'ci') return;   // ignorar CI si no quieres ordenarlo

    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc')      this.sortDirection = 'desc';
      else if (this.sortDirection === 'desc') this.sortDirection = null;
      else                                    this.sortDirection = 'asc';
    } else {
      this.sortColumn    = column;
      this.sortDirection = 'asc';
    }

    if (!this.sortDirection) {
      // restaurar orden original
      this.resumenMarcaciones = [...this.originalResumenMarcaciones];
    } else {
      this.applySort();
    }
  }

  /** Aplica el sort según estado */
  applySort(): void {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const col = this.sortColumn!;

    this.resumenMarcaciones = [...this.resumenMarcaciones].sort((a, b) => {
      let aVal: any, bVal: any;
      switch (col) {
        case 'nombre':
          aVal = a.usuario.nombre.toLowerCase();
          bVal = b.usuario.nombre.toLowerCase();
          break;
        case 'fechaAlta':
          aVal = new Date(a.usuario.fechaAlta).getTime();
          bVal = new Date(b.usuario.fechaAlta).getTime();
          break;
        case 'diasComputados':
          aVal = a.diasComputados; bVal = b.diasComputados; break;
        case 'retraso':
          aVal = a.totalMinRetrasos; bVal = b.totalMinRetrasos; break;
        case 'sinMarcar':
          aVal = a.totalSinMarcar; bVal = b.totalSinMarcar; break;
        case 'salAntes':
          aVal = a.totalSalAntes; bVal = b.totalSalAntes; break;
        case 'faltas':
          aVal = a.totalAusencias; bVal = b.totalAusencias; break;
        default:
          return 0;
      }

      // comparación numérica o string
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      return aVal.localeCompare(bVal) * dir;
    });
  }

  getSortClass(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';            // estado “sin ordenar”
    }
    if (this.sortDirection === 'asc') {
      return 'fa-sort-up';         // orden ascendente
    }
    if (this.sortDirection === 'desc') {
      return 'fa-sort-down';       // orden descendente
    }
    return 'fa-sort';             // fallback
  }
}
