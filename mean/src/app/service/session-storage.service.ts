import { Injectable } from '@angular/core';


const UEMAIL_KEY = 'UserEmail';
const TIMESTAMP_KEY = 'TimeStamp';
const  USERLIMIT_KEY = 'UserLimit';

@Injectable({providedIn: 'root'})



export class SessionStorageService {

  constructor() { }

  public setSessionUser(email) {
    console.log('In setSessionUser');
    if (JSON.stringify(email) == '{}' || !email || email == undefined) {
      console.log('The email object is { } or null');
      return;
    }


    window.localStorage.removeItem(UEMAIL_KEY);
    window.localStorage.setItem(UEMAIL_KEY,  email);
  }

  public getSessionUser(): string {

    return localStorage.getItem(UEMAIL_KEY);
  }


  public setTimerSession(timestamp, min) {
    window.localStorage.removeItem(TIMESTAMP_KEY);
    window.localStorage.removeItem(USERLIMIT_KEY);
    window.localStorage.setItem(TIMESTAMP_KEY,  timestamp);
    window.localStorage.setItem(USERLIMIT_KEY,  min);
  }

  public getTimeStamp(): string {
    return window.localStorage.getItem(TIMESTAMP_KEY);
  }

  public getTimeLimit(): string {
    return window.localStorage.getItem(USERLIMIT_KEY);
  }

}
