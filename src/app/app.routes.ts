import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {DownloadBrochureComponent} from "./pages/download-brochure/download-brochure.component";
import {FindUsComponent} from "./pages/find-us/find-us.component";
import {CarDetailsComponent} from "./pages/car-details/car-details.component";

export const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'download-brochure',component:DownloadBrochureComponent},
  {path:'find-us',component:FindUsComponent},
  {path:'car-details',component:CarDetailsComponent}
];
