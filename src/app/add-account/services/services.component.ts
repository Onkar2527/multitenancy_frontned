import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  serviceInfo: Facilities = new Facilities();

  @Input() APPLICANT_ID!: number;
  AccountType: string = 'S';

  //checkOptionsOne is a temprary veriable (leter use much better alternative)
  checkOptionsOne: checkInterface[] = [
    { label: 'Cheque Book', checked: this.serviceInfo.CHEQUE_BOOK, value: 'CHEQUE_BOOK' },
    { label: 'Passbook', checked: this.serviceInfo.PASS_BOOK, value: 'PASS_BOOK' },
    { label: 'Statement By Email', checked: this.serviceInfo.STATEMENT_BY_EMAIL, value: 'STATEMENT_BY_EMAIL' },
    { label: 'SMS Alerts', checked: this.serviceInfo.SMS_ALERT, value: 'SMS_ALERT' },
    { label: 'Debit Cum ATM Card', checked: this.serviceInfo.ATM_CARD, value: 'ATM_CARD' },
    { label: 'Consent to communicate new products', checked: this.serviceInfo.CONSENT_NEW_PRODUCT, value: 'CONSENT_NEW_PRODUCT' },
    { label: 'Add on  Card', checked: this.serviceInfo.ADDON_CARD, value: 'ADDON_CARD' },
    { label: 'UPI', checked: this.serviceInfo.UPI, value: 'UPI' },
    { label: 'Mobile Banking', checked: this.serviceInfo.MOBILE_BANKING, value: 'MOBILE_BANKING' }
  ]

  indeterminate = false;
  allChecked = false;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getServiceInfo();
    }
  }

  save() {
    let service: Subject<any> = new Subject();
    this.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;

    if (this.serviceInfo.ID) {
      this.api.updateService(this.serviceInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Service Information updated successfully!", '');
            this.getServiceInfo();
            service.next(res);
          }
          else {
            this.message.error('Failed to update Service info', '');
            service.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          service.error('err')
        },
        complete: () => {
          console.info("update Service Info Request Completed!");
          service.complete();
        }
      })
    }
    else {
      this.api.addService(this.serviceInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Service Information added successfully!", '');
            this.getServiceInfo();
            service.next(res);
          }
          else {
            this.message.error('Failed to add Service info', '');
            service.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          service.error('err')
        },
        complete: () => {
          console.info("Add Service Info Request Completed!");
          service.complete();
        }
      })
    }

    return service;

  }

  updateChacked() {
    this.checkOptionsOne = [
      { label: 'Cheque Book', checked: this.serviceInfo.CHEQUE_BOOK ? true : false, value: 'CHEQUE_BOOK' },
      { label: 'Passbook', checked: this.serviceInfo.PASS_BOOK ? true : false, value: 'PASS_BOOK' },
      { label: 'Statement By Email', checked: this.serviceInfo.STATEMENT_BY_EMAIL ? true : false, value: 'STATEMENT_BY_EMAIL' },
      { label: 'SMS Alerts', checked: this.serviceInfo.SMS_ALERT ? true : false, value: 'SMS_ALERT' },
      { label: 'Debit Cum ATM Card', checked: this.serviceInfo.ATM_CARD ? true : false, value: 'ATM_CARD' },
      { label: 'Consent to communicate new products', checked: this.serviceInfo.CONSENT_NEW_PRODUCT ? true : false, value: 'CONSENT_NEW_PRODUCT' },
      { label: 'Add on  Card', checked: this.serviceInfo.ADDON_CARD ? true : false, value: 'ADDON_CARD' },
      { label: 'UPI', checked: this.serviceInfo.UPI ? true : false, value: 'UPI' },
      { label: 'Mobile Banking', checked: this.serviceInfo.MOBILE_BANKING ? true : false, value: 'MOBILE_BANKING' },

    ]
  }

  getServiceInfo() {
    this.api.getService(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.serviceInfo = res['data'][0];
          this.updateChacked();
          this.changeInOption();
        }
      }
    });
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
    this.changeInOption();
  }

  changeInOption() {
    this.serviceInfo.CHEQUE_BOOK = this.checkOptionsOne[0].checked;
    this.serviceInfo.PASS_BOOK = this.checkOptionsOne[1].checked;
    this.serviceInfo.STATEMENT_BY_EMAIL = this.checkOptionsOne[2].checked;
    this.serviceInfo.SMS_ALERT = this.checkOptionsOne[3].checked;
    this.serviceInfo.ATM_CARD = this.checkOptionsOne[4].checked;
    this.serviceInfo.CONSENT_NEW_PRODUCT = this.checkOptionsOne[5].checked;
    this.serviceInfo.ADDON_CARD = this.checkOptionsOne[6].checked;
    this.serviceInfo.UPI = this.checkOptionsOne[7].checked;
    this.serviceInfo.MOBILE_BANKING = this.checkOptionsOne[8].checked;

    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

}



interface checkInterface {
  label: string;
  checked: boolean;
  value: "CHEQUE_BOOK" |
  "PASS_BOOK" |
  "STATEMENT_BY_EMAIL" |
  "SMS_ALERT" |
  "ATM_CARD" |
  "CONSENT_NEW_PRODUCT" |
  "ADDON_CARD" |
  "UPI" |
  "MOBILE_BANKING"
}
