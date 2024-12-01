import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snippet-list',
  imports: [],
  templateUrl: './snippet-list.component.html',
  styleUrl: './snippet-list.component.scss',
})
export class SnippetListComponent implements OnInit {
  snippets: any[] = [];

  constructor(private snippetService: SnippetService, private router: Router) {}

  ngOnInit() {
    this.loadSnippets();
  }

  loadSnippets() {
    this.snippetService.getSnippets().subscribe({
      next: (data) => {
        this.snippets = data.snippets;
      },
      error: (err) => {
        alert('Error loading snippets');
      },
    });
  }

  addSnippet() {
    this.router.navigate(['/snippets/add']);
  }
}
