import { Component } from '@angular/core';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {NgbNav, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    RouterModule
  ],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css'
})
export class CarDetailsComponent {

  links = [
    { title: 'Overview', fragment: 'overview' },
    { title: 'Specification', fragment: 'specification' }
  ];

  constructor(public route: ActivatedRoute) {
  }
}
