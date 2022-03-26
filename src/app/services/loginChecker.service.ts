import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "./login.service";
import { SocketService } from "./socket.service";

@Injectable({ providedIn: 'root' })
export class LoginCheckerService implements CanActivate {

    constructor(private router: Router, private loginService: LoginService,private socketService: SocketService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        let username=localStorage.getItem('username');
        console.log('username',username);
        if(username!=null){
            this.socketService.socket.emit('join', username);
            this.loginService.setLoggedInState(true);
            this.loginService.setUsername(username);
            this.router.navigateByUrl('home');
            return false;
        }
        //check some condition  
        if (this.loginService.getLoggedInState()) {
            this.router.navigateByUrl('home');
            return false;
        }
        return true;
    }

}