// import { Transaction } from '@solana/web3.js';
interface Solana {
    connect: (args?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: {
      toBase58(): any; toString: () => string 
} }>;
    isPhantom: boolean;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
}

interface Window {
    solana?: Solana,
    Buffer: typeof import('buffer').Buffer;

}


// src/typings.d.ts
// import { Transaction } from '@solana/web3.js';

// interface Solana {
//   connect: (args?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
//   isPhantom: boolean;
//   signTransaction: (transaction: Transaction) => Promise<Transaction>;
// }

// interface Window {
//   solana?: Solana;
// }