import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export const verifySignature = (message: string, signature: Uint8Array, publicKeyString: string) => {
    try {
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = new Uint8Array(signature);

        const publicKey = new PublicKey(publicKeyString);
        const publicKeyBytes = publicKey.toBytes();

        const isValid = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
        );

        return isValid;
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
};
