import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-car',
  standalone: true,
    imports: [
        RouterOutlet
    ],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {

}
