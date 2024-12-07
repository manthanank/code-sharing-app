import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService to retrieve the token
  const router = inject(Router); // Inject Router to navigate to the login page
  const token = authService.getToken(); // Get the token from the AuthService

  if (!token) {
    authService.logout(); // Call the logout method from AuthService
    router.navigate(['/login']); // Redirect to the login page
    return next(req); // Pass the original request to the next handler
  }

  // Clone the request and add the Authorization header if token exists
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Pass the modified request to the next handler
  return next(clonedRequest);
};
