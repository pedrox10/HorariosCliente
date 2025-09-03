import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from '../../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {easepick} from '@easepick/core';
import {RangePlugin} from '@easepick/range-plugin';
import {Location} from '@angular/common';
import moment, * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Usuario} from "../../../modelos/Usuario";
import {IMarcacionInfo, InfoMarcacion} from "../../../modelos/InfoMarcacion";
import {ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {MarcacionComponent} from "./marcacion/marcacion.component";
import {LockPlugin} from "@easepick/lock-plugin";
import {color} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {ModalService} from "ngx-modal-ease";
import {EstadoJornada} from "../../../modelos/Jornada";
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-ver-marcaciones',
  standalone: true,
  imports: [RouterLink, HttpClientModule, MarcacionComponent],
  providers: [TerminalService],
  templateUrl: './ver-marcaciones.component.html',
  styleUrl: './ver-marcaciones.component.css'
})

export class VerMarcacionesComponent implements OnInit, AfterViewInit {
  public colores: any = env.colores;
  public usuario: any | Usuario;
  private activatedRoute = inject(ActivatedRoute);
  public id = this.activatedRoute.snapshot.params['id'];
  public ini = this.activatedRoute.snapshot.params['ini'];
  public fin = this.activatedRoute.snapshot.params['fin'];
  inputRango: HTMLInputElement | any;
  momentExt = extendMoment(Moment);
  rm: ResumenMarcacion | any = undefined;
  infoMarcaciones: InfoMarcacion[] = []
  infoMarcacionActual: InfoMarcacion | any = undefined;
  ultimaSincronizacion: Date|any = undefined
  textUltSincronizacion=""
  public estado;
  isCargando = true
  fileName= '';
  filasExcel = [] as Array<IMarcacionInfo>

  constructor(public terminalService: TerminalService, public location: Location, public modalService: ModalService) {

    this.estado = EstadoJornada
    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        console.log(this.usuario)
        this.ultimaSincronizacion = moment(this.usuario.terminal.ultSincronizacion, "YYYY-MM-DD").toDate()
        this.textUltSincronizacion = moment(this.usuario.terminal.ultSincronizacion).format("DD/MM/YYYY HH:mm")

        this.inputRango = document.getElementById('datepicker');
        const picker = new easepick.create({
          element: this.inputRango,
          lang: 'es-ES',
          format: "DD/MM/YYYY",
          zIndex: 10,
          grid: 2,
          calendars: 2,
          css: [
            '../../../assets/easepick.css',
            "../../../assets/easepick_custom.css"
          ],
          plugins: [RangePlugin, LockPlugin],
          RangePlugin: {
            tooltipNumber(num) {
              return num;
            },
            locale: {
              one: 'dia',
              other: 'dias',
            },
          },
          LockPlugin: {
            minDate: moment().startOf("year").toDate(),
            maxDate: moment().endOf("year").toDate()
          },
        });
        picker.gotoDate(moment().subtract(1, "month").toDate());
        picker.setStartDate(moment(this.ini, "YYYYMMDD").toDate());
        picker.setEndDate(moment(this.fin, "YYYYMMDD").toDate())
        sessionStorage.setItem('ini', this.ini);
        sessionStorage.setItem('fin', this.fin);
        this.getResumenMarcaciones(this.id, this.ini, this.fin)

        picker.on('select', (e) => {
          const start = moment(picker.getStartDate()).format("YYYYMMDD");
          sessionStorage.setItem('ini', start);
          const end = moment(picker.getEndDate()).format('YYYYMMDD');
          sessionStorage.setItem('fin', end);
          this.isCargando = true;
          this.getResumenMarcaciones(this.id, start, end)
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getResumenMarcaciones(id: number, ini: string, fin: string) {
    this.terminalService.getResumenMarcaciones(id, ini, fin).subscribe(
      (data: any) => {
        this.rm = data;
        console.log(data)
        this.isCargando = false;
        if(this.rm.mensajeError) {
          console.log(this.rm.mensajeError)
        }
        this.infoMarcaciones = this.rm.infoMarcaciones;
        this.filasExcel = [];
        this.cambiarTotales()
        for (let info of this.infoMarcaciones) {
            let fila = {} as IMarcacionInfo;
            fila.fecha = this.formatear(info.fecha);
            fila.horario = info.horario
            fila.activo = info.activo
            if(info.activo) {
              fila.numTurnos = info.numTurnos
              if(info.hayPriEntExcepcion.existe) {
                  fila.priEntrada = "Excepción";
              } else {
                if(info.priEntradas)
                  fila.priEntrada = info.priEntradas[0] === undefined ? "" : info.priEntradas[0];
                else
                  fila.priEntrada = "SinMarcar"
              }
              if(info.hayPriSalExcepcion.existe) {
                fila.priSalida = "Excepción"
              } else {
                if(info.priSalidas)
                  fila.priSalida = info.priSalidas[info.priSalidas.length-1] === undefined
                                    ? "" : info.priSalidas[info.priSalidas.length-1];
                else
                  fila.priSalida = "SinMarcar"
              }
              if(info.numTurnos == 2) {
                if(info.haySegEntExcepcion.existe) {
                  fila.segEntrada = "Excepción"
                } else {
                  if(info.segEntradas)
                    fila.segEntrada = info.segEntradas[0] === undefined ? "" : info.segEntradas[0];
                  else
                    fila.segEntrada = "SinMarcar"
                }
                if(info.haySegSalExcepcion.existe) {
                  fila.segSalida = "Excepción"
                } else {
                  if(info.segSalidas)
                    fila.segSalida = info.segSalidas[info.segSalidas.length-1] === undefined
                                      ? "" : info.segSalidas[info.segSalidas.length-1];
                  else
                    fila.segSalida = "SinMarcar"
                }
              }
              fila.retraso = info.minRetrasos
              fila.sinMarcar = info.noMarcados
              fila.salAntes = info.cantSalAntes
              this.filasExcel.push(fila)
            } else {
              fila.mensaje = info.mensaje
              this.filasExcel.push(fila)
            }
        }
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }

  setInfoActual(i: InfoMarcacion) {
    this.infoMarcacionActual = i;
  }

  getInfoActual() {
    return this.infoMarcacionActual
  }

  mostrarCantidades(valor: number){
    let res = "";
    if(valor > 0){
      res = valor + ""
    }
    return res;
  }

  esUltimaSincronizacion(fecha: Date) {
    return moment(fecha, "YYYY-MM-DD").isSame(moment(this.ultimaSincronizacion, "YYYY-MM-DD"));
  }

  cambiarTotales(){
    let retrasos = <HTMLSpanElement> document.getElementById("totalCantRetrasos")
    let minutos = <HTMLSpanElement> document.getElementById("totalMinRetrasos")
    let sinMarcar = <HTMLSpanElement> document.getElementById("totalSinMarcar")
    let salAntes = <HTMLSpanElement> document.getElementById("totalSalAntes")
    let faltas = <HTMLSpanElement> document.getElementById("totalFaltas")
    retrasos.innerText = this.rm.totalCantRetrasos === undefined ? "--" : this.rm.totalCantRetrasos
    minutos.innerText = this.rm.totalMinRetrasos === undefined ? "--" : this.rm.totalMinRetrasos + "min"
    sinMarcar.innerText = this.rm.totalSinMarcar === undefined ? "--" : this.rm.totalSinMarcar
    salAntes.innerText = this.rm.totalSalAntes === undefined ? "--" : this.rm.totalSalAntes
    faltas.innerText = this.rm.totalAusencias === undefined ? "--" : this.rm.totalAusencias
  }

  async generarExcelConEstilo() {
    const workbook = new ExcelJS.Workbook();
    fetch('assets/rep_marcaciones.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => workbook.xlsx.load(buffer))
      .then(() => {
        let worksheet = workbook.getWorksheet(1); // o por nombre: workbook.getWorksheet('Reporte');
        let horaFont = {
          name: 'Calibri',
          size: 6, // Tamaño de fuente para la hora planificada
          color: { argb: 'FF808080' } // Un gris oscuro para la hora planificada
        } as ExcelJS.Font;
        let marcadoFont = {
          name: 'Calibri',
          size: 8,
          color: { argb: 'FF000000' } // Negro para la hora de marcación
        } as ExcelJS.Font;
        let excepcionFont = {
          name: 'Calibri',
          size: 7,
          color: { argb: 'FF4bb990' }
        } as ExcelJS.Font;
        let sinMarcarFont = {
          name: 'Calibri',
          size: 7,
          color: { argb: 'FFda4c4b' }
        } as ExcelJS.Font;

        let dottedBorder: Partial<ExcelJS.Borders> = {
          bottom: { style: 'dotted' },
        };
        const estiloReferencia = worksheet!.getRow(7);
        this.fileName = "reporte_marcaciones.xlsx";
        let segundaFila = worksheet!.getRow(2);
        segundaFila.getCell(3).value = this.usuario.nombre;
        let fechaIni = moment(sessionStorage.getItem("ini")).format("[Desde] dddd D [de] MMMM [de] YYYY")
        segundaFila.getCell(7).value = fechaIni
        let terceraFila = worksheet!.getRow(3);
        terceraFila.getCell(3).value = this.usuario.ci;
        let fechaFin = moment(sessionStorage.getItem("fin")).format("[Hasta] dddd D [de] MMMM [de] YYYY")
        terceraFila.getCell(7).value = fechaFin
        const startRow = 7;
        console.log(this.filasExcel)
        this.filasExcel.forEach((fila, i) => {
          let row = worksheet!.getRow(startRow + i);
          row.getCell(1).value = fila.fecha
          row.getCell(2).value = fila.horario.nombre === undefined ? "" : fila.horario.nombre;
          if(fila.activo) {
            row.height = 20;

            let priEntFuente = marcadoFont; // valor por defecto
            if (fila.priEntrada === "Excepción") {
              priEntFuente = excepcionFont;  // tu fuente definida para excepciones
            } else if (fila.priEntrada === "SinMarcar") {
              priEntFuente = sinMarcarFont;  // tu fuente definida para sin marcar
            }
            let rtPriEntrada = [
              {font: horaFont, text: fila.horario.priEntrada.slice(0, 5)},
              {font: {}, text: '\n'}, // Salto de línea sin estilo
              {font: priEntFuente, text: fila.priEntrada + ""},
            ];
            row.getCell(3).value = {richText: rtPriEntrada};

            let priSalFuente = marcadoFont; // valor por defecto
            if (fila.priSalida === "Excepción") {
              priSalFuente = excepcionFont;  // tu fuente definida para excepciones
            } else if (fila.priSalida === "SinMarcar") {
              priSalFuente = sinMarcarFont;  // tu fuente definida para sin marcar
            }
            let rtPriSalida = [
              {font: horaFont, text: fila.horario.priSalida.slice(0, 5)},
              {font: {}, text: '\n'}, // Salto de línea sin estilo
              {font: priSalFuente, text: fila.priSalida + ""},
            ];
            row.getCell(4).value = {richText: rtPriSalida};
            if(fila.numTurnos == 2) {
              let segEntFuente = marcadoFont; // valor por defecto
              if (fila.segEntrada === "Excepción") {
                segEntFuente = excepcionFont;  // tu fuente definida para excepciones
              } else if (fila.segEntrada === "SinMarcar") {
                segEntFuente = sinMarcarFont;  // tu fuente definida para sin marcar
              }
              let rtSegEntrada = [
                {font: horaFont, text: fila.horario.segEntrada.slice(0, 5)},
                {font: {}, text: '\n'}, // Salto de línea sin estilo
                {font: segEntFuente, text: fila.segEntrada + ""},
              ];
              row.getCell(5).value = {richText: rtSegEntrada};

              let segSalFuente = marcadoFont; // valor por defecto
              if (fila.segSalida === "Excepción") {
                segSalFuente = excepcionFont;  // tu fuente definida para excepciones
              } else if (fila.segSalida === "SinMarcar") {
                segSalFuente = sinMarcarFont;  // tu fuente definida para sin marcar
              }
              let rtSegSalida = [
                {font: horaFont, text: fila.horario.segSalida.slice(0, 5)},
                {font: {}, text: '\n'}, // Salto de línea sin estilo
                {font: segSalFuente, text: fila.segSalida + ""},
              ];
              row.getCell(6).value = {richText: rtSegSalida};
            }
            row.getCell(7).value = fila.retraso === undefined ? "" : fila.retraso;
            row.getCell(8).value = fila.sinMarcar === undefined ? "" : fila.sinMarcar;
            row.getCell(9).value = fila.salAntes === undefined ? "" : fila.salAntes;
          } else {
            row.height = 13.5;
            worksheet!.mergeCells(row.number, 3, row.number, 7);
            row.getCell(3).value = fila.mensaje;
            row.getCell(8).value = ""
            row.getCell(9).value = ""
          }
          row.eachCell((cell, colNumber) => {
            const refCell = estiloReferencia.getCell(colNumber);
            if(colNumber == 1)
              cell.style = {...refCell.style, border: dottedBorder, alignment: { wrapText: true, horizontal: 'left', vertical: 'bottom' }};
            else
              cell.style = {...refCell.style, border: dottedBorder, alignment: { wrapText: true, horizontal: 'center', vertical: 'bottom' }};
          });
          row.commit();
        });
        const ultimaFilaIndex = startRow + this.filasExcel.length;
        let ultimaFila = worksheet!.getRow(ultimaFilaIndex);
        ultimaFila.getCell(1).value = "TOTALES --------------------->";
        ultimaFila.getCell(2).value = "Ausencias:";
        ultimaFila.getCell(3).value = this.rm.totalAusencias;
        ultimaFila.getCell(4).value = "";
        ultimaFila.getCell(5).value = "";
        ultimaFila.getCell(6).value = "";
        ultimaFila.getCell(7).value = this.rm.totalMinRetrasos;
        ultimaFila.getCell(8).value = this.rm.totalSinMarcar;
        ultimaFila.getCell(9).value = this.rm.totalSalAntes;
        ultimaFila.eachCell((cell) => {
          cell.font = { name: 'Calibri', size: 9, bold: true};
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' }};
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        // Descargar
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

  imprimir() {
    window.print();
  }

  irAtras() {
    this.location.back();
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  formatear(fecha: Date){
    return moment(fecha).format("dddd, D [de] MMMM [de] YYYY")
  }
}
