
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Room, RoomDataService } from '../../services/room-data';

@Component({
  selector: 'app-rooms',
  imports: [RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms implements OnInit {

  private roomDataService = inject(RoomDataService);

  rooms: Room[] = [];
  errorMessage = '';

  // Pagination
  currentPage = 1;
  pageSize = 6;

  get totalPages(): number {
    return Math.ceil(this.rooms.length / this.pageSize);
  }

  get paginatedRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.rooms.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ngOnInit(): void {
    this.roomDataService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.currentPage = 1;
        console.log('Rooms loaded:', this.rooms.length);
      },
      error: (error) => {
        this.errorMessage = 'Unable to load rooms.';
        console.error('Error loading rooms:', error);
      }
    });
  }

  // Filter rooms by type, price and guest capacity
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

    if (
      maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)
    ) {
      this.errorMessage = 'Please enter a valid maximum price.';
      return;
    }

    if (
      guests !== undefined &&
      (!Number.isInteger(guests) || guests < 1)
    ) {
      this.errorMessage = 'Please enter a valid number of guests.';
      return;
    }

    const request =
      !roomType &&
      maxPrice === undefined &&
      guests === undefined
        ? this.roomDataService.getRooms()
        : this.roomDataService.searchRooms(roomType, maxPrice, guests);

    request.subscribe({
      next: (data) => {
        this.rooms = data;
        this.currentPage = 1;
      },
      error: (error) => {
        this.rooms = [];
        this.currentPage = 1;
        this.errorMessage = 'Unable to search rooms. Please try again.';
        console.error('Error searching rooms:', error);
      }
    });
  }

  // Select the correct image based on room type
  getRoomImage(roomType: string): string {
    const roomImages: Record<string, string> = {
      'Standard Double': 'standard-double.jpg',
      'Standard Twin': 'standard-twin.jpg',
      'Superior Double': 'superior-double.jpg',
      'Deluxe Double': 'deluxe-double.jpg',
      'Family Room': 'family-room.jpg',
      'Executive Room': 'executive-room.jpg',
      'Suite': 'suite.jpg'
    };

    const imageName =
      roomImages[roomType] || 'standard-double.jpg';

    return `/images/rooms/${imageName}`;
  }

}
