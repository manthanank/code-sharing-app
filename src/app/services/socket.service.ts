import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socketUrl = environment.socketUrl;
  private socket: Socket;

  constructor() {
    this.socket = io(this.socketUrl);
  }

  emitNewUser(data: any): void {
    this.socket.emit('newUser', data);
  }

  emitLogin(data: any): void {
    this.socket.emit('login', data);
  }

  emitGetUser(id: string): void {
    this.socket.emit('getUser', id);
  }

  emitGetSnippets(): void {
    this.socket.emit('getSnippets');
  }

  emitCreateSnippet(data: any): void {
    this.socket.emit('createSnippet', data);
  }

  emitGetSnippet(id: string): void {
    this.socket.emit('getSnippet', id);
  }

  emitUpdateSnippet(data: any): void {
    this.socket.emit('updateSnippet', data);
  }

  emitDeleteSnippet(id: string): void {
    this.socket.emit('deleteSnippet', id);
  }

  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
