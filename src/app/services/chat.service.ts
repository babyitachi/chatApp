import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private httpClient: HttpClient) {
    }

    getChats(chatid: string): Observable<any> {
        return this.httpClient
            .post(`http://localhost:5000/getchat/`, {id:chatid});
    }
}
