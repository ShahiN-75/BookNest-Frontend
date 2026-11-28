
import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Rooms } from './components/rooms/rooms';
import { RoomDetails } from './components/room-details/room-details';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Account } from './components/account/account';

import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  { path: '', component: Home },

  { path: 'rooms', component: Rooms },

  { path: 'rooms/:id', component: RoomDetails },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'forgot-password', component: ForgotPassword },

  { path: 'reset-password', component: ResetPassword },

  {
    path: 'account',
    component: Account,
    canActivate: [authGuard]
  }

];
