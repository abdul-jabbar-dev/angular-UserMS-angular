import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socket!: Socket;
  private readonly uri: string = 'http://localhost:3000';
  private userId!: string;

  constructor() {}

  // Initialize the WebSocket connection
  async initializeSocket(userId: string): Promise<void> {
    try {
      if (userId) {
        this.socket = io(this.uri, {
          transports: ['websocket'],
          query: { userID: userId },
        });
      } else {
        throw new Error('No user ID provided');
      }
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  }

  // Emit a message to the server
  sendMessage(event: string, message: any) {
    if (this.socket) {
      this.socket.emit(event, message);
    } else {
      console.error('Socket is not initialized.');
    }
  }
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  // Listen for a message from the server
  onMessage(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(event);
      };
    });
  }

  // Disconnect the WebSocket
  disconnect() {
    this.socket?.disconnect();
  }

  // Request active users and listen for updates in real-time
  getActiveUsers(id: string): Observable<boolean> {
    this.socket.emit('getActiveUsers');

    return new Observable((observer) => {
      this.socket.on('activeUsers', (activeUsers) => {
       
        observer.next(activeUsers.includes(id + ''));
      });
    });
  }
}
