import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatLabel,
    MatSnackBarModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.authService.forgotPassword(email).subscribe(
        (response) => {
          // Handle successful response
          this.router.navigate(['/login']);
          this.snackBar.open('Password reset email sent', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success',
          });
        },
        (error) => {
          // Handle error response
          console.error('Error sending password reset email', error);
          this.snackBar.open('Error sending password reset email', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error',
          });
        }
      );
    }
  }
}
