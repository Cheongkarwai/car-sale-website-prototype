import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
