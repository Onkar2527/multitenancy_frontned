// import { Component, Input, OnInit } from '@angular/core';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { Subject, lastValueFrom } from 'rxjs';
// import { BasicInfo } from 'src/app/models/basicInfo';
// import { ApiService } from 'src/app/service/api.service';

// @Component({
//   selector: 'app-personal',
//   templateUrl: './personal.component.html',
//   styleUrls: ['./personal.component.css'],
// })
// export class PersonalComponent implements OnInit {
//   @Input() basicInfo: BasicInfo = new BasicInfo();
//   @Input() APPLICANT_ID!: number;
//   isMinor: boolean = false;

//   applicants: number[] = [];
//   noApplicantSize: number = 6;
//   isGuardian: boolean = false;

//   constructor(
//     private api: ApiService,
//     private message: NzNotificationService
//   ) {}

//   ngOnInit(): void {
//     if (this.APPLICANT_ID) {
//       this.getBasicInfo();
//     } else {
//       this.updateApplicants();
//     }
//   }

//   updateApplicants() {
//     this.applicants = Array.from(
//       { length: this.basicInfo.NO_OF_APPLICANT },
//       (_, i) => i + 1
//     );
//   }

//   addApplicant() {
//     if (this.isGuardian && this.applicants.length >= 2) {
//       this.message.error('Cannot add more than one guardian.', '');
//       return;
//     }
//     this.basicInfo.NO_OF_APPLICANT++;
//     this.updateApplicants();
//   }

//   addGuardian() {
//     if (this.applicants.length < this.noApplicantSize) {
//       this.isGuardian = true;
//       this.addApplicant();
//     }
//   }

//   removeGuardian() {
//     this.isGuardian = false;
//   }

//   handleIsMinor(isMinor: boolean) {
//     if (isMinor) {
//       this.addGuardian();
//     } else {
//       this.removeGuardian();
//     }
//   }

//   removeApplicant(applicantNo: number) {
//     if (this.isGuardian && applicantNo === 2) {
//       this.isGuardian = false;
//     }
//     this.applicants.splice(this.applicants.indexOf(applicantNo), 1);
//     this.basicInfo.NO_OF_APPLICANT--;
//     // Clean up data for the removed applicant
//     for (const key in this.basicInfo) {
//       if (key.endsWith(`_${applicantNo}`)) {
//         delete this.basicInfo[key];
//       }
//     }
//   }

//   getBasicInfo() {
//     this.api.getBasic(this.APPLICANT_ID).subscribe({
//       next: (res) => {
//         if (res['code'] == 200 && res['data'].length > 0) {
//           this.basicInfo = res['data'][0];
//           if (this.basicInfo['APPLICANTS_DATA']) {
//             const applicants = this.basicInfo['APPLICANTS_DATA'];
//             this.basicInfo['applicants'] = applicants;
//             applicants.forEach((applicant: any, index: number) => {
//               const i = index + 1;
//               i == 1
//                 ? (this.basicInfo[`PRIMARY_APPLICANT_FIRST_NAME`] =
//                     applicant.FIRST_NAME)
//                 : (this.basicInfo[`APPLICANT${i}_FIRST_NAME`] =
//                     applicant.FIRST_NAME);
//               i == 1
//                 ? (this.basicInfo[`PRIMARY_APPLICANT_MIDDLE_NAME`] =
//                     applicant.MIDDLE_NAME)
//                 : (this.basicInfo[`APPLICANT${i}_MIDDLE_NAME`] =
//                     applicant.MIDDLE_NAME);
//               i == 1
//                 ? (this.basicInfo[`PRIMARY_APPLICANT_LAST_NAME`] =
//                     applicant.LAST_NAME)
//                 : (this.basicInfo[`APPLICANT${i}_LAST_NAME`] =
//                     applicant.LAST_NAME);
//               this.basicInfo[`AADHAAR_NO_${i}`] = applicant.AADHAAR_NO;
//               this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`] =
//                 applicant.PAN_NUMBER;
//               this.basicInfo[`CUSTOMER_ID_${i}`] = applicant.CUSTOMER_ID;
//               this.basicInfo[`CKYC_NUMBER_${i}`] = applicant.CKYC_NUMBER;
//               this.basicInfo[`VOTER_ID_${i}`] = applicant.VOTER_ID;
//               this.basicInfo[`LICENSE_NO_${i}`] = applicant.LICENSE_NO;
//               this.basicInfo[`DOB_${i}`] = applicant.DOB;
//               this.basicInfo[`GENDER_${i}`] = applicant.GENDER;
//               this.basicInfo[`MOBILE_${i}`] = applicant.MOBILE;
//               this.basicInfo[`AGE_${i}`] = applicant.AGE;
//               this.basicInfo[`OTP_AUTH_${i}`] = applicant.OTP_AUTH;
//               this.basicInfo[`IS_OLD_CUSTOMER_${i}`] =
//                 applicant.IS_OLD_CUSTOMER;
//               this.basicInfo[`CUSTOMER_TYPE_${i}`] = applicant.CUSTOMER_TYPE;
//             });
//           }
//           this.basicInfo.IS_AADHAAR_DBT = this.basicInfo.IS_AADHAAR_DBT
//             ? true
//             : false;
//           if (this.basicInfo['AGE_1'] < 18) {
//             this.isMinor = true;
//             this.isGuardian = true;
//           }
//           this.updateApplicants();
//         }
//       },
//     });
//   }

//   // save() {
//   //   let personal: Subject<any> = new Subject();
//   //   let isOk = true;

//   //   const applicantsData = [];
//   //   for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
//   //     const applicant = {
//   //       APPLICANT_NO: i,
//   //       FIRST_NAME:
//   //         this.basicInfo[
//   //           i == 1 ? 'PRIMARY_APPLICANT_FIRST_NAME' : `APPLICANT${i}_FIRST_NAME`
//   //         ],
//   //       MIDDLE_NAME:
//   //         this.basicInfo[
//   //           i == 1
//   //             ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
//   //             : `APPLICANT${i}_MIDDLE_NAME`
//   //         ],
//   //       LAST_NAME:
//   //         this.basicInfo[
//   //           i == 1 ? 'PRIMARY_APPLICANT_LAST_NAME' : `APPLICANT${i}_LAST_NAME`
//   //         ],
//   //       AADHAAR_NO: this.basicInfo[`AADHAAR_NO_${i}`],
//   //       PAN_NUMBER: this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`],
//   //       CUSTOMER_ID: this.basicInfo[`CUSTOMER_ID_${i}`],
//   //       CKYC_NUMBER: this.basicInfo[`CKYC_NUMBER_${i}`],
//   //       VOTER_ID: this.basicInfo[`VOTER_ID_${i}`],
//   //       LICENSE_NO: this.basicInfo[`LICENSE_NO_${i}`],
//   //       DOB: this.basicInfo[`DOB_${i}`],
//   //       GENDER: this.basicInfo[`GENDER_${i}`],
//   //       MOBILE: this.basicInfo[`MOBILE_${i}`],
//   //       AGE: this.basicInfo[`AGE_${i}`],
//   //       OTP_AUTH: this.basicInfo[`OTP_AUTH_${i}`],
//   //       IS_OLD_CUSTOMER: this.basicInfo[`IS_OLD_CUSTOMER_${i}`],
//   //       CUSTOMER_TYPE: this.basicInfo[`CUSTOMER_TYPE_${i}`],
//   //     };
//   //     applicantsData.push(applicant);
//   //   }

//   //   const dataToSend = { ...this.basicInfo, applicants: applicantsData };

//   //   if (dataToSend.IS_OLD_CUSTOMER_1 && !dataToSend.CUSTOMER_ID_1) {
//   //     this.message.error('Applicant 1 Customer ID is Mandatory', '');
//   //     isOk = false;
//   //     personal.next({ code: 300 });
//   //   }

//   //   if (!dataToSend.ID) {
//   //     dataToSend.MAKER_USER_ID = Number(sessionStorage.getItem('USER_ID'));
//   //     dataToSend.CREATED_BRANCH_ID = Number(
//   //       sessionStorage.getItem('BRANCH_ID')
//   //     );
//   //     dataToSend.TRACK_ID = 1;
//   //   }

//   //   if (isOk) {
//   //     const apiCall = dataToSend.ID
//   //       ? this.api.updateBasic(dataToSend)
//   //       : this.api.addBasic(dataToSend);

//   //     apiCall.subscribe({
//   //       next: (res) => {
//   //         if (res.code == 200) {
//   //           this.message.success(
//   //             `Personal Information ${
//   //               dataToSend.ID ? 'updated' : 'added'
//   //             } successfully!`,
//   //             ''
//   //           );
//   //           if (!dataToSend.ID) {
//   //             this.APPLICANT_ID = res['APPLICANT_ID'];
//   //           }
//   //           this.getBasicInfo();
//   //           personal.next(res);
//   //         } else {
//   //           this.message.error(
//   //             `Failed to ${dataToSend.ID ? 'update' : 'add'} personal info`,
//   //             ''
//   //           );
//   //           personal.next(res);
//   //         }
//   //       },
//   //       error: (err) => {
//   //         this.message.error('Internal Server Error!', err);
//   //         personal.error('err');
//   //       },
//   //       complete: () => {
//   //         console.info('Add Personal Info Request Completed!');
//   //         personal.complete();
//   //       },
//   //     });
//   //   }
//   //   return personal;
//   // }



//   save() {
//   let personal: Subject<any> = new Subject();
//   let isOk = true;

//   const applicantsData = [];
//   for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
//     const applicant = {
//       APPLICANT_NO: i,
//       FIRST_NAME:
//         this.basicInfo[
//           i == 1
//             ? 'PRIMARY_APPLICANT_FIRST_NAME'
//             : `APPLICANT${i}_FIRST_NAME`
//         ],
//       MIDDLE_NAME:
//         this.basicInfo[
//           i == 1
//             ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
//             : `APPLICANT${i}_MIDDLE_NAME`
//         ],
//       LAST_NAME:
//         this.basicInfo[
//           i == 1
//             ? 'PRIMARY_APPLICANT_LAST_NAME'
//             : `APPLICANT${i}_LAST_NAME`
//         ],
//       AADHAAR_NO: this.basicInfo[`AADHAAR_NO_${i}`],
//       PAN_NUMBER: this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`],
//       CUSTOMER_ID: this.basicInfo[`CUSTOMER_ID_${i}`],
//       CKYC_NUMBER: this.basicInfo[`CKYC_NUMBER_${i}`],
//       VOTER_ID: this.basicInfo[`VOTER_ID_${i}`],
//       LICENSE_NO: this.basicInfo[`LICENSE_NO_${i}`],
//       DOB: this.basicInfo[`DOB_${i}`],
//       GENDER: this.basicInfo[`GENDER_${i}`],
//       MOBILE: this.basicInfo[`MOBILE_${i}`],
//       AGE: this.basicInfo[`AGE_${i}`],
//       OTP_AUTH: this.basicInfo[`OTP_AUTH_${i}`],
//       IS_OLD_CUSTOMER: this.basicInfo[`IS_OLD_CUSTOMER_${i}`],
//       CUSTOMER_TYPE: this.basicInfo[`CUSTOMER_TYPE_${i}`],
//     };
//     applicantsData.push(applicant);
//   }

//   const dataToSend = { ...this.basicInfo, applicants: applicantsData };

//   if (dataToSend.IS_OLD_CUSTOMER_1 && !dataToSend.CUSTOMER_ID_1) {
//     this.message.error('Applicant 1 Customer ID is Mandatory', '');
//     isOk = false;
//     personal.next({ code: 300 });
//   }

//   // ❌ REMOVE THIS BLOCK COMPLETELY
//   // if (!dataToSend.ID) {
//   //   dataToSend.MAKER_USER_ID = ...
//   //   dataToSend.CREATED_BRANCH_ID = ...
//   //   dataToSend.TRACK_ID = 1;
//   // }

//   if (isOk) {
//     const apiCall = dataToSend.ID
//       ? this.api.updateBasic(dataToSend)
//       : this.api.addBasic(dataToSend);

//     apiCall.subscribe({
//       next: (res) => {
//         if (res.code == 200) {
//           this.message.success(
//             `Personal Information ${
//               dataToSend.ID ? 'updated' : 'added'
//             } successfully!`,
//             ''
//           );

//           if (!dataToSend.ID) {
//             this.APPLICANT_ID = res['APPLICANT_ID'];
//           }

//           this.getBasicInfo();
//           personal.next(res);
//         } else {
//           this.message.error(
//             `Failed to ${dataToSend.ID ? 'update' : 'add'} personal info`,
//             ''
//           );
//           personal.next(res);
//         }
//       },
//       error: (err) => {
//         this.message.error('Internal Server Error!', err);
//         personal.error(err);
//       },
//       complete: () => {
//         personal.complete();
//       },
//     });
//   }

//   return personal;
// }

// }




import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit, OnChanges {
  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;

  isMinor = false;
  isGuardian = false;

  applicants: number[] = [];
  noApplicantSize = 6;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  // -----------------------------
  // LIFE CYCLE
  // -----------------------------
  ngOnInit(): void {
    this.updateApplicants();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['APPLICANT_ID'] && this.APPLICANT_ID) {
      this.getBasicInfo();
    }
  }

  // -----------------------------
  // APPLICANT HANDLING
  // -----------------------------
  updateApplicants() {
    this.applicants = Array.from(
      { length: this.basicInfo.NO_OF_APPLICANT || 1 },
      (_, i) => i + 1
    );
  }

  addApplicant() {
    if (this.isGuardian && this.applicants.length >= 2) {
      this.message.error('Cannot add more than one guardian', '');
      return;
    }
    this.basicInfo.NO_OF_APPLICANT++;
    this.updateApplicants();
  }

  addGuardian() {
    this.isGuardian = true;
    this.addApplicant();
  }

  removeGuardian() {
    this.isGuardian = false;
  }

  handleIsMinor(isMinor: boolean) {
    this.isMinor = isMinor;
    if (isMinor) {
      this.addGuardian();
    } else {
      this.removeGuardian();
    }
  }

  removeApplicant(applicantNo: number) {
    this.applicants = this.applicants.filter(a => a !== applicantNo);
    this.basicInfo.NO_OF_APPLICANT--;

    Object.keys(this.basicInfo).forEach(key => {
      if (key.endsWith(`_${applicantNo}`)) {
        delete (this.basicInfo as any)[key];
      }
    });
  }

  // -----------------------------
  // GET BASIC INFO
  // -----------------------------
  getBasicInfo() {
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.basicInfo = res.data[0];

          if (this.basicInfo['APPLICANT_DATA']) {
            const applicants = JSON.parse(this.basicInfo['APPLICANT_DATA']);
            this.basicInfo.NO_OF_APPLICANT = applicants.length;

            applicants.forEach((app: any, index: number) => {
              const i = index + 1;

              this.basicInfo[
                i === 1
                  ? 'PRIMARY_APPLICANT_FIRST_NAME'
                  : `APPLICANT${i}_FIRST_NAME`
              ] = app.FIRST_NAME;

              this.basicInfo[
                i === 1
                  ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
                  : `APPLICANT${i}_MIDDLE_NAME`
              ] = app.MIDDLE_NAME;

              this.basicInfo[
                i === 1
                  ? 'PRIMARY_APPLICANT_LAST_NAME'
                  : `APPLICANT${i}_LAST_NAME`
              ] = app.LAST_NAME;

              this.basicInfo[`AADHAAR_NO_${i}`] = app.AADHAAR_NO;
              this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`] = app.PAN_NUMBER;
              this.basicInfo[`CUSTOMER_ID_${i}`] = app.CUSTOMER_ID;
              this.basicInfo[`CKYC_NUMBER_${i}`] = app.CKYC_NUMBER;
              this.basicInfo[`VOTER_ID_${i}`] = app.VOTER_ID;
              this.basicInfo[`LICENSE_NO_${i}`] = app.LICENSE_NO;
              this.basicInfo[`DOB_${i}`] = app.DOB;
              this.basicInfo[`GENDER_${i}`] = app.GENDER;
              this.basicInfo[`MOBILE_${i}`] = app.MOBILE;
              this.basicInfo[`AGE_${i}`] = app.AGE;
              this.basicInfo[`OTP_AUTH_${i}`] = app.OTP_AUTH;
              this.basicInfo[`IS_OLD_CUSTOMER_${i}`] = app.IS_OLD_CUSTOMER;
              this.basicInfo[`CUSTOMER_TYPE_${i}`] = app.CUSTOMER_TYPE;
            });
          }

          if (this.basicInfo.AGE_1 && this.basicInfo.AGE_1 < 18) {
            this.isMinor = true;
            this.isGuardian = true;
          }

          this.updateApplicants();
        }
      },
    });
  }

  // -----------------------------
  // SAVE (CREATE / UPDATE)
  // -----------------------------
  save() {

    console.log('🔥 ADD ACCOUNT saveANext CALLED');
    const personal = new Subject<any>();

    (async () => {
      // 1. Asynchronously validate Aadhaar and PAN numbers against CBS
      let validationFailed = false;

      // Helper to get Aadhaar
      const getAadhaarVal = (idx: number): string => {
        if (idx === 1) {
          return this.basicInfo['AADHAAR_NO_1'] || this.basicInfo['AADHAAR_NUMBER'] || '';
        } else if (idx === 2) {
          return this.basicInfo['AADHAAR_NO_2'] || this.basicInfo['AADHAAR_NUMBER2'] || '';
        } else {
          return this.basicInfo[`AADHAAR_NUMBER${idx}`] || '';
        }
      };

      // Helper to get PAN
      const getPanVal = (idx: number): string => {
        return this.basicInfo['PAN_NUMBER' + (idx > 1 ? idx : '')] || '';
      };

      for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
        const isOldCustomer = !!this.basicInfo['IS_OLD_CUSTOMER_' + i];

        // If flag is already set from verification, block immediately ONLY if not an old customer
        if (this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + i] && !isOldCustomer) {
          this.message.error(`Applicant ${i} already exists in CBS! Save/Submit is blocked.`, '');
          validationFailed = true;
          break;
        }

        // Query CBS for Aadhaar to make sure it doesn't exist ONLY if not an old customer
        const aadhaarNo = getAadhaarVal(i);
        if (aadhaarNo && !isOldCustomer) {
          try {
            const res: any = await lastValueFrom(this.api.searchCustomer('', aadhaarNo, '', 'AADHAAR_NO'));
            if (res && res.code === 200) {
              this.message.error(`Applicant ${i} Aadhaar number already exists in CBS! Save/Submit is blocked.`, '');
              this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + i] = true;
              validationFailed = true;
              break;
            }
          } catch (e) {
            console.error('Aadhaar check failed during save', e);
          }
        }

        // Query CBS for PAN to make sure it doesn't exist ONLY if not an old customer
        const panNo = getPanVal(i);
        if (panNo && !isOldCustomer) {
          try {
            const res: any = await lastValueFrom(this.api.searchCustomer('', '', panNo, 'PAN'));
            if (res && res.code === 200) {
              this.message.error(`Applicant ${i} PAN number already exists in CBS! Save/Submit is blocked.`, '');
              this.basicInfo['CUSTOMER_EXISTS_IN_CBS_' + i] = true;
              validationFailed = true;
              break;
            }
          } catch (e) {
            console.error('PAN check failed during save', e);
          }
        }
      }

      if (validationFailed) {
        personal.next({ code: 400, message: 'Validation failed: Customer already exists in CBS.' });
        personal.complete();
        return;
      }

      const applicantsData = [];

      for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
        applicantsData.push({
          APPLICANT_NO: i,
          FIRST_NAME:
            this.basicInfo[
            i === 1
              ? 'PRIMARY_APPLICANT_FIRST_NAME'
              : `APPLICANT${i}_FIRST_NAME`
            ],
          MIDDLE_NAME:
            this.basicInfo[
            i === 1
              ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
              : `APPLICANT${i}_MIDDLE_NAME`
            ],
          LAST_NAME:
            this.basicInfo[
            i === 1
              ? 'PRIMARY_APPLICANT_LAST_NAME'
              : `APPLICANT${i}_LAST_NAME`
            ],
          AADHAAR_NO: this.basicInfo[`AADHAAR_NO_${i}`],
          PAN_NUMBER: this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`],
          CUSTOMER_ID: this.basicInfo[`CUSTOMER_ID_${i}`],
          CKYC_NUMBER: this.basicInfo[`CKYC_NUMBER_${i}`],
          VOTER_ID: this.basicInfo[`VOTER_ID_${i}`],
          LICENSE_NO: this.basicInfo[`LICENSE_NO_${i}`],
          DOB: this.basicInfo[`DOB_${i}`],
          GENDER: this.basicInfo[`GENDER_${i}`],
          MOBILE: this.basicInfo[`MOBILE_${i}`],
          AGE: this.basicInfo[`AGE_${i}`],
          OTP_AUTH: this.basicInfo[`OTP_AUTH_${i}`],
          IS_OLD_CUSTOMER: this.basicInfo[`IS_OLD_CUSTOMER_${i}`],
          CUSTOMER_TYPE: this.basicInfo[`CUSTOMER_TYPE_${i}`],
        });
      }

      const payload = {
        ...this.basicInfo,
        APPLICANT_ID: this.APPLICANT_ID,
        applicants: applicantsData
      };

      const isUpdate = !!payload.ID;

      if (!isUpdate) {
        payload.MAKER_USER_ID = Number(sessionStorage.getItem('USER_ID'));
        payload.CREATED_BRANCH_ID = Number(sessionStorage.getItem('BRANCH_ID'));
        payload.TRACK_ID = 1;
      }

      const apiCall = isUpdate
        ? this.api.updateBasic(payload)
        : this.api.addBasic(payload);

      apiCall.subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.message.success(
              `Personal Information ${isUpdate ? 'updated' : 'saved'} successfully`,
              ''
            );

            if (!isUpdate && res.APPLICANT_ID) {
              this.APPLICANT_ID = res.APPLICANT_ID;
            }

            this.getBasicInfo();
            personal.next(res);
          } else {
            this.message.error('Failed to save personal info', '');
            personal.next(res);
          }
        },
        error: (err) => {
          this.message.error('Internal Server Error', '');
          personal.error(err);
        },
        complete: () => {
          personal.complete();
        }
      });
    })();

    return personal;
  }
}
