import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsersService {
    activeUsersList: BehaviorSubject<String[]>;
    pastUsersList: BehaviorSubject<String[]>;

    constructor() {
        this.activeUsersList= new BehaviorSubject<String[]>([]);
        this.pastUsersList= new BehaviorSubject<String[]>([]);
    }
    getActiveUsers() {
        return this.activeUsersList.value;
    }

    setAllActiveUsers(users) {
        this.activeUsersList.next(users);
    }

    getPastUsers() {
        return this.pastUsersList.value;
    }

    setAllPastUsers(users) {
        this.pastUsersList.next(users);
    }
}