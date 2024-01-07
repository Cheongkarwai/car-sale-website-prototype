import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {Account} from "../model/account.interface";
import {Page} from "../model/page.interface";
import {Authority} from "../model/authority.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn:'root'
})
export class AccountService{

  // @ts-ignore
  private accounts$ = new BehaviorSubject<Page<Account>>(null);
  // @ts-ignore
  private account$ = new BehaviorSubject<Account>(null);
  private authorities$ = new BehaviorSubject<Authority[]>([]);
  private url = `${environment.api_url}/accounts`;
  constructor(private httpClient:HttpClient) {
  }

  findAll(params:HttpParams,headers:HttpHeaders){
    this.httpClient.get<Page<Account>>(`${this.url}`,{params:params,headers:headers})
      .subscribe({
        next:account=>this.accounts$.next(account),
        error:err=>console.log(err)
      });
  }

  getAccounts$(){
    return this.accounts$.asObservable();
  }

  findAllAuthorities(params?:HttpParams,headers?:HttpHeaders){
    this.httpClient.get<Authority[]>(`${this.url}/roles`,{params:params,headers:headers})
      .subscribe({
        next:authorities=>this.authorities$.next(authorities),
        error:err=>console.log(err)
      })
  }

  getAuthorities$(){
    return this.authorities$.asObservable();
  }

  deleteAccount(username:string,params?:HttpParams,headers?:HttpHeaders) {
    return this.httpClient.delete(`${this.url}/${username}`);
  }

  update(account:Account,params?:HttpParams,headers?:HttpHeaders) {
    return this.httpClient.put(`${this.url}/${account.username}`,account,{params:params,headers:headers})
  }

  findById(username: string,params?:HttpParams,headers?:HttpHeaders) {
    return this.httpClient.get<Account>(`${this.url}/${username}`,{params:params,headers:headers})
      .subscribe({
        next:account=>this.account$.next(account),
        error:err=>console.log(err)
      });
  }

  getAccount$(){
    return this.account$.asObservable();
  }
}
