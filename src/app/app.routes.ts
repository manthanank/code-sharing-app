import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/snippet/snippet.component').then(
        (m) => m.SnippetComponent
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
