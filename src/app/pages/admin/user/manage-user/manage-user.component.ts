import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {CommonModule, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Pageable} from "../../appointment/manage-appointment/manage-appointment.component";
import {MatTableModule} from "@angular/material/table";
import {AccountService} from "../../../../core/service/account.service";
import {Observable} from "rxjs";
import {Page} from "../../../../core/model/page.interface";
import {Account} from "../../../../core/model/account.interface";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {MatSortModule, Sort} from "@angular/material/sort";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Authority} from "../../../../core/model/authority.interface";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../../../core/component/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EditDialogComponent} from "../../../../core/component/edit-dialog/edit-dialog.component";
import {TableComponent} from "../../../../core/component/table/table.component";
import {LoadingSpinnerComponent} from "../../../../core/component/loading-spinner/loading-spinner.component";
import {LoadingProgressComponent} from "../../../../core/component/loading-progress/loading-progress.component";

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgForOf,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    TableComponent,
    LoadingSpinnerComponent,
    LoadingProgressComponent
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {

  displayedColumns = [
    {key: 'no', value: 'No'},
    {key: 'username', value: 'Username'},
    {key: 'full_name', value: 'Full Name'},
    {key: 'contact_number', value: 'Contact Number'},
    {key: 'action', value: 'Action'}]

  data = [{
    no: 1, username: 'Cheong',
    fullName: 'Cheong Kar Wai', contactNumber: '01128188291'
  }]

  searchForm!: FormGroup;
  editUserForm!: FormGroup;

  pageable: Pageable = {
    page: 0,
    size: 25,
    sort: {active: '', direction: ''},
    keyword: ''
  };

  title: string = '';

  accounts$!: Observable<Page<Account>>;
  authorities$!: Observable<Authority[]>;

  constructor(private fb: FormBuilder, private accountService: AccountService,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
  }


  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['']
    });
    this.editUserForm = this.fb.group({
      username: [{value:'',disabled:true}, Validators.required],
      password: ['', Validators.required],
      full_name: ['', Validators.required],
      contact_number: ['', Validators.required],
      confirm_password: ['', Validators.required]
    })
    this.findAllAccounts(this.pageable, this.title);
    this.findAllAuthorities();
  }

  findAllAuthorities() {
    this.accountService.findAllAuthorities();
    this.authorities$ = this.accountService.getAuthorities$();
  }

  findAllAccounts(pageable: Pageable, title: string) {

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

    if (title) {
      params = params.set('title', title);
    }

    this.accountService.findAll(params, headers);
    this.accounts$ = this.accountService.getAccounts$();
  }

  onChangeSelection(event: MatChipSelectionChange) {
    if (!event.source.selected) {
      this.title = '';
      this.findAllAccounts(this.pageable, this.title);
      return;
    }
    this.title = event.source.value;
    this.findAllAccounts(this.pageable, this.title);
  }

  search(event: any) {
    this.pageable.keyword = this.searchForm.get('search')?.getRawValue();
    this.findAllAccounts(this.pageable, this.title);
  }

  clearSearch(event: KeyboardEvent) {
    if (this.searchForm.get('search')?.getRawValue() === '') {
      this.pageable.keyword = '';
      this.findAllAccounts(this.pageable, this.title);
    }
  }

  sorting(event: Sort) {
    this.pageable.sort.active = event.active;
    this.pageable.sort.direction = event.direction;
    this.findAllAccounts(this.pageable, this.title);
  }

  onPageSelection(event: PageEvent) {
    this.pageable.page = event.pageIndex;
    this.pageable.size = event.pageSize;
    this.findAllAccounts(this.pageable, this.title);
  }

  test(id: string) {

  }

  deleteAccount(user:Account) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel("Delete", `Are you sure you want to do this?`)
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.accountService.deleteAccount(user.username)
          .subscribe({
            next: res => {
              const snackRef = this.snackBar.open(`Account ${user.username} has been deleted`, 'Close', {duration: 1000});
              snackRef.afterDismissed().subscribe(res => {
                this.findAllAccounts(this.pageable, this.title);
              });
            },
            error:err=>this.snackBar.open('Failed to delete','Close')
          })
      }
    });

  }

  editAccount(user: Account) {
    this.initializeEditForm(user);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: this.editUserForm,
      // height: '70%',
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((form:FormGroup) => {
      if(form){
        this.accountService.update(form.getRawValue())
          .subscribe({
            next:res=>{
              const snackRef = this.snackBar.open(`Account ${user.username} has been updated`, 'Close', {duration: 1000});
              snackRef.afterDismissed().subscribe(res => {
                this.findAllAccounts(this.pageable, this.title);
              })
            },
            error:err=>this.snackBar.open('Failed to update','Close'),
          })
      }
      this.editUserForm.reset();
    });
  }

  initializeEditForm(user:Account){
    this.editUserForm.setValue({
      username:user.username,
      password:'',
      confirm_password:'',
      contact_number:user.contact_number,
      full_name:user.full_name
    });
  }

  // get username(){
  //   return this.editUserForm.controls['username'];
  // }
  //
  // get password(){
  //   return this.editUserForm.controls['password'];
  // }
  //
  // get confirmPassword(){
  //   return this.editUserForm.controls['confirm_password'];
  // }
  //
  // get contactNumber(){
  //   return this.editUserForm.controls['contact_number'];
  // }
  //
  // get fullName(){
  //   return this.editUserForm.controls['fullName'];
  // }
}
