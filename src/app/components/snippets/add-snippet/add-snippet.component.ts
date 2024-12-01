import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-snippet',
  imports: [FormsModule],
  templateUrl: './add-snippet.component.html',
  styleUrl: './add-snippet.component.scss',
})
export class AddSnippetComponent {
  snippetTitle: string = '';
  snippetDescription: string = '';
  snippetContent: string = '';

  constructor(private snippetService: SnippetService, private router: Router) {}

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
      },
      error: (err) => {
        alert('Error adding snippet');
      },
    });
  }
}
