import {Injectable} from '@angular/core';
import {Usuario} from "../modelos/Usuario";
import {env} from "../../environments/environments";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class DataService {
  usuarios: Usuario[] = [];
  fechaIni: string = "";
  fechaFin: string = "";
  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {
  }

  cambiarDatos(usuarios: Usuario[], fechaIni: string, fechaFin: string) {
    this.usuarios = usuarios
    this.fechaIni = fechaIni
    this.fechaFin = fechaFin
  }

  public getNotificaciones() {
    return this.http.get(`${this.apiUrl}/terminales/notificaciones`);
  }

  public buscarFuncionariosGlobal(texto: string) {
    return this.http.get(`${this.apiUrl}/terminales/busqueda-global`, {params: {q: texto}});
  }

  public actualizarNotificaciones() {
    return this.http.get(`${this.apiUrl}/terminales/crear-notificaciones`);
  }
}


