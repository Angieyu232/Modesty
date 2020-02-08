import { Injectable } from '@angular/core';
import { timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public TSflag = false; // is Timer started
  public DTused = false; // is today's timer quota used up
  timerSubscription;
  timeLeft: number; // time left in seconds


  constructor() {
  }

  startTimer(timeLimit: number) {
    this.timeLeft = timeLimit * 60;
    this.TSflag = true;
    this.timerSubscription = timer(1000, 2000).subscribe(val => {
        console.log('subscription timer val = ' + val);
        this.timeLeft -= val;
        if (this.timeLeft <= 0) {
          const msg = 'You\'ve reached the daily limit of ' + timeLimit + ' min, Bye';
          alert(msg);
          this.DTused = true;
          this.clearMediaFeed();
        }

  });
}

  clearMediaFeed() {
    // TODO:
    this.timerSubscription.unsubscribe();

  }
}
