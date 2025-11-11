import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {env} from "../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) { }

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

  public infoOrganigram(ci: number) {
    return this.http.get(`${this.apiUrl}/usuario/${ci}/info-organigram`);
  }

  public asignarGrupo(id: number, ids: string) {
    return this.http.get(`${this.apiUrl}/asignar-grupo/${id}/usuarios/${ids}`);
  }

  public limpiarGrupo(ids: string) {
    return this.http.get(`${this.apiUrl}/limpiar-grupo/usuarios/${ids}`);
  }
}
