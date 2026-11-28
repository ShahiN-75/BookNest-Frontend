
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Room, RoomDataService } from '../../services/room-data';

@Component({
  selector: 'app-room-details',
  imports: [RouterLink],
  templateUrl: './room-details.html',
  styleUrl: './room-details.css'
})
export class RoomDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private roomDataService = inject(RoomDataService);

  roomId = Number(this.route.snapshot.paramMap.get('id'));

  room: Room | null = null;
  errorMessage = '';
  isLoading = true;

  ngOnInit(): void {

    if (!Number.isInteger(this.roomId) || this.roomId <= 0) {
      this.errorMessage = 'Invalid room ID.';
      this.isLoading = false;
      return;
    }

    this.roomDataService.getRoomById(this.roomId).subscribe({
      next: (data) => {
        this.room = data;
        this.isLoading = false;
        console.log('Room loaded:', this.room);
      },
      error: (error) => {
        this.errorMessage = 'Unable to load room details.';
        this.isLoading = false;
        console.error('Error loading room:', error);
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
