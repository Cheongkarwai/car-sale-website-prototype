import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from "../../fragments/navbar/navbar.component";
import {NgbCarouselConfig, NgbCarouselModule, NgbDropdown, NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import {FooterComponent} from "../../fragments/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent,NgbCarouselModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = ['assets/images/carousel/c40-gallery-1-1024x576.jpeg','assets/images/carousel/c40-gallery-2-1024x576.jpeg',
  'assets/images/carousel/xc90-gallery-1-1024x576.jpeg','assets/images/carousel/xc90-gallery-7-1024x576.jpeg'];

  cards = [
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc90-hybrid.png?h=192&iar=0&w=517',title:'XC90',price:0,description:''},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc60-hybrid.png?iar=0',title:'XC60',price:0,description:''},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my23/xc40-hybrid.png?h=192&iar=0&w=466',title:'XC40',price:0,description: ''},
  ];

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
  }

  initiateWhatsapp() {
    window.open(' https://wa.me/01128188291?text=I\'m%20interested','self');
  }
}
