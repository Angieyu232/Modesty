import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../service/timer.service';
import { DataService } from '../service/data.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
//import { switchMap } from 'rxjs/operators';
import { map,filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() timeLimit: number; // this is default value
  // privat userSubscription;
  @Input() newPass: string;
  @Input() newPassRepeat: string;
  @Input() showNotification: boolean = false;

  public currentUser = {};


  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private timerService: TimerService,
    private authService: AuthService,
    private router: Router
   ) { }

  ngOnInit() {

    //this.currentUser = this.sessionSS.getSessionUser();
    this.currentUser = (<any>window).user;
    if (this.currentUser != undefined ) {
      if (this.currentUser.hasOwnProperty('timeLimit')) {
        const num = this.currentUser['timeLimit'];
        if (typeof num === 'number') {
          this.timeLimit = num;
        }
      }
    }
  }


  deleteAcct(){
    var email:string;
    if((<any>window).user != undefined){
      email = (<any>window).user.email
    }
    //open a mat-Dialog
      const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: "you want to delete your account?"
      });

      const confirmationSource:Observable<any> = dialogRef.afterClosed();
      confirmationSource.pipe(
        filter(result=> result==true),
        map((result)=> {
          console.log('chain:'+result);
          //returns a Observable
          this.authService.deleteAcct(email)})
      ).subscribe((msg:any) => {
        console.log('authService.deleteAcct() Obs returns: '+ msg);
        alert('Account Deleted!');
        this.router.navigate(['/auth/login']);
      })

  }


  setNewPass(){
    if (this.newPass.length < 6 || this.newPassRepeat.length < 6){
      alert('password must be longer than 6 characters');
      return;
    }
    if (this.newPass === this.newPassRepeat){
      //sanity check
     if((<any>window).user != undefined){
        this.authService.setNewPass((<any>window).user.email, this.newPass)
        .subscribe(data => {
          console.log('setNewPassAPI returns: ' + data);
          this.showNotification = true});
        }
      }
    }



  setTimer(min) {
      console.log('In SetTimer function params min = ' + min);
      if (this.timeLimit < 1) {
        // sent alert message that time limit need to be larger than 1 min;
        alert('timer need to be larger than 1 min');
      } else {
        // TODO: call api to store timer in DB
        if (this.currentUser.hasOwnProperty('email')) {
          const email = this.currentUser['email'];
          this.dataService.setLimit(email, min);
        } else {
          console.log('unable to access user email from window');
        }

        this.timerService.startTimer(this.timeLimit);

      }
      // this.alertService.startTimer(this.timeLimit);
  }
}
