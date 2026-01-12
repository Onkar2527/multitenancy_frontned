import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionUserDetails } from '../common_modules/session_storage/SessionUserDetails';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  @Output() logined = new EventEmitter<boolean>();
  @Output() passwordReset = new EventEmitter<boolean>();

  USER_NAME = '';
  PASSWORD = '';
  isMobileView = false;

  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;

  passwordPolicy: any;

  passwordVisible = false

  constructor(private api: ApiService, private router: Router, private message: NzNotificationService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }
  ngOnInit(): void {

    if (this.isLogedIn = true) {
      console.log(this.isLogedIn + "Hey there ")
      this.isLogedIn = false;
    }
    this.checkScreenSize();

    this.getPasswordPolicy();


  }

  getPasswordPolicy() {
    this.api.getPasswordPolicyData().subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.passwordPolicy = res['data'];
        }
      }
    })
  }

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  // login(): void {
  //   sessionStorage.clear();
  //   this.isloginSpinning = true;
  //   this.api.login(this.USER_NAME, this.PASSWORD).subscribe({
  //     next: (data) => {
  //       if (data['code'] == 200 && data['data']) {

  //         let passwordPatternStr = `^(?=(.*[A-Z]){${this.passwordPolicy.FR_CAPITAL_LETTERS},})(?=(.*[a-z]){${this.passwordPolicy.FR_SMALL_LETTERS},})(?=(.*\\d){${this.passwordPolicy.FR_NUMBERS},})(?=(.*[\\W_]){${this.passwordPolicy.FR_SYMBOLS},}).{${this.passwordPolicy.PASSWORD_LENGTH},}$`
  //         let passwordPatternRegex = new RegExp(String.raw`${passwordPatternStr}`);

  //         if (!data['data']['PASSWORD_RESET_DATE']) {
  //           this.message.warning("Please reset the password to something secure", "");
  //           this.passwordReset.emit(true);
  //           return;
  //         }
  //         else if (!passwordPatternRegex.test(this.PASSWORD)) {
  //           this.message.warning("Password policy has been updated", "Please reset the password");
  //           this.passwordReset.emit(true);
  //           return;
  //         }
  //         else if (data['data']['DAYS_OF_RESET_PASS'] >= this.passwordPolicy.FR_PASSWORD_RESET) {
  //           this.message.warning("Your password has been expired", "Please reset the password");
  //           this.passwordReset.emit(true);
  //           return;
  //         }

  //         else {
  //           SessionUserDetails.setSessionStorage(data['data']);
  //           this.logined.emit(true);
  //           this.isloginSpinning = false
  //         }

  //       }
  //       else if (data['code'] == 404) {
  //         this.message.error("Username or Password not found!", '');
  //         this.isloginSpinning = false

  //       }
  //       else {
  //         this.message.error("Something went wrong!", '');
  //         this.isloginSpinning = false
  //       }

  //     },
  //     error: () => {
  //       this.isloginSpinning = false

  //     }

  //   })

  // }



  login(): void {
  sessionStorage.clear();
  this.isloginSpinning = true;

  this.api.login(this.USER_NAME, this.PASSWORD).subscribe({
    next: (data) => {

      if (data['code'] == 200 && data['data']) {

        //  Password policy regex
        let passwordPatternStr =
          `^(?=(.*[A-Z]){${this.passwordPolicy.FR_CAPITAL_LETTERS},})` +
          `(?=(.*[a-z]){${this.passwordPolicy.FR_SMALL_LETTERS},})` +
          `(?=(.*\\d){${this.passwordPolicy.FR_NUMBERS},})` +
          `(?=(.*[\\W_]){${this.passwordPolicy.FR_SYMBOLS},}).{${this.passwordPolicy.PASSWORD_LENGTH},}$`;

        let passwordPatternRegex = new RegExp(passwordPatternStr);

        //  Password reset date missing
        if (!data['data']['PASSWORD_RESET_DATE']) {
          this.message.warning("Please reset the password to something secure", "");
          this.passwordReset.emit(true);
          this.isloginSpinning = false;
          return;
        }

        // Password policy mismatch
        else if (!passwordPatternRegex.test(this.PASSWORD)) {
          this.message.warning("Password policy has been updated", "Please reset the password");
          this.passwordReset.emit(true);
          this.isloginSpinning = false;
          return;
        }

        // Password expired
        else if (data['data']['DAYS_OF_RESET_PASS'] >= this.passwordPolicy.FR_PASSWORD_RESET) {
          this.message.warning("Your password has been expired", "Please reset the password");
          this.passwordReset.emit(true);
          this.isloginSpinning = false;
          return;
        }

        //  SUCCESS LOGIN
        else {

          //  SAVE JWT TOKEN
          if (data['token']) {
            localStorage.setItem('JWT_TOKEN', data['token']);
          }

          //  SAVE USER CONTEXT (optional but useful)
          localStorage.setItem('USER_ID', data['data']['ID']);
          localStorage.setItem('ROLE_ID', data['data']['ROLE_ID']);
          localStorage.setItem('BRANCH_ID', data['data']['BRANCH_ID']);

          // Existing logic
          SessionUserDetails.setSessionStorage(data['data']);
          this.logined.emit(true);
          this.isloginSpinning = false;
        }

      }
      else if (data['code'] == 404) {
        this.message.error("Username or Password not found!", '');
        this.isloginSpinning = false;
      }
      else {
        this.message.error("Something went wrong!", '');
        this.isloginSpinning = false;
      }
    },
    error: () => {
      this.isloginSpinning = false;
    }
  });
}

  passwordResetFn() {
    this.passwordReset.emit(true);
  }

}
