import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {TerminalService} from '../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {env} from '../../../environments/environments';
import {EstadoUsuario, Usuario} from "../../modelos/Usuario";
import {Terminal} from "../../modelos/Terminal";
import {Location} from "@angular/common";
import moment from "moment";
import {ModalService} from "ngx-modal-ease";
import {AsignarHorariosComponent} from "../horarios/asignar-horarios/asignar-horarios.component";
import {FormsModule} from "@angular/forms";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {LockPlugin} from "@easepick/lock-plugin";
import {VerHorarioComponent} from "./ver-horario/ver-horario.component";
import {EditarUsuarioComponent} from "./editar-usuario/editar-usuario.component";
import {color, mensaje, notificacion} from "../inicio/Global";
import {concatMap, from, toArray} from "rxjs";
import {DataService} from "../../servicios/data.service";
import { CommonModule } from '@angular/common';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, RouterModule, CommonModule],
  providers: [TerminalService, DataService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit, AfterViewInit {
  public usuariosFiltrados: Usuario[] = [];
  public usuariosSeleccionados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public terminal: any | Terminal;
  ultimaSincronizacion: Date | any = undefined
  private activatedRoute = inject(ActivatedRoute);
  idTerminal = this.activatedRoute.snapshot.params['id'];
  estado: EstadoUsuario | any = undefined;
  fechaMin: string | any;
  fechaIni: string | any;
  fechaFin: string | any;
  inputRango: HTMLInputElement | any;
  dd_acciones: HTMLDivElement | any;

  constructor(public terminalService: TerminalService,private router: Router,
              public modalService: ModalService, private location: Location, private sanitizer: DomSanitizer) {

    this.terminalService.getUsuarios(this.idTerminal).subscribe(
      (data: any) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        if(env.filtrarEstado) {
          if(env.estado == 1)
            (document.getElementById("rb_activo") as HTMLInputElement)?.click();
          else
            (document.getElementById("rb_inactivo") as HTMLInputElement)?.click();
        }
        if(env.textoBusqueda !== "") {
          this.filtrarFuncionarios(env.textoBusqueda);
          (document.getElementById("tf_busqueda") as HTMLInputElement).value = env.textoBusqueda
        }
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    this.terminalService.getTerminal(this.idTerminal).subscribe(
      (data: any) => {
        this.terminal = data;
        this.ultimaSincronizacion = moment(this.terminal.ultSincronizacion, "YYYY-MM-DD").toDate()
        this.inputRango = document.getElementById('picker_reporte');
        const picker = new easepick.create({
          element: this.inputRango,
          inline: true,
          lang: 'es-ES',
          format: "DD/MM/YYYY",
          zIndex: 10,
          grid: 2,
          calendars: 2,
          css: [
            '../../../assets/easepick.css',
            "../../../assets/easepick_small.css"
          ],
          plugins: [RangePlugin, LockPlugin],
          RangePlugin: {
            tooltipNumber(num) {
              return num;
            },
            locale: {
              one: 'dia',
              other: 'dias',
            },
          },
          LockPlugin: {
            maxDate: this.ultimaSincronizacion,
          },
        });
        let botonVerReporte = (document.getElementById("btn_ver_reporte") as HTMLButtonElement)
        picker.gotoDate(moment().subtract(1, "month").toDate());
        picker.on('preselect', (e) => {
          botonVerReporte.disabled = true;
        })
        picker.on('select', (e) => {
          botonVerReporte.disabled = false;
          this.fechaIni = moment(picker.getStartDate()).format("YYYYMMDD");
          this.fechaFin = moment(picker.getEndDate()).format('YYYYMMDD');
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnInit() {
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarSeleccionarRango()
      }
    });
    document.getElementById("background")?.addEventListener("click", (e) => {
      this.ocultarSeleccionarRango()
    })
  }

  ngAfterViewInit() {

  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    env.textoBusqueda = texto;
    this.filtrarFuncionarios(texto)
  }

  filtrarFuncionarios(texto: string) {
    let lista: Usuario[] = []
    lista = this.estado != undefined ? this.usuarios.filter((item: Usuario) => item.estado == this.estado) : this.usuarios
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

  conectar() {
    this.terminalService.conectarTerminal(this.idTerminal).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      })
  }

  sincronizar() {
    document.getElementById("btn_sincronizar")?.classList.add("is-loading");
    this.terminalService.sincronizarTerminal(this.idTerminal).subscribe(
      (data: any) => {
        let respuesta = data;
        this.usuarios = respuesta.usuarios
        this.usuariosFiltrados = respuesta.usuarios;
        document.getElementById("ult_sync")!.innerText = "Ult. vez: " + moment(data.ult_sincronizacion).format('DD/MM/YYYY HH:mm');
        let cbTodos = (document.getElementById("cb_todos") as HTMLInputElement);
        cbTodos.checked = false;
        cbTodos.classList.remove("is-indeterminate")
        this.usuariosSeleccionados = []
        this.quitarFiltros()
        setTimeout(() => {
          document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
          mensaje(respuesta.mensaje, "is-success")
        }, 1000);
        setTimeout(() => {
          let resumen = "Nuevas marcaciones: " + respuesta.nuevas_marcaciones + "<br>" +
            "Usuarios agregados: " + respuesta.usuarios_agregados + "<br>" +
            "Usuarios editados: " + respuesta.usuarios_editados + "<br>" +
            "Usuarios eliminados: " + respuesta.usuarios_eliminados + "<br>"
          notificacion(resumen)
        }, 4000);
      },
      (error: any) => {
        let respuesta = error
        console.error('An error occurred:', error);
        document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
        mensaje(respuesta.error.mensaje, "is-danger")
      })
  }

  irAtras() {
    this.location.back();
  }

  getHorario(str: string) {
    let color = str == "Sin Asignar" ? this.getColor("Gris") :  this.getColor("Purpura");
    let horario =
      "<div class='help has-text-centered mt-1'>" +
        "<div class='etiqueta' style='background-color: " + color + ";'>" + str + "</div>" +
      "</div>";
    return this.sanitizer.bypassSecurityTrustHtml(horario);
  }

  getEstado(usuario: Usuario) {
    let color = usuario.estado == EstadoUsuario.Activo ? "#C6FBF9" : "#E7B9C0";
    let estado =
      "<div class='help has-text-centered mt-1'>" +
      "<div class='etiqueta' style='background-color: " + color + ";'>" + EstadoUsuario[usuario.estado] + "</div>" +
      "</div>";
    return this.sanitizer.bypassSecurityTrustHtml(estado);
  }


  getFechaAlta(usuario: Usuario) {
    return moment(usuario.fechaAlta).format('DD/MM/YYYY')
  }

  getJornada(usuario: Usuario | any) {
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
    if (this.terminal?.ultSincronizacion === null)
      res = "Ult. vez: Nunca"
    else
      res = "Ult. vez: " + moment(this.terminal?.ultSincronizacion).format('DD/MM/YYYY HH:mm');
    return res
  }

  asignarHorario() {
    if (this.usuariosSeleccionados.length > 0) {
      this.terminalService.getFechaPriMarcacion(this.idTerminal).subscribe(
        (data: any) => {
          this.fechaMin = data;
          let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
          let usuarios = this.usuariosSeleccionados;
          let fechaMin = this.fechaMin;
          this.modalService.open(AsignarHorariosComponent, {
            modal: {enter: `${config.animation} ${config.duration}`,},
            size: {padding: '0.5rem'},
            data: {usuarios, fechaMin}
          })
            .subscribe((data) => {
              if (data !== undefined)
                for(let usuario of this.usuariosSeleccionados) {
                  usuario.horarioMes = data.ultDiaAsignado;
                }
            });
        },
        (error: any) => {
          console.error('An error occurred:', error);
        })
    } else {
      mensaje("Debes seleccionar al menos un funcionario", "is-warning")
    }
  }

  filtrarUsuarios(ev: any) {
    let valor = (<HTMLInputElement>ev.target).value;
    this.estado = parseInt(valor)
    env.filtrarEstado = true;
    env.estado = this.estado;
    this.usuariosFiltrados = this.usuarios.filter((item: Usuario) => item.estado == this.estado)
    if(env.textoBusqueda !== "") {
      this.filtrarFuncionarios(env.textoBusqueda);
      (document.getElementById("tf_busqueda") as HTMLInputElement).value = env.textoBusqueda
    }
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
      env.textoBusqueda = "";
      (document.getElementById("tf_busqueda") as HTMLInputElement).value = "";
    }
  }

  getIni() {
    return moment(this.ultimaSincronizacion, 'YYYY-MM-DD').startOf('month').format('YYYYMMDD');
  }

  getFin() {
    return moment(this.ultimaSincronizacion).format("YYYYMMDD");
  }

  seleccionarRango() {
    if (this.usuariosSeleccionados.length > 0) {
      document.getElementById("reporte_modal")?.classList.add("is-active");
    } else {
      mensaje("Debes seleccionar al menos un funcionario", "is-warning")
    }
  }

  ocultarSeleccionarRango() {
    document.getElementById("reporte_modal")?.classList.remove("is-active");
  }

  verHorario(id_usuario: number | any) {
    let id = id_usuario;
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(VerHorarioComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {id}
    })
      .subscribe((data) => {
        if (data !== undefined)
          console.log(data)
      });
  }

  editarUsuario(id_usuario: number | any) {
    let id = id_usuario;
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(EditarUsuarioComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {id}
    })
      .subscribe((data) => {
        if (data !== undefined)
          this.edit(data)
      });
  }

  verReporte() {
    let loader = document.getElementById("loader") as HTMLDivElement
    this.ocultarSeleccionarRango()
    loader.classList.remove("is-hidden")
    const result$ =
      from(this.usuariosSeleccionados)
        .pipe(
          concatMap(usuario => {
            return this.terminalService.getInfoMarcaciones(usuario.id!, this.fechaIni, this.fechaFin)
          }),
          toArray()
        );

    result$.subscribe({
      next: (data: any) => {
        sessionStorage.setItem('reporte', JSON.stringify(data));
        sessionStorage.setItem('terminal', this.terminal.nombre);
        sessionStorage.setItem("fechaIni", this.fechaIni)
        sessionStorage.setItem("fechaFin", this.fechaFin)
      },
      complete: () => {
        this.router.navigateByUrl('/ver-reporte');
      },
      error(error: any) {
        console.log(error)
      }
    })
  }

  edit(usuario: Usuario) {
    let index = this.usuarios.map(i => i.id).indexOf(usuario.id);
    this.usuarios[index] = usuario
    if (this.estado !== undefined) {
      let index = this.usuariosFiltrados.map(i => i.id).indexOf(usuario.id);
      if (this.estado === usuario.estado) {
        this.usuariosFiltrados[index] = usuario
      } else {
        this.usuariosFiltrados.splice(index, 1)
      }
    }
  }

  mostrarAcciones(id: number | any) {
    this.dd_acciones = document.getElementById("dd_acciones" + id) as HTMLDivElement
    if (this.dd_acciones.classList.contains("is-active")) {
      this.dd_acciones.classList.remove("is-active")
    } else {
      this.dd_acciones.classList.add("is-active")
    }
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  mesActual() {
    let mes = moment().locale("es").format("MMM")
    mes = mes.charAt(0).toUpperCase() + mes.substring(1)
    return mes;
  }
}
