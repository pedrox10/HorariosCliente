import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {env} from '../../../../environments/environments';
import {TerminalService} from '../../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import { easepick } from '@easepick/core';
import { RangePlugin } from '@easepick/range-plugin';
import {Location} from '@angular/common';


@Component({
  selector: 'app-ver-marcaciones',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './ver-marcaciones.component.html',
  styleUrl: './ver-marcaciones.component.css'
})

export class VerMarcacionesComponent implements OnInit, AfterViewInit {
  public gestion: number = 2024
  public mesActual: number = 10;
  public numDias: number;
  public dias: string[][] = [];
  private activatedRoute = inject(ActivatedRoute);
  public ip = this.activatedRoute.snapshot.params['ip'];
  public puerto = this.activatedRoute.snapshot.params['puerto'];
  public nombre = this.activatedRoute.snapshot.params['nombre'];
  public dias_semana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  public oct: string[] = [];

  constructor(public terminalService: TerminalService, public  location: Location) {


    this.terminalService.getMarcaciones(this.ip, this.puerto).subscribe(
      (data: any) => {
        const aux = data;
        console.log(aux)
        let cad = this.gestion + "-11-";
        let re_fecha = new RegExp(cad + '(.*)');
        let re_ci = new RegExp("^" + this.nombre + "$");
        aux.forEach((value: any) => {
          if (re_fecha.test(value.timestamp) && re_ci.test(value.user_id)) {
            this.oct.push(value);
          }
        });
        this.getArrayDias()
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
    this.numDias = this.getNumDias(this.mesActual - 1, this.gestion);
   }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    const picker = new easepick.create({
      element: document.getElementById('datepicker')!,
      lang: 'es-ES',
      format: "DD/MM/YYYY",
      zIndex: 10,
      grid: 2,
      calendars: 2,
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
        "../../../assets/easepick.css"
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
  }

  getNumDias(mes: number, gestion: number) {
    return new Date(gestion, mes, 0).getDate();
  }

  getNombreDia(dia: number) {
    const fecha = new Date(this.gestion, this.mesActual, dia);
    const day = fecha.getDay();

    return this.dias_semana[day];
  }

  getArrayDias() {
    for (var i = 1; i <= this.numDias; i++) {
      let dia = i < 10 ? "0" + i : i;
      let fila: string[] = [];
      fila.push(this.getNombreDia(i).substring(0, 3) + " " + i);
      let cad = this.gestion + "-11-" + dia;
      let re_dia = new RegExp(cad + '(.*)');
      this.oct.forEach((value: any) => {
        if (re_dia.test(value.timestamp)) {
          let hora = value.timestamp.split("T")
          fila.push(hora[1].substring(0, 5));
        }
      });
      this.dias.push(fila)
    }
  }

  irAtras() {
    this.location.back();
  }
}
