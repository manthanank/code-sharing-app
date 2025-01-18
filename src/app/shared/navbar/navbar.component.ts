import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  isLoggedIn = false;

  constructor() {
    this.initializeAuthState();
  }

  ngOnInit(): void {
    // Check initial token state
    this.isLoggedIn = Boolean(this.authService.getToken());
  }

  private initializeAuthState(): void {
    this.authService
      .getAuthState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((token) => {
        this.isLoggedIn = Boolean(token);
      });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}
