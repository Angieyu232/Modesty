import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//import { User } from '../user.model';

import { TokenStorage } from './token.storage';


@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private token: TokenStorage) {}

  public $userSource = new Subject<any>();

  login(email: string, password: string): Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {
          observer.next({user: data.user});
          this.setUser(data.user);
          this.token.saveToken(data.token);
          observer.complete();
      });
    });
  }

  register(fullname: string, email: string, password: string, repeatPassword: string): Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      });
    });
  }



  setNewPass(email: string, password: string): Observable<any>{
    let body = {"email":email, "password":password};

    return Observable.create(observer=> {
      this.http.post('/api/auth/newPassword', body)
      .subscribe((data:any)=>{
        console.log(JSON.stringify(data));
        observer.next(data.user);
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      });
    })

  }




  setUser(user): void {
    if (user) { user.isAdmin = (user.roles.indexOf('admin') > -1); }
    this.$userSource.next(user);
    (<any>window).user = user;
  }

  getUser(): Observable<any> {
    console.log('getUser() is being called');
    return this.$userSource.asObservable();
  }

  me(): Observable<any> {
    return Observable.create(observer => {
      const tokenVal = this.token.getToken();
      if (!tokenVal) { return  observer.complete(); }
      this.http.get('/api/auth/me').subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        observer.complete();
      });
    });
  }

  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    delete (<any>window).user;
  }


  deleteAcct( email: string): Observable<any>{
    return Observable.create( observer => {
      this.http.post('/api/user/deleteAcct/${email}', {})
      .subscribe((msg:any) => {
      this.signOut();
      observer.complete();
    });
  });
}






}
