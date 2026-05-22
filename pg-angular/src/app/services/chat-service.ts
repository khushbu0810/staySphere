import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { globalUrl } from '../../globalUrl';
import { ChatMessage } from '../model/ChatMessage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private stompClient!: Client;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private isConnected = false;

  constructor(private http: HttpClient) { }

  connect() {
    if (this.isConnected) {
      return;
    }
    const socket = new SockJS(`${globalUrl}/chat`);

    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        this.isConnected = true;
        console.log("WEBSOCKET CONNECTED");
        this.stompClient.subscribe(
          '/topic/messages',
          (message: any) => {
            const chatMessage = JSON.parse(message.body);
            console.log(chatMessage);
            const current = this.messagesSubject.value;
            const alreadyExists = current.some(
              msg => msg.id === chatMessage.id
            );
            if (!alreadyExists) {
              this.messagesSubject.next([
                ...current,
                chatMessage
              ]);

            }
          }
        );
      },
      onStompError: (frame) => {
        console.error(
          'Broker error',
          frame.headers['message']
        );
        console.error(
          'Details',
          frame.body
        );
      }
    });

    this.stompClient.activate();
  }

  sendMessage(chatMessage: ChatMessage) {
    console.log("SEND CLICKED");
    if (!this.stompClient.active) {
      console.log("NOT CONNECTED");
      return;
    }

    this.stompClient.publish({
      destination: '/pg-app/sendMessage',
      body: JSON.stringify(chatMessage)
    });

    console.log("MESSAGE SENT");
  }

  getMessages() {
    return this.messages$;
  }

  getAllOldMessages() {
    return this.http.get<any[]>(
      `${globalUrl}/messages`
    );

  }
}