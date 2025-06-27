import {Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TerminalService} from "../../../servicios/terminal.service";
import {Location} from "@angular/common";
import {ModalService} from "ngx-modal-ease";
import {color} from "../../inicio/Global";

@Component({
  selector: 'app-comandos',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [TerminalService],
  templateUrl: './comandos.component.html',
  styleUrl: './comandos.component.css'
})
export class ComandosComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public idTerminal = this.activatedRoute.snapshot.params['id'];

  constructor(private location: Location, private terminalService: TerminalService ) {

  }

  ngOnInit(): void {

  }

  irAtras() {
    this.location.back();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}

