import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: Socket;
  private activeUsersSubject = new Subject<any>();

  constructor(private authService: AuthService) {}

  async connect(): Promise<void> {
    try {
      const profile = await this.authService.getProfile();
      const userId = profile.id;
      this.socket = io('http://localhost:3000', {
        path: '/realtime',
        query: {
          userId: userId,
        },
      });
      console.log('WebSocket connection initialized with userId:', userId);

      // Listen for active users event
      this.socket.on('activeUsers', (users: any) => {
        this.activeUsersSubject.next(users);
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }
  // Get active users as an observable
  getActiveUsers(): Observable<any> {
    const res = this.activeUsersSubject.asObservable();

    return res;
  }

  sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  onMessage(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: any) => {
        subscriber.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
