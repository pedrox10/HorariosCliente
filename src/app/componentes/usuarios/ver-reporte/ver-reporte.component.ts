import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as XLSX from "xlsx-js-style";
import {ModalService} from "ngx-modal-ease";
import {TerminalService} from "../../../servicios/terminal.service";
import {Usuario} from "../../../modelos/Usuario";
import {HttpClientModule} from "@angular/common/http";
import {concatMap, from, toArray} from "rxjs";
import {IReporte, ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {color, format} from "../../inicio/Global";
import {InfoMarcacion} from "../../../modelos/InfoMarcacion";
import moment from "moment";
import {EstadoJornada} from "../../../modelos/Jornada";
import {Location} from "@angular/common";
import {DataService} from "../../../servicios/data.service";
import {RouterLink} from "@angular/router";
import {VerHorarioComponent} from "../ver-horario/ver-horario.component";
import {EditarUsuarioComponent} from "../editar-usuario/editar-usuario.component";

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [HttpClientModule, RouterLink],
  providers: [TerminalService, DataService],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})

export class VerReporteComponent implements OnInit{

  usuarios: Usuario[] = [];
  fileName= 'ExcelSheet.xlsx';
  terminal: string|any = undefined;
  fechaIni: string|any = undefined;
  fechaFin: string|any = undefined;
  resumenMarcaciones: ResumenMarcacion[] = [];
  filasExcel = [] as Array<IReporte>

  constructor(private modalService: ModalService, private terminalService: TerminalService, private location: Location) {

  }

  ngOnInit() {
    const data=JSON.parse(sessionStorage.getItem('reporte') || '[]')
    this.resumenMarcaciones = data;
    this.terminal = sessionStorage.getItem("terminal")
    this.fechaIni = sessionStorage.getItem("fechaIni")
    this.fechaFin = sessionStorage.getItem("fechaFin")
    for(let resumenMarcacion of this.resumenMarcaciones) {
      let fila = {} as IReporte;
      fila.nombre = resumenMarcacion.usuario.nombre;
      fila.ci = resumenMarcacion.usuario.ci;
      fila.fechaAlta = format(resumenMarcacion.usuario.fechaAlta);
      fila.retraso = resumenMarcacion.totalMinRetrasos;
      fila.sinMarcar = resumenMarcacion.totalSinMarcar;
      fila.faltas = resumenMarcacion.totalAusencias;

      this.filasExcel.push(fila)
    }
    console.log(this.filasExcel)
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
          this.editarUsuario(data)
      });
  }

  editarUsuario(usuario: Usuario) {
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
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

  }

  irAtras() {
    this.location.back();
  }

  imprimir() {
    window.print();
  }

  exportexcel(): void
  {
    // define your headers
    const headers = [
      "Nombre",
      "CI",
      "Fecha de Alta",
      "Retraso [min]",
      "Sin Marcar",
      "Faltas",
    ]

// set column widths
    const colWidths = [
      { wch: 30 },
      { wch: 10 },
      { wch: 12 },
    ]

// get the data
    const userData = this.filasExcel

// set header row height
// consider if you have vertical headers
    const headerRowHeight = [
      { hpt: 30 },
    ]

// Dynamically set row height based on size of data
    const dataRowHeight = Array.from({ length: userData.length }, () => ({ hpt: 20 }))

// Combine header row height and data row height
    const rowHeight = [...headerRowHeight, ...dataRowHeight]

// Create a new worksheet:
    const worksheet = XLSX.utils.json_to_sheet([])

// Assign widths to columns
    worksheet['!cols'] = colWidths

// Assign height to rows
    worksheet['!rows'] = rowHeight

// Enable auto-filter for columns
    worksheet['!autofilter'] = { ref: "A1:C1" }

// Add the headers to the worksheet:
    XLSX.utils.sheet_add_aoa(worksheet, [headers])

// add data to sheet
    XLSX.utils.sheet_add_json(worksheet, userData, {
      skipHeader: true,
      origin: -1
    })

// get size of sheet
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "")
    const rowCount = range.e.r
    const columnCount = range.e.c

// Add formatting by looping through data in sheet
    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col <= columnCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
        // Add this format to every cell
        worksheet[cellRef].s = {
          alignment: {
            horizontal: "left",
            wrapText: true,
          },
        }

        // vertical header - 1st column only
        /*if (row === 0 && col === 0) {
          worksheet[cellRef].s = {
            //spreads in previous cell settings
            ...worksheet[cellRef].s,
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: false,
            },
          }
        }*/
        // Format headers bold
        if (row === 0) {
          worksheet[cellRef].s = {
            //spreads in previous cell settings
            ...worksheet[cellRef].s,
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '295A8C' } },
          }
        }
      }
    }
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
    /* save to file */
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
}
