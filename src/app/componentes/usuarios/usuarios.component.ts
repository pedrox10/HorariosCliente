import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from '../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {env} from '../../../environments/environments';
import {TurnoComponent} from "../horarios/turno/turno.component";
import {EstadoUsuario, Usuario} from "../../modelos/Usuario";
import {Terminal} from "../../modelos/Terminal";
import {Location} from "@angular/common";
import moment from "moment";
import {AccionTerminalComponent} from "../terminal/adm-terminales/accion-terminal/accion-terminal.component";
import {ModalService} from "ngx-modal-ease";
import {AsignarHorariosComponent} from "./asignar-horarios/asignar-horarios.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit {
  public colores = env.colores;
  public usuariosFiltrados: Usuario[] = [];
  public usuariosSeleccionados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public terminal: any|Terminal;
  private activatedRoute = inject(ActivatedRoute);
  idTerminal = this.activatedRoute.snapshot.params['id'];

  constructor(public terminalService: TerminalService,private modalService: ModalService, private location: Location) {

    this.terminalService.getUsuarios(this.idTerminal).subscribe(
      (data: any) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    this.terminalService.getTerminal(this.idTerminal).subscribe(
      (data: any) => {
        this.terminal = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnInit() {
  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    if (texto === "") {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter((item: Usuario) => item.nombre.toLowerCase().includes(texto) || item.ci.toString().includes(texto))
    }
  }

  seleccionar(usuario: Usuario) {
    let cb_todos = (document.getElementById("cb_todos") as HTMLInputElement);
    usuario.seleccionado = !usuario.seleccionado;
    if (usuario.seleccionado)
      this.usuariosSeleccionados.push(usuario)
    else {
      const index = this.usuariosSeleccionados.map(u => u.ci).indexOf(usuario.ci);
      this.usuariosSeleccionados.splice(index, 1);
    }
    if (this.usuariosSeleccionados.length == this.usuarios.length) {
      cb_todos.classList.remove("is-indeterminate");
      cb_todos.checked = true;
    } else {
      if (this.usuariosSeleccionados.length == 0) {
        cb_todos.classList.remove("is-indeterminate");
        cb_todos.checked = false;
      } else {
        cb_todos.classList.add("is-indeterminate");
      }
    }
  }

  aplicarTodos(ev: any) {
    (document.getElementById("cb_todos") as HTMLInputElement).classList.remove("is-indeterminate");
    let esSeleccionado = (<HTMLInputElement>ev.target).checked
    this.usuariosFiltrados.map((usuario) => {
      if (esSeleccionado)
        usuario.seleccionado = true
      else
        usuario.seleccionado = false
    })
    if (esSeleccionado)
      this.usuariosSeleccionados = this.usuariosFiltrados.slice();
    else
      this.usuariosSeleccionados = []
  }

  sincronizar() {
    document.getElementById("btn_sincronizar")?.classList.add("is-loading");
    this.terminalService.sincronizarTerminal(this.idTerminal).subscribe(
      (data: any) => {
        this.usuarios = data.usuarios;
        this.usuariosFiltrados = data.usuarios;
        document.getElementById("ult_sync")!.innerText = "Ult. vez: " + moment(data.ult_sincronizacion).utc(true).format('DD/MM/YY HH:mm');
        let cbTodos = (document.getElementById("cb_todos") as HTMLInputElement);
        cbTodos.checked = false;
        cbTodos.classList.remove("is-indeterminate")
        this.usuariosSeleccionados= []
        console.log(data)
        setTimeout(() => {
          document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
        }, 1000);
      },
      (error: any) => {
        console.error('An error occurred:', error);
        document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
      })
  }

  irAtras() {
    this.location.back();
  }

  getEstado(usuario: Usuario) {
    return EstadoUsuario[usuario.estado];
  }

  getUltSincronizacion() {

    let res = ""
    if(this.terminal?.ult_sincronizacion === null)
      res = "Ult. vez: Nunca"
    else
      res = "Ult. vez: " + moment(this.terminal?.ult_sincronizacion).utc(true).format('DD/MM/YY HH:mm');
    return res
  }

  abrirModal() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    let usuarios = this.usuariosSeleccionados;
    this.modalService
      .open(AsignarHorariosComponent, {
        modal: {enter: `${config.animation} ${config.duration}`,},
        size: {padding: '0.5rem', height: '800px'},
        data: {usuarios}
      })
      .subscribe((data) => {
        if(data !== undefined)
          console.log(data)
      });
  }
}
