import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, slice_number: number): string {
    if (!value) return '';
    return value.substring(0, slice_number) + '...' + value.substring(value.length - slice_number);
  }

}
