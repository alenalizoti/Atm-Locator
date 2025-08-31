import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { response } from 'express';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  name = '';
  lastName = '';
  email = '';
  password = '';
  avatar_url = '';
  gender = 'male';
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  register(): void {
    this.authService
      .registerUser(
        this.name,
        this.lastName,
        this.email,
        this.password,
        this.avatar_url,
        this.gender
      )
      .subscribe({
        next: (response: any) => {
          if (response.status == 201) {
            this.router.navigate(['/']);
          } else {
            alert(response.message || 'Registration failed.');
            console.log(response.body.message);
          }
        },
        error: (err) => {
          this.showError(err.error.message);
        },
      });
  }

  loginGuest(): void {
    this.router.navigate(['/home']);
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // milliseconds
      panelClass: ['error-snackbar'], // optional custom styling
    });
  }
}
