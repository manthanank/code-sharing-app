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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatLabel,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loading = false;
  error = '';

  authService = inject(AuthService);
  router = inject(Router);
  socket = inject(SocketService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/snippets']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (data) => {
          this.router.navigate(['/snippets']);
          this.socket.emitLogin(data.user);
          this.loading = false;
          this.snackBar.open('Login successful', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success',
          });
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error?.error || 'An error occurred';
          this.loading = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error',
          });
        },
      });
    }
  }
}
