import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SocketService {

    public socket: Socket;
    // public message$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor() {
        this.socket = io(environment.socketURL, {});

    }

    // public sendMessage(ev, message) {
        // this.socket.emit(ev, message);
    // }

    // public getNewMessage = (ev) =>
    //     this.socket.on(ev, (message) => {
    //         this.message$.next(message);
    //     });



}