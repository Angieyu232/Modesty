import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user.model';
// import { BehaviorSubject } from 'rxjs';
// import { AuthHeaderInterceptor } from '../interceptors/header.interceptor';
const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};



@Injectable({
  providedIn: 'root'
})



export class DataService {

  constructor(private httpClient: HttpClient) { }

  recordTimeStamp(email:string, time : number) {
    const obj = { "email":email, "timeStamp":time };
    console.log('rTS:'+ email);
    this.httpClient.post('/api/user/recordTimeStamp', obj, options)
    .subscribe((data: any) => {
      console.log('api/user/recordTimeStamp res: ' + JSON.stringify(data) );
  });
  }


  isLimitExceed(email:string) : Observable<any>{
    console.log('APIcall client email:' + email)
    return Observable.create( observer => {
      this.httpClient.get('/api/user/isLimitExceed/${email}')
      .subscribe( (data:any)=> {
        console.log('isLimitExceed API return: ' + JSON.stringify(data))
      });
  });
}

// call API to set time limit
  setLimit(email, min) {

      const obj = {'email': email, 'timeLimit': min};
      console.log('req.body: ' + JSON.stringify(obj));

      this.httpClient.post('/api/user/setLimit', obj, options)
      .subscribe((data: any) => {
        console.log('setLimit() response: ' + data );
    });
  }

/*for testing purposes*/
  getLimit(email: string): Promise<any> {
    return this.httpClient.get('/api/user/getLimit/${email}')
      .toPromise()
      .then( (res: any) => res)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
