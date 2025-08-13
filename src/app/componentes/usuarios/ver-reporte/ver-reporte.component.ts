import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as ExcelJS from 'exceljs';
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
import { HttpClient } from '@angular/common/http';
import {AuthService} from "../../../servicios/auth.service";

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
  fileName= '';
  terminal: string | any;
  fechaIni: string | any;
  fechaFin: string | any;
  usuario: string | any;
  fechaCreacion: string | any;
  resumenMarcaciones: ResumenMarcacion[] = [];
  rmActual: ResumenMarcacion | any;
  filasExcel = [] as Array<IReporte>
  private destroy$ = new Subject<void>();
  showScrollButton = false;
  sortColumn: string = "";
  sortDirection: string = "";
  originalResumenMarcaciones: ResumenMarcacion[] = [];

  constructor(private modalService: ModalService, private terminalService: TerminalService,
              private location: Location, private router: Router, private http: HttpClient,
              private eRef: ElementRef, public authService: AuthService) {

  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Si el clic NO fue dentro del input ni del ul#suggestions
    if (
      !this.eRef.nativeElement.querySelector('#tf_busqueda')?.contains(target) &&
      !this.eRef.nativeElement.querySelector('#suggestions')?.contains(target)
    ) {
      const suggestions = this.eRef.nativeElement.querySelector('#suggestions');
      if (suggestions) {
        suggestions.innerHTML = ''; // Oculta limpiando
      }
    }
  }

  ngOnInit() {
    const data=JSON.parse(sessionStorage.getItem('reporte') || '[]')
    this.originalResumenMarcaciones = data;
    this.resumenMarcaciones = data;
    this.sortColumn = env.sortColumn;
    this.sortDirection = env.sortDirection;
    if(this.sortColumn !== "")
      this.onSort(this.sortColumn);
    this.terminal = sessionStorage.getItem("terminal")
    this.fechaIni = sessionStorage.getItem("fechaIni")
    this.fechaFin = sessionStorage.getItem("fechaFin")
    this.usuario = sessionStorage.getItem("usuario")
    this.fechaCreacion = sessionStorage.getItem("fechaCreacion")
    for(let resumenMarcacion of this.resumenMarcaciones) {
      let fila = {} as IReporte;
      fila.nombre = resumenMarcacion.usuario.nombre;
      fila.ci = resumenMarcacion.usuario.ci;
      fila.fechaAlta = format(resumenMarcacion.usuario.fechaAlta);
      fila.diasComputados = resumenMarcacion.diasComputados;
      fila.retraso = resumenMarcacion.totalMinRetrasos;
      if(fila.retraso > 0) {
        let retrasos = "";
        for (let info of resumenMarcacion.infoMarcaciones) {
          if(info.cantRetrasos > 0) {
            retrasos = retrasos + moment(info.fecha).format("DD/MM/YYYY") + " " + info.minRetrasos + "\n"
          }
        }
        fila.detalleRetrasos= retrasos
      }
      fila.sinMarcar = resumenMarcacion.totalSinMarcar;
      fila.salAntes = resumenMarcacion.totalSalAntes
      fila.faltas = resumenMarcacion.totalAusencias;
      fila.totalSancion = resumenMarcacion.totalSanciones
      fila.permisosSG = resumenMarcacion.totalPermisosSG
      fila.observaciones = resumenMarcacion.mensajeError
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
  sugerencias: { ci: string, nombre: string }[] = [];

  ngAfterViewInit(): void {
    const input = document.getElementById('tf_busqueda') as HTMLInputElement;
    const lista = document.getElementById('suggestions') as HTMLUListElement;
    if (!input || !lista) return;
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      lista.innerHTML = '';
      if (query.length < 3) return;
      this.sugerencias = Array.from(document.querySelectorAll<HTMLTableRowElement>('table tbody tr'))
        .map(fila => ({
          ci: fila.getAttribute('data-ci') || '',
          nombre: fila.getAttribute('data-nombre') || ''
        }))
        .filter(f => f.ci.toLowerCase().includes(query) || f.nombre.toLowerCase().includes(query));

      this.sugerencias.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre}`;
        li.className = 'list-item';
        li.addEventListener('click', () => {
          input.value = `${item.nombre}`;
          lista.innerHTML = '';

          const fila = Array.from(document.querySelectorAll<HTMLTableRowElement>('table tbody tr'))
            .find(f =>
              f.getAttribute('data-ci') === item.ci &&
              f.getAttribute('data-nombre') === item.nombre
            );

          if (fila) {
            document.querySelectorAll('tr.is-selected').forEach(f => f.classList.remove('is-selected'));
            fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fila.classList.add('is-selected');
          }
        });
        lista.appendChild(li);
      });
    });
    setTimeout(() => {
      window.scrollTo({
        top: env.posYReporte,
        left: 0
      });
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  verMarcaciones(usuario: Usuario) {
    env.indexResumenMarcacion = usuario.id
    env.posYReporte = window.scrollY
    env.sortColumn = this.sortColumn;
    this.router.navigate(['/ver-marcaciones', usuario.id, this.fechaIni, this.fechaFin]);
  }

  verHorario(id_usuario: number | any) {
    env.indexResumenMarcacion = id_usuario;
    env.posYReporte = window.scrollY
    this.router.navigate(['/ver-horario', id_usuario]);
  }

  modalCambiarHorario(usuario: Usuario) {
    console.log(usuario)
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    let usuarios: Usuario[] = [];
    usuarios.push(usuario);
    let fechaMin = usuario.fechaAlta;
    let fechaIni = moment(this.fechaIni, "YYYYMMDD").toDate()
    let fechaFin = moment(this.fechaFin, "YYYYMMDD").toDate()
    this.modalService.open(AsignarHorariosComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {usuarios, fechaMin, fechaIni, fechaFin}
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
    env.posYReporte = 0;
    env.sortColumn = "";
    env.sortDirection = "";
    this.location.back();
  }

  imprimir() {
    window.print();
  }

  exportExcel(): void {
    const workbook = new ExcelJS.Workbook();
    fetch('assets/plantilla.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => workbook.xlsx.load(buffer))
      .then(() => {
        const worksheet = workbook.getWorksheet(1); // o por nombre: workbook.getWorksheet('Reporte');
        let rango = `${moment(this.fechaIni, 'YYYYMMDD').format('DD.MM.YYYY')}-${moment(this.fechaFin, 'YYYYMMDD').format('DD.MM.YYYY')}`;
        this.fileName = this.terminal + " " + rango + ".xlsx";
        // 👉 Cabecera
        worksheet!.getCell('C1').value = "PLANILLA DE  ASISTENCIA, RETRASOS Y DESCUENTOS " + this.terminal
        worksheet!.getCell('E2').value = `${moment(this.fechaIni, 'YYYYMMDD').format('DD/MM/YYYY')} - ${moment(this.fechaFin, 'YYYYMMDD').format('DD/MM/YYYY')}`;
        worksheet!.getCell('E3').value = this.getTotalDias();
        worksheet!.getCell('E4').value = this.fechaCreacion;
        worksheet!.getCell('E5').value = this.usuario;
        // 👉 2. Encabezados en A7
        const headers = [
          "#", "NOMBRE", "CI", "FECHA DE ALTA EN BIOMETRICO", "DÍAS COMP.",
          "RETRASO [min]", "SIN MARCAR", "SALIÓ ANTES", "FALTAS", "TOTAL SANCION [días]",
          "PERMISOS SG [días]", "OBSERVACIONES"
        ];
        headers.forEach((header, index) => {
          worksheet!.getCell(7, index + 1).value = header;
        });
        const estiloReferencia = worksheet!.getRow(8);
        // 👉 Datos desde fila 8
        const startRow = 8;
        this.filasExcel.forEach((fila, i) => {
          const row = worksheet!.getRow(startRow + i);
          row.height = 20;
          row.getCell(1).value = i + 1;
          row.getCell(2).value = fila.nombre;
          row.getCell(3).value = fila.ci;
          row.getCell(4).value = fila.fechaAlta;
          row.getCell(5).value = fila.diasComputados === undefined ? "" : fila.diasComputados;
          row.getCell(6).value = fila.retraso === undefined ? "" : fila.retraso;
          /*if(fila.retraso > 0 && fila.retraso !== undefined && fila.retraso !== null) {
            row.getCell(6).note = {
              texts: [
                {
                  font: { size: 8, bold: true },
                  text: 'Retrasos:\n' // El texto antes del salto de línea actúa como el título/autor
                },
                { font: { size: 8, color: { argb: 'FF000000' }, name: 'Arial' },
                  text: fila.detalleRetrasos
                },
              ],
            };
          }*/
          row.getCell(7).value = fila.sinMarcar === undefined ? "" : fila.sinMarcar;
          row.getCell(8).value = fila.salAntes === undefined ? "" : fila.salAntes;
          row.getCell(9).value = fila.faltas === undefined ? "" : fila.faltas;
          row.getCell(10).value = fila.totalSancion === undefined ? "" : fila.totalSancion;
          row.getCell(11).value = fila.permisosSG === undefined ? "" : fila.permisosSG;
          row.getCell(12).value = fila.observaciones || '';
          row.eachCell((cell, colNumber) => {
            const refCell = estiloReferencia.getCell(colNumber);
            cell.style = { ...refCell.style };
          });
          row.commit();
        });

        // 👉 Descargar
        workbook.xlsx.writeBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.fileName || 'reporte.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
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
        ausencias = ausencias +
          "<div class='hbox'><div class='hitem'>" +
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
    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc') {
        env.sortDirection = "asc"
        this.sortDirection = 'desc';
      }
      else {
        if (this.sortDirection === 'desc') {
          env.sortDirection = "desc"
          this.sortDirection = "";
        } else {
          env.sortDirection = ""
          this.sortDirection = 'asc';
        }
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (!this.sortDirection) {
      this.resumenMarcaciones = [...this.originalResumenMarcaciones];
    } else {
      this.applySort();
    }
  }
  /** Aplica el sort según estado */
  applySort(): void {
    const dir = this.sortDirection === 'desc' ? 1 : -1;
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
          aVal = a.diasComputados === undefined ? 0 : a.diasComputados;
          bVal = b.diasComputados === undefined ? 0 : b.diasComputados;
          break;
        case 'retraso':
          aVal = a.totalMinRetrasos === undefined ? 0 : a.totalMinRetrasos;
          bVal = b.totalMinRetrasos === undefined ? 0 : b.totalMinRetrasos;
          break;
        case 'sinMarcar':
          aVal = a.totalSinMarcar === undefined ? 0 : a.totalSinMarcar;
          bVal = b.totalSinMarcar === undefined ? 0 : b.totalSinMarcar;
          break;
        case 'salAntes':
          aVal = a.totalSalAntes === undefined ? 0 : a.totalSalAntes;
          bVal = b.totalSalAntes === undefined ? 0 : b.totalSalAntes;
          break;
        case 'faltas':
          aVal = a.totalAusencias === undefined ? 0 : a.totalAusencias;
          bVal = b.totalAusencias === undefined ? 0 : b.totalAusencias;
          break;
        case 'permisosSG':
          aVal = a.totalPermisosSG === undefined ? 0 : a.totalPermisosSG;
          bVal = b.totalPermisosSG === undefined ? 0 : b.totalPermisosSG;
          break;
        case 'totalSanciones':
          aVal = a.totalSanciones === undefined ? 0 : a.totalSanciones;
          bVal = b.totalSanciones === undefined ? 0 : b.totalSanciones;
          break;
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
    if (this.sortDirection === 'desc') {
      return 'fa-sort-up';         // orden descendente
    }
    if (this.sortDirection === 'asc') {
      return 'fa-sort-down';       // orden ascendente
    }
    return 'fa-sort';             // fallback
  }
}
