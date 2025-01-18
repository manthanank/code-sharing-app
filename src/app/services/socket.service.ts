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

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  on(eventName: string, callback: (data: any) => void) {
    this.socket.on(eventName, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
