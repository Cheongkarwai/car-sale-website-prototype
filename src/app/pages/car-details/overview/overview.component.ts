import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {CarService} from "../../../core/service/car.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Observable} from "rxjs";
import {CarDetails} from "../../../core/model/car-details.interface";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {SwiperDirective} from "../../../core/directive/swiper.directive";
import {SwiperOptions} from "swiper/types";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {register} from "swiper/element/bundle";
import {ChatNowBtnComponent} from "../../../core/component/chat-now-btn/chat-now-btn.component";
import {DeviceDetectorService} from "ngx-device-detector";
import {environment} from "../../../environment/environment";
import {ImageViewerComponent} from "../../../core/component/image-viewer/image-viewer.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, SwiperDirective, MatButtonModule, MatIconModule, ChatNowBtnComponent, RouterModule, NgOptimizedImage
  ,MatDialogModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class OverviewComponent implements OnInit,AfterViewInit {

  carDetails$!:Observable<CarDetails | null>;

  images = ['hello.com','hello.com','hello.com','hello.com','hello.com','hello.com','hello.com','hello.com','hello.com'];

  public config: SwiperOptions = {
    autoHeight: true,
    spaceBetween: 10,
    navigation: true,
    pagination: {clickable: true, dynamicBullets: true},
    slidesPerView: 4,
  };
  constructor(public carService:CarService,private deviceService:DeviceDetectorService,
              private dialog:MatDialog) {}

  ngOnInit(){
    register();
    if (this.deviceService.isMobile()) {
      this.config = {
        autoHeight: true,
        spaceBetween: 10,
        navigation: false,
        pagination: {clickable: true, dynamicBullets: true},
        slidesPerView: 2,
      };
    }
    this.carDetails$ = this.carService.getCarDetails$();
  }

  ngAfterViewInit() {

  }

  bookNow(model: string) {
    window.open(` https://wa.me/${environment.contact_number}?text=I am interested in model ${model}`, 'self');

  }
  openImageDialog(url:string) {
    const ref = this.dialog.open(ImageViewerComponent, {
      data: {url:url},
    });
  }
}
