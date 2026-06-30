import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AadhaarMeta } from '../models/aadhaar';
import { PanMeta } from '../models/pan-meta';
import { Observable, throwError } from 'rxjs';
import { switchMap, timeout, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OvdService {

  constructor(private httpClient: HttpClient) { }
  
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders
  };
  
  // genAadhaarOtpUrl = "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp";
  // getAadhaarDataUrl = "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp ";
  verifyPanUrl = "https://kyc-api.aadhaarkyc.io/api/v1/pan/pan";

  private signInUrl =
    'https://lvf.listspl.com:1355/ListValidationFramework/api/auth/signIn';

  genAadhaarOtpUrl =
    'https://lvf.listspl.com:1355/ListValidationFramework/validator/aadhaar_sendotp';
  getAadhaarDataUrl =
    'https://lvf.listspl.com:1355/ListValidationFramework/validator/aadhaar_verifyotp';

  generateToken(): Observable<any> {
    const req = {
      userName: 'Kredpooluser',
      password: 'Kred@123',
    };

    return this.httpClient.post(this.signInUrl, req);
  }

  // Aadhaar_GetOTP(data: AadhaarMeta): Observable<any> {
  //   const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNTY5MjMyNiwianRpIjoiNzcxMzZmYWEtYzM2MC00MDY5LWIzZGUtODMyNWVmZmYwZWEwIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsIm5iZiI6MTcxNTY5MjMyNiwiZXhwIjoyMDMxMDUyMzI2LCJlbWFpbCI6InVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.7Mz0n2rBsMQUpu0m6-AYn7ZaSrUkiprnhANo3678wIc';
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  //   this.options = {
  //     headers: this.httpHeaders
  //   };
  //   return this.httpClient.post<any>(this.genAadhaarOtpUrl, JSON.stringify(data), this.options);
  // }


  /** -----------------------------------------
   * Aadhaar_GetData
   * ----------------------------------------- */
  Aadhaar_GetData(data: AadhaarMeta): Observable<any> {
    return this.generateToken().pipe(
      switchMap((result: any) => {
        const token = result.token;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          bankName: 'Kredpool Solutions Pvt Ltd',
          branchName: 'HEAD Office',
          userName: 'KredpoolUser',
          callerSystem: 'SysKred',
        });

        return this.httpClient.post(this.getAadhaarDataUrl, data, { headers }).pipe(
          timeout(this.REQUEST_TIMEOUT),
          retry(1),
          catchError(this.handleError.bind(this))
        );
      })
    );
  }

  /** -----------------------------------------
   * Aadhaar_GetOTP
   * ----------------------------------------- */
  Aadhaar_GetOTP(data: AadhaarMeta): Observable<any> {
    return this.generateToken().pipe(
      switchMap((result: any) => {
        const token = result.token;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          bankName: 'Kredpool Solutions Pvt Ltd',
          branchName: 'HEAD Office',
          userName: 'KredpoolUser',
          callerSystem: 'SysKred',
        });

        return this.httpClient.post(this.genAadhaarOtpUrl, data, { headers }).pipe(
          timeout(this.REQUEST_TIMEOUT),
          retry(1),
          catchError(this.handleError.bind(this))
        );
      })
    );
  }

  Pan_Verify(data: PanMeta): Observable<any> {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNTY5MjMyNiwianRpIjoiNzcxMzZmYWEtYzM2MC00MDY5LWIzZGUtODMyNWVmZmYwZWEwIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsIm5iZiI6MTcxNTY5MjMyNiwiZXhwIjoyMDMxMDUyMzI2LCJlbWFpbCI6InVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.7Mz0n2rBsMQUpu0m6-AYn7ZaSrUkiprnhANo3678wIc';
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.options = {
      headers: this.httpHeaders
    };
    return this.httpClient.post<any>(this.verifyPanUrl, JSON.stringify(data), this.options)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }




  // Aadhaar_GetData(data: AadhaarMeta): Observable<any> {

  //   const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNTY5MjMyNiwianRpIjoiNzcxMzZmYWEtYzM2MC00MDY5LWIzZGUtODMyNWVmZmYwZWEwIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsIm5iZiI6MTcxNTY5MjMyNiwiZXhwIjoyMDMxMDUyMzI2LCJlbWFpbCI6InVzZXJuYW1lXzJ2MHBpZGNhdHlpdTJvcjVmbjV5OG96aG9oc0BzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.7Mz0n2rBsMQUpu0m6-AYn7ZaSrUkiprnhANo3678wIc';

  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  //   this.options = {
  //     headers: this.httpHeaders
  //   };
  //   return this.httpClient.post<any>(this.getAadhaarDataUrl, JSON.stringify(data), this.options);
  // }

  private readonly REQUEST_TIMEOUT = 8000;

  private handleError(error: any) {
    console.error('OvdService error:', error);
    return throwError(() => error);
  }

  
}
