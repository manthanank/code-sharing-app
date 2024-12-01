import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService to retrieve the token
  const token = authService.getToken(); // Get the token from the AuthService

  // Clone the request and add the Authorization header if token exists
  const clonedRequest = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  // Pass the modified or original request to the next handler
  return next(clonedRequest);
};
