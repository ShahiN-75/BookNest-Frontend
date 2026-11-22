
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Rooms } from './components/rooms/rooms';
import { RoomDetails } from './components/room-details/room-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'rooms', component: Rooms },
  { path: 'rooms/:id', component: RoomDetails }
];
