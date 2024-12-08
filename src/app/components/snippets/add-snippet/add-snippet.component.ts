import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-snippet',
  imports: [
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-snippet.component.html',
  styleUrl: './add-snippet.component.scss',
})
export class AddSnippetComponent {
  snippetTitle: string = '';
  snippetDescription: string = '';
  snippetContent: string = '';

  snippetService = inject(SnippetService);
  router = inject(Router);
  socket = inject(SocketService);

  constructor() {}

  addSnippet() {
    if (
      !this.snippetTitle ||
      !this.snippetDescription ||
      !this.snippetContent
    ) {
      alert('Please fill in all fields');
      return;
    }
    const newSnippet = {
      title: this.snippetTitle,
      description: this.snippetDescription,
      content: this.snippetContent,
    };
    this.snippetService.createSnippet(newSnippet).subscribe({
      next: (data) => {
        this.router.navigate(['/snippets']);
        this.socket.emitCreateSnippet(data);
      },
      error: (err) => {
        alert('Error adding snippet');
      },
    });
  }

  cancelAdd() {
    this.router.navigate(['/snippets']);
  }
}
