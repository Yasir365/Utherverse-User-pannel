import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noLeadingZero'
})
export class NoLeadingZeroPipe implements PipeTransform {

  transform(value: any, digitsInfo?: string): string {
    let formattedValue
    if (value) {
      formattedValue = value.toString();
      if (formattedValue.startsWith('0.') || formattedValue.startsWith('-0.')) {
        formattedValue = formattedValue.replace('0.', '.').replace('-0.', '-.');
      }
    }

    return formattedValue;
  }
}
