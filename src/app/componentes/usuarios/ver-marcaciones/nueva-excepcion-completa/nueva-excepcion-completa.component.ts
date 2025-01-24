import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {LockPlugin} from "@easepick/lock-plugin";
import moment from "moment";

@Component({
  selector: 'app-nueva-excepcion-completa',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-excepcion-completa.component.html',
  styleUrl: './nueva-excepcion-completa.component.css'
})
export class NuevaExcepcionCompletaComponent implements AfterViewInit {

  formAccion = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    licencia: new FormControl('', [Validators.required]),
    detalle: new FormControl('',),
  });
  picker: HTMLInputElement| any = undefined;

  constructor(public modalService: ModalService) {

  }

  ngAfterViewInit() {
    this.picker = new easepick.create({
      element: document.getElementById('picker')!,
      inline: true,
      lang: 'es-ES',
      format: "DD/MM/YYYY",
      zIndex: 10,
      css: [
        '../../../assets/easepick_small.css',
      ],
      plugins: [RangePlugin],
      RangePlugin: {
        tooltipNumber(num) {
          return num;
        },
        locale: {
          one: 'dia',
          other: 'dias',
        },
      },
    });
  }

  cerrarModal() {
    this.modalService.close();
  }
}
