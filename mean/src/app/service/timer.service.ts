import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { DataService } from './data.service';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TimerService {


    constructor(private sessionSS: SessionStorageService, private dataService: DataService) { }

  public timeoutID: any;
  public timerSource = new Subject<any>();
  public clockIn: number;
  clearHomeFeed$ = this.timerSource.asObservable();

//when triggered, isShowFeed set to false in home component
  callHomeMethod() {
    this.timerSource.next();
  }


  startTimer(min) {
   const msg = 'You\'ve reached the daily limit of ' + min + ' min, Bye!';
   const interval = min * 60 * 1000;
   this.clockIn = (new Date()).getTime();
   // store ClockIn in localStorage
   this.sessionSS.setTimerSession(String(this.clockIn), String(min));
   // console.log('inside startTimer func')
   let email = (<any>window).user.email;
   if( typeof email === 'string' || email instanceof String || email.length > 3){
      this.dataService.recordTimeStamp(email, this.clockIn);
   }

   this.timeoutID = setTimeout( () => {this.timeUpCb(msg); }, interval);
 }

//method invoked when time limit exceed
 timeUpCb(msg: string) {
   this.callHomeMethod();
   alert(msg);
 }

 checkServerLimit(email:string){
   
   if ( typeof email === 'string'){

     const APIsource$ = this.dataService.isLimitExceed(email);
     APIsource$.pipe(
       filter(result => result.msg==true),
       map((result)=>{
         console.log('after rxjs op, result = '+ result);
         this.timerSource.asObservable();
       })
     ).subscribe((data:any)=>{
       console.log('chain Obs evoked: '+ data);
       this.timeUpCb('You\'ve reached today\'s time limit!');
     })
   } else (console.log('Error: timer.service.checkServerLimit() does not have User.email'));

 }





}
