import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {env} from "../../environments/environments";
import {Observable} from "rxjs";
import {Grupo} from "../modelos/Grupo";

@Injectable({
  providedIn: 'root'
})

export class TerminalService {

  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {

  }

  public getTerminal(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}`);
  }

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

  public sincronizarTerminal(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/sincronizar/${id}`);
  }

  public conectarTerminal(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/conectar/${id}`);
  }

  public getUsuarios(idTerminal: number) {
    return this.http.get(`${this.apiUrl}/terminal/${idTerminal}/usuarios`);
  }

  public getSincronizaciones(idTerminal: number) {
    return this.http.get(`${this.apiUrl}/terminal/${idTerminal}/sincronizaciones`);
  }

  public getUsuario(id: number) {
    return this.http.get(`${this.apiUrl}/usuario/${id}`);
  }

  public editarUsuario(id: number, body: any) {
    return this.http.put(`${this.apiUrl}/usuario/editar/${id}`, body);
  }

  public getUltMarcacion(usuarioId: number) {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}/ultMarcacion`);
  }

  public getMarcaciones(id: number) {
    return this.http.get(`${this.apiUrl}/marcaciones/${id}`);
  }

  public getResumenMarcaciones(id: number, ini:string, fin: string) {
    return this.http.get(`${this.apiUrl}/usuario/${id}/ini/${ini}/fin/${fin}`);
  }

  public  getJornada(id: number, fecha: string) {
    return this.http.get(`${this.apiUrl}/usuario/${id}/fecha/${fecha}`)
  }

  public getFechaPriMarcacion(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/pri-marcacion`);
  }

  public agregarInterrupcion(body: any) {
    return this.http.post(`${this.apiUrl}/terminal/interrupcion/agregar`, body);
  }

  public eliminarInterrupcion(id: number) {
    console.log(`${this.apiUrl}/terminal/interrupcion/${id}/eliminar`)
    return this.http.delete(`${this.apiUrl}/terminal/interrupcion/${id}/eliminar`);
  }

  public getInterrupciones(id: number) {
    return this.http.get(`${this.apiUrl}/terminal/${id}/interrupciones`);
  }

  public agregarGrupo(idTerminal: number, nombreGrupo: string) {
    return this.http.post(`${this.apiUrl}/terminal/${idTerminal}/grupos/agregar`, { nombre: nombreGrupo });
  }

  public editarGrupo(idTerminal: number, idGrupo: number, nombre: string) {
    return this.http.put(`${this.apiUrl}/terminal/${idTerminal}/grupos/editar/${idGrupo}`, { nombre: nombre });
  }

  public eliminarGrupo(idTerminal: number, idGrupo: number) {
    return this.http.delete(`${this.apiUrl}/terminal/${idTerminal}/grupos/eliminar/${idGrupo}`);
  }
}
