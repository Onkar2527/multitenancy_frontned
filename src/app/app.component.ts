import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionUserDetails } from './common_modules/session_storage/SessionUserDetails';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FACO';
  //find a better alternative for 
  isLoggedIn = false           //
  //this
  isCollapsed = false;

  route = ''

  collapseMenu() {
    this.isCollapsed ? this.isCollapsed = false : this.isCollapsed = true;
  }

  constructor(public router: Router, private api: ApiService, private message: NzNotificationService) {
  }

  sideMenu = []
  userDetails = {
    BRANCH_ID: '',
    NAME: "",
    ROLE_ID: '',
    USER_ID: ''
  }

  bankDetails = {
    BANK_NAME: '',
    BANK_LOGO_URL: ''
  }

  userExtraInformation = {
    ROLE: '',
    BRANCH: ""
  }

  // ngOnInit(): void {
  //   if (SessionUserDetails.checkSessionStorage()) {
  //     this.login();
  //   }
  //   else {
  //     this.router.navigate(['login']);
  //     this.route = 'login';
  //   }

  //   if (window.screen.availWidth < 1000) {
  //     this.isCollapsed = true
  //   }

  //   window.onpopstate = function (e) {
  //     // this.onBackButtonPressed()
  //     console.log("event", e)
  //     // alert("Pressing back button can lead to unexpected behaviour!");
  //     history.forward();
  //   }

  // }



  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        if (event.url.includes('login')) {
          this.route = 'login';
        }
        else if (event.url.includes('reset-password')) {
          this.route = 'passReset';
        }
        else {
          this.route = 'tabs';
        }

      }
    });

    if (SessionUserDetails.checkSessionStorage()) {
      this.login();
    } else {
      this.router.navigate(['login']);
      this.route = 'login';
    }

  }

  login() {
    console.log("userDetails", this.userDetails);
    this.getUser();
    this.getSideMenu();
    this.fetchBankDetails();
    this.router.navigate(['/dashboard']);
    this.route = 'tabs';
  }

  passwordReset() {
    this.route = 'passReset';
    this.router.navigate(['reset-password'])
  }

  gotoLogin() {
    this.router.navigate(['login']);
    this.route = 'login';
  }

  user: string = '';


  // getUser() {
  //   this.userDetails = SessionUserDetails.getSessionStorage();

  //   this.api.getUserBranch(Number(this.userDetails.BRANCH_ID)).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200 && res['data'].length > 0) {
  //         this.userExtraInformation.BRANCH = res['data'][0]['BRANCH_NAME']
  //       }
  //     }
  //   })

  //   this.api.getUserRole(Number(this.userDetails.ROLE_ID)).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200 && res['data'].length > 0) {
  //         this.userExtraInformation.ROLE = res['data'][0]['NAME']
  //       }
  //     }
  //   })
  // }


  getUser() {
    this.userDetails = SessionUserDetails.getSessionStorage();
    this.api.getUserBranch1().subscribe({
      next: (res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.userExtraInformation.BRANCH = res.data[0].BRANCH_NAME;
        }
      }
    });

    this.api.getUserRole1().subscribe({
      next: (res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.userExtraInformation.ROLE = res.data[0].NAME;
        }
      }
    });
  }

  fetchBankDetails() {
    this.api.getBankDetails().subscribe({
      next: (res) => {
        if (res.code === 200 && res.data) {
          this.bankDetails = res.data;
        }
      },
      error: (err) => {
        console.error("❌ Error fetching bank details:", err);
      }
    });

  }


  logout() {
    sessionStorage.clear();
    window.location.reload();
  }

  getSideMenu() {

    // this.api.getSideMenu(this.userDetails.ROLE_ID).subscribe({
    //   next: (res) => {
    //     if (res['code'] == 200 && res['data']) {

    //       this.sideMenu = res['data'];
    //     }
    //     else {
    //       this.message.error("Internal server Error!", '')
    //     }
    //   },
    //   error: () => {
    //     this.message.error("Internal server Error!", '')
    //   }
    // })

    this.api.getSideMenu().subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data']) {
          this.sideMenu = res['data'];
        } else {
          this.message.error("Internal server Error!", '');
        }
      },
      error: (err) => {
        if (err.status === 401) {
          // 🔐 Token expired / invalid
          sessionStorage.clear();
          this.router.navigate(['login']);
        } else {
          this.message.error("Internal server Error!", '');
        }
      }
    });

  }


}
