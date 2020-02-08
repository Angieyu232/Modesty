import { Component, OnInit, Input } from '@angular/core';
import { TimerService } from '../service/timer.service';
import { SessionStorageService } from '../service/session-storage.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  @Input() user: any = (<any>window).user;
  @Input() TSflag: boolean;
  @Input() showHomeFeed: boolean ;

//

  constructor(private timerService: TimerService, private sessionSS: SessionStorageService) { }



  ngOnInit() {

//this helps testing ,but would comment out eventually
    const timestamp = Number(this.sessionSS.getTimeStamp);
    const limit = Number(this.sessionSS.getTimeLimit);
    const currTime = (new Date()).getTime();
    if (currTime > (timestamp + limit * 60 * 1000)) {
      this.showHomeFeed = false;
    } else {
      this.showHomeFeed = true;
    }
    console.log('TimeStamp: ' + timestamp );
    //let Email: string = this.sessionSS.getSessionUser();
    //if (Email.length > 4){
    //  this.timerService.checkServerLimit(Email);
    //}

////////////////////////////////////////////////////////
    this.timerService.clearHomeFeed$.subscribe(() => {
      console.log('time to clear all HomeFeed!');
      this.showHomeFeed = false;
      console.log('showHomeFeed: ' + this.showHomeFeed);
    });
  }


  ngOnDestroy() {
    // this.showHomeFeed = true;
    // figure out how to unsubscribe

  }

}
