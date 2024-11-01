import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { EncryptCryptoService } from './encrypt-crypto.service';

@Pipe({
  name: 'decryptCrypto'
})
export class DecryptCryptoPipe implements PipeTransform {



  transform(value: any, ...args: unknown[]): unknown {

    if (!value) {
      return ''
    }

    return this.crypto_service.decryptData(value)
  }



  constructor(public crypto_service: EncryptCryptoService) { }



}
