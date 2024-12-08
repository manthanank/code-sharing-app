import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  auth = inject(AuthService);
  router = inject(Router);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.auth.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => {
        this.isLoggedIn = !!token;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}