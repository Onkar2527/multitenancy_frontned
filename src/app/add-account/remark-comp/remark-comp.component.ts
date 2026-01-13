import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ExtraInfo } from 'src/app/models/extra-info';
import { RemarkModel } from 'src/app/models/remark-model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-remark-comp',
  templateUrl: './remark-comp.component.html',
  styleUrls: ['./remark-comp.component.css']
})
export class RemarkCompComponent implements OnInit {

  @Input() APPLICANT_ID!: number;

  @Input() Tabs: ExtraInfo[] = []

  ngOnInit(): void {
    console.log("inside remark component", this.APPLICANT_ID)
    if (this.APPLICANT_ID) {
      this.getRemarkData();
    }
  }

  getTabs() {
    this.api.getTabs(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res.code === 200 && res.data) {
          this.Tabs = res.data;
        }
      }
    })
  }

  TableLoading: boolean = false;
  remark_table_loading: boolean = false;
  show_remark: boolean = true;

  REMARK_DATA: RemarkModel[] = [
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
  ];

  REMARK: string = '';

  getRemarkData() {
    console.log("")
    this.api.getAllRemark(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.REMARK_DATA = res['data'];
        }
      }
    })
  }

  createRemark(data: RemarkModel) {
    this.api.createRemark(data).subscribe({
      next: (res) => {
        if (res['code'] == 200) {

        }
      }
    })
  }

  constructor(private api: ApiService, private message: NzNotificationService) { }

}
