import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, HostListener,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
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
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Core, easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {LockPlugin} from "@easepick/lock-plugin";
import {VerHorarioComponent} from "./ver-horario/ver-horario.component";
import {EditarUsuarioComponent} from "./editar-usuario/editar-usuario.component";
import {color, format, formatTime, mensaje, notificacion} from "../inicio/Global";
import {concatMap, from, Subject, takeUntil, toArray} from "rxjs";
import {DataService} from "../../servicios/data.service";
import { CommonModule } from '@angular/common';
import { DomSanitizer} from '@angular/platform-browser';
import {AuthService} from "../../servicios/auth.service";
import {Grupo} from "../../modelos/Grupo";
import {Sincronizacion} from "../../modelos/Sincronizacion";
import {Marcacion} from "../../modelos/Marcacion";
import {UsuarioService} from "../../servicios/usuario.service";
import {LocalCompilationExtraImportsTracker} from "@angular/compiler-cli/src/ngtsc/imports";
import {ComandosService} from "../../servicios/comandos.service";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, RouterModule, CommonModule, ReactiveFormsModule],
  providers: [TerminalService, DataService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  public usuariosFiltrados: Usuario[] = [];
  public usuariosSeleccionados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public terminal: any | Terminal;
  ultimaSincronizacion: Date | any = undefined
  private activatedRoute = inject(ActivatedRoute);
  idTerminal = this.activatedRoute.snapshot.params['id'];
  estado: EstadoUsuario | any = undefined;
  idGrupo: number = -1;
  grupoActual: Grupo | any;
  accionGrupo: string = ""
  fechaMin: string | any;
  fechaIni: string | any;
  fechaFin: string | any;
  picker : Core| any;
  inputRango: HTMLInputElement | any;
  dd_acciones: HTMLDivElement | any;
  escuchaEscape: EventListener | any;
  private destroy$ = new Subject<void>();
  showScrollButton = false;
  isAdmin: boolean;
  isSuperadmin: boolean;
  isCargando = true;
  estadoEsEliminado = false;
  fc_confirmado = new FormControl(false);
  marcaciones: Marcacion[] = [];
  nombre: string | any;
  ci: string | any;
  nombreOrg: string | any;
  paternoOrg: string | any;
  maternoOrg: string | any;
  ciOrg: string | any;
  cargoOrg: string | any;
  contratoOrg: string | any;
  ingresoOrg: string | any;
  conclusionOrg: string | any;
  citeOrg: string | any;
  cargoRotacion: string | any;
  hayRotacion = false;
  public resultados: any[] = [];

  constructor(public terminalService: TerminalService,private router: Router,
              public modalService: ModalService, private location: Location,
              private sanitizer: DomSanitizer, private authService: AuthService,
              public usuarioService: UsuarioService, public comandosService: ComandosService) {

    this.isAdmin  = this.authService.tieneRol('Administrador', 'Superadmin');
    this.isSuperadmin  = this.authService.tieneRol('Superadmin');
    // Carga inicial de usuarios
    this.terminalService.getUsuarios(this.idTerminal).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        this.usuarios = data;
        this.isCargando = false;
        console.log("Usuarios cargados:", this.usuarios);
        // Pre-procesa los usuarios para agregar horarioHtml y estadoHtml
        this.usuarios.forEach(usuario => {
          usuario.estadoHtml = this.getEstado(usuario);   // Asignación válida ahora
        });

        // Aplicar filtros persistentes si existen (estado y texto de búsqueda, ahora también grupo)
        if(env.filtrarEstado && env.estado !== undefined) {
          this.estado = env.estado;
        }
        // Ajuste aquí para el valor de grupo persistente, usar null si env.grupo es -1 o undefined
        if(env.grupo !== -1) {
          this.idGrupo = env.grupo;
        } else {
          this.idGrupo = -1;
        }

        this.aplicarFiltros();
        // Actualizar el campo de búsqueda visualmente si hay texto persistente
        if(env.textoBusqueda !== "") {
          (document.getElementById("tf_busqueda") as HTMLInputElement).value = env.textoBusqueda;
        }
        // Actualizar el estado de los radio buttons de estado
        if (env.filtrarEstado) {
          const estadoMap: Record<number, string> = {
            1: "rb_activo",
            0: "rb_inactivo",
            2: "rb_eliminado",
          };
          const radioId = estadoMap[env.estado];
          if(env.estado == 2)
            this.estadoEsEliminado = true
          if (radioId) {
            const radio = document.getElementById(radioId) as HTMLInputElement | null;
            if (radio) {
              radio.checked = true;
            }
          }
        }
      },
      (error: any) => {
        console.error('An error occurred loading users:', error);
      }
    );

    this.terminalService.getTerminal(this.idTerminal).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        this.terminal = data;
        this.ultimaSincronizacion = moment(this.terminal.ultSincronizacion, "YYYY-MM-DD").toDate()
        setTimeout(() => this.inicializarPicker(), 0);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ngOnInit() {
    this.escuchaEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.ocultarSeleccionarRango();
        this.ocultarAccionGrupo()
        this.ocultarEliminarGrupo()
        this.ocultarAsignarGrupo()
        this.ocultarInfoOrganigram()
        this.ocultarMarcaciones()
      }
    };
    document.addEventListener('keydown', this.escuchaEscape);
    document.getElementById("background")?.addEventListener("click", (e) => {
      this.ocultarSeleccionarRango()
    })
    document.getElementById("fondo_grupo")?.addEventListener("click", (e) => {
      this.ocultarAccionGrupo()
    })
    document.getElementById("fondo_eliminar")?.addEventListener("click", (e) => {
      this.ocultarEliminarGrupo()
    })
    document.getElementById("fondo_asignar")?.addEventListener("click", (e) => {
      this.ocultarAsignarGrupo()
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo({
        top: env.posY,
        left: 0
      });
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if(this.picker)
      this.picker.destroy()
    document.removeEventListener('keydown', this.escuchaEscape);
    this.usuarios = [];
    this.usuariosFiltrados = [];
    this.usuariosSeleccionados = [];
  }

  private inicializarPicker() {
    this.inputRango = document.getElementById('picker_reporte');
    this.picker = new easepick.create({
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
        minDate: moment().startOf("year").toDate(),
        maxDate: moment().endOf("year").toDate()
      },
    });
    let botonVerReporte = (document.getElementById("btn_ver_reporte") as HTMLButtonElement)
    this.picker.gotoDate(moment().subtract(1, "month").toDate());
    this.picker.on('preselect', (e: any) => {
      botonVerReporte.disabled = true;
    })
    this.picker.on('select', (e: any) => {
      botonVerReporte.disabled = false;
      this.fechaIni = moment(this.picker.getStartDate()).format("YYYYMMDD");
      this.fechaFin = moment(this.picker.getEndDate()).format('YYYYMMDD');
    })
  }

  seleccionar(usuario: Usuario) {
    usuario.seleccionado = !usuario.seleccionado;
    if (usuario.seleccionado) {
      this.usuariosSeleccionados = [...this.usuariosSeleccionados, usuario];
    } else {
      this.usuariosSeleccionados = this.usuariosSeleccionados.filter(u => u.ci !== usuario.ci);
    }
    this.actualizarCheckboxTodos(); // Llama a una función para actualizar el estado del checkbox "todos"
  }

  actualizarCheckboxTodos(): void {
    let cb_todos = (document.getElementById("cb_todos") as HTMLInputElement);
    if (this.usuariosSeleccionados.length === this.usuariosFiltrados.length && this.usuariosFiltrados.length > 0) {
      cb_todos.classList.remove("is-indeterminate");
      cb_todos.checked = true;
    } else if (this.usuariosSeleccionados.length === 0) {
      cb_todos.classList.remove("is-indeterminate");
      cb_todos.checked = false;
    } else {
      cb_todos.classList.add("is-indeterminate");
      cb_todos.checked = false; // Asegurarse de que no esté marcado si es indeterminado
    }
  }

  aplicarTodos(ev: any) {
    let esSeleccionado = (<HTMLInputElement>ev.target).checked
    this.marcarTodos(esSeleccionado)
    this.actualizarCheckboxTodos();
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
    let loader = document.getElementById("loader") as HTMLDivElement
    let textoEspera = document.getElementById("texto_espera") as HTMLParagraphElement
    textoEspera.innerText= "Sincronizando terminal ..."
    loader.classList.remove("is-hidden")
    this.terminalService.sincronizarTerminal(this.idTerminal).pipe(takeUntil(this.destroy$)).subscribe(
      (data: any) => {
        let respuesta = data;
        console.log(respuesta)
        this.usuarios = respuesta.usuarios.map((usuario: Usuario) => ({
          ...usuario,
          estadoHtml: this.getEstado(usuario)
        })); // Actualiza la lista completa y aplica HTML
        this.usuariosSeleccionados = []; // Limpiar selecciones
        this.quitarFiltros(); // Quita todos los filtros para mostrar la lista completa
        document.getElementById("ult_sync")!.innerText = "Ult. vez: " + moment(respuesta.hora_terminal).format('DD/MM/YYYY HH:mm');
        this.actualizarCheckboxTodos(); // Asegura que el checkbox "todos" se resetee
        setTimeout(() => {
          document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
          loader.classList.add("is-hidden")
          mensaje(respuesta.mensaje, "is-success")
        }, 1000);
        setTimeout(() => {
          let resumen = "Nuevas marcaciones: " + respuesta.nuevas_marcaciones + "<br>" +
            "Usuarios agregados: " + respuesta.usuarios_agregados + "<br>" +
            "Usuarios editados: " + respuesta.usuarios_editados + "<br>" +
            "Usuarios eliminados: " + respuesta.usuarios_eliminados + "<br>"
          notificacion(resumen, "is-info")
        }, 4000);
      },
      (error: any) => {
        let respuesta = error
        console.error('An error occurred:', error);
        document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
        loader.classList.add("is-hidden")
        if(respuesta.error.mensaje === undefined) {
          mensaje("No se puede acceder al servidor", "is-danger")
        } else {
          mensaje(respuesta.error.mensaje, "is-danger")
        }
      })
  }

  irAtras() {
    this.location.back();
  }

  getHorario(usuario: Usuario) {
    let ultAsignacion = usuario.ultAsignacion
    let color = ultAsignacion == "Sin Asignar" ? this.getColor("Gris") :  this.getColor("Purpura");
    let horario =
      "<div class='help has-text-centered mt-1'>" +
        "<div class='etiqueta' style='background-color: " + color + ";'>" + ultAsignacion + "</div>" +
      "</div>";
    if(ultAsignacion === "Sin Asignar") {
      horario = horario +
      "<div class='dropdown is-hoverable' style='position: absolute; bottom: -8.5px; left: 40%'>" +
        "<div class='dropdown-trigger'>" +
          "<span>" +
            "onmouseover='hover()'" + "class='far fa-question-circle' style='color: #888; background-color:" + this.getColor('Azul') + "';></i>" +
          "</span>" +
        "</div>" +
        "<div class='dropdown-menu' role='menu'>" +
          "<div class='dropdown-content popup' style='background: linear-gradient(360deg, #fcfaf7 0%, #fdf7e7 100%); border: 1px #f4d27b solid;'>" +
            "<div class='contenido' style='color: #786450;'>" +
              "Contenido" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";
    }
    return this.sanitizer.bypassSecurityTrustHtml(horario);
  }

  hover(usuario: Usuario) {
    this.getUltMarcacion(usuario.id)
  }

  getEstado(usuario: Usuario) {
    let color = usuario.estado === EstadoUsuario.Activo ? "#C6FBF9" : usuario.estado === EstadoUsuario.Inactivo ? "#F2F2F2" : "#E7B9C0";
    let estado =
      "<div class='help has-text-centered mt-1'>" +
      "<div class='etiqueta' style='background-color: " + color + ";'>" + EstadoUsuario[usuario.estado] + "</div>" +
      "</div>";
    return this.sanitizer.bypassSecurityTrustHtml(estado);
  }

  getFechaAlta(usuario: Usuario) {
    return moment(usuario.fechaAlta).format('DD/MM/YYYY')
  }

  getFechaBaja(usuario: Usuario) {
    return moment(usuario.fechaBaja).format('DD/MM/YYYY')
  }

  getJornada(usuario: Usuario | any) {
    let fecha = moment().format("YYYYMMDD")
    this.usuarioService.getJornada(usuario.id, fecha).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.log("error")
      })
  }

  getUltMarcacion(idUsuario: number) {
    this.usuarioService.getUltMarcacion(idUsuario).subscribe(
      (data: any) => {
        let div = (document.getElementById("ultMarcacion_" + idUsuario) as HTMLDivElement);
        if(data === null) {
          div.innerHTML = "<span class='semibold'>Ultima marcación:</span>" + "Sin marcaciones"
        } else {
          const fechaCompleta = moment(`${data.fecha} ${data.hora}`, 'YYYY-MM-DD HH:mm:ss');
          const salidaFormateada = fechaCompleta.format("DD/MM/YYYY HH:mm");
          div.innerHTML = "<span class='semibold'>Ultima marcación:</span>" + "El " + salidaFormateada
        }
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
      this.usuarioService.getFechaPriMarcacion(this.idTerminal).pipe(takeUntil(this.destroy$)).subscribe(
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
              if (data !== undefined) {
                console.log(data)
                for(let usuario of this.usuariosSeleccionados) {
                  if(data.res === true) {
                    usuario.ultAsignacion = data.ultDiaAsignado;
                  }
                }
                mensaje("Horario asignado a " + this.usuariosSeleccionados.length + " funcionarios", "is-success")
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

  quitarFiltros() {
    // Resetear filtros
    this.estado = undefined;
    env.filtrarEstado = false;
    this.estadoEsEliminado = false
    env.estado = -1;
    env.textoBusqueda = "";
    this.idGrupo = -1; // Quita el filtro de grupo
    env.grupo = -1

    // Resetear inputs/radios visuales
    const radiosEstados = document.getElementsByName("estados") as NodeListOf<HTMLInputElement>;
    radiosEstados.forEach(radio => radio.checked = false);
      (document.getElementById("tf_busqueda") as HTMLInputElement).value = "";

    this.aplicarFiltros(); // Vuelve a aplicar los filtros para mostrar todos los usuarios
    this.marcarTodos(false);
    this.actualizarCheckboxTodos(); // Asegura el estado correcto del checkbox "todos"
  }

  getIni() {
    if(sessionStorage.getItem("ini")) {
      return sessionStorage.getItem("ini")
    } else {
      const ultSincronizacion = moment(this.ultimaSincronizacion, 'YYYY-MM-DD');
      const dia = ultSincronizacion.date();
      let ini;
      if (dia < 21)
        ini = ultSincronizacion.subtract(1, 'month').date(21).format('YYYYMMDD');
      else
        ini = ultSincronizacion.date(21).format('YYYYMMDD');
      sessionStorage.setItem('ini', ini);
      return ini
    }
  }

  getFin() {
    if(sessionStorage.getItem("fin")) {
      return sessionStorage.getItem("fin")
    } else {
      let fin = moment(this.ultimaSincronizacion).format("YYYYMMDD");
      sessionStorage.setItem('fin', fin);
      return fin
    }
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
    env.posY = window.scrollY
    env.indexUsuario = id_usuario
    this.router.navigate(['/ver-horario', id_usuario]);
  }

  editarUsuario(id_usuario: number | any) {
    let id = id_usuario;
    let origen = "usuarios"
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService.open(EditarUsuarioComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {id, origen}
    }).subscribe((data) => {
      if (data) {
        switch (data.accion) {
          case 'editar':
            this.edit(data.usuario);
            break;
          case 'editar_en_biometrico':
            alert(JSON.stringify(data, null, 2));
            break;
          case 'clonar':
            notificacion(data.mensaje, data.tipo)
            break;
          default:
            console.warn('Acción no reconocida:', data.accion);
            break;
        }
      }
    });
  }

  verReporte() {
    env.posY = 0;
    let loader = document.getElementById("loader") as HTMLDivElement
    let textoEspera = document.getElementById("texto_espera") as HTMLParagraphElement
    textoEspera.innerText= "Generando reporte ..."
    this.ocultarSeleccionarRango()
    loader.classList.remove("is-hidden")
    const result$ =
      from(this.usuariosSeleccionados)
        .pipe(
          concatMap(usuario => {
           return this.usuarioService.getResumenMarcaciones(usuario.id!, this.fechaIni, this.fechaFin)
          }),
          toArray()
        );

    result$.subscribe({
      next: (data: any) => {
        sessionStorage.setItem('reporte', JSON.stringify(data));
        sessionStorage.setItem('terminal', this.terminal.nombre);
        sessionStorage.setItem("fechaIni", this.fechaIni)
        sessionStorage.setItem("fechaFin", this.fechaFin)
        sessionStorage.setItem("usuario", this.authService.obtenerNombre() ?? '')
        sessionStorage.setItem("fechaCreacion", moment().format("DD/MM/YYYY HH:mm"))
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
    //console.log(usuario)
    let index = this.usuarios.map(i => i.id).indexOf(usuario.id);
    this.usuarios[index] = usuario
    if (this.estado !== undefined) {
      let index = this.usuariosFiltrados.map(i => i.id).indexOf(usuario.id);
      usuario.estadoHtml = this.getEstado(usuario);
      if (this.estado === usuario.estado) {
        this.usuariosFiltrados[index] = usuario
      } else {
        this.usuariosFiltrados.splice(index, 1)
      }
    }
    mensaje("¡Funcionario editado!", "is-success")
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
    let mes = moment().locale("es").format("MMMM")
    mes = mes.charAt(0).toUpperCase() + mes.substring(1)
    return mes;
  }

  verMarcaciones(usuario: Usuario) {
    env.posY = window.scrollY
    env.indexUsuario = usuario.id
    sessionStorage.setItem('origen', 'usuarios');
    let usuarios: Usuario[] = [];
    if(this.usuariosSeleccionados.length > 0 && this.usuariosSeleccionados.some(u => u.id === usuario.id))
      usuarios = this.usuariosSeleccionados
    else
      usuarios = this.usuariosFiltrados
    this.router.navigate(['/terminal', this.idTerminal, 'ver-marcaciones', usuario.id, this.getIni(), this.getFin()],
      { state: { usuarios: usuarios }});
  }

  trackByUsuario(index: number, usuario: Usuario): number | undefined {
    return usuario.id; // Asegura que sea un valor único y persistente
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Muestra el botón si el usuario ha hecho scroll más allá del viewport
    this.showScrollButton = window.scrollY > window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectRow(id: number | any) {
    env.indexUsuario = id;
  }

  isSelected(id: number | any): boolean {
    return env.indexUsuario === id;
  }

  filtrarPorGrupo(id: number) {
    if (this.idGrupo === id) {
      this.idGrupo = -1;
      env.grupo = -1;
    } else {
      this.idGrupo = id;
      env.grupo = id; // Almacena -1 en env si es null
    }
    this.aplicarFiltros(); // Re-aplicar todos los filtros
    this.marcarTodos(false); // Desmarcar todos los usuarios seleccionados
  }

  isSelectedGroup(id: number | any): boolean {
    return this.idGrupo === id
  }

  aplicarFiltros(): void {
    let tempUsuarios = [...this.usuarios]; // Siempre comienza con la lista completa de usuarios
    // 1. Filtrar por texto de búsqueda
    if (env.textoBusqueda && env.textoBusqueda.trim() !== "") {
      const lowerCaseSearchTerm = env.textoBusqueda.toLowerCase();
      tempUsuarios = tempUsuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        usuario.ci.toString().includes(lowerCaseSearchTerm)
      );
    }
    // 2. Filtrar por estado
    if (this.estado !== undefined && this.estado !== null) { // Asegura que no sea undefined ni null
      tempUsuarios = tempUsuarios.filter(usuario => usuario.estado == this.estado);
    }
    // 3. Filtrar por grupo
    if (this.idGrupo !== null && this.idGrupo !== -1 && this.idGrupo !== 0) { // -1 también significa sin filtro
      tempUsuarios = tempUsuarios.filter(usuario => usuario.grupo?.id == this.idGrupo);
    }
    if(this.idGrupo === 0) {
      console.log("sin grupo")
      tempUsuarios = tempUsuarios.filter(usuario => usuario.grupo?.id === undefined);
    }
    this.usuariosFiltrados = tempUsuarios;
    if(this.isAdmin)
      this.actualizarCheckboxTodos(); // Actualiza el estado del checkbox "todos"
  }

  filtrarPorTexto($event: any) {
    let texto = $event.target.value.toLowerCase();
    env.textoBusqueda = texto;
    this.aplicarFiltros();
  }

  filtrarPorEstado(ev: any) {
    let valor = (<HTMLInputElement>ev.target).value;
    this.estado = parseInt(valor);
    if(this.estado == 2)
      this.estadoEsEliminado = true
    else
      this.estadoEsEliminado = false
    env.filtrarEstado = true;
    env.estado = this.estado;
    this.aplicarFiltros();
    if(this.isAdmin)
      this.marcarTodos(false); // Desmarca los usuarios seleccionados al cambiar el filtro de estado
  }

  modalAccionGrupo(grupo: Grupo | null) {
    let input = document.getElementById("nombre_grupo") as HTMLInputElement
    let titulo = document.getElementById("titulo_grupo") as HTMLParagraphElement
    if(grupo !== null) {
      this.accionGrupo = "editarGrupo";
      titulo.innerText = "Editar Grupo"
      this.grupoActual = grupo;
      input.value = grupo.nombre;
    } else {
      this.accionGrupo = "agregarGrupo";
      titulo.innerText = "Agregar Grupo"
      input.value = "";
    }
    document.getElementById("grupo_modal")?.classList.add("is-active");
  }

  aplicarAccionGrupo() {
    let nombre = (document.getElementById("nombre_grupo") as HTMLInputElement).value;
    if(this.accionGrupo == "agregarGrupo") {
      console.log("Agregar Grupo")
      this.terminalService.agregarGrupo(this.terminal.id, nombre).subscribe(
        (data: any) => {
          this.terminal.grupos.push(data)
          this.ocultarAccionGrupo()
          mensaje("¡Grupo Agregado!", "is-success")
        },
        (error: any) => {
          console.error('An error occurred:', error);
          mensaje("¡Error, no se pudo agregar!", "is-danger")
        }
      );
    } else {
      if(this.accionGrupo == "editarGrupo") {
        this.terminalService.editarGrupo(this.idTerminal, this.grupoActual.id, nombre).subscribe(
          (data: any) => {
            let index = this.terminal.grupos.map((i: Grupo) => i.id).indexOf(data.id);
            this.terminal.grupos[index] = data;
            this.ocultarAccionGrupo()
            let usuarioAfectados = this.usuarios.filter(u => u.grupo?.id === data.id)
            for(let usuario of usuarioAfectados) {
              usuario.grupo = data
            }
            mensaje("¡Grupo Editado!", "is-success")
          },
          (error: any) => {
            console.error('An error occurred:', error);
            mensaje("¡Error, no se pudo editar!", "is-danger")
          }
        );
      }
    }
  }

  ocultarAccionGrupo() {
    document.getElementById("grupo_modal")?.classList.remove("is-active");
  }

  modalEliminarGrupo(grupo: Grupo) {
    document.getElementById("eliminar_modal")?.classList.add("is-active");
    this.grupoActual = grupo;
  }

  ocultarEliminarGrupo() {
    document.getElementById("eliminar_modal")?.classList.remove("is-active");
  }

  eliminarGrupo() {
    this.terminalService.eliminarGrupo(this.terminal.id, this.grupoActual.id).subscribe(
      (data: any) => {
        let index = this.terminal.grupos.map((i: Grupo) => i.id).indexOf(this.grupoActual.id);
        if(this.idGrupo === data)
          this.filtrarPorGrupo(this.grupoActual.id)
        this.terminal.grupos.splice(index, 1);
        console.log(data)
        this.usuarios.filter(u => u.grupo?.id === data)
          .map(u => u.grupo = null);
        this.ocultarEliminarGrupo()
        mensaje("¡Grupo Eliminado!", "is-success")
      },
      (error: any) => {
        console.error('An error occurred:', error);
        mensaje("¡Error, no se pudo eliminar!", "is-danger")
      }
    );
  }

  modalAsignarGrupo() {
    if (this.usuariosSeleccionados.length > 0) {
      if(this.terminal.grupos.length > 0)
        document.getElementById("asignar_grupo")?.classList.add("is-active");
      else
        mensaje("No existen grupos en este Terminal", "is-warning")
    } else {
      mensaje("Debes seleccionar al menos un funcionario", "is-warning")
    }
  }

  ocultarAsignarGrupo() {
    document.getElementById("asignar_grupo")?.classList.remove("is-active");
  }

  asignarGrupo() {
    let ids = this.usuariosSeleccionados.map(({ id }) => id);
    if(this.fc_confirmado.value === true) {
      this.usuarioService.limpiarGrupo(ids.toString()).subscribe(
        (data:any)=>{
          console.log(data)
          if(data.success) {
            for(let usuario of this.usuariosSeleccionados) {
              usuario.grupo = null;
            }
          }
          mensaje("Grupo limpiado a " + this.usuariosSeleccionados.length + " funcionarios", "is-success")
        }, (error: any) => {
          mensaje("Error, no se pudo asignar el grupo", "is-danger")
        })
    } else {
      let selectGrupos = document.getElementById("select_grupos") as HTMLSelectElement
      let id_grupo = selectGrupos.value
      this.usuarioService.asignarGrupo(parseInt(id_grupo), ids.toString()).subscribe(
        (data:any)=>{
          for(let usuario of this.usuariosSeleccionados) {
            usuario.grupo = data;
          }
          mensaje("Grupo asignado a " + this.usuariosSeleccionados.length + " funcionarios", "is-success")
        }, (error: any) => {
          mensaje("Error, no se pudo asignar el grupo", "is-danger")
        })
    }
    this.fc_confirmado.setValue(false)
    this.ocultarAsignarGrupo()
  }

  modalEliminarFuncionarios() {
    if (this.usuariosSeleccionados.length > 0) {
      document.getElementById("eliminar_funcionarios")?.classList.add("is-active");
    } else {
      mensaje("Debes seleccionar al menos un funcionario", "is-warning")
    }
  }

  ocultarEliminarFuncionarios() {
    document.getElementById("eliminar_funcionarios")?.classList.remove("is-active");
  }

  eliminarFuncionarios() {
    let uids = this.usuariosSeleccionados.map(({ uid }) => uid);
    let cis = this.usuariosSeleccionados.map(({ ci }) => ci);
    if(uids.length > 0) {
      this.comandosService.eliminarFuncionarios(this.idTerminal, uids.toString(), cis.toString()).subscribe(
        (data: any) => {
          alert(JSON.stringify(data))
          /*this.resultados = data
          this.ocultarEliminarFuncionarios()
          document.getElementById("respuestas_eliminacion")?.classList.add("is-active");
          alert(JSON.stringify(this.resultados))
          */
        },
        (error: any) => {
          alert(JSON.stringify(error))
        })
    }
  }

  modalMarcaciones(usuario: Usuario) {
    document.getElementById("marcaciones_modal")?.classList.add("is-active");
    this.nombre = usuario.nombre;
    this.ci = usuario.ci + "";
    this.usuarioService.getMarcaciones(usuario.id).subscribe(
      (data: any) => {
        this.marcaciones = data;
        console.log(data)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  ocultarMarcaciones() {
    document.getElementById("marcaciones_modal")?.classList.remove("is-active");
  }

  modalInfoOrganigram(ci: number) {
    this.usuarioService.infoOrganigram(ci).subscribe(
      (data: any) => {
        if (data.exito) {
          document.getElementById("organigram_modal")?.classList.add("is-active");
          this.nombreOrg = data.respuesta.id_funcionario.nombre;
          this.paternoOrg = data.respuesta.id_funcionario.paterno;
          this.maternoOrg = data.respuesta.id_funcionario.materno;
          this.ciOrg = data.respuesta.id_funcionario.ci;
          this.cargoOrg = data.respuesta.id_cargo.nombre;
          this.contratoOrg = data.respuesta.id_cargo.contrato;
          this.ingresoOrg = data.respuesta.fecha_ingreso;
          this.conclusionOrg = data.respuesta.fecha_conclusion;
          this.citeOrg = data.respuesta.cite;
          if (data.respuesta.id_rotacion) {
            this.hayRotacion = true;
            this.cargoRotacion = data.respuesta.id_rotacion.descripcion
          } else {
            this.hayRotacion = false;
            this.cargoRotacion = "";
          }
        } else {
          if(data.exito === false) {
            mensaje(data.respuesta, "is-danger")
          }
        }
      },
      (error: any) => {
        mensaje("¡No hay conexión a Organigrama!", "is-danger")
      }
    );
  }

  ocultarInfoOrganigram() {
    document.getElementById("organigram_modal")?.classList.remove("is-active");
  }

  formatear(fecha: Date){
    return format(fecha)
  }
}
