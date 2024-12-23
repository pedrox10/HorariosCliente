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
  input_rango: HTMLInputElement | any;
  momentExt = extendMoment(Moment);
  resumenMarcacion: ResumenMarcacion | any = undefined;
  infoMarcaciones: InfoMarcacion[] = []
  infoMarcacionActual: InfoMarcacion | any = undefined;

  constructor(public terminalService: TerminalService, public location: Location) {

    const inicioMes = moment().startOf('month').format('YYYYMMDD');
    const finMes   = moment().endOf('month').format('YYYYMMDD');

    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        console.log(this.usuario)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    this.getResumenMarcaciones(this.id, inicioMes, finMes)


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
    this.input_rango = document.getElementById('datepicker');
    const picker = new easepick.create({
      element: this.input_rango,
      lang: 'es-ES',
      format: "DD/MM/YYYY",
      zIndex: 10,
      grid: 2,
      calendars: 2,
      css: [
        '../../../assets/easepick.css',
        "../../../assets/easepick_custom.css"
      ],
      plugins: [RangePlugin],
      RangePlugin: {
        tooltipNumber(num) {
          return num - 1;
        },
        locale: {
          one: 'dia',
          other: 'dias',
        },
      },
    });

    picker.on('select', (e) => {
      const start = moment(picker.getStartDate()).format("YYYYMMDD");
      const end = moment(picker.getEndDate()).format('YYYYMMDD');
      this.getResumenMarcaciones(this.id, start, end)
    })
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
