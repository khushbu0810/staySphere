import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-room',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-room.html',
  styleUrl: './edit-room.css',
})
export class EditRoom implements OnInit {
  constructor(private rs: RoomService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  roomForm!: FormGroup;
  roomId!: number;

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      capacity: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      currentOccupancy: [0],
      vacancy: [{ value: 0, disabled: true }],
      rentAmount: ['', [Validators.required, Validators.min(1)]],
      isAvailable: [true]
    })
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.roomId) {
      this.loadRooms();
    }
  }

  roomTypes: string[] = [
    '2 Sharing',
    '3 Sharing',
    '4 Sharing',
    '5 Sharing'
  ];

  onRoomTypeChange() {
    const roomType = this.roomForm.get('roomType')?.value;

    if (roomType) {
      const capacity = parseInt(roomType); // "2 Sharing" → 2

      this.roomForm.patchValue({
        capacity: capacity,
        currentOccupancy: 0,
        vacancy: capacity,
        isAvailable: true
      });
    }
  }

  get f() {
    return this.roomForm.controls;
  }

  loadRooms() {
    this.rs.getRoomById(this.roomId).subscribe(data => {
      this.roomForm.patchValue(data);
    })
  }

  updateRoom() {
    if (this.roomForm.valid) {
      this.rs.updateRoom(this.roomId, this.roomForm.getRawValue()).subscribe(() => {
        alert("Room updated successfully");
        this.router.navigate(['/room-list']);
      })
    }
  }


}
