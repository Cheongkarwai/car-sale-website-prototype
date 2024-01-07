import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../model/appointment.interface";
import {Page} from "../model/page.interface";

@Injectable({
  providedIn:'root'
})
export class AppointmentService{

  // @ts-ignore
  private appointments$ = new BehaviorSubject<Page<Appointment>>(null);
  private count$ = new BehaviorSubject<any>({});


  constructor(private httpClient:HttpClient) {}

  findAll(params?:HttpParams,headers?:HttpHeaders){
    return this.httpClient.get<Page<Appointment>>('http://localhost:8080/api/v1/appointments',{params:params,headers:headers})
      .subscribe(appointments=>this.appointments$.next(appointments));
  }

  getAppointments$(){
    return this.appointments$.asObservable();
  }

  partialUpdate(id: number, body:any) {
    return this.httpClient.patch(`http://localhost:8080/api/v1/appointments/${id}`,body);
  }

  count(params?:HttpParams,headers?:HttpHeaders){
    this.httpClient.get<number>('http://localhost:8080/api/v1/appointments/count',{params:params,headers:headers})
      .subscribe({
        next:res=>this.count$.next(res),
        error:err=>console.log(err)
      })
  }

  getCount$(){
    return this.count$.asObservable();
  }

  save(value: Appointment) {
    return this.httpClient.post(`http://localhost:8080/api/v1/appointments`,value);
  }
}
