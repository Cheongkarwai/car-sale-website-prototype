import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-breadcrumb-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class BreadcrumbHeaderComponent {

  @Input() routes!:BreadcrumbRoute[];
  @Input() title!:string;
}


export interface BreadcrumbRoute{
  link:string;
  text:string;
}
