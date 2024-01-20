import {Injectable} from "@angular/core";
import {Token} from "../model/token.interface";
@Injectable({
  providedIn:'root'
})
export class TokenService{

  constructor() {
  }

  saveToken(token:Token){
    sessionStorage.setItem('access_token',token.access_token);
    sessionStorage.setItem('refresh_token',token.refresh_token);
  }

  deleteToken(){
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  get accessToken() {
    return sessionStorage.getItem('access_token') as string;
  }

  get refreshToken(){
    return sessionStorage.getItem('refresh_token') as string;
  }
}
