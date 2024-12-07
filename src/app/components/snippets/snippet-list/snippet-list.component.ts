import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-snippet-list',
  templateUrl: './snippet-list.component.html',
  styleUrl: './snippet-list.component.scss',
})
export class SnippetListComponent implements OnInit, OnDestroy {
  snippets: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private snippetService: SnippetService,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.loadSnippets();
    this.socketService.emitGetSnippets();
    this.subscribeToGetSnippets();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToGetSnippets() {
    this.socketService.on('getSnippets').pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.snippets = data;
    });
  }

  private loadSnippets() {
    this.snippetService.getSnippets().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.snippets = data.snippets;
      },
      error: () => {
        alert('Error loading snippets');
      },
    });
  }

  addSnippet() {
    this.router.navigate(['/snippets/add']);
  }

  deleteSnippet(id: string) {
    this.snippetService.deleteSnippet(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.socketService.emitDeleteSnippet(id);
        this.loadSnippets();
      },
      error: () => {
        alert('Error deleting snippet');
      },
    });
  }

  editSnippet(id: string) {
    this.router.navigate(['/snippets/edit', id]);
  }
}