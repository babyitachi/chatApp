import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "./login.service";

@Injectable({ providedIn: 'root' })
export class HomeActivatorService implements CanActivate {

    constructor(private router: Router, private loginService: LoginService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        //check some condition  
        if (this.loginService.getLoggedInState()) {
            return true;
        }
        this.router.navigateByUrl("");
    }

}