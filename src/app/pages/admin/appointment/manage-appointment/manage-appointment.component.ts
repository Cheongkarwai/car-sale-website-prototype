import {Component, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatSortModule, Sort} from "@angular/material/sort";
import {AppointmentService} from "../../../../core/service/appointment.service";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../../../../core/model/page.interface";
import {Appointment} from "../../../../core/model/appointment.interface";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  ConfirmationDialogComponent, ConfirmDialogModel
} from "../../../../core/component/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {TableComponent} from "../../../../core/component/table/table.component";
import {LoadingSpinnerComponent} from "../../../../core/component/loading-spinner/loading-spinner.component";
import {LoadingProgressComponent} from "../../../../core/component/loading-progress/loading-progress.component";

export interface Pageable {
  page: number;
  size: number;
  sort: Sort;
  keyword: string;
}

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatPaginatorModule,
    TableComponent,
    LoadingProgressComponent,
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.css'
})
export class ManageAppointmentComponent implements OnInit {

  displayedColumns = [
    {key: 'no', value: 'No'},
    {key: 'emailAddress', value: 'Email Address'},
    {key: 'fullName', value: 'Contact Number'},
    {key: 'contactNumber', value: 'Contact Number'},
    {key: 'timestamp', value: 'Timestamp'},
    {key: 'action', value: 'Action'}
  ];

  appointments$!: Observable<Page<Appointment>>;

  searchForm!: FormGroup;

  pageable: Pageable = {
    page: 0,
    size: 25,
    sort: {active: '', direction: ''},
    keyword: ''
  };

  options =
    [
      {
        selected: true,
        title: 'Pending',
        value: null,
        color: 'accent'
      },
      {
        selected: false,
        title: 'Completed',
        value: 'COMPLETED',
        color: 'primary'
      },
      {
        selected: false,
        title: 'Cancelled',
        value: 'CANCELLED',
        color: 'warn'
      }]

  status = this.options[0].value;
  enableComplete = false;
  enableCancel = false;


  constructor(private appointmentService: AppointmentService, private dialog: MatDialog,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.findAllAppointments(this.pageable, this.status);
    this.searchForm = this.fb.group({
      search: ['']
    });
    this.toggleHideAction(this.status === this.options[0].value)
  }

  sorting(event: Sort) {
    this.pageable.sort.active = event.active;
    this.pageable.sort.direction = event.direction;
    this.findAllAppointments(this.pageable, this.status);
  }


  toggleHideAction(value: boolean) {
    this.enableCancel = value;
    this.enableComplete = value;
  }

  findAllAppointments(pageable: Pageable, status?: string | null) {

    let params = new HttpParams();
    let headers = new HttpHeaders();

    if (pageable.page || pageable.size) {
      params = params.set('page', pageable.page);
      params = params.set('size', pageable.size);
    }

    if (pageable.sort.active && pageable.sort.direction) {
      params = params.set('sort', `${pageable.sort.active},${pageable.sort.direction}`);
    }

    if (pageable.keyword) {
      params = params.set('keyword', pageable.keyword);
    }

    if (status) {
      params = params.set('status', status);
    }

    this.appointmentService.findAll(params, headers);
    this.appointments$ = this.appointmentService.getAppointments$();
  }

  completeAppointment(element: Appointment) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel("Complete", `Are you sure you want to do this?`)
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appointmentService.partialUpdate(element.id, {status: 'COMPLETED'})
          .subscribe({
            next: res => {
              this.snackBar.open('Success', 'Close');
              this.findAllAppointments(this.pageable, this.status);
            },
            error: err => console.log(err)
          });
      }
    });
  }


  cancelAppointment(element: Appointment) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel("Cancel", `Are you sure you want to do this?`)
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appointmentService.partialUpdate(element.id, {status: 'CANCELLED'})
          .subscribe({
            next: res => {
              this.snackBar.open('Success', 'Close');
              this.findAllAppointments(this.pageable, this.status);
            },
            error: err => console.log(err)
          });
      }
    });
  }

  search(event: any) {
    const keyword = this.searchForm.controls['search'].getRawValue();
    if (keyword) {
      this.pageable.keyword = keyword;
      this.findAllAppointments(this.pageable, this.status);
    }
  }

  onChangeSelection(event: MatChipSelectionChange) {
    console.log(event.source.value);
    if (event.selected && this.status !== event.source.value) {
      this.status = event.source.value;
      this.toggleHideAction(this.status === null)
      this.findAllAppointments(this.pageable, this.status);
    }
  }

  clearSearch(event: KeyboardEvent) {
    if (this.searchForm.controls['search'].getRawValue() === '') {
      this.pageable.keyword = '';
      this.findAllAppointments(this.pageable, this.status);
    }
  }

  onPageSelection(event: PageEvent) {
    this.pageable.page = event.pageIndex;
    this.pageable.size = event.pageSize;
    this.findAllAppointments(this.pageable, this.status);
  }
}
