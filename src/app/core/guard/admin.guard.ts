import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const AdminGuard:CanActivateFn = (route,state)=>{

  const router = inject(Router);
  const authService = inject(AuthService);

  if(!authService.isAdmin()){
    router.navigateByUrl('login');
    return false;
  }
  return true;
}
