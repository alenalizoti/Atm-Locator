import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Atm } from '../../models/Atm';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { AtmService } from '../../services/atm-service';
import { Reservation } from '../reservation/reservation';
import { MatDialog } from '@angular/material/dialog';
import { BankService } from '../../services/bank-service';
import { Bank } from '../../models/BankResponse';

import { Inject, PLATFORM_ID } from '@angular/core';
import { QrCodePanel } from '../qr-code-panel/qr-code-panel';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrCodeResponse } from '../../models/QrCodeResponse';
import { PinCodeResponse } from '../../models/PinCodeResponse';
import { PinCodePanel } from '../pin-code-panel/pin-code-panel';

const logoURL = 'atm_icons/';
const bankIcons: { [key: string]: string } = {
  'MoneyGET Bankomat': logoURL + 'MoneyGet ATM.jpg',
  'Yettel Bankomat': logoURL + 'YettelLogo.jpg',
  'Mobi Bankomat': logoURL + 'MobiLogo.jpg',
  'Hypo Alpe-Adria-Bank': logoURL + 'HypoAlpe.jpg',
  'Raiffeisen Bankomat': logoURL + 'Raiffeisen.jpg',
  'Bankomat Intesa': logoURL + 'ntesaLogo.png',
  'Erste Bankomat': logoURL + 'ErsteLogo.jpg',
  'OTP Bankomat': logoURL + 'OTPLogo.png',
  'UniCredit Bankomat': logoURL + 'UCLLogo.png',
  'Bankomat Poštanska Štedionica': logoURL + 'PSLogo.png',
  'AIK Bankomat': logoURL + 'AIKLogo.png',
  'Addiko Bankomat': logoURL + 'AddikoLogo.jpg',
  'NLB Bankomat': logoURL + 'NLBLogo.jpg',
  'Eurobank Bankomat': logoURL + 'EUROLogo.jpg',
  'Credit Agricole Bankomat': logoURL + 'CreditAgricolLogo.jpg',
  'MultiCard Bankomat': logoURL + 'MultiCardLogo.jpg',
  'Halkbank Bankomat': logoURL + 'HalkbankLogo.jpg',
  'Default ATM': logoURL + 'atm-default.jpg',
};

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  standalone: true,
  imports: [GoogleMapsModule],
  styleUrls: ['./map.css'],
})
export class MapComponent implements AfterViewInit {
  @Input() bankFilter: string = '';
  @Input() atmLimit: number = 0;
  @Input() favouriteFilter: boolean = false;
  @Input() searchedPlaces = [];

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 44.808504, lng: 20.416354 };
  userLocation: google.maps.LatLngLiteral = { lat: 44.808504, lng: 20.416354 };
  zoom = 15;

  atmMarkers: Atm[] = [];
  banks: Bank[] = [];
  favouriteAtms: Atm[] = [];
  private mapMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  private searchMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  infoWindow;

  errorMessage: string | null = null;

  mapOptions: google.maps.MapOptions = {
    zoom: this.zoom,
    center: this.center,
    mapId: '5c963a3bc5d8d77f376c16d8',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private atmService: AtmService,
    private dialog: MatDialog,
    private bankService: BankService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private snackBar: MatSnackBar
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (this.platformId != 'browser') return;
    if (!this.banks || this.banks.length === 0) {
      const response: any = await firstValueFrom(this.bankService.getBanks());
      if (response.status !== 200) {
        this.showError(response);
      }
      this.banks = response.body?.data || [];
    }
    if (
      changes['bankFilter'] ||
      changes['atmLimit'] ||
      changes['favouriteFilter']
    ) {
      this.fetchAtms();
      this.cdr.detectChanges();
    }
    if (changes['searchedPlaces']) {
      if (!this.searchedPlaces) {
        this.fetchAtms();
        return;
      }

      this.renderSearch();
    }
  }

  async ngAfterViewInit() {
    if (this.platformId != 'browser') return;
    this.infoWindow = new google.maps.InfoWindow();
    this.atmService
      .getAtms(0, '', true, this.center.lat, this.center.lng)
      .subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.body.data.length !== 0) {
            this.favouriteAtms = response.body.data;
          }
        },
        error: (error) => {
          this.favouriteAtms = [];
          this.showError(error);
        },
      });
    if (!this.banks || this.banks.length === 0) {
      const response: any = await firstValueFrom(this.bankService.getBanks());
      if (response.status !== 200) {
        this.showError(response);
      }
      this.banks = response.body?.data || [];
    }
    this.fetchAtms();
  }

  fetchAtms() {
    this.atmService
      .getAtms(
        this.atmLimit,
        this.bankFilter,
        this.favouriteFilter,
        this.center.lat,
        this.center.lng
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.body.data.length !== 0) {
            this.atmMarkers = response.body.data;
            this.renderMarkers();
          }
        },
        error: (error) => {
          this.atmMarkers = [];
          this.renderMarkers();
          this.showError(error);
        },
      });
  }

  async renderSearch() {
    if (!this.searchedPlaces || this.searchedPlaces.length === 0) {
      this.fetchAtms();
      return;
    }

    this.atmMarkers = await this.getAllAtms();
    this.renderMarkers();
  }

  openReservationDialog(atm: Atm) {
    let isFav = this.favouriteAtms.some(
      (atmInArray) => atmInArray.id === atm.id
    );
    let dialogRef1 = this.dialog.open(Reservation, {
      data: { atm: atm, isFav },
      width: '550px',
      height: '800px',
    });
    dialogRef1.afterClosed().subscribe((response) => {
      if (response) {
          this.openDialog(atm, response);
      }
    });
  }
  openDialog(atm: Atm, response) {
    if (!response) return;

    if (response.method == 'qr') {
      // It's a QrCodeResponse
      this.dialog.open(QrCodePanel, {
        data: { atm, transactionDetails: response.data },
        width: '550px',
        height: '800px',
      });
    } else if (response.method == 'pin') {
      // It's a PinCodeResponse
      this.dialog.open(PinCodePanel, {
        data: { atm, transactionDetails: response.data },
        width: '550px',
        height: '800px',
      });
    }
  }


  getBankNameById(id: number): string {
    const bank = this.banks.find((b) => b.id === id);
    return bank?.name || 'Default ATM';
  }

  showError(error) {
    this.snackBar.open(error.error.message || error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
  async getAllAtms() {
    const allAtms: any[] = [];
    this.searchMarkers.forEach((marker) => (marker.map = null));
    this.searchMarkers = [];

    for (let [index, place] of this.searchedPlaces.entries()) {
      const location = place.location;
      const lat =
        typeof location.lat === 'function' ? location.lat() : location.lat;
      const lng =
        typeof location.lng === 'function' ? location.lng() : location.lng;

      if (!lat || !lng) {
        console.warn('Invalid coordinates:', place);
        continue;
      }

      if (index === 0 && this.map?.googleMap) {
        const newCenter = { lat, lng };
        this.center = newCenter;
        this.map.googleMap.setCenter(newCenter);
        this.map.googleMap.setZoom(15);
      }

      try {
        const response: any = await firstValueFrom(
          this.atmService.getAtms(
            this.atmLimit === 0 ? 10 : this.atmLimit,
            this.bankFilter || '',
            this.favouriteFilter,
            lat,
            lng
          )
        );

        if (response.status === 200 && response.body.data.length !== 0) {
          allAtms.push(...response.body.data);
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: new google.maps.LatLng(Number(lat), Number(lng)),
            map: this.map.googleMap!,
            title: place.displayName,
          });

          marker.addListener('click', () => {
            this.infoWindow.setContent(`
              <div style="
                font-family: Arial, sans-serif;
                font-size: 24px;
                padding: 8px 12px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                max-width: 200px;
              ">
                <strong style="color: #2c3e50;">${place.displayName}</strong>
              </div>
            `);

            this.infoWindow.open({
              anchor: marker,
              map: this.map.googleMap!,
            });
          });

          this.searchMarkers.push(marker);
        }
      } catch (error) {
        this.showError(error);
      }
    }

    const seen = new Set();
    const uniqueAtms = allAtms.filter((atm) => {
      const key = atm.id; // or `${atm.lat},${atm.lng}` if no ID
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return allAtms;
  }

  renderMarkers() {
    this.mapMarkers.forEach((marker) => (marker.map = null));
    this.mapMarkers = [];
    this.atmMarkers.forEach((atm) => {
      let iconUrl =
        bankIcons[this.getBankNameById(atm.bank_id)] ||
        bankIcons['Default ATM'];
      const iconImg = document.createElement('img');

      iconImg.src = iconUrl;
      iconImg.style.width = '40px';
      iconImg.style.height = '40px';
      iconImg.style.borderRadius = '50%';
      if (!atm.latitude || !atm.longitude) return;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: new google.maps.LatLng(
          Number(atm.latitude),
          Number(atm.longitude)
        ),
        map: this.map.googleMap!,
        title: this.getBankNameById(atm.bank_id),
        content: iconImg,
      });

      marker.addListener('click', () => {
        this.openReservationDialog(atm);
      });
      this.mapMarkers.push(marker);
    });
  }
}
