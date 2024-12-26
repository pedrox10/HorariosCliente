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
  texto=""

  constructor(public terminalService: TerminalService, public location: Location) {

    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        this.ultimaSincronizacion = moment(this.usuario.terminal.ult_sincronizacion, "YYYY-MM-DD").toDate()
        this.texto = "Ult. vez: " + moment(this.usuario.terminal.ult_sincronizacion).format("DD/MM/YYYY HH:mm")
        let inicioMes = moment().startOf('month').format('YYYYMMDD');
        let finMes   = moment().endOf('month').format('YYYYMMDD');
        let rango = this.momentExt.range(moment(inicioMes), moment(finMes));
        if(rango.contains(this.ultimaSincronizacion))
          this.getResumenMarcaciones(this.id, inicioMes, moment(this.ultimaSincronizacion).format("YYYYMMDD"))
        else
          this.getResumenMarcaciones(this.id, inicioMes, finMes)

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

  irAtras() {
    this.location.back();
  }
}
