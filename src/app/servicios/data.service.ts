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
    return {
      semana_actual: {
        terminales: [
          {
            id: 1,
            nombre: 'DES. HUMANO',
            totalNotificaciones: 5,
            usuarios: [
              {
                id: 10,
                nombre: 'José Robles',
                diasSinMarcacion: 2,
                diasSinAsignacion: 2
              },
              {
                id: 11,
                nombre: 'Marcos Vega',
                diasSinMarcacion: 2,
                diasSinAsignacion: 0
              }
            ]
          }
        ]
      },
      semana_anterior: {
        terminales: []
      },
      ultimaActualizacion: '10/02/2024 2:00am'
    };
  }
}


