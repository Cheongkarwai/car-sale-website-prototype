import { Component } from '@angular/core';
import {environment} from "../../environment/environment";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  protected readonly environment = environment;

  initiateWhatsapp(message:string) {
    window.open(` https://wa.me/${environment.contact_number}?text=${message}`, 'self');
  }
}
