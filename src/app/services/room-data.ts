
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  room_id: number;
  room_number: string;
  room_type: string;

  room_information: {
    description?: string;
    occupancy: {
      maximum_guests: number;
    };
  };

  pricing: {
    rate_plans: {
      plan_name: string;
      rate_details: {
        base_price_per_night: number;
      };
    }[];
  };

  facilities?: {
    amenity_groups: {
      category: string;
      items: {
        name: string;
        available: boolean;
      }[];
    }[];
  };

  room_management: {
    availability: {
      current_status: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class RoomDataService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:5000/api/v1.0/rooms';

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  searchRooms(
    roomType: string,
    maxPrice?: number,
    guests?: number
  ): Observable<Room[]> {

    let params = new HttpParams();

    if (roomType) {
      params = params.set('room_type', roomType);
    }

    if (maxPrice !== undefined) {
      params = params.set('max_price', maxPrice.toString());
    }

    if (guests !== undefined) {
      params = params.set('guests', guests.toString());
    }

    return this.http.get<Room[]>(`${this.apiUrl}/search`, {
      params: params
    });
  }

  getRoomById(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${roomId}`);
  }

}
