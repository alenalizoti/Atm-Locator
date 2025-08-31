import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { QrCodePanel } from '../qr-code-panel/qr-code-panel';
import { WithdrawalService } from '../../services/withdrawal-service';
import { firstValueFrom } from 'rxjs';
import { TransactionPanelInfo } from '../../models/TransactionPanelInfo';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atm } from '../../models/Atm';
import { AtmService } from '../../services/atm-service';
import { SocketService } from '../../services/socket-service';
import { PinCodePanel } from '../pin-code-panel/pin-code-panel';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { response } from 'express';

@Component({
  standalone: true,
  selector: 'app-transaction-storage',
  imports: [
    CommonModule,
    MatIcon,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonToggleModule,
  ],
  templateUrl: './transaction-storage.html',
  styleUrl: './transaction-storage.css',
})
export class TransactionStorage implements OnInit {
  transactionArray = [];
  id = null;
  view: string = '';
  show = false;
  now: Date = new Date();
  status: string | null = null;
  method: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private withdrawalService: WithdrawalService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private atmService: AtmService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    if (this.platformId === 'server') return;

    this.view = this.route.snapshot.data['view'];
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      this.id = userInfo.id;
      const response: any =
        this.view == 'active'
          ? await firstValueFrom(this.withdrawalService.getActive(this.id))
          : await firstValueFrom(this.withdrawalService.getAll(this.id));
      if (response.status == 200) {
        this.zone.run(() => {
          this.transactionArray = response.body.data;

          this.transactionArray = this.transactionArray.map((transaction) => ({
            ...transaction,
            expires_at: new Date(transaction.expires_at),
          }));

          this.show = true;
          this.cdRef.detectChanges();
        });
        this.cdRef.detectChanges();
      } else {
        this.showError(response);
      }
    }
  }
  async openTransactionData(transactionDetails: TransactionPanelInfo) {
    const response = await firstValueFrom(
      this.atmService.getAtm(transactionDetails.atm_id)
    );
    if (
      new Date(transactionDetails.expires_at) > new Date() &&
      !transactionDetails.is_used
    )
      if (transactionDetails.method == 'QR')
        this.dialog.open(QrCodePanel, {
          data: { atm: response.body, transactionDetails },
          width: '550px',
          height: '800px',
        });
      else
        this.dialog.open(PinCodePanel, {
          data: { atm: response.body, transactionDetails },
          width: '550px',
          height: '800px',
        });
  }
  async onSubmit(action: string, id: number) {
    switch (action) {
      case 'delete':
        await firstValueFrom(this.withdrawalService.removeWithdrawal(id));
        this.transactionArray = this.transactionArray.filter(
          (transaction) => transaction.id !== id
        );
        this.cdRef.detectChanges();
    }
  }
  goHome() {
    this.router.navigate(['/home']); // Adjust the route if your home path is different
  }

  async toggleStatus(value: string) {
    this.status = this.status === value ? null : value;
    console.log(this.status)
    let response: any;

    if (this.status === 'active') {
      response = await firstValueFrom(
        this.withdrawalService.getActive(this.id)
      );
    } else if (this.status === 'inactive') {
      response = await firstValueFrom(this.withdrawalService.getUsed(this.id));
    } else {
      response = await firstValueFrom(this.withdrawalService.getAll(this.id));
    }

    if (response.status == 200) {
      this.zone.run(() => {
        this.transactionArray = response.body.data;

        this.transactionArray = this.transactionArray.map((transaction) => ({
          ...transaction,
          expires_at: new Date(transaction.expires_at),
        }));

        this.show = true;
        this.cdRef.detectChanges();
      });
      this.cdRef.detectChanges();
    } else {
      this.showError(response);
    }
  }

  toggleMethod(value: string) {
    console.log(value, this.method);
    this.method = this.method === value ? null : value;
  }

  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
}
