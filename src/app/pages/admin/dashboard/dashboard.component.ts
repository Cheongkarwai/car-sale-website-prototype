import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule
} from "@angular/cdk/scrolling";
import {CommonModule} from "@angular/common";
import {CountUpDirective} from "../../../core/directive/count-up";
import {Chart,registerables} from "chart.js";
import {AppointmentService} from "../../../core/service/appointment.service";
import {filter, map, Observable, pairwise, throttleTime} from "rxjs";
import {Appointment} from "../../../core/model/appointment.interface";
import {Page} from "../../../core/model/page.interface";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Pageable} from "../appointment/manage-appointment/manage-appointment.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CountUpDirective,
    ScrollingModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  chart!: Chart;

  appointments = [{id:1,timestamp:new Date()}]

  appointments$!:Observable<Page<Appointment>>;

  pageable: Pageable = {
    page: 0,
    size: 10,
    sort: {active: 'timestamp', direction: 'desc'},
    keyword: ''
  };

  status = '';

  chartAspectRatio = 3;

  count$!:Observable<any>;

  constructor(private appointmentService:AppointmentService,private ngZone:NgZone,private detector:DeviceDetectorService) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {

    if(this.detector.isMobile() || this.detector.isTablet()){
      this.chartAspectRatio = 1;
    }

    this.findAllAppointments(this.pageable,this.status);
    this.count$ = this.findCount(['','COMPLETED','CANCELLED']);

    this.chart = new Chart('myChart',{
      type:'line',
      data:{
        labels: ['January','February','March','April','May','Jun','July','August','September','October','November','December'],
        datasets: [
          {
            label:"Appointment",
            data:[1,2],
            borderColor: 'blue',
            backgroundColor: 'rgba(0,102,255,0.6)',
            borderWidth:2
          },
        ],
      },
      options: {
        aspectRatio: this.chartAspectRatio,
        scales: {
          // yAxes: [{
          //   ticks: {
          //     max: 100,
          //     min: 1,
          //     stepSize:1
          //   }
          // }]
        },
      }
    });
  }


  findAllAppointments(pageable: Pageable, status: string) {

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

  findCount(statuses:string[]){

    let params = new HttpParams();

    if(statuses){
      for(const status of statuses){
        params = params.append('status',status);
      }
    }

    this.appointmentService.count(params);
    return this.appointmentService.getCount$();
  }



}
