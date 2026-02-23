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
    return [
      {
        "usuarioId": 12,
        "nombre": "PEDRO BARCO CARRASCO",
        "ci": 5907490,
        "estado": "Activo",
        "terminalId": 1,
        "terminalNombre": "Planta Baja"
      },
      {
        "usuarioId": 12,
        "nombre": "PEDRO BARCO",
        "ci": 5907490,
        "estado": "Eliminado",
        "terminalId": 4,
        "terminalNombre": "Segundo Piso"
      }
    ]
  }
}


