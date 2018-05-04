import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Token } from '../app/shared/models/token';

@Injectable()
export class AuthenticationServiceStub {
  redirectUrl: string;

  constructor() {}

  loginUser(username: string, password: string): Observable<Token> {
    return Observable.create((observer: Observer<Token>) => {
      observer.next(new Token());
    });
  }

  logoutUser() {
    console.log('testing logoutuser');
  }
}
