import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  auth = inject(AuthService);
  router = inject(Router);

  constructor() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }
  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
