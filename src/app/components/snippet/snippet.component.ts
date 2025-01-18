import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-snippet',
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.scss'],
  providers: [DatePipe],
})
export class SnippetComponent implements OnInit {
  snippetForm: FormGroup;

  private fb = inject(FormBuilder);
  private snippetService = inject(SnippetService);
  private socketService = inject(SocketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);

  id: string = this.route.snapshot.params['id'];
  private lastSavedSnippet = new BehaviorSubject<{ title: string; content: string; expiresAt?: string }>({ title: '', content: '' });

  constructor() {
    this.snippetForm = this.fb.group({
      title: [''],
      content: [''],
      expiresAt: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    // Load snippet data on init
    this.loadSnippet();

    // Set up form change handling
    this.snippetForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          const prevEmpty = !prev?.title && !prev?.content;
          const currEmpty = !curr?.title && !curr?.content;
          return (
            (prevEmpty && currEmpty) ||
            (prev?.title === curr?.title && prev?.content === curr?.content)
          );
        })
      )
      .subscribe(() => this.saveSnippet());

    // Handle real-time updates from the socket
    this.socketService.on('addUpdateSnippet', (data) => {
      const formattedExpiresAt = this.datePipe.transform(data.expiresAt, 'MMM d, h:mm a');
      this.snippetForm.patchValue({ ...data, expiresAt: formattedExpiresAt });
      this.lastSavedSnippet.next(data);
    });
  }

  private loadSnippet(): void {
    // Fetch snippet from the backend
    this.snippetService.getSnippet(this.id).subscribe({
      next: (snippet) => {
        if (snippet) {
          const formattedExpiresAt = this.datePipe.transform(snippet.expiresAt, 'MMM d, h:mm a');
          this.snippetForm.patchValue({ ...snippet, expiresAt: formattedExpiresAt });
          this.lastSavedSnippet.next(snippet);
        } else {
          // Initialize a new snippet with a default title if not found
          const formattedDate = this.datePipe.transform(new Date(), 'MMM d, h:mm a');
          this.snippetForm.patchValue({ title: formattedDate, content: '' });
        }
      },
      error: () => this.showSnackBar('Error loading snippet'),
    });
  }

  private saveSnippet(): void {
    const formValue = this.snippetForm.value;

    const newSnippet = {
      _id: this.id,
      title: formValue?.title || '',
      content: formValue?.content || '',
    };

    // Compare with last saved snippet to prevent redundant updates
    const lastSaved = this.lastSavedSnippet.getValue();
    if (lastSaved.title !== newSnippet.title || lastSaved.content !== newSnippet.content) {
      this.snippetService.addUpdateSnippet(newSnippet).subscribe({
        next: (data) => {
          this.socketService.emit('addUpdateSnippet', newSnippet);
          this.lastSavedSnippet.next(newSnippet);
        },
        error: () => this.showSnackBar('Error saving snippet'),
      });
    }
  }

  shareSnippet(): void {
    const url = window.location.href;
    navigator.share({ title: 'Snippet', text: this.snippetForm.value.content, url });
  }

  deleteSnippet(): void {
    const confirmed = window.confirm('Are you sure you want to delete this snippet?');
    if (confirmed) {
      this.snippetService.deleteSnippet(this.id).subscribe({
        next: () => {
          this.socketService.emit('deleteSnippet', this.id);
          this.showSnackBar('Snippet deleted');
          this.snippetForm.reset();
          this.router.navigate(['/']);
        },
        error: () => this.showSnackBar('Error deleting snippet'),
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'snackbar-error',
    });
  }
}