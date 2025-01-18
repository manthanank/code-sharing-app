import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  router = inject(Router);

  addSnippet() {
    const randomId = this.generateUniqueId();
    this.router.navigate([`/${randomId}`]);
  }

  private generateUniqueId(): string {
    const randomPart = Math.random().toString(36).substring(2, 11);
    const timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
  }
}
