import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn:'root'
})
export class FileService{


  constructor(private http:HttpClient) {
  }

  loadFileFromUrl(url:string,fileName:string){
    return this.http.get(url,{responseType:'blob'})
      .pipe(map(file=>new File([file],fileName)));
  }
}
