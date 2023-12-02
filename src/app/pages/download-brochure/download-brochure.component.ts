import { Component } from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";

@Component({
  selector: 'app-download-brochure',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './download-brochure.component.html',
  styleUrl: './download-brochure.component.css'
})
export class DownloadBrochureComponent {

  cars = [
    {name:'XC90',pdfUrl:'assets/pdf/car-brochure/Volvo XC90 MY23.pdf',fileName:'Volvo XC90 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc90-hybrid.png?h=192&iar=0&w=517'},
    {name:'XC60',pdfUrl:'assets/pdf/car-brochure/Volvo XC60 MY23.pdf',fileName:'Volvo XC60 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my24/xc60-hybrid.png?iar=0'},
    {name:'XC40',pdfUrl:'assets/pdf/car-brochure/XC40 MY24 110923.pdf',fileName:'Volvo XC40 Brochure',image:'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/navigation/my23/xc40-hybrid.png?h=192&iar=0&w=466'}
  ];

  downloadPdf(pdfUrl: string,fileName:string) {
    let link = document.createElement("a");
    link.download = fileName;
    link.href = pdfUrl;
    link.click();
  }
}
