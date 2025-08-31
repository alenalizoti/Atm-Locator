import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  public numberSubject = new BehaviorSubject<number[] | null>(null);
  public number$ = this.numberSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000'); // Adjust to your backend
    this.socket.on('validationArray', (data) => {
      this.numberSubject.next(data.arrayOfNums); 
    });
  }
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
