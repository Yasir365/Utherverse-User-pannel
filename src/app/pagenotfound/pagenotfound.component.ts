import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-pagenotfound',
  template: `
  <div class="text-center">
    <img src="../../../assets/img/nopage.png">
  </div>
  `,
})
export class PagenotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
