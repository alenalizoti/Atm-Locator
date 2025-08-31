import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

export const materialImports = [
  MatButtonModule,
  MatCardModule,
  Component,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialog,
  CommonModule,
  MatSnackBar,
  MatIconModule
];
