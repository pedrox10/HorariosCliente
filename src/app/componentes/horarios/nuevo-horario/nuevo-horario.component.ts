import { Component } from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';

@Component({
  selector: 'app-nuevo-horario',
  standalone: true,
  imports: [],
  templateUrl: './nuevo-horario.component.html',
  styleUrl: './nuevo-horario.component.css'
})
export class NuevoHorarioComponent {
  name = 'ModalContent4Component';
  M3Info = '';

  constructor(private modalService: ModalService, public location: Location) {}

  onConfirm() {
    this.modalService.close(this.M3Info);
  }

  irAtras() {
    this.location.back();
  }
}
