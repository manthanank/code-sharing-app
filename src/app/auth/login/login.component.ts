import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  authService = inject(AuthService);
  router = inject(Router);
  socket = inject(SocketService);

  constructor() {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        this.router.navigate(['/snippets']);
        this.socket.emitLogin(data.user);
      },
      error: (err) => {
        alert(err.error.error || 'Login failed');
      },
    });
  }
}
