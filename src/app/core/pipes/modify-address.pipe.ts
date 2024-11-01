import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifyAddress'
})
export class ModifyAddressPipe implements PipeTransform {

  transform(address: string): unknown {
    return (address.slice(0, 4) + '...' + address.slice(-4));
  }

}
