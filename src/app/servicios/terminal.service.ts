import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {env} from "../../environments/environments";

@Injectable({
  providedIn: 'root'
})

export class TerminalService {
  private apiUrl = env.apiUrl;
  constructor(private http: HttpClient) { }

  public getTerminales() {
    return this.http.get(`${this.apiUrl}/terminales`);
  }

  public agregarTerminal(body: any) {
    return this.http.post(`${this.apiUrl}/terminal/agregar`, body);
  }

  public editarTerminal(id: number, body: any) {
    return this.http.put(`${this.apiUrl}/terminal/editar/${id}`, body);
  }

  public eliminarTerminal(id: number) {
    return this.http.delete(`${this.apiUrl}/terminal/eliminar/${id}`);
  }

  public sincronizarTerminal(id:number) {
    return this.http.get(`${this.apiUrl}/terminal/sincronizar/${id}`);
  }

  public finSincTerminal(id:number) {
    return this.http.get(`${this.apiUrl}/terminal/sincronizar/fin/${id}`);
  }

  public getUsuarios(idTerminal:number) {
    return this.http.get(`${this.apiUrl}/terminal/${idTerminal}/usuarios`);
  }

  public getMarcaciones(ip:string, puerto:number) {

    return this.http.get(`${this.apiUrl}/marcaciones/` + ip + "/" + puerto);
  }
}
