import { IfStmt } from '@angular/compiler';
import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error, log } from 'console';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, single } from 'rxjs';
import constants from 'src/app/constants/constants';
import { LoginService } from 'src/app/services/login.service';
import { ProjectGetService } from 'src/app/services/project-get.service';
import { PublicService } from 'src/app/services/public/public.service';
import { on } from 'stream';
import codes from '../../assets/codes.json';
import { ConfirmPasswordValidator } from '../core/validators/confirm-password.validator';
import { WalletAddressValidator } from '../core/validators/confirm-password.validator';
// import { ReCaptchaV3Service } from 'ng-recaptcha';
// import { RecaptchaService } from 'src/app/services/public/recaptcha.service';

// declare global {
//   interface Window {
//     BlockpassKYCConnect: any;
//   }
// }

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit, AfterViewInit {
  url = `${constants.DOMAIN_URL}project/getProject/`
  projectSlug: any;
  paramId: any;
  loggedIn: any;
  logoImage: any;
  isRefferralTrue: boolean;
  logoutProject: any;
  routerUrl: any;
  blockpass: any;
  facebookLink: any;
  instagramLink: any;
  linkedinLink: any;
  telegramLink: any;
  twitterLink: any;
  youtubeLink: any;
  discordLink: any;

  country: any;
  investorCheck: boolean = false;
  accreditChecked: boolean = true;
  verified: boolean = false;
  investorLink: boolean = false;
  customerId: any
  messageOTP: any
  uploadAccredit: boolean = false;
  otpVerified: boolean = false;
  accreditFile: any
  messageAccreditFile: boolean = false;

  otp_not_verified: boolean = false;
  document_not_submitted: boolean = false;
  document_not_approved: boolean = false;
  kyc_not_approved: boolean;
  VerifyOTPAfterLogin: boolean = false;
  verifyOTPAfterLoginMessage: boolean = false;
  customer_type: any;
  countryCodes: any;
  loading: boolean = false;
  loginMessageAfterAccredit: boolean = false;
  tipShow: boolean = false;
  state: any;
  states: any;
  cities: any[] = [];
  hideState: boolean = false;
  hideCity: boolean = false;
  currentCity: any;
  spinner: boolean = false;
  textInput: string | any = '';
  @ViewChild('otpModal', { static: false }) OTP_modal!: ElementRef;
  @ViewChild('registerModal', { static: false }) register_modal!: ElementRef;
  @ViewChild('loginModal', { static: false }) login_modal!: ElementRef;
  @ViewChild('docLoginModal', { static: false }) doc_login_modal!: ElementRef;
  @ViewChild('otpLoginModal', { static: false }) otp_login_modal!: ElementRef;
  @ViewChild('tokenModal', { static: false }) token_modal!: ElementRef;
  @ViewChild('herosection', { static: false }) herosection!: ElementRef;
  @ViewChild('helpDeskModal', { static: false }) help_desk_modal!: ElementRef;
  // @ViewChild('connect', { static: false }) connect_blockpass!: ElementRef;


  signupForm !: FormGroup
  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private getProjectService: ProjectGetService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private publicService: PublicService,
    // private captchaService: RecaptchaService,
    // private recaptchaV3Service: ReCaptchaV3Service,

  ) {

    this.signupForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      wallet_address: new FormControl('', [Validators.required, this.customValidator()])
    }
    );

  }
  customValidator(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const value: string = control.value || '';
      const regex = /^0x[a-fA-F0-9]{38,40}$/;
      console.log("Wallet address value", value);
      console.log('test', regex.test(value));
      if (!regex.test(value)) {
        return { customValidation: true }

      } else {
        return null
      }

    }
  }

  ngOnInit(): void {
    // this.getOtpStatus();
    this.loggedIn = sessionStorage.getItem('loggedIn');
    // this.paramId = this.route.snapshot.paramMap.get('id')
    this.routerUrl = this.router.url.replace('/', '')
    // console.log('here is router url', this.routerUrl)
    // this.paramId = this.getProjectService.getProjectName();
    this.paramId = sessionStorage.getItem('project')
    this.getProjectService.getLogoImage().subscribe(resp => {
      // console.log('resp of getProejct service',resp)
      this.logoImage = resp.logoImg;
      this.facebookLink = resp.facebookLink;
      this.instagramLink = resp.instagramLink;
      this.linkedinLink = resp.linkedinLink;
      this.twitterLink = resp.twitterLink;
      this.youtubeLink = resp.youtubeLink;
      this.telegramLink = resp.telegramLink;
      this.discordLink = resp.discordLink;
    });
    this.getVerifiedStatuses()
    this.getAllCountries();
  }
  otpStatus: any;
  getOtpStatus() {
    this.publicService._getStatus().subscribe((res: any) => {
      this.otpStatus = res.data
    })
  }

  ngAfterViewInit(): void {
    // const user = JSON.parse(sessionStorage.getItem('user'));
    // this.blockpass = new window.BlockpassKYCConnect('utherverse_ido_tge_3ec14', {
    //   env: 'prod',
    //   refId: user?.customer?._id,
    //   elementId: 'blockpass-kyc-connect',
    //   email: 'fakhirashfaq@vizzwebsolutions.com',
    // })
    // this.blockpass.startKYCConnect();
    // console.log(this.blockpass)
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });


  getLoginEmailErrors() {

    if (this.loginForm.get('email').errors['required']) {
      return 'This field is required';
    }
    if (this.loginForm.get('email').errors['email']) {
      return 'Email Field invalid';
    }

    return '';
  }

  getLoginPasswordErrors() {
    if (this.loginForm.get('password').errors['required']) {
      return 'This field is required';
    }
    if (this.loginForm.get('password').errors['minlength']) {
      return 'Password must contain more than 8 characters';
    }

    return '';
  }

  getSignupEmailErrors() {
    if (this.signupForm.get('email').errors['required']) {
      return 'This field is required';
    }
    if (this.signupForm.get('email').errors['email']) {
      return 'Email Field invalid';
    }

    return '';
  }
  getWalletAddressErrors() {
    console.log('getWalletaddress called now', this.signupForm.get('wallet_address').errors.not_valid_address);
    if (this.signupForm.get('wallet_address').errors['required']) {
      return 'This field is required';
    }
    if (this.signupForm.get('wallet_address').errors.not_valid_address) {

      return "Not a valid wallet address"
    }
    return '';

  }

  getSignupPasswordErrors() {
    if (this.signupForm.get('password').errors['required']) {
      return 'This field is required';
    }
    // if (this.signupForm.get('password').errors['minlength']) {
    //   return 'Password must contain more than 8 characters';
    // }
    // if (this.signupForm.get('password').errors['pattern']) {
    //   return this.signupForm.get('password').errors['pattern'] && 'Password requires special characters and alphanumeric entries'
    // }
    return '';
  }

  getSignupconfirmPasswordErrors() {
    if (this.signupForm.get('confirmPassword').errors['required']) {
      return 'This field is required';
    }
    if (this.signupForm.get('confirmPassword').errors.confirmPasswordValidator) {
      return 'Passwords not match';
    }
    return '';
  }

  getSignupAddressErrors() {
    if (this.signupForm.get('address').errors['required']) {
      return 'This field is required';
    }
    return '';
  }

  getSignupPhoneErrors() {
    if (this.signupForm.get('phone_no').errors['required']) {
      return 'Phone number is required';
    }
    if (this.signupForm.get('phone_no').errors['pattern']) {
      return this.signupForm.get('phone_no').errors['pattern'] && 'Phone number required at least 1 digit (No spaces or  hyphens)'
    }

    return ''
  }

  getSignupCityErrors() {
    if (this.signupForm.get('city').errors['required']) {
      return 'This field is required';
    }
    return '';
  }

  getSignupStateErrors() {
    if (this.signupForm.get('state').errors['required']) {
      return 'This field is required';
    }
    return '';
  }

  getSignupZipCodeErrors() {
    if (this.signupForm.get('zip_code').errors['required']) {
      return 'This field is required';
    }
    return '';
  }

  loginCustomer() {

    console.log("login data", this.loginForm.value);
    this.loginService.login(this.loginForm.value).subscribe((data: any) => {
      console.log("resp of login serverise", data);

      if (data.success === true) {
        sessionStorage.setItem('loggedIn', 'true')
        const { token, customer, ...others } = data;
        sessionStorage.setItem('user_token', token);
        console.log("check wallet", customer.wallet_address);

        sessionStorage.setItem('customer_wallet', customer.wallet_address)
        this.loginService.setLoggedIn(true);
        sessionStorage.setItem(
          'user',
          JSON.stringify({ token: token, customer: customer })
        );
        sessionStorage.setItem(
          'projectID',
          JSON.stringify(data.customer.project_id)
        );
        this.toastr.success(`Welcome ${data.customer.first_name}`);
        window.location.href = 'customer/dashboard';
        // this.router.navigateByUrl('customer/dashboard')
        this.login_modal.nativeElement.click();
        this.loginForm.reset();
        // this.loginService.setLoginChecks(this.OTPemailverified, this.OTPphonelverified, this.documentSubmited, this.documentApproved, this.KYCVerified)

      }
    }, (error) => {
      if (error.ok == false) {
        // this.toastr.error('User not exist');
        this.toastr.error(`${error.error.message}`)
        if (error.status == 422) {
          this.toastr.error('Invalid Email Or Password')
        }
        else {

          this.toastr.error(`${error.error.message}`)
        }
      }
    });

  }
  getVerifiedStatuses() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    let body = {
      customer_id: user?.customer._id
    }
    if (user !== null) {
      this.loginService.checkVerifiedStatuses(body).subscribe((resp: any) => {
        console.log(resp)
        if (resp?.success == true) {
          if (user?.customer?.customer_type == "ACCREDITED") {
            if (resp?.data?.isEmailVerified == false && resp?.data?.isPhoneVerified == false) {
              this.otp_not_verified = true;
              this.document_not_submitted = false;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified) {
              this.otp_not_verified = false;
              this.document_not_submitted = true;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified && resp?.data?.is_accredited_paper_submitted && resp?.data?.accredited_document_status == "REJECTED") {
              this.otp_not_verified = false;
              this.document_not_submitted = true;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified && resp?.data?.is_accredited_paper_submitted && resp?.data?.accredited_document_status == "PENDING") {
              this.otp_not_verified = false;
              this.document_not_submitted = false;
              this.document_not_approved = true;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified && resp?.data?.is_accredited_paper_submitted && resp?.data?.isAccreditedApproved) {
              this.otp_not_verified = false;
              this.document_not_submitted = false;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            // if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified && resp?.data?.is_accredited_paper_submitted && resp?.data?.isAccreditedApproved && resp?.data?.isKycApproved) {
            if (resp?.data?.isEmailVerified && resp?.data?.isPhoneVerified && resp?.data?.isKycApproved) {
              this.otp_not_verified = false;
              this.document_not_submitted = false;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
          }
          else {
            if (!resp?.data?.isKycApproved) {
              this.otp_not_verified = false;
              this.document_not_submitted = false;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
            else {
              this.otp_not_verified = false;
              this.document_not_submitted = false;
              this.document_not_approved = false;
              this.kyc_not_approved = resp?.data.isKycApproved;
            }
          }
        }
      })
    }


    // if (user?.customer?.customer_type == "ACCREDITED") {
    //   if (user.customer.isEmailVerified == false && user.customer.isPhoneVerified == false) {
    //     this.otp_not_verified = true;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = false;
    //   }
    //   if (user.customer.isEmailVerified && user.customer.isPhoneVerified) {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = true;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = false;
    //   }
    //   if (user.customer.isEmailVerified && user.customer.isPhoneVerified && user.customer.is_accredited_paper_submitted) {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = true;
    //     this.kyc_not_approved = false;
    //   }
    //   if (user.customer.isEmailVerified && user.customer.isPhoneVerified && user.customer.is_accredited_paper_submitted && user.customer.isAccreditedApproved) {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = true;
    //   }
    //   if (user.customer.isEmailVerified && user.customer.isPhoneVerified && user.customer.is_accredited_paper_submitted && user.customer.isAccreditedApproved && user.customer.isKycApproved) {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = false;
    //   }
    // }
    // else {
    //   if (!user.customer.isKycApproved) {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = true;
    //   }
    //   else {
    //     this.otp_not_verified = false;
    //     this.document_not_submitted = false;
    //     this.document_not_approved = false;
    //     this.kyc_not_approved = false;
    //   }
    // }
  }


  selectCountry(country: any) {
    console.log(country.value)
    this.country = country.value
    this.getStateByCountry(this.country)
    if (this.country === "Canada") {
      this.investorCheck = true;
    }
    // else if (this.country === "United_States") {
    else if (this.country === "United States") {
      this.investorCheck = true;
    }
    else {
      this.investorCheck = false;
    }
  }

  selectState(state: any) {
    this.state = state?.value
    console.log(this.state)
    this.getCitiesByState(this.state);
  }

  selectCity(city: any) {
    console.log(city.value)
    this.signupForm.controls.city.patchValue(city.value)
    this.currentCity = city.value;
  }

  getAllCountries() {
    this.getProjectService.getAllCountriesAndDialCodes().subscribe((res: any) => {

      this.hideState = false;
      this.hideCity = false;
      this.countryCodes = res?.data.filter((country: any) => country.name !== 'Canada' && country.name !== "United States");
    });
  }

  getStateByCountry(country: any) {
    this.hideState = false
    this.hideCity = false
    let body = {
      country: country
    }
    this.getProjectService.getStateByCountry(body).subscribe((resp: any) => {
      console.log(resp);
      this.states = resp?.data?.states;
      if (this.states == null || this.states == undefined || this.states == '' || this.states.length == 0) {
        this.toastr.warning('The selected country did not contains any state. Select Other.')
        console.log('enter')
        this.getCitiesByCountry(country)
      }
    }, (err) => {
      console.log(err);
      this.hideState = true;
      this.hideCity = true;
      this.toastr.warning('Country not found', '');
    });
  }

  getCitiesByState(state: any) {
    this.hideState = false
    let body = {
      country: this.country,
      state: state
    }
    this.getProjectService.getCitiesByState(body).subscribe((resp: any) => {
      console.log(resp);
      this.cities = resp?.data;
      if (state == 'Norfolk') {
        let tempCities = ['Norwich', 'Kings Lynn', 'Thetford', 'Gorleston', 'Taverham', 'Dereham']
        tempCities.map(eachCity => {
          this.cities.push(eachCity)
        })
      }
      else if (this.cities.length == undefined || this.cities.length == 0) {
        this.toastr.warning('Did not found any city.Select Other  state.')
      }
    });
  }

  getCitiesByCountry(country: any) {
    let body = {
      country: country
    }

    this.getProjectService.getCitiesByCountry(body).subscribe((resp: any) => {
      console.log(resp)
      this.cities = resp?.data;
      this.hideState = true
    })
  }

  sendOTP() {
    let projectID = sessionStorage.getItem('project_id')
    const user = JSON.parse(sessionStorage.getItem('user'));
    let body = {
      email: this.signupForm.value.email,
      phone_no: this.signupForm.value.phone_no,
      country: this.country,
      project_id: projectID,
      customer_id: user.customer._id
    }
    this.loginService.sendOTP(body).subscribe((resp: any) => {
      if (resp.success == true) {
        // this.messageOTP = "Code has been sent to Phone & Email Please Verify";
        this.toastr.success('Code has been sent to Phone & Email Please Verify')
        this.customerId = resp.customer._id;
        // setTimeout(() => {
        //   this.OTP_modal.nativeElement.click();
        // }, 3000);
      }
      else {
        this.toastr.error("Please Try Again!")
      }
    });
  }


  sendOTPAfterLogin() {
    let projectID = sessionStorage.getItem('project_id')
    const user = JSON.parse(sessionStorage.getItem('user'));
    let body = {
      email: user.customer.email,
      phone_no: user.customer.phone_no,
      country: user.customer.country,
      project_id: projectID,
      customer_id: user.customer._id
    }
    this.loginService.sendOTP(body).subscribe((resp: any) => {
      if (resp.success == true) {
        // this.messageOTP = "Code has been sent to Phone & Email Please Verify";
        this.toastr.success('Code has been sent to Phone & Email Please Verify')
        this.customerId = resp.customer._id;
        this.VerifyOTPAfterLogin = true
        setTimeout(() => {
          this.otp_login_modal.nativeElement.click();
        }, 500);
      }
    }, (error) => {
      this.toastr.error("Please Try Again!")
    });
  }


  verifyOTP(emailcode: any, phonecode: any) {

    var regex = new RegExp('^((?!(0))[0-9])')
    if (regex.test(emailcode) && emailcode.match(/\D/) == null) {
      let body = {
        customer_id: this.customerId,
        email_otp: emailcode,
        phone_otp_code: phonecode
      }

      const { phone_otp_code, ...others } = body
      if (this.otpStatus !== 'disabled') {
        this.loginService.verifyCustomer(body).subscribe((resp: any) => {
          if (resp.success == true) {
            window.location.reload()
            // this.toastr.success("OTP Verified, Please submit your accredit investor document")
            this.toastr.success("OTP Verified,Registration is successful")

            // this.otpVerified = true;
          }
        }, (error) => {
          this.toastr.error("OTP not verified")
        });
      } else {
        this.loginService.verifyCustomer(others).subscribe((resp: any) => {
          if (resp.success == true) {
            window.location.reload()
            // this.toastr.success("OTP Verified, Please submit your accredit investor document")
            this.toastr.success("OTP Verified,Registration is successful")

            // this.otpVerified = true;
          }
        }, (error) => {
          this.toastr.error("OTP not verified")
        });
      }

    }
    else {
      this.toastr.error('Invalid OTP')
    }
  }


  verifyOTPAfterLogin(emailcode: any, phonecode: any) {
    var regex = new RegExp('^((?!(0))[0-9])')

    if (regex.test(emailcode) && emailcode.match(/\D/) == null) {

      const user = JSON.parse(sessionStorage.getItem('user'));
      let body = {
        customer_id: user.customer._id,
        email_otp: emailcode,
        phone_otp_code: phonecode
      }
      const { phone_otp_code, ...others } = body
      if (this.otpStatus !== 'disabled') {
        this.loginService.verifyCustomer(body).subscribe((resp: any) => {
          if (resp.success == true) {
            this.toastr.success("OTP Verified, Please submit your accredit investor document here")
            this.otp_not_verified = false;
            this.document_not_submitted = true;
            this.verifyOTPAfterLoginMessage = true;
            setTimeout(() => {
              this.token_modal.nativeElement.click();
            }, 500);
          }
        }, (error) => {
          this.toastr.error("OTP not verified")
        });
      } else {
        this.loginService.verifyCustomer(others).subscribe((resp: any) => {
          if (resp.success == true) {
            this.toastr.success("OTP Verified, Please submit your accredit investor document here")
            this.otp_not_verified = false;
            this.document_not_submitted = true;
            this.verifyOTPAfterLoginMessage = true;
            setTimeout(() => {
              this.token_modal.nativeElement.click();
            }, 500);
          }
        }, (error) => {
          this.toastr.error("OTP not verified")
        });
      }
    }
    else {
      this.toastr.error("Invalid OTP")
    }
  }

  flagLul: boolean = false;
  selectAccreditedPaper(event: any) {
    this.accreditFile = <File>event.target.files[0];
    this.accreditFile ? this.flagLul = true : this.flagLul = false
    console.log(this.accreditFile);
  }

  uploadAccreditedPaper() {
    var file = new FormData();
    file.append('userFile', this.accreditFile, this.accreditFile?.name);
    if (this.customerId == null || this.customerId == '') {
      const user = JSON.parse(sessionStorage.getItem('user'));
      this.customerId = user.customer._id
    }
    if (this.accreditFile) {
      this.loading = true;
      this.loginService.uploadAccreditedDoc(file, this.customerId).subscribe((resp: any) => {
        if (resp.success == true) {
          this.messageAccreditFile = true;
          this.loading = false;
          this.loginMessageAfterAccredit = true;
        }
        else {
          this.messageAccreditFile = false;
          this.loading = false;
          this.toastr.error("Can't send file");
        }
      });
    } else {
      this.toastr.warning('Kinldy Upload A Document', 'Error')
    }
  }

  uploadAccreditedPaperAfterLogin() {
    var file = new FormData();
    // console.log("ye file ha =========>",file);
    // console.log(this.accreditFile);
    if (this.customerId == null || this.customerId == '') {
      const user = JSON.parse(sessionStorage.getItem('user'));
      this.customerId = user.customer._id
    }
    if (this.accreditFile) {
      this.loading = true;

      file.append('userFile', this.accreditFile, this.accreditFile?.name);
      this.loginService.uploadAccreditedDoc(file, this.customerId).subscribe((resp: any) => {
        if (resp.success == true) {
          this.messageAccreditFile = true;
          this.loading = false;
        }
        else {
          this.messageAccreditFile = false;
          this.loading = false;
          this.toastr.error("Can't send file");
        }
      });
    } else {
      this.toastr.warning('Kinldy Upload A Document', 'Error')
    }
  }

  reserveToken(token: any) {

    if (token > 0) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (this.customerId == '' || this.customerId == null) {
        this.customerId = user.customer._id
      }

      let projectID = sessionStorage.getItem('project_id')
      let body = {
        reserved_token: token,
        customer_id: this.customerId,
        project_id: projectID,
      }

      this.loginService.reserveToken(body).subscribe((resp: any) => {
        if (resp.success == true) {
          this.toastr.success("Your Tokens has been reserved")
          this.signupForm.reset();
          this.investorLink = true
        }
      }, (error) => {
        if (error.error.message) {
          this.toastr.error(`${error.error.message}`)
        }
        else {
          this.toastr.error("Your Tokens has not been reserved")
        }

      })
    }
    else {
      this.toastr.error('Token should be greater then 0');
    }
  }

  checkDocAndTokens() {

    const user = JSON.parse(sessionStorage.getItem('user'));
    let body = {
      customer_id: user?.customer._id
    }
    if (user !== null) {
      this.loginService.checkVerifiedStatuses(body).subscribe((resp: any) => {
        if (resp?.data?.is_token_reserved == true) {
          this.doc_login_modal.nativeElement.click();
          // this.document_not_approved = true;
        }
        else {
          this.token_modal.nativeElement.click();
          this.toastr.error("Please reserve tokens first")
        }
      })
    }

    // const user = JSON.parse(sessionStorage.getItem('user'));
    // if(user.customer.is_token_reserved == true)
    // {
    //   this.doc_login_modal.nativeElement.click();
    //   this.document_not_approved = true;
    // }
    // else
    // {
    //   this.token_modal.nativeElement.click();
    //   this.toastr.error("Please reserve tokens first")
    // }
  }

  reserveTokenAfterLogin(token: any) {

    if (token > 0) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (this.customerId == '' || this.customerId == null) {
        this.customerId = user.customer._id
      }

      let projectID = sessionStorage.getItem('project_id')
      let body = {
        reserved_token: token,
        customer_id: this.customerId,
        project_id: projectID,
      }

      this.loginService.reserveToken(body).subscribe((resp: any) => {
        if (resp.success == true) {
          this.toastr.success("Your Tokens has been reserved")
          setTimeout(() => {
            this.doc_login_modal.nativeElement.click();
          }, 300)
          // this.document_not_submitted = false;
          // this.document_not_approved = true;
        }
      }, (error) => {
        if (error.error.message) {
          this.toastr.error(`${error.error.message}`)
        }
        else {
          this.toastr.error("Your Tokens has not been reserved")
        }
      })
    }
    else {
      this.toastr.error('Token should be greater then 0')
    }
  }

  showTokenPopup() {
    console.log('hit')
    // this.uploadAccredit = true;
    setTimeout(() => {
      this.OTP_modal.nativeElement.click();
    }, 1000);

  }

  showTokenPopupAfterLogin() {
    console.log('hitted')
    // this.uploadAccredit = true;
    this.document_not_submitted = false;
    this.document_not_approved = true;
    setTimeout(() => {
      this.doc_login_modal.nativeElement.click();
    }, 500);
  }

  signupCustomer() {
    this.isRefferralTrue = this.loginService.isRefferralTrue;
    if (this.isRefferralTrue) {
      if (this.signupForm.valid) {
        this.signupForm.get('wallet_address').setValue(this.textInput);
        console.log('user data', this.signupForm.value);
        this.loginService.registerWithRefferal(this.signupForm.value).subscribe(
          (resp: any) => {
            this.signupForm.reset();
            console.log('here is the resp', resp);
            this.register_modal.nativeElement.click();
            this.toastr.success("You're registration is successful.", "You will receive an email with login credentials");
            this.signupForm.reset();
          },
          (error) => {
            this.textInput = '';
            this.spinner = false;
            this.toastr.error("Error", error.error.message);
            this.loginForm.reset();
            console.log('SOME THING WEND WERONG CHECK ERROR', error);
          }
        )
      }
      else {
        this.spinner = false;
        this.toastr.error('Invalid  Form. Please Try Again', "Invalid");
        this.register_modal.nativeElement.click();
      }

    }
    else {
      if (this.signupForm.valid) {
        this.signupForm.get('wallet_address').setValue(this.textInput);
        console.log('user data', this.signupForm.value);
        this.spinner = true;
        this.loginService.register(this.signupForm.value).subscribe(
          (resp: any) => {
            this.spinner = false;
            this.textInput = '';
            this.signupForm.reset();
            console.log('here is the resp', resp);
            this.register_modal.nativeElement.click();
            this.toastr.success("You're registration is successful.", "You will receive an email with login credentials");
            this.signupForm.reset();
          },
          (error) => {
            this.textInput = '';
            this.spinner = false;
            this.toastr.error("Error", error.error.message);
            this.loginForm.reset();
            console.log('SOME THING WEND WERONG CHECK ERROR', error);
          }
        )
      }
      else {
        this.spinner = false;
        this.toastr.error('Invalid  Form. Please Try Again', "Invalid");
        this.register_modal.nativeElement.click();
      }
    }
    // this.isRefferralTrue = this.loginService.isRefferralTrue;
    // const user = JSON.parse(sessionStorage.getItem('user'));
    // if(this.customerId == '' || this.customerId == null)
    // {
    //   this.customerId = user.customer._id
    // }
    //this.customerId;
    // this.signupForm.value.customer_id = this.customerId;
    // this.signupForm.value.city = this.currentCity
    // this.signupForm.value.state = this.state;
    // console.log(this.signupForm.value);
    // console.log('check vlidity of form',);

    // else {
    //   console.log('error in form::::',this.signupForm.errors);

    //   console.log('chekcout the validity',this.signupForm.valid);

    //   this.toastr.error('Signup form is not valid')
    //   Object.keys(this.signupForm.controls).forEach(controlName => {
    //     const control = this.signupForm.get(controlName);

    //     if (control && control.invalid) {
    //       console.log(`Validation errors for ${controlName}:`, control.errors);
    //     }
    //   });
    // }

    // else
    // {
    //   console.log("Are you accredited investor?")
    //   this.OTP_modal.nativeElement.click();
    // }

  }


  logout() {
    // this.router.navigateByUrl('')
    // this.logoutProject = sessionStorage.getItem('project');
    this.logoutProject = '';
    //this.logoutProject = sessionStorage.getItem('current_url');
    this.toastr.success('User logout successfully');
    this.router.navigateByUrl('');
    setTimeout(() => {
      window.location.href = `${this.logoutProject}`;
    }, 700);
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('user_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('projectID');
    sessionStorage.removeItem('short');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('balance');
    sessionStorage.removeItem('KYC');
    sessionStorage.removeItem('isEmailVerified')
    sessionStorage.removeItem('isPhoneVerified')
    sessionStorage.removeItem('is_accredited_paper_submitted')
    sessionStorage.removeItem('isAccreditedApproved')
    sessionStorage.removeItem('isKycApproved')
    // sessionStorage.clear();
  }


  LogoProjectClick() {
    this.projectSlug = sessionStorage.getItem('project');
    window.location.href = constants.UTHERVERSE_URL;
  }

  GoToDashboard(url: any) {
    if (url == 'customer/dashboard') {
      this.projectSlug = sessionStorage.getItem('project');
      let current_url;
      current_url = sessionStorage.getItem('current_url');
      if (current_url) {

        this.router.navigateByUrl(current_url);
      }
      else {
        this.router.navigateByUrl('');
      }
      // window.location.href = constants.UTHERVERSE_URL; 

    }
    else {
      this.router.navigateByUrl('customer/dashboard');
      // window.location.href = `${constants.UTHERVERSE_URL}customer/dashboard`;
    }
  }

  GoTofacebook(link: any) {
    window.open('https://' + link)
  }

  GoToInstagram(link: any) {
    window.open('https://' + link)
  }

  GoToTwitter(link: any) {
    window.open('https://' + link)
  }

  GoToLinkedin(link: any) {
    window.open('https://' + link)
  }

  GoToYoutube(link: any) {
    window.open('https://' + link)
  }

  GoToTelegram(link: any) {
    window.open('https://' + link)
  }

  GoToDiscord(link: any) {
    window.open('https://' + link)
  }

  openAccreditLink() {
    window.open('https://www.verifyinvestor.com/signup?t=investor');
  }


  connectBlockPass() {
    let clientId = constants.KycClientID;
    const user = JSON.parse(sessionStorage.getItem('user'));
    // window.open(`https://identity.blockpass.org/frontend/?clientId=${clientId}&refId=${user?.customer?._id}&email=${user?.customer?.email}#/`) 
    window.open(`https://verify-with.blockpass.org/?clientId=${clientId}&refId=${user?.customer?._id}&email=${user?.customer?.email}#/`);
    setTimeout(() => {
      this.logout();
    }, 1000);
  }


  getVerificationInvestorApi() {
    this.getProjectService.getVerificationInvestor().subscribe((resp: any) => {
      console.log(resp)
    })
  }

  showPasswordTip() {
    if (this.tipShow == false) {
      this.tipShow = true;
    }
    else {
      this.tipShow = false;
    }
  }

  openZoomLink(link: any) {
    window.open(link);
  }

  showErrorMessage: boolean = false;
  openZoom() {
    // let date = new Date();
    // var pstDate = date.toLocaleString("en-US", {
    //   timeZone: "America/Los_Angeles"
    // })
    // let startTime = ""
    // let starttime = "08:00:00"
    // let endtime = "18:00:00"
    // let endtimeSat = "13:00:00"

    // let currentDay = (new Date(Date.now()).getDay());

    // let currentTime = (new Date(Date.now()).getHours())+':'+(new Date(Date.now()).getMinutes())+':'+(new Date(Date.now()).getSeconds())

    // if(currentDay>0 && currentDay < 6){
    //   if(currentTime >= starttime && currentTime <= endtime){

    //     this.showErrorMessage = false;
    //   }else{
    //     this.showErrorMessage = true;
    //   }
    // }
    // if(currentDay==6 || currentDay==7){
    //   if(currentTime >= starttime && currentTime <= endtimeSat){
    //     this.showErrorMessage = false;
    //   }
    //   else
    //   {
    //     this.showErrorMessage = true;
    //   }
    // }

  }

  closeHelpDeskModal() {
    this.help_desk_modal.nativeElement.click();
  }
  onPaste(event: any): void {
    this.textInput = '';
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    this.textInput = pastedText;
    // this.signupForm.controls.wallet_address.patchValue(pastedText);
  }
}
