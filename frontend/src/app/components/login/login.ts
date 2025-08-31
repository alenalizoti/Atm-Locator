import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  login(): void {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (response: any) => {
        if (response.status == 200) {
          localStorage.setItem('userInfo', JSON.stringify(response.body.user));
          localStorage.setItem('userToken', response.body.token);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/home']);
        } else {
          this.showError(response);
        }
      },
      error: (err) => {
        this.showError(err);
      },
    });
  }

  loginGuest(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('userToken', '');
    this.router.navigate(['/home']);
  }

  showError(error) {
    this.snackBar.open(error.error.message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
}
