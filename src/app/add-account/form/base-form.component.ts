import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Directive } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { BasicInfo } from 'src/app/models/basicInfo';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { PDFDocument } from 'pdf-lib';
import { PersonalInfo } from 'src/app/models/personal-info';
import { Financial } from 'src/app/models/financial';
import { Property } from 'src/app/models/property';
import { ImageData } from 'src/app/models/image-data';
import { Documents } from 'src/app/models/documents';
const html2pdf = require('html2pdf.js');

async function getArrayBufferFromData(dataUrlOrPath: string): Promise<ArrayBuffer> {
  if (!dataUrlOrPath) {
    throw new Error("Empty image data or path");
  }
  if (dataUrlOrPath.startsWith('data:')) {
    const base64String = dataUrlOrPath.split(',')[1];
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  const res = await fetch(dataUrlOrPath);
  return await res.arrayBuffer();
}

@Directive()
export abstract class BaseFormComponent implements OnInit {
  @Input() APPLICANT_ID!: number;
  @Output() pdfButtonLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  basicInfo: BasicInfo = new BasicInfo();
  depositInfo: TermDeposite = new TermDeposite();
  serviceInfo: Facilities = new Facilities();
  nominationInfo: NomineeDetails = new NomineeDetails();

  ApplicantPersonal: PersonalInfo[] = []
  ApplicantFinancial: Financial[] = []
  ApplicantProperty: Property[] = []
  ApplicantPhoto: ImageData[] = [];
  documentData: Documents[] = [];

  branchData: any;
  makerUserData: any = { NAME: '' };
  checkerUserData: any = { NAME: '' };
  PHOTOS: any[] = [];
  SIGNATURES: any[] = [];

  bankDetails: any = {
    BANK_NAME: '',
    BANK_LOGO_URL: '',
    ID: null
  };

  account_type: any = {
    'A': 'Saving', 'B': 'Janata Deposite', 'C': 'Current Account', 'D': 'Fixed Deposit',
    'E': 'Fixed Deposit (Reinvestment)', 'F': "Recurring Deposit", 'G': "Pigmy Deposit", 'H': "Other"
  };

  religion: any = { "A": "Hindu", "B": "Muslim", "C": "Sikh", "D": "Christian", "E": "Buddist", "F": "Zoroastrian", "G": "Other" };
  caste: any = { "A": "General", "B": "OBC", "C": "SC", "D": "ST", "E": "NT", "F": "VJNT", "G": "Other" };
  education: any = { "S": "10th class", "H": "12th class", "D": "Degree", "G": "Graduate", "P": "Post Graduate", "O": "Other" };
  income: any = { "A": "Upto ₹60000", "B": "₹60001 to ₹120000", "C": "₹120001 to ₹240000", "D": "₹240001 to ₹360000", "E": "₹360001 to ₹600000", "F": "₹600001 to ₹1200000", "G": "₹1200001 to ₹1800000", "H": "Above ₹1800001" };
  residential_status: any = { "A": "Owned", "B": "Rented", "C": "Occupied" };
  relation: any = { 'A': 'Father', 'B': 'Mother', 'C': 'Brother', 'D': 'Sister', 'E': 'Son', 'F': 'Daughter', 'G': 'Husband', 'H': 'Wife', 'I': 'Grand Father', 'J': 'Grand Mother', 'K': 'Aunty', 'L': 'Cousin', 'M': 'Daughter in law', 'N': 'Father in law', 'O': 'Friend', 'P': 'Grand Daughter', 'Q': 'Grand Son', 'R': 'Mother in law', 'S': 'Nephew', 'T': 'Uncle', 'U': 'Other' };
  account_operation: any = { "A": "Individual", "B": "Joint", "C": "Either or Survivor", "D": "Formar of Survivor", "E": "Any One", "F": "Any Two" };
  interest_payout: any = { "M": "Monthly", "Q": "Quarterly", "H": "Half Yearly", "Y": "Yearly", "O": "On Maturity" };
  work: any = { "E": "Employee", "S": "Self Employeed", "B": "Business", "R": "Retired", "T": "Student", "H": "House Wife", "O": "Other" };
  employee: any = { "P": "Public Company", "E": "Private Company", "C": "Centeral/State Goverment", "M": "Multi-Purpose Company", "J": "Private Job", "O": "Other", " ": "None" };
  proprieter: any = { "C": "CA", "D": "Doctor", "A": "Advisor", "T": "Trader", "E": "Engineer", "V": "Advocate", "S": "Software", "O": "Other", " ": "None" };
  customer_type: any = { "A": "Mr.", "B": "Mrs.", "C": "Miss.", "D": "Mast.", "E": "Smt.", "F": "M/s.", "G": "Mx." };
  risk_type: any = { "A": "High Risk 1", "B": "Medium Risk 2", "C": "Low Risk 3" };
  gender: any = { 'M': "Male", 'F': "Female", 'T': "Transgender" };
  profession: any = { 'A': 'Employee', 'B': 'Self Employeed', 'C': 'Business', 'D': 'Retired', 'E': 'Student', 'F': 'House Wife', 'G': 'Other', ' ': ' ' };
  nature_of_service: any = { 'A': 'Central/State Government', 'B': 'Private Company', ' ': ' ' };
  self_employed: any = { 'A': 'CA', 'B': 'Doctor', 'C': 'Advisor', 'D': 'Trader', 'E': 'Engineer', 'F': 'Advocate', 'G': 'Software', 'H': 'Other', ' ': ' ' };
  nature_of_business: any = { 'A': 'Agriculture', 'B': 'Trader', 'C': 'Manufacture', 'D': 'Retailer', 'E': 'Wholesaler', 'F': 'Businessman', ' ': ' ' };
  source_of_fund: any = { 'A': 'Business income', 'B': 'Commission Income', 'C': 'Salary Income', 'D': 'Rent Income', 'E': 'Agri Income', 'F': 'Pension Income', 'G': 'Family Income', ' ': 'None' };
  consent_options: any = { "A": "Yes", "B": "No", "C": "Not Applicable" };

  MASTERS = [
    { id: 2, data: <any>[], name: "title", valueField: "", lableField: "" },
    { id: 3, data: <any>[], name: "occupation", valueField: "OCCUPATIONID", lableField: "OCCUPATIONDESC" },
    { id: 4, data: <any>[], name: "address proof", valueField: "ADDPROOFID", lableField: "ADDPROOFDESC" },
    { id: 5, data: <any>[], name: "id proof", valueField: "IDTPROOFID", lableField: "IDTPROOFDESC" },
    { id: 6, data: <any>[], name: "risk category", valueField: "CAT_CODE", lableField: "CAT_DESC" },
    { id: 13, data: <any>[], name: "state", valueField: "ID", lableField: "STATEDESC" },
    { id: 14, data: <any>[], name: "district", valueField: "ID", lableField: "DISTRICTDESC" },
    { id: 15, data: <any>[], name: "taluka", valueField: "ID", lableField: "TALUKADESC" },
    { id: 16, data: <any>[], name: "city", valueField: "ID", lableField: "CITYDESC" },
    { id: 17, data: <any>[], name: "area", valueField: "ID", lableField: "AREADESC" },
    { id: 18, data: <any>[], name: "scheme", valueField: "", lableField: "" },
    { id: 19, data: <any>[], name: "constitution", valueField: "OWP_CODE", lableField: "OWP_DESC" },
    { id: 21, data: <any>[], name: "operation", valueField: "OPRINSTID", lableField: "OPRINSTDTLS" },
    { id: 22, data: <any>[], name: "payment instruction", valueField: "PAYINSTID", lableField: "PAYINSTDTLS" },
    { id: 8, data: <any>[], name: "religion", valueField: "REL_CD", lableField: "REL_DESC" },
    { id: 9, data: <any>[], name: "caste", valueField: "CST_CD", lableField: "CST_NM" },
  ];

  formSpinning: boolean = false;
  applicantPersonalMasterData: any = {
    occupation: "", address_proof: "", risk_cat: "", permanent_state: "", permanent_area: "", permanent_dist: "",
    permanent_taluka: "", permanent_city: "", current_state: "", current_area: "", current_dist: "", current_taluka: "",
    current_city: "", operation: "", religion: "", caste: ""
  };

  imageUrl = '../assets/KKSB_LOGO.GIF';
  base64Image: string = '';
  pdfLoading: boolean = false;
  // C:\Users\defaultuser0\Kumbhi_Kasari\Frontend_Kumbhi\src\assets\KKSB_LOGO.GIF
  constructor(protected api: ApiService) { }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getAllData();
      this.fetchBankDetails();
    }
  }

  fetchBankDetails() {
    this.convertImageUrlToBase64();
    this.api.getBankDetails().subscribe({
      next: (res) => {
        if (res.code === 200 && res.data) {
          this.bankDetails = res.data;
          if (this.bankDetails.BANK_LOGO_URL) {
            this.imageUrl = this.bankDetails.BANK_LOGO_URL;
            this.convertImageUrlToBase64();
          }
        }
      }
    });
  }

  convertImageUrlToBase64() {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = this.imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        this.base64Image = canvas.toDataURL('image/png');
      }
    };
  }

  async getMasters() {
    this.formSpinning = true;
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));
      if (result['code'] == 200 && result["data"].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }
    this.formSpinning = false;
    this.mapMasters();
    this.casteReflection();
  }

  casteReflection() {
    let res = this.MASTERS[15].data.filter((value: any) => { return value["CST_CD"] == this.ApplicantPersonal[0]?.CASTE && value["CST_RELGCD"] == this.ApplicantPersonal[0]?.RELIGION });
    this.applicantPersonalMasterData["caste"] = res.length > 0 ? res[0]["CST_NM"] : "";
  }

  mapMasters() {
    const p = this.ApplicantPersonal[0];
    if (!p) return;
    this.assignValueFromMaster(this.filterValues(1, p.PROFESSION), "occupation");
    this.assignValueFromMaster(this.filterValues(5, Number(p.PERMANENT_STATE)), "permanent_state");
    this.assignValueFromMaster(this.filterValues(9, Number(p.PERMANENT_AREA)), "permanent_area");
    this.assignValueFromMaster(this.filterValues(6, Number(p.PERMANENT_DISTRICT)), "permanent_dist");
    this.assignValueFromMaster(this.filterValues(7, Number(p.PERMANENT_TALUKA)), "permanent_taluka");
    this.assignValueFromMaster(this.filterValues(8, Number(p.PERMANENT_CITY)), "permanent_city");
    this.assignValueFromMaster(this.filterValues(5, Number(p.CURRENT_STATE)), "current_state");
    this.assignValueFromMaster(this.filterValues(9, Number(p.CURRENT_AREA)), "current_area");
    this.assignValueFromMaster(this.filterValues(6, Number(p.CURRENT_DISTRICT)), "current_dist");
    this.assignValueFromMaster(this.filterValues(7, Number(p.CURRENT_TALUKA)), "current_taluka");
    this.assignValueFromMaster(this.filterValues(8, Number(p.CURRENT_CITY)), "current_city");
    this.assignValueFromMaster(this.filterValues(2, p.PERMANENT_ADDRESS_PROOF), "address_proof");
    let riskCat = this.filterValues(4, p.RISK_CATEGORY);
    if (!riskCat) {
      if (p.RISK_CATEGORY === 'A') riskCat = 'High';
      else if (p.RISK_CATEGORY === 'B') riskCat = 'Medium';
      else if (p.RISK_CATEGORY === 'C') riskCat = 'Low';
    }
    this.assignValueFromMaster(riskCat, "risk_cat");
    this.assignValueFromMaster(this.filterValues(12, this.depositInfo.ACCOUNT_OPERATION), "operation");
    this.assignValueFromMaster(this.filterValues(14, p.RELIGION), "religion");
  }

  assignValueFromMaster(res: any, label: string) {
    this.applicantPersonalMasterData[label] = res || '';
  }

  filterValues(index: any, pro_value: any) {
    let res = this.MASTERS[index].data.filter((value: any) => { return value[this.MASTERS[index].valueField] == pro_value });
    return res.length > 0 ? res[0][this.MASTERS[index].lableField] : "";
  }

  getCleanDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.replace(/\//g, '').replace(/-/g, '');
  }

  async getAllData() {
    this.getPersonal().subscribe();
    await lastValueFrom(this.getDeposit());
    await lastValueFrom(this.getApplicantPersonal());
    this.getMasters();
    this.getNominee().subscribe();
    this.getService().subscribe();
    this.getApplicantFinancial().subscribe();
    this.getApplicantProperty().subscribe();
    this.getApplicantPhoto().subscribe();
    this.getDocuments().subscribe();
  }

  getPersonal() {
    let personal: Subject<any> = new Subject();
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.basicInfo = res['data'][0];
          this.getBranchData();
          this.getUserMaker();
          this.getUserChecker();
          personal.next(200);
        } else personal.next(res);
      },
      error: (err) => personal.error(err),
      complete: () => personal.complete()
    });
    return personal;
  }

  getDeposit() {
    let deposit: Subject<any> = new Subject();
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.depositInfo = res['data'][0];
          this.changeCatagory();
          deposit.next(200);
        } else deposit.next(res);
      },
      error: (err) => deposit.error(err),
      complete: () => deposit.complete()
    });
    return deposit;
  }

  catagoryA = false; catagoryB = false;
  changeCatagory() {
    this.catagoryA = (['A', 'B', 'G', 'C', 'H'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;
    this.catagoryB = (['D', 'E', 'F'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;
  }

  getService() {
    let service: Subject<any> = new Subject();
    this.api.getService(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.serviceInfo = res['data'][0];
          service.next(200);
        } else service.next(res);
      },
      error: (err) => service.error(err),
      complete: () => service.complete()
    });
    return service;
  }

  getNominee() {
    let nominee: Subject<any> = new Subject();
    this.api.getNominee(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.nominationInfo = res['data'][0];
          nominee.next(200);
        } else nominee.next(res);
      },
      error: (err) => nominee.error(err),
      complete: () => nominee.complete()
    });
    return nominee;
  }

  getApplicantPersonal() {
    let applicantPersonal: Subject<any> = new Subject();
    this.api.getAllAplicant(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.ApplicantPersonal = res['data'];
          if (this.ApplicantPersonal.length < 2) this.ApplicantPersonal.push(new PersonalInfo());
          this.getOVD();
          applicantPersonal.next(200);
        } else applicantPersonal.next(res);
      },
      error: (err) => applicantPersonal.error(err),
      complete: () => applicantPersonal.complete()
    });
    return applicantPersonal;
  }

  getApplicantFinancial() {
    let s: Subject<any> = new Subject();
    this.api.getAllFinancial(this.APPLICANT_ID).subscribe({
      next: (res) => { if (res['code'] == 200) { this.ApplicantFinancial = res['data']; s.next(200); } else s.next(res); },
      error: (err) => s.error(err), complete: () => s.complete()
    });
    return s;
  }

  getApplicantProperty() {
    let s: Subject<any> = new Subject();
    this.api.getAllProperty(this.APPLICANT_ID).subscribe({
      next: (res) => { if (res['code'] == 200) { this.ApplicantProperty = res['data']; s.next(200); } else s.next(res); },
      error: (err) => s.error(err), complete: () => s.complete()
    });
    return s;
  }

  getApplicantPhoto() {
    let s: Subject<any> = new Subject();
    this.api.getAllApplicantPhoto(this.APPLICANT_ID).subscribe({
      next: (res) => { if (res['code'] == 200) { this.ApplicantPhoto = res['data']; s.next(200); } else s.next(res); },
      error: (err) => s.error(err), complete: () => s.complete()
    });
    return s;
  }

  getDocuments() {
    let s: Subject<any> = new Subject();
    this.api.getDocument(this.APPLICANT_ID, null).subscribe({
      next: (res) => {
        if (200 == res.code) {
          this.documentData = res.data;
          this.PHOTOS = this.documentData.filter(d => d.DOCUMENT_NAME == 'Applicant Photo').map(d => d.IMAGE_DATA);
          this.SIGNATURES = this.documentData.filter(d => d.DOCUMENT_NAME == 'Sign' || d.DOCUMENT_NAME == 'Signature').map(d => d.IMAGE_DATA);
          s.next(200);
        } else s.next(res);
      },
      error: err => s.error(err), complete: () => s.complete()
    });
    return s;
  }

  getBranchData() { this.api.getUserBranch(Number(this.basicInfo.CREATED_BRANCH_ID)).subscribe(res => { if (res.code == 200) this.branchData = res.data[0]; }); }
  getUserMaker() { this.api.getUser({ user_id: this.basicInfo.MAKER_USER_ID }).subscribe(res => { if (res.code == 200) this.makerUserData = res.data[0]; }); }
  getUserChecker() { if (this.basicInfo.CHACKER_USER_ID) this.api.getUser({ user_id: this.basicInfo.CHACKER_USER_ID }).subscribe(res => { if (res.code == 200) this.checkerUserData = res.data[0]; }); }

  // async generatePDF() {
  //   this.pdfLoading = true;
  //   this.pdfButtonLoading.emit(true);
  //   const mergedPdfDoc = await PDFDocument.create();
  //   let pngArray = this.documentData.filter(Pn => "image/png" == Pn.FILE_TYPE);
  //   let jpegArray = this.documentData.filter(Pn => ("image/jpeg" == Pn.FILE_TYPE || "image/jpg" == Pn.FILE_TYPE) && Pn.DOCUMENT_NAME != 'Applicant Photo');
  //   let pdfArray = this.documentData.filter(Pn => "application/pdf" == Pn.FILE_TYPE && Pn.DOCUMENT_NAME != 'Applicant Photo');

  //   let totalImageArrayLength = pngArray.length + jpegArray.length;
  //   let embededImageRef = [];

  //   for (let Pn of pngArray) {
  //     const imgData = await fetch(Pn.IMAGE_DATA);
  //     const buffer = await imgData.arrayBuffer();
  //     embededImageRef.push(await mergedPdfDoc.embedPng(buffer));
  //   }
  //   for (let Pn of jpegArray) {
  //     const imgData = await fetch(Pn.IMAGE_DATA);
  //     const buffer = await imgData.arrayBuffer();
  //     embededImageRef.push(await mergedPdfDoc.embedJpg(buffer));
  //   }

  //   let imagePagesCount = Math.ceil(totalImageArrayLength / 6);
  //   for (let i = 0; i < imagePagesCount; i++) {
  //     let page = mergedPdfDoc.addPage();
  //     let imageWidth = Math.trunc(page.getWidth() / 2) - 15;
  //     let imageHeight = Math.trunc(page.getHeight() / 3) - 13;
  //     for (let j = 0; j < 6; j++) {
  //       let idx = i * 6 + j;
  //       if (embededImageRef[idx]) {
  //         let x = (j % 2 == 0) ? 10 : Math.trunc(page.getWidth() / 2) + 5;
  //         let y = (j < 2) ? (2 * (Math.trunc(page.getHeight() / 3))) + 5 : (j < 4) ? Math.trunc(page.getHeight() / 3) + 7 : 10;
  //         page.drawImage(embededImageRef[idx], { x, y, width: imageWidth, height: imageHeight });
  //       }
  //     }
  //   }

  //   let pdfDoc = await PDFDocument.create();
  //   for (let Pn of pdfArray) {
  //     const data = await fetch(Pn.IMAGE_DATA);
  //     const buffer = await data.arrayBuffer();
  //     const doc = await PDFDocument.load(buffer);
  //     (await pdfDoc.copyPages(doc, doc.getPageIndices())).forEach(p => pdfDoc.addPage(p));
  //   }

  //   let options = {
  //     margin: 0.1,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 3, scrollX: 0, windowWidth: 740, useCORS: true },
  //     pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  //     jsPDF: { unit: "in", format: "legal", orientation: "portrait" }
  //   };
  //   let formHtmlRef = document.getElementById("contentToConvert");
  //   let formPdfData = "";
  //   await html2pdf().from(formHtmlRef).set(options).outputPdf().then((Pn: any) => formPdfData = btoa(Pn));

  //   let ir = await PDFDocument.load("data:application/pdf;base64," + formPdfData);
  //   let finalDoc = await PDFDocument.create();
  //   (await finalDoc.copyPages(ir, ir.getPageIndices())).forEach(p => finalDoc.addPage(p));
  //   (await finalDoc.copyPages(mergedPdfDoc, mergedPdfDoc.getPageIndices())).forEach(p => finalDoc.addPage(p));
  //   (await finalDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())).forEach(p => finalDoc.addPage(p));

  //   let allMergedPDF = await finalDoc.save();
  //   let blob = new Blob([allMergedPDF], { type: "application/pdf" });
  //   let url = URL.createObjectURL(blob);
  async generatePDF() {
    this.pdfLoading = true;
    this.pdfButtonLoading.emit(true);

    try {
      // १. आधी तपासूया की HTML एलिमेंट खरोखर उपलब्ध आहे का
      let formHtmlRef = document.getElementById("contentToConvert");
      if (!formHtmlRef) {
        console.error("Error: ID 'contentToConvert' असलेला HTML एलिमेंट सापडला नाही! कृपया HTML मधील ID तपासा.");
        return; // एलिमेंट नसेल तर कोड इथेच थांबेल आणि एरर येणार नाही
      }

      const mergedPdfDoc = await PDFDocument.create();
      let pngArray = this.documentData.filter(Pn => Pn.IMAGE_DATA && "image/png" == Pn.FILE_TYPE && Pn.DOCUMENT_NAME != 'Applicant Photo' && Pn.DOCUMENT_NAME != 'Signature' && Pn.DOCUMENT_NAME != 'Sign');
      let jpegArray = this.documentData.filter(Pn => Pn.IMAGE_DATA && ("image/jpeg" == Pn.FILE_TYPE || "image/jpg" == Pn.FILE_TYPE) && Pn.DOCUMENT_NAME != 'Applicant Photo' && Pn.DOCUMENT_NAME != 'Signature' && Pn.DOCUMENT_NAME != 'Sign');
      let pdfArray = this.documentData.filter(Pn => Pn.IMAGE_DATA && "application/pdf" == Pn.FILE_TYPE && Pn.DOCUMENT_NAME != 'Applicant Photo' && Pn.DOCUMENT_NAME != 'Signature' && Pn.DOCUMENT_NAME != 'Sign');

      let totalImageArrayLength = pngArray.length + jpegArray.length;
      let embededImageRef = [];

      for (let Pn of pngArray) {
        try {
          const buffer = await getArrayBufferFromData(Pn.IMAGE_DATA);
          embededImageRef.push(await mergedPdfDoc.embedPng(buffer));
        } catch (e) {
          console.warn("Failed to embed as PNG, attempting JPG fallback:", e);
          try {
            const buffer = await getArrayBufferFromData(Pn.IMAGE_DATA);
            embededImageRef.push(await mergedPdfDoc.embedJpg(buffer));
          } catch (err) {
            console.error("Failed to embed image completely:", err);
          }
        }
      }
      for (let Pn of jpegArray) {
        try {
          const buffer = await getArrayBufferFromData(Pn.IMAGE_DATA);
          embededImageRef.push(await mergedPdfDoc.embedJpg(buffer));
        } catch (e) {
          console.warn("Failed to embed as JPG, attempting PNG fallback:", e);
          try {
            const buffer = await getArrayBufferFromData(Pn.IMAGE_DATA);
            embededImageRef.push(await mergedPdfDoc.embedPng(buffer));
          } catch (err) {
            console.error("Failed to embed image completely:", err);
          }
        }
      }

      let imagePagesCount = Math.ceil(totalImageArrayLength / 6);
      for (let i = 0; i < imagePagesCount; i++) {
        let page = mergedPdfDoc.addPage();
        let imageWidth = Math.trunc(page.getWidth() / 2) - 15;
        let imageHeight = Math.trunc(page.getHeight() / 3) - 13;
        for (let j = 0; j < 6; j++) {
          let idx = i * 6 + j;
          if (embededImageRef[idx]) {
            let x = (j % 2 == 0) ? 10 : Math.trunc(page.getWidth() / 2) + 5;
            let y = (j < 2) ? (2 * (Math.trunc(page.getHeight() / 3))) + 5 : (j < 4) ? Math.trunc(page.getHeight() / 3) + 7 : 10;
            page.drawImage(embededImageRef[idx], { x, y, width: imageWidth, height: imageHeight });
          }
        }
      }

      let pdfDoc = await PDFDocument.create();
      for (let Pn of pdfArray) {
        try {
          const buffer = await getArrayBufferFromData(Pn.IMAGE_DATA);
          const doc = await PDFDocument.load(buffer);
          (await pdfDoc.copyPages(doc, doc.getPageIndices())).forEach(p => pdfDoc.addPage(p));
        } catch (e) {
          console.error("Failed to load PDF document:", e);
        }
      }

      let options = {
        margin: 0.1,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, scrollX: 0, windowWidth: 740, useCORS: true },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.ant-row', '[nz-row]', 'tr'] },
        jsPDF: { unit: "in", format: "legal", orientation: "portrait" }
      };

      let formPdfData = "";
      // इथे आता सुरक्षितपणे formHtmlRef पास होईल
      await html2pdf().from(formHtmlRef).set(options).outputPdf().then((Pn: any) => formPdfData = btoa(Pn));

      let ir = await PDFDocument.load("data:application/pdf;base64," + formPdfData);
      let finalDoc = await PDFDocument.create();
      (await finalDoc.copyPages(ir, ir.getPageIndices())).forEach(p => finalDoc.addPage(p));
      if (mergedPdfDoc.getPages().length > 0) {
        (await finalDoc.copyPages(mergedPdfDoc, mergedPdfDoc.getPageIndices())).forEach(p => finalDoc.addPage(p));
      }
      if (pdfDoc.getPages().length > 0) {
        (await finalDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())).forEach(p => finalDoc.addPage(p));
      }

      const pdfBase64 = await finalDoc.saveAsBase64({ dataUri: true });
      let a = document.createElement("a");
      a.href = pdfBase64;
      a.download = `${this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME || 'Form'} ${this.basicInfo.PRIMARY_APPLICANT_LAST_NAME || ''}.pdf`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);

    } catch (globalError) {
      console.error("Error generating PDF:", globalError);
      alert("PDF download failed: " + (globalError as Error).message);
    } finally {
      this.pdfLoading = false;
      this.pdfButtonLoading.emit(false);
    }
  }

  getOVD() {
    let docs = [{ KEY: 'AADHAAR_NUMBER', NAME: 'Aadhaar' }, { KEY: 'DRIVING_LICENSE_NO', NAME: 'Driving License' }, { KEY: 'VOTER_ID', NAME: 'Voter ID' }, { KEY: 'PASSPORT', NAME: 'Passport' }];
    for (let applicant of this.ApplicantPersonal) {
      let app = applicant as any;
      for (let doc of docs) {
        if (app[doc.KEY]) {
          app['OVD_DOC'] = doc.NAME;
          app['OVD_DOC_NO'] = String(app[doc.KEY]);
          break;
        }
      }
    }
  }

  getMasterLabel(masterIndex: number, value: any): string {
    const m = this.MASTERS[masterIndex];
    if (!m?.data?.length) return '';
    const res = m.data.find((item: any) => item[m.valueField] == value);
    return res ? res[m.lableField] : '';
  }

  save() { this.generatePDF(); }
}
