import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'code-sharing-app';
  meta = inject(Meta);

  constructor() {
    this.meta.addTags([
      {
        name: 'description',
        content:
          'A simple Code Sharing App built using Angular, Node.js, Express, and MongoDB.',
      },
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      {
        rel: 'canonical',
        href: 'https://code-sharing-app-manthanank.vercel.app/',
      },
      { property: 'og:title', content: 'Code Sharing App' },
      { name: 'author', content: 'Manthan Ankolekar' },
      { name: 'keywords', content: 'angular, nodejs. express, mongodb' },
      { name: 'robots', content: 'index, follow' },
      {
        property: 'og:description',
        content:
          'A simple Code Sharing App built using Angular, Node.js, Express, and MongoDB.',
      },
      {
        property: 'og:image',
        content: 'https://code-sharing-app-manthanank.vercel.app/image.jpg',
      },
      {
        property: 'og:url',
        content: 'https://code-sharing-app-manthanank.vercel.app/',
      },
    ]);
  }
}
