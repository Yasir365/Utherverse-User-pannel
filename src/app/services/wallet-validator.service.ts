import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { PublicKey } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class WalletValidatorService {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3();
  }

  isValidddress(address: string): boolean {
    if (address) {
      if (this.web3.utils.isAddress(address)) {
        return true;
      }
      else {
        try {
          let new_address: PublicKey | any;
          new_address = address;
          console.log('solana', new PublicKey(new_address));
          return true;
        } catch (error) {
          return false
        }
      }

    }
    return false;


  }

  isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch (e) {
      return false;
    }
  }
}
