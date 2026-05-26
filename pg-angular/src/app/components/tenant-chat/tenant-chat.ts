import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  CommonModule,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';

import { Subscription } from 'rxjs';

import { ChatService } from '../../services/chat-service';
import { AuthService } from '../../services/auth-service';
import { TenantService } from '../../services/tenant-service';


const BUBBLE_GRADIENTS: string[] = [
  'linear-gradient(145deg, #0d3b6e, #1565c0)',
  'linear-gradient(145deg, #4a0e6e, #8b3dbd)',
  'linear-gradient(145deg, #004d40, #00897b)',
  'linear-gradient(145deg, #7b2900, #d84315)',
  'linear-gradient(145deg, #1a237e, #3949ab)',
  'linear-gradient(145deg, #880e4f, #c2185b)',
  'linear-gradient(145deg, #006064, #00acc1)',
  'linear-gradient(145deg, #33691e, #7cb342)',
  'linear-gradient(145deg, #4e342e, #8d6e63)',
  'linear-gradient(145deg, #263238, #546e7a)',
  'linear-gradient(145deg, #1b5e20, #43a047)',
  'linear-gradient(145deg, #bf360c, #f4511e)',
];


const AVATAR_GRADIENTS: string[] = [
  'linear-gradient(135deg, #1565c0, #42a5f5)',
  'linear-gradient(135deg, #7b1fa2, #ce93d8)',
  'linear-gradient(135deg, #00695c, #4db6ac)',
  'linear-gradient(135deg, #bf360c, #ff8a65)',
  'linear-gradient(135deg, #283593, #7986cb)',
  'linear-gradient(135deg, #ad1457, #f48fb1)',
  'linear-gradient(135deg, #00838f, #4dd0e1)',
  'linear-gradient(135deg, #558b2f, #aed581)',
  'linear-gradient(135deg, #6d4c41, #bcaaa4)',
  'linear-gradient(135deg, #37474f, #90a4ae)',
  'linear-gradient(135deg, #2e7d32, #81c784)',
  'linear-gradient(135deg, #e64a19, #ffab91)',
];


@Component({
  selector: 'app-tenant-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TitleCasePipe,
    UpperCasePipe
  ],
  templateUrl: './tenant-chat.html',
  styleUrl: './tenant-chat.css',
})

export class TenantChat implements OnInit, OnDestroy {


  //for auto scroll to bottom of chat container
  @ViewChild('scrollMe')
  private scrollContainer!: ElementRef<HTMLDivElement>;

  message = '';
  tenantId!: number;
  tenantName = '';
  loggedInEmail = '';
  messages: any[] = [];

  private subs = new Subscription();

  private colorCache = new Map<string, number>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private tenantService: TenantService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit(): void {
    //connect to websocket and listen for messages
    this.chatService.connect();
    this.loggedInEmail = this.authService.getAuthenticatedUserEmail() ?? '';
    const userId = this.authService.getAuthenticatedUserId();

    this.subs.add(
      //fetch tenant details using userId to get tenantId and tenantName, which are needed for sending messages and displaying in UI
      this.tenantService.getTenantByUserId(userId!).subscribe({
        next: (tenant) => {
          this.tenantId = tenant.id;
          this.tenantName = tenant.name;
          // OLD MESSAGES
          //fetch old messages for the tenant to display chat history in UI
          this.subs.add(
            this.chatService.getAllOldMessages().subscribe((oldMessages) => {
              this.messages = oldMessages;
              this.cdr.detectChanges();
              this.scrollAfterRender();
            })
          );

          // REALTIME MESSAGES
          //subscribe to the messages$ observable to receive realtime messages sent by the backend. 
          this.subs.add(this.chatService.getMessages().subscribe((incoming) => {
            if (!incoming) return;
            //When a new message is received, we check if it already exists in the messages array (to avoid duplicates) and if not, we add it to the array and update the UI.
            const alreadyExists = this.messages.some((m) => m.id === incoming.id);
            if (!alreadyExists) {
              this.messages = [
                ...this.messages,
                incoming
              ];
              console.log('MESSAGE ADDED TO UI');
              // FORCE ANGULAR UI UPDATE
              this.cdr.detectChanges();
              // AUTO SCROLL
              this.scrollAfterRender();
            }
          })
          );
        }
      })
    );
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private senderIndex(sender: string): number {

    if (this.colorCache.has(sender)) {
      return this.colorCache.get(sender)!;
    }
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = (sender.charCodeAt(i) + ((hash << 5) - hash)) | 0;
    }

    const idx = Math.abs(hash) % BUBBLE_GRADIENTS.length;
    this.colorCache.set(sender, idx);
    return idx;
  }


  getBubbleBackground(sender: string): string {
    return BUBBLE_GRADIENTS[this.senderIndex(sender)
    ];
  }


  getAvatarGradient(sender: string): string {
    return AVATAR_GRADIENTS[this.senderIndex(sender)
    ];
  }


  formatTime(timestamp: string): string {

    return new Date(timestamp)
      .toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
  }


  formatDate(timestamp: string): string {
    const d = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.sameDay(d, today)) {
      return 'Today';
    }
    if (this.sameDay(d, yesterday)) {
      return 'Yesterday';
    }
    return d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }


  isDifferentDay(
    ts1: string,
    ts2: string
  ): boolean {

    return !this.sameDay(
      new Date(ts1),
      new Date(ts2)
    );
  }


  private sameDay(
    a: Date,
    b: Date
  ): boolean {

    return (
      a.getFullYear() === b.getFullYear()
      &&
      a.getMonth() === b.getMonth()
      &&
      a.getDate() === b.getDate()
    );

  }


  sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }
    //send message to backend, which will broadcast it to all subscribed clients (including this one)
    this.chatService.sendMessage({
      sender: this.loggedInEmail,
      receiver: 'ADMIN',
      message: this.message.trim(),
      tenantId: this.tenantId,
      timestamp: new Date().toISOString(),
    });
    this.message = '';
    this.scrollAfterRender();
  }


  private scrollAfterRender(): void {
    requestAnimationFrame(() => {
      try {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      } catch (_) { }

    });

  }

}