import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {NgbNav, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {CarService} from "../../core/service/car.service";
import {Observable} from "rxjs";
import {CarDetails} from "../../core/model/car-details.interface";
import {HttpClientModule, HttpParams} from "@angular/common/http";
import {Color} from "../../core/model/color.interface";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {LoadingSpinnerComponent} from "../../core/component/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css'
})
export class CarDetailsComponent {

  links = [
    { title: 'Overview', fragment: 'overview' },
    { title: 'Specification', fragment: 'specification' }
  ];

  modelName:string = 'CS';
  modelId!:number;
  carDetails$!:Observable<CarDetails | null>;
  carColors$!:Observable<Color[]>;

  constructor(public route: ActivatedRoute,public carService:CarService,public router:Router) {
    this.route.params.subscribe(params => {
      this.modelId = params['id'];
      this.findCarDetails(this.modelId);
      // this.findAllColors(params['modelName']);
    });
  }

  findCarDetails(id:number){
    this.carService.findCarDetailsById(id);
    this.carDetails$ = this.carService.getCarDetails$();
  }

  // findAllColors(modelName:string){
  //   this.carService.findAllCarsColorByModelName(modelName,new HttpParams().set('condition','NEW'));
  //   this.carColors$ = this.carService.getCarColors();
  // }
}
