import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginModel } from "../models/login.model";

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

    login(logindata: LoginModel): Observable<any> {
        return this.httpClient
            .post(`http://localhost:5000/signup/`,logindata);
    }


}