import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-snippet',
  imports: [
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
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
  snackBar = inject(MatSnackBar);

  constructor() {}

  addSnippet() {
    if (
      !this.snippetTitle ||
      !this.snippetDescription ||
      !this.snippetContent
    ) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error',
      });
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
        this.snackBar.open('Snippet created', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'snackbar-success',
        });
      },
      error: (err) => {
        this.snackBar.open('Error creating snippet', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'snackbar-error',
        });
      },
    });
  }

  cancelAdd() {
    this.router.navigate(['/snippets']);
  }
}
