import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoginService {
    isLoggedIn: BehaviorSubject<boolean>;

    constructor(private httpClient: HttpClient) {
        this.isLoggedIn = new BehaviorSubject<boolean>(false);
    }

    getLoggedInState() {
        return this.isLoggedIn.value;
    }

    setLoggedInState(isLoggedIn) {
        this.isLoggedIn.next(isLoggedIn);
    }

    login(repoDetails: any): Observable<any> {
        return this.httpClient
            .post(`http://localhost:5000/signup/`,{"username":"myusername"});
    }


}