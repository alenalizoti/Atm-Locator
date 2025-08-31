import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AtmService } from '../../services/atm-service';
import { Atm } from '../../models/Atm';
import { Card } from '../../models/Card';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { CdTimerModule } from 'angular-cd-timer';
import { WithdrawalService } from '../../services/withdrawal-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-atm-reservation-dialog',
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    CdTimerModule,
  ],
})
export class Reservation {
  user_id = null;
  main_card = null;
  isFavorite = false;
  amount = null;
  address: string = 'Bulevar Milutina Milankovića 86a, Beograd 11012, Serbia';
  qrInfo: string = 'This QR code is one time use. Expires in: timer';
  qrCodeUrl: string = '';
  receiptSelected: boolean = false;
  constructor(
    private atm_service: AtmService,
    private withdrawalService: WithdrawalService,
    private cdRef: ChangeDetectorRef,
    private dialogRef: MatDialogRef<Reservation>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { atm: any; isFav: boolean }
  ) {}

  ngOnInit() {
    this.isFavorite = this.data.isFav;
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      // Optionally assign to component properties
      this.user_id = userInfo.id;
      this.main_card = userInfo.cardsToShow.find(
        (c: Card) => c.is_main === true
      );
    } else {
      console.warn('No user information found in localStorage.');
    }
  }

  generateQRCode() {
    this.withdrawalService
      .store(
        this.user_id,
        this.main_card.id,
        this.data.atm.id,
        this.amount,
        'QR',
        this.receiptSelected
      )
      .subscribe({
        next: (response) => {
          this.cdRef.detectChanges();
          this.dialogRef.close({data: response.body, method: 'qr'});
        },
        error: (error) => {
          this.showError(error);
        },
      });
  }

  generatePin() {
    this.withdrawalService
      .store(
        this.user_id,
        this.main_card.id,
        this.data.atm.id,
        this.amount,
        'PIN',
        this.receiptSelected
      )
      .subscribe({
        next: (response) => {
          this.cdRef.detectChanges();
          this.dialogRef.close({data: response.body, method: 'pin'});
        },
        error: (error) => {
          this.showError(error);
        },
      });
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;

    this.isFavorite
      ? this.atm_service.addFavoriteAtm(this.user_id, this.data.atm.id).subscribe({
          next: (response) => {
            console.log(response.body.message);
          },
          error: (error) => {
            this.showError(error);
          },
        })
      : this.atm_service
          .removeFavoriteAtm(this.user_id, this.data.atm.id)
          .subscribe({
            next: (response) => {
              console.log(response.body.message);
            },
            error: (error) => {
              this.showError(error);
            },
          });
  }

  openGoogleMaps() {
    const encodedAddress = encodeURIComponent(this.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      '_blank'
    );
  }

  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
  changeReceipt(){
    this.receiptSelected = !this.receiptSelected;
    if(this.receiptSelected)
      this.showReceiptChange("You will get receipt after withdrawing from ATM");
    else
      this.showReceiptChange("You won't get receipt after withdrawing from ATM")
    
  }
  showReceiptChange(receiptMessage) {
    this.snackBar.open(receiptMessage, 'Close', {
      duration: 1500, // milliseconds
      panelClass:"succesful"
    });
  }
}
