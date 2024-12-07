import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';

  authService = inject(AuthService);
  router = inject(Router);
  socket = inject(SocketService);

  constructor() {}

  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (data) => {
        this.router.navigate(['/snippets']);
        this.socket.emitNewUser(data.user);
      },
      error: (err) => {
        alert(err.error.error || 'Registration failed');
      },
    });
  }
}
