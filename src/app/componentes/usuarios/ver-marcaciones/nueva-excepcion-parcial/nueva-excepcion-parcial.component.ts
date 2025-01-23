import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";

@Component({
  selector: 'app-nueva-excepcion-parcial',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-excepcion-parcial.component.html',
  styleUrl: './nueva-excepcion-parcial.component.css'
})
export class NuevaExcepcionParcialComponent {
  formAccion = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    licencia: new FormControl('', [Validators.required]),
    horaIni: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
    detalle: new FormControl('', ),
  });

  constructor(public modalService: ModalService) {
  }

  cerrarModal() {
    this.modalService.close();
  }
}
