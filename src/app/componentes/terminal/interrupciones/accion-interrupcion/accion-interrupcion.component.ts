import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TerminalService} from "../../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-accion-interrupcion',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './accion-interrupcion.component.html',
  styleUrl: './accion-interrupcion.component.css'
})
export class AccionInterrupcionComponent implements OnInit {

  idActual: number = -1;
  formAccion = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    horaIni: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
    tipo: new FormControl(''),
    detalle: new FormControl('')
  });

  constructor(
              public modalService: ModalService, private router: Router) {

  }

  ngOnInit() {
    //if (this.accion == "Editar") {
      //let terminal: any = this.modalService.options?.data;
      //this.idActual = terminal.id;
      /*this.formAccion.patchValue({
        nombre: terminal.nombre,
        ip: terminal.ip,
        puerto: terminal.puerto,
        tieneConexion: terminal.tieneConexion
      })*/
    //}
  }

  cerrarModal() {


  }

}
