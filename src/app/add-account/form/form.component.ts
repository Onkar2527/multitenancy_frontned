import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { AjaraFormComponent } from './banks/ajara-form/ajara-form.component';
import { DadaFormComponent } from './banks/dada-form/dada-form.component';
import { KumbhiFormComponent } from './banks/kumbhi-form/kumbhi-form.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() APPLICANT_ID!: number;
  @Output() pdfButtonLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(AjaraFormComponent) ajaraForm!: AjaraFormComponent;
  @ViewChild(DadaFormComponent) dadaForm!: DadaFormComponent;
  @ViewChild(KumbhiFormComponent) kumbhiForm!: KumbhiFormComponent;

  bankDetails: any = {
    ID: null,
    BANK_NAME: ''
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.fetchBankDetails();
    }
  }

  fetchBankDetails() {
    this.api.getBankDetails().subscribe({
      next: (res) => {
        if (res.code === 200 && res.data) {
          this.bankDetails = res.data;
        }
      }
    });
  }

  handlePdfLoading(status: boolean) {
    this.pdfButtonLoading.emit(status);
  }

  save() {
    if (this.bankDetails.ID === 1 && this.ajaraForm) {
      this.ajaraForm.save();
    } else if (this.bankDetails.ID === 2 && this.kumbhiForm) {
      this.kumbhiForm.save();
    } else if (this.bankDetails.ID === 3 && this.dadaForm) {
      this.dadaForm.save();
    } else {
      console.warn("No active bank form found to save.");
    }
  }
}
