import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnippetService } from '../../../services/snippet.service';
import { SocketService } from '../../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-snippet',
  imports: [FormsModule, MatToolbarModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-snippet.component.html',
  styleUrl: './edit-snippet.component.scss',
})
export class EditSnippetComponent implements OnInit {
  snippetTitle: string = '';
  snippetDescription: string = '';
  snippetContent: string = '';
  snippetId: string = '';

  snippetService = inject(SnippetService);
  router = inject(Router);
  socket = inject(SocketService);
  route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    this.snippetId = this.route.snapshot.params['id'];
    this.snippetService.getSnippet(this.snippetId).subscribe({
      next: (data) => {
        this.snippetTitle = data.title;
        this.snippetDescription = data.description;
        this.snippetContent = data.content;
      },
      error: (err) => {
        alert('Error loading snippet');
      },
    });

    this.socket.emitGetSnippet(this.snippetId);
  }

  updateSnippet() {
    if (
      !this.snippetTitle ||
      !this.snippetDescription ||
      !this.snippetContent
    ) {
      alert('Please fill in all fields');
      return;
    }
    const updatedSnippet = {
      title: this.snippetTitle,
      description: this.snippetDescription,
      content: this.snippetContent,
    };
    this.snippetService
      .updateSnippet(this.snippetId, updatedSnippet)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/snippets']);
          this.socket.emitUpdateSnippet(data);
        },
        error: (err) => {
          alert('Error updating snippet');
        },
      });
  }

  cancelEdit() {
    this.router.navigate(['/snippets']);
  }
}
