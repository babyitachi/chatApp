import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginModel } from "../models/login.model";

@Injectable({ providedIn: 'root' })
export class LoginService {
    isLoggedIn: BehaviorSubject<boolean>;
    username:BehaviorSubject<string>;

    constructor(private httpClient: HttpClient) {
        this.isLoggedIn = new BehaviorSubject<boolean>(false);
        this.username= new BehaviorSubject<string>("");
    }

    getLoggedInState() {
        return this.isLoggedIn.value;
    }

    setLoggedInState(isLoggedIn) {
        this.isLoggedIn.next(isLoggedIn);
    }

    getUsername() {
        return this.username.value;
    }

    setUsername(name) {
        this.username.next(name);
    }

    login(logindata: LoginModel): Observable<any> {
        return this.httpClient
            .post(`http://localhost:5000/login/`,logindata);
    }

    signup(logindata: LoginModel): Observable<any> {
        return this.httpClient
            .post(`http://localhost:5000/signup/`,logindata);
    }

    getPastUsers(username:string):Observable<any>{
        return this.httpClient
            .post(`http://localhost:5000/pastusers/`,{'username':username});
    }


}