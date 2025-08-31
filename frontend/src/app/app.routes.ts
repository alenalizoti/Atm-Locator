import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';
import { ProfileComponent } from './components/profile/profile';
import { Reservation } from './components/reservation/reservation';
import { TransactionStorage } from './components/transaction-storage/transaction-storage';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'reservation', component: Reservation},
  { path: 'qrStorage/active', component: TransactionStorage, data: { view: 'active' } },
  { path: 'qrStorage/history', component: TransactionStorage, data: { view: 'history' } }
];
