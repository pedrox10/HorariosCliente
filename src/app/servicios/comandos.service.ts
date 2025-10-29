import { Injectable } from '@angular/core';
import {env} from "../../environments/environments";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ComandosService {

  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {

  }

  public conectar(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/conectar`);
  }

  public infoCapacidad(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/info-capacidad`);
  }

  public infoExtra(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/info-extra`);
  }

  public horaActual(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/hora-actual`);
  }

  public sincronizarFecha(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/sincronizar-fecha`);
  }

  public borrarMarcaciones(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/borrar-marcaciones`);
  }

  public borrarTodo(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/borrar-todo`);
  }

  public apagar(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/apagar`);
  }

  public reiniciar(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/reiniciar`);
  }

  public clonarUsuario(idUsuario: number, idOrigen: number, idDestino: number) {
    return this.http.get(`${this.apiUrl}/usuario/${idUsuario}/clonar/origen/${idOrigen}/destino/${idDestino}`);
  }

  public eliminarFuncionarios(idTerminal: number, uids: string) {
    return this.http.get(`${this.apiUrl}/terminal/${idTerminal}/eliminar-funcionarios/${uids}`);
  }
}
