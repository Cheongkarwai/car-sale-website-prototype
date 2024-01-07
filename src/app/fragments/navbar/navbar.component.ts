import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas,
  NgbProgressbar
} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../core/service/auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit,AfterViewInit{

  isAdmin = false;
  isMegaMenuVisible  = false;
  isCollapsed = false;

  carModels = [
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc90-hybrid.png?h=192&iar=0&w=517',name:'XC90',price:0},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc60-hybrid.png?iar=0',name:'XC60',price:0},
    {image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my23/xc40-hybrid.png?h=192&iar=0&w=466',name:'XC40',price:0},
  ];

  private offcanvasService = inject(NgbOffcanvas);

  constructor(private authService:AuthService,private router:Router) {
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  ngAfterViewInit() {
    // this.offcanvasService.open(this.bookTestDrivingCanvas,{position:'bottom',backdrop:"static"})
  }

  @ViewChild('bookTestDriving') bookTestDrivingCanvas !:TemplateRef<any>;

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  toggleMegaMenu() {
    this.isMegaMenuVisible = !this.isMegaMenuVisible;
  }

  toggleNavbar() {
    console.log(this.isCollapsed);
    this.isCollapsed = !this.isCollapsed;
  }



  navigateToTestDriveSection() {
    this.offcanvasService.dismiss();
  }


  logout($event: MouseEvent) {
    this.authService.logout()
      .subscribe(res=>this.router.navigateByUrl(''));
  }
}
