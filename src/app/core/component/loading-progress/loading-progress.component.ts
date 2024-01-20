import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading-progress',
  standalone: true,
    imports: [
        MatProgressSpinnerModule
    ],
  templateUrl: './loading-progress.component.html',
  styleUrl: './loading-progress.component.css'
})
export class LoadingProgressComponent {

}
