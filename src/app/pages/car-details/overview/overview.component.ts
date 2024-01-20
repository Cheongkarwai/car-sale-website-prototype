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
import {ImageViewerComponent} from "../../../core/component/image-viewer/image-viewer.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {environment} from "../../../../environments/environment";
import {LoadingSpinnerComponent} from "../../../core/component/loading-spinner/loading-spinner.component";
import {LoadingProgressComponent} from "../../../core/component/loading-progress/loading-progress.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, SwiperDirective, MatButtonModule, MatIconModule, ChatNowBtnComponent, RouterModule, NgOptimizedImage
    , MatDialogModule, LoadingSpinnerComponent, LoadingProgressComponent],
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

  openImageDialog(url:string) {
    const ref = this.dialog.open(ImageViewerComponent, {
      data: {url:url},
    });
  }
}
