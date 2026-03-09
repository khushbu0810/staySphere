import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room-service';
import { Room } from '../../model/Room';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-add-room',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-room.html',
  styleUrl: './add-room.css',
})
export class AddRoom implements OnInit {
  constructor(private rs: RoomService, private fb: FormBuilder, private router: Router) { }

  roomForm!: FormGroup;

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
  }

  roomTypes: string[] = [
    '2 Sharing',
    '3 Sharing',
    '4 Sharing',
    '5 Sharing'
  ];


  addRoom() {
    if (this.roomForm.valid) {
      this.rs.addRoom(this.roomForm.getRawValue()).subscribe({
        next: () => {
          alert('Room added successfully');

          // ✅ Reset form with default values
          this.roomForm.reset({
            roomNumber: '',
            roomType: '',
            capacity: 0,
            currentOccupancy: 0,
            vacancy: 0,
            rentAmount: '',
            isAvailable: true
          });
        },
        error: () => {
          alert('Failed to add room');
        }
      });
    }
  }


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

}
