import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TerminalService} from "../../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-accion-interrupcion',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [TerminalService],
  templateUrl: './agregar-interrupcion.component.html',
  styleUrl: './agregar-interrupcion.component.css'
})
export class AgregarInterrupcionComponent implements OnInit {

  idActual: number = -1;
  formAccion = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    motivo: new FormControl(''),
    horaIni: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
    detalle: new FormControl('')
  });

  constructor(public modalService: ModalService, public terminalService: TerminalService) {

  }

  ngOnInit() {

  }

  cerrarModal() {

  }

  verResultados() {
    //console.log(this.formAccion.value)
    this.terminalService.agregarInterrupcion(this.formAccion.value).subscribe(
      (data: any) => {  console.log(data)
      },
      (error: any) => {
        console.log(error)
      })
  }

}
