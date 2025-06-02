import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../servicios/auth.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, RouterLink, ReactiveFormsModule, CommonModule, RouterModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';
  mostrarClave = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: usuario => {
        const rol = usuario.rol;

        if (rol === 'admin') {
          console.log("rol es admin")
          //this.router.navigate(['/admin']); // Ruta para administrador
        } else if (rol === 'visor') {
          console.log("rol es visor")
          //this.router.navigate(['/visor']); // Ruta para visor
        } else {
          this.errorMsg = 'Rol desconocido';
        }
      },
      error: err => {
        this.errorMsg = 'Usuario o clave incorrectos';
      }
    });
  }
}
