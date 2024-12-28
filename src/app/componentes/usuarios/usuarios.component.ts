import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from '../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {env} from '../../../environments/environments';
import {TurnoComponent} from "../horarios/turno/turno.component";
import {EstadoUsuario, Usuario} from "../../modelos/Usuario";
import {Terminal} from "../../modelos/Terminal";
import {Location} from "@angular/common";
import moment from "moment";
import {ModalService} from "ngx-modal-ease";
import {AsignarHorariosComponent} from "./asignar-horarios/asignar-horarios.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent, FormsModule],
  providers: [TerminalService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit, AfterViewInit {
  public colores = env.colores;
  public usuariosFiltrados: Usuario[] = [];
  public usuariosSeleccionados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public terminal: any | Terminal;
  private activatedRoute = inject(ActivatedRoute);
  idTerminal = this.activatedRoute.snapshot.params['id'];
  estado: EstadoUsuario | any = undefined;
  fechaMin: string|any;

  constructor(public terminalService: TerminalService, private modalService: ModalService, private location: Location) {

    this.terminalService.getUsuarios(this.idTerminal).subscribe(
      (data: any) => {
        this.usuarios = data;
        console.log(this.usuarios)
        this.usuariosFiltrados = data;
        (document.getElementById("rb_activo") as HTMLInputElement)?.click()
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    this.terminalService.getTerminal(this.idTerminal).subscribe(
      (data: any) => {
        this.terminal = data;
        console.log(this.terminal)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    let lista: Usuario[] = []
    lista = this.estado != undefined ? this.usuarios.filter((item: Usuario) => item.estado == this.estado) : lista = this.usuarios
    if (texto === "") {
      this.usuariosFiltrados = lista;
    } else {
      this.usuariosFiltrados = lista.filter((item: Usuario) =>
        item.nombre.toLowerCase().includes(texto) || item.ci.toString().includes(texto)
      )
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
    let lista: Usuario[] = []
    lista = this.estado != undefined ? this.usuarios.filter((item: Usuario) => item.estado == this.estado) : lista = this.usuarios
    if (this.usuariosSeleccionados.length == lista.length) {
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
    let esSeleccionado = (<HTMLInputElement>ev.target).checked
    this.marcarTodos(esSeleccionado)
  }

  marcarTodos(seleccionar: boolean) {
    this.usuariosFiltrados.map((usuario) => {
      if (seleccionar)
        usuario.seleccionado = true
      else
        usuario.seleccionado = false
    })
    if (seleccionar)
      this.usuariosSeleccionados = this.usuariosFiltrados.slice();
    else
      this.usuariosSeleccionados = [];
    (document.getElementById("cb_todos") as HTMLInputElement).classList.remove("is-indeterminate");
  }

  sincronizar() {
    document.getElementById("btn_sincronizar")?.classList.add("is-loading");
    this.terminalService.sincronizarTerminal(this.idTerminal).subscribe(
      (data: any) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        document.getElementById("ult_sync")!.innerText = "Ult. vez: " + moment(data.ult_sincronizacion).format('DD/MM/YYYY HH:mm');
        let cbTodos = (document.getElementById("cb_todos") as HTMLInputElement);
        cbTodos.checked = false;
        cbTodos.classList.remove("is-indeterminate")
        this.usuariosSeleccionados = []
        this.quitarFiltros()
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

  getJornada(usuario: Usuario| any) {
    let fecha = moment().format("YYYYMMDD")
    this.terminalService.getJornada(usuario.id, fecha).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.log("error")
      })
  }

  getUltSincronizacion() {
    let res = ""
    if (this.terminal?.ult_sincronizacion === null)
      res = "Ult. vez: Nunca"
    else
      res = "Ult. vez: " + moment(this.terminal?.ult_sincronizacion).format('DD/MM/YYYY HH:mm');
    return res
  }

  abrirModal() {
    this.terminalService.getFechaPriMarcacion(this.idTerminal).subscribe(
      (data:any)=> {
        this.fechaMin = data;
        let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
        let usuarios = this.usuariosSeleccionados;
        let fechaMin = this.fechaMin;
        this.modalService
          .open(AsignarHorariosComponent, {
            modal: {enter: `${config.animation} ${config.duration}`,},
            size: {padding: '0.5rem', height: '800px'},
            data: {usuarios, fechaMin}
          })
          .subscribe((data) => {
            if (data !== undefined)
              console.log(data)
          });
      },
      (error:any) => {
        console.error('An error occurred:', error);
      })
  }

  filtrarUsuarios(ev: any) {
    let valor = (<HTMLInputElement>ev.target).value;
    this.estado = parseInt(valor)
    env.filtrarEstado = true;
    console.log(env.filtrarEstado)
    env.estado = this.estado;
    console.log(env.estado)
    this.usuariosFiltrados = this.usuarios.filter((item: Usuario) => item.estado == this.estado)
    this.marcarTodos(false);
    (document.getElementById("cb_todos") as HTMLInputElement).checked = false;
  }

  quitarFiltros() {
    if (this.estado != undefined) {
      const estados = document.getElementsByName("estados") as NodeListOf<HTMLInputElement>;
      for (var i = 0; i < estados.length; i++) {
        let ele = estados[i];
        if (ele.checked) {
          ele.checked = false
          this.usuariosFiltrados = this.usuarios
          break
        }
      }
      this.estado = undefined
      this.marcarTodos(false);
      (document.getElementById("cb_todos") as HTMLInputElement).checked = false;
      env.filtrarEstado = false;
      env.estado = -1
    }
  }
}
