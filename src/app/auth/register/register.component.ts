import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatLabel,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  loading = false;
  error = '';

  authService = inject(AuthService);
  router = inject(Router);
  socket = inject(SocketService);
  fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: (data) => {
          this.loading = false;
          this.router.navigate(['/snippets']);
          this.socket.emitNewUser(data.user);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error.error || 'Registration failed';
        },
      });
    }
  }
}
