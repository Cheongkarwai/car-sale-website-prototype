import {Component, Input, OnInit} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfirmationDialogComponent, ConfirmDialogModel} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {AppointmentService} from "../../service/appointment.service";
import {CarModel} from "../../model/car-model.interface";
import {MatButtonModule} from "@angular/material/button";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit {

  testDriveForm!: FormGroup;

  @Input() cars!:CarModel[];
  @Input() color!:ThemePalette;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar,
              private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.testDriveForm = this.fb.group({
      email_address: ['', Validators.required],
      full_name: ['', Validators.required],
      contact_number: ['', Validators.required],
      model_name: ['', Validators.required],
      remarks: ['']
    });
  }

  submitForm($event: any) {
    if (!this.testDriveForm.invalid) {

      const dialogRef = this.openConfirmationDialog("Confirm booking", `Are you sure?`);

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.appointmentService.save(this.testDriveForm.value)
            .subscribe({
              next: res => {
                const snackBar = this.snackBar.open("Booking successfully.", "Close", {
                  duration: 1000
                });
                snackBar.afterDismissed().subscribe(res => {
                  this.testDriveForm.reset();
                  this.testDriveForm.controls['email_address'].setErrors(null);
                  this.testDriveForm.controls['full_name'].setErrors(null);
                  this.testDriveForm.controls['contact_number'].setErrors(null);
                  this.testDriveForm.controls['model_name'].setErrors(null);
                });
              },
              error: err => this.snackBar.open("Failed", "Close", {duration: 1000})
            });
        }
      });
    }
  }

  openConfirmationDialog(title: string, message: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel(title, message)
    });
  }
}
