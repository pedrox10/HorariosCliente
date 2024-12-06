import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";
import {Location} from "@angular/common";
import {Usuario} from "../../../modelos/Usuario";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent implements OnInit{
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
}
