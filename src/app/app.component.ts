import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from "./shared/footer/footer.component";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'code-sharing-app';
  apiURL = environment.apiUrl + '/visit';
  meta = inject(Meta);
  http = inject(HttpClient);

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

  ngOnInit() {
    this.http
    .post(this.apiURL, {
      projectName: this.title,
    })
    .subscribe({
      next: (response) => {
        console.log('Data posted successfully:', response);
      },
      error: (error) => {
        console.error('Error posting data:', error);
      },
    });
  }
}
