import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { PublicService } from 'src/app/services/public/public.service';
import constants from 'src/app/constants/constants';
import { ProjectGetService } from 'src/app/services/project-get.service';
import { NguCarouselConfig } from '@ngu/carousel';
import { NguCarousel } from '@ngu/carousel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  RequiredValidator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { AcknowledgeService } from 'src/app/services/acknowledge.service';
import { GoogleTranslateService } from 'src/app/services/google-translate.service';
import * as buffer from 'buffer';
import { Subscription, timeout } from 'rxjs';
// import { writeContract } from '@wagmi/core'

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import {
  configureChains,
  createConfig,
  getAccount,
  getNetwork,
  fetchBalance,
  waitForTransaction,
  prepareSendTransaction,
  sendTransaction,
  writeContract,
  watchAccount,
  watchNetwork,
  disconnect,
  switchNetwork,
  signMessage,
} from '@wagmi/core';
import { WalletValidatorService } from 'src/app/services/wallet-validator.service';
import { Web3Modal } from '@web3modal/html';
import { mainnet, bsc } from '@wagmi/core/chains';
import { parseEther } from 'viem';
import { PhantomWalletServiceService } from 'src/app/services/phantom-wallet.service.service';
import { BigNumber } from 'bignumber.js';
import { CookieService } from 'ngx-cookie-service';
import { CountdownService } from 'src/app/services/countdown.service';
import { EncryptCryptoService } from 'src/app/services/encrypt-crypto.service';
import Web3 from 'web3';
import { xyzABI } from 'src/app/services/xyzABI';
import { TokenSalesService } from '../staking/token-sales.service';
interface Time {
  minutes: number;
  seconds: number;
}

// import { StringformationPipe } from 'src/app/core/pipes/stringformation.pipe';
const solanaWeb3 = require('@solana/web3.js');

interface MyWindow extends Window {
  ethereum: any;
  URL: typeof URL;
}

declare var window: MyWindow;
window.Buffer = buffer.Buffer;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly mobileBreakpoint: number = 768;
  isMobile: boolean = false;
  userWalletFormGroup: FormGroup;
  isScrolled: boolean = false;
  public user: any;
  public modal_count: number | any = 0;
  private apiResponseSubscription: Subscription;
  private loaderSubscription: Subscription;
  apiResponse: boolean;
  loaderResponse: boolean;
  private connection: Connection;
  public publicKey: PublicKey | null | any = null;
  isPasswordVisible: boolean = false;
  is_connect: string = 'no';
  public languages: Array<any> = this.googleTranslateService.languages;
  public active_chain_symbol: string | any;
  private package_purchase_users: Array<any> = [
    { countryName: 'United States', countryCode: 'US' },
    { countryName: 'China', countryCode: 'CN' },
    { countryName: 'Nepal', countryCode: 'NP' },
    { countryName: 'Afghanistan', countryCode: 'AF' },
    { countryName: 'Bangladesh', countryCode: 'BD' },
    { countryName: 'Morocco', countryCode: 'MA' },
    { countryName: 'Algeria', countryCode: 'DZ' },
    { countryName: 'Egypt', countryCode: 'EG' },
    { countryName: 'Bolivia', countryCode: 'BO' },
    { countryName: 'Canada', countryCode: 'CA' },
  ];
  public is_package_purchase_user: boolean | string = false;
  public currentUser: any;
  public user_country: string | any;
  public user_region: string | any;
  public all_countries_list: [];
  public ipfi_url = 'https://api.ipify.org?format=json';
  public urlGetStatus = `${constants.DOMAIN_URL}getStatus`;
  public is_accredit_user: string = 'false';
  @ViewChild('package_purchase_modal') package_purchase_modal!: ElementRef;
  @ViewChild('presale_cards_container') presale_cards_container!: ElementRef;
  @ViewChild('wallets_selection_modal')
  wallets_selection_modal!: ElementRef | null;
  @ViewChild('signup_form') signup_form!: ElementRef;
  @ViewChild('init_video') initVideo!: ElementRef;
  @ViewChild('thankyou_page_modal') thankyou_page_modal!: ElementRef;
  @ViewChild('pass_reset_modal') reset_modal_btn!: ElementRef;
  @ViewChild('selected_language') selectedLanguage!: ElementRef;
  @ViewChild('list_languages') listLanguages!: ElementRef;
  @ViewChild('calculate_prof_modal') calculate_prof_modal!: ElementRef;
  @ViewChild('day_1') counter_day_one_wrapper!: ElementRef;
  @ViewChild('hour_1') counter_hour_one_wrapper!: ElementRef;
  @ViewChild('api_time') api_time!: ElementRef;
  @ViewChild('api_time_day') api_time_day!: ElementRef;

  public carouselTileItems: Array<any> = [0, 1];
  public slides = [
    {
      url: '../../../assets/videos/uthintro.mp4',
      poster: '../../../assets/img/uthbanner.jpg',
      videoType: 'youtube',
    },
    {
      url: 'https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/bznqo6n8/6g4/7l6/jyn/Token%20Sale%20Header%20Video-1.mp4',
      poster: '',
      videoType: 'normal',
    },
  ];
  brands: any = [
    '../../../assets/images/badge.png',
    '../../../assets/images/badge.png',
    '../../../assets/images/badge.png',
    '../../../assets/images/badge.png',
  ];
  public youtubeVideoId = '-clUdYHITVs';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  spinner: boolean = false;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: { timing: 12000, initialDelay: 3000 },
    loop: false,
    touch: true,
    velocity: 0.2,
    easing: 'easeOutQuad',
  };

  carouselItems = [1, 2, 3];
  youtubeEmbedUrl: SafeResourceUrl;

  tokens_data_source: any = [
    { symbol: 'Solana', image: '../../../assets/img/SOL.png', val: 'sol' },
    { symbol: 'Ethereum', image: '../../../assets/img/ETH.png', val: 'eth' },
    { symbol: 'BSC', image: '../../../assets/img/BNB.png', val: 'bsc' },
    // { symbol: 'Polygon', image: '../../../assets/img/polygon.jpeg', val: "pol" },
    // { symbol: 'Arbitrum', image: '../../../assets/img/arbitrum.jpg', val: "arb" },
    // { symbol: 'Optimism', image: '../../../assets/img/optimism.png', val: "opts" },
  ];

  // public chanis_list: Array<string> = [
  //   'Solana',
  //   'Ethereum',
  //   'Bsc',
  //   'Polygon',
  //   'Arbitrum',
  //   'Optimism',
  // ];

  all_tokens_data_source: any = [
    { symbol: 'Solana', image: '../../../assets/images/solana.jpg' },
    { symbol: 'Ethereum', image: '../../../assets/img/ETH.png' },
    { symbol: 'Bsc', image: '../../../assets/img/USDT.png' },
    // { symbol: 'Polygon', image: '../../../assets/img/polygon.jpeg' },
    // { symbol: 'Arbitrum', image: '../../../assets/img/arbitrum.jpg' },
    // { symbol: 'Optimism', image: '../../../assets/img/BUSD.png' },
  ];
  allokens_data_source_backup: any = [
    { symbol: 'Solana', image: '../../../assets/images/solana.jpg' },
    { symbol: 'Ethereum', image: '../../../assets/img/ETH.png' },
    { symbol: 'Bsc', image: '../../../assets/img/USDT.png' },
    // { symbol: 'Polygon', image: '../../../assets/img/USDC.png' },
    // { symbol: 'Arbitrum', image: '../../../assets/img/DAI.png' },
    // { symbol: 'Optimism', image: '../../../assets/img/BUSD.png' },
  ];
  currency_backup: [];
  url = `${constants.DOMAIN_URL}project/getProject/`;
  projectData: any;
  paramId: string | any = constants.PROJECT_NAME;
  projectId: any;
  projectName: any;
  projectDesc: any;
  projectDetail: any;
  headerImage: any;
  logoImage: any;
  footerImage: any;
  tokenomics: any;
  affiliateUrl: any;
  referral_id: any;
  rounds: any;
  whitepaperUrl: any;
  tokenomicsUrl: any;
  // currentAccount: any;
  gasPrice: any;
  // _web3: any;
  facebookLink: any;
  instagramLink: any;
  linkedinLink: any;
  telegramLink: any;
  twitterLink: any;
  youtubeLink: any;
  discordLink: any;
  footerText: any;
  currencyAmount: any = [];
  shortAddress: any;
  PresaleContract: any;
  crowdcontractAddress: any;
  crowdcontractAbi: any;
  currentAccount: any;
  refundContractAddress: any;
  refundContractAbi: any;

  rate: any = [];
  offerRates: any = [];
  rate2: any;
  rate3: any;
  rate4: any;
  tokenRate: any = [];
  tokenRate2: any;
  tokenRate3: any;
  tokenRate4: any;
  bnbAmount: any;
  user_bal: any;
  user_sol_wallet_balance: string | any;
  loggedIn: any;
  transactionHash: any;
  minPurchase: any;
  maxPurchase: any;
  loading: boolean = false;
  bnbError: any;
  bnbPrice: any;
  usdtPrice: any;
  ethPrice: any;
  btcPrice: any;
  busdPrice: any;
  usdcPrice: any;
  sol_price: any;
  dai_price: any;
  currency: any;
  currencyValue: string = 'USDT';
  c_code: string;
  GasLimit: any;
  standardGasPrice: any;
  walletConnect: any;
  OTPemailverified: any;
  OTPphonelverified: any;
  documentSubmited: any;
  documentApproved: any;
  KYCVerified: any;
  otp_not_verified: boolean = false;
  document_not_submitted: boolean = false;
  document_not_approved: boolean = false;
  kyc_not_approved: boolean = false;
  pdfContent: any;
  pdfContent2: any;
  currencyPrice: any;
  datePdf: any;
  purchaser: any;
  purchaseEmail: any;
  purchaseAddress: any;
  token_price: any;
  pdfOne: boolean = false;
  pdfTwo: boolean = false;
  signatureUrl: any;
  tokenFromUI: string = '0123456789123456';
  request: string = 'fakhirashfaq321213';
  encrypted: any = '0x392aa7803c6f1100915f662bcDd3f88160f5CFC4';
  decrypted: any;
  usdtAbi: any;
  usdtContractAddress: any;
  busdAbi: any;
  busdContractAddress: any;
  wbtcAbi: any;
  wbtcContractAddress: any;
  usdcAbi: any;
  usdcContractAddress: any;
  walletAddressEncrypted: any;
  walletAddressDecrypted: any;
  round_id: any;
  contract_address: any;
  purchaseCity: any;
  purchaseState: any;
  purchaseZipCode: any;
  transactionNetwork: any;
  purchaseAddress2: any;
  rID: any;
  Am: any;
  ConAdd: any;
  tokenPr: any;
  successMailMessage: any = null;
  featuredTokenomics: any = [];
  user_sol_wallet_key: any;
  evm_wallet_key: any;

  provider: any;

  connector: any;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  transactionID: any;
  api_time_interval: NodeJS.Timeout;
  interval: NodeJS.Timeout;
  // api_time_interval: any;

  mainItems: number[];
  web3modal: Web3Modal;
  receipt: any;
  pdf_one: any;
  pdf_two: any;
  isRefferralTrue: boolean;
  public offer_val: number = 0;
  public bonus: number | any = 0;
  public total_tokens: number = 0;
  public imageObject: Array<object | any> = [];

  carouselConfig_: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
    load: 3,
    interval: { timing: 1500, initialDelay: 1000 },
    speed: 400,
    animation: 'lazy',
    loop: true,
    touch: true,
    velocity: 1,
    slide: 1, // Move 3 items at a time
  };

  public offers_res: any;

  additionalTime: Time = { minutes: 0, seconds: 0 };
  private additionalTimeSubscription: Subscription;
  showDevpage: boolean = false;
  pc_ip: string = '';
  constructor(
    public cookieService: CookieService,
    private public_service: PublicService,
    private router: Router,
    private getProjectService: ProjectGetService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private toastr: ToastrService,
    private _cdr: ChangeDetectorRef,
    private ackSer: AcknowledgeService,
    private phantom_service: PhantomWalletServiceService,
    public wallet_validator: WalletValidatorService,
    private googleTranslateService: GoogleTranslateService,
    private elRef: ElementRef,
    public tokens_sales: TokenSalesService,
    public count_down_service: CountdownService,
    public token_sales_service: TokenSalesService,
    private formBuilder: FormBuilder,
    public cryptoService: EncryptCryptoService
  ) {
    (() => {
      fetch(this.ipfi_url, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          this.pc_ip = data.ip;
        });
    })();

    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;

    if (snapshot.url == '/debug-1') {
      this.showDevpage = true;
    } else {
      this.showDevpage = false;
    }

    this.checkDeviceType(window.innerWidth);

    this.userWalletFormGroup = this.formBuilder.group({
      solana_wallet: ['', Validators.required],
      evm_wallet: ['', Validators.required],
    });

    let currentUrl = this.router.url;
    currentUrl = currentUrl ? currentUrl.replace(/^\//, '') : null;
    sessionStorage.setItem('current_url', currentUrl);
    this.paramId = constants.PROJECT_NAME;
    this.affiliateUrl = this.router.parseUrl(this.router.url);
    this.referral_id = this.affiliateUrl.queryParams.affiliate;
    console.log('this.affiliateId ****', this.referral_id);
    sessionStorage.setItem('is_connect', this.is_connect);
    this.phantom_service.checkWalletConnection();
    this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.youtubeVideoId}`
    );

    (() => {
      const projectId = '3fbb6705cf6b4fe20b1da11cbab07df8';
      const chains = [mainnet, bsc];
      const { publicClient } = configureChains(chains, [
        w3mProvider({ projectId }),
      ]);
      const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ projectId, chains }),
        publicClient,
      });
      const ethereumClient = new EthereumClient(wagmiConfig, chains);
      this.web3modal = new Web3Modal(
        {
          projectId,
          themeMode: 'dark',
        },
        ethereumClient
      );
      this.web3modal.subscribeModal((newState: any) => {
        if (newState.open == false) {
          this.revealInfo();
        }
      });
    })();
    (() => {
      fetch(this.ipfi_url, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          let ip_addres = data.ip;
          let ip_info_url = `https://ipinfo.io/${ip_addres}?token=${constants.ipinfo_token}`;
          fetch(ip_info_url, {
            method: 'GET',
          })
            .then((res) => res.json())
            .then((user: any) => {
              let c_code = user.country;
              const country = this.package_purchase_users.find(
                (country: any) => country.countryCode === c_code
              );
              if (country) {
                console.log('cntry', country);
                this.user_country = country.countryName;
                sessionStorage.setItem('user_countery', this.user_country);
                this.is_package_purchase_user = true;
                sessionStorage.setItem('is_restricted', 'true');
                sessionStorage.setItem('is_additionalTimeted', 'true');
              } else {
                this.is_package_purchase_user = false;
              }
            });
          if (this.user_country) {
            return this.user_country;
          } else {
          }
        });
    })();

    watchAccount((account) => {
      if (account !== this.currentAccount) {
        this.revealInfo();
      }
    });

    watchNetwork((network) => {
      if (network) {
        const { chain, chains } = network;
        this.active_chain_symbol = network?.chain?.nativeCurrency.symbol;
        console.log('here is chain====>', chain);

        const accounts = getAccount();
        // if (accounts.address) {
        //   let url = `http://192.168.1.24:3000/api/customer/getRoundInfo`;
        //   let payload = {
        //     wallet_address: accounts.address,
        //   };
        //   this.token_sales_service
        //     .get_the_rounds(url, payload)
        //     .subscribe((res) => {
        //       this.round_info = res.round;
        //       console.log('DATAAAAAAAAA', res.round);
        //     });
        // } else {
        //   console.log('ERRRROOOOOOORRRRRRRR');
        // }
      }
    });
  }

  copied_msg(address: any) {
    navigator.clipboard.writeText(address);
    this.toastr.success('Address Copied Successfully', 'Copied');
  }

  getConnection(network: string) {
    let url = 'https://api.mainnet-beta.solana.com/';
    switch (network) {
      case 'main_net':
        url = solanaWeb3.clusterApiUrl('mainnet-beta');
        break;
      case 'test_net':
        url = solanaWeb3.clusterApiUrl('testnet');
        break;
      case 'devnet':
        url = solanaWeb3.clusterApiUrl('devnet');
        break;
      default:
        throw new Error('Unsupported network');
    }

    console.log('getConnection called', new solanaWeb3.Connection(url));

    return new solanaWeb3.Connection(url);
  }
  async connect() {
    if (window['solana'] && window['solana'].isPhantom) {
      try {
        const resp = await window['solana'].connect();
        let publicKey = new PublicKey(resp.publicKey);
        let sol_in_string;
        sol_in_string = publicKey.toString();
        this.user_sol_wallet = sol_in_string;
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

  async checkWalletConnection() {
    if (window['solana'] && window['solana'].isPhantom) {
      try {
        const resp = await window['solana'].connect({ onlyIfTrusted: true });
        this.publicKey = new PublicKey(resp.publicKey.toString());
        sessionStorage.setItem('public key', this.publicKey);
        this.publicKey = sessionStorage.getItem('public key');
        console.log(
          'Phantom Wallet already connected:',
          this.publicKey.toString()
        );

        this.userWalletFormGroup.patchValue({
          solana_wallet: this.publicKey,
        });

        this.user_sol_wallet_key = this.publicKey.toString();
        console.log('Phantom Wallet', this.user_sol_wallet_key);
        console.log('Phantom WalletTTTTTTTTTTTTTT', this.publicKey.toString());
      } catch (err) {
        console.error('Error checking Phantom Wallet connection', err);
      }
    }
  }

  routerUrl: string;
  is_offer_exist: any;

  ngOnInit(): void {
    this.onWindowScroll();

    this.evm_wallet_key = sessionStorage.getItem('address');
    if (this.evm_wallet_key) {
    }

    this.apiResponseSubscription = this.phantom_service.apiResponse$.subscribe(
      (response) => {
        this.apiResponse = response;
        if (this.apiResponse) {
          this.thankyou_page_modal?.nativeElement?.click();
        }
        console.log('API response:', response);
        // You can add additional logic based on the API response here
      }
    );

    this.loaderSubscription = this.phantom_service.loaderResponse$.subscribe(
      (response) => {
        this.loaderResponse = response;
        console.log('here is loder response', this.loaderResponse);
        if (this.loaderResponse) {
          this.loaderResponse = response;
          this.spinner = this.loaderResponse;
        } else {
          this.spinner = this.loaderResponse;
        }
        console.log('API response:', response);
        // You can add additional logic based on the API response here
      }
    );

    this.googleTranslateService.loadGoogleTranslate();
    (window as any).googleTranslateService = this.googleTranslateService;

    this.is_connect = sessionStorage.getItem('is_connect');
    this.routerUrl = this.router.url.replace('/', '');
    this.loggedIn = sessionStorage.getItem('loggedIn');
    // sessionStorage.setItem('is_accredit_user', this.is_accredit_user);
    // this.paramId = this.route.snapshot.paramMap.get('id')
    this.routerUrl = this.router.url.replace('/', '');

    if (this.transactionNetwork == 'test_net') {
      this.connection = new Connection('https://api.devnet.solana.com');
    } else {
      // this.connection = new Connection('https://api.mainnet-beta.solana.com');
      // this.connection = new Connection('https://solana-mainnet.core.chainstack.com/bf485f0493438a47ed964ec8f5ed7ea8');
    }
    this.user_sol_wallet = sessionStorage.getItem('user_sol_wallet');

    // this.connectPhantomWallet()
    // if (this.c == 0) {
    //   this.reloadPage();
    // }
    this.phantom_service.getWalletAddress().subscribe((address) => {
      this.user_sol_wallet = address;
    });
    this.phantom_service.getUserBal().subscribe((bal) => {
      this.user_sol_wallet_balance = bal;
    });

    this.user_sol_wallet_balance = sessionStorage.getItem(
      'user_sol_wallet_balance'
    );

    //  this.navigate_to_this_page_params('');
    //this.reloadPage();
    // window.onscroll = () => {
    //   if (this.initVideo.nativeElement.paused) {
    //     this.initVideo.nativeElement.play();
    //   }
    // }
  }

  navigate_to_this_page_params(thispageurl: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([thispageurl]));
  }
  reloadPage() {
    console.log('page relodad get called=================>');
    let timeoutID = setTimeout(function () {
      window.location.reload();
    }, 4000);

    clearTimeout(timeoutID);
  }

  ngOnDestroy(): void {
    if (this.apiResponseSubscription) {
      this.apiResponseSubscription.unsubscribe();
      this.loaderSubscription.unsubscribe();
    }

    if (this.additionalTimeSubscription) {
      this.additionalTimeSubscription.unsubscribe();
    }
  }
  public round_info: any;
  public next_round: any;
  public c: number = 0;

  closWalletSelectionModal() {
    this.wallets_selection_modal?.nativeElement?.click();
  }

  stakePage() {
    this.router.navigate(['/stake']);
  }

  async switchNet(active_chain: string) {
    if (this.currentAccount) {
      const { chain } = getNetwork();

      console.log('chain::', chain);
      let id = chain?.id;

      console.log('chain::', id);

      if (this.transactionNetwork == 'main_net') {
        let network;
        if (active_chain == 'bsc') {
          network = await switchNetwork({
            chainId: 56,
          });
        } else if (active_chain == 'eth') {
          network = await switchNetwork({
            chainId: 1,
          });
        }

        console.log('network****', network);
      } else {
        let network;
        if (active_chain == 'bsc') {
          network = await switchNetwork({
            chainId: 97,
          });
        } else if (active_chain == 'eth') {
          network = await switchNetwork({
            chainId: 11155111,
          });
        }
      }
    }
  }

  async revealInfo() {
    try {
      const accounts = getAccount();
      let { status, isConnected, isDisconnected } = accounts;
      if (accounts.address != undefined && isConnected) {
        this.currentAccount = accounts.address;
        console.log('current Address', this.currentAccount);
        sessionStorage.setItem('address', this.currentAccount);

        this.userWalletFormGroup.patchValue({
          evm_wallet: this.currentAccount,
        });
        this.currentAccount = sessionStorage.getItem('address');
      } else {
        if (isConnected == false) {
          this.disconnectWallet();
        }
      }
    } catch (error) {
      console.log('Error occured in Reavel::::i.e', error);
    }
  }

  is_phantom: boolean = false;
  is_wallet_connect: boolean = false;
  openWalletModal() {
    this.wallets_selection_modal?.nativeElement?.click();
  }
  disconnectWallet() {
    if (this.currentAccount) {
      disconnect()
        .then((res) => {
          console.log('disconnect result', res);

          const address = sessionStorage.getItem('address');

          if (address) {
            sessionStorage.removeItem('address');

            this.currentAccount = '';
            this.toaster.success('wallet disconnected');
          }
        })
        .catch((err: any) => {
          console.log('érror in disconnection', err);
        });
    }
  }

  openWallets(wallet: string) {
    this.wallets_selection_modal?.nativeElement?.click();
    if (wallet == 'walletConnect') {
      this.web3modal.openModal();
    } else {
      this.connectPhantomWallet();
    }
  }

  ngAfterViewInit(): void {
    const videoElements =
      this.elRef?.nativeElement?.querySelectorAll('.init_video');

    videoElements.forEach((videoElement: HTMLVideoElement) => {
      this.setupVideo(videoElement);
    });

    this.user = sessionStorage.getItem('user');
    this.currentAccount = sessionStorage.getItem('address');
  }

  setupVideo(videoElement: HTMLVideoElement) {
    // Ensure the video is muted to allow autoplay
    videoElement.muted = true;
    videoElement.autoplay = true;

    const promise = videoElement.play();

    if (promise !== undefined) {
      promise
        .then(() => {
          // Autoplay started
          setTimeout(() => {
            videoElement.muted = true; // Unmute after a delay
            videoElement.volume = 1;
          }, 3000);
        })
        .catch((error: any) => {
          // Autoplay was prevented
          console.error('Autoplay was prevented:', error);
          // Keep the video muted and retry playing
          videoElement.muted = true;
          videoElement
            .play()
            .then(() => {
              setTimeout(() => {
                videoElement.muted = true; // Unmute after a delay
                videoElement.volume = 1;
              }, 3000);
            })
            .catch((error: any) => {
              console.error('Retrying play failed:', error);
            });
        });
    }
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('playPauseButton') playPauseButton!: ElementRef;
  @ViewChild('loginModal', { static: false }) login_modal_btn!: ElementRef;

  getWalletAddress(currency: any) {
    const projectId = sessionStorage.getItem('project_id');
    let body = {
      currency: currency,
      project_id: projectId,
    };
    this.getProjectService.getWalletAddresses(body).subscribe(
      (resp: any) => {
        this.walletAddressEncrypted = resp?.data?.wallet_address;
      },
      (err: any) => {
        if (err) {
        }
      }
    );
  }

  connect_evm_wallet() {
    // if (this.currentAccount) {
    this.wallets_selection_modal?.nativeElement?.click();
    // } else {
    //   this.toaster.warning('First Connect EVM Wallet')
    // }
  }

  public user_sol_wallet: string | any = '';

  public user_sol_wallet_bal: string | any;

  // Function to get SPL token balances

  subEmail(sub_form: any) {
    console.log('check sub form', sub_form.value);

    if (sub_form.form.valid) {
      this.getProjectService.projectSubscription(sub_form.value).subscribe(
        (res) => {
          this.toaster.success('Thanks for Subscribing The Utherverse');
        },
        (err: any) => {
          console.log('Some thing Went wrong while Subscribition', err);

          this.toaster.error('Some thing Went wrong while Subscribition');
        }
      );
    } else {
      this.toaster.error('Invalid Form');
    }
  }

  nftPresalePage() {
    this.router.navigate(['/nft-presale']);
  }

  profitLossAmount: number | null = 0;
  profitLossPercentage: number | null = 0;
  total_exit_amount: number | null = 0;
  total_investment: number | null = 0;

  _disconnectWallet() {
    if (this.currentAccount) {
      this.web3modal.openModal();
    } else {
      // sessionStorage.getItem('user')
      sessionStorage.removeItem('user_sol_wallet');
      this.toaster.success('wallet disconnected');
      this.user_sol_wallet = '';
    }
  }

  copyHashToClipboard(data: any) {
    navigator.clipboard.writeText(data);
    this.toastr.success(data, 'Copied Successfully!');
  }

  showWalletDetails: any;
  myGroup: any;
  can_confirm: boolean = false;
  recordToUpdate: any = [];
  async submitWalletAddress() {
    this.showWalletDetails = null;

    let evm = this.userWalletFormGroup.value.evm_wallet;

    let sol = this.userWalletFormGroup.value.solana_wallet;

    const signature = await this.attemptSignMessage(sol);

    if (signature) {
      if (this.userWalletFormGroup.valid) {
        this.publicKey = sol;

        let payload;

        payload = this.cryptoService.encryptData(
          JSON.stringify({
            solana_wallet: sol || '',
            evm_wallet: evm || '',
            signature: signature,
          })
        );

        this.phantom_service.connectWalletAddressForDATA({ payload }).subscribe(
          (res) => {
            document.getElementById('openSearchResult')!.click();
            console.log('Get Data', res);
            const decryptedResponse = JSON.parse(
              this.cryptoService.decryptData(res.payload)
            );

            this.showWalletDetails = decryptedResponse || [];

            this.showWalletDetails.all_unconfirmed_records.forEach(
              (obj: any) => {
                if (!obj.solana_wallet || obj.solana_wallet == this.publicKey) {
                  this.recordToUpdate.push(obj._id);
                  this.can_confirm = true;
                }
              }
            );

            if (this.showWalletDetails.length === 0) {
              this.toastr.error('No data found');
            }
          },
          (error) => {
            console.log('Error', error);
          }
        );
      } else {
        this.toaster.warning(
          `${evm} ? Enter Solana Address : Enter Evm Address`
        );
      }
    }
  }

  statusPayload: any;

  statusAgree(event: any) {
    const payload = event.target.checked;

    this.statusPayload = payload;
  }

  updateVarificationSignature: any;

  async attemptSignMessage(sol_address: string) {
    try {
      return await signMessage({
        message: sol_address,
      });
    } catch (error) {
      if (error.toString().includes('User rejected the request')) {
        this.toaster.warning('Request terminated');
      }
      return false;
    }
  }

  async confirmAgree() {
    let sol = this.userWalletFormGroup.get('solana_wallet')?.value;

    this.updateVarificationSignature = await this.attemptSignMessage(sol);

    if (this.updateVarificationSignature) {
      // Add code to update solana on blockchain
      this.updateSolanaOnBlockChain(sol);
    }
  }

  async updateSolanaOnBlockChain(sol_address: string) {
    try {
      // return console.log({
      //   recordToUpdate: this.recordToUpdate,
      // });
      // return console.log({
      //   sol_address
      // })
      // id
      // this.recordToUpdate
      const { hash } = await writeContract({
        address: '0x0c539f800219e10f7d6e48f6d3f466a0bd6271ed',
        abi: xyzABI,
        functionName: 'updateSolanaWallet',
        args: [this.recordToUpdate, sol_address],
        chainId: 56,
      });

      const _waitForTransaction = await waitForTransaction({
        chainId: 56,
        hash,
      });

      // console.log({
      //   _waitForTransaction,
      // });

      if (_waitForTransaction) {
        this.updateSolanaOnDB();
      } else {
        this.toaster.warning('Unable to update solana on blockchain');
      }
    } catch (error) {
      // console.log({
      //   error,
      // });
      if (error.toString().includes('User rejected the request')) {
        this.toastr.warning('Transaction terminated');
      } else if (
        error.toString().includes('No matching unconfirmed entities')
      ) {
        this.toastr.warning('Not matching entries found.');
      } else {
        this.toastr.error('Something went wrong');
      }
    }
  }

  async updateSolanaOnDB() {
    const payload: any = this.cryptoService.encryptData(
      JSON.stringify({
        confirmed: this.statusPayload,
        recordToUpdate: this.recordToUpdate,
        solana_wallet: this.publicKey,
        evm_wallet: this.currentAccount,
        confirm_by_ip: this.pc_ip,
        signature: this.updateVarificationSignature,
      })
    );

    // console.log('Last Payload::::', payload);

    if (this.showWalletDetails.length < 1) {
      this.toastr.warning('No Records to confirm');
      return;
    }

    let url = `${constants.DOMAIN_URL}update_uthx_token`;

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ payload }),
      headers: {
        'Content-Type': 'application/json',
      },
      // 'Authorization': `Bearer ${currentUser.token}`,
    })
      .then((res) => res.json())
      .then(
        (data) => {
          if (data.success) {
            this.toastr.success(data.message);
          } else {
            this.toastr.info(data.message, 'Unsuccessfull!');
          }
        },
        (error: Error) => {
          this.toastr.error(error.message, 'Unsuccessfull!');
        }
      );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkDeviceType(event.target.innerWidth);
  }

  private checkDeviceType(width: number) {
    this.isMobile = width < this.mobileBreakpoint;
  }

  async connectPhantomWallet() {
    if (this.publicKey) {
      this.publicKey = '';
      this.phantom_service.user_sol_wallet = '';
      this.user_sol_wallet_balance = 0;
      sessionStorage.removeItem('user_sol_wallet');

      this.userWalletFormGroup.patchValue({
        solana_wallet: '',
      });
      this.user_sol_wallet_key = '';
    } else {
      await this.phantom_service.connect();
      await this.phantom_service.checkWalletConnection();
      this.user_sol_wallet_balance = 0;

      this.checkWalletConnection();

      sessionStorage.setItem(
        'user_sol_wallet_balance',
        this.user_sol_wallet_balance
      );

      setTimeout(() => {
        this.user_sol_wallet_balance = sessionStorage.getItem(
          'user_sol_wallet_balance'
        );
      }, 500);
    }
  }

  connectPhantomWalletMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phantomAppLink = 'https://phantom.app/ul/browse/';
    const appStoreLink =
      'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977';
    const playStoreLink =
      'https://play.google.com/store/apps/details?id=app.phantom';

    let solana = window['solana'] && window['solana'].isPhantom;

    if (solana) {
      this.connectPhantomWallet();
      // Desktop or supported environment
      // window['solana']
      //   .connect()
      //   .then((resp) => {
      //     const publicKey = new PublicKey(resp.publicKey.toString());
      //     this.user_sol_wallet = publicKey.toString();
      //     this.userWalletFormGroup.patchValue({
      //       solana_wallet: publicKey,
      //     });
      //     this.publicKey = publicKey.toString();
      //     sessionStorage.setItem('user_sol_wallet', this.user_sol_wallet);
      //     this.toaster.success('Wallet Connected Successfully');
      //     console.log("Shogran", this.user_sol_wallet, this.publicKey, this.userWalletFormGroup.value);

      //     return this.getSolBalance();
      //   })
      //   .then((balance) => {
      //     console.log('User SOL balance:', balance);
      //   })
      //   .catch((err) => {
      //     console.error('Error connecting to Phantom Wallet', err);
      //   });
    } else if (isMobile) {
      // Mobile device handling
      this.toaster.info('Redirecting to Phantom Wallet app...');
      const start = Date.now();

      // Attempt to redirect to the Phantom app
      window.location.href = phantomAppLink;

      // Check if the app opens within a certain timeframe
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          this.toaster.info(
            'Phantom Wallet app not detected. Redirecting to store...'
          );
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            window.location.href = appStoreLink;
          } else if (/Android/.test(navigator.userAgent)) {
            window.location.href = playStoreLink;
          }
        }
      }, 1000);
    } else {
      this.toaster.info('Phantom Wallet not found. Please install it.');
    }
  }

  getSolBalance(): Promise<number> {
    // Placeholder for getting the SOL balance
    return Promise.resolve(0);
  }
}
