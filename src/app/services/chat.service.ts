import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private httpClient: HttpClient) {
    }

    getChats(chatid: string): Observable<any> {
        return this.httpClient
            .post(`${environment.serverURL}/getchat/`, {id:chatid});
    }
}
