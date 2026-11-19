
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

  filterByType(roomType: string): void {
    this.errorMessage = '';

    const request = roomType
      ? this.roomDataService.searchRooms(roomType)
      : this.roomDataService.getRooms();

    request.subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        this.rooms = [];
        this.errorMessage = 'Unable to search rooms. Please try again.';
        console.error('Error searching rooms:', error);
      }
    });
  }

}
