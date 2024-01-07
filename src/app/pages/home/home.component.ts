import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavbarComponent} from "../../fragments/navbar/navbar.component";
import {NgbCarouselConfig, NgbCarouselModule, NgbDropdown, NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import {FooterComponent} from "../../fragments/footer/footer.component";
import {CarService} from "../../core/service/car.service";
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import {CarCard} from "../../core/model/car-card.interface";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {register} from 'swiper/element/bundle';
import {DeviceDetectorService} from "ngx-device-detector";
import Swiper from "swiper";
import {SwiperOptions} from "swiper/types";
import {SwiperDirective} from "../../core/directive/swiper.directive";
import {RouterModule} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {CarModel} from "../../core/model/car-model.interface";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  ConfirmationDialogComponent,
  ConfirmDialogModel
} from "../../core/component/confirmation-dialog/confirmation-dialog.component";
import {AppointmentService} from "../../core/service/appointment.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {AppointmentFormComponent} from "../../core/component/appointment-form/appointment-form.component";
import {MatButtonModule} from "@angular/material/button";
import {GoogleMapsModule} from "@angular/google-maps";
import {GoogleMapComponent} from "../../core/component/google-map/google-map.component";
import {ChatNowBtnComponent} from "../../core/component/chat-now-btn/chat-now-btn.component";
import {ImageViewerComponent} from "../../core/component/image-viewer/image-viewer.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent, NgbCarouselModule, SwiperDirective, MatInputModule, MatSelectModule, AppointmentFormComponent,
    MatDialogModule, MatButtonModule, GoogleMapsModule, GoogleMapComponent, ChatNowBtnComponent, NgOptimizedImage, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {


  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = ['assets/images/carousel/c40-gallery-1-1024x576.jpeg', 'assets/images/carousel/c40-gallery-2-1024x576.jpeg',
    'assets/images/carousel/xc90-gallery-1-1024x576.jpeg', 'assets/images/carousel/xc90-gallery-7-1024x576.jpeg'];

  public config: SwiperOptions = {
    autoHeight: true,
    spaceBetween: 10,
    navigation: true,
    pagination: {clickable: true, dynamicBullets: true},
    slidesPerView: 4,
  };

  // testDriveForm!: FormGroup;

  carModels$!: Observable<CarModel[]>;

  constructor(config: NgbCarouselConfig, private carService: CarService, private deviceService: DeviceDetectorService,
              private dialog:MatDialog) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
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

    this.findCarModels('NEW');


  }


  findCarModels(condition: string) {
    this.carService.findAllCarsModel(condition);
    this.carModels$ = this.carService.getCarModels$();
  }

  initiateWhatsapp(message: string) {
    window.open(` https://wa.me/${environment.contact_number}?text=${message}`, 'self');
  }

  chatNowMessenger(message: string) {
    window.open(` http://m.me/${environment.messenger_id}?text=${message}`, 'self');
  }

  openImageDialog(url:string) {
    const ref = this.dialog.open(ImageViewerComponent, {
      data: {url:url},
    });
  }
}
