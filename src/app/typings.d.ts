interface Solana {
    connect: (args?: { onlyIfTrusted: boolean }) => Promise<{
        publicKey: {
            toBase58(): any; toString: () => string
        }
    }>;
    isPhantom: boolean;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
}

interface Window {
    solana?: Solana,
    Buffer: typeof import('buffer').Buffer;

}
