// login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './servicios/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return true;
  }
}
