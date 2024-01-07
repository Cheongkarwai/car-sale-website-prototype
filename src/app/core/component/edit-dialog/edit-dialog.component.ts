import {Component, Inject, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ConfirmationDialogComponent, ConfirmDialogModel} from "../confirmation-dialog/confirmation-dialog.component";

export interface DialogData{
  title:string;
  password:string;
  contact_number:string;
  full_name:string;

}
@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogClose,
    ReactiveFormsModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {


  constructor(public dialogRef:MatDialogRef<EditDialogComponent>,@Inject(MAT_DIALOG_DATA)
  public data:FormGroup,public dialog:MatDialog) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit($event: MouseEvent) {

    this.data.markAllAsTouched();

    if(!this.data.invalid){
      const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent,{
        maxWidth: "400px",
        data: new ConfirmDialogModel("Delete", `Are you sure you want to do this?`)
      });

      confirmationDialogRef.afterClosed().subscribe(dialogResult=>{
        if(dialogResult){
          this.dialogRef.close(this.data);
        }
      });
    }

  }
}
