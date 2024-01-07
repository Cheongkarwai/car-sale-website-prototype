import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {DownloadBrochureComponent} from "./pages/download-brochure/download-brochure.component";
import {FindUsComponent} from "./pages/find-us/find-us.component";
import {CarDetailsComponent} from "./pages/car-details/car-details.component";
import {OverviewComponent} from "./pages/car-details/overview/overview.component";
import {UsedCarListingComponent} from "./pages/used-car-listing/used-car-listing.component";
import {SpecificationComponent} from "./pages/car-details/specification/specification.component";
import {AddCarComponent} from "./pages/admin/car/add-car/add-car.component";
import {AppointmentComponent} from "./pages/admin/appointment/appointment.component";
import {ManageAppointmentComponent} from "./pages/admin/appointment/manage-appointment/manage-appointment.component";
import {DashboardComponent} from "./pages/admin/dashboard/dashboard.component";
import {LoginComponent} from "./pages/login/login.component";
import {ManageUserComponent} from "./pages/admin/user/manage-user/manage-user.component";
import {ProfileComponent} from "./pages/admin/profile/profile.component";
import {UserComponent} from "./pages/admin/user/user.component";
import {CarComponent} from "./pages/admin/car/car.component";
import {ManageCarComponent} from "./pages/admin/car/manage-car/manage-car.component";
import {AdminGuard} from "./core/guard/admin.guard";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {UnauthorizedComponent} from "./pages/unauthorized/unauthorized.component";

export const routes: Routes = [
  {path:'not-found',component:NotFoundComponent},
  {path: '', component: HomeComponent},
  {path: 'download-brochure', component: DownloadBrochureComponent},
  {path: 'find-us', component: FindUsComponent},
  {path: 'volvo-selekt',component:UsedCarListingComponent},
  {
    path: 'car-details/:id', component: CarDetailsComponent, children: [
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      // {
      //   path: 'specification',
      //   component: SpecificationComponent
      // },
    ]
  },
  {
    path: 'volvo-selekt',
    component: UsedCarListingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    children: [
      {
        path: 'user',
        component: UserComponent,
        canActivate:[AdminGuard],
        children: [{
          path: 'manage-user',
          component: ManageUserComponent,
          canActivate:[AdminGuard],
        },
          {
            path: '',
            redirectTo: 'manage-user',
            pathMatch: 'full'
          }
          ]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,

      },
      {
        path: 'appointment',
        component: AppointmentComponent,
        canActivate:[AdminGuard],
        children: [{
          path: 'manage-appointment',
          component: ManageAppointmentComponent,
          canActivate:[AdminGuard],
        },
          {
            path: '',
            redirectTo: 'manage-appointment',
            pathMatch: 'full'
          }]
      },
      {
        path: 'car',
        component: CarComponent,
        canActivate:[AdminGuard],
        children: [
          {
            path: '',
            redirectTo: 'manage-car',
            pathMatch: 'full'
          },
          {
            path: 'add-car',
            component: AddCarComponent,
            canActivate:[AdminGuard],
          },
          {
            path: 'manage-car',
            component: ManageCarComponent,
            canActivate:[AdminGuard],
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate:[AdminGuard],
      },

    ]
  },
  {path: '**', redirectTo: '/not-found'},
  {path: 'unauthorized',component:UnauthorizedComponent}
];
