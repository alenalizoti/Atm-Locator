import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { Atm } from '../../models/Atm';
import { Card } from '../../models/Card';
import { CdTimerModule } from 'angular-cd-timer';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationMap } from '../navigation-map/navigation-map';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PinCodeResponse } from '../../models/PinCodeResponse';
import { SocketService } from '../../services/socket-service';

@Component({
  standalone: true,
  selector: 'app-pin-code-panel',
  templateUrl: './pin-code-panel.html',
  styleUrl: './pin-code-panel.css',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    CdTimerModule,
    NavigationMap,
  ],
})
export class PinCodePanel {
  user_id = null;
  main_card = null;
  amount = null;
  address: string = 'Bulevar Milutina Milankovića 86a, Beograd 11012, Serbia';
  pinInfo: string = 'This pin code is one time use. Expires in: timer';
  atm: Atm;
  pinDetails: PinCodeResponse;
  pinWidth = window.innerWidth * 0.85;
  left_time: number = null;
  receivedNumbers: number[] | null = null;
  showToken = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const storedUserInfo = localStorage.getItem('userInfo');
    this.atm = this.data.atm;
    this.pinDetails = this.data.transactionDetails;
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      // Optionally assign to component properties
      this.user_id = userInfo.id;
      this.main_card = userInfo.cardsToShow.find(
        (c: Card) => c.is_main === true
      );

      const now = new Date();
      const expiresAt = new Date(this.pinDetails.expires_at);
      this.left_time = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
      this.cdRef.detectChanges();
    } else {
      console.warn('No user information found in localStorage.');
    }
  }

  openGoogleMaps() {
    const encodedAddress = encodeURIComponent(this.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      '_blank'
    );
  }

  toggleTokenVisibility() {
    this.showToken = !this.showToken;
  }
}
