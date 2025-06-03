import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {env} from "../../environments/environments";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = env.apiUrl; // Ajusta tu URL

  constructor(private http: HttpClient) {}

  login(credentials: { nombreUsuario: string; clave: string }) {
    return this.http.post<{ id: number; nombre: string; rol: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(usuario => {
        // Guardar en sessionStorage (mejor para sesiones temporales)
        sessionStorage.setItem('usuarioId', String(usuario.id));
        sessionStorage.setItem('nombre', usuario.nombre);
        //sessionStorage.setItem('usuario', usuario.nombreUsuario);
        sessionStorage.setItem('rol', usuario.rol);
      })
    );
  }

  logout() {
    sessionStorage.clear();
  }

  obtenerNombre() {
    return sessionStorage.getItem('nombre');
  }

  obtenerRol() {
    return sessionStorage.getItem('rol');
  }

  estaAutenticado() {
    return !!sessionStorage.getItem('rol');
  }
}
