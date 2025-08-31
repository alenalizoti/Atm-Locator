import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Atm } from '../../models/Atm';

@Component({
  selector: 'app-navigation-map',
  templateUrl: './navigation-map.html',
  standalone: true,
  imports: [GoogleMapsModule],
  styleUrls: ['./navigation-map.css'],
})
export class NavigationMap implements AfterViewInit {
  @Input() atm: Atm;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  latToGo: number = null;
  lngToGo: number = null;
  center: google.maps.LatLngLiteral = { lat: 44.808504, lng: 20.416354 };
  zoom = 15;

  errorMessage: string | null = null;

  mapOptions: google.maps.MapOptions = {
    zoom: this.zoom,
    center: this.center,
    mapId: '5c963a3bc5d8d77f376c16d8',
  };

  directionsRenderer!: google.maps.DirectionsRenderer;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.latToGo = this.atm.latitude;
        this.lngToGo = this.atm.longitude;
        const destination = { lat: this.latToGo, lng: this.lngToGo };

        const directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map.googleMap!);

        directionsService.route(
          {
            origin,
            destination,
            travelMode: google.maps.TravelMode.WALKING,
          },
          (response: any, status: any) => {
            if (status === 'OK') {
              this.directionsRenderer.setDirections(response);
              this.cdRef.detectChanges();
            } else {
              alert('Directions request failed due to ' + status);
            }
          }
        );
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  openGoogleMaps(): void {
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${this.latToGo},${this.lngToGo}`
    );
  }
}
