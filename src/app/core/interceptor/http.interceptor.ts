import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpXsrfTokenExtractor
} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {AuthService} from "../service/auth.service";
import {
  catchError,
  concatMap,
  lastValueFrom,
  map,
  Observable,
  retry,
  retryWhen,
  Subscriber, switchMap,
  tap,
  throwError
} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TokenService} from "../service/token.service";




  // private async handleRequest(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Promise<HttpEvent<any>> {
  //
  //
  // }


export const HttpInterceptor:HttpInterceptorFn = (req,next)=>{

  const domain = 'http://';
  const host = 'localhost:8080';
  const loginRoute = [
    {url:`${domain}${host}/api/v1/auth/login`,method:'POST'},
    {url: `${domain}${host}/api/v1/auth/secrets`,method:'POST'},
    {url:`${domain}${host}/api/v1/auth/refresh-token`,method:'POST'},
    {url:`${domain}${host}/api/v1/auth/logout`,method:'POST'}
  ];
// .requestMatchers(HttpMethod.GET,"/api/v1/cars").permitAll()
//     .requestMatchers(HttpMethod.GET,"/api/v1/cars/{id}").permitAll()
//     .requestMatchers(HttpMethod.GET,"/api/v1/cars/model").permitAll()
//     .requestMatchers(HttpMethod.POST,"/api/v1/appointments").permitAll()
//     .requestMatchers(HttpMethod.POST,"/api/v1/cars").permitAll()

  const unprotectedRoute = [
    {url:`${domain}${host}/api/v1/cars`,method:'GET'},
    {url:`${domain}${host}/api/v1/appointments`,method: 'POST'},
    {url:'https://volvo-sungaibesi.sgp1.digitaloceanspaces.com',method:'GET'}
  ]

  for(let route of loginRoute){
    if(req.url.includes(route.url) && route.method === req.method){
      const authReq = req.clone({
        withCredentials:true
      });
      return next(authReq);
    }
  }


  for(let route of unprotectedRoute){
    if(req.url.includes(route.url) && route.method === req.method){
      return next(req);
    }
  }


  const authService = inject(AuthService);
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);
  const tokenService  = inject(TokenService);

  const authReq = req.clone({
    headers:req.headers.set('Authorization',`Bearer ${tokenService.accessToken}`),
    withCredentials:true
  });
  return next(authReq).pipe(catchError(err=>{
    if(err.status === 401){
      return authService.refreshToken(tokenService.refreshToken).pipe(switchMap((token)=>{
        tokenService.saveToken(token);
        const authReq = req.clone({
          headers:req.headers.set('Authorization',`Bearer ${token.access_token}`),
          withCredentials:true
        });
        return next(authReq);
      })).pipe(catchError(err=>{
        if(err.status === 401){
          authService.removeUserInfo();
          router.navigateByUrl('/login')
            .then(result=>snackbar.open('Login session has expired, please try to login.','Close',{duration:1000}));
        }
        return throwError(err);
      }))
    }
    return throwError(err);
  }));

  // return authService.findSecrets().pipe(concatMap(token=>{
  //   const authReq = req.clone({
  //     headers:req.headers.set('Authorization',`Bearer ${token.access_token}`),
  //     withCredentials:true
  //   });
  //   return next(authReq);
  // }),catchError(err=>{
  //   if(err.status === 401){
  //     return authService.refreshToken().pipe(switchMap((token)=>{
  //       const authReq = req.clone({
  //         headers:req.headers.set('Authorization',`Bearer ${token.access_token}`),
  //         withCredentials:true
  //       });
  //
  //       return next(authReq);
  //     })).pipe(catchError(err=>{
  //       if(err.status === 401){
  //         authService.removeUserInfo();
  //         router.navigateByUrl('/login')
  //           .then(result=>snackbar.open('Login session has expired, please try to login.','Close',{duration:1000}));
  //       }
  //       return throwError(err);
  //     }))
  //   }
  //   return throwError(err);
  // }));
  // authService.findSecrets().pip({
  //   next:res=>{
  //     if(res){
  //       const token = 'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjaGVvbmciLCJzdWIiOiJjaGVvbmciLCJleHAiOjE3MDM1MDc1NjcsImlhdCI6MTcwMzUwMzk2NywiYXV0aG9yaXRpZXMiOlsiQURNSU4iXX0.KvpDmq_uQpkZunN_sdkiEXrPL-29dNMFJqZj-ZhLJTCIyiaSS2dCB9P3J4RYzjyPAZOfXxFXJ7G4t2Wrjh3f7npLgBlzJ6EnTJ3sGLU4hSOEit8wAe1ljboV3TXCDc--bEYqUHGkbM8ZqzNaKgRwIk0c6hoEIQjG8yzM17bVYIjKY6Jbp6c72IggXiv6jbq0OL98faY_ZpsFYt-yhgs4T2aestLOYr6Iyt-9ZqoaARiWinij5lh--vBIGPY38COqVQGbt7hIKvwlQscVXaiM2L1otPjow-5PVJlLIb3FvGLikzt_dhbFhrs3kgE6BsZpEjyPQk9S30JIaGIkd3uYnw';
  //       const httpXsrfTokenExtractor = inject(HttpXsrfTokenExtractor);
  //       const authReq = req.clone({
  //         headers: req.headers.set('Authorization',`Bearer ${token}`),
  //         withCredentials:true
  //       });
  //     }
  //   },
  //   error:err=>console.log(err)
  // });

}

// const handleToken = async ()=>{
//   return
// }

// const handleError = (err:HttpErrorResponse)=>{
//
//   if(err.status === 401){
//     const authService = inject(AuthService);
//     return authService.findSecrets().pipe(concatMap(token=>{
//       if(token.refresh_token){
//
//       }
//       return
//     }))
//   }
//
//   return new Observable<any>();
// }
