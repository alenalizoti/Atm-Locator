import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocketService } from '../../services/socket-service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  standalone: true,
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog.html',
  styleUrls: ['./validation-dialog.css'],
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule]
})
export class ValidationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { numbers: number[] },
    private dialogRef: MatDialogRef<ValidationDialog>,
    private socketService: SocketService
  ) {}

  ngOnInit(){
  }
  select(num: number) {
    this.socketService.emit('selectedNumber', { selectedNumber: num });
    this.dialogRef.close();
  }
}
