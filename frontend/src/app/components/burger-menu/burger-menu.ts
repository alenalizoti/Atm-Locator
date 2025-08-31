import {
  Component,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  standalone: true,
  selector: 'app-burger-menu',
  imports: [RouterModule],
  templateUrl: './burger-menu.html',
  styleUrl: './burger-menu.css',
})
export class BurgerMenu {
  @Input() isOpen: boolean = false;
  @ViewChild('menuToggle') menuToggle: ElementRef<HTMLInputElement>;
  constructor(
    private authService: AuthService
  ) {}
  closeMenu() {
    if (this.menuToggle?.nativeElement?.checked) {
      this.menuToggle.nativeElement.checked = false;
    }
  }
  logOut(){
    this.authService.logout();
  }
}
