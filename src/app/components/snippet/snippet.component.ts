import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);

  id = signal<string>(this.route.snapshot.params['id']);
  snippet = computed(() => this.snippetForm.value);

  constructor() {
    const formattedDate = this.datePipe.transform(new Date(), 'MMM d, h:mm a');
    this.snippetForm = this.fb.group({
      title: [formattedDate],
      content: [''],
    });
  }

  ngOnInit(): void {
    this.saveSnippet();
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
      .subscribe({
        next: (value) => {
          this.saveSnippet();
        },
      });

    this.socketService.on('addUpdateSnippet', (data) => {
      this.snippetForm.patchValue(data);
    });
  }

  private saveSnippet(): void {
    const formValue = this.snippetForm.value;

    const newSnippet = {
      _id: this.id(),
      title: formValue?.title || '',
      content: formValue?.content || '',
    };

    this.snippetService.addUpdateSnippet(newSnippet).subscribe({
      next: (data) => {
        this.socketService.emit('addUpdateSnippet', newSnippet);
      },
      error: () => this.showSnackBar('Error creating snippet'),
    });
  }

  shareSnippet(): void {
    const url = window.location.href;
    navigator.share({ title: 'Snippet', text: this.snippet().content, url });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'snackbar-error',
    });
  }
}