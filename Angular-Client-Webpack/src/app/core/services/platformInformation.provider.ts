import { Injectable } from '@angular/core';

@Injectable()
export class PlatformInformationProvider {

    private _iOS: boolean;
    private _isAndroid: boolean;
    private _isElectron: boolean;

    public get isMobileDevice(): boolean {
        return this._iOS || this._isAndroid;
    }

    public get isMobileWeb(): boolean {
        return window.innerWidth <= 768;
    }

    public get isWeb(): boolean {
        return !this.isMobileDevice;
    }

    public get isIOS(): boolean {
        return this._iOS;
    }

    public get isAndroid(): boolean {
        return this._isAndroid;
    }

    public get isElectron(): boolean {
        return this._isElectron;
    }

    constructor() {
        this.guessPlatform();
    }

    private guessPlatform(): void {
        this._iOS = this.getWindow().cordova && this.getWindow().cordova.platformId === 'ios';
        this._isAndroid = this.getWindow().cordova && this.getWindow().cordova.platformId === 'android';
        this._isElectron = this.getWindow().navigator.userAgent.match(/Electron/) !== null;

        console.log('userAgent: ' + this.getWindow().navigator.userAgent);
        console.log('mobile: ' + this.isMobileDevice);
        console.log('desktop: ' + this.isElectron);
        console.log('web: ' + this.isWeb);
    }

    private getWindow(): any {
        return window;
    }
}
