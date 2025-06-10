import {Component, OnInit} from '@angular/core';
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
export class LoginComponent implements OnInit{
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

  ngOnInit(): void {
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/']); // mantiene la URL que Angular usaría normalmente
    }
  }

  login() {
    if (this.loginForm.invalid) return;
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value).subscribe({
      next: usuario => {
        const rol = usuario.rol;
        if (rol === 'Administrador' || "Visualizador") {
          this.router.navigate(['/ver-terminales']); // Ruta para administrador
        } else {
          this.errorMsg = 'Rol desconocido';
        }
      },
      error: err => {
        this.errorMsg = 'Usuario o clave incorrectos';
      }
    });
  }

  showClave() {
    this.mostrarClave = !(this.mostrarClave);
  }
}
