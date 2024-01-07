import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../model/appointment.interface";
import {Page} from "../model/page.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn:'root'
})
export class AppointmentService{

  // @ts-ignore
  private appointments$ = new BehaviorSubject<Page<Appointment>>(null);
  private count$ = new BehaviorSubject<any>({});

  private url = `${environment.api_url}/appointments`;

  constructor(private httpClient:HttpClient) {}

  findAll(params?:HttpParams,headers?:HttpHeaders){
    return this.httpClient.get<Page<Appointment>>(`${this.url}`,{params:params,headers:headers})
      .subscribe(appointments=>this.appointments$.next(appointments));
  }

  getAppointments$(){
    return this.appointments$.asObservable();
  }

  partialUpdate(id: number, body:any) {
    return this.httpClient.patch(`${this.url}/${id}`,body);
  }

  count(params?:HttpParams,headers?:HttpHeaders){
    this.httpClient.get<number>(`${this.url}/count`,{params:params,headers:headers})
      .subscribe({
        next:res=>this.count$.next(res),
        error:err=>console.log(err)
      })
  }

  getCount$(){
    return this.count$.asObservable();
  }

  save(value: Appointment) {
    return this.httpClient.post(`${this.url}`,value);
  }
}
