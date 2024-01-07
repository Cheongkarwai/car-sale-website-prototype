import {Component, Input} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../../../environment/environment";
import {CommonModule, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-chat-now-btn',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './chat-now-btn.component.html',
  styleUrl: './chat-now-btn.component.css'
})
export class ChatNowBtnComponent {


  @Input() text!:string;
  @Input() socialMedia!:string;
  @Input() message!:string;
  @Input() class!:string;

  chatNowWhatsapp() {
    window.open(` https://wa.me/${environment.contact_number}?text=${this.message}`, 'self');
  }

  chatNowMessenger() {
    window.open(` http://m.me/${environment.messenger_id}?text=${this.message}`, 'self');
  }
}
