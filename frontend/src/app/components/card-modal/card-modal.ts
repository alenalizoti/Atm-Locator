import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { CardService } from '../../services/card-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankService } from '../../services/bank-service';
import { Bank, BankResponse } from '../../models/BankResponse';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.html',
  styleUrls: ['./card-modal.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CardModalComponent {
  @ViewChild('cvvInput') cvvInput!: ElementRef;

  bankOptions: string[] = [
    'Adriatic Bankomat',
    'Addiko Bankomat',
    'AIK Bankomat',
    'Bankomat Intesa',
    'Bankomat Poštanska Štedionica',
    'Credit Agricole Bankomat',
    'Erste Bankomat',
    'Eurobank Bankomat',
    'Halkbank Bankomat',
    'KBC Bankomat',
    'Menjačnica',
    'Mobi Bankomat',
    'MoneyGET Bankomat',
    'MultiCard Bankomat',
    'NLB Bankomat',
    'Nepoznat Bankomat',
    'OTP Bankomat',
    'Privredna Banka Beograd Bankomat',
    'Raiffeisen Bankomat',
    'UniCredit Bankomat',
    'Yettel Bankomat',
    'Ostalo',
  ];

  bankFilter: string = '';

  cardPart1: string = '';
  cardPart2: string = '';
  cardPart3: string = '';
  cardPart4: string = '';
  cardNumber: string = '';

  expiryM: string = '';
  expiryY: string = '';
  expiry: string = '';

  cardHolder: string = '';
  nameFinished: boolean = false;

  cvv: string = '';
  isFlipped: boolean = false;
  showFirstForm: boolean = true;
  id: number = 0;
  banksMap: Bank[] = [];

  constructor(
    private cardService: CardService,
    private dialogRef: MatDialogRef<CardModalComponent>,
    private snackBar: MatSnackBar,
    private bankService: BankService
  ) {}

  ngOnInit() {
    this.bankService.getBanks().subscribe({
      next: (response) => {
        this.banksMap = response.body.data;
      },
      error: (error) => {
        this.showError(error);
      },
    });
  }
  onNameInputDone() {
    this.nameFinished = true;
    this.onInputChange();
  }
  cvvDone() {
    this.onInputChangeCvv();
  }

  allowOnlyDigits(event: KeyboardEvent) {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  blockPasteNonDigits(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[a-zA-Z\s]$/.test(char)) {
      event.preventDefault();
    }
  }

  blockPasteNonLetters(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (!/^[a-zA-Z\s]+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  autoTab(event: any, nextInput: HTMLInputElement) {
    const value = event.target.value;
    if (value.length === (event.target as HTMLInputElement).maxLength) {
      nextInput.focus();
    }
    this.tryMergeCardNumber();
  }

  tryMergeCardNumber() {
    if (
      this.cardPart1.length === 4 &&
      this.cardPart2.length === 4 &&
      this.cardPart3.length === 4 &&
      this.cardPart4.length === 4
    ) {
      this.cardNumber = `${this.cardPart1}${this.cardPart2}${this.cardPart3}${this.cardPart4}`;
    }
  }

  check() {
    const isCardNumber = this.cardNumber.length == 16;
    const isExpiryM = this.expiryM.length == 2;
    const isExpiryY = this.expiryY.length == 2;
    return isCardNumber && isExpiryM && isExpiryY && this.nameFinished;
  }
  onInputChange(): void {
    this.check() ? (this.isFlipped = true) : (this.isFlipped = false);
    if (this.isFlipped == false) return;
    setTimeout(() => {
      this.cvvInput?.nativeElement.focus();
    }, 600); // adjust timing to match your CSS flip animation
  }

  onInputChangeCvv(): void {
    const isCvv = this.cvv.length == 3;
    isCvv ? (this.isFlipped = false) : (this.isFlipped = true);
  }

  onNameChange(event: any): void {
    const input = event.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 20);
    this.cardHolder = input;
    if (this.nameFinished) this.onInputChange();
  }

  next() {
    // Optionally validate the first form here
    if (this.check() && this.cvv.length == 3) this.showFirstForm = false;
  }

  save() {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      this.id = JSON.parse(storedUser).id;
    }
    let expiration_date = new Date(
      2000 + parseInt(this.expiryY),
      parseInt(this.expiryM) - 1,
      1
    );

    const bank = this.banksMap.find((bank) => bank.name == this.bankFilter);
    this.cardService
      .storeCard(
        this.id,
        bank.id,
        this.cardNumber,
        'visa',
        expiration_date,
        parseInt(this.cvv)
      )
      .subscribe({
        next: (response) => {
          if (response.status == 201) {
            this.dialogRef.close(response.body.card);
          } else {
            this.showError(response);
          }
        },
        error: (error) => {
          this.showError(error);
        },
      });
  }
  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
}
