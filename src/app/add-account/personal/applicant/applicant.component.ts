import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import {
  Aadhaar,
  Aadhaar_History,
  License_History,
  Pan_History,
  Voter_History,
} from 'src/app/models/aadhaar';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
})
export class ApplicantComponent implements OnInit {
  @Input() applicantNo!: number;
  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;
  @Output() isMinor = new EventEmitter<boolean>();

  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);
  loadAadhaarButton = false;
  loadOtpButton = false;
  loadPanButton = false;
  loadVoterButton: boolean = false;
  loadLicenseButton: boolean = false;
  previewAdhaar: string = '';

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getMasters();
    if (this.APPLICANT_ID) {
      this.getHistories();
    }
  }

  getHistories() {
    this.getAdhaarHistory();
    this.getPanHistory();
    this.getVoterData();
    this.getLicenseData();
  }

  MASTERS = [{ id: 2, data: <any>[], name: 'title' }];

  async getMasters() {
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result['data'].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }
  }

  setAadhaarInBasicInfo(value: string) {
    if (this.applicantNo === 1) {
      this.basicInfo['AADHAAR_NO_1'] = value;
      this.basicInfo['AADHAAR_NUMBER'] = value;
    } else if (this.applicantNo === 2) {
      this.basicInfo['AADHAAR_NO_2'] = value;
      this.basicInfo['AADHAAR_NUMBER2'] = value;
    } else if (this.applicantNo === 3) {
      this.basicInfo['AADHAAR_NUMBER3'] = value;
    } else if (this.applicantNo === 4) {
      this.basicInfo['AADHAAR_NUMBER4'] = value;
    }
  }

  getAadhaarFromBasicInfo(): string {
    if (this.applicantNo === 1) {
      return this.basicInfo['AADHAAR_NO_1'] || this.basicInfo['AADHAAR_NUMBER'] || '';
    } else if (this.applicantNo === 2) {
      return this.basicInfo['AADHAAR_NO_2'] || this.basicInfo['AADHAAR_NUMBER2'] || '';
    } else if (this.applicantNo === 3) {
      return this.basicInfo['AADHAAR_NUMBER3'] || '';
    } else if (this.applicantNo === 4) {
      return this.basicInfo['AADHAAR_NUMBER4'] || '';
    }
    return '';
  }

  showAadharNo(value: string) {
    this.previewAdhaar = value;
    this.setAadhaarInBasicInfo(value);
    this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo] = false;
  }

  showPanNo(value: string) {
    this.basicInfo['PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')] = value;
    this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo] = false;
  }

  async getOtp() {
    this.loadOtpButton = true;
    if ((await this.checkBalance(1)) == 0) {
      this.loadOtpButton = false;
      return;
    }

    if (!(await this.searchAadhaar())) {
      this.loadOtpButton = false;
      return;
    }

    let otpData = this.aadhaarVerify.getOTP();
    otpData.subscribe({
      next: (res) => {
        this.loadOtpButton = false;
      },
      error: () => {
        this.loadOtpButton = false;
      },
    });
  }




  // async initializeAadhaarVerification(AplicantNo: number) {
  //   if ((await this.checkBalance(1)) == 0) {
  //     return;
  //   }

  //   switch (AplicantNo) {
  //     case 1: {
  //       // this.loadOtpButton = true;
  //       if (!this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER) {
  //         this.message.error(
  //           "Aadhaar No missing",
  //           "Please enter aadhaar number first to start verification",
  //         );
  //         return;
  //       }
  //       let verification = this.aadhaarVerify.initializeAadhaarVerification();

  //       verification.subscribe({
  //         next: (res) => {
  //           const varification_window = window.open(
  //             this.aadhaarVerify.meta.url,
  //           );
  //           if (!varification_window) {
  //             alert("Please allow popups");
  //           } else {
  //             this.aadhaarVerify.verfication_window_open = true;
  //             const checkChildClosed = setInterval(() => {
  //               if (varification_window.closed) {
  //                 clearInterval(checkChildClosed);
  //                 this.aadhaarVerify.verfication_window_open = false;
  //                 this.getAadhaarData();
  //                 console.log("Child window is closed");
  //               }
  //             }, 500);
  //           }
  //         },
  //         error: () => { },
  //       });
  //       break;
  //     }

  //     // case 2: {
  //     //   if (!this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER) {
  //     //     this.message.error(
  //     //       "Aadhaar No missing",
  //     //       "Please enter aadhaar number first to start verification",
  //     //     );
  //     //     return;
  //     //   }

  //     //   let verification = this.aadhaarVerify2.initializeAadhaarVerification();

  //     //   verification.subscribe({
  //     //     next: (res) => {
  //     //       const varification_window = window.open(
  //     //         this.aadhaarVerify2.meta.url,
  //     //       );
  //     //       if (!varification_window) {
  //     //         alert("Please allow popups");
  //     //       } else {
  //     //         this.aadhaarVerify2.verfication_window_open = true;
  //     //         const checkChildClosed = setInterval(() => {
  //     //           if (varification_window.closed) {
  //     //             clearInterval(checkChildClosed);
  //     //             this.aadhaarVerify2.verfication_window_open = false;
  //     //             this.getAadhaarData(2);
  //     //             console.log("Child window is closed");
  //     //           }
  //     //         }, 500);
  //     //       }
  //     //     },
  //     //     error: () => { },
  //     //   });
  //     //   break;
  //     // }

  //     // case 3: {
  //     //   if (!this.aadhaarVerify3.aadhar_history.AADHAAR_NUMBER) {
  //     //     this.message.error(
  //     //       "Aadhaar No missing",
  //     //       "Please enter aadhaar number first to start verification",
  //     //     );
  //     //     return;
  //     //   }

  //     //   let verification = this.aadhaarVerify3.initializeAadhaarVerification();

  //     //   verification.subscribe({
  //     //     next: (res) => {
  //     //       const varification_window = window.open(
  //     //         this.aadhaarVerify3.meta.url,
  //     //       );
  //     //       if (!varification_window) {
  //     //         alert("Please allow popups");
  //     //       } else {
  //     //         this.aadhaarVerify3.verfication_window_open = true;
  //     //         const checkChildClosed = setInterval(() => {
  //     //           if (varification_window.closed) {
  //     //             clearInterval(checkChildClosed);
  //     //             this.aadhaarVerify3.verfication_window_open = false;
  //     //             this.getAadhaarData(3);
  //     //             console.log("Child window is closed");
  //     //           }
  //     //         }, 500);
  //     //       }
  //     //     },
  //     //     error: () => { },
  //     //   });
  //     //   break;
  //     // }

  //     // case 4: {
  //     //   if (!this.aadhaarVerify4.aadhar_history.AADHAAR_NUMBER) {
  //     //     this.message.error(
  //     //       "Aadhaar No missing",
  //     //       "Please enter aadhaar number first to start verification",
  //     //     );
  //     //     return;
  //     //   }

  //     //   let verification = this.aadhaarVerify4.initializeAadhaarVerification();

  //     //   verification.subscribe({
  //     //     next: (res) => {
  //     //       const varification_window = window.open(
  //     //         this.aadhaarVerify4.meta.url,
  //     //       );
  //     //       if (!varification_window) {
  //     //         alert("Please allow popups");
  //     //       } else {
  //     //         this.aadhaarVerify4.verfication_window_open = true;
  //     //         const checkChildClosed = setInterval(() => {
  //     //           if (varification_window.closed) {
  //     //             clearInterval(checkChildClosed);
  //     //             this.aadhaarVerify4.verfication_window_open = false;
  //     //             this.getAadhaarData(4);
  //     //             console.log("Child window is closed");
  //     //           }
  //     //         }, 500);
  //     //       }
  //     //     },
  //     //     error: () => { },
  //     //   });
  //     //   break;
  //     // }

  //     default: {
  //       console.error(
  //         "Inside function initializeAadhaarVerification : AplicantNo is Invalid - ",
  //         AplicantNo,
  //       );
  //       break;
  //     }
  //   }
  // }


  getAadhaarData() {
    this.loadAadhaarButton = true;
    let aadhar_data = this.aadhaarVerify.getData();
    aadhar_data.subscribe({
      next: (res) => {
        if (res == true) {
          if (!this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo]) {
            this.saveAadhaarData();
          } else {
            this.setAadhaarInBasicInfo(this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER);
          }
          this.Hit(1);
        }
        this.loadAadhaarButton = false;
      },
      error: (err) => {
        this.loadAadhaarButton = false;
      },
    });
  }

  saveAadhaarData() {
    this.aadhaarVerify.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
    this.aadhaarVerify.aadhar_history.APPLICANT_NO = this.applicantNo;
    this.aadhaarVerify.aadhar_history.ADDRESS_ID = [
      this.aadhaarVerify.aadhar_address,
    ];
    this.setAadhaarInBasicInfo(this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER);
    this.saveAadhaar(this.aadhaarVerify.aadhar_history);
  }

  private saveAadhaar(data: Aadhaar_History) {
    const apiCall = data.ID
      ? this.api.updateAadhaarData(data)
      : this.api.createAadhaarData(data);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getAdhaarHistory();
        }
      },
    });
  }

  getAdhaarHistory() {
    let aadhaar_no = this.getAadhaarFromBasicInfo();
    if (!aadhaar_no) return;

    this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER = aadhaar_no;

    this.api.getAadhaarData(this.applicantNo, aadhaar_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.aadhar_history = res['data'][0];
          if (this.aadhaarVerify.aadhar_history.ADDRESS_ID.length > 0) {
            this.aadhaarVerify.aadhar_address =
              this.aadhaarVerify.aadhar_history.ADDRESS_ID[0];
          }
          this.aadhaarVerify.MakeHistory();
        }
      },
    });
  }

  async verifyPan() {
    if ((await this.checkBalance(2)) == 0) return;
    
    this.loadPanButton = true;
    if (!(await this.searchPAN())) {
      this.loadPanButton = false;
      return;
    }

    let panverify = this.aadhaarVerify.verifyPan();
    panverify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo[
            'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
          ] = this.aadhaarVerify.pan_history.PAN_NUMBER;
          if (!this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo]) {
            this.savePanData();
          }
          this.Hit(2);
        }
        this.loadPanButton = false;
      },
      error: () => {
        this.loadPanButton = false;
      },
    });
  }

  savePanData() {
    this.aadhaarVerify.pan_history.APPLICANT_NO = this.applicantNo;
    this.savePAN(this.aadhaarVerify.pan_history);
  }

  savePAN(PAN: Pan_History) {
    const apiCall = PAN.ID
      ? this.api.updatePanData(PAN)
      : this.api.createPanData(PAN);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getPanHistory();
        }
      },
    });
  }

  getPanHistory() {
    let pan_no =
      this.basicInfo[
      'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
      ];
    if (!pan_no) return;

    this.aadhaarVerify.pan_history.PAN_NUMBER = pan_no;

    this.api.getPanData(this.applicantNo, pan_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.pan_history = res['data'][0];
        }
      },
    });
  }

  async verifyVoterID() {
    if ((await this.checkBalance(3)) == 0) return;

    this.loadVoterButton = true;
    let voterVerify = this.aadhaarVerify.verifyVoterID();
    voterVerify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo['VOTER_ID_' + this.applicantNo] =
            this.aadhaarVerify.voter_history.EPIC_NO;
          if (!this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo]) {
            this.saveVoterData();
          }
          this.Hit(3);
        }
        this.loadVoterButton = false;
      },
      error: () => {
        this.loadVoterButton = false;
      },
    });
  }

  saveVoterData() {
    this.saveVoter(this.aadhaarVerify.voter_history);
  }

  saveVoter(Voter: Voter_History) {
    const apiCall = Voter.ID
      ? this.api.updateVoterHistory(Voter)
      : this.api.createVoterHistory(Voter);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getVoterData();
        }
      },
    });
  }

  getVoterData() {
    let voter_id = this.basicInfo['VOTER_ID_' + this.applicantNo];
    if (!voter_id) return;

    this.api.getVoterHistory(voter_id).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.voter_history = res['data'][0];
        }
      },
    });
  }

  async verifyLicense() {
    if ((await this.checkBalance(4)) == 0) return;

    this.loadLicenseButton = true;
    let licenseVerify = this.aadhaarVerify.getLicenseData();
    licenseVerify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo['LICENSE_NO_' + this.applicantNo] =
            this.aadhaarVerify.license_history.LICENSE_NUMBER;
          if (!this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo]) {
            this.saveLicenseData();
          }
          this.Hit(4);
        }
        this.loadLicenseButton = false;
      },
      error: () => {
        this.loadLicenseButton = false;
      },
    });
  }

  saveLicenseData() {
    this.saveLicense(this.aadhaarVerify.license_history);
  }

  saveLicense(license: License_History) {
    const apiCall = license.ID
      ? this.api.updateLicenseHistory(license)
      : this.api.createLicenseHistory(license);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getLicenseData();
        }
      },
    });
  }

  getLicenseData() {
    let license_no = this.basicInfo['LICENSE_NO_' + this.applicantNo];
    if (!license_no) return;

    this.api.getLicenseHistory(license_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.license_history = res['data'][0];
        }
      },
    });
  }

  async checkBalance(doc_id: number) {
    let suffR = await lastValueFrom(this.api.checkSufBal(doc_id));
    if (suffR['code'] == 200) {
      if (!suffR['isSufficient']) {
        this.message.error('Insufficient Balance.', 'Please Recharge.');
        return 0;
      }
      return 1;
    } else {
      this.message.error('Something went wrong.', 'Failed to fetch balance.');
      return 0;
    }
  }

  Hit(doc_type: number) {
    let BRANCH_ID = Number(sessionStorage.getItem('BRANCH_ID'));
    let USER_ID = Number(sessionStorage.getItem('USER_ID'));
    lastValueFrom(this.api.docVerifyHit(BRANCH_ID, USER_ID, doc_type));
  }

  calculateAge() {
    let dob_key: any = 'DOB_' + this.applicantNo;
    let age_key: any = 'AGE_' + this.applicantNo;
    let Age = this.basicInfo[dob_key];
    if (Age) {
      let ageArray = Age.split('/');
      let year = ~~ageArray[2];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      this.basicInfo[age_key] = currentYear - year;
      if (this.basicInfo[age_key] < 18 && this.applicantNo === 1) {
        this.isMinor.emit(true);
      } else if (this.basicInfo[age_key] >= 18 && this.applicantNo === 1) {
        this.isMinor.emit(false);
      }
    } else {
      this.basicInfo[age_key] = 0;
    }
  }

  async searchCustomer() {
    const customerId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    if (customerId) {
      let res: any = await lastValueFrom(this.api.searchCustomer(customerId));
      this.handleSearchResponse(res);
    } else {
      this.message.error('Please Enter Customer ID.', '');
    }
  }

  async searchAadhaar() {
    const aadhaarNo = this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
    if (aadhaarNo) {
      let res: any = await lastValueFrom(
        this.api.searchCustomer('', aadhaarNo, '', 'AADHAAR_NO')
      );
      return this.handleSearchResponse(res, true);
    }
    return true;
  }

  async searchPAN() {
    const panNo = this.aadhaarVerify.pan_history.PAN_NUMBER;
    if (panNo) {
      let res: any = await lastValueFrom(
        this.api.searchCustomer('', '', panNo, 'PAN')
      );
      return this.handleSearchResponse(res, true);
    }
    return true;
  }

  // private handleSearchResponse(res: any): boolean {
  //   if (res['code'] == 200) {
  //     const searchData = res['data'];
  //     if (searchData.ALREADY_EXIST == 'Y') {
  //       this.message.error(
  //         'This Customer Already Has An Individual Account.',
  //         ''
  //       );
  //       return false;
  //     } else {
  //       this.populateFieldsFromSearch(searchData);
  //     }
  //   } else if (res['code'] == 404) {
  //     this.message.error('No Customer Found.', '');
  //   } else {
  //     this.message.error('Something Went Wrong', '');
  //   }
  //   return true;
  // }

  private handleSearchResponse(res: any, isBackground = false): boolean {
    if (res?.code === 200) {
      const searchData = res.data;

      this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo] = true;
      if (!this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo]) {
        this.message.warning(
          'Customer already exists in CBS. Verification is allowed, but submission will be blocked.',
          ''
        );
      } else {
        this.message.success('Customer details retrieved from CBS successfully.', '');
      }

      // ✅ Still allow verification
      this.populateFieldsFromSearch(searchData);
      return true;
    }

    if (res?.code === 404) {
      if (!isBackground) {
        this.message.error('No Customer Found.', '');
      }
      this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo] = false;
      return isBackground ? true : false;
    }

    // Network timeout or other error
    if (res?.error && (String(res.error).includes('ETIMEDOUT') || String(res.error).includes('connect') || String(res.error).includes('timeout'))) {
      console.warn('CBS API Connection Timeout/Offline. Duplicate validation skipped.');
    } else {
      this.message.error('Something Went Wrong', '');
    }
    
    this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + this.applicantNo] = false;
    return isBackground ? true : false;
  }


  private populateFieldsFromSearch(data: any) {
    this.basicInfo['CUSTOMER_ID_' + this.applicantNo] = data.CUSTOMERID;
    this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = true;
    this.aadhaarVerify.pan_history.PAN_NUMBER = data.PAN;
    this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER = data.CUSTUIN;
    this.basicInfo['MOBILE_' + this.applicantNo] = data.MOBILE;
    this.basicInfo['GENDER_' + this.applicantNo] = data.GENDER;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_FIRST_NAME'
        : 'APPLICANT' + this.applicantNo + '_FIRST_NAME'
    ] = data.FIRST_NAME;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
        : 'APPLICANT' + this.applicantNo + '_MIDDLE_NAME'
    ] = data.MIDDLE_NAME;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_LAST_NAME'
        : 'APPLICANT' + this.applicantNo + '_LAST_NAME'
    ] = data.LAST_NAME;
    this.basicInfo['DOB_' + this.applicantNo] = this.convertDate(
      data.BIRTHDATE
    );
    this.calculateAge();
  }

  convertDate(date: string) {
    if (!date) return '';
    let arr = date.split(' ');
    let firstPart = arr[0].split('-');
    let dd = firstPart[0],
      mm = firstPart[1],
      yy = firstPart[2];
    return `${dd}/${mm}/${yy}`;
  }
}
