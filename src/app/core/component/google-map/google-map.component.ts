import { Component } from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HttpClientModule, HttpClientJsonpModule, MatProgressSpinnerModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.css'
})
export class GoogleMapComponent {

  center: google.maps.LatLngLiteral = {lat: 3.040426199735902, lng: 101.38380008594574};
  zoom = 18;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPosition:google.maps.LatLngLiteral = {
    lat:3.040426199735902,
    lng:101.38380008594574
  }
  addMarker(event: google.maps.MapMouseEvent) {
    // @ts-ignore
    this.markerPositions.push(event.latLng.toJSON());
    console.log(event.latLng?.toJSON());
  }

  apiLoaded!:Observable<any>;

  constructor(private httpClient:HttpClient) {
    this.loadGoogleMapApi();
  }
  loadGoogleMapApi(){
    this.apiLoaded = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.google_map_api_key}`, 'callback')
      .pipe(
        map(() => true),
        catchError((err) => of(err)),
      );
  }
}
