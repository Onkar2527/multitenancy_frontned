import { Component, ViewEncapsulation } from '@angular/core';
import { BaseFormComponent } from '../../base-form.component';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-kumbhi-form',
  templateUrl: './kumbhi-form.component.html',
  styleUrls: ['./kumbhi-form.component.css', '../../form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KumbhiFormComponent extends BaseFormComponent {
  override pdfFormat = 'a4';

  constructor(api: ApiService) {
    super(api);
  }

  showVernacular(): boolean {
    return this.ApplicantPersonal && this.ApplicantPersonal.length > 0 &&
      (this.ApplicantPersonal[0]?.IS_VERNACULAR ||
      (this.ApplicantPersonal.length >= 2 && this.ApplicantPersonal[1]?.IS_VERNACULAR));
  }

  showDobMismatch(): boolean {
    return this.ApplicantPersonal && this.ApplicantPersonal.length > 0 &&
      (this.ApplicantPersonal[0]?.IS_DOB_MISMATCH ||
      (this.ApplicantPersonal.length >= 2 && this.ApplicantPersonal[1]?.IS_DOB_MISMATCH));
  }

  getTotalPages(): number {
    let total = 4;
    if (this.showVernacular()) total++;
    if (this.showDobMismatch()) total++;
    return total;
  }

  getDobMismatchPageNum(): number {
    return this.showVernacular() ? 6 : 5;
  }
}
