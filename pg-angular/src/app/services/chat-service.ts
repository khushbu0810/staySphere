import { Injectable, NgZone } from '@angular/core';
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


  /*
  
  Angular
     ↓
  /pg-app/sendMessage
     ↓
  Spring WebSocket Controller
     ↓
  Backend broadcasts
     ↓
  /topic/messages
     ↓
  All subscribed clients receive message
  
  
  */



  // Emits ONE realtime message at a time
  private messagesSubject = new BehaviorSubject<ChatMessage | null>(null);
  messages$ = this.messagesSubject.asObservable();

  private isConnected = false;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  connect() {
    if (this.isConnected) {
      return;
    }
    //create socket .. connect to backend endpoint ("/chat) 
    const socket = new SockJS(`${globalUrl}/chat`);
    //creating stomp client over the socket connection
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        this.isConnected = true;
        console.log("WEBSOCKET CONNECTED");
        //frontend listens to the topic "/topic/messages" for incoming messages from the backend
        this.stompClient.subscribe('/topic/messages',
          (message: any) => {
            //angular zone is used to ensure that the UI updates when a new message is received
            this.ngZone.run(() => {
              //backend send message as JSON string, so we parse it to get the ChatMessage object
              const chatMessage: ChatMessage = JSON.parse(message.body);
              console.log("REALTIME MESSAGE RECEIVED", chatMessage);
              //provide the received message to any component that is subscribed to messages$ observable
              this.messagesSubject.next(chatMessage);
            });
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
    //activate the stomp client to establish the connection
    this.stompClient.activate();
  }

  sendMessage(chatMessage: ChatMessage) {
    console.log("SEND CLICKED");
    if (!this.stompClient.active) {
      console.log("NOT CONNECTED");
      return;
    }
    //send the message to the backend endpoint "/pg-app/sendMessage" using the stomp client
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

    return this.http.get<ChatMessage[]>(
      `${globalUrl}/messages`
    );
  }
}