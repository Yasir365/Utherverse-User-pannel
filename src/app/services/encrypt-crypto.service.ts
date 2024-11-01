import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EncryptCryptoService {


  secretString: any = environment.KEY

  constructor() { }


  encryptData(data: string): string {

    return CryptoJS.AES.encrypt(data, this.secretString).toString();
  }

  decryptData(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretString);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
