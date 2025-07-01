import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TerminalService} from "../../../servicios/terminal.service";
import {Location} from "@angular/common";
import {ModalService} from "ngx-modal-ease";
import {color} from "../../inicio/Global";
import {ComandosService} from "../../../servicios/comandos.service";

@Component({
  selector: 'app-comandos',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [TerminalService],
  templateUrl: './comandos.component.html',
  styleUrl: './comandos.component.css'
})
export class ComandosComponent implements OnInit, AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  public idTerminal = this.activatedRoute.snapshot.params['id'];
  nombreTerminal: string | any;
  ipTerminal: string | any;
  bloqueado = false;

  constructor(private location: Location, private comandosService: ComandosService, private terminalService: TerminalService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.terminalService.getTerminal(this.idTerminal).subscribe(
      (data: any) => {
        console.log(data)
        this.nombreTerminal = data.nombre
        this.ipTerminal = data.ip
      },
      (error: any) => {
        //this.accionError(error)
      }
    );
  }

  conectar() {
    document.getElementById("ic_conectar")?.classList.add("button", "is-loading");
    this.bloqueado = true;
    this.comandosService.conectar(this.idTerminal).subscribe({
      next: data => {
        console.log(data)
        document.getElementById("ic_conectar")?.classList.remove("button", "is-loading");
        this.bloqueado = false;
      },
      error: err => {
        console.log("error al enviar comando")
        document.getElementById("ic_conectar")?.classList.remove("button", "is-loading");
        this.bloqueado = false;
      }
    });
  }

  irAtras() {
    this.location.back();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}

