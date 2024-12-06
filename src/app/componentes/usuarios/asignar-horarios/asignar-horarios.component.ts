import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";
import {Location} from "@angular/common";
import {Usuario} from "../../../modelos/Usuario";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent implements OnInit, AfterViewInit{
  dias = env.dias.map((dia) => dia.toLowerCase());
  colores = env.colores;
  formAccion = new FormGroup({});
  dd_color: any;
  usuarios: Usuario[] = [];

  constructor(private modalService: ModalService) {

  }

  changed(evt: any) {
    let isChecked = (<HTMLInputElement>evt.target).checked
    let id = evt.target.name;
    let dia = document.getElementById(id);
    let collection = dia?.getElementsByTagName("td") || []
    for (let i = 0; i < collection.length; i++) {
      if (i != 0) {
        if (isChecked)
          collection[i].classList.remove("desactivado");
        else
          collection[i].classList.add("desactivado");
      }
    }
  }

  ngOnInit(): void {
    let data:any = this.modalService.options?.data
    this.usuarios = data.usuarios;
    this.usuarios.forEach(usuario => {
      console.log(usuario.nombre)
    })
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
}
