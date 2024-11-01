import { Directive } from '@angular/core';
import { ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberComma]'
})
export class NumberCommaDirective {
  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = this.el.nativeElement;
    let inputValue = input.value;

    // Remove commas from the input value
    inputValue = inputValue.replace(/,/g, '');

    // Extract integer and decimal parts
    const [integerPart, decimalPart] = inputValue.split('.');

    // Format integer part with commas if there is no decimal part
    let formattedIntegerPart = integerPart;
    if (!decimalPart) {
      formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      console.log('formattedIntegerPart=========>', formattedIntegerPart);

    }

    // Combine integer and decimal parts
    const formattedValue = decimalPart !== undefined ? `${integerPart}.${decimalPart}` : formattedIntegerPart;

    // Update the input value for display
    input.value = formattedValue;

    // Update the form control value without commas
    this.control.control?.setValue(inputValue);
  }


}
