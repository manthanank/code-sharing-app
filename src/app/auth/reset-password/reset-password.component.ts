import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatLabel,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  resetToken: string;
  email: string;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
    });

    this.resetToken = this.route.snapshot.params['token'];
    this.email = this.route.snapshot.params['email'];
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.value.password;
      this.authService
        .resetPassword(password, this.resetToken, this.email)
        .subscribe(
          (response) => {
            // Handle successful response
            this.router.navigate(['/login']);
            this.snackBar.open('Password reset', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'snackbar-success',
            });
          },
          (error) => {
            // Handle error response
            console.error('Error resetting password', error);
            this.snackBar.open('Error resetting password', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'snackbar-error',
            });
          }
        );
    }
  }
}
