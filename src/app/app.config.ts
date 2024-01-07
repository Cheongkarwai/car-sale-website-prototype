import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  HttpClientXsrfModule,
  provideHttpClient,
  withInterceptors, withInterceptorsFromDi
} from "@angular/common/http";
import {CarService} from "./core/service/car.service";
import { provideAnimations } from '@angular/platform-browser/animations';
import {HttpInterceptor} from "./core/interceptor/http.interceptor";


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([HttpInterceptor])), provideAnimations(),],
};

