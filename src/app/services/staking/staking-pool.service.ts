import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '@solana/web3.js';
import { Observable } from 'rxjs';
import constants from 'src/app/constants/constants';
import { environment } from 'src/environments/environment';
import CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

// sub-staking-transaction
// stakeListing
// stake-info
// staking-transaction

@Injectable({
  providedIn: 'root',
})
export class StakingPoolService {
  API_END_POINT: any = constants.DOMAIN_URL;
  IP_API_KEY: string = 'https://api.ipify.org?format=json';
  program: any;
  secretKey: any = environment.KEY;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  _getPoolData(): Observable<any> {
    return this.http.get(`${this.API_END_POINT}getPoolData`);
  }

  _postSignedVerified(payload: any): Observable<any> {
    return this.http.post(`${this.API_END_POINT}signVerify`, payload);
  }

  _postStakePoolId(payload: any): Observable<any> {
    return this.http.post(`${this.API_END_POINT}stake-info`, payload);
  }

  _getUserStakeList(payload: any, body: any) {
    return this.http.post(
      `${this.API_END_POINT}stakeListing?page=${payload.page}&limit=${payload.limit}`,
      body,
    );
  }

  _postStakeToDB(payload: any): Observable<any> {
    return this.http.post(`${this.API_END_POINT}staking-transaction`, payload);
  }

  _getIPAddress(): Observable<any> {
    return this.http.get(this.IP_API_KEY);
  }

  sub_stack_id: any;
  updateId: any;

  _postClaimStakeDeStake(
    data: any,
    method: string,
    stakeType: string,
    tokenVaultAccount: any,
    ASSOCIATED_TOKEN_PROGRAM_ID: any,
    TOKEN_PROGRAM_ID: any,
    systemProgram: any
  ) {
    console.log('Data Claim', data);
    console.log('Create Type', method);

    const form_data: any = {
      _id: data._id,
      signer: data.signer,
      stakeInfoAccount: data.stakeInfoAccount,
      stakeAccount: data.stakeAccount,
      poolInfo: data.poolInfo,
      userTokenAccount: data.userTokenAccount,
      mint: data.mint,
      tokenVaultAccount: tokenVaultAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: systemProgram,
      type: stakeType,
    };

    if (method === 'updated') {
      data.sub_stack_id = this.sub_stack_id;
      data._id = this.updateId;
    }

    const jsonString = JSON.stringify(form_data);

    const encryptedData = CryptoJS.AES.encrypt(
      jsonString,
      this.secretKey
    ).toString();

    const payload = {
      payload: encryptedData,
    };

    let url = this.API_END_POINT + 'sub-staking-transaction';

    this.http.post(url, payload).subscribe(
      (res: any) => {
        console.log(res);
        this.sub_stack_id = res.sub_stack_id;
        this.updateId = res._id;
        this.toastr.success(res.message);
      },
      (err) => {
        console.log(err);
        this.toastr.success(err.error.message);
      }
    );
  }
}
