import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-chat.html',
  styleUrl: './admin-chat.css'
})
export class AdminChat {

  messages$: Observable<any[]>;

  constructor(private chatService: ChatService) {
    this.chatService.connect();
    this.messages$ =
      this.chatService.messages$;
  }
}