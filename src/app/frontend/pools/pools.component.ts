import { Component, HostListener, OnInit } from '@angular/core';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ToastrService } from 'ngx-toastr';
const solanaWeb3 = require('@solana/web3.js');
import constants from 'src/app/constants/constants';
import CryptoJS from 'crypto-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StakingPoolService } from 'src/app/services/staking/staking-pool.service';
import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  u64,
  AccountInfo,
} from '@solana/spl-token';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { IDL } from 'src/app/services/staking/idl';

declare let window: any;

@Component({
  selector: 'app-staking-pool',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css'],
  providers: [DatePipe],
})
export class PoolsComponent implements OnInit {
  warningToastr: boolean = false;
  user_sol_wallet: any;
  user_sol_wallet_balance: number;
  walletAdapter: PhantomWalletAdapter;
  connection: Connection;
  encodedMessage: any;
  connectedWalletBtn: boolean = false;
  signature: any;
  tokenAccount: any;
  uthXToken: any = constants.uthxToken;
  balance: number = 0;
  secretKey: any = constants.secretKey;
  stakingForm: FormGroup;
  poolIdList: any;
  SEC_IN_DAYS: number = 1000 * 24 * 60 * 60;
  SEC_IN_WEEK: number = 7 * this.SEC_IN_DAYS;
  SEC_IN_MONTH: number = 30 * this.SEC_IN_DAYS;
  stakeCounter: any;
  programId = new PublicKey(constants.programId);
  // private program: anchor.Program;
  getSolanaWallet: any;
  stakeInfoAccount: any;
  ownerAddress: any;
  stakeAccount: any;
  poolInfo: any;
  userTokenAccount: any;
  mintAddress = new PublicKey(constants.mintAddress);
  signatureKey: any;
  tokenProgram: any = new PublicKey(constants.tokenProgram);
  ipAddress: any;
  hashAddress: any;
  stakeDetail: any;
  selectedStake: any;
  stakeID: any;
  private provider: anchor.AnchorProvider;
  private program: anchor.Program;
  private signer: PublicKey;
  private systemProgram: PublicKey;
  user_stake_list: any;
  itemsPerPage = 5;
  currentPage = 1;
  totalItems = 0;
  loader = false;
  walletConnectLoader = false;
  token = sessionStorage.getItem('token');
  jwtExpired: any;
  emailAddress: string = 'businessdevelopment@utherverse.io';

  constructor(
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private stakingService: StakingPoolService,
    private datePipe: DatePipe // Inject DatePipe
  ) {
    this.systemProgram = SystemProgram.programId;
    this.walletAdapter = new PhantomWalletAdapter();

    this.connection = new Connection(constants.main_net_url);
    this.stakingForm = this.stakingFormField();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.warningToastr = true;
    }, 2000);

    this.getPoolDataId();

    if (this.token || this.user_sol_wallet) {
      this.get_list();
    }

    this.getIpAddress();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    // Clear local storage
    localStorage.clear();
    // Clear session storage
    sessionStorage.clear();
  }

  private stakingFormField() {
    return this.formBuilder.group({
      amount: ['', Validators.required],
      poolInfo: ['', Validators.required],
      autostake: [false, Validators.required],
    });
  }

  toggleFunction() {
    if (!this.token || !this.user_sol_wallet) {
      this.connectAndCheckBalance();
    } else {
      this.disconnectWallet();
    }
  }

  async connectAndCheckBalance() {
    if (window['solana']) {
      try {
        this.walletConnectLoader = true;
        setTimeout(() => {
          this.walletConnectLoader = false;
        }, 5000);
        const { publicKey } = await window['solana'].connect();
        this.user_sol_wallet = publicKey;
        // console.log('Connected with public key:', publicKey.toString());
        // const signature = await this.signData(this.user_sol_wallet);
        // console.log('Connected to signature:', signature); // `publicKey` is a PublicKey, not a string

        sessionStorage.setItem('user_sol_wallet', this.user_sol_wallet);

        this.provider = new anchor.AnchorProvider(
          this.connection,
          window['solana'],
          anchor.AnchorProvider.defaultOptions()
        );
        this.getSolanaWallet = this.user_sol_wallet;

        this.program = new anchor.Program(IDL, this.programId, this.provider);
        if (!this.token) {
          const signature = await this.signData(this.user_sol_wallet);
          this.signatureKey = signature;
          // console.log('Signature', signature);
          this.signVerification(signature);
        } else {
          this.get_list();
        }

        this.user_sol_wallet_balance = await this.getTokenBalance(
          this.user_sol_wallet
        );
      } catch (err) {
        console.error('Failed to connect to wallet:', err);
        this.toaster.error(
          'Failed to connect to Solana wallet. Please try again.'
        );
      }
    } else {
      console.error('Phantom wallet is not installed.');
      this.toaster.error(
        'Phantom wallet is not installed. Please install it to proceed.'
      );
    }
  }

  disconnectWallet() {
    sessionStorage.clear();
    this.token = null;
    this.balance = 0;
    this.user_sol_wallet = null;
    this.toaster.success('Wallet disconnected successfully.');
  }

  async getIpAddress(): Promise<void> {
    const ip_info_url = 'https://api.ipify.org?format=json';

    try {
      const response = await fetch(ip_info_url, {
        method: 'GET',
      });

      // Check if the response is okay (status code in the range 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      this.ipAddress = data.ip; // Extract the IP address
      // console.log('User IP:', this.ipAddress);
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  }

  async signData(message: string) {
    const { solana } = window as any;
    if (!solana || !solana.isPhantom) {
      alert('Phantom wallet not found. Please install it.');
      return undefined;
    }

    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessage = await solana.signMessage(encodedMessage, 'utf8');
      return {
        message: encodedMessage,
        signature: signedMessage.signature,
        publicKey: message.toString(),
      };
    } catch (error) {
      console.error('Error signing message:', error);
      return undefined;
    }
  }

  getPoolDataId() {
    this.stakingService._getPoolData().subscribe(
      (res) => {
        // console.log(res);
        const encryptData = res.data;

        const bytes = CryptoJS.AES.decrypt(encryptData, this.secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8).trim();
        // console.log('Decrypted Data:', JSON.parse(decryptedData));

        this.poolIdList = JSON.parse(decryptedData).records;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkValidTime(data: any, type: any) {
    const currentDate: Date = new Date();
    // const dateFormat = currentDate.moment()
    let tempDate: any;

    if (data) {
      if (type === 'claim') {
        tempDate = this.formatSlotTime(data, 'NCT');
        // console.log('+++++++++------', tempDate);
      } else {
        tempDate = this.formatSlotTime(data, 'EDT');
      }

      if (!(tempDate instanceof Date) || isNaN(tempDate.getTime())) {
        console.error('Invalid date:', tempDate);
        return false;
      }

      return currentDate > tempDate;
    } else {
      return false;
    }
  }

  selectedPoolId(event: any) {
    const poolId = event.target.value;

    const userAddress = this.user_sol_wallet;
    this.ownerAddress = userAddress;
    this.poolInfo = new PublicKey(poolId);

    const data = {
      pool_id: poolId,
      wallet_address: userAddress,
    };

    // console.log(data);

    const jsonString = JSON.stringify(data);

    const encryptedData = CryptoJS.AES.encrypt(
      jsonString,
      this.secretKey
    ).toString();

    const payload = {
      payload: encryptedData,
    };

    // this.stakeCounter = 2 + 1;

    if (userAddress) {
      this.stakingService._postStakePoolId(payload).subscribe(
        (res) => {
          // console.log(res);
          this.stakeCounter = res.counts;
          this.stakeCounter += 1;

          this.getPDA();
          this.getStakeAccount();
          this.getUserTokenAccount();
        },
        (err) => {
          console.log(err);
        }
      );
    }

    // console.log('Pool Id::', payload);
  }

  async getPDA() {
    // console.log('User Wallet', this.user_sol_wallet.toString());
    // console.log('Pool Info', this.poolInfo.toString());

    if (!this.user_sol_wallet || !this.poolInfo) {
      console.error('Required properties are not defined.');
      return;
    }

    // console.log('PDA COUNTER', this.stakeCounter);

    const numBuffer: Buffer = Buffer.alloc(8);
    // const stakeCounterBigInt = BigInt(this.stakeCounter);
    numBuffer.writeBigUInt64LE(BigInt(this.stakeCounter));

    const [pda] = PublicKey.findProgramAddressSync(
      [
        numBuffer,
        Buffer.from('stake_info'),
        this.user_sol_wallet.toBuffer(),
        this.poolInfo.toBuffer(),
        // new PublicKey(
        //   '3orF81EgxgsqsTvXB1ococZUA7ENKhChXWA4RfSXTtPb'
        // ).toBuffer(),
      ],
      this.programId
    );

    this.stakeAccount = pda.toString();
    this.stakeInfoAccount = this.stakeAccount;
    // console.log('Stake Info Account:', this.stakeAccount);
  }

  async getStakeAccount() {
    // console.log('User Wallet', this.ownerAddress.toString());
    // console.log('Pool info', this.poolInfo.toString());

    if (!this.ownerAddress || !this.poolInfo) {
      console.error('Owner address or pool info not defined');
      return;
    }

    const [pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('token'),
        this.ownerAddress.toBuffer(),
        this.poolInfo.toBuffer(),
        // new PublicKey(
        //   '3orF81EgxgsqsTvXB1ococZUA7ENKhChXWA4RfSXTtPb'
        // ).toBuffer(),
      ],
      this.programId
    );

    this.stakeAccount = pda.toString();
    console.log('Stake Account:', this.stakeAccount);
  }

  async getUserTokenAccount() {
    // console.log('User Wallet Account:', this.user_sol_wallet.toString());
    // console.log('Pool info', this.poolInfo.toString());

    if (!this.user_sol_wallet) {
      console.error('User SOL Wallet is not defined');
      return;
    }

    const toPublicKey = this.user_sol_wallet;
    const mintPublicKey = new PublicKey(constants.mintAddress);

    try {
      const associatedDestinationTokenAddr =
        await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintPublicKey,
          toPublicKey
        );

      // console.log(
      //   'Get User Token Account::',
      //   associatedDestinationTokenAddr.toBase58()
      // );
      this.userTokenAccount = associatedDestinationTokenAddr.toBase58();
    } catch (error) {
      console.error('Error fetching user token account:', error);
    }
  }

  getLockTime(data: any): string | undefined {
    if (data.roi_type === 0) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_DAYS / 400)) + ' Days';
    } else if (data.roi_type === 1) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_WEEK / 400)) + ' WEEK';
    } else if (data.roi_type === 2) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_MONTH / 400)) + ' Month';
    }
    return undefined; // Return undefined if roi_type is not valid
  }

  onlyAllowNumbers(event: KeyboardEvent): boolean {
    const key = event.key;
    if (
      /[^0-9]/.test(key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)
    ) {
      event.preventDefault();
      return false;
    }

    const input = (event.target as HTMLInputElement).value;

    if (input === '' && key === '0') {
      event.preventDefault();
      return false;
    }

    return true;
  }

  closeWarning() {
    this.warningToastr = false;
  }

  async getTokenBalance(publicKey: any): Promise<number> {
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        // mint: new PublicKey(this.uthXToken),
        mint: new PublicKey(this.uthXToken),
      }
    );

    if (tokenAccounts.value.length === 0) {
      console.log('0 balance not found');

      return 0;
    }

    const tokenAccount = tokenAccounts.value[0];
    const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
    this.balance = balance;
    return balance;
  }

  signVerification(signature: any) {
    const jsonString = JSON.stringify(signature);

    const encryptedData = CryptoJS.AES.encrypt(
      jsonString,
      this.secretKey
    ).toString();

    const data = {
      payload: encryptedData,
    };

    this.stakingService._postSignedVerified(data).subscribe((res) => {
      if (res.success) {
        sessionStorage.setItem('token', res.token);
        this.get_list();
        this.token = res.token;
        this.toaster.success('Wallet connected successfully');
      }
    });
  }

  autoStake(event: any) {
    const payload = { autostake: event.target.checked };
    // console.log(payload);
  }

  checkAvailableBanace(event: any) {
    const amount = this.stakingForm?.value.amount;

    if (amount && amount > this.balance) {
      // this.toaster.error('The amount you entered exceeds your balance.');
      this.stakingForm.patchValue({ amount: this.balance });
      return;
    }
  }

  createStake() {
    const count = this.stakeCounter;

    const amount = this.stakingForm?.value.amount;
    const autostake = this.stakingForm?.value.autostake;
    this.getIpAddress();

    // console.log('count', count);
    // console.log('autostake', autostake);
    // console.log('amount', amount);

    // console.log(this.stakeCounter);

    // console.log(this.ipAddress);

    if (!this.user_sol_wallet) {
      this.toaster.error('Please connect to your SOL wallet.');
      return;
    }

    if (amount > this.balance) {
      this.toaster.error("You don't have enough UTHX tokens.");
      return;
    }

    if (!this.stakeCounter) {
      this.toaster.error('Please select a contract type.');
      return;
    } else if (amount <= 0) {
      this.toaster.error('Please enter a valid amount.');
    } else {
      if (count && amount) {
        this.initializePool(count, amount, autostake);
      }
    }
  }

  postStakeToDataBase(method: any) {
    const amount = this.stakingForm?.value.amount;
    const autostake = this.stakingForm?.value.autostake;

    const form_data: any = {
      amount: amount,
      autostake: autostake,
      stakeCounter: this.stakeCounter,
      signer: this.getSolanaWallet,
      stakeInfoAccount: this.stakeInfoAccount,
      stakeAccount: this.stakeAccount,
      poolInfo: this.poolInfo,
      userTokenAccount: this.userTokenAccount,
      mint: this.mintAddress,
      tokenProgram: this.tokenProgram,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: this.systemProgram,
      ip: this.ipAddress,
      hashAddress: this.hashAddress,
    };

    if (method === 'updated') {
      form_data._id = this.stakeID;
      form_data.hashAddress = this.hashAddress;
    }

    // console.log('Form Data', form_data);

    const jsonString = JSON.stringify(form_data);

    const encryptedData = CryptoJS.AES.encrypt(
      jsonString,
      this.secretKey
    ).toString();

    const payload = {
      payload: encryptedData,
    };

    // console.log('Encrypted Data:', payload);

    this.stakingService._postStakeToDB(payload).subscribe(
      (res) => {
        // console.log(res);

        if (method === 'add') {
          this.stakeID = res.id;
        }

        // this.toaster.success(res.message);
      },
      (err) => {
        console.log(err);
        this.toaster.error(err.error.message);
      }
    );
  }

  copiedAddress(data: any) {
    navigator.clipboard.writeText(data);
    this.toaster.success('Copied Successfully');
  }

  async initializePool(
    stake_counter: number,
    token_amount: number,
    auto_stake: boolean
  ) {
    this.toaster.info('Waiting for transaction');

    this.loader = true;
    const stakeCounter = new BN(stake_counter); // Ensure it's a BN
    const amount = new BN(token_amount); // Ensure it's a BN
    const autostake = auto_stake; // Convert boolean to u8

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 200000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 4000000,
    });

    let tx = new Transaction()
      .add(modifyComputeUnits)
      .add(addPriorityFee)
      .add(
        this.program.instruction['stake'](stakeCounter, amount, autostake, {
          accounts: {
            signer: this.getSolanaWallet,
            stakeInfoAccount: this.stakeInfoAccount,
            stakeAccount: this.stakeAccount,
            poolInfo: this.poolInfo,
            userTokenAccount: this.userTokenAccount,
            mint: this.mintAddress,
            tokenProgram: this.tokenProgram,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: this.systemProgram,
          },
          signers: [],
        })
      );

    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.getSolanaWallet;

    try {
      if (!window['solana']) {
        throw new Error('Solana wallet is not connected.');
      }

      // const response = await window['solana'].signAndSendTransaction(tx);
      // if (!response?.signature) {
      //   throw new Error('Failed to retrieve transaction signature');
      // }

      const signedTransaction = await window['solana'].signTransaction(tx);
      console.log('Transaction signed:', signedTransaction);

      // Serialize and send the transaction
      const rawTransaction = signedTransaction.serialize();

      console.log('raw Transction:', rawTransaction);
      const response: any = await this.connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: false, // You can set this to true for faster but less secure send
        }
      );

      this.hashAddress = response;
      this.postStakeToDataBase('add');
      // console.log('Transaction response:', response);

      console.log('Checking transaction signature', response);

      await this.connection.confirmTransaction(response);
      this.loader = false;
      // console.log('Transaction successful with signature:', response);
      this.postStakeToDataBase('updated');
      this.get_list();
      this.stakingForm.reset({
        amount: '',
        poolInfo: '',
      });
      this.toaster.success('Transaction successfully');
      this.user_sol_wallet_balance = await this.getTokenBalance(
        this.user_sol_wallet
      );
    } catch (err) {
      console.log(err);

      let errorMessage = 'Transaction Failed';
      this.loader = false;
      IDL.errors.forEach((_err) => {
        if (err.toString().includes(`0x${_err.code.toString(16)}`)) {
          errorMessage = _err.msg;
        }
      });

      this.toaster.warning(errorMessage);
    }
  }

  get_list() {
    let params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    let body = {
      signer: this.user_sol_wallet,
    };

    // console.log('Check params');

    this.stakingService._getUserStakeList(params, body).subscribe({
      next: (res: any) => {
        // console.log('Check data', res);

        if (res.success) {
          const encryptedData = res.encryptedData;
          const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8).trim();
          const data = JSON.parse(decryptedData);
          this.totalItems = data.data.pagination.total_record;
          this.user_stake_list = data?.data.user_stakes || [];

          this.user_stake_list.forEach(async (item: any, index: any) => {
            const info: any = await this.program.account['stakeInfo'].fetch(
              item?.stakeInfoAccount
            );
            this.user_stake_list[index]['stackDetails'] = info;
          });
          // console.log('User Stake data :: ', this.user_stake_list);
        } else {
          // Handle unsuccessful response (e.g., res.success === false)
          this.token = null;
          sessionStorage.removeItem('token');
          this.connectAndCheckBalance();
        }
      },
      error: (err) => {
        // Handle the error response
        console.error('Error occurred:', err);
        this.token = null;
        sessionStorage.removeItem('token');
        this.connectAndCheckBalance();
      },
    });
  }

  openStackDetail(data: any) {
    this.selectedStake = data;
  }

  onPageChange(page: any) {
    this.currentPage = page;
    this.get_list();
  }

  tokenVaultAccount: any;

  calculateStakedAmount(amount: any) {
    return amount / 10 ** 9;
  }

  downloadPdfFile() {
    const link = document.createElement('a');
    link.href =
      '../../../assets/pdf/Utherverse_Stake_EHewQr3kinhMsdRQgW5pPLRKo14iwrhscygCDrKKPuEy.pdf';
    link.download = 'Utherverse_Stake.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatSlotTime(data: any, type: string) {
    let tempTime: any;
    let depositTime: any;
    if (type == 'NCT') {
      tempTime = data.nextClaimTime;
      depositTime = data.depositTimestamp;
    } else if (type == 'LIT') {
      tempTime = data.lastInteractionTime;
      depositTime = data.depositTimestamp;
    } else if (type == 'EDT') {
      tempTime = data.endTime;
      depositTime = data.depositTimestamp;
    } else {
      return '';
    }

    const sas = data.stakeAtSlot;
    const time = (tempTime - sas) / 2.5;

    const finalTimestamp = depositTime.toNumber() + time;

    return this.formatTimestamp(finalTimestamp);

    // console.log('depositTime :: ', depositTime.toNumber());
    // console.log('time :: ', time);
    // console.log('Final Time :: ', finalTimestamp);
  }

  formatTimestamp(timestamp: number | string): string {
    if (timestamp) {
      const date = new Date(Number(timestamp) * 1000);
      return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm a') || '';
    }
    return '';
  }

  // checkPoolInfo() {

  //   console.log("Selected Stake:", this.selectedStake);

  //   if (this.selectedStake?.poolData[0]?.roi_type == 0) {
  //     return (
  //       this.selectedStake?.poolData[0]?.lock_time / (this.SEC_IN_DAYS * 400) +
  //       ' Days'
  //     );
  //   } else if (this.selectedStake?.poolData[0]?.roi_type == 1) {
  //     return (
  //       this.selectedStake?.poolData[0]?.lock_time / (this.SEC_IN_WEEK * 400) +
  //       ' Week'
  //     );
  //   } else if (this.selectedStake?.poolData[0]?.roi_type == 2) {
  //     return (
  //       this.selectedStake?.poolData[0]?.lock_time / (this.SEC_IN_MONTH * 400) +
  //       ' Month'
  //     );
  //   } else {
  //     return '';
  //   }
  // }

  checkPoolInfo(): string | undefined {
    const data = this.selectedStake?.poolData[0];
    if (data?.roi_type === 0) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_DAYS / 400)) + ' Days';
    } else if (data.roi_type === 1) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_WEEK / 400)) + ' WEEK';
    } else if (data.roi_type === 2) {
      return Math.ceil(data?.lock_time / (this.SEC_IN_MONTH / 400)) + ' Month';
    }
    return undefined; // Return undefined if roi_type is not valid
  }

  claimStake(data: any) {
    // console.log('Data Claim', data);

    this.getVaultAccountDetail(data);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to claim stake pool!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Claim it!',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.stakingService._postClaimStakeDeStake(
          data,
          'add',
          'claim',
          this.tokenVaultAccount,
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          this.systemProgram
        );
        this.claimRewardsStakePool(data);
      }
    });
  }

  deStakeConfirm(data: any) {
    this.getVaultAccountDetail(data);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to destake pool!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Withdraw it!',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.stakingService._postClaimStakeDeStake(
          data,
          'add',
          'destake',
          this.tokenVaultAccount,
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          this.systemProgram
        );

        this.deStakePool(data);
      }
    });
  }

  restakeStake(data: any) {
    this.getVaultAccountDetail(data);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to restake pool!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Restake it!',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.restakeRewards(data);
        this.stakingService._postClaimStakeDeStake(
          data,
          'add',
          'restakeRewards',
          this.tokenVaultAccount,
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          this.systemProgram
        );
      }
    });
  }

  async getVaultAccountDetail(data: any) {
    const info: any = await this.program.account['poolInfo'].fetch(
      data?.poolInfo
    );
    this.tokenVaultAccount = info?.tokenVault;

    // console.log('tokenVault', this.tokenVaultAccount);
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// CLAIM, RESTAKE, DESTAKE.../////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////

  async claimRewardsStakePool(data: any) {
    this.loader = true;

    // console.log('signer:', this.getSolanaWallet);
    // console.log('signer: base', this.getSolanaWallet.toBase58());
    // console.log('stakeInfoAccount:', data?.stakeInfoAccount);
    // console.log('stakeAccount:', data.stakeAccount);
    // console.log('poolInfo:', new PublicKey(data?.poolInfo));
    // console.log('userTokenAccount:', data?.userTokenAccount);
    // console.log('mint:', new PublicKey(data?.mint));
    // console.log('tokenProgram:', this.tokenProgram.toBase58());
    // console.log(
    //   'associatedTokenProgram:',
    //   ASSOCIATED_TOKEN_PROGRAM_ID.toBase58()
    // );
    // console.log('systemProgram:', this.systemProgram.toBase58());

    const stakeCounter = new BN(data.stakeCounter);
    // const stakeCounter = new BN(1);

    // console.log('Stake Countter', stakeCounter);

    let tx = new Transaction().add(
      this.program.instruction['claimRewards'](stakeCounter, {
        accounts: {
          signer: this.getSolanaWallet,
          stakeInfoAccount: new PublicKey(data?.stakeInfoAccount),
          poolInfo: new PublicKey(data?.poolInfo),
          stakeAccount: new PublicKey(data.stakeAccount),
          tokenVaultAccount: this.tokenVaultAccount,
          userTokenAccount: new PublicKey(data?.userTokenAccount),
          mint: new PublicKey(data?.mint),
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: this.systemProgram,
        },
        signers: [],
      })
    );

    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.getSolanaWallet;

    try {
      if (!window['solana']) {
        throw new Error('Solana wallet is not connected.');
      }
      // console.log('BEFORE  Solana wallet is connected');
      // const response = await window['solana'].signAndSendTransaction(tx);
      // if (!response?.signature) {
      //   throw new Error('Failed to retrieve transaction signature');
      // }

      const signedTransaction = await window['solana'].signTransaction(tx);
      // console.log('Transaction signed:', signedTransaction);

      // Serialize and send the transaction
      const rawTransaction = signedTransaction.serialize();
      const response: any = await this.connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: false, // You can set this to true for faster but less secure send
        }
      );

      // console.log('Checking transaction signature', response);

      this.hashAddress = response.signature;
      // console.log(' 3  Solana wallet is connected');
      await this.connection.confirmTransaction(response.signature);
      this.loader = false;
      // console.log('Transaction successful with signature:', response.signature);
      this.stakingService._postClaimStakeDeStake(
        data,
        'update',
        'claim',
        this.tokenVaultAccount,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        this.systemProgram
      );
      this.get_list();
    } catch (err) {
      // console.error('Transaction failed:::::', err);
      // console.log('Error resp from claim', err);
      let errorMessage = 'Transaction Failed';

      IDL.errors.forEach((_err) => {
        if (err.toString().includes(`0x${_err.code.toString(16)}`)) {
          errorMessage = _err.msg;
        }
      });

      this.toaster.warning(errorMessage);

      this.loader = false;
    }
  }

  ///////////////////////////////////////////////////////////////////////

  async restakeRewards(data: any) {
    this.loader = true;

    const stakeCounter = new BN(data.stakeCounter);

    let tx = new Transaction().add(
      this.program.instruction['restakeRewards'](stakeCounter, {
        accounts: {
          signer: this.getSolanaWallet,
          stakeInfoAccount: new PublicKey(data?.stakeInfoAccount),
          poolInfo: new PublicKey(data?.poolInfo),
          stakeAccount: new PublicKey(data.stakeAccount),
          tokenVaultAccount: this.tokenVaultAccount,
          userTokenAccount: new PublicKey(data?.userTokenAccount),
          mint: new PublicKey(data?.mint),
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: this.systemProgram,
        },
        signers: [],
      })
    );

    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.getSolanaWallet;

    try {
      if (!window['solana']) {
        throw new Error('Solana wallet is not connected.');
      }

      const signedTransaction = await window['solana'].signTransaction(tx);
      // console.log('Transaction signed:', signedTransaction);

      // Serialize and send the transaction
      const rawTransaction = signedTransaction.serialize();
      const response: any = await this.connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: false, // You can set this to true for faster but less secure send
        }
      );

      // console.log('Checking transaction signature', response);

      this.hashAddress = response.signature;

      await this.connection.confirmTransaction(response.signature);
      this.loader = false;
      // console.log('Transaction successful with signature:', response.signature);
      this.get_list();
      this.stakingService._postClaimStakeDeStake(
        data,
        'update',
        'restakeRewards',
        this.tokenVaultAccount,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        this.systemProgram
      );
    } catch (err) {
      let errorMessage = 'Transaction Failed';
      console.log('Error resp from restake', err);

      IDL.errors.forEach((_err) => {
        if (err.toString().includes(`0x${_err.code.toString(16)}`)) {
          errorMessage = _err.msg;
        }
      });
      this.loader = false;
      this.toaster.warning(errorMessage);
    }
  }

  ///////////////////////////////////////////////////////////////////////

  async deStakePool(data: any) {
    this.loader = true;

    const stakeCounter = new BN(data.stakeCounter);

    let tx = new Transaction().add(
      this.program.instruction['destake'](stakeCounter, {
        accounts: {
          signer: this.getSolanaWallet,
          tokenVaultAccount: this.tokenVaultAccount,
          stakeInfoAccount: new PublicKey(data?.stakeInfoAccount),
          poolInfo: new PublicKey(data?.poolInfo),
          stakeAccount: new PublicKey(data.stakeAccount),
          userTokenAccount: new PublicKey(data?.userTokenAccount),
          mint: new PublicKey(data?.mint),
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: this.systemProgram,
        },
        signers: [],
      })
    );

    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.getSolanaWallet;

    try {
      if (!window['solana']) {
        throw new Error('Solana wallet is not connected.');
      }

      // const response = await window['solana'].signAndSendTransaction(tx);
      // if (!response?.signature) {
      //   throw new Error('Failed to retrieve transaction signature');
      // }

      const signedTransaction = await window['solana'].signTransaction(tx);
      // console.log('Transaction signed:', signedTransaction);

      // Serialize and send the transaction
      const rawTransaction = signedTransaction.serialize();
      const response: any = await this.connection.sendRawTransaction(
        rawTransaction,
        {
          skipPreflight: false, // You can set this to true for faster but less secure send
        }
      );

      // console.log('Checking transaction signature', response);

      this.hashAddress = response.signature;

      await this.connection.confirmTransaction(response.signature);
      this.loader = false;
      // console.log('Transaction successful with signature:', response.signature);
      this.get_list();
      this.stakingService._postClaimStakeDeStake(
        data,
        'update',
        'destake',
        this.tokenVaultAccount,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        this.systemProgram
      );
    } catch (err) {
      let errorMessage = 'Transaction Failed';
      this.loader = false;
      console.log('Error resp from destake', err);

      IDL.errors.forEach((_err) => {
        if (err.toString().includes(`0x${_err.code.toString(16)}`)) {
          errorMessage = _err.msg;
        }
      });

      this.toaster.warning(errorMessage);
    }
  }
}
