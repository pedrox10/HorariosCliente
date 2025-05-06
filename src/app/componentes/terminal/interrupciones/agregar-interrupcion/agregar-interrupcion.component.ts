import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TerminalService} from "../../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {mensaje} from "../../../inicio/Global";

@Component({
  selector: 'app-accion-interrupcion',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [TerminalService],
  templateUrl: './agregar-interrupcion.component.html',
  styleUrl: './agregar-interrupcion.component.css'
})
export class AgregarInterrupcionComponent implements OnInit {

  formAccion: FormGroup | any;

  constructor(public modalService: ModalService, public terminalService: TerminalService) {

  }

  ngOnInit() {
    let idTerminal: any = this.modalService.options?.data;
    console.log(idTerminal)
    this.formAccion = new FormGroup({
      idTerminal: new FormControl(idTerminal, [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      motivo: new FormControl(''),
      horaIni: new FormControl('', [Validators.required]),
      horaFin: new FormControl('', [Validators.required]),
      detalle: new FormControl('')
    });
  }

  cerrarModal() {
    this.modalService.close();
  }

  agregarInterrupcion() {
    this.terminalService.agregarInterrupcion(this.formAccion.value).subscribe(
      (data: any) => {
        mensaje("Interrupción registrada correctamente", "is-success")
        this.modalService.close(data)
      },
      (error: any) => {
        console.log(error)
        mensaje(error.error.info, "is-danger")
      })
  }
}
