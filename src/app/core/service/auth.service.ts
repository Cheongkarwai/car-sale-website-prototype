import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Account, GrantedAuthority} from "../model/account.interface";
import {Token} from "../model/token.interface";
import {Authority} from "../model/authority.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private url = `${environment.api_url}/auth`;

  constructor(private httpClient: HttpClient) {
  }

  login(user: { username: string, password: string }) {
    return this.httpClient.post<Account>(`${this.url}/login`, `username=${user.username}&password=${user.password}`,
      {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')});
  }


  // findSecrets() {
  //   return this.httpClient.post<Token>(`${this.url}/secrets`, null);
  // }

  refreshToken(refresh_token:string) {
    return this.httpClient.post<Token>(`${this.url}/refresh-token`, refresh_token);
  }

  logout() {
    this.removeUserInfo();
    return this.httpClient.post(`${this.url}/logout`, null);
  }

  setUserInfo(account: Account) {
    sessionStorage.setItem('authorities', JSON.stringify(account?.authorities))
    sessionStorage.setItem('username', account?.username);
  }

  getUserInfo() {

  }

  removeUserInfo() {
    sessionStorage.removeItem('authorities');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  isAdmin() {
    const authoritiesString = sessionStorage.getItem('authorities');
    if (authoritiesString) {
      const authorities: GrantedAuthority [] = JSON.parse(authoritiesString);
      if (authorities.map(authority => authority.authority).includes('ADMIN')) {
        return true;
      }
    }
    return false;
  }
}
