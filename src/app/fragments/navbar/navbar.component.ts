import {Component, inject, TemplateRef, ViewEncapsulation} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas,
  NgbProgressbar
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

  isMegaMenuVisible  = false;

  carModels = [
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc90-hybrid.png?h=192&iar=0&w=517',name:'XC90',price:0},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc60-hybrid.png?iar=0',name:'XC60',price:0},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my23/xc40-hybrid.png?h=192&iar=0&w=466',name:'XC40',price:0},
  ];

  private offcanvasService = inject(NgbOffcanvas);

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  toggleMegaMenu() {
    this.isMegaMenuVisible = !this.isMegaMenuVisible;
  }
}
