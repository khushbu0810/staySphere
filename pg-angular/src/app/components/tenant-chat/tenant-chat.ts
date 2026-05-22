import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ChatService } from '../../services/chat-service';
import { AuthService } from '../../services/auth-service';
import { TenantService } from '../../services/tenant-service';

@Component({
  selector: 'app-tenant-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tenant-chat.html',
  styleUrl: './tenant-chat.css'
})
export class TenantChat implements OnInit {

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  message = '';
  tenantId!: number;
  tenantName = '';
  loggedInEmail = '';
  messages: any[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private tenantService: TenantService
  ) { }

  ngOnInit(): void {

    this.chatService.connect();

    this.loggedInEmail =
      this.authService.getAuthenticatedUserEmail() || '';

    const userId =
      this.authService.getAuthenticatedUserId();

    this.tenantService
      .getTenantByUserId(userId!)
      .subscribe({

        next: (tenant) => {

          this.tenantId = tenant.id;
          this.tenantName = tenant.name;

          // LOAD OLD DATABASE CHATS
          this.chatService
            .getAllOldMessages()
            .subscribe(oldMessages => {

              this.messages = oldMessages;

              setTimeout(() => {
                this.scrollToBottom();
              }, 100);

            });

          // REALTIME WEBSOCKET CHATS
          this.chatService
            .getMessages()
            .subscribe(newMessages => {

              const uniqueMessages =
                newMessages.filter(
                  newMsg =>
                    !this.messages.some(
                      oldMsg =>
                        oldMsg.id === newMsg.id
                    )
                );

              this.messages = [
                ...this.messages,
                ...uniqueMessages
              ];

              setTimeout(() => {
                this.scrollToBottom();
              }, 100);

            });

        }
      });
  }

  sendMessage() {
    console.log("sender id: " + this.tenantId);
    if (!this.message.trim()) {
      return;
    }
    this.chatService.sendMessage({
      sender: this.loggedInEmail,
      receiver: 'ADMIN',
      message: this.message,
      tenantId: this.tenantId,
      timestamp: new Date().toISOString()
    });

    this.message = '';
  }

  private scrollToBottom(): void {

    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    }
    catch (err) { }
  }
}