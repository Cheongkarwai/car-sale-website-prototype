import {Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgOptimizedImage} from "@angular/common";
import {CarService} from "../../core/service/car.service";
import {HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {CarBrochure} from "../../core/model/car-brochure.interface";
import {CarModel} from "../../core/model/car-model.interface";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {
  BreadcrumbRoute,
  BreadcrumbHeaderComponent
} from "../../core/component/header/header.component";
import {LoadingSpinnerComponent} from "../../core/component/loading-spinner/loading-spinner.component";
import {LoadingProgressComponent} from "../../core/component/loading-progress/loading-progress.component";

@Component({
  selector: 'app-download-brochure',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    BreadcrumbHeaderComponent,
    NgOptimizedImage,
    LoadingSpinnerComponent,
    LoadingProgressComponent
  ],
  templateUrl: './download-brochure.component.html',
  styleUrl: './download-brochure.component.css'
})
export class DownloadBrochureComponent implements OnInit {

  cars = [
    {name:'XC90',pdfUrl:'assets/pdf/car-brochure/Volvo XC90 MY23.pdf',fileName:'Volvo XC90 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc90-hybrid.png?h=192&iar=0&w=517'},
    {name:'XC60',pdfUrl:'assets/pdf/car-brochure/Volvo XC60 MY23.pdf',fileName:'Volvo XC60 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc60-hybrid.png?iar=0'},
    {name:'XC40',pdfUrl:'assets/pdf/car-brochure/XC40 MY24 110923.pdf',fileName:'Volvo XC40 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my23/xc40-hybrid.png?h=192&iar=0&w=466'}
  ];

  carModels$!:Observable<CarModel[]>;

  routes:BreadcrumbRoute[] = [{link:'default',text:'Home'},{link:'',text:'Download Brochure'}];
  constructor(public carService:CarService) {
  }

  downloadPdf(pdfUrl: string,fileName:string) {
    let link = document.createElement("a");
    link.download = fileName;
    link.href = pdfUrl;
    link.click();
  }

  findAllCarBrochures(){
    this.carService.findAllCarsModel('NEW');
    this.carModels$ = this.carService.getCarModels$();
  }

  ngOnInit(): void {
    this.findAllCarBrochures();
  }
}
