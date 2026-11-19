
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  searchRooms(roomType: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/search`, {
      params: {
        room_type: roomType
      }
    });
  }

}
