
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

  

filterByType(
  roomType: string,
  priceInput: string = '',
  guestsInput: string = ''
): void {

  this.errorMessage = '';

  const maxPrice = priceInput.trim() === ''
    ? undefined
    : Number(priceInput);

  const guests = guestsInput.trim() === ''
    ? undefined
    : Number(guestsInput);

  if (maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    this.errorMessage = 'Please enter a valid maximum price.';
    return;
  }

  if (guests !== undefined &&
      (!Number.isInteger(guests) || guests < 1)) {
    this.errorMessage = 'Please enter a valid number of guests.';
    return;
  }

  const request = !roomType &&
                  maxPrice === undefined &&
                  guests === undefined
    ? this.roomDataService.getRooms()
    : this.roomDataService.searchRooms(roomType, maxPrice, guests);

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
