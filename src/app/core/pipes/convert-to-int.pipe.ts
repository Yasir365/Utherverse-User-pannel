import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToInt'
})
export class ConvertToIntPipe implements PipeTransform {
  transform(val1: string, val2: string): number {
    console.log('val1:', val1, 'val2:', val2);

    const result = (val1 ? Number(val1) : 0) + (val2 ? Number(val2) : 0);
    console.log('Result:', result);
    return result;
  }
}
