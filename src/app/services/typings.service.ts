import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TypingsService {
    constructor() { }

    toPascleCase(str: string): string {
        str = str.replace(/(\w)(\w*)/g,
            function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
        return str;
    }
}