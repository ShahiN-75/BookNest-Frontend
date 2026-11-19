
import { Component, OnInit, inject } from '@angular/core';
import { Room, RoomDataService } from '../../services/room-data';

@Component({
  selector: 'app-rooms',
  imports: [],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms implements OnInit {

  private roomDataService = inject(RoomDataService);

  rooms: Room[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.roomDataService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        console.log('Rooms loaded:', this.rooms.length);
      },
      error: (error) => {
        this.errorMessage = 'Unable to load rooms.';
        console.error('Error loading rooms:', error);
      }
    });
  }

}
