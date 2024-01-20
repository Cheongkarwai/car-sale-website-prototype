import { Component } from '@angular/core';
import {GoogleMapsModule} from "@angular/google-maps";
import {HttpClient, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {CommonModule} from "@angular/common";
import {GoogleMapComponent} from "../../core/component/google-map/google-map.component";
import {BreadcrumbHeaderComponent, BreadcrumbRoute} from "../../core/component/header/header.component";

@Component({
  selector: 'app-find-us',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HttpClientModule, HttpClientJsonpModule, GoogleMapComponent, BreadcrumbHeaderComponent],
  templateUrl: './find-us.component.html',
  styleUrl: './find-us.component.css'
})
export class FindUsComponent {

  routes:BreadcrumbRoute[] = [{link:'default',text:'Home'},{link:'',text:'Find Us'}];

  // center: google.maps.LatLngLiteral = {lat: 3.040426199735902, lng: 101.38380008594574};
  // zoom = 18;
  // markerOptions: google.maps.MarkerOptions = {draggable: false};
  // markerPosition:google.maps.LatLngLiteral = {
  //   lat:3.040426199735902,
  //   lng:101.38380008594574
  // }
  // addMarker(event: google.maps.MapMouseEvent) {
  //   // @ts-ignore
  //   this.markerPositions.push(event.latLng.toJSON());
  //   console.log(event.latLng?.toJSON());
  // }
  //
  // apiLoaded!:Observable<any>;
  //
  // constructor(private httpClient: HttpClient) {
  //   this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyD4ABhdJ3YX5CfttoCUnt6KT9Q7rcjAUGU', 'callback')
  //     .pipe(
  //       map(() => true),
  //       catchError((err) => of(err)),
  //     );
  //
  // }

}
