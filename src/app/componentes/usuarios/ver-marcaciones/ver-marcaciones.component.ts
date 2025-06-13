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
import {ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {MarcacionComponent} from "./marcacion/marcacion.component";
import {LockPlugin} from "@easepick/lock-plugin";
import {color} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {ModalService} from "ngx-modal-ease";
import {NuevaExcepcionCompletaComponent} from "./nueva-excepcion-completa/nueva-excepcion-completa.component";
import {NuevaExcepcionParcialComponent} from "./nueva-excepcion-parcial/nueva-excepcion-parcial.component";
import {VerExcepcionesComponent} from "./ver-excepciones/ver-excepciones.component";
import {EstadoJornada} from "../../../modelos/Jornada";

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
  resumenMarcacion: ResumenMarcacion | any = undefined;
  infoMarcaciones: InfoMarcacion[] = []
  infoMarcacionActual: InfoMarcacion | any = undefined;
  ultimaSincronizacion: Date|any = undefined
  textUltSincronizacion=""
  public estado;

  constructor(public terminalService: TerminalService, public location: Location, public modalService: ModalService) {

    this.estado = EstadoJornada
    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        console.log(this.usuario)
        //console.log(this.us)
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
        this.getResumenMarcaciones(this.id, this.ini, this.fin)

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
  }

  getResumenMarcaciones(id: number, ini: string, fin: string) {
    this.terminalService.getResumenMarcaciones(id, ini, fin).subscribe(
      (data: any) => {
        this.resumenMarcacion = data;
        console.log(data)
        if(this.resumenMarcacion.mensajeError) {
          console.log(this.resumenMarcacion.mensajeError)
        }
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

  esUltimaSincronizacion(fecha: Date) {
    return moment(fecha, "YYYY-MM-DD").isSame(moment(this.ultimaSincronizacion, "YYYY-MM-DD"));
  }

  cambiarTotales(){
    let retrasos = <HTMLSpanElement> document.getElementById("totalCantRetrasos")
    let minutos = <HTMLSpanElement> document.getElementById("totalMinRetrasos")
    let sinMarcar = <HTMLSpanElement> document.getElementById("totalSinMarcar")
    let salAntes = <HTMLSpanElement> document.getElementById("totalSalAntes")
    let faltas = <HTMLSpanElement> document.getElementById("totalFaltas")
    let permisosSG = <HTMLSpanElement> document.getElementById("totalPermisosSG")
    retrasos.innerText = this.resumenMarcacion.totalCantRetrasos === undefined ? "--" : this.resumenMarcacion.totalCantRetrasos
    minutos.innerText = this.resumenMarcacion.totalMinRetrasos === undefined ? "--" : this.resumenMarcacion.totalMinRetrasos + "min"
    sinMarcar.innerText = this.resumenMarcacion.totalSinMarcar === undefined ? "--" : this.resumenMarcacion.totalSinMarcar
    salAntes.innerText = this.resumenMarcacion.totalSalAntes === undefined ? "--" : this.resumenMarcacion.totalSalAntes
    faltas.innerText = this.resumenMarcacion.totalAusencias === undefined ? "--" : this.resumenMarcacion.totalAusencias
    permisosSG.innerText = this.resumenMarcacion.totalPermisosSG === undefined ? "--" : this.resumenMarcacion.totalPermisosSG + "d"

  }

  agregarExcepcionCompleta() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(NuevaExcepcionCompletaComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {}
    })
      .subscribe((data) => {
        if (data !== undefined)
          console.log(data)
      });
  }

  agregarExcepcionParcial() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(NuevaExcepcionParcialComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {}
    })
      .subscribe((data) => {
        if (data !== undefined)
          console.log(data)
      });
  }

  verExcepciones() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(VerExcepcionesComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {}
    })
      .subscribe((data) => {
        if (data !== undefined)
          console.log(data)
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
}
