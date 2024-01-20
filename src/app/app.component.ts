import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent, RouterModule,
  RouterOutlet
} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FooterComponent} from "./fragments/footer/footer.component";
import {NavbarComponent} from "./fragments/navbar/navbar.component";
import {HttpClientModule} from "@angular/common/http";
import {LoadingSpinnerComponent} from "./core/component/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, NavbarComponent,LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdmin = true;
  title = 'car-booking';

  isLoading = false;

  constructor(private router:Router) {
    this.router.events.subscribe(event  => {
      if (event instanceof NavigationStart) {
        this.isLoading = true
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(()=>{
            this.isLoading = false;
        },4000)
      }
    });
  }


}
