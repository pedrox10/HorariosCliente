import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from '../../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {easepick} from '@easepick/core';
import {RangePlugin} from '@easepick/range-plugin';
import {Location} from '@angular/common';
import moment from 'moment';
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Usuario} from "../../../modelos/Usuario";
import {InfoMarcacion} from "../../../modelos/InfoMarcacion";
import {from, mergeMap, toArray} from "rxjs";
import {ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {MarcacionComponent} from "./marcacion/marcacion.component";
import {LockPlugin} from "@easepick/lock-plugin";
import * as XLSX from 'xlsx-js-style';


@Component({
  selector: 'app-ver-marcaciones',
  standalone: true,
  imports: [RouterLink, HttpClientModule, MarcacionComponent],
  providers: [TerminalService],
  templateUrl: './ver-marcaciones.component.html',
  styleUrl: './ver-marcaciones.component.css'
})

export class VerMarcacionesComponent implements OnInit, AfterViewInit {
  public usuario: any | Usuario;
  private activatedRoute = inject(ActivatedRoute);
  public id = this.activatedRoute.snapshot.params['id'];
  public nov: string[] = [];
  inputRango: HTMLInputElement | any;
  momentExt = extendMoment(Moment);
  resumenMarcacion: ResumenMarcacion | any = undefined;
  infoMarcaciones: InfoMarcacion[] = []
  infoMarcacionActual: InfoMarcacion | any = undefined;
  ultimaSincronizacion: Date|any = undefined
  textUltSincronizacion=""
  fileName= 'ExcelSheet.xlsx';

  constructor(public terminalService: TerminalService, public location: Location) {

    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        this.ultimaSincronizacion = moment(this.usuario.terminal.ult_sincronizacion, "YYYY-MM-DD").toDate()
        this.textUltSincronizacion = "Ult. vez: " + moment(this.usuario.terminal.ult_sincronizacion).format("DD/MM/YYYY HH:mm")


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
              return num - 1;
            },
            locale: {
              one: 'dia',
              other: 'dias',
            },
          },
          LockPlugin: {
            maxDate: this.ultimaSincronizacion,
          },
        });
        picker.gotoDate(moment().subtract(1, "month").toDate());
        picker.on('select', (e) => {
          const start = moment(picker.getStartDate()).format("YYYYMMDD");
          const end = moment(picker.getEndDate()).format('YYYYMMDD');
          this.getResumenMarcaciones(this.id, start, end)
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    let ids_usuarios: number[] = []
    ids_usuarios.push(82, 103)
    const result$ =
      from(ids_usuarios)
        .pipe(
          mergeMap(id_usuario => {
            return this.terminalService.getInfoMarcaciones(id_usuario, "20241201", "20241213")
          }),
          toArray()
        );
    result$.subscribe((data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      })
  }

  getResumenMarcaciones(id: number, ini: string, fin: string) {
    this.terminalService.getInfoMarcaciones(id, ini, fin).subscribe(
      (data: any) => {
        this.resumenMarcacion = data;
        this.infoMarcaciones = this.resumenMarcacion.infoMarcaciones;
        this.cambiarTotales()
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

  cambiarTotales(){
    let retrasos = <HTMLSpanElement> document.getElementById("totalCantRetrasos")
    let minutos = <HTMLSpanElement> document.getElementById("totalMinRetrasos")
    let sinMarcar = <HTMLSpanElement> document.getElementById("totalSinMarcar")
    retrasos.innerText = this.resumenMarcacion.totalCantRetrasos
    minutos.innerText = this.resumenMarcacion.totalMinRetrasos
    sinMarcar.innerText = this.resumenMarcacion.totalSinMarcar
  }

  imprimir() {
    window.print();
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('tabla_marcaciones');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    for (var i in ws) {
      console.log(ws[i]);
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      ws[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          top: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      if (cell.r == 0) {
        // first row
        ws[i].s.border.bottom = {
          // bottom border
          style: 'thin',
          color: 'FF0000',
        };
      }
    }

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  irAtras() {
    this.location.back();
  }
}
