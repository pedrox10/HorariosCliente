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
}
