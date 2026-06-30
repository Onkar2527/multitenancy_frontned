import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ExtraInfo } from 'src/app/models/extra-info';
import { ApiService } from 'src/app/service/api.service';
import { CheckerVerificationComponent } from 'src/app/verification/checker-verification/checker-verification.component';
import { VerifierVerificationComponent } from 'src/app/verification/verifier-verification/verifier-verification.component';
import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { DepositComponent } from '../deposit/deposit.component';
import { NominationComponent } from '../nomination/nomination.component';
import { PersonalComponent } from '../personal/personal.component';
import { ServicesComponent } from '../services/services.component';
import { RemarkCompComponent } from '../remark-comp/remark-comp.component';
import { RemarkModel } from 'src/app/models/remark-model';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit, OnDestroy {
  @ViewChild(PersonalComponent) personalComp!: PersonalComponent;
  @ViewChild(DepositComponent) depositeComp!: DepositComponent;
  @ViewChild(ServicesComponent) serviceComp!: ServicesComponent;
  @ViewChild(NominationComponent) nomineeComp!: NominationComponent;
  // @ViewChild(FormComponent) formComp!: FormComponent;
  @ViewChild(ApplicantDetailsComponent) applicantDetail!: ApplicantDetailsComponent;
  // @ViewChild(WebCamComponent) wecamComp!:WebCamComponent;

  @ViewChild(CheckerVerificationComponent) checkerComp!: CheckerVerificationComponent;
  @ViewChild(VerifierVerificationComponent) verifierComp!: VerifierVerificationComponent;

  @ViewChild(RemarkCompComponent) remarkComp!: RemarkCompComponent;


  @Input() BasicInfo: BasicInfo = new BasicInfo();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  @Output() ChangeIndex = new EventEmitter<number>();
  @Output() CloseDrawer = new EventEmitter<void>();
  @Output() AccountCreationStatus = new EventEmitter<boolean>();



  @Input() Tabs: ExtraInfo[] = []

  selectedIndex: number = 0;
  previousIndex: number = -1;

  changeIndex() {
    console.log(this.selectedIndex, "is selected index")
    this.ChangeIndex.emit(this.selectedIndex);
  }

  loadSaveButton: boolean = false;
  loadPreviousButton: boolean = false;
  buttonTitle: string = 'Save & Next'
  APPLICANT_ID!: number;
  log(event: any) {
    if (this.selectedIndex == this.previousIndex) return;
    this.previousIndex = this.selectedIndex;

    if (this.selectedIndex == 4) {
      this.buttonTitle = 'Download Pdf'
    }
    else {
      this.buttonTitle = 'Save & Next'
    }

    if (this.APPLICANT_ID) {
      this.getTabs(this.APPLICANT_ID, false);
    }
  }
  // ngOnInit(): void {
  //   if (this.BasicInfo.ID) {
  //     this.getTabs(this.BasicInfo.ID, this.BasicInfo.TRACK_ID);
  //     this.APPLICANT_ID = this.BasicInfo.ID;
  //   }

  // }
  ngOnInit(): void {
    if (this.BasicInfo?.ID) {
      this.APPLICANT_ID = this.BasicInfo.ID;
      // this.getTabs(this.BasicInfo.ID);
    }
  }

  ngOnDestroy() {

  }

  async completeVerifier() {

    let send_to_refill = false

    for (let tab of this.Tabs) {
      if (tab.SEND_TO_REFILL) {
        send_to_refill = true;
        break;
      }
    }

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (send_to_refill && isOk) {
      this.personalComp.basicInfo.TRACK_ID = 1;
      let personal = this.personalComp.save();
      // this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.saveRemark();
            this.message.success("Proposal has been sent to Refill", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else if (isOk) {
      this.AccountCreationStatus.emit(true);
      let onBoardingResult = await lastValueFrom(this.api.onBoardCustomer(this.personalComp.basicInfo.ID));

      if (onBoardingResult['code'] == 200) {
        this.message.success("customer created. ", `Customer ID = ${onBoardingResult.success_data['Customer Code']}`);
        this.AccountCreationStatus.emit(false);

        this.personalComp.basicInfo.TRACK_ID = 4;
        let personal = this.personalComp.save();
        // this.personalComp.basicInfo.STATUS = 'V'; do not remove comment of this line.
        personal.subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.saveRemark();
              this.message.success("Account has been created", `Account Number = ${onBoardingResult.success_data['Account number']}`)
              this.CloseDrawer.emit();
            }
            else {
              this.message.error("Failed to Create Account", '');
            }
          }, error: () => {
            this.message.error("Failed to Create Account", '');
          },
          complete: () => {

          }
        })

      }

      else {
        this.message.error(
          onBoardingResult.message || "Unable to create account",
          ''
        );
        this.AccountCreationStatus.emit(false);
      }
      // else {
      //   this.message.error("Unable to create account.", '');
      //   this.AccountCreationStatus.emit(false);
      // }


    }

  }

  completeChecker() {
    let send_to_refill = false
    for (let tab of this.Tabs) {
      if (tab.SEND_TO_REFILL) {
        send_to_refill = true;
        break;
      }
    }

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (send_to_refill && isOk) {
      this.personalComp.basicInfo.TRACK_ID = 1;

      let personal = this.personalComp.save();
      // this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.saveRemark();
            this.message.success("Proposal has been sent to Refill", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else if (isOk) {
      this.personalComp.basicInfo.TRACK_ID = 3;
      this.personalComp.basicInfo.VERIFIED_DATE_TIME = new Date().toString();
      this.api.getUser({ role_id: 3 }).subscribe({
        next: (res) => {
          if (res['code'] == 200 && res['data'].length > 0) {
            // this.personalComp.basicInfo.VERIFIER_USER_ID = res.data[0].ID;
            let personal = this.personalComp.save();
            personal.subscribe({
              next: (res) => {
                if (res.code == 200) {
                  this.saveRemark();
                  this.message.success("Proposal has been sent to Verification", '')
                  this.CloseDrawer.emit();
                }
                else {
                  this.message.error("Something went wrong", '');
                }
              }, error: () => {

              },
              complete: () => {

              }
            })
          }
          else {
            this.message.error("Something went wrong", '');
          }
        },
        error: () => {
          this.message.error("Something went wrong", '');
        }
      })

    }
  }


  // getTabs(applicant_id: number, track_id?: number) {
  //   this.api.getTabs(applicant_id, sessionStorage.getItem('ROLE_ID'), track_id).subscribe({
  //     next: (res) => {
  //       if (res['code'] && res['data']) {
  //         this.Tabs = res['data'];
  //         this.reset();
  //       }
  //     }
  //   })
  // }

  getTabs(applicant_id: number, shouldReset: boolean = true) {
    this.api.getTabs(applicant_id).subscribe({
      next: (res) => {
        if (res.code === 200 && res.data) {
          this.Tabs = res.data;
          if (shouldReset) {
            this.reset();
          }
        }
      },
      error: () => {
        this.message.error('Failed to load tabs', '');
      }
    });
  }



  // updateTabsProvided(index: number) {
  //   this.Tabs[index].IS_PROVIDED = true;

  //   this.api.updateTab(this.Tabs[index]).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200) {
  //         this.selectedIndex = index + 1;
  //         this.changeIndex();
  //       }
  //       else {
  //         this.Tabs[index].IS_PROVIDED = false;
  //       }
  //     },
  //     error: () => {
  //       this.Tabs[index].IS_PROVIDED = false;
  //     }
  //   })

  // }

  updateTabsProvided(index: number) {
    this.Tabs[index].IS_PROVIDED = true;

    // 🔐 send only required fields
    const payload = {
      ID: this.Tabs[index].ID,
      IS_PROVIDED: true
    };

    this.api.updateTab(payload).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.selectedIndex = index + 1;
          this.changeIndex();
        } else {
          this.Tabs[index].IS_PROVIDED = false;
        }
      },
      error: () => {
        this.Tabs[index].IS_PROVIDED = false;
      }
    });
    this.moveNextTab();
  }


  nextTab_noaction(index: number) {
    this.selectedIndex = index + 1;
    this.changeIndex();
  }

  checkerDisable: boolean = true;
  verifierDisable: boolean = true;

  // sendToRefill(index: number, remark: string, user: string) {
  //   this.Tabs[index].SEND_TO_REFILL_COUNT++;
  //   this.Tabs[index].SEND_TO_REFILL = true;
  //   this.Tabs[index].REFILL_BY = Number(sessionStorage.getItem('ROLE_ID'));

  //   if (user == 'C') {
  //     this.Tabs[index].IS_CHECKED = false;
  //     this.Tabs[index].CHECKER_REMARK = remark;
  //   }
  //   if (user == 'V') {
  //     this.Tabs[index].IS_VERIFIED = false;
  //     this.Tabs[index].VERIFIER_REMARK = remark;
  //   }


  //   this.api.updateTab(this.Tabs[index]).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200) {

  //         if (this.selectedIndex == 0) {
  //           this.APPLICANT_ID = this.BasicInfo.ID;
  //           this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.depositeComp.getDepositInfo();
  //           this.Tabs[0].disabled = true;
  //           this.Tabs[1].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 1) {
  //           this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.nomineeComp.getNominationInfo();
  //           this.Tabs[1].disabled = true;
  //           this.Tabs[2].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 2) {
  //           this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.serviceComp.getServiceInfo();
  //           this.Tabs[2].disabled = true;
  //           this.Tabs[3].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 3) {
  //           this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
  //           this.applicantDetail.getAllApplicant();
  //           this.applicantDetail.basicInfo = this.BasicInfo;
  //           this.Tabs[3].disabled = true;
  //           this.Tabs[4].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();
  //         }

  //         else if (this.selectedIndex == 4) {
  //           this.Tabs[4].disabled = true;
  //           this.Tabs[5].disabled = false;
  //           this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
  //           this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
  //           this.remarkComp.show_remark = true;
  //           this.remarkComp.getRemarkData();
  //           this.selectedIndex++;
  //           this.changeIndex();
  //         }

  //       }
  //       else {

  //       }
  //     },
  //     error: () => {

  //     }
  //   });
  // }

  // Accept(index: number, user: string) {
  //   this.Tabs[index].SEND_TO_REFILL = false;

  //   if (user == 'C') {
  //     this.Tabs[index].IS_CHECKED = true;
  //     this.Tabs[index].CHECKER_REMARK = '';
  //   }
  //   if (user == 'V') {
  //     this.Tabs[index].IS_VERIFIED = true;
  //     this.Tabs[index].VERIFIER_REMARK = '';
  //   }


  //   this.api.updateTab(this.Tabs[index]).subscribe({
  //     next: (res) => {
  //       if (res['code'] == 200) {

  //         if (this.selectedIndex == 0) {
  //           this.APPLICANT_ID = this.BasicInfo.ID;
  //           this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.depositeComp.getDepositInfo();
  //           this.Tabs[0].disabled = true;
  //           this.Tabs[1].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 1) {
  //           this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.nomineeComp.getNominationInfo();
  //           this.Tabs[1].disabled = true;
  //           this.Tabs[2].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 2) {
  //           this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.serviceComp.getServiceInfo();
  //           this.Tabs[2].disabled = true;
  //           this.Tabs[3].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();

  //         }

  //         else if (this.selectedIndex == 3) {
  //           this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
  //           this.applicantDetail.getAllApplicant();
  //           this.applicantDetail.basicInfo = this.BasicInfo;
  //           this.Tabs[3].disabled = true;
  //           this.Tabs[4].disabled = false;
  //           this.selectedIndex++;
  //           this.changeIndex();
  //         }

  //         else if (this.selectedIndex == 4) {
  //           this.Tabs[4].disabled = true;
  //           this.Tabs[5].disabled = false;
  //           this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
  //           this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
  //           this.remarkComp.show_remark = true;
  //           this.remarkComp.getRemarkData();
  //           this.selectedIndex++;
  //           this.changeIndex();
  //         }

  //       }
  //       else {

  //       }
  //     },
  //     error: () => {

  //     }
  //   });
  // }

  moveNextTab() {
    this.Tabs[this.selectedIndex].disabled = true;
    this.Tabs[this.selectedIndex + 1].disabled = false;
    this.selectedIndex++;
    this.changeIndex();
  }


  sendToRefill(index: number, remark: string, user: string) {

    const payload: Partial<ExtraInfo> = {
      ID: this.Tabs[index].ID,
      SEND_TO_REFILL: true,
      SEND_TO_REFILL_COUNT: this.Tabs[index].SEND_TO_REFILL_COUNT + 1,
      REFILL_BY: Number(sessionStorage.getItem('ROLE_ID')),
    };

    if (user === 'C') {
      payload.IS_CHECKED = false;
      payload.CHECKER_REMARK = remark;
    }

    if (user === 'V') {
      payload.IS_VERIFIED = false;
      payload.VERIFIER_REMARK = remark;
    }

    this.api.updateTab(payload).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.moveNextTab();
        }
      }
    });
  }

  Accept(index: number, user: string) {

    const payload: Partial<ExtraInfo> = {
      ID: this.Tabs[index].ID,
      SEND_TO_REFILL: false
    };

    if (user === 'C') {
      payload.IS_CHECKED = true;
      payload.CHECKER_REMARK = '';
    }

    if (user === 'V') {
      payload.IS_VERIFIED = true;
      payload.VERIFIER_REMARK = '';
    }

    this.api.updateTab(payload).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.moveNextTab();
        }
      }
    });
  }





  // async saveANext() {
  //   this.loadSaveButton = true;

  //   if (this.selectedIndex == 0) {
  //     let personal = this.personalComp.save();
  //     // this.depositeComp.account_type = this.personalComp.basicInfo.ACCOUNT_TYPE;
  //     // this.serviceComp.AccountType = this.personalComp.basicInfo.ACCOUNT_TYPE;
  //     personal.subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {
  //           this.APPLICANT_ID = this.BasicInfo.ID;
  //           this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;

  //           this.depositeComp.getDepositInfo();
  //           this.Tabs[0].disabled = true;
  //           this.Tabs[1].disabled = false;
  //           this.updateTabsProvided(this.selectedIndex);
  //           this.loadSaveButton = false;
  //         }
  //       }, error: () => {
  //         this.loadSaveButton = false;
  //       },
  //       complete: () => {
  //         this.loadSaveButton = false;
  //       }
  //     })
  //   }
  //   else if (this.selectedIndex == 1) {
  //     this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
  //     let deposite = this.depositeComp.save();
  //     deposite.subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {
  //           this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.nomineeComp.getNominationInfo();
  //           this.Tabs[1].disabled = true;
  //           this.Tabs[2].disabled = false;
  //           this.updateTabsProvided(this.selectedIndex);
  //           this.loadSaveButton = false;
  //         }
  //       },
  //       error: () => {
  //         this.loadSaveButton = false;
  //       },
  //       complete: () => {
  //         this.loadSaveButton = false;
  //       }
  //     })
  //   }
  //   else if (this.selectedIndex == 2) {
  //     this.nomineeComp.nomineeInfo.APPLICANT_ID = this.APPLICANT_ID;
  //     let nominee = this.nomineeComp.save();
  //     nominee.subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {
  //           this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
  //           this.serviceComp.getServiceInfo();
  //           this.Tabs[2].disabled = true;
  //           this.Tabs[3].disabled = false;
  //           this.updateTabsProvided(this.selectedIndex);
  //           this.loadSaveButton = false;
  //         }
  //       }, error: () => {
  //         this.loadSaveButton = false;
  //       },
  //       complete: () => {
  //         this.loadSaveButton = false;
  //       }
  //     })
  //   }

  //   else if (this.selectedIndex == 3) {

  //     this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
  //     let service = this.serviceComp.save();
  //     service.subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {
  //           this.Tabs[3].disabled = true;
  //           this.Tabs[4].disabled = false;
  //           this.updateTabsProvided(this.selectedIndex);
  //           this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
  //           this.applicantDetail.getAllApplicant();
  //           this.applicantDetail.basicInfo = this.BasicInfo;
  //           this.loadSaveButton = false;
  //         }
  //       }, error: () => {
  //         this.loadSaveButton = false;
  //       },
  //       complete: () => {
  //         this.loadSaveButton = false;
  //       }
  //     })
  //   }
  //   else if (this.selectedIndex == 4) {
  //     let res = await lastValueFrom(this.api.getProperty(this.APPLICANT_ID, 1));
  //     if (res['data'].length > 0) {
  //       this.Tabs[4].disabled = true;
  //       this.Tabs[5].disabled = false;
  //       this.updateTabsProvided(this.selectedIndex);
  //       this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
  //       this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
  //       this.remarkComp.show_remark = true;
  //       this.remarkComp.getRemarkData();
  //       this.loadSaveButton = false;
  //     }
  //     else {
  //       this.message.error("Fill all the information", "Personal, Financial and Property")
  //     }
  //   }
  //   else if (this.selectedIndex == 5) {
  //     this.saveAsComplete();
  //     this.loadSaveButton = false;
  //   }

  // }


  async saveANext() {
    this.loadSaveButton = true;

    // TAB 0 → PERSONAL
    if (this.selectedIndex === 0) {
      this.personalComp.save().subscribe({
        next: (res) => {
          if (res.code === 200) {
            if (res.APPLICANT_ID) this.APPLICANT_ID = res.APPLICANT_ID;
            this.updateTabsProvided(0);
          }
          this.loadSaveButton = false;
        },
        error: () => {
          this.loadSaveButton = false;
        }
      });
    }

    // TAB 1 → DEPOSIT
    else if (this.selectedIndex === 1) {
      this.depositeComp.save().subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.updateTabsProvided(1);
          }
          this.loadSaveButton = false;
        },
        error: () => {
          this.loadSaveButton = false;
        }
      });
    }

    // TAB 2 → NOMINEE
    else if (this.selectedIndex === 2) {
      this.nomineeComp.save().subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.updateTabsProvided(2);
          }
          this.loadSaveButton = false;
        },
        error: () => {
          this.loadSaveButton = false;
        }
      });
    }

    // TAB 3 → SERVICES
    else if (this.selectedIndex === 3) {
      this.serviceComp.save().subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.updateTabsProvided(3);
          }
          this.loadSaveButton = false;
        },
        error: () => {
          this.loadSaveButton = false;
        }
      });
    }

    // TAB 4 → APPLICANT DETAILS (FINAL AUDIT)
    else if (this.selectedIndex === 4) {
      try {
        const res = await lastValueFrom(this.api.getProperty(this.APPLICANT_ID, 1));
        if (res['data'] && res['data'].length > 0) {
          this.updateTabsProvided(4);
        } else {
          this.message.error("Incomplete Profile", "Please ensure Personal, Financial and Property details are filled.");
        }
      } catch (err) {
        this.message.error("Error", "Failed to verify applicant details completion.");
      } finally {
        this.loadSaveButton = false;
      }
    }

    // TAB 5 → FINAL REMARK & COMPLETE
    else if (this.selectedIndex === 5) {
      this.saveAsComplete();
      this.loadSaveButton = false;
    }
  }


  previous() {

    this.loadPreviousButton = true;

    if (this.selectedIndex == 5) {
      this.Tabs[5].disabled = true;
      this.Tabs[4].disabled = false;
      this.selectedIndex = 4;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 4) {
      this.Tabs[4].disabled = true;
      this.Tabs[3].disabled = false;
      this.selectedIndex = 3;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 3) {
      this.Tabs[3].disabled = true;
      this.Tabs[2].disabled = false;
      this.selectedIndex = 2;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 2) {
      this.Tabs[2].disabled = true;
      this.Tabs[1].disabled = false;
      this.selectedIndex = 1;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 1) {
      this.Tabs[1].disabled = true;
      this.Tabs[0].disabled = false;
      this.selectedIndex = 0;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 0) {
      this.loadPreviousButton = false;
    }

  }

  saveAsDraft() {
    if (this.selectedIndex == 0) {
      let personal = this.personalComp.save();
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else if (this.selectedIndex == 1) {
      this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
      let deposite = this.depositeComp.save();
      deposite.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        },
        error: () => {

        },
        complete: () => {

        }
      })
    }
    else if (this.selectedIndex == 2) {
      this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
      let nominee = this.nomineeComp.save();
      nominee.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else if (this.selectedIndex == 3) {
      this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
      let service = this.serviceComp.save();
      service.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }
    else if (this.selectedIndex == 4) {

    }

  }

  reset() {

    this.selectedIndex = 0;
    for (let i = 0; i < this.Tabs.length; i++) {
      if (i == 0) {
        this.Tabs[0].disabled = false;
      }
      else {
        this.Tabs[i].disabled = true;
      }

    }

  }

  saveRemark() {
    let _REMARK_: RemarkModel = new RemarkModel();
    _REMARK_.APPLICANT_ID = this.APPLICANT_ID;
    _REMARK_.REMARK_DATE = new Date().toString();
    _REMARK_.USER_ID = Number(sessionStorage.getItem('USER_ID'));
    _REMARK_.REMARK = this.remarkComp.REMARK;

    this.api.getUserRole(Number(sessionStorage.getItem('ROLE_ID'))).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          _REMARK_.ROLE = res['data'][0]['NAME']
          this.api.getUser({ user_id: _REMARK_.USER_ID }).subscribe({
            next: (result) => {
              if (result['code'] == 200 && result['data'].length > 0) {
                _REMARK_.USER_NAME = result['data'][0]['NAME']
                this.remarkComp.createRemark(_REMARK_);
              }
            }
          })

        }
      }
    })

  }

  saveAsComplete() {

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (isOk) {
      this.personalComp.basicInfo.TRACK_ID = 2;
      this.personalComp.basicInfo.FILLED_DATE_TIME = new Date().toString();
      this.api.getUser({ role_id: 2, branch_id: this.personalComp.basicInfo.CREATED_BRANCH_ID }).subscribe({
        next: (res) => {
          if (res.code == 200 && res.data.length > 0) {
            this.personalComp.basicInfo.CHACKER_USER_ID = res.data[0].ID;
            this.saveRemark();
            let personal = this.personalComp.save();
            personal.subscribe({
              next: (res) => {
                if (res.code == 200) {
                  this.message.success("Proposal has been sent to verify", '')
                  this.CloseDrawer.emit();
                }
                else {
                  this.message.error("Something went wrong", '');
                }
              }, error: () => {

              },
              complete: () => {

              }
            })

          }
          else {
            this.message.error("Something went wrong", '');
          }
        },
        error: () => {
          this.message.error("Something went wrong", '');
        }
      })
    }


  }

  next() {
    this.loadSaveButton = true;

    if (this.selectedIndex == 0) {
      this.Tabs[0].disabled = true;
      this.Tabs[1].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;
    }
    else if (this.selectedIndex == 1) {
      this.Tabs[1].disabled = true;
      this.Tabs[2].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;
    }
    else if (this.selectedIndex == 2) {
      this.Tabs[2].disabled = true;
      this.Tabs[3].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;
    }
    else if (this.selectedIndex == 3) {
      this.Tabs[3].disabled = true;
      this.Tabs[4].disabled = false;
      this.applicantDetail.basicInfo = this.BasicInfo;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;
    }
    else if (this.selectedIndex == 4) {
      this.Tabs[4].disabled = true;
      this.Tabs[5].disabled = false;
      this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
      this.remarkComp.show_remark = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;
    }

    else if (this.selectedIndex == 5) {
      this.CloseDrawer.emit();
    }

  }

}
