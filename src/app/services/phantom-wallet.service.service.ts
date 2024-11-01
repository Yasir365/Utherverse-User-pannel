import { Injectable } from '@angular/core';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { ProjectGetService } from './project-get.service';
import * as buffer from 'buffer';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import constants from '../constants/constants';
window.Buffer = buffer.Buffer;

@Injectable({
  providedIn: 'root',
})
export class PhantomWalletServiceService {
  private apiResponseSubject = new BehaviorSubject<boolean>(false);
  public apiResponse$ = this.apiResponseSubject.asObservable();
  private loaderResponseSubject = new BehaviorSubject<boolean>(false);
  public loaderResponse$ = this.loaderResponseSubject.asObservable();
  private connection: Connection;
  public publicKey: PublicKey | null = null;
  private walletAddressSubject: Subject<string> = new Subject<string>();
  private phantom_wall_bal: Subject<string> = new Subject<string>();

  constructor(
    private project_service: ProjectGetService,
    private toaster: ToastrService,
    private http: HttpClient
  ) {
    //previous that we were using
    // this.connection = new Connection('https://solana-mainnet.core.chainstack.com/bf485f0493438a47ed964ec8f5ed7ea8');//old
    // https://mainnet.helius-rpc.com/?api-key=19924b4f-edf7-4dce-ac44-8e08655772a0 //old

    //dev net url
    // Secure: https://ethelda-w3gdom-fast-devnet.helius-rpc.com
    //Regular https://devnet.helius-rpc.com/?api-key=e40977b9-450a-4c0c-9861-880f496b2eb1

    // main net urls
    // Secure RPC URL from Helius : https://kalli-pdczb2-fast-mainnet.helius-rpc.com
    // Regular RPC URL
    // https://mainnet.helius-rpc.com/?api-key=e40977b9-450a-4c0c-9861-880f496b2eb1

    this.connection = new Connection(
      'https://mainnet.helius-rpc.com/?api-key=e40977b9-450a-4c0c-9861-880f496b2eb1'
    );
  }
  user_sol_wallet: any;

  async connect() {
    if (window['solana'] && window['solana'].isPhantom) {
      try {
        let sol_in_string;
        const resp = await window['solana'].connect();
        this.publicKey = new PublicKey(resp.publicKey);
        sol_in_string = this.publicKey.toString();
        this.user_sol_wallet = sol_in_string;
        this.walletAddressSubject.next(this.publicKey.toString());
        sessionStorage.setItem('user_sol_wallet', sol_in_string);
        this.toaster.success('wallet connected successfully');
      } catch (err) {
        console.error('Error connecting to Phantom Wallet', err);
      }
    } else {
      console.warn('Phantom Wallet not found. Please install it.');
      this.toaster.info('Phantom Wallet not found. Please install it.');
    }
  }
  getWalletAddress(): Observable<string> {
    return this.walletAddressSubject.asObservable();
  }
  getUserBal(): Observable<string> {
    return this.phantom_wall_bal.asObservable();
  }

  async getSolBalance() {
    try {
      const balance = await this.connection.getBalance(this.publicKey);
      this.user_sol_wallet_bal = balance / 1e9; // Convert lamports to SOL
      console.log('user sol bal', this.user_sol_wallet_bal);
      this.phantom_wall_bal.next(this.user_sol_wallet_bal);
      return this.user_sol_wallet_bal;
    } catch (error) {
      console.error('Failed to get SOL balance:', error);
      return 0;
      // throw error;
    }
  }
  async checkWalletConnection() {
    if (window['solana'] && window['solana'].isPhantom) {
      try {
        const resp = await window['solana'].connect({ onlyIfTrusted: true });
        this.publicKey = new PublicKey(resp.publicKey.toString());
      } catch (err) {
        console.error('Error checking Phantom Wallet connection', err);
      }
    } else {
      // this.toaster.info("Install Phantom Wallet")
    }
  }

  async transferSPLToken(
    to: string,
    amount: number,
    tokenMintAddress: string,
    body: any
  ) {
    try {
      this.loaderResponseSubject.next(true);
      console.log('checck body in transfer spl token', body);
      if (!this.publicKey) {
        this.toaster.error('Connect YOur Wallet');
        throw new Error('Wallet not connected');
      }
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 40000,
      });
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 10000000,
      });
      const toPublicKey = new PublicKey(to);
      const mintPublicKey = new PublicKey(tokenMintAddress);
      // Get the associated token account of the receiver
      const associatedDestinationTokenAddr =
        await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintPublicKey,
          toPublicKey
        );
      // Get the associated token account of the sender
      const senderTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPublicKey,
        this.publicKey
      );

      // Ensure the receiver's associated token account exists
      const receiverAccount = await this.connection.getAccountInfo(
        associatedDestinationTokenAddr
      );
      const instructions = [];
      if (!receiverAccount) {
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintPublicKey,
            associatedDestinationTokenAddr,
            toPublicKey,
            this.publicKey
          )
        );
      }

      // Create the transfer instruction
      instructions.push(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          senderTokenAccount,
          associatedDestinationTokenAddr,
          this.publicKey,
          [],
          amount
        )
      );

      const transaction = new Transaction()
        .add(modifyComputeUnits)
        .add(addPriorityFee)
        .add(...instructions);
      transaction.feePayer = this.publicKey;
      const { blockhash } = await this.connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      const response = await window['solana']?.signAndSendTransaction(
        transaction
      );
      if (!response?.signature) {
        throw new Error('Failed to retrieve transaction signature');
      }

      let res_of_cnfrm = await this.connection.confirmTransaction(
        response?.signature
      );
      let signature = response?.signature;
      console.log('Transaction successful with signature', signature);
      console.log(
        'Transaction successful with signature res of cnfrm',
        res_of_cnfrm
      );
      const confirmationResult = await this.connection.confirmTransaction(
        signature,
        'finalized'
      );
      console.log(
        'check confirmtransactionResult===========>',
        confirmationResult
      );

      if (confirmationResult.value.err) {
        console.log(
          'ERROR IN CONFIRMTRANSACTION=======>',
          confirmationResult.value.err
        );
        this.toaster.error(
          `Transaction failed: ${confirmationResult.value.err}`
        );
        throw new Error(`Transaction failed: ${confirmationResult.value.err}`);
      }

      const detail_1 = await this.connection.getConfirmedTransaction(signature);
      const transactionDetails = await this.connection.getConfirmedTransaction(
        signature,
        'confirmed'
      );

      console.log('sucessfull transaction check detai 1', detail_1);
      console.log('sucessfull transaction check detai 2', transactionDetails);

      if (signature) {
        (body.transaction_status = 'SUCCESS'),
          (body.transaction_hash = signature),
          this.project_service.updateOrderTransaction(body).subscribe(
            (resp: any) => {
              // this.spinner = false;
              this.toaster.success('Transaction Successful');
              this.apiResponseSubject.next(true);
              this.loaderResponseSubject.next(false);
              // this.thankyou_page_modal.nativeElement.click()
            },
            (error: any) => {
              console.log('error', error);
              // this.spinner = false;
              this.loaderResponseSubject.next(false);
              this.toaster.error('TRANSACTION CANCELED');
            }
          );
      }
      await this.checkWalletConnection();
    } catch (err: any) {
      //some thing went wrong
      console.log('check err in spl token', err);
      this.toaster.error('TRANSACTION CANCELED');
      this.loaderResponseSubject.next(false);
      this.checkWalletConnection();
    }
  }

  async TransferSOL(to: string, amount: number, body: any) {
    //, roundId: any, token_price: any, selected_currency: string | any
    try {
      this.loaderResponseSubject.next(true);
      if (!this.publicKey) {
        this.toaster.error('Connect YOur Wallet');
        throw new Error('Wallet not connected');
      }

      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 5000,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 10000000,
      });
      console.log(
        '🚀 ~ PhantomWalletService ~ TransferSOL ~ publicKey:*-----------------------------',
        this.publicKey
      );
      const fromPubkey = new PublicKey(this.publicKey.toString());

      console.log(
        '🚀 ~ PhantomWalletService ~ TransferSOL ~ publicKey:++++++++++++++++++++++++++',
        this.publicKey
      );

      const toPublicKey = new PublicKey(to);
      const transaction = new Transaction()
        .add(modifyComputeUnits)
        .add(addPriorityFee)
        .add(
          SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: toPublicKey,
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );
      transaction.feePayer = this.publicKey;
      const { blockhash } = await this.connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      const response = await window['solana']?.signAndSendTransaction(
        transaction
      );
      if (!response?.signature) {
        throw new Error('Failed to retrieve transaction signature');
      }

      await this.connection.confirmTransaction(response?.signature);
      let signature = response?.signature;
      const confirmationResult = await this.connection.confirmTransaction(
        signature,
        'finalized'
      );
      console.log('Transaction successful with signature', signature);
      console.log(
        'check confirmtransactionResult===========>',
        confirmationResult
      );

      if (confirmationResult.value.err) {
        console.log(
          'ERROR IN CONFIRMTRANSACTION=======>',
          confirmationResult.value.err
        );
        this.toaster.error(
          `Transaction failed: ${confirmationResult.value.err}`
        );
        throw new Error(`Transaction failed: ${confirmationResult.value.err}`);
      }

      const detail_1 = await this.connection.getConfirmedTransaction(signature);
      const transactionDetails = await this.connection.getConfirmedTransaction(
        signature,
        'confirmed'
      );

      console.log('sucessfull transaction check detai 1', detail_1);
      console.log('sucessfull transaction check detai 2', transactionDetails);

      if (signature) {
        this.loaderResponseSubject.next(false);
        (body.transaction_status = 'SUCCESS'),
          (body.transaction_hash = signature);
        this.project_service.updateOrderTransaction(body).subscribe(
          (resp: any) => {
            // this.spinner = false;
            console.log('resp of updat trxn', resp);
            this.apiResponseSubject.next(true);
            this.toaster.success('Transaction Successful');

            // this.thankyou_page_modal.nativeElement.click()
          },
          (error: any) => {
            // this.spinner = false;
            console.log('error in updateTransaction', error);

            this.loaderResponseSubject.next(false);
            this.toaster.error('TRANSACTION CANCELED');
          }
        );
      }
      await this.checkWalletConnection();
    } catch (err: any) {
      console.log('error in catch block of sol tokens transfer', err);
      this.checkWalletConnection();
      this.loaderResponseSubject.next(false);
    }
  }
  public user_sol_wallet_bal: any;

  async getSplTokenBalances(tokenMintAddress: string) {
    try {
      console.log('check token Address', tokenMintAddress);
      const mintPublicKey = new PublicKey(tokenMintAddress);
      const senderTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPublicKey,
        this.publicKey
      );
      console.log('check account', senderTokenAccount);
      let tokenAccountBalance = await this.connection.getTokenAccountBalance(
        senderTokenAccount
      );
      this.user_sol_wallet_bal = tokenAccountBalance.value.uiAmount.toFixed(2);
      this.phantom_wall_bal.next(tokenAccountBalance.value.uiAmount.toFixed(5));
      console.log(
        'tokenAccountBalance',
        tokenAccountBalance.value.uiAmount.toFixed(5)
      );
      let token_bal = parseFloat(tokenAccountBalance.value.uiAmount.toFixed(5));
      // this.user_sol_wallet.next(token_bal);
      return token_bal;
    } catch (error) {
      console.error('Failed to get SPL token balances:', error);
      return 0;
      // throw error;
    }
  }

  apiEndPoint = constants.DOMAIN_URL;

  // apiEndPoint = `http://192.168.1.10:3001/`
  connectWalletAddressForDATA(payload: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}uthx_token_info`, payload);
  }

  _postAgreeStatus(status: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}update_uthx_token`, status);
  }
}
