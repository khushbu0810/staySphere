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
  maxFileSize = 5 * 1024 * 1024; // 5 MB
  selectedRoomImages: File[] = [];


  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
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

  venueNames: string[] = [
    'Grand Hall',
    'Royal Banquet',
    'Skyline Event Center',
    'Emerald Convention Hall',
    'Crystal Ballroom',
    'Elite Conference Center',
    'Sunrise Banquet Hall',
    'Golden Crown Venue',
    'Harmony Event Space',
    'Imperial Wedding Hall'
  ];

  venueTypes: string[] = [
    'Wedding Venue',
    'Banquet Hall',
    'Conference Hall',
    'Convention Center',
    'Outdoor Venue',
    'Corporate Event Space',
    'Party Hall',
    'Exhibition Center',
    'Rooftop Venue',
    'Luxury Ballroom'
  ];

  addRoom() {
    if (this.roomForm.valid) {
      this.rs.addRoom(this.roomForm.getRawValue()).subscribe({
        next: (room) => {
          if (this.selectedRoomImages.length > 0) {

            this.rs.uploadRoomImages(
              room.id!,
              this.selectedRoomImages
            ).subscribe(() => {

              alert('Venue added successfully');

            });

          }

          // ✅ Reset form with default values
          this.roomForm.reset({
            roomNumber: '',
            roomType: '',
            capacity: 0,
            currentOccupancy: 0,
            vacancy: 0,
            rentAmount: '',
            isAvailable: true,
            roomImageUrls: []
          });
        },
        error: (err) => {

          console.log(err);

          if (err.error) {
            alert(err.error);
          } else {
            alert('Failed to add venue. Please try again.');
          }
        }
      });
    }
  }


  onRoomTypeChange() {
    const venueType = this.roomForm.get('roomType')?.value;

    let capacity = 0;
    switch (venueType) {

      case 'Wedding Venue':
        capacity = 500;
        break;

      case 'Banquet Hall':
        capacity = 300;
        break;

      case 'Conference Hall':
        capacity = 150;
        break;

      case 'Convention Center':
        capacity = 1000;
        break;

      case 'Outdoor Venue':
        capacity = 800;
        break;

      case 'Corporate Event Space':
        capacity = 200;
        break;

      case 'Party Hall':
        capacity = 100;
        break;

      case 'Exhibition Center':
        capacity = 1200;
        break;

      case 'Rooftop Venue':
        capacity = 120;
        break;

      case 'Luxury Ballroom':
        capacity = 400;
        break;
    }

    this.roomForm.patchValue({
      capacity: capacity,
      currentOccupancy: 0,
      vacancy: capacity,
      isAvailable: true
    });

  }

  onRoomImagesSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.selectedRoomImages = [];
    for (let file of files) {
      // Check image type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }
      // Check file size
      if (file.size > this.maxFileSize) {
        alert(
          `Image "${file.name}" is too large. Maximum allowed size is 5 MB.`
        );
        return;
      }
      this.selectedRoomImages.push(file);
    }
  }

  get f() {
    return this.roomForm.controls;
  }

}
