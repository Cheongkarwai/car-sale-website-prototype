import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TableComponent} from "../../../../core/component/table/table.component";
import {Pageable} from "../../appointment/manage-appointment/manage-appointment.component";
import {Observable} from "rxjs";
import {Condition} from "../../../../core/model/condition.interface";
import {Page} from "../../../../core/model/page.interface";
import {CarDetails} from "../../../../core/model/car-details.interface";
import {Sort} from "@angular/material/sort";
import {CarService} from "../../../../core/service/car.service";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  ConfirmationDialogComponent, ConfirmDialogModel
} from "../../../../core/component/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-manage-car',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TableComponent,
    TitleCasePipe,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './manage-car.component.html',
  styleUrl: './manage-car.component.css'
})
export class ManageCarComponent implements OnInit{

  searchForm!:FormGroup;
  conditions$!:Observable<Condition[]>;
  cars$!:Observable<Page<CarDetails> | null>;

  pageable:Pageable = {
    page:0,
    size:25,
    sort:{
      active:'',
      direction:''
    },
    keyword:''
  }

  selectedCondition = 'NEW';

  displayedColumns = [
    {key:'no',value:'No'},
    {key:'model',value:'Model'},
    {key:'starting_price',value:'Price'},
    {key:'action',value:'Action'}
  ];

  constructor(private fb:FormBuilder,private carService:CarService,
              private dialog:MatDialog,private snackBar:MatSnackBar) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      search:['']
    });
    this.findAllConditions();
    this.findAllCars(this.pageable,this.selectedCondition);
  }

  findAllConditions(){
    this.carService.findAllConditions();
    this.conditions$ = this.carService.getConditions$();
  }

  findAllCars(pageable:Pageable,condition:string){
    let params = new HttpParams();
    let headers = new HttpHeaders();

    if(pageable.page || pageable.size){
      params = params.set('page',pageable.page);
      params = params.set('size',pageable.size);
    }

    if(pageable.sort.active && pageable.sort.direction){
      params = params.set('sort',`${pageable.sort.active},${pageable.sort.direction}`);
    }

    if(condition){
      params = params.set('condition',condition);
    }

    if(pageable.keyword){
      params = params.set('keyword',pageable.keyword);
    }

    this.carService.findAllCars(params,headers);
    this.cars$ = this.carService.getCars$();
  }

  sorting(sort:Sort){
    this.pageable.sort = sort;
    this.findAllCars(this.pageable,this.selectedCondition);
  }

  search(event: any) {
    this.pageable.keyword = this.searchForm.get('search')?.getRawValue();
    this.findAllCars(this.pageable, this.selectedCondition);
  }
  clearSearch($event: KeyboardEvent) {
    if(this.searchForm.controls['search'].getRawValue() === ''){
      this.pageable.keyword = '';
      this.findAllCars(this.pageable,this.selectedCondition);
    }
  }

  onPageSelection(page: PageEvent) {
    this.pageable.page = page.pageIndex;
    this.pageable.size = page.pageSize;
    this.findAllCars(this.pageable,this.selectedCondition);
  }

  onChangeSelection(event: MatChipSelectionChange) {
    if (!event.source.selected) {
      this.selectedCondition = '';
      this.findAllCars(this.pageable, this.selectedCondition);
      return;
    }
    this.selectedCondition = event.source.value;
    this.findAllCars(this.pageable, this.selectedCondition);
  }

  delete(carDetails:CarDetails) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel("Delete", `Are you sure you want to do this?`)
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.carService.deleteById(carDetails.id)
          .subscribe({
            next:res=>{
              this.snackBar.open(`Model ${carDetails.model} has been deleted`,"Close",{duration:1000});
              this.findAllCars(this.pageable, this.selectedCondition);
            },
            error:err=>this.snackBar.open(`Failed to delete. Please consult admin`,"Close",{duration:1000})
          });
      }
    })
  }

  edit(carDetails: CarDetails) {
    console.log(carDetails);
  }
}
