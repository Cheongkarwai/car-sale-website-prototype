import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {CarService} from "../../core/service/car.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Observable} from "rxjs";
import {CarDetails} from "../../core/model/car-details.interface";
import {HttpParams} from "@angular/common/http";
import {Page} from "../../core/model/page.interface";
import {BreadcrumbHeaderComponent, BreadcrumbRoute} from "../../core/component/header/header.component";
import {ImageViewerComponent} from "../../core/component/image-viewer/image-viewer.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-used-car-listing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    BreadcrumbHeaderComponent,
    NgOptimizedImage,
    MatDialogModule
  ],
  templateUrl: './used-car-listing.component.html',
  styleUrl: './used-car-listing.component.css'
})
export class UsedCarListingComponent implements OnInit {

  usedCars$!:Observable<Page<CarDetails>>;

  routes:BreadcrumbRoute[] = [{link:'default',text:'Home'},{link:'',text:'Volvo Selekt'}];
  constructor(private carService:CarService,private dialog:MatDialog) {
  }

  ngOnInit() {
    this.findUsedCars();
  }

  initiateWhatsapp(message:string) {
    window.open(` https://wa.me/${environment.contact_number}?text=${message}`, 'self');
  }

  findUsedCars(){
    let params = new HttpParams();
    params = params.set('condition','USED');

    this.carService.findAllCars(params);
    // @ts-ignore
    this.usedCars$ = this.carService.getCars$();
    this.usedCars$.subscribe(res=>console.log(res));
  }

  openImageDialog(url:string) {
    const ref = this.dialog.open(ImageViewerComponent, {
      data: {url:url},
    });
  }
}
