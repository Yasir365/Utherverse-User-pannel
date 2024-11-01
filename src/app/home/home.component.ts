import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';



@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [],

})
export class HomeComponent implements OnInit {


  constructor(private toastr: ToastrService,) {
  }

  ngOnInit() {
  }

  copied_msg() {
    navigator.clipboard.writeText('CZhaw3dtiDbXBLjKamco7cF1XwbQfZ2gNddN7UQhF3kD');
    this.toastr.success('Address Copied Successfully', 'Copied');
  }

  subEmail(sub_form: any) {
    console.log('check sub form', sub_form.value);

  }
}