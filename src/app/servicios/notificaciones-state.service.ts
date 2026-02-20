import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class NotificacionesStateService {

  private state$ = new BehaviorSubject<{
    mostrar: boolean;
    semana: 'actual' | 'anterior';
    scrollY: number;
    usuarioId: number;
  }>({
    mostrar: false,
    semana: 'actual',
    scrollY: 0,
    usuarioId: 0
  });

  setState(state: Partial<{
    mostrar: boolean;
    semana: 'actual' | 'anterior';
    scrollY: number;
    usuarioId: number;
  }>) {
    this.state$.next({ ...this.state$.value, ...state });
  }

  getState() {
    return this.state$.value;
  }
}
