import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }


   constructor(private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('JWT_TOKEN');

    //  Token नाही
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      //  Token decode (JWT = header.payload.signature)
      const payload = JSON.parse(atob(token.split('.')[1]));

      const currentTime = Math.floor(Date.now() / 1000);

      //  Token expire झाला
      if (payload.exp < currentTime) {
        localStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }

      // Token valid आहे
      return true;

    } catch (error) {
      // Token corrupt असेल
      localStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
