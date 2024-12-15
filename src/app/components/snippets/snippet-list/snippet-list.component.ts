import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SnippetService } from '../../../services/snippet.service';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snippet-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatAccordion,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './snippet-list.component.html',
  styleUrl: './snippet-list.component.scss',
})
export class SnippetListComponent implements OnInit, OnDestroy {
  snippets: any[] = [];
  private destroy$ = new Subject<void>();

  snippetService = inject(SnippetService);
  router = inject(Router);
  socketService = inject(SocketService);
  snackBar = inject(MatSnackBar);

  constructor() {}

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
    this.socketService
      .on('getSnippets')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.snippets = data;
      });
  }

  private loadSnippets() {
    this.snippetService
      .getSnippets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.snippets = data.snippets;
        },
        error: () => {
          this.snackBar.open('Error loading snippets', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error',
          });
        },
      });
  }

  addSnippet() {
    this.router.navigate(['/snippets/add']);
  }

  deleteSnippet(id: string) {
    this.snippetService
      .deleteSnippet(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.socketService.emitDeleteSnippet(id);
          this.loadSnippets();
        },
        error: () => {
          this.snackBar.open('Error deleting snippet', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error',
          });
        },
      });
  }

  editSnippet(id: string) {
    this.router.navigate(['/snippets/edit', id]);
  }
}
