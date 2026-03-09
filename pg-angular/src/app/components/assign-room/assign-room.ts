import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Room } from '../../model/Room';
import { RoomService } from '../../services/room-service';

@Component({
  selector: 'app-assign-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-room.html',
  styleUrl: './assign-room.css',
})
export class AssignRoom implements OnInit {

  assignForm!: FormGroup;
  tenantId!: number;

  rooms$!: Observable<Room[]>;

  constructor(
    private fb: FormBuilder,
    private rs: RoomService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tenantId = Number(this.route.snapshot.paramMap.get('tenantId'));

    this.assignForm = this.fb.group({
      roomId: [null, Validators.required]
    });

    // Load rooms once
    this.rs.getAllRooms();

    // Only show available rooms
    this.rooms$ = this.rs.rooms$.pipe(
      map(rooms => rooms.filter(r => r.vacancy > 0))
    );
  }

  assignRoom() {
    const roomId = Number(this.assignForm.get('roomId')?.value);

    this.rs.assignRoomToTenant(roomId, this.tenantId).subscribe(() => {
      alert('Room assigned successfully');
      this.router.navigate(['/tenant-list']);
    });
  }

  get f() {
    return this.assignForm.controls;
  }
}
