import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringformation'
})
export class StringformationPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value === null || value === undefined) {
      return '';
    }

    // Convert value to string in case it is not

    let value_in_num = Math.floor(parseInt(value));
    let stringValue = value_in_num.toString();

    // Use regular expression to add commas
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
