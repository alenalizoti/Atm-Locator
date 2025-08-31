import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CardModalComponent } from '../card-modal/card-modal';
import { CardService } from '../../services/card-service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  imageSrc = 'images/';
  main_card_id: null;
  name: string = '';
  email: string = '';
  photo: string = this.imageSrc + 'profilePicture.avif';
  editingField: string | null = null;
  showCardModal = false;
  id = 0;
  cardsToShow = [];
  pageLoaded: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cardService: CardService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {

    if (!(this.platformId == 'browser')) return;
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      this.id = userInfo.id;
      this.name = userInfo.name;
      this.email = userInfo.email;
      this.cardsToShow = userInfo.cardsToShow;
    } else {
      console.warn('No user information found in localStorage.');
    }
  }

  toggleEdit(field: any): void {
    if (this.editingField === field) {
      this.onSubmit(field);
      this.editingField = null;
    } else {
      this.editingField = field; // Start editing
    }
  }

  onSubmit(action: string, id: number | null = null): void {
    switch (action) {
      case 'photo':
        console.log('Edit profile photo clicked');
        break;
      case 'name':
        this.userService.changeName(this.name, this.id).subscribe({
          next: (response) => {
            if (response.status == 200) {
              let userInfo = JSON.parse(localStorage.getItem('userInfo'));
              userInfo.name = this.name;
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              this.cdRef.detectChanges();
            } else {
              console.log(response.body.message);
            }
          },
          error: (error) => {
            this.showError(error);
          },
        });
        break;
      case 'email':
        console.log('Edit email clicked');
        break;
      case 'add-card':
        if(this.cardsToShow.length == 4) {
          this.showMessage('Maximum cards you can have stored is 4!');
          return;
        }
        let dialogRef = this.dialog.open(CardModalComponent, {
          panelClass: 'card-dialog',
          disableClose: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.ngZone.run(() => {
              let userInfo = JSON.parse(localStorage.getItem('userInfo'));
              userInfo.cardsToShow.push(result);
              this.cardsToShow.push(result);
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              this.cdRef.detectChanges();
            });
          }
        });
        break;
      case 'set-main':
        this.cardService.setMain(id, this.id).subscribe({
          next: (response) => {
            if (response.status == 200) {
              let oldMain = this.cardsToShow.find((c) => c.is_main === true);
              oldMain.is_main = false;
              let newMain = this.cardsToShow.find((c) => c.id === id);
              newMain.is_main = true;
              this.main_card_id = newMain.id;
              let userInfo = JSON.parse(localStorage.getItem('userInfo'));
              userInfo.cardsToShow = this.cardsToShow;
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              this.cdRef.detectChanges();
            } else {
              console.log(response.body.message);
            }
          },
          error: (error) => {
            this.showError(error);
          },
        });
        break;
      case 'main':
        break;
      case 'remove':
        if (this.cardsToShow.find((c) => c.id === id).is_main) {
          console.error("Can't remove main card!");
          return;
        }
        this.cardService.removeCard(id, this.id).subscribe({
          next: (response) => {
            if (response.status == 200) {
              this.removeCard(this.getCardNumber(id));
              this.cdRef.detectChanges();
            } else {
              this.showError(response);
            }
          },
          error: (error) => {
            this.showError(error);
          },
        });
        break;
      case 'log-out':
        this.authService.logout();
        this.router.navigate(['/']);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  removeCard(cardNumberToRemove: string): void {
    this.cardsToShow = this.cardsToShow.filter(
      (card) => card.card_number !== cardNumberToRemove
    );
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    userInfo.cardsToShow = this.cardsToShow;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getCardNumber(id: number): string | undefined {
    const card = this.cardsToShow.find((c) => c.id === id);
    return card?.card_number;
  }

  goHome() {
    this.router.navigate(['/home']); // Adjust the route if your home path is different
  }

  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
  showMessage(message) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['succesful'], // optional custom styling
    });
  }
}
