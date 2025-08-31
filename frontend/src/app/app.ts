import { Component, Inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket-service';
import { PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, GoogleMapsModule],
  template: `<router-outlet></router-outlet>`
})

export class App {
  constructor(
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ){

  }
  protected title = 'frontend';
}
