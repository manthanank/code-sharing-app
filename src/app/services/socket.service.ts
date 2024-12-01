import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socketUrl = environment.socketUrl;
  private socket: Socket;

  constructor() {
    this.socket = io(this.socketUrl);
  }

  onCodeChange(callback: (data: any) => void): void {
    this.socket.on('code-update', callback);
  }

  emitCodeChange(snippetId: string, code: string): void {
    this.socket.emit('code-change', { snippetId, code });
  }
}
