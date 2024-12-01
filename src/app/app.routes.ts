import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'snippets',
    loadComponent: () =>
      import('./components/snippets/snippet-list/snippet-list.component').then(
        (m) => m.SnippetListComponent
      ),
  },
  {
    path: 'snippets/add',
    loadComponent: () =>
      import('./components/snippets/add-snippet/add-snippet.component').then(
        (m) => m.AddSnippetComponent
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
