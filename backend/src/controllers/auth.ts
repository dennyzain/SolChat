import type { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { verifySignature } from "../helper/verifySign";
import jwt from "jsonwebtoken";


const challengeFunction = (req: Request, res: Response) => {
    const { walletAddress } = req.body

    if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
    }

    const challenge = {
        message: `Sign this message to authenticate with SolChat!\nWallet: ${walletAddress}\nTime: ${Date.now()}`,
        nonce: Math.random().toString(36).substring(7)
    };

    res.json({ challenge });
};

const verifyFunction = async (req: Request, res: Response) => {
    const { walletAddress, signature, nonce, message } = req.body

    const secret = process.env.JWT_SECRET ?? "secret";

    if (!walletAddress || !signature || !nonce || !message) {
        return res.status(400).json({ error: `Missing required fields: ${!walletAddress ? "walletAddress" : ""} ${!signature ? "signature" : ""} ${!nonce ? "nonce" : ""} ${!message ? "message" : ""}` });
    }

    const isVerified = verifySignature(message, signature, walletAddress);

    console.log(isVerified, " isVerified");

    if (!isVerified) {
        return res.status(400).json({ error: "Invalid signature" });
    }

    if (isVerified) {
        const token = jwt.sign({ walletAddress }, secret, { expiresIn: "1h" });
        return res.json({ token });
    }

    res.json({ success: true });
};

export { challengeFunction, verifyFunction };