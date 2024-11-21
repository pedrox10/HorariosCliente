import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {TurnoComponent} from "../../horarios/turno/turno.component";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {Location} from '@angular/common';

@Component({
  selector: 'app-ver-horario',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './ver-horario.component.html',
  styleUrl: './ver-horario.component.css'
})
export class VerHorarioComponent implements OnInit, AfterViewInit {

  constructor(public terminalService: TerminalService, public location: Location) {

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
  }

  irAtras() {
    this.location.back();
  }
}
