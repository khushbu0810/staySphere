import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room-service';
import { Room } from '../../model/Room';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
})
export class RoomList implements OnInit {
  rooms$!: Observable<Room[]>;

  showModal = false;
  selectedRoom?: Room;

  constructor(private rs: RoomService, private router: Router) { }

  ngOnInit(): void {
    // Load once
    this.rs.getAllRooms();

    // ✅ SORT rooms by roomNumber ASCENDING
    this.rooms$ = this.rs.rooms$.pipe(
      map(rooms =>
        [...rooms].sort((a, b) => a.roomNumber - b.roomNumber)
      )
    );
  }

  onDelete(roomId: number) {
    this.rs.deleteRoom(roomId).subscribe(() => {
      alert('Room deleted successfully');
      this.showModal = false;
      this.rs.getAllRooms(); // 🔥 auto refresh
    });
  }

  onEdit(roomId: number) {
    this.showModal = false;
    this.router.navigate(['/edit-room', roomId]);
  }

}
