import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  isRegister = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = '';
    if (this.isRegister) {
      this.form.get('name')?.setValidators([Validators.required]);
    } else {
      this.form.get('name')?.clearValidators();
    }
    this.form.get('name')?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { name, email, password } = this.form.value;

    if (this.isRegister) {
      this.auth.register({ name, email, password }).subscribe({
        next: () => { this.isRegister = false; this.loading = false; },
        error: (err) => { this.error = err.error?.message || 'Error al registrar'; this.loading = false; }
      });
    } else {
      this.auth.login({ email, password }).subscribe({
        next: () => this.router.navigate(['/hotels']),
        error: () => { this.error = 'Correo o contraseña incorrectos'; this.loading = false; }
      });
    }
  }
}
