import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../map/map';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { firstValueFrom} from 'rxjs';
import { BurgerMenu } from '../burger-menu/burger-menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { SocketService } from '../../services/socket-service';
import { MatDialog } from '@angular/material/dialog';
import { ValidationDialog } from '../validation-dialog/validation-dialog';
//const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    BurgerMenu,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  imageSrc = 'images/';
  map: any;
  userLocation: any;
  markers: any[] = [];
  user: any;
  loggedIn: string = 'false';
  atmLimit: number = 0; // 0 means no limit
  bankFilter: string = ''; // '' means all atms
  favouriteFilter: boolean = false; // true means show only favourite
  isOpen = false;
  searchedPlaces: any[];

  receivedNumbers: number[] | null = null;

  bankOptions: string[] = [
    'Raiffeisen Bankomat',
    'Bankomat Intesa',
    'Erste Bankomat',
    'OTP Bankomat',
    'UniCredit Bankomat',
    'Bankomat Poštanska Štedionica',
    'AIK Bankomat',
    'Addiko Bankomat',
    'Hypo Alpe-Adria-Bank',
    'MoneyGET Bankomat',
    'NLB Bankomat',
    'Eurobank Bankomat',
    'Yettel Bankomat',
    'Mobi Bankomat',
    'Credit Agricole Bankomat',
    'MultiCard Bankomat',
    'Halkbank Bankomat',
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    if (this.platformId !== 'browser') return;

    this.loggedIn = localStorage.getItem('isLoggedIn') || 'false';
    const storedUser = localStorage.getItem('userInfo');
    const user = JSON.parse(storedUser);
    let id = user.id;
    console.log(id)

    this.socketService.emit('register', { id });

    if (this.socketService.number$ !== null)
      this.socketService.number$.subscribe((numbers: number[]) => {
        if (numbers) {
          let dref = this.dialog.open(ValidationDialog, {
            data: { numbers },
            disableClose: true,
            width: '400px',
            height: '500px',
          });
          dref.afterClosed().subscribe(() => {
            this.socketService.number$ = null;
          });
        }
      });

    try {
      const response: any = await firstValueFrom(
        this.userService.profile(id)
      );
      if (response.status !== 200) {
        this.showError(response);
        return;
      }
      let name =
        response.body.user.first_name + ' ' + response.body.user.last_name;
      let email = response.body.user.email;
      let mainCardNumber = response.body.user.main_card_number;
      let cardsToShow = response.body.user.Cards;
      let userInformation = {
        id: id,
        name: name,
        email: email,
        mainCardNumber: mainCardNumber,
        cardsToShow: cardsToShow,
      };
      localStorage.setItem('userInfo', JSON.stringify(userInformation));
    } catch (err) {
      this.showError(err);
    }
  }

  toggleFavorite() {
    this.favouriteFilter = !this.favouriteFilter;
  }

  onMenuToggled() {
    this.isOpen = !this.isOpen;
  }

  onClick() {
    this.router.navigate(['profile']);
  }

  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
  async onSearch(text: string) {
    if (text == '') {
      this.searchedPlaces = [];
      return;
    }
    const { Place } = (await google.maps.importLibrary(
      'places'
    )) as google.maps.PlacesLibrary;
    const request = {
      textQuery: text + 'belgrade',
      fields: ['displayName', 'location', 'businessStatus'],
    };
    this.searchedPlaces = (await Place.searchByText(request)).places;
    this.cdref.detectChanges();
  }
}
