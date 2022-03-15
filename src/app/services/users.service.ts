import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsersService {
    activeUsersList: BehaviorSubject<String[]>;

    constructor() {
        this.activeUsersList= new BehaviorSubject<String[]>([]);
    }
    getActiveUsers() {
        return this.activeUsersList.value;
    }

    setAllActiveUsers(users) {
        this.activeUsersList.next(users);
    }
}