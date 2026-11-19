
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Rooms } from './components/rooms/rooms';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'rooms', component: Rooms }
];
