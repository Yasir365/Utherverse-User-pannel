import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import constants from 'src/app/constants/constants';
import { LoginService } from 'src/app/services/login.service';
import { ProjectGetService } from 'src/app/services/project-get.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  url = `${constants.DOMAIN_URL}project/getProject/`
  paramId: any;
  projectData: any;
  footerImage: any;
  footerText: any;

  @ViewChild('privacyModal', { static: false }) privacy_modal!: ElementRef;
  @ViewChild('termsModal', { static: false }) terms_modal!: ElementRef;

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private getProjectService: ProjectGetService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    // this.paramId = this.route.snapshot.paramMap.get('id')

    this.paramId = sessionStorage.getItem('project')

    this.getProjectService.getLogoImage().subscribe(resp => {
      this.footerImage = resp.footerImg;
      this.footerText = resp.footerText;
    });


  }

  subscriptionEmail: any
  subscribeProject(email: any) {
    let body = {
      email: email,
      project_id: sessionStorage.getItem('project_id')
    }
    this.getProjectService.projectSubscription(body).subscribe((resp: any) => {
      if (resp.success == true) {
        this.toastr.success(resp.message)
        this.subscriptionEmail = ''
      }
    }, (error) => {
      if (error.error.message) {
        this.toastr.error(error.error.message)
      }
      else {
        this.toastr.error("Subscription error")
      }
    })
  }

  subscribeProjectUpdate() {
    {
      let body = {
        email: this.subscriptionEmail,
        project_id: sessionStorage.getItem('project_id')
      }
      this.getProjectService.projectSubscription(body).subscribe((resp: any) => {
        if (resp.success == true) {
          this.toastr.success(resp.message)
          this.subscriptionEmail = ''
        }
      }, (error) => {
        if (error.error.message) {
          this.toastr.error(error.error.message)
        }
        else {
          this.toastr.error("Subscription error")
        }
      })
    }

  }

  openPrivacyModal() {
    this.privacy_modal.nativeElement.click();
  }

  openTermsModal() {
    this.terms_modal.nativeElement.click();
  }

  closePrivacyModal() {
    this.privacy_modal.nativeElement.click();
  }
  closeTermsModal() {
    this.terms_modal.nativeElement.click();
  }




}
