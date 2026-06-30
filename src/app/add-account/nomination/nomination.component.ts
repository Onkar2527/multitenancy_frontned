// import { Component, Input, OnInit } from '@angular/core';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { Subject } from 'rxjs';
// import { NomineeDetails } from 'src/app/models/nominee-details';
// import { ApiService } from 'src/app/service/api.service';

// @Component({
//   selector: 'app-nomination',
//   templateUrl: './nomination.component.html',
//   styleUrls: ['./nomination.component.css'],
// })
// export class NominationComponent implements OnInit {

//   optionList = [
//     {
//       label: 'Father',
//       value: 'A',
//     },
//     {
//       label: 'Mother',
//       value: 'B',
//     },
//     {
//       label: 'Brother',
//       value: 'C',
//     },
//     {
//       label: 'Sister',
//       value: 'D',
//     },
//     {
//       label: 'Son',
//       value: 'E',
//     },
//     {
//       label: 'Daughter',
//       value: 'F',
//     },
//     {
//       label: 'Husband',
//       value: 'G',
//     },

//     {
//       label: 'Wife',
//       value: 'H',
//     },
//     {
//       label: 'Grand Father',
//       value: 'I'
//     },
//     {
//       label: 'Grand Mother',
//       value: 'J'
//     },
//     {
//       label: 'Aunty',
//       value: 'K'
//     },
//     {
//       label: 'Cousin',
//       value: 'L'
//     },
//     {
//       label: 'Daughter in law',
//       value: 'M'
//     },
//     {
//       label: 'Father in law',
//       value: 'N'
//     },
//     {
//       label: 'Friend',
//       value: 'O'
//     },
//     {
//       label: 'Grand Daughter',
//       value: 'P'
//     },
//     {
//       label: 'Grand Son',
//       value: 'Q'
//     },
//     {
//       label: 'Mother in law',
//       value: 'R'
//     },
//     {
//       label: 'Nephew',
//       value: 'S'
//     },
//     {
//       label: 'Uncle',
//       value: 'T'
//     },
//     {
//       label: 'Other',
//       value: 'U'
//     }
//   ]

//   constructor(private api: ApiService, private message: NzNotificationService) { }
//   @Input() APPLICANT_ID!: number;
//   nomineeInfo: NomineeDetails = new NomineeDetails();

//   ngOnInit(): void {
//     if (this.APPLICANT_ID) {
//       this.getNominationInfo();
//     }
//   }

//   mendetory_all = [
//     { field: 'DOB', message: "Nominee's DOB" },
//     { field: 'NOMINEE_NAME', message: 'Name of Nominee' },
//     { field: 'RELATION', message: "Relationship with Applicant" },
//     { field: 'NOMINEE_ADDRESS', message: 'Address of Nominee' }
//   ]

//   mendetory_minor = [
//     { field: 'APONITED_NAME', message: "Name of Appointed Person" },
//     { field: 'APONITED_ADDRESS', message: 'Address of Appointed Person' },
//   ]

//   save() {
//     let nominee: Subject<any> = new Subject();

//     let isOk = true;

//     for (let field of this.mendetory_all) {
//       if (!this.nomineeInfo[field.field as keyof NomineeDetails]) {
//         this.message.error(`${field.message} is Mandatory`, '');
//         isOk = false;
//       }
//     }

//     if (this.nomineeInfo.IS_MINOR) {
//       for (let field of this.mendetory_minor) {
//         if (!this.nomineeInfo[field.field as keyof NomineeDetails]) {
//           this.message.error(`${field.message} is Mandatory`, '');
//           isOk = false;
//         }
//       }
//     }

//     if (isOk) {
//       this.nomineeInfo.APPLICANT_ID = this.APPLICANT_ID;
//       if (this.nomineeInfo.ID) {
//         this.api.updateNominee(this.nomineeInfo).subscribe({
//           next: (res) => {
//             if (res.code == 200) {
//               this.message.success("Nominee Information updated successfully!", '');
//               this.getNominationInfo();
//               nominee.next(res);
//             }
//             else {
//               this.message.error('Failed to update Nominee info', '');
//               nominee.next(res);
//             }
//           },
//           error: (err) => {
//             this.message.error("Internal Server Error!", err);
//             nominee.error('err')
//           },
//           complete: () => {
//             console.info("Add Nominee Info Request Completed!");
//             nominee.complete();
//           }
//         })
//       }
//       else {
//         this.api.addNominee(this.nomineeInfo).subscribe({
//           next: (res) => {
//             if (res.code == 200) {
//               this.message.success("Nominee Information added successfully!", '');
//               this.getNominationInfo();
//               nominee.next(res);
//             }
//             else {
//               this.message.error('Failed to add Nominee info', '');
//               nominee.next(res);
//             }
//           },
//           error: (err) => {
//             this.message.error("Internal Server Error!", err);
//             nominee.error('err')
//           },
//           complete: () => {
//             console.info("Add Nominee Info Request Completed!");
//             nominee.complete();
//           }
//         })
//       }
//     }
//     else {
//       nominee.error("All mendetory fields are not filled");
//     }


//     return nominee;
//   }

//   getNominationInfo() {
//     this.api.getNominee(this.APPLICANT_ID).subscribe({
//       next: (res) => {
//         if (res['code'] == 200 && res['data'].length > 0) {
//           this.nomineeInfo = res['data'][0];
//         }
//         else {

//         }
//       },
//       error: (err) => {

//       },
//       complete: () => {

//       }
//     });
//   }

//   calculateAge() {
//     let Age = this.nomineeInfo.DOB;
//     if (Age) {
//       let ageArray = Age.split('/');
//       let year = ~~ageArray[2];
//       let currentDate = new Date();
//       let currentYear = currentDate.getFullYear();
//       this.nomineeInfo.NOMINEE_AGE = currentYear - year;
//     }
//     else {
//       this.nomineeInfo.NOMINEE_AGE = 0;
//     }
//   }
// }






import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { forkJoin, Subject } from 'rxjs';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-nomination',
  templateUrl: './nomination.component.html',
  styleUrls: ['./nomination.component.css'],
})
export class NominationComponent implements OnInit {

  optionList = [
    {
      label: 'Father',
      value: 'A',
    },
    {
      label: 'Mother',
      value: 'B',
    },
    {
      label: 'Brother',
      value: 'C',
    },
    {
      label: 'Sister',
      value: 'D',
    },
    {
      label: 'Son',
      value: 'E',
    },
    {
      label: 'Daughter',
      value: 'F',
    },
    {
      label: 'Husband',
      value: 'G',
    },

    {
      label: 'Wife',
      value: 'H',
    },
    {
      label: 'Grand Father',
      value: 'I'
    },
    {
      label: 'Grand Mother',
      value: 'J'
    },
    {
      label: 'Aunty',
      value: 'K'
    },
    {
      label: 'Cousin',
      value: 'L'
    },
    {
      label: 'Daughter in law',
      value: 'M'
    },
    {
      label: 'Father in law',
      value: 'N'
    },
    {
      label: 'Friend',
      value: 'O'
    },
    {
      label: 'Grand Daughter',
      value: 'P'
    },
    {
      label: 'Grand Son',
      value: 'Q'
    },
    {
      label: 'Mother in law',
      value: 'R'
    },
    {
      label: 'Nephew',
      value: 'S'
    },
    {
      label: 'Uncle',
      value: 'T'
    },
    {
      label: 'Sister in law',
      value: 'U'
    },
    {
      label: 'Other',
      value: 'V'
    }
  ]

  constructor(private api: ApiService, private message: NzNotificationService) { }
  @Input() APPLICANT_ID!: number
  nominees: NomineeDetails[] = [new NomineeDetails()];
  nominationType: 'Simultaneous' | 'Successive' = 'Simultaneous';

  ngOnInit(): void {
  }

  addNominee() {
    if (this.nominees.length < 4) {
      let nm = new NomineeDetails();
      nm.APPLICANT_ID = this.APPLICANT_ID;
      nm.NOMINATION_TYPE = this.nominationType;
      this.nominees.push(nm);
    }
  }

  removeNominee(index: number) {
    if (this.nominees[index].ID) {
      this.api.deleteNominee({ ID: this.nominees[index].ID }).subscribe({
        next: (res: any) => {
          if (res.code == 200) {
            this.message.success("Nominee Removed Successfully!", "");
            this.nominees.splice(index, 1);
          } else {
            this.message.error("Failed to Remove Nominee", "");
          }
        }
      })
    } else {
      this.nominees.splice(index, 1);
    }
  }

  mendetory_all = [
    { field: 'DOB', message: "Nominee's DOB" },
    { field: 'NOMINEE_NAME', message: 'Name of Nominee' },
    { field: 'RELATION', message: "Relationship with Applicant" },
    { field: 'NOMINEE_ADDRESS', message: 'Address of Nominee' }
  ]

  mendetory_minor = [
    { field: 'APONITED_NAME', message: "Name of Appointed Person" },
    { field: 'APONITED_ADDRESS', message: 'Address of Appointed Person' },
  ]

  save() {
    let nomineeResult: Subject<any> = new Subject();

    if (this.nominationType == 'Simultaneous') {
      let total = 0;
      this.nominees.forEach(n => total += Number(n.SHARE_PERCENTAGE || 0));
      if (total != 100) {
        this.message.error("Total Share Percentage must be 100%", "");
        nomineeResult.error("Total Share Percentage must be 100%");
        return nomineeResult;
      }
    }

    let isAllOk = true;

    for (let i = 0; i < this.nominees.length; i++) {
      let n = this.nominees[i];
      for (let field of this.mendetory_all) {
        if (!n[field.field as keyof NomineeDetails]) {
          this.message.error(`${field.message} for Nominee ${i + 1} is Mandatory`, '');
          isAllOk = false;
        }
      }

      if (n.IS_MINOR) {
        for (let field of this.mendetory_minor) {
          if (!n[field.field as keyof NomineeDetails]) {
            this.message.error(`${field.message} for Nominee ${i + 1} is Mandatory`, '');
            isAllOk = false;
          }
        }
      }
    }

    if (!isAllOk) {
      nomineeResult.error("Mandatory fields are missing");
      return nomineeResult;
    }

    const requests = this.nominees.map((n, index) => {
      n.APPLICANT_ID = this.APPLICANT_ID;
      n.NOMINATION_TYPE = this.nominationType;
      console.log(`Saving Nominee ${index + 1}:`, n);
      return n.ID ? this.api.updateNominee(n) : this.api.addNominee(n);
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        this.message.success("All Nominee details saved successfully!", "");
        this.getNominationInfo();
        nomineeResult.next(results[results.length - 1]);
        nomineeResult.complete();
      },
      error: (err) => {
        this.message.error("Error saving one or more nominees", "");
        nomineeResult.error(err);
      }
    });

    return nomineeResult;
  }

  getNominationInfo() {
    this.api.getNominee(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.nominees = res['data'];
          if (this.nominees.length > 0) {
            this.nominationType = this.nominees[0].NOMINATION_TYPE || 'Simultaneous';
          }
        }
        else {
          this.nominees = [new NomineeDetails()];
          this.nominees[0].APPLICANT_ID = this.APPLICANT_ID;
        }
      },
      error: (err) => {

      },
      complete: () => {

      }
    });
  }

  calculateAge(index: number) {
    let Age = this.nominees[index].DOB;
    if (Age) {
      let ageArray = Age.split('/');
      if (ageArray.length == 3) {
        let year = ~~ageArray[2];
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        this.nominees[index].NOMINEE_AGE = currentYear - year;
      }
    }
    else {
      this.nominees[index].NOMINEE_AGE = 0;
    }
  }
}
